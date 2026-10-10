'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Heart,
  MessageCircle,
  Repeat,
  Send,
  Bookmark,
  MoreHorizontal,
  Search,
  SquarePen,
  ArrowLeft,
  X,
  Check,
  Link2,
  Image as ImageIcon,
  FileText,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { safeStringify } from '@/lib/safe-json';

export interface CommentReply {
  id: string;
  author: string;
  role?: string;
  avatarUrl: string;
  content: string;
  time: string;
  likes: number;
  isLiked?: boolean;
}

export interface ThreadComment {
  id: string;
  author: string;
  role?: string;
  avatarUrl: string;
  content: string;
  time: string;
  likes: number;
  isLiked?: boolean;
  replies?: CommentReply[];
}

export interface ThreadPost {
  id: string;
  type: 'idea' | 'business_pitch' | 'project';
  author: string;
  username: string;
  role: string;
  time: string;
  content: string;
  likes: number;
  comments: number;
  reposts: number;
  shares: number;
  avatarUrl: string;
  isUserPost?: boolean;
  isLiked?: boolean;
  isSaved?: boolean;
  isReposted?: boolean;
  hasAttachment?: boolean;
  attachmentTitle?: string;
  attachmentType?: 'image' | 'video' | 'document';
  attachmentData?: string;
  commentsList: ThreadComment[];
}

const INITIAL_THREADS: ThreadPost[] = [
  {
    id: 'thread_1',
    type: 'idea',
    author: 'Sophia Martinez',
    username: 'sophiamartinez',
    role: 'Founder & AI Architect',
    time: '2h',
    content: 'Exploring a logistics optimization engine using reinforcement learning to reduce urban last-mile delivery costs by 22%.\n\nLooking for an experienced distributed systems engineer and a supply chain operator to build the MVP team. Drop your thoughts below or DM! 🚀 #startup #ai #logistics',
    likes: 42,
    comments: 2,
    reposts: 6,
    shares: 4,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    commentsList: [
      {
        id: 'c1',
        author: 'David Chen',
        role: 'Staff Systems Engineer',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        content: "Worked on fleet routing algorithms at Scale Logistics. The bottleneck is always dynamic traffic graph updates in real-time. Would love to collaborate on the solver architecture!",
        time: '1h',
        likes: 5,
        isLiked: false,
        replies: [
          {
            id: 'r1',
            author: 'Sophia Martinez',
            role: 'Founder',
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            content: "Exactly, David! We are testing an incremental A* variant on top of OSM graphs. Let's sync up today!",
            time: '30m',
            likes: 3,
            isLiked: false
          }
        ]
      },
      {
        id: 'c2',
        author: 'Elena Rostova',
        role: 'Creative Director & Designer',
        avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        content: 'Clean spatial data visualization will make this pitch irresistible to tier-1 seed funds. Count me in for the UI/UX.',
        time: '45m',
        likes: 2,
        isLiked: false,
        replies: []
      }
    ]
  },
  {
    id: 'thread_2',
    type: 'business_pitch',
    author: 'Ecovizion BioSystems',
    username: 'ecovizion',
    role: 'Clean Tech Co-op',
    time: '4h',
    content: 'We just completed prototype verification for our decentralized smart water-filtration system tailored for high-density apartments. 💧\n\n🎯 Seeking $75k in pre-seed angel funding for tooling and batch certification. Our deck and telemetry benchmarks are ready.',
    likes: 128,
    comments: 2,
    reposts: 19,
    shares: 11,
    avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    hasAttachment: true,
    attachmentTitle: 'Ecovizion_Executive_PitchDeck_2026.pdf',
    attachmentType: 'document',
    attachmentData: 'https://ecovizion.app/pitch',
    commentsList: [
      {
        id: 'c3',
        author: 'Marcus Vance',
        role: 'Venture Partner @ Summit Capital',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        content: 'Solid metrics on membrane lifecycle. Sent you a DM regarding our hardware climate cohort next month.',
        time: '3h',
        likes: 8,
        isLiked: false,
        replies: []
      }
    ]
  },
  {
    id: 'thread_3',
    type: 'project',
    author: 'Elena Rostova',
    username: 'elenarostova',
    role: 'Product Designer',
    time: '6h',
    content: 'Finished drafting the motion choreography guidelines for web experiences. Everything feels tactile and fluid with zero unnecessary fluff.\n\nWhat do you think of this approach to physical gesture physics in SaaS tools? ✨',
    likes: 215,
    comments: 1,
    reposts: 31,
    shares: 17,
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    hasAttachment: true,
    attachmentTitle: 'Choreography_Motion_Preview.mp4',
    attachmentType: 'video',
    attachmentData: 'https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4',
    commentsList: [
      {
        id: 'c4',
        author: 'David Chen',
        role: 'Staff Systems Engineer',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        content: 'The spring damping coefficients feel completely native. Fantastic job.',
        time: '4h',
        likes: 4,
        isLiked: false,
        replies: []
      }
    ]
  }
];

