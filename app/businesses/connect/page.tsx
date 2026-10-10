'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, Building2, Send, CheckCircle2, Paperclip, ShieldCheck, Mail, User, Briefcase, MessageSquare, Sparkles, Handshake, MailCheck, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { db, auth, handleFirestoreError } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { generateSenderConfirmationEmail, generateTargetBusinessNotificationEmail, B2BProposalData } from '@/app/lib/gmail-templates';

function ConnectFormContent() {
  const searchParams = useSearchParams();

  const companyParam = searchParams?.get('company') || '';
  const titleParam = searchParams?.get('title') || '';
  const typeParam = searchParams?.get('type') || '';

  const [companyName, setCompanyName] = useState(companyParam || 'Global Trade Alliances Ltd.');
  const [opportunityTitle, setOpportunityTitle] = useState(titleParam || 'Strategic Growth Connection');
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [senderCompany, setSenderCompany] = useState('');
  const [senderRole, setSenderRole] = useState('');
  const [connectionGoal, setConnectionGoal] = useState('Joint Venture & Strategic Partnership');
  const [proposalMessage, setProposalMessage] = useState('');
  const [contactPreference, setContactPreference] = useState('Email & Video Call');
  const [attachedFile, setAttachedFile] = useState<{ name: string } | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Firebase Auth State
  const [user, setUser] = useState<any>(null);
  const [isSendingEmails, setIsSendingEmails] = useState(false);
  const [emailStatus, setEmailStatus] = useState<{
    sentToSender: boolean;
    sentToBusiness: boolean;
    error?: string;
  }>({ sentToSender: false, sentToBusiness: false });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user?.email && !senderEmail) {
        setSenderEmail(user.email);
      }
      if (user?.displayName && !senderName) {
        setSenderName(user.displayName);
      }
    });
    return () => unsubscribe();
  }, [senderEmail, senderName]);

  const handleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') {
        console.warn('Sign in popup closed or cancelled by user:', err?.code);
      } else {
        console.error('Failed to sign in:', err);
      }
    }
  };

  const dispatchFirebaseEmails = async () => {
    if (!user) return;

    setIsSendingEmails(true);
    setEmailStatus({ sentToSender: false, sentToBusiness: false });

    const businessTargetEmail = searchParams?.get('email') || senderEmail;
    const referenceId = `FN-B2B-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      // 1. Create tracking record for the business notification email
      const trackingDoc = await addDoc(collection(db, 'email_tracking'), {
        id: referenceId,
        emailType: 'b2b_connection_request',
        recipientEmail: businessTargetEmail,
        senderId: user.uid,
        createdAt: serverTimestamp(),
        metadata: {
          companyName,
          opportunityTitle,
          senderCompany
        }
      });

      const trackingId = trackingDoc.id;

      const proposalData: B2BProposalData = {
        companyName,
        opportunityTitle,
        senderName: senderName || 'Valued Partner',
        senderEmail,
        senderCompany,
        senderRole,
        connectionGoal,
        proposalMessage,
        contactPreference,
        attachedFileName: attachedFile?.name,
        referenceId,
        trackingId
      };

      const senderHtml = generateSenderConfirmationEmail(proposalData);
      const businessHtml = generateTargetBusinessNotificationEmail(proposalData);

      // 2. Trigger emails via Firestore mail collection (Trigger Email extension)
      // Send confirmation email to Sender
      await addDoc(collection(db, 'mail'), {
        to: senderEmail,
        message: {
          subject: `Proposal Confirmation: Your request to ${companyName} has been received`,
          html: senderHtml,
        },
        userId: user.uid,
        createdAt: serverTimestamp(),
      });

      // Send notification email to Target Business
      await addDoc(collection(db, 'mail'), {
        to: businessTargetEmail,
        message: {
          subject: `New Incoming B2B Proposal from ${senderCompany || senderName || 'a Partner'}`,
          html: businessHtml,
        },
        userId: user.uid,
        createdAt: serverTimestamp(),
      });

      setEmailStatus({
        sentToSender: true,
        sentToBusiness: true
      });
    } catch (err: any) {
      console.error('Error triggering emails:', err);
      const errorMessage = err?.message || 'Failed to trigger emails';
      setEmailStatus((prev) => ({ ...prev, error: errorMessage }));
    } finally {
      setIsSendingEmails(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile({ name: file.name });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      await handleSignIn();
      return;
    }
    
    setIsSubmitted(true);
    await dispatchFirebaseEmails();
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <div className="mb-6">
        <Link 
          href="/businesses" 
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-secondary text-foreground text-xs font-semibold hover:bg-secondary/80 transition-colors border border-border"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Business Hub</span>
        </Link>
      </div>

      <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        {/* Header section */}
        <div className="border-b border-border pb-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2">
              <Handshake className="w-3.5 h-3.5" /> Direct Business Connection
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-foreground">
              Connect with {companyName}
            </h1>
            {opportunityTitle && (
              <p className="text-muted-foreground text-sm mt-1">
                Regarding: <span className="font-semibold text-foreground">{opportunityTitle}</span> {typeParam && `(${typeParam})`}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-2xl text-xs font-semibold">
                <MailCheck className="w-4 h-4 text-blue-500" />
                <span>Verified Account ({user.email || 'Google User'})</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleSignIn}
                className="flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-foreground px-3.5 py-1.5 rounded-2xl border border-border text-xs font-semibold transition-colors cursor-pointer"
              >
                <Mail className="w-4 h-4 text-blue-500" />
                <span>Sign in with Google to Connect</span>
              </button>
            )}
            <div className="flex items-center gap-2 bg-secondary/80 px-3.5 py-1.5 rounded-2xl border border-border text-xs font-medium text-muted-foreground shrink-0">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Encrypted B2B Alliance Portal</span>
            </div>
          </div>
        </div>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-6 max-w-lg mx-auto">
            <div className="w-20 h-20 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-500/5">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-display font-bold text-foreground">Connection Request Sent!</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Your B2B proposal and contact credentials have been transmitted directly to the executive board at <span className="font-semibold text-foreground">{companyName}</span>.
              </p>
            </div>

            {/* Firebase Automated Dispatch Status Card */}
            <div className="bg-card border border-border rounded-2xl p-5 text-left text-xs space-y-3 shadow-sm">
              <div className="flex items-center justify-between border-b border-border pb-2.5">
                <div className="flex items-center gap-2 text-foreground font-bold text-sm">
                  <MailCheck className="w-4 h-4 text-blue-500" />
                  <span>Firebase Automated Email Dispatch</span>
                </div>
                {isSendingEmails && (
                  <div className="flex items-center gap-1.5 text-blue-500 text-xs font-semibold">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Queuing via Firestore...</span>
                  </div>
                )}
              </div>

              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-secondary/50 border border-border">
                  <div className="space-y-0.5">
                    <p className="font-semibold text-foreground">1. Sender Confirmation Email</p>
                    <p className="text-[11px] text-muted-foreground">Confirmation sent to {senderEmail || 'Sender'}</p>
                  </div>
                  {emailStatus.sentToSender ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[11px] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Queued in Firestore
                    </span>
                  ) : isSendingEmails ? (
                    <span className="text-muted-foreground text-[11px]">Queuing...</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => dispatchFirebaseEmails()}
                      className="px-2.5 py-1 rounded-lg bg-blue-600 text-white text-[11px] font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Retry Dispatch
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-secondary/50 border border-border">
                  <div className="space-y-0.5">
                    <p className="font-semibold text-foreground">2. Business Notification Email</p>
                    <p className="text-[11px] text-muted-foreground">Notification sent to executive team at {companyName}</p>
                    <div className="mt-1 flex items-center gap-1.5 text-[10px] text-blue-600 font-medium bg-blue-50 p-1 px-1.5 rounded-md border border-blue-100 w-fit">
                      <Mail className="w-3 h-3" /> Tracking Pixel Enabled
                    </div>
                  </div>
                  {emailStatus.sentToBusiness ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[11px] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Queued in Firestore
                    </span>
                  ) : isSendingEmails ? (
                    <span className="text-muted-foreground text-[11px]">Queuing...</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => dispatchFirebaseEmails()}
                      className="px-2.5 py-1 rounded-lg bg-blue-600 text-white text-[11px] font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Retry Dispatch
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-secondary/50 border border-border rounded-2xl p-4 text-left text-xs space-y-2 text-muted-foreground">
              <div className="flex justify-between">
                <span className="font-semibold text-foreground">Target Organization:</span>
                <span>{companyName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-foreground">Contact Email:</span>
                <span>{senderEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-foreground">Primary Goal:</span>
                <span>{connectionGoal}</span>
              </div>
              {attachedFile && (
                <div className="flex justify-between">
                  <span className="font-semibold text-foreground">Attached Document:</span>
                  <span className="text-primary font-medium">{attachedFile.name}</span>
                </div>
              )}
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <Link 
                href="/businesses"
                className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors inline-flex items-center justify-center gap-2 shadow-sm"
              >
                Return to Business Hub
              </Link>
              <button
                onClick={() => setIsSubmitted(false)}
                className="bg-secondary hover:bg-secondary/80 text-foreground px-6 py-3 rounded-xl font-semibold text-sm transition-colors cursor-pointer"
              >
                Send Another Proposal
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Target Business Info */}
            <div className="bg-secondary/40 border border-border/80 rounded-2xl p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Target Business Name
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3.5" />
                  <input 
                    type="text" 
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Company or Organization Name"
                    className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Opportunity / Subject
                </label>
                <div className="relative">
                  <Sparkles className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3.5" />
                  <input 
                    type="text" 
                    required
                    value={opportunityTitle}
                    onChange={(e) => setOpportunityTitle(e.target.value)}
                    placeholder="e.g. OEM Supply Contract / Joint Venture"
                    className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
            </div>

            {/* Sender Contact Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground pt-2">
                Your Commercial Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3.5" />
                    <input 
                      type="text" 
                      required
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full bg-secondary/50 border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Business Email *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3.5" />
                    <input 
                      type="email" 
                      required
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      placeholder="sarah@yourcompany.com"
                      className="w-full bg-secondary/50 border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Your Company / Organization *</label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3.5" />
                    <input 
                      type="text" 
                      required
                      value={senderCompany}
                      onChange={(e) => setSenderCompany(e.target.value)}
                      placeholder="e.g. Apex Industrial Solutions"
                      className="w-full bg-secondary/50 border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Your Role / Title</label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3.5" />
                    <input 
                      type="text" 
                      value={senderRole}
                      onChange={(e) => setSenderRole(e.target.value)}
                      placeholder="e.g. Head of Procurement / Founder"
                      className="w-full bg-secondary/50 border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Connection Goal & Details */}
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Connection Goal</label>
                  <select
                    value={connectionGoal}
                    onChange={(e) => setConnectionGoal(e.target.value)}
                    className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="Joint Venture & Strategic Partnership">Joint Venture & Strategic Partnership</option>
                    <option value="Supplier Procurement Contract">Supplier Procurement Contract</option>
                    <option value="B2B Commercial Demand RFP">B2B Commercial Demand RFP</option>
                    <option value="Co-Distribution & Market Expansion">Co-Distribution & Market Expansion</option>
                    <option value="Direct Executive Discussion">Direct Executive Discussion</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Preferred Contact Method</label>
                  <select
                    value={contactPreference}
                    onChange={(e) => setContactPreference(e.target.value)}
                    className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="Email & Video Call">Email & Scheduled Video Call</option>
                    <option value="Direct Phone Call">Direct Phone Call</option>
                    <option value="In-Person Meeting">In-Person Meeting</option>
                    <option value="Platform Direct Messaging">Platform Direct Messaging</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Introductory Note / Executive Summary *
                </label>
                <div className="relative">
                  <MessageSquare className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3.5" />
                  <textarea 
                    rows={5}
                    required
                    value={proposalMessage}
                    onChange={(e) => setProposalMessage(e.target.value)}
                    placeholder="Outline your commercial proposal, capabilities, or synergy requirements..."
                    className="w-full bg-secondary/50 border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  />
                </div>
              </div>

              {/* Deck / File Upload */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Attach Pitch Deck / Spec Sheet (Optional)
                </label>
                <div className="border border-dashed border-border rounded-xl p-4 bg-secondary/30 hover:bg-secondary/50 transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Paperclip className="w-4 h-4" />
                    </div>
                    <div>
                      {attachedFile ? (
                        <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> {attachedFile.name}
                        </p>
                      ) : (
                        <>
                          <p className="text-xs font-medium text-foreground">Upload proposal document or pitch presentation</p>
                          <p className="text-[10px] text-muted-foreground">PDF, PPTX, or DOCX up to 20MB</p>
                        </>
                      )}
                    </div>
                  </div>

                  <input 
                    type="file" 
                    id="connect-deck-file"
                    className="hidden" 
                    accept=".pdf,.pptx,.docx"
                    onChange={handleFileUpload}
                  />
                  <label 
                    htmlFor="connect-deck-file"
                    className="px-3 py-1.5 rounded-lg bg-background border border-border text-xs font-semibold text-foreground hover:bg-muted cursor-pointer transition-colors"
                  >
                    {attachedFile ? 'Change File' : 'Browse File'}
                  </label>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-border flex flex-col sm:flex-row gap-3">
              <Link
                href="/businesses"
                className="w-full sm:w-1/3 bg-secondary hover:bg-secondary/80 text-foreground py-3 rounded-xl font-semibold text-sm transition-colors text-center cursor-pointer"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="w-full sm:w-2/3 bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-xl font-semibold text-sm transition-colors cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Transmit Connection Request</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function BusinessConnectPage() {
  return (
    <div className="min-h-screen bg-background w-full">
      <Suspense fallback={
        <div className="min-h-screen bg-background flex items-center justify-center p-6 text-sm text-muted-foreground">
          Loading connection portal...
        </div>
      }>
        <ConnectFormContent />
      </Suspense>
    </div>
  );
}
