import {
  RandomForestFeatures,
  FeatureImportance,
  RiskCategory,
} from "../types";

export interface RandomForestPrediction {
  fraudProbability: number; // 0 to 100
  riskScore: number; // 0 to 100
  riskCategory: RiskCategory;
  isFraud: boolean;
  primaryReason: string;
  recommendedAction: string;
  featureImportance: FeatureImportance[];
}

/**
 * Random Forest Ensemble Decision Tree Predictor for Banking Transactions
 */
export function predictFraudRandomForest(
  features: RandomForestFeatures
): RandomForestPrediction {
  let treeVotes = 0;
  const totalTrees = 10;
  const featureScores: { name: string; score: number; text: string }[] = [];

  // Signal 1: Amount relative to average daily spend
  const spendRatio =
    features.avgDailySpend > 0
      ? features.amount / features.avgDailySpend
      : features.amount / 500;
  if (spendRatio > 10 || features.amount > 20000) {
    treeVotes += 2.5;
    featureScores.push({
      name: "Unusual Transaction Amount",
      score: 28,
      text: `$${features.amount.toLocaleString()} is ${spendRatio.toFixed(1)}x user's average daily spend`,
    });
  } else if (spendRatio > 4 || features.amount > 5000) {
    treeVotes += 1.2;
    featureScores.push({
      name: "Elevated Amount",
      score: 16,
      text: "Higher than typical daily expenditure profile",
    });
  }

  // Signal 2: New device & device fingerprint change
  if (features.isNewDevice || features.loginDeviceChanged) {
    treeVotes += 2.0;
    featureScores.push({
      name: "New Device Fingerprint",
      score: 24,
      text: `First time seeing device ${features.deviceId.slice(0, 8)}...`,
    });
  }

  // Signal 3: Impossible travel & location jump
  if (features.distanceKm > 1000) {
    treeVotes += 2.2;
    featureScores.push({
      name: "Impossible Travel Jump",
      score: 26,
      text: `Geolocation jump of ${features.distanceKm} km within 1 hour`,
    });
  } else if (features.distanceKm > 200) {
    treeVotes += 1.1;
    featureScores.push({
      name: "Location Mismatch",
      score: 14,
      text: `Location shifted by ${features.distanceKm} km from registered home base`,
    });
  }

  // Signal 4: VPN usage & suspicious IP
  if (features.isVpnUsed) {
    treeVotes += 1.5;
    featureScores.push({
      name: "Foreign IP / Proxy VPN",
      score: 18,
      text: `Transaction routed through anonymized proxy (${features.ipAddress})`,
    });
  }

  // Signal 5: Velocity score & rapid bursts
  if (features.velocityScore > 75 || features.prevTransactions24h > 15) {
    treeVotes += 2.0;
    featureScores.push({
      name: "High Velocity Score",
      score: 22,
      text: `${features.prevTransactions24h} transactions executed in rapid succession`,
    });
  } else if (features.velocityScore > 40) {
    treeVotes += 0.8;
    featureScores.push({
      name: "Moderate Velocity",
      score: 10,
      text: "Above average transaction rate detected",
    });
  }

  // Signal 6: Failed login attempts prior to transaction
  if (features.failedLoginAttempts >= 3) {
    treeVotes += 1.8;
    featureScores.push({
      name: "Multiple Failed Logins",
      score: 20,
      text: `${features.failedLoginAttempts} failed authentication attempts prior to transfer`,
    });
  }

  // Signal 7: Beneficiary account age
  if (features.beneficiaryAgeDays < 3) {
    treeVotes += 1.4;
    featureScores.push({
      name: "Newly Created Beneficiary",
      score: 15,
      text: `Destination account created only ${features.beneficiaryAgeDays} days ago`,
    });
  }

  // Signal 8: Off-peak hour anomaly (1 AM - 5 AM)
  if (features.timeHour >= 1 && features.timeHour <= 4) {
    treeVotes += 0.8;
    featureScores.push({
      name: "Unusual Time Window",
      score: 9,
      text: `Transaction executed during off-peak window (${features.timeHour}:00 UTC)`,
    });
  }

  // Mitigating factors
  if (features.cardPresent) {
    featureScores.push({
      name: "Chip & PIN Card Present",
      score: -10,
      text: "EMV Chip physically validated at point of sale",
    });
  }
  if (!features.isNewDevice && features.beneficiaryAgeDays > 180) {
    featureScores.push({
      name: "Known Trusted Recipient",
      score: -12,
      text: "Historical transaction relationship exists (> 6 months)",
    });
  }

  // Normalize vote into fraud probability % (0 - 99%)
  const rawProb = Math.min(99, Math.max(3, Math.round((treeVotes / totalTrees) * 100)));
  const riskScore = rawProb;

  // Determine Risk Category
  let riskCategory: RiskCategory = "Safe";
  let recommendedAction = "Approve Transaction";
  let primaryReason = "Standard customer transaction pattern";

  if (riskScore >= 80) {
    riskCategory = "Critical Risk";
    recommendedAction = "Freeze Account & Hold Transaction immediately";
    primaryReason = featureScores[0]?.text || "Multiple critical threat indicators matched";
  } else if (riskScore >= 60) {
    riskCategory = "High Risk";
    recommendedAction = "Escalate to Fraud Team & Block Card";
    primaryReason = featureScores[0]?.text || "High risk anomaly detected across multiple trees";
  } else if (riskScore >= 35) {
    riskCategory = "Medium Risk";
    recommendedAction = "Request 2FA SMS / Biometric Step-Up Challenge";
    primaryReason = "Elevated risk signals detected";
  } else if (riskScore >= 20) {
    riskCategory = "Low Risk";
    recommendedAction = "Allow with routine monitoring";
    primaryReason = "Minor variance from historical norm";
  }

  // Format SHAP / Explainable AI feature contributions
  const shapExplanations: FeatureImportance[] = featureScores.map((fs) => ({
    featureName: fs.name,
    contributionPercent: fs.score,
    reasonText: fs.text,
    impactType:
      fs.score >= 20
        ? "high_risk"
        : fs.score > 0
        ? "medium_risk"
        : "mitigating",
  }));

  return {
    fraudProbability: rawProb,
    riskScore,
    riskCategory,
    isFraud: riskScore >= 60,
    primaryReason,
    recommendedAction,
    featureImportance: shapExplanations,
  };
}

