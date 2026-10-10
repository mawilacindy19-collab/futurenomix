'use client';
import { Building2, TrendingUp, DollarSign, ShieldCheck, X, Upload, FileText, Eye, Download, Plus, FileCheck, ArrowLeft, ArrowRight, CheckCircle2, Image as ImageIcon, Sparkles, ExternalLink, Copy, Check, CreditCard, Landmark, HelpCircle, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { requireAuth } from '@/app/lib/auth';
import { getEcosystemStats, DEFAULT_STATS, EcosystemStats } from '@/lib/ecosystem-metrics';

export default function FundingPage() {
  const [pitchDecks, setPitchDecks] = useState<any[]>([]);

  const [selectedInvestment, setSelectedInvestment] = useState<any | null>(null);
  const [previewSlide, setPreviewSlide] = useState<{ company: string; imageUrl: string; tagline?: string; pdfUrl?: string } | null>(null);
  const [investAmount, setInvestAmount] = useState<string>('25000');
  const [investorType, setInvestorType] = useState<string>('Angel Investor');
  const [isInvestSubmitted, setIsInvestSubmitted] = useState<boolean>(false);
  const [referenceId, setReferenceId] = useState<string>('');
  const [stats, setStats] = useState<EcosystemStats>(DEFAULT_STATS);
  const [liveTime, setLiveTime] = useState<string>('');
  
  // EasyEquities deposit page emulation states
  const [depositMethod, setDepositMethod] = useState<'eft' | 'instant' | 'card'>('eft');
  const [selectedBank, setSelectedBank] = useState<'fnb' | 'standard' | 'absa' | 'nedbank' | 'capitec'>('fnb');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardExpiry, setCardExpiry] = useState<string>('');
  const [cardCvv, setCardCvv] = useState<string>('');
  const [cardName, setCardName] = useState<string>('');

  useEffect(() => {
    queueMicrotask(() => {
      const stored = localStorage.getItem('custom_pitch_decks');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setPitchDecks(Object.entries(parsed).map(([key, val]) => ({ companyName: key, ...val as any })).reverse());
        } catch (e) {
          console.error(e);
        }
      }
    });
  }, []);

  useEffect(() => {
    const updateClock = () => {
      setStats(getEcosystemStats());
      const now = new Date();
      setLiveTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, [pitchDecks]);

  const deleteDeck = (name: string) => {
    const stored = localStorage.getItem('custom_pitch_decks');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        delete parsed[name];
        localStorage.setItem('custom_pitch_decks', JSON.stringify(parsed));
        setPitchDecks(prev => prev.filter(deck => deck.companyName !== name));
      } catch (e) {
        console.error(e);
      }
    }
  };

  const openPdf = (url: string) => {
    window.open(url || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', '_blank');
  };

  const handleOpenInvest = (opportunity: any) => {
    requireAuth(() => {
      setSelectedInvestment(opportunity);
      setIsInvestSubmitted(false);
      setInvestAmount('25000');
    });
  };

  const handleConfirmInvestment = (e: React.FormEvent) => {
    e.preventDefault();
    setReferenceId(`INV-${Math.floor(100000 + Math.random() * 900000)}`);
    setIsInvestSubmitted(true);
  };

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => {
      setCopiedField(null);
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-foreground pb-16 pt-14">
      {/* Top Banner Header */}
      <div className="border-b border-border bg-card/80 backdrop-blur-md fixed top-0 left-0 right-0 z-40 w-full h-14 flex items-center px-4 sm:px-8">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link 
              href="/?card=funding#card-funding" 
              className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground transition-colors border border-border shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                <Building2 className="w-4 h-4" />
              </div>
              <h1 className="text-xl font-display font-bold">Funding Marketplace</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground max-w-2xl">Discover verified investment opportunities, view pitch deck photos and documents, and upload corporate investment cards.</p>
        </div>
        <div className="flex gap-3 shrink-0">
          <Link 
            href="/funding/upload"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2.5 rounded-xl font-semibold shadow-sm transition-colors flex items-center gap-2 text-xs sm:text-sm"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Pitch Deck & Photos</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pitchDecks.map((deck) => (
            <FundingOpportunityCard 
              key={deck.companyName}
              company={deck.companyName}
              tagline={deck.tagline || 'No tagline provided'}
              stage={deck.investmentType || "Draft"}
              target={deck.target || "N/A"}
              raised={deck.raised || "N/A"}
              percentage={deck.percentage}
              industry={deck.industry || "N/A"}
              risk={deck.risk || "N/A"}
              coverUrl={deck.coverUrl || deck.imageUrl || deck.pitchDeckPhotoUrl || "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80"}
              logoUrl={deck.logoUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80"}
              pitchDeckPhotoUrl={deck.pitchDeckPhotoUrl || deck.coverUrl || null}
              pdfName={deck.pdfName || 'Pitch_Deck.pdf'}
              onViewPdf={() => {
                if (deck.pitchDeckPhotoUrl) {
                  setPreviewSlide({ company: deck.companyName, imageUrl: deck.pitchDeckPhotoUrl, tagline: deck.tagline, pdfUrl: deck.pdfDataUrl });
                } else {
                  openPdf(deck.pdfDataUrl);
                }
              }}
              onViewSlide={() => {
                if (deck.pitchDeckPhotoUrl || deck.coverUrl) {
                  setPreviewSlide({ company: deck.companyName, imageUrl: deck.pitchDeckPhotoUrl || deck.coverUrl, tagline: deck.tagline, pdfUrl: deck.pdfDataUrl });
                }
              }}
              onInvest={() => handleOpenInvest({ company: deck.companyName, target: deck.target || 'R500K', stage: deck.investmentType || 'Seed' })}
              onDelete={() => deleteDeck(deck.companyName)}
            />
        ))}
        {!pitchDecks.some(d => d.companyName === 'Lumina Energy') && (
          <FundingOpportunityCard 
            company="Lumina Energy"
            tagline="Next-gen solid-state batteries for EVs"
            stage="Series A"
            target="R5M"
            raised="R2.1M"
            industry="Clean Energy"
            risk="High/Growth"
            coverUrl="https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800&auto=format&fit=crop&q=80"
            logoUrl="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=200&auto=format&fit=crop&q=80"
            pitchDeckPhotoUrl="https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=1200&auto=format&fit=crop&q=80"
            pdfName="Lumina_Energy_SeriesA_Pitchbook.pdf"
            onViewPdf={() => openPdf('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf')}
            onViewSlide={() => setPreviewSlide({ company: 'Lumina Energy', imageUrl: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=1200&auto=format&fit=crop&q=80', tagline: 'Next-gen solid-state batteries for EVs', pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' })}
            onInvest={() => handleOpenInvest({ company: 'Lumina Energy', target: 'R5M', stage: 'Series A' })}
          />
        )}
        {!pitchDecks.some(d => d.companyName === 'AgriSupply') && (
          <FundingOpportunityCard 
            company="AgriSupply"
            tagline="B2B marketplace for local food suppliers"
            stage="Seed"
            target="R800K"
            raised="R450K"
            industry="AgriTech"
            risk="Moderate"
            coverUrl="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80"
            logoUrl="https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=200&auto=format&fit=crop&q=80"
            pitchDeckPhotoUrl="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200&auto=format&fit=crop&q=80"
            pdfName="AgriSupply_Seed_Pitch_Deck.pdf"
            onViewPdf={() => openPdf('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf')}
            onViewSlide={() => setPreviewSlide({ company: 'AgriSupply', imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200&auto=format&fit=crop&q=80', tagline: 'B2B marketplace for local food suppliers', pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' })}
            onInvest={() => handleOpenInvest({ company: 'AgriSupply', target: 'R800K', stage: 'Seed' })}
          />
        )}
        {!pitchDecks.some(d => d.companyName === 'FinFlow') && (
          <FundingOpportunityCard 
            company="FinFlow"
            tagline="Cross-border payroll for remote teams"
            stage="Pre-Seed"
            target="R250K"
            raised="R50K"
            industry="FinTech"
            risk="High"
            coverUrl="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80"
            logoUrl="https://images.unsplash.com/photo-1563986768609-322da13575f3?w=200&auto=format&fit=crop&q=80"
            pitchDeckPhotoUrl="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80"
            pdfName="FinFlow_PreSeed_Overview.pdf"
            onViewPdf={() => openPdf('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf')}
            onViewSlide={() => setPreviewSlide({ company: 'FinFlow', imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80', tagline: 'Cross-border payroll for remote teams', pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' })}
            onInvest={() => handleOpenInvest({ company: 'FinFlow', target: 'R250K', stage: 'Pre-Seed' })}
          />
        )}
      </div>

      {/* Slide / Pitch Deck Photo Full View Modal */}
      {previewSlide && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
          <div className="bg-card border border-border rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 sm:p-6 border-b border-border flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h3 className="font-display font-bold text-lg text-foreground">{previewSlide.company} — Pitch Deck Visual</h3>
                </div>
                {previewSlide.tagline && (
                  <p className="text-xs text-muted-foreground mt-0.5">{previewSlide.tagline}</p>
                )}
              </div>
              <button
                onClick={() => setPreviewSlide(null)}
                className="p-2 rounded-xl bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col items-center justify-center bg-zinc-950">
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-zinc-800 shadow-inner flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={previewSlide.imageUrl} 
                  alt={`${previewSlide.company} pitch deck`} 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <div className="p-4 sm:p-6 border-t border-border flex items-center justify-between gap-4 bg-card">
              <span className="text-xs text-muted-foreground">High-resolution verified slide photo</span>
              <div className="flex items-center gap-3">
                {previewSlide.pdfUrl && (
                  <button
                    onClick={() => openPdf(previewSlide.pdfUrl!)}
                    className="px-4 py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground text-xs font-semibold flex items-center gap-1.5 transition-colors border border-border"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Open Full PDF</span>
                  </button>
                )}
                <button
                  onClick={() => setPreviewSlide(null)}
                  className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors"
                >
                  Close Viewer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Investment Full Page View */}
      {selectedInvestment && (
        <div className="fixed inset-0 bg-slate-100 dark:bg-zinc-950 text-foreground z-50 overflow-y-auto min-h-screen w-full">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6">
            
            {/* Header branding of easyEquities */}
            <div className="bg-[#E51C24] text-white p-6 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-white text-[#E51C24] font-extrabold px-3 py-1.5 rounded-xl text-lg tracking-tight shadow-md flex items-center justify-center select-none">
                  <span>easy</span><span className="font-light">Equities</span>
                </div>
                <div className="h-8 w-px bg-white/20 hidden sm:block" />
                <div className="text-left">
                  <h2 className="text-lg font-bold">Funding Account Deposit</h2>
                  <p className="text-xs text-white/80">Direct secure investment channel for {selectedInvestment.company}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedInvestment(null)}
                className="w-full sm:w-auto px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all border border-white/10 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Cancel & Return</span>
              </button>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-xl space-y-8">
              {!isInvestSubmitted ? (
                <div className="space-y-8">
                  {/* Select Deposit Amount */}
                  <div className="bg-slate-50 dark:bg-zinc-900/50 p-5 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide">
                        1. Specify Deposit Amount (ZAR)
                      </label>
                      <span className="text-xs font-bold text-[#E51C24]">No Maximum Limit</span>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-2.5">
                      {['1000', '5000', '25000', '100000'].map((amt) => (
                        <button
                          type="button"
                          key={amt}
                          onClick={() => setInvestAmount(amt)}
                          className={`py-2.5 rounded-xl border text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                            investAmount === amt
                              ? 'bg-[#E51C24] text-white border-[#E51C24] shadow-md scale-[1.02]'
                              : 'bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-foreground border-zinc-200 dark:border-zinc-700'
                          }`}
                        >
                          R{parseInt(amt, 10).toLocaleString()}
                        </button>
                      ))}
                    </div>

                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-extrabold text-base">R</span>
                      <input
                        type="number"
                        value={investAmount}
                        onChange={(e) => setInvestAmount(e.target.value)}
                        placeholder="Enter custom amount"
                        className="w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl pl-10 pr-4 py-3.5 text-base font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-[#E51C24]"
                        required
                        min="100"
                      />
                    </div>
                  </div>

                  {/* Deposit Payment Methods Menu (Matching easyEquities) */}
                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide">
                      2. Select Your Deposit Method
                    </label>

                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'eft', label: 'EFT Transfer', sub: 'Traditional Bank Transfer', icon: Landmark },
                        { id: 'instant', label: 'Instant EFT', sub: 'Ozow / SID secure', icon: Sparkles },
                        { id: 'card', label: 'Credit Card', sub: 'Instant Deposit', icon: CreditCard }
                      ].map((method) => {
                        const Icon = method.icon;
                        const isActive = depositMethod === method.id;
                        return (
                          <button
                            key={method.id}
                            type="button"
                            onClick={() => setDepositMethod(method.id as any)}
                            className={`p-4 rounded-2xl border text-left flex flex-col gap-2 transition-all cursor-pointer ${
                              isActive
                                ? 'border-[#E51C24] bg-red-500/5 dark:bg-red-500/10 shadow-xs'
                                : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className={`p-2 rounded-xl ${isActive ? 'bg-[#E51C24] text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'}`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              {isActive && <div className="w-2 h-2 rounded-full bg-[#E51C24]" />}
                            </div>
                            <div>
                              <span className="block text-xs sm:text-sm font-bold text-foreground leading-snug">{method.label}</span>
                              <span className="block text-[10px] text-muted-foreground mt-0.5 leading-none">{method.sub}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* EFT (Bank Deposit) View */}
                  {depositMethod === 'eft' && (
                    <div className="space-y-6 border-t border-zinc-100 dark:border-zinc-800 pt-6">
                      <div className="bg-yellow-500/5 dark:bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-2xl text-xs text-yellow-800 dark:text-yellow-300 flex items-start gap-3">
                        <HelpCircle className="w-5 h-5 shrink-0 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                        <div>
                          <span className="font-bold block text-sm">Important Deposit Instructions:</span>
                          <span className="mt-1 block leading-relaxed">
                            Transfer <strong>R{parseInt(investAmount || '0', 10).toLocaleString()}</strong> from your bank account to the banking details listed below. You <strong>MUST</strong> use the unique Reference number exactly as shown so our system can instantly allocate funds to your profile.
                          </span>
                        </div>
                      </div>

                      {/* Bank Selectors */}
                      <div className="space-y-3">
                        <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">Select Beneficiary Bank</span>
                        <div className="grid grid-cols-5 gap-2">
                          {[
                            { id: 'fnb', label: 'FNB', color: 'bg-[#009688]', logoText: 'FNB' },
                            { id: 'standard', label: 'Standard', color: 'bg-[#0033a0]', logoText: 'STD' },
                            { id: 'absa', label: 'ABSA', color: 'bg-[#bf0d3e]', logoText: 'ABSA' },
                            { id: 'nedbank', label: 'Nedbank', color: 'bg-[#006a4e]', logoText: 'NED' },
                            { id: 'capitec', label: 'Capitec', color: 'bg-[#002B49]', logoText: 'CAP' }
                          ].map((bank) => (
                            <button
                              key={bank.id}
                              onClick={() => setSelectedBank(bank.id as any)}
                              className={`py-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                                selectedBank === bank.id
                                  ? 'border-[#E51C24] ring-2 ring-red-500/20 bg-zinc-50 dark:bg-zinc-800'
                                  : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
                              }`}
                            >
                              <div className={`w-8 h-8 rounded-lg ${bank.color} text-white flex items-center justify-center font-extrabold text-[9px] shadow-xs`}>
                                {bank.logoText}
                              </div>
                              <span className="text-[10px] font-bold text-foreground mt-1">{bank.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Bank Details Table */}
                      <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xs bg-white dark:bg-zinc-950">
                        <div className="bg-zinc-50 dark:bg-zinc-900 px-5 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                          <span className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Beneficiary Banking Details</span>
                          <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" /> Verified Trust Account
                          </span>
                        </div>
                        <div className="divide-y divide-zinc-100 dark:divide-zinc-800 text-sm">
                          {/* Beneficiary Name */}
                          <div className="p-4 flex items-center justify-between gap-4">
                            <span className="text-muted-foreground text-xs font-semibold">Account Holder</span>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-foreground">Futurenomix Deposit Trust</span>
                              <button
                                onClick={() => handleCopy('Futurenomix Deposit Trust', 'holder')}
                                className="p-1 rounded-md bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-500 transition-colors cursor-pointer"
                              >
                                {copiedField === 'holder' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>

                          {/* Bank Name */}
                          <div className="p-4 flex items-center justify-between gap-4">
                            <span className="text-muted-foreground text-xs font-semibold">Bank Name</span>
                            <span className="font-bold text-foreground">
                              {selectedBank === 'fnb' && 'First National Bank (FNB)'}
                              {selectedBank === 'standard' && 'Standard Bank'}
                              {selectedBank === 'absa' && 'ABSA Bank'}
                              {selectedBank === 'nedbank' && 'Nedbank'}
                              {selectedBank === 'capitec' && 'Capitec Bank'}
                            </span>
                          </div>

                          {/* Account Number */}
                          <div className="p-4 flex items-center justify-between gap-4">
                            <span className="text-muted-foreground text-xs font-semibold">Account Number</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-foreground text-base">
                                {selectedBank === 'fnb' && '62890538127'}
                                {selectedBank === 'standard' && '028193859'}
                                {selectedBank === 'absa' && '4092839401'}
                                {selectedBank === 'nedbank' && '1987593850'}
                                {selectedBank === 'capitec' && '1092834019'}
                              </span>
                              <button
                                onClick={() => {
                                  const acc = selectedBank === 'fnb' ? '62890538127' : selectedBank === 'standard' ? '028193859' : selectedBank === 'absa' ? '4092839401' : selectedBank === 'nedbank' ? '1987593850' : '1092834019';
                                  handleCopy(acc, 'acc');
                                }}
                                className="p-1 rounded-md bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-500 transition-colors cursor-pointer"
                              >
                                {copiedField === 'acc' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>

                          {/* Branch Code */}
                          <div className="p-4 flex items-center justify-between gap-4">
                            <span className="text-muted-foreground text-xs font-semibold">Branch Code</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-foreground">
                                {selectedBank === 'fnb' && '250655'}
                                {selectedBank === 'standard' && '051001'}
                                {selectedBank === 'absa' && '632005'}
                                {selectedBank === 'nedbank' && '198765'}
                                {selectedBank === 'capitec' && '470010'}
                              </span>
                              <button
                                onClick={() => {
                                  const code = selectedBank === 'fnb' ? '250655' : selectedBank === 'standard' ? '051001' : selectedBank === 'absa' ? '632005' : selectedBank === 'nedbank' ? '198765' : '470010';
                                  handleCopy(code, 'branch');
                                }}
                                className="p-1 rounded-md bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-500 transition-colors cursor-pointer"
                              >
                                {copiedField === 'branch' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>

                          {/* Unique Reference Code */}
                          <div className="p-4 flex items-center justify-between gap-4 bg-red-500/5 dark:bg-red-500/10">
                            <span className="text-[#E51C24] text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5" /> Your Reference
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-extrabold text-[#E51C24] text-base bg-[#E51C24]/10 px-3 py-1 rounded-lg border border-[#E51C24]/20">
                                {referenceId || 'FNX-102934'}
                              </span>
                              <button
                                onClick={() => handleCopy(referenceId || 'FNX-102934', 'ref')}
                                className="p-1.5 rounded-md bg-[#E51C24] hover:bg-[#c2141c] text-white transition-colors cursor-pointer"
                              >
                                {copiedField === 'ref' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Confirm EFT Submission Form */}
                      <form onSubmit={handleConfirmInvestment} className="pt-6 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row gap-3 justify-end">
                        <button
                          type="button"
                          onClick={() => setSelectedInvestment(null)}
                          className="px-6 py-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl font-bold text-sm text-foreground transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-3 bg-[#E51C24] hover:bg-[#c2141c] text-white rounded-xl font-extrabold text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>I Have Made the EFT Deposit</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Instant EFT (Secure Automated EFT) View */}
                  {depositMethod === 'instant' && (
                    <div className="space-y-6 border-t border-zinc-100 dark:border-zinc-800 pt-6">
                      <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-4 max-w-lg mx-auto">
                        <div className="text-center space-y-2">
                          <div className="w-12 h-12 rounded-full bg-[#E51C24]/10 text-[#E51C24] mx-auto flex items-center justify-center">
                            <Sparkles className="w-6 h-6" />
                          </div>
                          <h4 className="font-bold text-base">Ozow Secure Checkout</h4>
                          <p className="text-xs text-muted-foreground">Instantly transfer funds directly from your South African bank app with absolute encryption.</p>
                        </div>

                        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex items-center justify-between text-sm">
                          <span className="text-muted-foreground font-semibold">Instant Deposit Amount:</span>
                          <span className="font-extrabold text-foreground text-lg text-[#E51C24]">R{parseInt(investAmount || '0', 10).toLocaleString()}</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setReferenceId(`INS-${Math.floor(100000 + Math.random() * 900000)}`);
                            setIsInvestSubmitted(true);
                          }}
                          className="w-full py-3.5 rounded-xl bg-[#E51C24] text-white hover:bg-[#c2141c] text-sm font-extrabold transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
                        >
                          Proceed to Secure Instant EFT
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Credit/Debit Card View */}
                  {depositMethod === 'card' && (
                    <div className="space-y-6 border-t border-zinc-100 dark:border-zinc-800 pt-6">
                      {/* Interactive Card Simulator Preview */}
                      <div className="relative w-80 h-48 bg-gradient-to-br from-zinc-900 via-zinc-800 to-black text-white rounded-2xl p-6 shadow-2xl mx-auto overflow-hidden flex flex-col justify-between select-none">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-2xl" />
                        
                        <div className="flex items-center justify-between relative z-10">
                          <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">easyEquities Card Link</span>
                          <div className="w-8 h-8 rounded-full bg-[#E51C24] flex items-center justify-center text-[10px] font-black">ee</div>
                        </div>

                        {/* Card Number display */}
                        <div className="text-lg font-mono font-bold tracking-widest text-center py-2 relative z-10">
                          {cardNumber || '•••• •••• •••• ••••'}
                        </div>

                        <div className="flex justify-between items-end relative z-10 text-xs">
                          <div>
                            <span className="text-[9px] text-zinc-500 uppercase block mb-0.5">Card Holder</span>
                            <span className="font-bold truncate max-w-[150px] block">{cardName || 'YOUR FULL NAME'}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[9px] text-zinc-500 uppercase block mb-0.5">Expires</span>
                            <span className="font-mono font-bold">{cardExpiry || 'MM/YY'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Card Inputs */}
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          setReferenceId(`CRD-${Math.floor(100000 + Math.random() * 900000)}`);
                          setIsInvestSubmitted(true);
                        }}
                        className="space-y-4 max-w-lg mx-auto"
                      >
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">Card Holder Name</label>
                          <input
                            type="text"
                            required
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            placeholder="e.g. John Doe"
                            className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-[#E51C24]"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">Card Number</label>
                          <input
                            type="text"
                            required
                            maxLength={19}
                            value={cardNumber}
                            onChange={(e) => {
                              // Autoformat card number spaces
                              const v = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                              const matches = v.match(/\d{4,16}/g);
                              const match = (matches && matches[0]) || '';
                              const parts = [];
                              for (let i = 0, len = match.length; i < len; i += 4) {
                                parts.push(match.substring(i, i + 4));
                              }
                              if (parts.length > 0) {
                                setCardNumber(parts.join(' '));
                              } else {
                                setCardNumber(v);
                              }
                            }}
                            placeholder="4000 1234 5678 9010"
                            className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm font-mono font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-[#E51C24]"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">Expiry Date</label>
                            <input
                              type="text"
                              required
                              maxLength={5}
                              value={cardExpiry}
                              onChange={(e) => {
                                let val = e.target.value.replace(/[^0-9]/g, '');
                                if (val.length >= 2) {
                                  val = val.substring(0, 2) + '/' + val.substring(2, 4);
                                }
                                setCardExpiry(val);
                              }}
                              placeholder="MM/YY"
                              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm font-mono font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-[#E51C24]"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">CVV</label>
                            <input
                              type="password"
                              required
                              maxLength={3}
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value.replace(/[^0-9]/g, ''))}
                              placeholder="123"
                              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm font-mono font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-[#E51C24]"
                            />
                          </div>
                        </div>

                        <div className="pt-4 flex gap-3">
                          <button
                            type="button"
                            onClick={() => setSelectedInvestment(null)}
                            className="flex-1 py-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl font-bold text-sm text-foreground transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="flex-1 py-3 bg-[#E51C24] hover:bg-[#c2141c] text-white rounded-xl font-extrabold text-sm transition-all shadow-md active:scale-95 cursor-pointer"
                          >
                            Deposit R{parseInt(investAmount || '0', 10).toLocaleString()}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Trust Badge matching easyEquities footer */}
                  <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-center gap-2.5 text-xs text-muted-foreground font-semibold">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span>Futurenomix is an authorized Financial Services Provider. Covered by Orbit Trust.</span>
                  </div>
                </div>
              ) : (
                /* Success View styled beautifully */
                <div className="text-center py-10 space-y-8 max-w-xl mx-auto">
                  <div className="w-24 h-24 rounded-full bg-emerald-500/10 text-emerald-600 mx-auto flex items-center justify-center border-2 border-emerald-500/20 shadow-inner">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold font-display text-foreground tracking-tight">Deposit Request Logged!</h3>
                    <p className="text-sm sm:text-base text-muted-foreground mt-3 max-w-md mx-auto">
                      Your deposit intent of <span className="font-extrabold text-[#E51C24]">R{parseInt(investAmount || '0', 10).toLocaleString()}</span> for <span className="font-bold text-foreground">{selectedInvestment.company}</span> has been logged inside your easyEquities Ledger.
                    </p>
                  </div>
                  
                  <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-left text-sm space-y-4 shadow-2xs">
                    <div className="flex justify-between items-center pb-3 border-b border-zinc-200/50 dark:border-zinc-800/50">
                      <span className="text-muted-foreground font-semibold">Selected Bank Account</span>
                      <span className="font-bold text-foreground">
                        {depositMethod === 'eft' ? `EFT — ${selectedBank.toUpperCase()}` : depositMethod === 'instant' ? 'Instant EFT' : 'Credit/Debit Card'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-zinc-200/50 dark:border-zinc-800/50">
                      <span className="text-muted-foreground font-semibold">Unique Reference Number</span>
                      <span className="font-mono text-sm font-extrabold text-[#E51C24] bg-red-500/10 px-2 py-0.5 rounded-md border border-red-500/10">
                        {referenceId || 'INV-829104'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground font-semibold">Allocation Status</span>
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                        <Clock className="w-3.5 h-3.5 animate-pulse" /> Pending Verification
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                    EFT deposits normally reflect within 1-2 business days. Instant EFT or Card transactions will reflect automatically within a few minutes.
                  </p>

                  <button
                    onClick={() => {
                      setSelectedInvestment(null);
                      setIsInvestSubmitted(false);
                    }}
                    className="w-full py-4 rounded-xl bg-[#E51C24] text-white text-sm font-extrabold hover:bg-[#c2141c] transition-all shadow-md active:scale-95 block cursor-pointer"
                  >
                    Return to Funding Marketplace
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

function FundingOpportunityCard({ 
  company, 
  tagline, 
  stage, 
  target, 
  raised, 
  percentage, 
  industry, 
  risk, 
  coverUrl, 
  logoUrl, 
  pitchDeckPhotoUrl,
  pdfName, 
  onViewPdf, 
  onViewSlide,
  onInvest, 
  onDelete 
}: any) {
  const parsedTarget = parseFloat(target.replace(/[^0-9.]/g, '')) || 1;
  const parsedRaised = parseFloat(raised.replace(/[^0-9.]/g, '')) || 0;
  const calcPercent = Math.min(100, Math.round((parsedRaised / parsedTarget) * 100)) || 0;
  const percent = percentage ? parseInt(percentage, 10) : calcPercent;

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all group flex flex-col justify-between">
      <div>
        <div className="h-36 w-full relative overflow-hidden bg-muted/40">
          {coverUrl && coverUrl.startsWith('data:') ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={coverUrl} alt="Cover" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          ) : (
            <Image src={coverUrl || "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80"} alt="Cover" fill unoptimized className="object-cover transition-transform duration-500 group-hover:scale-105" referrerPolicy="no-referrer" />
          )}
          <div className="absolute top-3 left-3 bg-background/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] uppercase font-bold text-foreground tracking-widest border border-border shadow-xs">
            {stage}
          </div>
          {pitchDeckPhotoUrl && (
            <button
              onClick={(e) => { e.preventDefault(); onViewSlide?.(); }}
              className="absolute bottom-2 left-3 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 transition-colors"
              title="View Slide Photo"
            >
              <ImageIcon className="w-3 h-3" />
              <span>Slide Photo</span>
            </button>
          )}
          {onDelete && (
              <button 
                  onClick={(e) => { e.preventDefault(); onDelete(); }}
                  className="absolute top-3 right-3 bg-black/60 hover:bg-red-600 text-white p-1.5 rounded-full backdrop-blur-md transition-colors"
                  title="Delete opportunity"
              >
                  <X size={14} />
              </button>
          )}
        </div>
        <div className="p-5 flex flex-col relative">
          <div className="absolute -top-8 right-4 bg-card p-1 rounded-xl border border-border shadow-md">
            {logoUrl && logoUrl.startsWith('data:') ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt="Logo" className="rounded-lg w-12 h-12 object-cover" />
            ) : (
              <Image src={logoUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80"} width={48} height={48} alt="Logo" unoptimized className="rounded-lg w-12 h-12 object-cover" referrerPolicy="no-referrer" />
            )}
          </div>
          
          <div className="border-l-2 border-primary pl-3 mt-1">
            <h3 className="font-bold text-lg text-foreground mb-1">{company}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2 min-h-8">{tagline}</p>
          </div>
          
          <div className="mt-4 space-y-3">
              <div className="flex justify-between items-end mb-1">
                  <span className="text-xs font-semibold text-foreground">{raised} <span className="text-muted-foreground font-normal text-[11px]">raised of {target}</span></span>
                  <span className="text-xs font-bold text-primary">{percent}%</span>
              </div>
              <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${percent}%` }} />
              </div>

              <div className="flex items-center justify-between text-xs font-medium text-muted-foreground bg-muted/40 px-3 py-2 rounded-xl border border-border/50">
                  <div className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5 text-primary"/> {industry}</div>
                  <div className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500"/> {risk} Risk</div>
              </div>
          </div>
        </div>
      </div>

      <div className="p-5 pt-0 flex items-center gap-2">
        <button 
          onClick={onViewPdf}
          className="flex-1 bg-secondary hover:bg-secondary/80 text-foreground py-2.5 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 border border-border shadow-2xs cursor-pointer"
        >
          <Eye className="w-4 h-4 text-primary" />
          <span>Pitch Deck</span>
        </button>
        <div className="flex-1 p-0.5 bg-primary/10 rounded-xl border border-primary/30 shadow-2xs">
          <button 
            onClick={onInvest}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
          >
            <span>Invest</span>
          </button>
        </div>
      </div>
    </div>
  );
}

