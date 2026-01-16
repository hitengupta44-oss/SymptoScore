# SymptoScore

## AI‑Based Health Risk Screening System

SymptoScore is an AI‑driven health screening platform that estimates **early risk probabilities** (not medical diagnoses) for multiple chronic diseases using symptom, lifestyle, and family‑history data. The system promotes proactive healthcare awareness through explainable probabilistic modeling, early risk alerts, and **non‑prescriptive preventive guidance**, including suggested routine medical tests for high‑risk cases.

---

## Key Features

### Multi‑Disease Risk Screening

* Diabetes
* Heart Disease
* Hypertension
* Chronic Kidney Disease (CKD)
* Asthma
* Dyslipidemia
* Anemia

### Risk Probability Output

* Disease‑wise risk scores between **0–100%**
* Clear classification: **Low / Moderate / High Risk**

### High‑Risk Alerts

* Automatic alerts for elevated risk scores
* Preventive lifestyle recommendations
* Suggested routine screening tests *(informational only, not medical advice)*

### Explainable AI

* Bayesian Network–based causal reasoning
* Transparent probabilistic factor influence
* Interpretable decision paths

### Persistent Data Storage

* Survey responses
* Risk predictions
* Alert history

All data is stored securely in **Supabase (SQL‑backed PostgreSQL database)** with access control policies.

---

## Machine Learning Architecture

### Hybrid Probabilistic Ensemble

The system uses a hybrid ensemble of **Naive Bayes** and **Bayesian Networks**:

| Model            | Role                                                                              |
| ---------------- | --------------------------------------------------------------------------------- |
| Naive Bayes      | Fast baseline probabilistic risk estimation                                       |
| Bayesian Network | Models conditional dependencies between symptoms, lifestyle factors, and diseases |

This approach ensures:

* Interpretability
* Robust uncertainty handling
* Efficiency suitable for real‑world screening

---

## System Architecture & Platform Design

The platform follows a **modular, service‑oriented architecture** separating user‑facing systems from the machine‑learning inference layer.

## flow chart for the working of the application 
<img width="1920" height="500" alt="1 (3)" src="https://github.com/user-attachments/assets/e90e2c24-3ad5-4929-92a1-0c559ba1f343" />

### Frontend Application

* Built using a modern React‑based stack
* Secure user authentication via Supabase Auth
* Guided, multi‑step health survey experience
* Clear risk‑vs‑diagnosis communication
* Visual risk summaries and explainability views
* User history dashboard for past screenings

### Backend & Application Logic

* Powered by **Supabase** as the core backend platform
* Handles authentication, authorization, and secure data access
* Implements Row Level Security (RLS) to ensure users can only access their own health data
* Backend logic orchestrates survey submission, validation, risk processing, alert creation, and result delivery

### ML Service Integration

* Machine‑learning models are deployed as an **independent inference service**
* Backend communicates with the ML service via secure HTTP APIs
* Enables independent scaling, model updates, and versioning without impacting the user‑facing system

### Scalability & Reliability Considerations

* Stateless backend design for horizontal scaling
* Isolation of ML inference service to avoid system‑wide bottlenecks
* Structured data storage enables analytics, auditing, and future model improvement
* Architecture supports future enhancements such as caching, async processing, and alert pipelines

---

## System Workflow

1. User signs in and completes a health screening survey
2. Survey responses are validated and securely stored
3. Backend forwards encoded features to the ML inference service
4. Disease‑wise risk scores (0–100%) are generated
5. Probabilistic factor contributions are returned for explainability
6. High‑risk cases trigger alerts and preventive guidance
7. Results and alerts are persisted in Supabase for future reference

---

## Suggested Routine Screening Tests (High‑Risk Cases)

For users identified with high estimated risk, the system may suggest commonly recommended routine screening tests for **awareness purposes only**:

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
* Designed strictly for early risk screening and health awareness
* Clear separation between medical advice and informational guidance
* Emphasis on transparency, interpretability, and user trust
* Supports responsible and ethical AI deployment in healthcare contexts

---

## Tech Stack

### Machine Learning

* Python
* Scikit‑learn (Naive Bayes)
* pgmpy (Bayesian Networks and inference)
* Pandas, NumPy

### Platform & Engineering

* Supabase (PostgreSQL, Auth, Row Level Security)
* Serverless backend functions for orchestration
* Secure API‑based integration with ML inference service
* Modern React‑based frontend

---
## Preview
<img width="1919" height="1127" alt="image" src="https://github.com/user-attachments/assets/bd8bdf65-91b5-470c-89df-769a08f60a18" />
This is what the user will be previewed with after completing the questionnaire.

## Key points
  1. Risk score for multiple chronic diseases
  2. Protective factors : Factors influced the given Diagnosis* the least.
  3. Risk factors : Factors influced the given Diagnosis* the most.
  
## Impact

By combining explainable probabilistic AI with a secure, scalable, and user‑centric system design, SymptoScore enables early health risk awareness, supports preventive healthcare behavior, and demonstrates a production‑ready approach to responsible health‑tech deployment.
