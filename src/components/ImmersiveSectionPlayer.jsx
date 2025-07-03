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
    <div className=&quot;animate-pulse space-y-4&quot;>
      <div className=&quot;h-4 w-3/4 rounded bg-gray-200&quot;></div>
      <div className=&quot;h-4 w-1/2 rounded bg-gray-200&quot;></div>
      <div className=&quot;h-4 w-5/6 rounded bg-gray-200&quot;></div>
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
      <SacredCard variant=&quot;glass&quot; className=&quot;p-8 text-center&quot;>
        <div className=&quot;mb-3 text-4xl text-sacred-blue-500&quot;>📷</div>
        <p className=&quot;text-sm text-sacred-blue-600&quot;>
          Image temporarily unavailable: {alt || visual.caption}
        </p>
      </SacredCard>
    );
  }

  return (
    <div className=&quot;relative&quot;>
      {imageLoading && (
        <div className=&quot;absolute inset-0 flex animate-pulse items-center justify-center rounded-xl bg-gray-200&quot;>
          <div className=&quot;text-gray-400&quot;>Loading...</div>
        </div>
      )}
      <Image
        src={visual.displayUrl}
        alt={alt || visual.caption || 'Guidebook Visual'}
        width={700}
        height={394}
        style={{ objectFit: 'contain', maxWidth: '100%', height: 'auto', display: 'block' }}
        className={`mx-auto rounded-xl shadow-lg ${className || ''}`}
        loading=&quot;lazy&quot;
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
    <div className=&quot;prose prose-lg max-w-none&quot;>
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
      <div className=&quot;flex min-h-screen items-center justify-center p-6&quot;>
        <SacredCard variant=&quot;heavy&quot; className=&quot;max-w-md p-12 text-center&quot;>
          <div className=&quot;mb-6 text-6xl text-sacred-blue-500&quot;>📖</div>
          <h1 className=&quot;mb-4 font-serif text-2xl text-sacred-blue-900&quot;>Section Not Found</h1>
          <p className=&quot;mb-6 text-sacred-blue-600&quot;>
            The requested section &quot;{sectionSlug}&quot; could not be loaded.
          </p>
          <SacredButton variant=&quot;primary&quot; onClick={() => window.history.back()}>
            Go Back
          </SacredButton>
        </SacredCard>
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
          return <div className=&quot;my-6&quot;>{children}</div>;
        }

        // Otherwise render as normal paragraph
        return (
          <p className=&quot;mb-6 text-lg font-light leading-relaxed tracking-wide text-gray-700&quot;>
            {children}
          </p>
        );
      },

      // Enhanced heading styles
      h1: ({ children }) => (
        <h1 className=&quot;mb-8 mt-12 font-serif text-3xl text-sacred-blue-900&quot;>{children}</h1>
      ),
      h2: ({ children }) => (
        <h2 className=&quot;mb-6 mt-10 font-serif text-2xl text-sacred-blue-900&quot;>{children}</h2>
      ),
      h3: ({ children }) => (
        <h3 className=&quot;mb-4 mt-8 font-serif text-xl text-sacred-blue-900&quot;>{children}</h3>
      ),

      // Enhanced image handling - Fix hydration by ensuring proper block-level rendering
      img: ({ node, ...props }) => {
        const imageIdentifier = props.src;
        const normalizedIdentifier = imageIdentifier?.toString().toUpperCase().trim() || '';

        const visual = visualsMap?.[normalizedIdentifier];

        if (visual && visual.displayUrl) {
          return (
            <div className=&quot;my-8&quot;>
              <SacredCard variant=&quot;glass&quot; className=&quot;p-4&quot;>
                <a
                  href={visual.displayUrl}
                  download
                  target=&quot;_blank&quot;
                  rel=&quot;noopener noreferrer&quot;
                  title={`Download ${props.alt || visual.caption}`}
                  className=&quot;group block&quot;
                >
                  <OptimizedImage
                    visual={visual}
                    alt={props.alt}
                    className=&quot;transition-opacity group-hover:opacity-90&quot;
                  />
                </a>
                {visual.caption && (
                  <div className=&quot;mt-4 text-center italic text-sacred-blue-600&quot;>
                    {visual.caption}
                  </div>
                )}
              </SacredCard>
            </div>
          );
        }
        return (
          <div className=&quot;my-8&quot;>
            <SacredCard variant=&quot;glass&quot; className=&quot;p-6 text-center&quot;>
              <div className=&quot;mb-2 text-2xl text-amber-500&quot;>⚠️</div>
              <p className=&quot;text-sacred-blue-600&quot;>
                <em>Image: {props.alt || imageIdentifier} not found</em>
              </p>
            </SacredCard>
          </div>
        );
      },

      // Enhanced blockquote - Fix hydration by ensuring proper block-level rendering
      blockquote: ({ children }) => (
        <div className=&quot;my-8&quot;>
          <SacredCard variant=&quot;glass&quot; className=&quot;border-l-4 border-sacred-gold-500 p-6&quot;>
            <div className=&quot;text-lg font-light italic text-sacred-blue-800&quot;>{children}</div>
          </SacredCard>
        </div>
      ),

      // Enhanced lists
      ul: ({ children }) => <ul className=&quot;my-6 space-y-3 text-gray-700&quot;>{children}</ul>,
      li: ({ children }) => (
        <li className=&quot;flex items-start space-x-3&quot;>
          <Star className=&quot;mt-1 h-4 w-4 flex-shrink-0 text-sacred-gold-500&quot; />
          <span className=&quot;text-lg leading-relaxed&quot;>{children}</span>
        </li>
      ),
    }),
    [visualsMap]
  );

  return (
    <ErrorBoundary
      fallback={
        <div className=&quot;flex min-h-screen items-center justify-center p-6&quot;>
          <SacredCard variant=&quot;heavy&quot; className=&quot;p-12 text-center&quot;>
            <div className=&quot;mb-4 text-4xl text-red-500&quot;>⚠️</div>
            <p className=&quot;text-red-600&quot;>Something went wrong loading this section.</p>
          </SacredCard>
        </div>
      }
    >
      <div className=&quot;min-h-screen p-4 lg:p-8&quot;>
        <div className=&quot;mx-auto max-w-5xl space-y-8&quot;>
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <SacredCard variant=&quot;heavy&quot; className=&quot;p-8 text-center lg:p-12&quot;>
              <div className=&quot;mb-6 flex items-center justify-center&quot;>
                <div className=&quot;sacred-icon-bg mr-4 h-16 w-16&quot;>
                  <BookOpen className=&quot;h-8 w-8&quot; />
                </div>
                <div className=&quot;text-left&quot;>
                  <div className=&quot;mb-1 text-sm font-semibold uppercase tracking-wider text-sacred-blue-600&quot;>
                    Sacred Journey
                  </div>
                  <div className=&quot;text-lg text-sacred-blue-800&quot;>Immersive Experience</div>
                </div>
              </div>

              <h1 className=&quot;mb-6 font-serif text-4xl leading-tight text-sacred-blue-900 lg:text-5xl&quot;>
                {section.title || 'Untitled Section'}
              </h1>

              <p className=&quot;mx-auto max-w-3xl text-xl leading-relaxed text-sacred-blue-600&quot;>
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
                  <SacredCard variant=&quot;glass&quot; className=&quot;p-6 text-center&quot;>
                    <Headphones className=&quot;mx-auto mb-3 h-12 w-12 text-red-500&quot; />
                    <p className=&quot;text-red-600&quot;>Audio player unavailable</p>
                  </SacredCard>
                }
              >
                <UnifiedAudioPlayer
                  mode=&quot;single&quot;
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
            <SacredCard variant=&quot;heavy&quot; className=&quot;p-8 lg:p-12&quot;>
              <div className=&quot;mb-8 flex items-center justify-between&quot;>
                <div className=&quot;flex items-center space-x-3&quot;>
                  <div className=&quot;sacred-icon-bg h-12 w-12&quot;>
                    <BookOpen className=&quot;h-6 w-6&quot; />
                  </div>
                  <div>
                    <h2 className=&quot;font-serif text-2xl text-sacred-blue-900&quot;>Read-Along Text</h2>
                    <p className=&quot;text-sm text-sacred-blue-600&quot;>
                      Follow along as you listen, or read at your own pace
                    </p>
                  </div>
                </div>
              </div>

              <div className=&quot;mx-auto max-w-4xl&quot;>
                <ErrorBoundary
                  fallback={
                    <SacredCard variant=&quot;glass&quot; className=&quot;p-8 text-center&quot;>
                      <div className=&quot;mb-3 text-2xl text-red-500&quot;>📄</div>
                      <p className=&quot;text-red-600&quot;>Content temporarily unavailable</p>
                    </SacredCard>
                  }
                >
                  <Suspense
                    fallback={
                      <div className=&quot;space-y-6&quot;>
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className=&quot;animate-pulse&quot;>
                            <div className=&quot;mb-2 h-4 w-full rounded bg-gray-200&quot;></div>
                            <div className=&quot;mb-2 h-4 w-3/4 rounded bg-gray-200&quot;></div>
                            <div className=&quot;h-4 w-5/6 rounded bg-gray-200&quot;></div>
                          </div>
                        ))}
                        <div className=&quot;mt-8 text-center text-sacred-blue-600&quot;>
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
            <SacredCard variant=&quot;glass&quot; className=&quot;p-8 text-center&quot;>
              <div className=&quot;sacred-icon-bg-gold mx-auto mb-6 h-16 w-16&quot;>
                <Star className=&quot;h-8 w-8&quot; />
              </div>

              <h3 className=&quot;mb-4 font-serif text-2xl text-sacred-blue-900&quot;>Deepen Your Journey</h3>

              <p className=&quot;mx-auto mb-6 max-w-2xl text-sacred-blue-600&quot;>
                Complete the guided exercises and reflections to fully integrate the wisdom from
                this section into your spiritual practice.
              </p>

              <div className=&quot;flex flex-col justify-center gap-4 sm:flex-row&quot;>
                <SacredButton variant=&quot;gold&quot; size=&quot;lg&quot;>
                  <Star className=&quot;mr-2 h-5 w-5&quot; />
                  View Exercises
                </SacredButton>
                <SacredButton variant=&quot;ghost&quot; size=&quot;lg&quot;>
                  <ExternalLink className=&quot;mr-2 h-5 w-5&quot; />
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
