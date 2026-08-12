import React, { useState } from "react";
import {
  Brain,
  Sliders,
  ShieldAlert,
  Zap,
  Info,
} from "lucide-react";

export const ExplainableAiView: React.FC = () => {
  const [velocity, setVelocity] = useState<number>(28);
  const [locationAnomaly, setLocationAnomaly] = useState<number>(21);
  const [unusualAmount, setUnusualAmount] = useState<number>(19);
  const [deviceChange, setDeviceChange] = useState<number>(12);
  const [offHours, setOffHours] = useState<number>(7);

  const riskScore = velocity + locationAnomaly + unusualAmount + deviceChange + offHours;

  return (
    <div className="space-y-8 max-w-5xl mx-auto font-sans text-slate-100">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
          AI Analysis & SHAP Feature Attribution
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Model transparency and additive Shapley value feature contributions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Clear AI Risk Assessment Card */}
        <div className="md:col-span-6 p-6 rounded-xl bg-[#0F141D] border border-[#202938] space-y-5">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold flex items-center gap-2">
            <Brain className="w-4 h-4 text-violet-400" />
            <span>AI RISK ASSESSMENT</span>
          </div>

          <div>
            <div className="text-xs text-slate-400 font-medium">Risk Score</div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl font-mono font-bold text-white">
                {riskScore}
              </span>
              <span className="text-sm font-mono text-slate-500">/ 100</span>
              <span
                className={`ml-2 px-2.5 py-0.5 rounded text-xs font-mono font-bold ${
                  riskScore >= 70
                    ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                    : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                }`}
              >
                {riskScore >= 70 ? "HIGH RISK" : "MEDIUM RISK"}
              </span>
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-[#202938]">
            <div className="text-xs font-mono text-slate-300 font-semibold">
              Why?
            </div>

            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between items-center p-2 rounded bg-[#080B12] border border-[#202938]">
                <span className="text-slate-300">Transaction velocity</span>
                <span className="font-bold text-rose-400">+{velocity}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-[#080B12] border border-[#202938]">
                <span className="text-slate-300">Location anomaly</span>
                <span className="font-bold text-rose-400">+{locationAnomaly}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-[#080B12] border border-[#202938]">
                <span className="text-slate-300">Unusual amount</span>
                <span className="font-bold text-rose-400">+{unusualAmount}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-[#080B12] border border-[#202938]">
                <span className="text-slate-300">Device change</span>
                <span className="font-bold text-amber-400">+{deviceChange}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-[#080B12] border border-[#202938]">
                <span className="text-slate-300">Off-hours transaction</span>
                <span className="font-bold text-amber-400">+{offHours}</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#202938] space-y-2">
            <div className="text-xs font-mono text-slate-400">
              Model confidence: <strong className="text-white">94.2%</strong>
            </div>
            <div className="p-3 rounded bg-[#151B26] border border-[#202938] text-xs">
              <span className="text-slate-400 font-medium block text-[11px]">Recommended action</span>
              <span className="text-sky-400 font-bold flex items-center gap-1.5 mt-0.5">
                ● Temporarily hold transaction
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Live Feature Tuning Sliders */}
        <div className="md:col-span-6 p-6 rounded-xl bg-[#0F141D] border border-[#202938] space-y-5">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold flex items-center gap-2">
            <Sliders className="w-4 h-4 text-sky-400" />
            <span>FEATURE CONTRIBUTION TUNER</span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Adjust factor weights to model how SHAP feature attributions change under varying transaction anomaly conditions.
          </p>

          <div className="space-y-4 text-xs font-sans">
            <div className="space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>Transaction Velocity Weight</span>
                <span className="font-mono text-rose-400 font-bold">+{velocity}</span>
              </div>
              <input
                type="range"
                min={0}
                max={40}
                value={velocity}
                onChange={(e) => setVelocity(Number(e.target.value))}
                className="w-full accent-rose-400 bg-[#080B12] h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>Location Anomaly Weight</span>
                <span className="font-mono text-rose-400 font-bold">+{locationAnomaly}</span>
              </div>
              <input
                type="range"
                min={0}
                max={40}
                value={locationAnomaly}
                onChange={(e) => setLocationAnomaly(Number(e.target.value))}
                className="w-full accent-rose-400 bg-[#080B12] h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>Unusual Amount Weight</span>
                <span className="font-mono text-rose-400 font-bold">+{unusualAmount}</span>
              </div>
              <input
                type="range"
                min={0}
                max={40}
                value={unusualAmount}
                onChange={(e) => setUnusualAmount(Number(e.target.value))}
                className="w-full accent-rose-400 bg-[#080B12] h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>Device Footprint Change Weight</span>
                <span className="font-mono text-amber-400 font-bold">+{deviceChange}</span>
              </div>
              <input
                type="range"
                min={0}
                max={25}
                value={deviceChange}
                onChange={(e) => setDeviceChange(Number(e.target.value))}
                className="w-full accent-amber-400 bg-[#080B12] h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>Off-Hours Factor Weight</span>
                <span className="font-mono text-amber-400 font-bold">+{offHours}</span>
              </div>
              <input
                type="range"
                min={0}
                max={20}
                value={offHours}
                onChange={(e) => setOffHours(Number(e.target.value))}
                className="w-full accent-amber-400 bg-[#080B12] h-1.5 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