export default function HobnobThreadsPage() {
  const [posts, setPosts] = useState<ThreadPost[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('orbit_threads_posts');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_THREADS;
  });

  const [activeTab, setActiveTab] = useState<'for_you' | 'following' | 'ideas' | 'pitches' | 'saved'>('for_you');
  const [sortBy, setSortBy] = useState<'newest' | 'top' | 'commented'>('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [activeReplyPostId, setActiveReplyPostId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Composer State
  const [newContent, setNewContent] = useState('');
  const [newType, setNewType] = useState<'idea' | 'business_pitch' | 'project'>('idea');
  const [newAttachmentUrl, setNewAttachmentUrl] = useState('');
  const [newAttachmentTitle, setNewAttachmentTitle] = useState('');
  const [showAttachInput, setShowAttachInput] = useState(false);

  // User Profile
  const [currentUser] = useState<{
    name: string;
    username: string;
    avatarUrl: string;
  }>(() => {
    if (typeof window !== 'undefined') {
      try {
        const profileStr = localStorage.getItem('orbit_user_profile');
        if (profileStr) {
          const p = JSON.parse(profileStr);
          if (p.name || p.username) {
            return {
              name: p.name || 'You',
              username: (p.username || p.name || 'member').toLowerCase().replace(/\s+/g, ''),
              avatarUrl: p.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
            };
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    return {
      name: 'You',
      username: 'govanmawila',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
    };
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('orbit_threads_posts', safeStringify(posts));
    } catch (e) {
      console.error('Failed to sync threads to localStorage', e);
    }
  }, [posts]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  // Interactions
  const handleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const isLiked = !post.isLiked;
          return {
            ...post,
            isLiked,
            likes: isLiked ? post.likes + 1 : Math.max(0, post.likes - 1)
          };
        }
        return post;
      })
    );
  };

  const handleRepost = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const isReposted = !post.isReposted;
          showToast(isReposted ? 'Reposted to your profile' : 'Removed repost');
          return {
            ...post,
            isReposted,
            reposts: isReposted ? post.reposts + 1 : Math.max(0, post.reposts - 1)
          };
        }
        return post;
      })
    );
  };

  const handleSave = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const isSaved = !post.isSaved;
          showToast(isSaved ? 'Saved to bookmarks' : 'Removed from bookmarks');
          return {
            ...post,
            isSaved
          };
        }
        return post;
      })
    );
  };

  const handleShare = async (post: ThreadPost) => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard');
    } else {
      showToast('Link ready to share');
    }
  };

  const handleDeletePost = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    showToast('Thread deleted');
  };

  const handleAddComment = (postId: string) => {
    if (!replyText.trim()) return;
    const newComment: ThreadComment = {
      id: `c_${Date.now()}`,
      author: currentUser.name,
      role: 'Member',
      avatarUrl: currentUser.avatarUrl,
      content: replyText.trim(),
      time: 'Just now',
      likes: 0,
      isLiked: false,
      replies: []
    };

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments + 1,
            commentsList: [newComment, ...(post.commentsList || [])]
          };
        }
        return post;
      })
    );

    setReplyText('');
    setActiveReplyPostId(null);
    showToast('Reply published');
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    const newPost: ThreadPost = {
      id: `thread_${Date.now()}`,
      type: newType,
      author: currentUser.name,
      username: currentUser.username,
      role: newType === 'idea' ? 'Innovator' : newType === 'business_pitch' ? 'Pitch Creator' : 'Project Builder',
      time: 'Just now',
      content: newContent.trim(),
      likes: 0,
      comments: 0,
      reposts: 0,
      shares: 0,
      avatarUrl: currentUser.avatarUrl,
      isUserPost: true,
      hasAttachment: !!newAttachmentUrl.trim(),
      attachmentTitle: newAttachmentTitle.trim() || (newAttachmentUrl ? 'Attachment' : undefined),
      attachmentType: newAttachmentUrl.endsWith('.mp4') ? 'video' : 'document',
      attachmentData: newAttachmentUrl.trim() || undefined,
      commentsList: []
    };

    setPosts([newPost, ...posts]);
    setNewContent('');
    setNewAttachmentUrl('');
    setNewAttachmentTitle('');
    setShowAttachInput(false);
    setIsComposerOpen(false);
    showToast('Thread posted');
  };

  // Filter logic
  const filteredPosts = useMemo(() => {
    const filtered = posts.filter((post) => {
      // Tab filter
      if (activeTab === 'saved' && !post.isSaved) return false;
      if (activeTab === 'ideas' && post.type !== 'idea') return false;
      if (activeTab === 'pitches' && post.type !== 'business_pitch') return false;
      if (activeTab === 'following' && !post.isUserPost && post.id === 'thread_3') return false;

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const contentMatch = post.content?.toLowerCase().includes(q);
        const authorMatch = post.author?.toLowerCase().includes(q);
        const usernameMatch = post.username?.toLowerCase().includes(q);
        return contentMatch || authorMatch || usernameMatch;
      }

      return true;
    });

    // Apply sorting
    return [...filtered].sort((a, b) => {
      if (sortBy === 'top') {
        return (b.likes || 0) - (a.likes || 0);
      }
      if (sortBy === 'commented') {
        return (b.comments || 0) - (a.comments || 0);
      }
      // 'newest'
      // Try to compare based on timestamp in ID or fallback to default order (since new posts are prepended to `posts` array)
      const aTime = a.id.startsWith('thread_') ? parseInt(a.id.split('_')[1]) || 0 : 0;
      const bTime = b.id.startsWith('thread_') ? parseInt(b.id.split('_')[1]) || 0 : 0;
      if (aTime && bTime) {
        return bTime - aTime;
      }
      // If we don't have timestamp IDs (e.g., initial posts thread_1, thread_2, thread_3),
      // we can order them in descending order of their ID numeric values (e.g. thread_3 > thread_2 > thread_1).
      const aNum = parseInt(a.id.replace('thread_', '')) || 0;
      const bNum = parseInt(b.id.replace('thread_', '')) || 0;
      if (aNum && bNum) {
        return bNum - aNum;
      }
      return 0;
    });
  }, [posts, activeTab, searchQuery, sortBy]);

  return (
    <div id="hobnob-page-container" className="flex flex-col w-full min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 font-sans pb-12 selection:bg-zinc-200 dark:selection:bg-zinc-800">
      
      {/* Toast Feedback */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-zinc-900/90 dark:bg-zinc-100/90 text-white dark:text-zinc-900 text-xs font-semibold shadow-xl backdrop-blur-md flex items-center gap-2 pointer-events-none"
          >
            <Check className="w-3.5 h-3.5" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Threads Signature Top Header */}
      <header className="fixed top-0 left-0 right-0 z-40 w-full bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-zinc-100 dark:border-zinc-900/80 transition-colors">
        <div 
          style={{ width: '3.95in' }}
          className="w-[3.95in] max-w-full mx-auto px-2.5 h-14 flex items-center justify-between"
        >
          
          {/* Left: Back Link to main portal */}
          <div className="flex items-center gap-1.5">
            <Link
              href="/"
              className="p-1.5 -ml-1 rounded-full text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
              title="Return to Home"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>

          {/* Center: Signature Threads/Hobnob Mark */}
          <div className="flex items-center gap-1.5 cursor-pointer select-none">
            <div className="w-7 h-7 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-black flex items-center justify-center font-extrabold text-xs tracking-tighter shadow-sm">
              @
            </div>
            <span className="font-bold text-base tracking-tight text-zinc-950 dark:text-white">
              Hobnob
            </span>
          </div>

          {/* Right: Quick Search Toggle & Profile */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`p-1.5 rounded-full transition-colors ${
                isSearchOpen ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900'
              }`}
              title="Search"
              aria-label="Toggle search"
            >
              <Search className="w-4 h-4" />
            </button>
            <Link href="/profile" className="ml-1 shrink-0">
              <div className="w-7 h-7 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-800 hover:ring-2 hover:ring-zinc-400 transition-all">
                <Image
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  width={28}
                  height={28}
                  unoptimized
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </Link>
          </div>
        </div>

        {/* Collapsible Search Input Field */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{ width: '3.95in' }}
              className="w-[3.95in] max-w-full mx-auto px-2.5 pb-2.5 overflow-hidden"
            >
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search threads..."
                  autoFocus
                  className="w-full pl-8 pr-7 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-transparent focus:border-zinc-300 dark:focus:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 focus:outline-none transition-all"
                />
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Feed Container */}
      <main className="w-full flex-1 flex flex-col items-center pt-14">
        
        {/* Threads Inline "Start a thread..." Composer Bar */}
        <div 
          style={{ width: '3.95in', marginTop: '-0.435in' }}
          className="relative z-30 w-[3.95in] max-w-full mx-auto px-2.5 pt-0 pb-2.5 border-b border-zinc-100 dark:border-zinc-900 flex items-center justify-between gap-2.5 box-border"
        >
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 border border-zinc-200 dark:border-zinc-800">
              <Image
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                width={28}
                height={28}
                unoptimized
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <button
              onClick={() => setIsComposerOpen(true)}
              className="text-left text-xs text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 flex-1 truncate transition-colors py-1"
            >
              What&apos;s new? Start a thread...
            </button>
          </div>

          <button
            onClick={() => setIsComposerOpen(true)}
            className="px-2.5 py-1 rounded-full bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-[11px] font-bold tracking-tight transition-all active:scale-95 shrink-0"
          >
            Post
          </button>
        </div>

        {/* Sorting Segmented Tab Bar */}
        <div 
          style={{ width: '3.95in' }}
          className="w-[3.95in] max-w-full mx-auto px-2.5 py-2 border-b border-zinc-100 dark:border-zinc-900/60 flex items-center justify-between gap-1 box-border"
        >
          <div className="flex items-center gap-1 w-full bg-zinc-50 dark:bg-zinc-950/40 p-0.5 rounded-lg border border-zinc-100 dark:border-zinc-900">
            <button
              onClick={() => setSortBy('newest')}
              className={`flex-1 py-1 px-2 rounded-md text-[10px] font-semibold tracking-wide uppercase transition-all ${
                sortBy === 'newest'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-sm font-bold'
                  : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
            >
              Newest
            </button>
            <button
              onClick={() => setSortBy('top')}
              className={`flex-1 py-1 px-2 rounded-md text-[10px] font-semibold tracking-wide uppercase transition-all ${
                sortBy === 'top'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-sm font-bold'
                  : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
            >
              Top Upvoted
            </button>
            <button
              onClick={() => setSortBy('commented')}
              className={`flex-1 py-1 px-2 rounded-md text-[10px] font-semibold tracking-wide uppercase transition-all ${
                sortBy === 'commented'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-sm font-bold'
                  : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
            >
              Most Commented
            </button>
          </div>
        </div>

        {/* Thread Feed Posts List */}
        <div 
          style={{ width: '3.95in' }}
          className="w-[3.95in] max-w-full mx-auto divide-y divide-zinc-100 dark:divide-zinc-900/80 flex flex-col items-center"
        >
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => {
              const hasReplies = post.commentsList && post.commentsList.length > 0;
              const isReplyingCurrent = activeReplyPostId === post.id;

              return (
                <article
                  key={post.id}
                  style={{ width: '3.95in' }}
                  className="w-[3.95in] max-w-full mx-auto px-2.5 py-3.5 hover:bg-zinc-50/60 dark:hover:bg-zinc-950/40 transition-colors box-border"
                >
                  <div className="flex gap-2.5">
                    
                    {/* Left Column: Avatar + Threads Signature Vertical Connector Line */}
                    <div className="flex flex-col items-center shrink-0">
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900">
                          <Image
                            src={post.avatarUrl}
                            alt={post.author}
                            width={32}
                            height={32}
                            unoptimized
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        {/* Threads Follow badge (+) for non-user posts */}
                        {!post.isUserPost && (
                          <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center text-[9px] font-bold ring-2 ring-white dark:ring-black">
                            +
                          </div>
                        )}
                      </div>

                      {/* Iconic Threads Line (descends if replies exist or composer open) */}
                      {(hasReplies || isReplyingCurrent) && (
                        <div className="w-[2px] flex-1 my-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                      )}

                      {/* Mini stacked reply avatar indicator */}
                      {hasReplies && !isReplyingCurrent && (
                        <div className="w-3.5 h-3.5 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-800 mt-1 opacity-70">
                          <Image
                            src={post.commentsList[0].avatarUrl}
                            alt="replier"
                            width={14}
                            height={14}
                            unoptimized
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}
                    </div>

                    {/* Right Column: Content Body & Actions */}
                    <div className="flex-1 min-w-0">
                      
                      {/* Post Header Line */}
                      <div className="flex items-center justify-between gap-1 leading-snug">
                        <div className="flex items-center gap-1 flex-wrap min-w-0">
                          <span className="font-semibold text-xs text-zinc-950 dark:text-white truncate hover:underline cursor-pointer">
                            {post.author}
                          </span>
                          <span className="text-zinc-400 dark:text-zinc-500 text-[11px] truncate max-w-[80px]">
                            @{post.username}
                          </span>
                          <span className="text-zinc-400 dark:text-zinc-600 text-[10px]">·</span>
                          <span className="text-zinc-400 dark:text-zinc-500 text-[11px]">
                            {post.time}
                          </span>
                        </div>

                        {/* Three-Dot Menu Options */}
                        <div className="relative group shrink-0">
                          <button
                            className="p-1 rounded-full text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                            aria-label="More options"
                          >
                            <MoreHorizontal className="w-3.5 h-3.5" />
                          </button>
                          <div className="absolute right-0 top-full mt-1 hidden group-hover:flex flex-col min-w-[140px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg p-1 z-30">
                            <button
                              onClick={() => handleSave(post.id)}
                              className="w-full text-left px-2.5 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg flex items-center gap-2"
                            >
                              <Bookmark className="w-3.5 h-3.5" />
                              {post.isSaved ? 'Unsave' : 'Save'}
                            </button>
                            <button
                              onClick={() => handleShare(post)}
                              className="w-full text-left px-2.5 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg flex items-center gap-2"
                            >
                              <Link2 className="w-3.5 h-3.5" />
                              Copy link
                            </button>
                            {post.isUserPost && (
                              <button
                                onClick={() => handleDeletePost(post.id)}
                                className="w-full text-left px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg flex items-center gap-2"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Post Text Body */}
                      <p className="mt-1 text-xs leading-relaxed text-zinc-900 dark:text-zinc-200 whitespace-pre-line break-words font-normal">
                        {post.content}
                      </p>

                      {/* Post Attachments (Video, PDF, or Image Card) */}
                      {post.hasAttachment && (
                        <div className={`mt-2 rounded-xl overflow-hidden border ${post.attachmentType === 'video' ? 'border-sky-400/40 bg-sky-500' : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60'}`}>
                          {post.attachmentType === 'video' && post.attachmentData ? (
                            <video
                              src={post.attachmentData}
                              controls
                              className="w-full max-h-[220px] object-cover bg-sky-500 brightness-110"
                            />
                          ) : (
                            <div className="p-2.5 flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="p-1.5 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 shrink-0">
                                  <FileText className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                  <h4 className="text-[11px] font-semibold text-zinc-900 dark:text-white truncate">
                                    {post.attachmentTitle || 'Pitch Deck'}
                                  </h4>
                                  <p className="text-[10px] text-zinc-500">PDF</p>
                                </div>
                              </div>
                              <span className="text-[10px] font-bold text-zinc-900 dark:text-white px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 shrink-0">
                                View
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Threads Signature 4 Action Icons */}
                      <div className="flex items-center gap-3 mt-2.5 -ml-1 text-zinc-600 dark:text-zinc-400">
                        {/* Heart (Like) */}
                        <button
                          onClick={() => handleLike(post.id)}
                          className={`flex items-center gap-1 p-0.5 rounded-full hover:text-red-500 transition-colors ${
                            post.isLiked ? 'text-red-600 dark:text-red-500' : ''
                          }`}
                          aria-label="Like"
                        >
                          <Heart
                            className={`w-4 h-4 transition-transform ${
                              post.isLiked ? 'fill-current scale-110' : 'hover:scale-110'
                            }`}
                          />
                          {post.likes > 0 && (
                            <span className="text-[11px] font-medium">{post.likes}</span>
                          )}
                        </button>

                        {/* Reply */}
                        <button
                          onClick={() => setActiveReplyPostId(isReplyingCurrent ? null : post.id)}
                          className={`flex items-center gap-1 p-0.5 rounded-full hover:text-zinc-950 dark:hover:text-white transition-colors ${
                            isReplyingCurrent ? 'text-zinc-950 dark:text-white' : ''
                          }`}
                          aria-label="Reply"
                        >
                          <MessageCircle className="w-4 h-4 hover:scale-110 transition-transform" />
                          {post.comments > 0 && (
                            <span className="text-[11px] font-medium">{post.comments}</span>
                          )}
                        </button>

                        {/* Repost */}
                        <button
                          onClick={() => handleRepost(post.id)}
                          className={`flex items-center gap-1 p-0.5 rounded-full hover:text-green-600 transition-colors ${
                            post.isReposted ? 'text-green-600' : ''
                          }`}
                          aria-label="Repost"
                        >
                          <Repeat
                            className={`w-4 h-4 transition-transform ${
                              post.isReposted ? 'scale-110' : 'hover:scale-110'
                            }`}
                          />
                          {post.reposts > 0 && (
                            <span className="text-[11px] font-medium">{post.reposts}</span>
                          )}
                        </button>

                        {/* Share */}
                        <button
                          onClick={() => handleShare(post)}
                          className="flex items-center gap-1 p-0.5 rounded-full hover:text-zinc-950 dark:hover:text-white transition-colors"
                          aria-label="Share"
                        >
                          <Send className="w-4 h-4 hover:scale-110 transition-transform" />
                        </button>
                      </div>

                      {/* Threads Summary Activity Footer (Clean unboxed line) */}
                      <div className="mt-1.5 text-[11px] text-zinc-400 dark:text-zinc-500 font-normal">
                        {post.comments > 0 && (
                          <span>
                            {post.comments} {post.comments === 1 ? 'reply' : 'replies'}
                          </span>
                        )}
                        {post.comments > 0 && post.likes > 0 && <span> · </span>}
                        {post.likes > 0 && (
                          <span>
                            {post.likes} {post.likes === 1 ? 'like' : 'likes'}
                          </span>
                        )}
                      </div>

                      {/* Inline Reply Input Box (When replying) */}
                      {isReplyingCurrent && (
                        <div className="mt-2.5 pt-2 border-t border-zinc-100 dark:border-zinc-900 flex gap-2">
                          <div className="w-6 h-6 rounded-full overflow-hidden shrink-0">
                            <Image
                              src={currentUser.avatarUrl}
                              alt={currentUser.name}
                              width={24}
                              height={24}
                              unoptimized
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <input
                              type="text"
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder={`Reply to @${post.username}...`}
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleAddComment(post.id);
                              }}
                              className="w-full px-2.5 py-1 text-xs rounded-lg bg-zinc-100 dark:bg-zinc-900 border-none focus:outline-none focus:ring-1 focus:ring-zinc-400 text-zinc-900 dark:text-zinc-100"
                            />
                            <div className="flex items-center justify-end gap-1.5 mt-1.5">
                              <button
                                onClick={() => setActiveReplyPostId(null)}
                                className="px-2 py-0.5 text-[11px] text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleAddComment(post.id)}
                                disabled={!replyText.trim()}
                                className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 disabled:opacity-40"
                              >
                                Reply
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Thread Replies List (Connected visually) */}
                      {hasReplies && (
                        <div className="mt-2.5 space-y-2 pt-1">
                          {post.commentsList.map((c) => (
                            <div key={c.id} className="flex gap-2 text-xs">
                              <div className="w-5 h-5 rounded-full overflow-hidden shrink-0 mt-0.5 border border-zinc-200 dark:border-zinc-800">
                                <Image
                                  src={c.avatarUrl}
                                  alt={c.author}
                                  width={20}
                                  height={20}
                                  unoptimized
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                              <div className="flex-1 min-w-0 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl p-2 border border-zinc-100 dark:border-zinc-800/60">
                                <div className="flex items-center justify-between">
                                  <span className="font-semibold text-[11px] text-zinc-950 dark:text-white truncate">
                                    {c.author}
                                  </span>
                                  <span className="text-[10px] text-zinc-400 shrink-0">{c.time}</span>
                                </div>
                                <p className="mt-0.5 text-[11px] text-zinc-800 dark:text-zinc-200 leading-snug">
                                  {c.content}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div 
              style={{ width: '3.95in' }}
              className="w-[3.95in] max-w-full mx-auto text-center py-16 px-3"
            >
              <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-900 mx-auto flex items-center justify-center text-zinc-400 mb-2.5">
                <SquarePen className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
                No threads in this view
              </h3>
              <p className="text-[11px] text-zinc-500 mt-1 max-w-[200px] mx-auto">
                {searchQuery
                  ? `No matches found for "${searchQuery}".`
                  : activeTab === 'saved'
                  ? 'Posts you bookmark will appear here.'
                  : 'Start the conversation by sharing an idea or pitch!'}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveTab('for_you');
                  setIsComposerOpen(true);
                }}
                className="mt-3 px-3 py-1.5 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                Start a thread
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Threads Interactive Composer Modal (New Thread) */}
      <AnimatePresence>
        {isComposerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-[540px] bg-white dark:bg-zinc-950 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="px-5 py-3.5 border-b border-zinc-100 dark:border-zinc-900 flex items-center justify-between">
                <span className="font-bold text-sm text-zinc-950 dark:text-white">
                  New thread
                </span>
                <button
                  onClick={() => setIsComposerOpen(false)}
                  className="p-1 rounded-full text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleCreatePost} className="p-5 flex-1 overflow-y-auto">
                <div className="flex gap-3">
                  {/* Left: Avatar with thread line */}
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-800 shrink-0">
                      <Image
                        src={currentUser.avatarUrl}
                        alt={currentUser.name}
                        width={40}
                        height={40}
                        unoptimized
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="w-[2px] flex-1 my-2 bg-zinc-200 dark:bg-zinc-800 rounded-full min-h-[30px]" />
                  </div>

                  {/* Right: Text area & controls */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-zinc-950 dark:text-white">
                        {currentUser.username}
                      </span>

                      {/* Thread Category Selector */}
                      <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-full text-[11px] font-semibold">
                        <button
                          type="button"
                          onClick={() => setNewType('idea')}
                          className={`px-2.5 py-0.5 rounded-full transition-colors ${
                            newType === 'idea'
                              ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-sm'
                              : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                          }`}
                        >
                          Idea
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewType('business_pitch')}
                          className={`px-2.5 py-0.5 rounded-full transition-colors ${
                            newType === 'business_pitch'
                              ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-sm'
                              : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                          }`}
                        >
                          Pitch
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewType('project')}
                          className={`px-2.5 py-0.5 rounded-full transition-colors ${
                            newType === 'project'
                              ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-sm'
                              : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                          }`}
                        >
                          Project
                        </button>
                      </div>
                    </div>

                    <textarea
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      placeholder="Start a thread... Pitch an idea, project, or opportunity"
                      rows={4}
                      autoFocus
                      className="w-full mt-2 text-[15px] bg-transparent border-none focus:outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 resize-none leading-relaxed"
                    />

                    {/* Attachment preview / input */}
                    {showAttachInput && (
                      <div className="mt-3 p-3 bg-zinc-50 dark:bg-zinc-900 rounded-2xl space-y-2 border border-zinc-200 dark:border-zinc-800">
                        <input
                          type="text"
                          value={newAttachmentTitle}
                          onChange={(e) => setNewAttachmentTitle(e.target.value)}
                          placeholder="Attachment title (e.g. Seed Pitch Deck)"
                          className="w-full text-xs px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:outline-none"
                        />
                        <input
                          type="text"
                          value={newAttachmentUrl}
                          onChange={(e) => setNewAttachmentUrl(e.target.value)}
                          placeholder="Link or Media URL (PDF, MP4, image)"
                          className="w-full text-xs px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:outline-none"
                        />
                      </div>
                    )}

                    {/* Bottom Action icons & Post button */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-900">
                      <div className="flex items-center gap-2 text-zinc-400">
                        <button
                          type="button"
                          onClick={() => setShowAttachInput(!showAttachInput)}
                          className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
                          title="Attach document or media"
                        >
                          <Link2 className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAttachInput(!showAttachInput)}
                          className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
                          title="Add media"
                        >
                          <ImageIcon className="w-5 h-5" />
                        </button>
                      </div>

                      <button
                        type="submit"
                        disabled={!newContent.trim()}
                        className="px-5 py-2 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-bold tracking-tight hover:opacity-90 active:scale-95 disabled:opacity-40 transition-all"
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
