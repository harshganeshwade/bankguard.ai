import React, { useState } from "react";
import {
  FileCheck2,
  Search,
  Lock,
  Download,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Terminal,
} from "lucide-react";
import { AuditLog } from "../types";

interface AuditLogViewProps {
  logs: AuditLog[];
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({ logs }) => {
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("ALL");

  const filtered = logs.filter((log) => {
    const matchSearch =
      log.username.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.ip.includes(search) ||
      log.newValue.toLowerCase().includes(search.toLowerCase());

    const matchRisk = riskFilter === "ALL" || log.riskTag === riskFilter;

    return matchSearch && matchRisk;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-6 h-6 text-[#38BDF8]" />
            <h1 className="text-3xl font-bold text-[#bec6e0] font-headline-md">
              Immutable Governance Audit Logs
            </h1>
          </div>
          <p className="text-sm text-[#c6c6cd] mt-1">
            Cryptographically sealed ledger of administrative overrides, customer updates, and employee activities.
          </p>
        </div>

        <button
          onClick={() => {
            const jsonStr = JSON.stringify(logs, null, 2);
            const blob = new Blob([jsonStr], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `BankGuard_Audit_Log_${Date.now()}.json`;
            a.click();
          }}
          className="bg-[#1E293B] border border-[#334155] text-[#d4e4fa] text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-[#334155] transition-colors self-start md:self-auto"
        >
          <Download className="w-4 h-4 text-[#38BDF8]" />
          <span>Export Audit Ledger (.JSON)</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#c6c6cd]" />
          <input
            type="text"
            placeholder="Search username, action, IP address, device..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0F172A] border border-[#334155] rounded-lg py-2 pl-10 pr-4 text-xs text-[#d4e4fa] placeholder-[#909097] focus:outline-none focus:border-[#38BDF8]"
          />
        </div>

        <select
          value={riskFilter}
          onChange={(e) => setRiskFilter(e.target.value)}
          className="bg-[#0F172A] border border-[#334155] text-xs text-[#d4e4fa] rounded-lg px-3 py-2 focus:outline-none"
        >
          <option value="ALL">All Risk Tags</option>
          <option value="CRITICAL">Critical</option>
          <option value="ELEVATED">Elevated</option>
          <option value="ROUTINE">Routine</option>
          <option value="LOW">Low</option>
        </select>
      </div>

      {/* Main Table */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-[#334155] bg-[#0F172A] flex justify-between items-center">
          <span className="text-xs font-bold text-[#c6c6cd] uppercase tracking-wider">
            Audit Ledger ({filtered.length} entries)
          </span>
          <span className="text-[10px] font-mono text-[#10B981] flex items-center gap-1">
            <Lock className="w-3 h-3" />
            <span>SHA-256 Tamper Proof</span>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#0D1C2D] border-b border-[#334155] text-[10px] text-[#c6c6cd] font-bold uppercase tracking-wider">
                <th className="p-4">Timestamp (UTC)</th>
                <th className="p-4">User & Role</th>
                <th className="p-4">Client Endpoint / IP</th>
                <th className="p-4">Action</th>
                <th className="p-4">Previous & New State</th>
                <th className="p-4 text-center">Risk Level</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#334155] text-xs">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-[#334155]/60 transition-colors">
                  <td className="p-4 font-mono text-[11px] text-[#909097] whitespace-nowrap">
                    {log.timestamp}
                  </td>

                  <td className="p-4">
                    <div className="font-bold text-[#d4e4fa]">{log.username}</div>
                    <div className="text-[10px] text-[#38BDF8]">{log.role}</div>
                  </td>

                  <td className="p-4 font-mono text-[11px] text-[#c6c6cd]">
                    <div>{log.ip}</div>
                    <div className="text-[10px] text-[#909097] truncate max-w-[150px]">
                      {log.browser}
                    </div>
                  </td>

                  <td className="p-4 font-semibold text-[#d4e4fa]">
                    {log.action}
                  </td>

                  <td className="p-4 text-[11px] space-y-0.5">
                    <div className="text-[#909097] line-clamp-1">{log.previousValue}</div>
                    <div className="text-[#10B981] line-clamp-1 font-mono">{log.newValue}</div>
                  </td>

                  <td className="p-4 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        log.riskTag === "CRITICAL"
                          ? "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30"
                          : log.riskTag === "ELEVATED"
                          ? "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30"
                          : "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30"
                      }`}
                    >
                      {log.riskTag}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
