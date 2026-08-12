import React, { useState } from "react";
import { Clock, RefreshCw, Key, ShieldCheck, AlertTriangle, CheckCircle2, Lock, Sparkles, LogOut } from "lucide-react";

interface JwtTokenCountdownProps {
  username?: string;
  role?: string;
  secondsRemaining: number;
  sessionMaxSeconds: number;
  onExtendSession: (additionalSeconds?: number) => void;
  onLogout?: () => void;
}

export const JwtTokenCountdown: React.FC<JwtTokenCountdownProps> = ({
  username = "User",
  role = "Admin",
  secondsRemaining,
  sessionMaxSeconds,
  onExtendSession,
  onLogout,
}) => {
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [tokenHash, setTokenHash] = useState<string>(
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3JfOTkxOCIsIm5hbWUiOiJIYXJzaCBHYW5lc2h3YWRlIiwicm9sZSI6IkFkbWluIiwiaWF0IjoxNzU1MDE4NDAwLCJleHAiOjE3NTUwMTkzMDB9"
  );
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string>(
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  );
  const [refreshSuccessMessage, setRefreshSuccessMessage] = useState<string | null>(null);

  const handleRefreshToken = () => {
    setIsRefreshing(true);
    setRefreshSuccessMessage(null);

    setTimeout(() => {
      onExtendSession(900); // Add +15 minutes (900s) cumulatively
      const randomSuffix = Math.random().toString(36).substring(2, 10);
      setTokenHash(
        `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3JfOTkxOCIsIm5hbWUiOiI${randomSuffix}Iiwicm9sZSI6I${role}IiwiaWF0Ijo${Date.now()}}`
      );
      setLastRefreshedAt(
        new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
      );
      setIsRefreshing(false);

      const updatedTotalMins = Math.round((secondsRemaining + 900) / 60);
      setRefreshSuccessMessage(`JWT Token extended by +15 mins! Current active session: ~${updatedTotalMins} min remaining`);

      setTimeout(() => {
        setRefreshSuccessMessage(null);
      }, 4000);
    }, 400);
  };

  const totalMins = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  
  let formattedTime = "";
  if (totalMins >= 60) {
    const hours = Math.floor(totalMins / 60);
    const remMins = totalMins % 60;
    formattedTime = `${String(hours).padStart(2, "0")}:${String(remMins).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  } else {
    formattedTime = `${String(totalMins).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  const maxSecs = Math.max(900, sessionMaxSeconds);
  const percentageRemaining = Math.max(0, Math.min(100, (secondsRemaining / maxSecs) * 100));

  // Determine status tier
  const isExpired = secondsRemaining === 0;
  const isWarning = secondsRemaining < 300 && secondsRemaining > 120; // < 5 mins
  const isCritical = secondsRemaining <= 120; // < 2 mins

  let statusColorClass = "text-sky-400 border-sky-500/30 bg-sky-500/10";
  let barColorClass = "bg-gradient-to-r from-sky-500 to-emerald-400";
  let statusText = "Active Session";

  if (isExpired) {
    statusColorClass = "text-rose-500 border-rose-500/40 bg-rose-500/15 animate-pulse";
    barColorClass = "bg-rose-600";
    statusText = "Token Expired";
  } else if (isCritical) {
    statusColorClass = "text-rose-400 border-rose-500/30 bg-rose-500/10 animate-pulse";
    barColorClass = "bg-rose-500";
    statusText = "Expiring Imminently";
  } else if (isWarning) {
    statusColorClass = "text-amber-400 border-amber-500/30 bg-amber-500/10";
    barColorClass = "bg-amber-500";
    statusText = "Session Expiring Soon";
  }

  return (
    <div className="p-6 rounded-xl bg-[#0F141D] border border-[#202938] space-y-5 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#202938] pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              JWT Active Session Token Limit
              <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold border ${statusColorClass}`}>
                {statusText}
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Enforced by Zero Trust Auth Gateway • Extends cumulatively by +15 min per renewal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleRefreshToken}
            disabled={isRefreshing}
            className="px-3.5 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>{isRefreshing ? "Extending..." : "Renew Token (+15m)"}</span>
          </button>
          
          {onLogout && (
            <button
              onClick={onLogout}
              className="px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Terminate Session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Countdown Display Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
        {/* Countdown Digits */}
        <div className="p-4 rounded-xl bg-[#080B12] border border-[#202938] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-sans">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-sky-400" /> Time Remaining
            </span>
            <span className="text-[10px] text-slate-500">Max: {Math.round(maxSecs / 60)}m</span>
          </div>

          <div className="my-2">
            <div
              className={`text-3xl font-extrabold tracking-wider ${
                isExpired
                  ? "text-rose-500 animate-pulse"
                  : isCritical
                  ? "text-rose-400 animate-pulse"
                  : isWarning
                  ? "text-amber-400"
                  : "text-sky-400"
              }`}
            >
              {formattedTime}
            </div>
            <div className="text-[10px] text-slate-500 font-sans mt-0.5">
              {isExpired
                ? "Session terminated. Please sign in again."
                : `${percentageRemaining.toFixed(1)}% session capacity remaining`}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 rounded-full bg-[#151B26] overflow-hidden border border-[#202938]">
            <div
              className={`h-full transition-all duration-1000 ${barColorClass}`}
              style={{ width: `${percentageRemaining}%` }}
            />
          </div>
        </div>

        {/* Token Specs */}
        <div className="p-4 rounded-xl bg-[#080B12] border border-[#202938] space-y-2 text-xs">
          <div className="text-slate-400 font-sans text-[11px] flex items-center justify-between">
            <span>Auth Claims & Security</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between items-center border-b border-[#1A2230] pb-1">
              <span className="text-slate-500 text-[10px]">Subject (sub):</span>
              <span className="text-slate-200 font-semibold">{username}</span>
            </div>
            <div className="flex justify-between items-center border-b border-[#1A2230] pb-1">
              <span className="text-slate-500 text-[10px]">Role / Scope:</span>
              <span className="text-sky-400 font-bold">{role}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-[10px]">Last Extended:</span>
              <span className="text-emerald-400 font-bold">{lastRefreshedAt}</span>
            </div>
          </div>
        </div>

        {/* Token Signature Preview */}
        <div className="p-4 rounded-xl bg-[#080B12] border border-[#202938] flex flex-col justify-between text-xs">
          <div className="text-slate-400 font-sans text-[11px] flex items-center justify-between">
            <span>Encoded Signature (Bearer)</span>
            <Lock className="w-3.5 h-3.5 text-slate-500" />
          </div>
          <div className="my-2 p-2 rounded bg-[#030508] border border-[#18202F] text-[10px] text-slate-400 font-mono break-all line-clamp-3 select-all">
            {tokenHash}
          </div>
          <div className="text-[10px] text-slate-500 flex items-center gap-1 font-sans">
            <Sparkles className="w-3 h-3 text-sky-400" />
            <span>Signed by BankGuard OAuth CA</span>
          </div>
        </div>
      </div>

      {refreshSuccessMessage && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{refreshSuccessMessage}</span>
        </div>
      )}

      {isCritical && !isExpired && (
        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Session limit critical! Token will expire in under 2 minutes.</span>
          </div>
          <button
            onClick={handleRefreshToken}
            className="px-2.5 py-1 rounded bg-rose-500 text-white font-bold text-[11px] hover:bg-rose-400 cursor-pointer"
          >
            Extend (+15m)
          </button>
        </div>
      )}
    </div>
  );
};

