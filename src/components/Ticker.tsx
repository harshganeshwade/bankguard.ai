import React from "react";
import { AlertTriangle, ArrowRight, X } from "lucide-react";

interface EmergencyBannerProps {
  emergency?: {
    accountNumber: string;
    amount: number;
    riskScore: number;
    message?: string;
  } | null;
  onReview?: () => void;
  onDismiss?: () => void;
}

export const Ticker: React.FC<EmergencyBannerProps> = ({
  emergency = {
    accountNumber: "•••• 4921",
    amount: 82000,
    riskScore: 94,
    message: "HIGH-RISK TRANSACTION DETECTED",
  },
  onReview,
  onDismiss,
}) => {
  if (!emergency) return null;

  return (
    <div className="fixed top-14 w-full z-40 bg-rose-500/10 border-b border-rose-500/30 text-slate-100 font-mono text-xs py-2 px-4 flex items-center justify-between backdrop-blur-md">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 font-bold text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded border border-rose-500/30 text-[11px]">
          <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />
          <span>⚠ {emergency.message || "HIGH-RISK TRANSACTION DETECTED"}</span>
        </span>
        <span className="text-slate-300 text-[11px] hidden sm:inline">
          Account <strong className="text-white">{emergency.accountNumber}</strong> · ₹
          {emergency.amount.toLocaleString()} · Risk{" "}
          <strong className="text-rose-400">{emergency.riskScore}</strong>
        </span>
      </div>

      <div className="flex items-center gap-3">
        {onReview && (
          <button
            onClick={onReview}
            className="px-2.5 py-1 rounded bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition-colors"
          >
            <span>Review</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-slate-400 hover:text-white p-1 rounded"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
