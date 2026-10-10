'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Edit, 
  MoreVertical, 
  Phone, 
  Video, 
  Image as ImageIcon, 
  Paperclip, 
  Send, 
  Info, 
  Sparkles, 
  Download, 
  Save, 
  FileText, 
  Check, 
  MapPin, 
  X, 
  ArrowLeft,
  Star,
  FileCode,
  FileSpreadsheet,
  ChevronRight,
  UserPlus
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Message {
  id: string;
  sender: 'me' | 'them';
  text: string;
  time: string;
  senderId?: string;
  sharePostId?: string;
}

interface SharedFile {
  name: string;
  size: string;
  type: string;
}

interface Conversation {
  id: string;
  name: string;
  role: string;
  company?: string;
  location: string;
  avatarUrl: string;
  bio: string;
  projectPitch: string;
  matchScore: number;
  rating: number; // 1 to 5 star rating
  unread: number;
  time: string;
  sharedFiles: SharedFile[];
  messages: Message[];
  notes?: string;
}

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    name: 'Sophia Martinez',
    role: 'Founder & CEO',
    company: 'LogiChain AI',
    location: 'San Francisco, CA',
    avatarUrl: 'https://dummyimage.com/100x100/1e293b/ffffff?text=sophia',
    bio: 'Building autonomous last-mile delivery software. Ex-Google PM. Looking for a lead backend architect to join as technical co-founder.',
    projectPitch: 'LogiChain utilizes deep reinforcement learning to coordinate heterogeneous drone and ground-vehicle fleets, reducing urban delivery overheads by 42%. Currently raising R1.5M Seed round.',
    matchScore: 96,
    rating: 5,
    unread: 2,
    time: '2h',
    sharedFiles: [
      { name: 'pitch_deck_v2.pdf', size: '4.8 MB', type: 'PDF' },
      { name: 'mvp_wireframes.fig', size: '2.4 MB', type: 'Figma' },
      { name: 'reinforcement_learning_paper.pdf', size: '1.1 MB', type: 'PDF' }
    ],
    messages: [
      { id: 'm1_1', sender: 'them', text: 'Hi Alex! I saw your profile and noticed you have experience with exactly the kind of AI logistics algorithms I posted about earlier. Are you open to chatting about a potential co-founder role?', time: 'Today, 9:41 AM' },
      { id: 'm1_2', sender: 'me', text: "Hey Sophia! Thanks for reaching out. Yes, I'd love to learn more about what you're building. Last-mile optimization is a tough problem but huge opportunity.", time: 'Today, 9:43 AM' },
      { id: 'm1_3', sender: 'them', text: "Awesome. Do you have time for a quick video call tomorrow? I can walk you through the MVP I've wireframed.", time: 'Today, 9:45 AM' },
      { id: 'm1_4', sender: 'me', text: "Sure! Tomorrow afternoon works great for me. Let's do 2 PM PST?", time: 'Today, 9:48 AM' },
      { id: 'm1_5', sender: 'them', text: "Perfect, I've shared the Figma file and the updated deck in the files tab on the right. Talk tomorrow!", time: 'Today, 9:50 AM' }
    ],
    notes: 'Strong alignment on AI route optimization. Ex-Google PM background is solid. Check figma files before call tomorrow!'
  },
  {
    id: '2',
    name: 'David Chen',
    role: 'Senior Frontend Engineer',
    company: 'Orbit Open Source',
    location: 'Seattle, WA',
    avatarUrl: 'https://dummyimage.com/100x100/1e293b/ffffff?text=david',
    bio: 'Specialist in React, Next.js, and Tailwind. Passionate about beautiful, fluid user interfaces and performant client-side state engines.',
    projectPitch: 'Proposing a complete modernization of the feed interactions, making sheet overlays drag-to-dismiss and improving HMR latency across the workspace.',
    matchScore: 92,
    rating: 5,
    unread: 0,
    time: 'Yesterday',
    sharedFiles: [
      { name: 'resume_david_chen.pdf', size: '1.2 MB', type: 'PDF' },
      { name: 'ui_performance_benchmark.xlsx', size: '450 KB', type: 'Excel' }
    ],
    messages: [
      { id: 'm2_1', sender: 'me', text: 'Hey David, love your contributions to the repo. Are you free to review the new design files for the messaging sheet?', time: 'Yesterday, 3:15 PM' },
      { id: 'm2_2', sender: 'them', text: 'Hey! Yes, absolutely. I checked the latest branch. The spring transitions look super clean.', time: 'Yesterday, 3:18 PM' },
      { id: 'm2_3', sender: 'them', text: "Sounds great! I'll check the repo and add a few notes on how we can optimize mobile drag gestures.", time: 'Yesterday, 3:20 PM' }
    ],
    notes: 'Very fast responder. Helped debug drag gestures. Recommended for UI core roles.'
  },
  {
    id: '3',
    name: 'Green Funds Ventures',
    role: 'General Partner',
    company: 'Green Funds VC',
    location: 'New York, NY',
    avatarUrl: 'https://dummyimage.com/100x100/1e293b/ffffff?text=green',
    bio: 'Investing in seed-stage sustainability-focused software, deep-tech, and AI utility layers. Dedicated to supporting high-impact founders.',
    projectPitch: 'Currently reviewing our Q3 pipeline. We are particularly interested in developer utilities and community-led marketplaces solving discovery issues.',
    matchScore: 88,
    rating: 4,
    unread: 0,
    time: 'Mon',
    sharedFiles: [
      { name: 'venture_investment_thesis.pdf', size: '3.2 MB', type: 'PDF' },
      { name: 'term_sheet_template_2026.pdf', size: '780 KB', type: 'PDF' }
    ],
    messages: [
      { id: 'm3_1', sender: 'them', text: 'Hey Alex, congratulations on the launch of Orbit! The growth metrics look promising.', time: 'Monday, 11:10 AM' },
      { id: 'm3_2', sender: 'me', text: "Thank you! We've seen a 35% MoM increase in active founder connections.", time: 'Monday, 11:14 AM' },
      { id: 'm3_3', sender: 'them', text: 'Could you send over the updated pitch deck? Our partners are reviewing SaaS platforms next Tuesday.', time: 'Monday, 11:15 AM' }
    ],
    notes: 'VC interested in our seed round. Preparing updated metrics for next Tuesday.'
  },
  {
    id: '4',
    name: 'Startup Founder Group',
    role: 'Group Chat (4 members)',
    location: 'Global',
    avatarUrl: 'https://dummyimage.com/100x100/1e293b/ffffff?text=group',
    bio: 'A selective circle of early stage founders sharing tips, feedback, and tech stack recommendations.',
    projectPitch: 'Weekly virtual syncs and monthly offline dinners in SOMA. Sharing developer resources, marketing checklists, and hiring directories.',
    matchScore: 85,
    rating: 4,
    unread: 0,
    time: 'Sun',
    sharedFiles: [
      { name: 'venue_location_details.png', size: '1.5 MB', type: 'Image' }
    ],
    messages: [
      { id: 'm4_1', sender: 'them', text: 'Alex: Anyone attending the SF tech meetup tomorrow evening?', time: 'Sunday, 4:02 PM' },
      { id: 'm4_2', sender: 'them', text: 'Marcus: I\'ll be there! Bringing our new prototype.', time: 'Sunday, 4:05 PM' },
      { id: 'm4_3', sender: 'me', text: 'Count me in. Where is the venue?', time: 'Sunday, 4:10 PM' },
      { id: 'm4_4', sender: 'them', text: 'Sarah: It\'s at the SOMA Garage on 5th. See image attachment!', time: 'Sunday, 4:12 PM' }
    ],
    notes: 'Active local community chat. SOMA meetup schedule details inside.'
  }
];

