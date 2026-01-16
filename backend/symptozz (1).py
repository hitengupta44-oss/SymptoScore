import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.naive_bayes import BernoulliNB
from pgmpy.models import DiscreteBayesianNetwork
from pgmpy.estimators import MaximumLikelihoodEstimator
from pgmpy.inference import VariableElimination

# ================= LOAD DATA =================
df = pd.read_excel(r"C:\Users\Mansha\Downloads\diseasefinalset.xlsx")
recs = pd.read_excel(r"C:\Users\Mansha\Downloads\recommendationsdoc_precise_detailed.xlsx")

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
encoders={}
for col in df.columns:
    if df[col].dtype==object:
        le=LabelEncoder()
        df[col]=le.fit_transform(df[col])
        encoders[col]=le

# ================= AGE GROUP =================
df["AgeGroup"]=pd.cut(df["Age"],bins=[0,30,45,60,120],
                      labels=["Young","Adult","Middle","Senior"])

le_age=LabelEncoder()
df["AgeGroup"]=le_age.fit_transform(df["AgeGroup"].astype(str))
encoders["AgeGroup"]=le_age

# ================= NAIVE BAYES =================
nb_models={}
for d in diseases:
    X=df[disease_features[d]]
    y=df[d]
    nb=BernoulliNB()
    nb.fit(X,y)
    nb_models[d]=nb

# ================= BAYESIAN NETWORK =================
bn_models={}
bn_infer={}
for d in diseases:
    feats=["AgeGroup"]+disease_features[d]
    data=df[feats+[d]]

    edges=[(f,d) for f in feats]
    model=DiscreteBayesianNetwork(edges)
    model.fit(data,estimator=MaximumLikelihoodEstimator)
    bn_models[d]=model
    bn_infer[d]=VariableElimination(model)

# ================= USER INPUT =================
print("\n======= HEALTH INTAKE FORM =======")
user={}
age=int(input("Enter Age (number): "))
age_group="Young" if age<=30 else "Adult" if age<=45 else "Middle" if age<=60 else "Senior"
user["AgeGroup"]=encoders["AgeGroup"].transform([age_group])[0]

for col in sorted(set(sum(disease_features.values(),[]))):
    opts=encoders[col].classes_
    print(f"\n{col} options:")
    for o in opts: print(" -",o)
    while True:
        v=input(f"Enter {col}: ").strip().title()
        if v in opts:
            user[col]=encoders[col].transform([v])[0]
            break
        print("Invalid input. Choose from above.")

# ================= REPORT =================
print("\n========= HEALTH RISK REPORT =========")

for d in diseases:
    X_nb=pd.DataFrame([{f:user[f] for f in disease_features[d]}])
    p_nb=nb_models[d].predict_proba(X_nb)[0][1]

    evidence={f:user[f] for f in disease_features[d]}
    evidence["AgeGroup"]=user["AgeGroup"]

    q=bn_infer[d].query([d],evidence=evidence)
    p_bn=q.values[1]

    risk=round((0.6*p_bn+0.4*p_nb)*100,2)

    band="0-20" if risk<=20 else "21-40" if risk<=40 else "41-60" if risk<=60 else "61-80" if risk<=80 else "81-100"
    advice=recs[(recs.Disease==d)&(recs.RiskRangePercent==band)]["DoctorRecommendation"].values[0]

    print(f"\n{d} Risk: {risk}%")
    print("Doctor Recommendation:",advice)
    print("Why this risk?")

    base_q = bn_infer[d].query([d], evidence={"AgeGroup": user["AgeGroup"]})
    base_p = base_q.values[1]

    for f in disease_features[d]:
        temp_evidence = {"AgeGroup": user["AgeGroup"], f: user[f]}
        temp_q = bn_infer[d].query([d], evidence=temp_evidence)
        temp_p = temp_q.values[1]

        delta = round((temp_p - base_p) * 100, 2)
        direction = "increased" if delta > 0 else "reduced"
        print(f"  {f} {direction} risk by {abs(delta)}%")

