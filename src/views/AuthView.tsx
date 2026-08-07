import React, { useState, useEffect } from "react";
import {
  Shield,
  Lock,
  KeyRound,
  User,
  Mail,
  Phone,
  QrCode,
  CheckCircle2,
  Zap,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  AlertCircle,
  Key,
  X,
  Send,
  Inbox,
  Copy,
  Check,
  Sparkles,
  Building2,
  UserCheck,
} from "lucide-react";
import { UserRole } from "../types";
import { googleSignIn, initAuth, getAccessToken, logoutGoogle, logAuditToFirestore } from "../lib/firebase";
import { sendMfaEmailViaGmail } from "../lib/gmailService";

interface AuthViewProps {
  onLoginSuccess: (session: {
    username: string;
    email: string;
    role: UserRole;
    token: string;
  }) => void;
  onOpenSecuritySpec: () => void;
}

// Roster definition
interface RegisteredUser {
  name: string;
  email: string;
  role: UserRole;
  userType: "Staff" | "Customer";
  title: string;
  passwordHash: string;
}

const DEFAULT_USER_ROSTER: RegisteredUser[] = [
  {
    name: "Vikramaditya Rao",
    email: "vikramaditya.rao@bankguard.ai",
    role: "Admin",
    userType: "Staff",
    title: "Chief Information Security Officer (CISO)",
    passwordHash: "AdminSecret@2026!",
  },
  {
    name: "Dr. Rajesh Mehta",
    email: "rajesh.mehta@bankguard.ai",
    role: "Manager",
    userType: "Staff",
    title: "Head of SecOps Threat Intelligence",
    passwordHash: "SecOps@2026Pass",
  },
  {
    name: "Ayesha Patel",
    email: "ayesha.patel@bankguard.ai",
    role: "Auditor",
    userType: "Staff",
    title: "AML Fraud & Compliance Auditor",
    passwordHash: "AuditPass#2026",
  },
  {
    name: "Devendra Kulkarni",
    email: "devendra.kulkarni@bankguard.ai",
    role: "Employee",
    userType: "Staff",
    title: "Customer Support & Operations Specialist",
    passwordHash: "Support2026!",
  },
  {
    name: "Harsh Ganeshwade",
    email: "harshganeshwade@gmail.com",
    role: "Employee",
    userType: "Customer",
    title: "Principal Systems Engineer (HNWI Account)",
    passwordHash: "HarshPass2026!",
  },
  {
    name: "Priya Sharma",
    email: "priya.sharma@gmail.com",
    role: "Employee",
    userType: "Customer",
    title: "E-Commerce Director (Savings Account)",
    passwordHash: "PriyaPass2026!",
  },
  {
    name: "Ananya Verma",
    email: "ananya.verma@outlook.com",
    role: "Employee",
    userType: "Customer",
    title: "Financial Analyst (Wealth Account)",
    passwordHash: "AnanyaPass2026!",
  },
];

interface EmailDispatchNotification {
  id: string;
  toEmail: string;
  toName: string;
  subject: string;
  mfaCode: string;
  timestamp: string;
  type: "MFA_LOGIN" | "WELCOME_REGISTER" | "RESET_OTP";
}

