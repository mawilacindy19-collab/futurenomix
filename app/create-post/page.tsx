'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { safeStringify } from '@/lib/safe-json';
import { 
  ArrowLeft, 
  Lightbulb, 
  Image as ImageIcon, 
  Video, 
  Briefcase, 
  FileText, 
  Send, 
  Sparkles, 
  X, 
  CheckCircle2,
  Globe,
  Plus,
  Users,
  BarChart3
} from 'lucide-react';
import Image from 'next/image';
import { cn, compressImage } from '@/lib/utils';
import { motion } from 'motion/react';
import { saveVideo, captureVideoThumbnail } from '@/lib/indexed-db';

type PostType = 'idea' | 'photo' | 'video' | 'pitch' | 'document' | 'poll';

interface SuggestionTarget {
  id: string;
  name: string;
  username: string;
  type: 'user' | 'community';
  avatarUrl?: string;
  subtitle: string;
  bio?: string;
  followers?: string;
  connections?: string;
  joined?: string;
  skills?: string[];
  bannerGradient?: string;
}

const SUGGESTION_TARGETS: SuggestionTarget[] = [
  {
    id: 'user_sophia',
    name: 'Sophia Martinez',
    username: 'Sophia Martinez',
    type: 'user',
    avatarUrl: 'https://dummyimage.com/100x100/1e293b/ffffff&text=logo',
    subtitle: 'Entrepreneur | Focus: AI in Logistics',
    bio: 'Pioneering smarter shipping lines. Ex-McKinsey consultant, MIT Log Lab alum. Building Orbit Logistics.',
    followers: '1,420',
    connections: '500+',
    joined: 'Jan 2025',
    skills: ['AI Operations', 'Logistics', 'Fundraising', 'B2B Sales'],
    bannerGradient: 'from-blue-600 to-indigo-600'
  },
  {
    id: 'user_ecovizion',
    name: 'Ecovizion Ltd',
    username: 'Ecovizion Ltd',
    type: 'user',
    avatarUrl: 'https://dummyimage.com/100x100/1e293b/ffffff&text=logo',
    subtitle: 'Clean Tech Startup',
    bio: 'On a mission to democratize clean drinking water. Smart residential IoT filtration systems with zero waste.',
    followers: '3,840',
    connections: '120+',
    joined: 'Nov 2024',
    skills: ['Hardware', 'IoT', 'Sustainability', 'Manufacturing'],
    bannerGradient: 'from-emerald-600 to-teal-600'
  },
  {
    id: 'user_david',
    name: 'David Chen',
    username: 'David Chen',
    type: 'user',
    avatarUrl: 'https://dummyimage.com/100x100/1e293b/ffffff&text=logo',
    subtitle: 'Senior Software Engineer',
    bio: 'Distributed systems wrangler & React developer. Formerly Netflix & Stripe. Building highly available fin-tech APIs.',
    followers: '2,150',
    connections: '840',
    joined: 'Mar 2024',
    skills: ['Go', 'TypeScript', 'Next.js', 'PostgreSQL', 'Redis'],
    bannerGradient: 'from-amber-500 to-orange-600'
  },
  {
    id: 'user_elena',
    name: 'Elena Rostova',
    username: 'Elena Rostova',
    type: 'user',
    avatarUrl: 'https://dummyimage.com/100x100/1e293b/ffffff&text=logo',
    subtitle: 'Tech Co-founder & CTO',
    bio: 'Translating research paper architectures to production systems. Focus on LLM fine-tuning and agent security.',
    followers: '4,100',
    connections: '620',
    joined: 'Jun 2024',
    skills: ['LLMs', 'PyTorch', 'Vector Databases', 'Python', 'MLOps'],
    bannerGradient: 'from-purple-600 to-pink-600'
  },
  {
    id: 'user_marcus',
    name: 'Marcus Vance',
    username: 'Marcus Vance',
    type: 'user',
    avatarUrl: 'https://dummyimage.com/100x100/1e293b/ffffff&text=logo',
    subtitle: 'Venture Capital Partner',
    bio: 'Investing in seed to Series A generative tech & deep infra. Former founder with 2 exits. Coffee enthusiast.',
    followers: '8,900',
    connections: '1,000+',
    joined: 'Sep 2023',
    skills: ['Deal Sourcing', 'Valuation', 'Growth Scaling', 'Board Advising'],
    bannerGradient: 'from-rose-500 to-red-600'
  },
  {
    id: 'user_alex',
    name: 'Alex Rivera',
    username: 'Alex Rivera',
    type: 'user',
    avatarUrl: 'https://dummyimage.com/100x100/1e293b/ffffff&text=logo',
    subtitle: 'Entrepreneur · Full Stack Developer',
    bio: 'Building creative software at the intersection of UI design & real-time communication. Orbit creator.',
    followers: '12,400',
    connections: '1,500+',
    joined: 'Jan 2024',
    skills: ['Next.js', 'TailwindCSS', 'WebSockets', 'UI/UX Design'],
    bannerGradient: 'from-violet-600 to-purple-600'
  },
  {
    id: 'comm_sf',
    name: 'SF Bay Area Founders',
    username: 'SF Bay Area Founders',
    type: 'community',
    avatarUrl: 'https://dummyimage.com/100x100/1e293b/ffffff&text=logo',
    subtitle: '12.4K Members · Very Active',
    bio: 'A supportive community for startup founders, builders, and early-stage operators in the SF Bay Area.',
    followers: '12,400',
    connections: 'Active Daily',
    joined: 'Oct 2023',
    skills: ['Networking', 'Pitch Events', 'Mentorship', 'Socials'],
    bannerGradient: 'from-sky-500 to-blue-600'
  },
  {
    id: 'comm_ai',
    name: 'AI in Supply Chain',
    username: 'AI in Supply Chain',
    type: 'community',
    avatarUrl: 'https://dummyimage.com/100x100/1e293b/ffffff&text=logo',
    subtitle: '4.2K Members · Active',
    bio: 'Sharing and debating real-world machine learning solutions for logistics, warehouse automation, and global trade.',
    followers: '4,200',
    connections: 'Active Weekly',
    joined: 'Feb 2024',
    skills: ['Machine Learning', 'Logistics Tech', 'Automation'],
    bannerGradient: 'from-teal-500 to-cyan-600'
  },
  {
    id: 'comm_women',
    name: 'Women in FinTech',
    username: 'Women in FinTech',
    type: 'community',
    avatarUrl: 'https://dummyimage.com/100x100/1e293b/ffffff&text=logo',
    subtitle: '8.7K Members · Very Active',
    bio: 'Empowering women builders, researchers, and venture capitalists in financial technologies globally.',
    followers: '8,700',
    connections: 'Active Daily',
    joined: 'Dec 2023',
    skills: ['FinTech', 'Mentorship', 'Career Growth', 'Peer Review'],
    bannerGradient: 'from-fuchsia-600 to-pink-500'
  },
  {
    id: 'comm_hardware',
    name: 'Hardware Pioneers',
    username: 'Hardware Pioneers',
    type: 'community',
    avatarUrl: 'https://dummyimage.com/100x100/1e293b/ffffff&text=logo',
    subtitle: '2.9K Members · Active',
    bio: 'A group dedicated to bringing physical products to life. Silicon, circuit boards, industrial design, and scaling.',
    followers: '2,900',
    connections: 'Active Weekly',
    joined: 'Apr 2024',
    skills: ['CAD', 'PCB Design', '3D Printing', 'Sourcing'],
    bannerGradient: 'from-amber-600 to-red-500'
  }
];

