'use client';

import React, { useRef, useEffect } from 'react';

interface HeroVideoBackgroundProps {
  className?: string;
  defaultTheme?: 'dark' | 'light';
  onTimeUpdate?: (currentTime: number, duration: number, progress: number) => void;
}

export default function HeroVideoBackground({
  className = '',
  onTimeUpdate,
}: HeroVideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTime = () => {
      const cur = video.currentTime || 0;
      const dur = video.duration || 30;
      const pct = dur > 0 ? (cur / dur) * 100 : 0;
      onTimeUpdate?.(cur, dur, pct);
    };

    video.addEventListener('timeupdate', handleTime);
    video.addEventListener('loadedmetadata', handleTime);

    return () => {
      video.removeEventListener('timeupdate', handleTime);
      video.removeEventListener('loadedmetadata', handleTime);
    };
  }, [onTimeUpdate]);

  return (
    <div
      className={`absolute inset-0 -z-10 w-full h-full overflow-hidden bg-[#415977] ${className}`}
      style={{ backgroundColor: '#415977' }}
    >
      {/* Background Video Element - Crystal clear with induced boldness & vivid depth */}
      <video
        ref={videoRef}
        src="/videos/homepage_hero_video.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover object-center filter saturate-[1.28] contrast-[1.12]"
        style={{ backgroundColor: '#415977' }}
      />

      {/* Slightly darkened crystal overlay to make main white body text and neon teal pop intensely */}
      <div className="absolute inset-0 bg-black/35 pointer-events-none z-10" />
    </div>
  );
}
