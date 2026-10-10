'use client';

import React, { useState, useEffect } from 'react';
import { requireAuth } from '@/app/lib/auth';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  FolderDot, 
  Search, 
  Filter, 
  Plus, 
  Users, 
  Sparkles, 
  Star, 
  Rocket, 
  Code, 
  ExternalLink, 
  Tag, 
  Clock, 
  ChevronRight, 
  Check, 
  ThumbsUp, 
  MessageSquare, 
  Layers, 
  ShieldCheck, 
  X,
  Share2,
  Building2,
  TrendingUp
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: string;
  status: 'Recruiting' | 'In Development' | 'Beta / Testing' | 'Launched' | 'Seeking Funding';
  coverUrl: string;
  logoUrl: string;
  techStack: string[];
  openRoles: string[];
  upvotes: number;
  membersCount: number;
  leadName: string;
  leadAvatar: string;
  location: string;
  progressPercent: number;
  featured?: boolean;
  websiteUrl?: string;
  createdAt: string;
}

const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'SolarGrid IoT Protocol',
    tagline: 'Decentralized peer-to-peer micro-grid energy trading network for African townships.',
    description: 'SolarGrid connects rooftop solar installers directly with local businesses and residential micro-consumers through smart meters and automated lightning-fast settlement rails.',
    category: 'Green Tech & Energy',
    status: 'In Development',
    coverUrl: 'https://dummyimage.com/800x400/1e293b/ffffff?text=solargrid',
    logoUrl: 'https://dummyimage.com/200x200/1e293b/ffffff?text=solarlogo',
    techStack: ['IoT', 'Solidity', 'Next.js', 'Python', 'MQTT'],
    openRoles: ['Embedded Rust Engineer', 'Smart Contract Auditor', 'Community Manager'],
    upvotes: 142,
    membersCount: 6,
    leadName: 'Kagiso Mokoena',
    leadAvatar: 'https://dummyimage.com/100x100/1e293b/ffffff?text=kagiso',
    location: 'Johannesburg, ZA',
    progressPercent: 68,
    featured: true,
    websiteUrl: 'https://solargrid.example.com',
    createdAt: '2 days ago'
  },
  {
    id: 'proj-2',
    title: 'AfriCode Open Logistics Engine',
    tagline: 'Open-source route optimization & fleet telemetry API for pan-African freight carriers.',
    description: 'An intelligent AI-driven spatial routing SDK designed specifically for sub-Saharan road conditions, border customs queuing algorithms, and real-time fuel tracking.',
    category: 'Open Source',
    status: 'Beta / Testing',
    coverUrl: 'https://dummyimage.com/800x400/1e293b/ffffff?text=logistics',
    logoUrl: 'https://dummyimage.com/200x200/1e293b/ffffff?text=freightlogo',
    techStack: ['TypeScript', 'Go', 'PostgreSQL', 'Docker', 'Google Maps API'],
    openRoles: ['Frontend Engineer (React)', 'DevOps Specialist'],
    upvotes: 98,
    membersCount: 9,
    leadName: 'Nandi Sithole',
    leadAvatar: 'https://dummyimage.com/100x100/1e293b/ffffff?text=nandi',
    location: 'Durban, ZA',
    progressPercent: 82,
    featured: true,
    createdAt: '5 days ago'
  },
  {
    id: 'proj-3',
    title: 'FinHealth AI Assistant',
    tagline: 'Conversational voice assistant providing micro-merchant credit scoring in local languages.',
    description: 'Democratizing working capital access for informal traders through automated cashflow analysis over WhatsApp and voice prompts in isiZulu, Sesotho, and Afrikaans.',
    category: 'FinTech',
    status: 'Recruiting',
    coverUrl: 'https://dummyimage.com/800x400/1e293b/ffffff?text=finhealth',
    logoUrl: 'https://dummyimage.com/200x200/1e293b/ffffff?text=finlogo',
    techStack: ['Python', 'Gemini API', 'WhatsApp API', 'FastAPI'],
    openRoles: ['Co-founder / CMO', 'NLP Data Scientist', 'Full-Stack Developer'],
    upvotes: 215,
    membersCount: 4,
    leadName: 'Thabo Ndlovu',
    leadAvatar: 'https://dummyimage.com/100x100/1e293b/ffffff?text=thabo',
    location: 'Pretoria, ZA',
    progressPercent: 40,
    featured: true,
    createdAt: '1 week ago'
  },
  {
    id: 'proj-4',
    title: 'UrbanAgri Vertical Farms',
    tagline: 'Hydroponic smart containers delivering fresh produce directly to urban food deserts.',
    description: 'Modular, IoT-monitored agricultural shipping containers using 90% less water to grow organic greens inside inner-city Johannesburg and Cape Town.',
    category: 'AgriTech & Sustainability',
    status: 'Seeking Funding',
    coverUrl: 'https://dummyimage.com/800x400/1e293b/ffffff?text=urbanagri',
    logoUrl: 'https://dummyimage.com/200x200/1e293b/ffffff?text=agrilogo',
    techStack: ['Arduino / ESP32', 'React Native', 'Node.js', 'InfluxDB'],
    openRoles: ['Agronomist', 'Hardware Engineer'],
    upvotes: 176,
    membersCount: 5,
    leadName: 'Zanele Khumalo',
    leadAvatar: 'https://dummyimage.com/100x100/1e293b/ffffff?text=zanele',
    location: 'Cape Town, ZA',
    progressPercent: 55,
    createdAt: '2 weeks ago'
  },
  {
    id: 'proj-5',
    title: 'HealthPulse Telemedicine Kiosk',
    tagline: 'Solar-powered remote health diagnostic booths for rural clinics.',
    description: 'Empowering local community health workers with AI-assisted diagnostic tools and direct satellite link-ups to specialist physicians in central hospitals.',
    category: 'HealthTech',
    status: 'Launched',
    coverUrl: 'https://dummyimage.com/800x400/1e293b/ffffff?text=healthpulse',
    logoUrl: 'https://dummyimage.com/200x200/1e293b/ffffff?text=healthlogo',
    techStack: ['WebRTC', 'Python', 'React', 'TensorFlow Lite'],
    openRoles: ['Partnership Lead', 'Medical Advisor'],
    upvotes: 310,
    membersCount: 12,
    leadName: 'Dr. Sipho Dlamini',
    leadAvatar: 'https://dummyimage.com/100x100/1e293b/ffffff?text=sipho',
    location: 'Polokwane, ZA',
    progressPercent: 95,
    createdAt: '3 weeks ago'
  }
];

