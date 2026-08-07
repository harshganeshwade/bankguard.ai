import os
import json
import numpy as np
import pandas as pd
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix

# Ensure model directory exists
os.makedirs("model", exist_ok=True)

def generate_fraud_dataset(n_samples=10000, random_state=42):
    np.random.seed(random_state)
    
    # Feature distributions
    amount = np.random.exponential(scale=300, size=n_samples) + 10
    avg_daily_spend = np.random.normal(loc=250, scale=80, size=n_samples).clip(50, 2000)
    spend_ratio = amount / avg_daily_spend
    
    distance_km = np.random.exponential(scale=150, size=n_samples)
    is_new_device = np.random.binomial(1, 0.15, size=n_samples)
    login_device_changed = np.random.binomial(1, 0.12, size=n_samples)
    is_vpn_used = np.random.binomial(1, 0.08, size=n_samples)
    
    velocity_score = np.random.beta(a=2, b=5, size=n_samples) * 100
    prev_txns_24h = np.random.poisson(lam=3, size=n_samples)
    failed_logins = np.random.choice([0, 1, 2, 3, 4, 5, 6], size=n_samples, p=[0.75, 0.12, 0.06, 0.04, 0.015, 0.01, 0.005])
    
    beneficiary_age_days = np.random.exponential(scale=200, size=n_samples).astype(int)
    time_hour = np.random.randint(0, 24, size=n_samples)
    card_present = np.random.binomial(1, 0.60, size=n_samples)
    
    # Calculate latent fraud risk score
    risk = (
        0.35 * (spend_ratio > 5).astype(int) +
        0.45 * (amount > 10000).astype(int) +
        0.25 * is_new_device +
        0.20 * login_device_changed +
        0.30 * is_vpn_used +
        0.35 * (distance_km > 500).astype(int) +
        0.40 * (velocity_score > 70).astype(int) +
        0.30 * (failed_logins >= 3).astype(int) +
        0.25 * (beneficiary_age_days < 5).astype(int) +
        0.15 * ((time_hour >= 1) & (time_hour <= 4)).astype(int) -
        0.40 * card_present -
        0.20 * (beneficiary_age_days > 180).astype(int) +
        np.random.normal(0, 0.15, size=n_samples)
    )
    
    # Threshold for fraud label (creates ~8% fraud rate typical in banking)
    is_fraud = (risk > 0.55).astype(int)
    
    df = pd.DataFrame({
        "amount": amount,
        "avgDailySpend": avg_daily_spend,
        "spendRatio": spend_ratio,
        "distanceKm": distance_km,
        "isNewDevice": is_new_device,
        "loginDeviceChanged": login_device_changed,
        "isVpnUsed": is_vpn_used,
        "velocityScore": velocity_score,
        "prevTransactions24h": prev_txns_24h,
        "failedLoginAttempts": failed_logins,
        "beneficiaryAgeDays": beneficiary_age_days,
        "timeHour": time_hour,
        "cardPresent": card_present,
        "isFraud": is_fraud
    })
    
    return df

def train():
    print("Generating synthetic banking transaction dataset (10,000 samples)...")
    df = generate_fraud_dataset(10000)
    
    feature_cols = [
        "amount", "avgDailySpend", "spendRatio", "distanceKm", 
        "isNewDevice", "loginDeviceChanged", "isVpnUsed", "velocityScore", 
        "prevTransactions24h", "failedLoginAttempts", "beneficiaryAgeDays", 
        "timeHour", "cardPresent"
    ]
    
    X = df[feature_cols]
    y = df["isFraud"]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    print(f"Dataset shape: {X.shape}, Fraud cases: {y.sum()} ({y.mean()*100:.2f}%)")
    
    # Train Random Forest Classifier
    rf = RandomForestClassifier(
        n_estimators=100,
        max_depth=12,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1
    )
    
    rf.fit(X_train, y_train)
    
    # Evaluate
    y_pred = rf.predict(X_test)
    y_proba = rf.predict_proba(X_test)[:, 1]
    
    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred, zero_division=0)
    rec = recall_score(y_test, y_pred, zero_division=0)
    f1 = f1_score(y_test, y_pred, zero_division=0)
    auc = roc_auc_score(y_test, y_proba)
    cm = confusion_matrix(y_test, y_pred).tolist()
    
    print(f"Model Metrics -> Accuracy: {acc:.4f}, Precision: {prec:.4f}, Recall: {rec:.4f}, F1: {f1:.4f}, ROC-AUC: {auc:.4f}")
    
    # Save joblib model
    model_path = "model/random_forest_fraud.joblib"
    joblib.dump(rf, model_path)
    print(f"Saved trained Random Forest model to {model_path}")
    
    # Extract feature importances
    importances = rf.feature_importances_
    feat_imp = [
        {"feature": name, "importance": round(float(imp) * 100, 2)}
        for name, imp in sorted(zip(feature_cols, importances), key=lambda x: x[1], reverse=True)
    ]
    
    metadata = {
        "modelType": "RandomForestClassifier",
        "library": "scikit-learn",
        "n_estimators": 100,
        "max_depth": 12,
        "totalSamples": len(df),
        "features": feature_cols,
        "metrics": {
            "accuracy": round(acc, 4),
            "precision": round(prec, 4),
            "recall": round(rec, 4),
            "f1": round(f1, 4),
            "rocAuc": round(auc, 4),
            "confusionMatrix": cm
        },
        "featureImportance": feat_imp
    }
    
    with open("model/model_metadata.json", "w") as f:
        json.dump(metadata, f, indent=2)
    print("Saved model metadata to model/model_metadata.json")

if __name__ == "__main__":
    train()
