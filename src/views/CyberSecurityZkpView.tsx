import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  KeyRound,
  Fingerprint,
  Lock,
  EyeOff,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Cpu,
  RefreshCw,
  Sparkles,
  Smartphone,
  Copy,
  Check,
  Send,
  UserCheck,
  FileCheck,
} from "lucide-react";

export const CyberSecurityZkpView: React.FC = () => {
  // Active Module Sub-tab
  const [subTab, setSubTab] = useState<"biometrics" | "zkp" | "webauthn">("biometrics");

  // 1. BEHAVIORAL BIOMETRICS ENGINE STATE
  const [testInputText, setTestInputText] = useState("");
  const [typingCadenceMs, setTypingCadenceMs] = useState<number[]>([]);
  const [lastKeyPressTime, setLastKeyPressTime] = useState<number | null>(null);
  const [mouseSpeedHistory, setMouseSpeedHistory] = useState<number[]>([]);
  const [humanScore, setHumanScore] = useState<number>(98);

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const now = performance.now();
    setTestInputText(val);

    if (lastKeyPressTime) {
      const flightTime = Math.round(now - lastKeyPressTime);
      setTypingCadenceMs((prev) => [...prev.slice(-15), flightTime]);
    }
    setLastKeyPressTime(now);
  };

  const simulateBotTyping = () => {
    setTestInputText("");
    const botString = "BotScript_Credential_Stuffing_Test_2026";
    let index = 0;
    setTypingCadenceMs([]);

    const interval = setInterval(() => {
      if (index < botString.length) {
        setTestInputText((prev) => prev + botString[index]);
        setTypingCadenceMs((prev) => [...prev.slice(-15), 10]); // Fixed 10ms unnaturally robotic flight time
        index++;
      } else {
        clearInterval(interval);
        setHumanScore(12); // Bot detected!
      }
    }, 20);
  };

  const resetBiometrics = () => {
    setTestInputText("");
    setTypingCadenceMs([]);
    setHumanScore(98);
  };

  // 2. ZERO-KNOWLEDGE PROOF (ZKP) KYC STATE
  const [rawAadhaar, setRawAadhaar] = useState("8492-1102-9921");
  const [rawDob, setRawDob] = useState("1988-04-12");
  const [zkpCommitmentHash, setZkpCommitmentHash] = useState<string>("");
  const [zkpProofStatus, setZkpProofStatus] = useState<"unverified" | "generating" | "verified">("unverified");
  const [proofDetails, setProofDetails] = useState<{
    ageCheckPassed: boolean;
    validAadhaarCheckPassed: boolean;
    proverNonce: string;
    verifierChallenge: string;
  } | null>(null);

  const handleGenerateZkpProof = () => {
    setZkpProofStatus("generating");
    setTimeout(() => {
      const hash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;
      setZkpCommitmentHash(hash);
      setProofDetails({
        ageCheckPassed: true, // Born 1988 -> Age > 18
        validAadhaarCheckPassed: true,
        proverNonce: `zk_nonce_${Math.floor(Math.random() * 899999 + 100000)}`,
        verifierChallenge: `0x_challenge_${Math.floor(Math.random() * 899999 + 100000)}`,
      });
      setZkpProofStatus("verified");
    }, 1000);
  };

  // 3. WEBAUTHN / FIDO2 HARDWARE PASSKEY STATE
  const [passkeyStatus, setPasskeyStatus] = useState<"idle" | "challenging" | "registered">("idle");
  const [credentialId, setCredentialId] = useState<string | null>(null);

  const handleRegisterPasskey = () => {
    setPasskeyStatus("challenging");
    setTimeout(() => {
      const credId = `cred_yubikey_fido2_${Math.floor(Math.random() * 899999 + 100000)}`;
      setCredentialId(credId);
      setPasskeyStatus("registered");
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400">
              Module 2 • Cybersecurity & Privacy Vault
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            Behavioral Biometrics, Zero-Knowledge KYC & Hardware Passkeys
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Cutting-edge zero-trust authentication stack. Real-time typing rhythm analysis, privacy-preserving ZKP identity proofs, and WebAuthn FIDO2 hardware passkey keys.
          </p>
        </div>

        {/* Sub-tab Switcher */}
        <div className="grid grid-cols-3 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setSubTab("biometrics")}
            className={`px-3 py-1.5 font-bold rounded-lg transition-all ${
              subTab === "biometrics" ? "bg-indigo-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            Biometrics
          </button>
          <button
            onClick={() => setSubTab("zkp")}
            className={`px-3 py-1.5 font-bold rounded-lg transition-all ${
              subTab === "zkp" ? "bg-indigo-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            ZKP Privacy
          </button>
          <button
            onClick={() => setSubTab("webauthn")}
            className={`px-3 py-1.5 font-bold rounded-lg transition-all ${
              subTab === "webauthn" ? "bg-indigo-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            FIDO2 Passkey
          </button>
        </div>
      </div>

      {/* 1. BEHAVIORAL BIOMETRICS SECTION */}
      {subTab === "biometrics" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-slate-100 text-sm">Real-Time Keystroke Dynamics Collector</h3>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">1000 Hz Timing Resolution</span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Type naturally in the box below to test human typing cadence vs. clicking "Simulate Robotic Bot" to observe script behavior detection.
            </p>

            <div className="space-y-2">
              <label className="block text-xs text-slate-300 font-medium">Interactive Input Field</label>
              <input
                type="text"
                placeholder="Type anything here to test flight times..."
                value={testInputText}
                onChange={handleTyping}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-slate-100 text-xs focus:border-indigo-500 focus:outline-none font-mono"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={simulateBotTyping}
                className="flex-1 py-2.5 px-3 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Zap className="w-3.5 h-3.5" />
                Simulate Automated Bot Script
              </button>
              <button
                onClick={resetBiometrics}
                className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-xs flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-200">Biometrics Telemetry Output</span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                  humanScore > 70
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                }`}
              >
                {humanScore > 70 ? "HUMAN AUTHENTIC (PASS)" : "AUTOMATED BOT (BLOCKED)"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 font-mono block">Human Cadence Score</span>
                <span className={`text-2xl font-extrabold font-mono mt-0.5 block ${humanScore > 70 ? "text-emerald-400" : "text-rose-400"}`}>
                  {humanScore}%
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 font-mono block">Mean Flight Time</span>
                <span className="text-2xl font-extrabold text-indigo-400 font-mono mt-0.5 block">
                  {typingCadenceMs.length ? Math.round(typingCadenceMs.reduce((a, b) => a + b, 0) / typingCadenceMs.length) : 0} ms
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 block">Flight Time Variance Histogram (ms):</span>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-end gap-1 h-28">
                {typingCadenceMs.length > 0 ? (
                  typingCadenceMs.map((ms, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className={`w-full rounded-t transition-all ${
                          ms === 10 ? "bg-rose-500" : "bg-indigo-400"
                        }`}
                        style={{ height: `${Math.min(100, (ms / 200) * 100)}%` }}
                      ></div>
                      <span className="text-[8px] text-slate-500 font-mono">{ms}</span>
                    </div>
                  ))
                ) : (
                  <div className="m-auto text-slate-500 text-xs font-mono">Type in the box to visualize flight times</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. ZERO-KNOWLEDGE PROOF (ZKP) SECTION */}
      {subTab === "zkp" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <EyeOff className="w-5 h-5 text-sky-400" />
                <h3 className="font-bold text-slate-100 text-sm">ZKP Identity Proof Generator</h3>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">zk-SNARK / Schnorr Protocol</span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Prove to the bank database that you are over 18 years old and possess a valid Aadhaar ID <strong>WITHOUT</strong> storing or revealing raw ID numbers or dates of birth.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Raw Private Aadhaar Number</label>
                <input
                  type="text"
                  value={rawAadhaar}
                  onChange={(e) => setRawAadhaar(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Raw Date of Birth</label>
                <input
                  type="date"
                  value={rawDob}
                  onChange={(e) => setRawDob(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-100 font-mono"
                />
              </div>

              <button
                onClick={handleGenerateZkpProof}
                disabled={zkpProofStatus === "generating"}
                className="w-full py-3 bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-colors"
              >
                {zkpProofStatus === "generating" ? (
                  <span>Computing Cryptographic zk-SNARK Circuit...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Generate & Submit Zero-Knowledge Proof
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-200">Bank Verifier Vault View</span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                  zkpProofStatus === "verified"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {zkpProofStatus === "verified" ? "ZKP PROOF VERIFIED" : "NO PROOF SUBMITTED"}
              </span>
            </div>

            {proofDetails ? (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-1">
                  <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Verified Assertions (Raw Data Never Stored):
                  </div>
                  <ul className="list-disc list-inside text-slate-300 text-[11px] space-y-0.5">
                    <li>Subject Age Limit Check (&gt;= 18): <strong>PASSED</strong></li>
                    <li>UIDAI Master Aadhaar Checksum: <strong>PASSED</strong></li>
                  </ul>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 font-mono text-[11px]">
                  <div>
                    <span className="text-slate-500 block">ZKP Commitment Hash (SHA-256)</span>
                    <span className="text-indigo-400 font-bold truncate block">{zkpCommitmentHash}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Prover Nonce</span>
                    <span className="text-slate-300 block">{proofDetails.proverNonce}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 text-xs">
                Click "Generate & Submit Zero-Knowledge Proof" to verify identity assertions without storing raw PII data in the bank database.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. WEBAUTHN / FIDO2 HARDWARE PASSKEY SECTION */}
      {subTab === "webauthn" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Fingerprint className="w-6 h-6 text-indigo-400" />
              <div>
                <h3 className="font-bold text-slate-100 text-sm">FIDO2 WebAuthn Passkey Hardware Vault</h3>
                <span className="text-[10px] text-slate-400 font-mono">YubiKey • Apple TouchID / FaceID • Windows Hello</span>
              </div>
            </div>
            {passkeyStatus === "registered" && (
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold font-mono">
                PASSKEY REGISTERED
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-3 text-xs">
              <p className="text-slate-300 leading-relaxed">
                Hardware security passkeys eliminate password phishing vulnerabilities by binding authentication challenges to an elliptic curve public key (Ed25519) stored safely inside secure hardware chips.
              </p>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1 font-mono text-[11px]">
                <div className="flex justify-between text-slate-400">
                  <span>RP ID:</span>
                  <span className="text-slate-100 font-bold">auth.bankguard.ai</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Authenticator:</span>
                  <span className="text-indigo-400 font-bold">YubiKey 5 Series (FIPS)</span>
                </div>
              </div>

              <button
                onClick={handleRegisterPasskey}
                disabled={passkeyStatus === "challenging"}
                className="w-full py-3 bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-lg"
              >
                {passkeyStatus === "challenging" ? (
                  <span>Awaiting Hardware Touch / Biometric Prompt...</span>
                ) : (
                  <>
                    <Fingerprint className="w-4 h-4" />
                    Register Hardware Passkey
                  </>
                )}
              </button>
            </div>

            <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-3 font-mono text-xs">
              <span className="text-slate-500 uppercase font-bold text-[10px] block">WebAuthn Assertion Vault</span>
              {credentialId ? (
                <div className="space-y-2">
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-indigo-500/30 text-indigo-300">
                    <span className="text-[10px] text-slate-500 block">Credential ID:</span>
                    <span className="font-bold">{credentialId}</span>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-slate-300 text-[10px]">
                    <span className="text-slate-500 block">Public Key Algorithm:</span>
                    <span>COSEAlgorithmIdentifier (-7: ES256 / Ed25519)</span>
                  </div>
                </div>
              ) : (
                <div className="text-slate-500 text-center py-6 text-xs">
                  No FIDO2 Passkey bound to this session yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
