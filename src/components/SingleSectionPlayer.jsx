
'use client';

import { Suspense, useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { 
  BookOpen, 
  Headphones, 
  Star, 
  Play, 
  Pause, 
  RotateCcw,
  SkipBack,
  SkipForward
} from 'lucide-react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import SacredCard from '@/components/ui/sacred-card';
import SacredButton from '@/components/ui/sacred-button';
import { useAdvancedAudioPlayer } from '@/hooks/useAdvancedAudioPlayer';

// Lazy load ReactMarkdown for better performance
const ReactMarkdown = dynamic(() => import('react-markdown'), {
  loading: () => (
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
  ),
  ssr: false
});

const remarkGfm = dynamic(() => import('remark-gfm'), { ssr: false });

// Optimized image component with better error handling
function OptimizedImage({ visual, alt, className }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  
  if (imageError) {
    return (
      <SacredCard variant="glass" className="p-8 text-center">
        <div className="text-sacred-blue-500 text-4xl mb-3">📷</div>
        <p className="text-sm text-sacred-blue-600">
          Image temporarily unavailable: {alt || visual.caption}
        </p>
      </SacredCard>
    );
  }
  
  return (
    <div className="relative">
      {imageLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-xl flex items-center justify-center">
          <div className="text-gray-400">Loading...</div>
        </div>
      )}
      <Image
        src={visual.displayUrl}
        alt={alt || visual.caption || 'Guidebook Visual'}
        width={700}
        height={394}
        style={{ objectFit: 'contain', maxWidth: '100%', height: 'auto', display: 'block' }}
        className={`rounded-xl shadow-lg mx-auto ${className || ''}`}
        loading="lazy"
        onLoad={() => setImageLoading(false)}
        onError={() => {
          setImageError(true);
          setImageLoading(false);
        }}
      />
    </div>
  );
}

// Single Track Audio Player Component
function SingleTrackAudioPlayer({ track, title }) {
  // Initialize hook with single track - use empty array and load manually to avoid conflicts
  const audioPlayer = useAdvancedAudioPlayer({
    initialTracks: [],
    autoLoad: false,
    autoPlay: false
  });

  const {
    tracks,
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    speed,
    isLoading,
    error,
    audioRef,
    playPause,
    seek,
    skip,
    restart,
    changeSpeed,
    formatTime
  } = audioPlayer;

  // Load the single track when component mounts
  useEffect(() => {
    if (track && track.audioUrl && tracks.length === 0) {
      // Manually set the tracks to avoid conflicts with autoLoad
      audioPlayer.setTracks?.([track]) || (() => {
        // Fallback: use audioRef directly if setTracks not available
        if (audioRef.current && track.audioUrl) {
          audioRef.current.src = track.audioUrl;
        }
      })();
    }
  }, [track, tracks.length, audioRef]);

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const seekTime = percent * duration;
    seek(seekTime);
  };

  if (error) {
    return (
      <SacredCard variant="glass" className="p-6">
        <div className="text-center text-red-600">
          <Headphones className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="font-semibold">Audio Unavailable</p>
          <p className="text-sm opacity-75 mt-1">{error}</p>
        </div>
      </SacredCard>
    );
  }

  if (!track || !track.audioUrl) {
    return (
      <SacredCard variant="glass" className="p-6">
        <div className="text-center text-sacred-blue-600">
          <Headphones className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="font-semibold">No Audio Available</p>
          <p className="text-sm opacity-75 mt-1">This section does not have an audio track.</p>
        </div>
      </SacredCard>
    );
  }

  return (
    <SacredCard variant="glass" className="p-6">
      <audio ref={audioRef} preload="metadata" />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-serif text-sacred-blue-900 mb-1">
            Audio Experience
          </h3>
          <p className="text-sacred-blue-600 text-sm">
            {title || currentTrack?.title || 'Sacred Journey Audio'}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <SacredButton
            variant="ghost"
            size="sm"
            onClick={changeSpeed}
            className="min-w-[60px]"
          >
            {speed}x
          </SacredButton>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <motion.div 
            className="w-8 h-8 border-2 border-sacred-blue-500 border-t-transparent rounded-full mx-auto mb-3"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-sacred-blue-600">Loading audio...</p>
        </div>
      ) : (
        <>
          {/* Progress Bar */}
          <div className="mb-6">
            <div 
              className="w-full h-2 bg-sacred-blue-100 rounded-full cursor-pointer relative overflow-hidden"
              onClick={handleSeek}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-sacred-blue-500 to-sacred-gold-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.1 }}
              />
              <motion.div
                className="absolute top-0 w-4 h-4 bg-white border-2 border-sacred-blue-500 rounded-full shadow-lg transform -translate-y-1 -translate-x-2 cursor-grab"
                style={{ left: `${progressPercent}%` }}
                whileHover={{ scale: 1.1 }}
                whileDrag={{ scale: 1.2 }}
              />
            </div>
            <div className="flex justify-between mt-2 text-sm text-sacred-blue-600">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-4">
            <motion.button
              onClick={restart}
              className="p-2 text-sacred-blue-600 hover:text-sacred-blue-800 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <RotateCcw className="w-5 h-5" />
            </motion.button>

            <motion.button
              onClick={() => skip(-15)}
              className="p-2 text-sacred-blue-600 hover:text-sacred-blue-800 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <SkipBack className="w-6 h-6" />
            </motion.button>

            <motion.button
              onClick={playPause}
              className="p-4 bg-gradient-to-r from-sacred-blue-500 to-sacred-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isPlaying ? (
                <Pause className="w-8 h-8" />
              ) : (
                <Play className="w-8 h-8 ml-1" />
              )}
            </motion.button>

            <motion.button
              onClick={() => skip(15)}
              className="p-2 text-sacred-blue-600 hover:text-sacred-blue-800 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <SkipForward className="w-6 h-6" />
            </motion.button>

            <motion.button
              onClick={changeSpeed}
              className="p-2 bg-sacred-gold-100 text-sacred-gold-700 rounded-full hover:bg-sacred-gold-200 transition-colors min-w-[48px]"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <span className="text-sm font-semibold">{speed}x</span>
            </motion.button>
          </div>
        </>
      )}
    </SacredCard>
  );
}

