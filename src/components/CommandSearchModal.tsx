import React, { useState, useEffect } from "react";
import {
  Search,
  X,
  ShieldAlert,
  Users,
  CreditCard,
  Activity,
  Skull,
  FileCheck2,
  Lock,
  ArrowRight,
  Network,
  Brain,
} from "lucide-react";
import { Customer, BankAccount, Transaction } from "../types";

interface CommandSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (tab: string) => void;
  onTabSelect?: (tab: string) => void;
  customers?: Customer[];
  accounts?: BankAccount[];
  transactions?: Transaction[];
  onSelectTx?: (tx: Transaction) => void;
}

export const CommandSearchModal: React.FC<CommandSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onTabSelect,
  customers = [],
  accounts = [],
  transactions = [],
  onSelectTx,
}) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open search modal
          const btn = document.getElementById("open-command-search-btn");
          if (btn) btn.click();
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const safeCustomers = customers || [];
  const safeAccounts = accounts || [];
  const safeTxs = transactions || [];

  const filteredCustomers = q
    ? safeCustomers.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.mobile.includes(q) ||
          c.id.toLowerCase().includes(q)
      )
    : safeCustomers.slice(0, 3);

  const filteredAccounts = q
    ? safeAccounts.filter(
        (a) =>
          a.accountNumber.toLowerCase().includes(q) ||
          a.customerName.toLowerCase().includes(q)
      )
    : safeAccounts.slice(0, 3);

  const filteredTxs = q
    ? safeTxs.filter(
        (t) =>
          t.txId.toLowerCase().includes(q) ||
          t.customerName.toLowerCase().includes(q) ||
          t.accountNumber.toLowerCase().includes(q) ||
          t.amount.toString().includes(q)
      )
    : safeTxs.slice(0, 3);

  const quickActions = [
    { label: "Open Fraud Operations Center", tab: "fraud", icon: ShieldAlert },
    { label: "Start Live Attack Simulation", tab: "attack-lab", icon: Skull },
    { label: "Inspect Money Mule Network", tab: "mule-graph", icon: Network },
    { label: "Explainable AI (SHAP Reasoning)", tab: "xai-explain", icon: Brain },
    { label: "View System Audit Logs", tab: "audit", icon: FileCheck2 },
    { label: "Security & Role Settings (RBAC)", tab: "security", icon: Lock },
  ].filter((a) => !q || a.label.toLowerCase().includes(q));

  const handleNavigate = (tab: string) => {
    if (onNavigate) onNavigate(tab);
    if (onTabSelect) onTabSelect(tab);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/70 backdrop-blur-xs p-4">
      <div
        className="w-full max-w-2xl bg-[#0F141D] border border-[#202938] rounded-xl shadow-2xl overflow-hidden flex flex-col text-slate-100 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="p-3.5 border-b border-[#202938] bg-[#151B26] flex items-center gap-3">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search customers, accounts, transactions, security events... (Esc to close)"
            className="w-full bg-transparent text-slate-100 text-sm focus:outline-none placeholder:text-slate-500 font-sans"
            autoFocus
          />
          <span className="hidden sm:inline-block font-mono text-[10px] bg-[#080B12] border border-[#202938] px-2 py-0.5 rounded text-slate-400">
            ESC
          </span>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-[#202938] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4 text-xs font-sans">
          {/* Quick Actions */}
          {quickActions.length > 0 && (
            <div className="space-y-1">
              <div className="px-2 py-1 text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
                Quick Actions
              </div>
              {quickActions.map((act, i) => {
                const Icon = act.icon;
                return (
                  <button
                    key={i}
                    onClick={() => handleNavigate(act.tab)}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[#151B26] text-slate-300 hover:text-white transition-colors text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-sky-400" />
                      <span>{act.label}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  </button>
                );
              })}
            </div>
          )}

          {/* Customers */}
          {filteredCustomers.length > 0 && (
            <div className="space-y-1 border-t border-[#202938] pt-3">
              <div className="px-2 py-1 text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-sky-400" />
                <span>Customers</span>
              </div>
              {filteredCustomers.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleNavigate("clients")}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[#151B26] text-left transition-colors"
                >
                  <div>
                    <div className="font-medium text-slate-200">{c.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      ID: {c.id} · {c.email}
                    </div>
                  </div>
                  <span
                    className={`font-mono text-[10px] px-2 py-0.5 rounded border ${
                      c.riskScore > 60
                        ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    }`}
                  >
                    Risk {c.riskScore}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Accounts */}
          {filteredAccounts.length > 0 && (
            <div className="space-y-1 border-t border-[#202938] pt-3">
              <div className="px-2 py-1 text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-sky-400" />
                <span>Bank Accounts</span>
              </div>
              {filteredAccounts.map((acc) => (
                <button
                  key={acc.id}
                  onClick={() => handleNavigate("accounts")}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[#151B26] text-left transition-colors"
                >
                  <div>
                    <div className="font-medium text-slate-200 font-mono">
                      {acc.accountNumber} ({acc.type})
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Holder: {acc.customerName}
                    </div>
                  </div>
                  <div className="text-right font-mono text-slate-200">
                    ₹{acc.balance.toLocaleString()}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Transactions */}
          {filteredTxs.length > 0 && (
            <div className="space-y-1 border-t border-[#202938] pt-3">
              <div className="px-2 py-1 text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-sky-400" />
                <span>Transactions</span>
              </div>
              {filteredTxs.map((tx) => (
                <button
                  key={tx.id}
                  onClick={() => {
                    if (onSelectTx) onSelectTx(tx);
                    handleNavigate("activity");
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[#151B26] text-left transition-colors font-mono"
                >
                  <div>
                    <div className="font-semibold text-slate-200">
                      {tx.txId} · {tx.customerName}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {tx.type} · {tx.timestamp}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-slate-100 font-bold">
                      ₹{tx.amount.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-rose-400">
                      Risk {tx.riskScore}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-2.5 bg-[#080B12] border-t border-[#202938] text-[10px] text-slate-500 font-mono flex justify-between">
          <span>Navigate with ↵ or click</span>
          <span>BankGuard AI SOC Search</span>
        </div>
      </div>
    </div>
  );
};
