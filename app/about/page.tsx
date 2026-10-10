"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getEcosystemStats, DEFAULT_STATS, EcosystemStats } from '@/lib/ecosystem-metrics';
import { 
  Building2, 
  Globe2, 
  Users, 
  ShieldCheck, 
  Sparkles, 
  ArrowLeft,
  Briefcase,
  Target,
  Award,
  Zap,
  Globe,
  PhoneCall
} from 'lucide-react';
import { motion } from 'motion/react';

export default function AboutUsPage() {
  const [stats, setStats] = useState<EcosystemStats>(DEFAULT_STATS);
  const [liveTime, setLiveTime] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      setStats(getEcosystemStats());
      const now = new Date();
      setLiveTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-20 selection:bg-red-500/30 selection:text-red-900 dark:selection:text-red-100">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between transition-colors">
        <div className="flex items-center gap-3">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Home</span>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M 25 25 L 47.5 25 L 42.5 35 L 37.5 35 L 41.5 43 L 47.5 43 L 45.5 51 L 50 75 Z" className="fill-slate-900 dark:fill-white" />
              <path d="M 52.5 25 L 75 25 L 58 59 L 50 59 L 61 37 L 52.5 37 Z" fill="#ef4444" />
            </svg>
          </div>
          <span className="font-display font-bold text-xl text-slate-900 dark:text-white tracking-tighter">futurenomix</span>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative bg-slate-950 text-white py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-slate-900/50 via-transparent to-slate-950" />
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 text-[10px] font-bold uppercase tracking-[0.2em] mb-8"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Visionary Protocol</span>
          </motion.div>
          
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tighter mb-8 leading-[0.9] text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/40">
            Beyond Remarkable <br className="hidden sm:block" /> Legacy Architecture.
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
            Futurenomix is the definitive economic protocol connecting high-growth startups, institutional capital, and professional visionaries through a high-performance strategic ecosystem.
          </p>
        </div>
      </div>

      {/* Mission Statement Block */}
      <div className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              The Mission for <br /> Ecosystem Clarity.
            </h2>
            <div className="space-y-6 text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
              <p>
                In a fragmented global economy, Futurenomix serves as the unified coordination layer. We provide the infrastructure for <span className="text-slate-900 dark:text-white font-semibold">capital clarity</span>, strategic alignment, and frictionless opportunity discovery.
              </p>
              <p>
                Our commitment is to eliminate the barriers between visionary talent and the resources required to build sustainable, scalable, and impactful economic legacies.
              </p>
            </div>
            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-white dark:border-slate-950 bg-slate-200 dark:bg-slate-800 overflow-hidden shadow-xl">
                    <img src={`https://i.pravatar.cc/100?u=${i}`} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                ))}
                <div className="w-12 h-12 rounded-full border-4 border-white dark:border-slate-950 bg-red-600 flex items-center justify-center text-[10px] font-bold text-white shadow-xl">
                  +2.4k
                </div>
              </div>
              <p className="text-xs font-mono text-slate-500 uppercase tracking-widest leading-none">
                Verified Visionaries <br /> Scaling Right Now
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-8 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] space-y-4 hover:bg-white dark:hover:bg-slate-900 transition-all duration-300">
              <Target className="w-8 h-8 text-red-500" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Strategic Intent</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Precision-engineered discovery for high-value partnerships.</p>
            </div>
            <div className="p-8 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] space-y-4 mt-8 sm:mt-12 hover:bg-white dark:hover:bg-slate-900 transition-all duration-300">
              <Globe2 className="w-8 h-8 text-blue-500" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Global Reach</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Unified hubs across every major strategic economic zone.</p>
            </div>
          </div>
        </div>
      </div>

      {/* High-Contrast Metrics Section */}
      <div className="bg-slate-950 py-24 mb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-20">
            {[
              { label: 'Active Entities', value: stats.businessesCount, icon: Building2 },
              { label: 'Facilitated Capital', value: stats.capitalFormatted, icon: Zap },
              { label: 'Open Opportunities', value: stats.jobsCount, icon: Briefcase },
              { label: 'Economic Hubs', value: stats.citiesCount, icon: Globe }
            ].map((metric, i) => (
              <div key={i} className="group flex flex-col items-center lg:items-start space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                  <metric.icon className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <div className="text-4xl sm:text-5xl font-black text-white tracking-tighter mb-1">{metric.value}</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{metric.label}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-20 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Protocol synchronized at {liveTime}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">Network Status: <span className="text-emerald-500">Operational</span></span>
              <div className="h-4 w-px bg-white/10" />
              <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">Nodes: 128 Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Final Navigation Bridge */}
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-8 tracking-tight">Access the Protocol.</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link 
            href="/feed"
            className="flex flex-col items-center p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] hover:border-red-500 dark:hover:border-red-500 transition-all group"
          >
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 group-hover:bg-red-500 group-hover:text-white transition-colors">
              <Users className="w-6 h-6" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white mb-1">Hobnob Feed</span>
            <span className="text-xs text-slate-500">Engage with the visionary community.</span>
          </Link>
          <Link 
            href="/contact"
            className="flex flex-col items-center p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] hover:border-blue-500 dark:hover:border-blue-500 transition-all group"
          >
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 group-hover:bg-blue-500 group-hover:text-white transition-colors">
              <PhoneCall className="w-6 h-6" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white mb-1">Support Portal</span>
            <span className="text-xs text-slate-500">Strategic multi-region directory.</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
