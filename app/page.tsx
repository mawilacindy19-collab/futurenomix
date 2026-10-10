'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';

// Theme Background Images matching the user's uploaded pictures
import mandelaBridgeImg from '@/src/assets/images/mandela_bridge_sunset_1786941248876.jpg';
import springboksFountainImg from '@/src/assets/images/springboks_fountain_sunset_1786941265947.jpg';
import unionBuildingsImg from '@/src/assets/images/union_buildings_dusk_1786941282543.jpg';
import durbanOceanImg from '@/src/assets/images/durban_ocean_skyline_1786941294986.jpg';
import joburgSunriseImg from '@/src/assets/images/joburg_sunrise_skyline_1786941307323.jpg';
import joburgMonochromeImg from '@/src/assets/images/joburg_monochrome_night_1786941321911.jpg';
import joburgSkylineHero from '@/src/assets/images/johannesburg_skyline_hero_1785131432771.jpg';
import joburgAerialBg from '@/src/assets/images/johannesburg_aerial_skyline_bg_1785089528895.jpg';
import cityLightsHighVantage from '@/src/assets/images/city_lights_high_vantage_1784997231539.jpg';
import historicBankBg from '@/src/assets/images/historic_johannesburg_bank_bg_1785089002518.jpg';
import projectsCardBg from '@/src/assets/images/projects_card_bg_1784998120871.jpg';

// Newly added uploaded picture themes
import roundaboutNightImg from '@/src/assets/images/roundabout_night_trails_1786947156443.jpg';
import hillbrowDaytimeImg from '@/src/assets/images/hillbrow_daytime_skyline_1786947171677.jpg';
import sportsStadiumImg from '@/src/assets/images/sports_stadium_complex_1786947189406.jpg';
import polokwaneSkylineImg from '@/src/assets/images/polokwane_city_skyline_1786947206473.jpg';
import capeTownNightImg from '@/src/assets/images/cape_town_night_highway_1787222035259.jpg';
import joburgTourismNightImg from '@/src/assets/images/johannesburg_tourism_night_1787222047047.jpg';
import durbanNightOceanImg from '@/src/assets/images/durban_night_ocean_1787222058173.jpg';
import cityLightsTwilightImg from '@/src/assets/images/city_lights_twilight_1787222070462.jpg';
import HeroVideoBackground from '@/components/hero/HeroVideoBackground';

import menuBackgroundImage from '@/src/assets/images/johannesburg_aerial_skyline_bg_1785089528895.jpg';
import jobsBackgroundImage from '@/src/assets/images/jobs_card_bg_1784997693404.jpg';
import projectsBackgroundImage from '@/src/assets/images/projects_card_bg_1784998120871.jpg';
import fundingBackgroundImage from '@/src/assets/images/funding_card_bg_1784998720698.jpg';
import businessBackgroundImage from '@/src/assets/images/business_card_bg_1785000398382.jpg';
import communitiesBackgroundImage from '@/src/assets/images/businesses_card_hands_bg_1785000095433.jpg';
import homeFeedBackgroundImage from '@/src/assets/images/hobnob_card_bg_1785218418130.jpg';

import { 
  Home, 
  Briefcase, 
  FolderDot, 
  Landmark, 
  Building2, 
  LayoutDashboard,
  Users, 
  ArrowRight,
  Search,
  Sparkles,
  Command,
  X,
  Menu as MenuIcon,
  Globe,
  Layers,
  SlidersHorizontal,
  Compass,
  Settings,
  Info,
  PhoneCall,
  HelpCircle,
  ChevronDown,
  User,
  Target,
  Globe2,
  ShieldCheck,
  LogIn,
  ChevronRight
} from 'lucide-react';

import { getEcosystemStats, DEFAULT_STATS, EcosystemStats } from '@/lib/ecosystem-metrics';