export default function MessagesPage() {
  // Determine active account ID
  const [activeAccountId, setActiveAccountId] = useState<string>('personal-1');

  // Synchronous State Initializer for persistent conversations data
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);

  useEffect(() => {
    queueMicrotask(() => {
      if (typeof window !== 'undefined') {
        const activeId = localStorage.getItem('orbit_active_account_id') || 'personal-1';
        setActiveAccountId(activeId);
      }
    });
  }, []);

  const [activeChatId, setActiveChatId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [newMessage, setNewMessage] = useState<string>('');
  const [showReviewPanel, setShowReviewPanel] = useState<boolean>(true);

  // Trigger re-render or re-load when local storage updates (e.g. profile picture changed)
  const [storageTrigger, setStorageTrigger] = useState(0);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleStorageChange = () => {
      setStorageTrigger(prev => prev + 1);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const activeId = localStorage.getItem('orbit_active_account_id') || 'personal-1';
    const saved = localStorage.getItem(`orbit_conversations_${activeId}`);
    let parsed: Conversation[] = [];
    if (saved) {
      try {
        parsed = JSON.parse(saved);
      } catch (e) {}
    }
    
    if (!Array.isArray(parsed) || parsed.length === 0) {
      parsed = JSON.parse(JSON.stringify(INITIAL_CONVERSATIONS));
    }

    try {
      const storedAccounts = localStorage.getItem('orbit_accounts');
      if (storedAccounts) {
        const accounts = JSON.parse(storedAccounts);
        accounts.forEach((acc: any) => {
          if (acc.id !== activeId && !parsed.some(c => c.id === acc.id)) {
            parsed.push({
              id: acc.id,
              name: acc.name,
              role: acc.type === 'business' ? 'Business Account' : 'Founder & Developer',
              company: acc.type === 'business' ? acc.name : 'Orbit Open Source',
              location: 'San Francisco, CA',
              avatarUrl: acc.avatarUrl,
              bio: acc.type === 'business' ? 'Collaborative enterprise' : 'Aspiring tech entrepreneur focused on community-driven growth.',
              projectPitch: 'Interested in discussing open source opportunities and startup collaboration.',
              matchScore: 94,
              rating: 5,
              unread: 0,
              time: 'Just now',
              sharedFiles: [],
              messages: []
            });
          } else if (acc.id !== activeId) {
            // Update details (like avatar URL) for existing user account contacts!
            parsed = parsed.map(c => {
              if (c.id === acc.id) {
                return {
                  ...c,
                  name: acc.name,
                  avatarUrl: acc.avatarUrl
                };
              }
              return c;
            });
          }
        });
      }
    } catch (e) {}

    parsed = parsed.map(c => {
      const threadId = [activeId, c.id].sort().join('_');
      const storedMsgs = localStorage.getItem(`orbit_thread_msgs_${threadId}`);
      if (storedMsgs) {
        try {
          return { ...c, messages: JSON.parse(storedMsgs) };
        } catch (e) {}
      }
      return c;
    });

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setConversations(parsed);
  }, [storageTrigger]);
  
  // Helper to save conversations
  const saveConversations = (updated: Conversation[]) => {
    setConversations(updated);
    if (typeof window !== 'undefined') {
      const activeId = localStorage.getItem('orbit_active_account_id') || 'personal-1';
      localStorage.setItem(`orbit_conversations_${activeId}`, JSON.stringify(updated));
    }
  };

  const activeChat = conversations.find(c => c.id === activeChatId);

  // Synchronous Evaluation state initializers from persistent conversations state
  const [reviewNotes, setReviewNotes] = useState<string>(() => {
    const savedChat = conversations.find(c => c.id === '1') || conversations[0];
    return savedChat?.notes || '';
  });
  const [reviewRating, setReviewRating] = useState<number>(() => {
    const savedChat = conversations.find(c => c.id === '1') || conversations[0];
    return savedChat?.rating || 5;
  });
  const [reviewMatchScore, setReviewMatchScore] = useState<number>(() => {
    const savedChat = conversations.find(c => c.id === '1') || conversations[0];
    return savedChat?.matchScore || 95;
  });

  const [savedFeedback, setSavedFeedback] = useState<boolean>(false);
  const [isMobileReviewOpen, setIsMobileReviewOpen] = useState<boolean>(false);

  // Sync messages from local storage when activeChatId changes or on tick
  useEffect(() => {
    if (!activeChatId) return;
    const activeId = localStorage.getItem('orbit_active_account_id') || 'personal-1';
    const threadId = [activeId, activeChatId].sort().join('_');
    const storedMsgs = localStorage.getItem(`orbit_thread_msgs_${threadId}`);
    if (storedMsgs) {
      try {
        const msgs = JSON.parse(storedMsgs);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setConversations(prev => prev.map(c => {
          if (c.id === activeChatId) {
            return { ...c, messages: msgs };
          }
          return c;
        }));
      } catch (e) {}
    }
  }, [activeChatId]);

  // Handle explicit profile messaging trigger & Auto-select first chat on desktop on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const triggerChatId = localStorage.getItem('orbit_last_chat_id_trigger');
      if (triggerChatId) {
        localStorage.removeItem('orbit_last_chat_id_trigger');
        const timer = setTimeout(() => {
          setActiveChatId(triggerChatId);
          const targetChat = conversations.find(c => c.id === triggerChatId);
          if (targetChat) {
            setReviewNotes(targetChat.notes || '');
            setReviewRating(targetChat.rating || 5);
            setReviewMatchScore(targetChat.matchScore || 95);
          }
        }, 0);
        return () => clearTimeout(timer);
      }

      if (window.innerWidth >= 640 && !activeChatId) {
        const timer = setTimeout(() => {
          setActiveChatId('1');
          const firstChat = conversations.find(c => c.id === '1') || conversations[0];
          if (firstChat) {
            setReviewNotes(firstChat.notes || '');
            setReviewRating(firstChat.rating || 5);
            setReviewMatchScore(firstChat.matchScore || 95);
          }
        }, 0);
        return () => clearTimeout(timer);
      }
    }
  }, [conversations, activeChatId]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll messages to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages?.length]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    const activeId = typeof window !== 'undefined' ? (localStorage.getItem('orbit_active_account_id') || 'personal-1') : 'personal-1';
    const otherId = activeChat.id;
    const threadId = [activeId, otherId].sort().join('_');

    // eslint-disable-next-line react-hooks/purity
    const msgId = `m_${threadId}_${Date.now()}`;
    const newMsg: Message = {
      id: msgId,
      sender: 'me',
      senderId: activeId,
      text: newMessage,
      time: 'Just now'
    };

    // 1. Save message to thread-specific store
    const msgsKey = `orbit_thread_msgs_${threadId}`;
    let threadMsgs: any[] = [];
    try {
      const stored = localStorage.getItem(msgsKey);
      if (stored) threadMsgs = JSON.parse(stored);
    } catch (err) {}
    threadMsgs.push(newMsg);
    localStorage.setItem(msgsKey, JSON.stringify(threadMsgs));

    // 2. Update active account's conversation metadata & messages
    const senderConvsKey = `orbit_conversations_${activeId}`;
    let senderConvs = conversations.map(c => {
      if (c.id === otherId) {
        return {
          ...c,
          messages: threadMsgs,
          time: 'Just now',
          unread: 0
        };
      }
      return c;
    });
    setConversations(senderConvs);
    localStorage.setItem(senderConvsKey, JSON.stringify(senderConvs));

    // 3. Update receiver's conversation list (if receiver is a local personal/business account)
    if (otherId.startsWith('personal-') || otherId.startsWith('business-')) {
      const receiverConvsKey = `orbit_conversations_${otherId}`;
      let receiverConvs: any[] = [];
      try {
        const stored = localStorage.getItem(receiverConvsKey);
        if (stored) receiverConvs = JSON.parse(stored);
      } catch (err) {}

      if (receiverConvs.length === 0) {
        receiverConvs = JSON.parse(JSON.stringify(INITIAL_CONVERSATIONS));
      }

      // Automatically add sender as contact to receiver's list if not exists
      let recvChat = receiverConvs.find(c => c.id === activeId);
      if (!recvChat) {
        let senderInfo = {
          name: 'Contact',
          role: 'Member',
          avatarUrl: `https://dummyimage.com/100x100/1e293b/ffffff?text=%24%7BactiveId%7D`,
          bio: 'Orbit user',
          location: 'San Francisco, CA',
          projectPitch: 'Interested in discussing open source opportunities and startup collaboration.',
          matchScore: 94,
          rating: 5,
          unread: 0,
          time: 'Just now',
          sharedFiles: [],
          messages: []
        };

        try {
          const storedAccounts = localStorage.getItem('orbit_accounts');
          if (storedAccounts) {
            const accounts = JSON.parse(storedAccounts);
            const matchedAcc = accounts.find((a: any) => a.id === activeId);
            if (matchedAcc) {
              senderInfo.name = matchedAcc.name;
              senderInfo.role = matchedAcc.type === 'business' ? 'Business Account' : 'Founder & Developer';
              senderInfo.avatarUrl = matchedAcc.avatarUrl;
            }
          }
        } catch (err) {}

        recvChat = {
          id: activeId,
          ...senderInfo,
          messages: []
        };
        receiverConvs.push(recvChat);
      }

      recvChat.messages = threadMsgs;
      recvChat.time = 'Just now';
      recvChat.unread = (recvChat.unread || 0) + 1;

      localStorage.setItem(receiverConvsKey, JSON.stringify(receiverConvs));
    }

    setNewMessage('');
  };

  const handleSaveEvaluation = () => {
    if (!activeChat) return;
    const updated = conversations.map(c => {
      if (c.id === activeChat.id) {
        return {
          ...c,
          notes: reviewNotes,
          rating: reviewRating,
          matchScore: reviewMatchScore
        };
      }
      return c;
    });

    saveConversations(updated);
    setSavedFeedback(true);
    setTimeout(() => {
      setSavedFeedback(false);
    }, 2000);
  };

  const filteredConversations = conversations.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.company && c.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex h-[100dvh] w-full bg-zinc-50 dark:bg-zinc-950 overflow-hidden relative">
      
      {/* 1. CHAT LIST SIDEBAR */}
      <div className={`w-full sm:w-80 lg:w-96 flex-shrink-0 border-r border-zinc-200/50 dark:border-zinc-800/50 flex flex-col bg-white dark:bg-zinc-900 transition-all duration-300 ${activeChatId && 'hidden sm:flex'}`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-xl font-display font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Messages</h1>
            <p className="text-[11px] text-zinc-400 font-medium">Review and evaluate candidate pitches</p>
          </div>
          <button 
            id="btn-new-message"
            className="bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 p-2.5 rounded-full text-zinc-700 dark:text-zinc-200 transition-all"
            aria-label="New Conversation"
          >
            <Edit className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-zinc-100 dark:border-zinc-800/30 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input 
              id="chat-search-input"
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search conversations..." 
              className="w-full bg-zinc-100/80 dark:bg-zinc-800/50 text-sm border-none rounded-2xl pl-9.5 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-700 text-zinc-800 dark:text-zinc-200" 
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800/30">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((chat) => (
              <div 
                id={`chat-preview-item-${chat.id}`}
                key={chat.id}
                onClick={() => {
                  setActiveChatId(chat.id);
                  setReviewNotes(chat.notes || '');
                  setReviewRating(chat.rating || 5);
                  setReviewMatchScore(chat.matchScore || 90);
                  
                  // Mark as read synchronously on select
                  if (chat.unread > 0) {
                    const updated = conversations.map(c => {
                      if (c.id === chat.id) {
                        return { ...c, unread: 0 };
                      }
                      return c;
                    });
                    saveConversations(updated);
                  }
                }}
                className={`p-3.5 flex items-start gap-3.5 cursor-pointer transition-all relative ${
                  activeChatId === chat.id 
                    ? 'bg-zinc-100/60 dark:bg-zinc-800/30 border-l-4 border-zinc-900 dark:border-zinc-100' 
                    : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/10 border-l-4 border-transparent'
                }`}
              >
                <div className="relative flex-shrink-0 mt-0.5">
                  <Image 
                    src={chat.avatarUrl} 
                    alt={chat.name} 
                    width={44} 
                    height={44} 
                    unoptimized
                    className="rounded-full w-11 h-11 object-cover ring-2 ring-zinc-100 dark:ring-zinc-800" 
                    referrerPolicy="no-referrer" 
                  />
                  {chat.unread > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-zinc-900 dark:bg-zinc-100 text-[9px] font-bold text-white dark:text-zinc-950 flex items-center justify-center ring-2 ring-white dark:ring-zinc-900">
                      {chat.unread}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-xs font-semibold truncate text-zinc-900 dark:text-zinc-100 ${chat.unread > 0 ? 'font-bold text-zinc-950 dark:text-white' : ''}`}>
                      {chat.name}
                    </h3>
                    <span className="text-[10px] text-zinc-400 whitespace-nowrap">{chat.time}</span>
                  </div>

                  <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                    {chat.company ? `${chat.role} at ${chat.company}` : chat.role}
                  </p>

                  <p className={`text-xs truncate mt-1 ${chat.unread > 0 ? 'text-zinc-900 dark:text-zinc-100 font-semibold' : 'text-zinc-400 dark:text-zinc-500'}`}>
                    {chat.messages[chat.messages.length - 1]?.text}
                  </p>

                  {/* Badges */}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-[9px] font-semibold text-zinc-600 dark:text-zinc-400">
                      <Sparkles className="w-2.5 h-2.5 text-zinc-500" />
                      {chat.matchScore}% Match
                    </span>
                    {chat.notes && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/30 text-[9px] font-medium text-emerald-600 dark:text-emerald-400">
                        Reviewed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-sm text-zinc-400 dark:text-zinc-500 flex flex-col items-center gap-2">
              <Search className="w-8 h-8 text-zinc-300" />
              <span>No conversations found</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. CHAT AREA CONTAINER */}
      <div className={`flex-1 flex flex-col bg-white dark:bg-zinc-900 relative h-full transition-all duration-300 ${!activeChatId && 'hidden sm:flex'}`}>
        
        {/* Chat Active Header */}
        {activeChat ? (
          <>
            <div className="h-16 px-4 py-3 border-b border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-between bg-white dark:bg-zinc-900 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                {/* Back Button for Mobile */}
                <button 
                  id="chat-mobile-back-btn"
                  onClick={() => setActiveChatId('')}
                  className="sm:hidden p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 -ml-1 transition-colors"
                  aria-label="Back to chat list"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <Link 
                  href={`/profile/${activeChat.id}`}
                  className="flex items-center gap-3 min-w-0 hover:opacity-90 transition-all group"
                  id={`chat-header-profile-link-${activeChat.id}`}
                >
                  <div className="relative flex-shrink-0">
                    <Image 
                      src={activeChat.avatarUrl} 
                      width={40} 
                      height={40} 
                      alt={activeChat.name} 
                      unoptimized
                      className="rounded-full w-10 h-10 object-cover border border-zinc-200 dark:border-zinc-800 group-hover:ring-2 group-hover:ring-zinc-300 dark:group-hover:ring-zinc-700 transition-all" 
                      referrerPolicy="no-referrer" 
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-900" />
                  </div>
                  
                  <div className="min-w-0">
                    <h2 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 truncate group-hover:underline">{activeChat.name}</h2>
                    <p className="text-[10px] text-zinc-400 font-medium truncate">
                      {activeChat.company ? `${activeChat.role} @ ${activeChat.company}` : activeChat.role}
                    </p>
                  </div>
                </Link>
              </div>

              {/* Chat Actions */}
              <div className="flex items-center gap-2.5 sm:gap-3.5 text-zinc-400">
                <button 
                  id="btn-call"
                  className="hover:text-zinc-800 dark:hover:text-zinc-200 p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-full transition-all"
                  aria-label="Audio call"
                >
                  <Phone className="w-4.5 h-4.5" />
                </button>
                <button 
                  id="btn-video"
                  className="hover:text-zinc-800 dark:hover:text-zinc-200 p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-full transition-all"
                  aria-label="Video call"
                >
                  <Video className="w-4.5 h-4.5" />
                </button>
                
                <span className="w-px h-5 bg-zinc-200 dark:bg-zinc-800 hidden sm:block" />

                {/* Review Toggle Button */}
                <button 
                  id="btn-toggle-review-panel"
                  onClick={() => {
                    setShowReviewPanel(!showReviewPanel);
                    setIsMobileReviewOpen(true);
                  }}
                  className={`p-2 rounded-full transition-all flex items-center gap-1.5 px-3.5 border ${
                    showReviewPanel 
                      ? 'bg-zinc-900 border-zinc-950 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:border-zinc-200 dark:text-zinc-950 dark:hover:bg-zinc-200' 
                      : 'bg-zinc-100 border-zinc-200/50 hover:bg-zinc-200/80 text-zinc-700 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-700'
                  }`}
                >
                  <Info className="w-4 h-4" />
                  <span className="text-xs font-semibold">Review</span>
                </button>
              </div>
            </div>

            {/* Scrollable Conversation Bubbles */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-zinc-50/50 dark:bg-zinc-950/20 flex flex-col gap-4">
              <div className="text-center my-3">
                <span className="inline-block px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800/60 text-[10px] font-semibold text-zinc-400 tracking-wide uppercase">
                  Workspace Thread
                </span>
              </div>
              
              {activeChat.messages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center my-auto">
                  <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4 ring-2 ring-zinc-200 dark:ring-zinc-700">
                    <Image 
                      src={activeChat.avatarUrl} 
                      width={64} 
                      height={64} 
                      alt={activeChat.name} 
                      unoptimized
                      className="rounded-full w-16 h-16 object-cover" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-zinc-50">
                    Say hello to {activeChat.name}!
                  </h3>
                  <p className="text-xs text-zinc-500 max-w-xs mt-2 leading-relaxed">
                    This is the start of your message history with {activeChat.name}. Send a project pitch or standard hello to start collaborating.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 mt-5">
                    <button 
                      type="button" 
                      onClick={() => setNewMessage("Hey! I'm interested in collaborating on your project.")}
                      className="px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-200 transition-all border border-zinc-200/50 dark:border-zinc-700/50"
                    >
                      👋 Say Hello
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setNewMessage("I checked out your pitch and would love to connect about partnering.")}
                      className="px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-200 transition-all border border-zinc-200/50 dark:border-zinc-700/50"
                    >
                      🚀 Share Interest
                    </button>
                  </div>
                </div>
              ) : (
                activeChat.messages.map((msg) => {
                  const activeAccountId = typeof window !== 'undefined' ? (localStorage.getItem('orbit_active_account_id') || 'personal-1') : 'personal-1';
                  const isMe = msg.senderId ? (msg.senderId === activeAccountId) : (msg.sender === 'me' && activeAccountId === 'personal-1');
                  
                  let senderAvatar = activeChat.avatarUrl;
                  let senderName = activeChat.name;

                  const msgSenderId = msg.senderId || (msg.sender === 'me' ? 'personal-1' : activeChat.id);
                  if (msgSenderId !== activeChat.id) {
                    const senderProfileStr = typeof window !== 'undefined' ? localStorage.getItem(`orbit_user_profile_${msgSenderId}`) : null;
                    if (senderProfileStr) {
                      try {
                        const parsed = JSON.parse(senderProfileStr);
                        senderAvatar = parsed.avatarUrl || `https://dummyimage.com/100x100/1e293b/ffffff?text=%24%7Bparsed.username%7D`;
                        senderName = parsed.name;
                      } catch(e) {}
                    } else if (msgSenderId === 'personal-1') {
                      senderAvatar = 'https://dummyimage.com/100x100/1e293b/ffffff?text=alexrivera';
                      senderName = 'Alex Rivera';
                    } else if (msgSenderId === 'personal-2') {
                      senderAvatar = 'https://dummyimage.com/100x100/1e293b/ffffff?text=govanmawila';
                      senderName = 'Govan Mawila';
                    }
                  }

                  return (
                    <div 
                      key={msg.id}
                      className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${isMe ? 'self-end flex-row-reverse' : 'self-start'}`}
                    >
                      {!isMe && (
                        <Link 
                          href={msgSenderId === activeChat.id ? `/profile/${activeChat.id}` : `/profile`} 
                          className="hover:opacity-80 transition-all shrink-0"
                          id={`chat-bubble-avatar-link-${msg.id}`}
                        >
                          <Image 
                            src={senderAvatar} 
                            width={32} 
                            height={32} 
                            alt={senderName} 
                            unoptimized
                            className="rounded-full w-8 h-8 flex-shrink-0 object-cover mt-0.5" 
                            referrerPolicy="no-referrer" 
                          />
                        </Link>
                      )}
                      <div className="flex flex-col gap-1">
                        {!isMe && (
                          <span className="text-[10px] font-semibold text-zinc-500 ml-1">
                            {senderName}
                          </span>
                        )}
                        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          isMe 
                            ? 'bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-950 rounded-tr-sm' 
                            : 'bg-white dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 border border-zinc-100 dark:border-zinc-800 rounded-tl-sm shadow-sm'
                        }`}>
                          <div>{msg.text}</div>
                          {msg.sharePostId && (() => {
                            try {
                              const storedPosts = localStorage.getItem('orbit_posts');
                              if (storedPosts) {
                                const posts = JSON.parse(storedPosts);
                                const post = posts.find((p: any) => p.id === msg.sharePostId);
                                if (post) {
                                  return (
                                    <div className="mt-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 text-left space-y-2 max-w-xs text-xs">
                                      <div className="flex items-center gap-2">
                                        <img 
                                          src={post.avatarUrl || 'https://dummyimage.com/100x100/1e293b/ffffff?text=default'} 
                                          alt={post.author} 
                                          className="rounded-full w-5 h-5 object-cover shrink-0" 
                                          referrerPolicy="no-referrer"
                                        />
                                        <span className="font-bold text-zinc-800 dark:text-zinc-200 truncate">{post.author}</span>
                                      </div>
                                      <p className="text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed text-[11px]">{post.content}</p>
                                      <Link 
                                        href="/" 
                                        className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-500 dark:text-indigo-400 hover:underline mt-1"
                                      >
                                        View Post
                                      </Link>
                                    </div>
                                  );
                                }
                              }
                            } catch(e){}
                            return null;
                          })()}
                        </div>
                        <span className={`text-[9px] text-zinc-400 mt-0.5 ${isMe ? 'text-right mr-1' : 'ml-1'}`}>
                          {msg.time}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Sticky Bottom Message Input Form */}
            <form 
              id="message-send-form"
              onSubmit={handleSendMessage} 
              className="p-4 border-t border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-900 flex items-center gap-3 shrink-0 pb-safe"
            >
              <button 
                type="button"
                id="btn-attach-image"
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                aria-label="Add image"
              >
                <ImageIcon className="w-5 h-5" />
              </button>
              <button 
                type="button"
                id="btn-attach-file"
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                aria-label="Attach documents"
              >
                <Paperclip className="w-5 h-5" />
              </button>
              
              <input 
                id="chat-message-input"
                type="text" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 bg-zinc-100/80 dark:bg-zinc-800/60 text-sm border-none rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-700 text-zinc-800 dark:text-zinc-100" 
                placeholder={`Message ${activeChat.name.split(' ')[0]}...`} 
              />
              
              <button 
                type="submit"
                id="chat-send-submit-btn"
                disabled={!newMessage.trim()}
                className={`w-10.5 h-10.5 rounded-full flex flex-shrink-0 items-center justify-center transition-all shadow-sm ${
                  newMessage.trim() 
                    ? 'bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-950 hover:scale-105' 
                    : 'bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600 cursor-not-allowed'
                }`}
                aria-label="Send Message"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-zinc-50/20 dark:bg-zinc-950/10">
            <Sparkles className="w-12 h-12 text-zinc-300 mb-3" />
            <h3 className="font-bold text-base text-zinc-800 dark:text-zinc-200">No chat active</h3>
            <p className="text-xs text-zinc-400 mt-1 max-w-xs text-center">Select a contact from the sidebar list to review files and start messaging.</p>
          </div>
        )}
      </div>

      {/* 3. DESKTOP REVIEW & ASSESSMENT PANEL */}
      {showReviewPanel && activeChat && (
        <div className="hidden lg:flex w-80 xl:w-96 flex-shrink-0 border-l border-zinc-200/50 dark:border-zinc-800/50 flex-col bg-white dark:bg-zinc-900 h-full overflow-y-auto">
          {/* Panel Header */}
          <div className="p-4 border-b border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-950/30">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5 text-zinc-700 dark:text-zinc-200" />
              <span className="font-display font-bold text-sm tracking-tight text-zinc-900 dark:text-zinc-50">Messaging Review</span>
            </div>
            <button 
              id="btn-close-review-desktop"
              onClick={() => setShowReviewPanel(false)}
              className="p-1 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
              aria-label="Hide review panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-5 flex-1 flex flex-col gap-6">
            {/* Candidate Identity */}
            <div className="text-center border-b border-zinc-100 dark:border-zinc-800/30 pb-4">
              <Link href={`/profile/${activeChat.id}`} className="block group">
                <Image 
                  src={activeChat.avatarUrl} 
                  alt={activeChat.name} 
                  width={80} 
                  height={80} 
                  unoptimized
                  className="rounded-full w-20 h-20 object-cover mx-auto shadow-md ring-4 ring-zinc-50 dark:ring-zinc-800/80 group-hover:scale-105 group-hover:ring-zinc-200 dark:group-hover:ring-zinc-700 transition-all" 
                  referrerPolicy="no-referrer" 
                />
                <h3 className="font-display font-bold text-base text-zinc-950 dark:text-white mt-3 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors group-hover:underline">{activeChat.name}</h3>
              </Link>
              <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mt-0.5">
                {activeChat.company ? `${activeChat.role} at ${activeChat.company}` : activeChat.role}
              </p>
              
              <div className="flex items-center justify-center gap-1.5 mt-2.5 text-zinc-400 text-xs">
                <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                <span>{activeChat.location}</span>
              </div>

              <div className="mt-3">
                <Link 
                  href={`/profile/${activeChat.id}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black tracking-wide uppercase text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg border border-zinc-200/50 dark:border-zinc-700/50 transition-all"
                >
                  View Orbit Profile
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Orbit Score & Star Rating Indicator */}
            <div className="bg-zinc-50/50 dark:bg-zinc-800/20 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Orbit Fit Rating</span>
                <span className="text-xs font-black text-zinc-900 dark:text-zinc-50 bg-white dark:bg-zinc-800 px-2 py-0.5 rounded-md border border-zinc-100 dark:border-zinc-700">
                  {reviewMatchScore}% Match
                </span>
              </div>
              
              {/* Star controls */}
              <div className="flex items-center gap-1.5 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    id={`review-star-btn-${star}`}
                    onClick={() => setReviewRating(star)}
                    className="transition-transform active:scale-90"
                  >
                    <Star className={`w-5 h-5 ${star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-zinc-300 dark:text-zinc-700'}`} />
                  </button>
                ))}
              </div>

              {/* Slider for precision match score adjusting */}
              <div className="mt-4">
                <div className="flex justify-between text-[10px] text-zinc-400 font-semibold mb-1">
                  <span>Adjust Match Score</span>
                  <span>{reviewMatchScore}%</span>
                </div>
                <input 
                  type="range" 
                  id="review-match-score-slider"
                  min="50" 
                  max="100" 
                  value={reviewMatchScore} 
                  onChange={(e) => setReviewMatchScore(Number(e.target.value))}
                  className="w-full accent-zinc-900 dark:accent-zinc-100 h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* Pitch & Bio Review details */}
            <div className="space-y-3.5">
              <h4 className="text-xs font-bold tracking-wider text-zinc-400 uppercase">Executive Summary</h4>
              <div className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed bg-zinc-50/30 p-3 rounded-xl border border-zinc-100/30 dark:bg-zinc-950/20 dark:border-zinc-900">
                <p className="font-semibold text-zinc-800 dark:text-zinc-200 mb-1">Professional Bio</p>
                {activeChat.bio}
              </div>
              <div className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed bg-zinc-50/30 p-3 rounded-xl border border-zinc-100/30 dark:bg-zinc-950/20 dark:border-zinc-900">
                <p className="font-semibold text-zinc-800 dark:text-zinc-200 mb-1">Project Proposal / Pitch</p>
                {activeChat.projectPitch}
              </div>
            </div>

            {/* Shared files viewer */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold tracking-wider text-zinc-400 uppercase">Shared Assets ({activeChat.sharedFiles.length})</h4>
              <div className="space-y-2">
                {activeChat.sharedFiles.map((file, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-200 dark:hover:border-zinc-700 transition-all">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 flex-shrink-0">
                        {file.type === 'PDF' && <FileText className="w-4 h-4 text-rose-500" />}
                        {file.type === 'Figma' && <FileCode className="w-4 h-4 text-indigo-500" />}
                        {file.type === 'Excel' && <FileSpreadsheet className="w-4 h-4 text-emerald-500" />}
                        {file.type === 'Image' && <ImageIcon className="w-4 h-4 text-blue-500" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200 truncate">{file.name}</p>
                        <p className="text-[10px] text-zinc-400 font-medium">{file.size}</p>
                      </div>
                    </div>
                    <button 
                      id={`btn-download-${i}`}
                      className="p-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg transition-colors"
                      aria-label="Download file"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Assessment Notes Section */}
            <div className="space-y-3 mt-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold tracking-wider text-zinc-400 uppercase">Evaluation Notes</h4>
                {activeChat.notes && (
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <Check className="w-3 h-3" /> Saved
                  </span>
                )}
              </div>
              <textarea
                id="review-notes-textarea-desktop"
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Type your review evaluation, partnership compatibility notes, or scheduling follow-ups..."
                className="w-full h-28 p-3 text-xs border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-950/40 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-700 leading-relaxed resize-none"
              />
              <button
                id="review-save-btn-desktop"
                onClick={handleSaveEvaluation}
                className="w-full flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 py-2.5 px-4 rounded-xl text-xs font-bold tracking-tight transition-all active:scale-[0.98] shadow-sm"
              >
                {savedFeedback ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Evaluation Persisted!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Candidate Assessment</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. MOBILE / OVERLAY SHEET FOR REVIEW & ASSESSMENT */}
      {isMobileReviewOpen && activeChat && (
        <div className="lg:hidden fixed inset-0 z-[150] flex justify-end pointer-events-auto">
          {/* Backdrop blur overlay */}
          <div 
            onClick={() => setIsMobileReviewOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity" 
          />

          {/* Sliding sheet */}
          <div className="relative w-full max-w-sm bg-white dark:bg-zinc-950 h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-4 border-b border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-950/30">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-zinc-700 dark:text-zinc-200" />
                <span className="font-display font-bold text-sm tracking-tight text-zinc-900 dark:text-zinc-50">Review Candidates</span>
              </div>
              <button 
                id="btn-close-review-mobile"
                onClick={() => setIsMobileReviewOpen(false)}
                className="p-1.5 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                aria-label="Close panel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable contents */}
            <div className="p-5 flex-1 overflow-y-auto space-y-6">
              {/* Candidate Bio summary */}
              <div className="text-center border-b border-zinc-100 dark:border-zinc-800/30 pb-4">
                <Link href={`/profile/${activeChat.id}`} className="block group" onClick={() => setIsMobileReviewOpen(false)}>
                  <Image 
                    src={activeChat.avatarUrl} 
                    alt={activeChat.name} 
                    width={72} 
                    height={72} 
                    unoptimized
                    className="rounded-full w-18 h-18 object-cover mx-auto shadow-md ring-4 ring-zinc-50 dark:ring-zinc-800/80 group-hover:scale-105 group-hover:ring-zinc-200 dark:group-hover:ring-zinc-700 transition-all" 
                    referrerPolicy="no-referrer" 
                  />
                  <h3 className="font-display font-bold text-base text-zinc-950 dark:text-white mt-3 group-hover:underline">{activeChat.name}</h3>
                </Link>
                <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {activeChat.company ? `${activeChat.role} at ${activeChat.company}` : activeChat.role}
                </p>
                <div className="flex items-center justify-center gap-1.5 mt-2 text-zinc-400 text-xs">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{activeChat.location}</span>
                </div>

                <div className="mt-3">
                  <Link 
                    href={`/profile/${activeChat.id}`}
                    onClick={() => setIsMobileReviewOpen(false)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black tracking-wide uppercase text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg border border-zinc-200/50 dark:border-zinc-700/50 transition-all"
                  >
                    View Orbit Profile
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* Match Score & Stars rating */}
              <div className="bg-zinc-50/50 dark:bg-zinc-800/20 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Orbit Fit Rating</span>
                  <span className="text-xs font-black text-zinc-900 dark:text-zinc-50 bg-white dark:bg-zinc-800 px-2 py-0.5 rounded-md border border-zinc-100 dark:border-zinc-700">
                    {reviewMatchScore}% Match
                  </span>
                </div>
                
                <div className="flex items-center gap-1.5 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      id={`review-mobile-star-${star}`}
                      onClick={() => setReviewRating(star)}
                      className="transition-transform active:scale-90"
                    >
                      <Star className={`w-5 h-5 ${star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-zinc-300 dark:text-zinc-700'}`} />
                    </button>
                  ))}
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-[10px] text-zinc-400 font-semibold mb-1">
                    <span>Adjust Match Score</span>
                    <span>{reviewMatchScore}%</span>
                  </div>
                  <input 
                    type="range" 
                    id="review-mobile-match-slider"
                    min="50" 
                    max="100" 
                    value={reviewMatchScore} 
                    onChange={(e) => setReviewMatchScore(Number(e.target.value))}
                    className="w-full accent-zinc-900 dark:accent-zinc-100 h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Pitch Summaries */}
              <div className="space-y-3.5">
                <h4 className="text-xs font-bold tracking-wider text-zinc-400 uppercase">Executive Summary</h4>
                <div className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed bg-zinc-50/30 p-3 rounded-xl border border-zinc-100/30 dark:bg-zinc-950/20 dark:border-zinc-900">
                  <p className="font-semibold text-zinc-800 dark:text-zinc-200 mb-1">Professional Bio</p>
                  {activeChat.bio}
                </div>
                <div className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed bg-zinc-50/30 p-3 rounded-xl border border-zinc-100/30 dark:bg-zinc-950/20 dark:border-zinc-900">
                  <p className="font-semibold text-zinc-800 dark:text-zinc-200 mb-1">Project Proposal / Pitch</p>
                  {activeChat.projectPitch}
                </div>
              </div>

              {/* Shared Assets */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold tracking-wider text-zinc-400 uppercase">Shared Assets ({activeChat.sharedFiles.length})</h4>
                <div className="space-y-2">
                  {activeChat.sharedFiles.map((file, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 flex-shrink-0">
                          {file.type === 'PDF' && <FileText className="w-4 h-4 text-rose-500" />}
                          {file.type === 'Figma' && <FileCode className="w-4 h-4 text-indigo-500" />}
                          {file.type === 'Excel' && <FileSpreadsheet className="w-4 h-4 text-emerald-500" />}
                          {file.type === 'Image' && <ImageIcon className="w-4 h-4 text-blue-500" />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200 truncate">{file.name}</p>
                          <p className="text-[10px] text-zinc-400 font-medium">{file.size}</p>
                        </div>
                      </div>
                      <button 
                        id={`btn-mobile-download-${i}`}
                        className="p-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg transition-colors"
                        aria-label="Download asset"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review Notes Input */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold tracking-wider text-zinc-400 uppercase">Evaluation Notes</h4>
                <textarea
                  id="review-notes-textarea-mobile"
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Type your review evaluation, partnership compatibility notes, or scheduling follow-ups..."
                  className="w-full h-28 p-3 text-xs border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-950/40 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-700 leading-relaxed resize-none"
                />
                <button
                  id="review-save-btn-mobile"
                  onClick={handleSaveEvaluation}
                  className="w-full flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-50 dark:text-zinc-950 py-2.5 px-4 rounded-xl text-xs font-bold tracking-tight transition-all active:scale-[0.98] shadow-sm"
                >
                  {savedFeedback ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Evaluation Saved!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Candidate Assessment</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
