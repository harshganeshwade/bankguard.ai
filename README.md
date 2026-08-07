# 🛡️ BankGuard AI - Enterprise Fraud Detection & Banking Management Platform

**BankGuard AI** is a next-generation AI-powered core banking security, fraud detection, and threat intelligence system built for high-throughput enterprise financial networks. It combines client-side Random Forest ensemble classifiers (<10ms inference), Explainable AI (SHAP value decompositions), interactive D3.js Money Mule graph visualization, Zero-Knowledge Proof (ZKP) identity verification, Google Cloud Firestore database persistence, and Google Gemini AI threat intelligence.

---

## 🚀 Complete Tech Stack

| Layer / Domain | Technology / Library | Version | Purpose & Architecture Role |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | React | `19.0.1` | Core UI state engine and reactive component hierarchy |
| **Build System & Dev Server** | Vite | `6.2.3` | HMR development server & production bundler |
| **Language** | TypeScript | `5.8.2` | Strict static typing, type safety, and interface definitions |
| **Styling & UI Components** | Tailwind CSS | `4.1.14` | Utility-first responsive design with custom dark glass theme |
| **Icons** | Lucide React | `0.546.0` | Comprehensive security & banking vector icon set |
| **Animations** | Motion (Framer) | `12.23.24` | Smooth route transitions, modals, and interactive UI micro-interactions |
| **Data Visualization (Network)** | D3.js | `7.9.0` | Interactive Force-Directed Topology Graph for Money Mule detection |
| **Data Visualization (Charts)** | Recharts | `3.10.1` | Risk histograms, velocity graphs, and financial trend charts |
| **Backend API Server** | Express.js | `4.21.2` | Server-side REST API proxy, Gmail API service, and SSR fallbacks |
| **Server Runtime** | Node.js & `tsx` | `22.x` / `4.21.0` | Direct execution of TypeScript backend routes in development |
| **Server Bundler** | `esbuild` | `0.25.0` | Compiles `server.ts` into a bundled, production CJS file (`dist/server.cjs`) |
| **Cloud Database & Auth** | Google Cloud Firestore & Firebase Auth | `12.17.1` | Persistent Cloud Firestore storage for audit logs, sessions, and security rules |
| **AI Threat Engine** | `@google/genai` SDK | `2.4.0` | Integration with Google Gemini 2.5 Flash / 1.5 Pro for deep threat analysis |
| **Email Service** | Google Workspace Gmail API | REST v1 | Dispatches real MFA 6-digit OTP passcodes to user inboxes |

---

## 🔑 Key Features & Functional Modules

1. **Random Forest & SHAP Explainable AI**:
   - 10-Tree Ensemble classifier predicting transaction risk score (0-100) in <10ms.
   - Dynamic SHAP feature contribution breakdown (Velocity, Device Hash, Location Jumps, Off-hours).

2. **D3.js Money Mule Network Topology Graph**:
   - Live force-directed node-link graph mapping circular money laundering rings and shell accounts.
   - Interactive zoom, drag, node inspection, and automated ring detection alerts.

3. **Google Cloud Firestore Database Integration**:
   - Real-time persistent logging of all security events, logins, and MFA dispatches.
   - Deployed security rules guarding audit logs and user session states.

4. **Zero-Knowledge Proofs (ZKP) & Biometrics**:
   - Age and identity verification against UIDAI / Aadhaar databases without storing raw PII.

5. **Live Defensive Attack Simulation Lab**:
   - Stress-test the threat model against SQLi/XSS, rapid velocity bursts, and credential stuffing vectors.

6. **Full Core Banking Operations**:
   - Customer KYC management, Multi-Currency Account ledgers, Loan approvals, ATM network monitoring, and Branch performance trackers.

7. **Multi-Role RBAC (Role-Based Access Control)**:
   - Dynamic role switcher supporting **Admin (CISO)**, **Manager**, **Auditor**, and **Employee**.

---

## 👥 Pre-Configured Test Credentials

| Full Name | Role | Email Address | Password | Title / Department |
| :--- | :--- | :--- | :--- | :--- |
| **Vikramaditya Rao** | `Admin` | `vikramaditya.rao@bankguard.ai` | `AdminSecret@2026!` | Chief Information Security Officer (CISO) |
| **Dr. Rajesh Mehta** | `Manager` | `rajesh.mehta@bankguard.ai` | `SecOps@2026Pass` | Head of SecOps Threat Intelligence |
| **Ayesha Patel** | `Auditor` | `ayesha.patel@bankguard.ai` | `AuditPass#2026` | AML Fraud & Compliance Auditor |
| **Devendra Kulkarni** | `Employee` | `devendra.kulkarni@bankguard.ai` | `Support2026!` | Customer Support Operations |
| **Harsh Ganeshwade** | `Customer` | `harshganeshwade@gmail.com` | `HarshPass2026!` | Principal Systems Engineer (HNWI) |

---

## 🛠️ Local Development & Setup Guide

### 1. Prerequisites
- Node.js `v20.x` or higher
- `npm` v10+

### 2. Installation
Clone the repository and install all dependencies:
```bash
git clone https://github.com/your-username/bankguard-ai.git
cd bankguard-ai
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory (refer to `.env.example`):
```env
# Google Gemini API Key for Server-Side AI Threat Analysis
GEMINI_API_KEY=your_gemini_api_key_here

# Firebase Firestore Configuration (Injected automatically or set manually)
VITE_FIREBASE_PROJECT_ID=cedar-lodge-b9v0l
```

### 4. Running the Application
Start the development server (runs Express API server + Vite middleware on `http://localhost:3000`):
```bash
npm run dev
```

### 5. Production Build & Start
Compile frontend assets and server backend:
```bash
npm run build
npm start
```

---

## 📁 Project Directory Structure

```
├── firebase-applet-config.json  # Firebase project credentials & Firestore database ID
├── firebase-blueprint.json       # Database schema definition for Firestore entities
├── firestore.rules               # Firestore security access rules
├── metadata.json                 # Application metadata & Cloud capabilities
├── package.json                  # Dependencies, scripts, and build configurations
├── server.ts                     # Express REST API backend server with Vite middleware
├── src/
│   ├── App.tsx                   # Main React Application & view routing
│   ├── main.tsx                  # React DOM root entry point
│   ├── index.css                 # Global Tailwind CSS styling rules
│   ├── types.ts                  # Shared TypeScript interfaces & enums
│   ├── components/               # Header, Sidebar, Ticker, Security Specs Modal, SAR Modal
│   ├── lib/
│   │   ├── firebase.ts           # Firebase initialization & Firestore audit logger
│   │   ├── fraudEngine.ts        # Random Forest classifier & SHAP feature calculator
│   │   ├── gmailService.ts       # Gmail API integration for real MFA emails
│   │   └── initialData.ts        # Initial Indian location data (Transactions, Branches, ATMs)
│   └── views/                    # View screens (Dashboard, Fraud, Mule Graph, ZKP, Attack Lab, etc.)
└── vite.config.ts                # Vite build and Tailwind CSS plugin configuration
```

---

## 📜 License & Compliance
This project complies with **FIPS 140-2** cryptographic standards and **FIU-IND** SAR reporting guidelines for Indian banking institutions.
