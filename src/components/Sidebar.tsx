import React from "react";
import {
  LayoutDashboard,
  ShieldAlert,
  SearchCode,
  Users,
  CreditCard,
  Activity,
  Skull,
  Brain,
  Network,
  FileCheck2,
  FileSpreadsheet,
  Lock,
  LifeBuoy,
  Shield,
  Circle,
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
  const sections = [
    {
      title: "COMMAND",
      items: [
        { id: "dash", label: "Dashboard", icon: LayoutDashboard },
      ],
    },
    {
      title: "BANKING",
      items: [
        { id: "clients", label: "Customers", icon: Users },
        { id: "accounts", label: "Accounts", icon: CreditCard },
        { id: "activity", label: "Transactions", icon: Activity },
      ],
    },
    {
      title: "SECURITY",
      items: [
        { id: "fraud", label: "Fraud Center", icon: ShieldAlert, badge: "18" },
        { id: "investigate", label: "Investigations", icon: SearchCode },
        { id: "attack-lab", label: "Attack Lab", icon: Skull },
      ],
    },
    {
      title: "INTELLIGENCE",
      items: [
        { id: "xai-explain", label: "AI Analysis", icon: Brain },
        { id: "mule-graph", label: "Money Flow", icon: Network },
      ],
    },
    {
      title: "AUDIT",
      items: [
        { id: "audit", label: "Audit Logs", icon: FileCheck2 },
        { id: "reports", label: "Reports", icon: FileSpreadsheet },
      ],
    },
  ];

  const systemItems = [
    { id: "security", label: "Settings", icon: Lock },
    {
      id: "support",
      label: "Help",
      icon: LifeBuoy,
      badge: pendingTicketsCount > 0 ? String(pendingTicketsCount) : undefined,
    },
  ];

  return (
    <aside className="hidden md:flex flex-col h-[calc(100vh-3.5rem)] w-56 border-r border-[#202938] bg-[#080B12] fixed left-0 top-14 justify-between p-3 shrink-0 overflow-y-auto z-30 select-none">
      <div className="space-y-5">
        {sections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-mono font-semibold text-slate-500 tracking-wider">
              {section.title}
            </div>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabSelect(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-[#151B26] text-white border border-[#202938] font-semibold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-[#0F141D]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? "text-sky-400" : "text-slate-500"
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                        item.id === "fraud"
                          ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}

        {/* SYSTEM Section */}
        <div className="space-y-1 pt-3 border-t border-[#202938]">
          <div className="px-3 py-1 text-[10px] font-mono font-semibold text-slate-500 tracking-wider">
            SYSTEM
          </div>
          {systemItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabSelect(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-[#151B26] text-white border border-[#202938] font-semibold"
                    : "text-slate-400 hover:text-slate-200 hover:bg-[#0F141D]"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? "text-sky-400" : "text-slate-500"
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* System Status Footer */}
      <div className="pt-3 border-t border-[#202938] mt-4">
        <div className="flex items-center gap-2 px-2 py-1 text-[11px] font-mono font-semibold text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>SYSTEM OPERATIONAL</span>
        </div>
      </div>
    </aside>
  );
};
