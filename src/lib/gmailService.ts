import { UserRole } from '../types';

export interface SendMfaEmailParams {
  accessToken: string;
  recipientEmail: string;
  recipientName: string;
  mfaCode: string;
  role: UserRole;
  userType?: 'Staff' | 'Customer';
}

function constructRfc2822Message(to: string, subject: string, htmlContent: string): string {
  const messageLines = [
    `To: ${to}`,
    `Subject: ${subject}`,
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    '',
    htmlContent,
  ];

  const rawString = messageLines.join('\r\n');
  
  // Base64URL encode for Gmail API
  return btoa(unescape(encodeURIComponent(rawString)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export function buildRoleMfaEmailHtml(params: {
  recipientName: string;
  mfaCode: string;
  role: UserRole;
  userType?: 'Staff' | 'Customer';
}) {
  const { recipientName, mfaCode, role, userType } = params;

  let badgeColor = '#0284c7'; // Sky
  let badgeTitle = 'CUSTOMER ACCESS';
  let roleIcon = '🛡️';
  let headerTitle = 'BankGuard Account Verification';

  if (role === 'Admin') {
    badgeColor = '#dc2626'; // Red
    badgeTitle = 'CHIEF INFORMATION SECURITY OFFICER (CISO)';
    roleIcon = '🚨';
    headerTitle = 'CISO High-Privilege Security Authorization';
  } else if (role === 'Manager') {
    badgeColor = '#d97706'; // Amber
    badgeTitle = 'HEAD OF SECOPS THREAT INTELLIGENCE';
    roleIcon = '⚡';
    headerTitle = 'SecOps Management Session Access';
  } else if (role === 'Auditor') {
    badgeColor = '#9333ea'; // Purple
    badgeTitle = 'AML COMPLIANCE & AUDIT OFFICER';
    roleIcon = '📋';
    headerTitle = 'Compliance Audit Portal Authorization';
  } else if (role === 'Employee' && userType === 'Staff') {
    badgeColor = '#16a34a'; // Green
    badgeTitle = 'SUPPORT & SECOPS OPERATIONS STAFF';
    roleIcon = '💼';
    headerTitle = 'Operations Portal Session Verification';
  }

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #0f172a; color: #f8fafc; margin: 0; padding: 24px; }
    .container { max-width: 560px; margin: 0 auto; background-color: #1e293b; border: 1px solid #334155; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5); }
    .header { background-color: #090d16; padding: 24px; text-align: center; border-bottom: 2px solid ${badgeColor}; }
    .badge { display: inline-block; background-color: ${badgeColor}22; color: ${badgeColor}; border: 1px solid ${badgeColor}55; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 9999px; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 8px; }
    .title { color: #ffffff; font-size: 20px; font-weight: 700; margin: 6px 0 0 0; }
    .content { padding: 28px; font-size: 15px; line-height: 1.6; color: #cbd5e1; }
    .otp-card { background-color: #0f172a; border: 1px dashed ${badgeColor}; border-radius: 10px; text-align: center; padding: 20px; margin: 20px 0; }
    .otp-code { font-family: "Courier New", Courier, monospace; font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #38bdf8; text-shadow: 0 0 10px rgba(56,189,248,0.3); }
    .expiry { font-size: 12px; color: #94a3b8; margin-top: 6px; }
    .footer { background-color: #0f172a; padding: 16px 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #334155; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="badge">${roleIcon} ${badgeTitle}</div>
      <div class="title">${headerTitle}</div>
    </div>
    <div class="content">
      <p>Hello <strong>${recipientName}</strong>,</p>
      <p>You have requested a secure login authorization token for your <strong>BankGuard AI (${role})</strong> session.</p>
      <div class="otp-card">
        <div style="font-size: 12px; color: #94a3b8; text-transform: uppercase; margin-bottom: 6px; font-weight: 600;">Your 6-Digit MFA Verification Code</div>
        <div class="otp-code">${mfaCode}</div>
        <div class="expiry">⏰ Valid for 10 minutes | Do not share this code with anyone</div>
      </div>
      <p style="font-size: 13px; color: #94a3b8;">If you did not initiate this authentication request, please immediately freeze your account or notify BankGuard SecOps Threat Response.</p>
    </div>
    <div class="footer">
      BankGuard AI Security System • HMAC-SHA256 Multi-Factor Dispatch Engine
    </div>
  </div>
</body>
</html>
  `;
}

export async function sendMfaEmailViaGmail(params: SendMfaEmailParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const { accessToken, recipientEmail, recipientName, mfaCode, role, userType } = params;

  let subject = `🔐 [BankGuard AI] Your MFA Verification Code: ${mfaCode}`;
  if (role === 'Admin') subject = `🚨 [CRITICAL CISO SECURITY] MFA Code ${mfaCode} - CISO Login Request`;
  if (role === 'Manager') subject = `⚡ [SecOps Intel] MFA Passcode ${mfaCode} - Manager Authorization`;
  if (role === 'Auditor') subject = `📋 [AML Compliance] OTP Token ${mfaCode} - Auditor Portal`;

  const htmlBody = buildRoleMfaEmailHtml({ recipientName, mfaCode, role, userType });
  const rawMessage = constructRfc2822Message(recipientEmail, subject, htmlBody);

  try {
    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw: rawMessage }),
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData?.error?.message || `Gmail API returned HTTP ${response.status}`);
    }

    const data = await response.json();
    return { success: true, messageId: data.id };
  } catch (err: any) {
    console.error('Gmail API MFA Dispatch failed:', err);
    return { success: false, error: err.message || String(err) };
  }
}
