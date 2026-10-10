'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Building, 
  User, 
  Target, 
  Award, 
  TrendingUp, 
  Users, 
  MapPin, 
  Briefcase, 
  Layers, 
  Globe,
  Rocket,
  Shield,
  Search,
  BookOpen,
  DollarSign
} from 'lucide-react';

type AccountType = 'personal' | 'business';

export default function OnboardingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Set account type based on query parameter or fallback to personal
  const [accountType, setAccountType] = useState<AccountType>('personal');
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Sync with query param on mount
  useEffect(() => {
    const typeParam = searchParams.get('type');
    if (typeParam === 'business') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAccountType('business');
    } else {
       
      setAccountType('personal');
    }
  }, [searchParams]);

  // Personal Form States
  const [personalName, setPersonalName] = useState('');
  const [personalRole, setPersonalRole] = useState('');
  const [personalTitle, setPersonalTitle] = useState('');
  const [personalLocation, setPersonalLocation] = useState('');
  const [personalSkills, setPersonalSkills] = useState<string[]>([]);
  const [personalProject, setPersonalProject] = useState('');
  const [personalObjective, setPersonalObjective] = useState('');
  const [personalCommitment, setPersonalCommitment] = useState('');

  // Business Form States
  const [businessName, setBusinessName] = useState('');
  const [businessIndustry, setBusinessIndustry] = useState('');
  const [businessStage, setBusinessStage] = useState('');
  const [businessSize, setBusinessSize] = useState('');
  const [businessLocation, setBusinessLocation] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [businessNeed, setBusinessNeed] = useState('');
  const [businessTargetPartner, setBusinessTargetPartner] = useState('');

  // Predefined Chip Options for Personal Flow
  const PERSONAL_ROLES = [
    { id: 'founder', label: 'Founder & CEO', desc: 'Building a startup from scratch' },
    { id: 'developer', label: 'Software Engineer / Architect', desc: 'Engineering technical backends and frontends' },
    { id: 'designer', label: 'Product Designer / UX Lead', desc: 'Crafting fluid and beautiful interfaces' },
    { id: 'marketing', label: 'Marketing & Communications', desc: 'Brand strategy, content, and PR' },
    { id: 'sales', label: 'Sales & Business Development', desc: 'Strategic partnerships and revenue growth' },
    { id: 'ops', label: 'Operations & Logistics', desc: 'Streamlining processes and supply chains' },
    { id: 'hr', label: 'Human Resources & People', desc: 'Talent acquisition and culture building' },
    { id: 'legal', label: 'Legal & Compliance', desc: 'Corporate law, contracts, and regulations' },
    { id: 'finance', label: 'Finance & Accounting', desc: 'Financial planning, audits, and investments' },
    { id: 'support', label: 'Customer Success & Support', desc: 'Managing client relationships and satisfaction' },
    { id: 'researcher', label: 'ML / AI Researcher', desc: 'Developing neural networks and models' },
    { id: 'investor', label: 'Venture Capitalist / Angel', desc: 'Investing early-stage seed/growth capital' },
  ];

  const PERSONAL_SKILLS_POOL = [
    'React & Next.js', 'Go / Rust Backend', 'Deep Reinforcement Learning', 
    'PyTorch / JAX', 'SaaS Financial Modeling', 'Seed-Stage Fundraising', 
    'GTM Launch Frameworks', 'Product Strategy', 'Clean Tech Accounting', 
    'Kubernetes & MLOps', 'API Architecture', 'Venture Capital Due Diligence',
    'Content Strategy', 'SEO & SEM', 'Public Relations', 'B2B Sales',
    'Supply Chain Optimization', 'HR Strategy', 'Corporate Law', 'Financial Analysis',
    'Customer Relationship Management', 'Agile Project Management', 'Data Analysis'
  ];

  const PERSONAL_OBJECTIVES = [
    { id: 'cofounder', label: 'Find a Technical Co-founder', desc: 'Team up with a lead architect or builder' },
    { id: 'funding', label: 'Raise Seed / Pre-Seed Capital', desc: 'Connect with active sustainability and AI investors' },
    { id: 'hiring', label: 'Hire Exceptional Engineering Talent', desc: 'Grow your early founding team' },
    { id: 'discover', label: 'Discover High-Growth Startups', desc: 'Explore promising ventures to join or invest in' },
    { id: 'peer', label: 'Join Peer-to-Peer Advisor Group', desc: 'Exchange pitch decks, templates, and tech playbooks' }
  ];

  const COMMITMENT_STYLES = [
    'Full-Time Co-founder',
    'Part-Time / Side-Hustle',
    'Technical Advisory / Board Role',
    'Contract / Project-Based Freelance',
    'Strategic Partner / Investor'
  ];

  // Predefined Chip Options for Business Flow
  const BUSINESS_INDUSTRIES = [
    { id: 'cleantech', label: 'Clean Tech & Sustainability', desc: 'Carbon accounting, solar infrastructure, satellite telemetry' },
    { id: 'ai_ml', label: 'AI & Machine Learning Software', desc: 'NLP, transformers, reinforcement learning pipelines' },
    { id: 'logistics', label: 'Logistics & Autonomous Systems', desc: 'Fleet routing, drone delivery, smart warehousing' },
    { id: 'fintech', label: 'Fintech & SaaS Infrastructure', desc: 'Payment gateways, DeFi protocols, banking integrations' },
    { id: 'devtools', label: 'Developer Tools & Cloud', desc: 'Hosting systems, frameworks, MLOps platforms' }
  ];

  const BUSINESS_STAGES = [
    'Bootstrapped / Pre-Seed',
    'Seed Stage (Raised R500k - R2M)',
    'Series A / B Venture Backed',
    'Growth Stage / Scale-up',
    'Established Enterprise / Corporate'
  ];

  const BUSINESS_SIZES = [
    'Solo Founder (1)',
    'Small Founding Team (2-10)',
    'Scaling Startup (11-50)',
    'Mid-Market Growth (51-200)',
    'Enterprise / Corporate (200+)'
  ];

  const BUSINESS_NEEDS = [
    { id: 'backend', label: 'Lead Backend Architect', desc: 'Scaling high-throughput Go/Rust distributed servers' },
    { id: 'cofounder', label: 'Technical Co-founder', desc: 'ML/AI specialized product partner' },
    { id: 'designer', label: 'Product Designer', desc: 'Crafting premium interactive workspaces' },
    { id: 'funding', label: 'Venture Capital Funding', desc: 'Securing early seed check commitments' },
    { id: 'advisory', label: 'Strategic GTM Advisor', desc: 'Venture scaling and enterprise sales' }
  ];

  const toggleSkill = (skill: string) => {
    if (personalSkills.includes(skill)) {
      setPersonalSkills(personalSkills.filter(s => s !== skill));
    } else {
      setPersonalSkills([...personalSkills, skill]);
    }
  };

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Simulate API submission & processing
    setTimeout(() => {
      setIsSubmitting(false);
      setIsCompleted(true);
      
      const responses = accountType === 'personal' ? {
        accountType: 'personal',
        name: personalName,
        role: personalRole,
        title: personalTitle,
        location: personalLocation,
        skills: personalSkills,
        project: personalProject,
        objective: personalObjective,
        commitment: personalCommitment,
        timestamp: new Date().toISOString()
      } : {
        accountType: 'business',
        name: businessName,
        industry: businessIndustry,
        stage: businessStage,
        size: businessSize,
        location: businessLocation,
        description: businessDescription,
        need: businessNeed,
        targetPartner: businessTargetPartner,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem('orbit_onboarding_responses', JSON.stringify(responses));
      localStorage.setItem('orbit_onboarding_complete', 'true');
      
      // Manage multi-account switcher data
      let existingAccounts: any[] = [];
      try {
        const storedAccounts = localStorage.getItem('orbit_accounts');
        if (storedAccounts) existingAccounts = JSON.parse(storedAccounts);
      } catch(e) {}
      
      const newName = accountType === 'personal' ? personalName : businessName;
      const newUsername = newName.toLowerCase().replace(/[^a-z0-9]/g, '');
      const newId = `${accountType}-${Date.now()}`;
      
      existingAccounts.push({
        id: newId,
        name: newName,
        username: newUsername,
        type: accountType,
        avatarUrl: `https://dummyimage.com/100x100/1e293b/ffffff?text=%24%7BnewUsername%7D`
      });
      
      // Auto-integrate/link personal and business accounts if created by same user
      try {
        if (accountType === 'business') {
          const personalAcc = existingAccounts.find(acc => acc.type === 'personal');
          if (personalAcc) {
            localStorage.setItem(`orbit_linked_account_${newId}`, personalAcc.id);
            localStorage.setItem(`orbit_linked_account_${personalAcc.id}`, newId);
          }
        } else if (accountType === 'personal') {
          const businessAcc = existingAccounts.find(acc => acc.type === 'business');
          if (businessAcc) {
            localStorage.setItem(`orbit_linked_account_${newId}`, businessAcc.id);
            localStorage.setItem(`orbit_linked_account_${businessAcc.id}`, newId);
          }
        }
      } catch (e) {
        console.error('Failed to auto-link accounts', e);
      }
      
      localStorage.setItem('orbit_accounts', JSON.stringify(existingAccounts));
      localStorage.setItem('orbit_active_account_id', newId);
      
      // Update local storage user profile parameters
      let savedName = newName;
      let savedEmail = `${newUsername}@example.com`;
      let savedUsername = newUsername;

      if (accountType === 'personal') {
        const userProfile = {
          name: savedName,
          email: savedEmail,
          username: savedUsername,
          role: personalTitle || 'Founder & Developer',
          company: 'Orbit Open Source',
          location: personalLocation || 'San Francisco, CA',
          skills: personalSkills.length > 0 ? personalSkills : ['React', 'Next.js', 'Tailwind', 'Product Design'],
          bio: personalProject || 'Passionate about building scalable digital products that solve real-world problems.',
          avatarUrl: `https://dummyimage.com/200x200/1e293b/ffffff?text=%24%7BsavedUsername%7D`
        };
        localStorage.setItem('orbit_user_profile', JSON.stringify(userProfile));
        localStorage.setItem(`orbit_user_profile_${newId}`, JSON.stringify(userProfile));
      } else {
        const userProfile = {
          name: savedName,
          email: savedEmail,
          username: savedUsername,
          role: 'Business Account',
          company: businessName,
          location: businessLocation,
          skills: [businessIndustry],
          bio: businessDescription,
          avatarUrl: `https://dummyimage.com/200x200/1e293b/ffffff?text=%24%7BsavedUsername%7D`
        };
        localStorage.setItem('orbit_user_profile', JSON.stringify(userProfile));
        localStorage.setItem(`orbit_user_profile_${newId}`, JSON.stringify(userProfile));
      }

      localStorage.setItem('orbit_is_logged_in', 'true');
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('orbit-auth-change'));
    }, 2000);
  };

  const handleComplete = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('orbit_is_logged_in', 'true');
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('orbit-auth-change'));
    }
    router.push('/');
  };

  // Check step validation
  const isStepValid = () => {
    if (accountType === 'personal') {
      if (step === 1) return personalName.trim() !== '' && personalRole !== '' && personalTitle.trim() !== '' && personalLocation.trim() !== '';
      if (step === 2) return personalSkills.length > 0 && personalProject.trim() !== '';
      if (step === 3) return personalObjective !== '' && personalCommitment !== '';
    } else {
      if (step === 1) return businessName.trim() !== '' && businessIndustry !== '' && businessStage !== '';
      if (step === 2) return businessSize !== '' && businessLocation.trim() !== '' && businessDescription.trim() !== '';
      if (step === 3) return businessNeed !== '' && businessTargetPartner.trim() !== '';
    }
    return false;
  };

  return (
    <div id="onboarding-page-container" className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      
      {/* Upper Brand Badge */}
      <div className="mb-6 flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center shadow-md mb-2">
          <span className="text-white dark:text-zinc-950 font-display font-black text-xl leading-none mt-0.5">o</span>
        </div>
        <div className="text-xs tracking-[0.3em] font-black uppercase text-zinc-400 dark:text-zinc-500">orbit network</div>
      </div>

      {/* Main card box */}
      <div 
        id="onboarding-wizard-card" 
        className="w-full max-w-2xl bg-white dark:bg-zinc-900/80 border border-zinc-200/60 dark:border-zinc-800/80 rounded-2xl shadow-xl overflow-hidden relative"
      >
        <AnimatePresence mode="wait">
          {!isCompleted ? (
            <motion.div 
              key="wizard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="p-6 sm:p-8 flex flex-col"
            >
              
              {/* Account Type Selector Button row - Only visible in Step 1 */}
              {step === 1 && (
                <div className="mb-6">
                  <div className="text-xs font-bold tracking-wider text-zinc-400 uppercase mb-2.5">Select Account Category</div>
                  <div className="grid grid-cols-2 gap-3 p-1 bg-zinc-100 dark:bg-zinc-800/50 rounded-xl border border-zinc-200/20">
                    <button
                      id="onboarding-select-personal-btn"
                      onClick={() => {
                        setAccountType('personal');
                        setStep(1);
                      }}
                      className={`py-3 px-4 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                        accountType === 'personal'
                          ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-sm'
                          : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
                      }`}
                    >
                      <User className="w-4 h-4" />
                      <span>Personal Creator</span>
                    </button>
                    <button
                      id="onboarding-select-business-btn"
                      onClick={() => {
                        setAccountType('business');
                        setStep(1);
                      }}
                      className={`py-3 px-4 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                        accountType === 'business'
                          ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-sm'
                          : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
                      }`}
                    >
                      <Building className="w-4 h-4" />
                      <span>Business & Startup</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Progress Stepper bar */}
              <div className="flex items-center gap-2.5 mb-8">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex-1 flex flex-col gap-1.5">
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        s <= step 
                          ? 'bg-zinc-900 dark:bg-zinc-100' 
                          : 'bg-zinc-200 dark:bg-zinc-800'
                      }`} 
                    />
                    <span className={`text-[9px] font-black tracking-widest uppercase ${
                      s === step 
                        ? 'text-zinc-900 dark:text-zinc-100' 
                        : 'text-zinc-400 dark:text-zinc-600'
                    }`}>
                      Step 0{s}
                    </span>
                  </div>
                ))}
              </div>

              {/* Step Header */}
              <div className="mb-6">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold text-zinc-600 dark:text-zinc-400 mb-2">
                  {accountType === 'personal' ? (
                    <>
                      <User className="w-3 h-3 text-zinc-500" />
                      <span>Personal Creator Account Questionnaire</span>
                    </>
                  ) : (
                    <>
                      <Building className="w-3 h-3 text-zinc-500" />
                      <span>Business Account Questionnaire</span>
                    </>
                  )}
                </span>
                <h2 className="text-xl sm:text-2xl font-display font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
                  {accountType === 'personal' ? (
                    step === 1 ? 'Define Your Professional Persona' :
                    step === 2 ? 'Share Your Capabilities & Core Project' :
                    'Identify Your Goals & Commitment Model'
                  ) : (
                    step === 1 ? 'Configure Your Corporate Identity' :
                    step === 2 ? 'Establish Your Operating Scale' :
                    'Detail Your Hiring & Funding Goals'
                  )}
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  We leverage these data points to align your Orbit recommendation algorithms.
                </p>
              </div>

              {/* Questionnaire Form Content */}
              <div className="min-h-[280px] flex flex-col justify-between">
                
                {/* PERSONAL ACCOUNT STEPS */}
                {accountType === 'personal' && (
                  <div>
                    {/* PERSONAL STEP 1 */}
                    {step === 1 && (
                      <div className="space-y-4 animate-in fade-in duration-300">
                        <div className="space-y-1.5">
                          <label htmlFor="p-name" className="text-xs font-bold tracking-wider text-zinc-400 uppercase">Your Full Name</label>
                          <input
                            id="p-name"
                            type="text"
                            value={personalName}
                            onChange={(e) => setPersonalName(e.target.value)}
                            placeholder="e.g. Alex Rivera"
                            className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold tracking-wider text-zinc-400 uppercase">Core Persona Type</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {PERSONAL_ROLES.map((r) => (
                              <button
                                key={r.id}
                                onClick={() => setPersonalRole(r.id)}
                                className={`p-3 rounded-xl border text-left transition-all ${
                                  personalRole === r.id
                                    ? 'bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-950 shadow-md'
                                    : 'bg-zinc-50 dark:bg-zinc-900/40 border-zinc-200/60 dark:border-zinc-800/60 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-800 dark:text-zinc-200'
                                }`}
                              >
                                <div className="text-xs font-bold">{r.label}</div>
                                <div className={`text-[10px] mt-0.5 ${personalRole === r.id ? 'text-zinc-300 dark:text-zinc-700' : 'text-zinc-400 dark:text-zinc-500'}`}>{r.desc}</div>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                          <div className="space-y-1.5">
                            <label htmlFor="p-title" className="text-xs font-bold tracking-wider text-zinc-400 uppercase">Current Job Title</label>
                            <input
                              id="p-title"
                              type="text"
                              value={personalTitle}
                              onChange={(e) => setPersonalTitle(e.target.value)}
                              placeholder="e.g. Senior Backend Architect"
                              className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label htmlFor="p-loc" className="text-xs font-bold tracking-wider text-zinc-400 uppercase">Base Location</label>
                            <div className="relative">
                              <MapPin className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-zinc-400" />
                              <input
                                id="p-loc"
                                type="text"
                                value={personalLocation}
                                onChange={(e) => setPersonalLocation(e.target.value)}
                                placeholder="e.g. San Francisco, CA / Remote"
                                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* PERSONAL STEP 2 */}
                    {step === 2 && (
                      <div className="space-y-4 animate-in fade-in duration-300">
                        <div className="space-y-2">
                          <label className="text-xs font-bold tracking-wider text-zinc-400 uppercase flex justify-between">
                            <span>Key Capabilities (Select at least 1)</span>
                            <span className="text-[10px] text-zinc-400 font-medium lowercase">{personalSkills.length} selected</span>
                          </label>
                          <div className="flex flex-wrap gap-2 max-h-[140px] overflow-y-auto p-1 border border-zinc-100 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/20">
                            {PERSONAL_SKILLS_POOL.map((skill) => {
                              const isSelected = personalSkills.includes(skill);
                              return (
                                <button
                                  key={skill}
                                  onClick={() => toggleSkill(skill)}
                                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                                    isSelected 
                                      ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 border-zinc-900 dark:border-zinc-100 shadow-sm'
                                      : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                                  }`}
                                >
                                  {skill}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="space-y-1.5 pt-2">
                          <label htmlFor="p-proj" className="text-xs font-bold tracking-wider text-zinc-400 uppercase">Tell Us About a Dream Project or Recent Major Milestone</label>
                          <textarea
                            id="p-proj"
                            rows={3}
                            value={personalProject}
                            onChange={(e) => setPersonalProject(e.target.value)}
                            placeholder="e.g. Developed and scaled deep routing algorithms responsible for enterprise Google Maps APIs, looking to apply machine learning to autonomous drone logistics networks."
                            maxLength={350}
                            className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 resize-none"
                          />
                          <div className="text-[10px] text-zinc-400 text-right">{personalProject.length}/350 characters</div>
                        </div>
                      </div>
                    )}

                    {/* PERSONAL STEP 3 */}
                    {step === 3 && (
                      <div className="space-y-4 animate-in fade-in duration-300">
                        <div className="space-y-2">
                          <label className="text-xs font-bold tracking-wider text-zinc-400 uppercase">Primary Platform Objective</label>
                          <div className="space-y-2">
                            {PERSONAL_OBJECTIVES.map((o) => (
                              <button
                                key={o.id}
                                onClick={() => setPersonalObjective(o.id)}
                                className={`w-full p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                                  personalObjective === o.id
                                    ? 'bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-950 shadow-md'
                                    : 'bg-zinc-50 dark:bg-zinc-900/40 border-zinc-200/60 dark:border-zinc-800/60 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-800 dark:text-zinc-200'
                                }`}
                              >
                                <div className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shrink-0 mt-0.5">
                                  <Target className="w-3.5 h-3.5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="text-xs font-bold">{o.label}</div>
                                  <div className={`text-[10px] mt-0.5 ${personalObjective === o.id ? 'text-zinc-300 dark:text-zinc-700' : 'text-zinc-400 dark:text-zinc-500'}`}>{o.desc}</div>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-1.5 pt-2">
                          <label className="text-xs font-bold tracking-wider text-zinc-400 uppercase">Commitment & Collaboration Model</label>
                          <div className="flex flex-wrap gap-2">
                            {COMMITMENT_STYLES.map((style) => (
                              <button
                                key={style}
                                onClick={() => setPersonalCommitment(style)}
                                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                                  personalCommitment === style 
                                    ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 border-zinc-900 dark:border-zinc-100'
                                    : 'bg-zinc-50 dark:bg-zinc-900/40 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                                }`}
                              >
                                {style}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* BUSINESS ACCOUNT STEPS */}
                {accountType === 'business' && (
                  <div>
                    {/* BUSINESS STEP 1 */}
                    {step === 1 && (
                      <div className="space-y-4 animate-in fade-in duration-300">
                        <div className="space-y-1.5">
                          <label htmlFor="b-name" className="text-xs font-bold tracking-wider text-zinc-400 uppercase">Organization / Business Name</label>
                          <input
                            id="b-name"
                            type="text"
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            placeholder="e.g. EcoVizion Ltd"
                            className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold tracking-wider text-zinc-400 uppercase">Industry Focus Sector</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {BUSINESS_INDUSTRIES.map((ind) => (
                              <button
                                key={ind.id}
                                onClick={() => setBusinessIndustry(ind.id)}
                                className={`p-3 rounded-xl border text-left transition-all ${
                                  businessIndustry === ind.id
                                    ? 'bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-950 shadow-md'
                                    : 'bg-zinc-50 dark:bg-zinc-900/40 border-zinc-200/60 dark:border-zinc-800/60 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-800 dark:text-zinc-200'
                                }`}
                              >
                                <div className="text-xs font-bold">{ind.label}</div>
                                <div className={`text-[10px] mt-0.5 ${businessIndustry === ind.id ? 'text-zinc-300 dark:text-zinc-700' : 'text-zinc-400 dark:text-zinc-500'}`}>{ind.desc}</div>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-1.5 pt-2">
                          <label className="text-xs font-bold tracking-wider text-zinc-400 uppercase">Company Development Stage</label>
                          <div className="flex flex-wrap gap-2">
                            {BUSINESS_STAGES.map((stage) => (
                              <button
                                key={stage}
                                onClick={() => setBusinessStage(stage)}
                                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                                  businessStage === stage 
                                    ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 border-zinc-900 dark:border-zinc-100'
                                    : 'bg-zinc-50 dark:bg-zinc-900/40 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                                }`}
                              >
                                {stage}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* BUSINESS STEP 2 */}
                    {step === 2 && (
                      <div className="space-y-4 animate-in fade-in duration-300">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold tracking-wider text-zinc-400 uppercase">Team Size</label>
                            <div className="grid grid-cols-1 gap-2">
                              {BUSINESS_SIZES.slice(0, 3).map((size) => (
                                <button
                                  key={size}
                                  onClick={() => setBusinessSize(size)}
                                  className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition-all ${
                                    businessSize === size
                                      ? 'bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-950 shadow-sm'
                                      : 'bg-zinc-50 dark:bg-zinc-900/40 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800'
                                  }`}
                                >
                                  {size}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold tracking-wider text-zinc-400 uppercase">Enterprise Scale</label>
                            <div className="grid grid-cols-1 gap-2">
                              {BUSINESS_SIZES.slice(3).map((size) => (
                                <button
                                  key={size}
                                  onClick={() => setBusinessSize(size)}
                                  className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition-all ${
                                    businessSize === size
                                      ? 'bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-950 shadow-sm'
                                      : 'bg-zinc-50 dark:bg-zinc-900/40 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800'
                                  }`}
                                >
                                  {size}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1.5 pt-1">
                          <label htmlFor="b-loc" className="text-xs font-bold tracking-wider text-zinc-400 uppercase">Operational Headquarters</label>
                          <div className="relative">
                            <MapPin className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-zinc-400" />
                            <input
                              id="b-loc"
                              type="text"
                              value={businessLocation}
                              onChange={(e) => setBusinessLocation(e.target.value)}
                              placeholder="e.g. London, UK / Fully Remote"
                              className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5 pt-1">
                          <label htmlFor="b-desc" className="text-xs font-bold tracking-wider text-zinc-400 uppercase">Company Value Proposition Description</label>
                          <textarea
                            id="b-desc"
                            rows={2.5}
                            value={businessDescription}
                            onChange={(e) => setBusinessDescription(e.target.value)}
                            placeholder="e.g. We build corporate compliance tools utilizing multispectral satellite imagery pipelines and transformer models to audit forest biomass data with high-fidelity accuracy."
                            maxLength={350}
                            className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 resize-none"
                          />
                          <div className="text-[10px] text-zinc-400 text-right">{businessDescription.length}/350 characters</div>
                        </div>
                      </div>
                    )}

                    {/* BUSINESS STEP 3 */}
                    {step === 3 && (
                      <div className="space-y-4 animate-in fade-in duration-300">
                        <div className="space-y-2">
                          <label className="text-xs font-bold tracking-wider text-zinc-400 uppercase">Primary Recruitment / Collaboration Need</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {BUSINESS_NEEDS.map((need) => (
                              <button
                                key={need.id}
                                onClick={() => setBusinessNeed(need.id)}
                                className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3.5 ${
                                  businessNeed === need.id
                                    ? 'bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-950 shadow-md'
                                    : 'bg-zinc-50 dark:bg-zinc-900/40 border-zinc-200/60 dark:border-zinc-800/60 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-800 dark:text-zinc-200'
                                }`}
                              >
                                <div className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shrink-0 mt-0.5">
                                  <Briefcase className="w-3.5 h-3.5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="text-xs font-bold">{need.label}</div>
                                  <div className={`text-[10px] mt-0.5 ${businessNeed === need.id ? 'text-zinc-300 dark:text-zinc-700' : 'text-zinc-400 dark:text-zinc-500'}`}>{need.desc}</div>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-1.5 pt-2">
                          <label htmlFor="b-target" className="text-xs font-bold tracking-wider text-zinc-400 uppercase">Describe Your Target Candidate / Strategic Partner Profile</label>
                          <textarea
                            id="b-target"
                            rows={3}
                            value={businessTargetPartner}
                            onChange={(e) => setBusinessTargetPartner(e.target.value)}
                            placeholder="e.g. Seeking a Lead Machine Learning Engineer who has published paper works at leading AI conferences and built distributed systems using PyTorch or JAX models."
                            maxLength={350}
                            className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 resize-none"
                          />
                          <div className="text-[10px] text-zinc-400 text-right">{businessTargetPartner.length}/350 characters</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Footer Navigation Buttons inside questionnaire */}
                <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 pt-5 mt-6">
                  <button
                    id="onboarding-prev-btn"
                    onClick={handlePrevStep}
                    disabled={step === 1}
                    className={`flex items-center gap-1.5 text-xs font-bold tracking-tight px-4 py-2.5 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/50 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100/50 transition-all ${
                      step === 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'
                    }`}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous Step</span>
                  </button>

                  <button
                    id="onboarding-next-btn"
                    onClick={handleNextStep}
                    disabled={!isStepValid() || isSubmitting}
                    className="flex items-center gap-1.5 text-xs font-bold tracking-tight px-6 py-3 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:pointer-events-none disabled:active:scale-100 shadow-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-zinc-500 border-t-zinc-900 dark:border-zinc-300 dark:border-t-zinc-100 animate-spin shrink-0" />
                        <span>Constructing Workspace...</span>
                      </>
                    ) : (
                      <>
                        <span>{step === 3 ? 'Finalize Workspace' : 'Continue Step'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

              </div>

            </motion.div>
          ) : (
            
            /* SUCCESS OR INTERACTIVE COMPLETE PAGE */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 20 }}
              className="p-8 sm:p-10 text-center flex flex-col items-center justify-center min-h-[460px] animate-in fade-in zoom-in-95 duration-500"
            >
              <div className="w-16 h-16 rounded-2xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 flex items-center justify-center mb-6 shadow-xl relative overflow-hidden">
                <Rocket className="w-7 h-7 relative z-10 animate-bounce" />
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
              </div>

              <h1 className="text-2xl sm:text-3xl font-display font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
                Welcome to your Orbit Workspace!
              </h1>
              
              <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mt-2.5 leading-relaxed">
                Your questionnaire response has been successfully cataloged. We have updated your recommendation parameters, profile tags, and Match Fit indexes.
              </p>

              {/* Dynamic summary items based on chosen account category */}
              <div className="w-full max-w-md bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-4 sm:p-5 mt-6 text-left space-y-3.5">
                <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Configured Integration Metrics</span>
                </div>

                {accountType === 'personal' ? (
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">Title Setup</span>
                      <span className="text-zinc-800 dark:text-zinc-200 font-bold">{personalTitle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">Location Node</span>
                      <span className="text-zinc-800 dark:text-zinc-200 font-bold">{personalLocation}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-zinc-400 font-semibold uppercase tracking-wider text-[10px] mt-0.5">Registered Talents</span>
                      <div className="flex flex-wrap gap-1 justify-end max-w-[240px]">
                        {personalSkills.map(s => (
                          <span key={s} className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-1.5 py-0.5 rounded text-[9px] font-black">{s}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">Orbit Match Fit Target</span>
                      <span className="text-zinc-800 dark:text-zinc-200 font-bold">
                        {personalObjective === 'cofounder' ? 'Lead Co-founder Search' :
                         personalObjective === 'funding' ? 'Venture Capital Alignment' :
                         personalObjective === 'hiring' ? 'Recruiting Foundation' :
                         personalObjective === 'discover' ? 'Asset Intelligence' : 'Peer Network'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">Company Name</span>
                      <span className="text-zinc-800 dark:text-zinc-200 font-bold">{businessName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">Operational HQ</span>
                      <span className="text-zinc-800 dark:text-zinc-200 font-bold">{businessLocation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">Industry Focus</span>
                      <span className="text-zinc-800 dark:text-zinc-200 font-bold">
                        {businessIndustry === 'cleantech' ? 'Climate & Deep Tech' :
                         businessIndustry === 'ai_ml' ? 'AI / ML Solutions' :
                         businessIndustry === 'logistics' ? 'Logistics / Fleet' :
                         businessIndustry === 'fintech' ? 'Fintech SaaS' : 'DevTools & Cloud'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">Strategic Target Recruitment</span>
                      <span className="text-zinc-800 dark:text-zinc-200 font-bold">
                        {businessNeed === 'backend' ? 'Lead Backend Architect' :
                         businessNeed === 'cofounder' ? 'Technical Co-founder' :
                         businessNeed === 'designer' ? 'Product Designer' :
                         businessNeed === 'funding' ? 'Venture Capital Fund' : 'Strategic GTM Advisor'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <button
                id="onboarding-complete-btn"
                onClick={handleComplete}
                className="w-full max-w-md bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 hover:opacity-90 py-3.5 rounded-xl font-bold text-xs tracking-wider uppercase mt-8 active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                <span>Launch Orbit Workspace</span>
                <Check className="w-4.5 h-4.5 stroke-[2.5]" />
              </button>
            </motion.div>

          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 text-center text-xs text-zinc-500 dark:text-zinc-400">
        Already have an account?{' '}
        <Link href="/auth" className="text-zinc-900 dark:text-zinc-100 font-semibold hover:underline">
          Sign In
        </Link>
      </div>

    </div>
  );
}
