import React, { useState, useEffect } from "react";
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
import { CommandSearchModal } from "./components/CommandSearchModal";
import { InvestigationDrawer } from "./components/InvestigationDrawer";
import { MuleNetworkGraphView } from "./views/MuleNetworkGraphView";
import { ExplainableAiView } from "./views/ExplainableAiView";
import { CyberSecurityZkpView } from "./views/CyberSecurityZkpView";
import { AttackLabView } from "./views/AttackLabView";
import { SupportHelpDeskView } from "./views/SupportHelpDeskView";
import { JwtTokenCountdown } from "./components/JwtTokenCountdown";
import { LocationProximityMapCard } from "./components/LocationProximityMapCard";
import {
  initialCustomers,
  initialAccounts,
  initialTransactions,
  initialAuditLogs,
  initialNotifications,
  initialEmployees,
  initialBranches,
  initialATMs,
  initialCards,
  initialSupportTickets,
  initialLoans,
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
  Globe,
  MapPin,
  CheckCircle2,
  Laptop,
  Smartphone,
} from "lucide-react";

export interface RoleSessionProfile {
  ip: string;
  location: string;
  device: string;
  locations: Array<{
    location: string;
    ip: string;
    device: string;
    time: string;
    verification: string;
    isCurrent?: boolean;
    iconType?: "laptop" | "mobile";
  }>;
}

