import React, { useState } from "react";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { Ticker } from "./components/Ticker";
import { MobileNav } from "./components/MobileNav";
import { OverviewView } from "./views/OverviewView";
import { CustomerView } from "./views/CustomerView";
import { AccountView } from "./views/AccountView";
import { TransactionView } from "./views/TransactionView";
import { FraudDetectionView } from "./views/FraudDetectionView";
import { FraudInvestigationView } from "./views/FraudInvestigationView";
import { AuditLogView } from "./views/AuditLogView";
import { AuthView } from "./views/AuthView";
import { SecuritySpecModal } from "./components/SecuritySpecModal";
import { MuleNetworkGraphView } from "./views/MuleNetworkGraphView";
import { ExplainableAiView } from "./views/ExplainableAiView";
import { CyberSecurityZkpView } from "./views/CyberSecurityZkpView";
import { AttackLabView } from "./views/AttackLabView";
import { SupportHelpDeskView } from "./views/SupportHelpDeskView";
import {
  initialCustomers,
  initialAccounts,
  initialTransactions,
  initialAuditLogs,
  initialNotifications,
  initialEmployees,
  initialBranches,
  initialATMs,
  initialLoans,
  initialCards,
  initialSupportTickets,
} from "./lib/initialData";
import { exportToCsv, downloadFile } from "./utils/downloadReport";
import {
  UserRole,
  Customer,
  BankAccount,
  Transaction,
  AuditLog,
  NotificationItem,
  RandomForestFeatures,
  SupportTicket,
} from "./types";
import {
  Landmark,
  Briefcase,
  Building2,
  Layers,
  CreditCard,
  FileSpreadsheet,
  BarChart3,
  FlaskConical,
  Lock,
  LifeBuoy,
  Shield,
  Zap,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userSession, setUserSession] = useState<{
    username: string;
    email: string;
    role: UserRole;
    token: string;
  }>({
    username: "Vikramaditya Rao",
    email: "vikramaditya.rao@bankguard.ai",
    role: "Admin",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ2aWtyYW1hZGl0eWEucmFvIiwicm9sZSI6IkFkbWluIn0.s6a89c7d81f2340a92e1",
  });
  const [showSecuritySpec, setShowSecuritySpec] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<string>("dash");
  const [currentRole, setCurrentRole] = useState<UserRole>("Admin");
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // State collections
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [accounts, setAccounts] = useState<BankAccount[]>(initialAccounts);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(initialSupportTickets);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(
    initialTransactions[0] || null
  );

  // Ticket Handlers
  const handleAddTicket = (ticket: SupportTicket) => {
    setSupportTickets((prev) => [ticket, ...prev]);
    setNotifications((prev) => [
      {
        id: `NOTIF-${Date.now()}`,
        title: `Help Desk Escalation: ${ticket.ticketNumber}`,
        message: `${ticket.senderName} (${ticket.senderRole}) submitted ticket: "${ticket.subject}"`,
        type: "system",
        severity: ticket.priority === "Urgent" ? "high" : "medium",
        timestamp: "Just now",
        read: false,
      },
      ...prev,
    ]);
  };

  const handleUpdateTicketStatus = (ticketId: string, status: SupportTicket["status"]) => {
    setSupportTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status } : t))
    );
  };

  const handleAddAdminReply = (ticketId: string, replyText: string) => {
    const newReply = {
      id: `R-${Date.now()}`,
      sender: `${userSession.username || "Admin"} (CISO / Admin)`,
      text: replyText,
      timestamp: "Just now",
    };
    setSupportTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              status: t.status === "Pending Admin Review" ? "In Investigation" : t.status,
              adminReplies: [...(t.adminReplies || []), newReply],
            }
          : t
      )
    );
  };

  // Sync state handler
  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      const newAudit: AuditLog = {
        id: `AUD-${Math.floor(100 + Math.random() * 900)}`,
        timestamp: new Date().toISOString().replace("T", " ").slice(0, 23),
        username: "System_Auto",
        role: currentRole,
        ip: "10.0.0.1 (Internal Service)",
        browser: "Node.js Service",
        device: "Cloud Node #102",
        action: "Manual Telemetry & AI Model Sync",
        previousValue: "Sync State: Idle",
        newValue: "Sync State: Success (0ms latency)",
        riskTag: "ROUTINE",
      };
      setAuditLogs((prev) => [newAudit, ...prev]);
    }, 800);
  };

  // Notification handlers
  const handleMarkNotifRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleClearNotifs = () => {
    setNotifications([]);
  };

  // Customer Handlers
  const handleAddCustomer = (newCust: Customer) => {
    setCustomers((prev) => [newCust, ...prev]);
    const audit: AuditLog = {
      id: `AUD-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 23),
      username: `${currentRole}_Operator`,
      role: currentRole,
      ip: "192.168.1.45",
      browser: "Chrome 122.0",
      device: "Workstation",
      action: "Onboarded Customer",
      previousValue: "None",
      newValue: `Customer: ${newCust.name} (${newCust.id})`,
      riskTag: "LOW",
    };
    setAuditLogs((prev) => [audit, ...prev]);
  };

  const handleUpdateCustomer = (updated: Customer) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
  };

  const handleDeleteCustomer = (id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  };

  // Account Handlers
  const handleAddAccount = (acc: BankAccount) => {
    setAccounts((prev) => [acc, ...prev]);
  };

  const handleUpdateAccount = (acc: BankAccount) => {
    setAccounts((prev) => prev.map((a) => (a.id === acc.id ? acc : a)));
  };

  // Transaction Handlers
  const handleUpdateTransaction = (updatedTx: Transaction) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === updatedTx.id ? updatedTx : t))
    );
    setSelectedTx(updatedTx);
  };

  // Gemini AI Analysis API Call
  const handleAnalyzeWithGemini = async (features: RandomForestFeatures) => {
    try {
      const response = await fetch("/api/ai-analyze-fraud", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transaction: selectedTx,
          riskScore: selectedTx?.riskScore || 92,
          features,
        }),
      });
      const data = await response.json();
      if (data.success && data.analysis) {
        return data.analysis;
      }
      return {
        summary: "High-risk anomalous behavior detected across velocity and geographic jump factors.",
        threatCategory: "Account Takeover / Foreign VPN Spurt",
        confidence: "98.2%",
      };
    } catch (e) {
      console.error(e);
      return {
        summary: "Anomalous velocity spike detected across multiple endpoints.",
        threatCategory: "Geographic Discrepancy",
        confidence: "94.5%",
      };
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-50 font-sans select-none overflow-hidden">
      {/* Security Specifications Modal */}
      <SecuritySpecModal
        isOpen={showSecuritySpec}
        onClose={() => setShowSecuritySpec(false)}
      />

      {!isAuthenticated ? (
        <AuthView
          onLoginSuccess={(session) => {
            setUserSession(session);
            setCurrentRole(session.role);
            setIsAuthenticated(true);
          }}
          onOpenSecuritySpec={() => setShowSecuritySpec(true)}
        />
      ) : (
        <>
          {/* Top Navigation */}
          <Header
            currentRole={currentRole}
            onRoleChange={setCurrentRole}
            notifications={notifications}
            onMarkNotificationRead={handleMarkNotifRead}
            onClearNotifications={handleClearNotifs}
            onSync={handleSync}
            isSyncing={isSyncing}
            activeTab={activeTab}
            onTabSelect={setActiveTab}
            userName={userSession.username}
            userEmail={userSession.email}
            onLogout={() => setIsAuthenticated(false)}
            onOpenSecuritySpec={() => setShowSecuritySpec(true)}
          />

      {/* Ticker Stream */}
      <Ticker alerts={[]} />

      {/* Main App Layout */}
      <div className="flex flex-1 overflow-hidden pt-24 pb-16 md:pb-0">
        {/* Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          onTabSelect={setActiveTab}
          currentRole={currentRole}
          pendingTicketsCount={supportTickets.filter((t) => t.status === "Pending Admin Review").length}
        />

        {/* Content View Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 md:ml-56 bg-slate-950">
          {activeTab === "dash" && (
            <OverviewView
              transactions={transactions}
              customers={customers}
              accounts={accounts}
              tickets={supportTickets}
              onTabSelect={setActiveTab}
              onSync={handleSync}
              isSyncing={isSyncing}
            />
          )}

          {activeTab === "fraud" && (
            <FraudDetectionView onAnalyzeWithGemini={handleAnalyzeWithGemini} />
          )}

          {activeTab === "mule-graph" && <MuleNetworkGraphView transactions={transactions} />}

          {activeTab === "xai-explain" && <ExplainableAiView />}

          {activeTab === "zkp-biometrics" && <CyberSecurityZkpView />}

          {activeTab === "attack-lab" && <AttackLabView />}

          {activeTab === "investigate" && (
            <FraudInvestigationView
              transaction={selectedTx}
              onUpdateTransaction={handleUpdateTransaction}
              onTabSelect={setActiveTab}
            />
          )}

          {activeTab === "clients" && (
            <CustomerView
              customers={customers}
              onAddCustomer={handleAddCustomer}
              onUpdateCustomer={handleUpdateCustomer}
              onDeleteCustomer={handleDeleteCustomer}
            />
          )}

          {activeTab === "accounts" && (
            <AccountView
              accounts={accounts}
              onAddAccount={handleAddAccount}
              onUpdateAccount={handleUpdateAccount}
            />
          )}

          {activeTab === "activity" && (
            <TransactionView
              transactions={transactions}
              onSelectTransaction={(tx) => {
                setSelectedTx(tx);
                setActiveTab("investigate");
              }}
              onTabSelect={setActiveTab}
            />
          )}

          {activeTab === "loans" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                    <Landmark className="w-6 h-6 text-sky-400" />
                    Loan Management & Risk Underwriting
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage home, personal, and business loans with automated credit risk scoring.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      exportToCsv(
                        `Loan_Risk_Underwriting_Report_${new Date().toISOString().split("T")[0]}.csv`,
                        initialLoans.map((l) => ({
                          LoanNumber: l.loanNumber,
                          Customer: l.customerName,
                          Type: l.loanType,
                          AmountINR: l.amount,
                          EMIMonthly: l.emiAmount,
                          InterestRate: `${l.interestRate}%`,
                          CreditScore: l.creditScore,
                          Status: l.status,
                        }))
                      )
                    }
                    className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-800 text-sky-400 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    Export Loan Report (CSV)
                  </button>
                  <button
                    onClick={() => alert("New Loan Application Workflow initiated. Automated underwriting AI active.")}
                    className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs"
                  >
                    + New Loan Application
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {initialLoans.map((loan) => (
                  <div key={loan.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="font-mono text-xs text-sky-400 font-bold">{loan.loanNumber}</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                        {loan.status}
                      </span>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-slate-100">₹{loan.amount.toLocaleString()}</div>
                      <div className="text-xs text-slate-400">{loan.customerName} ({loan.loanType} Loan)</div>
                    </div>
                    <div className="text-xs space-y-1 text-slate-300 border-t border-slate-800/80 pt-2 font-mono">
                      <div className="flex justify-between">
                        <span>EMI:</span>
                        <span className="font-bold text-slate-100">₹{loan.emiAmount}/mo</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Interest Rate:</span>
                        <span>{loan.interestRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Credit Score:</span>
                        <span className="text-emerald-400 font-bold">{loan.creditScore}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "employees" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                    <Briefcase className="w-6 h-6 text-sky-400" />
                    Employees & Access Management
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Staff roster, department assignments, and operational security clearances.
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-slate-900/60 border border-slate-800 overflow-hidden">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-3">Emp Code</th>
                      <th className="p-3">Name</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Department</th>
                      <th className="p-3">Branch</th>
                      <th className="p-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {initialEmployees.map((emp) => (
                      <tr key={emp.id} className="hover:bg-slate-800/30">
                        <td className="p-3 font-mono text-sky-400 font-semibold">{emp.empCode}</td>
                        <td className="p-3 font-medium text-slate-100">{emp.name}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 text-[10px] font-bold border border-sky-500/20">
                            {emp.role}
                          </span>
                        </td>
                        <td className="p-3 text-slate-400">{emp.department}</td>
                        <td className="p-3 text-slate-400">{emp.branchName}</td>
                        <td className="p-3 text-right">
                          <span className="text-emerald-400 font-bold">Active</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "branches" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                    <Building2 className="w-6 h-6 text-sky-400" />
                    Branch Offices & Financial Performance
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Regional branch network health, customer counts, and revenue telemetry.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {initialBranches.map((b) => (
                  <div key={b.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-slate-100 text-sm">{b.name}</h3>
                        <p className="text-[11px] text-slate-400">{b.address}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                        {b.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs font-mono bg-slate-950 p-3 rounded-lg border border-slate-800">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Customers</span>
                        <span className="font-bold text-slate-200">{b.customerCount}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Staff</span>
                        <span className="font-bold text-slate-200">{b.employeeCount}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Monthly Rev</span>
                        <span className="font-bold text-emerald-400">₹{(b.monthlyRevenue / 1000).toFixed(0)}k</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "atms" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                    <Layers className="w-6 h-6 text-sky-400" />
                    ATM Infrastructure Monitor
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Real-time ATM cash levels, hardware diagnostics, and tamper sensor alerts.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {initialATMs.map((atm) => (
                  <div key={atm.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-mono font-bold text-xs text-sky-400">{atm.code}</span>
                        <h3 className="font-semibold text-slate-200 text-xs">{atm.location}</h3>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          atm.status === "Online"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : atm.status === "Low Cash"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            : "bg-red-500/10 text-red-400 border-red-500/20"
                        }`}
                      >
                        {atm.status}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Cash Level</span>
                        <span className="font-mono text-slate-200 font-bold">₹{atm.cashRemaining.toLocaleString()} / ₹{atm.cashCapacity.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            atm.cashRemaining < 20000 ? "bg-amber-400" : "bg-sky-400"
                          }`}
                          style={{ width: `${(atm.cashRemaining / atm.cashCapacity) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "cards" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                    <CreditCard className="w-6 h-6 text-sky-400" />
                    Debit & Credit Card Controls
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Instant card freeze, PIN reset requests, and credit limit administration.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {initialCards.map((card) => (
                  <div key={card.id} className="p-5 rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 space-y-4 relative overflow-hidden">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-xs font-bold text-sky-400">{card.type} CARD</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          card.isBlocked
                            ? "bg-red-500/10 text-red-400 border-red-500/20"
                            : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        }`}
                      >
                        {card.isBlocked ? "BLOCKED" : "ACTIVE"}
                      </span>
                    </div>
                    <div className="font-mono text-lg tracking-widest text-slate-100 font-bold">
                      {card.cardNumber}
                    </div>
                    <div className="flex justify-between items-end text-xs text-slate-400">
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase">Cardholder</span>
                        <span className="text-slate-200 font-medium">{card.customerName}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase">Expires</span>
                        <span className="font-mono text-slate-200">{card.expiry}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "reports" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                  <FileSpreadsheet className="w-6 h-6 text-sky-400" />
                  Regulatory & Compliance Reports
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Automated generation of Suspicious Activity Reports (SAR), Anti-Money Laundering (AML) summaries, and audit exports.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <h3 className="font-bold text-slate-100 text-sm">SAR Compliance Export</h3>
                  <p className="text-xs text-slate-400">Suspicious Activity Report for FinCEN / FIU-IND Regulatory Audit</p>
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500">PDF / XML / TXT</span>
                    <button
                      onClick={() =>
                        downloadFile(
                          `SAR_Compliance_Export_${new Date().toISOString().split("T")[0]}.txt`,
                          `BANKGUARD FINANCIAL - REGULATORY SAR COMPLIANCE EXPORT\nGenerated At: ${new Date().toISOString()}\n\nFlagged Suspicious Accounts: 14\nTotal High-Risk Velocity Transfers: ₹45,20,000\nRegulatory Filing Node: FIU-IND-HYD-01\nStatus: Cryptographically Verified & Filed\n`,
                          "text/plain"
                        )
                      }
                      className="px-3 py-1.5 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors"
                    >
                      Download Report
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <h3 className="font-bold text-slate-100 text-sm">AML Velocity Audit</h3>
                  <p className="text-xs text-slate-400">24-Hour transaction velocity breakdown & country risk scores</p>
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500">CSV / JSON</span>
                    <button
                      onClick={() =>
                        exportToCsv(
                          `AML_Velocity_Audit_${new Date().toISOString().split("T")[0]}.csv`,
                          transactions.map((tx) => ({
                            TxID: tx.id,
                            Account: tx.accountNumber,
                            Customer: tx.customerName,
                            AmountINR: tx.amount,
                            RiskScore: tx.riskScore,
                            VelocityFactor: tx.riskScore > 70 ? "HIGH_SPIKE" : "NORMAL",
                            Timestamp: tx.timestamp,
                          }))
                        )
                      }
                      className="px-3 py-1.5 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors"
                    >
                      Download Report
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <h3 className="font-bold text-slate-100 text-sm">KYC Verification Ledger</h3>
                  <p className="text-xs text-slate-400">Complete list of customer identity verifications & pending docs</p>
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500">CSV / XLSX</span>
                    <button
                      onClick={() =>
                        exportToCsv(
                          `KYC_Verification_Ledger_${new Date().toISOString().split("T")[0]}.csv`,
                          customers.map((c) => ({
                            CustomerID: c.id,
                            Name: c.name,
                            KYCStatus: c.kycStatus,
                            AadhaarVerified: c.aadhaar ? "YES" : "NO",
                            PANVerified: c.pan ? "YES" : "NO",
                            RiskCategory: c.riskScore > 60 ? "HIGH" : "LOW",
                          }))
                        )
                      }
                      className="px-3 py-1.5 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors"
                    >
                      Download Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-sky-400" />
                  Analytics Hub & Telemetry
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  System throughput, transaction distribution, and fraud mitigation statistics.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Transaction Type Distribution</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>UPI Transfers</span>
                      <span className="font-mono text-sky-400 font-bold">42%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-sky-400 h-full w-[42%]"></div>
                    </div>

                    <div className="flex justify-between text-slate-300">
                      <span>NEFT / RTGS</span>
                      <span className="font-mono text-emerald-400 font-bold">28%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-400 h-full w-[28%]"></div>
                    </div>

                    <div className="flex justify-between text-slate-300">
                      <span>ATM Withdrawals</span>
                      <span className="font-mono text-amber-400 font-bold">18%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-amber-400 h-full w-[18%]"></div>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Prevention Accuracy</h3>
                  <div className="text-3xl font-extrabold text-slate-100">99.84%</div>
                  <p className="text-xs text-slate-400">
                    Random forest model evaluated across 1.2M transactions with &lt;0.01% false positive rate.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "labs" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                  <FlaskConical className="w-6 h-6 text-sky-400" />
                  Fraud Attack Sandbox & Simulation (Labs)
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Inject artificial attack vectors (credential stuffing, rapid velocity spurts, VPN jumps) to stress-test the threat model.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: "Simulate Foreign IP Spurt", desc: "Generate 10 rapid transfers from Kolkata VPN proxy", risk: "CRITICAL" },
                  { name: "Simulate Micro-Deposit Attack", desc: "Inject 100 ₹0.50 transactions across 5 accounts", risk: "HIGH" },
                  { name: "Simulate ATM Card Cloning", desc: "Simulate simultaneous withdrawals in Mumbai and Kolkata", risk: "CRITICAL" },
                ].map((sim, i) => (
                  <div key={i} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-slate-100 text-xs">{sim.name}</h3>
                      <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 text-[10px] font-bold border border-red-500/20">
                        {sim.risk}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{sim.desc}</p>
                    <button
                      onClick={() => alert(`Simulated attack vector "${sim.name}" executed. Check Fraud Alerts tab.`)}
                      className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded font-bold text-xs transition-colors"
                    >
                      Inject Attack Payload
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "audit" && <AuditLogView logs={auditLogs} />}

          {activeTab === "security" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                  <Lock className="w-6 h-6 text-sky-400" />
                  Security & Role-Based Access Control (RBAC)
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Configure permission matrices for Admin, Manager, Auditor, and Employee roles.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
                <div className="flex justify-between items-center text-xs text-slate-300">
                  <span>Current Active Role Context: <strong className="text-sky-400">{currentRole}</strong></span>
                  <span className="text-emerald-400 font-mono font-bold">2FA Multi-Factor Active</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "support" && (
            <SupportHelpDeskView
              currentRole={currentRole}
              userName={userSession.username}
              userEmail={userSession.email}
              tickets={supportTickets}
              onAddTicket={handleAddTicket}
              onUpdateTicketStatus={handleUpdateTicketStatus}
              onAddAdminReply={handleAddAdminReply}
              transactions={transactions}
              auditLogs={auditLogs}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav activeTab={activeTab} onTabSelect={setActiveTab} />
        </>
      )}
    </div>
  );
}
