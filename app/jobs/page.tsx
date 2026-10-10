'use client';

import { Briefcase, MapPin, Search, CheckCircle2, X, Upload, FileText, Trash2, Plus, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import { requireAuth } from '@/app/lib/auth';
import { formatTimeAgo } from '@/lib/ecosystem-metrics';
import { CAREER_FIELDS, CareerField } from '@/lib/categories';

const BASE_JOBS = [
  {
    id: '1',
    title: 'Senior Frontend Engineer',
    company: 'Orbit HQ',
    location: 'Remote',
    type: 'Full-time',
    salary: 'R120k - R150k + Equity',
    posted: '2 days ago',
    logoUrl: 'https://dummyimage.com/100x100/1e293b/ffffff&text=logo',
    posterEmail: 'hr@orbithq.io',
    category: 'Technology'
  },
  {
    id: '2',
    title: 'UX/UI Designer',
    company: 'Creative Shift',
    location: 'New York, NY',
    type: 'Contract',
    salary: 'R60 - R80/hr',
    posted: '5 hours ago',
    logoUrl: 'https://dummyimage.com/100x100/1e293b/ffffff&text=logo',
    posterEmail: 'talent@creativeshift.co',
    category: 'Design'
  },
  {
    id: '3',
    title: 'Marketing Director',
    company: 'Green Future',
    location: 'Berlin, Germany (Hybrid)',
    type: 'Full-time',
    salary: '€80k - €100k',
    posted: '1 week ago',
    logoUrl: 'https://dummyimage.com/100x100/1e293b/ffffff&text=logo',
    posterEmail: 'jobs@greenfuture.eu',
    category: 'Marketing'
  }
];

export default function JobsPage() {
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [currentView, setCurrentView] = useState<'list' | 'upload' | 'post' | 'apply'>('list');
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isJobPostedSuccess, setIsJobPostedSuccess] = useState(false);
  
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');

  // Job listing state
  const [jobList, setJobList] = useState<Array<any>>(BASE_JOBS);
  const [filterCategory, setFilterCategory] = useState<CareerField | 'All'>('All');

  const filteredJobs = useMemo(() => {
    if (filterCategory === 'All') return jobList;
    return jobList.filter(job => job.category === filterCategory);
  }, [jobList, filterCategory]);

  useEffect(() => {
    queueMicrotask(() => {
      const stored = localStorage.getItem('orbit_jobs');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setJobList([...parsed, ...BASE_JOBS]);
        } catch (e) {
          console.error(e);
        }
      }

      const storedApplied = localStorage.getItem('orbit_applied_jobs');
      if (storedApplied) {
        try {
          setAppliedJobIds(JSON.parse(storedApplied));
        } catch (e) {
          console.error(e);
        }
      }
    });
  }, []);

  // New job form state
  const [postTitle, setPostTitle] = useState('');
  const [postCompany, setPostCompany] = useState('');
  const [postLocation, setPostLocation] = useState('');
  const [postType, setPostType] = useState('Full-time');
  const [postSalary, setPostSalary] = useState('');
  const [postEmail, setPostEmail] = useState('');
  const [postLogo, setPostLogo] = useState('https://dummyimage.com/100x100/1e293b/ffffff&text=logo');
  const [jobLogoFile, setJobLogoFile] = useState<{ name: string; dataUrl: string } | null>(null);

  const handleJobLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const dataUrl = uploadEvent.target?.result as string;
        setJobLogoFile({ name: file.name, dataUrl });
        setPostLogo(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  // CV storage
  const [cvList, setCvList] = useState<Array<{ id: string; name: string; size: string; date: string }>>([
    { id: '1', name: 'Software_Engineer_CV_2026.pdf', size: '245 KB', date: 'Aug 18, 2026' }
  ]);
  const [selectedCv, setSelectedCv] = useState<string>('Software_Engineer_CV_2026.pdf');
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        const newCv = {
          id: Date.now().toString(),
          name: file.name,
          size: `${Math.round(file.size / 1024)} KB`,
          date: 'Just now'
        };
        setCvList([newCv, ...cvList]);
        setSelectedCv(newCv.name);
      } else {
        alert('Please upload a valid PDF document (.pdf)');
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        const newCv = {
          id: Date.now().toString(),
          name: file.name,
          size: `${Math.round(file.size / 1024)} KB`,
          date: 'Just now'
        };
        setCvList([newCv, ...cvList]);
        setSelectedCv(newCv.name);
      } else {
        alert('Please upload a valid PDF document (.pdf)');
      }
    }
  };

  const handleDeleteCv = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const remaining = cvList.filter(c => c.id !== id);
    setCvList(remaining);
    if (remaining.length > 0) {
      setSelectedCv(remaining[0].name);
    } else {
      setSelectedCv('');
    }
  };

  const handleApplyClick = (job: any, e: React.MouseEvent) => {
    e.stopPropagation();
    requireAuth(() => {
      setSelectedJob(job);
      setIsSubmitted(false);
      setApplicantName('');
      setApplicantEmail('');
      setCurrentView('apply');
    });
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    if (selectedJob && !appliedJobIds.includes(selectedJob.id)) {
      const updated = [...appliedJobIds, selectedJob.id];
      setAppliedJobIds(updated);
      localStorage.setItem('orbit_applied_jobs', JSON.stringify(updated));
    }
  };

  const handlePostJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newJob = {
      id: Date.now().toString(),
      title: postTitle,
      company: postCompany,
      location: postLocation,
      type: postType,
      salary: postSalary || 'Competitive',
      posted: 'Just now',
      logoUrl: postLogo || 'https://dummyimage.com/100x100/1e293b/ffffff&text=logo',
      posterEmail: postEmail || 'recruiter@futurenomix.internal'
    };
    setJobList([newJob, ...jobList]);
    setIsJobPostedSuccess(true);
    setTimeout(() => {
      setIsJobPostedSuccess(false);
      setCurrentView('list');
      setPostTitle('');
      setPostCompany('');
      setPostLocation('');
      setPostSalary('');
      setPostEmail('');
    }, 1500);
  };

  // FULL PAGE: Upload CV & Manager
  if (currentView === 'upload') {
    return (
      <div className="bg-background min-h-screen p-6 lg:p-12 w-full">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center justify-between border-b border-border pb-6">
            <div className="space-y-1">
              <button 
                onClick={() => setCurrentView('list')}
                className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground mb-3 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Job Marketplace
              </button>
              <h1 className="text-3xl font-display font-bold flex items-center gap-3">
                <Upload className="w-8 h-8 text-primary" /> PDF CV Uploader & Manager
              </h1>
              <p className="text-muted-foreground">Upload your resume in PDF format to attach when applying for jobs.</p>
            </div>
            <button
              onClick={() => setCurrentView('list')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors cursor-pointer shadow-sm"
            >
              Done & Return
            </button>
          </div>

          {/* Dropzone */}
          <div 
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            style={{ width: '3.08in', maxWidth: '100%' }}
            className={`mx-auto border-2 border-dashed rounded-2xl p-8 text-center transition-all ${dragActive ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/50'}`}
          >
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold mb-1">Drag and drop your PDF CV here</h3>
            <p className="text-sm text-muted-foreground mb-6">Supports PDF documents up to 10MB</p>
            
            <label className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl text-sm font-semibold shadow-xs cursor-pointer transition-all active:scale-95">
              <span>Browse PDF Files</span>
              <input type="file" accept=".pdf,application/pdf" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          {/* Uploaded CV Documents */}
          <div style={{ width: '3.08in', maxWidth: '100%' }} className="static mx-auto space-y-4 bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-display font-bold flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" /> Stored CV Documents ({cvList.length})
            </h3>
            {cvList.length === 0 ? (
              <p className="text-sm text-muted-foreground italic py-4">No CVs uploaded yet.</p>
            ) : (
              <div className="space-y-3">
                {cvList.map(cv => (
                  <div key={cv.id} className="p-4 rounded-xl bg-secondary/50 border border-border flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold truncate text-foreground">{cv.name}</p>
                        <p className="text-xs text-muted-foreground">{cv.size} • Uploaded {cv.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => handleDeleteCv(cv.id, e)}
                        className="px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // FULL PAGE: Post a Job Advertiser
  if (currentView === 'post') {
    return (
      <div className="bg-background min-h-screen p-6 lg:p-12 w-full">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="border-b border-border pb-6">
            <button 
              onClick={() => setCurrentView('list')}
              className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground mb-3 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Job Marketplace
            </button>
            <h1 className="text-3xl font-display font-bold flex items-center gap-3">
              <Plus className="w-8 h-8 text-emerald-600" /> Advertise a Job Opportunity
            </h1>
            <p className="text-muted-foreground mt-1">Broadcast your career opening to top talent on Futurenomix.</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
            {isJobPostedSuccess ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold font-display">Job Opportunity Published!</h3>
                <p className="text-muted-foreground">Your job listing has been successfully published to the marketplace.</p>
              </div>
            ) : (
              <form onSubmit={handlePostJobSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground mb-2">Job Title</label>
                  <input 
                    type="text" 
                    required
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    placeholder="e.g. Senior Backend Developer"
                    className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-muted-foreground mb-2">Company Name</label>
                    <input 
                      type="text" 
                      required
                      value={postCompany}
                      onChange={(e) => setPostCompany(e.target.value)}
                      placeholder="e.g. Acme Corp"
                      className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-muted-foreground mb-2">Location</label>
                    <input 
                      type="text" 
                      required
                      value={postLocation}
                      onChange={(e) => setPostLocation(e.target.value)}
                      placeholder="e.g. Cape Town, SA / Remote"
                      className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-muted-foreground mb-2">Employment Type</label>
                    <select 
                      value={postType}
                      onChange={(e) => setPostType(e.target.value)}
                      className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Remote">Remote</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-muted-foreground mb-2">Salary Range</label>
                    <input 
                      type="text" 
                      value={postSalary}
                      onChange={(e) => setPostSalary(e.target.value)}
                      placeholder="e.g. R100k - R130k"
                      className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground mb-2">Company Logo / Job Card Photo</label>
                  <div className="border-2 border-dashed border-border rounded-2xl p-6 text-center hover:border-emerald-500 transition-colors bg-secondary/30">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleJobLogoUpload}
                      className="hidden" 
                      id="job-logo-upload"
                    />
                    <label htmlFor="job-logo-upload" className="cursor-pointer flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                        <Upload className="w-5 h-5" />
                      </div>
                      {jobLogoFile ? (
                        <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{jobLogoFile.name}</span>
                        </div>
                      ) : (
                        <>
                          <span className="text-sm font-medium">Click to upload company logo or photo</span>
                          <span className="text-xs text-muted-foreground">PNG, JPG or WEBP up to 10MB</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground mb-2">
                    Poster Email <span className="text-emerald-600 font-normal normal-case">(Confidential: Visible to Futurenomix Staff Only)</span>
                  </label>
                  <input 
                    type="email" 
                    required
                    value={postEmail}
                    onChange={(e) => setPostEmail(e.target.value)}
                    placeholder="e.g. recruiter@company.com"
                    className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                  <p className="text-xs text-muted-foreground mt-1.5">Your email is kept strictly private from job seekers and is only accessible to Futurenomix staff for verification.</p>
                </div>

                <div className="pt-6 border-t border-border flex gap-4">
                  <button
                    type="button"
                    onClick={() => setCurrentView('list')}
                    className="flex-1 bg-secondary hover:bg-secondary/80 text-foreground py-3 rounded-xl font-semibold text-sm transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold text-sm transition-colors cursor-pointer shadow-sm"
                  >
                    Publish Job Opportunity
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  // FULL PAGE: Apply Page
  if (currentView === 'apply' && selectedJob) {
    return (
      <div className="bg-background min-h-screen p-6 lg:p-12 w-full">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="border-b border-border pb-6">
            <button 
              onClick={() => setCurrentView('list')}
              className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground mb-3 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Job Marketplace
            </button>
            <div className="flex items-start gap-4 mt-2">
              <Image src={selectedJob.logoUrl} width={56} height={56} unoptimized alt={selectedJob.company} className="rounded-xl border border-border w-14 h-14 flex-shrink-0" referrerPolicy="no-referrer" />
              <div>
                <h1 className="text-3xl font-display font-bold">Apply for {selectedJob.title}</h1>
                <p className="text-muted-foreground font-medium text-lg">{selectedJob.company}</p>
                <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5 bg-secondary px-2.5 py-1 rounded-md"><Briefcase className="w-3.5 h-3.5"/> {selectedJob.type}</span>
                  <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5"/> {selectedJob.location}</span>
                  <span className="flex items-center gap-1.5 font-medium text-foreground/80">{selectedJob.salary}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
            {isSubmitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold font-display">Application Submitted!</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Your application for <span className="text-foreground font-semibold">{selectedJob.title}</span> at <span className="text-foreground font-semibold">{selectedJob.company}</span> has been successfully sent with CV <span className="text-primary font-medium">{selectedCv || 'None'}</span>.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => setCurrentView('list')}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors cursor-pointer shadow-sm"
                  >
                    Return to Jobs Marketplace
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitApplication} className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold font-display mb-1">Your Application Details</h3>
                  <p className="text-sm text-muted-foreground">Fill in your information below to submit your application directly to the recruiter.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-muted-foreground mb-2">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-muted-foreground mb-2">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={applicantEmail}
                      onChange={(e) => setApplicantEmail(e.target.value)}
                      placeholder="e.g. john@example.com"
                      className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-semibold uppercase text-muted-foreground">Select CV to Attach</label>
                      <button 
                        type="button" 
                        onClick={() => setCurrentView('upload')}
                        className="text-xs text-primary font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" /> Upload new CV
                      </button>
                    </div>
                    <select
                      value={selectedCv}
                      onChange={(e) => setSelectedCv(e.target.value)}
                      className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      {cvList.length === 0 ? (
                        <option value="">No CV uploaded</option>
                      ) : (
                        cvList.map(cv => (
                          <option key={cv.id} value={cv.name}>{cv.name}</option>
                        ))
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-muted-foreground mb-2">Cover Note / Intro</label>
                    <textarea 
                      rows={5}
                      placeholder="Briefly describe why you're a great fit for this role..."
                      className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    ></textarea>
                  </div>
                </div>

                <div className="pt-6 border-t border-border flex gap-4">
                  <button
                    type="button"
                    onClick={() => setCurrentView('list')}
                    className="flex-1 bg-secondary hover:bg-secondary/80 text-foreground py-3 rounded-xl font-semibold text-sm transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-xl font-semibold text-sm transition-colors cursor-pointer shadow-sm"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  // STANDARD VIEW: Job Marketplace
  return (
    <div className="min-h-screen bg-background text-foreground pb-20 pt-14">
      {/* Top Banner Header */}
      <div className="border-b border-border bg-card/80 backdrop-blur-md fixed top-0 left-0 right-0 z-40 w-full h-14 flex items-center px-4 sm:px-8">
        <div className="max-w-5xl mx-auto w-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link 
              href="/?card=jobs#card-jobs" 
              className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground transition-colors border border-border shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                <Briefcase className="w-4 h-4" />
              </div>
              <h1 className="text-xl font-display font-bold">Jobs Marketplace</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-8 w-full max-w-5xl mx-auto min-h-screen">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p style={{ marginTop: '-0.71in' }} className="relative z-30 text-muted-foreground">Find your next career move or advertise job opportunities to top talent.</p>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button 
            onClick={() => setCurrentView('post')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-sm flex items-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Post a Job
          </button>
          <button 
            onClick={() => setCurrentView('upload')}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-sm flex items-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <Upload className="w-4 h-4" /> Upload CV / PDF
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
               <Search className="w-5 h-5 text-muted-foreground" />
            </div>
            <input 
              type="text" 
              className="w-full bg-card border border-border rounded-full pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground shadow-sm transition-all"
              placeholder="Search roles, skills, or companies..." 
            />
          </div>
        </div>
      </div>

      <div className="flex gap-6 relative">
          <div className="flex-1 space-y-4">
              {filteredJobs.map((job) => (
                  <JobCard 
                      key={job.id}
                      title={job.title}
                      company={job.company}
                      location={job.location}
                      type={job.type}
                      salary={job.salary}
                      posted={job.posted}
                      logoUrl={job.logoUrl}
                      posterEmail={job.posterEmail}
                      isApplied={appliedJobIds.includes(job.id)}
                      onApply={(e: React.MouseEvent) => handleApplyClick(job, e)}
                  />
              ))}
          </div>

          <div className="hidden lg:block w-80 space-y-6 flex-shrink-0">
             <div className="bg-primary/5 rounded-xl p-5 border border-primary/20">
                <h3 className="font-display font-bold text-lg text-primary mb-2">AI Job Match</h3>
                <p className="text-sm text-foreground/80 mb-4">Based on your skills and experience, we found <strong>4</strong> highly-relevant roles for you.</p>
                <button className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors cursor-pointer">
                    Review Matches
                </button>
             </div>

             <div className="bg-card border border-border rounded-xl p-5 shadow-xs">
                <h3 className="font-display font-bold text-sm mb-3 flex items-center gap-2">
                   <FileText className="w-4 h-4 text-primary" /> Your Stored CVs ({cvList.length})
                </h3>
                {cvList.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No CV uploaded yet.</p>
                ) : (
                  <div className="space-y-2">
                    {cvList.map(cv => (
                      <div key={cv.id} className="p-2.5 rounded-lg bg-secondary/50 border border-border flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="w-4 h-4 text-red-500 flex-shrink-0" />
                          <span className="truncate font-medium">{cv.name}</span>
                        </div>
                        <button onClick={(e) => handleDeleteCv(cv.id, e)} className="text-muted-foreground hover:text-red-500 p-1">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <button 
                  onClick={() => setCurrentView('upload')}
                  className="w-full mt-3 bg-secondary hover:bg-secondary/80 text-foreground py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer border border-border"
                >
                  Manage CVs
                </button>
             </div>
          </div>
       </div>
      </div>
    </div>
  );
}

function JobCard({ title, company, location, type, salary, posted, logoUrl, posterEmail, isApplied, onApply }: any) {
    return (
        <div className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-colors flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-4 items-start min-w-0 flex-1">
                <Image src={logoUrl} width={48} height={48} unoptimized alt={company} className="rounded-lg border border-border w-12 h-12 flex-shrink-0" referrerPolicy="no-referrer" />
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg leading-tight">{title}</h3>
                        {isApplied && (
                            <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 dark:bg-emerald-950/40 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">
                                <CheckCircle2 className="w-3 h-3" /> Applied
                            </span>
                        )}
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">{company}</p>
                    
                    <div className="flex flex-wrap gap-3 mt-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5 bg-secondary px-2.5 py-1 rounded-md"><Briefcase className="w-3.5 h-3.5"/> {type}</span>
                        <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5"/> {location}</span>
                        <span className="flex items-center gap-1.5 font-medium text-foreground/80">{salary}</span>
                    </div>
                </div>
            </div>
            
            <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-3 sm:pt-0 border-t sm:border-0 border-border">
                <span className="text-[10px] whitespace-nowrap text-muted-foreground">{posted}</span>
                {isApplied ? (
                    <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 dark:bg-emerald-950/40 px-4 py-2 rounded-xl text-xs font-semibold border border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Applied
                    </span>
                ) : (
                    <button 
                        onClick={onApply}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
                    >
                        Apply Now
                    </button>
                )}
            </div>
        </div>
    )
}
