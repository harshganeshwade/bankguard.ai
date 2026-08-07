import React, { useState } from "react";
import {
  Shield,
  Bell,
  RefreshCw,
  UserCheck,
  CheckCircle2,
  X,
  AlertTriangle,
  Zap,
  Lock,
  LogOut,
  ShieldCheck,
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
  onLogout?: () => void;
  onOpenSecuritySpec?: () => void;
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
  userName = "Vikramaditya Rao",
  userEmail = "vikramaditya.rao@bankguard.ai",
  onLogout,
  onOpenSecuritySpec,
}) => {
  const [showNotifModal, setShowNotifModal] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="bg-slate-900/90 backdrop-blur border-b border-slate-800 fixed top-0 w-full z-50 flex items-center justify-between px-4 md:px-6 h-14 shrink-0">
      {/* Left Branding */}
      <div className="flex items-center gap-3">
        <div
          onClick={() => onTabSelect("dash")}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <span className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 group-hover:scale-105 transition-transform flex items-center justify-center">
            <Shield className="w-5 h-5 stroke-[2.5]" />
          </span>
          <span className="font-bold text-lg tracking-tight text-slate-100">
            BankGuard<span className="text-sky-400">.ai</span>
          </span>
        </div>
        <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/50 font-mono">
          v2.4 Pro
        </span>
      </div>

      {/* Right Tools & Role Switcher */}
      <div className="flex items-center gap-3">
        {/* Role Selector Badge */}
        <div className="hidden lg:flex items-center gap-1.5 bg-slate-950/60 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-400">
          <UserCheck className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-[11px] text-slate-500 font-medium">Role:</span>
          <select
            value={currentRole}
            onChange={(e) => onRoleChange(e.target.value as UserRole)}
            className="bg-transparent text-slate-200 font-semibold text-xs focus:outline-none cursor-pointer"
          >
            <option value="Admin" className="bg-slate-900 text-white">
              Admin (Full)
            </option>
            <option value="Manager" className="bg-slate-900 text-white">
              Manager
            </option>
            <option value="Auditor" className="bg-slate-900 text-white">
              Auditor (Read-Only)
            </option>
            <option value="Employee" className="bg-slate-900 text-white">
              Employee (Limited)
            </option>
          </select>
        </div>

        {/* Sync Button */}
        <button
          onClick={onSync}
          disabled={isSyncing}
          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors"
          title="Sync AI Threat Models & Ledger"
        >
          <RefreshCw
            className={`w-4 h-4 ${isSyncing ? "animate-spin text-sky-400" : ""}`}
          />
        </button>

        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifModal(!showNotifModal)}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors relative"
            title="Notification Center"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
            )}
          </button>

          {/* Notifications Modal Dropdown */}
          {showNotifModal && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-sky-400" />
                  <span className="text-xs font-bold text-slate-200">
                    Security Alerts ({notifications.length})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={onClearNotifications}
                    className="text-[10px] text-slate-400 hover:text-red-400 transition-colors"
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

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500">
                    No unread notifications. System secure.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => onMarkNotificationRead(n.id)}
                      className={`p-3 text-xs cursor-pointer transition-colors hover:bg-slate-800/50 ${
                        !n.read ? "bg-slate-950/70" : "opacity-75"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span
                          className={`font-semibold ${
                            n.severity === "high"
                              ? "text-red-400"
                              : n.severity === "medium"
                              ? "text-amber-400"
                              : "text-sky-400"
                          }`}
                        >
                          {n.title}
                        </span>
                        <span className="text-[10px] text-slate-500 whitespace-nowrap">
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
          className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-sky-400 hover:text-sky-300 hover:bg-slate-800/60 transition-colors font-medium"
          title="Cryptographic Architecture Specifications"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-[11px]">Crypto Specs</span>
        </button>

        {/* User Profile Avatar & Logout */}
        <div className="flex items-center gap-2 pl-1 border-l border-slate-800/80">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center font-bold text-xs text-slate-950 shadow-sm shrink-0 uppercase">
            {userName.slice(0, 2)}
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-200 leading-none">
              {userName}
            </span>
            <span className="text-[10px] text-slate-400 leading-none mt-1">
              {currentRole} Session
            </span>
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              className="p-1.5 ml-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
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
