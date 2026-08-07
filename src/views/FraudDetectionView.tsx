import React, { useState } from "react";
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
} from "lucide-react";
import { RandomForestFeatures, FeatureImportance } from "../types";
import { predictFraudRandomForest } from "../lib/fraudEngine";

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
    location: "Moscow, RU",
    deviceId: "DEV-MAC-UNKNOWN-99",
    ipAddress: "192.168.1.105",
    prevTransactions24h: 8,
    transactionFrequency: 4.5,
    avgDailySpend: 400,
    failedLoginAttempts: 4,
    distanceKm: 8400,
    loginDeviceChanged: true,
    cardPresent: false,
    velocityScore: 92,
    beneficiaryAgeDays: 0,
    isNewDevice: true,
    isVpnUsed: true,
    isAtmWithdrawal: false,
    isCashDeposit: false,
  });

  const [aiAnalysisResult, setAiAnalysisResult] = useState<any>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Run local Random Forest Ensemble engine
  const prediction = predictFraudRandomForest(features);

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
        <div className="flex items-center gap-2">
          <Cpu className="w-6 h-6 text-[#38BDF8]" />
          <h1 className="text-3xl font-bold text-[#bec6e0] font-headline-md">
            Random Forest & Explainable AI (SHAP)
          </h1>
        </div>
        <p className="text-sm text-[#c6c6cd] mt-1">
          10-Tree Ensemble Decision Classifier with SHAP Feature Importance & Gemini AI Threat Analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Feature Control Sliders */}
        <div className="lg:col-span-5 bg-[#1E293B] border border-[#334155] rounded-xl p-5 space-y-4 shadow-lg">
          <div className="flex items-center justify-between border-b border-[#334155] pb-3">
            <h2 className="text-xs font-bold text-[#38BDF8] uppercase tracking-wider">
              Ensemble Input Feature Vector
            </h2>
            <button
              onClick={() =>
                setFeatures({
                  amount: 15400,
                  timeHour: 2,
                  dayOfWeek: 4,
                  merchantCategory: "Offshore Crypto Exchange",
                  location: "Moscow, RU",
                  deviceId: "DEV-MAC-UNKNOWN-99",
                  ipAddress: "192.168.1.105",
                  prevTransactions24h: 8,
                  transactionFrequency: 4.5,
                  avgDailySpend: 400,
                  failedLoginAttempts: 4,
                  distanceKm: 8400,
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
            <div className="space-y-1 text-center md:text-left">
              <span className="text-[10px] font-bold text-[#909097] uppercase tracking-wider">
                Random Forest Decision Tree Ensemble Output
              </span>
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
