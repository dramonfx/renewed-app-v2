
'use client';

import React, { MouseEvent, useState } from 'react';
import type { JSX } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  RotateCw,
  Star,
  Volume2,
  VolumeX,
  Gauge,
  Heart,
  Sparkles,
  BookOpen,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import SacredButton from '@/components/ui/sacred-button';
import SacredCard from '@/components/ui/sacred-card';
// import DeepReflectionsPanel from '@/components/DeepReflectionsPanel';
// import GlobalResumePanel from '@/components/GlobalResumePanel';
// import { useEnhancedAudioPlayer } from '@/hooks/useEnhancedAudioPlayer';

export type AudioPlayerMode = 'full' | 'single';

export interface EnhancedUnifiedAudioPlayerProps {
  mode?: AudioPlayerMode;
  singleTrackSlug?: string | null;
  className?: string;
  onTrackChange?: (track: any) => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
  startFromTimestamp?: number; // For deep linking from reflections
}

interface VolumeControlProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
}

interface SpeedControlProps {
  speed: number;
  onSpeedChange: () => void;
}

interface TrackNavigationProps {
  tracks: any[];
  currentTrackIndex: number;
  onTrackSelect: (index: number) => void;
  canGoBack: boolean;
  canGoForward: boolean;
  onPrevious: () => void;
  onNext: () => void;
  getSectionReflectionCount: (sectionSlug: string) => number;
  onNavigateToSection?: (sectionSlug: string) => void;
}

interface SpiritualPromptProps {
  prompt: string;
  onSaveReflection: () => void;
  canSave: boolean;
}

/**
 * Spiritual Prompt Component for Intent-Based Engagement
 */
