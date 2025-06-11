'use client';

import Image from 'next/image';
import { Suspense, useMemo, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// PERFORMANCE OPTIMIZATION: Lazy load ReactMarkdown with better loading state
const ReactMarkdown = dynamic(() => import('react-markdown'), {
  loading: () => (
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
  ),
  ssr: false // Render markdown on client side to reduce server load
});

const remarkGfm = dynamic(() => import('remark-gfm'), { ssr: false });

// PERFORMANCE: Chunked content component for large markdown
function ChunkedMarkdownContent({ content, components }) {
  const [visibleChunks, setVisibleChunks] = useState(1);
  const CHUNK_SIZE = 2000; // Characters per chunk
  
  const chunks = useMemo(() => {
    if (!content || content.length <= CHUNK_SIZE) {
      return [content];
    }
    
    const chunks = [];
    for (let i = 0; i < content.length; i += CHUNK_SIZE) {
      chunks.push(content.slice(i, i + CHUNK_SIZE));
    }
    return chunks;
  }, [content]);
  
  const loadMoreChunks = useCallback(() => {
    setVisibleChunks(prev => Math.min(prev + 2, chunks.length));
  }, [chunks.length]);
  
  if (chunks.length === 1) {
    return (
      <ReactMarkdown components={components} remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    );
  }
  
  return (
    <div className="space-y-4">
      {chunks.slice(0, visibleChunks).map((chunk, index) => (
        <div key={index}>
          <ReactMarkdown components={components} remarkPlugins={[remarkGfm]}>
            {chunk}
          </ReactMarkdown>
        </div>
      ))}
      
      {visibleChunks < chunks.length && (
        <div className="text-center py-4">
          <button
            onClick={loadMoreChunks}
            className="bg-brand-gold hover:bg-yellow-400 text-brand-blue-dark font-sans font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out"
          >
            Load More Content ({chunks.length - visibleChunks} sections remaining)
          </button>
        </div>
      )}
    </div>
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

  // PERFORMANCE OPTIMIZATION: Memoize expensive computations with better error handling
  const { normalizedVisualsMap, markdownComponents } = useMemo(() => {
    // Helper function to normalize identifiers for consistent lookup
    const normalizeIdentifier = (identifier) => {
      return identifier?.toString().toUpperCase().trim() || '';
    };

    // Create a normalized lookup map for case-insensitive matching
    const createNormalizedVisualsMap = (originalMap) => {
      if (!originalMap) return new Map();
      const normalizedMap = new Map();
      try {
        originalMap.forEach((value, key) => {
          const normalizedKey = normalizeIdentifier(key);
          normalizedMap.set(normalizedKey, value);
        });
      } catch (error) {
        console.error('Error creating normalized visuals map:', error);
      }
      return normalizedMap;
    };

    const normalizedVisualsMap = createNormalizedVisualsMap(visualsMap);

    // Debug logs for visualsMap (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log(`--- DEBUG for slug "${sectionSlug}": visualsMap populated. Size: ${visualsMap?.size || 0}`);
      visualsMap?.forEach((value, key) => {
        console.log(`--- DEBUG for slug "${sectionSlug}": visualsMap entry - Key: "${key}", Has displayUrl: ${!!value.displayUrl}`);
      });
    }

    const markdownComponents = {
      p: ({ node, children }) => {
        if (node.children.length === 1 && node.children[0].tagName === 'img') {
          return <>{children}</>;
        }
        return <p className="mb-4">{children}</p>;
      },
      img: ({ node, ...props }) => {
        const imageIdentifier = props.src;
        const normalizedIdentifier = normalizeIdentifier(imageIdentifier);
        
        // Debug logs only in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`--- MD IMG RENDER for slug "${sectionSlug}": Identifier from MD: "${imageIdentifier}", Normalized: "${normalizedIdentifier}", Alt: "${props.alt}" ---`);
        }
        
        // Use normalized lookup to find the visual
        const visual = normalizedVisualsMap?.get(normalizedIdentifier);

        if (visual) {
          if (process.env.NODE_ENV === 'development') {
            console.log(`--- MD IMG RENDER for slug "${sectionSlug}": Found visual in map for "${imageIdentifier}". Display URL: ${visual.displayUrl}`);
          }
        } else {
          // Only log error if the visual is truly missing from the normalized map
          if (normalizedVisualsMap?.size > 0 && process.env.NODE_ENV === 'development') {
            console.error(`--- MD IMG RENDER ERROR for slug "${sectionSlug}": No visual found in map for identifier: "${imageIdentifier}" (normalized: "${normalizedIdentifier}") ---`);
          }
        }

        if (visual && visual.displayUrl) {
          return (
            <a
              href={visual.displayUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              title={`Download ${props.alt || visual.caption}`}
              className="inline-block my-8"
            >
              <OptimizedImage 
                visual={visual}
                alt={props.alt}
                className=""
              />
              {visual.caption && (
                <span className="block text-sm text-brand-text-muted mt-2 text-center">
                  {visual.caption}
                </span>
              )}
            </a>
          );
        }
        return (
          <em className="block text-red-500 my-4 text-center">
            [Image: {props.alt || imageIdentifier} not found or URL missing]
          </em>
        );
      },
    };

    return { normalizedVisualsMap, markdownComponents };
  }, [visualsMap, sectionSlug]);

  return (
    <ErrorBoundary fallback={<div className="text-center py-12 text-red-600">Something went wrong loading this section.</div>}>
      <div className="space-y-8">
        <h1 className="text-4xl font-serif text-brand-blue-dark text-center mb-10">
          {section.title || 'Untitled Section'}
        </h1>

        {section.audioUrl && (
          <ErrorBoundary fallback={<div className="text-red-500 text-center">Audio player unavailable</div>}>
            <div className="bg-brand-cream p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-sans font-semibold text-brand-blue-dark mb-4">
                Listen: {section.title || 'Audio Guide'}
              </h2>
              <audio controls controlsList="nodownload" src={section.audioUrl} className="w-full">
                Your browser does not support the audio element.
              </audio>
            </div>
          </ErrorBoundary>
        )}

        <div className="bg-brand-cream p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-sans font-semibold text-brand-blue-dark mb-4">
            Read-Along Text
          </h2>
          <div className="prose max-w-none prose-p:text-brand-text-main prose-strong:text-brand-text-main font-sans text-brand-text-main">
            <ErrorBoundary fallback={<div className="text-red-500">Content temporarily unavailable</div>}>
              <Suspense fallback={
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="text-center text-gray-500">Loading content...</div>
                </div>
              }>
                <ChunkedMarkdownContent 
                  content={section.markdownContent}
                  components={markdownComponents}
                />
              </Suspense>
            </ErrorBoundary>
          </div>
        </div>

        <div className="bg-brand-cream p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-sans font-semibold text-brand-blue-dark mb-4">
            Guidebook Exercises
          </h2>
          <div className="flex items-center space-x-3 mb-4">
            <span className="text-brand-gold text-2xl">☀️</span>
            <p className="text-brand-text-muted font-sans">
              View exercises to complete this section.
            </p>
          </div>
          <button
            type="button"
            className="bg-brand-gold hover:bg-yellow-400 text-brand-blue-dark font-sans font-semibold py-3 px-6 rounded-lg shadow-md transition duration-150 ease-in-out"
          >
            View Exercises
          </button>
        </div>
      </div>
    </ErrorBoundary>
  );
}