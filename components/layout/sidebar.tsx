"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Compass,
  Briefcase,
  FolderDot,
  Landmark,
  Building2,
  Users,
  MessageSquare,
  Bell,
  Search,
  UserCircle,
  Settings,
  LogIn,
  LogOut,
  Sparkles,
  Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useUserRole } from '@/lib/auth-utils';

const navItems = [
  { name: 'Menu', href: '/', icon: Compass },
  { name: 'Home Feed', href: '/feed', icon: Home },
  { name: 'Explore', href: '/explore', icon: Compass },
  { name: 'Jobs', href: '/jobs', icon: Briefcase },
  { name: 'Funding', href: '/funding', icon: Landmark },
  { name: 'Businesses', href: '/businesses', icon: Building2 },
  { name: 'Messages', href: '/messages', icon: MessageSquare },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Search', href: '/search', icon: Search },
  { name: 'Profile', href: '/profile', icon: UserCircle },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const { isAdmin, role, loading: roleLoading } = useUserRole();

  const allNavItems = [...navItems];
  if (isAdmin) {
    allNavItems.push({ name: 'Admin', href: '/admin', icon: Shield });
  }

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const logged = localStorage.getItem('orbit_is_logged_in') === 'true';
        setIsLoggedIn(logged);
        if (logged) {
          try {
            const profileStr = localStorage.getItem('orbit_user_profile');
            if (profileStr) {
              const profile = JSON.parse(profileStr);
              setUserName(profile.name || 'Member');
            }
          } catch (e) {
            setUserName('Member');
          }
        }
      }
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    window.addEventListener('orbit-auth-change', checkAuth);
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('orbit-auth-change', checkAuth);
    };
  }, []);

  const handleSignOut = async () => {
    if (typeof window !== 'undefined') {
      try {
        await signOut(auth);
      } catch (e) {
        console.warn('Firebase signOut error:', e);
      }
      localStorage.setItem('orbit_is_logged_in', 'false');
      setIsLoggedIn(false);
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('orbit-auth-change'));
      window.location.reload();
    }
  };

  const handleOpenAuth = (mode: 'signin' | 'signup') => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { mode } }));
    }
  };

  return (
    <aside className="hidden lg:flex w-[220px] flex-col fixed inset-y-0 border-r border-border bg-card z-50 py-5">
      <div className="mb-2">
        <Link href="/" className="flex items-center justify-center px-6 pb-2" aria-label="Home">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-transparent overflow-hidden">
            <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M 25 25 L 47.5 25 L 42.5 35 L 37.5 35 L 41.5 43 L 47.5 43 L 45.5 51 L 50 75 Z" className="fill-black dark:fill-white" />
              <path d="M 52.5 25 L 75 25 L 58 59 L 50 59 L 61 37 L 52.5 37 Z" fill="#ef4444" />
            </svg>
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        {allNavItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'h-[44px] px-6 flex items-center gap-3 text-sm font-medium transition-colors',
                isActive 
                  ? 'bg-secondary text-primary border-r-[3px] border-primary' 
                  : 'text-muted-foreground hover:bg-secondary/50',
                item.name === 'Admin' && 'text-red-600 hover:text-red-700 hover:bg-red-500/5'
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Authentication Footer Bar */}
      <div className="px-4 pt-3 border-t border-border mt-auto">
        {isLoggedIn ? (
          <div className="flex flex-col gap-2">
            <Link 
              href="/profile" 
              className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-secondary/70 transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                {userName ? userName.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">
                  {userName || 'Member'}
                </p>
                <p className={cn(
                  "text-[10px] font-semibold flex items-center gap-1",
                  isAdmin ? "text-red-600" : "text-emerald-500"
                )}>
                  <span className={cn(
                    "w-1.5 h-1.5 rounded-full animate-pulse",
                    isAdmin ? "bg-red-600" : "bg-emerald-500"
                  )} />
                  {isAdmin ? 'Administrator' : 'Active Member'}
                </p>
              </div>
            </Link>

            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-xs font-medium text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2 bg-secondary/30 p-2.5 rounded-2xl border border-border/50">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Guest Mode</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold">
                Unsigned
              </span>
            </div>

            <button
              onClick={() => handleOpenAuth('signin')}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm shadow-red-600/25 transition-all active:scale-[0.98]"
            >
              <span>Sign In</span>
            </button>

            <button
              onClick={() => handleOpenAuth('signup')}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl border border-border hover:bg-secondary text-xs font-medium text-foreground transition-all"
            >
              <span>Register</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
