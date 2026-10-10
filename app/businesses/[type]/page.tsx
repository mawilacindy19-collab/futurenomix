'use client';
import { useState, useEffect } from 'react';
import { opportunities } from '@/lib/opportunities';
import { useParams } from 'next/navigation';
import { ArrowRight, Search, Filter, ChevronDown, ChevronUp, ArrowLeft, Eye, ShieldCheck, Building2, Handshake, Plus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { requireAuth } from '@/app/lib/auth';

import findSupplierImg from '@/src/assets/images/find_supplier_hero_1785258965954.jpg';
import b2bDemandImg from '@/src/assets/images/b2b_demand_hero_1785258983836.jpg';
import findPartnersImg from '@/src/assets/images/find_partners_hero_1785258997515.jpg';
import busHandsImg from '@/src/assets/images/businesses_card_hands_bg_1785000095433.jpg';
import joburgSkylineImg from '@/src/assets/images/johannesburg_aerial_skyline_bg_1785089528895.jpg';
import mandelaBridgeImg from '@/src/assets/images/mandela_bridge_sunset_1786941248876.jpg';
import unionBuildingsImg from '@/src/assets/images/union_buildings_dusk_1786941282543.jpg';
import historicBankImg from '@/src/assets/images/historic_johannesburg_bank_bg_1785089002518.jpg';

export default function CategoryPage() {
  const params = useParams();
  const type = params.type as string; // supplier, demand, partnership
  const [searchQuery, setSearchQuery] = useState('');
  const [customOpps, setCustomOpps] = useState<any[]>([]);

  useEffect(() => {
    queueMicrotask(() => {
      const stored = localStorage.getItem('business_opportunities');
      if (stored) {
        try {
          setCustomOpps(JSON.parse(stored));
        } catch (e) {
          console.error(e);
        }
      }
    });
  }, []);

  const categoryNameMap: Record<string, string> = {
    supplier: 'Suppliers',
    demand: 'B2B Demand',
    partnership: 'Partnership'
  };

  const currentCategoryLabel = categoryNameMap[type] || type;

  const formattedCustomOpps = customOpps
    .filter(o => o.category?.toLowerCase() === currentCategoryLabel.toLowerCase() || o.category?.toLowerCase() === type.toLowerCase())
    .map(o => ({
      type: currentCategoryLabel,
      title: o.title,
      company: 'Verified Founder Network',
      description: o.description || 'Custom business opportunity broadcasted via growth hub.',
      size: o.budget || 'R50,000',
      location: 'Global / Remote',
      pdfName: o.pdfName || 'Opportunity_Doc.pdf',
      pdfDataUrl: o.pdfDataUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      imageUrl: o.imageUrl || ''
    }));

  const defaultMappedOpps = opportunities.map(o => ({
    ...o,
    pdfName: 'Compliance_Spec_2026.pdf',
    pdfDataUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  }));

  const allOpps = [...formattedCustomOpps, ...defaultMappedOpps];

  const filteredOpportunities = allOpps.filter(opp => 
    opp.type.toLowerCase().includes(type.toLowerCase()) &&
    (opp.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     opp.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
     opp.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="p-4 lg:p-8 w-full max-w-6xl mx-auto min-h-screen">
      <div className="mb-6">
        <Link href="/businesses" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-secondary/80 hover:bg-secondary text-foreground text-xs font-semibold transition-colors border border-border shadow-2xs">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Business Hub</span>
        </Link>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-display font-bold capitalize">{type} Opportunities</h1>
          <p className="text-muted-foreground mt-2">Connecting you to verified {type} partnerships and commercial requests with attached PDF specs.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-border rounded-xl leading-5 bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-all"
              placeholder="Search opportunities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Link
            href="/businesses/create"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-xl font-semibold shadow-sm transition-colors flex items-center justify-center gap-2 shrink-0 text-sm w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create Opportunity</span>
          </Link>
        </div>
      </motion.div>

      {filteredOpportunities.length > 0 ? (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredOpportunities.map((opp, i) => (
            <motion.div key={i} variants={item} layout>
              <B2BOpportunityCard {...opp} index={i} typeParam={type} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12 bg-card rounded-2xl border border-border"
        >
          <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground">No opportunities found</h3>
          <p className="text-muted-foreground mt-2">Try adjusting your search query or create a new opportunity.</p>
        </motion.div>
      )}
    </div>
  );
}

function B2BOpportunityCard({ type, title, company, description, size, location, pdfName, pdfDataUrl, imageUrl, index, typeParam }: any) {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleViewPdf = (e: React.MouseEvent) => {
        e.stopPropagation();
        window.open(pdfDataUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', '_blank');
    };

    // Choose pictures from the repository files
    const localImages = [
      findSupplierImg,
      b2bDemandImg,
      findPartnersImg,
      busHandsImg,
      joburgSkylineImg,
      mandelaBridgeImg,
      unionBuildingsImg,
      historicBankImg
    ];
    const bannerImg = imageUrl || localImages[index % localImages.length];

    return (
        <div 
          className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col h-full cursor-pointer hover:border-primary/40 hover:-translate-y-1"
          onClick={() => setIsExpanded(!isExpanded)}
        >
            {/* Innovated Card Image Banner from repository files */}
            <div className="relative h-40 w-full overflow-hidden bg-muted">
                <Image 
                    src={bannerImg} 
                    alt={title}
                    fill
                    referrerPolicy="no-referrer"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                
                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-background/90 backdrop-blur-md text-foreground text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs">
                    <Building2 className="w-3 h-3 text-primary" />
                    {type}
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                    <span className="text-xs font-semibold bg-primary/90 text-primary-foreground px-2.5 py-0.5 rounded-full shadow-xs">
                        {size}
                    </span>
                    <span className="text-[11px] font-medium text-slate-200 flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-xs">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" /> Verified
                    </span>
                </div>
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-2">
                   <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                       {company}
                   </span>
                   <button className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                     {isExpanded ? 'Show Less' : 'Details'}
                     {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                   </button>
                </div>
                
                <h3 className="font-display font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-1">{title}</h3>
                
                <AnimatePresence initial={false}>
                    <motion.div
                        key="content"
                        initial="collapsed"
                        animate={isExpanded ? "expanded" : "collapsed"}
                        exit="collapsed"
                        variants={{
                            expanded: { opacity: 1, height: "auto" },
                            collapsed: { opacity: 0.8, height: "50px" }
                        }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden mb-4"
                    >
                        <p className={`text-sm text-muted-foreground ${isExpanded ? '' : 'line-clamp-2'}`}>
                            {description}
                        </p>
                    </motion.div>
                </AnimatePresence>

                <div className="space-y-3 mt-auto pt-4 border-t border-border">
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-medium text-muted-foreground bg-secondary px-2.5 py-1 rounded-md">
                            {location}
                        </span>
                        <Link
                          href={`/businesses/connect?company=${encodeURIComponent(company)}&title=${encodeURIComponent(title)}&type=${encodeURIComponent(type)}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (typeof window !== 'undefined' && localStorage.getItem('orbit_is_logged_in') !== 'true') {
                              e.preventDefault();
                              window.dispatchEvent(new CustomEvent('open-auth-modal'));
                            }
                          }}
                          className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all flex items-center gap-1.5 shadow-xs"
                        >
                          <Handshake className="w-3.5 h-3.5" />
                          <span>Connect</span>
                        </Link>
                    </div>

                    <button 
                        onClick={handleViewPdf}
                        className="w-full bg-secondary/80 hover:bg-secondary text-foreground py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2 border border-border"
                    >
                        <Eye className="w-3.5 h-3.5 text-primary" />
                        <span className="capitalize">pitch deck view</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
