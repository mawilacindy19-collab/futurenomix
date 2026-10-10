'use client';

import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Paperclip, Send, Check, ThumbsUp, CornerDownRight, ArrowLeft, Smile, Image as ImageIcon, Sparkles, PlusCircle, MinusCircle, ChevronRight, Tag, XSquare, AlertTriangle, Bell, Link, Shield, Trash2, FileText, Download, Play, MessageSquare, MessageSquareWarning, Volume2, VolumeX, Maximize, Minimize, Plus, Monitor, Globe, Search, User, Pause, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import NextLink from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';

const getProfileLink = (authorName: string, isUser: boolean, currentUserName?: string) => {
  if (isUser || authorName === 'Alex Rivera' || (currentUserName && authorName === currentUserName)) {
    return '/profile';
  }

  if (typeof window !== 'undefined') {
    try {
      const storedAccounts = localStorage.getItem('orbit_accounts');
      if (storedAccounts) {
        const accounts = JSON.parse(storedAccounts);
        const match = accounts.find((a: any) => a.name.toLowerCase().trim() === authorName.toLowerCase().trim());
        if (match) {
          const activeId = localStorage.getItem('orbit_active_account_id');
          if (activeId === match.id) return '/profile';
          return `/profile/${match.id}`;
        }
      }
    } catch (e) {}
  }

  const name = authorName.toLowerCase().trim();
  if (name.includes('sophia')) return '/profile/1';
  if (name.includes('david')) return '/profile/2';
  if (name.includes('green funds')) return '/profile/3';
  if (name.includes('startup founder')) return '/profile/4';
  if (name.includes('elena')) return '/profile/5';
  if (name.includes('ecovizion')) return '/profile/6';
  if (name.includes('marcus')) return '/profile/7';
  
  // Default fallback if unknown
  return '/profile/1';
};

interface FeedPostProps {
  id: string;
  type: string;
  author: string;
  role: string;
  time: string;
  createdAt?: number;
  content: string;
  likes: number;
  comments: number;
  shares: number;
  avatarUrl: string;
  hasAttachment?: boolean;
  attachmentTitle?: string;
  attachmentType?: 'photo' | 'video' | 'document' | null;
  attachmentSize?: string;
  attachmentData?: string;
  videoThumbnail?: string;
  isUserPost?: boolean;
  audienceCount?: number;
  isLiked?: boolean;
  isSaved?: boolean;
  commentsList?: any[];
  title?: string;
  pollOptions?: { id: string; text: string; votes: number }[];
  pollTotalVotes?: number;
  onUpdatePost?: (updatedPost: any) => void;
  onDeletePost?: (id: string) => void;
  characterLimit?: number;
  isHighlighted?: boolean;
}

function getInitialTimestamp(timeStr: string, createdAt?: number): number {
  if (createdAt) return createdAt;
  if (!timeStr) return Date.now();
  
  const now = Date.now();
  const lower = timeStr.toLowerCase().trim();
  if (lower === 'just now' || lower === '1s') return now;
  
  const match = lower.match(/^(\d+)\s*(s|m|h|d|second|minute|hour|day)s?(\s*ago)?$/);
  if (match) {
    const val = parseInt(match[1], 10);
    const unit = match[2];
    if (unit.startsWith('s')) return now - val * 1000;
    if (unit.startsWith('m')) return now - val * 60 * 1000;
    if (unit.startsWith('h')) return now - val * 60 * 60 * 1000;
    if (unit.startsWith('d')) return now - val * 24 * 60 * 60 * 1000;
  }
  return now;
}

function getFormattedRelativeTime(timestamp: number): string {
  const diffMs = Date.now() - timestamp;
  if (diffMs < 5000) {
    return 'just now';
  } else if (diffMs < 60000) {
    const secs = Math.floor(diffMs / 1000);
    return `${secs || 1}s ago`;
  } else if (diffMs < 3600000) {
    const mins = Math.floor(diffMs / 60000);
    return `${mins}m ago`;
  } else if (diffMs < 86400000) {
    const hrs = Math.floor(diffMs / 3600000);
    return `${hrs}h ago`;
  } else {
    const days = Math.floor(diffMs / 86400000);
    return `${days}d ago`;
  }
}

const KNOWN_MENTIONS = [
  'Sophia Martinez',
  'Ecovizion Ltd',
  'David Chen',
  'Elena Rostova',
  'Marcus Vance',
  'Alex Rivera',
  'SF Bay Area Founders',
  'AI in Supply Chain',
  'Women in FinTech',
  'Hardware Pioneers'
];

