"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Plus, MessageSquare, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileNav({ isVisible = true }: { isVisible?: boolean }) {
  const pathname = usePathname();

  return (
    <div className={cn(
      "lg:hidden fixed bottom-0 inset-x-0 border-t border-border bg-white dark:bg-black z-50 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] transition-transform duration-300 ease-in-out",
      isVisible ? "translate-y-0" : "translate-y-full"
    )}>
      <div className="flex items-center justify-around p-2 h-16 bg-white dark:bg-black relative z-50">
        <NavItem href="/" icon={Home} isActive={pathname === '/'} />
        <NavItem href="/explore" icon={Compass} isActive={pathname.startsWith('/explore')} />
        
        {/* Create Button */}
        <Link 
          href="/create-post"
          className="flex flex-col items-center justify-center p-2 min-w-[64px] transition-colors rounded-lg relative z-50 bg-white dark:bg-black text-muted-foreground hover:text-foreground hover:bg-secondary"
        >
          <Plus className="w-6 h-6" />
        </Link>

        <NavItem href="/messages" icon={MessageSquare} isActive={pathname.startsWith('/messages')} />
        <NavItem href="/profile" icon={UserCircle} isActive={pathname.startsWith('/profile')} />
      </div>
    </div>
  );
}

function NavItem({ href, icon: Icon, isActive }: { href: string; icon: any; isActive: boolean }) {
  return (
    <Link 
      href={href} 
      className={cn(
        "flex flex-col items-center justify-center p-2 min-w-[64px] transition-colors rounded-lg relative z-50 bg-white dark:bg-black",
        isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
      )}
    >
      <Icon className="w-6 h-6" />
    </Link>
  );
}
