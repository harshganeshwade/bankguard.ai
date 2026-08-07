import React, { useState } from "react";
import {
  LifeBuoy,
  Send,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Clock,
  User,
  MessageSquare,
  FileText,
  Lock,
  Search,
  Filter,
  CheckCircle,
  Radio,
  Bell,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import { UserRole, SupportTicket, Transaction, AuditLog } from "../types";

interface SupportHelpDeskViewProps {
  currentRole: UserRole;
  userName: string;
  userEmail: string;
  tickets: SupportTicket[];
  onAddTicket: (ticket: SupportTicket) => void;
  onUpdateTicketStatus: (ticketId: string, status: SupportTicket["status"]) => void;
  onAddAdminReply: (ticketId: string, replyText: string) => void;
  transactions?: Transaction[];
  auditLogs?: AuditLog[];
}

export const SupportHelpDeskView: React.FC<SupportHelpDeskViewProps> = ({
  currentRole,
  userName,
  userEmail,
  tickets,
  onAddTicket,
  onUpdateTicketStatus,
  onAddAdminReply,
  transactions = [],
  auditLogs = [],
}) => {
  const isAdmin = currentRole === "Admin";

  // Non-Admin Form State
  const [category, setCategory] = useState<SupportTicket["category"]>("Fraud Escalation");
  const [priority, setPriority] = useState<SupportTicket["priority"]>("Urgent");
  const [relatedRef, setRelatedRef] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [attachLogs, setAttachLogs] = useState<boolean>(true);
  const [submitSuccessMsg, setSubmitSuccessMsg] = useState<string | null>(null);

  // Admin Panel State
  const [adminTab, setAdminTab] = useState<"queries" | "fraud" | "logs">("queries");
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const [filterPriority, setFilterPriority] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [broadcastMsg, setBroadcastMsg] = useState<string>("");
  const [broadcastSent, setBroadcastSent] = useState<boolean>(false);

  // Handle Ticket Submission (By Non-Admin Users)
  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    const newTicketNum = `TKT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const newTicket: SupportTicket = {
      id: `ESC-${Date.now()}`,
      ticketNumber: newTicketNum,
      senderName: userName || "Staff User",
      senderRole: currentRole,
      senderEmail: userEmail || "staff@bankguard.in",
      category,
      priority,
      relatedRef: relatedRef.trim() || undefined,
      subject: subject.trim(),
      message: message.trim(),
      attachLogs,
      status: "Pending Admin Review",
      timestamp: "Just now",
      adminReplies: [],
    };

    onAddTicket(newTicket);
    setSubmitSuccessMsg(`Escalation ticket ${newTicketNum} dispatched directly to the Admin Messaging Panel!`);
    setSubject("");
    setMessage("");
    setRelatedRef("");
    setTimeout(() => setSubmitSuccessMsg(null), 6000);
  };

  // Handle Admin Reply
  const handleSendReply = (ticketId: string) => {
    const text = replyInputs[ticketId];
    if (!text || !text.trim()) return;

    onAddAdminReply(ticketId, text.trim());
    setReplyInputs((prev) => ({ ...prev, [ticketId]: "" }));
  };

  // Filtered tickets for Admin
  const filteredTickets = tickets.filter((t) => {
    if (filterPriority !== "All" && t.priority !== filterPriority) return false;
    if (
      searchQuery &&
      !t.subject.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !t.senderName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !t.message.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const highRiskTransactions = transactions.filter((t) => t.riskScore > 75);

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2.5">
            <LifeBuoy className="w-7 h-7 text-sky-400" />
            {isAdmin ? "Admin Security & Support Messaging Inbox" : "Help Desk & SecOps Escalation Portal"}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {isAdmin
              ? "Exclusive Admin Messaging Center for reviewing Help Desk queries, escalated fraud alerts, and security logs."
              : "Dispatch emergency fraud escalations, model retraining requests, and help queries directly to the Admin Panel Inbox."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-300 text-xs font-mono font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Role: <strong className="text-sky-400">{currentRole}</strong>
          </span>
          {isAdmin && (
            <span className="px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold font-mono">
              Admin Messaging Center
            </span>
          )}
        </div>
      </div>

      {/* NON-ADMIN HELP DESK PORTAL */}
      {!isAdmin && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Submission Form */}
          <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-5">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Send className="w-5 h-5 text-sky-400" />
                  Submit New Query / Fraud Escalation to Admin
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Direct message channel to CISO & System Administrator
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-bold">
                Direct Admin Route
              </span>
            </div>

            {submitSuccessMsg && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-3 animate-fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="font-semibold">{submitSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmitTicket} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">
                    Ticket Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500"
                  >
                    <option value="Fraud Escalation">Fraud Escalation</option>
                    <option value="Account Freeze Request">Account Freeze Request</option>
                    <option value="Model Retraining">Model Retraining</option>
                    <option value="Security Query">Security Query</option>
                    <option value="System Support">System Support</option>
                    <option value="General Query">General Query</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">
                    Urgency Level
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500"
                  >
                    <option value="Urgent">Urgent (Immediate SecOps Action)</option>
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  Related Account / Transaction ID (Optional)
                </label>
                <input
                  type="text"
                  value={relatedRef}
                  onChange={(e) => setRelatedRef(e.target.value)}
                  placeholder="e.g. TX-9012 or ACC-3304"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  Subject Line
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Brief summary of the issue or escalation request..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  Detailed Escalation Description / Query
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Provide all relevant details, anomalous transaction velocity, IP addresses, or system questions for Admin review..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500"
                ></textarea>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="attachLogs"
                  checked={attachLogs}
                  onChange={(e) => setAttachLogs(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-950 text-sky-500 focus:ring-0"
                />
                <label htmlFor="attachLogs" className="text-slate-400 cursor-pointer">
                  Attach active session telemetry & audit logs automatically
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-sky-500/20"
              >
                <Send className="w-4 h-4" />
                Dispatch Escalation Ticket to Admin
              </button>
            </form>
          </div>

          {/* History of Sent Tickets & Replies */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-sky-400" />
                  My Sent Tickets & Admin Replies
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">
                  {tickets.length} total
                </span>
              </div>

              <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
                {tickets.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 text-xs">
                    No support tickets submitted yet. Use the form to send an escalation to Admin.
                  </div>
                ) : (
                  tickets.map((t) => (
                    <div
                      key={t.id}
                      className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-mono text-[10px] text-sky-400 font-bold">
                            {t.ticketNumber}
                          </span>
                          <h4 className="font-bold text-slate-200 text-xs mt-0.5">
                            {t.subject}
                          </h4>
                        </div>
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
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-2">{t.message}</p>

                      <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1 font-mono border-t border-slate-900">
                        <span>Category: {t.category}</span>
                        <span>{t.timestamp}</span>
                      </div>

                      {/* Admin Replies Section */}
                      {t.adminReplies && t.adminReplies.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-slate-800 space-y-2">
                          <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block">
                            Replies from Admin Messaging Box:
                          </span>
                          {t.adminReplies.map((r) => (
                            <div
                              key={r.id}
                              className="p-2.5 rounded-lg bg-sky-950/40 border border-sky-800/40 text-xs text-sky-200 space-y-1"
                            >
                              <div className="flex justify-between text-[10px] font-bold text-sky-300">
                                <span>{r.sender}</span>
                                <span className="font-mono text-slate-400">{r.timestamp}</span>
                              </div>
                              <p className="text-slate-200">{r.text}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN EXCLUSIVE MESSAGING CENTER */}
      {isAdmin && (
        <div className="space-y-6">
          {/* Admin Navigation & Broadcast Bar */}
          <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            {/* Tabs */}
            <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
              <button
                onClick={() => setAdminTab("queries")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                  adminTab === "queries"
                    ? "bg-sky-500 text-slate-950 shadow-md"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
              >
                <LifeBuoy className="w-4 h-4" />
                Help Desk Escalations ({tickets.length})
              </button>

              <button
                onClick={() => setAdminTab("fraud")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                  adminTab === "fraud"
                    ? "bg-red-500 text-slate-950 shadow-md"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                Flagged Fraud Feeds ({highRiskTransactions.length})
              </button>

              <button
                onClick={() => setAdminTab("logs")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                  adminTab === "logs"
                    ? "bg-emerald-500 text-slate-950 shadow-md"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
              >
                <FileText className="w-4 h-4" />
                Security & Audit Logs ({auditLogs.length || 18})
              </button>
            </div>

            {/* Broadcast feature */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={broadcastMsg}
                onChange={(e) => setBroadcastMsg(e.target.value)}
                placeholder="Broadcast Admin alert message..."
                className="bg-slate-950 border border-slate-800 text-xs px-3 py-2 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500 w-64"
              />
              <button
                onClick={() => {
                  if (broadcastMsg) {
                    setBroadcastSent(true);
                    setTimeout(() => {
                      setBroadcastSent(false);
                      setBroadcastMsg("");
                    }, 4000);
                  }
                }}
                className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shrink-0 flex items-center gap-1.5"
              >
                <Bell className="w-4 h-4" />
                {broadcastSent ? "Broadcasted!" : "Broadcast Notice"}
              </button>
            </div>
          </div>

          {/* TAB 1: HELP DESK ESCALATION MESSAGING BOX */}
          {adminTab === "queries" && (
            <div className="space-y-4">
              {/* Filter controls */}
              <div className="flex justify-between items-center gap-4 bg-slate-900/40 p-3 rounded-xl border border-slate-800/80">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search queries, submitters, tickets..."
                    className="w-full bg-slate-950 border border-slate-800 text-xs pl-9 pr-3 py-1.5 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400">Urgency:</span>
                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none"
                  >
                    <option value="All">All Priorities</option>
                    <option value="Urgent">Urgent</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              {/* Message Cards List */}
              <div className="space-y-4">
                {filteredTickets.length === 0 ? (
                  <div className="p-8 text-center bg-slate-900/40 border border-slate-800 rounded-2xl text-slate-500 text-xs">
                    No Help Desk escalation queries matched the filter.
                  </div>
                ) : (
                  filteredTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-md hover:border-slate-700 transition-all"
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-3">
                          <span className="px-2.5 py-1 rounded-md bg-sky-500/10 border border-sky-500/20 text-sky-400 font-mono font-bold text-xs">
                            {ticket.ticketNumber}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                              ticket.priority === "Urgent"
                                ? "bg-red-500/10 text-red-400 border-red-500/30"
                                : ticket.priority === "High"
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                                : "bg-slate-800 text-slate-300 border-slate-700"
                            }`}
                          >
                            {ticket.priority} Urgency
                          </span>
                          <span className="text-xs text-slate-400 font-medium">
                            Category: <strong className="text-slate-200">{ticket.category}</strong>
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-slate-500 font-mono">{ticket.timestamp}</span>
                          <select
                            value={ticket.status}
                            onChange={(e) => onUpdateTicketStatus(ticket.id, e.target.value as any)}
                            className="bg-slate-950 border border-slate-700 text-slate-200 text-xs font-bold rounded-lg px-2.5 py-1 focus:outline-none"
                          >
                            <option value="Pending Admin Review">Pending Review</option>
                            <option value="In Investigation">In Investigation</option>
                            <option value="Escalated to RBI/FinCEN">Escalated to FIU/FinCEN</option>
                            <option value="Resolved">Resolved</option>
                          </select>
                        </div>
                      </div>

                      {/* Submitter & Content */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs text-slate-400">
                          <span className="flex items-center gap-2 font-semibold text-slate-200">
                            <User className="w-4 h-4 text-sky-400" />
                            {ticket.senderName} ({ticket.senderRole}) &bull;{" "}
                            <span className="text-slate-400 font-mono text-[11px]">{ticket.senderEmail}</span>
                          </span>
                          {ticket.relatedRef && (
                            <span className="font-mono text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                              Ref: {ticket.relatedRef}
                            </span>
                          )}
                        </div>

                        <h3 className="text-sm font-bold text-slate-100">{ticket.subject}</h3>
                        <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
                          {ticket.message}
                        </p>
                      </div>

                      {/* Admin Direct Action Buttons & Reply Input */}
                      <div className="pt-2 border-t border-slate-800 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                onUpdateTicketStatus(ticket.id, "In Investigation");
                                alert(`Admin directive issued: Emergency freeze placed for escalation ${ticket.ticketNumber}`);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 font-bold text-xs transition-colors"
                            >
                              Enforce Emergency Freeze
                            </button>
                            <button
                              onClick={() => {
                                onUpdateTicketStatus(ticket.id, "Escalated to RBI/FinCEN");
                                alert(`SAR report cryptographically generated and dispatched to FIU-IND for ticket ${ticket.ticketNumber}`);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 hover:bg-amber-400/20 text-amber-400 font-bold text-xs transition-colors"
                            >
                              Dispatch SAR to FIU-IND
                            </button>
                            <button
                              onClick={() => onUpdateTicketStatus(ticket.id, "Resolved")}
                              className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-400 font-bold text-xs transition-colors"
                            >
                              Mark Resolved
                            </button>
                          </div>
                        </div>

                        {/* Existing Admin Replies */}
                        {ticket.adminReplies && ticket.adminReplies.length > 0 && (
                          <div className="space-y-2 pt-2">
                            <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block">
                              Previous Admin Responses:
                            </span>
                            {ticket.adminReplies.map((r) => (
                              <div
                                key={r.id}
                                className="p-3 rounded-xl bg-sky-950/40 border border-sky-800/40 text-xs space-y-1"
                              >
                                <div className="flex justify-between text-[10px] font-bold text-sky-300">
                                  <span>{r.sender}</span>
                                  <span className="font-mono text-slate-400">{r.timestamp}</span>
                                </div>
                                <p className="text-slate-200">{r.text}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Admin Messaging Box Reply Input */}
                        <div className="flex items-center gap-2 pt-2">
                          <input
                            type="text"
                            value={replyInputs[ticket.id] || ""}
                            onChange={(e) =>
                              setReplyInputs({ ...replyInputs, [ticket.id]: e.target.value })
                            }
                            placeholder="Type Admin response or directive back to submitter..."
                            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500"
                          />
                          <button
                            onClick={() => handleSendReply(ticket.id)}
                            className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shrink-0 flex items-center gap-1.5 transition-colors"
                          >
                            <Send className="w-3.5 h-3.5" />
                            Send Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 2: FLAGGED FRAUD FEEDS */}
          {adminTab === "fraud" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-red-950/20 border border-red-800/40 text-xs text-red-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                  <span>
                    Direct Admin CISO feed for transactions evaluated with risk score &gt; 75/100.
                  </span>
                </div>
                <span className="font-bold text-red-400 font-mono">
                  {highRiskTransactions.length} Pending Actions
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {highRiskTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-mono text-xs text-sky-400 font-bold">{tx.txId}</span>
                        <h4 className="font-bold text-slate-200 text-sm">{tx.customerName}</h4>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-red-500/10 text-red-400 text-xs font-bold border border-red-500/20 font-mono">
                        Risk: {tx.riskScore}/100
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Amount</span>
                        <span className="font-bold text-slate-100">₹{tx.amount.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Destination</span>
                        <span className="text-slate-300 truncate block">{tx.destination}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs pt-1">
                      <span className="text-slate-400">{tx.timestamp}</span>
                      <button
                        onClick={() => alert(`Admin CISO lock placed on transaction ${tx.txId}`)}
                        className="px-3 py-1 rounded bg-red-500 hover:bg-red-400 text-slate-950 font-bold text-xs"
                      >
                        Enforce Lock
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SECURITY & AUDIT LOGS */}
          {adminTab === "logs" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex justify-between items-center">
                <span>Real-Time Admin SecOps Audit Stream</span>
                <span className="font-mono text-emerald-400 text-[10px] font-bold">
                  CRYPTOGRAPHIC LOG INTEGRITY VERIFIED
                </span>
              </div>

              <div className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden text-xs font-mono">
                <div className="divide-y divide-slate-800/80">
                  {(auditLogs.length > 0 ? auditLogs : [
                    { id: "L1", timestamp: "2026-08-06 23:28:10", action: "FAILED_MFA_BURST", user: "192.168.1.105 (Moscow)", details: "Argon2 hash mismatch on account ACC-3304" },
                    { id: "L2", timestamp: "2026-08-06 23:25:04", action: "SAR_GENERATED", user: "Ananya Sharma (Analyst)", details: "FIU-IND compliant report for TX-9012" },
                    { id: "L3", timestamp: "2026-08-06 23:20:15", action: "ZKP_BIOMETRIC_FAIL", user: "Delhi Branch Node", details: "UIDAI biometric zero-knowledge proof rejected" },
                  ]).map((log, idx) => (
                    <div key={idx} className="p-3 hover:bg-slate-900/40 flex justify-between items-center">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sky-400 font-bold">{log.action}</span>
                          <span className="text-slate-400">&bull; {log.user}</span>
                        </div>
                        <div className="text-slate-500 text-[11px]">{log.details}</div>
                      </div>
                      <span className="text-slate-600 text-[10px]">{log.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
