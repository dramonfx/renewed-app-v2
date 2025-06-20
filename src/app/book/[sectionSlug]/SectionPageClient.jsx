'use client';

import Image from 'next/image';
import { Suspense, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { ErrorBoundary } from '@/components/ErrorBoundary';

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

// Simple markdown content component without chunking
function MarkdownContent({ content, components }) {
  return (
    <ReactMarkdown components={components} remarkPlugins={[remarkGfm]}>
      {content}
    </ReactMarkdown>
  );
}

// PERFORMANCE: Optimized image component with better error handling
function OptimizedImage({ visual, alt, className }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  
  if (imageError) {
    return (
      <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-md p-8 text-center">
        <div className="text-gray-500 mb-2">📷</div>
        <p className="text-sm text-gray-600">
          Image temporarily unavailable: {alt || visual.caption}
        </p>
      </div>
    );
  }
  
  return (
    <div className="relative">
      {imageLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-md flex items-center justify-center">
          <div className="text-gray-400">Loading...</div>
        </div>
      )}
      <Image
        src={visual.displayUrl}
        alt={alt || visual.caption || 'Guidebook Visual'}
        width={700}
        height={394}
        style={{ objectFit: 'contain', maxWidth: '100%', height: 'auto', display: 'block' }}
        className={`rounded-md shadow-lg mx-auto ${className || ''}`}
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

export default function SectionPageClient({ section, visuals, visualsMap, params }) {
  // Destructure sectionSlug from params in client component (safe in Next.js 15)
  const { sectionSlug } = params;
  
  // Ensure we have valid section data
  if (!section) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-serif text-red-600 mb-4">Section Not Found</h1>
        <p className="text-brand-text-muted">The requested section "{sectionSlug}" could not be loaded.</p>
      </div>
    );
  }

  // Simple markdown components for rendering with valid HTML structure
  const markdownComponents = useMemo(() => ({
    // Use div instead of p to avoid nesting issues with block elements
    p: ({ node, children }) => {
      // Check if this paragraph contains only an image
      if (node.children.length === 1 && node.children[0].tagName === 'img') {
        return <div className="mb-4">{children}</div>;
      }
      return <div className="mb-4">{children}</div>;
    },
    img: ({ node, ...props }) => {
      const imageIdentifier = props.src;
      const normalizedIdentifier = imageIdentifier?.toString().toUpperCase().trim() || '';
      
      // Use direct lookup in visualsMap (now a plain object)
      const visual = visualsMap?.[normalizedIdentifier];

      if (visual && visual.displayUrl) {
        return (
          <div className="my-8">
            <a
              href={visual.displayUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              title={`Download ${props.alt || visual.caption}`}
              className="inline-block"
            >
              <OptimizedImage 
                visual={visual}
                alt={props.alt}
                className=""
              />
            </a>
            {visual.caption && (
              <div className="text-sm text-brand-text-muted mt-2 text-center">
                {visual.caption}
              </div>
            )}
          </div>
        );
      }
      return (
        <div className="block text-red-500 my-4 text-center">
          <em>[Image: {props.alt || imageIdentifier} not found or URL missing]</em>
        </div>
      );
    },
  }), [visualsMap]);

  return (
    <ErrorBoundary fallback={<div className="text-center py-12 text-red-600">Something went wrong loading this section.</div>}>
      <div className="space-y-8">
        <h1 className="text-4xl font-serif text-sacred-blue-900 text-center mb-10">
          {section.title || 'Untitled Section'}
        </h1>

        {section.audioUrl && (
          <ErrorBoundary fallback={<div className="text-red-500 text-center">Audio player unavailable</div>}>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <h2 className="text-2xl font-sans font-semibold text-sacred-blue-900 mb-4">
                Listen: {section.title || 'Audio Guide'}
              </h2>
              <audio controls controlsList="nodownload" src={section.audioUrl} className="w-full">
                Your browser does not support the audio element.
              </audio>
            </div>
          </ErrorBoundary>
        )}

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-2xl font-sans font-semibold text-sacred-blue-900 mb-4">
            Read-Along Text
          </h2>
          <div className="prose max-w-none prose-p:text-gray-700 prose-strong:text-gray-700 font-sans text-gray-700">
            <ErrorBoundary fallback={<div className="text-red-500">Content temporarily unavailable</div>}>
              <Suspense fallback={
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="text-center text-gray-500">Loading content...</div>
                </div>
              }>
                <MarkdownContent 
                  content={section.markdownContent}
                  components={markdownComponents}
                />
              </Suspense>
            </ErrorBoundary>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-2xl font-sans font-semibold text-sacred-blue-900 mb-4">
            Guidebook Exercises
          </h2>
          <div className="flex items-center space-x-3 mb-4">
            <span className="text-sacred-gold-500 text-2xl">☀️</span>
            <p className="text-gray-600 font-sans">
              View exercises to complete this section.
            </p>
          </div>
          <button
            type="button"
            className="bg-sacred-gold-500 hover:bg-sacred-gold-600 text-white font-sans font-semibold py-3 px-6 rounded-lg shadow-md transition duration-150 ease-in-out"
          >
            View Exercises
          </button>
        </div>
      </div>
    </ErrorBoundary>
  );
}
