'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { RotateCcw, Home } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // If it is a chunk load error, automatically try reloading once
    const msg = error?.message || '';
    if (msg.includes('ChunkLoadError') || msg.includes('Loading chunk') || msg.includes('Invalid or unexpected token')) {
      try {
        const lastReload = sessionStorage.getItem('orbit_last_chunk_reload');
        const now = Date.now();
        if (!lastReload || now - parseInt(lastReload, 10) > 8000) {
          sessionStorage.setItem('orbit_last_chunk_reload', String(now));
          window.location.reload();
        }
      } catch {
        window.location.reload();
      }
    }
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center mb-6">
        <RotateCcw className="w-8 h-8 text-destructive" />
      </div>
      <h2 className="text-2xl font-bold font-display text-foreground mb-2">
        Something unexpected happened
      </h2>
      <p className="text-sm text-muted-foreground max-w-md mb-6">
        We encountered a hiccup loading this view. You can reload the page or return to the main dashboard.
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            try {
              reset();
            } catch {
              window.location.reload();
            }
          }}
          className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all flex items-center gap-2 shadow-sm"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl bg-secondary text-secondary-foreground font-semibold text-sm hover:bg-secondary/80 transition-all flex items-center gap-2 border border-border"
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </Link>
      </div>
    </div>
  );
}
