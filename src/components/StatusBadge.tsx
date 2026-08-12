import React from "react";

export type StatusType =
  | "ACTIVE"
  | "APPROVED"
  | "BLOCKED"
  | "REVIEW"
  | "SUSPENDED"
  | "CRITICAL"
  | "HEALTHY"
  | "PENDING"
  | "HOLD"
  | "CLEARED"
  | "REJECTED"
  | string;

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
  size?: "sm" | "md";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className = "",
  size = "sm",
}) => {
  const norm = (status || "").toString().toUpperCase();

  let colorClasses = "bg-slate-800/60 text-slate-300 border-slate-700/60";
  let dotColor = "bg-slate-400";

  if (["ACTIVE", "APPROVED", "HEALTHY", "OPERATIONAL", "CLEARED", "VERIFIED", "ONLINE"].includes(norm)) {
    colorClasses = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    dotColor = "bg-emerald-400";
  } else if (["REVIEW", "PENDING", "PENDING REVIEW", "HOLD", "WARNING", "LOW CASH", "ELEVATED"].includes(norm)) {
    colorClasses = "bg-amber-500/10 text-amber-400 border-amber-500/20";
    dotColor = "bg-amber-400";
  } else if (["BLOCKED", "SUSPENDED", "CRITICAL", "HIGH RISK", "REJECTED", "CLOSED", "OFFLINE"].includes(norm)) {
    colorClasses = "bg-rose-500/10 text-rose-400 border-rose-500/20";
    dotColor = "bg-rose-400";
  }

  const py = size === "sm" ? "py-0.5 px-2" : "py-1 px-2.5";
  const text = size === "sm" ? "text-[10px]" : "text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono font-semibold rounded-full border ${py} ${text} ${colorClasses} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      <span>{norm}</span>
    </span>
  );
};
