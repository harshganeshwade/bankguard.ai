import React, { useState } from "react";
import {
  ShieldAlert,
  SearchCode,
  UserCheck,
  Phone,
  Ban,
  Snowflake,
  Check,
  X,
  AlertTriangle,
  FileText,
  Save,
  MessageSquare,
  Sparkles,
  Network,
  Brain,
} from "lucide-react";
import { Transaction } from "../types";
import { SarReportModal } from "../components/SarReportModal";

interface FraudInvestigationViewProps {
  transaction: Transaction | null;
  onUpdateTransaction: (tx: Transaction) => void;
  onTabSelect: (tab: string) => void;
}

export const FraudInvestigationView: React.FC<FraudInvestigationViewProps> = ({
  transaction,
  onUpdateTransaction,
  onTabSelect,
}) => {
  const [showSarModal, setShowSarModal] = useState(false);

  if (!transaction) {
    return (
      <div className="p-12 text-center bg-[#1E293B] border border-[#334155] rounded-xl space-y-4">
        <SearchCode className="w-12 h-12 text-[#909097] mx-auto" />
        <h2 className="text-lg font-bold text-[#bec6e0]">
          No Transaction Selected for Investigation
        </h2>
        <p className="text-xs text-[#c6c6cd]">
          Select any flagged transaction from the Dashboard or Activity Monitor to inspect features & SHAP factors.
        </p>
        <button
          onClick={() => onTabSelect("activity")}
          className="px-4 py-2 bg-[#38BDF8] text-[#051424] font-bold text-xs rounded-lg"
        >
          View Activity Feed
        </button>
      </div>
    );
  }

  const [notes, setNotes] = useState(transaction.investigatorNotes || "");
  const [statusMsg, setStatusMsg] = useState("");

  const handleAction = (status: Transaction["status"], msg: string) => {
    const updated = {
      ...transaction,
      status,
      investigatorNotes: notes,
      isReviewed: true,
    };
    onUpdateTransaction(updated);
    setStatusMsg(msg);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-lg text-[#EF4444]">
              {transaction.txId}
            </span>
            <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30">
              Risk Score: {transaction.riskScore}/100
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#bec6e0] font-headline-md mt-1">
            Fraud Investigation Panel #INV-2049
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowSarModal(true)}
            className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            Generate SAR Report
          </button>
          <button
            onClick={() => onTabSelect("mule-graph")}
            className="px-3 py-2 bg-rose-500 hover:bg-rose-400 text-slate-950 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Network className="w-3.5 h-3.5" />
            Mule Graph
          </button>
          <button
            onClick={() => onTabSelect("xai-explain")}
            className="px-3 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Brain className="w-3.5 h-3.5" />
            SHAP XAI
          </button>
          <button
            onClick={() => handleAction("Hold", "Case Escalated to Lead Fraud Team")}
            className="px-3 py-2 bg-[#F59E0B] text-[#051424] text-xs font-bold rounded-lg hover:opacity-90 transition-opacity"
          >
            Escalate Case
          </button>
          <button
            onClick={() => handleAction("Cleared", "Transaction Override Approved")}
            className="px-3 py-2 bg-[#10B981] text-[#051424] text-xs font-bold rounded-lg hover:opacity-90 transition-opacity"
          >
            Approve & Clear
          </button>
          <button
            onClick={() => handleAction("Rejected", "Transaction Rejected & Account Frozen")}
            className="px-3 py-2 bg-[#EF4444] text-white text-xs font-bold rounded-lg hover:opacity-90 transition-opacity"
          >
            Reject & Block
          </button>
        </div>
      </div>

      <SarReportModal
        isOpen={showSarModal}
        onClose={() => setShowSarModal(false)}
        transaction={transaction}
      />

      {statusMsg && (
        <div className="p-3 bg-[#10B981]/10 border border-[#10B981] text-[#10B981] rounded-lg text-xs font-bold animate-fadeIn">
          {statusMsg}
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Transaction Details & Customer Summary */}
        <div className="lg:col-span-6 bg-[#1E293B] border border-[#334155] rounded-xl p-5 space-y-4 shadow-lg">
          <h2 className="text-xs font-bold text-[#38BDF8] uppercase tracking-wider border-b border-[#334155] pb-2">
            Transaction Payload Inspection
          </h2>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-[#0F172A] p-3 rounded-lg border border-[#334155]">
              <span className="text-[#909097] block mb-1">Customer</span>
              <span className="font-bold text-[#d4e4fa]">{transaction.customerName}</span>
              <span className="block text-[10px] text-[#c6c6cd] font-mono">
                {transaction.accountNumber}
              </span>
            </div>

            <div className="bg-[#0F172A] p-3 rounded-lg border border-[#334155]">
              <span className="text-[#909097] block mb-1">Amount</span>
              <span className="font-bold font-mono text-base text-[#EF4444]">
                ₹{transaction.amount.toLocaleString()}
              </span>
            </div>

            <div className="bg-[#0F172A] p-3 rounded-lg border border-[#334155]">
              <span className="text-[#909097] block mb-1">Beneficiary Destination</span>
              <span className="font-semibold text-[#d4e4fa]">{transaction.destination}</span>
            </div>

            <div className="bg-[#0F172A] p-3 rounded-lg border border-[#334155]">
              <span className="text-[#909097] block mb-1">IP & Geolocation</span>
              <span className="font-mono text-[#d4e4fa]">
                {transaction.features.ipAddress}
              </span>
              <span className="block text-[10px] text-[#F59E0B]">
                {transaction.features.location} ({transaction.features.distanceKm}km jump)
              </span>
            </div>
          </div>

          <div className="p-3 bg-[#0F172A] rounded-lg border border-[#334155] text-xs">
            <span className="text-[#909097] block font-semibold mb-1">
              Primary Threat Indicator
            </span>
            <span className="text-[#EF4444] font-semibold">
              {transaction.primaryReason}
            </span>
          </div>

          {/* Quick Intervention Buttons */}
          <div className="pt-2">
            <span className="text-[10px] font-bold text-[#909097] uppercase tracking-wider block mb-2">
              Instant Intervention Controls
            </span>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                onClick={() => alert(`Calling customer ${transaction.customerName} at registered phone number...`)}
                className="p-2.5 bg-[#0F172A] border border-[#334155] hover:border-[#38BDF8] rounded-lg text-center font-bold text-[#38BDF8] flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Contact User</span>
              </button>

              <button
                onClick={() => alert("Card successfully blocked in Card Management Module.")}
                className="p-2.5 bg-[#0F172A] border border-[#334155] hover:border-[#EF4444] rounded-lg text-center font-bold text-[#EF4444] flex items-center justify-center gap-1.5"
              >
                <Ban className="w-3.5 h-3.5" />
                <span>Block Card</span>
              </button>

              <button
                onClick={() => alert("Account status updated to Frozen.")}
                className="p-2.5 bg-[#0F172A] border border-[#334155] hover:border-[#F59E0B] rounded-lg text-center font-bold text-[#F59E0B] flex items-center justify-center gap-1.5"
              >
                <Snowflake className="w-3.5 h-3.5" />
                <span>Freeze Acc</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: SHAP Breakdown & Case Notes */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-5 space-y-3 shadow-lg">
            <h2 className="text-xs font-bold text-[#38BDF8] uppercase tracking-wider border-b border-[#334155] pb-2">
              SHAP Feature Explanation Summary
            </h2>
            <div className="space-y-2">
              {transaction.shapExplanations.map((shap, i) => (
                <div
                  key={i}
                  className="p-2.5 bg-[#0F172A] border border-[#334155] rounded-lg flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-semibold text-[#d4e4fa]">{shap.featureName}</div>
                    <div className="text-[10px] text-[#909097]">{shap.reasonText}</div>
                  </div>
                  <span
                    className={`font-mono font-bold ${
                      shap.contributionPercent > 0
                        ? "text-[#EF4444]"
                        : "text-[#10B981]"
                    }`}
                  >
                    {shap.contributionPercent > 0
                      ? `+${shap.contributionPercent}%`
                      : `${shap.contributionPercent}%`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Investigator Log Notes */}
          <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-5 space-y-3 shadow-lg">
            <h2 className="text-xs font-bold text-[#38BDF8] uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4" />
              <span>Auditor & Investigator Log Notes</span>
            </h2>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Record investigative findings, customer phone verification timestamps, or law enforcement reporting IDs..."
              className="w-full bg-[#0F172A] border border-[#334155] rounded-lg p-3 text-xs text-[#d4e4fa] placeholder-[#909097] focus:outline-none focus:border-[#38BDF8]"
            ></textarea>
            <button
              onClick={() => handleAction(transaction.status, "Investigator Notes Saved")}
              className="px-4 py-2 bg-[#38BDF8] text-[#051424] font-bold text-xs rounded-lg flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Investigator Notes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
