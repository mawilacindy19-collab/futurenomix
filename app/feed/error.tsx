'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { RotateCcw, ArrowLeft } from 'lucide-react';

export default function FeedErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
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
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="w-14 h-14 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center mb-4">
        <RotateCcw className="w-7 h-7 text-destructive" />
      </div>
      <h2 className="text-xl font-bold font-display text-foreground mb-2">
        Unable to load the Feed
      </h2>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">
        There was a connection or loading issue while rendering the community feed.
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
          className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all flex items-center gap-2 shadow-sm"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Retry Feed</span>
        </button>
        <Link
          href="/"
          className="px-4 py-2 rounded-xl bg-secondary text-secondary-foreground font-semibold text-sm hover:bg-secondary/80 transition-all flex items-center gap-2 border border-border"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}
