import React, { useState } from "react";
import {
  CreditCard,
  Plus,
  Search,
  Lock,
  Ban,
  CheckCircle2,
  IndianRupee,
  FileText,
  X,
  Building,
  Download,
} from "lucide-react";
import { BankAccount, AccountType, AccountStatus } from "../types";
import { exportToCsv } from "../utils/downloadReport";

interface AccountViewProps {
  accounts: BankAccount[];
  onAddAccount: (acc: BankAccount) => void;
  onUpdateAccount: (acc: BankAccount) => void;
}

export const AccountView: React.FC<AccountViewProps> = ({
  accounts,
  onAddAccount,
  onUpdateAccount,
}) => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAcc, setSelectedAcc] = useState<BankAccount | null>(null);

  // New Account Form
  const [form, setFormData] = useState({
    customerName: "",
    type: "Savings" as AccountType,
    balance: 5000,
    branchName: "Financial District Main",
  });

  const filtered = accounts.filter((a) => {
    const matchSearch =
      a.accountNumber.includes(search) ||
      a.customerName.toLowerCase().includes(search.toLowerCase()) ||
      a.branchName.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "All" || a.type === typeFilter;
    return matchSearch && matchType;
  });

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customerName) return;

    const newAcc: BankAccount = {
      id: `ACC-${Math.floor(1000 + Math.random() * 9000)}`,
      accountNumber: `${Math.floor(4000 + Math.random() * 5000)}-${Math.floor(
        1000 + Math.random() * 9000
      )}-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: "CUST-1001",
      customerName: form.customerName,
      type: form.type,
      balance: Number(form.balance),
      currency: "INR",
      status: "Active",
      createdAt: new Date().toISOString().split("T")[0],
      branchName: form.branchName,
      linkedCardCount: 1,
    };

    onAddAccount(newAcc);
    setShowCreateModal(false);
    setFormData({
      customerName: "",
      type: "Savings",
      balance: 5000,
      branchName: "Financial District Main",
    });
  };

  const setStatus = (acc: BankAccount, status: AccountStatus) => {
    const updated = { ...acc, status };
    onUpdateAccount(updated);
    if (selectedAcc?.id === acc.id) setSelectedAcc(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#bec6e0] font-headline-md">
            Bank Account Management
          </h1>
          <p className="text-sm text-[#c6c6cd] mt-1">
            Create, monitor, freeze, or close customer bank accounts & linked cards.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() =>
              exportToCsv(
                `Bank_Accounts_Ledger_${new Date().toISOString().split("T")[0]}.csv`,
                accounts.map((a) => ({
                  ID: a.id,
                  AccountNumber: a.accountNumber,
                  CustomerName: a.customerName,
                  Type: a.type,
                  Balance: `INR ${a.balance}`,
                  Status: a.status,
                  Branch: a.branchName,
                  CreatedAt: a.createdAt,
                }))
              )
            }
            className="bg-[#1E293B] border border-[#334155] text-[#d4e4fa] text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-[#334155] transition-colors shadow-md"
          >
            <Download className="w-4 h-4 text-[#38BDF8]" />
            <span>Export Accounts Ledger (CSV)</span>
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-[#38BDF8] text-[#051424] text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity shadow-md"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Create New Account</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#c6c6cd]" />
          <input
            type="text"
            placeholder="Search account number, customer name, branch..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0F172A] border border-[#334155] rounded-lg py-2 pl-10 pr-4 text-xs text-[#d4e4fa] placeholder-[#909097] focus:outline-none focus:border-[#38BDF8]"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-[#0F172A] border border-[#334155] text-xs text-[#d4e4fa] rounded-lg px-3 py-2 focus:outline-none"
        >
          <option value="All">All Account Types</option>
          <option value="Savings">Savings</option>
          <option value="Current">Current</option>
          <option value="Salary">Salary</option>
          <option value="Fixed Deposit">Fixed Deposit</option>
        </select>
      </div>

      {/* Accounts List Container */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-xl overflow-hidden shadow-lg">
        <div className="px-6 py-4 border-b border-[#334155] bg-[#0F172A] flex justify-between items-center">
          <span className="text-xs font-bold text-[#c6c6cd] uppercase tracking-wider">
            Active Banking Ledger ({filtered.length})
          </span>
        </div>

        <div className="divide-y divide-[#334155]">
          {filtered.map((acc) => (
            <div
              key={acc.id}
              className="p-4 hover:bg-[#334155]/60 transition-colors flex flex-col md:grid md:grid-cols-12 gap-4 items-center"
            >
              <div className="md:col-span-4 flex items-center gap-3 w-full">
                <div className="p-2.5 bg-[#0F172A] border border-[#334155] text-[#38BDF8] rounded-lg shrink-0">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-sm text-[#d4e4fa]">
                    {acc.customerName}
                  </div>
                  <div className="font-mono text-xs text-[#38BDF8]">
                    {acc.accountNumber}
                  </div>
                </div>
              </div>

              <div className="md:col-span-3 text-xs text-[#c6c6cd] w-full">
                <div>Type: <span className="text-[#d4e4fa] font-semibold">{acc.type}</span></div>
                <div>Branch: {acc.branchName}</div>
              </div>

              <div className="md:col-span-2 w-full">
                <div className="font-mono text-base font-bold text-[#10B981]">
                  ₹{acc.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
                <div className="text-[10px] text-[#909097]">{acc.currency} Available</div>
              </div>

              <div className="md:col-span-3 flex items-center justify-end gap-2 w-full">
                <span
                  className={`px-2 py-1 rounded text-[10px] font-bold border ${
                    acc.status === "Active"
                      ? "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30"
                      : "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30"
                  }`}
                >
                  {acc.status}
                </span>

                <button
                  onClick={() => setSelectedAcc(acc)}
                  className="px-3 py-1.5 bg-[#0F172A] border border-[#334155] text-[#d4e4fa] text-xs font-medium rounded hover:bg-[#334155]"
                >
                  Manage / Statement
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Account Details & Statement Modal */}
      {selectedAcc && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-[#334155] rounded-xl max-w-2xl w-full p-6 space-y-5 text-xs text-[#d4e4fa]">
            <div className="flex justify-between items-center border-b border-[#334155] pb-3">
              <div>
                <h2 className="text-base font-bold text-[#bec6e0]">
                  Account Control Panel
                </h2>
                <div className="font-mono text-xs text-[#38BDF8]">
                  {selectedAcc.accountNumber}
                </div>
              </div>
              <button
                onClick={() => setSelectedAcc(null)}
                className="text-[#c6c6cd]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#0F172A] p-3 rounded-lg border border-[#334155]">
                <div className="text-[#909097] font-semibold">Account Holder</div>
                <div className="text-sm font-bold text-[#d4e4fa]">{selectedAcc.customerName}</div>
              </div>

              <div className="bg-[#0F172A] p-3 rounded-lg border border-[#334155]">
                <div className="text-[#909097] font-semibold">Current Balance</div>
                <div className="text-lg font-bold text-[#10B981] font-mono">
                  ₹{selectedAcc.balance.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="border-t border-[#334155] pt-4">
              <div className="text-xs font-bold text-[#c6c6cd] uppercase mb-2">
                Manager Actions
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setStatus(selectedAcc, "Active")}
                  className="px-3 py-1.5 bg-[#10B981] text-[#051424] font-bold rounded"
                >
                  Activate Account
                </button>
                <button
                  onClick={() => setStatus(selectedAcc, "Frozen")}
                  className="px-3 py-1.5 bg-[#F59E0B] text-[#051424] font-bold rounded"
                >
                  Freeze Account
                </button>
                <button
                  onClick={() => setStatus(selectedAcc, "Blocked")}
                  className="px-3 py-1.5 bg-[#EF4444] text-white font-bold rounded"
                >
                  Block Account
                </button>
                <button
                  onClick={() => setStatus(selectedAcc, "Closed")}
                  className="px-3 py-1.5 bg-[#0F172A] border border-[#334155] text-[#909097] font-bold rounded"
                >
                  Close Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Account Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateAccount}
            className="bg-[#1E293B] border border-[#334155] rounded-xl max-w-md w-full p-6 space-y-4 text-xs text-[#d4e4fa]"
          >
            <div className="flex justify-between items-center border-b border-[#334155] pb-3">
              <h2 className="text-base font-bold text-[#bec6e0]">
                Open Bank Account
              </h2>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-[#c6c6cd]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-[#909097] mb-1">Customer Name</label>
              <input
                type="text"
                required
                placeholder="Marcus Chen"
                value={form.customerName}
                onChange={(e) => setFormData({ ...form, customerName: e.target.value })}
                className="w-full bg-[#0F172A] border border-[#334155] rounded p-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-[#909097] mb-1">Account Type</label>
              <select
                value={form.type}
                onChange={(e) => setFormData({ ...form, type: e.target.value as AccountType })}
                className="w-full bg-[#0F172A] border border-[#334155] rounded p-2 text-xs"
              >
                <option value="Savings">Savings Account</option>
                <option value="Current">Current Business Account</option>
                <option value="Salary">Salary Account</option>
                <option value="Fixed Deposit">Fixed Deposit</option>
              </select>
            </div>

            <div>
              <label className="block text-[#909097] mb-1">Opening Deposit (₹)</label>
              <input
                type="number"
                value={form.balance}
                onChange={(e) => setFormData({ ...form, balance: Number(e.target.value) })}
                className="w-full bg-[#0F172A] border border-[#334155] rounded p-2 text-xs font-mono"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#334155]">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-3 py-1.5 bg-[#0F172A] border border-[#334155] rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#38BDF8] text-[#051424] font-bold rounded"
              >
                Issue Account
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
