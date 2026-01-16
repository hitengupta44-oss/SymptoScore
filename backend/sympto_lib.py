import pandas as pd
import os
from sklearn.preprocessing import LabelEncoder
from sklearn.naive_bayes import BernoulliNB
from pgmpy.models import DiscreteBayesianNetwork
from pgmpy.estimators import MaximumLikelihoodEstimator
from pgmpy.inference import VariableElimination

# Global variables to store models and data
df = None
recs = None
diseases = None
disease_features = None
encoders = {}
nb_models = {}
bn_models = {}
bn_infer = {}

def initialize_models():
    """Initialize all models and load data. Call this once at startup."""
    global df, recs, diseases, disease_features, encoders, nb_models, bn_models, bn_infer
    
    # Get the directory where this file is located (backend folder)
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Load data files from backend directory
    disease_file = os.path.join(base_dir, "diseasefinalset.xlsx")
    recs_file = os.path.join(base_dir, "recommendationsdoc_precise_detailed.xlsx")
    
    if not os.path.exists(disease_file):
        raise FileNotFoundError(f"Data file not found: {disease_file}")
    if not os.path.exists(recs_file):
        raise FileNotFoundError(f"Recommendations file not found: {recs_file}")
    
    df = pd.read_excel(disease_file)
    recs = pd.read_excel(recs_file)
    
    diseases = ["Diabetes","HeartDisease","Hypertension","CKD","Asthma","Dyslipidemia","Anemia"]
    
    disease_features = {
        "Diabetes":["SugarLevel","FrequentUrination","ExcessiveThirst","FamilyHistoryDiabetes","WeightLoss","Fatigue"],
        "HeartDisease":["ChestPain","BloodPressure","Smoking","FamilyHistoryHeart","Alcohol"],
        "Hypertension":["BloodPressure","SaltIntake","StressLevel","Headache","PhysicalActivity"],
        "CKD":["SwellingAnkles","FrequentUrination","Fatigue","BloodPressure","PaleSkin"],
        "Asthma":["Wheezing","Breathlessness","Cough","Smoking","Fatigue"],
        "Dyslipidemia":["DietQuality","PhysicalActivity","Smoking","Alcohol","BloodPressure","StressLevel"],
        "Anemia":["PaleSkin","Fatigue","WeightLoss","Dizziness","LossOfAppetite"]
    }
    
    # ================= ENCODING =================
    encoders = {}
    for col in df.columns:
        if df[col].dtype == object:
            le = LabelEncoder()
            df[col] = le.fit_transform(df[col])
            encoders[col] = le
    
    # ================= AGE GROUP =================
    df["AgeGroup"] = pd.cut(df["Age"], bins=[0,30,45,60,120],
                          labels=["Young","Adult","Middle","Senior"])
    
    le_age = LabelEncoder()
    df["AgeGroup"] = le_age.fit_transform(df["AgeGroup"].astype(str))
    encoders["AgeGroup"] = le_age
    
    # ================= NAIVE BAYES =================
    nb_models = {}
    for d in diseases:
        X = df[disease_features[d]]
        y = df[d]
        nb = BernoulliNB()
        nb.fit(X, y)
        nb_models[d] = nb
    
    # ================= BAYESIAN NETWORK =================
    bn_models = {}
    bn_infer = {}
    for d in diseases:
        feats = ["AgeGroup"] + disease_features[d]
        data = df[feats + [d]]
        
        edges = [(f, d) for f in feats]
        model = DiscreteBayesianNetwork(edges)
        model.fit(data, estimator=MaximumLikelihoodEstimator)
        bn_models[d] = model
        bn_infer[d] = VariableElimination(model)

def get_questions():
    """Get all questions with their options for the form."""
    questions = {}
    all_features = sorted(set(sum(disease_features.values(), [])))
    
    for col in all_features:
        if col in encoders:
            opts = list(encoders[col].classes_)
            questions[col] = opts
    
    return questions

def get_age_group(age):
    """Convert age to age group."""
    if age <= 30:
        return "Young"
    elif age <= 45:
        return "Adult"
    elif age <= 60:
        return "Middle"
    else:
        return "Senior"

def process_user_input(age, user_responses):
    """Process user input and generate risk report.
    
    Args:
        age: User's age (int)
        user_responses: Dictionary with feature names as keys and selected values as values
    
    Returns:
        Dictionary with disease risk assessments
    """
    user = {}
    
    # Process age
    age_group = get_age_group(age)
    user["AgeGroup"] = encoders["AgeGroup"].transform([age_group])[0]
    
    # Process user responses
    for col, value in user_responses.items():
        if col in encoders:
            # Convert value to proper format
            value_str = str(value).strip().title()
            if value_str in encoders[col].classes_:
                user[col] = encoders[col].transform([value_str])[0]
    
    # Generate report
    report = []
    
    for d in diseases:
        # Prepare features for this disease
        X_nb = pd.DataFrame([{f: user[f] for f in disease_features[d] if f in user}])
        p_nb = nb_models[d].predict_proba(X_nb)[0][1]
        
        evidence = {f: user[f] for f in disease_features[d] if f in user}
        evidence["AgeGroup"] = user["AgeGroup"]
        
        q = bn_infer[d].query([d], evidence=evidence)
        p_bn = q.values[1]
        
        risk = round((0.6 * p_bn + 0.4 * p_nb) * 100, 2)
        
        band = "0-20" if risk <= 20 else "21-40" if risk <= 40 else "41-60" if risk <= 60 else "61-80" if risk <= 80 else "81-100"
        
        try:
            advice = recs[(recs.Disease == d) & (recs.RiskRangePercent == band)]["DoctorRecommendation"].values[0]
        except:
            advice = "Please consult with a healthcare professional."
        
        # Get risk factors breakdown
        base_q = bn_infer[d].query([d], evidence={"AgeGroup": user["AgeGroup"]})
        base_p = base_q.values[1]
        
        risk_factors = []
        for f in disease_features[d]:
            if f in user:
                temp_evidence = {"AgeGroup": user["AgeGroup"], f: user[f]}
                temp_q = bn_infer[d].query([d], evidence=temp_evidence)
                temp_p = temp_q.values[1]
                
                delta = round((temp_p - base_p) * 100, 2)
                direction = "increased" if delta > 0 else "reduced"
                risk_factors.append({
                    "factor": f,
                    "direction": direction,
                    "delta": abs(delta)
                })
        
        report.append({
            "disease": d,
            "risk": risk,
            "risk_band": band,
            "recommendation": advice,
            "risk_factors": risk_factors
        })
    
    return report
