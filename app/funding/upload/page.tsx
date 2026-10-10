'use client';
import { Upload, FileText, FileCheck, ArrowLeft, Building2, Image as ImageIcon, X, Sparkles, Check } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import { compressImage } from '@/lib/utils';

export default function PresenterUploadPage() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState('');
  const [tagline, setTagline] = useState('');
  const [industry, setIndustry] = useState('CleanTech');
  const [stage, setStage] = useState('Seed');
  const [target, setTarget] = useState('R1,000,000');
  const [raised, setRaised] = useState('R250,000');
  const [risk, setRisk] = useState('Moderate');
  
  // Photos & Media State
  const [logoFile, setLogoFile] = useState<{ name: string; dataUrl: string } | null>(null);
  const [coverPhotoFile, setCoverPhotoFile] = useState<{ name: string; dataUrl: string } | null>(null);
  const [pitchDeckPhotoFile, setPitchDeckPhotoFile] = useState<{ name: string; dataUrl: string } | null>(null);
  const [pdfFile, setPdfFile] = useState<{ name: string; dataUrl: string } | null>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (uploadEvent) => {
        const rawUrl = uploadEvent.target?.result as string;
        try {
          const compressed = await compressImage(rawUrl, 300, 300, 0.8);
          setLogoFile({ name: file.name, dataUrl: compressed });
        } catch {
          setLogoFile({ name: file.name, dataUrl: rawUrl });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (uploadEvent) => {
        const rawUrl = uploadEvent.target?.result as string;
        try {
          const compressed = await compressImage(rawUrl, 1000, 600, 0.8);
          setCoverPhotoFile({ name: file.name, dataUrl: compressed });
        } catch {
          setCoverPhotoFile({ name: file.name, dataUrl: rawUrl });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePitchDeckPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (uploadEvent) => {
        const rawUrl = uploadEvent.target?.result as string;
        try {
          const compressed = await compressImage(rawUrl, 1200, 800, 0.8);
          setPitchDeckPhotoFile({ name: file.name, dataUrl: compressed });
        } catch {
          setPitchDeckPhotoFile({ name: file.name, dataUrl: rawUrl });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setPdfFile({
          name: file.name,
          dataUrl: uploadEvent.target?.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveDeck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) return;

    let parsed: Record<string, any> = {};
    const stored = localStorage.getItem('custom_pitch_decks');
    if (stored) {
      try {
        parsed = JSON.parse(stored);
      } catch (e) {
        parsed = {};
      }
    }

    parsed[companyName] = {
      tagline: tagline || 'Innovative startup presentation',
      industry,
      investmentType: stage,
      target,
      raised,
      risk,
      logoUrl: logoFile?.dataUrl || '',
      coverUrl: coverPhotoFile?.dataUrl || '',
      pitchDeckPhotoUrl: pitchDeckPhotoFile?.dataUrl || '',
      imageUrl: coverPhotoFile?.dataUrl || pitchDeckPhotoFile?.dataUrl || '',
      pdfName: pdfFile?.name || 'Pitch_Deck_2026.pdf',
      pdfDataUrl: pdfFile?.dataUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    };

    localStorage.setItem('custom_pitch_decks', JSON.stringify(parsed));
    router.push('/funding');
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col">
      {/* Header Bar */}
      <header className="border-b border-border bg-card px-6 py-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <Link href="/funding" className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 text-xs font-semibold">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Marketplace</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
            <Building2 className="w-4 h-4" />
          </div>
          <span className="font-display font-bold text-sm">Business Presenter Portal</span>
        </div>
      </header>

      {/* Main Form Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12">
        <div className="w-full max-w-3xl bg-card border border-border rounded-3xl shadow-xl overflow-hidden p-6 sm:p-10">
          <div className="mb-8">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
              <Upload className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold">Upload Pitch Deck & Funding Opportunity</h1>
            <p className="text-sm text-muted-foreground mt-1.5">Publish your verified investment opportunity with custom card photos, logos, and deck documentation to the Futurenomix ecosystem.</p>
          </div>

          <form onSubmit={handleSaveDeck} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Company Name *</label>
              <input 
                type="text" 
                required 
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                placeholder="e.g. AeroDynamics Corp"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Tagline / Short Summary *</label>
              <input 
                type="text" 
                required
                value={tagline}
                onChange={e => setTagline(e.target.value)}
                placeholder="e.g. Autonomous drone logistics for urban healthcare"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Industry Sector</label>
                <select 
                  value={industry}
                  onChange={e => setIndustry(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="CleanTech">CleanTech & Energy</option>
                  <option value="AgriTech">AgriTech & Food</option>
                  <option value="FinTech">FinTech & Payments</option>
                  <option value="AI & ML">AI & Machine Learning</option>
                  <option value="HealthTech">HealthTech & Biotech</option>
                  <option value="SaaS">Enterprise SaaS</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Funding Stage</label>
                <select 
                  value={stage}
                  onChange={e => setStage(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Pre-Seed">Pre-Seed</option>
                  <option value="Seed">Seed</option>
                  <option value="Series A">Series A</option>
                  <option value="Series B">Series B</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Target Raise Amount</label>
                <input 
                  type="text" 
                  value={target}
                  onChange={e => setTarget(e.target.value)}
                  placeholder="R1,000,000"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Capital Already Raised</label>
                <input 
                  type="text" 
                  value={raised}
                  onChange={e => setRaised(e.target.value)}
                  placeholder="R250,000"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Photo & Image Uploads Section */}
            <div className="border border-border rounded-2xl p-5 bg-muted/20 space-y-5">
              <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                <ImageIcon className="w-4 h-4 text-primary" />
                <span>Card Media & Photos</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Company Logo Photo Upload */}
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-2">
                    Company / Brand Logo Photo
                  </label>
                  <div className="border-2 border-dashed border-border rounded-xl p-4 text-center hover:border-primary transition-colors bg-card relative">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden" 
                      id="logo-upload-input"
                    />
                    {logoFile ? (
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg border border-border overflow-hidden relative shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={logoFile.dataUrl} alt="Logo Preview" className="w-full h-full object-cover" />
                          </div>
                          <div className="text-left">
                            <span className="text-xs font-semibold text-foreground block truncate max-w-[140px]">{logoFile.name}</span>
                            <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                              <Check className="w-3 h-3" /> Logo attached
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setLogoFile(null)}
                          className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground"
                          title="Remove logo"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label htmlFor="logo-upload-input" className="cursor-pointer flex flex-col items-center gap-2 py-2">
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-semibold text-foreground">Upload Logo Photo</span>
                        <span className="text-[10px] text-muted-foreground">PNG, JPG, SVG up to 5MB</span>
                      </label>
                    )}
                  </div>
                </div>

                {/* 2. Funding Card Cover Photo Upload */}
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-2">
                    Funding Card Cover Photo
                  </label>
                  <div className="border-2 border-dashed border-border rounded-xl p-4 text-center hover:border-primary transition-colors bg-card relative">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleCoverPhotoUpload}
                      className="hidden" 
                      id="cover-upload-input"
                    />
                    {coverPhotoFile ? (
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-12 rounded-lg border border-border overflow-hidden relative shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={coverPhotoFile.dataUrl} alt="Cover Preview" className="w-full h-full object-cover" />
                          </div>
                          <div className="text-left">
                            <span className="text-xs font-semibold text-foreground block truncate max-w-[140px]">{coverPhotoFile.name}</span>
                            <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                              <Check className="w-3 h-3" /> Cover photo attached
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setCoverPhotoFile(null)}
                          className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground"
                          title="Remove cover"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label htmlFor="cover-upload-input" className="cursor-pointer flex flex-col items-center gap-2 py-2">
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-semibold text-foreground">Upload Card Cover Banner</span>
                        <span className="text-[10px] text-muted-foreground">High-res header photo</span>
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* 3. Pitch Deck Visual Slide / Photo Presentation */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-2">
                  Pitch Deck Slide Photo / Presentation Visual
                </label>
                <div className="border-2 border-dashed border-border rounded-xl p-4 text-center hover:border-primary transition-colors bg-card relative">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handlePitchDeckPhotoUpload}
                    className="hidden" 
                    id="deck-photo-upload-input"
                  />
                  {pitchDeckPhotoFile ? (
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-20 h-12 rounded-lg border border-border overflow-hidden relative shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={pitchDeckPhotoFile.dataUrl} alt="Slide Preview" className="w-full h-full object-cover" />
                        </div>
                        <div className="text-left">
                          <span className="text-xs font-semibold text-foreground block truncate max-w-xs">{pitchDeckPhotoFile.name}</span>
                          <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                            <Check className="w-3 h-3" /> Pitch deck slide photo attached
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPitchDeckPhotoFile(null)}
                        className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground"
                        title="Remove photo"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label htmlFor="deck-photo-upload-input" className="cursor-pointer flex flex-col items-center gap-2 py-2">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-semibold text-foreground">Upload Pitch Deck Slide / Image</span>
                      <span className="text-[10px] text-muted-foreground">Attach key pitch deck visual slide or infographic</span>
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Pitch Deck PDF Document Section */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Pitch Deck Document (PDF)</label>
              <div className="border-2 border-dashed border-border rounded-2xl p-6 text-center hover:border-primary transition-colors bg-muted/20">
                <input 
                  type="file" 
                  accept="application/pdf"
                  onChange={handleFileUpload}
                  className="hidden" 
                  id="pdf-upload-page-input"
                />
                <label htmlFor="pdf-upload-page-input" className="cursor-pointer flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <FileText className="w-6 h-6" />
                  </div>
                  {pdfFile ? (
                    <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600">
                      <FileCheck className="w-5 h-5" />
                      <span>{pdfFile.name}</span>
                    </div>
                  ) : (
                    <>
                      <span className="text-sm font-medium">Click to browse or drag & drop your PDF pitch deck</span>
                      <span className="text-xs text-muted-foreground">Secure PDF document compliant with investor portal guidelines</span>
                    </>
                  )}
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-4 border-t border-border">
              <Link 
                href="/funding"
                className="px-6 py-3 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors"
              >
                Cancel
              </Link>
              <button 
                type="submit" 
                className="px-8 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-md cursor-pointer"
              >
                Publish Opportunity
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

