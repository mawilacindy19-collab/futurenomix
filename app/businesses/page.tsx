'use client';
import { Truck, ShoppingCart, Target, ArrowRight, Sparkles, Building, ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';

import findSupplierImg from '@/src/assets/images/find_supplier_hero_1785258965954.jpg';
import b2bDemandImg from '@/src/assets/images/b2b_demand_hero_1785258983836.jpg';
import findPartnersImg from '@/src/assets/images/find_partners_hero_1785258997515.jpg';

export default function BusinessesPage() {
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
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 pt-14">
      {/* Top Banner Header */}
      <div className="border-b border-border bg-card/80 backdrop-blur-md fixed top-0 left-0 right-0 z-40 w-full h-14 flex items-center px-4 sm:px-8">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link 
              href="/?card=businesses#card-businesses" 
              className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground transition-colors border border-border shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                <Building className="w-4 h-4" />
              </div>
              <h1 className="text-xl font-display font-bold">Businesses Directory</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 lg:px-8">
      {/* Title Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <span className="text-red-500 font-bold text-xs tracking-wider uppercase mb-1.5 block">
            B2B Commercial Alliances
          </span>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-foreground">
            Business Growth Hub
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl text-sm sm:text-base leading-relaxed">
            Accelerate your scale. Connect seamlessly with trusted global manufacturers, verified strategic joint venture partners, and high-volume corporate buyers.
          </p>
        </div>

        <Link
          href="/businesses/create"
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-sm flex items-center gap-2 shrink-0 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>List Business</span>
        </Link>
      </motion.div>

      {/* Modern High-End Image Cards Grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
      >
        {/* CARD 1: Find Suppliers */}
        <motion.div variants={item}>
          <div className="group flex flex-col h-full bg-card border border-slate-200/60 dark:border-slate-800/60 rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/40 transition-all duration-300">
            <Link href="/businesses/supplier" className="relative h-48 w-full overflow-hidden block">
              <Image 
                src={findSupplierImg} 
                alt="Find Suppliers logistics, cargo planes, ships and containers"
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 bg-orange-500/90 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md flex items-center gap-1.5 backdrop-blur-sm">
                <Truck className="w-3.5 h-3.5" />
                Suppliers
              </div>
            </Link>
            <div className="p-6 flex flex-col flex-grow">
              <Link href="/businesses/supplier">
                <h3 className="font-display font-extrabold text-xl text-foreground group-hover:text-primary transition-colors">
                  Find a Supplier
                </h3>
              </Link>
              <p className="text-muted-foreground text-sm mt-2 leading-relaxed flex-grow">
                Source verified global manufacturers, raw material exporters, logistics providers, and OEM component fabricators with full compliance audits.
              </p>
              
              <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between">
                <Link href="/businesses/supplier" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                  Browse Opportunities <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CARD 2: B2B Demand */}
        <motion.div variants={item}>
          <div className="group flex flex-col h-full bg-card border border-slate-200/60 dark:border-slate-800/60 rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/40 transition-all duration-300">
            <Link href="/businesses/demand" className="relative h-48 w-full overflow-hidden block">
              <Image 
                src={b2bDemandImg} 
                alt="B2B Demand manufacturing industrial equipment fabrication team"
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 bg-blue-600/90 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md flex items-center gap-1.5 backdrop-blur-sm">
                <ShoppingCart className="w-3.5 h-3.5" />
                B2B Demand
              </div>
            </Link>
            <div className="p-6 flex flex-col flex-grow">
              <Link href="/businesses/demand">
                <h3 className="font-display font-extrabold text-xl text-foreground group-hover:text-primary transition-colors">
                  B2B Demand Match
                </h3>
              </Link>
              <p className="text-muted-foreground text-sm mt-2 leading-relaxed flex-grow">
                Bid on active procurement lists, infrastructure audits, technical build requests, and large enterprise commercial buy requests.
              </p>
              
              <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between">
                <Link href="/businesses/demand" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                  Explore Demand <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CARD 3: Find Partners */}
        <motion.div variants={item}>
          <div className="group flex flex-col h-full bg-card border border-slate-200/60 dark:border-slate-800/60 rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/40 transition-all duration-300">
            <Link href="/businesses/partnership" className="relative h-48 w-full overflow-hidden block">
              <Image 
                src={findPartnersImg} 
                alt="Find Partners business professional silhouette handshake with map background"
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 bg-emerald-600/90 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md flex items-center gap-1.5 backdrop-blur-sm">
                <Target className="w-3.5 h-3.5" />
                Partnership
              </div>
            </Link>
            <div className="p-6 flex flex-col flex-grow">
              <Link href="/businesses/partnership">
                <h3 className="font-display font-extrabold text-xl text-foreground group-hover:text-primary transition-colors">
                  Find Strategic Partners
                </h3>
              </Link>
              <p className="text-muted-foreground text-sm mt-2 leading-relaxed flex-grow">
                Form global joint ventures, co-distributor alliances, technical co-operation, and market expansion partnerships with vetted companies.
              </p>
              
              <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between">
                <Link href="/businesses/partnership" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                  Explore Partnerships <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  </div>
  );
}
