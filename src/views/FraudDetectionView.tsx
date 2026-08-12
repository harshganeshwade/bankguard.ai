import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ShieldAlert,
  Search,
  Filter,
  Download,
  Brain,
  TrendingDown,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { Transaction } from "../types";
import { StatusBadge } from "../components/StatusBadge";
import { initialTransactions } from "../lib/initialData";
import { exportToCsv } from "../utils/downloadReport";

interface FraudOperationsCenterProps {
  onAnalyzeWithGemini?: (features: any) => Promise<any>;
  onInspectTx?: (tx: Transaction) => void;
  onTabSelect?: (tab: string) => void;
}

export const FraudDetectionView: React.FC<FraudOperationsCenterProps> = ({
  onInspectTx,
  onTabSelect,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState<string>("ALL");

  const [txs] = useState<Transaction[]>(initialTransactions);

  const filtered = txs.filter((t) => {
    const matchesSearch =
      t.txId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.accountNumber.toLowerCase().includes(searchTerm.toLowerCase());

    if (riskFilter === "HIGH") return matchesSearch && t.riskScore >= 70;
    if (riskFilter === "MEDIUM") return matchesSearch && t.riskScore >= 40 && t.riskScore < 70;
    if (riskFilter === "LOW") return matchesSearch && t.riskScore < 40;

    return matchesSearch;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans text-slate-100">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
            Fraud Operations Center
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time neural transaction scoring, anomaly evaluation, and automated hold enforcement.
          </p>
        </div>

        <button
          onClick={() =>
            exportToCsv(
              `Fraud_Operations_Report_${new Date().toISOString().split("T")[0]}.csv`,
              filtered.map((t) => ({
                Time: t.timestamp,
                Account: t.accountNumber,
                Customer: t.customerName,
                Amount: t.amount,
                RiskScore: t.riskScore,
                Status: t.status,
              }))
            )
          }
          className="px-3.5 py-1.5 rounded-lg bg-[#0F141D] border border-[#202938] text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-sky-400" />
          <span>Export Ledger</span>
        </button>
      </div>

      {/* Top Fraud Risk Summary & Risk Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-5 rounded-xl bg-[#0F141D] border border-[#202938]">
        {/* Left: Overall Fraud Risk */}
        <div className="md:col-span-4 border-b md:border-b-0 md:border-r border-[#202938] pb-4 md:pb-0 md:pr-6 space-y-2">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">
            FRAUD RISK
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-mono font-bold text-emerald-400">18</span>
            <span className="text-sm font-mono font-bold text-emerald-400">LOW</span>
          </div>
          <div className="text-xs text-emerald-400 font-mono flex items-center gap-1 pt-1">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>↓ 12% from yesterday</span>
          </div>
        </div>

        {/* Right: Risk Distribution Breakdown */}
        <div className="md:col-span-8 space-y-2 font-mono text-xs">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold font-sans">
            Risk Distribution
          </div>
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-slate-300">
              <span className="w-20 font-bold text-emerald-400">LOW</span>
              <div className="flex-1 mx-3 bg-[#080B12] h-2 rounded-full overflow-hidden border border-[#202938]">
                <div className="bg-emerald-400 h-full w-[76%]" />
              </div>
              <span className="text-slate-400 w-12 text-right">76%</span>
            </div>

            <div className="flex items-center justify-between text-slate-300">
              <span className="w-20 font-bold text-amber-400">MEDIUM</span>
              <div className="flex-1 mx-3 bg-[#080B12] h-2 rounded-full overflow-hidden border border-[#202938]">
                <div className="bg-amber-400 h-full w-[16%]" />
              </div>
              <span className="text-slate-400 w-12 text-right">16%</span>
            </div>

            <div className="flex items-center justify-between text-slate-300">
              <span className="w-20 font-bold text-rose-400">HIGH</span>
              <div className="flex-1 mx-3 bg-[#080B12] h-2 rounded-full overflow-hidden border border-[#202938]">
                <div className="bg-rose-400 h-full w-[6%]" />
              </div>
              <span className="text-slate-400 w-12 text-right">6%</span>
            </div>

            <div className="flex items-center justify-between text-slate-300">
              <span className="w-20 font-bold text-rose-500">CRITICAL</span>
              <div className="flex-1 mx-3 bg-[#080B12] h-2 rounded-full overflow-hidden border border-[#202938]">
                <div className="bg-rose-500 h-full w-[2%]" />
              </div>
              <span className="text-slate-400 w-12 text-right">2%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Table Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter by Account, Customer or Tx ID..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#0F141D] border border-[#202938] rounded-lg text-xs text-slate-100 focus:outline-none focus:border-sky-500 font-sans"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-[#0F141D] border border-[#202938] p-1 rounded-lg text-xs font-mono">
          {(["ALL", "HIGH", "MEDIUM", "LOW"] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setRiskFilter(lvl)}
              className={`px-3 py-1 rounded font-semibold transition-colors ${
                riskFilter === lvl
                  ? "bg-[#202938] text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Clean Transaction Table */}
      <div className="rounded-xl bg-[#0F141D] border border-[#202938] overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#080B12] text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-[#202938]">
            <tr>
              <th className="p-3.5">TIME</th>
              <th className="p-3.5">ACCOUNT</th>
              <th className="p-3.5">CUSTOMER</th>
              <th className="p-3.5 text-right">AMOUNT</th>
              <th className="p-3.5 text-center">RISK</th>
              <th className="p-3.5 text-right">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#202938]">
            <AnimatePresence mode="popLayout">
              {filtered.map((tx) => (
                <motion.tr
                  key={tx.id}
                  layout
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  onClick={() => onInspectTx && onInspectTx(tx)}
                  className="hover:bg-[#151B26] cursor-pointer transition-colors font-mono"
                >
                  <td className="p-3.5 text-slate-400 text-[11px]">{tx.timestamp.split(" ")[1] || "10:42"}</td>
                  <td className="p-3.5 text-slate-200 font-semibold">{tx.accountNumber}</td>
                  <td className="p-3.5 text-slate-300 font-sans font-medium">{tx.customerName}</td>
                  <td className="p-3.5 text-right font-bold text-white">
                    ₹{tx.amount.toLocaleString()}
                  </td>
                  <td className="p-3.5 text-center">
                    <span
                      className={`inline-block font-bold px-2 py-0.5 rounded border text-[11px] ${
                        tx.riskScore >= 70
                          ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                          : tx.riskScore >= 40
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      }`}
                    >
                      {tx.riskScore}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <StatusBadge status={tx.status === "Hold" ? "BLOCKED" : tx.status === "Pending Review" ? "REVIEW" : tx.status} />
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};