export default function CreatePostPage() {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [postType, setPostType] = useState<PostType>('idea');
  const [pollOptions, setPollOptions] = useState([{id: '1', text: ''}, {id: '2', text: ''}]);
  const [attachment, setAttachment] = useState<string | null>(null);
  const [userName, setUserName] = useState('Alex Rivera');
  const [userUsername, setUserUsername] = useState('alexrivera');
  const [userAvatar, setUserAvatar] = useState<string | null>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const loadData = () => {
        try {
          const activeId = localStorage.getItem('orbit_active_account_id') || 'personal-1';
          const storedAccounts = localStorage.getItem('orbit_accounts');
          let currentAcc = null;
          if (storedAccounts) {
            const accounts = JSON.parse(storedAccounts);
            currentAcc = accounts.find((a: any) => a.id === activeId);
          }
          
          if (currentAcc) {
            setUserName(currentAcc.name);
            setUserUsername(currentAcc.username);
            if (currentAcc.avatarUrl) {
              setUserAvatar(currentAcc.avatarUrl);
            } else {
              setUserAvatar(null);
            }
          } else {
            const stored = localStorage.getItem('orbit_user_profile');
            if (stored) {
              const parsed = JSON.parse(stored);
              if (parsed.name) setUserName(parsed.name);
              if (parsed.username) setUserUsername(parsed.username);
              if (parsed.avatarUrl) setUserAvatar(parsed.avatarUrl);
            }
          }
        } catch (e) {}
      };
      loadData();
      window.addEventListener('storage', loadData);
      return () => window.removeEventListener('storage', loadData);
    }
  }, []);
  
  // Real file uploads states
  const [attachmentData, setAttachmentData] = useState<string | null>(null);
  const [attachmentType, setAttachmentType] = useState<'photo' | 'video' | 'document' | null>(null);
  const [attachmentTitle, setAttachmentTitle] = useState('');
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const [videoThumbnail, setVideoThumbnail] = useState<string | null>(null);

  const [isPosting, setIsPosting] = useState(false);
  const [postedSuccess, setPostedSuccess] = useState(false);

  // Mention system state hooks
  const [showMentionSuggestions, setShowMentionSuggestions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionStartIndex, setMentionStartIndex] = useState(-1);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const [hoveredSuggestionIndex, setHoveredSuggestionIndex] = useState<number | null>(null);

  const checkMention = (text: string, selectionStart: number) => {
    const textBeforeCursor = text.substring(0, selectionStart);
    const lastAtOffset = textBeforeCursor.lastIndexOf('@');
    
    if (lastAtOffset !== -1) {
      const textAfterAt = textBeforeCursor.substring(lastAtOffset + 1);
      const charBeforeAt = lastAtOffset > 0 ? textBeforeCursor.charAt(lastAtOffset - 1) : '';
      const isValidTrigger = lastAtOffset === 0 || /\s/.test(charBeforeAt);
      
      // Allow name searching with space, up to 25 characters max, no newline
      if (isValidTrigger && !/\n/.test(textAfterAt) && textAfterAt.length < 25) {
        setMentionQuery(textAfterAt);
        setMentionStartIndex(lastAtOffset);
        setShowMentionSuggestions(true);
        setActiveSuggestionIndex(0);
        return;
      }
    }
    
    setShowMentionSuggestions(false);
  };

  const insertMention = (target: SuggestionTarget) => {
    const textBeforeMention = content.substring(0, mentionStartIndex);
    const textAfterMention = content.substring(mentionStartIndex + mentionQuery.length + 1);
    
    const insertion = `@${target.name} `;
    const newContent = textBeforeMention + insertion + textAfterMention;
    
    setContent(newContent);
    setShowMentionSuggestions(false);
    
    setTimeout(() => {
      const textarea = document.getElementById('post-textarea') as HTMLTextAreaElement;
      if (textarea) {
        textarea.focus();
        const cursorPosition = mentionStartIndex + insertion.length;
        textarea.setSelectionRange(cursorPosition, cursorPosition);
      }
    }, 10);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showMentionSuggestions && filteredSuggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveSuggestionIndex((prev) => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveSuggestionIndex((prev) => 
          prev > 0 ? prev - 1 : filteredSuggestions.length - 1
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        insertMention(filteredSuggestions[activeSuggestionIndex]);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setShowMentionSuggestions(false);
      }
    }
  };

  const handleTextareaSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    checkMention(textarea.value, textarea.selectionStart);
  };

  const filteredSuggestions = SUGGESTION_TARGETS.filter(target => {
    const query = mentionQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      target.name.toLowerCase().includes(query) ||
      target.username.toLowerCase().replace(/\s+/g, '').includes(query.replace(/\s+/g, ''))
    );
  });

  // Hidden native file inputs refs
  const photoInputRef = React.useRef<HTMLInputElement>(null);
  const videoInputRef = React.useRef<HTMLInputElement>(null);
  const documentInputRef = React.useRef<HTMLInputElement>(null);

  // Handle incoming type from query parameters (e.g. from CreatePostBar)
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const initialType = searchParams.get('type') as PostType | null;
      if (initialType) {
        setTimeout(() => {
          if (initialType === 'photo') {
            setPostType('photo');
            photoInputRef.current?.click();
          } else if (initialType === 'video') {
            setPostType('video');
            videoInputRef.current?.click();
          } else if (initialType === 'document') {
            setPostType('document');
            documentInputRef.current?.click();
          } else if (initialType === 'pitch') {
            setPostType('pitch');
          } else if (initialType === 'poll') {
            setPostType('poll');
          } else {
            setPostType('idea');
          }
        }, 0);
      }
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'video' | 'document') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Clean up old object URL if exists
    if (attachmentType === 'video' && attachmentData && attachmentData.startsWith('blob:')) {
      URL.revokeObjectURL(attachmentData);
    }

    setAttachmentTitle(file.name);
    setAttachmentType(type);
    setPostType(type);

    if (type === 'video') {
      setSelectedVideoFile(file);
      const objectUrl = URL.createObjectURL(file);
      setAttachmentData(objectUrl);
      setVideoThumbnail(null);
      
      // Capture video frame thumbnail in real-time
      captureVideoThumbnail(file).then(thumbnailUrl => {
        setVideoThumbnail(thumbnailUrl);
      }).catch(err => {
        console.error('Failed to capture video thumbnail:', err);
      });
    } else {
      setSelectedVideoFile(null);
      const reader = new FileReader();
      reader.onload = async (event) => {
        const dataUrl = event.target?.result as string;
        if (file.type.startsWith('image/')) {
          try {
            const compressed = await compressImage(dataUrl, 800, 800, 0.7);
            setAttachmentData(compressed);
          } catch (e) {
            setAttachmentData(dataUrl);
          }
        } else {
          setAttachmentData(dataUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !attachmentData) return;

    // Get community from URL
    const searchParams = new URLSearchParams(window.location.search);
    const communityName = searchParams.get('community');

    setIsPosting(true);
    
    const postId = 'user_post_' + Date.now();

    // Save to localStorage
    try {
      const stored = localStorage.getItem('orbit_posts');
      let currentPosts = [];
      if (stored) {
        currentPosts = JSON.parse(stored);
      } else {
        // Default seed posts
        currentPosts = [
          {
            id: 'default_1',
            type: 'idea',
            author: 'Sophia Martinez',
            role: 'Entrepreneur | Focus: AI in Logistics',
            time: '2h ago',
            content: 'I am exploring a new logistics optimization algorithm using AI to reduce last-mile delivery costs by 20%. Looking for an experienced backend developer and a supply chain expert to form a startup team. Hit me up if interested! 🚀 #logistics #ai #startup',
            likes: 24,
            comments: 8,
            shares: 3,
            avatarUrl: 'https://dummyimage.com/100x100/1e293b/ffffff&text=logo'
          },
          {
            id: 'default_2',
            type: 'business_pitch',
            author: 'Ecovizion Ltd',
            role: 'Clean Tech Startup',
            time: '5h ago',
            content: 'We have successfully prototyped our first smart water-filtration system for urban apartments. Seeking R50k in seed funding to scale our manufacturing capabilities. See our deck attached below.',
            likes: 115,
            comments: 42,
            shares: 12,
            avatarUrl: 'https://dummyimage.com/100x100/1e293b/ffffff&text=logo',
            hasAttachment: true,
            attachmentTitle: 'Ecovizion_PitchDeck_2026.pdf'
          },
          {
            id: 'default_3',
            type: 'project',
            author: 'David Chen',
            role: 'Senior Software Engineer',
            time: '12h ago',
            content: 'I have some extra cycles on weekends and want to join a fast-paced fintech startup as a technical co-founder. Check out my GitHub and bio. #lookingforopportunities',
            likes: 67,
            comments: 14,
            shares: 5,
            avatarUrl: 'https://dummyimage.com/100x100/1e293b/ffffff&text=logo'
          }
        ];
      }

      let storedAttachmentData = attachmentData;

      if (selectedVideoFile && attachmentType === 'video') {
        try {
          await saveVideo(postId, selectedVideoFile);
          storedAttachmentData = 'indexedDB';
        } catch (dbError) {
          console.error('Failed to save video to IndexedDB:', dbError);
          storedAttachmentData = 'fallback';
        }
      } else if (attachmentData && attachmentData.length > 100 * 1024) {
        try {
          sessionStorage.setItem(`orbit_attachment_${postId}`, attachmentData);
          storedAttachmentData = 'sessionStorage';
        } catch (sessionError) {
          console.warn('Session storage limit exceeded, using fallback reference', sessionError);
          storedAttachmentData = 'fallback';
        }
      }

      let authorName = 'Alex Rivera';
      let authorRole = 'Entrepreneur · Full Stack Developer · UI/UX Designer';
      let authorUsername = 'alexrivera';
      let authorAvatarUrl = '';
      const activeAccountId = localStorage.getItem('orbit_active_account_id') || 'personal-1';

      try {
        const storedAccounts = localStorage.getItem('orbit_accounts');
        let currentAcc = null;
        if (storedAccounts) {
          const accounts = JSON.parse(storedAccounts);
          currentAcc = accounts.find((a: any) => a.id === activeAccountId);
        }

        if (currentAcc) {
          if (currentAcc.name) authorName = currentAcc.name;
          if (currentAcc.type === 'business') {
             authorRole = currentAcc.name;
          } else if (currentAcc.bio) {
             authorRole = currentAcc.bio;
          }
          if (currentAcc.username) authorUsername = currentAcc.username;
          if (currentAcc.avatarUrl) authorAvatarUrl = currentAcc.avatarUrl;
        } else {
          const storedProfileStr = localStorage.getItem('orbit_user_profile');
          if (storedProfileStr) {
            const parsed = JSON.parse(storedProfileStr);
            if (parsed.name) authorName = parsed.name;
            if (parsed.role) authorRole = parsed.role;
            if (parsed.username) authorUsername = parsed.username;
            if (parsed.avatarUrl) authorAvatarUrl = parsed.avatarUrl;
          }
        }
      } catch (e) {}

      const validPollOptions = postType === 'poll' ? pollOptions.filter(opt => opt.text.trim().length > 0).map(opt => ({ id: opt.id, text: opt.text.trim(), votes: 0 })) : undefined;

      const userPost = {
        id: postId,
        accountId: activeAccountId,
        type: postType === 'pitch' ? 'business_pitch' : postType,
        author: authorName,
        role: authorRole,
        time: 'Just now',
        createdAt: Date.now(),
        content: content.trim(),
        title: postTitle.trim(),
        likes: 0,
        comments: 0,
        shares: 0,
        avatarUrl: authorAvatarUrl || `https://dummyimage.com/100x100/1e293b/ffffff&text=${authorUsername}`,
        attachment: attachment || (attachmentData ? (attachmentType === 'document' ? attachmentTitle : attachmentType) : undefined),
        attachmentType: attachmentType || (postType === 'photo' ? 'photo' : postType === 'video' ? 'video' : postType === 'document' ? 'document' : undefined),
        attachmentData: attachmentData || undefined,
        attachmentTitle: attachmentTitle || undefined,
        videoThumbnail: videoThumbnail || undefined,
        poll: postType === 'poll' ? { question: postTitle || content, options: validPollOptions, totalVotes: 0, userVotedOptionId: undefined } : undefined,
      };

      // Prepend user post to the feed
      const updatedPosts = [userPost, ...currentPosts];

      try {
        localStorage.setItem('orbit_posts', safeStringify(updatedPosts));
      } catch (storageError: any) {
        console.warn('Initial save failed due to storage limits. Saving by stripping only the newly added post attachment data to protect existing feed...', storageError);
        
        // Ensure that uploading a document or any file does not change the other posts on the home feed
        const cleanUserPost = {
          ...userPost,
          attachmentData: undefined // strip only this new heavy attachment data to ensure it fits
        };

        const fallbackPosts = [cleanUserPost, ...currentPosts];

        try {
          localStorage.setItem('orbit_posts', safeStringify(fallbackPosts));
        } catch (secondError) {
          console.error('Failed to save even basic metadata to localStorage:', secondError);
        }
      }
    } catch (err) {
      console.error('Failed to save post locally:', err);
    }

    setTimeout(() => {
      setIsPosting(false);
      setPostedSuccess(true);
      setTimeout(() => {
        router.push(`/feed?highlight=${postId}#post-${postId}`);
      }, 1000);
    }, 800);
  };

  const handleAttachMockFile = (type: PostType) => {
    if (type === 'photo') {
      photoInputRef.current?.click();
    } else if (type === 'video') {
      videoInputRef.current?.click();
    } else if (type === 'document') {
      documentInputRef.current?.click();
    } else {
      setAttachment(null);
      setAttachmentData(null);
      setAttachmentTitle('');
      setAttachmentType(null);
      setPostType('idea');
    }
  };

  return (
    <div className="min-h-screen bg-transparent pb-12">
      {/* Top Header */}
      <div className="sticky top-0 z-35 bg-card border-b border-border px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.back()} 
            className="p-1.5 hover:bg-secondary rounded-full transition-colors text-foreground"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-display font-bold text-foreground">Create a Post</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            orbit AI Assisted
          </span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 mt-6">
        {postedSuccess ? (
          <div className="fixed inset-0 z-50 bg-transparent overflow-hidden">
            {/* Blurry home feed representation */}
            <div className="w-full h-full flex flex-col blur-[6px] saturate-[1.3] opacity-85 pointer-events-none select-none bg-background/80">
              {/* Header */}
              <div className="border-b border-border bg-card/90 px-4 h-14 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-11 h-11 rounded-lg bg-transparent flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M 25 25 L 47.5 25 L 42.5 35 L 37.5 35 L 41.5 43 L 47.5 43 L 45.5 51 L 50 75 Z" className="fill-black dark:fill-white" />
                      <path d="M 52.5 25 L 75 25 L 58 59 L 50 59 L 61 37 L 52.5 37 Z" fill="#ef4444" />
                    </svg>
                  </div>
                  <span className="font-display font-bold text-lg tracking-tighter text-foreground">futurenomix</span>
                </div>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <div className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                  <div className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                  <div className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                </div>
              </div>

              {/* Feed Content */}
              <div className="flex-1 max-w-2xl w-full mx-auto px-4 py-6 space-y-6 overflow-hidden bg-background/50">
                {/* Create post bar mock */}
                <div className="bg-card border border-border rounded-2xl p-4 flex gap-3 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-zinc-300 dark:bg-zinc-700 shrink-0" />
                  <div className="flex-1 h-10 rounded-full bg-zinc-100 dark:bg-zinc-900" />
                </div>

                {/* Mock post 1 */}
                <div className="bg-card border border-border rounded-2xl p-5 space-y-4 shadow-sm">
                  <div className="flex gap-3">
                    <div className="w-11 h-11 rounded-full bg-zinc-300 dark:bg-zinc-700 shrink-0" />
                    <div className="space-y-1.5 flex-1">
                      <div className="h-4 w-1/4 bg-zinc-300 dark:bg-zinc-700 rounded" />
                      <div className="h-3 w-1/3 bg-zinc-200 dark:bg-zinc-800 rounded" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded" />
                    <div className="h-3.5 w-5/6 bg-zinc-200 dark:bg-zinc-800 rounded" />
                    <div className="h-3.5 w-2/3 bg-zinc-200 dark:bg-zinc-800 rounded" />
                  </div>
                  {/* Colorful mock photo to add color to the blur */}
                  <div className="h-32 w-full rounded-xl bg-gradient-to-tr from-violet-500/20 via-pink-500/20 to-amber-500/20 border border-border/10" />
                  <div className="flex gap-6 pt-2 border-t border-border">
                    <div className="h-4 w-12 bg-zinc-200 dark:bg-zinc-800 rounded" />
                    <div className="h-4 w-12 bg-zinc-200 dark:bg-zinc-800 rounded" />
                  </div>
                </div>

                {/* Mock post 2 */}
                <div className="bg-card border border-border rounded-2xl p-5 space-y-4 shadow-sm">
                  <div className="flex gap-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-500/30 shrink-0" />
                    <div className="space-y-1.5 flex-1">
                      <div className="h-4 w-1/5 bg-zinc-300 dark:bg-zinc-700 rounded" />
                      <div className="h-3 w-1/4 bg-zinc-200 dark:bg-zinc-800 rounded" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3.5 w-11/12 bg-zinc-200 dark:bg-zinc-800 rounded" />
                    <div className="h-3.5 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded" />
                  </div>
                  <div className="flex gap-6 pt-2 border-t border-border">
                    <div className="h-4 w-12 bg-zinc-200 dark:bg-zinc-800 rounded" />
                    <div className="h-4 w-12 bg-zinc-200 dark:bg-zinc-800 rounded" />
                  </div>
                </div>
              </div>
            </div>

            {/* Glassmorphic Loader overlay */}
            <div className="absolute inset-0 z-10 flex items-center justify-center p-4 bg-transparent backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white/20 dark:bg-zinc-900/20 backdrop-blur-xl border border-zinc-200/30 dark:border-zinc-800/30 rounded-3xl p-8 max-w-sm w-full text-center space-y-6 flex flex-col items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
              >
                <div className="relative w-12 h-12">
                  <motion.div 
                    className="absolute inset-0 rounded-full border-2 border-zinc-200 dark:border-zinc-800"
                  />
                  <motion.div 
                    className="absolute inset-0 rounded-full border-2 border-t-zinc-900 dark:border-t-zinc-100"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 tracking-wide">Post published successfully!</h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-[240px] mx-auto leading-relaxed">Connecting and distributing to the global network</p>
                </div>
              </motion.div>
            </div>
          </div>
        ) : (
          <form onSubmit={handlePost} className="space-y-6">
            {/* User Profile Info */}
            <div className="flex items-center gap-3 bg-card p-4 rounded-xl border border-border">
              <Image 
                src={userAvatar || `https://dummyimage.com/100x100/1e293b/ffffff&text=${userUsername}`} 
                alt="Current User"
                width={48} 
                height={48} 
                unoptimized
                className="rounded-full w-12 h-12 object-cover border border-border" 
                referrerPolicy="no-referrer" 
              />
              <div>
                <p className="font-semibold text-foreground text-sm">{userName}</p>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                  <Globe className="w-3.5 h-3.5" />
                  <span>Publicly visible</span>
                </div>
              </div>
            </div>

            {/* Hidden native file inputs */}
            <input 
              type="file" 
              ref={photoInputRef} 
              accept="image/*" 
              onChange={(e) => handleFileChange(e, 'photo')} 
              className="hidden" 
            />
            <input 
              type="file" 
              ref={videoInputRef} 
              accept="video/*" 
              onChange={(e) => handleFileChange(e, 'video')} 
              className="hidden" 
            />
            <input 
              type="file" 
              ref={documentInputRef} 
              accept=".pdf,application/pdf" 
              onChange={(e) => handleFileChange(e, 'document')} 
              className="hidden" 
            />

            {/* Post Type Selector Pills */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => { 
                  setPostType('idea'); 
                  setAttachment(null); 
                  setAttachmentData(null);
                  setAttachmentTitle('');
                  setAttachmentType(null);
                }}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-semibold border transition-all flex items-center gap-1.5",
                  postType === 'idea' 
                    ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/30 shadow-sm" 
                    : "bg-card border-border text-muted-foreground hover:border-muted-foreground/30"
                )}
              >
                <Lightbulb className="w-3.5 h-3.5" />
                Idea
              </button>
              <button
                type="button"
                onClick={() => { 
                  setPostType('pitch'); 
                  setAttachment(null); 
                  setAttachmentData(null);
                  setAttachmentTitle('');
                  setAttachmentType(null);
                }}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-semibold border transition-all flex items-center gap-1.5",
                  postType === 'pitch' 
                    ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30 shadow-sm" 
                    : "bg-card border-border text-muted-foreground hover:border-muted-foreground/30"
                )}
              >
                <Briefcase className="w-3.5 h-3.5" />
                Pitch
              </button>
            </div>

            {/* Main Text Area Card */}
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-primary/40 transition-all">
              <div className="p-4 border-b border-border">
                <input
                  type="text"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder="Post title (optional)"
                  className="w-full bg-transparent text-foreground placeholder:text-muted-foreground/60 focus:outline-none text-lg font-semibold"
                />
              </div>
              <div className="p-4">
                <textarea
                  id="post-textarea"
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    checkMention(e.target.value, e.target.selectionStart);
                  }}
                  onKeyDown={handleKeyDown}
                  onSelect={handleTextareaSelect}
                  placeholder={
                    postType === 'idea' ? "Share an innovative spark or startup idea... (Type @ to tag)" :
                    postType === 'photo' ? "Add context, description, or tags for your uploaded photo... (Type @ to tag)" :
                    postType === 'video' ? "Add context, description, or tags for your uploaded video... (Type @ to tag)" :
                    postType === 'pitch' ? "Present your elevator pitch to active venture backers... (Type @ to tag)" :
                    postType === 'poll' ? "Ask a question... (Type @ to tag)" :
                    "Add context or description for your document... (Type @ to tag)"
                  }
                  rows={8}
                  maxLength={1000}
                  className="w-full bg-transparent resize-none text-foreground placeholder:text-muted-foreground/60 focus:outline-none text-base leading-relaxed"
                />
              </div>

              {/* Poll Options UI */}
              {postType === 'poll' && (
                <div className="px-4 pb-4 space-y-3">
                  {pollOptions.map((opt, idx) => (
                    <div key={opt.id} className="flex items-center gap-2">
                      <div className="w-6 text-center text-xs text-muted-foreground font-semibold">{idx + 1}.</div>
                      <input
                        type="text"
                        value={opt.text}
                        onChange={(e) => {
                          const newOpts = [...pollOptions];
                          newOpts[idx].text = e.target.value;
                          setPollOptions(newOpts);
                        }}
                        placeholder={`Option ${idx + 1}`}
                        className="flex-1 bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/40 transition-shadow"
                      />
                      {pollOptions.length > 2 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newOpts = pollOptions.filter((_, i) => i !== idx);
                            setPollOptions(newOpts);
                          }}
                          className="p-2 hover:bg-red-500/10 text-muted-foreground hover:text-red-500 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  {pollOptions.length < 5 && (
                    <div className="pl-8 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setPollOptions([...pollOptions, { id: Date.now().toString(), text: '' }]);
                        }}
                        className="text-xs font-semibold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add option
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Tagging Suggestions Section (Clean in-card accordion style) */}
              {showMentionSuggestions && (
                <div className="mx-4 mb-4 border border-border bg-secondary/15 rounded-xl overflow-hidden shadow-inner">
                  <div className="px-3 py-2 bg-secondary/40 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider border-b border-border flex justify-between items-center">
                    <span className="flex items-center gap-1.5 text-foreground">
                      <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
                      Mention Users or Communities
                    </span>
                    <span className="font-normal normal-case font-mono text-[9px] hidden sm:inline text-muted-foreground">Use ↑↓ and Enter, or click to insert</span>
                  </div>
                  {filteredSuggestions.length === 0 ? (
                    <div className="p-4 text-center text-xs text-muted-foreground">
                      No matching users or communities found for &quot;{mentionQuery}&quot;
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-border">
                      {/* Left Column: Suggestions List */}
                      <div 
                        className="md:col-span-7 max-h-60 overflow-y-auto divide-y divide-border/60"
                        onMouseLeave={() => setHoveredSuggestionIndex(null)}
                      >
                        {filteredSuggestions.map((target, idx) => (
                          <button
                            key={target.id}
                            type="button"
                            onClick={() => insertMention(target)}
                            onMouseEnter={() => setHoveredSuggestionIndex(idx)}
                            className={cn(
                              "w-full px-4 py-2.5 flex items-center justify-between transition-colors text-left",
                              idx === activeSuggestionIndex 
                                ? "bg-primary/5 dark:bg-primary/10" 
                                : "hover:bg-secondary/40"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              {target.avatarUrl ? (
                                <Image 
                                  src={target.avatarUrl} 
                                  alt={target.name} 
                                  width={32} 
                                  height={32} 
                                  unoptimized
                                  className="rounded-full border border-border shrink-0 w-8 h-8 object-cover" 
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                  <Users className="w-4 h-4" />
                                </div>
                              )}
                              <div>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="font-semibold text-sm text-foreground">{target.name}</span>
                                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-secondary text-secondary-foreground font-mono">
                                    @{target.username.toLowerCase().replace(/\s+/g, '')}
                                  </span>
                                </div>
                                <span className="text-xs text-muted-foreground block truncate max-w-[200px] sm:max-w-xs">
                                  {target.subtitle}
                                </span>
                              </div>
                            </div>
                            
                            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground shrink-0 pl-2">
                              {target.type === 'community' ? (
                                <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">Community</span>
                              ) : (
                                <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">Member</span>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* Right Column: Profile Snippet Live Preview */}
                      <div className="md:col-span-5 bg-card/40 p-4 flex flex-col justify-between overflow-hidden relative">
                        {(() => {
                          const activePreviewIndex = hoveredSuggestionIndex !== null ? hoveredSuggestionIndex : activeSuggestionIndex;
                          const activePreviewTarget = filteredSuggestions[activePreviewIndex] || filteredSuggestions[0];
                          if (!activePreviewTarget) return null;
                          return (
                            <motion.div
                              key={activePreviewTarget.id}
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              transition={{ duration: 0.15 }}
                              className="space-y-3"
                            >
                              {/* Card Banner */}
                              <div className={cn(
                                "h-12 w-full rounded-lg bg-gradient-to-r relative overflow-hidden",
                                activePreviewTarget.bannerGradient || "from-primary/20 to-primary/40"
                              )}>
                                <div className="absolute right-2 top-2">
                                  {activePreviewTarget.type === 'community' ? (
                                    <Users className="w-4 h-4 text-white/40" />
                                  ) : (
                                    <Sparkles className="w-4 h-4 text-white/40" />
                                  )}
                                </div>
                              </div>

                              {/* Bio details */}
                              <div className="relative px-1 -mt-8 flex items-end gap-2.5">
                                {activePreviewTarget.avatarUrl ? (
                                  <Image 
                                    src={activePreviewTarget.avatarUrl} 
                                    alt={activePreviewTarget.name} 
                                    width={48} 
                                    height={48} 
                                    unoptimized
                                    className="rounded-full border-2 border-card shrink-0 w-12 h-12 object-cover shadow-sm" 
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary border-2 border-card flex items-center justify-center shrink-0 shadow-sm">
                                    <Users className="w-6 h-6" />
                                  </div>
                                )}
                                <div className="mb-0.5 min-w-0">
                                  <h4 className="font-bold text-xs sm:text-sm text-foreground truncate">{activePreviewTarget.name}</h4>
                                  <p className="text-[10px] text-muted-foreground font-mono">@{activePreviewTarget.username.toLowerCase().replace(/\s+/g, '')}</p>
                                </div>
                              </div>

                              {/* Subtitle / Role */}
                              <p className="text-xs font-semibold text-primary/90 px-1 truncate">
                                {activePreviewTarget.subtitle}
                              </p>

                              {/* Full Bio */}
                              {activePreviewTarget.bio && (
                                <p className="text-[11px] text-muted-foreground leading-relaxed px-1 line-clamp-2">
                                  {activePreviewTarget.bio}
                                </p>
                              )}

                              {/* Stats */}
                              <div className="flex gap-4 px-1 py-1 border-t border-border/50 text-[10px] text-muted-foreground">
                                <div>
                                  <span className="font-bold text-foreground">
                                    {activePreviewTarget.followers || '0'}
                                  </span>{' '}
                                  {activePreviewTarget.type === 'community' ? 'Members' : 'Followers'}
                                </div>
                                <div>
                                  <span className="font-bold text-foreground">
                                    {activePreviewTarget.connections || 'Active'}
                                  </span>{' '}
                                  {activePreviewTarget.type === 'community' ? 'Presence' : 'Connections'}
                                </div>
                              </div>

                              {/* Skills/Tags */}
                              {activePreviewTarget.skills && activePreviewTarget.skills.length > 0 && (
                                <div className="flex flex-wrap gap-1 px-1 pt-1.5 border-t border-border/50">
                                  {activePreviewTarget.skills.slice(0, 3).map((skill, sIdx) => (
                                    <span 
                                      key={sIdx} 
                                      className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-secondary text-secondary-foreground"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </motion.div>
                          );
                        })()}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Attachment Showcase */}
              {(attachmentData || attachment) && (
                <div className="mx-4 mb-4 p-3 bg-secondary/60 rounded-lg border border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {(attachmentType === 'photo' || (!attachmentType && postType === 'photo')) && <ImageIcon className="w-4 h-4 text-blue-500 animate-pulse" />}
                      {(attachmentType === 'video' || (!attachmentType && postType === 'video')) && <Video className="w-4 h-4 text-red-500 animate-pulse" />}
                      {(attachmentType === 'document' || (!attachmentType && postType === 'document')) && <FileText className="w-4 h-4 text-green-500 animate-pulse" />}
                      <span className="text-xs font-mono text-foreground font-medium truncate max-w-[200px] sm:max-w-md">
                        {attachmentTitle || attachment}
                      </span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => {
                        if (attachmentType === 'video' && attachmentData && attachmentData.startsWith('blob:')) {
                          URL.revokeObjectURL(attachmentData);
                        }
                        setAttachment(null);
                        setAttachmentData(null);
                        setAttachmentTitle('');
                        setAttachmentType(null);
                        setSelectedVideoFile(null);
                        setVideoThumbnail(null);
                      }}
                      className="p-1 hover:bg-secondary rounded-full transition-colors text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Media Preview container */}
                  {attachmentData && (
                    <div className={cn(
                      "rounded-lg overflow-hidden border border-border max-h-[250px] w-full flex items-center justify-center",
                      attachmentType === 'video' ? "bg-sky-500" : "bg-zinc-950/80",
                      attachmentType === 'document' ? "max-w-sm mx-auto" : ""
                    )}>
                      {attachmentType === 'photo' && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={attachmentData} alt="Selected Preview" className="max-h-[250px] object-contain w-full" />
                      )}
                      {attachmentType === 'video' && (
                        <video 
                          src={attachmentData + "#t=0.001"} 
                          controls 
                          preload="metadata"
                          className="max-h-[250px] object-contain w-full bg-sky-500 brightness-110" 
                          onEnded={(e) => {
                            const v = e.currentTarget;
                            v.currentTime = 0;
                            v.pause();
                          }}
                        />
                      )}
                      {attachmentType === 'document' && (
                        <div className="py-6 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                          <FileText className="w-10 h-10 text-green-500 animate-bounce" />
                          <span className="text-xs font-medium">PDF Document Selected</span>
                          <span className="text-[10px] text-muted-foreground font-mono">{attachmentTitle}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Text Count and Helpers Footer inside the card */}
              <div className="px-4 py-2 bg-secondary/30 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                <span>Formatting holds automatically</span>
                <span className={cn(content.length > 900 ? "text-amber-500" : "")}>
                  {content.length}/1000 characters
                </span>
              </div>
            </div>

            {/* Actions & Publication Block */}
            <div className="bg-card border border-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-muted-foreground mr-1.5">Attachment:</span>
                <button
                  type="button"
                  onClick={() => handleAttachMockFile('photo')}
                  className={cn(
                    "p-2 rounded-lg transition-all hover:bg-secondary text-blue-500",
                    attachmentType === 'photo' ? "bg-blue-500/10 ring-1 ring-blue-500/20" : ""
                  )}
                  title="Attach Photo / Camera"
                >
                  <ImageIcon className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleAttachMockFile('video')}
                  className={cn(
                    "p-2 rounded-lg transition-all hover:bg-secondary text-red-500",
                    attachmentType === 'video' ? "bg-red-500/10 ring-1 ring-red-500/20" : ""
                  )}
                  title="Attach Video"
                >
                  <Video className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleAttachMockFile('document')}
                  className={cn(
                    "p-2 rounded-lg transition-all hover:bg-secondary text-green-500",
                    attachmentType === 'document' ? "bg-green-500/10 ring-1 ring-green-500/20" : ""
                  )}
                  title="Attach Document (PDF)"
                >
                  <FileText className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => { 
                    setPostType(postType === 'poll' ? 'idea' : 'poll'); 
                    setAttachment(null); 
                    setAttachmentData(null);
                    setAttachmentTitle('');
                    setAttachmentType(null);
                  }}
                  className={cn(
                    "p-2 rounded-lg transition-all hover:bg-secondary text-cyan-500",
                    postType === 'poll' ? "bg-cyan-500/10 ring-1 ring-cyan-500/20" : ""
                  )}
                  title="Create Poll"
                >
                  <BarChart3 className="w-5 h-5" />
                </button>
              </div>

              {/* Post Button */}
              <button
                type="submit"
                disabled={isPosting || (!content.trim() && !attachmentData)}
                className={cn(
                  "flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition-all shadow-sm",
                  (content.trim() || attachmentData) 
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer" 
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
              >
                <span>{isPosting ? 'Posting...' : 'Post'}</span>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
