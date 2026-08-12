import React, { useState, useEffect } from "react";
import {
  X,
  ShieldAlert,
  Brain,
  Network,
  Clock,
  FileText,
  UserCheck,
  Ban,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  Lock,
  ExternalLink,
  Check,
} from "lucide-react";
import { Transaction } from "../types";
import { StatusBadge } from "./StatusBadge";

interface InvestigationDrawerProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateTransaction?: (tx: Transaction) => void;
  onOpenFullCase?: (tx: Transaction) => void;
}

export const InvestigationDrawer: React.FC<InvestigationDrawerProps> = ({
  transaction,
  isOpen,
  onClose,
  onUpdateTransaction,
  onOpenFullCase,
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "timeline" | "ai" | "network" | "audit">("overview");
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Keyboard shortcut listener to close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !transaction) return null;

  const features = transaction.features || {
    velocityScore: 82,
    distanceKm: 1420,
    loginDeviceChanged: true,
    isVpnUsed: true,
    prevTransactions24h: 18,
    failedLoginAttempts: 3,
  };

  const shapExplanations = transaction.shapExplanations || [
    { featureName: "Transaction velocity spike", contributionPercent: 28, reasonText: "18 transfers in past 2 hours (+28 risk)", impactType: "high_risk" },
    { featureName: "Location anomaly", contributionPercent: 21, reasonText: "Attempted from Kolkata proxy IP (+21 risk)", impactType: "high_risk" },
    { featureName: "Unusual amount factor", contributionPercent: 19, reasonText: "400% above 30-day average deposit (+19 risk)", impactType: "high_risk" },
    { featureName: "Device footprint change", contributionPercent: 12, reasonText: "Unrecognized Firefox Android fingerprint (+12 risk)", impactType: "medium_risk" },
    { featureName: "Off-hours transaction", contributionPercent: 7, reasonText: "Initiated at 03:42 AM IST (+7 risk)", impactType: "medium_risk" },
  ];

  const isHighRisk = transaction.riskScore >= 70;

  const handleAction = (status: Transaction["status"], note: string) => {
    const updated: Transaction = {
      ...transaction,
      status,
      investigatorNotes: note,
      isReviewed: true,
    };
    
    if (onUpdateTransaction) {
      onUpdateTransaction(updated);
    }

    const actionText = status === "Cleared" ? "APPROVED" : status === "Rejected" ? "BLOCKED & REJECTED" : "PLACED ON HOLD";
    setActionFeedback(`Transaction #${transaction.txId} successfully ${actionText}!`);

    // Smoothly close drawer after showing confirmation
    setTimeout(() => {
      setActionFeedback(null);
      onClose();
    }, 700);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-xs transition-opacity duration-200"
    >
      <div
        className="w-full max-w-xl bg-[#0F141D] border-l border-[#202938] h-full flex flex-col shadow-2xl text-slate-100 overflow-hidden animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="px-5 py-4 bg-[#151B26] border-b border-[#202938] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <ShieldAlert className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-mono text-sm font-bold text-slate-100">
                  Case #{transaction.txId || transaction.id}
                </h2>
                <StatusBadge status={transaction.status} />
              </div>
              <p className="text-[11px] text-slate-400">
                Investigation Drawer · Press ESC or click outside to dismiss
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#080B12] border border-[#202938] text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Close Drawer (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Confirmation Feedback Banner */}
        {actionFeedback && (
          <div className="px-5 py-3 bg-emerald-500/10 border-b border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono flex items-center gap-2 animate-in fade-in duration-150">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionFeedback}</span>
          </div>
        )}

        {/* Risk Banner */}
        <div className="px-5 py-3 bg-[#080B12] border-b border-[#202938] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-mono font-bold text-slate-100">
              ₹{transaction.amount.toLocaleString()}
            </div>
            <div className="text-xs text-slate-400">
              Account: <span className="font-mono text-slate-200 font-semibold">{transaction.accountNumber}</span>
            </div>
          </div>
          <div className="text-right">
            <div
              className={`font-mono text-sm font-bold ${
                isHighRisk ? "text-rose-400" : "text-emerald-400"
              }`}
            >
              RISK {transaction.riskScore} / 100
            </div>
            <div className="text-[10px] text-slate-400">
              {transaction.riskCategory || "High Risk"}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#202938] bg-[#0F141D] px-5 text-xs">
          {[
            { id: "overview", label: "Overview" },
            { id: "ai", label: "AI Reasoning" },
            { id: "timeline", label: "Timeline" },
            { id: "network", label: "Network" },
            { id: "audit", label: "Audit Log" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-2.5 font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-sky-400 text-sky-400 font-semibold"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {activeTab === "overview" && (
            <div className="space-y-4 text-xs">
              {/* Primary Security Alert Details */}
              <div className="p-3.5 rounded-lg bg-[#151B26] border border-[#202938] space-y-2">
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
                  Primary Trigger Reason
                </div>
                <div className="text-slate-200 font-medium">
                  {transaction.primaryReason || "Unusual location + velocity spike"}
                </div>
                <div className="text-[11px] text-slate-400 flex justify-between pt-1 border-t border-[#202938]">
                  <span>Customer: <strong className="text-slate-200">{transaction.customerName}</strong></span>
                  <span>Timestamp: <strong className="text-slate-200">{transaction.timestamp}</strong></span>
                </div>
              </div>

              {/* Quick Transaction Breakdown Table */}
              <div className="p-3.5 rounded-lg bg-[#151B26] border border-[#202938] space-y-2">
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
                  Telemetry Parameters
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="bg-[#080B12] p-2 rounded border border-[#202938]">
                    <span className="text-slate-400 block text-[10px]">Type</span>
                    <span className="text-sky-400 font-bold">{transaction.type}</span>
                  </div>
                  <div className="bg-[#080B12] p-2 rounded border border-[#202938]">
                    <span className="text-slate-400 block text-[10px]">Destination</span>
                    <span className="text-slate-200">{transaction.destination || "External Account"}</span>
                  </div>
                  <div className="bg-[#080B12] p-2 rounded border border-[#202938]">
                    <span className="text-slate-400 block text-[10px]">Location Jump</span>
                    <span className="text-rose-400 font-bold">{features.distanceKm} km</span>
                  </div>
                  <div className="bg-[#080B12] p-2 rounded border border-[#202938]">
                    <span className="text-slate-400 block text-[10px]">Device Footprint</span>
                    <span className={features.loginDeviceChanged ? "text-amber-400 font-bold" : "text-emerald-400"}>
                      {features.loginDeviceChanged ? "Unrecognized" : "Known Device"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Top 3 Risk Factors */}
              <div className="space-y-2">
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
                  Key Risk Contributors
                </div>
                {(shapExplanations || []).slice(0, 3).map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded bg-[#151B26] border border-[#202938] flex justify-between items-center text-[11px]"
                  >
                    <div>
                      <div className="font-semibold text-slate-200">{item.featureName}</div>
                      <div className="text-[10px] text-slate-400">{item.reasonText}</div>
                    </div>
                    <span className="font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                      +{item.contributionPercent}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "ai" && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-lg bg-violet-500/10 border border-violet-500/20 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-violet-400" />
                    <span className="font-bold text-violet-300 uppercase tracking-wider text-[11px]">
                      AI Risk Assessment
                    </span>
                  </div>
                  <span className="text-[10px] text-violet-400 font-mono font-bold">
                    Confidence: {transaction.fraudProbability || 94.2}%
                  </span>
                </div>

                <div className="text-xl font-mono font-bold text-slate-100 flex items-center gap-2">
                  <span>Score: {transaction.riskScore} / 100</span>
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 text-xs uppercase font-sans">
                    {isHighRisk ? "High Risk" : "Low Risk"}
                  </span>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Random Forest ensemble model detected anomalous velocity patterns matching known Account Takeover (ATO) signatures.
                </p>
              </div>

              {/* Feature Impact Breakdown */}
              <div className="space-y-2">
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
                  Why? (SHAP Feature Contributions)
                </div>
                <div className="space-y-1.5 font-mono text-[11px]">
                  {shapExplanations.map((e, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded bg-[#151B26] border border-[#202938] flex items-center justify-between"
                    >
                      <span className="text-slate-300">{e.featureName}</span>
                      <span
                        className={`font-bold ${
                          e.impactType === "high_risk"
                            ? "text-rose-400"
                            : e.impactType === "medium_risk"
                            ? "text-amber-400"
                            : "text-emerald-400"
                        }`}
                      >
                        +{e.contributionPercent}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded bg-[#151B26] border border-[#202938] text-[11px] space-y-1">
                <div className="text-slate-400 font-semibold uppercase text-[10px]">Recommended Action</div>
                <div className="text-sky-400 font-bold">{transaction.recommendedAction || "Temporarily hold transaction & issue SMS challenge"}</div>
              </div>
            </div>
          )}

          {activeTab === "timeline" && (
            <div className="space-y-3 text-xs">
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
                Event Chronology
              </div>
              <div className="relative border-l-2 border-[#202938] ml-3 pl-4 space-y-4 text-[11px]">
                <div className="relative">
                  <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-rose-400 ring-4 ring-[#0F141D]" />
                  <div className="font-semibold text-slate-200">Transaction Attempted</div>
                  <div className="text-slate-400 text-[10px]">₹{transaction.amount} to {transaction.destination || "beneficiary"}</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">{transaction.timestamp}</div>
                </div>

                <div className="relative">
                  <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-amber-400 ring-4 ring-[#0F141D]" />
                  <div className="font-semibold text-slate-200">Random Forest Model Flagged High Velocity</div>
                  <div className="text-slate-400 text-[10px]">Risk score computed at {transaction.riskScore}/100</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">1 sec later</div>
                </div>

                <div className="relative">
                  <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-sky-400 ring-4 ring-[#0F141D]" />
                  <div className="font-semibold text-slate-200">Rule Triggered: Hold Applied</div>
                  <div className="text-slate-400 text-[10px]">Transaction status changed to {transaction.status}</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">2 sec later</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "network" && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-lg bg-[#151B26] border border-[#202938] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-slate-300 font-bold uppercase tracking-wider text-[11px]">
                    Connected Money Mule Topology
                  </span>
                  <span className="text-[10px] text-amber-400 font-mono font-bold">
                    12 Connected Accounts
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Target account is linked to a 3-node intermediary ring passing ₹4.8M over the last 24 hours.
                </p>
                {onOpenFullCase && (
                  <button
                    onClick={() => {
                      onOpenFullCase(transaction);
                      onClose();
                    }}
                    className="w-full py-2 rounded bg-sky-500/10 border border-sky-500/20 text-sky-400 font-bold hover:bg-sky-500/20 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Inspect Interactive Network Canvas</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTab === "audit" && (
            <div className="space-y-3 text-xs">
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
                Case Audit Trail
              </div>
              <div className="p-3 rounded bg-[#151B26] border border-[#202938] space-y-2 font-mono text-[11px]">
                <div className="flex justify-between text-slate-400">
                  <span>Operator</span>
                  <span className="text-slate-200">Harsh Ganeshwade (CISO)</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Last Action</span>
                  <span className="text-amber-400">{transaction.investigatorNotes || "Opened for review"}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Audit Risk Tag</span>
                  <span className="text-rose-400 font-bold">ELEVATED</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Controls Footer */}
        <div className="p-4 bg-[#151B26] border-t border-[#202938] flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={() => handleAction("Hold", "Flagged by investigator: Temporary Hold applied")}
            className="flex-1 py-2 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 font-semibold text-xs hover:bg-amber-500/20 transition-colors"
          >
            Hold Tx
          </button>
          <button
            onClick={() => handleAction("Rejected", "Rejected by investigator due to high fraud probability")}
            className="flex-1 py-2 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 font-semibold text-xs hover:bg-rose-500/20 transition-colors"
          >
            Block & Reject
          </button>
          <button
            onClick={() => handleAction("Cleared", "Approved by investigator: Verified genuine")}
            className="flex-1 py-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold text-xs hover:bg-emerald-500/20 transition-colors"
          >
            Approve Tx
          </button>
        </div>
      </div>
    </div>
  );
};
