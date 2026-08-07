import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import { getDb } from "./src/db/index";
import { sendMfaEmailViaGmail } from "./src/lib/gmailService";

const currentFilename = typeof __filename !== "undefined" ? __filename : (typeof import.meta !== "undefined" && import.meta.url ? fileURLToPath(import.meta.url) : "");
const currentDirname = typeof __dirname !== "undefined" ? __dirname : path.dirname(currentFilename || process.cwd());

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

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

  // Scikit-Learn Trained Random Forest Fraud Model endpoints
  app.get("/api/ml/model-info", async (req, res) => {
    try {
      const fs = await import("fs/promises");
      const metadataPath = path.join(process.cwd(), "model", "model_metadata.json");
      const data = await fs.readFile(metadataPath, "utf-8");
      return res.json(JSON.parse(data));
    } catch (err: any) {
      return res.status(500).json({
        error: "Failed to read Scikit-Learn Random Forest model metadata",
        details: err?.message || String(err),
      });
    }
  });

  app.post("/api/ml/predict", async (req, res) => {
    try {
      const { execFile } = await import("child_process");
      const payload = JSON.stringify(req.body);
      
      execFile("python3", ["predict.py", payload], (error, stdout, stderr) => {
        if (error) {
          console.error("Python ML Exec Error:", stderr || error.message);
          return res.status(500).json({
            error: "Scikit-Learn Random Forest prediction execution failed",
            details: stderr || error.message,
          });
        }
        try {
          const parsed = JSON.parse(stdout.trim());
          return res.json({
            success: true,
            ...parsed,
          });
        } catch (pErr) {
          return res.status(500).json({
            error: "Failed to parse Python ML output",
            raw: stdout,
          });
        }
      });
    } catch (err: any) {
      return res.status(500).json({
        error: "Internal server error during ML prediction",
        details: err?.message || String(err),
      });
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
    const { createServer: createViteServer } = await import("vite");
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
