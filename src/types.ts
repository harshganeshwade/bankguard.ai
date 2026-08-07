export type UserRole = "Admin" | "Manager" | "Auditor" | "Employee";

export type CustomerType = "Individual" | "Corporate" | "HNWI" | "NRI";
export type KYCStatus = "Verified" | "Pending" | "Rejected" | "Expired";
export type RiskCategory = "Safe" | "Low Risk" | "Medium Risk" | "High Risk" | "Critical Risk";

export interface Customer {
  id: string;
  name: string;
  aadhaar: string;
  pan: string;
  address: string;
  email: string;
  mobile: string;
  dob: string;
  occupation: string;
  annualIncome: number;
  customerType: CustomerType;
  kycStatus: KYCStatus;
  creditScore: number; // 300 - 850
  riskScore: number; // 0 - 100
  isFrozen: boolean;
  linkedAccountsCount: number;
  avatarUrl?: string;
  documents?: { name: string; type: string; date: string; status: string }[];
}

export type AccountType = "Savings" | "Current" | "Salary" | "Fixed Deposit";
export type AccountStatus = "Active" | "Frozen" | "Blocked" | "Closed";

export interface BankAccount {
  id: string;
  accountNumber: string;
  customerId: string;
  customerName: string;
  type: AccountType;
  balance: number;
  currency: string;
  status: AccountStatus;
  createdAt: string;
  branchName: string;
  linkedCardCount: number;
}

export type CardType = "Debit" | "Credit";

export interface Card {
  id: string;
  cardNumber: string;
  customerName: string;
  customerId: string;
  accountNumber: string;
  type: CardType;
  isBlocked: boolean;
  expiry: string;
  creditLimit?: number;
  currentSpend?: number;
  pinResetRequested: boolean;
}

export type TransactionType =
  | "Deposit"
  | "Withdrawal"
  | "Transfer"
  | "UPI"
  | "ATM"
  | "IMPS"
  | "RTGS"
  | "NEFT";

export type TransactionStatus = "Cleared" | "Pending Review" | "Hold" | "Rejected";

export interface RandomForestFeatures {
  amount: number;
  timeHour: number;
  dayOfWeek: number;
  merchantCategory: string;
  location: string;
  deviceId: string;
  ipAddress: string;
  prevTransactions24h: number;
  transactionFrequency: number;
  avgDailySpend: number;
  failedLoginAttempts: number;
  distanceKm: number; // Distance jump from last location
  loginDeviceChanged: boolean;
  cardPresent: boolean;
  velocityScore: number; // 0 - 100
  beneficiaryAgeDays: number;
  isNewDevice: boolean;
  isVpnUsed: boolean;
  isAtmWithdrawal: boolean;
  isCashDeposit: boolean;
}

export interface FeatureImportance {
  featureName: string;
  contributionPercent: number; // e.g. +27%
  reasonText: string;
  impactType: "high_risk" | "medium_risk" | "mitigating";
}

export interface Transaction {
  id: string;
  txId: string;
  timestamp: string;
  customerId: string;
  customerName: string;
  accountNumber: string;
  destination: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  riskScore: number; // 0 - 100
  fraudProbability: number; // e.g. 96
  riskCategory: RiskCategory;
  isFlagged: boolean;
  recommendedAction: string;
  primaryReason: string;
  features: RandomForestFeatures;
  shapExplanations: FeatureImportance[];
  investigatorNotes?: string;
  assignedInvestigator?: string;
  isReviewed?: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  username: string;
  role: UserRole;
  ip: string;
  browser: string;
  device: string;
  action: string;
  previousValue: string;
  newValue: string;
  riskTag: "CRITICAL" | "ELEVATED" | "ROUTINE" | "LOW";
}

export interface Employee {
  id: string;
  empCode: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  branchName: string;
  status: "Active" | "Suspended" | "On Leave";
  joinedDate: string;
}

export interface Branch {
  id: string;
  code: string;
  name: string;
  managerName: string;
  address: string;
  customerCount: number;
  employeeCount: number;
  atmCount: number;
  monthlyRevenue: number;
  performanceScore: number; // 0 - 100
  status: "Operational" | "Maintenance";
}

export interface ATM {
  id: string;
  code: string;
  location: string;
  branchName: string;
  status: "Online" | "Offline" | "Low Cash" | "Maintenance";
  cashRemaining: number;
  cashCapacity: number;
  lastSync: string;
  lastWithdrawalTime: string;
  errorLogsCount: number;
  recentLogs: string[];
}

export interface Loan {
  id: string;
  loanNumber: string;
  customerId: string;
  customerName: string;
  loanType: "Personal" | "Home" | "Auto" | "Business" | "Education";
  amount: number;
  interestRate: number; // e.g., 8.5%
  tenureMonths: number;
  emiAmount: number;
  status: "Pending Approval" | "Approved" | "Rejected" | "Disbursed" | "Closed";
  creditScore: number;
  riskAnalysis: string;
  appliedDate: string;
}

export interface SecurityStatus {
  jwtActiveSessions: number;
  passwordPolicy: "Argon2 / BCrypt Enforced";
  csrfProtection: boolean;
  rateLimiterState: "Active (Max 100 req/min)";
  totpEnabled: boolean;
  failedLoginsToday: number;
  lockoutThreshold: number;
  xssProtection: boolean;
  sessionTimeoutMinutes: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "fraud" | "security" | "system" | "loan" | "atm";
  severity: "high" | "medium" | "info";
  timestamp: string;
  read: boolean;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  senderName: string;
  senderRole: UserRole | string;
  senderEmail: string;
  category: "Fraud Escalation" | "Model Retraining" | "Account Freeze Request" | "Security Query" | "System Support" | "General Query";
  priority: "Urgent" | "High" | "Medium" | "Low";
  relatedRef?: string;
  subject: string;
  message: string;
  attachLogs: boolean;
  status: "Pending Admin Review" | "In Investigation" | "Escalated to RBI/FinCEN" | "Resolved";
  timestamp: string;
  adminReplies?: {
    id: string;
    sender: string;
    text: string;
    timestamp: string;
  }[];
}