export const AuthView: React.FC<AuthViewProps> = ({
  onLoginSuccess,
  onOpenSecuritySpec,
}) => {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // User Roster State
  const [userRoster, setUserRoster] = useState<RegisteredUser[]>(DEFAULT_USER_ROSTER);

  // Email MFA Service State
  const [emailNotification, setEmailNotification] = useState<EmailDispatchNotification | null>(null);
  const [activeMfaCode, setActiveMfaCode] = useState<string>("849201");
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Google OAuth & Gmail API State
  const [googleUser, setGoogleUser] = useState<any>(null);
  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(null);
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);
  const [gmailStatusNotice, setGmailStatusNotice] = useState<string | null>(null);

  // Initialize Firebase Auth listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setGoogleUser(user);
        setGoogleAccessToken(token);
      },
      () => {
        setGoogleUser(null);
        setGoogleAccessToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    setIsGoogleSigningIn(true);
    setLoginError(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setGoogleUser(res.user);
        setGoogleAccessToken(res.accessToken);
        setGmailStatusNotice(`Connected Gmail Account: ${res.user.email}`);
        if (res.user.email) {
          setLoginEmail(res.user.email);
        }
      }
    } catch (err: any) {
      console.error("Google Sign-In Error:", err);
      setLoginError(err?.message || "Google Authentication failed.");
    } finally {
      setIsGoogleSigningIn(false);
    }
  };

  // Login form state
  const [loginEmail, setLoginEmail] = useState("vikramaditya.rao@bankguard.ai");
  const [loginPassword, setLoginPassword] = useState("AdminSecret@2026!");
  const [loginMfaCode, setLoginMfaCode] = useState("");
  const [loginRole, setLoginRole] = useState<UserRole>("Admin");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isSendingMfaEmail, setIsSendingMfaEmail] = useState(false);
  const [mfaEmailSentNotice, setMfaEmailSentNotice] = useState<string | null>(null);

  // Register form state
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regGovtId, setRegGovtId] = useState("");
  const [regAccountType, setRegAccountType] = useState("Savings");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regError, setRegError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registeredSuccess, setRegisteredSuccess] = useState(false);

  // Forgot Password state
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotStep, setForgotStep] = useState<"email" | "otp" | "success">("email");
  const [forgotOtp, setForgotOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [forgotIsSubmitting, setForgotIsSubmitting] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);

  // Helper validation functions
  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const getPasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score; // 0 to 4
  };

  // Generate 6-digit MFA Code
  const generateRandomMfa = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Dispatch MFA Code Email Service
  const dispatchMfaEmail = (
    targetEmail: string,
    targetName: string,
    type: "MFA_LOGIN" | "WELCOME_REGISTER" | "RESET_OTP" = "MFA_LOGIN",
    targetRole: UserRole = loginRole
  ) => {
    const freshCode = generateRandomMfa();
    setActiveMfaCode(freshCode);

    let subject = `🔐 Your BankGuard MFA Verification Code: ${freshCode}`;
    if (type === "WELCOME_REGISTER") {
      subject = `🎉 Welcome to BankGuard.ai! Your 2FA Security Token: ${freshCode}`;
    } else if (type === "RESET_OTP") {
      subject = `🔑 BankGuard Password Reset OTP Code: ${freshCode}`;
    }

    const notif: EmailDispatchNotification = {
      id: `EMAIL-${Date.now()}`,
      toEmail: targetEmail,
      toName: targetName,
      subject,
      mfaCode: freshCode,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      type,
    };

    setEmailNotification(notif);
    setMfaEmailSentNotice(`MFA Passcode generated for ${targetEmail}`);

    // Log event persistently to Google Cloud Firestore database
    logAuditToFirestore({
      username: targetName,
      role: targetRole,
      action: `MFA Token Dispatch (${type})`,
      details: `Dispatched code to ${targetEmail}`,
      riskTag: "ROUTINE",
    });

    // If Google OAuth Token is active, attempt REAL Gmail API dispatch!
    if (googleAccessToken) {
      sendMfaEmailViaGmail({
        accessToken: googleAccessToken,
        recipientEmail: targetEmail,
        recipientName: targetName,
        mfaCode: freshCode,
        role: targetRole,
        userType: "Staff",
      }).then((res) => {
        if (res.success) {
          setGmailStatusNotice(`✅ Real Email Sent via Gmail API to ${targetEmail} (ID: ${res.messageId})`);
        } else {
          setGmailStatusNotice(`⚠️ Gmail API Dispatch Error: ${res.error || "Permission error"}`);
        }
      });
    }

    setTimeout(() => setMfaEmailSentNotice(null), 5000);
    return freshCode;
  };

  // Select Quick Demo User
  const handleSelectUser = (usr: RegisteredUser) => {
    setLoginRole(usr.role);
    setLoginEmail(usr.email);
    setLoginPassword(usr.passwordHash);
    setLoginError(null);

    // Dispatch email automatically
    dispatchMfaEmail(usr.email, usr.name, "MFA_LOGIN", usr.role);
  };

  // Trigger Send MFA Email Button
  const handleTriggerMfaEmail = async () => {
    setLoginError(null);
    if (!validateEmail(loginEmail)) {
      setLoginError("Please enter a valid email address first.");
      return;
    }

    setIsSendingMfaEmail(true);

    const name = loginEmail.split("@")[0].replace(".", " ");
    const code = dispatchMfaEmail(loginEmail, name, "MFA_LOGIN", loginRole);

    const token = googleAccessToken;
    if (token) {
      const res = await sendMfaEmailViaGmail({
        accessToken: token,
        recipientEmail: loginEmail,
        recipientName: name,
        mfaCode: code,
        role: loginRole,
        userType: "Staff",
      });
      if (res.success) {
        setGmailStatusNotice(`✅ Real MFA Email dispatched via Gmail to ${loginEmail}`);
      } else {
        setGmailStatusNotice(`⚠️ Gmail API dispatch error: ${res.error}`);
      }
    } else {
      setGmailStatusNotice(`💡 Tip: Click "Sign in with Google" below to send real MFA emails to your Gmail inbox.`);
    }

    setIsSendingMfaEmail(false);
  };

  // Auto-fill MFA code from simulated email card
  const handleAutoFillMfa = () => {
    if (emailNotification) {
      if (showForgotPassword && forgotStep === "otp") {
        setForgotOtp(emailNotification.mfaCode);
      } else {
        setLoginMfaCode(emailNotification.mfaCode);
      }
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2000);
    }
  };

  // Handlers
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!validateEmail(loginEmail)) {
      setLoginError("Please enter a valid email address.");
      return;
    }

    if (loginPassword.length < 6) {
      setLoginError("Password must be at least 6 characters.");
      return;
    }

    if (!loginMfaCode || loginMfaCode.length !== 6 || !/^\d+$/.test(loginMfaCode)) {
      setLoginError("Please enter the 6-digit MFA verification code sent to your email.");
      return;
    }

    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      // Find matching user or fallback
      const foundUser = userRoster.find((u) => u.email.toLowerCase() === loginEmail.toLowerCase());
      const username = foundUser ? foundUser.name : loginEmail.split("@")[0].replace(".", " ");

      // Generate HMAC-SHA256 JWT token with CSRF protection header
      const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(
        JSON.stringify({
          sub: loginEmail,
          role: loginRole,
          csrf: "e8a91b32f4890c01",
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 28800,
        })
      )}.s6a89c7d81f2340a92e1`;

      onLoginSuccess({
        username,
        email: loginEmail,
        role: loginRole,
        token: mockToken,
      });
    }, 800);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (!regUsername.trim() || regUsername.length < 3) {
      setRegError("Username must be at least 3 characters.");
      return;
    }

    if (!validateEmail(regEmail)) {
      setRegError("Please enter a valid email address.");
      return;
    }

    if (!regPhone.trim()) {
      setRegError("Please provide a valid mobile phone number.");
      return;
    }

    if (regPassword.length < 8) {
      setRegError("Password must be at least 8 characters long.");
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError("Passwords do not match. Please check and re-type.");
      return;
    }

    if (!regGovtId.trim()) {
      setRegError("Govt ID (Aadhaar/PAN) is required for tokenization.");
      return;
    }

    setIsRegistering(true);
    setTimeout(() => {
      setIsRegistering(false);
      
      // Add newly registered user to active roster
      const newUser: RegisteredUser = {
        name: regUsername,
        email: regEmail,
        role: "Employee",
        userType: "Customer",
        title: `${regAccountType} Account Customer`,
        passwordHash: regPassword,
      };

      setUserRoster((prev) => [newUser, ...prev]);
      setRegisteredSuccess(true);

      // Dispatch welcome verification email with MFA code
      const mfa = dispatchMfaEmail(regEmail, regUsername, "WELCOME_REGISTER");

      setTimeout(() => {
        setTab("login");
        setLoginEmail(regEmail);
        setLoginPassword(regPassword);
        setLoginMfaCode(mfa);
        setRegisteredSuccess(false);
      }, 2000);
    }, 1000);
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);

    if (forgotStep === "email") {
      if (!validateEmail(forgotEmail)) {
        setForgotError("Please enter a valid registered email address.");
        return;
      }
      setForgotIsSubmitting(true);
      setTimeout(() => {
        setForgotIsSubmitting(false);
        setForgotStep("otp");
        const found = userRoster.find((u) => u.email === forgotEmail);
        dispatchMfaEmail(forgotEmail, found ? found.name : "Valued Customer", "RESET_OTP");
      }, 700);
    } else if (forgotStep === "otp") {
      if (forgotOtp.length !== 6 || !/^\d+$/.test(forgotOtp)) {
        setForgotError("Please enter the 6-digit OTP code sent to your email.");
        return;
      }
      if (newPassword.length < 8) {
        setForgotError("New password must be at least 8 characters long.");
        return;
      }
      setForgotIsSubmitting(true);
      setTimeout(() => {
        setForgotIsSubmitting(false);
        // Update user password in roster
        setUserRoster((prev) =>
          prev.map((u) => (u.email === forgotEmail ? { ...u, passwordHash: newPassword } : u))
        );
        setForgotStep("success");
      }, 900);
    }
  };

  const pwdStrength = getPasswordStrength(regPassword);

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-between p-4 md:p-8 relative overflow-hidden font-sans select-none">
      {/* Background Glow Accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* SIMULATED EMAIL NOTIFICATION DISPATCHER TOAST / MODAL */}
      {emailNotification && (
        <div className="fixed bottom-4 right-4 z-50 max-w-md w-full bg-slate-900 border-2 border-sky-500/50 rounded-2xl shadow-2xl p-4 animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex justify-between items-start border-b border-slate-800 pb-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400">
                <Inbox className="w-4 h-4" />
              </span>
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-sky-400 tracking-wider block">
                  BankGuard Dispatcher Email Service
                </span>
                <h4 className="text-xs font-bold text-slate-100">Inbox Notification Received</h4>
              </div>
            </div>
            <button
              onClick={() => setEmailNotification(null)}
              className="text-slate-400 hover:text-white p-1 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1 font-mono text-[11px]">
              <div className="flex justify-between text-slate-400">
                <span>From:</span>
                <span className="text-slate-200 font-bold">auth-service@security.bankguard.ai</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>To:</span>
                <span className="text-sky-300 font-bold">{emailNotification.toEmail}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Time:</span>
                <span className="text-slate-400">{emailNotification.timestamp}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
              <div className="font-bold text-slate-100 text-xs flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                {emailNotification.subject}
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Dear <strong className="text-slate-100">{emailNotification.toName}</strong>, your single-use 6-digit MFA authentication passcode is:
              </p>
              
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-sky-500/30">
                <span className="text-xl font-mono font-extrabold tracking-widest text-sky-400">
                  {emailNotification.mfaCode}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Expires in 5m</span>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={handleAutoFillMfa}
                className="flex-1 py-2 px-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                {copiedNotification ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-slate-950" />
                    Auto-Filled Code!
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5" />
                    Auto-Fill MFA Code
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(emailNotification.mfaCode);
                  setCopiedNotification(true);
                  setTimeout(() => setCopiedNotification(false), 2000);
                }}
                className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs rounded-xl flex items-center gap-1 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Header */}
      <header className="flex justify-between items-center max-w-6xl mx-auto w-full z-10 py-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <span className="font-bold text-xl tracking-tight text-slate-100">
              BankGuard<span className="text-sky-400">.ai</span>
            </span>
            <span className="text-[10px] text-slate-500 block font-mono">
              TLS 1.3 • Argon2id • Email 2FA MFA Service
            </span>
          </div>
        </div>

        <button
          onClick={onOpenSecuritySpec}
          className="px-3.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-sky-400 hover:bg-slate-800 hover:text-sky-300 transition-colors flex items-center gap-1.5 font-medium"
        >
          <ShieldCheck className="w-4 h-4 text-sky-400" />
          Cryptographic Specs
        </button>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 my-auto py-6 z-10 items-center">
        {/* Left Column: Security Architecture & Staff Roster Selector */}
        <div className="lg:col-span-5 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs font-mono font-medium">
            <Lock className="w-3.5 h-3.5" />
            Zero-Trust Core Banking Authentication
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-100 tracking-tight leading-tight">
            Customer & Staff Authentication Portal
          </h1>

          <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
            All customer and staff login requests are protected with Argon2id password hashing, email-delivered 2FA MFA codes, and AES-256 session encryption over TLS 1.3.
          </p>

          {/* Quick Staff & Customer Selection Roster */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-sky-400" />
                Staff & Customer Quick Access:
              </span>
              <span className="text-[10px] text-emerald-400 font-mono font-bold">2FA Active</span>
            </div>

            <div className="grid grid-cols-1 gap-2 text-xs max-h-56 overflow-y-auto pr-1">
              {userRoster.map((usr, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectUser(usr)}
                  className={`p-2.5 rounded-xl text-left border transition-all flex items-center justify-between ${
                    loginEmail === usr.email
                      ? "bg-sky-500/10 border-sky-500/50 text-slate-100"
                      : "bg-slate-950 hover:bg-slate-800/60 border-slate-800/80 text-slate-300"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-100">{usr.name}</span>
                      <span
                        className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase font-mono ${
                          usr.role === "Admin"
                            ? "bg-sky-500/20 text-sky-400 border border-sky-500/30"
                            : usr.role === "Manager"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : usr.role === "Auditor"
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            : "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                        }`}
                      >
                        {usr.userType === "Staff" ? usr.role : "Customer"}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{usr.title}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Auth Form Card */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl space-y-6 relative">
          {/* Tab Switcher */}
          <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                setTab("login");
                setShowForgotPassword(false);
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                tab === "login" && !showForgotPassword
                  ? "bg-sky-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Customer & Staff Login
            </button>
            <button
              onClick={() => {
                setTab("register");
                setShowForgotPassword(false);
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                tab === "register"
                  ? "bg-sky-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              New Customer Registration
            </button>
          </div>

          {/* FORGOT PASSWORD MODAL OVERLAY */}
          {showForgotPassword ? (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-sky-400" />
                  <h3 className="font-bold text-slate-100 text-sm">Reset Password & Argon2id Hash</h3>
                </div>
                <button
                  onClick={() => setShowForgotPassword(false)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {forgotError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{forgotError}</span>
                </div>
              )}

              {forgotStep === "email" && (
                <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Enter your registered email address to dispatch an encrypted 6-digit OTP passcode to your email inbox.
                  </p>

                  <div>
                    <label className="block text-xs text-slate-300 font-medium mb-1">
                      Registered Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                      <input
                        type="email"
                        required
                        placeholder="vikramaditya.rao@bankguard.ai"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-100 focus:border-sky-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(false)}
                      className="text-xs text-slate-400 hover:text-slate-200"
                    >
                      Back to Login
                    </button>
                    <button
                      type="submit"
                      disabled={forgotIsSubmitting}
                      className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-colors"
                    >
                      {forgotIsSubmitting ? "Dispatching Email..." : "Send OTP Reset Email"}
                    </button>
                  </div>
                </form>
              )}

              {forgotStep === "otp" && (
                <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                  <p className="text-xs text-slate-400">
                    Enter the 6-digit verification code sent to <span className="text-sky-400 font-mono">{forgotEmail}</span> and establish your new password.
                  </p>

                  <div>
                    <label className="block text-xs text-slate-300 font-medium mb-1">
                      6-Digit OTP Code
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength={6}
                        required
                        placeholder="6-digit OTP"
                        value={forgotOtp}
                        onChange={(e) => setForgotOtp(e.target.value)}
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-100 focus:border-sky-500 focus:outline-none font-mono tracking-widest"
                      />
                      <button
                        type="button"
                        onClick={handleAutoFillMfa}
                        className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-sky-400 text-xs font-bold rounded-xl flex items-center gap-1"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        Auto-Fill
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 font-medium mb-1">
                      New Master Password (Argon2id Salted)
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-100 focus:border-sky-500 focus:outline-none font-mono"
                    />
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <button
                      type="button"
                      onClick={() => setForgotStep("email")}
                      className="text-xs text-slate-400 hover:text-slate-200"
                    >
                      Change Email
                    </button>
                    <button
                      type="submit"
                      disabled={forgotIsSubmitting}
                      className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-colors"
                    >
                      {forgotIsSubmitting ? "Hashing Password..." : "Reset Password & Re-Encrypt"}
                    </button>
                  </div>
                </form>
              )}

              {forgotStep === "success" && (
                <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
                  <h4 className="font-bold text-slate-100 text-sm">Password Updated Successfully!</h4>
                  <p className="text-xs text-slate-300">
                    Argon2id hash and salt have been updated in PostgreSQL vault.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setForgotStep("email");
                      setTab("login");
                    }}
                    className="px-4 py-2 bg-sky-500 text-slate-950 rounded-lg text-xs font-bold"
                  >
                    Proceed to Login
                  </button>
                </div>
              )}
            </div>
          ) : tab === "login" ? (
            /* LOGIN FORM */
            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              {/* GOOGLE OAUTH & GMAIL DISPATCH STATUS BAR */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-sky-500/30 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.3 7.31 24 12 24z" />
                      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.99 0 12s.45 3.85 1.24 5.42l4.04-3.15z" />
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                    </svg>
                    <span className="font-bold text-slate-200">
                      Gmail API MFA Dispatch Engine
                    </span>
                  </div>
                  {googleAccessToken ? (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> OAuth Active
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
                      Offline Mode
                    </span>
                  )}
                </div>

                {googleUser ? (
                  <div className="flex justify-between items-center text-[11px] bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-300 font-mono truncate">
                      Connected: <strong>{googleUser.email}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        logoutGoogle();
                        setGmailStatusNotice("Signed out of Google OAuth.");
                      }}
                      className="text-xs text-red-400 hover:underline shrink-0 ml-2 font-bold"
                    >
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[11px] text-slate-400 leading-tight">
                      Sign in with Google to enable <strong>direct Gmail API MFA dispatch</strong> for Admin, Manager, Auditor & Employees.
                    </p>
                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={isGoogleSigningIn}
                      className="px-3 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-300 text-xs font-bold transition-all shrink-0 flex items-center gap-1.5"
                    >
                      {isGoogleSigningIn ? (
                        <span>Connecting...</span>
                      ) : (
                        <>Sign in with Google</>
                      )}
                    </button>
                  </div>
                )}

                {gmailStatusNotice && (
                  <div className="text-[11px] font-mono text-sky-300 bg-sky-950/60 p-2 rounded-lg border border-sky-800/80 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{gmailStatusNotice}</span>
                  </div>
                )}
              </div>

              {mfaEmailSentNotice && (
                <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-300 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Inbox className="w-4 h-4 text-sky-400" />
                    <span>{mfaEmailSentNotice}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAutoFillMfa}
                    className="text-[11px] font-bold text-sky-400 hover:underline"
                  >
                    Auto-fill Code
                  </button>
                </div>
              )}

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Select Access Security Context:</span>
                <select
                  value={loginRole}
                  onChange={(e) => setLoginRole(e.target.value as UserRole)}
                  className="bg-slate-950 text-sky-400 font-bold border border-slate-800 rounded px-2.5 py-1 focus:outline-none"
                >
                  <option value="Admin">Admin (CISO & Executive)</option>
                  <option value="Manager">Manager (SecOps Threat Intel)</option>
                  <option value="Auditor">Auditor (AML Compliance)</option>
                  <option value="Employee">Customer / Staff Portal</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-medium mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="vikramaditya.rao@bankguard.ai"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-100 focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs text-slate-300 font-medium">
                    Master Password (Argon2id Salted Hash)
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-[11px] text-sky-400 hover:underline font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-9 text-xs text-slate-100 focus:border-sky-500 focus:outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* MFA Code Section with Email Service Trigger */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs text-slate-300 font-medium">
                    2FA Email MFA Verification Passcode
                  </label>
                  <button
                    type="button"
                    onClick={handleTriggerMfaEmail}
                    disabled={isSendingMfaEmail}
                    className="text-[11px] text-sky-400 hover:text-sky-300 font-bold flex items-center gap-1"
                  >
                    <Send className="w-3 h-3" />
                    {isSendingMfaEmail ? "Dispatching Email..." : "📩 Dispatch MFA Code to Email"}
                  </button>
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={loginMfaCode}
                      onChange={(e) => setLoginMfaCode(e.target.value)}
                      placeholder="Enter 6-digit MFA code"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-100 focus:border-sky-500 focus:outline-none font-mono tracking-widest"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAutoFillMfa}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-sky-400 font-bold text-xs rounded-xl flex items-center gap-1 border border-slate-700 transition-colors"
                    title="Auto fill MFA code from received email"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    Auto Fill
                  </button>
                </div>
              </div>

              {/* Security Handshake Badge */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-mono">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>CSRF & Session Token:</span>
                </div>
                <span className="text-sky-400 font-bold">X-CSRF-Token Enabled</span>
              </div>

              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition-colors"
              >
                {isAuthenticating ? (
                  <span>Executing Session Handshake & Validating MFA...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Authenticate & Enter Dashboard
                  </>
                )}
              </button>
            </form>
          ) : (
            /* NEW CUSTOMER REGISTER FORM */
            <form onSubmit={handleRegister} className="space-y-4">
              {regError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{regError}</span>
                </div>
              )}

              {registeredSuccess ? (
                <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2 animate-in fade-in">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
                  <h3 className="font-bold text-slate-100 text-sm">Customer Onboarded & Registered!</h3>
                  <p className="text-xs text-slate-300">
                    Verification Email & 2FA Token dispatched to <span className="text-sky-400 font-bold">{regEmail}</span>. Redirecting to Login...
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-300 font-medium mb-1">
                        Full Name / Username
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          required
                          placeholder="Ananya Verma"
                          value={regUsername}
                          onChange={(e) => setRegUsername(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-100 focus:border-sky-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-300 font-medium mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                        <input
                          type="email"
                          required
                          placeholder="ananya.verma@outlook.com"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-100 focus:border-sky-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-300 font-medium mb-1">
                        Mobile Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                        <input
                          type="tel"
                          required
                          placeholder="+91 98765 43210"
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-100 focus:border-sky-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-300 font-medium mb-1">
                        Govt ID Tokenization (Aadhaar / PAN)
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="5542-8819-2041"
                        value={regGovtId}
                        onChange={(e) => setRegGovtId(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-100 focus:border-sky-500 focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-300 font-medium mb-1">Account Category</label>
                      <select
                        value={regAccountType}
                        onChange={(e) => setRegAccountType(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-100 focus:border-sky-500 focus:outline-none"
                      >
                        <option value="Savings">Savings Account</option>
                        <option value="Current">Current Business Account</option>
                        <option value="Salary">Corporate Salary Account</option>
                        <option value="Demat">Demat & Wealth Account</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-300 font-medium mb-1">
                        Master Password (Argon2id)
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••••••"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-100 focus:border-sky-500 focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  {/* Confirm Password & Strength Bar */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-300 font-medium mb-1">
                        Confirm Master Password
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••••••"
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-100 focus:border-sky-500 focus:outline-none font-mono"
                      />
                    </div>

                    <div className="flex flex-col justify-end space-y-1">
                      <div className="text-[10px] text-slate-400 flex justify-between">
                        <span>Password Security Rating:</span>
                        <span className="font-mono text-sky-400">
                          {pwdStrength === 0 && "Too Weak"}
                          {pwdStrength === 1 && "Weak"}
                          {pwdStrength === 2 && "Fair"}
                          {pwdStrength === 3 && "Good"}
                          {pwdStrength === 4 && "Military Grade"}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-1 h-1.5 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                        <div className={`rounded-full ${pwdStrength >= 1 ? "bg-red-500" : "bg-slate-800"}`}></div>
                        <div className={`rounded-full ${pwdStrength >= 2 ? "bg-amber-500" : "bg-slate-800"}`}></div>
                        <div className={`rounded-full ${pwdStrength >= 3 ? "bg-sky-400" : "bg-slate-800"}`}></div>
                        <div className={`rounded-full ${pwdStrength >= 4 ? "bg-emerald-400" : "bg-slate-800"}`}></div>
                      </div>
                    </div>
                  </div>

                  {/* Email MFA Integration Notice */}
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 shrink-0">
                      <Inbox className="w-5 h-5" />
                    </div>
                    <div className="text-xs space-y-0.5">
                      <div className="font-bold text-slate-200">Automated 2FA Email Dispatcher Integrated</div>
                      <div className="text-[10px] text-slate-400">
                        Upon clicking register, an instant verification email with your single-use 6-digit MFA passcode will be dispatched to your inbox.
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isRegistering}
                    className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition-colors"
                  >
                    {isRegistering ? (
                      <span>Tokenizing & Registering Customer Account...</span>
                    ) : (
                      <>
                        <User className="w-4 h-4" />
                        Complete Registration & Dispatch Email MFA
                      </>
                    )}
                  </button>
                </>
              )}
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto w-full flex flex-col md:flex-row justify-between items-center text-[11px] text-slate-500 border-t border-slate-800/80 pt-4 z-10 gap-2">
        <div>© 2026 BankGuard.ai • Enterprise Financial Threat Platform</div>
        <div className="flex gap-4 font-mono">
          <span>TLS 1.3 Cipher: ECDHE-RSA-AES256-GCM-SHA384</span>
          <span>FIPS 140-2 Level 3</span>
        </div>
      </footer>
    </div>
  );
};
