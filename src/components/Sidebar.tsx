import React from "react";
import {
  LayoutDashboard,
  ShieldAlert,
  SearchCode,
  Users,
  CreditCard,
  Activity,
  BarChart3,
  FlaskConical,
  FileCheck2,
  Building2,
  Landmark,
  FileSpreadsheet,
  Lock,
  LifeBuoy,
  BadgeCheck,
  Briefcase,
  Layers,
  Network,
  Brain,
  Fingerprint,
  Skull,
} from "lucide-react";
import { UserRole } from "../types";

interface SidebarProps {
  activeTab: string;
  onTabSelect: (tab: string) => void;
  currentRole: UserRole;
  pendingTicketsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabSelect,
  currentRole,
  pendingTicketsCount = 0,
}) => {
  const navItems = [
    { id: "dash", label: "Dashboard", icon: LayoutDashboard },
    { id: "fraud", label: "Fraud Detection", icon: ShieldAlert },
    { id: "mule-graph", label: "Mule Network Graph", icon: Network },
    { id: "xai-explain", label: "Explainable AI (SHAP)", icon: Brain },
    { id: "zkp-biometrics", label: "ZKP & Biometrics", icon: Fingerprint },
    { id: "attack-lab", label: "Live Cyber Attack Lab", icon: Skull },
    { id: "investigate", label: "Investigation Panel", icon: SearchCode },
    { id: "clients", label: "Customers", icon: Users },
    { id: "accounts", label: "Bank Accounts", icon: CreditCard },
    { id: "activity", label: "Transactions", icon: Activity },
    { id: "loans", label: "Loan Management", icon: Landmark },
    { id: "employees", label: "Employees & Roles", icon: Briefcase },
    { id: "branches", label: "Branch Offices", icon: Building2 },
    { id: "atms", label: "ATM Network", icon: Layers },
    { id: "cards", label: "Card Management", icon: CreditCard },
    { id: "reports", label: "Reports Generator", icon: FileSpreadsheet },
    { id: "analytics", label: "Analytics Hub", icon: BarChart3 },
    { id: "labs", label: "Fraud Sandbox (Labs)", icon: FlaskConical },
  ];

  const secondaryItems = [
    { id: "audit", label: "Audit Logs", icon: FileCheck2 },
    { id: "security", label: "Security & RBAC", icon: Lock },
    {
      id: "support",
      label: currentRole === "Admin" ? "Admin Messaging Box" : "Help Desk & Escalations",
      icon: LifeBuoy,
    },
  ];

  return (
    <aside className="hidden md:flex flex-col h-[calc(100vh-3.5rem)] w-56 border-r border-slate-800 bg-slate-900/30 fixed left-0 top-14 justify-between p-3 shrink-0 overflow-y-auto z-30 select-none">
      <div className="space-y-4">
        {/* Main Section */}
        <div className="space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            Main
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabSelect(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-sky-500/10 text-sky-400 border border-sky-500/20 font-semibold"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-sky-400" : "text-slate-500"}`} />
                <span className="truncate">{item.label}</span>
                {item.id === "fraud" && (
                  <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-400 font-semibold border border-red-500/20">
                    14
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Governance & Audit Section */}
        <div className="space-y-1 pt-2 border-t border-slate-800/60">
          <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            Governance & Audit
          </div>
          {secondaryItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabSelect(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-sky-500/10 text-sky-400 border border-sky-500/20 font-semibold"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-sky-400" : "text-slate-500"}`} />
                <span className="truncate">{item.label}</span>
                {item.id === "support" && pendingTicketsCount > 0 && (
                  <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20">
                    {pendingTicketsCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* System Health Indicator */}
      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2 mt-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">Node Engine</span>
          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Optimal
          </span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-sky-400 h-full w-[88%] rounded-full"></div>
        </div>
        <div className="text-[10px] text-slate-500 flex justify-between">
          <span>Latency: 12ms</span>
          <span>Load: 24%</span>
        </div>
      </div>
    </aside>
  );
};
