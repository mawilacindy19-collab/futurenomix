import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { accessToken, to, subject, htmlBody, fromEmail } = await req.json();

    if (!accessToken) {
      return NextResponse.json({ error: 'Missing access token for Gmail API' }, { status: 400 });
    }

    if (!to || !subject || !htmlBody) {
      return NextResponse.json({ error: 'Missing email parameters (to, subject, htmlBody)' }, { status: 400 });
    }

    const headers = [
      `To: ${to}`,
      ...(fromEmail ? [`From: ${fromEmail}`] : []),
      'Content-Type: text/html; charset=utf-8',
      'MIME-Version: 1.0',
      `Subject: =?utf-8?B?${Buffer.from(subject).toString('base64')}?=`,
      '',
      htmlBody
    ];

    const rawMessage = headers.join('\r\n');
    const rawBase64 = Buffer.from(rawMessage)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const gmailRes = await fetch('https://gmail.googleapis.com/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ raw: rawBase64 })
    });

    if (!gmailRes.ok) {
      const errorData = await gmailRes.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.error?.message || `Gmail API failed with status ${gmailRes.status}` },
        { status: gmailRes.status }
      );
    }

    const result = await gmailRes.json();
    return NextResponse.json({ success: true, messageId: result.id });
  } catch (err: any) {
    console.error('API Gmail Send Error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
