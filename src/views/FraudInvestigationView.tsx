import React, { useState } from "react";
import {
  ShieldAlert,
  SearchCode,
  Phone,
  Ban,
  Snowflake,
  FileText,
  Save,
  MessageSquare,
  Brain,
  Network,
  Clock,
  Check,
  AlertTriangle,
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
  const [activeSubTab, setActiveSubTab] = useState<"Overview" | "Timeline" | "AI Analysis" | "Network" | "Audit Trail">("Overview");
  const [showSarModal, setShowSarModal] = useState(false);

  if (!transaction) {
    return (
      <div className="p-12 text-center bg-[#0F141D] border border-[#202938] rounded-xl space-y-4 max-w-2xl mx-auto">
        <SearchCode className="w-12 h-12 text-slate-500 mx-auto" />
        <h2 className="text-lg font-bold text-white font-sans">
          No Investigation Selected
        </h2>
        <p className="text-xs text-slate-400">
          Select any suspicious transaction from the Command Center or Fraud Operations to open a case file.
        </p>
        <button
          onClick={() => onTabSelect("fraud")}
          className="px-4 py-2 bg-sky-500 text-slate-950 font-bold text-xs rounded-lg"
        >
          Open Fraud Operations
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
    <div className="space-y-6 max-w-6xl mx-auto font-sans text-slate-100">
      {/* Case File Header (Requirement 10) */}
      <div className="p-6 rounded-xl bg-[#0F141D] border border-[#202938] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#202938] pb-4">
          <div>
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">
              Case #FRD-2026-0842
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white font-sans mt-0.5">
              Fraud Case File Investigation
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowSarModal(true)}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Generate SAR</span>
            </button>
            <button
              onClick={() => handleAction("Hold", "Temporary hold applied by investigator")}
              className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-bold text-xs border border-amber-500/30 transition-colors"
            >
              Hold Tx
            </button>
            <button
              onClick={() => handleAction("Cleared", "Approved by investigator: Verified genuine")}
              className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
            >
              Approve
            </button>
            <button
              onClick={() => handleAction("Rejected", "Blocked & Rejected by investigator due to high fraud probability")}
              className="px-3 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-xs transition-colors"
            >
              Reject & Block
            </button>
          </div>
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 font-mono text-xs pt-1">
          <div>
            <span className="text-slate-500 block text-[10px]">STATUS</span>
            <span className="text-amber-400 font-bold flex items-center gap-1 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Under Investigation</span>
            </span>
          </div>

          <div>
            <span className="text-slate-500 block text-[10px]">RISK</span>
            <span className="text-rose-400 font-bold mt-0.5 block">
              {transaction.riskScore} / 100
            </span>
          </div>

          <div>
            <span className="text-slate-500 block text-[10px]">TRANSACTION</span>
            <span className="text-white font-bold mt-0.5 block">
              ₹{transaction.amount.toLocaleString()}
            </span>
          </div>

          <div>
            <span className="text-slate-500 block text-[10px]">ACCOUNT</span>
            <span className="text-slate-200 font-bold mt-0.5 block">
              {transaction.accountNumber}
            </span>
          </div>

          <div className="col-span-2 md:col-span-1">
            <span className="text-slate-500 block text-[10px]">REASON</span>
            <span className="text-rose-300 truncate font-sans text-[11px] mt-0.5 block">
              {transaction.primaryReason || "Unusual location + velocity spike"}
            </span>
          </div>
        </div>
      </div>

      <SarReportModal
        isOpen={showSarModal}
        onClose={() => setShowSarModal(false)}
        transaction={transaction}
      />

      {statusMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg text-xs font-bold font-mono">
          ✓ {statusMsg}
        </div>
      )}

      {/* Investigation Sub-Tabs (Requirement 10) */}
      <div className="flex border-b border-[#202938] text-xs font-mono">
        {(["Overview", "Timeline", "AI Analysis", "Network", "Audit Trail"] as const).map(
          (tab) => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`px-4 py-2.5 font-semibold transition-colors border-b-2 -mb-px ${
                activeSubTab === tab
                  ? "border-sky-400 text-sky-400"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab}
            </button>
          )
        )}
      </div>

      {/* Sub-Tab Content Rendering */}
      {activeSubTab === "Overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-xl bg-[#0F141D] border border-[#202938] space-y-4 text-xs">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">
              Transaction Details
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono">
              <div className="p-3 rounded bg-[#080B12] border border-[#202938]">
                <span className="text-slate-500 text-[10px]">Customer Name</span>
                <span className="block text-slate-200 font-bold mt-0.5 font-sans">
                  {transaction.customerName}
                </span>
              </div>
              <div className="p-3 rounded bg-[#080B12] border border-[#202938]">
                <span className="text-slate-500 text-[10px]">Destination</span>
                <span className="block text-slate-200 font-bold mt-0.5">
                  {transaction.destination}
                </span>
              </div>
              <div className="p-3 rounded bg-[#080B12] border border-[#202938]">
                <span className="text-slate-500 text-[10px]">IP Address</span>
                <span className="block text-sky-400 font-bold mt-0.5">
                  {transaction.features.ipAddress}
                </span>
              </div>
              <div className="p-3 rounded bg-[#080B12] border border-[#202938]">
                <span className="text-slate-500 text-[10px]">Location Jump</span>
                <span className="block text-amber-400 font-bold mt-0.5">
                  {transaction.features.distanceKm} km
                </span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-[#0F141D] border border-[#202938] space-y-3 text-xs">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">
              Case Notes & Action Log
            </div>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter investigative notes, phone verification stamps, or law enforcement tags..."
              className="w-full bg-[#080B12] border border-[#202938] rounded-lg p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500 font-mono"
            />
            <button
              onClick={() => handleAction(transaction.status, "Notes Saved")}
              className="px-3.5 py-1.5 bg-sky-500 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Notes</span>
            </button>
          </div>
        </div>
      )}

      {activeSubTab === "Timeline" && (
        <div className="p-5 rounded-xl bg-[#0F141D] border border-[#202938] space-y-4 text-xs font-mono">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
            Chronological Activity Timeline
          </div>
          <div className="space-y-3 border-l-2 border-[#202938] pl-4">
            <div className="relative">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 absolute -left-[21px] top-1" />
              <div className="text-slate-200 font-bold">High-risk transaction initiated</div>
              <div className="text-slate-500 text-[10px]">10:42 AM · IP 185.220.101.4</div>
            </div>
            <div className="relative">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 absolute -left-[21px] top-1" />
              <div className="text-slate-200 font-bold">Automated hold triggered by neural model</div>
              <div className="text-slate-500 text-[10px]">10:42 AM · Risk Score 94</div>
            </div>
            <div className="relative">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400 absolute -left-[21px] top-1" />
              <div className="text-slate-200 font-bold">Case assigned to Harsh Ganeshwade</div>
              <div className="text-slate-500 text-[10px]">10:44 AM · SOC Investigator</div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === "AI Analysis" && (
        <div className="p-5 rounded-xl bg-[#0F141D] border border-[#202938] space-y-3 text-xs">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">
            AI Feature Importance (SHAP)
          </div>
          <div className="space-y-2 font-mono">
            {transaction.shapExplanations.map((s, i) => (
              <div key={i} className="p-2.5 bg-[#080B12] rounded border border-[#202938] flex justify-between">
                <div>
                  <span className="text-slate-200 font-bold block">{s.featureName}</span>
                  <span className="text-slate-500 text-[10px]">{s.reasonText}</span>
                </div>
                <span className="text-rose-400 font-bold">+{s.contributionPercent}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === "Network" && (
        <div className="p-5 rounded-xl bg-[#0F141D] border border-[#202938] space-y-3 text-xs font-mono">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
            Connected Topology Nodes
          </div>
          <p className="text-slate-400 font-sans">
            This transaction is linked to 3 intermediary passthrough nodes in the money mule topology cluster.
          </p>
          <button
            onClick={() => onTabSelect("mule-graph")}
            className="px-3.5 py-1.5 bg-sky-500 text-slate-950 font-bold text-xs rounded-lg"
          >
            Open Interactive Network Graph
          </button>
        </div>
      )}

      {activeSubTab === "Audit Trail" && (
        <div className="p-5 rounded-xl bg-[#0F141D] border border-[#202938] space-y-3 text-xs font-mono">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
            Immutable Audit Trail
          </div>
          <div className="p-3 bg-[#080B12] rounded border border-[#202938] text-[11px] text-slate-400">
            Hash: 0x8f2a4e91...b39c01d (Verified on ledger)
          </div>
        </div>
      )}
    </div>
  );
};
