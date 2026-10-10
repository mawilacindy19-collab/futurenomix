'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Film, Check, Sparkles, X, Sun, Moon, Smartphone, Sliders, Globe } from 'lucide-react';

export interface VideoPreset {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  src: string;
  theme: 'dark' | 'light' | 'combined' | 'nature';
  type: 'landscape' | 'portrait';
}

export const VIDEO_PRESETS: VideoPreset[] = [
  {
    id: 'combined',
    title: 'Infographic Showcase (Dual Theme)',
    subtitle: 'Full 30s loop on cohesive Original background',
    duration: '30s',
    src: '/videos/homepage_hero_video.mp4',
    theme: 'combined',
    type: 'landscape'
  },
  {
    id: 'dark',
    title: 'Economic Analytics (Dark Sheet)',
    subtitle: 'Original background with high-contrast charts',
    duration: '15s',
    src: '/videos/economic_analytics_dark.mp4',
    theme: 'dark',
    type: 'landscape'
  },
  {
    id: 'light',
    title: 'Financial Horizon (Slate Blue Mode)',
    subtitle: 'Original background',
    duration: '15s',
    src: '/videos/financial_horizon_light.mp4',
    theme: 'light',
    type: 'landscape'
  },
  {
    id: 'dark-portrait',
    title: 'Dark Infographic (Vertical 9:16)',
    subtitle: 'Mobile orientation with tilted perspective',
    duration: '15s',
    src: '/videos/economic_analytics_dark_portrait.mp4',
    theme: 'dark',
    type: 'portrait'
  },
  {
    id: 'light-portrait',
    title: 'Light Infographic (Vertical 9:16)',
    subtitle: 'Mobile perspective light financial dashboard',
    duration: '15s',
    src: '/videos/financial_horizon_light_portrait.mp4',
    theme: 'light',
    type: 'portrait'
  },
  {
    id: 'savanna',
    title: 'African Savanna Sunset',
    subtitle: 'Cinematic aerial wildlife & landscape drone footage',
    duration: '15s',
    src: '/videos/african_savanna_sunset.mp4',
    theme: 'nature',
    type: 'landscape'
  }
];

interface HomepageVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentVideoSrc: string;
  onSelectVideo: (src: string) => void;
}

export default function HomepageVideoModal({
  isOpen,
  onClose,
  currentVideoSrc,
  onSelectVideo
}: HomepageVideoModalProps) {
  const [customUrl, setCustomUrl] = useState('');

  const handleApply = (srcToApply: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('futurenomix_hero_video_src', srcToApply);
    }
    onSelectVideo(srcToApply);
    onClose();
  };

  const handleCustomApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrl.trim()) {
      handleApply(customUrl.trim());
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-2xl max-h-[90vh] flex flex-col bg-slate-900 border border-white/15 rounded-3xl shadow-2xl overflow-hidden text-white"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-slate-950/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-black/40 border border-white/20 flex items-center justify-center p-1.5 shadow-md shrink-0">
                  <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M 25 25 L 47.5 25 L 42.5 35 L 37.5 35 L 41.5 43 L 47.5 43 L 45.5 51 L 50 75 Z" fill="#ffffff" />
                    <path d="M 52.5 25 L 75 25 L 58 59 L 50 59 L 61 37 L 52.5 37 Z" fill="#ef4444" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                    Futurenomix Video Library
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-red-600/30 text-red-300 border border-red-500/30">
                      Live Loops
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Switch the background video playing across the Futurenomix homepage hero
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Presets Grid */}
              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-3">
                  Available Homepage Video Loops
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {VIDEO_PRESETS.map((preset) => {
                    const isSelected = currentVideoSrc === preset.src;
                    return (
                      <div
                        key={preset.id}
                        onClick={() => handleApply(preset.src)}
                        className={`group relative flex flex-col p-4 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-red-950/30 border-red-500 shadow-lg shadow-red-900/20 ring-1 ring-red-500'
                            : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex items-center gap-2">
                            {preset.theme === 'dark' && <Moon className="w-4 h-4 text-lime-400" />}
                            {preset.theme === 'light' && <Sun className="w-4 h-4 text-sky-400" />}
                            {preset.theme === 'combined' && <Sparkles className="w-4 h-4 text-red-400" />}
                            {preset.theme === 'nature' && <Globe className="w-4 h-4 text-amber-400" />}
                            <h4 className="text-sm font-bold text-white group-hover:text-red-300 transition-colors">
                              {preset.title}
                            </h4>
                          </div>
                          {isSelected ? (
                            <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0">
                              <Check className="w-3.5 h-3.5" />
                            </span>
                          ) : (
                            <span className="text-[11px] font-mono text-slate-400 font-semibold px-2 py-0.5 rounded-md bg-white/5 border border-white/10">
                              {preset.duration}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed mb-3">
                          {preset.subtitle}
                        </p>
                        <div className="mt-auto flex items-center justify-between text-[11px] text-slate-500 font-mono">
                          <span className="flex items-center gap-1">
                            {preset.type === 'portrait' ? <Smartphone className="w-3 h-3" /> : <Film className="w-3 h-3" />}
                            {preset.type}
                          </span>
                          <span className={isSelected ? 'text-red-400 font-bold' : 'text-slate-400 group-hover:text-white'}>
                            {isSelected ? 'Active Now' : 'Click to Set'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Custom URL Input */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Sliders className="w-4 h-4 text-red-400" />
                  <label htmlFor="custom-video-url" className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                    Custom Video URL (.mp4)
                  </label>
                </div>
                <form onSubmit={handleCustomApply} className="flex gap-2">
                  <input
                    id="custom-video-url"
                    type="url"
                    placeholder="https://example.com/video.mp4"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    className="flex-1 bg-slate-950/70 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition-colors shrink-0"
                  >
                    Apply URL
                  </button>
                </form>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-slate-950/80">
              <span className="text-xs text-slate-400">
                Current: <span className="text-white font-semibold font-mono text-[11px] truncate max-w-[240px] inline-block align-bottom">{currentVideoSrc.split('/').pop()}</span>
              </span>
              <button
                onClick={onClose}
                className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
