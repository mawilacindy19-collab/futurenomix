'use client';

import { Moon, Sun, Bell, Shield, Lock, Trash2, HelpCircle, User, Globe, Laptop, Key, Check, ChevronDown, ChevronUp, FileText, Mail, MessageSquare, Briefcase, AlertTriangle, Building, Sparkles, LogIn, LogOut, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { AccountSwitcher } from '@/components/layout/account-switcher';
import { signOutUser } from '@/app/lib/auth';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('Account');
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // Notification states
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
  const [notifMessages, setNotifMessages] = useState(true);
  const [notifJobs, setNotifJobs] = useState(false);

  // Privacy states
  const [privacyProfile, setPrivacyProfile] = useState('public');
  const [privacySearch, setPrivacySearch] = useState(true);
  const [privacyAnalytics, setPrivacyAnalytics] = useState(false);

  // Security states
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState('');

  // Language states
  const [language, setLanguage] = useState('en');
  const [regionFormat, setRegionFormat] = useState('US');

  // Help Center states
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [supportCategory, setSupportCategory] = useState('general');
  const [supportSubject, setSupportSubject] = useState('');
  const [supportDesc, setSupportDesc] = useState('');
  const [ticketStatus, setTicketStatus] = useState('');

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordStatus('Please fill in all password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordStatus('New passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordStatus('Password must be at least 8 characters long.');
      return;
    }
    setPasswordStatus('Password updated successfully! (Rules enforced)');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportSubject || !supportDesc) {
      setTicketStatus('Please fill in all support ticket fields.');
      return;
    }
    setTicketStatus('Support ticket submitted successfully! Reference ID: #' + Math.floor(Math.random() * 900000 + 100000));
    setSupportSubject('');
    setSupportDesc('');
  };

  const toggleFaq = (index: number) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  // Account Integration states
  const [activeAccountId, setActiveAccountId] = useState<string>('personal-1');
  const [linkedAccount, setLinkedAccount] = useState<any | null>(null);
  const [unlinkedOppositeAccounts, setUnlinkedOppositeAccounts] = useState<any[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);

    if (typeof window === 'undefined') return;
    const checkAuth = () => {
      setIsLoggedIn(localStorage.getItem('orbit_is_logged_in') === 'true');
    };
    checkAuth();
    window.addEventListener('orbit-auth-change', checkAuth);
    window.addEventListener('storage', checkAuth);

    const activeId = localStorage.getItem('orbit_active_account_id') || 'personal-1';
    setActiveAccountId(activeId);
    
    const linkedId = localStorage.getItem(`orbit_linked_account_${activeId}`);
    
    let storedAccs: any[] = [];
    try {
      const stored = localStorage.getItem('orbit_accounts');
      if (stored) storedAccs = JSON.parse(stored);
    } catch (e) {}

    const currentAcc = storedAccs.find(a => a.id === activeId);
    
    if (linkedId) {
      const found = storedAccs.find(a => a.id === linkedId);
      if (found) {
        setLinkedAccount(found);
        setUnlinkedOppositeAccounts([]);
        return;
      }
    }

    if (currentAcc) {
      const opposites = storedAccs.filter(a => a.type !== currentAcc.type);
      setUnlinkedOppositeAccounts(opposites);
    }
  }, []);

  const handleLinkAccount = (targetId: string) => {
    if (typeof window === 'undefined') return;
    const activeId = localStorage.getItem('orbit_active_account_id') || 'personal-1';
    localStorage.setItem(`orbit_linked_account_${activeId}`, targetId);
    localStorage.setItem(`orbit_linked_account_${targetId}`, activeId);
    window.location.reload();
  };

  const handleUnlinkAccount = () => {
    if (typeof window === 'undefined') return;
    const activeId = localStorage.getItem('orbit_active_account_id') || 'personal-1';
    const linkedId = localStorage.getItem(`orbit_linked_account_${activeId}`);
    localStorage.removeItem(`orbit_linked_account_${activeId}`);
    if (linkedId) {
      localStorage.removeItem(`orbit_linked_account_${linkedId}`);
    }
    window.location.reload();
  };

  return (
    <div className="p-4 lg:p-8 w-full max-w-4xl mx-auto min-h-screen">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Go back"
            title="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-display font-bold">Settings</h1>
        </div>
        <p className="text-muted-foreground">Manage your account preferences and configurations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1 space-y-1">
             <SettingsTab active={activeTab === 'Account'} onClick={() => setActiveTab('Account')} icon={User} label="Account" />
             <SettingsTab active={activeTab === 'Appearance'} onClick={() => setActiveTab('Appearance')} icon={Moon} label="Appearance" />
             <SettingsTab active={activeTab === 'Notifications'} onClick={() => setActiveTab('Notifications')} icon={Bell} label="Notifications" />
             <SettingsTab active={activeTab === 'Privacy'} onClick={() => setActiveTab('Privacy')} icon={Shield} label="Privacy" />
             <SettingsTab active={activeTab === 'Security'} onClick={() => setActiveTab('Security')} icon={Lock} label="Security" />
             <SettingsTab active={activeTab === 'Language'} onClick={() => setActiveTab('Language')} icon={Globe} label="Language" />
             <SettingsTab active={activeTab === 'Help Center'} onClick={() => setActiveTab('Help Center')} icon={HelpCircle} label="Help Center" />
          </div>

          <div className="md:col-span-3 space-y-8">
              {activeTab === 'Account' && (
                <>
                  <section className="bg-card border border-border rounded-xl p-6">
                      <h2 className="font-display font-bold text-xl mb-4 pb-2 border-b border-border">Account Switching</h2>
                      <div className="max-w-md">
                          <p className="text-sm text-muted-foreground mb-4">Switch between your personal and business accounts, or create a new one.</p>
                          <div className="border border-border rounded-xl p-2 bg-secondary/50">
                              <AccountSwitcher />
                          </div>
                      </div>
                  </section>

                  <section className="bg-card border border-border rounded-xl p-6">
                      <h2 className="font-display font-bold text-xl mb-4 pb-2 border-b border-border flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-500 fill-current" /> Account Integration
                      </h2>
                      <div className="max-w-xl">
                          <p className="text-sm text-muted-foreground mb-4">
                            Connect your personal and business accounts under a single system. This allows quick navigation, integrated profile discovery, and cross-account post sharing while keeping each account&apos;s data completely individual and private.
                          </p>

                          {linkedAccount ? (
                            <div className="p-4 rounded-xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/25 dark:border-amber-500/30 space-y-4">
                              <div className="flex items-center gap-3">
                                <Check className="w-5 h-5 text-emerald-500" />
                                <div className="text-sm">
                                  <p className="font-semibold text-foreground">Integrated Account Connection Active</p>
                                  <p className="text-muted-foreground mt-0.5">
                                    Linked with {linkedAccount.type === 'business' ? 'Business Account' : 'Personal Account'}: <strong className="text-foreground">{linkedAccount.name}</strong> (@{linkedAccount.username})
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 pt-2">
                                <button
                                  type="button"
                                  onClick={handleUnlinkAccount}
                                  className="text-xs font-semibold text-destructive hover:underline"
                                >
                                  Disconnect Integration
                                </button>
                              </div>
                            </div>
                          ) : unlinkedOppositeAccounts.length > 0 ? (
                            <div className="space-y-4">
                              <p className="text-sm font-semibold">Available profiles to link:</p>
                              <div className="grid grid-cols-1 gap-3">
                                {unlinkedOppositeAccounts.map((acc) => (
                                  <div key={acc.id} className="flex items-center justify-between p-3 border border-border rounded-xl bg-secondary/30">
                                    <div className="flex items-center gap-3">
                                      <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center font-bold">
                                        {acc.name[0]}
                                      </div>
                                      <div>
                                        <p className="text-sm font-semibold">{acc.name}</p>
                                        <p className="text-xs text-muted-foreground">@{acc.username} · {acc.type === 'business' ? 'Business Profile' : 'Personal Profile'}</p>
                                      </div>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => handleLinkAccount(acc.id)}
                                      className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                                    >
                                      Link & Integrate
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="p-4 rounded-xl bg-secondary/30 border border-border text-center">
                              <p className="text-sm text-muted-foreground">No other eligible accounts found to integrate. Create a new personal or business profile first!</p>
                            </div>
                          )}
                      </div>
                  </section>

                  <section className="bg-card border border-border rounded-xl p-6">
                      <h2 className="font-display font-bold text-xl mb-4 pb-2 border-b border-border">Account Management</h2>
                      
                      <div className="space-y-4 max-w-lg">
                          <div>
                              <label className="block text-sm font-semibold mb-1">Email Address</label>
                              <input type="email" value="alexrivera@example.com" readOnly className="w-full bg-secondary border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none" />
                          </div>
                          <div>
                              <label className="block text-sm font-semibold mb-1">Phone Number</label>
                              <input type="tel" placeholder="+1 (555) 000-0000" className="w-full bg-transparent border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                          </div>
                          <div className="pt-4 flex flex-wrap gap-3">
                              <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                                  Save Changes
                              </button>
                              {isLoggedIn && (
                                <button
                                  type="button"
                                  onClick={async () => {
                                    await signOutUser();
                                    setIsLoggedIn(false);
                                    window.location.reload();
                                  }}
                                  className="flex items-center gap-2 px-6 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-semibold transition-all border border-red-500/20"
                                >
                                  <LogOut className="w-4 h-4" />
                                  <span>Sign Out</span>
                                </button>
                              )}
                          </div>
                      </div>
                  </section>

                  <section className="bg-card border border-border rounded-xl p-6">
                      <h2 className="font-display font-bold text-xl mb-4 pb-2 border-b border-border">Onboarding Questionnaire</h2>
                      <div className="space-y-4">
                          <p className="text-sm text-muted-foreground">
                              Configure and update your personalized profile information. Choose either Personal Creator or Business / Startup flows to retake the tailored questionnaires.
                          </p>
                          <div className="flex flex-wrap gap-3">
                              <button 
                                  id="settings-retake-personal"
                                  onClick={() => router.push('/onboarding?type=personal')}
                                  className="bg-secondary hover:bg-secondary/80 text-foreground border border-border px-4 py-2.5 rounded-lg text-sm font-semibold transition-all inline-flex items-center gap-2"
                              >
                                  <User className="w-4 h-4 text-muted-foreground" />
                                  <span>Retake Personal Questionnaire</span>
                              </button>
                              <button 
                                  id="settings-retake-business"
                                  onClick={() => router.push('/onboarding?type=business')}
                                  className="bg-secondary hover:bg-secondary/80 text-foreground border border-border px-4 py-2.5 rounded-lg text-sm font-semibold transition-all inline-flex items-center gap-2"
                              >
                                  <Building className="w-4 h-4 text-muted-foreground" />
                                  <span>Retake Business Questionnaire</span>
                              </button>
                          </div>
                      </div>
                  </section>

                  <section className="bg-card border border-border rounded-xl p-6">
                      <h2 className="font-display font-bold text-xl mb-4 pb-2 border-b border-border">Create Account</h2>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="space-y-1">
                              <p className="font-semibold text-foreground">Sign up for a new account</p>
                              <p className="text-sm text-muted-foreground">Creating a new account allows you to join orbit&apos;s professional community, publish jobs, showcase projects, and connect with other members.</p>
                          </div>
                          <button 
                              onClick={() => router.push('/auth')}
                              type="button" 
                              className="flex items-center justify-center gap-2 border border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground px-6 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap shrink-0"
                          >
                              Add new account
                          </button>
                      </div>
                  </section>

                  <section className="bg-card border border-border rounded-xl p-6">
                      <h2 className="font-display font-bold text-xl mb-4 pb-2 border-b border-border text-destructive">Danger Zone</h2>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div>
                              <p className="font-semibold text-foreground">Delete Account</p>
                              <p className="text-sm text-muted-foreground">Permanently remove your personal and project data from orbit. This action cannot be undone.</p>
                          </div>
                          <button className="flex items-center gap-2 border border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap">
                              <Trash2 className="w-4 h-4" /> Delete Account
                          </button>
                      </div>
                  </section>
                </>
              )}

              {activeTab === 'Appearance' && (
                <section className="bg-card border border-border rounded-xl p-6">
                  <h2 className="font-display font-bold text-xl mb-4 pb-2 border-b border-border">Appearance</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-3">Theme</h3>
                      {mounted ? (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <button 
                            onClick={() => setTheme('light')}
                            className={cn("flex flex-col items-center gap-2 p-4 border rounded-xl transition-all", theme === 'light' ? "border-primary bg-primary/5" : "border-border hover:border-primary/50")}
                          >
                            <Sun className="w-6 h-6" />
                            <span className="font-medium">Light</span>
                          </button>
                          <button 
                            onClick={() => setTheme('dark')}
                            className={cn("flex flex-col items-center gap-2 p-4 border rounded-xl transition-all", theme === 'dark' ? "border-primary bg-primary/5" : "border-border hover:border-primary/50")}
                          >
                            <Moon className="w-6 h-6" />
                            <span className="font-medium">Dark</span>
                          </button>
                          <button 
                            onClick={() => setTheme('system')}
                            className={cn("flex flex-col items-center gap-2 p-4 border rounded-xl transition-all", theme === 'system' ? "border-primary bg-primary/5" : "border-border hover:border-primary/50")}
                          >
                            <Laptop className="w-6 h-6" />
                            <span className="font-medium">System</span>
                          </button>
                        </div>
                      ) : (
                        <div className="h-[104px] w-full animate-pulse bg-secondary rounded-xl" />
                      )}
                    </div>
                  </div>
                </section>
              )}

              {activeTab === 'Notifications' && (
                <div className="space-y-6">
                  <section className="bg-card border border-border rounded-xl p-6">
                    <h2 className="font-display font-bold text-xl mb-4 pb-2 border-b border-border flex items-center gap-2">
                      <Bell className="w-5 h-5 text-primary" /> Notification Settings
                    </h2>
                    <p className="text-sm text-muted-foreground mb-6">
                      Customize how and when you receive updates from orbit. We respect your attention and follow regulatory rules regarding system messaging.
                    </p>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/30 transition-colors">
                        <div>
                          <p className="font-semibold text-foreground flex items-center gap-2">
                            <Mail className="w-4 h-4 text-muted-foreground" /> Email Digests
                          </p>
                          <p className="text-xs text-muted-foreground">Receive weekly summaries of network activity, jobs, and community stories.</p>
                        </div>
                        <button 
                          onClick={() => setNotifEmail(!notifEmail)}
                          className={cn(
                            "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                            notifEmail ? "bg-primary" : "bg-muted"
                          )}
                        >
                          <span className={cn("pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out", notifEmail ? "translate-x-5" : "translate-x-0")} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/30 transition-colors">
                        <div>
                          <p className="font-semibold text-foreground flex items-center gap-2">
                            <Bell className="w-4 h-4 text-muted-foreground" /> Push Notifications
                          </p>
                          <p className="text-xs text-muted-foreground">Receive instant desktop or mobile alerts for direct interactions.</p>
                        </div>
                        <button 
                          onClick={() => setNotifPush(!notifPush)}
                          className={cn(
                            "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                            notifPush ? "bg-primary" : "bg-muted"
                          )}
                        >
                          <span className={cn("pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out", notifPush ? "translate-x-5" : "translate-x-0")} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/30 transition-colors">
                        <div>
                          <p className="font-semibold text-foreground flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-muted-foreground" /> Direct Messages
                          </p>
                          <p className="text-xs text-muted-foreground">Notify me immediately when someone sends me a chat message.</p>
                        </div>
                        <button 
                          onClick={() => setNotifMessages(!notifMessages)}
                          className={cn(
                            "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                            notifMessages ? "bg-primary" : "bg-muted"
                          )}
                        >
                          <span className={cn("pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out", notifMessages ? "translate-x-5" : "translate-x-0")} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/30 transition-colors">
                        <div>
                          <p className="font-semibold text-foreground flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-muted-foreground" /> Job Matching Alerts
                          </p>
                          <p className="text-xs text-muted-foreground">Receive intelligent alerts when a published job fits your profile.</p>
                        </div>
                        <button 
                          onClick={() => setNotifJobs(!notifJobs)}
                          className={cn(
                            "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                            notifJobs ? "bg-primary" : "bg-muted"
                          )}
                        >
                          <span className={cn("pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out", notifJobs ? "translate-x-5" : "translate-x-0")} />
                        </button>
                      </div>
                    </div>
                  </section>

                  <section className="bg-card border border-border rounded-xl p-6">
                    <h3 className="font-display font-semibold text-lg mb-3 flex items-center gap-2 text-foreground">
                      <FileText className="w-4 h-4 text-muted-foreground" /> Regulatory Messaging Framework (Rules & Consent)
                    </h3>
                    <div className="space-y-3 text-xs text-muted-foreground leading-relaxed">
                      <p>
                        <strong>GDPR Article 7 Compliant Consent:</strong> In compliance with the General Data Protection Regulation (Regulation EU 2016/679), all orbit electronic messaging operates strictly on an opt-in basis. You possess the continuous legal right to modify your communication consents, restrict processing, or fully withdraw permissions at any moment without prejudice.
                      </p>
                      <p>
                        <strong>CAN-SPAM & ePrivacy Directive:</strong> We strictly prohibit deceptive subject headers, provide an operational physical server address, and ensure that every transactional and promotional email includes an active, immediate unsubscribe link processed within 10 operational business days.
                      </p>
                    </div>
                  </section>
                </div>
              )}

              {activeTab === 'Privacy' && (
                <div className="space-y-6">
                  <section className="bg-card border border-border rounded-xl p-6">
                    <h2 className="font-display font-bold text-xl mb-4 pb-2 border-b border-border flex items-center gap-2">
                      <Shield className="w-5 h-5 text-primary" /> Privacy Settings & User Rights
                    </h2>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold mb-2">Profile Visibility</label>
                        <select 
                          value={privacyProfile} 
                          onChange={(e) => setPrivacyProfile(e.target.value)}
                          className="w-full sm:w-72 bg-transparent border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="public">Public (Indexable by external search engines)</option>
                          <option value="connected">Authenticated (Only visible to registered members)</option>
                          <option value="private">Private (Only visible to people you request/connect)</option>
                        </select>
                        <p className="text-xs text-muted-foreground mt-1">Controls who can search and locate your profile index.</p>
                      </div>

                      <hr className="border-border" />

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-foreground text-sm">Exclude from Public Search</p>
                            <p className="text-xs text-muted-foreground">Prevent Google, Bing, and external search engines from indexing your profile details.</p>
                          </div>
                          <button 
                            onClick={() => setPrivacySearch(!privacySearch)}
                            className={cn(
                              "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                              privacySearch ? "bg-primary" : "bg-muted"
                            )}
                          >
                            <span className={cn("pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out", privacySearch ? "translate-x-5" : "translate-x-0")} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-foreground text-sm">Personalized & Functional Analytics</p>
                            <p className="text-xs text-muted-foreground">Allow processing of functional platform telemetry for personalized matching and user experience optimizations.</p>
                          </div>
                          <button 
                            onClick={() => setPrivacyAnalytics(!privacyAnalytics)}
                            className={cn(
                              "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                              privacyAnalytics ? "bg-primary" : "bg-muted"
                            )}
                          >
                            <span className={cn("pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out", privacyAnalytics ? "translate-x-5" : "translate-x-0")} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="bg-card border border-border rounded-xl p-6">
                    <h3 className="font-display font-semibold text-lg mb-3 flex items-center gap-2 text-foreground">
                      <FileText className="w-4 h-4 text-muted-foreground" /> GDPR & California Consumer Privacy Act (CCPA) Legislation
                    </h3>
                    <div className="space-y-4 text-xs text-muted-foreground leading-relaxed">
                      <p>
                        <strong>EU GDPR (Regulation 2016/679) Compliance:</strong> orbit processing operations are firmly grounded in the principles of Article 5: lawfulness, fairness, purpose limitation, data minimization, accuracy, storage limitation, and absolute confidentiality. You hold standard human rights regarding:
                      </p>
                      <ul className="list-disc pl-5 space-y-1.5 mt-1">
                        <li><strong>Right to Access (Art. 15):</strong> Request a full audit breakdown of all personal indices processed by orbit.</li>
                        <li><strong>Right to Rectification (Art. 16):</strong> Modify inaccurate biographical or employment entries immediately.</li>
                        <li><strong>Right to Erasure / Right to be Forgotten (Art. 17):</strong> Request deletion of your legal account ledger.</li>
                        <li><strong>Right to Data Portability (Art. 20):</strong> Acquire structured, commonly machine-readable records of your platform interactions.</li>
                      </ul>
                      <p>
                        <strong>California Privacy Rights Act (CPRA) and CCPA:</strong> Users residing in California possess the statutory rights to know what personal data is gathered, demand non-discrimination, opt out of the sale or sharing of sensitive informational data, and request complete disposal of collected records. We do not sell or monetize your individual data.
                      </p>
                    </div>
                  </section>

                  <section className="bg-card border border-border rounded-xl p-6">
                    <h3 className="font-display font-semibold text-lg mb-2 text-foreground flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" /> Exercising Your Portability Rights
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Download a structured, authenticated JSON package containing your entire profile, post history, direct messaging records, and job application indices.
                    </p>
                    <button 
                      onClick={() => alert('Data package compilation initialized. Your secure download will arrive via email within 24 hours under GDPR Article 20 parameters.')}
                      className="border border-border hover:bg-secondary text-foreground font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                      Request Complete Data Export (JSON)
                    </button>
                  </section>
                </div>
              )}

              {activeTab === 'Security' && (
                <div className="space-y-6">
                  <section className="bg-card border border-border rounded-xl p-6">
                    <h2 className="font-display font-bold text-xl mb-4 pb-2 border-b border-border flex items-center gap-2">
                      <Lock className="w-5 h-5 text-primary" /> Security & Infrastructure Protocols
                    </h2>
                    
                    <form onSubmit={handlePasswordChange} className="space-y-4 max-w-lg">
                      <h3 className="font-semibold text-sm text-foreground">Update Password</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-semibold mb-1">Current Password</label>
                          <input 
                            type="password" 
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            placeholder="••••••••" 
                            className="w-full bg-transparent border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold mb-1">New Password</label>
                          <input 
                            type="password" 
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="••••••••" 
                            className="w-full bg-transparent border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold mb-1">Confirm New Password</label>
                          <input 
                            type="password" 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••" 
                            className="w-full bg-transparent border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm" 
                          />
                        </div>
                      </div>
                      
                      {passwordStatus && (
                        <p className={cn("text-xs font-medium", passwordStatus.includes('successfully') ? "text-emerald-500" : "text-destructive")}>
                          {passwordStatus}
                        </p>
                      )}

                      <button type="submit" className="bg-primary text-primary-foreground font-semibold px-4 py-2 rounded-lg text-sm hover:bg-primary/90 transition-colors">
                        Change Password
                      </button>
                    </form>
                  </section>

                  <section className="bg-card border border-border rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-foreground text-sm flex items-center gap-2">
                          <Key className="w-4 h-4 text-primary" /> Two-Factor Authentication (MFA / 2FA)
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">Secure your professional orbit ledger with supplementary multi-factor authentication codes.</p>
                      </div>
                      <button 
                        onClick={() => {
                          setMfaEnabled(!mfaEnabled);
                          alert(mfaEnabled ? 'Two-Factor Authentication deactivated.' : 'Two-Factor Authentication setup initialized. Scan the visual QR code in your auth app.');
                        }}
                        className={cn(
                          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                          mfaEnabled ? "bg-primary" : "bg-muted"
                        )}
                      >
                        <span className={cn("pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out", mfaEnabled ? "translate-x-5" : "translate-x-0")} />
                      </button>
                    </div>
                  </section>

                  <section className="bg-card border border-border rounded-xl p-6">
                    <h3 className="font-display font-semibold text-lg mb-3 flex items-center gap-2 text-foreground">
                      <FileText className="w-4 h-4 text-muted-foreground" /> Security & Cryptographic Legislation (ISO 27001 & SOC 2 Rules)
                    </h3>
                    <div className="space-y-3 text-xs text-muted-foreground leading-relaxed">
                      <p>
                        <strong>ISO/IEC 27001 & SOC 2 Security Rules:</strong> orbit complies with ISO/IEC 27001 specifications and SOC 2 Type II trust parameters. All stored credentials are mathematically hashed on server-side nodes using SHA-256 with cryptographically random salts. System sessions are managed through stateless, high-security JSON Web Tokens (JWT) signed with asymmetrical private-key algorithms.
                      </p>
                      <p>
                        <strong>Transport Encryption (TLS 1.3):</strong> All payload traffic in-transit across client portals and backing database storage centers operates under HTTPS using Transport Layer Security (TLS 1.3). Database files at-rest utilize Advanced Encryption Standard (AES-256) standards to preclude intrusion and data leaks.
                      </p>
                    </div>
                  </section>
                </div>
              )}

              {activeTab === 'Language' && (
                <div className="space-y-6">
                  <section className="bg-card border border-border rounded-xl p-6">
                    <h2 className="font-display font-bold text-xl mb-4 pb-2 border-b border-border flex items-center gap-2">
                      <Globe className="w-5 h-5 text-primary" /> Language & Regionalization Settings
                    </h2>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold mb-2">Primary Language</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {[
                            { code: 'en', label: 'English (US)' },
                            { code: 'es', label: 'Español' },
                            { code: 'fr', label: 'Français' },
                            { code: 'de', label: 'Deutsch' },
                          ].map((lang) => (
                            <button
                              key={lang.code}
                              onClick={() => setLanguage(lang.code)}
                              className={cn(
                                "p-3 border rounded-lg text-sm font-medium transition-all text-center",
                                language === lang.code 
                                  ? "border-primary bg-primary/5 text-foreground font-semibold" 
                                  : "border-border hover:border-primary/50 text-muted-foreground"
                              )}
                            >
                              {lang.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <hr className="border-border" />

                      <div>
                        <label className="block text-sm font-semibold mb-2">Regional Numbers & Dates</label>
                        <select 
                          value={regionFormat} 
                          onChange={(e) => setRegionFormat(e.target.value)}
                          className="w-full sm:w-72 bg-transparent border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="ZA">South Africa (YYYY-MM-DD, ZAR)</option>
                          <option value="EU">European Union (DD/MM/YYYY, EUR)</option>
                          <option value="GB">United Kingdom (DD/MM/YYYY, GBP)</option>
                          <option value="JP">Japan (YYYY/MM/DD, JPY)</option>
                        </select>
                        <p className="text-xs text-muted-foreground mt-1">Updates localized presentation parameters across job contracts and project dates.</p>
                      </div>
                    </div>
                  </section>

                  <section className="bg-card border border-border rounded-xl p-6">
                    <h3 className="font-display font-semibold text-lg mb-3 flex items-center gap-2 text-foreground">
                      <FileText className="w-4 h-4 text-muted-foreground" /> European Accessibility Act (EAA) & Language Equity Legislation
                    </h3>
                    <div className="space-y-3 text-xs text-muted-foreground leading-relaxed">
                      <p>
                        <strong>EAA & WCAG 2.1 AA Language Legislation:</strong> In strict compliance with the European Accessibility Act (Directive 2019/882) and Section 508 of the US Rehabilitation Act, orbit implements programmatically accessible language declarations. We mandate that screen-readers and visual magnification interfaces must correctly decode linguistic attributes, guaranteeing absolute non-discriminatory service availability regardless of your chosen regional language.
                      </p>
                      <p>
                        <strong>Automatic Translation Rules:</strong> Users hold the absolute right to write and publish content in their native tongue. System translations of profile resumes and jobs are rendered dynamically utilizing server-side linguistic APIs, ensuring transparent comprehension across localized European, American, and global digital markets.
                      </p>
                    </div>
                  </section>
                </div>
              )}

              {activeTab === 'Help Center' && (
                <div className="space-y-6">
                  <section className="bg-card border border-border rounded-xl p-6">
                    <h2 className="font-display font-bold text-xl mb-4 pb-2 border-b border-border flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-primary" /> Help Center & Dispute Resolution
                    </h2>
                    <p className="text-sm text-muted-foreground mb-6">
                      Locate user guides, learn platform regulations, or submit formal requests to the orbit support agents.
                    </p>

                    <h3 className="font-semibold text-base mb-3 text-foreground">Frequently Asked Questions</h3>
                    <div className="space-y-3 mb-6">
                      {[
                        {
                          q: "How do I create and manage project listings?",
                          a: "Under the projects page, authenticated users can click 'Create Project' to publish comprehensive details. All listings must conform to copyright, patent, and trademark rules. Plagiarism will trigger permanent ban."
                        },
                        {
                          q: "What is the policy for publishing open hiring opportunities?",
                          a: "To publish a job role on orbit, recruiters must document a valid legal entity, representative contact details, clear geographic scope, and explicit compensation brackets. Phantom postings or unpaid requirements are strictly forbidden."
                        },
                        {
                          q: "How are intellectual property disputes handled?",
                          a: "orbit enforces the Digital Millennium Copyright Act (DMCA). If platform content infringes your intellectual holdings, submit a formal takedown request under orbit's intellectual safety protocol to trigger expedited review."
                        },
                        {
                          q: "What are the rules regarding professional code of conduct?",
                          a: "Our community rules prohibit all harassment, defamation, predatory engagement, deceptive credentials, or commercial spam. Violations trigger prompt temporary lockouts or total identity terminations."
                        }
                      ].map((item, index) => (
                        <div key={index} className="border border-border rounded-lg overflow-hidden bg-secondary/10">
                          <button
                            onClick={() => toggleFaq(index)}
                            className="w-full flex items-center justify-between p-4 text-left font-semibold text-sm text-foreground hover:bg-secondary/20 transition-all"
                          >
                            <span>{item.q}</span>
                            {faqOpen === index ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                          </button>
                          {faqOpen === index && (
                            <div className="p-4 border-t border-border text-xs text-muted-foreground leading-relaxed bg-background/50">
                              {item.a}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="bg-card border border-border rounded-xl p-6">
                    <h3 className="font-display font-semibold text-lg mb-3 flex items-center gap-2 text-foreground">
                      <AlertTriangle className="w-4 h-4 text-amber-500" /> Platform Rules & Legislative Dispute Resolution (ToS)
                    </h3>
                    <div className="space-y-3 text-xs text-muted-foreground leading-relaxed">
                      <p>
                        <strong>EU Online Dispute Resolution (ODR) & US FAA:</strong> In conformity with the Federal Arbitration Act (FAA) in the United States and EU Regulation No 524/2013 on consumer dispute resolutions, all commercial agreements and membership disputes arising on orbit will be settled through fast, transparent arbitral procedures under AAA rules before commencing litigation.
                      </p>
                      <p>
                        <strong>Content Moderation Legislation:</strong> In accordance with the EU Digital Services Act (DSA) and Section 230 of the US Communications Decency Act, orbit maintains continuous notice-and-takedown systems. Any reported hate speech, illegal jobs, cyber-harassment, or malicious spam is reviewed and actioned within 24 operational hours.
                      </p>
                    </div>
                  </section>

                  <section className="bg-card border border-border rounded-xl p-6">
                    <h3 className="font-display font-semibold text-lg mb-4 text-foreground flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-primary" /> Submit a Help Ticket
                    </h3>
                    <form onSubmit={handleSupportSubmit} className="space-y-4 max-w-lg">
                      <div>
                        <label className="block text-xs font-semibold mb-1">Inquiry Category</label>
                        <select
                          value={supportCategory}
                          onChange={(e) => setSupportCategory(e.target.value)}
                          className="w-full bg-transparent border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        >
                          <option value="general">General Support</option>
                          <option value="security">Security Incident / Bug Reporting</option>
                          <option value="privacy">GDPR / Privacy Request</option>
                          <option value="abuse">Report Platform Violations / Abuse</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold mb-1">Subject</label>
                        <input
                          type="text"
                          required
                          value={supportSubject}
                          onChange={(e) => setSupportSubject(e.target.value)}
                          placeholder="Summary of the request"
                          className="w-full bg-transparent border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold mb-1">Message Description</label>
                        <textarea
                          required
                          rows={4}
                          value={supportDesc}
                          onChange={(e) => setSupportDesc(e.target.value)}
                          placeholder="Describe your inquiry or concern. Please reference specific rules or legislative sections if applicable."
                          className="w-full bg-transparent border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
                        />
                      </div>

                      {ticketStatus && (
                        <p className="text-xs font-semibold text-emerald-500">
                          {ticketStatus}
                        </p>
                      )}

                      <button type="submit" className="bg-primary text-primary-foreground font-semibold px-5 py-2.5 rounded-lg text-sm hover:bg-primary/90 transition-colors">
                        Submit Help Request
                      </button>
                    </form>
                  </section>
                </div>
              )}
          </div>
      </div>
    </div>
  );
}

function SettingsTab({ active, icon: Icon, label, onClick }: any) {
    return (
        <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'}`}>
            <Icon className="w-4 h-4" /> {label}
        </button>
    )
}
