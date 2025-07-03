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
      <div className="h-4 w-3/4 rounded bg-gray-200"></div>
      <div className="h-4 w-1/2 rounded bg-gray-200"></div>
      <div className="h-4 w-5/6 rounded bg-gray-200"></div>
    </div>
  ),
  ssr: false,
});

const remarkGfm = dynamic(() => import('remark-gfm'), { ssr: false });

// Optimized image component with better error handling
function OptimizedImage({ visual, alt, className }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  if (imageError) {
    return (
      <SacredCard variant="glass" className="p-8 text-center">
        <div className="mb-3 text-4xl text-sacred-blue-500">📷</div>
        <p className="text-sm text-sacred-blue-600">
          Image temporarily unavailable: {alt || visual.caption}
        </p>
      </SacredCard>
    );
  }

  return (
    <div className="relative">
      {imageLoading && (
        <div className="absolute inset-0 flex animate-pulse items-center justify-center rounded-xl bg-gray-200">
          <div className="text-gray-400">Loading...</div>
        </div>
      )}
      <Image
        src={visual.displayUrl}
        alt={alt || visual.caption || 'Guidebook Visual'}
        width={700}
        height={394}
        style={{ objectFit: 'contain', maxWidth: '100%', height: 'auto', display: 'block' }}
        className={`mx-auto rounded-xl shadow-lg ${className || ''}`}
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
  // Process markdown content with useMemo (always called)
  const processedContent = useMemo(() => {
    if (!markdownContent) return null;
    return markdownContent;
  }, [markdownContent]);

  if (!section) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sacred-blue-50 to-sacred-gold-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sacred-blue-600 mx-auto"></div>
          <p className="text-sacred-blue-700 font-medium">Loading sacred content...</p>
        </div>
      </div>
    );
  }

  // Enhanced markdown components with immersive styling
  const markdownComponents = useMemo(
    () => ({
      // Enhanced paragraph styling - Fix hydration issue by ensuring valid HTML structure
      p: ({ node, children }) => {
        // Check if this paragraph contains any block-level elements
        const hasBlockElements = node?.children?.some(
          (child) =>
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
          <p className="mb-6 text-lg font-light leading-relaxed tracking-wide text-gray-700">
            {children}
          </p>
        );
      },

      // Enhanced heading styles
      h1: ({ children }) => (
        <h1 className="mb-8 mt-12 font-serif text-3xl text-sacred-blue-900">{children}</h1>
      ),
      h2: ({ children }) => (
        <h2 className="mb-6 mt-10 font-serif text-2xl text-sacred-blue-900">{children}</h2>
      ),
      h3: ({ children }) => (
        <h3 className="mb-4 mt-8 font-serif text-xl text-sacred-blue-900">{children}</h3>
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
                  className="group block"
                >
                  <OptimizedImage
                    visual={visual}
                    alt={props.alt}
                    className="transition-opacity group-hover:opacity-90"
                  />
                </a>
                {visual.caption && (
                  <div className="mt-4 text-center italic text-sacred-blue-600">
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
              <div className="mb-2 text-2xl text-amber-500">⚠️</div>
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
          <SacredCard variant="glass" className="border-l-4 border-sacred-gold-500 p-6">
            <div className="text-lg font-light italic text-sacred-blue-800">{children}</div>
          </SacredCard>
        </div>
      ),

      // Enhanced lists
      ul: ({ children }) => <ul className="my-6 space-y-3 text-gray-700">{children}</ul>,
      li: ({ children }) => (
        <li className="flex items-start space-x-3">
          <Star className="mt-1 h-4 w-4 flex-shrink-0 text-sacred-gold-500" />
          <span className="text-lg leading-relaxed">{children}</span>
        </li>
      ),
    }),
    [visualsMap]
  );

  return (
    <ErrorBoundary
      fallback={
        <div className="flex min-h-screen items-center justify-center p-6">
          <SacredCard variant="heavy" className="p-12 text-center">
            <div className="mb-4 text-4xl text-red-500">⚠️</div>
            <p className="text-red-600">Something went wrong loading this section.</p>
          </SacredCard>
        </div>
      }
    >
      <div className="min-h-screen p-4 lg:p-8">
        <div className="mx-auto max-w-5xl space-y-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <SacredCard variant="heavy" className="p-8 text-center lg:p-12">
              <div className="mb-6 flex items-center justify-center">
                <div className="sacred-icon-bg mr-4 h-16 w-16">
                  <BookOpen className="h-8 w-8" />
                </div>
                <div className="text-left">
                  <div className="mb-1 text-sm font-semibold uppercase tracking-wider text-sacred-blue-600">
                    Sacred Journey
                  </div>
                  <div className="text-lg text-sacred-blue-800">Immersive Experience</div>
                </div>
              </div>

              <h1 className="mb-6 font-serif text-4xl leading-tight text-sacred-blue-900 lg:text-5xl">
                {section.title || 'Untitled Section'}
              </h1>

              <p className="mx-auto max-w-3xl text-xl leading-relaxed text-sacred-blue-600">
                Embark on this transformative journey through guided audio and immersive text. Let
                the words guide your spiritual awakening.
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
              <ErrorBoundary
                fallback={
                  <SacredCard variant="glass" className="p-6 text-center">
                    <Headphones className="mx-auto mb-3 h-12 w-12 text-red-500" />
                    <p className="text-red-600">Audio player unavailable</p>
                  </SacredCard>
                }
              >
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
              <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="sacred-icon-bg h-12 w-12">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="font-serif text-2xl text-sacred-blue-900">Read-Along Text</h2>
                    <p className="text-sm text-sacred-blue-600">
                      Follow along as you listen, or read at your own pace
                    </p>
                  </div>
                </div>
              </div>

              <div className="mx-auto max-w-4xl">
                <ErrorBoundary
                  fallback={
                    <SacredCard variant="glass" className="p-8 text-center">
                      <div className="mb-3 text-2xl text-red-500">📄</div>
                      <p className="text-red-600">Content temporarily unavailable</p>
                    </SacredCard>
                  }
                >
                  <Suspense
                    fallback={
                      <div className="space-y-6">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="animate-pulse">
                            <div className="mb-2 h-4 w-full rounded bg-gray-200"></div>
                            <div className="mb-2 h-4 w-3/4 rounded bg-gray-200"></div>
                            <div className="h-4 w-5/6 rounded bg-gray-200"></div>
                          </div>
                        ))}
                        <div className="mt-8 text-center text-sacred-blue-600">
                          Loading content...
                        </div>
                      </div>
                    }
                  >
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
              <div className="sacred-icon-bg-gold mx-auto mb-6 h-16 w-16">
                <Star className="h-8 w-8" />
              </div>

              <h3 className="mb-4 font-serif text-2xl text-sacred-blue-900">Deepen Your Journey</h3>

              <p className="mx-auto mb-6 max-w-2xl text-sacred-blue-600">
                Complete the guided exercises and reflections to fully integrate the wisdom from
                this section into your spiritual practice.
              </p>

              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <SacredButton variant="gold" size="lg">
                  <Star className="mr-2 h-5 w-5" />
                  View Exercises
                </SacredButton>
                <SacredButton variant="ghost" size="lg">
                  <ExternalLink className="mr-2 h-5 w-5" />
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
