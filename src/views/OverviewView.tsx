import React, { useState } from "react";
import {
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ArrowUpRight,
  Clock,
  ChevronRight,
  Download,
  RefreshCw,
  Activity,
  Shield,
  Search,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Transaction, Customer, BankAccount, SupportTicket } from "../types";
import { StatusBadge } from "../components/StatusBadge";
import { exportToCsv } from "../utils/downloadReport";

interface CommandCenterProps {
  transactions: Transaction[];
  customers: Customer[];
  accounts: BankAccount[];
  tickets?: SupportTicket[];
  onTabSelect: (tab: string) => void;
  onSync: () => void;
  isSyncing: boolean;
  onInspectTx?: (tx: Transaction) => void;
}

export const OverviewView: React.FC<CommandCenterProps> = ({
  transactions,
  customers,
  accounts,
  tickets = [],
  onTabSelect,
  onSync,
  isSyncing,
  onInspectTx,
}) => {
  const activityData = [
    { time: "00:00", volume: 1.2, txCount: 1200, riskScore: 12 },
    { time: "04:00", volume: 0.8, txCount: 850, riskScore: 15 },
    { time: "08:00", volume: 3.4, txCount: 3400, riskScore: 22 },
    { time: "12:00", volume: 6.8, txCount: 5200, riskScore: 18 },
    { time: "16:00", volume: 8.2, txCount: 6100, riskScore: 42 },
    { time: "20:00", volume: 4.4, txCount: 1679, riskScore: 20 },
  ];

  const recentEvents = [
    {
      id: "EVT-101",
      label: "High-risk transaction detected",
      time: "2 min",
      type: "critical",
      tx: transactions[0],
    },
    {
      id: "EVT-102",
      label: "Login anomaly detected (Kolkata Proxy)",
      time: "8 min",
      type: "warning",
      tx: transactions[1],
    },
    {
      id: "EVT-103",
      label: "Account •••• 4921 temporarily blocked",
      time: "14 min",
      type: "critical",
      tx: transactions[2],
    },
    {
      id: "EVT-104",
      label: "Attack simulation completed (100% blocked)",
      time: "21 min",
      type: "normal",
      tx: transactions[3],
    },
  ];

  const currentDate = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans text-slate-100">
      {/* Top Header & System Health Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
              Good evening, Harsh
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Security operations overview
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                exportToCsv(
                  `BankGuard_Security_Operations_${new Date().toISOString().split("T")[0]}.csv`,
                  transactions.map((tx) => ({
                    TxID: tx.txId,
                    Customer: tx.customerName,
                    Amount: tx.amount,
                    RiskScore: tx.riskScore,
                    Status: tx.status,
                    Timestamp: tx.timestamp,
                  }))
                )
              }
              className="px-3 py-1.5 rounded-lg bg-[#0F141D] border border-[#202938] text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              <span>Export</span>
            </button>
            <button
              onClick={onSync}
              disabled={isSyncing}
              className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
              <span>Sync</span>
            </button>
          </div>
        </div>

        {/* System Operational Status Row */}
        <div className="flex items-center justify-between py-2 border-y border-[#202938] text-xs font-mono">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>SYSTEM HEALTHY</span>
          </div>
          <span className="text-slate-500">{currentDate}</span>
        </div>
      </div>

      {/* Primary Metrics (Non-card layout) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-2 border-b border-[#202938]">
        <div>
          <div className="text-2xl font-mono font-bold text-white tracking-tight">
            ₹ 24.8M
          </div>
          <div className="text-xs text-slate-400 mt-1 font-sans">
            Transaction Volume
          </div>
          <div className="text-[11px] text-rose-400 font-mono mt-1 flex items-center gap-1">
            <TrendingDown className="w-3 h-3" />
            <span>↓ 3.2% vs yesterday</span>
          </div>
        </div>

        <div>
          <div className="text-2xl font-mono font-bold text-white tracking-tight">
            18,429
          </div>
          <div className="text-xs text-slate-400 mt-1 font-sans">
            Transactions
          </div>
          <div className="text-[11px] text-emerald-400 font-mono mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>↑ 8.4% vs yesterday</span>
          </div>
        </div>

        <div>
          <div className="text-2xl font-mono font-bold text-white tracking-tight">
            27
          </div>
          <div className="text-xs text-slate-400 mt-1 font-sans">
            Alerts
          </div>
          <div className="text-[11px] text-amber-400 font-mono mt-1 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            <span>↑ 2 unresolved</span>
          </div>
        </div>
      </div>

      {/* Security Status Section */}
      <div className="space-y-3">
        <div className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">
          SECURITY STATUS
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          <div className="p-4 rounded-xl bg-[#0F141D] border border-[#202938] flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 font-medium">Fraud Risk</div>
              <div className="text-xl font-mono font-bold text-emerald-400 mt-1">
                LOW
              </div>
              <div className="text-[11px] font-mono text-slate-500">18 / 100</div>
            </div>
            <StatusBadge status="ACTIVE" />
          </div>

          <div className="p-4 rounded-xl bg-[#0F141D] border border-[#202938] flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 font-medium">System Health</div>
              <div className="text-xl font-mono font-bold text-emerald-400 mt-1">
                HEALTHY
              </div>
              <div className="text-[11px] font-mono text-slate-500">99.98%</div>
            </div>
            <StatusBadge status="HEALTHY" />
          </div>

          <div className="p-4 rounded-xl bg-[#0F141D] border border-[#202938] flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 font-medium">Attack Defense</div>
              <div className="text-xl font-mono font-bold text-sky-400 mt-1">
                ACTIVE
              </div>
              <div className="text-[11px] font-mono text-slate-500">100%</div>
            </div>
            <StatusBadge status="ACTIVE" />
          </div>
        </div>
      </div>

      {/* Transaction Activity Graph */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">
            TRANSACTION ACTIVITY
          </div>
          <span className="text-[11px] text-slate-500 font-mono">24H Volume Curve</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0F141D] border border-[#202938] h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activityData}>
              <defs>
                <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#38BDF8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} unit="M" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0F141D",
                  borderColor: "#202938",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="volume"
                stroke="#38BDF8"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorVol)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Security Events */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">
            RECENT SECURITY EVENTS
          </div>
          <button
            onClick={() => onTabSelect("fraud")}
            className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1"
          >
            <span>Fraud Operations</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-4 rounded-xl bg-[#0F141D] border border-[#202938] divide-y divide-[#202938]">
          {recentEvents.map((evt) => (
            <div
              key={evt.id}
              onClick={() => {
                if (onInspectTx && evt.tx) {
                  onInspectTx(evt.tx);
                } else {
                  onTabSelect("fraud");
                }
              }}
              className="py-3 flex items-center justify-between hover:bg-[#151B26] px-2 rounded-lg cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-2 h-2 rounded-full ${
                    evt.type === "critical"
                      ? "bg-rose-500"
                      : evt.type === "warning"
                      ? "bg-amber-400"
                      : "bg-emerald-400"
                  }`}
                />
                <span className="text-xs text-slate-200 font-medium">
                  {evt.label}
                </span>
              </div>
              <div className="flex items-center gap-3 font-mono text-xs text-slate-500">
                <span>{evt.time}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
