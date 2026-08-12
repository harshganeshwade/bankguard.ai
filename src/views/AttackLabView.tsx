import React, { useState } from "react";
import {
  Skull,
  Play,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Zap,
} from "lucide-react";

export const AttackLabView: React.FC = () => {
  const [attackType, setAttackType] = useState("Credential Stuffing");
  const [targetApi, setTargetApi] = useState("Authentication API");
  const [intensity, setIntensity] = useState(65);
  const [isSimulating, setIsSimulating] = useState(false);
  const [hasResult, setHasResult] = useState(true);

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setHasResult(true);
    }, 1200);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto font-sans text-slate-100">
      {/* Prominent SECURITY LAB Header & Huge SIMULATION MODE Indicator */}
      <div className="p-6 rounded-xl bg-[#0F141D] border border-[#202938] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold flex items-center gap-2">
              <Skull className="w-4 h-4 text-rose-400" />
              <span>SECURITY LAB</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white font-sans mt-1">
              Cyber Attack Defense Sandbox
            </h1>
          </div>

          {/* Huge SIMULATION MODE Badge (Requirement 11) */}
          <div className="px-4 py-2 rounded-lg bg-amber-500/10 border-2 border-amber-500/40 text-amber-400 font-mono font-extrabold text-xs tracking-wider flex items-center gap-2 self-start sm:self-auto shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <span>● SIMULATION MODE (ISOLATED SANDBOX)</span>
          </div>
        </div>
      </div>

      {/* Attack Configuration Panel */}
      <div className="p-6 rounded-xl bg-[#0F141D] border border-[#202938] space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Attack Type Selector */}
          <div className="space-y-2">
            <label className="text-slate-300 font-mono font-semibold block uppercase">
              Attack Type
            </label>
            <select
              value={attackType}
              onChange={(e) => setAttackType(e.target.value)}
              className="w-full bg-[#080B12] border border-[#202938] rounded-lg p-2.5 text-slate-100 font-mono focus:outline-none focus:border-rose-500"
            >
              <option value="Credential Stuffing">Credential Stuffing</option>
              <option value="Rapid Velocity Spurt">Rapid Velocity Transfer Spurt</option>
              <option value="Impossible Travel Jump">Impossible Travel Location Jump</option>
              <option value="Micro-Deposit Probe">Micro-Deposit Account Probe</option>
            </select>
          </div>

          {/* Target API */}
          <div className="space-y-2">
            <label className="text-slate-300 font-mono font-semibold block uppercase">
              Target Component
            </label>
            <select
              value={targetApi}
              onChange={(e) => setTargetApi(e.target.value)}
              className="w-full bg-[#080B12] border border-[#202938] rounded-lg p-2.5 text-slate-100 font-mono focus:outline-none focus:border-rose-500"
            >
              <option value="Authentication API">Authentication API (/api/auth/login)</option>
              <option value="UPI Transfer Gateway">UPI Transfer Gateway (/api/transfer)</option>
              <option value="ATM Cashout Endpoint">ATM Cashout Endpoint (/api/atm/withdraw)</option>
            </select>
          </div>
        </div>

        {/* Intensity Slider */}
        <div className="space-y-2 text-xs">
          <div className="flex justify-between text-slate-300 font-mono">
            <span>Intensity</span>
            <span className="text-rose-400 font-bold">{intensity}% Scale</span>
          </div>
          <input
            type="range"
            min={10}
            max={100}
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            className="w-full accent-rose-500 bg-[#080B12] h-2 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>

        {/* Start Simulation Button */}
        <button
          onClick={handleRunSimulation}
          disabled={isSimulating}
          className="w-full py-3 rounded-lg bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-colors uppercase font-mono"
        >
          <Play className="w-4 h-4 fill-slate-950" />
          <span>{isSimulating ? "Executing Simulation Vector..." : "[ START SIMULATION ]"}</span>
        </button>
      </div>

      {/* Detection Results */}
      {hasResult && (
        <div className="p-6 rounded-xl bg-[#0F141D] border border-[#202938] space-y-6">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">
            DETECTION RESULT
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-300">Attack detected</span>
              <span className="text-emerald-400 font-bold">100% Blocked</span>
            </div>
            <div className="w-full bg-[#080B12] h-3 rounded-full overflow-hidden border border-[#202938]">
              <div className="bg-emerald-400 h-full w-full" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-3 rounded bg-[#080B12] border border-[#202938]">
              <div className="text-[10px] text-slate-500">Blocked requests</div>
              <div className="text-xl font-bold text-emerald-400 mt-1">184</div>
            </div>
            <div className="p-3 rounded bg-[#080B12] border border-[#202938]">
              <div className="text-[10px] text-slate-500">Failed attempts</div>
              <div className="text-xl font-bold text-amber-400 mt-1">73</div>
            </div>
            <div className="p-3 rounded bg-[#080B12] border border-[#202938]">
              <div className="text-[10px] text-slate-500">Alerts generated</div>
              <div className="text-xl font-bold text-rose-400 mt-1">4</div>
            </div>
          </div>

          {/* Defense Mechanisms Checkmarks */}
          <div className="space-y-2 pt-2 border-t border-[#202938]">
            <div className="text-xs font-mono text-slate-300 font-semibold">
              Defense mechanisms
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono text-emerald-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Rate limiting</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Account lockout</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Request validation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Audit logging</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
