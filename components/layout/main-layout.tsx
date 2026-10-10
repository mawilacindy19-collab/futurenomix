"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from './sidebar';
import { MobileNav } from './mobile-nav';
import { 
  Menu, 
  Search, 
  Bell, 
  X,
  Home,
  Compass,
  Briefcase,
  FolderDot,
  Landmark,
  Building2,
  Users,
  Settings
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { AuthModal } from '@/components/auth-modal';
import { signOutUser } from '@/app/lib/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, testConnection } from '@/lib/firebase';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === '/';
  const isHobnob = pathname === '/hobnob';
  const isMessagesPage = pathname === '/messages' || pathname.startsWith('/messages/');
  const shouldHideMobileNav = isHome || !['/explore', '/messages'].some(path => 
    pathname === path || (path !== '/' && pathname.startsWith(path + '/'))
  );
  const isStaticNavPage = ['/explore', '/messages'].some(path => 
    pathname === path || pathname.startsWith(path + '/')
  );
  const lastScrollY = useRef(0);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  useEffect(() => {
    testConnection();
  }, []);

  // Initialize session to unsigned in / new user
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasGuestModeInitialized = localStorage.getItem('orbit_guest_initialized_v2');
      if (!hasGuestModeInitialized) {
        localStorage.setItem('orbit_guest_initialized_v2', 'true');
        localStorage.setItem('orbit_is_logged_in', 'false');
      }
      queueMicrotask(() => {
        const logged = localStorage.getItem('orbit_is_logged_in') === 'true';
        setIsLoggedIn(logged);
      });
    }
  }, []);

  useEffect(() => {
    const handleAuthChange = () => {
      if (typeof window !== 'undefined') {
        const logged = localStorage.getItem('orbit_is_logged_in') === 'true';
        setIsLoggedIn(logged);
      }
    };

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (typeof window !== 'undefined') {
        if (firebaseUser) {
          const logged = localStorage.getItem('orbit_is_logged_in') === 'true';
          if (!logged) {
            localStorage.setItem('orbit_is_logged_in', 'true');
            localStorage.setItem('orbit_active_account_id', firebaseUser.uid);
            setIsLoggedIn(true);
          }
        }
      }
    });

    window.addEventListener('orbit-auth-change', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    return () => {
      unsubscribeAuth();
      window.removeEventListener('orbit-auth-change', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Ignore scroll bounce on iOS
      if (currentScrollY < 0) return;

      if (currentScrollY > lastScrollY.current + 10) {
        // Scrolling down -> hide
        setShowMobileNav(false);
      } else if (currentScrollY < lastScrollY.current - 10) {
        // Scrolling up -> show
        setShowMobileNav(true);
      }
      
      // Always hide when near the top to prevent static display
      if (currentScrollY <= 15) {
        setShowMobileNav(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initialize
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartX.current || !touchStartY.current) return;

      const diffX = e.changedTouches[0].clientX - touchStartX.current;
      const diffY = e.changedTouches[0].clientY - touchStartY.current;

      // Check if there is a back button visible on the current screen to deactivate swapping
      const hasBackButton = typeof document !== 'undefined' && !!(
        document.querySelector('#profile-back-btn') ||
        document.querySelector('#chat-mobile-back-btn') ||
        document.querySelector('[id*="back-btn"]') ||
        document.querySelector('[id*="back-button"]') ||
        document.querySelector('[class*="back-btn"]') ||
        document.querySelector('[class*="back-button"]') ||
        document.querySelector('button[aria-label*="back"]') ||
        document.querySelector('button[aria-label*="Back"]') ||
        document.querySelector('a[aria-label*="back"]') ||
        document.querySelector('a[aria-label*="Back"]') ||
        document.querySelector('.back-button')
      );

      if (hasBackButton) {
        // Reset coordinates and deactivate the swapping gesture
        touchStartX.current = 0;
        touchStartY.current = 0;
        return;
      }

      // Check if it's a primarily horizontal swipe
      if (Math.abs(diffX) > Math.abs(diffY) * 1.5 && Math.abs(diffX) > 60) {
        // Find if there is an active horizontal scrollable parent that can still scroll in the swipe direction
        let isScrollable = false;
        let el = e.target instanceof Node ? (e.target as HTMLElement) : null;
        while (el && el !== document.body) {
          if (el.nodeType === 1) { // Node.ELEMENT_NODE
            const style = window.getComputedStyle(el);
            const overflowX = style.overflowX;
            const isScrollableClass = el.classList?.contains('overflow-x-auto') || el.classList?.contains('overflow-x-scroll');
            const isScrollableOverflow = overflowX === 'auto' || overflowX === 'scroll';
            
            if ((isScrollableOverflow || isScrollableClass) && el.scrollWidth > el.clientWidth) {
              if (diffX > 0) {
                // Swiping Left to Right: trying to scroll left. Only block swipe-to-home if we have room to scroll left
                if (el.scrollLeft > 4) {
                  isScrollable = true;
                  break;
                }
              } else {
                // Swiping Right to Left: trying to scroll right. Only block menu-open if we have room to scroll right
                if (el.scrollLeft < el.scrollWidth - el.clientWidth - 4) {
                  isScrollable = true;
                  break;
                }
              }
            }
          }
          el = el.parentElement;
        }

        if (!isScrollable) {
          if (diffX > 0) {
            // Swipe Left to Right: Close menu and go back to home page
            setIsMobileMenuOpen(false);
            router.push('/');
          }
          // Swipe Right to Left is deactivated
        }
      }

      // Reset coordinates
      touchStartX.current = 0;
      touchStartY.current = 0;
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [router, pathname]);

  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        {!isHome && <Sidebar />}
        <main className={cn(
          "flex-1", 
          isMessagesPage ? "pb-16 lg:pb-0 h-[100dvh] max-h-[100dvh] overflow-hidden" : (shouldHideMobileNav ? "pb-0 min-h-screen" : "pb-24 min-h-screen"), 
          isHome ? "lg:pl-0" : "lg:pl-[220px]"
        )}>
          {/* Mobile Header is removed on Home */}
          
          <div className={cn(
            "mx-auto w-full lg:pt-0", 
            isMessagesPage ? "max-w-none h-full pt-0" : (isHome || isHobnob ? "pt-0" : "pt-14")
          )}>
            {children}
          </div>
        </main>
      </div>
      {!shouldHideMobileNav && <MobileNav isVisible={isStaticNavPage ? true : showMobileNav} />}

      {/* Mobile Sidebar Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-white dark:bg-black flex flex-col animate-in slide-in-from-left">
          <div className="p-4 border-b border-border flex items-center justify-between bg-white dark:bg-black">
             <span className="font-display font-bold text-xl tracking-tight text-foreground">Menu</span>
             <button onClick={() => setIsMobileMenuOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors"><X className="w-6 h-6" /></button>
          </div>
          <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 text-base font-medium text-muted-foreground bg-white dark:bg-black">
             <Link href="/menu" onClick={() => setIsMobileMenuOpen(false)} className="flex items-start gap-3 hover:text-foreground py-2.5 border-b border-border/50 transition-colors">
               <Compass className="w-5 h-5 mt-1 shrink-0 text-primary" />
               <div className="flex flex-col">
                 <span className="font-semibold text-foreground">Menu Hub & Overview</span>
                 <span className="text-xs text-muted-foreground">Browse all platform sections and tools with detailed guides</span>
               </div>
             </Link>
             <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-start gap-3 hover:text-foreground py-2.5 border-b border-border/50 transition-colors">
               <Home className="w-5 h-5 mt-1 shrink-0" />
               <div className="flex flex-col">
                 <span className="font-semibold text-foreground">Home Feed</span>
                 <span className="text-xs text-muted-foreground">Explore latest posts, startup updates, and discussions</span>
               </div>
             </Link>
             <Link href="/jobs" onClick={() => setIsMobileMenuOpen(false)} className="flex items-start gap-3 hover:text-foreground py-2.5 border-b border-border/50 transition-colors">
               <Briefcase className="w-5 h-5 mt-1 shrink-0" />
               <div className="flex flex-col">
                 <span className="font-semibold text-foreground">Jobs</span>
                 <span className="text-xs text-muted-foreground">Discover remote, tech, and startup career opportunities</span>
               </div>
             </Link>
             <Link href="/projects" onClick={() => setIsMobileMenuOpen(false)} className="flex items-start gap-3 hover:text-foreground py-2.5 border-b border-border/50 transition-colors">
               <FolderDot className="w-5 h-5 mt-1 shrink-0" />
               <div className="flex flex-col">
                 <span className="font-semibold text-foreground">Projects</span>
                 <span className="text-xs text-muted-foreground">Showcase your MVPs and collaborate on builds</span>
               </div>
             </Link>
             <Link href="/funding" onClick={() => setIsMobileMenuOpen(false)} className="flex items-start gap-3 hover:text-foreground py-2.5 border-b border-border/50 transition-colors">
               <Landmark className="w-5 h-5 mt-1 shrink-0" />
               <div className="flex flex-col">
                 <span className="font-semibold text-foreground">Funding</span>
                 <span className="text-xs text-muted-foreground">Connect with angel investors, VCs, and grant programs</span>
               </div>
             </Link>
             <Link href="/businesses" onClick={() => setIsMobileMenuOpen(false)} className="flex items-start gap-3 hover:text-foreground py-2.5 border-b border-border/50 transition-colors">
               <Building2 className="w-5 h-5 mt-1 shrink-0" />
               <div className="flex flex-col">
                 <span className="font-semibold text-foreground">Businesses</span>
                 <span className="text-xs text-muted-foreground">Explore registered startups and agencies in the directory</span>
               </div>
             </Link>
             <Link href="/communities" onClick={() => setIsMobileMenuOpen(false)} className="flex items-start gap-3 hover:text-foreground py-2.5 border-b border-border/50 transition-colors">
               <Users className="w-5 h-5 mt-1 shrink-0" />
               <div className="flex flex-col">
                 <span className="font-semibold text-foreground">Communities</span>
                 <span className="text-xs text-muted-foreground">Join specialized founder and developer groups</span>
               </div>
             </Link>
             <Link href="/settings" onClick={() => setIsMobileMenuOpen(false)} className="flex items-start gap-3 hover:text-foreground py-2.5 transition-colors">
               <Settings className="w-5 h-5 mt-1 shrink-0" />
               <div className="flex flex-col">
                 <span className="font-semibold text-foreground">Settings</span>
                 <span className="text-xs text-muted-foreground">Manage your account preferences, theme, and security</span>
               </div>
             </Link>

             {/* Mobile Auth Actions */}
             <div className="pt-4 mt-2 border-t border-border">
               {isLoggedIn ? (
                 <button
                   onClick={async () => {
                     await signOutUser();
                     setIsLoggedIn(false);
                     setIsMobileMenuOpen(false);
                     window.location.reload();
                   }}
                   className="w-full py-3 px-4 rounded-xl text-xs font-bold text-red-600 bg-red-500/10 hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2"
                 >
                   Sign Out (Switch to Guest Mode)
                 </button>
               ) : (
                 <div className="flex flex-col gap-2">
                   <button
                     onClick={() => {
                       setIsMobileMenuOpen(false);
                       window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { mode: 'signin' } }));
                     }}
                     className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-600/20 transition-all text-center"
                   >
                     Sign In
                   </button>
                   <button
                     onClick={() => {
                       setIsMobileMenuOpen(false);
                       window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { mode: 'signup' } }));
                     }}
                     className="w-full py-2.5 px-4 rounded-xl border border-border text-foreground hover:bg-secondary text-xs font-semibold transition-all text-center"
                   >
                     Create Account
                   </button>
                 </div>
               )}
             </div>
          </nav>
        </div>
      )}
      <AuthModal />
    </div>
  );
}
