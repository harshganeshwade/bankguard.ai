import React, { useState } from "react";
import {
  FileText,
  Printer,
  Download,
  X,
  Sparkles,
  ShieldAlert,
  Building2,
  Calendar,
  CheckCircle2,
  Lock,
  Stamp,
  UserCheck,
} from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import { Transaction } from "../types";
import { downloadFile } from "../utils/downloadReport";

interface SarReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction?: Transaction | null;
}

export const SarReportModal: React.FC<SarReportModalProps> = ({
  isOpen,
  onClose,
  transaction,
}) => {
  const [isGeneratingAiSummary, setIsGeneratingAiSummary] = useState(false);
  const [aiSummaryText, setAiSummaryText] = useState<string>(
    "Subject entity executed high-velocity layering transfers across multiple shell accounts within 25 minutes. Primary flags include unrecognized hardware IP subnet in Zurich, Switzerland, and instant crypto offramping."
  );

  if (!isOpen) return null;

  const reportRefNumber = `SAR-RBI-2026-${Math.floor(100000 + Math.random() * 900000)}`;
  const currentDate = new Date().toISOString().split("T")[0];

  const handleGenerateGeminiNarrative = async () => {
    setIsGeneratingAiSummary(true);
    try {
      // Simulate or call Gemini API
      setTimeout(() => {
        setAiSummaryText(
          `OFFICIAL COMPLIANCE NARRATIVE: On ${currentDate}, BankGuard.ai's Machine Learning Risk Engine intercepted an anomalous transfer of ₹${
            transaction ? transaction.amount.toLocaleString() : "4,50,000"
          } initiated by Account ${
            transaction ? transaction.accountNumber : "4592-0012-8921"
          }. Additive SHAP analysis reveals a +28% risk attribution to an unverified Zurich proxy IP, coupled with a +30% velocity spike across 3 linked shell entities. Recommended regulatory action: Permanent account freeze and FIU-IND submission under Section 12 of the PMLA.`
        );
        setIsGeneratingAiSummary(false);
      }, 1200);
    } catch (err) {
      setIsGeneratingAiSummary(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadSar = () => {
    const reportText = `
OFFICIAL SUSPICIOUS ACTIVITY REPORT (SAR) - FIU-IND / RBI
Ref Number: ${reportRefNumber}
Filing Date: ${currentDate}
Status: FILED & ENFORCED

SECTION A: REPORTING INSTITUTION
Institution: BankGuard Financial Bank Ltd
IFSC / Routing Code: BGAR0001092
SecOps Node ID: HYD-CYBER-TOWER-01

SECTION B: SUBJECT SUSPECT DETAILS
Subject Name: ${transaction ? transaction.customerName : "Vikramaditya Rao"}
Account Number: ${transaction ? transaction.accountNumber : "4592-0012-8921"}
Transfer Amount: ₹${transaction ? transaction.amount.toLocaleString() : "4,50,000"}
Risk Score: ${transaction ? transaction.riskScore : "94"}/100

SECTION C: NARRATIVE (AI GENERATED)
${aiSummaryText}

SECTION D: DIRECTIVES & AUTHORIZATION
Enforced Countermeasures:
- Immediate freeze placed on source & target accounts.
- Beneficiary accounts flagged across partner banking network.
- Automated dispatch to RBI Financial Intelligence Unit.

Authorized Signatory: Vikramaditya Rao (CISO)
Status: CRYPTOGRAPHICALLY SIGNED
`;
    downloadFile(`${reportRefNumber}.txt`, reportText.trim(), "text/plain;charset=utf-8;");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="max-w-4xl w-full bg-slate-900 border-2 border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Modal Top Action Bar */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center text-xs">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <FileText className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-slate-100 text-sm">Suspicious Activity Report (SAR) Generator</h3>
              <span className="text-[10px] text-slate-400 font-mono">Format: FIU-IND / RBI AML Compliance Specification</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleGenerateGeminiNarrative}
              disabled={isGeneratingAiSummary}
              className="px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              {isGeneratingAiSummary ? "Synthesizing AI Summary..." : "AI Synthesize Narrative"}
            </button>
            <button
              onClick={handleDownloadSar}
              className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download SAR (.txt)
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center gap-1.5 border border-slate-700 transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE OFFICIAL REGULATORY PAPERWORK LAYOUT */}
        <div className="p-8 bg-slate-950 text-slate-100 space-y-6 font-sans text-xs select-text">
          {/* Header Seal */}
          <div className="border-b-2 border-slate-700 pb-6 flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-rose-400 font-extrabold text-lg tracking-wider uppercase font-mono">
                <ShieldAlert className="w-6 h-6" />
                OFFICIAL SUSPICIOUS ACTIVITY REPORT (SAR)
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Financial Intelligence Unit • Banking Security & AML Enforcement Directorate
              </p>
            </div>

            <div className="text-right font-mono space-y-0.5 text-[11px]">
              <div className="font-bold text-sky-400">{reportRefNumber}</div>
              <div className="text-slate-400">Date: {currentDate}</div>
              <div className="text-emerald-400 font-bold">STATUS: FILED & ENFORCED</div>
            </div>
          </div>

          {/* Section A: Reporting Institution Details */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-200 uppercase font-mono text-[11px] border-l-2 border-sky-400 pl-2">
              SECTION A: REPORTING FINANCIAL INSTITUTION
            </h4>
            <div className="grid grid-cols-3 gap-3 p-3 bg-slate-900 rounded-xl border border-slate-800 font-mono text-[11px]">
              <div>
                <span className="text-slate-500 block">Institution Name</span>
                <span className="font-bold text-slate-200">BankGuard Financial Bank Ltd</span>
              </div>
              <div>
                <span className="text-slate-500 block">IFSC / Routing Code</span>
                <span className="font-bold text-slate-200">BGAR0001092</span>
              </div>
              <div>
                <span className="text-slate-500 block">SecOps Node ID</span>
                <span className="font-bold text-sky-400">HYD-CYBER-TOWER-01</span>
              </div>
            </div>
          </div>

          {/* Section B: Subject Account & Customer Info */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-200 uppercase font-mono text-[11px] border-l-2 border-sky-400 pl-2">
              SECTION B: SUBJECT SUSPECT DETAILS
            </h4>
            <div className="grid grid-cols-4 gap-3 p-3 bg-slate-900 rounded-xl border border-slate-800 font-mono text-[11px]">
              <div>
                <span className="text-slate-500 block">Subject Customer</span>
                <span className="font-bold text-slate-100">
                  {transaction ? transaction.customerName : "Vikramaditya Rao"}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Account Number</span>
                <span className="font-bold text-slate-100">
                  {transaction ? transaction.accountNumber : "4592-0012-8921"}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Transfer Amount</span>
                <span className="font-bold text-rose-400">
                  ₹{transaction ? transaction.amount.toLocaleString() : "4,50,000"}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">ML Risk Score</span>
                <span className="font-bold text-rose-400">
                  {transaction ? transaction.riskScore : "94"}/100 (CRITICAL)
                </span>
              </div>
            </div>
          </div>

          {/* Section C: AI Synthesized Compliance Narrative */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-200 uppercase font-mono text-[11px] border-l-2 border-amber-400 pl-2 flex items-center justify-between">
              <span>SECTION C: SUSPICIOUS ACTIVITY NARRATIVE (AI GENERATED)</span>
              <span className="text-amber-400 font-mono text-[10px]">Gemini AI Model Analysis</span>
            </h4>
            <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 text-slate-200 leading-relaxed font-sans text-xs">
              {aiSummaryText}
            </div>
          </div>

          {/* Section D: Directives & Signatures */}
          <div className="space-y-2 pt-2">
            <h4 className="font-bold text-slate-200 uppercase font-mono text-[11px] border-l-2 border-emerald-400 pl-2">
              SECTION D: REGULATORY DIRECTIVES & AUTHORIZATION
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 font-mono font-bold block">Enforced Countermeasures:</span>
                <ul className="list-disc list-inside text-slate-300 space-y-0.5 text-[11px]">
                  <li>Immediate freeze placed on source & target accounts.</li>
                  <li>Beneficiary accounts flagged across partner banking network.</li>
                  <li>Automated dispatch to RBI Financial Intelligence Unit.</li>
                </ul>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between font-mono">
                <div>
                  <span className="text-slate-500 text-[10px] block">Authorized CISO Signature</span>
                  <span className="font-extrabold text-slate-100 text-xs">Vikramaditya Rao</span>
                  <span className="text-sky-400 text-[10px] block">Chief Information Security Officer</span>
                </div>
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-center">
                  <UserCheck className="w-6 h-6 mx-auto mb-1" />
                  <span className="text-[9px] font-bold block">CRYPTOGRAPHICALLY SIGNED</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
