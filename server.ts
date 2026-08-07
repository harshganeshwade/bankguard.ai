import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      app: "BankGuard AI",
      version: "2.0.0",
      hasDatabase: Boolean(process.env.DATABASE_URL),
    });
  });

  // DB Health & Status check
  app.get("/api/db/status", async (req, res) => {
    try {
      const { getDb } = await import("./src/db/index");
      const db = getDb();
      if (!db) {
        return res.json({
          connected: false,
          message: "DATABASE_URL environment variable is not defined.",
        });
      }
      return res.json({
        connected: true,
        message: "Successfully connected to Cloud SQL PostgreSQL database.",
      });
    } catch (err: any) {
      return res.status(500).json({
        connected: false,
        error: err?.message || String(err),
      });
    }
  });

  // Gmail API Server Proxy endpoint for MFA email dispatching
  app.post("/api/gmail/send-mfa", async (req, res) => {
    try {
      const { accessToken, recipientEmail, recipientName, mfaCode, role, userType } = req.body;
      if (!accessToken || !recipientEmail || !mfaCode) {
        return res.status(400).json({
          error: "Missing required fields: accessToken, recipientEmail, and mfaCode are mandatory.",
        });
      }

      const { sendMfaEmailViaGmail } = await import("./src/lib/gmailService");
      const result = await sendMfaEmailViaGmail({
        accessToken,
        recipientEmail,
        recipientName: recipientName || recipientEmail,
        mfaCode,
        role: role || "Employee",
        userType: userType || "Staff",
      });

      if (!result.success) {
        return res.status(500).json({ success: false, error: result.error });
      }

      return res.json({ success: true, messageId: result.messageId });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err?.message || String(err) });
    }
  });

  // AI-powered Fraud Case Deep Analysis endpoint
  app.post("/api/ai-analyze-fraud", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: "GEMINI_API_KEY environment variable is not configured.",
        });
      }

      const { transaction, riskScore, features } = req.body;

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const prompt = `
You are the Chief AI Fraud Investigator for BankGuard AI, a high-security banking system.
Analyze the following flagged banking transaction and provide an executive threat assessment.

Transaction Payload:
- ID: ${transaction?.id || "N/A"}
- Amount: $${transaction?.amount || 0} USD
- Type: ${transaction?.type || "Transfer"}
- Origin Account: ${transaction?.account || "Unknown"}
- Destination/Merchant: ${transaction?.destination || "Unknown"}
- Location: ${transaction?.location || "Unknown"}
- Device: ${transaction?.device || "Unknown"}
- Velocity Score: ${features?.velocityScore || "High"}
- Distance Jump: ${features?.distanceKm || 0} km
- New Device: ${features?.isNewDevice ? "Yes" : "No"}
- VPN Used: ${features?.isVpn ? "Yes" : "No"}
- Failed Logins: ${features?.failedLogins || 0}

Model Calculated Risk Score: ${riskScore || 92}/100

Generate a concise JSON response with:
1. "riskRationale": A 2-sentence crisp expert breakdown explaining why this specific combination of signals triggered a high risk flag.
2. "primaryAttackVector": Short classification string (e.g., "Account Takeover via Foreign VPN", "Rapid Velocity Card Testing", "High-Value Wire Discrepancy").
3. "recommendedAction": Immediate operational step (e.g., "Immediate Account & Card Lock with SMS OTP Challenge").
4. "investigatorNotes": 3 bullet-point technical audit observations.
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const resultText = response.text || "{}";
      const parsed = JSON.parse(resultText);

      return res.json({
        success: true,
        analysis: parsed,
      });
    } catch (err: any) {
      console.error("Gemini AI Analysis Error:", err);
      return res.status(500).json({
        error: "Failed to generate AI fraud analysis.",
        details: err?.message || String(err),
      });
    }
  });

  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`BankGuard AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Server startup error:", err);
});
