'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { getEcosystemStats, DEFAULT_STATS, EcosystemStats } from '@/lib/ecosystem-metrics';
import {
  ArrowLeft,
  LayoutDashboard,
  Briefcase,
  Landmark,
  Building2,
  TrendingUp,
  Sparkles,
  ChevronRight,
  FolderOpen,
  ArrowRight
} from 'lucide-react';

interface JobApplication {
  id: string;
  role: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  appliedDate: string;
  status: 'Under Review' | 'Interview Scheduled' | 'Shortlisted' | 'Offer Extended';
  matchScore: number;
}

interface FundingProposal {
  id: string;
  startupName: string;
  fundName: string;
  ticketRequested: string;
  stage: string;
  submittedDate: string;
  status: 'In Review' | 'Due Diligence' | 'Term Sheet Drafting' | 'Approved';
  pitchDeckName: string;
}

interface BusinessConnection {
  id: string;
  companyName: string;
  opportunityTitle: string;
  type: 'Supplier' | 'B2B Demand' | 'Strategic Partnership';
  location: string;
  connectedDate: string;
  status: 'Connected' | 'Proposal Sent' | 'In Negotiations';
  contactPerson: string;
}

export default function PortfolioPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'jobs' | 'funding' | 'businesses'>('all');
  const [stats, setStats] = useState<EcosystemStats>(DEFAULT_STATS);
  const [liveTime, setLiveTime] = useState<string>('');

  // Controlled empty states to fulfill the user request to remove all portfolio items
  const [jobs] = useState<JobApplication[]>([]);
  const [funding] = useState<FundingProposal[]>([]);
  const [businesses] = useState<BusinessConnection[]>([]);

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
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-background text-foreground pb-20 pt-14">
      {/* Top Navigation Header Bar */}
      <div className="border-b border-border bg-card/80 backdrop-blur-md fixed top-0 left-0 right-0 z-40 w-full h-14 flex items-center px-3 sm:px-4">
        <div className="max-w-[400px] mx-auto w-full flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <Link
              href="/?card=portfolio#card-portfolio"
              className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground transition-colors border border-border shadow-2xs shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                <LayoutDashboard className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h1 className="text-base font-display font-bold leading-none truncate">Portfolio Overview</h1>
                <p className="text-[10px] text-muted-foreground mt-0.5 truncate">Executive dashboard & activity</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <Link
              href="/businesses"
              className="px-2.5 py-1.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-[11px] font-semibold transition-colors flex items-center gap-1 shadow-2xs"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Businesses</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Executive Summary Banner */}
      <div className="max-w-[400px] mx-auto px-3 sm:px-4 pt-5">
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-4 sm:p-5 rounded-3xl border border-primary/20 relative overflow-hidden">
          <div className="relative z-10 flex flex-col gap-4">
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-display font-bold tracking-tight text-foreground">
                Your Executive Activity Hub
              </h2>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-2 w-full shrink-0">
              <div className="bg-card/90 backdrop-blur-md p-3 rounded-2xl border border-border text-center shadow-xs min-w-0">
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 mx-auto mb-1 flex items-center justify-center">
                  <Briefcase className="w-3.5 h-3.5" />
                </div>
                <span className="block text-lg font-extrabold text-foreground">{jobs.length}</span>
                <span className="text-[10px] text-muted-foreground font-medium block truncate">Active Applications</span>
              </div>

              <div className="bg-card/90 backdrop-blur-md p-3 rounded-2xl border border-border text-center shadow-xs min-w-0">
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 mx-auto mb-1 flex items-center justify-center">
                  <Landmark className="w-3.5 h-3.5" />
                </div>
                <span className="block text-lg font-extrabold text-foreground">R0</span>
                <span className="text-[10px] text-muted-foreground font-medium block truncate">Pitch Capital</span>
              </div>

              <div className="bg-card/90 backdrop-blur-md p-3 rounded-2xl border border-border text-center shadow-xs min-w-0">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto mb-1 flex items-center justify-center">
                  <Building2 className="w-3.5 h-3.5" />
                </div>
                <span className="block text-lg font-extrabold text-foreground">{businesses.length}</span>
                <span className="text-[10px] text-muted-foreground font-medium block truncate">Connected B2B</span>
              </div>

              <div className="bg-card/90 backdrop-blur-md p-3 rounded-2xl border border-border text-center shadow-xs min-w-0">
                <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 mx-auto mb-1 flex items-center justify-center">
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
                <span className="block text-lg font-extrabold text-muted-foreground">0%</span>
                <span className="text-[10px] text-muted-foreground font-medium block truncate">Profile Score</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-5 flex items-center gap-1.5 border-b border-border pb-2.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All', icon: null },
            { id: 'jobs', label: `Jobs (${jobs.length})`, icon: Briefcase },
            { id: 'funding', label: `Funding (${funding.length})`, icon: Landmark },
            { id: 'businesses', label: `Biz (${businesses.length})`, icon: Building2 }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-2xs'
                    : 'bg-secondary hover:bg-secondary/80 text-foreground border border-border'
                }`}
              >
                {Icon && <Icon className="w-3 h-3" />}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[400px] mx-auto px-3 sm:px-4 mt-5 space-y-8">
        
        {/* Universal Empty State Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card border border-border rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-sm"
        >
          <div className="w-16 h-16 rounded-full bg-secondary text-muted-foreground mx-auto flex items-center justify-center border border-border">
            <FolderOpen className="w-8 h-8" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-foreground">Your Portfolio is Empty</h3>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">
              You currently have no active applications, investments, or strategic B2B connections logged. Explore the platform below to begin building your professional portfolio.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/jobs"
              className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-2"
            >
              <span>Explore Active Jobs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/funding"
              className="w-full py-2.5 rounded-xl bg-secondary hover:bg-secondary/85 text-foreground text-xs font-semibold transition-all border border-border flex items-center justify-center gap-2"
            >
              <span>Browse Funding Marketplace</span>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
            </Link>
            <Link
              href="/businesses"
              className="w-full py-2.5 rounded-xl bg-secondary hover:bg-secondary/85 text-foreground text-xs font-semibold transition-all border border-border flex items-center justify-center gap-2"
            >
              <span>Connect with Businesses</span>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