// Enhanced markdown content component
function ImmersiveMarkdownContent({ content, components }) {
  return (
    <div className="prose prose-lg max-w-none">
      <ReactMarkdown components={components} remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default function SingleSectionPlayer({ section, visuals, visualsMap, params }) {
  // Destructure sectionSlug from params in client component
  const { sectionSlug } = params;
  
  // Ensure we have valid section data
  if (!section) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <SacredCard variant="heavy" className="p-12 text-center max-w-md">
          <div className="text-sacred-blue-500 text-6xl mb-6">📖</div>
          <h1 className="text-2xl font-serif text-sacred-blue-900 mb-4">Section Not Found</h1>
          <p className="text-sacred-blue-600 mb-6">
            The requested section "{sectionSlug}" could not be loaded.
          </p>
          <SacredButton variant="primary" onClick={() => window.history.back()}>
            Go Back
          </SacredButton>
        </SacredCard>
      </div>
    );
  }

  // Create single track object for the audio player
  const audioTrack = useMemo(() => {
    if (!section.audioUrl) return null;
    
    return {
      id: section.id,
      title: section.title,
      slug: section.slug || String(section.id),
      audioUrl: section.audioUrl
    };
  }, [section]);

  // Enhanced markdown components with immersive styling
  const markdownComponents = useMemo(() => ({
    // Enhanced paragraph styling
    p: ({ node, children }) => {
      // Check if this paragraph contains only an image
      if (node.children.length === 1 && node.children[0].tagName === 'img') {
        return <div className="my-8">{children}</div>;
      }
      return (
        <p className="text-lg leading-relaxed text-gray-700 mb-6 font-light tracking-wide">
          {children}
        </p>
      );
    },
    
    // Enhanced heading styles
    h1: ({ children }) => (
      <h1 className="text-3xl font-serif text-sacred-blue-900 mb-8 mt-12">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-serif text-sacred-blue-900 mb-6 mt-10">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-serif text-sacred-blue-900 mb-4 mt-8">
        {children}
      </h3>
    ),
    
    // Enhanced image handling
    img: ({ node, ...props }) => {
      const imageIdentifier = props.src;
      const normalizedIdentifier = imageIdentifier?.toString().toUpperCase().trim() || '';
      
      const visual = visualsMap?.[normalizedIdentifier];

      if (visual && visual.displayUrl) {
        return (
          <SacredCard variant="glass" className="p-4 my-8">
            <OptimizedImage 
              visual={visual}
              alt={props.alt}
              className="hover:opacity-90 transition-opacity"
            />
            {visual.caption && (
              <div className="text-center mt-4 text-sacred-blue-600 italic">
                {visual.caption}
              </div>
            )}
          </SacredCard>
        );
      }
      return (
        <SacredCard variant="glass" className="p-6 my-8 text-center">
          <div className="text-amber-500 text-2xl mb-2">⚠️</div>
          <p className="text-sacred-blue-600">
            <em>Image: {props.alt || imageIdentifier} not found</em>
          </p>
        </SacredCard>
      );
    },
    
    // Enhanced blockquote
    blockquote: ({ children }) => (
      <SacredCard variant="glass" className="p-6 my-8 border-l-4 border-sacred-gold-500">
        <div className="text-sacred-blue-800 italic text-lg font-light">
          {children}
        </div>
      </SacredCard>
    ),
    
    // Enhanced lists
    ul: ({ children }) => (
      <ul className="space-y-3 my-6 text-gray-700">
        {children}
      </ul>
    ),
    li: ({ children }) => (
      <li className="flex items-start space-x-3">
        <Star className="w-4 h-4 text-sacred-gold-500 mt-1 flex-shrink-0" />
        <span className="text-lg leading-relaxed">{children}</span>
      </li>
    ),
  }), [visualsMap]);

  return (
    <ErrorBoundary fallback={
      <div className="min-h-screen flex items-center justify-center p-6">
        <SacredCard variant="heavy" className="p-12 text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <p className="text-red-600">Something went wrong loading this section.</p>
        </SacredCard>
      </div>
    }>
      <div className="min-h-screen p-4 lg:p-8">
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <SacredCard variant="heavy" className="p-8 lg:p-12 text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 sacred-icon-bg mr-4">
                  <BookOpen className="w-8 h-8" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-sacred-blue-600 uppercase tracking-wider mb-1">
                    Sacred Journey
                  </div>
                  <div className="text-lg text-sacred-blue-800">
                    Section Experience
                  </div>
                </div>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-serif text-sacred-blue-900 mb-6 leading-tight">
                {section.title || 'Untitled Section'}
              </h1>
              
              <p className="text-xl text-sacred-blue-600 max-w-3xl mx-auto leading-relaxed">
                Embark on this transformative journey through guided audio and immersive text. 
                Let the words guide your spiritual awakening.
              </p>
            </SacredCard>
          </motion.div>

          {/* Audio Player */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ErrorBoundary fallback={
              <SacredCard variant="glass" className="p-6 text-center">
                <Headphones className="w-12 h-12 text-red-500 mx-auto mb-3" />
                <p className="text-red-600">Audio player unavailable</p>
              </SacredCard>
            }>
              <SingleTrackAudioPlayer 
                track={audioTrack}
                title={section.title}
              />
            </ErrorBoundary>
          </motion.div>

          {/* Read-Along Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <SacredCard variant="heavy" className="p-8 lg:p-12">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 sacred-icon-bg mr-3">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-serif text-sacred-blue-900">
                    Read-Along Text
                  </h2>
                  <p className="text-sacred-blue-600 text-sm">
                    Follow along as you listen, or read at your own pace
                  </p>
                </div>
              </div>

              <div className="max-w-4xl mx-auto">
                <ErrorBoundary fallback={
                  <SacredCard variant="glass" className="p-8 text-center">
                    <div className="text-red-500 text-2xl mb-3">📄</div>
                    <p className="text-red-600">Content temporarily unavailable</p>
                  </SacredCard>
                }>
                  <Suspense fallback={
                    <div className="space-y-6">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        </div>
                      ))}
                      <div className="text-center text-sacred-blue-600 mt-8">
                        Loading content...
                      </div>
                    </div>
                  }>
                    <ImmersiveMarkdownContent 
                      content={section.markdownContent}
                      components={markdownComponents}
                    />
                  </Suspense>
                </ErrorBoundary>
              </div>
            </SacredCard>
          </motion.div>

          {/* Navigation Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <SacredCard variant="glass" className="p-8 text-center">
              <div className="w-16 h-16 sacred-icon-bg-gold mx-auto mb-6">
                <Star className="w-8 h-8" />
              </div>
              
              <h3 className="text-2xl font-serif text-sacred-blue-900 mb-4">
                Continue Your Journey
              </h3>
              
              <p className="text-sacred-blue-600 mb-6 max-w-2xl mx-auto">
                When you're ready, continue to the next section or return to explore 
                other parts of your Sacred Journey.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <SacredButton 
                  variant="gold" 
                  size="lg"
                  onClick={() => window.history.back()}
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Back to Journey
                </SacredButton>
              </div>
            </SacredCard>
          </motion.div>

        </div>
      </div>
    </ErrorBoundary>
  );
}