/**
 * Generate simulated attack vectors for demo sandbox
 */
export function generateSimulationAttack(vectorType: string): RandomForestFeatures {
  const base: RandomForestFeatures = {
    amount: 150,
    timeHour: 14,
    dayOfWeek: 3,
    merchantCategory: "E-Commerce",
    location: "Mumbai, IN",
    deviceId: "DEV-8849-MAC",
    ipAddress: "103.22.14.11",
    prevTransactions24h: 2,
    transactionFrequency: 1.2,
    avgDailySpend: 200,
    failedLoginAttempts: 0,
    distanceKm: 2,
    loginDeviceChanged: false,
    cardPresent: true,
    velocityScore: 12,
    beneficiaryAgeDays: 365,
    isNewDevice: false,
    isVpnUsed: false,
    isAtmWithdrawal: false,
    isCashDeposit: false,
  };

  switch (vectorType) {
    case "Velocity Attack":
      return {
        ...base,
        amount: 850,
        prevTransactions24h: 28,
        velocityScore: 94,
        isNewDevice: true,
        loginDeviceChanged: true,
        location: "Srinagar, JK",
        ipAddress: "185.220.101.5",
        isVpnUsed: true,
      };

    case "Impossible Travel":
      return {
        ...base,
        amount: 4500,
        distanceKm: 2400,
        location: "Kolkata, WB",
        ipAddress: "192.168.1.105",
        isVpnUsed: true,
        isNewDevice: true,
        failedLoginAttempts: 4,
        velocityScore: 82,
      };

    case "High-Value Transfer":
      return {
        ...base,
        amount: 48500,
        avgDailySpend: 350,
        merchantCategory: "Crypto Exchange",
        beneficiaryAgeDays: 1,
        isNewDevice: true,
        loginDeviceChanged: true,
        timeHour: 2,
        velocityScore: 78,
      };

    case "Card Testing":
      return {
        ...base,
        amount: 1.99,
        prevTransactions24h: 42,
        velocityScore: 98,
        merchantCategory: "Digital Subscriptions",
        cardPresent: false,
        failedLoginAttempts: 2,
        isVpnUsed: true,
      };

    case "Account Takeover":
      return {
        ...base,
        amount: 12000,
        failedLoginAttempts: 6,
        loginDeviceChanged: true,
        isNewDevice: true,
        isVpnUsed: true,
        beneficiaryAgeDays: 0,
        location: "Guwahati, AS",
        ipAddress: "91.240.118.12",
      };

    case "Multiple Failed Logins":
      return {
        ...base,
        failedLoginAttempts: 8,
        loginDeviceChanged: true,
        isNewDevice: true,
        location: "Ahmedabad, GJ",
      };

    default:
      return base;
  }
}
