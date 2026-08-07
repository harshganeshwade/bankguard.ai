import React, { useState } from "react";
import {
  Users,
  CheckCircle2,
  Ban,
  Receipt,
  Download,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  ChevronRight,
  ShieldAlert,
  Building2,
  IndianRupee,
  LifeBuoy,
  User,
  MessageSquare,
  FileText,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Transaction, Customer, BankAccount, SupportTicket } from "../types";
import { exportToCsv } from "../utils/downloadReport";

interface OverviewViewProps {
  transactions: Transaction[];
  customers: Customer[];
  accounts: BankAccount[];
  tickets?: SupportTicket[];
  onTabSelect: (tab: string) => void;
  onSync: () => void;
  isSyncing: boolean;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  transactions,
  customers,
  accounts,
  tickets = [],
  onTabSelect,
  onSync,
  isSyncing,
}) => {
  const [velocityRange, setVelocityRange] = useState<"1H" | "24H" | "7D">("24H");

  const pendingTickets = tickets.filter((t) => t.status === "Pending Admin Review");
  const urgentTickets = tickets.filter((t) => t.priority === "Urgent" || t.priority === "High");

  // Sample Velocity chart data
  const velocityData = [
    { time: "08:00", count: 4000, isSpike: false },
    { time: "10:00", count: 6200, isSpike: false },
    { time: "12:00", count: 3100, isSpike: false },
    { time: "14:00", count: 7500, isSpike: false },
    { time: "16:00", count: 9500, isSpike: true }, // Anomaly spike
    { time: "18:00", count: 5200, isSpike: false },
    { time: "20:00", count: 7100, isSpike: false },
    { time: "22:00", count: 4800, isSpike: false },
  ];

  const blockedCount = accounts.filter((a) => a.status === "Blocked" || a.status === "Frozen").length + 138;
  const activeCount = accounts.filter((a) => a.status === "Active").length + 22100;
  const totalCustomers = customers.length + 24587;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#bec6e0] font-headline-md">
            Overview
          </h1>
          <p className="text-sm text-[#c6c6cd] mt-1">
            Real-time system monitoring, AI threat analysis, and operational banking metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              exportToCsv(
                `BankGuard_Overview_Metrics_${new Date().toISOString().split("T")[0]}.csv`,
                transactions.map((tx) => ({
                  TransactionID: tx.id,
                  Customer: tx.customerName,
                  Account: tx.accountNumber,
                  Amount: `INR ${tx.amount}`,
                  RiskScore: tx.riskScore,
                  Status: tx.status,
                  Timestamp: tx.timestamp,
                }))
              )
            }
            className="bg-[#1E293B] border border-[#334155] text-[#d4e4fa] text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#334155] transition-colors"
          >
            <Download className="w-4 h-4 text-[#38BDF8]" />
            <span>Export Report</span>
          </button>

          <button
            onClick={onSync}
            disabled={isSyncing}
            className="bg-[#38BDF8] text-[#051424] text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />
            <span>Sync Now</span>
          </button>
        </div>
      </div>

      {/* Bento Grid KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* KPI 1: Total Customers */}
        <div className="md:col-span-4 bg-[#1E293B] border border-[#334155] rounded-xl p-5 flex flex-col justify-between hover:border-[#38BDF8]/50 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#909097]">
              Total Customers
            </span>
            <div className="p-2 bg-[#0F172A] rounded-lg text-[#38BDF8]">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-[#bec6e0] tracking-tight">
              {totalCustomers.toLocaleString()}
            </div>
            <div className="text-xs text-[#10B981] font-semibold flex items-center gap-1 mt-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+1.2% from last week</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Active Accounts */}
        <div className="md:col-span-4 bg-[#1E293B] border border-[#334155] rounded-xl p-5 flex flex-col justify-between hover:border-[#38BDF8]/50 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#909097]">
              Active Accounts
            </span>
            <div className="p-2 bg-[#0F172A] rounded-lg text-[#10B981]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-[#bec6e0] tracking-tight">
              {activeCount.toLocaleString()}
            </div>
            <div className="text-xs text-[#c6c6cd] flex items-center gap-1 mt-2">
              <span>89.8% customer engagement rate</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Blocked / Flagged Accounts */}
        <div className="md:col-span-4 bg-[#1E293B] border border-[#EF4444]/40 rounded-xl p-5 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute inset-0 bg-[#EF4444]/5 pointer-events-none"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#c6c6cd]">
              Blocked / Flagged Accounts
            </span>
            <div className="p-2 bg-[#EF4444]/10 rounded-lg text-[#EF4444]">
              <Ban className="w-5 h-5" />
            </div>
          </div>
          <div className="relative z-10">
            <div className="text-4xl font-extrabold text-[#EF4444] tracking-tight">
              {blockedCount}
            </div>
            <div className="text-xs text-[#EF4444] font-semibold flex items-center gap-1 mt-2">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>+12 flagged by AI today</span>
            </div>
          </div>
        </div>

        {/* Chart Card: Transaction Velocity */}
        <div className="md:col-span-8 bg-[#1E293B] border border-[#334155] rounded-xl p-5 flex flex-col min-h-[320px]">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#909097]">
                Transaction Velocity
              </h3>
              <p className="text-xs text-[#c6c6cd] mt-0.5">
                Real-time volume analysis & anomaly spike detection
              </p>
            </div>
            <div className="flex gap-1.5 bg-[#0F172A] p-1 rounded-lg border border-[#334155]">
              {(["1H", "24H", "7D"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setVelocityRange(r)}
                  className={`text-xs px-2.5 py-1 rounded font-semibold transition-colors ${
                    velocityRange === r
                      ? "bg-[#38BDF8] text-[#051424]"
                      : "text-[#c6c6cd] hover:text-white"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 w-full min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={velocityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="time" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0F172A",
                    borderColor: "#334155",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {velocityData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.isSpike ? "#EF4444" : "#38BDF8"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* KPI Card 4: Today's Transactions Volume */}
        <div className="md:col-span-4 bg-[#1E293B] border border-[#334155] rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#909097]">
                Today's Transactions
              </span>
              <div className="p-2 bg-[#0F172A] rounded-lg text-[#38BDF8]">
                <Receipt className="w-5 h-5" />
              </div>
            </div>
            <div className="text-4xl font-extrabold text-[#bec6e0] tracking-tight">
              ₹4.25Cr
            </div>
            <div className="text-xs text-[#c6c6cd] mt-1">Processed Volume (24h)</div>
          </div>

          <div className="space-y-3 mt-6">
            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span className="text-[#c6c6cd]">Cleared</span>
                <span className="text-[#10B981] font-mono font-bold">92%</span>
              </div>
              <div className="w-full bg-[#0F172A] h-2 rounded-full overflow-hidden">
                <div className="bg-[#10B981] h-full w-[92%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span className="text-[#c6c6cd]">Pending Review</span>
                <span className="text-[#F59E0B] font-mono font-bold">6%</span>
              </div>
              <div className="w-full bg-[#0F172A] h-2 rounded-full overflow-hidden">
                <div className="bg-[#F59E0B] h-full w-[6%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span className="text-[#c6c6cd]">Rejected / Held</span>
                <span className="text-[#EF4444] font-mono font-bold">2%</span>
              </div>
              <div className="w-full bg-[#0F172A] h-2 rounded-full overflow-hidden">
                <div className="bg-[#EF4444] h-full w-[2%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Hub & Live Threat Cases & Employee Escalations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Flagged Threat Cases + Employee Escalations */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active High-Risk Fraud Cases */}
          <div className="bg-[#1E293B] border border-[#334155] rounded-xl overflow-hidden shadow-lg">
            <div className="p-4 border-b border-[#334155] bg-[#0F172A] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-[#EF4444]" />
                <h2 className="text-sm font-bold text-[#bec6e0] tracking-wide uppercase">
                  Active High-Risk Fraud Cases
                </h2>
              </div>
              <button
                onClick={() => onTabSelect("investigate")}
                className="text-xs text-[#38BDF8] hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Investigation Panel</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-[#334155]">
              {transactions
                .filter((t) => t.isFlagged)
                .slice(0, 3)
                .map((t) => (
                  <div
                    key={t.id}
                    onClick={() => onTabSelect("investigate")}
                    className="p-4 hover:bg-[#334155]/60 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-[#EF4444]">
                          {t.txId}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30">
                          RISK {t.fraudProbability}%
                        </span>
                        <span className="text-xs text-[#909097] font-mono">
                          {t.timestamp}
                        </span>
                      </div>
                      <div className="text-xs text-[#d4e4fa] font-medium">
                        {t.customerName} &rarr; {t.destination}
                      </div>
                      <div className="text-xs text-[#c6c6cd]">
                        {t.primaryReason}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <span className="font-mono text-sm font-bold text-[#EF4444]">
                        ₹{t.amount.toLocaleString()}
                      </span>
                      <button className="px-3 py-1 bg-[#EF4444]/10 border border-[#EF4444] text-[#EF4444] rounded text-xs font-bold hover:bg-[#EF4444] hover:text-white transition-colors">
                        REVIEW
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Employee Escalation Tickets Section */}
          <div className="bg-[#1E293B] border border-[#334155] rounded-xl overflow-hidden shadow-lg">
            <div className="p-4 border-b border-[#334155] bg-[#0F172A] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <LifeBuoy className="w-5 h-5 text-sky-400" />
                <h2 className="text-sm font-bold text-[#bec6e0] tracking-wide uppercase">
                  Employee Escalated Tickets & Help Desk
                </h2>
                {pendingTickets.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-mono font-bold">
                    {pendingTickets.length} Pending Review
                  </span>
                )}
              </div>
              <button
                onClick={() => onTabSelect("support")}
                className="text-xs text-[#38BDF8] hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Admin Inbox ({tickets.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-[#334155]">
              {tickets.length === 0 ? (
                <div className="p-6 text-center text-xs text-[#909097]">
                  No escalated employee tickets logged yet.
                </div>
              ) : (
                tickets.slice(0, 3).map((t) => (
                  <div
                    key={t.id}
                    onClick={() => onTabSelect("support")}
                    className="p-4 hover:bg-[#334155]/60 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-xs text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                          {t.ticketNumber}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            t.priority === "Urgent"
                              ? "bg-red-500/10 text-red-400 border-red-500/30"
                              : t.priority === "High"
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                              : "bg-slate-800 text-slate-300 border-slate-700"
                          }`}
                        >
                          {t.priority}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            t.status === "Pending Admin Review"
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                              : t.status === "In Investigation"
                              ? "bg-sky-500/10 text-sky-400 border-sky-500/20"
                              : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          }`}
                        >
                          {t.status}
                        </span>
                        <span className="text-xs text-[#909097] font-mono ml-auto">
                          {t.timestamp}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold">
                        <User className="w-3.5 h-3.5 text-sky-400" />
                        <span>{t.senderName} ({t.senderRole})</span>
                        <span className="text-[#909097] font-normal">&bull; Category: {t.category}</span>
                      </div>

                      <div className="text-xs font-bold text-[#d4e4fa]">
                        {t.subject}
                      </div>
                      <p className="text-xs text-[#c6c6cd] line-clamp-1">
                        {t.message}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onTabSelect("support");
                        }}
                        className="px-3 py-1.5 bg-sky-500/10 border border-sky-500/30 text-sky-400 hover:bg-sky-500 hover:text-slate-950 rounded text-xs font-bold transition-colors"
                      >
                        REVIEW & REPLY
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right: Quick Operational Modules */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#909097] mb-4">
              Quick Management Tools
            </h3>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => onTabSelect("support")}
                className="p-3 bg-[#0F172A] border border-[#334155] hover:border-[#38BDF8] rounded-lg text-left transition-all group col-span-2 bg-gradient-to-r from-sky-950/40 to-slate-900"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <LifeBuoy className="w-5 h-5 text-sky-400 group-hover:scale-110 transition-transform" />
                  <span className="px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 font-mono font-bold text-[10px]">
                    {pendingTickets.length} Pending
                  </span>
                </div>
                <div className="text-xs font-bold text-[#d4e4fa]">Employee Escalations & Support</div>
                <div className="text-[10px] text-[#909097]">Review Staff Help Desk Queries & Messaging Inbox</div>
              </button>

              <button
                onClick={() => onTabSelect("clients")}
                className="p-3 bg-[#0F172A] border border-[#334155] hover:border-[#38BDF8] rounded-lg text-left transition-all group"
              >
                <Users className="w-5 h-5 text-[#38BDF8] mb-1.5 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-bold text-[#d4e4fa]">Add Client</div>
                <div className="text-[10px] text-[#909097]">New KYC Onboarding</div>
              </button>

              <button
                onClick={() => onTabSelect("accounts")}
                className="p-3 bg-[#0F172A] border border-[#334155] hover:border-[#38BDF8] rounded-lg text-left transition-all group"
              >
                <Building2 className="w-5 h-5 text-[#10B981] mb-1.5 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-bold text-[#d4e4fa]">New Account</div>
                <div className="text-[10px] text-[#909097]">Savings / Current</div>
              </button>

              <button
                onClick={() => onTabSelect("loans")}
                className="p-3 bg-[#0F172A] border border-[#334155] hover:border-[#38BDF8] rounded-lg text-left transition-all group"
              >
                <IndianRupee className="w-5 h-5 text-[#F59E0B] mb-1.5 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-bold text-[#d4e4fa]">Loan Portal</div>
                <div className="text-[10px] text-[#909097]">EMI & Risk Scoring</div>
              </button>

              <button
                onClick={() => onTabSelect("labs")}
                className="p-3 bg-[#0F172A] border border-[#334155] hover:border-[#38BDF8] rounded-lg text-left transition-all group"
              >
                <ShieldAlert className="w-5 h-5 text-[#EF4444] mb-1.5 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-bold text-[#d4e4fa]">Attack Sandbox</div>
                <div className="text-[10px] text-[#909097]">Live Simulation</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
