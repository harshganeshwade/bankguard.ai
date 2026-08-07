import os
import json
import warnings
warnings.filterwarnings("ignore")
import numpy as np
import pandas as pd
import joblib
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI(title="BankGuard AI - Scikit-Learn Random Forest Fraud Service", version="1.0.0")

MODEL_PATH = "model/random_forest_fraud.joblib"
METADATA_PATH = "model/model_metadata.json"

rf_model = None
metadata = {}

def load_resources():
    global rf_model, metadata
    if os.path.exists(MODEL_PATH):
        rf_model = joblib.load(MODEL_PATH)
    if os.path.exists(METADATA_PATH):
        with open(METADATA_PATH, "r") as f:
            metadata = json.load(f)

load_resources()

class TransactionFeatures(BaseModel):
    amount: float
    avgDailySpend: float = 250.0
    spendRatio: float = None
    distanceKm: float = 0.0
    isNewDevice: int = 0
    loginDeviceChanged: int = 0
    isVpnUsed: int = 0
    velocityScore: float = 10.0
    prevTransactions24h: int = 1
    failedLoginAttempts: int = 0
    beneficiaryAgeDays: int = 365
    timeHour: int = 12
    cardPresent: int = 1

def run_rf_prediction(features: dict):
    global rf_model
    if rf_model is None:
        load_resources()
    if rf_model is None:
        raise ValueError("Random Forest model is not loaded.")

    spend_ratio = features.get("spendRatio")
    if spend_ratio is None:
        avg_spend = features.get("avgDailySpend") or 250.0
        spend_ratio = features["amount"] / avg_spend if avg_spend > 0 else 1.0

    feature_cols = [
        "amount", "avgDailySpend", "spendRatio", "distanceKm",
        "isNewDevice", "loginDeviceChanged", "isVpnUsed", "velocityScore",
        "prevTransactions24h", "failedLoginAttempts", "beneficiaryAgeDays",
        "timeHour", "cardPresent"
    ]

    input_data = pd.DataFrame([{
        "amount": float(features.get("amount", 0)),
        "avgDailySpend": float(features.get("avgDailySpend", 250)),
        "spendRatio": float(spend_ratio),
        "distanceKm": float(features.get("distanceKm", 0)),
        "isNewDevice": int(features.get("isNewDevice", 0)),
        "loginDeviceChanged": int(features.get("loginDeviceChanged", 0)),
        "isVpnUsed": int(features.get("isVpnUsed", 0)),
        "velocityScore": float(features.get("velocityScore", 10)),
        "prevTransactions24h": int(features.get("prevTransactions24h", 1)),
        "failedLoginAttempts": int(features.get("failedLoginAttempts", 0)),
        "beneficiaryAgeDays": int(features.get("beneficiaryAgeDays", 365)),
        "timeHour": int(features.get("timeHour", 12)),
        "cardPresent": int(features.get("cardPresent", 1))
    }])[feature_cols]

    # Predict probabilities from ensemble
    probas = rf_model.predict_proba(input_data)[0]
    fraud_prob = float(probas[1]) # probability of class 1 (fraud)
    risk_score = round(fraud_prob * 100, 2)

    # Individual tree votes across all 100 estimators
    tree_votes = [float(tree.predict_proba(input_data)[0][1]) for tree in rf_model.estimators_]
    fraud_tree_count = sum(1 for v in tree_votes if v >= 0.5)
    total_trees = len(tree_votes)

    # Feature Importance breakdown
    importances = rf_model.feature_importances_
    feature_importance_list = []
    for name, imp in zip(feature_cols, importances):
        feature_importance_list.append({
            "feature": name,
            "importance": round(float(imp) * 100, 2)
        })
    feature_importance_list.sort(key=lambda x: x["importance"], reverse=True)

    # Risk categorization
    if risk_score >= 80:
        risk_category = "Critical Risk"
        recommended_action = "Freeze Account & Hold Transaction immediately"
    elif risk_score >= 60:
        risk_category = "High Risk"
        recommended_action = "Escalate to Fraud Team & Block Card"
    elif risk_score >= 35:
        risk_category = "Medium Risk"
        recommended_action = "Request 2FA SMS / Biometric Step-Up Challenge"
    elif risk_score >= 20:
        risk_category = "Low Risk"
        recommended_action = "Allow with routine monitoring"
    else:
        risk_category = "Safe"
        recommended_action = "Approve Transaction"

    return {
        "engine": "Scikit-Learn RandomForestClassifier",
        "fraudProbability": risk_score,
        "riskScore": risk_score,
        "riskCategory": risk_category,
        "isFraud": risk_score >= 60,
        "recommendedAction": recommended_action,
        "ensembleDetails": {
            "totalTrees": total_trees,
            "fraudVotes": fraud_tree_count,
            "safeVotes": total_trees - fraud_tree_count,
            "voteConsensusPercent": round((fraud_tree_count if risk_score >= 50 else (total_trees - fraud_tree_count)) / total_trees * 100, 1)
        },
        "featureImportance": feature_importance_list
    }

@app.get("/model-info")
def get_model_info():
    global metadata
    if not metadata:
        load_resources()
    return metadata

@app.post("/predict")
def predict_endpoint(payload: TransactionFeatures):
    try:
        res = run_rf_prediction(payload.dict())
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
