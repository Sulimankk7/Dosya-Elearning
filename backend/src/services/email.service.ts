// services/emailService.ts
import { Resend } from "resend";

interface ResetEmailOptions {
  toEmail: string;
  resetToken: string;
}

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Builds the HTML email body for a password reset request.
 */
function buildResetEmailHtml(resetLink: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Reset Password</title>

<style>
body{
  margin:0;
  padding:0;
  background:#020617;
  font-family:Arial, Helvetica, sans-serif;
}

.wrapper{
  max-width:560px;
  margin:40px auto;
  background:#0b1220;
  border-radius:14px;
  overflow:hidden;
  border:1px solid rgba(255,255,255,0.06);
}

.header{
  padding:32px;
  text-align:center;
  background:linear-gradient(135deg,#07122a,#022c22);
}

.logo{
  color:#22c55e;
  font-size:26px;
  font-weight:700;
  letter-spacing:1px;
}

.subtitle{
  color:#9ca3af;
  font-size:13px;
  margin-top:6px;
}

.body{
  padding:36px;
  color:#e5e7eb;
  font-size:15px;
  line-height:1.7;
}

.btn-wrap{
  text-align:center;
  margin:30px 0;
}

.btn{
  display:inline-block;
  background:#22c55e;
  color:#022c22 !important;
  text-decoration:none;
  padding:14px 34px;
  border-radius:10px;
  font-weight:600;
  font-size:15px;
}

.note{
  background:#020617;
  border:1px solid rgba(255,255,255,0.08);
  padding:14px;
  border-radius:8px;
  color:#9ca3af;
  font-size:13px;
}

.link{
  color:#22c55e;
  word-break:break-all;
  font-size:13px;
}

.footer{
  text-align:center;
  padding:18px;
  font-size:12px;
  color:#6b7280;
  border-top:1px solid rgba(255,255,255,0.06);
}
</style>

</head>

<body>

<div class="wrapper">

<div class="header">
<div class="logo">DOSYA</div>
<div class="subtitle">E-Learning Platform</div>
</div>

<div class="body">

<p>Hi there,</p>

<p>
We received a request to reset the password for your Dosya account.
Click the button below to choose a new password.
</p>

<div class="btn-wrap">
<a href="${resetLink}" class="btn">Reset Password</a>
</div>

<div class="note">
This link is valid for <b>30 minutes</b>. If you did not request this,
you can ignore this email.
</div>

<p style="margin-top:24px;font-size:13px;color:#9ca3af">
If the button doesn't work, use this link:
</p>

<p class="link">${resetLink}</p>

</div>

<div class="footer">
© ${new Date().getFullYear()} Dosya
</div>

</div>

</body>
</html>
`.trim();
}

/**
 * Sends a password reset email to the specified address using Resend API (HTTPS).
 */
export async function sendPasswordResetEmail({
  toEmail,
  resetToken,
}: ResetEmailOptions): Promise<void> {
  const appBaseUrl = process.env.APP_BASE_URL ?? 'http://localhost:5173';
  const resetLink = `${appBaseUrl}/reset-password?token=${resetToken}`;

  const fromEmail = process.env.EMAIL_FROM ?? 'onboarding@resend.dev';

  const { error } = await resend.emails.send({
    from: `Dosya <${fromEmail}>`,
    to: [toEmail],
    subject: 'Reset your Dosya password',
    html: buildResetEmailHtml(resetLink),
  });

  if (error) {
    throw new Error(`Resend email failed: ${error.message}`);
  }
}
