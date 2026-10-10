'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  Sparkles, 
  Activity, 
  TrendingUp, 
  CheckCircle2, 
  RotateCcw
} from 'lucide-react';

interface VideoItem {
  id: string;
  title: string;
  category: string;
  description: string;
  src: string;
  durationLabel: string;
}

const HOMEPAGE_VIDEOS: VideoItem[] = [
  {
    id: 'economic-analytics',
    title: 'Economic Analytics & Macroeconomic Projections',
    category: 'Market Intelligence',
    description: 'Real-time redenominated conversion, fiscal buffer simulations, and global parity indexing from 1967 through 2028.',
    src: '/videos/homepage_hero_video.mp4',
    durationLabel: '0:30',
  },
  {
    id: 'financial-horizon',
    title: 'Financial Horizon & Emerging Markets Index',
    category: 'Venture Capital',
    description: 'Dynamic debt sustainability vectors, RTGS framework integrations, and capital allocation models across African hubs.',
    src: '/videos/financial_horizon_light.mp4',
    durationLabel: '0:15',
  },
  {
    id: 'city-innovation',
    title: 'Pan-African Metropolitan Ecosystem & Metropolis',
    category: 'Ecosystem Pulse',
    description: 'Strategic city networks connecting Johannesburg, Cape Town, Nairobi, London, and Silicon Valley capital syndicates.',
    src: '/videos/african_savanna_sunset.mp4',
    durationLabel: '0:20',
  },
];

type VideoAreaSize = 'standard' | 'expanded' | 'theater';

