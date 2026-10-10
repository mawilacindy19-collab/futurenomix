'use client';

import React, { use, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Mail, 
  MapPin, 
  ArrowLeft, 
  MessageSquare, 
  Briefcase, 
  Sparkles, 
  Star,
  Layers,
  Award,
  Globe,
  Users,
  FileDown,
  Check,
  Share2,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  ExternalLink,
  Building2,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generateProfilePDF } from '@/lib/pdf-generator';
import { cn } from '@/lib/utils';
import { ProfileCompletionBar } from '@/components/profile/profile-completion-bar';
import { useAuth } from '@/lib/auth-utils';

interface ProfileData {
  id: string;
  name: string;
  username?: string;
  role: string;
  company?: string;
  location: string;
  avatarUrl: string;
  coverUrl: string;
  website: string;
  bio: string;
  extendedBio: string;
  matchScore: number;
  rating: number;
  yearsOfExperience?: string;
  availability?: string;
  joinedDate?: string;
  skills: string[];
  projects: string[];
  experience: {
    title: string;
    period: string;
    description: string;
  }[];
  isGroup?: boolean;
}

const USER_PROFILES: Record<string, ProfileData> = {
  '1': {
    id: '1',
    name: 'Sophia Martinez',
    username: 'sophiamartinez',
    role: 'Founder & Chief Executive Officer',
    company: 'LogiChain AI',
    location: 'San Francisco, CA',
    avatarUrl: 'https://dummyimage.com/200x200/1e293b/ffffff?text=SM',
    coverUrl: 'https://dummyimage.com/1200x400/09090b/27272a?text=+',
    website: 'https://logichain.ai',
    bio: 'Building autonomous last-mile delivery software. Ex-Google PM. Looking for a lead backend architect to join as technical co-founder.',
    extendedBio: 'Sophia is an experienced product executive and software engineer with a strong track record in logistics, distributed compute, and geospatial routing. She spent four years at Google Maps optimizing routing algorithms and now leads LogiChain AI, utilizing deep reinforcement learning to coordinate last-mile drone and autonomous ground fleet deliveries. Currently scaling her seed stage startup and seeking high-agency technical partners.',
    matchScore: 96,
    rating: 5,
    yearsOfExperience: '8+ Years',
    availability: 'Seeking Technical Co-Founder',
    joinedDate: 'Member since Jan 2024',
    skills: ['Logistics Algorithms', 'Deep Reinforcement Learning', 'Product Management', 'Go/Rust Backend', 'Seed Stage Fundraising'],
    projects: ['Fleet Dispatcher Simulator v1.2', 'Heterogeneous Node Routing Protocol', 'Urban Drone Delivery Grid'],
    experience: [
      {
        title: 'Founder & CEO @ LogiChain AI',
        period: '2025 - Present',
        description: 'Pioneered deep reinforcement learning fleet coordination engine. Raised R1.5M Seed round and developed drone-ground vehicle coordination software.'
      },
      {
        title: 'Senior Product Manager @ Google Maps API Group',
        period: '2021 - 2024',
        description: 'Led the enterprise developer team responsible for the Routing and Directions APIs. Oversaw launch of AI-driven eco-routing algorithms used by millions.'
      },
      {
        title: 'Product Lead @ Uber Autonomous Systems Group',
        period: '2018 - 2021',
        description: 'Coordinated software releases for autonomous delivery networks and ride-hailing simulations.'
      }
    ]
  },
  '2': {
    id: '2',
    name: 'David Chen',
    username: 'davidchen',
    role: 'Staff Frontend Architect & UI Engineer',
    company: 'Orbit Open Source',
    location: 'Seattle, WA',
    avatarUrl: 'https://dummyimage.com/200x200/1e293b/ffffff?text=DC',
    coverUrl: 'https://dummyimage.com/1200x400/09090b/27272a?text=+',
    website: 'https://davidchen.io',
    bio: 'Specialist in React, Next.js, and Tailwind. Passionate about beautiful, fluid user interfaces and performant client-side state engines.',
    extendedBio: 'David is a front-end specialist who treats user interface development as a fine craft. He has spent years contributing to open-source libraries, designing highly responsive layouts, and engineering advanced state machines. He focuses on absolute pixel precision, HMR latency minimization, and touch/drag gestures that make applications feel modern and intuitive.',
    matchScore: 92,
    rating: 5,
    yearsOfExperience: '7+ Years',
    availability: 'Open to High-Impact Contracting',
    joinedDate: 'Member since Feb 2024',
    skills: ['React & Next.js App Router', 'Tailwind CSS v4', 'Framer Motion & Spring Physics', 'Client-side State Engines', 'Performance Benchmarking'],
    projects: ['Orbit Design System Core', 'Gesture-Swipe React Overlay Library', 'Fluid Bento Workspace'],
    experience: [
      {
        title: 'Core UI Engineer @ Orbit Open Source Workspace',
        period: '2024 - Present',
        description: 'Optimized touch-to-drag UI elements, modernized overall typography, and introduced fluid micro-interactions across feed and search pages.'
      },
      {
        title: 'Senior Frontend Architect @ Vercel',
        period: '2022 - 2024',
        description: 'Engineered template optimization and performance benchmarking features. Worked directly on early iterations of Next.js App Router components.'
      },
      {
        title: 'UI Developer @ Microsoft Teams Product',
        period: '2020 - 2022',
        description: 'Re-architected messaging UI for desktop client to reduce idle memory footprint by 35% and boost typing response times.'
      }
    ]
  },
  '3': {
    id: '3',
    name: 'Green Funds Ventures',
    username: 'greenfundsvc',
    role: 'General Partner & Venture Lead',
    company: 'Green Funds VC',
    location: 'New York, NY',
    avatarUrl: 'https://dummyimage.com/200x200/1e293b/ffffff?text=GF',
    coverUrl: 'https://dummyimage.com/1200x400/09090b/27272a?text=+',
    website: 'https://greenfunds.vc',
    bio: 'Investing in seed-stage sustainability-focused software, deep-tech, and AI utility layers. Dedicated to supporting high-impact founders.',
    extendedBio: 'Green Funds Ventures invests in sustainable innovation and developer ecosystems that optimize global resource allocation. As General Partner, they provide early-stage capital (typically R250k - R1M checks) to visionary founders. Beyond writing checks, they advise on go-to-market strategies, business model formulation, and recruitment for core foundational roles.',
    matchScore: 88,
    rating: 5,
    yearsOfExperience: '12+ Years',
    availability: 'Reviewing Seed & Series A Deals',
    joinedDate: 'Member since Nov 2023',
    skills: ['Venture Capital', 'Climate-Tech Ecosystems', 'SaaS Financial Modeling', 'Foundational Hiring Strategy', 'Strategic Growth Partnerships'],
    projects: ['Q3 Climate Tech & Supply Chain Thesis', 'Sustainable Founder Guild Council', 'Eco-Syndicate Angel Syndicate'],
    experience: [
      {
        title: 'General Partner @ Green Funds VC',
        period: '2020 - Present',
        description: 'Directing investment strategy. Managed capital deployment to 14 high-growth climate-tech and supply chain software companies.'
      },
      {
        title: 'Director of Sustainable Growth @ BlackRock Impact',
        period: '2015 - 2020',
        description: 'Led analysis and due diligence for sustainable energy projects and clean developer infrastructures across EMEA and APAC regions.'
      },
      {
        title: 'Investment Associate @ Sequoia Capital',
        period: '2012 - 2015',
        description: 'Evaluated early-stage SaaS applications and assisted with Series A transition workflows.'
      }
    ]
  },
  '4': {
    id: '4',
    name: 'Startup Founder Group',
    username: 'foundercircle',
    role: 'Co-working & Advisory Circle',
    company: 'Orbit Select Tier',
    location: 'Global / Remote',
    avatarUrl: 'https://dummyimage.com/200x200/1e293b/ffffff?text=SF',
    coverUrl: 'https://dummyimage.com/1200x400/09090b/27272a?text=+',
    website: 'https://orbit.app/circles/founders',
    bio: 'Selective peer-group of high-growth technology founders. Exchanging raw advice, hiring pipelines, and fundraising playbooks.',
    extendedBio: 'Startup Founder Group is a selective community of early-stage tech founders with a combined portfolio value of over R40M. The group meets weekly for virtual feedback roundtables and facilitates immediate advisory introductions across sales, compliance, engineering, and deep tech structures. Membership is invite-only.',
    matchScore: 85,
    rating: 4,
    yearsOfExperience: '4+ Years Active',
    availability: 'Accepting Qualified Applications',
    joinedDate: 'Established 2024',
    skills: ['Peer Advisory', 'Foundational Hiring Channels', 'Seed Pitch Auditing', 'Tech-Stack Optimization', 'GTM Frameworks'],
    projects: ['Founders Co-Hiring Pipeline Sheet', 'Venture Pipeline Matcher Tool'],
    experience: [
      {
        title: 'Active Community Circle @ Orbit Ecosystem',
        period: '2025 - Present',
        description: 'Fostering peer-to-peer advisor relationships, organizing monthly regional meetups, and hosting product launch preview threads.'
      }
    ],
    isGroup: true
  },
  '5': {
    id: '5',
    name: 'Elena Rostova',
    username: 'elenarostova',
    role: 'Chief Technology Officer & AI Researcher',
    company: 'EcoVizion Ltd',
    location: 'London, UK',
    avatarUrl: 'https://dummyimage.com/200x200/1e293b/ffffff?text=ER',
    coverUrl: 'https://dummyimage.com/1200x400/09090b/27272a?text=+',
    website: 'https://ecovizion.io',
    bio: 'Leveraging satellite telemetry and custom AI transformers to audit global forest carbon credits with real precision. Ex-DeepMind.',
    extendedBio: 'Elena is a researcher and ML engineer. Having worked on generative computer vision models at DeepMind, she co-founded EcoVizion to solve the carbon credit auditing transparency crisis. She specializes in training multi-spectral neural networks to measure foliage thickness and forest biomass using open satellite feeds.',
    matchScore: 94,
    rating: 5,
    yearsOfExperience: '9+ Years',
    availability: 'Open to Advisory Engagements',
    joinedDate: 'Member since Dec 2023',
    skills: ['Satellite Computer Vision', 'Multispectral Neural Networks', 'PyTorch / Jax', 'Carbon Accounting Standards', 'MLOps Infrastructure'],
    projects: ['BioMass Estimator Transformer', 'EcoVizion Satellite Core Pipeline v2'],
    experience: [
      {
        title: 'CTO & Co-Founder @ EcoVizion Ltd',
        period: '2024 - Present',
        description: 'Pioneered custom satellite biomass estimator networks. Scaled pipeline to support live analysis of 12M hectares across EMEA.'
      },
      {
        title: 'Research Scientist @ Google DeepMind',
        period: '2021 - 2024',
        description: 'Contributed to foundational generative vision models. Research in remote sensing published at leading ML conferences.'
      }
    ]
  },
  '6': {
    id: '6',
    name: 'Ecovizion Ltd',
    username: 'ecovizion',
    role: 'Enterprise Climate Software Syndicate',
    company: 'EcoVizion Ltd',
    location: 'London, UK',
    avatarUrl: 'https://dummyimage.com/200x200/1e293b/ffffff?text=EV',
    coverUrl: 'https://dummyimage.com/1200x400/09090b/27272a?text=+',
    website: 'https://ecovizion.io',
    bio: 'Enterprise dashboard for real-time carbon inventory auditing and automated green supply chain verification.',
    extendedBio: 'Ecovizion is an environmental technology company building software that enables global supply chains to connect directly to live carbon inventory audits, providing unparalleled transparency to enterprises seeking to achieve verified carbon-neutral compliance.',
    matchScore: 90,
    rating: 4,
    yearsOfExperience: '3+ Years',
    availability: 'Accepting Enterprise Pilots',
    joinedDate: 'Established 2024',
    skills: ['Carbon Auditing', 'Supply Chain Visibility', 'ESG Compliance Reporting', 'SaaS Platform Security', 'Enterprise APIs'],
    projects: ['Real-time Supply Chain Carbon Estimator', 'Audit Export Compliance API'],
    experience: [
      {
        title: 'Enterprise Platform Provider',
        period: '2024 - Present',
        description: 'Supporting Fortune 500 manufacturing firms in reporting and mitigating Scope 3 supply chain carbon emissions.'
      }
    ]
  },
  '7': {
    id: '7',
    name: 'Marcus Vance',
    username: 'marcusvance',
    role: 'Senior Recruiting Advisor & Talent Architect',
    company: 'Synergy Talent',
    location: 'Austin, TX',
    avatarUrl: 'https://dummyimage.com/200x200/1e293b/ffffff?text=MV',
    coverUrl: 'https://dummyimage.com/1200x400/09090b/27272a?text=+',
    website: 'https://synergytalent.com',
    bio: 'Specialist recruiter for Series A & B technology startups. Helping founders hire world-class AI, frontend, and backend engineering teams.',
    extendedBio: 'Marcus has spent over a decade advising high-growth Silicon Valley and Austin-based startups on technical recruitment, compensation structure, and employer branding. He has facilitated over 150 foundational engineering hires and advises pre-seed founders on early talent acquisition.',
    matchScore: 86,
    rating: 5,
    yearsOfExperience: '11+ Years',
    availability: 'Available for Retained Executive Searches',
    joinedDate: 'Member since Aug 2023',
    skills: ['Technical Recruiting', 'Startup Compensation Benchmarking', 'Hiring Pipeline Design', 'Talent Branding', 'Executive Search'],
    projects: ['Pre-Seed Founder Equity Playbook 2026', 'Engineering Competency Grid'],
    experience: [
      {
        title: 'Senior Talent Partner @ Synergy Talent',
        period: '2021 - Present',
        description: 'Directing executive and engineering talent acquisition campaigns. Helped three client portfolios recruit engineering leaders.'
      },
      {
        title: 'Lead Technical Recruiter @ Stripe',
        period: '2017 - 2021',
        description: 'Scaled core developer infrastructure team from 18 to over 120 engineers during hyper-growth phase.'
      }
    ]
  }
};

