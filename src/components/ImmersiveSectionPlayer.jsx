'use client';

import { Suspense, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { BookOpen, Headphones, Star, ExternalLink } from 'lucide-react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import SacredCard from '@/components/ui/sacred-card';
import SacredButton from '@/components/ui/sacred-button';
import UnifiedAudioPlayer from '@/components/UnifiedAudioPlayer';

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

export default function ImmersiveSectionPlayer({ section, visuals, visualsMap, params }) {
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

  // Enhanced markdown components with immersive styling
  const markdownComponents = useMemo(() => ({
    // Enhanced paragraph styling - Fix hydration issue by ensuring valid HTML structure
    p: ({ node, children }) => {
      // Check if this paragraph contains any block-level elements
      const hasBlockElements = node?.children?.some(child => 
        child.tagName === 'img' || 
        child.tagName === 'div' || 
        child.tagName === 'blockquote' ||
        child.tagName === 'h1' || 
        child.tagName === 'h2' || 
        child.tagName === 'h3' ||
        child.tagName === 'ul' ||
        child.tagName === 'ol'
      );
      
      // If it contains block elements, render as div to avoid invalid HTML nesting
      if (hasBlockElements) {
        return <div className="my-6">{children}</div>;
      }
      
      // Otherwise render as normal paragraph
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
    
    // Enhanced image handling - Fix hydration by ensuring proper block-level rendering
    img: ({ node, ...props }) => {
      const imageIdentifier = props.src;
      const normalizedIdentifier = imageIdentifier?.toString().toUpperCase().trim() || '';
      
      const visual = visualsMap?.[normalizedIdentifier];

      if (visual && visual.displayUrl) {
        return (
          <div className="my-8">
            <SacredCard variant="glass" className="p-4">
              <a
                href={visual.displayUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                title={`Download ${props.alt || visual.caption}`}
                className="block group"
              >
                <OptimizedImage 
                  visual={visual}
                  alt={props.alt}
                  className="group-hover:opacity-90 transition-opacity"
                />
              </a>
              {visual.caption && (
                <div className="text-center mt-4 text-sacred-blue-600 italic">
                  {visual.caption}
                </div>
              )}
            </SacredCard>
          </div>
        );
      }
      return (
        <div className="my-8">
          <SacredCard variant="glass" className="p-6 text-center">
            <div className="text-amber-500 text-2xl mb-2">⚠️</div>
            <p className="text-sacred-blue-600">
              <em>Image: {props.alt || imageIdentifier} not found</em>
            </p>
          </SacredCard>
        </div>
      );
    },
    
    // Enhanced blockquote - Fix hydration by ensuring proper block-level rendering
    blockquote: ({ children }) => (
      <div className="my-8">
        <SacredCard variant="glass" className="p-6 border-l-4 border-sacred-gold-500">
          <div className="text-sacred-blue-800 italic text-lg font-light">
            {children}
          </div>
        </SacredCard>
      </div>
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
                    Immersive Experience
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
          {section.audioUrl && (
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
                <UnifiedAudioPlayer 
                  mode="single" 
                  singleTrackSlug={params?.sectionSlug || section.slug}
                />
              </ErrorBoundary>
            </motion.div>
          )}

          {/* Read-Along Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <SacredCard variant="heavy" className="p-8 lg:p-12">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 sacred-icon-bg">
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

          {/* Exercises Section */}
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
                Deepen Your Journey
              </h3>
              
              <p className="text-sacred-blue-600 mb-6 max-w-2xl mx-auto">
                Complete the guided exercises and reflections to fully integrate 
                the wisdom from this section into your spiritual practice.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <SacredButton variant="gold" size="lg">
                  <Star className="w-5 h-5 mr-2" />
                  View Exercises
                </SacredButton>
                <SacredButton variant="ghost" size="lg">
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Share Insights
                </SacredButton>
              </div>
            </SacredCard>
          </motion.div>

        </div>
      </div>
    </ErrorBoundary>
  );
}