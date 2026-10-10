'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Mail, 
  MapPin, 
  Link as LinkIcon, 
  Edit3, 
  FileDown, 
  Sparkles, 
  Check, 
  X, 
  Save, 
  ArrowLeft, 
  LogIn, 
  LogOut, 
  User,
  ShieldCheck,
  Briefcase,
  Share2,
  Calendar,
  Globe,
  ExternalLink,
  Plus,
  Trash2,
  Award,
  Layers,
  Heart,
  MessageSquare,
  Building2,
  CheckCircle2,
  Copy,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generateProfilePDF } from '@/lib/pdf-generator';
import { compressImage, cn } from '@/lib/utils';
import { signOutUser } from '@/app/lib/auth';
import { useAuth } from '@/lib/auth-utils';

export interface DetailedProject {
  id: string;
  title: string;
  description: string;
  category: string;
  techStack: string[];
  link?: string;
  status: 'Live' | 'In Development' | 'Completed';
  metrics?: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  content: string;
  date: string;
  likes: number;
  comments: number;
  type: 'Insight' | 'Milestone' | 'Article';
}

export interface ExperienceItem {
  title: string;
  company: string;
  period: string;
  location?: string;
  description: string;
  highlights?: string[];
}

export interface ProfileData {
  id?: string;
  name: string;
  username: string;
  avatarUrl?: string;
  role: string;
  company: string;
  location: string;
  website: string;
  email: string;
  bio: string;
  joinedDate: string;
  availability: string;
  yearsOfExperience: string;
  verifiedStatus: boolean;
  skills: string[];
  projects: DetailedProject[];
  experience: ExperienceItem[];
  activities: ActivityItem[];
  stats: {
    projectsShipped: number;
    networkConnections: string;
    trustScore: number;
    advisoryRoles: number;
  };
}

