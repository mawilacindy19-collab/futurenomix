import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export function requireAuth(onSuccess: () => void) {
  if (typeof window !== 'undefined') {
    const isLoggedIn = localStorage.getItem('orbit_is_logged_in') === 'true';
    if (!isLoggedIn) {
      window.dispatchEvent(new CustomEvent('open-auth-modal'));
      return;
    }
  }
  onSuccess();
}

export async function signOutUser() {
  if (typeof window !== 'undefined') {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Firebase signOut error:', e);
    }
    localStorage.setItem('orbit_is_logged_in', 'false');
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('orbit-auth-change'));
  }
}

