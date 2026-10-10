"use client";

import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Video, Lightbulb, Briefcase, FileText, Send } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export function CreatePostBar() {
  const router = useRouter();
  const [username, setUsername] = useState('alexrivera');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loadProfile = () => {
        try {
          const activeId = localStorage.getItem('orbit_active_account_id') || 'personal-1';
          const storedAccounts = localStorage.getItem('orbit_accounts');
          let currentAcc = null;
          if (storedAccounts) {
            const accounts = JSON.parse(storedAccounts);
            currentAcc = accounts.find((a: any) => a.id === activeId);
          }
          
          if (currentAcc) {
             
            setUsername(currentAcc.username);
            if (currentAcc.avatarUrl) {
               
              setAvatarUrl(currentAcc.avatarUrl);
            } else {
               
              setAvatarUrl(null);
            }
          } else {
            const storedProfileStr = localStorage.getItem('orbit_user_profile');
            if (storedProfileStr) {
              const parsed = JSON.parse(storedProfileStr);
              if (parsed.username) {
                 
                setUsername(parsed.username);
              }
              if (parsed.avatarUrl) {
                 
                setAvatarUrl(parsed.avatarUrl);
              }
            }
          }
        } catch (e) {}
      };
      
      loadProfile();
      window.addEventListener('storage', loadProfile);
      return () => window.removeEventListener('storage', loadProfile);
    }
  }, []);

  const handleNavigate = (type?: string) => {
    if (type) {
      router.push(`/create-post?type=${type}`);
    } else {
      router.push('/create-post');
    }
  };

  return (
    <div 
      onClick={() => handleNavigate()}
      className="p-4 border-y border-border bg-card cursor-pointer hover:bg-secondary/20 transition-all duration-200 group"
    >
      <div className="flex gap-3">
        <Image src={avatarUrl || `https://i.pravatar.cc/150?u=${username}`} alt="Current User" width={48} height={48} unoptimized className="rounded-full w-12 h-12 object-cover" referrerPolicy="no-referrer" />
        <div className="flex-1">
          <input 
            type="text" 
            readOnly
            placeholder="Share an idea, present a business ..." 
            className="w-full bg-transparent text-sm sm:text-base md:text-lg outline-none placeholder:text-muted-foreground/60 py-2 mt-1 cursor-pointer"
          />
        </div>
      </div>
      <div className="flex items-center justify-between mt-4 ml-0 sm:ml-[60px] gap-2 flex-nowrap">
        <div className="flex items-center gap-1 flex-nowrap">
          <ActionButton onClick={(e) => { e.stopPropagation(); handleNavigate('idea'); }} icon={Lightbulb} text="Idea" color="text-yellow-500" />
          <ActionButton onClick={(e) => { e.stopPropagation(); handleNavigate('photo'); }} icon={ImageIcon} text="Photo" color="text-blue-500" />
          <ActionButton onClick={(e) => { e.stopPropagation(); handleNavigate('video'); }} icon={Video} text="Video" color="text-red-500" />
          <ActionButton onClick={(e) => { e.stopPropagation(); handleNavigate('pitch'); }} icon={Briefcase} text="Pitch" color="text-purple-500" />
          <ActionButton onClick={(e) => { e.stopPropagation(); handleNavigate('document'); }} icon={FileText} text="Document" color="text-green-500" />
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); handleNavigate(); }}
          className="flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-4 sm:px-5 py-1.5 rounded-full hover:bg-primary/90 transition-colors shrink-0 whitespace-nowrap group-hover:scale-102"
        >
          <span className="font-display">Post</span>
          <Send className="w-4 h-4 text-blue-400" />
        </button>
      </div>
    </div>
  );
}

function ActionButton({ icon: Icon, text, color, onClick }: { icon: any, text: string, color: string, onClick?: (e: React.MouseEvent) => void }) {
  return (
    <div onClick={onClick} className="flex items-center gap-2 hover:bg-secondary rounded-full px-2 sm:px-3 py-1.5 transition-colors">
      <Icon className={`w-5 h-5 ${color}`} />
      <span className="text-sm font-medium text-muted-foreground hidden sm:block whitespace-nowrap">{text}</span>
    </div>
  );
}
