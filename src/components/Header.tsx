import React, { useState } from "react";
import {
  Shield,
  Bell,
  RefreshCw,
  UserCheck,
  X,
  Search,
  Zap,
  LogOut,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { UserRole, NotificationItem } from "../types";

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: string) => void;
  onClearNotifications: () => void;
  onSync: () => void;
  isSyncing: boolean;
  activeTab: string;
  onTabSelect: (tab: string) => void;
  userName?: string;
  userEmail?: string;
  secondsRemaining?: number;
  onExtendSession?: (additionalSeconds?: number) => void;
  onLogout?: () => void;
  onOpenSecuritySpec?: () => void;
  onOpenSearch?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  notifications,
  onMarkNotificationRead,
  onClearNotifications,
  onSync,
  isSyncing,
  activeTab,
  onTabSelect,
  userName = "Harsh Ganeshwade",
  userEmail = "harsh.ganeshwade@bankguard.ai",
  secondsRemaining = 900,
  onExtendSession,
  onLogout,
  onOpenSecuritySpec,
  onOpenSearch,
}) => {
  const [showNotifModal, setShowNotifModal] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Format JWT timer for header display
  const totalMins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  let formattedTimer = "";
  if (totalMins >= 60) {
    const hrs = Math.floor(totalMins / 60);
    const remM = totalMins % 60;
    formattedTimer = `${hrs}:${String(remM).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  } else {
    formattedTimer = `${String(totalMins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  const isCritical = secondsRemaining <= 120;
  const isWarning = secondsRemaining < 300 && secondsRemaining > 120;

  return (
    <header className="bg-[#0F141D] border-b border-[#202938] fixed top-0 w-full z-50 flex items-center justify-between px-4 md:px-6 h-14 shrink-0 select-none">
      {/* Left Branding */}
      <div className="flex items-center gap-4">
        <div
          onClick={() => onTabSelect("dash")}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <span className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 group-hover:scale-105 transition-transform flex items-center justify-center">
            <Shield className="w-5 h-5 stroke-[2.5]" />
          </span>
          <span className="font-bold text-lg tracking-tight text-white font-mono">
            BankGuard<span className="text-sky-400"> AI</span>
          </span>
        </div>

        {/* Global Search Trigger */}
        <button
          id="open-command-search-btn"
          onClick={onOpenSearch}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#080B12] border border-[#202938] text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-colors text-xs font-sans"
        >
          <Search className="w-3.5 h-3.5 text-slate-500" />
          <span>Search BankGuard...</span>
          <kbd className="font-mono text-[10px] bg-[#151B26] px-1.5 py-0.5 rounded border border-[#202938] text-slate-400 ml-3">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Right Tools & Role Switcher */}
      <div className="flex items-center gap-3">
        {/* Mobile Search Button */}
        <button
          onClick={onOpenSearch}
          className="sm:hidden p-1.5 rounded-lg bg-[#080B12] border border-[#202938] text-slate-400"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Role Selector Badge */}
        <div className="hidden lg:flex items-center gap-1.5 bg-[#080B12] border border-[#202938] rounded-lg px-2.5 py-1 text-xs text-slate-400">
          <UserCheck className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-[11px] text-slate-500 font-medium font-mono">Role:</span>
          <select
            value={currentRole}
            onChange={(e) => onRoleChange(e.target.value as UserRole)}
            className="bg-transparent text-slate-200 font-semibold text-xs focus:outline-none cursor-pointer font-sans"
          >
            <option value="Admin" className="bg-[#0F141D] text-white">
              Admin (Full)
            </option>
            <option value="Manager" className="bg-[#0F141D] text-white">
              Manager
            </option>
            <option value="Auditor" className="bg-[#0F141D] text-white">
              Auditor
            </option>
            <option value="Employee" className="bg-[#0F141D] text-white">
              Employee
            </option>
          </select>
        </div>

        {/* Sync Button */}
        <button
          onClick={onSync}
          disabled={isSyncing}
          className="p-1.5 rounded-lg bg-[#080B12] border border-[#202938] text-slate-400 hover:text-slate-200 hover:bg-[#151B26] transition-colors"
          title="Sync AI Threat Models & Ledger"
        >
          <RefreshCw
            className={`w-4 h-4 ${isSyncing ? "animate-spin text-sky-400" : ""}`}
          />
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifModal(!showNotifModal)}
            className="p-1.5 rounded-lg bg-[#080B12] border border-[#202938] text-slate-400 hover:text-slate-200 hover:bg-[#151B26] transition-colors relative"
            title="Notification Center"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            )}
          </button>

          {/* Notifications Modal Dropdown */}
          {showNotifModal && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0F141D] border border-[#202938] rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="p-3 bg-[#080B12] border-b border-[#202938] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-sky-400" />
                  <span className="text-xs font-bold text-slate-200 font-mono">
                    Security Alerts ({notifications.length})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={onClearNotifications}
                    className="text-[10px] text-slate-400 hover:text-rose-400 transition-colors"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setShowNotifModal(false)}
                    className="text-slate-400 hover:text-white p-0.5 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-[#202938]">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500 font-mono">
                    No unread notifications. System secure.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => onMarkNotificationRead(n.id)}
                      className={`p-3 text-xs cursor-pointer transition-colors hover:bg-[#151B26] ${
                        !n.read ? "bg-[#080B12]" : "opacity-75"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span
                          className={`font-semibold ${
                            n.severity === "high"
                              ? "text-rose-400"
                              : n.severity === "medium"
                              ? "text-amber-400"
                              : "text-sky-400"
                          }`}
                        >
                          {n.title}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {n.timestamp}
                        </span>
                      </div>
                      <p className="text-slate-300 line-clamp-2 leading-relaxed text-[11px]">
                        {n.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Security Architecture Spec Button */}
        <button
          onClick={onOpenSecuritySpec}
          className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#080B12] border border-[#202938] text-xs text-sky-400 hover:text-sky-300 transition-colors font-mono"
          title="Cryptographic Architecture Specifications"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-[11px]">Crypto Specs</span>
        </button>

        {/* Live JWT Session Timer Badge */}
        <div className="hidden sm:flex items-center gap-1.5 bg-[#080B12] border border-[#202938] rounded-lg px-2.5 py-1 text-xs">
          <button
            onClick={() => onTabSelect("settings")}
            className={`flex items-center gap-1.5 font-mono text-xs cursor-pointer hover:opacity-80 transition-opacity ${
              isCritical
                ? "text-rose-400 font-bold animate-pulse"
                : isWarning
                ? "text-amber-400 font-bold"
                : "text-slate-300"
            }`}
            title="JWT Session Time Remaining. Click to view settings."
          >
            <Clock className={`w-3.5 h-3.5 ${isCritical ? "text-rose-400" : "text-sky-400"}`} />
            <span>{formattedTimer}</span>
            <span className="text-[9px] text-slate-500 font-sans">JWT</span>
          </button>

          {onExtendSession && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onExtendSession(900);
              }}
              className="px-1.5 py-0.5 rounded bg-sky-500/15 hover:bg-sky-500/30 text-sky-300 text-[10px] font-bold border border-sky-500/30 transition-colors ml-1 cursor-pointer"
              title="Extend Session by +15 minutes"
            >
              +15m
            </button>
          )}
        </div>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2 pl-1 border-l border-[#202938]">
          <div className="w-8 h-8 rounded-full bg-sky-500/10 border border-sky-500/30 flex items-center justify-center font-bold text-xs text-sky-400 font-mono shrink-0 uppercase">
            {(userName || "HG").slice(0, 2)}
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-200 leading-none font-sans">
              {userName}
            </span>
            <span className="text-[10px] text-slate-400 font-mono leading-none mt-1">
              {currentRole}
            </span>
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              className="p-1.5 ml-1 rounded-lg bg-[#080B12] border border-[#202938] text-slate-400 hover:text-rose-400 transition-colors"
              title="Lock Session / Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
