import React, { useState } from "react";
import {
  ShieldCheck,
  Lock,
  Key,
  Database,
  Cpu,
  Server,
  Smartphone,
  CheckCircle2,
  X,
  Zap,
  Terminal,
  ArrowRight,
  ShieldAlert,
  Fingerprint,
} from "lucide-react";

interface SecuritySpecModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecuritySpecModal: React.FC<SecuritySpecModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"architecture" | "standards" | "encryptor">("architecture");
  const [samplePlaintext, setSamplePlaintext] = useState<string>(
    JSON.stringify({ account: "ACC-9041-3810", amount: 45000, recipient: "Priya Sharma", currency: "INR" }, null, 2)
  );
  const [isEncrypted, setIsEncrypted] = useState<boolean>(false);

  if (!isOpen) return null;

  const cryptoStandards = [
    {
      purpose: "Secure Communication",
      algorithm: "TLS 1.3 (ECDHE P-256)",
      usedFor: "Encrypts transit data between browser and bank servers with perfect forward secrecy.",
      status: "ACTIVE",
    },
    {
      purpose: "Symmetric Encryption",
      algorithm: "AES-256-GCM",
      usedFor: "Encrypts sensitive customer payloads, ledger balances, and database fields.",
      status: "ACTIVE",
    },
    {
      purpose: "Key Exchange",
      algorithm: "ECDHE (Elliptic Curve DH)",
      usedFor: "Securely establishes ephemeral symmetric encryption keys for each session.",
      status: "ACTIVE",
    },
    {
      purpose: "Public-Key Cryptography",
      algorithm: "ECC P-256 / RSA-3072",
      usedFor: "X.509 SSL Certificates, client/server authentication, and identity handshake.",
      status: "ACTIVE",
    },
    {
      purpose: "Digital Signatures",
      algorithm: "ECDSA with SHA-256",
      usedFor: "Verifies authenticity, non-repudiation, and payload integrity across nodes.",
      status: "ACTIVE",
    },
    {
      purpose: "Password Hashing",
      algorithm: "Argon2id / bcrypt (12 rounds)",
      usedFor: "Securely hashes user master passwords with unique salt prior to storage.",
      status: "ACTIVE",
    },
    {
      purpose: "Message Authentication",
      algorithm: "HMAC-SHA-256",
      usedFor: "Signed JWT session verification and anti-tamper message headers.",
      status: "ACTIVE",
    },
    {
      purpose: "Cryptographic Hashing",
      algorithm: "SHA-256 / SHA-3",
      usedFor: "Data fingerprinting, immutable audit log verification, and hash chains.",
      status: "ACTIVE",
    },
    {
      purpose: "OTP / 2FA Generation",
      algorithm: "TOTP (RFC 6238)",
      usedFor: "Time-based Two-Factor Authentication with 30s rotation windows.",
      status: "ACTIVE",
    },
    {
      purpose: "Tokenization Engine",
      algorithm: "Cryptographic Pseudo-Tokens",
      usedFor: "Replaces credit card & Aadhaar/PAN numbers with non-sensitive surrogate tokens.",
      status: "ACTIVE",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                BankGuard Cryptographic Security Architecture
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  FIPS 140-2 Compliant
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                End-to-end zero-trust encryption flow and military-grade algorithms.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Sub-Header Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-5 gap-2 pt-2">
          {[
            { id: "architecture", label: "Security Pipeline Flow", icon: ArrowRight },
            { id: "standards", label: "Cryptographic Standards Matrix", icon: Lock },
            { id: "encryptor", label: "Live Payload Encryptor Sandbox", icon: Terminal },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all border-b-2 ${
                  active
                    ? "border-sky-400 text-sky-400 bg-slate-900"
                    : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Modal Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-900/60">
          {activeTab === "architecture" && (
            <div className="space-y-6">
              {/* Architecture Pipeline Banner */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 space-y-4">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-sky-400 font-bold">FLOW SPECIFICATION:</span>
                  <span className="text-emerald-400 font-bold">100% ENCRYPTED PIPELINE</span>
                </div>

                {/* Flow Diagram */}
                <div className="grid grid-cols-1 md:grid-cols-7 gap-2 items-center text-center text-xs">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <Smartphone className="w-5 h-5 text-sky-400 mx-auto" />
                    <div className="font-bold text-slate-100">Customer</div>
                    <div className="text-[10px] text-slate-500">Browser / App</div>
                  </div>

                  <div className="hidden md:flex flex-col items-center text-[10px] text-sky-400 font-mono">
                    <Zap className="w-4 h-4 text-sky-400 animate-pulse" />
                    <span>HTTPS</span>
                    <span className="text-slate-500">TLS 1.3</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <Lock className="w-5 h-5 text-indigo-400 mx-auto" />
                    <div className="font-bold text-slate-100">AES-256 Session</div>
                    <div className="text-[10px] text-slate-500">GCM Cipher</div>
                  </div>

                  <div className="hidden md:flex flex-col items-center text-[10px] text-sky-400 font-mono">
                    <ArrowRight className="w-4 h-4 text-sky-400" />
                    <span>Payload</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <Server className="w-5 h-5 text-emerald-400 mx-auto" />
                    <div className="font-bold text-slate-100">Bank Server</div>
                    <div className="text-[10px] text-slate-500">JWT & Auth</div>
                  </div>

                  <div className="hidden md:flex flex-col items-center text-[10px] text-sky-400 font-mono">
                    <Cpu className="w-4 h-4 text-sky-400" />
                    <span>AI Model</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <Database className="w-5 h-5 text-purple-400 mx-auto" />
                    <div className="font-bold text-slate-100">Encrypted DB</div>
                    <div className="text-[10px] text-slate-500">PostgreSQL / Vault</div>
                  </div>
                </div>
              </div>

              {/* Detailed Explanation of Flow Steps */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-xs text-sky-400">
                    <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center font-mono">1</span>
                    TLS 1.3 & ECDHE Handshake
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Browser establishes connection using TLS 1.3 with ECDHE P-256 ephemeral key exchange. Zero plain-text bytes pass over the network.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-xs text-indigo-400">
                    <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-mono">2</span>
                    AES-256 Symmetric Payload Cipher
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Customer request body is encrypted on the client side using AES-256-GCM with a 96-bit initialization vector (IV) and HMAC authentication tag.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-xs text-emerald-400">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono">3</span>
                    JWT & Session Validation
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Bank Server verifies the HTTP Bearer token via HMAC-SHA256 signature, ensuring session origin, expiration, and RBAC authorization role.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-xs text-purple-400">
                    <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-mono">4</span>
                    Fraud Detection AI & Encrypted Storage
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    The machine learning random forest model scores risk in &lt;10ms. Approved transactions are written into PostgreSQL using field-level AES-256 encryption.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "standards" && (
            <div className="space-y-4">
              <div className="text-xs text-slate-400">
                The following table outlines the complete cryptographic specifications implemented across the BankGuard platform:
              </div>

              <div className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-800 font-mono">
                    <tr>
                      <th className="p-3">Purpose</th>
                      <th className="p-3">Algorithm / Protocol</th>
                      <th className="p-3">Used For</th>
                      <th className="p-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {cryptoStandards.map((std, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/50">
                        <td className="p-3 font-semibold text-slate-200">{std.purpose}</td>
                        <td className="p-3 text-sky-400 font-bold">{std.algorithm}</td>
                        <td className="p-3 text-slate-400 font-sans text-xs">{std.usedFor}</td>
                        <td className="p-3 text-right">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                            {std.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "encryptor" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-200 flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-sky-400" />
                    AES-256 Payload Cipher Simulator
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">Key: 256-bit Ephemeral Key</span>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-slate-400 block">Plaintext JSON Payload:</label>
                  <textarea
                    rows={4}
                    value={samplePlaintext}
                    onChange={(e) => {
                      setSamplePlaintext(e.target.value);
                      setIsEncrypted(false);
                    }}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs font-mono text-sky-300 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    onClick={() => setIsEncrypted(!isEncrypted)}
                    className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-colors"
                  >
                    <Lock className="w-4 h-4" />
                    {isEncrypted ? "Decrypt to Plaintext" : "Encrypt Payload with AES-256-GCM"}
                  </button>
                  <span className="text-[11px] text-slate-500">
                    HMAC Signature: <code className="text-slate-400 font-mono">e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</code>
                  </span>
                </div>

                {isEncrypted && (
                  <div className="mt-4 p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2 animate-in fade-in">
                    <div className="text-[10px] text-slate-400 font-mono flex justify-between">
                      <span>AES-256 CIPHERTEXT (Base64 Output):</span>
                      <span className="text-emerald-400">IV: 96-bit Random Nonce</span>
                    </div>
                    <div className="p-3 bg-slate-950 rounded border border-slate-800 font-mono text-xs text-emerald-400 break-all leading-relaxed select-all">
                      U2FsdGVkX1+x894hJ3kL9mZa2K8p9X1vQsN3y6Wz4aM7vR5tP2q0L8kJ9mZ4aX3vQrN7y6Wz8aM1vR5tP2q0L8kJ9mZ4aX3vQrN7y6Wz8aM1vR5tP2q0L8kJ9mZ4aX3vQrN7y6Wz8aM1vR5tP2q0L8kJ9mZ4aX3v===
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>All sessions validated with HMAC-SHA256 & TOTP 2FA.</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const reportHtml = `<!DOCTYPE html>
<html>
<head>
  <title>BankGuard AI - Complete Tech Stack & Architecture Report</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #0f172a; line-height: 1.6; }
    h1 { color: #0284c7; border-bottom: 2px solid #0284c7; padding-bottom: 8px; }
    h2 { color: #0f172a; margin-top: 24px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; font-size: 14px; }
    th { background: #f1f5f9; font-weight: bold; }
    code { background: #f1f5f9; padding: 2px 6px; rounded: 4px; font-family: monospace; }
    .badge { background: #e0f2fe; color: #0369a1; padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 12px; }
  </style>
</head>
<body>
  <h1>BankGuard AI - Complete Tech Stack & Architecture Specification</h1>
  <p><strong>Generated On:</strong> ${new Date().toLocaleDateString()} | <strong>Platform:</strong> Google AI Studio & Cloud Run Sandbox</p>

  <h2>1. Full Tech Stack Summary</h2>
  <table>
    <tr><th>Layer</th><th>Technology & Library</th><th>Version</th><th>Purpose</th></tr>
    <tr><td>Frontend Core</td><td>React</td><td>19.0.1</td><td>UI component state engine</td></tr>
    <tr><td>Build Tool</td><td>Vite</td><td>6.2.3</td><td>Development HMR & bundle optimizer</td></tr>
    <tr><td>Language</td><td>TypeScript</td><td>5.8.2</td><td>Strict static typing and interface definitions</td></tr>
    <tr><td>Styling</td><td>Tailwind CSS</td><td>4.1.14</td><td>Utility-first responsive styling</td></tr>
    <tr><td>Data Vis</td><td>D3.js</td><td>7.9.0</td><td>Interactive Node-Link Force Directed Mule Network Visualizer</td></tr>
    <tr><td>Charts</td><td>Recharts</td><td>3.10.1</td><td>Velocity histograms & risk trend graphs</td></tr>
    <tr><td>Backend Engine</td><td>Express.js</td><td>4.21.2</td><td>REST API proxy & SSR server routes</td></tr>
    <tr><td>Server Runtime</td><td>Node.js & tsx</td><td>22.x / 4.21.0</td><td>Server execution & ESM module handling</td></tr>
    <tr><td>Server Bundler</td><td>esbuild</td><td>0.25.0</td><td>Compiles server.ts into dist/server.cjs</td></tr>
    <tr><td>AI Model</td><td>@google/genai SDK</td><td>2.4.0</td><td>Gemini 2.5 Flash / 1.5 Pro integration for threat analysis</td></tr>
  </table>

  <h2>2. Pre-configured Login Credentials</h2>
  <table>
    <tr><th>Name</th><th>Role</th><th>Email</th><th>Password</th><th>Title / Account Type</th></tr>
    <tr><td>Vikramaditya Rao</td><td>Admin</td><td>vikramaditya.rao@bankguard.ai</td><td>AdminSecret@2026!</td><td>Chief Information Security Officer (CISO)</td></tr>
    <tr><td>Dr. Rajesh Mehta</td><td>Manager</td><td>rajesh.mehta@bankguard.ai</td><td>SecOps@2026Pass</td><td>Head of SecOps Threat Intelligence</td></tr>
    <tr><td>Ayesha Patel</td><td>Auditor</td><td>ayesha.patel@bankguard.ai</td><td>AuditPass#2026</td><td>AML Fraud & Compliance Auditor</td></tr>
    <tr><td>Devendra Kulkarni</td><td>Employee</td><td>devendra.kulkarni@bankguard.ai</td><td>Support2026!</td><td>Customer Support Specialist</td></tr>
    <tr><td>Harsh Ganeshwade</td><td>Customer</td><td>harshganeshwade@gmail.com</td><td>HarshPass2026!</td><td>Principal Systems Engineer (HNWI Account)</td></tr>
  </table>

  <h2>3. Standalone Export & Execution Guide</h2>
  <p>To run outside AI Studio / Sandbox in Antigravity or local machine:</p>
  <pre><code>npm install\nnpm run dev</code></pre>
</body>
</html>`;
                const blob = new Blob([reportHtml], { type: "text/html" });
                const url = URL.createObjectURL(blob);
                const win = window.open(url, "_blank");
                if (win) win.print();
              }}
              className="px-3 py-2 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400 hover:bg-sky-500/20 font-semibold transition-colors flex items-center gap-1.5"
            >
              <Terminal className="w-3.5 h-3.5" />
              Print / Save Tech Stack PDF
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
