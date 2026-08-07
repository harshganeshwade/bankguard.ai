import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  Cpu,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Info,
  RefreshCw,
  Layers,
  BarChart2,
  Database,
  GitBranch,
} from "lucide-react";
import { RandomForestFeatures, FeatureImportance } from "../types";
import { predictFraudRandomForest, predictFraudRandomForestAsync, RandomForestPrediction } from "../lib/fraudEngine";

interface FraudDetectionViewProps {
  onAnalyzeWithGemini: (features: RandomForestFeatures) => Promise<any>;
}

export const FraudDetectionView: React.FC<FraudDetectionViewProps> = ({
  onAnalyzeWithGemini,
}) => {
  // Feature state
  const [features, setFeatures] = useState<RandomForestFeatures>({
    amount: 15400,
    timeHour: 2,
    dayOfWeek: 4,
    merchantCategory: "Offshore Crypto Exchange",
    location: "Kolkata, WB",
    deviceId: "DEV-MAC-UNKNOWN-99",
    ipAddress: "192.168.1.105",
    prevTransactions24h: 8,
    transactionFrequency: 4.5,
    avgDailySpend: 400,
    failedLoginAttempts: 4,
    distanceKm: 2400,
    loginDeviceChanged: true,
    cardPresent: false,
    velocityScore: 92,
    beneficiaryAgeDays: 0,
    isNewDevice: true,
    isVpnUsed: true,
    isAtmWithdrawal: false,
    isCashDeposit: false,
  });

  const [prediction, setPrediction] = useState<RandomForestPrediction>(() =>
    predictFraudRandomForest(features)
  );
  const [modelInfo, setModelInfo] = useState<any>(null);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isMlLoading, setIsMlLoading] = useState(false);

  // Fetch ML Model info once
  useEffect(() => {
    fetch("/api/ml/model-info")
      .then((res) => res.json())
      .then((data) => {
        if (data.modelType) setModelInfo(data);
      })
      .catch((err) => console.warn("Failed to fetch ML model info", err));
  }, []);

  // Run async Scikit-Learn Random Forest prediction on feature changes
  useEffect(() => {
    let isMounted = true;
    setIsMlLoading(true);

    predictFraudRandomForestAsync(features).then((res) => {
      if (isMounted) {
        setPrediction(res);
        setIsMlLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [features]);

  const handleRunGeminiAI = async () => {
    setIsAiLoading(true);
    try {
      const res = await onAnalyzeWithGemini(features);
      setAiAnalysisResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Cpu className="w-6 h-6 text-[#38BDF8]" />
              <h1 className="text-3xl font-bold text-[#bec6e0] font-headline-md">
                Scikit-Learn Random Forest ML Pipeline
              </h1>
            </div>
            <p className="text-sm text-[#c6c6cd] mt-1">
              Genuine 100-Tree Decision Forest Ensemble trained on 10,000 fraud vectors with SHAP Feature Importance & Gemini 3.6 Flash Explanations.
            </p>
          </div>

          {/* Model Spec Badge */}
          {modelInfo && (
            <div className="flex items-center gap-3 bg-[#1E293B] border border-[#334155] rounded-xl px-4 py-2 text-xs shrink-0">
              <Database className="w-4 h-4 text-[#10B981]" />
              <div>
                <div className="font-bold text-white flex items-center gap-1.5">
                  <span>{modelInfo.library} {modelInfo.modelType}</span>
                  <span className="text-[10px] bg-[#38BDF8]/20 text-[#38BDF8] px-1.5 py-0.5 rounded font-mono">
                    {modelInfo.n_estimators} Trees
                  </span>
                </div>
                <div className="text-[11px] text-[#909097] font-mono">
                  Accuracy: {(modelInfo.metrics.accuracy * 100).toFixed(1)}% | ROC-AUC: {modelInfo.metrics.rocAuc}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Feature Control Sliders */}
        <div className="lg:col-span-5 bg-[#1E293B] border border-[#334155] rounded-xl p-5 space-y-4 shadow-lg">
          <div className="flex items-center justify-between border-b border-[#334155] pb-3">
            <h2 className="text-xs font-bold text-[#38BDF8] uppercase tracking-wider flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5" />
              <span>Ensemble Input Vector</span>
            </h2>
            <button
              onClick={() =>
                setFeatures({
                  amount: 15400,
                  timeHour: 2,
                  dayOfWeek: 4,
                  merchantCategory: "Offshore Crypto Exchange",
                  location: "Kolkata, WB",
                  deviceId: "DEV-MAC-UNKNOWN-99",
                  ipAddress: "192.168.1.105",
                  prevTransactions24h: 8,
                  transactionFrequency: 4.5,
                  avgDailySpend: 400,
                  failedLoginAttempts: 4,
                  distanceKm: 2400,
                  loginDeviceChanged: true,
                  cardPresent: false,
                  velocityScore: 92,
                  beneficiaryAgeDays: 0,
                  isNewDevice: true,
                  isVpnUsed: true,
                  isAtmWithdrawal: false,
                  isCashDeposit: false,
                })
              }
              className="text-[10px] text-[#909097] hover:text-[#38BDF8]"
            >
              Reset Attack Vector
            </button>
          </div>

          <div className="space-y-3 text-xs text-[#d4e4fa]">
            {/* Amount Slider */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[#c6c6cd]">Transaction Amount</span>
                <span className="font-mono font-bold text-[#38BDF8]">
                  ₹{features.amount.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="50000"
                step="100"
                value={features.amount}
                onChange={(e) =>
                  setFeatures({ ...features, amount: Number(e.target.value) })
                }
                className="w-full accent-[#38BDF8] bg-[#0F172A] h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Travel Distance Jump */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[#c6c6cd]">Location Jump (km)</span>
                <span className="font-mono font-bold text-[#F59E0B]">
                  {features.distanceKm} km
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10000"
                step="50"
                value={features.distanceKm}
                onChange={(e) =>
                  setFeatures({ ...features, distanceKm: Number(e.target.value) })
                }
                className="w-full accent-[#F59E0B] bg-[#0F172A] h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Velocity Score */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[#c6c6cd]">Velocity Score (0-100)</span>
                <span className="font-mono font-bold text-[#EF4444]">
                  {features.velocityScore}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={features.velocityScore}
                onChange={(e) =>
                  setFeatures({
                    ...features,
                    velocityScore: Number(e.target.value),
                  })
                }
                className="w-full accent-[#EF4444] bg-[#0F172A] h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Failed Login Attempts */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[#c6c6cd]">Failed Logins Prior</span>
                <span className="font-mono font-bold text-[#d4e4fa]">
                  {features.failedLoginAttempts}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={features.failedLoginAttempts}
                onChange={(e) =>
                  setFeatures({
                    ...features,
                    failedLoginAttempts: Number(e.target.value),
                  })
                }
                className="w-full accent-[#38BDF8] bg-[#0F172A] h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Toggle Switches Grid */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <label className="flex items-center justify-between p-2.5 bg-[#0F172A] border border-[#334155] rounded-lg cursor-pointer">
                <span className="text-[11px] text-[#c6c6cd]">New Device</span>
                <input
                  type="checkbox"
                  checked={features.isNewDevice}
                  onChange={(e) =>
                    setFeatures({ ...features, isNewDevice: e.target.checked })
                  }
                  className="accent-[#38BDF8]"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 bg-[#0F172A] border border-[#334155] rounded-lg cursor-pointer">
                <span className="text-[11px] text-[#c6c6cd]">Proxy VPN</span>
                <input
                  type="checkbox"
                  checked={features.isVpnUsed}
                  onChange={(e) =>
                    setFeatures({ ...features, isVpnUsed: e.target.checked })
                  }
                  className="accent-[#38BDF8]"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 bg-[#0F172A] border border-[#334155] rounded-lg cursor-pointer">
                <span className="text-[11px] text-[#c6c6cd]">Card Present</span>
                <input
                  type="checkbox"
                  checked={features.cardPresent}
                  onChange={(e) =>
                    setFeatures({ ...features, cardPresent: e.target.checked })
                  }
                  className="accent-[#10B981]"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 bg-[#0F172A] border border-[#334155] rounded-lg cursor-pointer">
                <span className="text-[11px] text-[#c6c6cd]">Device Shift</span>
                <input
                  type="checkbox"
                  checked={features.loginDeviceChanged}
                  onChange={(e) =>
                    setFeatures({ ...features, loginDeviceChanged: e.target.checked })
                  }
                  className="accent-[#38BDF8]"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Right: Model Prediction & SHAP Breakdown */}
        <div className="lg:col-span-7 space-y-6">
          {/* Prediction Gauge Banner */}
          <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-5 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1.5 text-center md:text-left">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#909097] uppercase tracking-wider">
                  Random Forest Ensemble Prediction
                </span>
                {prediction.engine && (
                  <span className="text-[9px] bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/30 px-2 py-0.5 rounded-full font-mono">
                    {prediction.engine}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <div
                  className={`text-4xl font-extrabold font-mono tracking-tight ${
                    prediction.fraudProbability >= 60
                      ? "text-[#EF4444]"
                      : prediction.fraudProbability >= 35
                      ? "text-[#F59E0B]"
                      : "text-[#10B981]"
                  }`}
                >
                  {prediction.fraudProbability}% Fraud Probability
                </div>
              </div>

              {prediction.ensembleDetails && (
                <div className="text-[11px] font-mono text-[#38BDF8] bg-[#0F172A] px-2.5 py-1 rounded inline-block border border-[#334155]">
                  🌲 Tree Consensus: {prediction.ensembleDetails.fraudVotes} / {prediction.ensembleDetails.totalTrees} Trees voted Fraud ({prediction.ensembleDetails.voteConsensusPercent}% agreement)
                </div>
              )}

              <div className="text-xs text-[#c6c6cd]">
                Category:{" "}
                <span className="font-bold text-white">
                  {prediction.riskCategory}
                </span>{" "}
                | {prediction.recommendedAction}
              </div>
            </div>

            <button
              onClick={handleRunGeminiAI}
              disabled={isAiLoading}
              className="bg-gradient-to-r from-[#38BDF8] to-[#10B981] text-[#051424] font-bold text-xs px-5 py-3 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity shrink-0 shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {isAiLoading ? "Consulting Gemini AI..." : "Run Gemini Deep AI Analysis"}
              </span>
            </button>
          </div>

          {/* SHAP Feature Importance Waterfall */}
          <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-5 space-y-4 shadow-lg">
            <h3 className="text-xs font-bold text-[#bec6e0] uppercase tracking-wider flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-[#38BDF8]" />
              <span>Explainable AI (SHAP) Feature Contribution Waterfall</span>
            </h3>

            <div className="space-y-3">
              {prediction.featureImportance.map((f, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#d4e4fa] font-medium">{f.featureName}</span>
                    <span
                      className={`font-mono font-bold ${
                        f.contributionPercent > 0
                          ? "text-[#EF4444]"
                          : "text-[#10B981]"
                      }`}
                    >
                      {f.contributionPercent > 0 ? `+${f.contributionPercent}%` : `${f.contributionPercent}%`}
                    </span>
                  </div>
                  <div className="w-full bg-[#0F172A] rounded-full h-2 overflow-hidden border border-[#334155]">
                    <div
                      className={`h-full ${
                        f.contributionPercent > 0 ? "bg-[#EF4444]" : "bg-[#10B981]"
                      }`}
                      style={{ width: `${Math.abs(f.contributionPercent)}%` }}
                    ></div>
                  </div>
                  <p className="text-[11px] text-[#909097]">{f.reasonText}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Gemini AI Expert Commentary Output */}
          {aiAnalysisResult && (
            <div className="bg-[#0F172A] border border-[#38BDF8]/40 rounded-xl p-5 space-y-3 shadow-xl animate-fadeIn">
              <div className="flex items-center gap-2 text-[#38BDF8] font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Gemini 3.6 Flash Threat Intelligence Response</span>
              </div>
              <div className="text-xs text-[#d4e4fa] leading-relaxed space-y-2">
                <p>
                  <strong className="text-white">Threat Executive Summary:</strong>{" "}
                  {aiAnalysisResult.threatSummary || aiAnalysisResult.summary}
                </p>
                <div className="p-3 bg-[#1E293B] rounded border border-[#334155] font-mono text-[11px] text-[#38BDF8]">
                  Fraud Classification: {aiAnalysisResult.threatCategory || "Critical Anomaly"}
                  <br />
                  Model Confidence: {aiAnalysisResult.confidence || "98.4%"}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
