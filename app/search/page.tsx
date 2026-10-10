import { Search as SearchIcon, Filter, ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function SearchPage() {
  return (
    <div className="p-4 lg:p-8 w-full max-w-4xl mx-auto min-h-screen">
      <div className="flex flex-col gap-4 mb-8">
        <label htmlFor="global_search" className="text-sm font-semibold text-muted-foreground uppercase tracking-widest pl-2">Universal Search</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
             <SearchIcon className="w-6 h-6 text-muted-foreground" />
          </div>
          <input 
            id="global_search"
            type="text" 
            autoFocus
            className="w-full bg-card border border-border rounded-full pl-12 pr-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground shadow-sm transition-all" 
            placeholder="Search orbit..." 
          />
          <button className="absolute inset-y-0 right-2 my-auto h-10 px-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
              Search
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none mb-4">
         <FilterChip label="All Results" active />
         <FilterChip label="People" />
         <FilterChip label="Businesses" />
         <FilterChip label="Jobs" />
         <FilterChip label="Projects" />
         <FilterChip label="Investors" />
         <FilterChip label="Ideas" />
      </div>

      <div className="space-y-6">
          <p className="text-sm font-medium text-muted-foreground">Recent searches</p>
          <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-2">
              <RecentSearchItem text="Machine Learning Engineer" type="Job" />
              <RecentSearchItem text="Supply chain logistics Dubai" type="Keyword" />
              <RecentSearchItem text="Sophia Martinez" type="Person" />
              <RecentSearchItem text="Seed Funding AI" type="Funding" />
          </div>

          <div className="mt-8">
              <p className="text-sm font-medium text-muted-foreground mb-4">Suggested starting points</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 border border-border rounded-xl bg-card hover:border-primary/50 cursor-pointer transition-colors flex items-center justify-between">
                      <span className="font-semibold text-sm">Discover verified investors</span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="p-4 border border-border rounded-xl bg-card hover:border-primary/50 cursor-pointer transition-colors flex items-center justify-between">
                      <span className="font-semibold text-sm">Find remote technical roles</span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </div>
              </div>
          </div>
      </div>

    </div>
  );
}

function RecentSearchItem({ text, type }: any) {
    return (
        <div className="flex items-center justify-between py-2 px-3 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors">
            <div className="flex items-center gap-3">
                <SearchIcon className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium text-sm text-foreground">{text}</span>
            </div>
            <span className="text-xs text-muted-foreground bg-secondary px-2 rounded-sm">{type}</span>
        </div>
    )
}

function FilterChip({ label, active }: { label: string, active?: boolean }) {
  return (
    <button className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors border ${active ? 'bg-foreground text-background border-foreground' : 'bg-card text-muted-foreground border-border hover:bg-secondary'}`}>
      {label}
    </button>
  );
}
