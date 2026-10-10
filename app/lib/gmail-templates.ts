export interface B2BProposalData {
  companyName: string;
  opportunityTitle: string;
  senderName: string;
  senderEmail: string;
  senderCompany: string;
  senderRole: string;
  connectionGoal: string;
  proposalMessage: string;
  contactPreference: string;
  attachedFileName?: string;
  referenceId?: string;
  trackingId?: string;
}

/**
 * Generates email HTML sent to the proposal sender confirming receipt
 */
export function generateSenderConfirmationEmail(data: B2BProposalData): string {
  const ref = data.referenceId || `FN-REQ-${Math.floor(100000 + Math.random() * 900000)}`;

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Proposal Confirmation</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f6f9; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color:#1e293b;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f4f6f9; padding:40px 10px;">
      <tr>
        <td align="center">
          <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 10px 25px rgba(0,0,0,0.05); border:1px solid #e2e8f0;">
            <!-- Header -->
            <tr>
              <td style="background-color:#0f172a; padding:32px 40px; text-align:left;">
                <h1 style="color:#ffffff; font-size:24px; font-weight:800; margin:0; letter-spacing:-0.5px; text-transform:lowercase;">futurenomix</h1>
                <p style="color:#94a3b8; font-size:13px; margin:4px 0 0 0;">Global B2B Alliance & Ventures Ecosystem</p>
              </td>
            </tr>

            <!-- Body Content -->
            <tr>
              <td style="padding:40px;">
                <div style="display:inline-block; background-color:#ecfdf5; border:1px solid #a7f3d0; border-radius:30px; padding:6px 16px; margin-bottom:20px;">
                  <span style="color:#047857; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px;">✓ Proposal Transmitted Successfully</span>
                </div>

                <h2 style="font-size:20px; font-weight:700; color:#0f172a; margin:0 0 12px 0;">Hello ${data.senderName || 'Partner'},</h2>
                <p style="font-size:15px; line-height:1.6; color:#475569; margin:0 0 24px 0;">
                  Your B2B proposal regarding <strong>"${data.opportunityTitle}"</strong> has been successfully registered and transmitted to the executive team at <strong>${data.companyName}</strong>.
                </p>

                <!-- Proposal Reference Card -->
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:20px; margin-bottom:28px;">
                  <tr>
                    <td>
                      <p style="font-size:12px; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:0.5px; margin:0 0 12px 0;">Proposal Reference Details</p>
                      <table width="100%" border="0" cellspacing="0" cellpadding="6">
                        <tr>
                          <td width="35%" style="font-size:13px; color:#64748b; font-weight:600;">Reference ID:</td>
                          <td style="font-size:13px; color:#0f172a; font-weight:700; font-family:monospace;">${ref}</td>
                        </tr>
                        <tr>
                          <td style="font-size:13px; color:#64748b; font-weight:600;">Target Organization:</td>
                          <td style="font-size:13px; color:#0f172a; font-weight:600;">${data.companyName}</td>
                        </tr>
                        <tr>
                          <td style="font-size:13px; color:#64748b; font-weight:600;">Primary Goal:</td>
                          <td style="font-size:13px; color:#0f172a;">${data.connectionGoal}</td>
                        </tr>
                        <tr>
                          <td style="font-size:13px; color:#64748b; font-weight:600;">Contact Preference:</td>
                          <td style="font-size:13px; color:#0f172a;">${data.contactPreference}</td>
                        </tr>
                        ${data.attachedFileName ? `
                        <tr>
                          <td style="font-size:13px; color:#64748b; font-weight:600;">Attached Document:</td>
                          <td style="font-size:13px; color:#2563eb; font-weight:600;">${data.attachedFileName}</td>
                        </tr>
                        ` : ''}
                      </table>
                    </td>
                  </tr>
                </table>

                <p style="font-size:14px; line-height:1.6; color:#475569; margin:0 0 20px 0;">
                  <strong>What happens next?</strong> The decision-makers at ${data.companyName} have received an automated notification with your credentials and message body. They will review your terms and reach out directly to <code>${data.senderEmail}</code>.
                </p>

                <div style="border-top:1px solid #e2e8f0; padding-top:20px; font-size:13px; color:#94a3b8; text-align:center;">
                  Sent automatically via Futurenomix Gmail Integration Ecosystem
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

/**
 * Generates email HTML sent to the target business notifying them of an incoming B2B request
 */
export function generateTargetBusinessNotificationEmail(data: B2BProposalData): string {
  const ref = data.referenceId || `FN-REQ-${Math.floor(100000 + Math.random() * 900000)}`;
  const baseUrl = process.env.APP_URL 
    ? (process.env.APP_URL.startsWith('http') ? process.env.APP_URL : `https://${process.env.APP_URL}`)
    : 'https://futurenomix.com';
  const trackingPixel = data.trackingId ? `<img src="${baseUrl}/api/tracking/${data.trackingId}" width="1" height="1" style="display:none !important;" />` : '';

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>New B2B Connection Request</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f6f9; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color:#1e293b;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f4f6f9; padding:40px 10px;">
      <tr>
        <td align="center">
          <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 10px 25px rgba(0,0,0,0.05); border:1px solid #e2e8f0;">
            <!-- Header -->
            <tr>
              <td style="background-color:#2563eb; padding:32px 40px; text-align:left;">
                <h1 style="color:#ffffff; font-size:22px; font-weight:800; margin:0; letter-spacing:-0.5px;">New Incoming B2B Partnership Proposal</h1>
                <p style="color:#bfdbfe; font-size:13px; margin:4px 0 0 0;">Futurenomix Alliance Portal • Ref #${ref}</p>
              </td>
            </tr>

            <!-- Body Content -->
            <tr>
              <td style="padding:40px;">
                <h2 style="font-size:18px; font-weight:700; color:#0f172a; margin:0 0 12px 0;">Attention Executive Team at ${data.companyName},</h2>
                <p style="font-size:15px; line-height:1.6; color:#475569; margin:0 0 24px 0;">
                  You have received a new verified business connection proposal from <strong>${data.senderName || 'A Partner'}</strong>${data.senderCompany ? ` (${data.senderCompany}${data.senderRole ? ` — ${data.senderRole}` : ''})` : ''}.
                </p>

                <!-- Sender Card -->
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#eff6ff; border:1px solid #bfdbfe; border-radius:12px; padding:20px; margin-bottom:24px;">
                  <tr>
                    <td>
                      <p style="font-size:12px; font-weight:700; color:#1e40af; text-transform:uppercase; letter-spacing:0.5px; margin:0 0 12px 0;">Sender Credentials & Contact</p>
                      <table width="100%" border="0" cellspacing="0" cellpadding="4">
                        <tr>
                          <td width="35%" style="font-size:13px; color:#475569; font-weight:600;">Full Name:</td>
                          <td style="font-size:13px; color:#0f172a; font-weight:700;">${data.senderName || 'N/A'}</td>
                        </tr>
                        <tr>
                          <td style="font-size:13px; color:#475569; font-weight:600;">Organization:</td>
                          <td style="font-size:13px; color:#0f172a; font-weight:600;">${data.senderCompany || 'Independent / Confidential'}</td>
                        </tr>
                        <tr>
                          <td style="font-size:13px; color:#475569; font-weight:600;">Role / Title:</td>
                          <td style="font-size:13px; color:#0f172a;">${data.senderRole || 'N/A'}</td>
                        </tr>
                        <tr>
                          <td style="font-size:13px; color:#475569; font-weight:600;">Direct Email:</td>
                          <td style="font-size:13px; color:#2563eb; font-weight:700;">${data.senderEmail}</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <!-- Message Body -->
                <div style="background-color:#f8fafc; border-left:4px solid #2563eb; border-radius:0 12px 12px 0; padding:20px; margin-bottom:28px;">
                  <p style="font-size:12px; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:0.5px; margin:0 0 8px 0;">Proposal Executive Summary / Message</p>
                  <p style="font-size:14px; line-height:1.7; color:#334155; margin:0; white-space:pre-line;">${data.proposalMessage || 'No additional message text provided.'}</p>
                </div>

                <!-- Call to action button -->
                <div style="text-align:center; margin-bottom:28px;">
                  <a href="mailto:${data.senderEmail}?subject=Re:%20B2B%20Proposal%20-${encodeURIComponent(data.opportunityTitle)}" style="display:inline-block; background-color:#2563eb; color:#ffffff; font-size:14px; font-weight:700; text-decoration:none; padding:14px 28px; border-radius:10px; box-shadow:0 4px 12px rgba(37,99,235,0.25);">
                    Respond directly to ${data.senderName || 'Sender'}
                  </a>
                </div>

                <div style="border-top:1px solid #e2e8f0; padding-top:20px; font-size:13px; color:#94a3b8; text-align:center;">
                  Sent via Futurenomix B2B Connector System
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    ${trackingPixel}
  </body>
  </html>
  `;
}