// Dynamic Hexagon Grid with random, interchangeable transparent (clear) animations
function DynamicHexagonGrid() {
  const [clearIndices, setClearIndices] = useState<Set<number>>(new Set());

  // Grid parameters for enlarged tessellation
  const radius = 58;
  const dx = radius * 1.73205; // ~100.45
  const dy = radius * 1.5; // 87
  const cols = 16;
  const rows = 7;

  const hexList = useMemo(() => {
    const list = [];
    let id = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cx = c * dx + (r % 2 === 1 ? dx / 2 : 0);
        const cy = r * dy;

        // Calculate 6 vertices for outer hexagon
        const points = [];
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 180) * (60 * i - 30);
          const px = cx + radius * Math.cos(angle);
          const py = cy + radius * Math.sin(angle);
          points.push(`${px.toFixed(1)},${py.toFixed(1)}`);
        }

        // Calculate 6 vertices for inner wireframe hexagon
        const innerRadius = radius * 0.58;
        const innerPoints = [];
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 180) * (60 * i - 30);
          const px = cx + innerRadius * Math.cos(angle);
          const py = cy + innerRadius * Math.sin(angle);
          innerPoints.push(`${px.toFixed(1)},${py.toFixed(1)}`);
        }

        const isRed = (c * 7 + r * 13) % 5 === 0;
        const isFilled = (c * 11 + r * 17) % 7 === 0;

        list.push({
          id,
          cx,
          cy,
          points: points.join(' '),
          innerPoints: innerPoints.join(' '),
          isRed,
          isFilled,
        });
        id++;
      }
    }
    return list;
  }, [cols, rows, radius, dx, dy]);

  // Periodically change which hexagons become transparent (clear) interchangeably
  useEffect(() => {
    const updateClearHexagons = () => {
      const total = hexList.length;
      const numClear = Math.floor(total * 0.68); // ~68% transparent/clear
      const newClearSet = new Set<number>();
      while (newClearSet.size < numClear) {
        const randomIndex = Math.floor(Math.random() * total);
        newClearSet.add(randomIndex);
      }
      setClearIndices(newClearSet);
    };

    updateClearHexagons();
    const interval = setInterval(updateClearHexagons, 1800);
    return () => clearInterval(interval);
  }, [hexList.length]);

  return (
    <svg className="absolute inset-0 w-full h-full opacity-95" viewBox="0 0 1440 500" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="wireframe-mask-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
          <stop offset="30%" stopColor="#ffffff" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
        </linearGradient>
        <mask id="hex-wireframe-mask">
          <rect width="100%" height="100%" fill="url(#wireframe-mask-grad)" />
        </mask>
      </defs>

      <g mask="url(#hex-wireframe-mask)">
        {hexList.map((hex) => {
          const isClear = clearIndices.has(hex.id);
          return (
            <g key={hex.id}>
              {/* Outer Hexagon Polygon - Crisp, high-visibility lines */}
              <motion.polygon
                points={hex.points}
                animate={{
                  opacity: isClear ? 0 : 0.95,
                  strokeOpacity: isClear ? 0 : 0.95,
                  fillOpacity: isClear ? 0 : hex.isFilled ? 0.12 : 0,
                  scale: isClear ? 0.9 : 1,
                }}
                transition={{
                  duration: 1.5,
                  ease: "easeInOut",
                }}
                stroke={hex.isRed ? "#dc2626" : "#64748b"}
                strokeWidth={hex.isRed ? 2.2 : 1.8}
                fill={hex.isFilled ? (hex.isRed ? "#f87171" : "#ffffff") : "none"}
              />

              {/* Inner Nested Hexagon Wireframe */}
              {hex.isRed && (
                <motion.polygon
                  points={hex.innerPoints}
                  animate={{
                    opacity: isClear ? 0 : 0.85,
                    strokeOpacity: isClear ? 0 : 0.85,
                  }}
                  transition={{
                    duration: 1.5,
                    ease: "easeInOut",
                  }}
                  stroke="#ef4444"
                  strokeWidth="1.5"
                  strokeDasharray="4,3"
                  fill="none"
                />
              )}

              {/* Node Vertex Dot */}
              {hex.isRed && (
                <motion.circle
                  cx={hex.cx}
                  cy={hex.cy}
                  r={3.0}
                  animate={{
                    opacity: isClear ? 0 : 0.95,
                  }}
                  transition={{
                    duration: 1.2,
                    ease: "easeInOut",
                  }}
                  fill="#ef4444"
                />
              )}
            </g>
          );
        })}

        {/* Analytical vector lines in Red & Light Gray */}
        <g className="hidden sm:block">
          <line x1="10%" y1="70%" x2="90%" y2="70%" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="5,10" strokeOpacity="0.4" />
          <line x1="25%" y1="40%" x2="25%" y2="95%" stroke="#cbd5e1" strokeWidth="1.2" strokeDasharray="3,8" strokeOpacity="0.5" />
          <line x1="75%" y1="30%" x2="75%" y2="90%" stroke="#f87171" strokeWidth="1.2" strokeDasharray="3,8" strokeOpacity="0.4" />
          <circle cx="25%" cy="70%" r="10" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeOpacity="0.7" />
          <circle cx="25%" cy="70%" r="3" fill="#ef4444" />
          <circle cx="75%" cy="70%" r="14" fill="none" stroke="#f87171" strokeWidth="1.2" strokeDasharray="4,4" strokeOpacity="0.6" />
          <circle cx="75%" cy="70%" r="4" fill="#f87171" />
        </g>
      </g>
    </svg>
  );
}

