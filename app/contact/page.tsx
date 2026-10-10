"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { db, auth, handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowLeft, 
  Send, 
  CheckCircle2, 
  Globe2, 
  Clock, 
  HelpCircle,
  MessageSquare,
  Loader2,
  LogIn,
  ShieldCheck
} from 'lucide-react';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { motion } from 'motion/react';

declare global {
  interface Window {
    google: any;
  }
}

export default function ContactDirectoryPage() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', subject: 'general', message: '' });
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') {
        console.warn('Sign in popup closed or cancelled by user:', err?.code);
        setError('Sign-in cancelled.');
      } else {
        console.error('Sign in error:', err);
        setError('Failed to sign in. Please try again.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    
    if (!user) {
      setError('Please sign in with Google to submit your inquiry.');
      return;
    }
    
    setSending(true);
    setError(null);

    const targetEmail = directoryContacts.find(c => 
      c.department.toLowerCase().includes(form.subject)
    )?.email || 'support@futurenomix.com';

    const path = 'mail';
    try {
      await addDoc(collection(db, path), {
        to: targetEmail,
        userId: user.uid,
        message: {
          subject: `[Inquiry] ${form.subject.toUpperCase()} - ${form.name}`,
          text: form.message,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
              <h2 style="color: #0f172a; margin-top: 0;">New Inquiry Received</h2>
              <p style="color: #64748b; font-size: 14px;">A new message has been submitted via the Futurenomix Contact Directory.</p>
              
              <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Name:</strong> ${form.name}</p>
                <p style="margin: 5px 0;"><strong>Email:</strong> ${form.email}</p>
                <p style="margin: 5px 0;"><strong>Subject:</strong> ${form.subject}</p>
              </div>

              <div style="margin: 20px 0;">
                <p style="font-weight: bold; color: #0f172a; margin-bottom: 5px;">Message:</p>
                <p style="color: #334155; line-height: 1.5; white-space: pre-wrap;">${form.message}</p>
              </div>
              
              <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
              <p style="color: #94a3b8; font-size: 11px; text-align: center;">This is an automated notification from the Futurenomix Ecosystem Hub.</p>
            </div>
          `
        },
        createdAt: serverTimestamp()
      });
      setSubmitted(true);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    } finally {
      setSending(false);
    }
  };

  const directoryContacts = [
    {
      department: 'General Inquiries & Ecosystem Support',
      email: 'support@futurenomix.com',
      phone: '+27 (0) 11 482 9000',
      hours: 'Mon - Fri, 08:00 - 18:00 SAST',
      location: 'Johannesburg HQ'
    },
    {
      department: 'Investments & Capital Portal',
      email: 'capital@futurenomix.com',
      phone: '+27 (0) 11 482 9001',
      hours: 'Mon - Fri, 09:00 - 17:00 SAST',
      location: 'Sandton Financial District'
    },
    {
      department: 'Corporate Partnerships & B2B',
      email: 'partnerships@futurenomix.com',
      phone: '+27 (0) 21 400 1200',
      hours: 'Mon - Fri, 08:30 - 17:30 SAST',
      location: 'Cape Town Innovation Hub'
    },
    {
      department: 'Media & Press Relations',
      email: 'press@futurenomix.com',
      phone: '+44 20 7946 0912',
      hours: 'Mon - Fri, 09:00 - 18:00 GMT',
      location: 'London Regional Office'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-20 selection:bg-red-500/30">
      {/* Header Bar */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between transition-colors">
        <div className="flex items-center gap-3">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Home</span>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8">
            <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M 25 25 L 47.5 25 L 42.5 35 L 37.5 35 L 41.5 43 L 47.5 43 L 45.5 51 L 50 75 Z" className="fill-slate-900 dark:fill-white" />
              <path d="M 52.5 25 L 75 25 L 58 59 L 50 59 L 61 37 L 52.5 37 Z" fill="#ef4444" />
            </svg>
          </div>
          <span className="font-display font-bold text-xl text-slate-900 dark:text-white tracking-tighter uppercase">Support Portal</span>
        </div>
      </header>

      {/* Hero Header */}
      <div className="bg-slate-950 text-white py-24 px-6 overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 text-[10px] font-bold uppercase tracking-[0.2em] mb-8"
          >
            <Globe2 className="w-3.5 h-3.5" />
            <span>Global Strategic Support</span>
          </motion.div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tighter mb-6 leading-[1.1]">
            How can our ecosystem <br /> assist your vision?
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Reach out to our global regional offices, specialized department leads, or submit a secure authenticated inquiry directly to our priority support team.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-20">
        {/* Left Column: Directory Cards */}
        <div className="lg:col-span-7 space-y-10">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <Building2 className="w-6 h-6 text-red-500" />
              <span>Multi-Region Directory</span>
            </h2>
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>All Hubs Online</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {directoryContacts.map((contact, i) => (
              <div 
                key={i} 
                className="group bg-white dark:bg-slate-900/50 rounded-[2rem] p-6 sm:p-8 border border-slate-200 dark:border-slate-800 hover:border-red-500 dark:hover:border-red-500 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-red-500/5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg tracking-tight">{contact.department}</h3>
                  <span className="self-start text-[10px] font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 uppercase tracking-widest leading-none">
                    {contact.location}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Direct Channel</p>
                    <a href={`mailto:${contact.email}`} className="text-sm font-semibold text-slate-900 dark:text-slate-100 hover:text-red-500 transition-colors flex items-center gap-2">
                      <Mail className="w-4 h-4 text-red-500/50" />
                      {contact.email}
                    </a>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Regional Voice</p>
                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400" />
                      {contact.phone}
                    </div>
                  </div>
                  <div className="sm:col-span-2 pt-4 border-t border-slate-100 dark:border-slate-800 mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-xs text-slate-500">{contact.hours}</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowLeft className="w-4 h-4 text-red-500 rotate-180" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Secure Inquiry Form */}
        <div className="lg:col-span-5">
          <div className="sticky top-28">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-2xl dark:shadow-red-500/5 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <MessageSquare className="w-32 h-32 text-slate-900 dark:text-white" />
              </div>

              <div className="relative z-10">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Priority Inquiry.</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                  Authenticated members receive priority response times through our global strategic network.
                </p>

                {submitted ? (
                  <div className="py-12 text-center space-y-6">
                    <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Inquiry Transmitted</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                        Protocol received. A strategic representative will respond to your registered email shortly.
                      </p>
                    </div>
                    <button
                      onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: 'general', message: '' }); setError(null); }}
                      className="w-full py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      New Transmission
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        {error}
                      </div>
                    )}

                    {!user ? (
                      <div className="p-8 rounded-[2rem] bg-slate-50 dark:bg-slate-950/50 border-2 border-dashed border-slate-200 dark:border-slate-800 text-center space-y-6">
                        <div className="w-14 h-14 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto shadow-sm">
                          <ShieldCheck className="w-7 h-7 text-red-500" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-bold text-slate-900 dark:text-white">Secure Protocol Required</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                            Sign in with your verified Google identity to transmit a priority inquiry to our global hubs.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleSignIn}
                          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm active:scale-98"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                          </svg>
                          <span>Authenticate identity</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Identity Profile</label>
                            <input
                              type="text"
                              required
                              disabled={sending}
                              value={form.name}
                              onChange={(e) => setForm({ ...form, name: e.target.value })}
                              placeholder="Full Name"
                              className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Contact Reference</label>
                            <input
                              type="email"
                              required
                              disabled={sending}
                              value={form.email}
                              onChange={(e) => setForm({ ...form, email: e.target.value })}
                              placeholder="Professional Email"
                              className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Inquiry Protocol</label>
                            <select
                              value={form.subject}
                              disabled={sending}
                              onChange={(e) => setForm({ ...form, subject: e.target.value })}
                              className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all appearance-none cursor-pointer"
                            >
                              <option value="general">Global Strategic Support</option>
                              <option value="capital">Capital & Investment Portal</option>
                              <option value="business">Ecosystem Directory Listing</option>
                              <option value="technical">Protocol Infrastructure</option>
                            </select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Message Content</label>
                            <textarea
                              required
                              rows={5}
                              disabled={sending}
                              value={form.message}
                              onChange={(e) => setForm({ ...form, message: e.target.value })}
                              placeholder="Outline your strategic requirements..."
                              className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all resize-none"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={sending}
                          className="w-full py-5 rounded-[1.5rem] bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-black dark:hover:bg-slate-100 transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                          {sending ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              <span>Transmitting...</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              <span>Transmit Inquiry</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
