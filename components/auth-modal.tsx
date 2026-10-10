"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Check, 
  ShieldCheck, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Sparkles, 
  KeyRound, 
  RotateCcw,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { 
  signInWithPopup, 
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export function AuthModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signup' | 'signin' | 'reset'>('signup');
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Verification fields
  const [enteredCode, setEnteredCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('849201');
  const [resendTimer, setResendTimer] = useState(30);
  const [isCodeSent, setIsCodeSent] = useState(false);

  // Feedback states
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const handleOpenAuth = (e?: Event) => {
      const customEvent = e as CustomEvent<{ mode?: 'signup' | 'signin' }>;
      const mode = customEvent?.detail?.mode || 'signup';
      setAuthMode(mode);
      setStep('form');
      setErrorMessage('');
      setSuccessMessage('');
      setIsOpen(true);
    };

    window.addEventListener('open-auth-modal', handleOpenAuth as EventListener);
    return () => {
      window.removeEventListener('open-auth-modal', handleOpenAuth as EventListener);
    };
  }, []);


  const handleStartSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      setIsLoading(false);
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      setIsLoading(false);
      return;
    }
    if (!acceptedTerms) {
      setErrorMessage('Please accept the Terms of Service & Privacy Policy to continue.');
      setIsLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      const username = name.toLowerCase().replace(/[^a-z0-9]/g, '') || `user${user.uid.slice(0, 4)}`;
      
      // Create user profile in Firestore
      try {
        await setDoc(doc(db, 'users', user.uid), {
          id: user.uid,
          name: name.trim(),
          username,
          email: email.trim(),
          avatarUrl: `https://dummyimage.com/200x200/1e293b/ffffff?text=${encodeURIComponent(username.slice(0, 2).toUpperCase())}`,
          bio: 'Innovator exploring the FutureNomix ecosystem.',
          role: 'Member',
          createdAt: new Date().toISOString()
        });
      } catch (dbErr) {
        console.warn('Could not sync user profile to Firestore:', dbErr);
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('orbit_is_logged_in', 'true');
        localStorage.setItem('orbit_active_account_id', user.uid);
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('orbit-auth-change'));
      }

      setIsOpen(false);
      router.push('/onboarding');
    } catch (err: any) {
      console.error('Sign-up error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setErrorMessage('This email is already registered. Please sign in instead.');
      } else {
        setErrorMessage(err.message || 'Failed to create account. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (typeof window !== 'undefined') {
        localStorage.setItem('orbit_is_logged_in', 'true');
        localStorage.setItem('orbit_active_account_id', user.uid);
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('orbit-auth-change'));
      }

      setIsOpen(false);
      window.location.reload();
    } catch (err: any) {
      console.error('Sign-in error:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setErrorMessage('Invalid email or password. Please try again.');
      } else {
        setErrorMessage(err.message || 'Failed to sign in. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage(`Password reset link sent to ${email}. Please check your inbox.`);
      setStep('success');
    } catch (err: any) {
      console.error('Password reset error:', err);
      setErrorMessage(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialGoogle = async () => {
    setIsLoadingGoogle(true);
    setErrorMessage('');
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (!user) {
        throw new Error('Google sign-in completed without user profile data.');
      }

      const accountId = user.uid;
      const displayName = user.displayName || 'Google Member';
      const email = user.email || 'member@gmail.com';
      const photoURL = user.photoURL || `https://dummyimage.com/200x200/1e293b/ffffff?text=${encodeURIComponent(displayName.slice(0, 2).toUpperCase())}`;
      const username = (email.split('@')[0] || 'innovator').toLowerCase().replace(/[^a-z0-9]/g, '') || `user${user.uid.slice(0, 5)}`;

      const googleAccount = {
        id: accountId,
        name: displayName,
        username,
        email,
        type: 'personal',
        role: 'Founder & Innovator',
        avatarUrl: photoURL
      };

      const googleProfile = {
        name: displayName,
        username,
        email,
        role: 'Founder & Innovator',
        company: 'FutureNomix Network',
        location: 'Global',
        website: `https://${username}.futurenomix.dev`,
        bio: 'Verified member authenticated via Google. Exploring ecosystem connections, co-founder synergies, and market opportunities.',
        skills: ['Product Strategy', 'Innovation', 'Business Development'],
        projects: ['FutureNomix Ecosystem MVP'],
        experience: [
          {
            title: 'Founder & Ecosystem Member',
            period: '2026 - Present',
            description: 'Authenticated via Google across FutureNomix network.'
          }
        ],
        avatarUrl: photoURL
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('orbit_user_profile', JSON.stringify(googleProfile));
        localStorage.setItem(`orbit_user_profile_${accountId}`, JSON.stringify(googleProfile));
        localStorage.setItem('orbit_active_account_id', accountId);
        localStorage.setItem('orbit_is_logged_in', 'true');

        let registered: any[] = [];
        try {
          const stored = localStorage.getItem('orbit_registered_accounts');
          if (stored) registered = JSON.parse(stored);
        } catch (e) {}
        if (!registered.find((a: any) => a.id === accountId || a.email?.toLowerCase() === email.toLowerCase())) {
          registered.push(googleAccount);
          localStorage.setItem('orbit_registered_accounts', JSON.stringify(registered));
        }

        let storedAccounts: any[] = [];
        try {
          const accs = localStorage.getItem('orbit_accounts');
          if (accs) storedAccounts = JSON.parse(accs);
        } catch (e) {}
        const existingIdx = storedAccounts.findIndex((a: any) => a.id === accountId);
        if (existingIdx >= 0) {
          storedAccounts[existingIdx] = googleAccount;
        } else {
          storedAccounts.unshift(googleAccount);
        }
        localStorage.setItem('orbit_accounts', JSON.stringify(storedAccounts));

        // Sync to Firestore users collection
        try {
          await setDoc(doc(db, 'users', accountId), {
            id: accountId,
            name: displayName,
            username,
            email,
            avatarUrl: photoURL,
            bio: googleProfile.bio,
            role: googleProfile.role,
            createdAt: new Date().toISOString()
          }, { merge: true });
        } catch (dbErr) {
          console.warn('Could not sync user profile to Firestore:', dbErr);
        }

        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('orbit-auth-change'));
        setIsOpen(false);
        window.location.reload();
      }
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') {
        console.warn('Google Sign-In popup closed or cancelled by user:', err?.code);
        setErrorMessage('Google sign-in was cancelled or closed before completion.');
      } else {
        console.error('Google Sign-In error:', err);
        if (err?.code === 'auth/popup-blocked') {
          setErrorMessage('Popup was blocked by the browser. Please allow popups or open the preview in a new window.');
        } else if (err?.code === 'auth/unauthorized-domain') {
          setErrorMessage('This preview domain is not yet authorized in Firebase Console. Please add it under Firebase Auth Authorized Domains.');
        } else {
          setErrorMessage(err?.message || 'Failed to sign in with Google. Please try again.');
        }
      }
    } finally {
      setIsLoadingGoogle(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200/80 dark:border-zinc-800 p-6 sm:p-8 relative overflow-hidden"
          >
            {/* Top Accent Gradient Line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-orange-500 to-rose-600" />

            {/* Modal Header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-xl font-display font-bold text-zinc-900 dark:text-zinc-50">
                  {authMode === 'signup' 
                    ? 'Create Your Account' 
                    : authMode === 'reset'
                      ? 'Reset Password'
                      : 'Welcome Back'}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  {authMode === 'signup'
                    ? 'Standard registration: profile details, terms & instant access.'
                    : authMode === 'reset'
                      ? 'Enter your email to receive a password recovery link.'
                      : 'Sign in to access your profile and manage projects.'}
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label="Close auth dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Feedback Messages */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 text-xs font-medium">
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-700 dark:text-green-300 text-xs font-medium">
                {successMessage}
              </div>
            )}

            {/* Social Login Button */}
            {step === 'form' && (
              <div className="mb-4">
                <button
                  type="button"
                  disabled={isLoadingGoogle}
                  onClick={handleSocialGoogle}
                  className="w-full py-2.5 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center gap-3 text-xs font-bold text-zinc-800 dark:text-zinc-200 transition-all shadow-sm active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoadingGoogle ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-red-600" />
                      <span>Signing in with Google...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                      <span>Continue with Google</span>
                    </>
                  )}
                </button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase">
                    <span className="bg-white dark:bg-zinc-900 px-3 text-zinc-400 font-semibold tracking-wider">
                      Or with email
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 1: Basic Form (Name, Email, Password, Terms) */}
            {step === 'form' && authMode === 'signup' && (
              <form onSubmit={handleStartSignUp} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Jordan Hayes"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@domain.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
                    Secure Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                    />
                  </div>
                </div>

                {/* Terms of Service Checkbox */}
                <div className="pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-zinc-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-xs text-zinc-600 dark:text-zinc-400 leading-snug">
                      I agree to the <span className="font-semibold text-zinc-900 dark:text-zinc-200">User Agreements</span>, <span className="font-semibold text-zinc-900 dark:text-zinc-200">Terms of Service</span>, and <span className="font-semibold text-zinc-900 dark:text-zinc-200">Privacy Policy</span>.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm tracking-wide shadow-lg shadow-red-600/25 transition-all active:scale-[0.99] flex items-center justify-center gap-2 mt-3"
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Create Account</span>
                  {!isLoading && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>
            )}



            {/* SIGN IN FORM */}
            {authMode === 'signin' && (
              <form onSubmit={handleSignIn} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@domain.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('reset');
                        setErrorMessage('');
                        setSuccessMessage('');
                      }}
                      className="text-[10px] font-bold text-red-600 hover:text-red-700 transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm tracking-wide shadow-lg shadow-red-600/25 transition-all active:scale-[0.99] mt-2 flex items-center justify-center gap-2"
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Sign In</span>
                </button>

                <div className="pt-2">
                  <div className="relative my-3">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase">
                      <span className="bg-white dark:bg-zinc-900 px-3 text-zinc-400 font-semibold tracking-wider">
                        Don&apos;t have an account?
                      </span>
                    </div>
                  </div>
                  <button
                    id="auth-modal-signup-btn"
                    type="button"
                    onClick={() => {
                      setErrorMessage('');
                      setIsOpen(false);
                      router.push('/onboarding');
                    }}
                    className="w-full py-2.5 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold text-sm transition-all flex items-center justify-center gap-2 active:scale-[0.99] shadow-sm group"
                  >
                    <span>Sign Up &amp; Create Profile</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>
              </form>
            )}

            {/* RESET PASSWORD FORM */}
            {authMode === 'reset' && step !== 'success' && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
                    Account Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@domain.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm tracking-wide shadow-lg shadow-red-600/25 transition-all active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Send Reset Link</span>
                </button>
              </form>
            )}

            {/* Mode Switcher Toggle */}
            <div className="text-center pt-4 border-t border-zinc-100 dark:border-zinc-800 mt-4">
              {authMode === 'reset' ? (
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage('');
                    setSuccessMessage('');
                    setStep('form');
                    setAuthMode('signin');
                  }}
                  className="text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 font-medium transition-colors"
                >
                  Back to Sign In
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage('');
                    setSuccessMessage('');
                    setStep('form');
                    setAuthMode(authMode === 'signup' ? 'signin' : 'signup');
                  }}
                  className="text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 font-medium transition-colors"
                >
                  {authMode === 'signup'
                    ? 'Already registered? Click to Sign In'
                    : "Don't have an account? Sign Up for full access"}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
