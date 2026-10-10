'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { User, Building, ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import joburgSkylineHero from '@/src/assets/images/johannesburg_skyline_hero_1785131432771.jpg';
import { auth, db } from '@/lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile 
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function AuthPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [regType, setRegType] = useState<'personal' | 'business'>('personal');

  // Input bindings
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update profile
      await updateProfile(user, { displayName: `${firstName} ${lastName}` });

      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: `${firstName} ${lastName}`.trim(),
        email: email,
        username: username.trim(),
        regType,
        createdAt: new Date().toISOString(),
      });

      router.push(`/onboarding?type=${regType}`);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 sm:p-8">
      {/* Visual Brand Background (Subtle) */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-5 dark:opacity-10">
        <Image
          src={joburgSkylineHero}
          alt=""
          fill
          className="object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>

      <div className="w-full max-w-[480px] relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-3 mb-4 group transition-transform active:scale-95" aria-label="Home">
            <div className="w-12 h-12 flex items-center justify-center overflow-hidden">
              <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M 25 25 L 47.5 25 L 42.5 35 L 37.5 35 L 41.5 43 L 47.5 43 L 45.5 51 L 50 75 Z" className="fill-foreground" />
                <path d="M 52.5 25 L 75 25 L 58 59 L 50 59 L 61 37 L 52.5 37 Z" fill="#ef4444" />
              </svg>
            </div>
            <span className="text-3xl font-display font-bold text-foreground tracking-tighter">futurenomix</span>
          </Link>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1">
              {activeTab === 'login' ? 'Welcome back' : 'Create an account'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {activeTab === 'login' 
                ? 'Enter your credentials to access your professional network.' 
                : 'Join the community to unlock strategic partnerships.'}
            </p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-xl p-6 sm:p-10">
          <div className="flex bg-secondary/60 p-1 rounded-xl mb-8 shadow-sm">
            <button
              onClick={() => setActiveTab('login')}
              className={cn(
                "flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200",
                activeTab === 'login' 
                  ? "bg-background text-foreground shadow-xs" 
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
              )}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={cn(
                "flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200",
                activeTab === 'register' 
                  ? "bg-background text-foreground shadow-xs" 
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
              )}
            >
              Sign Up
            </button>
          </div>
          
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <div className="transition-all duration-300">
            {activeTab === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="email-login" className="text-sm font-semibold text-foreground">Email</label>
                  <input 
                    id="email-login" 
                    type="email" 
                    placeholder="name@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password-login" className="text-sm font-semibold text-foreground">Password</label>
                    <a href="#" className="text-sm font-medium text-red-600 hover:text-red-500 transition-colors">Forgot password?</a>
                  </div>
                  <input 
                    id="password-login" 
                    type="password" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold px-4 py-4 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all mt-6 shadow-sm"
                >
                  Sign In
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground">Account Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRegType('personal')}
                      className={cn(
                        "flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-semibold transition-all",
                        regType === 'personal'
                          ? "bg-red-50 border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/30 dark:text-red-400 shadow-xs"
                          : "bg-background border-border text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                      )}
                    >
                      <User className="w-4 h-4" />
                      Personal
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegType('business')}
                      className={cn(
                        "flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-semibold transition-all",
                        regType === 'business'
                          ? "bg-red-50 border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/30 dark:text-red-400 shadow-xs"
                          : "bg-background border-border text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                      )}
                    >
                      <Building className="w-4 h-4" />
                      Business
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-semibold text-foreground">First name</label>
                    <input 
                      id="firstName" 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Jane"
                      required 
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-semibold text-foreground">Last name</label>
                    <input 
                      id="lastName" 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      required 
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="username" className="text-sm font-semibold text-foreground">Username</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3.5 text-muted-foreground font-mono text-sm">@</span>
                    <input 
                      id="username" 
                      placeholder="janedoe" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                      required 
                      className="w-full bg-background border border-border rounded-xl pl-8 pr-4 py-3 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all font-mono text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email-register" className="text-sm font-semibold text-foreground">Email</label>
                  <input 
                    id="email-register" 
                    type="email" 
                    placeholder="name@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password-register" className="text-sm font-semibold text-foreground">Password</label>
                  <input 
                    id="password-register" 
                    type="password" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold px-4 py-4 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all mt-6 shadow-sm flex items-center justify-center gap-2 group"
                >
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </form>
            )}
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground/80 leading-relaxed">
              By continuing, you agree to Futurenomix&apos;s <a href="#" className="underline hover:text-foreground transition-colors">Terms of Service</a> and <a href="#" className="underline hover:text-foreground transition-colors">Privacy Policy</a>.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
           <button
             onClick={() => router.back()}
             className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 mx-auto"
           >
             <ArrowLeft className="w-4 h-4" />
             Back to previous page
           </button>
        </div>
      </div>
    </div>
  );
}