export function renderFormattedContent(text: string) {
  if (!text) return null;

  // Let's escape names for regex
  const escapedMentions = KNOWN_MENTIONS.map(m => m.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')).join('|');
  // Matching group pattern:
  // Group 1: Known mentions like @Sophia Martinez
  // Group 2: Generic @username like @someone
  // Group 3: Hashtags like #startup
  const regex = new RegExp(`(@(?:${escapedMentions}))|(@\\w+)|(#\\w+)`, 'gi');
  
  const parts = text.split(regex);
  if (parts.length === 1) return text;
  
  return (
    <>
      {parts.map((part, index) => {
        if (!part) return null;
        
        if (part.startsWith('@')) {
          const cleanName = part.substring(1);
          const isCommunity = ['sf bay area founders', 'ai in supply chain', 'women in fintech', 'hardware pioneers'].includes(
            cleanName.toLowerCase()
          );
          
          return (
            <span 
              key={index} 
              className={cn(
                "inline-flex items-center font-semibold rounded px-1.5 py-0.5 text-xs transition-all cursor-pointer mx-0.5",
                isCommunity 
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500/20"
                  : "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"
              )}
              title={isCommunity ? `Community: ${cleanName}` : `Member: ${cleanName}`}
            >
              {part}
            </span>
          );
        }
        
        if (part.startsWith('#')) {
          return (
            <span 
              key={index} 
              className="font-semibold text-primary hover:underline cursor-pointer mx-0.5"
            >
              {part}
            </span>
          );
        }
        
        return part;
      })}
    </>
  );
}

export function FeedPost({ 
  id,
  type, 
  author, 
  role, 
  time, 
  createdAt,
  content, 
  likes, 
  shares, 
  avatarUrl, 
  hasAttachment, 
  attachmentTitle,
  attachmentType,
  attachmentData,
  videoThumbnail,
  isUserPost,
  audienceCount,
  isLiked = false,
  isSaved = false,
  commentsList = [],
  title,
  pollOptions,
  pollTotalVotes,
  onUpdatePost,
  onDeletePost,
  characterLimit = 150,
  isHighlighted = false
}: FeedPostProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentUserName, setCurrentUserName] = useState('Alex Rivera');
  const [currentUserProfile, setCurrentUserProfile] = useState<any>(null);
  const [authorProfileLink, setAuthorProfileLink] = useState(() => getProfileLink(author, !!isUserPost || author === 'Alex Rivera', 'Alex Rivera'));

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const activeId = localStorage.getItem('orbit_active_account_id') || 'personal-1';
        const storedAccounts = localStorage.getItem('orbit_accounts');
        let currentAcc = null;
        let accounts: any[] = [];
        if (storedAccounts) {
          accounts = JSON.parse(storedAccounts);
          currentAcc = accounts.find((a: any) => a.id === activeId);
        }

        const match = accounts.find((a: any) => a.name.toLowerCase().trim() === author.toLowerCase().trim() && a.id !== activeId);
        if (match) {
           // eslint-disable-next-line react-hooks/set-state-in-effect
           setAuthorProfileLink(`/profile/${match.id}`);
        } else if (currentAcc && currentAcc.name.toLowerCase().trim() === author.toLowerCase().trim()) {
            
           setAuthorProfileLink('/profile');
        } else {
            
           setAuthorProfileLink(getProfileLink(author, !!isUserPost || author === currentUserName, currentUserName));
        }

        if (currentAcc) {
           
          setCurrentUserProfile(currentAcc);
          if (currentAcc.name) {
             
            setCurrentUserName(currentAcc.name);
          }
        } else {
          const stored = localStorage.getItem('orbit_user_profile');
          if (stored) {
            const parsed = JSON.parse(stored);
             
            setCurrentUserProfile(parsed);
            if (parsed.name) {
               
              setCurrentUserName(parsed.name);
            }
          }
        }
      } catch (e) {}
    }
  }, [author, currentUserName, isUserPost]);

  const fallbackDocData = "data:application/pdf;base64,JVBERi0xLjMKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDYKL1R5cGUgL1BhZ2VzCi9LaWRzIFsgMyAwIFIgXQovQ291bnQgMQo+PgplbmRvYmoKMyAwIG9iago8PAovVHlwZSAvUGFnZQovUGFyZW50IDIgMCBSCi9NZWRpYUJveCBbIDAgMCA1OTUgODQyIF0KL1Jlc291cmNlcyA8PAovRm9udCA8PAovRjEgNCAwIFIKPj4KPj4KL0NvbnRlbnRzIDUgMCBSCj4+CmVuZG9iago0IDAgb2JqCjw8Ci9UeXBlIC9Gb250Ci9TdWJ0eXBlIC9UeXBlMQovQmFzZUZvbnQgL0hlbHZldGljYQo+PgplbmRvYmoKNSAwIG9iago8PAovTGVuZ3RoIDQ0Cj4+CnN0cmVhbQpCVAovRjEgMTIgVGYKNzIgNzEyIFRkCihIZWxsbyBXb3JsZCEpIFRqCkVOCmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwNTYgMDAwMDAgbiAKMDAwMDAwMDExMSAwMDAwMCBuIAowMDAwMDAwMjQ0IDAwMDAwIG4gCjAwMDAwMDAzMDcgMDAwMDAgbiAKdHJhaWxlcgo8PAovU2l6ZSA2Ci9Sb290IDEgMCBSCj4+CnN0YXJ0eHJlZgowMzk2CiUlRU9G";

  const resolvedAttachmentType = attachmentType || (
    (attachmentTitle?.toLowerCase().endsWith('.pdf') || 
     attachmentTitle?.toLowerCase().endsWith('.docx') || 
     attachmentTitle?.toLowerCase().endsWith('.txt') || 
     attachmentTitle?.toLowerCase().endsWith('.xlsx') || 
     attachmentTitle?.toLowerCase().endsWith('.pptx') ||
     attachmentTitle?.toLowerCase().includes('deck') ||
     attachmentTitle?.toLowerCase().includes('pitchdeck'))
      ? 'document'
      : (attachmentTitle?.toLowerCase().endsWith('.mp4') || 
         attachmentTitle?.toLowerCase().endsWith('.mov') || 
         attachmentTitle?.toLowerCase().endsWith('.webm') ||
         type === 'video')
        ? 'video'
        : (attachmentTitle?.toLowerCase().endsWith('.png') || 
           attachmentTitle?.toLowerCase().endsWith('.jpg') || 
           attachmentTitle?.toLowerCase().endsWith('.jpeg') || 
           attachmentTitle?.toLowerCase().endsWith('.gif') || 
           attachmentTitle?.toLowerCase().endsWith('.webp') ||
           type === 'photo')
          ? 'photo'
          : (type === 'document' ? 'document' : null)
  );

  const isPhoto = resolvedAttachmentType === 'photo';
  const isVideo = resolvedAttachmentType === 'video';
  const isDocument = resolvedAttachmentType === 'document';
  
  const hasAnyAttachment = hasAttachment || !!attachmentData || isPhoto || isVideo || isDocument;

  const [localPollOptions, setLocalPollOptions] = useState(pollOptions);
  const [localPollTotalVotes, setLocalPollTotalVotes] = useState(pollTotalVotes || 0);
  const [userVotedPollOptionId, setUserVotedPollOptionId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && pollOptions) {
      const activeId = localStorage.getItem('orbit_active_account_id') || 'personal-1';
      const voted = localStorage.getItem(`orbit_poll_${id}_${activeId}`);
      if (voted) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUserVotedPollOptionId(voted);
      }
    }
  }, [id, pollOptions]);

  const [dbVideoUrl, setDbVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;
    if (attachmentData === 'indexedDB') {
      import('@/lib/indexed-db').then(({ getVideo }) => {
        getVideo(id).then(blob => {
          if (blob) {
            objectUrl = URL.createObjectURL(blob);
            setDbVideoUrl(objectUrl);
          }
        }).catch(err => {
          console.error("Failed to load video from IndexedDB:", err);
        });
      });
    }
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [id, attachmentData]);

  const resolvedAttachmentData = (() => {
    if (attachmentData === 'indexedDB') {
      return dbVideoUrl || null;
    }
    if (attachmentData === 'sessionStorage') {
      if (typeof window !== 'undefined') {
        try {
          return sessionStorage.getItem(`orbit_attachment_${id}`) || fallbackDocData;
        } catch (e) {
          return fallbackDocData;
        }
      }
      return fallbackDocData;
    }
    if (attachmentData === 'fallback') {
      return fallbackDocData;
    }
    return attachmentData || null;
  })();

  const getAttachmentBlock = () => hasAnyAttachment && (
    <div className="mt-2.5 mb-2.5">
      {isDocument ? (
        <div className="w-full">
          <div className="p-2.5 flex items-center justify-between gap-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="p-2 bg-green-500/10 text-green-600 dark:text-green-400 rounded-lg shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground truncate">{attachmentTitle || "document.pdf"}</p>
                <p className="text-[10px] text-muted-foreground font-mono">PDF Document</p>
              </div>
            </div>
            <a 
              href={resolvedAttachmentData || fallbackDocData} 
              download={attachmentTitle || "document.pdf"}
              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white dark:bg-green-700 dark:hover:bg-green-600 text-xs font-semibold rounded-lg shadow-sm hover:shadow transition-all shrink-0 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </a>
          </div>
        </div>
      ) : (
        (resolvedAttachmentData || isPhoto || isVideo) ? (
          <div className={cn(
            "w-full bg-black/5 dark:bg-black/40 border-y border-border"
          )}>
            {isPhoto && (
              <div className="relative w-full flex items-center justify-center bg-zinc-950/20 dark:bg-zinc-950/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={resolvedAttachmentData || `https://dummyimage.com/800x600/1e293b/ffffff?text=%24%7Bid%7D`} 
                  alt={attachmentTitle || "Attached Image"} 
                  className="w-full h-auto max-h-[85vh] object-contain block"
                />
              </div>
            )}
            {isVideo && (
              <div 
                className="relative w-full aspect-[9/12] max-h-[85vh] flex items-center justify-center bg-sky-400 overflow-hidden shadow-sm group"
                style={{ backgroundColor: '#38bdf8' }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  setActivePlayId(id);
                  setActivePlayVideoSrc(resolvedAttachmentData || "https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4");
                  setActivePlayTitle(attachmentTitle || "Product Demo Video");
                  setActivePlayAuthor(author);
                  setActivePlayRole(role);
                  setActivePlayAvatar(avatarUrl);
                  setActivePlayContent(content);
                  setActivePlayLikes(likes);
                  setActivePlayComments(commentsList || []);
                  setActivePlayIsLiked(isLiked);
                  setLocalSharesCount(shares);
                  setVideoPlaying(true);
                  setVideoPageOpen(true);
                }}
              >
                <video 
                  src={(resolvedAttachmentData || "https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4") + "#t=0.001"}
                  preload="metadata"
                  className="w-full h-full object-cover cursor-pointer"
                  onTimeUpdate={(e) => {
                    const v = e.currentTarget;
                    if (v.duration) {
                      setInlineVideoProgress((v.currentTime / v.duration) * 100);
                    }
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    const v = e.currentTarget;
                    if (v.paused) {
                      v.play().catch(() => {});
                      setInlinePlaying(true);
                    } else {
                      v.pause();
                      setInlinePlaying(false);
                    }
                  }}
                  onEnded={(e) => {
                    const v = e.currentTarget;
                    v.currentTime = 0;
                    v.pause();
                    setInlinePlaying(false);
                    setInlineVideoProgress(0);
                  }}
                />
                {inlinePlaying && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30 backdrop-blur-sm pointer-events-none">
                    <div 
                      className="h-full bg-white/80" 
                      style={{ width: `${inlineVideoProgress}%` }}
                    />
                  </div>
                )}
                {!inlinePlaying && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-black/20">
                    <div className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/90 border border-white/20">
                      <Play className="w-8 h-8 ml-1 fill-current" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="border border-border rounded-lg p-3 flex items-center gap-3 bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer w-max max-w-full">
             <Paperclip className="w-5 h-5 text-muted-foreground flex-shrink-0" />
             <span className="text-sm font-medium truncate">{attachmentTitle || "Attachment"}</span>
          </div>
        )
      )}
    </div>
  );

  const getTitleBlock = () => title && (
    <h2 className="px-4 text-lg font-bold text-foreground mt-2">{title}</h2>
  );

  useEffect(() => {
    const checkOverflow = () => {
      if (contentRef.current) {
        // 3.50 inches is exactly 3.50 * 96px = 336px in standard CSS.
        const maxHInPx = 3.50 * 96;
        setIsOverflowing(contentRef.current.scrollHeight > maxHInPx);
      }
    };

    checkOverflow();

    if (typeof window !== 'undefined' && 'ResizeObserver' in window && contentRef.current) {
      const observer = new ResizeObserver(() => {
        checkOverflow();
      });
      observer.observe(contentRef.current);
      return () => observer.disconnect();
    }
  }, [content]);

  const getContentBlock = () => (
    <div className="px-4 mt-2 mb-3 text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed break-words [word-break:break-word]">
      <div 
        ref={contentRef}
        style={{ 
          maxHeight: isExpanded ? 'none' : '3.50in' 
        }}
        className={cn(
          "overflow-hidden relative transition-all duration-300",
          !isExpanded && isOverflowing && "after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-12 after:bg-gradient-to-t after:from-card dark:after:from-zinc-900 after:to-transparent"
        )}
      >
        {renderFormattedContent(content)}
      </div>
      {isOverflowing && (
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-primary font-bold mt-1.5 hover:underline text-xs block"
        >
          {isExpanded ? 'Show less' : 'Read more'}
        </button>
      )}
    </div>
  );

  const handleVote = (optionId: string) => {
    if (!localPollOptions || userVotedPollOptionId) return;

    const newOptions = localPollOptions.map(opt => 
      opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
    );
    const newTotal = localPollTotalVotes + 1;
    
    setLocalPollOptions(newOptions);
    setLocalPollTotalVotes(newTotal);
    setUserVotedPollOptionId(optionId);
    
    if (typeof window !== 'undefined') {
      const activeId = localStorage.getItem('orbit_active_account_id') || 'personal-1';
      localStorage.setItem(`orbit_poll_${id}_${activeId}`, optionId);
    }

    if (onUpdatePost) {
      onUpdatePost({
        id, type, author, role, time, createdAt, content, likes, comments: commentsList.length, shares, avatarUrl,
        hasAttachment, attachmentTitle, attachmentType, attachmentData, isUserPost, audienceCount, isLiked, isSaved, commentsList, title,
        pollOptions: newOptions,
        pollTotalVotes: newTotal
      });
    }
  };

  const getPollBlock = () => {
    if (!localPollOptions || localPollOptions.length === 0) return null;

    return (
      <div className="px-4 mt-3 mb-4 space-y-2 border-y sm:border sm:rounded-xl border-border/60 py-4 bg-secondary/10 mx-0 sm:mx-4">
        {localPollOptions.map(opt => {
          const percentage = localPollTotalVotes > 0 ? Math.round((opt.votes / localPollTotalVotes) * 100) : 0;
          const isWinner = localPollTotalVotes > 0 && opt.votes === Math.max(...localPollOptions.map(o => o.votes));
          const isSelected = userVotedPollOptionId === opt.id;

          return (
            <button
              key={opt.id}
              onClick={() => handleVote(opt.id)}
              disabled={!!userVotedPollOptionId}
              className={cn(
                "relative w-full text-left overflow-hidden rounded-lg transition-all border",
                userVotedPollOptionId 
                  ? isSelected ? "border-primary/50 bg-primary/5 ring-1 ring-primary/20" : "border-border/50 bg-secondary/30"
                  : "border-border bg-card hover:bg-secondary hover:border-border/80 cursor-pointer"
              )}
            >
              {/* Progress bar background */}
              {userVotedPollOptionId && (
                <div 
                  className={cn(
                    "absolute left-0 top-0 bottom-0 transition-all duration-700 ease-out",
                    isWinner ? "bg-primary/20 dark:bg-primary/30" : "bg-secondary"
                  )}
                  style={{ width: `${percentage}%` }}
                />
              )}
              
              <div className="relative z-10 px-3 py-2.5 flex items-center justify-between">
                <span className={cn(
                  "text-sm font-medium",
                  isSelected ? "text-primary" : "text-foreground"
                )}>
                  {opt.text}
                </span>
                
                {userVotedPollOptionId && (
                  <span className="text-xs font-semibold text-muted-foreground ml-3">
                    {percentage}%
                  </span>
                )}
              </div>
            </button>
          );
        })}
        <div className="text-[10px] text-muted-foreground pt-1 px-1">
          {localPollTotalVotes} vote{localPollTotalVotes !== 1 && 's'} · {userVotedPollOptionId ? 'Final results' : 'Select an option to vote'}
        </div>
      </div>
    );
  };

  const [commentsOpen, setCommentsOpen] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [savedNotification, setSavedNotification] = useState('');
  const [activeReplyCommentId, setActiveReplyCommentId] = useState<string | null>(null);
  const [replyTextMap, setReplyTextMap] = useState<{ [commentId: string]: string }>({});

  const [videoPageOpen, setVideoPageOpen] = useState(false);
  const [videoCommentText, setVideoCommentText] = useState('');
  const [videoActiveTab, setVideoActiveTab] = useState<'comments' | 'upnext'>('comments');
  const [videoIsFullPage, setVideoIsFullPage] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const commentInputRef = useRef<HTMLInputElement | null>(null);

  const [videoMuted, setVideoMuted] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(true);
  const [videoLooping, setVideoLooping] = useState(true);
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [videoSearchQuery, setVideoSearchQuery] = useState('');
  const [showShareTooltip, setShowShareTooltip] = useState(false);
  const [localSharesCount, setLocalSharesCount] = useState(shares);
  const [commentDrawerOpen, setCommentDrawerOpen] = useState(false);
  const [optionsMenuOpen, setOptionsMenuOpen] = useState(false);
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [playFlash, setPlayFlash] = useState<'play' | 'pause' | null>(null);
  const [activePlayIsLiked, setActivePlayIsLiked] = useState(isLiked);
  const [inlinePlaying, setInlinePlaying] = useState(false);
  const [inlineVideoProgress, setInlineVideoProgress] = useState(0);
  const [videoProgress, setVideoProgress] = useState(0);

  const handleNativeFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if ((videoRef.current as any).webkitRequestFullscreen) {
        (videoRef.current as any).webkitRequestFullscreen();
      } else if ((videoRef.current as any).mozRequestFullScreen) {
        (videoRef.current as any).mozRequestFullScreen();
      } else if ((videoRef.current as any).msRequestFullscreen) {
        (videoRef.current as any).msRequestFullscreen();
      }
    }
  };

  const [activePlayId, setActivePlayId] = useState(id);
  const [activePlayVideoSrc, setActivePlayVideoSrc] = useState(resolvedAttachmentData || "https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4");

  useEffect(() => {
    if (resolvedAttachmentData) {
      const timer = setTimeout(() => {
        setActivePlayVideoSrc(resolvedAttachmentData);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [resolvedAttachmentData]);
  const [activePlayTitle, setActivePlayTitle] = useState(attachmentTitle || "Product Demo Video");
  const [activePlayAuthor, setActivePlayAuthor] = useState(author);
  const [activePlayRole, setActivePlayRole] = useState(role);
  const [activePlayAvatar, setActivePlayAvatar] = useState(avatarUrl);
  const [activePlayContent, setActivePlayContent] = useState(content);
  const [activePlayLikes, setActivePlayLikes] = useState(likes);
  const [activePlayComments, setActivePlayComments] = useState<any[]>(commentsList);

  useEffect(() => {
    setActivePlayAvatar(avatarUrl);
  }, [avatarUrl]);

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.closest('button') || 
      target.closest('input') || 
      target.closest('textarea') || 
      target.closest('video') || 
      target.closest('.no-swipe') ||
      target.tagName === 'BUTTON' || 
      target.tagName === 'INPUT' || 
      target.tagName === 'TEXTAREA' || 
      target.tagName === 'VIDEO'
    ) {
      touchStartX.current = null;
      touchStartY.current = null;
      return;
    }
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const diffX = e.changedTouches[0].clientX - touchStartX.current;
    const diffY = e.changedTouches[0].clientY - touchStartY.current;

    // Primarily horizontal swipe from left-to-right of at least 80px
    if (diffX > 80 && Math.abs(diffY) < 60) {
      setVideoPageOpen(false);
      setVideoIsFullPage(false);
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  const handleVideoCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoCommentText.trim() || !onUpdatePost) return;

    const activeAccountId = typeof window !== 'undefined' ? (localStorage.getItem('orbit_active_account_id') || 'personal-1') : 'personal-1';
    const authorName = currentUserProfile?.name || 'Alex Rivera';
    const authorRole = currentUserProfile?.role || 'Entrepreneur · Full Stack Developer · UI/UX Designer';
    const authorAvatar = currentUserProfile?.avatarUrl || `https://dummyimage.com/100x100/1e293b/ffffff?text=%24%7BcurrentUserProfile%3F.username%20%7C%7C%20'alex'%7D`;

    const newComment = {
      // eslint-disable-next-line react-hooks/purity
      id: 'comment_' + Date.now(),
      accountId: activeAccountId,
      author: authorName,
      role: authorRole,
      avatarUrl: authorAvatar,
      content: videoCommentText.trim(),
      time: 'just now',
      // eslint-disable-next-line react-hooks/purity
      createdAt: Date.now(),
      likes: 0,
      isLiked: false,
      replies: []
    };

    const nextCommentsList = [...activePlayComments, newComment];
    setVideoCommentText('');
    setActivePlayComments(nextCommentsList);

    onUpdatePost({
      id: activePlayId,
      type,
      author: activePlayAuthor,
      role: activePlayRole,
      time: 'Just now',
      content: activePlayContent,
      likes: activePlayLikes,
      comments: nextCommentsList.length,
      shares: localSharesCount,
      avatarUrl: activePlayAvatar,
      hasAttachment: true,
      attachmentTitle: activePlayTitle,
      attachmentType: 'video',
      attachmentData: activePlayVideoSrc,
      isUserPost,
      audienceCount: 120,
      isLiked: activePlayIsLiked,
      isSaved,
      commentsList: nextCommentsList
    });
  };

  const handleVideoLike = () => {
    if (!onUpdatePost) return;
    const nextLiked = !activePlayIsLiked;
    const nextLikes = nextLiked ? activePlayLikes + 1 : Math.max(0, activePlayLikes - 1);
    setActivePlayLikes(nextLikes);
    setActivePlayIsLiked(nextLiked);
    
    onUpdatePost({
      id: activePlayId,
      type,
      author: activePlayAuthor,
      role: activePlayRole,
      time: 'Just now',
      content: activePlayContent,
      likes: nextLikes,
      comments: activePlayComments.length,
      shares: localSharesCount,
      avatarUrl: activePlayAvatar,
      hasAttachment: true,
      attachmentTitle: activePlayTitle,
      attachmentType: 'video',
      attachmentData: activePlayVideoSrc,
      isUserPost,
      audienceCount: 120,
      isLiked: nextLiked,
      isSaved,
      commentsList: activePlayComments
    });
  };

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (videoPlaying) {
      videoRef.current.pause();
      setVideoPlaying(false);
      setPlayFlash('pause');
      setTimeout(() => setPlayFlash(null), 600);
    } else {
      videoRef.current.play().catch(() => {});
      setVideoPlaying(true);
      setPlayFlash('play');
      setTimeout(() => setPlayFlash(null), 600);
    }
  };

  const handleVideoShare = () => {
    const nextShares = localSharesCount + 1;
    setLocalSharesCount(nextShares);
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href);
      }
    } catch (e) {
      console.warn('Clipboard write failed', e);
    }
    setShowShareTooltip(true);
    setTimeout(() => {
      setShowShareTooltip(false);
    }, 2000);

    if (onUpdatePost) {
      onUpdatePost({
        id: activePlayId,
        type,
        author: activePlayAuthor,
        role: activePlayRole,
        time: 'Just now',
        content: activePlayContent,
        likes: activePlayLikes,
        comments: activePlayComments.length,
        shares: nextShares,
        avatarUrl: activePlayAvatar,
        hasAttachment: true,
        attachmentTitle: activePlayTitle,
        attachmentType: 'video',
        attachmentData: activePlayVideoSrc,
        isUserPost,
        audienceCount: 120,
        isLiked: activePlayIsLiked,
        isSaved,
        commentsList: activePlayComments
      });
    }
  };

  const getRecommendedVideos = () => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem('orbit_posts');
      if (stored) {
        const allPosts = JSON.parse(stored);
        return allPosts.filter((p: any) => p.id !== activePlayId).slice(0, 5);
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  };

  const getPostVideoSrc = (post: any) => {
    if (post.attachmentData === 'sessionStorage') {
      if (typeof window !== 'undefined') {
        try {
          return sessionStorage.getItem(`orbit_attachment_${post.id}`) || "https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4";
        } catch (e) {
          return "https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4";
        }
      }
    }
    return post.attachmentData || "https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4";
  };



  const [optionsOpen, setOptionsOpen] = useState(false);
  const [hidden, setHidden] = useState<boolean>(false);
  const [completelyRemoved, setCompletelyRemoved] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    try {
      const activeId = localStorage.getItem('orbit_active_account_id') || 'personal-1';
      const stored = localStorage.getItem(`orbit_hidden_posts_${activeId}`);
      if (stored) {
        const hiddenIds: string[] = JSON.parse(stored);
        if (hiddenIds.includes(id)) {
          // If it was already hidden in a previous session, remove it completely on load
          setCompletelyRemoved(true);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [id]);
  const [isNotificationsOn, setIsNotificationsOn] = useState(false);
  const [interested, setInterested] = useState<boolean | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Helper to persist hidden state to localStorage
  const persistHiddenState = (hide: boolean) => {
    try {
      const activeId = localStorage.getItem('orbit_active_account_id') || 'personal-1';
      const key = `orbit_hidden_posts_${activeId}`;
      const stored = localStorage.getItem(key);
      let hiddenIds: string[] = stored ? JSON.parse(stored) : [];
      if (hide) {
        if (!hiddenIds.includes(id)) {
          hiddenIds.push(id);
        }
      } else {
        hiddenIds = hiddenIds.filter(hideId => hideId !== id);
      }
      localStorage.setItem(key, JSON.stringify(hiddenIds));
    } catch (e) {
      console.error('Failed to save hidden posts', e);
    }
  };

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [chatContacts, setChatContacts] = useState<any[]>([]);
  const [sentContacts, setSentContacts] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!shareModalOpen || typeof window === 'undefined') return;
    
    const activeId = localStorage.getItem('orbit_active_account_id') || 'personal-1';
    
    const defaultContacts = [
      { id: '1', name: 'Sophia Martinez', role: 'Founder & CEO', avatarUrl: 'https://dummyimage.com/100x100/1e293b/ffffff?text=sophia' },
      { id: '2', name: 'David Chen', role: 'Senior Frontend Engineer', avatarUrl: 'https://dummyimage.com/100x100/1e293b/ffffff?text=david' },
      { id: '3', name: 'Green Funds Ventures', role: 'General Partner', avatarUrl: 'https://dummyimage.com/100x100/1e293b/ffffff?text=green' },
    ];

    let otherAccounts: any[] = [];
    try {
      const storedAccounts = localStorage.getItem('orbit_accounts');
      if (storedAccounts) {
        const accounts = JSON.parse(storedAccounts);
        otherAccounts = accounts
          .filter((acc: any) => acc.id !== activeId)
          .map((acc: any) => ({
            id: acc.id,
            name: acc.name,
            role: acc.type === 'business' ? 'Business Account' : 'Founder & Developer',
            avatarUrl: acc.avatarUrl
          }));
      }
    } catch (e) {}

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChatContacts([...otherAccounts, ...defaultContacts]);
  }, [shareModalOpen]);

  const handleSendToChat = (contact: any) => {
    if (typeof window === 'undefined') return;
    const activeId = localStorage.getItem('orbit_active_account_id') || 'personal-1';
    const otherId = contact.id;
    const threadId = [activeId, otherId].sort().join('_');

    const shareMsgText = `📢 Shared a post from ${author}:`;
    // eslint-disable-next-line react-hooks/purity
    const shareId = `msg_share_${Date.now()}`;
    const newMsg = {
      id: shareId,
      senderId: activeId,
      sender: 'me',
      text: shareMsgText,
      time: 'Just now',
      sharePostId: id,
    };

    const msgsKey = `orbit_thread_msgs_${threadId}`;
    let msgs: any[] = [];
    try {
      const stored = localStorage.getItem(msgsKey);
      if (stored) msgs = JSON.parse(stored);
    } catch (e) {}
    msgs.push(newMsg);
    localStorage.setItem(msgsKey, JSON.stringify(msgs));

    const updateMetaForUser = (userId: string, otherUserId: string, unreadInc: boolean) => {
      const convKey = `orbit_conversations_${userId}`;
      let convs: any[] = [];
      try {
        const stored = localStorage.getItem(convKey);
        if (stored) convs = JSON.parse(stored);
      } catch (e) {}

      if (convs.length === 0) {
        convs = [
          { id: '1', name: 'Sophia Martinez', role: 'Founder & CEO', company: 'LogiAI', location: 'San Francisco, CA', avatarUrl: 'https://dummyimage.com/100x100/1e293b/ffffff?text=sophia', bio: 'Looking for a technical co-founder with AI logistics expertise.', projectPitch: 'Last-mile autonomous delivery routing algorithms.', matchScore: 98, rating: 5, unread: 0, time: 'Today, 9:50 AM', sharedFiles: [{ id: 'f1', name: 'mvp-wireframes.pdf', size: '4.2 MB', date: 'Jul 2, 2026', url: '#' }, { id: 'f2', name: 'pitch-deck-v2.pdf', size: '12.8 MB', date: 'Jul 2, 2026', url: '#' }], messages: [] },
          { id: '2', name: 'David Chen', role: 'Senior Frontend Engineer', company: 'NextUI', location: 'Seattle, WA', avatarUrl: 'https://dummyimage.com/100x100/1e293b/ffffff?text=david', bio: 'Open source contributor passionate about dynamic UI design.', projectPitch: 'Collaborating on the new open-source components ecosystem.', matchScore: 92, rating: 5, unread: 0, time: 'Yesterday, 3:20 PM', sharedFiles: [{ id: 'f3', name: 'design-spec.fig', size: '1.1 MB', date: 'Jul 1, 2026', url: '#' }], messages: [] },
          { id: '3', name: 'Green Funds Ventures', role: 'General Partner', company: 'Green Funds', location: 'Palo Alto, CA', avatarUrl: 'https://dummyimage.com/100x100/1e293b/ffffff?text=green', bio: 'Seed-stage VC investing in sustainable tech and SaaS.', projectPitch: 'Clean Tech seed round. Looking for platform integrations.', matchScore: 85, rating: 4, unread: 0, time: 'Monday, 11:15 AM', sharedFiles: [{ id: 'f4', name: 'portfolio-requirements.pdf', size: '840 KB', date: 'Jun 28, 2026', url: '#' }], messages: [] }
        ];
      }

      let chat = convs.find(c => c.id === otherUserId);
      if (!chat) {
        let otherInfo = {
          name: otherUserId === '1' ? 'Sophia Martinez' : otherUserId === '2' ? 'David Chen' : otherUserId === '3' ? 'Green Funds Ventures' : 'Contact',
          role: 'Member',
          avatarUrl: `https://dummyimage.com/100x100/1e293b/ffffff?text=%24%7BotherUserId%7D`,
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
            const matchedAcc = accounts.find((a: any) => a.id === otherUserId);
            if (matchedAcc) {
              otherInfo.name = matchedAcc.name;
              otherInfo.role = matchedAcc.type === 'business' ? 'Business Account' : 'Founder & Developer';
              otherInfo.avatarUrl = matchedAcc.avatarUrl;
            }
          }
        } catch (e) {}

        chat = {
          id: otherUserId,
          ...otherInfo,
          messages: []
        };
        convs.push(chat);
      }

      chat.messages = msgs;
      chat.time = 'Just now';
      if (unreadInc) {
        chat.unread = (chat.unread || 0) + 1;
      }
      localStorage.setItem(convKey, JSON.stringify(convs));
    };

    updateMetaForUser(activeId, otherId, false);

    if (otherId.startsWith('personal-') || otherId.startsWith('business-')) {
      updateMetaForUser(otherId, activeId, true);
    }

    setSentContacts(prev => ({ ...prev, [otherId]: true }));

    if (onUpdatePost) {
      onUpdatePost({
        id,
        type,
        author,
        role,
        time,
        createdAt,
        content,
        likes,
        comments: commentsList.length,
        shares: shares + 1,
        avatarUrl,
        hasAttachment,
        attachmentTitle,
        attachmentType,
        attachmentData,
        isUserPost,
        audienceCount,
        isLiked,
        isSaved,
        commentsList
      });
    }
  };

  const [tick, setTick] = useState(0);
  const [commentTimestamps, setCommentTimestamps] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const timer = setInterval(() => {
      setTick((t) => t + 1);
    }, 180000); // tick every 3 minutes (180,000 ms) to update times in real-time
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!hidden) return;
    const timer = setTimeout(() => {
      setCompletelyRemoved(true);
    }, 7000); // completely remove the hidden post from the feed after 7 seconds
    return () => clearTimeout(timer);
  }, [hidden]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCommentTimestamps((prev) => {
      const next = { ...prev };
      let updated = false;

      // Ensure post has timestamp
      if (!next[id]) {
        next[id] = getInitialTimestamp(time, createdAt);
        updated = true;
      }

      // Ensure comments have timestamps
      commentsList.forEach((comment: any) => {
        if (!next[comment.id]) {
          next[comment.id] = getInitialTimestamp(comment.time, comment.createdAt);
          updated = true;
        }
        if (comment.replies) {
          comment.replies.forEach((reply: any) => {
            if (!next[reply.id]) {
              next[reply.id] = getInitialTimestamp(reply.time, reply.createdAt);
              updated = true;
            }
          });
        }
      });

      return updated ? next : prev;
    });
  }, [id, time, createdAt, commentsList]);

  const getStableTimestamp = (itemId: string, defaultTimeStr: string, defaultCreatedAt?: number): number => {
    return commentTimestamps[itemId] || defaultCreatedAt || getInitialTimestamp(defaultTimeStr, defaultCreatedAt);
  };

  const currentPostTimestamp = getStableTimestamp(id, time, createdAt);
  const [displayTime, setDisplayTime] = useState(() => getFormattedRelativeTime(currentPostTimestamp));

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDisplayTime(getFormattedRelativeTime(currentPostTimestamp));
  }, [currentPostTimestamp, tick]);

  useEffect(() => {
    if (commentsOpen || optionsOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [commentsOpen, optionsOpen]);

  const handleLike = () => {
    if (!onUpdatePost) return;
    
    const nextLiked = !isLiked;
    const nextLikes = nextLiked ? likes + 1 : Math.max(0, likes - 1);
    
    onUpdatePost({
      id,
      type,
      author,
      role,
      time,
      createdAt,
      content,
      likes: nextLikes,
      comments: commentsList.length,
      shares,
      avatarUrl,
      hasAttachment,
      attachmentTitle,
      attachmentType,
      attachmentData,
      isUserPost,
      audienceCount,
      isLiked: nextLiked,
      isSaved,
      commentsList
    });
  };

  const handleSave = () => {
    if (!onUpdatePost) return;
    const nextSaved = !isSaved;
    
    setSavedNotification(nextSaved ? 'Saved to bookmarks' : 'Removed from bookmarks');
    setTimeout(() => setSavedNotification(''), 2000);

    onUpdatePost({
      id,
      type,
      author,
      role,
      time,
      createdAt,
      content,
      likes,
      comments: commentsList.length,
      shares,
      avatarUrl,
      hasAttachment,
      attachmentTitle,
      attachmentType,
      attachmentData,
      isUserPost,
      audienceCount,
      isLiked,
      isSaved: nextSaved,
      commentsList
    });
  };

  const handleShare = () => {
    setShareModalOpen(true);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !onUpdatePost) return;

    const activeAccountId = typeof window !== 'undefined' ? (localStorage.getItem('orbit_active_account_id') || 'personal-1') : 'personal-1';
    const authorName = currentUserProfile?.name || 'Alex Rivera';
    const authorRole = currentUserProfile?.role || 'Entrepreneur · Full Stack Developer · UI/UX Designer';
    const authorAvatar = currentUserProfile?.avatarUrl || `https://dummyimage.com/100x100/1e293b/ffffff?text=%24%7BcurrentUserProfile%3F.username%20%7C%7C%20'alex'%7D`;

    const newComment = {
      id: 'comment_' + Date.now(),
      accountId: activeAccountId,
      author: authorName,
      role: authorRole,
      avatarUrl: authorAvatar,
      content: newCommentText.trim(),
      time: 'just now',
      createdAt: Date.now(),
      likes: 0,
      isLiked: false,
      replies: []
    };

    const nextCommentsList = [...commentsList, newComment];
    setNewCommentText('');

    onUpdatePost({
      id,
      type,
      author,
      role,
      time,
      createdAt,
      content,
      likes,
      comments: nextCommentsList.length,
      shares,
      avatarUrl,
      hasAttachment,
      attachmentTitle,
      attachmentType,
      attachmentData,
      isUserPost,
      audienceCount,
      isLiked,
      isSaved,
      commentsList: nextCommentsList
    });
  };

  const handleCommentLike = (commentId: string) => {
    if (!onUpdatePost) return;
    const nextComments = commentsList.map((c) => {
      if (c.id === commentId) {
        const nextLiked = !c.isLiked;
        const currentLikes = c.likes || 0;
        return {
          ...c,
          isLiked: nextLiked,
          likes: nextLiked ? currentLikes + 1 : Math.max(0, currentLikes - 1)
        };
      }
      return c;
    });

    onUpdatePost({
      id,
      type,
      author,
      role,
      time,
      createdAt,
      content,
      likes,
      comments: nextComments.length,
      shares,
      avatarUrl,
      hasAttachment,
      attachmentTitle,
      attachmentType,
      attachmentData,
      isUserPost,
      audienceCount,
      isLiked,
      isSaved,
      commentsList: nextComments
    });
  };

  const handleReplyLike = (commentId: string, replyId: string) => {
    if (!onUpdatePost) return;
    const nextComments = commentsList.map((c) => {
      if (c.id === commentId) {
        const nextReplies = (c.replies || []).map((r: any) => {
          if (r.id === replyId) {
            const nextLiked = !r.isLiked;
            const currentLikes = r.likes || 0;
            return {
              ...r,
              isLiked: nextLiked,
              likes: nextLiked ? currentLikes + 1 : Math.max(0, currentLikes - 1)
            };
          }
          return r;
        });
        return { ...c, replies: nextReplies };
      }
      return c;
    });

    onUpdatePost({
      id,
      type,
      author,
      role,
      time,
      createdAt,
      content,
      likes,
      comments: nextComments.length,
      shares,
      avatarUrl,
      hasAttachment,
      attachmentTitle,
      attachmentType,
      attachmentData,
      isUserPost,
      audienceCount,
      isLiked,
      isSaved,
      commentsList: nextComments
    });
  };

  const handleReplySubmit = (e: React.FormEvent, commentId: string) => {
    e.preventDefault();
    const txt = replyTextMap[commentId]?.trim();
    if (!txt || !onUpdatePost) return;

    const activeAccountId = typeof window !== 'undefined' ? (localStorage.getItem('orbit_active_account_id') || 'personal-1') : 'personal-1';
    const authorName = currentUserProfile?.name || 'Alex Rivera';
    const authorRole = currentUserProfile?.role || 'Entrepreneur · Full Stack Developer · UI/UX Designer';
    const authorAvatar = currentUserProfile?.avatarUrl || `https://dummyimage.com/100x100/1e293b/ffffff?text=%24%7BcurrentUserProfile%3F.username%20%7C%7C%20'alex'%7D`;

    const newReply = {
      id: 'reply_' + Date.now(),
      accountId: activeAccountId,
      author: authorName,
      role: authorRole,
      avatarUrl: authorAvatar,
      content: txt,
      time: 'just now',
      createdAt: Date.now(),
      likes: 0,
      isLiked: false
    };

    const nextComments = commentsList.map((c) => {
      if (c.id === commentId) {
        return {
          ...c,
          replies: [...(c.replies || []), newReply]
        };
      }
      return c;
    });

    setReplyTextMap(prev => ({ ...prev, [commentId]: '' }));
    setActiveReplyCommentId(null);

    onUpdatePost({
      id,
      type,
      author,
      role,
      time,
      createdAt,
      content,
      likes,
      comments: nextComments.length,
      shares,
      avatarUrl,
      hasAttachment,
      attachmentTitle,
      attachmentType,
      attachmentData,
      isUserPost,
      audienceCount,
      isLiked,
      isSaved,
      commentsList: nextComments
    });
  };

  if (completelyRemoved) {
    return null;
  }

  if (hidden) {
    return (
      <div className="p-4 border-b border-border/50 bg-secondary/15 dark:bg-zinc-900/30 flex items-center justify-between text-sm transition-all animate-in fade-in duration-200">
        <div className="flex items-center gap-2">
          <XSquare className="w-5 h-5 text-muted-foreground" />
          <span className="text-muted-foreground">Post hidden. We will show you fewer posts like this.</span>
        </div>
        <button 
          onClick={() => {
            setHidden(false);
            setInterested(null);
            setCompletelyRemoved(false);
            persistHiddenState(false);
          }}
          className="text-primary font-bold hover:underline"
        >
          Undo
        </button>
      </div>
    );
  }

  return (
    <div 
      id={`post-${id}`} 
      className={cn(
        "relative w-full transition-all duration-700 scroll-mt-20", 
        isHighlighted && "ring-2 ring-primary rounded-xl shadow-md bg-primary/[0.03]",
        (optionsOpen || commentsOpen || showDeleteConfirm || videoPageOpen) ? "z-[100]" : "z-auto"
      )}
    >
      {/* Floating Global Toast Notification */}
      <AnimatePresence>
        {(copiedNotification || !!savedNotification) && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[150] bg-zinc-900/95 dark:bg-zinc-100/95 text-zinc-100 dark:text-zinc-900 px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-zinc-800 dark:border-zinc-200 max-w-sm w-max font-medium text-xs tracking-tight"
          >
            <Check className="w-4 h-4 text-green-500 shrink-0" />
            <span>{copiedNotification ? 'Link copied to clipboard!' : savedNotification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <article className={cn("pt-3 pb-2 mb-0 border-y sm:border sm:rounded-xl border-border bg-card dark:bg-zinc-900 transition-all sm:shadow-sm", isUserPost && "border-l-4 border-primary")}>
        <div className="px-4 flex justify-between items-start gap-2 mb-3">
          <div className="flex gap-3 min-w-0">
            <div className="flex-shrink-0 mt-0.5">
              <NextLink href={authorProfileLink} className="hover:opacity-85 transition-opacity block">
                <Image src={avatarUrl} alt={author} width={40} height={40} unoptimized className="rounded-full object-cover w-10 h-10 bg-muted ring-1 ring-zinc-200/50 dark:ring-zinc-800/50" referrerPolicy="no-referrer" />
              </NextLink>
            </div>
            <div className="min-w-0">
              <NextLink href={authorProfileLink} className="block group">
                <h3 className="font-bold text-sm text-foreground group-hover:underline cursor-pointer flex items-center gap-1">
                  {author}
                </h3>
              </NextLink>
              <p className="text-xs text-muted-foreground truncate">{role}</p>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-0.5">
                <span className="text-[10px] text-muted-foreground" suppressHydrationWarning>{displayTime}</span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span className="text-[10px] uppercase font-bold text-primary tracking-wider">{type.replace('_', ' ')}</span>
                <span className="w-1 h-1 rounded-full bg-border animate-pulse" />
                <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1 bg-secondary/60 px-1.5 py-0.5 rounded">
                  Public & matching interests
                </span>
              </div>
            </div>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setOptionsOpen(true);
            }}
            className="text-muted-foreground hover:text-foreground flex-shrink-0 p-1 -mr-1"
            id={`post-options-${id}`}
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
        
        <div className="w-full">
          {getAttachmentBlock()}
          {getTitleBlock()}
          {getContentBlock()}
          {getPollBlock()}

            {/* Inline notification banner */}
            {(copiedNotification || !!savedNotification) && (
              <div className="mx-4 mt-3 flex items-center gap-1.5 text-xs text-primary font-medium bg-primary/10 px-2.5 py-1.5 rounded-lg w-max animate-in fade-in slide-in-from-bottom-1 duration-200">
                <Check className="w-3.5 h-3.5" />
                <span>{copiedNotification ? 'Link copied to clipboard!' : savedNotification}</span>
              </div>
            )}

            <div className="px-4 mt-4 flex items-center justify-between text-muted-foreground max-w-md">
              <button 
                id={`post-like-btn-${id}`}
                onClick={handleLike}
                className={cn("flex items-center gap-2 transition-colors group", isLiked ? "text-black dark:text-white" : "hover:text-black dark:hover:text-white")}
              >
                <div className={cn("p-2 rounded-full -ml-2", isLiked ? "group-hover:bg-black/10 dark:group-hover:bg-white/10" : "group-hover:bg-black/5 dark:group-hover:bg-white/5")}>
                  <Heart className={cn("w-5 h-5 transition-transform active:scale-125", isLiked && "fill-current")} />
                </div>
                <span className="text-sm">{likes}</span>
              </button>

              <button 
                id={`post-comment-btn-${id}`}
                onClick={() => setCommentsOpen(true)}
                className="flex items-center gap-2 hover:text-primary transition-colors group"
              >
                <div className="p-2 rounded-full group-hover:bg-primary/10">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <span className="text-sm">{commentsList.length}</span>
              </button>

              <button 
                id={`post-share-btn-${id}`}
                onClick={handleShare}
                className="flex items-center gap-2 hover:text-primary transition-colors group"
              >
                <div className="p-2 rounded-full group-hover:bg-primary/10">
                  <Share2 className="w-5 h-5" />
                </div>
                <span className="text-sm">{shares}</span>
              </button>

              <button 
                id={`post-save-btn-${id}`}
                onClick={handleSave}
                className={cn("flex items-center transition-colors group", isSaved ? "text-indigo-500" : "hover:text-indigo-500")}
              >
                <div className="p-2 rounded-full group-hover:bg-indigo-500/10">
                  <Bookmark className={cn("w-5 h-5", isSaved && "fill-current")} />
                </div>
              </button>
            </div>
          </div>
      </article>

      {/* --- DETAILED POST COMMENTS VIEW OVERLAY --- */}
      {mounted && typeof window !== 'undefined' && document.body && createPortal(
        <AnimatePresence>
          {commentsOpen && (
            <>
              {/* Post Details Full Page container */}
              <div className="fixed inset-0 z-[120] flex items-center justify-center pointer-events-none">
              <motion.div 
                drag="x"
                dragDirectionLock
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={{ left: 0, right: 1 }}
                onDragEnd={(event, info) => {
                  if (info.offset.x > 80 || info.velocity.x > 200) {
                    setCommentsOpen(false);
                  }
                }}
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 260 }}
                className="pointer-events-auto w-full h-full bg-white dark:bg-zinc-950 flex flex-col overflow-hidden touch-pan-x"
              >
                {/* Header */}
                <div className="w-full bg-white dark:bg-zinc-950 border-b border-border sticky top-0 z-30 shrink-0">
                  <div className="flex items-center justify-between px-4 h-14 w-full max-w-3xl mx-auto">
                    <button 
                      onClick={() => setCommentsOpen(false)}
                      className="p-2 hover:bg-muted rounded-full transition-colors -ml-2 text-foreground flex items-center gap-1"
                      aria-label="Back to feed"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <span className="font-display font-bold text-base tracking-tight text-foreground">Post Details</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setOptionsOpen(true);
                      }}
                      className="p-2 hover:bg-muted rounded-full transition-colors -mr-2 text-muted-foreground hover:text-foreground"
                      id={`post-detail-options-${id}`}
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Scrollable conversation thread */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 w-full max-w-3xl mx-auto bg-white dark:bg-zinc-950">
            
            {/* The Post detailed header card */}
            <div className="pb-6 border-b border-zinc-100 dark:border-zinc-900">
              <div className="flex items-center gap-3">
                <Image 
                  src={avatarUrl} 
                  alt={author} 
                  width={44} 
                  height={44} 
                  unoptimized
                  className="rounded-full object-cover w-11 h-11 bg-zinc-100 dark:bg-zinc-900 ring-1 ring-zinc-200 dark:ring-zinc-800/80" 
                  referrerPolicy="no-referrer" 
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 hover:underline cursor-pointer tracking-tight">{author}</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">{role}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500" suppressHydrationWarning>{displayTime}</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                    <span className="text-[10px] uppercase font-mono font-bold text-zinc-600 dark:text-zinc-400 tracking-wider bg-zinc-100 dark:bg-zinc-900 px-1.5 py-0.5 rounded">{type.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 text-base md:text-lg text-zinc-800 dark:text-white whitespace-pre-wrap leading-relaxed font-sans tracking-tight">
                {content.length > 500 && !isExpanded ? (
                  <>
                    {renderFormattedContent(content.slice(0, 500) + '...')}
                    <button 
                      onClick={() => setIsExpanded(true)}
                      className="text-primary font-bold ml-1 hover:underline text-sm inline-block"
                    >
                      Read more
                    </button>
                  </>
                ) : (
                  <>
                    {renderFormattedContent(content)}
                    {content.length > 500 && (
                      <button 
                        onClick={() => setIsExpanded(false)}
                        className="text-primary font-bold ml-1 hover:underline text-sm block mt-2"
                      >
                        Show less
                      </button>
                    )}
                  </>
                )}
              </div>
              {getPollBlock()}

              {hasAnyAttachment && (
                <div className="mt-5">
                  {isDocument ? (
                    <div className="max-w-xs sm:max-w-sm">
                      <div className="p-2.5 flex items-center justify-between gap-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <div className="p-2 bg-green-500/10 text-green-600 dark:text-green-400 rounded-lg shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-foreground truncate">{attachmentTitle || "document.pdf"}</p>
                            <p className="text-[10px] text-muted-foreground font-mono">PDF Document</p>
                          </div>
                        </div>
                        <a 
                          href={resolvedAttachmentData || fallbackDocData} 
                          download={attachmentTitle || "document.pdf"}
                          className="px-3.5 py-1.5 bg-green-600 hover:bg-green-700 text-white dark:bg-green-700 dark:hover:bg-green-600 text-xs font-semibold rounded-lg shadow-sm hover:shadow transition-all shrink-0 flex items-center gap-1.5"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </a>
                      </div>
                    </div>
                  ) : (
                    (resolvedAttachmentData || isPhoto || isVideo) ? (
                      <div className={cn(
                        "rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/20 w-full max-w-xs md:max-w-md"
                      )}>
                        {isPhoto && (
                          <div className="relative w-full flex items-center justify-center bg-zinc-950/20 dark:bg-zinc-950/40">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                              src={resolvedAttachmentData || `https://dummyimage.com/800x600/1e293b/ffffff?text=%24%7Bid%7D`} 
                              alt={attachmentTitle || "Attached Image"} 
                              className="w-full h-auto max-h-[75vh] object-contain rounded-2xl block"
                            />
                          </div>
                        )}
                        {isVideo && (
                          <div 
                            className="relative w-full aspect-[9/12] max-h-[85vh] flex items-center justify-center bg-zinc-950 rounded-2xl overflow-hidden border border-border/40 shadow-sm group"
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              setActivePlayId(id);
                              setActivePlayVideoSrc(resolvedAttachmentData || "https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4");
                              setActivePlayTitle(attachmentTitle || "Product Demo Video");
                              setActivePlayAuthor(author);
                              setActivePlayRole(role);
                              setActivePlayAvatar(avatarUrl);
                              setActivePlayContent(content);
                              setActivePlayLikes(likes);
                              setActivePlayComments(commentsList || []);
                              setActivePlayIsLiked(isLiked);
                              setLocalSharesCount(shares);
                              setVideoPlaying(true);
                              setVideoPageOpen(true);
                            }}
                          >
                            <video 
                              src={(resolvedAttachmentData || "https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4") + "#t=0.001"}
                              preload="metadata"
                              className="w-full h-full object-cover cursor-pointer"
                              onTimeUpdate={(e) => {
                                const v = e.currentTarget;
                                if (v.duration) {
                                  setInlineVideoProgress((v.currentTime / v.duration) * 100);
                                }
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                const v = e.currentTarget;
                                if (v.paused) {
                                  v.play().catch(() => {});
                                  setInlinePlaying(true);
                                } else {
                                  v.pause();
                                  setInlinePlaying(false);
                                }
                              }}
                              onEnded={(e) => {
                                const v = e.currentTarget;
                                v.currentTime = 0;
                                v.pause();
                                setInlinePlaying(false);
                                setInlineVideoProgress(0);
                              }}
                            />
                            {inlinePlaying && (
                              <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30 backdrop-blur-sm pointer-events-none">
                                <div 
                                  className="h-full bg-white/80" 
                                  style={{ width: `${inlineVideoProgress}%` }}
                                />
                              </div>
                            )}
                            {!inlinePlaying && (
                              <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-black/20">
                                <div className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/90 border border-white/20">
                                  <Play className="w-8 h-8 ml-1 fill-current" />
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-3.5 flex items-center gap-3 bg-zinc-50 dark:bg-zinc-900/30 hover:bg-zinc-100 dark:hover:bg-zinc-900/50 transition-colors cursor-pointer w-max max-w-full">
                         <Paperclip className="w-4 h-4 text-zinc-500 dark:text-zinc-400 flex-shrink-0" />
                         <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">{attachmentTitle || "Attachment"}</span>
                      </div>
                    )
                  )}
                </div>
              )}

              {/* Status statistics row */}
              <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-900">
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300">
                    <Heart className="w-3 h-3 fill-current" />
                  </div>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">{likes} likes</span>
                </div>
                <div className="flex items-center gap-3 font-medium text-zinc-500 dark:text-zinc-400">
                  <span>{commentsList.length} comments</span>
                  <span>{shares} shares</span>
                </div>
              </div>

              {/* Interactive buttons row */}
              <div className="flex items-center justify-between border-t border-b border-zinc-100 dark:border-zinc-900 py-1.5 mt-4 text-zinc-500 dark:text-zinc-400">
                <button 
                  id={`post-detail-like-${id}`}
                  onClick={handleLike}
                  className={cn("flex-1 py-2 flex items-center justify-center gap-2 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors text-xs font-semibold", isLiked ? "text-zinc-900 dark:text-white" : "hover:text-zinc-900 dark:hover:text-white")}
                >
                  <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
                  <span>Like</span>
                </button>
                <button 
                  id={`post-detail-comment-btn-${id}`}
                  onClick={() => {
                    commentInputRef.current?.focus();
                  }}
                  className="flex-1 py-2 flex items-center justify-center gap-2 text-zinc-900 dark:text-white font-semibold text-xs bg-zinc-50 dark:bg-zinc-900/60 hover:bg-zinc-100 dark:hover:bg-zinc-850 rounded-xl transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Comment</span>
                </button>
                <button 
                  id={`post-detail-share-${id}`}
                  onClick={handleShare}
                  className="flex-1 py-2 flex items-center justify-center gap-2 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-white transition-colors text-xs font-semibold"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
                <button 
                  onClick={handleSave}
                  className={cn("px-3 py-2 flex items-center justify-center rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors", isSaved ? "text-indigo-500 dark:text-indigo-400" : "hover:text-indigo-500 dark:hover:text-indigo-400")}
                >
                  <Bookmark className={cn("w-4 h-4", isSaved && "fill-current")} />
                </button>
              </div>
            </div>

            {/* List of Comments with thread lines */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">All Comments</h4>

              {commentsList.length === 0 ? (
                <p className="text-xs text-muted-foreground italic pl-1 py-4">No comments yet. Be the first to join the conversation!</p>
              ) : (
                commentsList.map((comment: any, index: number) => {
                  const hasReplies = comment.replies && comment.replies.length > 0;
                  const isReplyingToThis = activeReplyCommentId === comment.id;
                  const showThreadLine = hasReplies || isReplyingToThis;
                  const isLastComment = index === commentsList.length - 1;

                  return (
                    <div key={comment.id} className="group/comment flex flex-col relative animate-in fade-in slide-in-from-bottom-2 duration-200">
                      {/* Line connecting first-level comments to each other */}
                      {!isLastComment && (
                        <div className="absolute left-[15px] top-[18px] bottom-[-34px] w-[1.5px] bg-zinc-200 dark:bg-zinc-800 pointer-events-none" />
                      )}

                      {/* Parent Comment Flex Row */}
                      <div className="flex gap-2.5 items-start relative z-10">
                        {/* Thread line starting at bottom of parent avatar and going to first reply */}
                        {showThreadLine && (
                          <div className="absolute left-[15px] top-[34px] bottom-[-2px] w-[1.5px] bg-zinc-200 dark:bg-zinc-800 pointer-events-none" />
                        )}
                        <NextLink href={getProfileLink(comment.author, comment.author === 'Alex Rivera' || comment.author === currentUserName, currentUserName)} className="hover:opacity-85 transition-opacity block mt-0.5 shrink-0">
                          <Image 
                            src={comment.avatarUrl || 'https://dummyimage.com/100x100/1e293b/ffffff?text=default'} 
                            alt={comment.author} 
                            width={32} 
                            height={32} 
                            unoptimized
                            className="rounded-full object-cover w-8 h-8 bg-zinc-50 dark:bg-zinc-900 ring-1 ring-zinc-200/50 dark:ring-zinc-800/50 shadow-sm"
                            referrerPolicy="no-referrer"
                          />
                        </NextLink>
                        
                        <div className="flex-1 min-w-0">
                          {/* Speech Bubble */}
                          <div className="inline-block bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800/40 rounded-2xl px-3.5 py-2.5 text-xs relative max-w-full">
                            <div className="flex flex-col mb-0.5">
                              <NextLink href={getProfileLink(comment.author, comment.author === 'Alex Rivera' || comment.author === currentUserName, currentUserName)} className="hover:underline cursor-pointer block">
                                <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs">{comment.author}</span>
                              </NextLink>
                              {comment.role && (
                                <span className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate max-w-[280px] font-normal">{comment.role}</span>
                              )}
                            </div>
                            <p className="text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap leading-relaxed mt-1.5 text-xs font-normal">{comment.content}</p>
                            
                            {/* Thumbs Up Pill in Bubble corner */}
                            {(comment.likes && comment.likes > 0) ? (
                              <div className="absolute -right-2 -bottom-2 flex items-center gap-0.5 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-100 dark:border-zinc-800 px-1.5 py-0.5 rounded-full text-[9px] font-semibold shadow-sm hover:scale-105 transition-transform">
                                <ThumbsUp className="w-2.5 h-2.5 text-zinc-500 dark:text-zinc-400 fill-current" />
                                <span>{comment.likes}</span>
                              </div>
                            ) : null}
                          </div>

                          {/* Actions under bubble */}
                          <div className="flex items-center gap-3.5 mt-1.5 ml-2 text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold">
                            <span>{getFormattedRelativeTime(getStableTimestamp(comment.id, comment.time, comment.createdAt))}</span>
                            <button 
                              onClick={() => handleCommentLike(comment.id)}
                              className={cn("hover:underline transition-colors", comment.isLiked ? "text-zinc-900 dark:text-white font-bold" : "hover:text-zinc-900 dark:hover:text-white")}
                            >
                              {comment.isLiked ? 'Liked' : 'Like'}
                            </button>
                            <button 
                              onClick={() => {
                                if (isReplyingToThis) {
                                  setActiveReplyCommentId(null);
                                } else {
                                  setActiveReplyCommentId(comment.id);
                                  setReplyTextMap(prev => ({ ...prev, [comment.id]: `@${comment.author} ` }));
                                }
                              }}
                              className={cn("hover:underline transition-colors", isReplyingToThis ? "text-zinc-900 dark:text-white font-bold" : "hover:text-zinc-900 dark:hover:text-white")}
                            >
                              Reply
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Replies list and Thread connector line */}
                      <div className="relative pl-10 mt-2.5 space-y-3">
                        {/* Render Replies */}
                        {comment.replies && comment.replies.map((reply: any, rIndex: number) => {
                          const hasNextItem = rIndex < comment.replies.length - 1 || isReplyingToThis;
                          return (
                            <div key={reply.id} className="relative flex gap-2.5 items-start">
                              {/* Downward line from current reply's avatar to next item's avatar */}
                              {hasNextItem && (
                                <div className="absolute left-[-25px] top-[28px] bottom-[-4px] w-[1.5px] bg-zinc-200 dark:bg-zinc-800 pointer-events-none" />
                              )}

                              {/* Curved L-branch connector line */}
                              <div className="absolute left-[-25px] top-[-8px] w-[25px] h-[22px] border-l-[1.5px] border-b-[1.5px] border-zinc-200 dark:border-zinc-800 rounded-bl-lg pointer-events-none" />
                              
                              <NextLink href={getProfileLink(reply.author, reply.author === 'Alex Rivera' || reply.author === currentUserName, currentUserName)} className="hover:opacity-85 transition-opacity block mt-0.5 shrink-0 relative z-10">
                                <Image 
                                  src={reply.avatarUrl || 'https://dummyimage.com/100x100/1e293b/ffffff?text=default'} 
                                  alt={reply.author} 
                                  width={26} 
                                  height={26} 
                                  unoptimized
                                  className="rounded-full object-cover w-6.5 h-6.5 bg-zinc-50 dark:bg-zinc-900 ring-1 ring-zinc-200/50 dark:ring-zinc-800/50 shadow-sm"
                                  referrerPolicy="no-referrer"
                                />
                              </NextLink>

                              <div className="flex-1 min-w-0">
                                {/* Reply Speech Bubble */}
                                <div className="inline-block bg-zinc-50/70 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800/30 rounded-2xl px-3 py-2 text-xs relative max-w-full">
                                  <div className="flex flex-col">
                                    <NextLink href={getProfileLink(reply.author, reply.author === 'Alex Rivera' || reply.author === currentUserName, currentUserName)} className="hover:underline cursor-pointer block">
                                      <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs">{reply.author}</span>
                                    </NextLink>
                                    {reply.role && (
                                      <span className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate max-w-[240px] font-normal">{reply.role}</span>
                                    )}
                                  </div>
                                  <p className="text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap leading-relaxed mt-1.5 text-xs font-normal">{reply.content}</p>

                                  {/* Thumbs Up Pill in Bubble corner for Reply */}
                                  {(reply.likes && reply.likes > 0) ? (
                                    <div className="absolute -right-2 -bottom-2 flex items-center gap-0.5 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-100 dark:border-zinc-800 px-1 py-0.5 rounded-full text-[9px] font-semibold shadow-sm hover:scale-105 transition-transform">
                                      <ThumbsUp className="w-2.5 h-2.5 text-zinc-500 dark:text-zinc-400 fill-current" />
                                      <span>{reply.likes}</span>
                                    </div>
                                  ) : null}
                                </div>

                                {/* Reply Actions */}
                                <div className="flex items-center gap-3.5 mt-1 ml-2 text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold">
                                  <span>{getFormattedRelativeTime(getStableTimestamp(reply.id, reply.time, reply.createdAt))}</span>
                                  <button 
                                    onClick={() => handleReplyLike(comment.id, reply.id)}
                                    className={cn("hover:underline transition-colors", reply.isLiked ? "text-zinc-900 dark:text-white font-bold" : "hover:text-zinc-900 dark:hover:text-white")}
                                  >
                                    {reply.isLiked ? 'Liked' : 'Like'}
                                  </button>
                                  <button 
                                    onClick={() => {
                                      setActiveReplyCommentId(comment.id);
                                      setReplyTextMap(prev => ({ ...prev, [comment.id]: `@${reply.author} ` }));
                                    }}
                                    className="hover:underline transition-colors hover:text-zinc-900 dark:hover:text-white"
                                  >
                                    Reply
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}

                        {/* Active Inline Reply Form */}
                        {isReplyingToThis && (
                          <form 
                            onSubmit={(e) => handleReplySubmit(e, comment.id)} 
                            className="relative flex gap-2.5 items-center pl-1 animate-in slide-in-from-top-1 duration-150"
                          >
                            {/* Curved L-branch connector line for reply form */}
                            <div className="absolute left-[-25px] top-[-8px] w-[25px] h-[22px] border-l-[1.5px] border-b-[1.5px] border-zinc-200 dark:border-zinc-800 rounded-bl-lg pointer-events-none" />
                            
                            <Image 
                              src="https://dummyimage.com/100x100/1e293b/ffffff?text=alex" 
                              alt="Alex Rivera" 
                              width={26} 
                              height={26} 
                              unoptimized
                              className="rounded-full object-cover w-6.5 h-6.5 bg-zinc-50 dark:bg-zinc-900 ring-1 ring-zinc-200/50 dark:ring-zinc-800/50 shadow-sm relative z-10"
                              referrerPolicy="no-referrer"
                            />

                            <div className="flex-1 flex gap-2 relative">
                              <input
                                type="text"
                                value={replyTextMap[comment.id] || ''}
                                onChange={(e) => setReplyTextMap(prev => ({ ...prev, [comment.id]: e.target.value }))}
                                placeholder={`Reply to ${comment.author.split(' ')[0]}...`}
                                autoFocus
                                className="w-full bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-150 dark:border-zinc-800 focus:bg-white dark:focus:bg-zinc-950 focus:border-zinc-300 dark:focus:border-zinc-700 text-xs rounded-full pl-3.5 pr-10 py-1.5 focus:outline-none transition-colors text-zinc-900 dark:text-zinc-100"
                              />
                              <button 
                                type="submit" 
                                disabled={!(replyTextMap[comment.id] || '').trim()}
                                className="absolute right-1 top-0.5 p-1 rounded-full text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                              >
                                <Send className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </form>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Sticky Bottom Input Form (Facebook/Sticker style, matching the photo) */}
          <div className="sticky bottom-0 bg-white dark:bg-zinc-950 border-t border-border p-3 pb-safe z-20 shadow-lg w-full">
            <form onSubmit={handleCommentSubmit} className="flex gap-2 items-center max-w-3xl mx-auto w-full">
              {/* Profile image with active dot */}
              <div className="flex-shrink-0 relative">
                <Image 
                  src="https://dummyimage.com/100x100/1e293b/ffffff?text=alex" 
                  alt="Alex Rivera" 
                  width={32} 
                  height={32} 
                  unoptimized
                  className="rounded-full object-cover w-8 h-8 bg-muted border border-border/80"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-black rounded-full" />
              </div>

              {/* Pill Comment input container */}
              <div className="flex-1 bg-secondary/50 hover:bg-secondary/70 focus-within:bg-background border border-border/60 focus-within:border-primary/50 rounded-full flex items-center px-3 py-1.5 transition-all">
                <input
                  ref={commentInputRef}
                  id={`post-comment-input-${id}`}
                  type="text"
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 bg-transparent border-none text-xs focus:outline-none placeholder-muted-foreground text-foreground min-w-0 pr-2 py-0.5"
                />
                
                {/* Facebook style icon picker bar */}
                <div className="flex items-center gap-1.5 text-muted-foreground/80 flex-shrink-0">
                  <button 
                    type="button" 
                    className="p-1 hover:bg-muted hover:text-foreground rounded-full transition-colors"
                    title="Insert image"
                  >
                    <ImageIcon className="w-4 h-4" />
                  </button>
                  <button 
                    type="button" 
                    className="p-1 hover:bg-muted hover:text-foreground rounded-full transition-colors hidden sm:block"
                    title="Insert stickers"
                  >
                    <Sparkles className="w-4 h-4" />
                  </button>
                  <button 
                    type="button" 
                    className="p-1 hover:bg-muted hover:text-foreground rounded-full transition-colors"
                    title="Insert emoji"
                  >
                    <Smile className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Send Button */}
              <button 
                type="submit" 
                disabled={!newCommentText.trim()}
                className="p-2 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:hover:bg-primary rounded-full transition-colors flex items-center justify-center shadow-sm flex-shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </>
  )}
</AnimatePresence>,
document.body
)}

      {mounted && typeof window !== 'undefined' && document.body && createPortal(
        <AnimatePresence>
          {optionsOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOptionsOpen(false)}
                className="fixed inset-0 bg-black/60 dark:bg-black/80 z-[9999] backdrop-blur-[2px]"
              />

              {/* Bottom Sheet Drawer */}
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 280 }}
                className="fixed bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-[32px] bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200/80 dark:border-zinc-800/80 z-[10000] shadow-2xl pb-8 pt-2 select-none md:max-w-md md:mx-auto md:bottom-4 md:rounded-[32px] md:border"
              >
                {/* Drag Handle */}
                <div 
                  className="w-12 h-1.5 bg-zinc-300 dark:bg-zinc-800 rounded-full mx-auto my-3 cursor-pointer hover:bg-zinc-400 dark:hover:bg-zinc-700 transition-colors" 
                  onClick={() => setOptionsOpen(false)} 
                />

                <div className="px-4 space-y-4">
                  {/* Section 1: Interested / Not Interested */}
                  <div className="bg-white dark:bg-zinc-900 rounded-[24px] overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] border border-zinc-200/50 dark:border-zinc-800/50 divide-y divide-zinc-100 dark:divide-zinc-800">
                    {/* Interested */}
                    <button 
                      type="button"
                      onClick={() => {
                        setInterested(true);
                        setOptionsOpen(false);
                        setSavedNotification('Marked as Interested. We will show you more posts like this.');
                        setTimeout(() => setSavedNotification(''), 3000);
                      }}
                      className="w-full text-left py-4 px-4 flex items-center gap-4 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/50 active:bg-zinc-100/80 dark:active:bg-zinc-800/80 transition-all duration-150 group"
                    >
                      <div className="p-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl flex-shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-150">
                        <PlusCircle className="w-5.5 h-5.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[15px] text-zinc-900 dark:text-zinc-50 tracking-tight">Interested</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-normal">More of your posts will be like this.</p>
                      </div>
                    </button>

                    {/* Not interested */}
                    <button 
                      type="button"
                      onClick={() => {
                        setInterested(false);
                        setOptionsOpen(false);
                        setCommentsOpen(false);
                        setHidden(true);
                        persistHiddenState(true);
                        setSavedNotification('We will show you fewer posts like this.');
                        setTimeout(() => setSavedNotification(''), 3000);
                      }}
                      className="w-full text-left py-4 px-4 flex items-center gap-4 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/50 active:bg-zinc-100/80 dark:active:bg-zinc-800/80 transition-all duration-150 group"
                    >
                      <div className="p-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl flex-shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-150">
                        <MinusCircle className="w-5.5 h-5.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[15px] text-zinc-900 dark:text-zinc-50 tracking-tight">Not interested</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-normal">Fewer of your posts will be like this.</p>
                      </div>
                    </button>
                  </div>

                  {/* Section 2: Actions List */}
                  <div className="bg-white dark:bg-zinc-900 rounded-[24px] overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] border border-zinc-200/50 dark:border-zinc-800/50 divide-y divide-zinc-100 dark:divide-zinc-800">
                    {/* Save post */}
                    <button 
                      type="button"
                      onClick={() => {
                        handleSave();
                        setOptionsOpen(false);
                      }}
                      className="w-full text-left py-4 px-4 flex items-center gap-4 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/50 active:bg-zinc-100/80 dark:active:bg-zinc-800/80 transition-all duration-150 group"
                    >
                      <div className="p-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl flex-shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-150">
                        <Bookmark className={cn("w-5.5 h-5.5 transition-colors", isSaved && "fill-primary text-primary dark:fill-primary")} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[15px] text-zinc-900 dark:text-zinc-50 tracking-tight">{isSaved ? 'Unsave post' : 'Save post'}</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-normal">
                          {isSaved ? 'Remove this from your saved items.' : 'Add this to your saved items.'}
                        </p>
                      </div>
                    </button>

                    {/* Share */}
                    <button 
                      type="button"
                      onClick={() => {
                        handleShare();
                        setOptionsOpen(false);
                      }}
                      className="w-full text-left py-4 px-4 flex items-center justify-between hover:bg-zinc-50/80 dark:hover:bg-zinc-800/50 active:bg-zinc-100/80 dark:active:bg-zinc-800/80 transition-all duration-150 group"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="p-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl flex-shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-150">
                          <Share2 className="w-5.5 h-5.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[15px] text-zinc-900 dark:text-zinc-50 tracking-tight">Share</p>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-normal">Share this content with your professional network.</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-zinc-400 dark:text-zinc-500 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    </button>

                    {/* I don't want to see this */}
                    <button 
                      type="button"
                      onClick={() => {
                        setOptionsOpen(false);
                        setCommentsOpen(false);
                        setHidden(true);
                        persistHiddenState(true);
                        setSavedNotification('We will hide this post from your feed.');
                        setTimeout(() => setSavedNotification(''), 3000);
                      }}
                      className="w-full text-left py-4 px-4 flex items-center justify-between hover:bg-zinc-50/80 dark:hover:bg-zinc-800/50 active:bg-zinc-100/80 dark:active:bg-zinc-800/80 transition-all duration-150 group"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="p-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl flex-shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-150">
                          <XSquare className="w-5.5 h-5.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[15px] text-zinc-900 dark:text-zinc-50 tracking-tight">I don&apos;t want to see this</p>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-normal">Hide this specific post from your dashboard.</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-zinc-400 dark:text-zinc-500 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    </button>

                    {/* Report post */}
                    <button 
                      type="button"
                      onClick={() => {
                        setOptionsOpen(false);
                        setSavedNotification('Post reported. We will review it shortly.');
                        setTimeout(() => setSavedNotification(''), 3000);
                      }}
                      className="w-full text-left py-4 px-4 flex items-center justify-between hover:bg-zinc-50/80 dark:hover:bg-zinc-800/50 active:bg-zinc-100/80 dark:active:bg-zinc-800/80 transition-all duration-150 group"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="p-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl flex-shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-150">
                          <MessageSquareWarning className="w-5.5 h-5.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[15px] text-zinc-900 dark:text-zinc-50 tracking-tight">Report post</p>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-normal">
                            We won&apos;t let {author} know who reported this.
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-zinc-400 dark:text-zinc-500 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    </button>

                    {/* Turn on/off notifications for this post */}
                    <button 
                      type="button"
                      onClick={() => {
                        const nextNotif = !isNotificationsOn;
                        setIsNotificationsOn(nextNotif);
                        setOptionsOpen(false);
                        setSavedNotification(nextNotif ? 'Notifications turned on for this post' : 'Notifications turned off for this post');
                        setTimeout(() => setSavedNotification(''), 2500);
                      }}
                      className="w-full text-left py-4 px-4 flex items-center gap-4 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/50 active:bg-zinc-100/80 dark:active:bg-zinc-800/80 transition-all duration-150 group"
                    >
                      <div className="p-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl flex-shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-150">
                        <Bell className={cn("w-5.5 h-5.5 transition-colors", isNotificationsOn && "fill-primary text-primary dark:fill-primary")} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[15px] text-zinc-900 dark:text-zinc-50 tracking-tight">
                          {isNotificationsOn ? 'Turn off notifications for this post' : 'Turn on notifications for this post'}
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-normal">
                          {isNotificationsOn ? 'Stop receiving notifications for comments.' : 'Get notified when others reply to this.'}
                        </p>
                      </div>
                    </button>

                    {/* Copy link */}
                    <button 
                      type="button"
                      onClick={() => {
                        setOptionsOpen(false);
                        setCopiedNotification(true);
                        setTimeout(() => setCopiedNotification(false), 2000);
                        try {
                          navigator.clipboard.writeText(`${window.location.origin}/post/${id}`);
                        } catch (_) {}
                      }}
                      className="w-full text-left py-4 px-4 flex items-center gap-4 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/50 active:bg-zinc-100/80 dark:active:bg-zinc-800/80 transition-all duration-150 group"
                    >
                      <div className="p-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl flex-shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-150">
                        <Link className="w-5.5 h-5.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[15px] text-zinc-900 dark:text-zinc-50 tracking-tight">Copy link</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-normal">Copy post URL to your device clipboard.</p>
                      </div>
                    </button>

                    {/* Report to admin */}
                    <button 
                      type="button"
                      onClick={() => {
                        setOptionsOpen(false);
                        setSavedNotification('Reported to admin. Thank you for keeping the community safe.');
                        setTimeout(() => setSavedNotification(''), 3000);
                      }}
                      className="w-full text-left py-4 px-4 flex items-center gap-4 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/50 active:bg-zinc-100/80 dark:active:bg-zinc-800/80 transition-all duration-150 group"
                    >
                      <div className="p-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl flex-shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-150">
                        <Shield className="w-5.5 h-5.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[15px] text-zinc-900 dark:text-zinc-50 tracking-tight">Report to admin</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-normal">Flag this post directly to system administrators.</p>
                      </div>
                    </button>

                    {/* Delete post */}
                    {isUserPost && (
                      <button 
                        type="button"
                        id={`delete-post-${id}`}
                        onClick={() => {
                          setOptionsOpen(false);
                          setShowDeleteConfirm(true);
                        }}
                        className="w-full text-left py-4 px-4 flex items-center gap-4 hover:bg-red-50 dark:hover:bg-red-950/20 active:bg-red-100 dark:active:bg-red-950/40 transition-all duration-150 text-red-600 dark:text-red-400 group"
                      >
                        <div className="p-2.5 bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 rounded-xl flex-shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-150">
                          <Trash2 className="w-5.5 h-5.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[15px] tracking-tight">Delete post</p>
                          <p className="text-xs text-red-500/85 dark:text-red-400/85 mt-0.5 leading-normal">Permanently remove this post from your feed and database.</p>
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Delete Confirmation Modal */}
      {mounted && typeof window !== 'undefined' && document.body && createPortal(
        <AnimatePresence>
          {showDeleteConfirm && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowDeleteConfirm(false)}
                className="fixed inset-0 bg-black/60 dark:bg-black/80 z-[9999] backdrop-blur-[1px]"
              />

              {/* Modal Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="fixed inset-x-4 top-[35%] md:top-[40%] mx-auto max-w-sm bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl z-[10000] overflow-hidden select-none p-5 text-center"
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="p-3 bg-red-500/10 text-red-600 dark:text-red-400 rounded-full">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-medium text-base text-zinc-900 dark:text-zinc-100">Are you sure you want this?</h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">This action cannot be undone. This post will be permanently deleted.</p>
                  </div>
                  <div className="flex gap-3 w-full mt-2">
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 py-2.5 px-4 text-sm font-medium border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors text-zinc-700 dark:text-zinc-300"
                    >
                      No
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setCommentsOpen(false);
                        if (onDeletePost) {
                          onDeletePost(id);
                        } else {
                          setHidden(true);
                        }
                      }}
                      className="flex-1 py-2.5 px-4 text-sm font-medium bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 rounded-xl text-white transition-colors"
                    >
                      Yes
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Immersive Video Page Overlay */}
      <AnimatePresence>
        {videoPageOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-neutral-950/98 backdrop-blur-xl flex items-center justify-center overflow-hidden h-screen w-screen"
          >
            {/* Ambient Background Blur of the current video */}
            <div className="absolute inset-0 pointer-events-none opacity-30 select-none overflow-hidden hidden md:block">
              <div className="absolute inset-0 bg-neutral-900/40 z-10" />
              <video
                src={activePlayVideoSrc}
                muted
                autoPlay
                loop
                playsInline
                className="w-full h-full object-cover blur-3xl scale-125"
              />
            </div>

            {/* Main Interactive Reels Mockup Device Viewport */}
            <motion.div
              initial={{ scale: 0.9, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 40, opacity: 0 }}
              transition={{ type: 'spring', damping: 24, stiffness: 190 }}
              className={cn(
                "relative bg-black shadow-2xl overflow-hidden flex flex-col z-20",
                // Mobile: full viewport | Desktop: smartphone chassis aspect-[9/16]
                "w-full h-full md:w-[420px] md:h-[90vh] md:max-h-[840px] md:min-h-[640px] md:rounded-[36px] md:border-[10px] md:border-zinc-900/90 md:ring-4 md:ring-zinc-800/40"
              )}
            >
              {/* Phone Speaker Notch / Dynamic Island for ultra-high-fidelity mobile theme on desktop */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-zinc-900 rounded-full z-40 hidden md:block" />

              {/* Top Navigation Bar: Matches screenshot (< Reels [Search] [Profile]) */}
              <div className="absolute top-0 inset-x-0 z-30 flex items-center justify-between px-4 py-6 md:pt-8 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-auto">
                {/* Left Side: Back Arrow and Title */}
                <button
                  onClick={() => {
                    setVideoPageOpen(false);
                    setVideoIsFullPage(false);
                    setCommentDrawerOpen(false);
                    setOptionsMenuOpen(false);
                  }}
                  className="flex items-center gap-2 text-white hover:text-neutral-200 transition-colors py-1 px-2 -ml-2 rounded-full hover:bg-white/10"
                >
                  <ArrowLeft className="w-6 h-6 stroke-[2.5]" />
                  <span className="text-xl font-bold tracking-tight">Reels</span>
                </button>

                {/* Right Side: Search and Profile Outline icons */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowSearchOverlay(!showSearchOverlay)}
                    className={cn(
                      "p-2 rounded-full text-white transition-all hover:bg-white/10 active:scale-90",
                      showSearchOverlay && "bg-white/20"
                    )}
                    title="Search reels"
                  >
                    <Search className="w-6 h-6 stroke-[2.2]" />
                  </button>
                  <button
                    onClick={() => setShowProfileCard(!showProfileCard)}
                    className={cn(
                      "p-1.5 rounded-full text-white transition-all hover:bg-white/10 border-2 border-white/80 overflow-hidden relative w-8 h-8",
                      showProfileCard && "bg-white/20 ring-2 ring-primary"
                    )}
                    title="Creator Profile"
                  >
                    {activePlayAvatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={activePlayAvatar}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-full"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <User className="w-full h-full stroke-[2]" />
                    )}
                  </button>
                </div>
              </div>

              {/* Interactive Search Overlay */}
              <AnimatePresence>
                {showSearchOverlay && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute top-16 inset-x-0 mx-4 z-40 bg-zinc-950/95 backdrop-blur-md p-3 rounded-2xl border border-zinc-800 shadow-xl flex items-center gap-2"
                  >
                    <Search className="w-4 h-4 text-zinc-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="Search comments or related clips..."
                      value={videoSearchQuery}
                      onChange={(e) => setVideoSearchQuery(e.target.value)}
                      className="bg-transparent border-none text-white placeholder-zinc-500 text-xs focus:outline-none w-full font-sans"
                      autoFocus
                    />
                    {videoSearchQuery && (
                      <button
                        onClick={() => setVideoSearchQuery('')}
                        className="text-zinc-400 hover:text-white text-xs px-1 font-semibold"
                      >
                        Clear
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Quick Profile Summary Dialog Popover */}
              <AnimatePresence>
                {showProfileCard && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute top-16 right-4 z-40 bg-zinc-950/95 backdrop-blur-md p-4 rounded-2xl border border-zinc-800 shadow-xl w-64 text-center space-y-3"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={activePlayAvatar}
                      alt={activePlayAuthor}
                      className="w-14 h-14 object-cover rounded-full mx-auto border-2 border-primary"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-neutral-100">{activePlayAuthor}</h4>
                      <p className="text-[10px] text-zinc-400 leading-normal line-clamp-2 mt-1 px-1">{activePlayRole}</p>
                    </div>
                    <div className="pt-2 border-t border-zinc-900 flex justify-center gap-4 text-center">
                      <div>
                        <div className="font-bold text-xs text-neutral-200">2.4K</div>
                        <div className="text-[8px] text-zinc-500 uppercase tracking-wider font-semibold">Followers</div>
                      </div>
                      <div className="w-px bg-zinc-900" />
                      <div>
                        <div className="font-bold text-xs text-neutral-200">{activePlayLikes + 240}</div>
                        <div className="text-[8px] text-zinc-500 uppercase tracking-wider font-semibold">Likes</div>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowProfileCard(false)}
                      className="w-full py-1.5 bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-bold rounded-lg transition-colors"
                    >
                      Connect
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* The Video Main Canvas Element */}
              <div
                onClick={togglePlayPause}
                className="flex-1 w-full bg-black relative cursor-pointer overflow-hidden flex items-center justify-center select-none"
              >
                <video
                  ref={videoRef}
                  src={activePlayVideoSrc}
                  autoPlay
                  loop={videoLooping}
                  muted={videoMuted}
                  playsInline
                  className="w-full h-full object-cover"
                  onTimeUpdate={(e) => {
                    const v = e.currentTarget;
                    if (v.duration) {
                      setVideoProgress((v.currentTime / v.duration) * 100);
                    }
                  }}
                />

                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30 backdrop-blur-sm pointer-events-none z-40">
                  <div 
                    className="h-full bg-white/80" 
                    style={{ width: `${videoProgress}%` }}
                  />
                </div>

                {/* Double-tap / Single-click Feedback play-pause animation flash */}
                <AnimatePresence>
                  {playFlash && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.25 }}
                      className="absolute inset-0 m-auto w-20 h-20 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center z-30 pointer-events-none"
                    >
                      {playFlash === 'play' ? (
                        <Play className="w-10 h-10 text-white fill-white translate-x-0.5" />
                      ) : (
                        <Pause className="w-10 h-10 text-white fill-white" />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Mute/Volume floating notification inside the video overlay when adjusted */}
                <div className="absolute bottom-28 right-4 z-20 pointer-events-none">
                  {videoMuted && (
                    <div className="bg-black/60 text-white text-[10px] px-2 py-1 rounded-md backdrop-blur-sm flex items-center gap-1 border border-white/10">
                      <VolumeX className="w-3.5 h-3.5 text-red-400" />
                      <span>MUTED</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Floating Right-Side Controls Column: Matches layout (Like thumb, Comment bubble, Share, ...) */}
              <div className="absolute right-3 bottom-24 z-30 flex flex-col items-center gap-5 pointer-events-auto">
                {/* 1. ThumbsUp / Like Button: Functional state sync */}
                <div className="flex flex-col items-center gap-1">
                  <motion.button
                    whileTap={{ scale: 0.8 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVideoLike();
                    }}
                    className={cn(
                      "w-11 h-11 rounded-full flex items-center justify-center transition-all bg-black/50 backdrop-blur-md border border-white/10 shadow-lg text-white",
                      activePlayIsLiked ? "bg-primary text-primary-foreground border-primary" : "hover:bg-black/75"
                    )}
                    title="Like video"
                  >
                    <ThumbsUp className={cn("w-5.5 h-5.5", activePlayIsLiked && "fill-current")} />
                  </motion.button>
                  <span className="text-white text-xs font-bold font-sans drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] select-none">
                    {activePlayLikes}
                  </span>
                </div>

                {/* 2. Comments Bubble Button: Opens bottom sheet */}
                <div className="flex flex-col items-center gap-1">
                  <motion.button
                    whileTap={{ scale: 0.8 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCommentDrawerOpen(true);
                    }}
                    className={cn(
                      "w-11 h-11 rounded-full flex items-center justify-center transition-all bg-black/50 backdrop-blur-md border border-white/10 shadow-lg text-white hover:bg-black/75",
                      commentDrawerOpen && "ring-2 ring-primary"
                    )}
                    title="Show comments"
                  >
                    <MessageCircle className="w-5.5 h-5.5" />
                  </motion.button>
                  <span className="text-white text-xs font-bold font-sans drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] select-none">
                    {activePlayComments.length}
                  </span>
                </div>

                {/* 3. Share Button: Curved Right Arrow */}
                <div className="flex flex-col items-center gap-1 relative">
                  <motion.button
                    whileTap={{ scale: 0.8 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVideoShare();
                    }}
                    className="w-11 h-11 rounded-full flex items-center justify-center transition-all bg-black/50 backdrop-blur-md border border-white/10 shadow-lg text-white hover:bg-black/75"
                    title="Share video link"
                  >
                    <Share2 className="w-5.5 h-5.5" />
                  </motion.button>
                  <span className="text-white text-xs font-bold font-sans drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] select-none">
                    {localSharesCount}
                  </span>

                  {/* Share Notification Floating Tooltip Bubble */}
                  <AnimatePresence>
                    {showShareTooltip && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.85, x: -10 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.85, x: -10 }}
                        className="absolute right-14 top-1 bg-black/90 border border-zinc-700/80 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl whitespace-nowrap shadow-xl backdrop-blur-sm z-50 flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5 text-primary" />
                        <span>Link copied!</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 4. More Options Button: Three horizontal dots */}
                <div className="flex flex-col items-center gap-1">
                  <motion.button
                    whileTap={{ scale: 0.8 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setOptionsMenuOpen(true);
                    }}
                    className={cn(
                      "w-11 h-11 rounded-full flex items-center justify-center transition-all bg-black/50 backdrop-blur-md border border-white/10 shadow-lg text-white hover:bg-black/75",
                      optionsMenuOpen && "bg-white/10"
                    )}
                    title="More actions"
                  >
                    <MoreHorizontal className="w-6 h-6" />
                  </motion.button>
                </div>
              </div>

              {/* Bottom Info Card Panel overlay (User name, verified badge, caption content) */}
              <div className="absolute left-0 bottom-18 right-16 p-4 z-20 pointer-events-none flex flex-col gap-2 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                {/* Profile line */}
                <div className="flex items-center gap-2 pointer-events-auto">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activePlayAvatar}
                    alt={activePlayAuthor}
                    className="rounded-full w-9 h-9 object-cover border border-white/20 shadow-md bg-zinc-900"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex items-center gap-1.5 text-white">
                    <span className="font-bold text-sm tracking-tight drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                      {activePlayAuthor}
                    </span>
                    <span className="w-3.5 h-3.5 rounded-full bg-blue-500 flex items-center justify-center text-white p-0.5">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                    <span className="text-zinc-300 font-bold select-none text-xs leading-none">·</span>
                    <Globe className="w-3.5 h-3.5 text-zinc-300 drop-shadow" />
                  </div>
                </div>

                {/* Caption / Description content (Scrollable if long) */}
                <div className="pointer-events-auto max-h-24 overflow-y-auto no-scrollbar pr-1">
                  <p className="text-white text-xs drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] font-normal leading-relaxed text-left">
                    {activePlayContent}
                  </p>
                </div>
              </div>

              {/* Bottom Comment Input Pill Panel: Clicking it toggles comments sheets */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/95 to-transparent p-4 pb-5 md:pb-6 z-30 pointer-events-auto border-t border-white/5 flex gap-2">
                <div
                  onClick={() => setCommentDrawerOpen(true)}
                  className="flex-1 bg-white/10 hover:bg-white/15 text-neutral-300 border border-white/10 hover:border-white/20 text-xs rounded-full px-4 py-3 cursor-pointer transition-all flex items-center justify-between shadow-inner select-none font-sans"
                >
                  <span>Add a comment...</span>
                  <Smile className="w-4 h-4 text-neutral-400" />
                </div>
              </div>

              {/* Sliding Bottom Drawer for Comments (Instagram Reels style) */}
              <AnimatePresence>
                {commentDrawerOpen && (
                  <>
                    {/* Inner absolute backdrop for drawer */}
                    <div
                      onClick={() => setCommentDrawerOpen(false)}
                      className="absolute inset-0 z-39 bg-black/40 backdrop-blur-[1px] pointer-events-auto cursor-pointer"
                    />

                    {/* Sliding Drawer element */}
                    <motion.div
                      initial={{ y: '100%' }}
                      animate={{ y: 0 }}
                      exit={{ y: '100%' }}
                      transition={{ type: 'spring', damping: 25, stiffness: 210 }}
                      className="absolute bottom-0 inset-x-0 z-40 bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800/60 rounded-t-[28px] p-4 flex flex-col h-[65%] pointer-events-auto shadow-2xl overflow-hidden"
                    >
                      {/* Close notch drag handle indicator */}
                      <div className="w-12 h-1.5 bg-zinc-800 rounded-full mx-auto shrink-0 mb-3 cursor-pointer" onClick={() => setCommentDrawerOpen(false)} />

                      {/* Header row */}
                      <div className="flex items-center justify-between shrink-0 pb-3 border-b border-zinc-900">
                        <span className="font-bold text-sm text-neutral-100 font-sans tracking-wide">
                          Comments ({activePlayComments.length})
                        </span>
                        <button
                          onClick={() => setCommentDrawerOpen(false)}
                          className="p-1.5 rounded-full hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
                        >
                          <X className="w-4 h-4 stroke-[2.5]" />
                        </button>
                      </div>

                      {/* Filter/Matched Comments Section if user searched */}
                      <div className="flex-1 overflow-y-auto py-3 space-y-3.5 scrollbar-thin scrollbar-thumb-zinc-800">
                        {activePlayComments.filter(comment => {
                          if (!videoSearchQuery) return true;
                          return comment.content.toLowerCase().includes(videoSearchQuery.toLowerCase()) ||
                                 comment.author.toLowerCase().includes(videoSearchQuery.toLowerCase());
                        }).length === 0 ? (
                          <div className="py-12 text-center text-xs text-zinc-500">
                            {videoSearchQuery ? 'No matching comments found.' : 'Be the first to comment on this clip!'}
                          </div>
                        ) : (
                          activePlayComments.filter(comment => {
                            if (!videoSearchQuery) return true;
                            return comment.content.toLowerCase().includes(videoSearchQuery.toLowerCase()) ||
                                   comment.author.toLowerCase().includes(videoSearchQuery.toLowerCase());
                          }).map((comment: any) => (
                            <div key={comment.id} className="flex gap-2.5 items-start text-xs border-b border-zinc-900/40 pb-3 last:border-0">
                              <NextLink href={getProfileLink(comment.author, comment.author === 'Alex Rivera' || comment.author === currentUserName, currentUserName)} className="hover:opacity-85 transition-opacity shrink-0">
                                <img
                                  src={comment.avatarUrl || "https://dummyimage.com/100x100/1e293b/ffffff?text=alex"}
                                  alt={comment.author}
                                  className="rounded-full object-cover w-7.5 h-7.5 bg-zinc-800 border border-zinc-800"
                                  referrerPolicy="no-referrer"
                                />
                              </NextLink>
                              <div className="flex-1 min-w-0 space-y-0.5 text-left">
                                <div className="flex items-center justify-between">
                                  <NextLink href={getProfileLink(comment.author, comment.author === 'Alex Rivera' || comment.author === currentUserName, currentUserName)} className="hover:underline">
                                    <span className="font-bold text-zinc-100 text-[11px]">{comment.author}</span>
                                  </NextLink>
                                  <span className="text-[9px] text-zinc-500">{comment.time}</span>
                                </div>
                                <p className="text-[9px] text-zinc-400 font-mono truncate">{comment.role}</p>
                                <p className="text-zinc-200 mt-1 leading-relaxed whitespace-pre-wrap text-xs select-text">{comment.content}</p>

                                <div className="flex items-center gap-3.5 mt-1.5 text-[9px] text-zinc-500 font-bold">
                                  <button
                                    onClick={() => handleCommentLike(comment.id)}
                                    className={cn("hover:text-white transition-colors flex items-center gap-0.5", comment.isLiked && "text-primary")}
                                  >
                                    <Heart className={cn("w-2.5 h-2.5", comment.isLiked && "fill-current text-primary")} />
                                    <span>{comment.isLiked ? 'Liked' : 'Like'} ({comment.likes || 0})</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Bottom Add Comment submission box form */}
                      <form onSubmit={handleVideoCommentSubmit} className="pt-3 border-t border-zinc-900 shrink-0 flex gap-2">
                        <input
                          type="text"
                          value={videoCommentText}
                          onChange={(e) => setVideoCommentText(e.target.value)}
                          placeholder="Add a comment..."
                          className="flex-1 bg-zinc-900 border border-zinc-800 focus:border-zinc-700 text-xs rounded-full px-4 py-2.5 focus:outline-none transition-colors text-white placeholder-zinc-500 font-sans"
                          autoFocus
                        />
                        <button
                          type="submit"
                          disabled={!videoCommentText.trim()}
                          className="bg-primary hover:bg-primary-hover disabled:opacity-40 text-primary-foreground p-2 rounded-full transition-colors shrink-0 flex items-center justify-center w-9 h-9 active:scale-95"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </form>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>

              {/* Sliding Bottom Drawer for More Options (Mute, Loop, and UP NEXT RECOMMENDED CLIPS!) */}
              <AnimatePresence>
                {optionsMenuOpen && (
                  <>
                    {/* Inner backdrop */}
                    <div
                      onClick={() => setOptionsMenuOpen(false)}
                      className="absolute inset-0 z-39 bg-black/40 backdrop-blur-[1px] pointer-events-auto cursor-pointer"
                    />

                    {/* Sliding Options Drawer */}
                    <motion.div
                      initial={{ y: '100%' }}
                      animate={{ y: 0 }}
                      exit={{ y: '100%' }}
                      transition={{ type: 'spring', damping: 25, stiffness: 210 }}
                      className="absolute bottom-0 inset-x-0 z-40 bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800/60 rounded-t-[28px] p-4 flex flex-col h-[70%] pointer-events-auto shadow-2xl overflow-hidden text-left"
                    >
                      <div className="w-12 h-1.5 bg-zinc-800 rounded-full mx-auto shrink-0 mb-3 cursor-pointer" onClick={() => setOptionsMenuOpen(false)} />

                      {/* Header */}
                      <div className="flex items-center justify-between shrink-0 pb-3 border-b border-zinc-900">
                        <span className="font-bold text-sm text-neutral-100 font-sans tracking-wide">
                          Reels Options & Up Next
                        </span>
                        <button
                          onClick={() => setOptionsMenuOpen(false)}
                          className="p-1.5 rounded-full hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
                        >
                          <X className="w-4 h-4 stroke-[2.5]" />
                        </button>
                      </div>

                      {/* List options & Related videos */}
                      <div className="flex-1 overflow-y-auto py-4 space-y-4 scrollbar-thin scrollbar-thumb-zinc-800 text-left">
                        {/* Playback Settings Group */}
                        <div className="space-y-2 bg-zinc-900/50 p-3.5 rounded-2xl border border-zinc-900">
                          <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400 mb-1 pl-0.5">Player Settings</h4>
                          
                          {/* Toggle Mute */}
                          <div className="flex items-center justify-between py-1.5">
                            <span className="text-xs text-zinc-200 font-semibold flex items-center gap-2">
                              {videoMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-green-400" />}
                              <span>{videoMuted ? 'Muted Audio' : 'Audio On'}</span>
                            </span>
                            <button
                              onClick={() => setVideoMuted(!videoMuted)}
                              className={cn(
                                "text-[10px] font-bold px-3 py-1 rounded-full border transition-all active:scale-95",
                                videoMuted ? "bg-red-500/10 border-red-500/30 text-red-400" : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white"
                              )}
                            >
                              {videoMuted ? 'UNMUTE' : 'MUTE'}
                            </button>
                          </div>

                          {/* Toggle Loop */}
                          <div className="flex items-center justify-between py-1.5 border-t border-zinc-950">
                            <span className="text-xs text-zinc-200 font-semibold flex items-center gap-2">
                              <Monitor className="w-4 h-4 text-blue-400" />
                              <span>{videoLooping ? 'Loop Video' : 'Play Once'}</span>
                            </span>
                            <button
                              onClick={() => setVideoLooping(!videoLooping)}
                              className={cn(
                                "text-[10px] font-bold px-3 py-1 rounded-full border transition-all active:scale-95",
                                videoLooping ? "bg-blue-500/10 border-blue-500/30 text-blue-400" : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white"
                              )}
                            >
                              {videoLooping ? 'LOOPING' : 'ONCE'}
                            </button>
                          </div>
                        </div>

                        {/* Recommended videos list (Up next) */}
                        <div className="space-y-2.5">
                          <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400 pl-0.5">Recommendations (Up Next)</h4>
                          
                          {getRecommendedVideos().length === 0 ? (
                            <div className="text-center text-xs text-zinc-500 py-6">
                              No recommendations available right now.
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {getRecommendedVideos().map((p: any) => {
                                const isPostVideo = p.attachmentType === 'video' || p.type === 'video';
                                return (
                                  <div
                                    key={p.id}
                                    onClick={() => {
                                      setActivePlayId(p.id);
                                      setActivePlayVideoSrc(getPostVideoSrc(p));
                                      setActivePlayTitle(p.attachmentTitle || p.content.substring(0, 30));
                                      setActivePlayAuthor(p.author);
                                      setActivePlayRole(p.role);
                                      setActivePlayAvatar(p.avatarUrl);
                                      setActivePlayContent(p.content);
                                      setActivePlayLikes(p.likes || 0);
                                      setActivePlayIsLiked(p.isLiked || false);
                                      setActivePlayComments(p.commentsList || []);
                                      setOptionsMenuOpen(false);
                                      setCommentDrawerOpen(false);
                                    }}
                                    className={cn(
                                      "flex gap-3 p-2 rounded-xl bg-zinc-900/40 hover:bg-zinc-800/40 border transition-all cursor-pointer items-center text-left",
                                      activePlayId === p.id ? "border-primary/50 bg-primary/5" : "border-zinc-900/50 hover:border-zinc-850"
                                    )}
                                  >
                                    <div className="relative w-16 aspect-video rounded-lg overflow-hidden shrink-0 bg-zinc-950 border border-zinc-900 flex items-center justify-center">
                                      {/* eslint-disable-next-line @next/next/no-img-element */}
                                      <img
                                        src={`https://dummyimage.com/120x80/1e293b/ffffff?text=%24%7Bp.id%7D`}
                                        alt={p.attachmentTitle || "Preview"}
                                        className="w-full h-full object-cover"
                                      />
                                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                        {isPostVideo ? (
                                          <Play className="w-3.5 h-3.5 text-white fill-current" />
                                        ) : (
                                          <Monitor className="w-3.5 h-3.5 text-zinc-400" />
                                        )}
                                      </div>
                                    </div>
                                    
                                    <div className="min-w-0 flex-1 space-y-0.5 text-left">
                                      <h5 className="font-semibold text-[11px] text-zinc-200 line-clamp-1 leading-snug">
                                        {p.attachmentTitle || p.content}
                                      </h5>
                                      <p className="text-[10px] text-zinc-400 truncate font-mono">
                                        {p.author}
                                      </p>
                                      <div className="flex items-center gap-1.5 text-[9px] text-zinc-500">
                                        <span className="flex items-center gap-0.5"><Heart className="w-2.5 h-2.5 fill-current" /> {p.likes || 0}</span>
                                        <span>·</span>
                                        <span>{p.commentsList ? p.commentsList.length : (p.comments || 0)} comments</span>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {mounted && typeof window !== 'undefined' && document.body && createPortal(
        <AnimatePresence>
          {shareModalOpen && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShareModalOpen(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />

              {/* Modal Container */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ type: 'spring', duration: 0.3 }}
                className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[85vh] text-left"
              >
                {/* Header */}
                <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-950/30">
                  <div className="flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-zinc-700 dark:text-zinc-200" />
                    <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-zinc-50">Share Post</h3>
                  </div>
                  <button 
                    onClick={() => setShareModalOpen(false)}
                    className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Body */}
                <div className="p-5 overflow-y-auto space-y-5">
                  {/* Option 1: Copy Link */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Copy Post Link</label>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl px-4 py-2.5 text-xs text-zinc-600 dark:text-zinc-400 select-all truncate font-mono">
                        {typeof window !== 'undefined' ? `${window.location.origin}/#post-${id}` : `https://orbit.social/posts/${id}`}
                      </div>
                      <button 
                        onClick={() => {
                          const url = typeof window !== 'undefined' ? `${window.location.origin}/#post-${id}` : `https://orbit.social/posts/${id}`;
                          try {
                            navigator.clipboard.writeText(url);
                            setCopiedNotification(true);
                            setTimeout(() => setCopiedNotification(false), 2000);
                          } catch (err) {}
                        }}
                        className="bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 px-4 py-2.5 rounded-2xl text-xs font-bold transition-colors shrink-0"
                      >
                        {copiedNotification ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  {/* Option 2: Send in Chat */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block font-sans">Send to Chat Contact</label>
                    
                    <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                      {chatContacts.map((contact) => {
                        const isSent = !!sentContacts[contact.id];
                        return (
                          <div 
                            key={contact.id} 
                            className="flex items-center gap-3 p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-2xl transition-colors border border-transparent hover:border-zinc-100 dark:hover:border-zinc-800"
                          >
                            <img 
                              src={contact.avatarUrl} 
                              alt={contact.name} 
                              className="w-10 h-10 rounded-full object-cover bg-zinc-100 dark:bg-zinc-800" 
                              referrerPolicy="no-referrer"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">{contact.name}</h4>
                              <p className="text-[10px] text-zinc-400 truncate">{contact.role}</p>
                            </div>
                            <button 
                              onClick={() => handleSendToChat(contact)}
                              disabled={isSent}
                              className={cn(
                                "px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm",
                                isSent 
                                  ? "bg-emerald-500 text-white cursor-default" 
                                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-750"
                              )}
                            >
                              {isSent ? 'Sent ✓' : 'Send'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