const CATEGORIES = [
  'All Categories',
  'Green Tech & Energy',
  'FinTech',
  'AgriTech & Sustainability',
  'HealthTech',
  'Open Source',
  'AI & Machine Learning'
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('futurenomix_user_projects');
      if (stored) {
        try {
          const customProj = JSON.parse(stored);
          return [...customProj, ...INITIAL_PROJECTS];
        } catch (e) {
          console.error(e);
        }
      }
    }
    return INITIAL_PROJECTS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [upvotedIds, setUpvotedIds] = useState<Set<string>>(new Set());
  const [joinedIds, setJoinedIds] = useState<Set<string>>(new Set());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Project Form state
  const [newTitle, setNewTitle] = useState('');
  const [newTagline, setNewTagline] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState('Green Tech & Energy');
  const [newStatus, setNewStatus] = useState<'Recruiting' | 'In Development' | 'Beta / Testing' | 'Launched' | 'Seeking Funding'>('Recruiting');
  const [newTechStack, setNewTechStack] = useState('');
  const [newOpenRoles, setNewOpenRoles] = useState('');
  const [newLeadName, setNewLeadName] = useState('');
  const [newLocation, setNewLocation] = useState('Johannesburg, ZA');
  const [projectCoverFile, setProjectCoverFile] = useState<{ name: string; dataUrl: string } | null>(null);

  const handleProjectCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setProjectCoverFile({
          name: file.name,
          dataUrl: uploadEvent.target?.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };
  const [liveTime, setLiveTime] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setLiveTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleUpvote = (id: string) => {
    setUpvotedIds((prev) => {
      const next = new Set(prev);
      const isCurrentlyUpvoted = next.has(id);
      if (isCurrentlyUpvoted) {
        next.delete(id);
      } else {
        next.add(id);
      }
      
      setProjects((currentList) =>
        currentList.map((p) => {
          if (p.id === id) {
            return {
              ...p,
              upvotes: isCurrentlyUpvoted ? p.upvotes - 1 : p.upvotes + 1
            };
          }
          return p;
        })
      );
      return next;
    });
  };

  const handleJoinProject = (id: string) => {
    requireAuth(() => {
      setJoinedIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        return next;
      });
    });
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newTagline.trim()) return;

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      title: newTitle,
      tagline: newTagline,
      description: newDescription || newTagline,
      category: newCategory,
      status: newStatus,
      coverUrl: projectCoverFile?.dataUrl || `https://dummyimage.com/800x400/1e293b/ffffff?text=${encodeURIComponent(newTitle)}`,
      logoUrl: projectCoverFile?.dataUrl || `https://dummyimage.com/200x200/1e293b/ffffff?text=${encodeURIComponent(newTitle)}-logo`,
      techStack: newTechStack ? newTechStack.split(',').map((s) => s.trim()) : ['React', 'TypeScript'],
      openRoles: newOpenRoles ? newOpenRoles.split(',').map((s) => s.trim()) : ['Contributors Welcome'],
      upvotes: 1,
      membersCount: 1,
      leadName: newLeadName || 'You (Project Founder)',
      leadAvatar: 'https://dummyimage.com/100x100/1e293b/ffffff?text=useravatar',
      location: newLocation,
      progressPercent: 15,
      createdAt: 'Just now'
    };

    const updatedProjects = [newProject, ...projects];
    setProjects(updatedProjects);

    // Persist custom projects to localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('futurenomix_user_projects');
      let customProj = [];
      if (stored) {
        try {
          customProj = JSON.parse(stored);
        } catch (e) {
          console.error(e);
        }
      }
      localStorage.setItem('futurenomix_user_projects', JSON.stringify([newProject, ...customProj]));
    }

    // Reset form & close modal
    setNewTitle('');
    setNewTagline('');
    setNewDescription('');
    setNewTechStack('');
    setNewOpenRoles('');
    setNewLeadName('');
    setIsCreateModalOpen(false);
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.techStack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All Categories' || p.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || p.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Top Banner Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link 
              href="/?card=projects#card-projects" 
              className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground transition-colors border border-border shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                <FolderDot className="w-4 h-4" />
              </div>
              <h1 className="text-xl font-display font-bold">Projects Hub</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 sm:p-8 rounded-3xl border border-primary/20">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ecosystem Ventures & Open Source</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground tracking-tight">
              Collaborative Projects & Startup Builds
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              Explore active community builds, apply for open team roles, back promising technical projects, and co-create next-generation African solutions.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shadow-sm cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Submit Project</span>
            </button>
          </div>

          <div className="flex flex-col items-end gap-3 shrink-0">
            <div className="flex flex-wrap items-center gap-4 bg-card/80 backdrop-blur-sm p-4 rounded-2xl border border-border">
              <div className="text-center px-3 border-r border-border">
                <span className="block text-xl font-bold text-primary">{projects.length}</span>
                <span className="text-[11px] text-muted-foreground font-medium">Active Builds</span>
              </div>
              <div className="text-center px-3 border-r border-border">
                <span className="block text-xl font-bold text-foreground">
                  {projects.reduce((acc, p) => acc + p.membersCount, 0)}
                </span>
                <span className="text-[11px] text-muted-foreground font-medium">Builders</span>
              </div>
              <div className="text-center px-3 border-r border-border">
                <span className="block text-xl font-bold text-emerald-600 dark:text-emerald-400">
                  {projects.reduce((acc, p) => acc + p.openRoles.length, 0)}
                </span>
                <span className="text-[11px] text-muted-foreground font-medium">Open Roles</span>
              </div>
              <div className="text-center px-3">
                <span className="block text-xl font-bold text-amber-500">
                  {projects.reduce((acc, p) => acc + p.upvotes, 0)}
                </span>
                <span className="text-[11px] text-muted-foreground font-medium">Upvotes</span>
              </div>
            </div>

          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects, stack, or keywords..."
              className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-2xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-primary text-primary-foreground shadow-2xs'
                    : 'bg-secondary hover:bg-secondary/80 text-foreground border border-border'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="mt-4 flex items-center gap-2 border-b border-border pb-3 overflow-x-auto">
          {['All', 'Recruiting', 'In Development', 'Beta / Testing', 'Launched', 'Seeking Funding'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                selectedStatus === st
                  ? 'bg-foreground text-background font-bold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-6">
        {filteredProjects.length === 0 ? (
          <div className="p-12 text-center bg-card border border-border rounded-3xl my-8">
            <FolderDot className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <h3 className="text-lg font-bold text-foreground">No Projects Found</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              No builds matched your filter criteria. Try searching for a different keyword or create a new project.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All Categories');
                setSelectedStatus('All');
              }}
              className="mt-4 text-xs font-bold text-primary hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => {
              const isUpvoted = upvotedIds.has(project.id);
              const isJoined = joinedIds.has(project.id);

              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="bg-card border border-border hover:border-primary/40 rounded-3xl overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col group"
                >
                  {/* Card Cover Image */}
                  <div className="relative h-44 w-full bg-secondary overflow-hidden">
                    <Image
                      src={project.coverUrl}
                      alt={project.title}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                    
                    {/* Category & Status Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-950/70 text-white backdrop-blur-md border border-white/20">
                        {project.category}
                      </span>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-md border ${
                        project.status === 'Recruiting'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : project.status === 'Launched'
                            ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      }`}>
                        {project.status}
                      </span>
                    </div>

                    {/* Founder Avatar Overlay */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden relative bg-slate-200">
                        <Image
                          src={project.leadAvatar}
                          alt={project.leadName}
                          fill
                          unoptimized
                          className="object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="text-white text-xs">
                        <span className="font-semibold block drop-shadow-sm">{project.leadName}</span>
                        <span className="text-[10px] text-white/80 block drop-shadow-sm">{project.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors flex items-center justify-between gap-2">
                        <span>{project.title}</span>
                        {project.websiteUrl && (
                          <a
                            href={project.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-1 text-muted-foreground hover:text-primary transition-colors"
                            title="Visit Website"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </h3>

                      <p className="text-xs font-medium text-foreground/90 mt-1.5 leading-snug">
                        {project.tagline}
                      </p>

                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                        {project.description}
                      </p>

                      {/* Tech Stack Tags */}
                      <div className="flex flex-wrap gap-1.5 mt-3.5">
                        {project.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 rounded-md bg-secondary text-foreground text-[10px] font-mono border border-border"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-4 pt-3 border-t border-border/60">
                        <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground mb-1">
                          <span>Build Progress</span>
                          <span className="font-bold text-foreground">{project.progressPercent}%</span>
                        </div>
                        <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-primary h-full rounded-full transition-all duration-500" 
                            style={{ width: `${project.progressPercent}%` }}
                          />
                        </div>
                      </div>

                      {/* Open Roles Badge */}
                      {project.openRoles.length > 0 && (
                        <div className="mt-3.5 p-2.5 rounded-xl bg-primary/5 border border-primary/15 text-xs">
                          <span className="text-[10px] uppercase font-bold text-primary block tracking-wider mb-1">
                            Seeking Team Members:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {project.openRoles.map((role) => (
                              <span key={role} className="text-[11px] text-foreground font-semibold flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                {role}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Card Actions Footer */}
                    <div className="pt-3 border-t border-border flex items-center justify-between gap-2 mt-auto">
                      <button
                        onClick={() => handleUpvote(project.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                          isUpvoted
                            ? 'bg-amber-500/15 text-amber-600 border border-amber-500/30'
                            : 'bg-secondary hover:bg-secondary/80 text-foreground border border-border'
                        }`}
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 ${isUpvoted ? 'fill-amber-500 text-amber-500' : ''}`} />
                        <span>{project.upvotes}</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleJoinProject(project.id)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-2xs ${
                            isJoined
                              ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/30'
                              : 'bg-primary text-primary-foreground hover:bg-primary/90'
                          }`}
                        >
                          {isJoined ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Joined</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>Apply / Join</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create / Submit Project Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden my-8"
            >
              <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                    <Rocket className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-lg">Submit a New Project</h3>
                    <p className="text-xs text-muted-foreground">Feature your build to recruit collaborators and investors.</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateProject} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. SolarGrid IoT Protocol"
                    className="w-full px-3.5 py-2 bg-secondary border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Tagline (Elevator Pitch) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTagline}
                    onChange={(e) => setNewTagline(e.target.value)}
                    placeholder="e.g. Decentralized micro-grid energy trading network for townships"
                    className="w-full px-3.5 py-2 bg-secondary border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      Category
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-3.5 py-2 bg-secondary border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                    >
                      {CATEGORIES.filter((c) => c !== 'All Categories').map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      Current Status
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as any)}
                      className="w-full px-3.5 py-2 bg-secondary border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                    >
                      <option value="Recruiting">Recruiting Team</option>
                      <option value="In Development">In Development</option>
                      <option value="Beta / Testing">Beta / Testing</option>
                      <option value="Launched">Launched</option>
                      <option value="Seeking Funding">Seeking Funding</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Description & Goals
                  </label>
                  <textarea
                    rows={3}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Explain what problem your project solves, key milestones, and who you need..."
                    className="w-full px-3.5 py-2 bg-secondary border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Pitch Deck / Cover Photo
                  </label>
                  <div className="border-2 border-dashed border-border rounded-2xl p-4 text-center hover:border-primary transition-colors bg-secondary/30">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleProjectCoverUpload}
                      className="hidden" 
                      id="project-cover-upload"
                    />
                    <label htmlFor="project-cover-upload" className="cursor-pointer flex items-center justify-center gap-2 text-xs font-medium text-foreground">
                      <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        <Share2 className="w-4 h-4" />
                      </span>
                      {projectCoverFile ? (
                        <span className="text-emerald-600 font-semibold flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5" /> {projectCoverFile.name}
                        </span>
                      ) : (
                        <span>Click to upload project cover / pitch deck photo</span>
                      )}
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      Tech Stack (comma separated)
                    </label>
                    <input
                      type="text"
                      value={newTechStack}
                      onChange={(e) => setNewTechStack(e.target.value)}
                      placeholder="React, Python, IoT, Solidity"
                      className="w-full px-3.5 py-2 bg-secondary border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      Seeking Roles (comma separated)
                    </label>
                    <input
                      type="text"
                      value={newOpenRoles}
                      onChange={(e) => setNewOpenRoles(e.target.value)}
                      placeholder="UI Designer, Rust Dev, Co-founder"
                      className="w-full px-3.5 py-2 bg-secondary border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      Founder / Lead Name
                    </label>
                    <input
                      type="text"
                      value={newLeadName}
                      onChange={(e) => setNewLeadName(e.target.value)}
                      placeholder="Your Name"
                      className="w-full px-3.5 py-2 bg-secondary border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      placeholder="Johannesburg, ZA"
                      className="w-full px-3.5 py-2 bg-secondary border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-sm"
                  >
                    Publish Project
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