export default function MenuPage() {
  // Johannesburg Hillbrow Tower Aerial Hero Background Video
  const backgroundThemes = [
    { 
      id: 'johannesburg-hillbrow-tower-aerial-video', 
      title: 'Johannesburg Hillbrow Tower Aerial Skyline', 
      isVideo: true, 
      videoSrc: 'https://videos.pexels.com/video-files/4434236/4434236-hd_1920_1080_25fps.mp4', 
      location: 'Johannesburg, Hillbrow Tower', 
      isNight: false 
    }
  ];

  const router = useRouter();
  const [currentThemeIndex] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signup' | 'signin'>('signup');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState<EcosystemStats>(DEFAULT_STATS);
  const [liveTime, setLiveTime] = useState<string>('');
  const [videoDurationState, setVideoDurationState] = useState<{
    currentTime: number;
    duration: number;
    progress: number;
  }>({
    currentTime: 0,
    duration: 30,
    progress: 0,
  });

  useEffect(() => {
    const checkLogin = () => {
      const logged = localStorage.getItem('orbit_is_logged_in') === 'true';
      setIsLoggedIn(logged);
    };
    checkLogin();
    window.addEventListener('orbit-auth-change', checkLogin);
    window.addEventListener('storage', checkLogin);

    const updateClock = () => {
      setStats(getEcosystemStats());
      const now = new Date();
      setLiveTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => {
      clearInterval(interval);
      window.removeEventListener('orbit-auth-change', checkLogin);
      window.removeEventListener('storage', checkLogin);
    };
  }, []);

  // Scroll restoration to target directory card or top viewport
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash || (sessionStorage.getItem('return_card') ? '#' + sessionStorage.getItem('return_card') : '');
      const urlParams = new URLSearchParams(window.location.search);
      const cardParam = urlParams.get('card');
      const targetId = hash ? hash.replace('#', '') : (cardParam ? `card-${cardParam}` : '');
      
      if (targetId) {
        const el = document.getElementById(targetId);
        if (el) {
          setTimeout(() => {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            sessionStorage.removeItem('return_card');
          }, 250);
        }
      } else {
        window.scrollTo(0, 0);
      }
    }
  }, []);

  // Keyboard shortcut listener for Command+K / Ctrl+K search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsMobileMenuOpen(false);
        setIsHamburgerOpen(false);
        setIsFaqModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const activeTheme = backgroundThemes[currentThemeIndex];
  const isNight = activeTheme.isNight;
  const menuOptions = [
    {
      name: 'Hobnob',
      href: '/feed',
      icon: Home,
      description: 'Community feed, posts, and announcements.',
      badge: 'Main'
    },
    {
      name: 'Jobs',
      href: '/jobs',
      icon: Briefcase,
      description: 'Startup career and internship opportunities.',
      badge: 'Careers'
    },
    {
      name: 'Funding',
      href: '/funding',
      icon: Landmark,
      description: 'Angel investors, VCs, and grant programs.',
      badge: 'Capital'
    },
    {
      name: 'Businesses',
      href: '/businesses',
      icon: Building2,
      description: 'Startup and enterprise ecosystem directory.',
      badge: 'Directory'
    },
    {
      name: 'Portfolio',
      href: '/portfolio',
      icon: LayoutDashboard,
      description: 'Dashboard for jobs, funding, and connections.',
      badge: 'Overview'
    },
  ];

  const filteredOptions = menuOptions.filter((opt) =>
    opt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    opt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    opt.badge.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Sidebar (Desktop Only) */}
      <aside className="hidden md:flex flex-col absolute left-0 top-0 bottom-0 w-[480px] z-50 p-6 bg-[#151A22] bg-marble-dark text-[#f3f0e6] border-r border-[#f3f0e6]/15 shadow-2xl">
        {/* Desktop Settings Icon */}
        <div className="absolute top-4 left-6 z-[60]">
          <Link
            href="/settings"
            className="group relative flex items-center justify-center p-2 bg-transparent hover:opacity-80 transition-all active:scale-95 cursor-pointer"
            aria-label="Settings"
            title="Settings"
          >
            <div className="w-6 h-6 flex items-center justify-center text-[#f3f0e6] group-hover:rotate-90 transition-transform duration-300">
              <Settings className="w-6 h-6 stroke-[2.5]" />
            </div>
          </Link>
        </div>

        <nav className="flex flex-col gap-6 mt-16">
          {menuOptions.map((opt) => {
            const Icon = opt.icon;
            return (
              <Link key={opt.name} href={opt.href} className="flex items-center gap-3 text-[#f3f0e6]/70 hover:text-[#f3f0e6] transition-all group py-1.5">
                <ChevronRight className="w-5 h-5 text-amber-400/90 shrink-0 opacity-100 transition-all" />
                <div className="flex items-center gap-3 shrink-0">
                  <Icon className="w-5 h-5 shrink-0 text-[#f3f0e6]/90" />
                  <span className="font-bold text-base whitespace-nowrap w-28 text-[#f3f0e6]">{opt.name}</span>
                </div>
                <div className="h-px bg-[#f3f0e6]/15 flex-1 group-hover:bg-amber-400/30 transition-colors" />
                <span className="text-sm text-[#f3f0e6]/50 uppercase tracking-widest font-mono group-hover:text-[#f3f0e6]/80 transition-colors ml-2 whitespace-nowrap">{opt.description}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Section */}
      <div className="md:pl-[480px] relative min-h-screen flex flex-col items-center justify-start overflow-hidden">
        
        {/* Transparent Clear Static Top Header Bar */}
        <header className="static w-full h-10 bg-transparent z-40 grid grid-cols-3 items-center px-3 sm:px-6 transition-all">
          {/* Left: Stylish Hamburger Menu (Mobile Only) */}
          <div className="md:hidden flex items-center justify-start">
            <Link
              href="/menu"
              className="group relative flex items-center gap-2.5 px-3.5 py-2.5 bg-transparent hover:opacity-80 transition-all active:scale-95 cursor-pointer"
              aria-label="Full Page Navigation Menu"
              title="Open Navigation Menu"
            >
              <div className="w-6 h-6 flex items-center justify-center text-white group-hover:rotate-90 transition-transform duration-300">
                <MenuIcon className="w-6 h-6 stroke-[2.5]" />
              </div>
            </Link>
          </div>
          <div className="hidden md:block"></div>

          {/* Center: Brand Logo & Live Beacon */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 md:col-span-1 col-span-1 md:-translate-x-[240px]">
            <Link href="/" className="flex items-center group" aria-label="Home">
              <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center bg-transparent overflow-hidden group-hover:scale-105 transition-transform">
                <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 25 25 L 47.5 25 L 42.5 35 L 37.5 35 L 41.5 43 L 47.5 43 L 45.5 51 L 50 75 Z" className="fill-white" />
                  <path d="M 52.5 25 L 75 25 L 58 59 L 50 59 L 61 37 L 52.5 37 Z" fill="#ef4444" />
                </svg>
              </div>
            </Link>


          </div>

          {/* Right: Profile Icon or Sign In */}
          <div className="flex items-center justify-end gap-2 sm:gap-2.5">
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/profile"
                  className="group relative flex items-center justify-center p-2.5 bg-white/10 hover:bg-white/20 rounded-full transition-all active:scale-95 cursor-pointer backdrop-blur-md border border-white/20"
                  aria-label="Profile"
                  title="View Profile"
                >
                  <User className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { mode: 'signin' } }))}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md transition-all border border-white/20 cursor-pointer"
                >
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { mode: 'signup' } }))}
                  className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md shadow-red-600/30 cursor-pointer"
                >
                  <span>Sign Up</span>
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Authentication Modal */}
        <AnimatePresence>
          {isAuthModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200/80 dark:border-zinc-800 p-6 sm:p-8 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 to-rose-600" />
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-display font-bold text-zinc-900 dark:text-zinc-50">
                      {authMode === 'signup' ? 'Create Your Account' : 'Welcome Back'}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                      {authMode === 'signup' ? 'Join Futurenomix ecosystem to collaborate & build' : 'Sign in to access your profile and saved projects'}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsAuthModalOpen(false)}
                    className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (authMode === 'signup') {
                      setIsAuthModalOpen(false);
                      router.push('/onboarding');
                      return;
                    }
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('orbit_is_logged_in', 'true');
                      localStorage.setItem('orbit_active_account_id', 'personal-1');
                      setIsLoggedIn(true);
                      setIsAuthModalOpen(false);
                    }
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="you@domain.com"
                      className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm tracking-wide shadow-lg shadow-red-600/25 transition-all active:scale-[0.99] mt-2"
                  >
                    {authMode === 'signup' ? 'Complete Sign Up' : 'Sign In'}
                  </button>

                  {authMode === 'signin' ? (
                    <div className="pt-2">
                      <div className="relative my-3">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase">
                          <span className="bg-white dark:bg-zinc-900 px-3 text-zinc-400 font-semibold tracking-wider">
                            Don&apos;t have an account?
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAuthModalOpen(false);
                          router.push('/onboarding');
                        }}
                        className="w-full py-2.5 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold text-sm transition-all flex items-center justify-center gap-2 active:scale-[0.99] shadow-sm group"
                      >
                        <span>Sign Up &amp; Create Profile</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => setAuthMode('signin')}
                        className="text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 font-medium transition-colors"
                      >
                        Already have an account? Sign In
                      </button>
                    </div>
                  )}
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Mobile Navigation Slide-Down Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="fixed top-14 left-0 right-0 z-30 bg-white/98 backdrop-blur-xl border-b border-slate-200 p-4 shadow-xl md:hidden"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Ecosystem Sections</span>
                </div>
                {menuOptions.map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <Link
                      key={opt.name}
                      href={opt.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{opt.name}</p>
                          <p className="text-xs text-slate-500 line-clamp-1">{opt.description}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Command Palette Quick Search Overlay Modal */}
        <AnimatePresence>
          {isSearchOpen && (
            <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/40 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.15 }}
                className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
              >
                {/* Search Bar Input */}
                <div className="flex items-center px-4 py-3 border-b border-slate-100 gap-3 bg-slate-50/50">
                  <Search className="w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search modules, careers, startups, funding..."
                    className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
                    autoFocus
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="p-1 text-slate-400 hover:text-slate-600">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => setIsSearchOpen(false)}
                    className="px-2 py-1 text-xs font-mono text-slate-400 bg-slate-200/60 rounded border border-slate-200"
                  >
                    ESC
                  </button>
                </div>

                {/* Filtered Search Results */}
                <div className="p-2 max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((opt) => {
                      const Icon = opt.icon;
                      return (
                        <Link
                          key={opt.name}
                          href={opt.href}
                          onClick={() => setIsSearchOpen(false)}
                          className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-semibold text-slate-900">{opt.name}</h4>
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 font-mono text-slate-600">
                                  {opt.badge}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500">{opt.description}</p>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
                        </Link>
                      );
                    })
                  ) : (
                    <div className="py-8 text-center text-xs text-slate-400">
                      No matching sections found for &quot;{searchQuery}&quot;
                    </div>
                  )}
                </div>

                <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between font-mono">
                  <span>Navigation Palette</span>
                  <span>Use ESC to close</span>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Frequently Asked Questions Modal Component with Accordions */}
        <AnimatePresence>
          {isFaqModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]"
              >
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/85">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                      <HelpCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">Frequently Asked Questions</h3>
                      <p className="text-xs text-slate-500">Platform Policies, Investment Process & Community Guidelines</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsFaqModalOpen(false)}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* FAQ Accordion Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {[
                    {
                      category: 'Platform Policies',
                      question: 'How does Futurenomix protect user data and privacy?',
                      answer: 'We employ enterprise-grade encryption (TLS 1.3 in transit and AES-256 at rest), strict role-based access control lists, and zero third-party data selling policies in full compliance with international data privacy regulations.'
                    },
                    {
                      category: 'Platform Policies',
                      question: 'What verification guidelines apply to businesses and startups?',
                      answer: 'All registered businesses, startups, and enterprises undergo rigorous automated and manual compliance checks, including business registration validation, executive identity confirmation, and domain verification.'
                    },
                    {
                      category: 'Investment Process',
                      question: 'How do startups submit pitch decks for capital review?',
                      answer: 'Startups can upload structured pitch decks through our secure funding portal. Verified angel investors, venture funds, and capital syndicates review proposals and financial models in real-time.'
                    },
                    {
                      category: 'Investment Process',
                      question: 'What is the typical timeline for capital facilitation?',
                      answer: 'Initial review and syndicate matching occur within 3 to 5 business days. Once matched, direct founder-investor pitch sessions and term sheet negotiations are coordinated securely through our portal.'
                    },
                    {
                      category: 'Community Guidelines',
                      question: 'What standards govern discussions in Hobnob?',
                      answer: 'We maintain a professional, respectful environment. Harassment, spam, unsolicited promotional outreach, and misleading financial claims are strictly prohibited and subject to immediate account moderation.'
                    },
                    {
                      category: 'Community Guidelines',
                      question: 'How can community violations or flagged content be reported?',
                      answer: 'Members can click the flag/report icon on any post, comment, or startup profile. Our moderation team reviews reports within 24 hours to ensure platform integrity.'
                    }
                  ].map((faq, index) => {
                    const isOpen = openFaqIndex === index;
                    return (
                      <div 
                        key={index}
                        className="border border-slate-200 rounded-2xl overflow-hidden transition-all bg-white shadow-2xs hover:border-slate-300"
                      >
                        <button
                          onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                          className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700 font-semibold uppercase">
                              {faq.category}
                            </span>
                            <span className="text-sm font-bold text-slate-900">{faq.question}</span>
                          </div>
                          <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isOpen && (
                          <div className="px-5 py-4 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-white">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Footer */}
                <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
                  <span>Need further assistance? Check our <Link href="/contact" onClick={() => setIsFaqModalOpen(false)} className="text-red-600 font-semibold hover:underline">Contact Directory</Link></span>
                  <button
                    onClick={() => setIsFaqModalOpen(false)}
                    className="px-4 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-black transition-colors"
                  >
                    Close FAQ
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Hero Left Aligned Statement */}
        <div className="flex-1 flex flex-col items-start justify-center text-left px-6 sm:px-12 max-w-4xl w-full z-20 py-12 pt-20 md:pt-[420px] pointer-events-auto my-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-relaxed sm:leading-normal drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] mb-6 max-w-[280px] xs:max-w-[320px] sm:max-w-2xl lg:max-w-3xl text-left md:ml-48"
          >
            <span className="italic font-serif text-red-500 font-normal underline decoration-red-500/70 underline-offset-8 inline-block mr-3 drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] drop-shadow-[0_0_24px_rgba(239,68,68,0.55)]">FUTURENOMIX</span> delivers the economic opportunities and strategic business development and partnerships — empowering visionaries to build legacy that is <span className="italic font-serif text-red-500 font-normal underline decoration-red-500/70 underline-offset-8 drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] drop-shadow-[0_0_24px_rgba(239,68,68,0.55)]">beyond remarkable</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm sm:text-lg font-mono text-white/95 font-medium tracking-widest uppercase mb-8 drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] max-w-[280px] xs:max-w-[320px] sm:max-w-2xl text-left md:ml-48"
          >
            For the future, never shaken. Always optimistic.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => {
              const element = document.getElementById('menu-sections');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="group self-center flex flex-col items-center gap-2 mt-16 sm:mt-24 md:mt-28 text-white/90 hover:text-white transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer drop-shadow-md z-30"
            aria-label="Scroll down to explore platform"
          >
            <span className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-white/90 group-hover:text-white transition-colors">
              Scroll Down
            </span>

            {/* Circular button with duration counting progress ring around it */}
            <div className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16">
              {/* Circular SVG Progress Ring */}
              <svg
                className="w-full h-full -rotate-90 pointer-events-none drop-shadow-md"
                viewBox="0 0 64 64"
              >
                {/* Background Ring Track */}
                <circle
                  cx="32"
                  cy="32"
                  r="27"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.2)"
                  strokeWidth="3"
                />
                {/* Animated Progress Ring in Red */}
                <circle
                  cx="32"
                  cy="32"
                  r="27"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  strokeDasharray={169.65}
                  strokeDashoffset={169.65 - (videoDurationState.progress / 100) * 169.65}
                  className="transition-[stroke-dashoffset] duration-200 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]"
                />
              </svg>

              {/* Central Button Body */}
              <div className="absolute inset-2 rounded-full bg-slate-950/70 hover:bg-slate-900/90 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all group-hover:border-white/50 shadow-xl group-hover:scale-105">
                <ChevronDown className="w-5 h-5 text-white animate-bounce group-hover:translate-y-0.5 transition-transform" />
              </div>
            </div>
          </motion.button>
        </div>

        {/* Dynamic Economic Infographic Hero Background Video (Dark & Light Modes) */}
        <HeroVideoBackground
          defaultTheme="dark"
          onTimeUpdate={(currentTime, duration, progress) => {
            setVideoDurationState({ currentTime, duration, progress });
          }}
        />





        {/* Lower Half Area (Hero background & geometric pattern overlay) */}
      </div>

      {/* Lower Directory Section - Pearl & Marble Classy UI */}
      <section id="menu-sections" className="relative w-full bg-pearl-gradient bg-marble-light dark:bg-marble-dark text-[#151A22] dark:text-[#f3f0e6] border-t border-[#151A22]/10 dark:border-[#f3f0e6]/10 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {/* Mobile Welcome Header */}
          <div className="md:hidden mb-8 text-center">
             <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Welcome to futurenomix</h2>
             <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium italic">Delivering economic opportunities & strategic partnerships</p>
          </div>

          {/* Mobile Menu Cards - Restored for mobile users */}
          <div className="grid grid-cols-1 md:hidden gap-6 sm:gap-8 mb-16">
            {menuOptions.map((option) => {
              const Icon = option.icon;
              const isHomeFeed = option.name === 'Hobnob';
              const isPortfolio = option.name === 'Portfolio';
              const isJobs = option.name === 'Jobs';
              const isProjects = option.name === 'Projects';
              const isFunding = option.name === 'Funding';
              const isBusiness = option.name === 'Businesses';
              const isCommunities = option.name === 'Communities';
              const customBgImage = isHomeFeed
                ? homeFeedBackgroundImage
                : isPortfolio
                  ? historicBankBg
                  : isJobs 
                    ? jobsBackgroundImage 
                    : isProjects 
                      ? projectsBackgroundImage 
                      : isFunding 
                        ? fundingBackgroundImage 
                        : isBusiness
                          ? businessBackgroundImage
                          : isCommunities
                            ? communitiesBackgroundImage
                            : menuBackgroundImage;
              return (
                <Link
                  key={option.href}
                  id={`card-${option.name.toLowerCase()}`}
                  href={option.href}
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      sessionStorage.setItem('return_card', `card-${option.name.toLowerCase()}`);
                    }
                  }}
                  className="group relative flex flex-col rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_12px_24px_rgba(0,0,0,0.4)] hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-1 overflow-hidden transition-all duration-200"
                >
                  {/* Flat Design 2.0 Picture Cover above text */}
                  {customBgImage && (
                    <div className="relative w-full h-48 sm:h-52 overflow-hidden bg-slate-100 dark:bg-slate-800 border-b border-slate-200/60 dark:border-slate-800">
                      <Image
                        src={customBgImage}
                        alt={`${option.name} preview`}
                        fill
                        placeholder="blur"
                        className="object-cover transition-transform duration-300 group-hover:scale-103"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-slate-950/5 dark:bg-slate-950/20" />
                      <div className="absolute top-3.5 right-3.5 z-10">
                        <span className="text-[11px] px-2.5 py-1 rounded-full font-bold bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs border border-slate-800/20 dark:border-slate-200/20">
                          {option.badge}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Flat Design 2.0 Content Section */}
                  <div className="p-6 flex-1 flex flex-col justify-between gap-5 text-slate-900 dark:text-white">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 group-hover:bg-red-600 group-hover:text-white transition-colors duration-200 shadow-2xs">
                          <Icon className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-lg sm:text-xl text-slate-900 dark:text-white tracking-tight group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors inline-flex items-center gap-2">
                          <span>{option.name}</span>
                        </h3>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                        {option.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-bold text-red-600 dark:text-red-400 group-hover:translate-x-1 transition-transform pt-4 border-t border-slate-100 dark:border-slate-800">
                      <span>Go to {option.name}</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Minimalist Welcome Header */}
          <div className="mb-10 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/60 dark:border-slate-800 pb-6">

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mt-2">About us</h2>
            </div>
          </div>

          {/* About Core Pillars Grid - Pearl & Marble Classy Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 mt-8">
            <div className="bg-white/90 dark:bg-[#151A22]/90 backdrop-blur-md rounded-2xl p-7 marble-card-border shadow-lg hover:shadow-xl transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-5">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#151A22] dark:text-[#f3f0e6] mb-2">Our Mission</h3>
              <p className="text-sm text-[#151A22]/75 dark:text-[#f3f0e6]/75 leading-relaxed">
                At Futurenomix, we are deeply dedicated to the democratization of global financial and professional empowerment, steadfastly bridging the critical gap between innovative, high-potential founders within burgeoning emerging technology ecosystems and world-class capital partners, high-growth career opportunities, and the essential, foundational strategic business development resources required to scale ventures successfully to a global stage.
              </p>
            </div>

            <div className="bg-white/90 dark:bg-[#151A22]/90 backdrop-blur-md rounded-2xl p-7 marble-card-border shadow-lg hover:shadow-xl transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#151A22]/10 dark:bg-[#f3f0e6]/10 text-[#151A22] dark:text-[#f3f0e6] flex items-center justify-center mb-5">
                <Globe2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#151A22] dark:text-[#f3f0e6] mb-2">Global Network</h3>
              <p className="text-sm text-[#151A22]/75 dark:text-[#f3f0e6]/75 leading-relaxed">
                We actively cultivate a high-velocity, interconnected, and real-time digital ecosystem that seamlessly interlinks vibrant technology hubs, strategically spanning from Johannesburg and Cape Town to established international powerhouses like London, Silicon Valley, and Singapore, thereby enabling fluid, frictionless, and impactful collaboration across international borders for founders, investors, and professionals alike.
              </p>
            </div>

            <div className="bg-white/90 dark:bg-[#151A22]/90 backdrop-blur-md rounded-2xl p-7 marble-card-border shadow-lg hover:shadow-xl transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#151A22] dark:text-[#f3f0e6] mb-2">Trust &amp; Verifiability</h3>
              <p className="text-sm text-[#151A22]/75 dark:text-[#f3f0e6]/75 leading-relaxed">
                Our platform enforces the highest standards of rigorous integrity by seamlessly integrating sophisticated, automated compliance verifications, comprehensive and authenticated investor accreditation processes, and standardized, secure pitch-sharing protocols, collectively creating an immutable bedrock of absolute trust between ambitious, forward-thinking founders and sophisticated, risk-aware capital allocators.
              </p>
            </div>
          </div>

          {/* Key Impact Metrics - Classy Marble & Pearl Box */}
          <div className="bg-[#151A22] bg-marble-dark text-[#f3f0e6] rounded-3xl p-8 sm:p-10 marble-card-border shadow-2xl grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-black text-[#f3f0e6]">{stats.businessesCount}</div>
              <div className="text-xs font-semibold text-[#f3f0e6]/60 uppercase tracking-wider mt-2">Active Businesses</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-amber-400">{stats.capitalFormatted}</div>
              <div className="text-xs font-semibold text-[#f3f0e6]/60 uppercase tracking-wider mt-2">Capital Facilitated</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-[#f3f0e6]">{stats.jobsCount}</div>
              <div className="text-xs font-semibold text-[#f3f0e6]/60 uppercase tracking-wider mt-2">Jobs Posted</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-[#f3f0e6]">{stats.citiesCount}</div>
              <div className="text-xs font-semibold text-[#f3f0e6]/60 uppercase tracking-wider mt-2">Global Cities</div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