export default function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [avatarAspectRatio, setAvatarAspectRatio] = useState(1);
  const [coverAspectRatio, setCoverAspectRatio] = useState(1200 / 400);

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'experience' | 'projects'>('overview');
  const [profileData, setProfileData] = useState<ProfileData>(USER_PROFILES[id] || USER_PROFILES['1']);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/auth');
      return;
    }
    const storedUser = localStorage.getItem('orbit_user_profile');
    if (storedUser) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {}
    }
  }, [user, authLoading, router]);

  const calculateCompletion = (profile: any) => {
    const fields = [
      profile.bio,
      profile.extendedBio,
      profile.skills && profile.skills.length > 0,
      profile.projects && profile.projects.length > 0,
      profile.experience && profile.experience.length > 0,
      profile.avatarUrl,
      profile.coverUrl,
      profile.website,
      profile.location
    ];
    const filled = fields.filter(f => !!f).length;
    return Math.round((filled / fields.length) * 100);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Try hardcoded profiles
    if (USER_PROFILES[id]) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProfileData(USER_PROFILES[id]);
      return;
    }

    // 2. Try custom accounts in orbit_accounts
    const storedAccounts = localStorage.getItem('orbit_accounts');
    if (storedAccounts) {
      try {
        const accounts = JSON.parse(storedAccounts);
        const customAcc = accounts.find((a: any) => a.id === id || a.name === id || a.username === id);
        if (customAcc) {
          setProfileData({
            ...USER_PROFILES['1'],
            ...customAcc,
            id: customAcc.id,
            name: customAcc.name,
            username: customAcc.username || customAcc.name.toLowerCase().replace(/\s+/g, ''),
            role: customAcc.type === 'business' ? customAcc.name : (customAcc.role || 'Executive Member'),
            company: customAcc.company || (customAcc.type === 'business' ? customAcc.name : 'FutureNomix Ecosystem'),
            avatarUrl: customAcc.avatarUrl || 'https://dummyimage.com/200x200/1e293b/ffffff?text=user',
            bio: customAcc.bio || 'Verified FutureNomix contributor.',
            extendedBio: customAcc.extendedBio || customAcc.bio || 'Verified member in the network.',
            skills: customAcc.skills || [],
            projects: customAcc.projects || [],
            experience: customAcc.experience || []
          });
          return;
        }
      } catch (e) {}
    }

    // 3. Fallback
    setProfileData(USER_PROFILES['1']);
  }, [id]);

  const profile = profileData;

  const handleDownloadPDF = () => {
    setIsDownloading(true);
    setTimeout(() => {
      try {
        generateProfilePDF({
          name: profile.name,
          role: profile.company ? `${profile.role} at ${profile.company}` : profile.role,
          location: profile.location,
          website: profile.website,
          email: `${profile.username || profile.name.toLowerCase().split(' ')[0]}@futurenomix.dev`,
          bio: profile.extendedBio || profile.bio,
          skills: profile.skills,
          projects: profile.projects,
          experience: profile.experience,
        });
        setIsDownloading(false);
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 3000);
      } catch (err) {
        console.error('Error generating PDF', err);
        setIsDownloading(false);
      }
    }, 1000);
  };

  const handleShareProfile = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleMessageClick = () => {
    const targetChatId = profile.id;
    if (typeof window !== 'undefined') {
      const activeId = localStorage.getItem('orbit_active_account_id') || 'personal-1';
      let conversations: any[] = [];
      const saved = localStorage.getItem(`orbit_conversations_${activeId}`);
      if (saved) {
        try {
          conversations = JSON.parse(saved);
        } catch (e) {}
      }
      
      const existingChat = conversations.find((c: any) => c.id === targetChatId);
      if (!existingChat) {
        const newConversation = {
          id: targetChatId,
          name: profile.name,
          role: profile.role,
          company: profile.company || '',
          location: profile.location,
          avatarUrl: profile.avatarUrl,
          bio: profile.bio,
          projectPitch: profile.isGroup ? 'Group Resources' : (profile.extendedBio ? profile.extendedBio.substring(0, 100) + '...' : profile.bio),
          matchScore: profile.matchScore,
          rating: profile.rating,
          unread: 0,
          time: 'Just now',
          sharedFiles: [],
          messages: [],
          notes: ''
        };
        conversations.unshift(newConversation);
        localStorage.setItem(`orbit_conversations_${activeId}`, JSON.stringify(conversations));
      }
      localStorage.setItem('orbit_last_chat_id_trigger', targetChatId);
      localStorage.setItem('orbit_chat_is_new_trigger', 'false');
    }
    router.push('/messages');
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
    <div id={`executive-user-profile-${profile.id}`} className="w-full min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors pb-16">
      
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
            <span>Profile URL copied to clipboard!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. EXECUTIVE COVER BANNER */}
      <div className="relative w-full overflow-hidden bg-zinc-900 border-b border-zinc-200/80 dark:border-zinc-800/80" style={{ aspectRatio: coverAspectRatio, maxHeight: '400px' }}>
        <Image
          src={profile.coverUrl || 'https://dummyimage.com/1200x400/09090b/27272a?text=+'}
          alt={profile.name}
          fill
          priority
          unoptimized
          onLoadingComplete={({ naturalWidth, naturalHeight }) => {
            setCoverAspectRatio(naturalWidth / naturalHeight);
          }}
          className="object-cover opacity-90 brightness-[0.85]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/40 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        {/* Back Button */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10">
          <button
            onClick={() => router.back()}
            className="bg-zinc-900/80 hover:bg-zinc-900 backdrop-blur-md text-zinc-200 hover:text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all border border-zinc-700/60 shadow-md active:scale-95"
            aria-label="Go Back"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </div>
      </div>

      {/* 2. EXECUTIVE HEADER CARD */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-16 sm:-mt-20 md:-mt-24">
        <div className="bg-white dark:bg-zinc-900/95 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-sm">
          
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6">
            
            {/* Left: Avatar & User Metadata */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
              <div className="relative shrink-0 -mt-16 sm:-mt-20">
                <div 
                  style={{ aspectRatio: avatarAspectRatio }}
                  className="w-28 sm:w-36 md:w-40 rounded-2xl overflow-hidden border-4 border-white dark:border-zinc-900 shadow-2xl bg-zinc-800 relative transition-all duration-500"
                >
                  <Image
                    src={profile.avatarUrl}
                    alt={profile.name}
                    fill
                    unoptimized
                    onLoadingComplete={({ naturalWidth, naturalHeight }) => {
                      setAvatarAspectRatio(naturalWidth / naturalHeight);
                    }}
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div 
                  title="Verified Member"
                  className="absolute -bottom-1.5 -right-1.5 bg-red-600 text-white p-1 rounded-full border-2 border-white dark:border-zinc-900 shadow-md"
                >
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-1 sm:mb-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-display font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
                    {profile.name}
                  </h1>
                  {profile.username && (
                    <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                      @{profile.username}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                    <Sparkles className="w-3 h-3 fill-current" />
                    {profile.matchScore}% Match Fit
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
                  {profile.joinedDate && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                      {profile.joinedDate}
                    </span>
                  )}
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

            {/* Right: Actions Bar */}
            <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-start lg:justify-end">
              {/* PDF Download */}
              <button
                id={`profile-download-cv-${profile.id}`}
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
                    <span>Formatting CV...</span>
                  </>
                ) : downloadSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>CV Ready!</span>
                  </>
                ) : (
                  <>
                    <FileDown className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                    <span>Export CV</span>
                  </>
                )}
              </button>

              {/* Share */}
              <button
                onClick={handleShareProfile}
                className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                title="Copy profile link"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Share</span>
              </button>

              {/* Message / Connect CTA */}
              <button
                id={`profile-message-cta-${profile.id}`}
                onClick={handleMessageClick}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition-all shadow-md shadow-red-600/25 active:scale-95 flex items-center gap-2"
              >
                {profile.isGroup ? <Users className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                <span>{profile.isGroup ? 'Join Circle Channel' : 'Send Direct Message'}</span>
              </button>
            </div>
          </div>

          {/* If viewing own profile via ID, show completion bar */}
          {currentUser && currentUser.id === profile.id && (
            <div className="mt-6">
              <ProfileCompletionBar percentage={calculateCompletion(profile)} />
            </div>
          )}

          {/* 3. METRIC COUNTERS ROW */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
            <div className="p-3.5 rounded-2xl bg-zinc-50/70 dark:bg-zinc-800/40 border border-zinc-200/50 dark:border-zinc-800/60">
              <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Track Record</div>
              <div className="text-xl sm:text-2xl font-display font-bold text-zinc-900 dark:text-zinc-50 mt-0.5">
                {profile.yearsOfExperience || '6+ Years'}
              </div>
              <div className="text-[11px] text-zinc-500 font-medium">Domain Tenure</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-50/70 dark:bg-zinc-800/40 border border-zinc-200/50 dark:border-zinc-800/60">
              <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Portfolio</div>
              <div className="text-xl sm:text-2xl font-display font-bold text-zinc-900 dark:text-zinc-50 mt-0.5">
                {profile.projects?.length || 3} Deployed
              </div>
              <div className="text-[11px] text-zinc-500 font-medium">Public Initiatives</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-50/70 dark:bg-zinc-800/40 border border-zinc-200/50 dark:border-zinc-800/60">
              <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Network Rating</div>
              <div className="text-xl sm:text-2xl font-display font-bold text-amber-500 mt-0.5 flex items-center gap-1">
                <span>{profile.rating}.0</span>
                <Star className="w-4 h-4 fill-amber-500" />
              </div>
              <div className="text-[11px] text-zinc-500 font-medium">Peer Endorsements</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-50/70 dark:bg-zinc-800/40 border border-zinc-200/50 dark:border-zinc-800/60">
              <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Synergy Fit</div>
              <div className="text-xl sm:text-2xl font-display font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1">
                <span>{profile.matchScore}%</span>
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-[11px] text-zinc-500 font-medium">Calculated Match</div>
            </div>
          </div>

        </div>

        {/* 4. TAB NAVIGATION & INFORMATION ARCHITECTURE */}
        <div className="mt-8">
          
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 mb-8 overflow-x-auto no-scrollbar gap-4">
            <div className="flex items-center space-x-1 sm:space-x-4">
              {[
                { id: 'overview', label: 'Executive Summary', icon: Briefcase },
                { id: 'experience', label: `Experience & Roles (${profile.experience?.length || 0})`, icon: Building2 },
                { id: 'projects', label: `Projects & Initiatives (${profile.projects?.length || 0})`, icon: Layers }
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
                      "relative pb-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 whitespace-nowrap",
                      isActive
                        ? "text-red-600 dark:text-red-400"
                        : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {isActive && (
                      <motion.div
                        layoutId="user-profile-tab-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 dark:bg-red-400"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {profile.availability && (
              <div className="hidden md:flex items-center gap-2 pb-3 shrink-0">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">{profile.availability}</span>
              </div>
            )}
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              <div className="lg:col-span-2 space-y-8">
                {/* Extended Bio */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm">
                  <h2 className="text-base font-bold font-display text-zinc-900 dark:text-zinc-100 flex items-center gap-2 mb-4">
                    <Briefcase className="w-4 h-4 text-red-600 dark:text-red-400" />
                    <span>Executive Narrative</span>
                  </h2>
                  <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                    {profile.extendedBio || profile.bio}
                  </p>
                </div>

                {/* Skills */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm">
                  <h2 className="text-base font-bold font-display text-zinc-900 dark:text-zinc-100 flex items-center gap-2 mb-4">
                    <Award className="w-4 h-4 text-red-600 dark:text-red-400" />
                    <span>{profile.isGroup ? 'Circle Focus Areas' : 'Core Expertise & Proficiencies'}</span>
                  </h2>
                  <div className="flex flex-wrap gap-2.5">
                    {profile.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-zinc-100 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 border border-zinc-200/60 dark:border-zinc-700/60"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Sidebar: Contact card */}
              <div className="space-y-6">
                <div 
                  id="direct-advisory-contact-card"
                  className="w-full max-w-[280px] sm:max-w-[300px] ml-0 mr-auto bg-gradient-to-br from-zinc-900 to-zinc-950 text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-zinc-800 space-y-3.5"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center font-bold shrink-0">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-white truncate">Direct Advisory Contact</h4>
                      <p className="text-[11px] text-zinc-400 truncate">Initiate encrypted conversation</p>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Connect directly to discuss co-founding, advisory roles, technical consulting, or enterprise pilots.
                  </p>

                  <div className="pt-1">
                    <button
                      id="direct-advisory-send-message-btn"
                      onClick={handleMessageClick}
                      className="w-full py-2 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                      <span>Send Message</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: EXPERIENCE */}
          {activeTab === 'experience' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6"
            >
              <div>
                <h2 className="text-xl font-bold font-display text-zinc-900 dark:text-zinc-50">
                  Career Milestones & Institutional Experience
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Documented history of appointments and achievements.
                </p>
              </div>

              <div className="space-y-8 relative pl-4 border-l-2 border-zinc-200 dark:border-zinc-800">
                {profile.experience?.map((exp, index) => (
                  <div key={index} className="relative group pl-6">
                    <div className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full border-2 border-white dark:border-zinc-900 bg-red-600" />
                    <div className="bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-700/60 rounded-2xl p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                        <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100">
                          {exp.title}
                        </h3>
                        <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-800 px-3 py-1 rounded-lg border border-zinc-200/60 dark:border-zinc-700/60 self-start sm:self-auto">
                          {exp.period}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                        {exp.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 3: PROJECTS */}
          {activeTab === 'projects' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-bold font-display text-zinc-900 dark:text-zinc-50">
                  Initiatives & Technical Artifacts
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Active contributions and shared ecosystem work.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profile.projects?.map((proj, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-600 dark:text-red-400 bg-red-500/10 px-2.5 py-0.5 rounded-full">
                          Initiative #{index + 1}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                          Active
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                        {proj}
                      </h3>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
                        Verified ecosystem contribution published by {profile.name}.
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 text-xs flex items-center justify-between">
                      <span className="text-zinc-400 font-medium">FutureNomix Network</span>
                      <button
                        onClick={handleMessageClick}
                        className="font-bold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
                      >
                        <span>Collaborate</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </div>

      </div>
    </div>
  );
}
