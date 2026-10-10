import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Configure Google Provider with Gmail Send Scope
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/gmail.send');

let isSigningIn = false;
let cachedAccessToken: string | null = null;

/**
 * Initialize Auth listener to maintain user state
 */
export const initGmailAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

/**
 * Trigger Google Sign In popup to request Gmail access token
 */
export const signInWithGoogleGmail = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to retrieve Google Access Token with Gmail permissions.');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    if (error?.code === 'auth/popup-closed-by-user') {
      console.log('Google sign-in popup closed by user.');
      return null;
    }
    console.error('Gmail Auth Error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

/**
 * Get current cached access token
 */
export const getCachedAccessToken = (): string | null => {
  return cachedAccessToken;
};

/**
 * Logout from Firebase Auth
 */
export const logoutGmail = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

/**
 * Helper to construct base64url encoded MIME email string
 */
function createMimeMessage({
  to,
  subject,
  htmlBody,
  fromEmail
}: {
  to: string;
  subject: string;
  htmlBody: string;
  fromEmail?: string;
}): string {
  const headers = [
    `To: ${to}`,
    ...(fromEmail ? [`From: ${fromEmail}`] : []),
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: =?utf-8?B?${typeof window !== 'undefined' ? btoa(unescape(encodeURIComponent(subject))) : Buffer.from(subject).toString('base64')}?=`,
    '',
    htmlBody
  ];

  const rawMessage = headers.join('\r\n');

  if (typeof window !== 'undefined') {
    return btoa(unescape(encodeURIComponent(rawMessage)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  return Buffer.from(rawMessage)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Direct Gmail API send function
 */
export const sendGmailNotification = async ({
  accessToken,
  to,
  subject,
  htmlBody,
  fromEmail
}: {
  accessToken: string;
  to: string;
  subject: string;
  htmlBody: string;
  fromEmail?: string;
}) => {
  const rawBase64 = createMimeMessage({ to, subject, htmlBody, fromEmail });

  const res = await fetch('https://gmail.googleapis.com/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      raw: rawBase64
    })
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Gmail API send failed with status ${res.status}`);
  }

  return await res.json();
};