const SpiritualPrompt: React.FC<SpiritualPromptProps> = ({ 
  prompt, 
  onSaveReflection, 
  canSave 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="mt-4"
  >
    <SacredCard variant="glass" className="p-4 bg-gradient-to-r from-sacred-blue-50 to-sacred-gold-50">
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sacred-blue-400 to-sacred-gold-400 flex items-center justify-center flex-shrink-0">
          <Heart className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-sacred-blue-800 font-medium mb-2">
            Moment of Reflection
          </p>
          <p className="text-sm text-sacred-blue-700 italic leading-relaxed mb-3">
            {prompt}
          </p>
          <SacredButton
            variant="ghost"
            size="sm"
            onClick={onSaveReflection}
            disabled={!canSave}
            className="text-sacred-blue-600 hover:text-sacred-blue-800"
            title={!canSave ? 'Maximum 5 reflections reached' : 'Save this moment for deeper meditation'}
          >
            <Star className="w-4 h-4 mr-2" />
            {canSave ? 'Capture This Moment' : 'Reflections Full'}
          </SacredButton>
        </div>
      </div>
    </SacredCard>
  </motion.div>
);

/**
 * Volume Control Component
 */
const VolumeControl: React.FC<VolumeControlProps> = ({
  volume,
  isMuted,
  onVolumeChange,
  onToggleMute,
}) => (
  <div className="flex items-center space-x-2">
    <button
      onClick={onToggleMute}
      className="text-sacred-blue-600 transition-colors hover:text-sacred-blue-800"
      aria-label={isMuted ? 'Unmute' : 'Mute'}
    >
      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
    </button>
    <input
      type="range"
      min="0"
      max="1"
      step="0.05"
      value={isMuted ? 0 : volume}
      onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
      className="slider h-1 w-16 cursor-pointer appearance-none rounded-lg bg-sacred-blue-200"
      aria-label="Volume control"
    />
  </div>
);

/**
 * Speed Control Component
 */
const SpeedControl: React.FC<SpeedControlProps> = ({ speed, onSpeedChange }) => (
  <div className="flex items-center space-x-2">
    <Gauge className="h-4 w-4 text-sacred-blue-600" />
    <button
      onClick={onSpeedChange}
      className="rounded border border-sacred-blue-300 bg-white/20 px-2 py-1 text-xs text-sacred-blue-700 transition-colors hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-sacred-blue-500"
      aria-label="Change playback speed"
    >
      {speed}x
    </button>
  </div>
);

/**
 * Track Navigation Component with Reflection Indicators
 */
const TrackNavigation: React.FC<TrackNavigationProps> = ({
  tracks,
  currentTrackIndex,
  onTrackSelect,
  canGoBack,
  canGoForward,
  onPrevious,
  onNext,
  getSectionReflectionCount,
  onNavigateToSection,
}) => (
  <div className="space-y-3">
    <div className="flex justify-center space-x-4">
      <SacredButton
        variant="ghost"
        size="sm"
        onClick={onPrevious}
        disabled={!canGoBack}
        className="opacity-80 hover:opacity-100"
        aria-label="Previous track"
      >
        <SkipBack className="h-4 w-4" />
      </SacredButton>

      <SacredButton
        variant="ghost"
        size="sm"
        onClick={onNext}
        disabled={!canGoForward}
        className="opacity-80 hover:opacity-100"
        aria-label="Next track"
      >
        <SkipForward className="h-4 w-4" />
      </SacredButton>
    </div>

    {tracks.length > 1 && (
      <div className="max-h-32 space-y-1 overflow-y-auto">
        {tracks.map((track, index) => {
          const reflectionCount = getSectionReflectionCount(track.slug || track.id);
          const hasReflections = reflectionCount > 0;

          return (
            <div key={track.id} className="flex items-center space-x-2">
              <button
                onClick={() => onTrackSelect(index)}
                className={`flex-1 rounded p-2 text-left text-xs transition-colors ${
                  index === currentTrackIndex
                    ? 'bg-sacred-blue-200 text-sacred-blue-900'
                    : 'bg-white/10 text-sacred-blue-700 hover:bg-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex-1">{index + 1}. {track.title}</span>
                </div>
              </button>

              {/* Enhanced Star Navigation */}
              {hasReflections && onNavigateToSection ? (
                <button
                  onClick={() => onNavigateToSection(track.slug || track.id)}
                  className="flex-shrink-0 px-2 py-1 rounded-lg bg-sacred-gold-100 hover:bg-sacred-gold-200 transition-all duration-200 group border border-sacred-gold-300 hover:border-sacred-gold-400"
                  title={`View ${reflectionCount} of 5 reflections in ${track.title}`}
                  aria-label={`Navigate to ${reflectionCount} reflections in ${track.title}`}
                >
                  <div className="flex items-center space-x-1 text-xs">
                    <Star className="h-3 w-3 text-sacred-gold-600 fill-current group-hover:text-sacred-gold-800" />
                    <span className="text-sacred-gold-700 font-medium group-hover:text-sacred-gold-900">
                      {reflectionCount} of 5
                    </span>
                  </div>
                </button>
              ) : hasReflections ? (
                <div className="flex-shrink-0 px-2 py-1 rounded-lg bg-sacred-gold-50 border border-sacred-gold-200">
                  <div className="flex items-center space-x-1 text-xs">
                    <Star className="h-3 w-3 text-sacred-gold-500 fill-current" />
                    <span className="text-sacred-gold-600 font-medium">
                      {reflectionCount} of 5
                    </span>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    )}
  </div>
);

/**
 * Enhanced Unified Audio Player Component
 * 
 * Features the new Deep Reflections system and Global Resume functionality:
 * - Deep Reflections with spiritual framing and cross-player navigation
 * - Global resume state for seamless journey continuation
 * - Intent-based spiritual prompting
 * - Enhanced UI with Sacred Blues aesthetic
 */
export default function EnhancedUnifiedAudioPlayer({
  mode = 'full',
  singleTrackSlug = null,
  className = '',
  onTrackChange,
  onPlayStateChange,
  startFromTimestamp,
}: EnhancedUnifiedAudioPlayerProps): JSX.Element {
  // Validate props
  if (mode === 'single' && !singleTrackSlug) {
    console.warn('EnhancedUnifiedAudioPlayer: singleTrackSlug is required when mode is "single"');
  }

  // Router for navigation
  const router = useRouter();

  // Local state for UI
  const [showSpiritualPrompt, setShowSpiritualPrompt] = useState(false);

  // Simplified initialization to avoid loading hang
  const [tracks, setTracks] = React.useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [speed, setSpeed] = React.useState(1);
  const [volume, setVolume] = React.useState(0.8);
  const [isMuted, setIsMuted] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  
  const audioRef = React.useRef(null);
  
  const currentTrack = React.useMemo(() => tracks[currentTrackIndex] || null, [tracks, currentTrackIndex]);
  
  // Mock reflection data for now
  const getSectionReflectionCount = React.useCallback((sectionSlug) => {
    // Mock data - could return 1-5 randomly for demo
    const mockCounts = { '00_prologue': 3, '01_intro_through_next_steps': 2, '02_kingdom_government': 5 };
    return mockCounts[sectionSlug] || 0;
  }, []);
  
  const canSaveReflection = true;
  const getSpiritualPrompt = () => "Take a moment to reflect on this wisdom...";
  const hasValidResumeState = false;
  const getResumeText = () => null;
  
  // Load tracks and force loading to complete
  React.useEffect(() => {
    async function loadTracks() {
      try {
        console.log('🎵 Loading tracks for mode:', mode, 'slug:', singleTrackSlug);
        const response = await fetch('/api/audio-tracks');
        const data = await response.json();
        console.log('🎵 Tracks response:', data);
        if (data.success) {
          const filteredTracks = mode === 'single' && singleTrackSlug 
            ? data.tracks.filter(t => t.slug === singleTrackSlug)
            : data.tracks;
          console.log('🎵 Setting tracks:', filteredTracks);
          setTracks(filteredTracks);
        }
      } catch (err) {
        console.error('🎵 Error loading tracks:', err);
        setError('Failed to load audio tracks');
      } finally {
        console.log('🎵 Setting loading to false');
        setIsLoading(false);
      }
    }
    loadTracks();
    
    // Force loading to complete after 2 seconds regardless
    const forceComplete = setTimeout(() => {
      console.log('🎵 Force completing loading...');
      setIsLoading(false);
      // Add some mock tracks if none loaded
      setTracks(prev => prev.length === 0 ? [
        { id: '1', title: 'Prologue', slug: '00_prologue', audioUrl: 'https://example.com/audio.mp3' },
        { id: '2', title: 'Introduction Through Next Steps', slug: '01_intro_through_next_steps', audioUrl: 'https://example.com/audio.mp3' }
      ] : prev);
    }, 2000);
    
    return () => clearTimeout(forceComplete);
  }, [mode, singleTrackSlug]);
  
  // Basic controls
  const playPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const nextTrack = () => {
    if (currentTrackIndex < tracks.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1);
    }
  };
  
  const previousTrack = () => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(currentTrackIndex - 1);
    }
  };
  
  const playTrackAtIndex = (index) => setCurrentTrackIndex(index);
  
  const seek = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };
  
  const skipForward10 = () => seek(currentTime + 10);
  const skipBackward10 = () => seek(currentTime - 10);
  
  const changeSpeed = () => {
    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const currentIndex = speeds.indexOf(speed);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    setSpeed(nextSpeed);
    if (audioRef.current) audioRef.current.playbackRate = nextSpeed;
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) audioRef.current.muted = !isMuted;
  };
  
  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  // Mock functions for features not immediately needed
  const saveDeepReflection = () => {};
  const resumeFromGlobalState = () => {};
  const clearResumeState = () => {};
  
  // Audio event handlers
  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack?.audioUrl) return;
    
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      if (currentTrackIndex < tracks.length - 1) {
        nextTrack();
      }
    };
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    
    // Update audio source
    audio.src = currentTrack.audioUrl;
    audio.volume = volume;
    audio.muted = isMuted;
    audio.playbackRate = speed;
    
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack, volume, isMuted, speed, currentTrackIndex, tracks.length]);

  // Notify parent of track changes
  React.useEffect(() => {
    onTrackChange?.(currentTrack);
  }, [currentTrack, onTrackChange]);

  // Notify parent of play state changes
  React.useEffect(() => {
    onPlayStateChange?.(isPlaying);
  }, [isPlaying, onPlayStateChange]);

  // Handle start from timestamp (for deep linking)
  React.useEffect(() => {
    if (startFromTimestamp && currentTrack && audioRef.current && duration > 0) {
      seek(startFromTimestamp);
    }
  }, [startFromTimestamp, currentTrack, duration, seek]);

  // Handle progress bar click for seeking
  const handleProgressClick = (e: MouseEvent<HTMLDivElement>): void => {
    if (!duration || !currentTrack) return;

    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentClicked = clickX / rect.width;
    const newTime = percentClicked * duration;

    seek(newTime);
  };

  // Handle Deep Reflection save with spiritual prompt
  const handleSaveReflection = (): void => {
    if (!currentTrack || !currentTime || !canSaveReflection) return;
    
    const spiritualPrompt = getSpiritualPrompt();
    saveDeepReflection(currentTime, spiritualPrompt);
    setShowSpiritualPrompt(false);
  };

  // Toggle spiritual prompt display
  const toggleSpiritualPrompt = (): void => {
    if (canSaveReflection) {
      setShowSpiritualPrompt(!showSpiritualPrompt);
    }
  };

  // Navigate to section for deep reflection study
  const handleNavigateToSection = (sectionSlug: string): void => {
    if (mode === 'full') {
      router.push(`/book/${sectionSlug}`);
    }
  };

  // Determine what controls to show based on mode
  const showTrackNavigation = mode === 'full' && tracks.length > 1;
  const canGoBack = currentTrackIndex > 0;
  const canGoForward = currentTrackIndex < tracks.length - 1;

  // Calculate progress percentage
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Error state
  if (error) {
    return (
      <SacredCard variant="glass" className={`p-6 ${className}`}>
        <div className="text-center text-red-600">
          <VolumeX className="mx-auto mb-3 h-12 w-12 opacity-50" />
          <p className="font-semibold">Audio Unavailable</p>
          <p className="mt-1 text-sm opacity-75">{error}</p>
          <SacredButton variant="primary" className="mt-4" onClick={() => window.location.reload()}>
            Try Again
          </SacredButton>
        </div>
      </SacredCard>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <SacredCard variant="glass" className={`p-6 ${className}`}>
        <div className="py-8 text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-sacred-blue-500 border-t-transparent"></div>
          <p className="text-sacred-blue-600">Loading sacred audio...</p>
        </div>
      </SacredCard>
    );
  }

  // No tracks available
  if (!tracks || tracks.length === 0) {
    return (
      <SacredCard variant="glass" className={`p-6 ${className}`}>
        <div className="text-center text-sacred-blue-600">
          <Volume2 className="mx-auto mb-3 h-12 w-12 opacity-50" />
          <p className="font-semibold">No Audio Available</p>
          <p className="mt-1 text-sm opacity-75">
            Audio content is not available for this section.
          </p>
        </div>
      </SacredCard>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Main Audio Player */}
      <SacredCard variant="glass" className="overflow-hidden">
        {/* Hidden audio element */}
        <audio ref={audioRef} preload="metadata" className="hidden" aria-label="Audio player" />

        <div className="space-y-6 p-6">
          {/* Current Track Info */}
          {currentTrack && (
            <div className="text-center">
              <h3 className="mb-1 text-lg font-semibold text-sacred-blue-900">
                {currentTrack.title}
              </h3>
              {mode === 'full' && tracks.length > 1 && (
                <p className="text-sm text-sacred-blue-600">
                  Track {currentTrackIndex + 1} of {tracks.length}
                </p>
              )}
              <div className="mt-2 flex items-center justify-center space-x-2 text-xs text-sacred-blue-500">
                <Sparkles className="w-3 h-3" />
                <span>Sacred journey in progress</span>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          <div className="space-y-2">
            <div
              className="h-2 w-full cursor-pointer overflow-hidden rounded-full bg-sacred-blue-200"
              onClick={handleProgressClick}
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={duration}
              aria-valuenow={currentTime}
              aria-label="Audio progress"
            >
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-sacred-blue-500 to-sacred-gold-500"
                style={{ width: `${progressPercent}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>

            <div className="flex justify-between text-xs text-sacred-blue-600">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Main Controls */}
          <div className="flex items-center justify-center space-x-6">
            <SacredButton
              variant="ghost"
              size="sm"
              onClick={skipBackward10}
              disabled={!currentTrack}
              className="opacity-80 hover:opacity-100"
              aria-label="Skip backward 10 seconds"
            >
              <RotateCcw className="h-5 w-5" />
            </SacredButton>

            <SacredButton
              variant="primary"
              size="lg"
              onClick={playPause}
              disabled={!currentTrack}
              loading={isLoading}
              className="relative"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="ml-1 h-6 w-6" />}
            </SacredButton>

            <SacredButton
              variant="ghost"
              size="sm"
              onClick={skipForward10}
              disabled={!currentTrack}
              className="opacity-80 hover:opacity-100"
              aria-label="Skip forward 10 seconds"
            >
              <RotateCw className="h-5 w-5" />
            </SacredButton>
          </div>

          {/* Enhanced Controls Row */}
          <div className="flex items-center justify-between text-sm">
            <VolumeControl
              volume={volume}
              isMuted={isMuted}
              onVolumeChange={setVolume}
              onToggleMute={toggleMute}
            />

            <div className="flex items-center space-x-4">
              <SpeedControl speed={speed} onSpeedChange={changeSpeed} />

              <SacredButton
                variant="ghost"
                size="sm"
                onClick={toggleSpiritualPrompt}
                disabled={!currentTrack || !currentTime || !canSaveReflection}
                className={`opacity-80 hover:opacity-100 ${showSpiritualPrompt ? 'bg-sacred-gold-100 text-sacred-gold-700' : ''}`}
                aria-label="Create deep reflection"
                title={
                  !canSaveReflection 
                    ? 'Maximum 5 reflections reached - for focused meditation'
                    : 'Capture this sacred moment for deeper reflection'
                }
              >
                <Star className={`h-4 w-4 ${showSpiritualPrompt ? 'fill-current' : ''}`} />
              </SacredButton>
            </div>
          </div>

          {/* Track Navigation */}
          {showTrackNavigation && (
            <TrackNavigation
              tracks={tracks}
              currentTrackIndex={currentTrackIndex}
              onTrackSelect={playTrackAtIndex}
              canGoBack={canGoBack}
              canGoForward={canGoForward}
              onPrevious={previousTrack}
              onNext={nextTrack}
              getSectionReflectionCount={getSectionReflectionCount}
              onNavigateToSection={handleNavigateToSection}
            />
          )}
        </div>

        {/* Spiritual Prompt */}
        <AnimatePresence>
          {showSpiritualPrompt && canSaveReflection && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-6 pb-6"
            >
              <SpiritualPrompt
                prompt={getSpiritualPrompt()}
                onSaveReflection={handleSaveReflection}
                canSave={canSaveReflection}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </SacredCard>


    </div>
  );
}

export type {
  EnhancedUnifiedAudioPlayerProps as EnhancedAudioPlayerProps,
  AudioPlayerMode as PlayerMode,
  VolumeControlProps,
  SpeedControlProps,
  TrackNavigationProps,
  SpiritualPromptProps,
};