export default function HomepageVideoShowcase() {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [areaSize, setAreaSize] = useState<VideoAreaSize>('expanded');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const activeVideo = HOMEPAGE_VIDEOS[activeVideoIndex];

  // Auto-play when video changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    }
  }, [activeVideoIndex]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime || 0);
      setDuration(videoRef.current.duration || 30);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const secStr = secs < 10 ? "0" + secs : String(secs);
    return mins + ":" + secStr;
  };

  // Dimensions based on increased area size
  const containerClasses = {
    standard: 'max-w-4xl min-h-[380px]',
    expanded: 'max-w-6xl min-h-[520px]',
    theater: 'max-w-7xl min-h-[640px]',
  }[areaSize];

  return (
    <section 
      id="homepage-videos-section" 
      className="relative w-full py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#3290D5] to-[#061D44] border-y border-[#3d351a] shadow-2xl overflow-hidden transition-all duration-500 text-[#f7f4ea]"
      style={{ background: 'linear-gradient(180deg, #3290D5 0%, #061D44 100%)' }}
    >
      {/* Slate Dark Ambient Gradient Accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#3d351a]/60 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#1f1b0d]/80 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Section Header */}
        <div className="text-center max-w-3xl mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1c180c] border border-[#4a4023] shadow-xs text-amber-300 text-xs font-semibold mb-3 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Slate Dark Video Studio &amp; High-Contrast Showcase</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-sm">
            Economic Intelligence &amp; Ecosystem Video Showcase
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#e5ded0] font-medium max-w-2xl mx-auto leading-relaxed">
            Expanded high-resolution video streams of macroeconomic modeling, capital distribution pathways, and high-growth venture opportunities on cohesive Slate Dark (<span className="font-mono font-semibold text-amber-300">HEX #0f172a</span> | <span className="font-mono text-amber-300">RGB 40, 35, 17</span>).
          </p>
        </div>

        {/* Video Area Space Size Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-6 bg-[#1c180c]/90 p-1.5 rounded-2xl border border-[#4a4023] shadow-md backdrop-blur-md">
          <span className="text-xs font-bold uppercase tracking-wider text-[#d0c6b0] px-3 font-mono">
            Video Space Area:
          </span>

          <button
            type="button"
            onClick={() => setAreaSize('standard')}
            className={`w-full ${containerClasses} rounded-3xl overflow-hidden bg-gradient-to-b from-[#3290D5] to-[#061D44] border-2 border-[#4a4023] shadow-2xl transition-all duration-500 relative flex flex-col`}
          >
            <span>Standard Area</span>
          </button>

          <button
            type="button"
            onClick={() => setAreaSize('expanded')}
            className={`w-full ${containerClasses} rounded-3xl overflow-hidden bg-gradient-to-b from-[#3290D5] to-[#061D44] border-2 border-[#4a4023] shadow-2xl transition-all duration-500 relative flex flex-col`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Enlarged Area (+35%)</span>
          </button>

          <button
            type="button"
            onClick={() => setAreaSize('theater')}
            className={`w-full ${containerClasses} rounded-3xl overflow-hidden bg-gradient-to-b from-[#3290D5] to-[#061D44] border-2 border-[#4a4023] shadow-2xl transition-all duration-500 relative flex flex-col`}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Ultra-Wide Theater Area (+75%)</span>
          </button>
        </div>

        {/* Video Switcher Tabs */}
        <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mb-6">
          {HOMEPAGE_VIDEOS.map((item, idx) => {
            const isActive = idx === activeVideoIndex;
            return (
              <button
                key={item.id}
                onClick={() => setActiveVideoIndex(idx)}
                className={`w-full ${containerClasses} rounded-3xl overflow-hidden bg-gradient-to-b from-[#3290D5] to-[#061D44] border-2 border-[#4a4023] shadow-2xl transition-all duration-500 relative flex flex-col`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 font-mono">
                    {item.category}
                  </span>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-gradient-to-b from-[#3290D5] to-[#061D44] text-amber-300 border border-[#4a4023]">
                    {item.durationLabel}
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1">
                  {item.title}
                </h4>
              </button>
            );
          })}
        </div>

        {/* The Video Space Container with Slate Dark Background */}
        <div 
          className={`w-full ${containerClasses} rounded-3xl overflow-hidden bg-gradient-to-b from-[#3290D5] to-[#061D44] border-2 border-[#4a4023] shadow-2xl transition-all duration-500 relative flex flex-col`}
          style={{ background: 'linear-gradient(180deg, #3290D5 0%, #061D44 100%)' }}
        >
          {/* Top Frame Status Bar */}
          <div className="w-full px-5 py-3 bg-[#1c180c] border-b border-[#3d351a] flex items-center justify-between text-xs text-[#e5ded0] backdrop-blur-md z-20">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
              </span>
              <span className="font-bold text-white truncate max-w-[260px] sm:max-w-md">{activeVideo.title}</span>
            </div>

            <div className="flex items-center gap-3 font-mono text-[11px] text-[#d0c6b0]">
              <span className="hidden sm:inline-block bg-gradient-to-b from-[#3290D5] to-[#061D44] text-amber-300 border border-[#4a4023] px-2.5 py-0.5 rounded-md font-semibold">
                Canvas: Slate Dark (#0f172a | rgb(15, 23, 42))
              </span>
              <span className="text-amber-200">{formatTime(currentTime)} / {formatTime(duration)}</span>
            </div>
          </div>

          {/* Main Video Viewport */}
          <div 
            className="relative w-full flex-1 min-h-[320px] sm:min-h-[460px] bg-gradient-to-b from-[#3290D5] to-[#061D44] overflow-hidden flex items-center justify-center"
            style={{ background: 'linear-gradient(180deg, #3290D5 0%, #061D44 100%)' }}
          >
            <video
              ref={videoRef}
              src={activeVideo.src}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              onTimeUpdate={handleTimeUpdate}
              className="w-full h-full object-contain sm:object-cover bg-gradient-to-b from-[#3290D5] to-[#061D44] transition-all duration-300"
              style={{ background: 'linear-gradient(180deg, #3290D5 0%, #061D44 100%)' }}
            />

            {/* Subtle Slate Dark Border & Corner Accents */}
            <div className="absolute inset-0 pointer-events-none border border-[#4a4023]/60" />

            {/* Floating Quick Action Overlay */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
              <button
                type="button"
                onClick={toggleMute}
                className="p-2.5 rounded-full bg-[#1c180c]/85 hover:bg-[#1c180c] text-amber-300 border border-[#4a4023] backdrop-blur-md transition-all shadow-md cursor-pointer"
                title={isMuted ? 'Unmute' : 'Mute'}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={() => setAreaSize(areaSize === 'theater' ? 'standard' : 'theater')}
                className="p-2.5 rounded-full bg-[#1c180c]/85 hover:bg-[#1c180c] text-amber-300 border border-[#4a4023] backdrop-blur-md transition-all shadow-md cursor-pointer"
                title={areaSize === 'theater' ? 'Exit Theater Mode' : 'Expand Video Space Area'}
                aria-label="Toggle Full Area"
              >
                {areaSize === 'theater' ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Big Center Play/Pause button on hover/paused */}
            {!isPlaying && (
              <button
                type="button"
                onClick={togglePlay}
                className="absolute z-20 w-16 h-16 rounded-full bg-amber-600 text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all cursor-pointer ring-4 ring-amber-500/40"
                aria-label="Play Video"
              >
                <Play className="w-7 h-7 translate-x-0.5 fill-white" />
              </button>
            )}
          </div>

          {/* Interactive Player Controls Bar */}
          <div className="w-full px-5 py-3.5 bg-[#1c180c] border-t border-[#3d351a] flex flex-col gap-2 z-20 text-[#e5ded0]">
            {/* Progress Bar Scrubber */}
            <div className="flex items-center gap-3 w-full">
              <span className="text-[11px] font-mono text-amber-300/90">{formatTime(currentTime)}</span>
              <input
                type="range"
                min={0}
                max={duration || 30}
                step={0.1}
                value={currentTime}
                onChange={handleSeek}
                className="flex-1 h-1.5 bg-gradient-to-b from-[#3290D5] to-[#061D44] rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <span className="text-[11px] font-mono text-[#d0c6b0]">{formatTime(duration)}</span>
            </div>

            {/* Bottom Row Controls */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Play</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.currentTime = 0;
                      videoRef.current.play();
                      setIsPlaying(true);
                    }
                  }}
                  className="p-1.5 rounded-lg text-[#d0c6b0] hover:bg-gradient-to-b from-[#3290D5] to-[#061D44] hover:text-white transition-colors cursor-pointer"
                  title="Replay from start"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-3 text-xs text-[#d0c6b0]">
                <p className="hidden md:inline-block text-[11px] text-[#d0c6b0] line-clamp-1 max-w-sm">
                  {activeVideo.description}
                </p>
                <button
                  type="button"
                  onClick={() => setAreaSize(areaSize === 'theater' ? 'expanded' : 'theater')}
                  className="px-3 py-1.5 rounded-xl border border-[#4a4023] hover:bg-gradient-to-b from-[#3290D5] to-[#061D44] text-amber-300 font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Maximize2 className="w-3 h-3 text-amber-400" />
                  <span>{areaSize === 'theater' ? 'Standard Area' : 'Enlarge Area'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Area Dimensions Explainer Card */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-[#d0c6b0] font-medium">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            <span>Slate Dark Background (<span className="font-mono text-amber-300">HEX #0f172a</span> | <span className="font-mono text-amber-300">RGB 40, 35, 17</span>)</span>
          </div>
          <span className="text-[#524724]">·</span>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            <span>Dark Typography &amp; High-Contrast Readability</span>
          </div>
          <span className="text-[#524724]">·</span>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            <span>Spacious Cinematic Video Theater</span>
          </div>
        </div>
      </div>
    </section>
  );
}
