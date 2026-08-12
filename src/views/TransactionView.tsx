import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Filter,
  Eye,
  ShieldAlert,
  ArrowRight,
  Download,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Transaction, TransactionType } from "../types";
import { exportToCsv } from "../utils/downloadReport";

interface TransactionViewProps {
  transactions: Transaction[];
  onSelectTransaction: (tx: Transaction) => void;
  onTabSelect: (tab: string) => void;
}

export const TransactionView: React.FC<TransactionViewProps> = ({
  transactions,
  onSelectTransaction,
  onTabSelect,
}) => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [riskFilter, setRiskFilter] = useState("Any");

  const filtered = transactions.filter((t) => {
    const matchSearch =
      t.txId.toLowerCase().includes(search.toLowerCase()) ||
      t.customerName.toLowerCase().includes(search.toLowerCase()) ||
      t.accountNumber.includes(search) ||
      t.destination.toLowerCase().includes(search.toLowerCase());

    const matchType = typeFilter === "All" || t.type === typeFilter;

    let matchRisk = true;
    if (riskFilter === "Safe") matchRisk = t.riskScore < 25;
    if (riskFilter === "Warning") matchRisk = t.riskScore >= 25 && t.riskScore < 60;
    if (riskFilter === "Danger") matchRisk = t.riskScore >= 60;

    return matchSearch && matchType && matchRisk;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#bec6e0] font-headline-md">
            Transaction Monitor
          </h1>
          <p className="text-sm text-[#c6c6cd] mt-1">
            Live feed of global financial network activity & real-time risk scoring.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#c6c6cd]" />
            <input
              type="text"
              placeholder="Search TxID, Account, Destination..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0F172A] border border-[#334155] rounded-lg py-2 pl-10 pr-4 text-xs text-[#d4e4fa] placeholder-[#909097] focus:outline-none focus:border-[#38BDF8]"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-[#0F172A] border border-[#334155] text-xs text-[#d4e4fa] rounded-lg px-3 py-2 focus:outline-none cursor-pointer"
          >
            <option value="All">All Types</option>
            <option value="UPI">UPI</option>
            <option value="NEFT">NEFT</option>
            <option value="ATM">ATM</option>
            <option value="Transfer">Transfer</option>
            <option value="Deposit">Deposit</option>
            <option value="Withdrawal">Withdrawal</option>
            <option value="IMPS">IMPS</option>
            <option value="RTGS">RTGS</option>
          </select>

          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="bg-[#0F172A] border border-[#334155] text-xs text-[#d4e4fa] rounded-lg px-3 py-2 focus:outline-none cursor-pointer"
          >
            <option value="Any">Any Risk</option>
            <option value="Safe">Safe (&lt;25%)</option>
            <option value="Warning">Warning (25-60%)</option>
            <option value="Danger">Danger (&gt;60%)</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-[#334155] flex justify-between items-center bg-[#0F172A]">
          <h2 className="text-xs font-bold text-[#38BDF8] tracking-widest uppercase">
            Live Transaction Feed
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#c6c6cd]">
              Showing {filtered.length} of {transactions.length} records
            </span>
            <button
              onClick={() =>
                exportToCsv(
                  `Transactions_Log_${new Date().toISOString().split("T")[0]}.csv`,
                  filtered.map((t) => ({
                    TxID: t.txId,
                    Customer: t.customerName,
                    Account: t.accountNumber,
                    Type: t.type,
                    Amount: `INR ${t.amount}`,
                    Destination: t.destination,
                    RiskScore: t.riskScore,
                    Status: t.status,
                    Timestamp: t.timestamp,
                  }))
                )
              }
              className="bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-[#38BDF8] text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[750px]">
            <thead>
              <tr className="bg-[#0D1C2D] border-b border-[#334155] text-[10px] text-[#c6c6cd] font-bold uppercase tracking-wider">
                <th className="p-4 w-12 text-center">Status</th>
                <th className="p-4">TxID / Time</th>
                <th className="p-4">Origin / Destination</th>
                <th className="p-4">Type</th>
                <th className="p-4 text-right">Amount (INR)</th>
                <th className="p-4 w-36">Risk Score</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#334155] text-xs">
              <AnimatePresence mode="popLayout">
                {filtered.map((t) => {
                  const isHighRisk = t.riskScore >= 60;
                  const isMediumRisk = t.riskScore >= 25 && t.riskScore < 60;

                  return (
                    <motion.tr
                      key={t.id}
                      layout
                      initial={{ opacity: 0, y: 12, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -12, scale: 0.98 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      className={`hover:bg-[#334155] transition-colors group ${
                        isHighRisk ? "bg-red-950/20" : ""
                      }`}
                    >
                    {/* Status Dot */}
                    <td className="p-4 text-center">
                      <div
                        className={`w-3 h-3 rounded-full mx-auto shadow-sm ${
                          isHighRisk
                            ? "bg-[#EF4444] shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse"
                            : isMediumRisk
                            ? "bg-[#F59E0B] shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                            : "bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                        }`}
                      ></div>
                    </td>

                    {/* TxID / Time */}
                    <td className="p-4 font-mono">
                      <div className={`font-bold ${isHighRisk ? "text-red-400" : "text-[#d4e4fa]"}`}>
                        {t.txId}
                      </div>
                      <div className="text-[10px] text-[#909097] mt-0.5">
                        {t.timestamp}
                      </div>
                    </td>

                    {/* Origin / Dest */}
                    <td className="p-4">
                      <div className="text-[#d4e4fa] truncate max-w-[180px]">
                        {t.customerName} ({(t.accountNumber || "").slice(-4)})
                      </div>
                      <div className="text-[#c6c6cd] text-[11px] truncate max-w-[180px] mt-0.5">
                        &rarr; {t.destination}
                      </div>
                    </td>

                    {/* Type Badge */}
                    <td className="p-4">
                      <span className="bg-[#0F172A] border border-[#334155] px-2 py-0.5 rounded text-[10px] font-bold text-[#d4e4fa]">
                        {t.type}
                      </span>
                    </td>

                    {/* Amount */}
                    <td
                      className={`p-4 text-right font-mono font-bold ${
                        isHighRisk ? "text-red-400" : "text-[#d4e4fa]"
                      }`}
                    >
                      ₹{t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>

                    {/* Risk Score */}
                    <td className="p-4">
                      <div className="w-full bg-[#0F172A] rounded-full h-1.5 border border-[#334155] overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            isHighRisk
                              ? "bg-[#EF4444]"
                              : isMediumRisk
                              ? "bg-[#F59E0B]"
                              : "bg-[#10B981]"
                          }`}
                          style={{ width: `${t.riskScore}%` }}
                        ></div>
                      </div>
                      <div
                        className={`text-[10px] mt-1 text-right font-mono font-bold ${
                          isHighRisk
                            ? "text-[#EF4444]"
                            : isMediumRisk
                            ? "text-[#F59E0B]"
                            : "text-[#c6c6cd]"
                        }`}
                      >
                        {t.riskScore}/100
                      </div>
                    </td>

                    {/* Action */}
                    <td className="p-4 text-center">
                      {isHighRisk ? (
                        <button
                          onClick={() => {
                            onSelectTransaction(t);
                            onTabSelect("investigate");
                          }}
                          className="bg-[#EF4444]/10 border border-[#EF4444] text-[#EF4444] px-2.5 py-1 rounded text-[10px] font-bold hover:bg-[#EF4444] hover:text-white transition-colors"
                        >
                          REVIEW
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            onSelectTransaction(t);
                            onTabSelect("investigate");
                          }}
                          className="text-[#c6c6cd] hover:text-[#38BDF8] transition-colors p-1"
                          title="Inspect Payload"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
