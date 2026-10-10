"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Check, ChevronUp, Plus, User, Building, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

type Account = {
  id: string;
  name: string;
  username: string;
  type: 'personal' | 'business';
  avatarUrl: string;
};

export function AccountSwitcher() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [activeAccountId, setActiveAccountId] = useState<string>('personal-1');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const logged = localStorage.getItem('orbit_is_logged_in') === 'true';
        setIsLoggedIn(logged);
      }
    };
    checkAuth();
    window.addEventListener('orbit-auth-change', checkAuth);
    window.addEventListener('storage', checkAuth);
    return () => {
      window.removeEventListener('orbit-auth-change', checkAuth);
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      setMounted(true);
    });
  }, []);

  useEffect(() => {
    // Mock accounts or load from local storage
    const loadAccounts = () => {
      let activeId = localStorage.getItem('orbit_active_account_id') || 'personal-1';
      setActiveAccountId(activeId);

      // Ensure profile-specific stores are initialized
      if (typeof window !== 'undefined') {
        // Initialize personal-1 profile
        if (!localStorage.getItem('orbit_user_profile_personal-1')) {
          const mainProfileStr = localStorage.getItem('orbit_user_profile');
          if (mainProfileStr) {
            localStorage.setItem('orbit_user_profile_personal-1', mainProfileStr);
          } else {
            const default1 = {
              name: 'Alex Rivera',
              username: 'alexrivera',
              email: 'alex@alexrivera.dev',
              role: 'Entrepreneur · Full Stack Developer · UI/UX Designer',
              company: 'Orbit Open Source',
              location: 'San Francisco, CA',
              website: 'https://alexrivera.dev',
              bio: 'Passionate about building scalable digital products that solve real-world problems. Currently exploring opportunities in AI-driven tools and sustainable tech.',
              skills: ['React', 'Next.js', 'Tailwind', 'Product Design', 'Startups'],
              projects: ['Orbit Design System Core', 'Sustainable Tech Dashboard'],
              avatarUrl: 'https://dummyimage.com/200x200/1e293b/ffffff?text=alexrivera',
              experience: [
                {
                  title: 'Lead Software Architect & Co-Founder @ Orbit Open Source',
                  period: '2024 - Present',
                  description: 'Pioneering open-source workspace widgets and custom state routing. Driving collaborative visual layouts and developer productivity tool suites.'
                }
              ]
            };
            localStorage.setItem('orbit_user_profile_personal-1', JSON.stringify(default1));
            localStorage.setItem('orbit_user_profile', JSON.stringify(default1));
          }
        }
        
        // Initialize personal-2 profile
        if (!localStorage.getItem('orbit_user_profile_personal-2')) {
          const default2 = {
            name: 'Govan Mawila',
            username: 'govanmawila',
            email: 'govanmawila@example.com',
            role: 'Founder & Developer',
            company: 'Orbit Open Source',
            location: 'San Francisco, CA',
            website: 'https://govanmawila.dev',
            bio: 'Aspiring tech entrepreneur focused on community-driven growth and sustainable platforms.',
            skills: ['React', 'Next.js', 'Tailwind', 'Product Design'],
            projects: ['Local Community App', 'Developer Resource Center'],
            avatarUrl: 'https://dummyimage.com/200x200/1e293b/ffffff?text=govanmawila',
            experience: [
              {
                title: 'Full Stack Engineer @ OpenSource Community',
                period: '2025 - Present',
                description: 'Creating local-first community applications, optimizing client hydration, and designing modular UI systems.'
              }
            ]
          };
          localStorage.setItem('orbit_user_profile_personal-2', JSON.stringify(default2));
        }
      }

      const storedAccounts = localStorage.getItem('orbit_accounts');
      if (storedAccounts) {
        try {
          const parsedAccounts = JSON.parse(storedAccounts);
          if (!parsedAccounts.find((a: Account) => a.id === 'personal-2')) {
            parsedAccounts.push({
              id: 'personal-2',
              name: 'Govan Mawila',
              username: 'govanmawila',
              type: 'personal',
              avatarUrl: 'https://dummyimage.com/100x100/1e293b/ffffff?text=govanmawila'
            });
            localStorage.setItem('orbit_accounts', JSON.stringify(parsedAccounts));
          }
          setAccounts(parsedAccounts);
        } catch (e) {
          console.error('Failed to parse accounts', e);
        }
      } else {
        // Initial setup if no accounts exist
        const initialAccounts: Account[] = [
          {
            id: 'personal-1',
            name: 'Alex Rivera',
            username: 'alexrivera',
            type: 'personal',
            avatarUrl: 'https://dummyimage.com/100x100/1e293b/ffffff?text=alexrivera'
          },
          {
            id: 'personal-2',
            name: 'Govan Mawila',
            username: 'govanmawila',
            type: 'personal',
            avatarUrl: 'https://dummyimage.com/100x100/1e293b/ffffff?text=govanmawila'
          }
        ];
        
        // Also check if there's a business profile created from onboarding
        try {
          const onboardingStr = localStorage.getItem('orbit_onboarding_responses');
          if (onboardingStr) {
            const parsed = JSON.parse(onboardingStr);
            if (parsed.accountType === 'business' && parsed.name) {
              const username = parsed.name.toLowerCase().replace(/[^a-z0-9]/g, '');
              initialAccounts.push({
                id: 'business-1',
                name: parsed.name,
                username: username,
                type: 'business',
                avatarUrl: `https://dummyimage.com/100x100/1e293b/ffffff?text=%24%7Busername%7D`
              });
            }
          }
        } catch (e) {}

        setAccounts(initialAccounts);
        localStorage.setItem('orbit_accounts', JSON.stringify(initialAccounts));
      }
    };

    loadAccounts();

    // Close dropdown on outside click
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('storage', loadAccounts);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('storage', loadAccounts);
    };
  }, []);

  const activeAccount = accounts.find(a => a.id === activeAccountId) || accounts[0];

  const handleSwitchAccount = (accountId: string) => {
    setActiveAccountId(accountId);
    localStorage.setItem('orbit_active_account_id', accountId);
    
    // Switch to profile of target account
    if (typeof window !== 'undefined') {
      const targetProfileStr = localStorage.getItem(`orbit_user_profile_${accountId}`);
      if (targetProfileStr) {
        localStorage.setItem('orbit_user_profile', targetProfileStr);
      } else {
        // Fallback: create a basic one from account switcher info
        const account = accounts.find(a => a.id === accountId);
        if (account) {
          const basicProfile = {
            name: account.name,
            username: account.username,
            email: `${account.username}@example.com`,
            role: account.type === 'business' ? 'Business Account' : 'Founder & Developer',
            company: account.type === 'business' ? account.name : 'Orbit Open Source',
            location: 'San Francisco, CA',
            bio: 'Passionate about building scalable digital products that solve real-world problems.',
            skills: ['React', 'Next.js', 'Tailwind', 'Product Design'],
            projects: [],
            experience: [],
            avatarUrl: account.avatarUrl || `https://dummyimage.com/200x200/1e293b/ffffff?text=%24%7Baccount.username%7D`
          };
          localStorage.setItem(`orbit_user_profile_${accountId}`, JSON.stringify(basicProfile));
          localStorage.setItem('orbit_user_profile', JSON.stringify(basicProfile));
        }
      }
      
      // Trigger event so other components update if necessary
      window.dispatchEvent(new Event('storage'));
    }
    
    setIsOpen(false);
    
    // Hard refresh to update state across app (simplified for this example)
    window.location.assign('/');
  };

  const handleCreateAccount = (type: 'personal' | 'business') => {
    setIsOpen(false);
    router.push(`/onboarding?type=${type}`);
  };

  if (!isLoggedIn) {
    return (
      <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Guest Visitor
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-semibold">
            Unsigned
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          You are currently exploring as an unsigned guest. Sign in or register to link accounts and manage profiles.
        </p>
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { mode: 'signin' } }))}
            className="flex-1 py-1.5 px-3 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-xs font-bold hover:opacity-90 transition-opacity text-center"
          >
            Sign In
          </button>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { mode: 'signup' } }))}
            className="flex-1 py-1.5 px-3 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors shadow-sm text-center"
          >
            Register
          </button>
        </div>
      </div>
    );
  }

  if (!activeAccount) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-black hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors border border-border text-left shadow-sm"
      >
        <Image 
          src={activeAccount.avatarUrl} 
          alt={activeAccount.name} 
          width={40} 
          height={40} 
          unoptimized
          className={cn("rounded-full object-cover border border-border", activeAccount.type === 'business' ? 'rounded-lg' : 'rounded-full')} 
          referrerPolicy="no-referrer"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-bold text-foreground truncate">{activeAccount.name}</p>
            {mounted && localStorage.getItem(`orbit_linked_account_${activeAccount.id}`) && (
              <span className="text-[9px] bg-amber-500/10 text-amber-600 dark:text-amber-400 px-1 py-0.2 rounded font-bold shrink-0">Linked</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate">@{activeAccount.username}</p>
        </div>
        <ChevronUp className={cn("w-4 h-4 text-muted-foreground transition-transform duration-200", isOpen ? "rotate-180" : "")} />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 w-full mb-2 bg-white dark:bg-zinc-950 border border-border rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="p-2">
            <div className="px-3 py-2 text-xs font-bold tracking-wider text-muted-foreground uppercase">
              Switch Account
            </div>
            
            <div className="space-y-1 mt-1">
              {accounts.map(account => (
                <button
                  key={account.id}
                  onClick={() => handleSwitchAccount(account.id)}
                  className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-secondary transition-colors text-left group"
                >
                  <Image 
                    src={account.avatarUrl} 
                    alt={account.name} 
                    width={36} 
                    height={36} 
                    unoptimized
                    className={cn("object-cover border border-border", account.type === 'business' ? 'rounded-md' : 'rounded-full')} 
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">{account.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {account.type === 'business' ? (
                        <Building className="w-3 h-3 text-muted-foreground" />
                      ) : (
                        <User className="w-3 h-3 text-muted-foreground" />
                      )}
                      <p className="text-[10px] text-muted-foreground truncate">@{account.username}</p>
                      {mounted && localStorage.getItem(`orbit_linked_account_${account.id}`) && (
                        <span className="text-[9px] bg-amber-500/10 text-amber-600 dark:text-amber-400 px-1 py-0.2 rounded font-bold shrink-0">Linked</span>
                      )}
                    </div>
                  </div>
                  {activeAccountId === account.id && (
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="my-2 border-t border-border" />

            <div className="px-3 py-2 text-xs font-bold tracking-wider text-muted-foreground uppercase">
              Add Account
            </div>

            <div className="space-y-1 mt-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  router.push('/onboarding');
                }}
                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-secondary transition-colors text-left"
              >
                <div className="w-9 h-9 rounded-md bg-secondary border border-border border-dashed flex items-center justify-center text-muted-foreground shrink-0">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Add New Account</p>
                  <p className="text-[10px] text-muted-foreground">Create a new profile</p>
                </div>
              </button>
            </div>

            <div className="my-2 border-t border-border" />

            {/* Sign Out to Guest Mode */}
            <div className="space-y-1">
              <button
                onClick={async () => {
                  setIsOpen(false);
                  try {
                    await signOut(auth);
                  } catch (e) {
                    console.warn('Firebase sign out error:', e);
                  }
                  localStorage.setItem('orbit_is_logged_in', 'false');
                  setIsLoggedIn(false);
                  window.dispatchEvent(new Event('storage'));
                  window.dispatchEvent(new CustomEvent('orbit-auth-change'));
                  window.location.assign('/');
                }}
                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-red-500/10 text-red-600 dark:text-red-400 transition-colors text-left"
              >
                <div className="w-9 h-9 rounded-md bg-red-500/10 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0">
                  <LogOut className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Sign Out (Guest Mode)</p>
                  <p className="text-[10px] opacity-80">Browse as an unsigned visitor</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
