import React, { useState } from "react";
import {
  Brain,
  Sparkles,
  BarChart3,
  Sliders,
  ShieldAlert,
  HelpCircle,
  TrendingUp,
  CheckCircle2,
  AlertOctagon,
  ArrowRight,
  Info,
  RefreshCw,
  Zap,
} from "lucide-react";
import { FeatureImportance } from "../types";

export const ExplainableAiView: React.FC = () => {
  // Interactive ML Simulator State
  const [amount, setAmount] = useState<number>(450000);
  const [distanceKm, setDistanceKm] = useState<number>(1250);
  const [velocityTxCount, setVelocityTxCount] = useState<number>(14);
  const [isNewDevice, setIsNewDevice] = useState<boolean>(true);
  const [isVpnUsed, setIsVpnUsed] = useState<boolean>(true);
  const [failedLogins, setFailedLogins] = useState<number>(4);

  // Calculate dynamic SHAP score based on controls
  const calculateDynamicShap = () => {
    let baseScore = 15; // baseline risk
    const shapList: { name: string; impact: number; reason: string; category: "high" | "medium" | "low" }[] = [];

    if (isNewDevice) {
      baseScore += 28;
      shapList.push({
        name: "Unrecognized Hardware Device Fingerprint",
        impact: 28,
        reason: "Login initiated from unknown Mac ARM64 device in distinct subnet.",
        category: "high",
      });
    }

    if (isVpnUsed) {
      baseScore += 22;
      shapList.push({
        name: "Commercial VPN / Proxy Anonymizer",
        impact: 22,
        reason: "IP routed through NordVPN datacenter exit node.",
        category: "high",
      });
    }

    if (velocityTxCount > 5) {
      const velImpact = Math.min(30, (velocityTxCount - 5) * 4);
      baseScore += velImpact;
      shapList.push({
        name: "High Velocity Transaction Spike (24h)",
        impact: velImpact,
        reason: `${velocityTxCount} rapid IMPS transfers executed within past 2 hours.`,
        category: "high",
      });
    }

    if (distanceKm > 500) {
      baseScore += 18;
      shapList.push({
        name: "Impossible Travel Distance Jump",
        impact: 18,
        reason: `Geographic location jump of ${distanceKm} km from previous authorized session.`,
        category: "medium",
      });
    }

    if (amount > 100000) {
      const amtImpact = Math.min(20, Math.floor(amount / 50000) * 3);
      baseScore += amtImpact;
      shapList.push({
        name: "Abnormal Transfer Amount Deviation",
        impact: amtImpact,
        reason: `Transfer size is ${Math.round(amount / 25000)}x higher than 90-day moving average.`,
        category: "medium",
      });
    }

    if (failedLogins > 2) {
      baseScore += 12;
      shapList.push({
        name: "Preceding Failed Login Credentials",
        impact: 12,
        reason: `${failedLogins} incorrect password attempts recorded prior to session auth.`,
        category: "low",
      });
    }

    const finalScore = Math.min(99, baseScore);
    return { finalScore, shapList };
  };

  const { finalScore, shapList } = calculateDynamicShap();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-sky-950/40 to-slate-900 border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <Brain className="w-5 h-5" />
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400">
              Module 1.2 • Explainable AI (XAI)
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            SHAP Score Feature Importance & Model Transparency
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Demystifies black-box Random Forest and XGBoost predictions. Explains exactly <i>why</i> a transaction was flagged using additive Shapley Feature Attribution.
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-slate-300">Model: Random Forest v4.2 + SHAP Kernel</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Scenario Simulator */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-sky-400" />
              <h3 className="font-bold text-slate-100 text-sm">Interactive Risk Feature Simulator</h3>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Real-time Recalibration</span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Adjust the sliders and parameters below to simulate incoming transaction variables and observe how SHAP values dynamically attribute risk weights.
          </p>

          <div className="space-y-4 text-xs">
            {/* Amount Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-medium">
                <span className="text-slate-300">Transaction Amount (INR)</span>
                <span className="font-mono text-sky-400 font-bold">₹{amount.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={10000}
                max={1000000}
                step={10000}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full accent-sky-400 bg-slate-950 cursor-pointer h-2 rounded-lg"
              />
            </div>

            {/* Travel Distance Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-medium">
                <span className="text-slate-300">Distance Jump from Last IP Location</span>
                <span className="font-mono text-sky-400 font-bold">{distanceKm} km</span>
              </div>
              <input
                type="range"
                min={0}
                max={3000}
                step={50}
                value={distanceKm}
                onChange={(e) => setDistanceKm(Number(e.target.value))}
                className="w-full accent-sky-400 bg-slate-950 cursor-pointer h-2 rounded-lg"
              />
            </div>

            {/* Velocity Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-medium">
                <span className="text-slate-300">24-Hour Transaction Frequency</span>
                <span className="font-mono text-sky-400 font-bold">{velocityTxCount} transfers</span>
              </div>
              <input
                type="range"
                min={1}
                max={30}
                step={1}
                value={velocityTxCount}
                onChange={(e) => setVelocityTxCount(Number(e.target.value))}
                className="w-full accent-sky-400 bg-slate-950 cursor-pointer h-2 rounded-lg"
              />
            </div>

            {/* Failed Logins Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-medium">
                <span className="text-slate-300">Failed Login Attempts Prior to Auth</span>
                <span className="font-mono text-amber-400 font-bold">{failedLogins} attempts</span>
              </div>
              <input
                type="range"
                min={0}
                max={10}
                step={1}
                value={failedLogins}
                onChange={(e) => setFailedLogins(Number(e.target.value))}
                className="w-full accent-amber-400 bg-slate-950 cursor-pointer h-2 rounded-lg"
              />
            </div>

            {/* Toggles */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsNewDevice(!isNewDevice)}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-colors ${
                  isNewDevice
                    ? "bg-rose-500/10 border-rose-500/40 text-rose-300"
                    : "bg-slate-950 border-slate-800 text-slate-400"
                }`}
              >
                <span className="text-[10px] uppercase font-mono font-bold">Unrecognized Device</span>
                <span className="font-bold text-xs mt-1">{isNewDevice ? "ENABLED (+28%)" : "Disabled"}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsVpnUsed(!isVpnUsed)}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-colors ${
                  isVpnUsed
                    ? "bg-rose-500/10 border-rose-500/40 text-rose-300"
                    : "bg-slate-950 border-slate-800 text-slate-400"
                }`}
              >
                <span className="text-[10px] uppercase font-mono font-bold">Datacenter VPN / Proxy</span>
                <span className="font-bold text-xs mt-1">{isVpnUsed ? "ACTIVE (+22%)" : "Disabled"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: SHAP Value Attribution Waterfall */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
          {/* Risk Gauge Overview */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                Calculated Fraud Probability
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-3xl font-extrabold text-slate-100 font-mono">{finalScore}%</span>
                <span
                  className={`text-xs font-bold uppercase font-mono ${
                    finalScore >= 80 ? "text-rose-400" : finalScore >= 50 ? "text-amber-400" : "text-emerald-400"
                  }`}
                >
                  {finalScore >= 80 ? "CRITICAL RISK (HOLD)" : finalScore >= 50 ? "MEDIUM RISK (REVIEW)" : "LOW RISK (CLEARED)"}
                </span>
              </div>
            </div>

            <div className="w-32 bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  finalScore >= 80 ? "bg-rose-500" : finalScore >= 50 ? "bg-amber-500" : "bg-emerald-500"
                }`}
                style={{ width: `${finalScore}%` }}
              ></div>
            </div>
          </div>

          {/* SHAP Waterfall Feature Contribution Bars */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-200">SHAP Feature Attribution Breakdown:</span>
              <span className="text-slate-400 font-mono text-[11px]">+ Impact increases risk</span>
            </div>

            <div className="space-y-2.5">
              {shapList.map((item, index) => (
                <div key={index} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-100 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      {item.name}
                    </span>
                    <span className="font-mono font-extrabold text-rose-400 text-xs">+{item.impact}% Risk Contribution</span>
                  </div>

                  {/* Impact Progress Bar */}
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-rose-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${(item.impact / 40) * 100}%` }}
                    ></div>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">{item.reason}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Explainability Compliance Card */}
          <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/20 text-xs space-y-1">
            <div className="font-bold text-sky-400 flex items-center gap-1.5">
              <Info className="w-4 h-4" />
              Auditable Explainable AI Compliance Directive
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Regulatory frameworks (RBI Master Directions & EU AI Act) mandate that automated financial rejections provide mathematically verifiable decision explanations. SHAP values guarantee consistency and local accuracy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
