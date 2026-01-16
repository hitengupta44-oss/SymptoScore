# SymptoScore

# AI-Based Health Risk Screening System

An AI-driven health screening platform that estimates **early risk probabilities (not medical diagnoses)** for multiple chronic diseases using symptom, lifestyle, and family history data.
The system promotes **proactive healthcare awareness** through explainable probabilistic modeling, early risk alerts, and **non-prescriptive preventive guidance**, including **suggested routine medical tests for high-risk cases**.

---

## Key Features

* **Multi-Disease Risk Screening**

  * Diabetes
  * Heart Disease
  * Hypertension
  * Chronic Kidney Disease (CKD)
  * Asthma
  * Dyslipidemia
  * Anemia

* **Risk Probability Output**

  * Disease-wise risk scores between **0–100%**
  * Clear classification: Low / Moderate / High Risk

* **High-Risk Alerts**

  * Automatic alerts for elevated risk scores
  * Preventive lifestyle recommendations
  * Suggested routine screening tests (informational only, not medical advice)

* **Explainable AI**

  * Bayesian Network–based causal reasoning
  * Transparent probabilistic factor influence
  * Interpretable decision paths

* **Persistent Data Storage**

  * Survey responses
  * Risk predictions
  * Alert history
    Stored securely in **Supabase (SQL-backed database)**

---

## Machine Learning Architecture

### Hybrid Probabilistic Ensemble

The system uses a **hybrid ensemble of Naive Bayes and Bayesian Networks**:

| Model            | Role                                                                              |
| ---------------- | --------------------------------------------------------------------------------- |
| Naive Bayes      | Fast baseline probabilistic risk estimation                                       |
| Bayesian Network | Models conditional dependencies between symptoms, lifestyle factors, and diseases |

This approach ensures:

* Interpretability
* Robust uncertainty handling
* Efficiency suitable for real-world screening

---

## System Workflow

1. User inputs symptoms, lifestyle habits, and family history
2. Feature encoding and preprocessing
3. Risk estimation using Naive Bayes and Bayesian Network inference
4. Disease-wise risk score generation (0–100%)
5. Explainability through probabilistic factor contributions
6. High-risk alerts with lifestyle guidance and suggested routine tests
7. Secure storage of inputs and results in Supabase

---

## Suggested Routine Screening Tests (High-Risk Cases)

For users identified with **high estimated risk**, the system may suggest **commonly recommended routine screening tests** for awareness purposes:

| Disease       | Suggested Test (Informational)    |
| ------------- | --------------------------------- |
| Diabetes      | Fasting Blood Sugar, HbA1c        |
| Heart Disease | ECG, Lipid Profile                |
| Hypertension  | Regular Blood Pressure Monitoring |
| CKD           | Serum Creatinine, Urine Albumin   |
| Dyslipidemia  | Lipid Profile                     |
| Anemia        | Complete Blood Count (CBC)        |
| Asthma        | Pulmonary Function Test           |

---

## Responsible AI and Ethical Design

* This system is **not a diagnostic tool**
* Designed strictly for **early risk screening and health awareness**
* Emphasizes transparency and interpretability
* Supports responsible and ethical AI deployment in healthcare contexts

---

## Tech Stack

* Python
* Scikit-learn (Naive Bayes)
* pgmpy (Bayesian Networks and inference)
* Pandas, NumPy
* Supabase (PostgreSQL-based storage)
---

## Impact

By enabling early risk awareness, transparent AI reasoning, and preventive health insights, this project aims to support proactive healthcare behavior and reduce long-term disease burden.
