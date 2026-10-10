import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ExplorePage() {
  return (
    <div className="p-4 lg:p-8 w-full max-w-5xl mx-auto min-h-screen">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-secondary/80 hover:bg-secondary text-foreground text-xs font-semibold transition-colors border border-border shadow-2xs">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold">Explore</h1>
        <p className="text-muted-foreground mt-2">Discover ideas, startups, and potential partners in the orbit ecosystem.</p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8 max-w-2xl">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
           <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        <input 
          type="text" 
          className="w-full bg-card border border-border rounded-full pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground shadow-sm transition-all" 
          placeholder="Search for people, businesses, investors, ideas..." 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Category Cards */}
        <ExploreCategoryCard 
          title="Trending Ideas" 
          description="Discover the most discussed concepts this week."
          color="bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
        />
        <ExploreCategoryCard 
          title="Hot Startups" 
          description="Early stage companies looking for traction and funding."
          color="bg-purple-500/10 text-purple-500 border-purple-500/20"
        />
        <ExploreCategoryCard 
          title="Active Investors" 
          description="Firms and angels actively deploying capital."
          color="bg-green-500/10 text-green-500 border-green-500/20"
        />
        <ExploreCategoryCard 
          title="Supply Chain Needs" 
          description="Businesses looking for logistics and manufacturing partners."
          color="bg-blue-500/10 text-blue-500 border-blue-500/20"
        />
        <ExploreCategoryCard 
          title="Co-founder Matching" 
          description="Talented individuals looking to team up."
          color="bg-red-500/10 text-red-500 border-red-500/20"
        />
        <ExploreCategoryCard 
          title="Community Projects" 
          description="Local initiatives making an impact."
          color="bg-teal-500/10 text-teal-500 border-teal-500/20"
        />
      </div>

    </div>
  );
}

function ExploreCategoryCard({ title, description, color }: { title: string, description: string, color: string }) {
  return (
    <div className={`p-6 rounded-xl border cursor-pointer hover:shadow-md transition-all ${color}`}>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-sm opacity-90">{description}</p>
    </div>
  );
}