export const ROLE_SESSION_PROFILES: Record<UserRole, RoleSessionProfile> = {
  Admin: {
    ip: "182.70.241.12",
    location: "Mumbai, MH, India",
    device: "macOS Workstation",
    locations: [
      {
        location: "Mumbai, MH, India",
        ip: "182.70.241.12",
        device: "macOS Chrome 127",
        time: "Active Now",
        verification: "2FA Verified",
        isCurrent: true,
        iconType: "laptop",
      },
      {
        location: "Bengaluru, KA, India",
        ip: "182.70.241.98",
        device: "Windows Edge 126",
        time: "Today, 08:15 AM",
        verification: "2FA Verified",
        iconType: "laptop",
      },
      {
        location: "New Delhi, DL, India",
        ip: "182.70.241.205",
        device: "iOS Mobile App 4.2",
        time: "Yesterday, 14:20 PM",
        verification: "Biometric Verified",
        iconType: "mobile",
      },
    ],
  },
  Manager: {
    ip: "106.51.72.18",
    location: "Bengaluru, KA, India",
    device: "Windows Workstation",
    locations: [
      {
        location: "Bengaluru, KA, India",
        ip: "106.51.72.18",
        device: "Windows Edge 126",
        time: "Active Now",
        verification: "2FA Verified",
        isCurrent: true,
        iconType: "laptop",
      },
      {
        location: "Hyderabad, TS, India",
        ip: "183.82.100.44",
        device: "Windows Edge 126",
        time: "Today, 07:30 AM",
        verification: "2FA Verified",
        iconType: "laptop",
      },
      {
        location: "Chennai, TN, India",
        ip: "117.193.45.12",
        device: "macOS Firefox 125",
        time: "Yesterday, 18:45 PM",
        verification: "SMS OTP Verified",
        iconType: "laptop",
      },
    ],
  },
  Auditor: {
    ip: "115.240.90.5",
    location: "New Delhi, DL, India",
    device: "Linux Secure Terminal",
    locations: [
      {
        location: "New Delhi, DL, India",
        ip: "115.240.90.5",
        device: "Linux Firefox 128",
        time: "Active Now",
        verification: "YubiKey HW Verified",
        isCurrent: true,
        iconType: "laptop",
      },
      {
        location: "Gurugram, HR, India",
        ip: "122.160.18.99",
        device: "Linux Firefox 128",
        time: "Today, 09:10 AM",
        verification: "YubiKey HW Verified",
        iconType: "laptop",
      },
      {
        location: "Noida, UP, India",
        ip: "182.68.21.30",
        device: "Linux Chrome 127",
        time: "Yesterday, 11:15 AM",
        verification: "YubiKey HW Verified",
        iconType: "laptop",
      },
    ],
  },
  Employee: {
    ip: "49.207.50.110",
    location: "Pune, MH, India",
    device: "Corporate ThinkPad",
    locations: [
      {
        location: "Pune, MH, India",
        ip: "49.207.50.110",
        device: "Windows Chrome 127",
        time: "Active Now",
        verification: "Passkey Verified",
        isCurrent: true,
        iconType: "laptop",
      },
      {
        location: "Mumbai, MH, India",
        ip: "182.70.210.88",
        device: "Windows Chrome 127",
        time: "Today, 08:00 AM",
        verification: "Passkey Verified",
        iconType: "laptop",
      },
      {
        location: "Thane, MH, India",
        ip: "27.106.40.15",
        device: "Android App 4.2",
        time: "Yesterday, 16:30 PM",
        verification: "SMS OTP Verified",
        iconType: "mobile",
      },
    ],
  },
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userSession, setUserSession] = useState<{
    username: string;
    email: string;
    role: UserRole;
    token: string;
  }>({
    username: "Harsh Ganeshwade",
    email: "harsh.ganeshwade@bankguard.ai",
    role: "Admin",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
  });

  const [showSecuritySpec, setShowSecuritySpec] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [inspectingTx, setInspectingTx] = useState<Transaction | null>(null);

  const [activeTab, setActiveTab] = useState<string>("dash");
  const [currentRole, setCurrentRole] = useState<UserRole>("Admin");
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // JWT Session Timer State (In Seconds)
  const [sessionSecondsRemaining, setSessionSecondsRemaining] = useState<number>(900); // 15 mins default
  const [sessionMaxSeconds, setSessionMaxSeconds] = useState<number>(900);
  const [sessionExpiredNotice, setSessionExpiredNotice] = useState<string | null>(null);

  // Extend active session cumulatively (+15m / +900s)
  const handleExtendSession = (additionalSeconds = 900) => {
    setSessionSecondsRemaining((prev) => {
      const next = prev + additionalSeconds;
      setSessionMaxSeconds((max) => Math.max(max, next));
      return next;
    });
  };

  // Ticker for JWT session countdown and automatic logout on expiration
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      setSessionSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // Execute auto-logout
          setIsAuthenticated(false);
          setSessionExpiredNotice("JWT Session Expired — Automated Security Logout Executed. Please sign in again.");

          // Log audit entry for automated session termination
          const auditItem: AuditLog = {
            id: `AUD-${Math.floor(100 + Math.random() * 900)}`,
            timestamp: new Date().toISOString().replace("T", " ").slice(0, 23),
            username: userSession.username || "System_Auth",
            role: currentRole,
            ip: "10.0.0.1 (ZeroTrust Gateway)",
            browser: "Auth Token Service",
            device: "ZeroTrust Proxy",
            action: "JWT Token Expired - Automated Security Logout Executed",
            previousValue: "Session State: Active",
            newValue: "Session State: Terminated (Expired TTL)",
            riskTag: "CRITICAL",
          };
          setAuditLogs((aPrev) => [auditItem, ...aPrev]);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated, currentRole, userSession.username]);

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

  // Global Ctrl+K Command Search Key Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
    const activeProfile = ROLE_SESSION_PROFILES[currentRole] || ROLE_SESSION_PROFILES.Admin;
    const audit: AuditLog = {
      id: `AUD-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 23),
      username: `${currentRole}_Operator`,
      role: currentRole,
      ip: activeProfile.ip,
      browser: activeProfile.device,
      device: activeProfile.device,
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
    if (inspectingTx && inspectingTx.id === updatedTx.id) {
      setInspectingTx(updatedTx);
    }

    // Log Immutable Audit Entry
    const activeProfile = ROLE_SESSION_PROFILES[currentRole] || ROLE_SESSION_PROFILES.Admin;
    const audit: AuditLog = {
      id: `AUD-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 23),
      username: `${currentRole}_Operator`,
      role: currentRole,
      ip: activeProfile.ip,
      browser: activeProfile.device,
      device: activeProfile.device,
      action: `Transaction ${updatedTx.txId || updatedTx.id} Status set to ${updatedTx.status.toUpperCase()}`,
      previousValue: `Status: Pending Review`,
      newValue: `Status: ${updatedTx.status} | Note: ${updatedTx.investigatorNotes || "Reviewed"}`,
      riskTag: updatedTx.status === "Cleared" ? "ROUTINE" : "ELEVATED",
    };
    setAuditLogs((prev) => [audit, ...prev]);

    // Push Header Notification
    const notif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      title: `Tx #${updatedTx.txId || updatedTx.id} ${updatedTx.status}`,
      message: `Transaction of ₹${updatedTx.amount.toLocaleString()} marked as ${updatedTx.status} by ${currentRole}`,
      timestamp: "Just now",
      read: false,
      type: "fraud",
      severity: updatedTx.status === "Cleared" ? "info" : "high",
    };
    setNotifications((prev) => [notif, ...prev]);
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
    <div className="flex flex-col h-screen w-screen bg-[#080B12] text-slate-100 font-sans select-none overflow-hidden">
      {/* Security Specifications Modal */}
      <SecuritySpecModal
        isOpen={showSecuritySpec}
        onClose={() => setShowSecuritySpec(false)}
      />

      {/* Global Command/Search Modal (Ctrl + K) */}
      <CommandSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={(tab) => {
          setActiveTab(tab);
          setIsSearchOpen(false);
        }}
        onTabSelect={(tab) => {
          setActiveTab(tab);
          setIsSearchOpen(false);
        }}
        transactions={transactions}
        customers={customers}
        accounts={accounts}
        onSelectTx={(tx) => {
          setInspectingTx(tx);
          setIsSearchOpen(false);
        }}
      />

      {/* Side Investigation Drawer */}
      <InvestigationDrawer
        isOpen={!!inspectingTx}
        onClose={() => setInspectingTx(null)}
        transaction={inspectingTx}
        onUpdateTransaction={handleUpdateTransaction}
        onOpenFullCase={(tx) => {
          setSelectedTx(tx);
          setActiveTab("investigate");
          setInspectingTx(null);
        }}
      />

      {!isAuthenticated ? (
        <AuthView
          onLoginSuccess={(session) => {
            setUserSession(session);
            setCurrentRole(session.role);
            setSessionSecondsRemaining(900);
            setSessionMaxSeconds(900);
            setSessionExpiredNotice(null);
            setIsAuthenticated(true);
          }}
          onOpenSecuritySpec={() => setShowSecuritySpec(true)}
          sessionExpiredNotice={sessionExpiredNotice}
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
            secondsRemaining={sessionSecondsRemaining}
            onExtendSession={handleExtendSession}
            onLogout={() => {
              setIsAuthenticated(false);
              setSessionExpiredNotice(null);
            }}
            onOpenSecuritySpec={() => setShowSecuritySpec(true)}
            onOpenSearch={() => setIsSearchOpen(true)}
          />

          {/* Emergency Alert Banner */}
          <Ticker
            emergency={{
              accountNumber: "•••• 4921",
              amount: 82000,
              riskScore: 94,
              message: "HIGH-RISK TRANSACTION DETECTED",
            }}
            onReview={() => {
              if (transactions[0]) {
                setInspectingTx(transactions[0]);
              }
            }}
          />

          {/* Main App Layout */}
          <div className="flex flex-1 overflow-hidden pt-14 pb-16 md:pb-0">
            {/* Sidebar Navigation */}
            <Sidebar
              activeTab={activeTab}
              onTabSelect={setActiveTab}
              currentRole={currentRole}
            />

            {/* Content View Area */}
            <main className="flex-1 overflow-y-auto p-4 md:p-8 md:ml-60 bg-[#080B12]">
              {activeTab === "dash" && (
                <OverviewView
                  transactions={transactions}
                  customers={customers}
                  accounts={accounts}
                  tickets={supportTickets}
                  onTabSelect={setActiveTab}
                  onSync={handleSync}
                  isSyncing={isSyncing}
                  onInspectTx={(tx) => setInspectingTx(tx)}
                />
              )}

              {activeTab === "fraud" && (
                <FraudDetectionView
                  onAnalyzeWithGemini={handleAnalyzeWithGemini}
                  onInspectTx={(tx) => setInspectingTx(tx)}
                  onTabSelect={setActiveTab}
                />
              )}

              {activeTab === "mule-graph" && (
                <MuleNetworkGraphView transactions={transactions} />
              )}

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
                  onSelectTransaction={(tx) => setInspectingTx(tx)}
                  onTabSelect={setActiveTab}
                />
              )}

              {activeTab === "loans" && (
                <div className="space-y-6 max-w-7xl mx-auto font-sans">
                  <div className="flex justify-between items-center">
                    <div>
                      <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Landmark className="w-6 h-6 text-sky-400" />
                        Loan Management
                      </h1>
                      <p className="text-xs text-slate-400 mt-1">
                        Automated credit underwriting and collateral evaluations.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {initialLoans.map((loan) => (
                      <div
                        key={loan.id}
                        className="p-4 rounded-xl bg-[#0F141D] border border-[#202938] space-y-3"
                      >
                        <div className="flex justify-between items-start font-mono text-xs">
                          <span className="text-sky-400 font-bold">{loan.loanNumber}</span>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                            {loan.status}
                          </span>
                        </div>
                        <div>
                          <div className="text-lg font-bold font-mono text-white">
                            ₹{loan.amount.toLocaleString()}
                          </div>
                          <div className="text-xs text-slate-400">
                            {loan.customerName} ({loan.loanType})
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "employees" && (
                <div className="space-y-6 max-w-7xl mx-auto font-sans">
                  <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                      <Briefcase className="w-6 h-6 text-sky-400" />
                      Staff Roster
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">
                      Personnel directory and operational clearances.
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#0F141D] border border-[#202938] overflow-hidden">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-[#080B12] text-slate-400 uppercase text-[10px] font-mono border-b border-[#202938]">
                        <tr>
                          <th className="p-3">Emp Code</th>
                          <th className="p-3">Name</th>
                          <th className="p-3">Role</th>
                          <th className="p-3">Department</th>
                          <th className="p-3 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#202938] font-mono">
                        {initialEmployees.map((emp) => (
                          <tr key={emp.id} className="hover:bg-[#151B26]">
                            <td className="p-3 text-sky-400 font-bold">{emp.empCode}</td>
                            <td className="p-3 font-sans font-semibold text-white">{emp.name}</td>
                            <td className="p-3">{emp.role}</td>
                            <td className="p-3 text-slate-400">{emp.department}</td>
                            <td className="p-3 text-right text-emerald-400 font-bold">Active</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "branches" && (
                <div className="space-y-6 max-w-7xl mx-auto font-sans">
                  <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                      <Building2 className="w-6 h-6 text-sky-400" />
                      Branch Network
                    </h1>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {initialBranches.map((b) => (
                      <div key={b.id} className="p-4 rounded-xl bg-[#0F141D] border border-[#202938] space-y-2">
                        <h3 className="font-bold text-white text-sm">{b.name}</h3>
                        <p className="text-xs text-slate-400">{b.address}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "atms" && (
                <div className="space-y-6 max-w-7xl mx-auto font-sans">
                  <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                      <Layers className="w-6 h-6 text-sky-400" />
                      ATM Terminal Nodes
                    </h1>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {initialATMs.map((atm) => (
                      <div key={atm.id} className="p-4 rounded-xl bg-[#0F141D] border border-[#202938] space-y-2">
                        <span className="font-mono text-xs font-bold text-sky-400">{atm.code}</span>
                        <h3 className="font-semibold text-white text-xs">{atm.location}</h3>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "cards" && (
                <div className="space-y-6 max-w-7xl mx-auto font-sans">
                  <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                      <CreditCard className="w-6 h-6 text-sky-400" />
                      Card Administration
                    </h1>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {initialCards.map((card) => (
                      <div key={card.id} className="p-4 rounded-xl bg-[#0F141D] border border-[#202938] space-y-2 font-mono">
                        <span className="text-xs text-sky-400 font-bold">{card.type}</span>
                        <div className="text-base text-white font-bold">{card.cardNumber}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "reports" && (
                <div className="space-y-6 max-w-7xl mx-auto font-sans text-slate-100">
                  <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                      <FileSpreadsheet className="w-6 h-6 text-sky-400" />
                      Audit & Compliance Reports
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">
                      Generate, preview, and export regulatory filings and automated compliance trails.
                    </p>
                  </div>

                  {/* KPI Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
                    <div className="p-4 rounded-xl bg-[#0F141D] border border-[#202938]">
                      <div className="text-slate-400 font-sans">Pending SAR Filings</div>
                      <div className="text-2xl font-bold text-rose-400 mt-1">14</div>
                      <div className="text-[10px] text-slate-500 mt-1">Ready for FinCEN transmission</div>
                    </div>
                    <div className="p-4 rounded-xl bg-[#0F141D] border border-[#202938]">
                      <div className="text-slate-400 font-sans">CTR Threshold Events</div>
                      <div className="text-2xl font-bold text-amber-400 mt-1">38</div>
                      <div className="text-[10px] text-slate-500 mt-1">Exceeding ₹1,00,000 / $10k threshold</div>
                    </div>
                    <div className="p-4 rounded-xl bg-[#0F141D] border border-[#202938]">
                      <div className="text-slate-400 font-sans">Compliance Score</div>
                      <div className="text-2xl font-bold text-emerald-400 mt-1">99.8%</div>
                      <div className="text-[10px] text-slate-500 mt-1">PCI-DSS & RBI AML compliant</div>
                    </div>
                    <div className="p-4 rounded-xl bg-[#0F141D] border border-[#202938]">
                      <div className="text-slate-400 font-sans">Automated Exports</div>
                      <div className="text-2xl font-bold text-sky-400 mt-1">24/7</div>
                      <div className="text-[10px] text-slate-500 mt-1">Daily scheduled audit sync</div>
                    </div>
                  </div>

                  {/* Downloadable Reports Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 rounded-xl bg-[#0F141D] border border-[#202938] space-y-3 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-white text-sm">Suspicious Activity Report (SAR)</h3>
                          <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 font-mono text-[10px] font-bold border border-rose-500/20">
                            HIGH PRIORITY
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-2">
                          Mandatory regulatory file containing accounts flagged for money laundering, velocity spikes, and rapid circular transfers.
                        </p>
                      </div>
                      <div className="pt-2 flex justify-between items-center border-t border-[#202938]">
                        <span className="text-[10px] font-mono text-slate-500">FORMAT: ASCII / TXT</span>
                        <button
                          onClick={() =>
                            downloadFile(
                              `SAR_Compliance_${new Date().toISOString().split("T")[0]}.txt`,
                              `BANKGUARD AI ENTERPRISE - REGULATORY SAR COMPLIANCE FILE
===================================================================
Generated: ${new Date().toISOString()}
Flagged Entities Count: 14
Primary Risk Category: Money Mule Layering & Rapid Account Takeover

SUMMARY OF FLAGGED ACCOUNTS:
- ACC-3304 (Mule Node Alpha) | Risk: 94% | Velocity: 8 tx/min
- ACC-4402 (Mule Node Beta)  | Risk: 91% | Velocity: 6 tx/min
- ACC-5512 (Global Trading)  | Risk: 88% | Velocity: 4 tx/min
===================================================================`,
                              "text/plain"
                            )
                          }
                          className="px-3.5 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors"
                        >
                          Export SAR File
                        </button>
                      </div>
                    </div>

                    <div className="p-5 rounded-xl bg-[#0F141D] border border-[#202938] space-y-3 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-white text-sm">Currency Transaction Report (CTR)</h3>
                          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono text-[10px] font-bold border border-amber-500/20">
                            REGULATORY
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-2">
                          Logs all high-value cash and wire transactions exceeding regulatory monitoring limits within 24 hours.
                        </p>
                      </div>
                      <div className="pt-2 flex justify-between items-center border-t border-[#202938]">
                        <span className="text-[10px] font-mono text-slate-500">FORMAT: CSV</span>
                        <button
                          onClick={() =>
                            exportToCsv(
                              `CTR_Report_${new Date().toISOString().split("T")[0]}.csv`,
                              transactions.map((t) => ({
                                TxID: t.txId,
                                Customer: t.customerName,
                                Account: t.accountNumber,
                                Amount: t.amount,
                                Location: t.location,
                                RiskScore: t.riskScore,
                                Status: t.status,
                              }))
                            )
                          }
                          className="px-3.5 py-1.5 rounded-lg bg-[#151B26] border border-[#202938] hover:bg-[#1e2736] text-white font-bold text-xs transition-colors"
                        >
                          Export CTR CSV
                        </button>
                      </div>
                    </div>

                    <div className="p-5 rounded-xl bg-[#0F141D] border border-[#202938] space-y-3 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-white text-sm">System Audit & Telemetry Log</h3>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/20">
                            VERIFIED
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-2">
                          Complete tamper-proof record of all admin overrides, risk scoring adjustments, and system sync events.
                        </p>
                      </div>
                      <div className="pt-2 flex justify-between items-center border-t border-[#202938]">
                        <span className="text-[10px] font-mono text-slate-500">FORMAT: CSV</span>
                        <button
                          onClick={() =>
                            exportToCsv(
                              `Audit_Telemetry_Logs_${new Date().toISOString().split("T")[0]}.csv`,
                              auditLogs.map((a) => ({
                                AuditID: a.id,
                                Timestamp: a.timestamp,
                                User: a.username,
                                Role: a.role,
                                Action: a.action,
                                IP: a.ip,
                                RiskTag: a.riskTag,
                              }))
                            )
                          }
                          className="px-3.5 py-1.5 rounded-lg bg-[#151B26] border border-[#202938] hover:bg-[#1e2736] text-white font-bold text-xs transition-colors"
                        >
                          Export Audit CSV
                        </button>
                      </div>
                    </div>

                    <div className="p-5 rounded-xl bg-[#0F141D] border border-[#202938] space-y-3 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-white text-sm">Mule Topology & Money Flow Summary</h3>
                          <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 font-mono text-[10px] font-bold border border-sky-500/20">
                            INTELLIGENCE
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-2">
                          Structural breakdown of identified mule clusters, shell accounts, and cross-border crypto offramps.
                        </p>
                      </div>
                      <div className="pt-2 flex justify-between items-center border-t border-[#202938]">
                        <span className="text-[10px] font-mono text-slate-500">FORMAT: JSON / CSV</span>
                        <button
                          onClick={() =>
                            exportToCsv(
                              `Mule_Topology_Export_${new Date().toISOString().split("T")[0]}.csv`,
                              [
                                { ClusterID: "MULE-C1", MuleAccount: "ACC-3304", Risk: "94%", Velocity: "High", VolumeTransferred: "₹2.4M" },
                                { ClusterID: "MULE-C1", MuleAccount: "ACC-4402", Risk: "91%", Velocity: "High", VolumeTransferred: "₹2.3M" },
                                { ClusterID: "MULE-C2", MuleAccount: "ACC-5512", Risk: "88%", Velocity: "Medium", VolumeTransferred: "₹1.8M" },
                              ]
                            )
                          }
                          className="px-3.5 py-1.5 rounded-lg bg-[#151B26] border border-[#202938] hover:bg-[#1e2736] text-white font-bold text-xs transition-colors"
                        >
                          Export Topology CSV
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "analytics" && (
                <div className="space-y-6 max-w-7xl mx-auto font-sans text-slate-100">
                  <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                      <BarChart3 className="w-6 h-6 text-sky-400" />
                      Risk Telemetry & Analytics
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">
                      Real-time statistical breakdown of system transaction velocities, threat distributions, and model performance.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                    <div className="p-4 rounded-xl bg-[#0F141D] border border-[#202938]">
                      <div className="text-slate-400 font-sans">Avg Transaction Latency</div>
                      <div className="text-2xl font-bold text-emerald-400 mt-1">4.2 ms</div>
                      <div className="text-[10px] text-slate-500 mt-1">Sub-10ms SLA target met</div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#0F141D] border border-[#202938]">
                      <div className="text-slate-400 font-sans">False Positive Ratio</div>
                      <div className="text-2xl font-bold text-sky-400 mt-1">0.12%</div>
                      <div className="text-[10px] text-slate-500 mt-1">Optimized by Random Forest + Gemini</div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#0F141D] border border-[#202938]">
                      <div className="text-slate-400 font-sans">Total Shielded Volume</div>
                      <div className="text-2xl font-bold text-white mt-1">₹42.8M</div>
                      <div className="text-[10px] text-slate-500 mt-1">Last 24 hours evaluation</div>
                    </div>
                  </div>

                  {/* Analytics Threat Breakdown Bars */}
                  <div className="p-6 rounded-xl bg-[#0F141D] border border-[#202938] space-y-4">
                    <h3 className="text-sm font-bold text-white font-sans">Threat Vector Distribution</h3>
                    <div className="space-y-3 font-mono text-xs">
                      <div>
                        <div className="flex justify-between text-slate-300 mb-1">
                          <span>Account Takeover (ATO)</span>
                          <span className="text-rose-400 font-bold">42% (18 cases)</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-[#080B12] overflow-hidden">
                          <div className="h-full bg-rose-500 rounded-full" style={{ width: "42%" }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-300 mb-1">
                          <span>Money Mule Rapid Layering</span>
                          <span className="text-amber-400 font-bold">28% (12 cases)</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-[#080B12] overflow-hidden">
                          <div className="h-full bg-amber-500 rounded-full" style={{ width: "28%" }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-300 mb-1">
                          <span>Geographic Discrepancy & VPN Spurt</span>
                          <span className="text-sky-400 font-bold">18% (8 cases)</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-[#080B12] overflow-hidden">
                          <div className="h-full bg-sky-500 rounded-full" style={{ width: "18%" }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-300 mb-1">
                          <span>Synthetic Identity Creation</span>
                          <span className="text-emerald-400 font-bold">12% (5 cases)</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-[#080B12] overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: "12%" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "audit" && <AuditLogView logs={auditLogs} />}

              {activeTab === "security" && (
                <div className="space-y-6 max-w-7xl mx-auto font-sans text-slate-100">
                  <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                      <Lock className="w-6 h-6 text-sky-400" />
                      Security & RBAC Matrix Settings
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">
                      Configure Zero Trust controls, role access privileges, and system authentication parameters.
                    </p>
                  </div>

                  {/* Live Visual JWT Token Countdown Timer */}
                  <JwtTokenCountdown
                    username={userSession.username}
                    role={currentRole}
                    secondsRemaining={sessionSecondsRemaining}
                    sessionMaxSeconds={sessionMaxSeconds}
                    onExtendSession={handleExtendSession}
                    onLogout={() => {
                      setIsAuthenticated(false);
                      setSessionExpiredNotice(null);
                    }}
                  />

                  {/* Geofence & Login Proximity Tactical Map Card */}
                  <LocationProximityMapCard
                    username={userSession.username}
                    currentRole={currentRole}
                  />

                  {/* RBAC Role Matrix Table */}
                  <div className="p-6 rounded-xl bg-[#0F141D] border border-[#202938] space-y-4">
                    <h3 className="text-sm font-bold text-white">Role-Based Access Control (RBAC) Matrix</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-mono">
                        <thead className="bg-[#080B12] text-slate-400 uppercase text-[10px] border-b border-[#202938]">
                          <tr>
                            <th className="p-3">User Role</th>
                            <th className="p-3">View Telemetry</th>
                            <th className="p-3">Approve Interventions</th>
                            <th className="p-3">Admin Overrides</th>
                            <th className="p-3">Export SAR Files</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#202938] text-slate-300">
                          <tr className="hover:bg-[#151B26]">
                            <td className="p-3 font-sans font-bold text-sky-400">Admin / Superuser</td>
                            <td className="p-3 text-emerald-400 font-bold">GRANTED</td>
                            <td className="p-3 text-emerald-400 font-bold">GRANTED</td>
                            <td className="p-3 text-emerald-400 font-bold">GRANTED</td>
                            <td className="p-3 text-emerald-400 font-bold">GRANTED</td>
                          </tr>
                          <tr className="hover:bg-[#151B26]">
                            <td className="p-3 font-sans font-bold text-slate-200">Senior Fraud Analyst</td>
                            <td className="p-3 text-emerald-400 font-bold">GRANTED</td>
                            <td className="p-3 text-emerald-400 font-bold">GRANTED</td>
                            <td className="p-3 text-rose-400 font-bold">DENIED</td>
                            <td className="p-3 text-emerald-400 font-bold">GRANTED</td>
                          </tr>
                          <tr className="hover:bg-[#151B26]">
                            <td className="p-3 font-sans font-bold text-slate-200">Compliance Officer</td>
                            <td className="p-3 text-emerald-400 font-bold">GRANTED</td>
                            <td className="p-3 text-rose-400 font-bold">DENIED</td>
                            <td className="p-3 text-rose-400 font-bold">DENIED</td>
                            <td className="p-3 text-emerald-400 font-bold">GRANTED</td>
                          </tr>
                          <tr className="hover:bg-[#151B26]">
                            <td className="p-3 font-sans font-bold text-slate-200">Audit Inspector</td>
                            <td className="p-3 text-emerald-400 font-bold">READ ONLY</td>
                            <td className="p-3 text-rose-400 font-bold">DENIED</td>
                            <td className="p-3 text-rose-400 font-bold">DENIED</td>
                            <td className="p-3 text-rose-400 font-bold">DENIED</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Zero Trust Parameters */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 rounded-xl bg-[#0F141D] border border-[#202938] space-y-3">
                      <h3 className="font-bold text-white text-sm">Session & Authentication Policy</h3>
                      <div className="space-y-2 text-xs font-mono">
                        <div className="flex justify-between items-center py-1.5 border-b border-[#202938]">
                          <span className="text-slate-400">JWT Token Expiry</span>
                          <span className="text-sky-400 font-bold">15 Minutes (Active)</span>
                        </div>
                        <div className="flex justify-between items-center py-1.5 border-b border-[#202938]">
                          <span className="text-slate-400">Biometric Keystroke Dynamics</span>
                          <span className="text-emerald-400 font-bold">ENFORCED</span>
                        </div>
                        <div className="flex justify-between items-center py-1.5">
                          <span className="text-slate-400">IP Geofencing Policy</span>
                          <span className="text-emerald-400 font-bold">STRICT WHITELIST</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 rounded-xl bg-[#0F141D] border border-[#202938] space-y-4">
                      <div className="flex items-center justify-between border-b border-[#202938] pb-3">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-sky-400" />
                          <h3 className="font-bold text-white text-sm">Active Session Context</h3>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/20 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> VERIFIED SESSION
                        </span>
                      </div>

                      <div className="space-y-2 text-xs font-mono">
                        <div className="flex justify-between items-center py-1.5 border-b border-[#202938]">
                          <span className="text-slate-400">Logged User</span>
                          <span className="text-white font-bold">{userSession.username}</span>
                        </div>
                        <div className="flex justify-between items-center py-1.5 border-b border-[#202938]">
                          <span className="text-slate-400">Current Role</span>
                          <span className="text-sky-400 font-bold">{currentRole}</span>
                        </div>
                        <div className="flex justify-between items-center py-1.5 border-b border-[#202938]">
                          <span className="text-slate-400">Current IP Address</span>
                          <span className="text-emerald-400 font-bold font-mono">
                            {(ROLE_SESSION_PROFILES[currentRole] || ROLE_SESSION_PROFILES.Admin).ip} ({(ROLE_SESSION_PROFILES[currentRole] || ROLE_SESSION_PROFILES.Admin).location})
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-1.5">
                          <span className="text-slate-400">Zero-Knowledge Proof</span>
                          <span className="text-emerald-400 font-bold">VERIFIED (#ZKP-9921)</span>
                        </div>
                      </div>

                      {/* Recognized Login Locations */}
                      <div className="pt-2 space-y-2.5">
                        <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-sky-400" /> Last 3 Recognized Login Locations
                          </span>
                          <span className="text-[10px] text-emerald-400 font-normal">All Whitelisted</span>
                        </div>

                        <div className="space-y-2">
                          {(ROLE_SESSION_PROFILES[currentRole] || ROLE_SESSION_PROFILES.Admin).locations.map((loc, idx) => (
                            <div key={idx} className="p-2.5 rounded bg-[#080B12] border border-[#202938] flex items-center justify-between text-xs font-mono">
                              <div className="flex items-center gap-2.5">
                                <div className={`p-1.5 rounded border shrink-0 ${
                                  loc.isCurrent
                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                    : idx === 1
                                    ? "bg-sky-500/10 text-sky-400 border-sky-500/20"
                                    : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                                }`}>
                                  {loc.iconType === "mobile" ? <Smartphone className="w-3.5 h-3.5" /> : <Laptop className="w-3.5 h-3.5" />}
                                </div>
                                <div>
                                  <div className="text-slate-200 font-bold flex items-center gap-2">
                                    {loc.location}
                                    {loc.isCurrent && (
                                      <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-bold">
                                        CURRENT
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[10px] text-slate-500 mt-0.5">
                                    {loc.ip} • {loc.device}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right shrink-0 pl-2">
                                <div className={loc.isCurrent ? "text-emerald-400 text-[10px] font-bold" : "text-slate-400 text-[10px]"}>
                                  {loc.time}
                                </div>
                                <div className="text-[9px] text-slate-500">{loc.verification}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {(activeTab === "help" || activeTab === "support") && (
                <SupportHelpDeskView
                  currentRole={currentRole}
                  userName={userSession.username}
                  userEmail={userSession.email}
                  tickets={supportTickets}
                  onAddTicket={(t) => setSupportTickets((prev) => [t, ...prev])}
                  onUpdateTicketStatus={(id, st) =>
                    setSupportTickets((prev) =>
                      prev.map((t) => (t.id === id ? { ...t, status: st } : t))
                    )
                  }
                  onAddAdminReply={(id, text) => {
                    setSupportTickets((prev) =>
                      prev.map((t) =>
                        t.id === id
                          ? {
                              ...t,
                              adminReplies: [
                                ...(t.adminReplies || []),
                                {
                                  id: `R-${Date.now()}`,
                                  sender: userSession.username,
                                  text,
                                  timestamp: "Just now",
                                },
                              ],
                            }
                          : t
                      )
                    );
                  }}
                  transactions={transactions}
                  auditLogs={auditLogs}
                />
              )}

              {/* Fallback for any unexpected tab id to prevent blank screen */}
              {![
                "dash",
                "fraud",
                "mule-graph",
                "xai-explain",
                "zkp-biometrics",
                "attack-lab",
                "investigate",
                "clients",
                "accounts",
                "activity",
                "loans",
                "employees",
                "branches",
                "atms",
                "cards",
                "reports",
                "analytics",
                "audit",
                "security",
                "help",
                "support",
              ].includes(activeTab) && (
                <OverviewView
                  transactions={transactions}
                  customers={customers}
                  accounts={accounts}
                  tickets={supportTickets}
                  onTabSelect={setActiveTab}
                  onSync={handleSync}
                  isSyncing={isSyncing}
                  onInspectTx={(tx) => setInspectingTx(tx)}
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