const DEFAULT_PROFILE: ProfileData = {
  name: 'Alex Rivera',
  username: 'alexrivera',
  avatarUrl: 'https://dummyimage.com/200x200/1e293b/ffffff?text=AR',
  role: 'Chief Technology Officer & Venture Architect',
  company: 'FutureNomix Ecosystem',
  location: 'San Francisco, CA',
  website: 'https://alexrivera.dev',
  email: 'alex@alexrivera.dev',
  bio: 'Building foundational digital systems and venture architectures. Focused on distributed compute protocols, AI infrastructure, and resilient financial technology. Experienced in taking products from seed conception to global deployment while fostering high-agency engineering cultures.',
  joinedDate: 'Joined March 2024',
  availability: 'Open to Strategic Advisory & Board Roles',
  yearsOfExperience: '9+ Years',
  verifiedStatus: true,
  skills: [
    'System Architecture',
    'Next.js / React',
    'TypeScript',
    'Distributed Databases',
    'Venture Strategy',
    'AI Model Deployment',
    'Product Engineering',
    'FinTech Protocols'
  ],
  stats: {
    projectsShipped: 16,
    networkConnections: '2.4K',
    trustScore: 98,
    advisoryRoles: 4
  },
  experience: [
    {
      title: 'Chief Technology Officer & Co-Founder',
      company: 'FutureNomix Network',
      period: '2024 - Present',
      location: 'San Francisco, CA',
      description: 'Directing technical strategy, distributed data models, and architectural standards across the collaborative ecosystem platform.',
      highlights: [
        'Architected real-time verification and role synchronization pipelines with sub-50ms latency.',
        'Scaled network infrastructure supporting multiple simultaneous institutional nodes.'
      ]
    },
    {
      title: 'Staff Platform Engineer',
      company: 'Vercel Infrastructure Group',
      period: '2022 - 2024',
      location: 'San Francisco, CA (Hybrid)',
      description: 'Engineered high-throughput edge routing primitives and optimized serverless cold-start compilation caches.',
      highlights: [
        'Reduced global edge cache invalidation times by 32%.',
        'Contributed directly to open-source developer tooling and deployment telemetry.'
      ]
    },
    {
      title: 'Senior Distributed Systems Engineer',
      company: 'Stripe Payments',
      period: '2019 - 2022',
      location: 'San Francisco, CA',
      description: 'Maintained core merchant checkout engines handling multi-currency global transactions with 99.999% uptime guarantees.',
      highlights: [
        'Designed idempotent payment queue processing frameworks.',
        'Mentored 12 junior and mid-level platform engineers across global time zones.'
      ]
    }
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'FutureNomix Core Protocol',
      description: 'Distributed ledger and workspace coordination framework enabling cross-organizational talent mobilization and resource allocation.',
      category: 'Ecosystem Architecture',
      techStack: ['TypeScript', 'Next.js 15', 'Distributed Firestore', 'Tailwind CSS'],
      status: 'Live',
      link: 'https://futurenomix.dev',
      metrics: '2.4k Active Members'
    },
    {
      id: 'proj-2',
      title: 'Aura Compute Engine',
      description: 'Serverless orchestration harness for local and cloud-hosted AI inference pipelines with deterministic execution guarantees.',
      category: 'Developer Tooling',
      techStack: ['Rust', 'WebAssembly', 'Node.js', 'Docker'],
      status: 'In Development',
      link: 'https://github.com/futurenomix/aura',
      metrics: 'v0.8-alpha'
    },
    {
      id: 'proj-3',
      title: 'Nexus Venture Telemetry',
      description: 'Real-time dashboard assessing startup runway metrics, syndicate co-investments, and cap-table distributions.',
      category: 'FinTech Dashboard',
      techStack: ['React', 'D3.js', 'Recharts', 'Tailwind'],
      status: 'Completed',
      link: 'https://nexus-telemetry.io',
      metrics: '$42M Tracked Assets'
    }
  ],
  activities: [
    {
      id: 'act-1',
      title: 'Principles for High-Velocity Architectural Decisions',
      content: 'True architectural agility is not about avoiding structure—it is about establishing zero-cost boundaries and irreversible checkpoints early so teams can move without friction.',
      date: 'September 18, 2026',
      likes: 142,
      comments: 29,
      type: 'Insight'
    },
    {
      id: 'act-2',
      title: 'Ecosystem Milestone: Deployed Production Role-Based Access Controls',
      content: 'Shipped comprehensive administrative consoles, hardened security rules, and real-time audit event logging across all active member accounts.',
      date: 'September 14, 2026',
      likes: 98,
      comments: 16,
      type: 'Milestone'
    },
    {
      id: 'act-3',
      title: 'The Evolution of Modern Full-Stack Platforms: 2024 to 2026',
      content: 'A deep-dive examining why client-side state engines and server-rendered primitives converged to create higher reliability benchmarks in consumer tech.',
      date: 'August 29, 2026',
      likes: 215,
      comments: 48,
      type: 'Article'
    }
  ]
};

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE);
  const [activeTab, setActiveTab] = useState<'overview' | 'experience' | 'projects' | 'activity'>('overview');
  
  // Interaction states
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [tempBio, setTempBio] = useState('');
  
  const [avatarAspectRatio, setAvatarAspectRatio] = useState(1);
  const [coverAspectRatio, setCoverAspectRatio] = useState(1200 / 400);

  // Cover Photo
  const [coverPhoto, setCoverPhoto] = useState<string>('https://dummyimage.com/1200x400/09090b/27272a?text=+');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit Modal
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempProfile, setTempProfile] = useState<ProfileData>(DEFAULT_PROFILE);

  // Account integration
  const [linkedAccount, setLinkedAccount] = useState<any | null>(null);
  const [unlinkedOppositeAccounts, setUnlinkedOppositeAccounts] = useState<any[]>([]);
  const isLoggedIn = !!user;

  // Auth & Storage initial sync
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/auth');
      return;
    }

    if (typeof window === 'undefined') return;

    // Load saved cover
    const savedCover = localStorage.getItem('profile_cover_photo');
    if (savedCover) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCoverPhoto(savedCover);
    }

    // Load Profile data
    const loadProfile = () => {
      const stored = localStorage.getItem('orbit_user_profile');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setProfile(prev => ({
            ...prev,
            ...parsed,
            name: parsed.name || prev.name,
            username: parsed.username || prev.username,
            role: parsed.role || prev.role,
            company: parsed.company || prev.company,
            location: parsed.location || prev.location,
            website: parsed.website || prev.website,
            email: parsed.email || prev.email,
            bio: parsed.bio || prev.bio,
            skills: parsed.skills || prev.skills,
            experience: (parsed.experience && parsed.experience.length > 0) ? parsed.experience : prev.experience,
            projects: (parsed.projects && parsed.projects.length > 0 && typeof parsed.projects[0] === 'object') ? parsed.projects : prev.projects,
            avatarUrl: parsed.avatarUrl || prev.avatarUrl
          }));
        } catch (err) {
          console.error('Error parsing profile cache:', err);
        }
      }
    };
    loadProfile();

    // Check linked accounts
    const activeId = localStorage.getItem('orbit_active_account_id') || 'personal-1';
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
      }
    } else if (currentAcc) {
      const opposites = storedAccs.filter(a => a.type !== currentAcc.type);
      setUnlinkedOppositeAccounts(opposites);
    }

    return () => {};
  }, [user, authLoading, router]);

  const handleCoverPhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const dataUrl = event.target?.result as string;
        const compressed = await compressImage(dataUrl, 1200, 400, 0.7);
        setCoverPhoto(compressed);
        localStorage.setItem('profile_cover_photo', compressed);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownloadPDF = () => {
    setIsDownloading(true);
    setTimeout(() => {
      try {
        generateProfilePDF({
          name: profile.name,
          role: `${profile.role} ${profile.company ? `at ${profile.company}` : ''}`,
          location: profile.location,
          website: profile.website,
          email: profile.email,
          bio: profile.bio,
          skills: profile.skills,
          projects: profile.projects.map(p => typeof p === 'string' ? p : p.title),
          experience: profile.experience.map(e => ({
            title: `${e.title} @ ${e.company}`,
            period: e.period,
            description: e.description
          }))
        });
        setIsDownloading(false);
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 3500);
      } catch (err) {
        console.error('Error generating PDF:', err);
        setIsDownloading(false);
      }
    }, 900);
  };

  const handleShareProfile = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleSaveBio = () => {
    const updated = { ...profile, bio: tempBio };
    setProfile(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('orbit_user_profile', JSON.stringify(updated));
      const activeId = localStorage.getItem('orbit_active_account_id') || 'personal-1';
      localStorage.setItem(`orbit_user_profile_${activeId}`, JSON.stringify(updated));
    }
    setIsEditingBio(false);
  };

  const handleSaveProfile = () => {
    setProfile(tempProfile);
    if (typeof window !== 'undefined') {
      localStorage.setItem('orbit_user_profile', JSON.stringify(tempProfile));
      const activeId = localStorage.getItem('orbit_active_account_id') || 'personal-1';
      localStorage.setItem(`orbit_user_profile_${activeId}`, JSON.stringify(tempProfile));
      
      const storedAccounts = localStorage.getItem('orbit_accounts');
      if (storedAccounts) {
        try {
          const accounts = JSON.parse(storedAccounts);
          const updated = accounts.map((acc: any) => {
            if (acc.id === activeId) {
              return { 
                ...acc, 
                name: tempProfile.name, 
                username: tempProfile.username, 
                avatarUrl: tempProfile.avatarUrl 
              };
            }
            return acc;
          });
          localStorage.setItem('orbit_accounts', JSON.stringify(updated));
          window.dispatchEvent(new Event('storage'));
        } catch (e) {}
      }
    }
    setIsEditingProfile(false);
  };

  const handleSwitchAccount = (accountId: string) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('orbit_active_account_id', accountId);
    const targetProfileStr = localStorage.getItem(`orbit_user_profile_${accountId}`);
    if (targetProfileStr) {
      localStorage.setItem('orbit_user_profile', targetProfileStr);
    }
    window.dispatchEvent(new Event('storage'));
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

  if (authLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-zinc-500">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div id="executive-profile-page" className="w-full min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {copiedLink && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 px-4 py-2.5 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 border border-zinc-800 dark:border-zinc-200"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Profile link copied to clipboard!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. EXECUTIVE COVER / BRANDING BANNER */}
      <div className="relative w-full overflow-hidden bg-zinc-900 border-b border-zinc-200/80 dark:border-zinc-800/80" style={{ aspectRatio: coverAspectRatio, maxHeight: '400px' }}>
        <Image
          src={coverPhoto}
          alt="Executive Cover"
          fill
          priority
          unoptimized
          onLoadingComplete={({ naturalWidth, naturalHeight }) => {
            setCoverAspectRatio(naturalWidth / naturalHeight);
          }}
          className="object-cover opacity-90 brightness-[0.85]"
          referrerPolicy="no-referrer"
        />
        {/* Subtle geometric grid / vignette texture */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/40 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        {/* Back navigation */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10">
          <Link
            id="profile-back-home-btn"
            href="/"
            className="bg-zinc-900/80 hover:bg-zinc-900 backdrop-blur-md text-zinc-200 hover:text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all border border-zinc-700/60 shadow-md active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Edit cover button (Logged-in only) */}
        {isLoggedIn && (
          <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-10">
            <button
              id="profile-edit-cover-btn"
              onClick={() => fileInputRef.current?.click()}
              className="bg-zinc-950/70 hover:bg-zinc-950 backdrop-blur-md text-zinc-300 hover:text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all border border-zinc-700/50 shadow-sm"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Update Cover</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleCoverPhotoChange}
            />
          </div>
        )}
      </div>

      {/* 2. PROFILE HEADER & METADATA SECTION */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-16 sm:-mt-20 md:-mt-24 pb-12">
        <div className="bg-white dark:bg-zinc-900/95 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-sm">
          
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6">
            {/* Left: Avatar & Names */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
              <div className="relative group shrink-0 -mt-16 sm:-mt-20">
                <div 
                  style={{ aspectRatio: avatarAspectRatio }}
                  className="w-28 sm:w-36 md:w-40 rounded-2xl overflow-hidden border-4 border-white dark:border-zinc-900 shadow-2xl bg-zinc-800 relative transition-all duration-500"
                >
                  <Image
                    src={profile.avatarUrl || `https://dummyimage.com/200x200/1e293b/ffffff?text=${encodeURIComponent(profile.username.slice(0, 2).toUpperCase())}`}
                    alt={profile.name}
                    fill
                    unoptimized
                    onLoadingComplete={({ naturalWidth, naturalHeight }) => {
                      setAvatarAspectRatio(naturalWidth / naturalHeight);
                    }}
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {isLoggedIn && (
                    <button
                      onClick={() => {
                        setTempProfile(profile);
                        setIsEditingProfile(true);
                      }}
                      className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-[11px] font-semibold"
                    >
                      <Edit3 className="w-5 h-5" />
                      <span>Edit Photo</span>
                    </button>
                  )}
                </div>
                {profile.verifiedStatus && (
                  <div 
                    title="Verified Institutional Contributor" 
                    className="absolute -bottom-1.5 -right-1.5 bg-red-600 text-white p-1 rounded-full border-2 border-white dark:border-zinc-900 shadow-md"
                  >
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                )}
              </div>

              <div className="space-y-1 sm:mb-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-display font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
                    {profile.name}
                  </h1>
                  <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                    @{profile.username}
                  </span>
                  <span className={cn(
                    "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                    isLoggedIn
                      ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700"
                      : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                  )}>
                    <Sparkles className="w-3 h-3 text-red-500 fill-current" />
                    {isLoggedIn ? 'Verified Contributor' : 'Guest Preview Mode'}
                  </span>
                </div>

                <p className="text-sm sm:text-base font-medium text-zinc-600 dark:text-zinc-300 flex items-center gap-2">
                  <span>{profile.role}</span>
                  {profile.company && (
                    <>
                      <span className="text-zinc-300 dark:text-zinc-700">·</span>
                      <span className="text-zinc-900 dark:text-zinc-100 font-semibold">{profile.company}</span>
                    </>
                  )}
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                    {profile.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                    {profile.joinedDate}
                  </span>
                  {profile.website && (
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-red-600 dark:text-red-400 hover:underline"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>{profile.website.replace(/^https?:\/\//, '')}</span>
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Right: High-Value Action & Conversion Bar */}
            <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-start lg:justify-end">
              {/* PDF Resume / Profile download */}
              <button
                id="profile-download-cv-btn"
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className={cn(
                  "px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 border active:scale-[0.98]",
                  downloadSuccess
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 shadow-emerald-600/20"
                    : "bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700"
                )}
              >
                {isDownloading ? (
                  <>
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-zinc-400 border-t-zinc-900 dark:border-t-white animate-spin" />
                    <span>Preparing CV...</span>
                  </>
                ) : downloadSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>CV Downloaded!</span>
                  </>
                ) : (
                  <>
                    <FileDown className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                    <span>Export Executive CV</span>
                  </>
                )}
              </button>

              {/* Share Profile */}
              <button
                id="profile-share-btn"
                onClick={handleShareProfile}
                className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                title="Copy profile link"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Share</span>
              </button>

              {/* Edit / Sign-in primary CTA */}
              {isLoggedIn ? (
                <div className="flex items-center gap-2">
                  <button
                    id="profile-edit-main-btn"
                    onClick={() => {
                      setTempProfile(profile);
                      setIsEditingProfile(true);
                    }}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition-all shadow-md shadow-red-600/25 active:scale-95 flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Profile</span>
                  </button>
                  <button
                    id="profile-signout-btn"
                    onClick={async () => {
                      await signOutUser();
                      window.location.reload();
                    }}
                    className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-red-500/10 text-zinc-500 hover:text-red-600 transition-colors shadow-sm"
                    title="Sign Out to Guest Mode"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  id="profile-signin-cta-btn"
                  onClick={() => window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { mode: 'signin' } }))}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition-all shadow-md shadow-red-600/25 active:scale-95 flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In to Edit</span>
                </button>
              )}
            </div>
          </div>

          {/* Guest Advisory Notice if unauthenticated */}
          {!isLoggedIn && (
            <div className="mt-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Browsing in Public Guest Mode</p>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">Authenticate with your FutureNomix account to modify executive credentials, link opposite accounts, and manage portfolio listings.</p>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { mode: 'signin' } }))}
                  className="px-3.5 py-1.5 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-xs font-bold hover:opacity-90 transition-all shadow-sm"
                >
                  Sign In
                </button>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { mode: 'signup' } }))}
                  className="px-3.5 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-all shadow-sm"
                >
                  Register
                </button>
              </div>
            </div>
          )}

          {/* Multi-Account Switching / Integration Banner */}
          {linkedAccount ? (
            <div className="mt-6 p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/10 rounded-xl text-red-600 dark:text-red-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-600 dark:text-red-400">Integrated Profile Link</span>
                  <p className="text-xs text-zinc-700 dark:text-zinc-300 mt-0.5">
                    Connected to <strong>{linkedAccount.name}</strong> (@{linkedAccount.username})
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={handleUnlinkAccount}
                  className="text-xs font-semibold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 px-3 py-1.5"
                >
                  Unlink
                </button>
                <button
                  onClick={() => handleSwitchAccount(linkedAccount.id)}
                  className="px-3.5 py-1.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold hover:opacity-90 transition-all"
                >
                  Switch Profile
                </button>
              </div>
            </div>
          ) : unlinkedOppositeAccounts.length > 0 ? (
            <div className="mt-6 p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="text-xs text-zinc-600 dark:text-zinc-400">
                <span className="font-bold text-zinc-900 dark:text-zinc-100">Dual Profiles Detected:</span> Connect with your secondary profile ({unlinkedOppositeAccounts[0].name}) for one-click switching.
              </div>
              <button
                onClick={() => {
                  const activeId = localStorage.getItem('orbit_active_account_id') || 'personal-1';
                  const targetId = unlinkedOppositeAccounts[0].id;
                  localStorage.setItem(`orbit_linked_account_${activeId}`, targetId);
                  localStorage.setItem(`orbit_linked_account_${targetId}`, activeId);
                  window.location.reload();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold hover:opacity-90 transition-all shrink-0"
              >
                Integrate Account
              </button>
            </div>
          ) : null}

          {/* 3. EXECUTIVE TRUST & METRIC COUNTERS ROW */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
            <div className="p-3.5 rounded-2xl bg-zinc-50/70 dark:bg-zinc-800/40 border border-zinc-200/50 dark:border-zinc-800/60">
              <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Track Record</div>
              <div className="text-xl sm:text-2xl font-display font-bold text-zinc-900 dark:text-zinc-50 mt-0.5">
                {profile.yearsOfExperience}
              </div>
              <div className="text-[11px] text-zinc-500 font-medium">Industry Tenure</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-50/70 dark:bg-zinc-800/40 border border-zinc-200/50 dark:border-zinc-800/60">
              <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Portfolio</div>
              <div className="text-xl sm:text-2xl font-display font-bold text-zinc-900 dark:text-zinc-50 mt-0.5">
                {profile.projects.length} Shipped
              </div>
              <div className="text-[11px] text-zinc-500 font-medium">Deployed Systems</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-50/70 dark:bg-zinc-800/40 border border-zinc-200/50 dark:border-zinc-800/60">
              <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Ecosystem</div>
              <div className="text-xl sm:text-2xl font-display font-bold text-zinc-900 dark:text-zinc-50 mt-0.5">
                {profile.stats.networkConnections}
              </div>
              <div className="text-[11px] text-zinc-500 font-medium">Network Reach</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-50/70 dark:bg-zinc-800/40 border border-zinc-200/50 dark:border-zinc-800/60">
              <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Trust Index</div>
              <div className="text-xl sm:text-2xl font-display font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1">
                <span>{profile.stats.trustScore}%</span>
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-[11px] text-zinc-500 font-medium">Verified Reputation</div>
            </div>
          </div>

        </div>

        {/* 4. STRUCTURED INFORMATION ARCHITECTURE & TAB NAVIGATION */}
        <div className="mt-8">
          
          {/* Refactored Tab Bar Header with Classy Pearl & Marble Styling */}
          <div className="bg-white/80 dark:bg-zinc-900/90 backdrop-blur-md p-2 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 mb-8 shadow-sm flex items-center justify-between overflow-x-auto no-scrollbar gap-2">
            <div className="flex items-center space-x-1 sm:space-x-2">
              {[
                { id: 'overview', label: 'Executive Overview', icon: Briefcase },
                { id: 'experience', label: `Experience & Credentials (${profile.experience.length})`, icon: Building2 },
                { id: 'projects', label: `Projects & Portfolio (${profile.projects.length})`, icon: Layers },
                { id: 'activity', label: `Activity & Insights (${profile.activities.length})`, icon: MessageSquare }
              ].map(tab => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    id={`profile-tab-${tab.id}`}
                    title={tab.label}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                      "relative p-3.5 rounded-xl transition-all flex items-center justify-center group",
                      isActive
                        ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-md scale-[1.02]"
                        : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/80"
                    )}
                  >
                    <Icon className={cn("w-5 h-5", isActive ? "text-red-500" : "text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300")} />
                    {isActive && (
                      <motion.div
                        layoutId="profile-tab-active-indicator"
                        className="absolute inset-0 rounded-xl ring-2 ring-red-500/50 pointer-events-none"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Availability Pill */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/70 border border-zinc-200 dark:border-zinc-700 shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{profile.availability}</span>
            </div>
          </div>

          {/* TAB 1: EXECUTIVE OVERVIEW (Visually Distinct Grid Sections) */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Left 2 Cols: Visually Distinct Sections */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* 1. Executive Summary Card with Pearl Gradient Accent */}
                <div className="bg-pearl-gradient dark:bg-marble-dark border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-bold font-display text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center shadow-sm">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <span className="tracking-tight">Executive Summary & Vision</span>
                    </h2>
                    {isLoggedIn && !isEditingBio && (
                      <button
                        onClick={() => {
                          setTempBio(profile.bio);
                          setIsEditingBio(true);
                        }}
                        className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1 bg-white/80 dark:bg-zinc-800/80 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 transition-all shadow-sm"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Bio</span>
                      </button>
                    )}
                  </div>

                  {isEditingBio ? (
                    <div className="space-y-3">
                      <textarea
                        value={tempBio}
                        onChange={(e) => setTempBio(e.target.value)}
                        className="w-full min-h-[140px] text-sm leading-relaxed text-zinc-800 dark:text-zinc-200 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                        placeholder="Detail your executive narrative, key proficiencies, and strategic focus..."
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setIsEditingBio(false)}
                          className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveBio}
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-sm flex items-center gap-1.5"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save Bio</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm sm:text-base leading-relaxed text-zinc-700 dark:text-zinc-200 font-normal">
                      {profile.bio}
                    </p>
                  )}
                </div>

                {/* 2. Core Competencies & Registered Skills (Distinct Styling) */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-bold font-display text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-sm">
                        <Award className="w-4 h-4" />
                      </div>
                      <span className="tracking-tight">Registered Skills & Core Competencies</span>
                    </h2>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {profile.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-zinc-100 dark:bg-zinc-800/90 text-zinc-800 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 hover:border-red-500/50 hover:bg-red-500/5 transition-all shadow-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Col: Quick Credentials & Contact Cards */}
              <div className="space-y-6">
                
                {/* Strategic Credentials Box */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Institutional Standing</h3>
                  
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
                      <span className="text-zinc-500">Security Clearance</span>
                      <span className="font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                        Tier 1 Verified
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
                      <span className="text-zinc-500">Advisory Board</span>
                      <span className="font-bold text-zinc-800 dark:text-zinc-200">
                        {profile.stats.advisoryRoles} Active Appointments
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
                      <span className="text-zinc-500">Primary Location</span>
                      <span className="font-bold text-zinc-800 dark:text-zinc-200">{profile.location}</span>
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <span className="text-zinc-500">Availability</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">Active Consultation</span>
                    </div>
                  </div>
                </div>

                {/* Direct Connect & Inquiries Card */}
                <div 
                  id="direct-advisory-contact-card"
                  className="w-full bg-gradient-to-br from-zinc-900 to-zinc-950 text-white rounded-3xl p-6 shadow-xl border border-zinc-800 space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center font-bold shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-white truncate">Direct Advisory Contact</h4>
                      <p className="text-[11px] text-zinc-400 truncate">Inquire for consulting or co-founding</p>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Have an ecosystem opportunity, high-scale engineering problem, or strategic initiative? Reach out directly via encrypted channel.
                  </p>

                  <div className="pt-1">
                    <a
                      id="direct-advisory-email-link"
                      href={`mailto:${profile.email}`}
                      className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 overflow-hidden"
                    >
                      <Mail className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{profile.email}</span>
                    </a>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 2: EXPERIENCE & CREDENTIALS TIMELINE */}
          {activeTab === 'experience' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-bold font-display text-zinc-900 dark:text-zinc-50 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <span>Experience & Credentials Timeline</span>
                  </h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    Documented timeline of leadership posts, engineering milestones, and institutional credentials.
                  </p>
                </div>
                {isLoggedIn && (
                  <button
                    onClick={() => {
                      setTempProfile(profile);
                      setIsEditingProfile(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-xs font-bold text-zinc-800 dark:text-zinc-200 transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Role</span>
                  </button>
                )}
              </div>

              {/* Timeline Container */}
              <div className="space-y-10 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-zinc-200 dark:before:bg-zinc-800">
                {profile.experience.map((exp, index) => (
                  <div key={index} className="relative pl-10 group">
                    {/* Node Dot */}
                    <div className="absolute left-1.5 top-1.5 w-4 h-4 rounded-full border-2 border-white dark:border-zinc-900 bg-red-600 shadow-sm" />

                    <div className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/80 rounded-3xl p-6 hover:border-red-500/40 transition-all shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                        <div>
                          <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100">
                            {exp.title}
                          </h3>
                          <div className="text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-2 mt-1">
                            <Building2 className="w-3.5 h-3.5" />
                            <span>{exp.company}</span>
                            {exp.location && (
                              <>
                                <span className="text-zinc-400">·</span>
                                <span className="text-zinc-500 font-normal">{exp.location}</span>
                              </>
                            )}
                          </div>
                        </div>

                        <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 px-3.5 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 self-start sm:self-auto shadow-xs">
                          {exp.period}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed mt-3">
                        {exp.description}
                      </p>

                      {exp.highlights && exp.highlights.length > 0 && (
                        <div className="mt-4 pt-3.5 border-t border-zinc-200/60 dark:border-zinc-700/60 space-y-2">
                          {exp.highlights.map((h, i) => (
                            <div key={i} className="text-xs text-zinc-600 dark:text-zinc-400 flex items-start gap-2.5">
                              <span className="text-red-500 mt-0.5 font-bold">▪</span>
                              <span>{h}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 3: PROJECTS & PORTFOLIO GRID */}
          {activeTab === 'projects' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm">
                <div>
                  <h2 className="text-xl font-bold font-display text-zinc-900 dark:text-zinc-50 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <Layers className="w-4 h-4" />
                    </div>
                    <span>Projects & Portfolio Showcase</span>
                  </h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    Open-source repositories, distributed ecosystem infrastructure, and venture prototypes.
                  </p>
                </div>
                {isLoggedIn && (
                  <button
                    onClick={() => {
                      setTempProfile(profile);
                      setIsEditingProfile(true);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md shadow-red-600/20 flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Register Project</span>
                  </button>
                )}
              </div>

              {/* Responsive Project Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profile.projects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group hover:border-red-500/40"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-600 dark:text-red-400 bg-red-500/10 px-3 py-1 rounded-full">
                          {project.category}
                        </span>
                        <span className={cn(
                          "text-[10px] font-bold px-2.5 py-0.5 rounded-full border",
                          project.status === 'Live' ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                          project.status === 'In Development' ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                          "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400"
                        )}>
                          {project.status}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                        {project.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-2.5 leading-relaxed line-clamp-3">
                        {project.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-3.5">
                      {/* Tech stack badges */}
                      <div className="flex flex-wrap gap-1.5">
                        {project.techStack.map(tech => (
                          <span key={tech} className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-700/60">
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-1 text-xs">
                        <span className="text-zinc-500 font-semibold">{project.metrics || 'Production System'}</span>
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1 bg-red-500/10 px-3 py-1 rounded-xl"
                          >
                            <span>Inspect</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 4: ACTIVITY & INSIGHTS */}
          {activeTab === 'activity' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6"
            >
              <div>
                <h2 className="text-xl font-bold font-display text-zinc-900 dark:text-zinc-50 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <span>Published Thoughts & Ecosystem Dispatches</span>
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Chronicle of architectural memos, milestone dispatches, and engineering observations.
                </p>
              </div>

              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {profile.activities.map((item) => (
                  <article key={item.id} className="py-6 first:pt-2 last:pb-2 space-y-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                        {item.type}
                      </span>
                      <span className="text-xs text-zinc-400">{item.date}</span>
                    </div>

                    <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                      {item.title}
                    </h3>

                    <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                      {item.content}
                    </p>

                    <div className="flex items-center gap-6 pt-2 text-xs text-zinc-400 font-semibold">
                      <span className="flex items-center gap-1.5 hover:text-red-500 transition-colors cursor-pointer">
                        <Heart className="w-3.5 h-3.5" />
                        {item.likes} Endorsements
                      </span>
                      <span className="flex items-center gap-1.5 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer">
                        <MessageSquare className="w-3.5 h-3.5" />
                        {item.comments} Replies
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </motion.div>
          )}

        </div>
      </div>

      {/* 5. EDIT PROFILE MODAL */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800 sticky top-0 bg-white dark:bg-zinc-950 z-10">
              <div>
                <h2 className="text-xl font-bold font-display text-zinc-900 dark:text-zinc-50">Edit Executive Profile</h2>
                <p className="text-xs text-zinc-500 mt-0.5">Update public metadata, credentials, and institutional role.</p>
              </div>
              <button 
                onClick={() => setIsEditingProfile(false)} 
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-colors text-zinc-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Picture preview & upload */}
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 relative bg-zinc-800 shrink-0">
                  <Image
                    src={tempProfile.avatarUrl || `https://dummyimage.com/200x200/1e293b/ffffff?text=${encodeURIComponent(tempProfile.username.slice(0, 2).toUpperCase())}`}
                    alt="Preview"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
                <div>
                  <label htmlFor="avatar-upload" className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-xs font-bold cursor-pointer transition-all inline-block shadow-sm">
                    Upload New Avatar
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = async () => {
                          const compressed = await compressImage(reader.result as string, 200, 200, 0.7);
                          setTempProfile({ ...tempProfile, avatarUrl: compressed });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <p className="text-[11px] text-zinc-400 mt-1">Recommended 400x400 PNG/JPG square</p>
                </div>
              </div>

              {/* Name & Handle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Display Name</label>
                  <input
                    type="text"
                    value={tempProfile.name}
                    onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Handle (@username)</label>
                  <input
                    type="text"
                    value={tempProfile.username}
                    onChange={(e) => setTempProfile({ ...tempProfile, username: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  />
                </div>
              </div>

              {/* Professional Title & Organization */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Role / Executive Title</label>
                  <input
                    type="text"
                    value={tempProfile.role}
                    onChange={(e) => setTempProfile({ ...tempProfile, role: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Company / Institution</label>
                  <input
                    type="text"
                    value={tempProfile.company}
                    onChange={(e) => setTempProfile({ ...tempProfile, company: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  />
                </div>
              </div>

              {/* Location & Availability */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Location</label>
                  <input
                    type="text"
                    value={tempProfile.location}
                    onChange={(e) => setTempProfile({ ...tempProfile, location: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Availability Notice</label>
                  <input
                    type="text"
                    value={tempProfile.availability}
                    onChange={(e) => setTempProfile({ ...tempProfile, availability: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  />
                </div>
              </div>

              {/* Email & Website */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Email</label>
                  <input
                    type="email"
                    value={tempProfile.email}
                    onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Website</label>
                  <input
                    type="text"
                    value={tempProfile.website}
                    onChange={(e) => setTempProfile({ ...tempProfile, website: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  />
                </div>
              </div>

              {/* Biography */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Executive Biography</label>
                <textarea
                  rows={4}
                  value={tempProfile.bio}
                  onChange={(e) => setTempProfile({ ...tempProfile, bio: e.target.value })}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                />
              </div>

            </div>

            <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3 sticky bottom-0 bg-white dark:bg-zinc-950">
              <button 
                onClick={() => setIsEditingProfile(false)}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveProfile}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-red-600/25 transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
