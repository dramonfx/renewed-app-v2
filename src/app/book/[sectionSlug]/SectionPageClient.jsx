'use client';

import Image from 'next/image';
import { Suspense, useMemo } from 'react';
import dynamic from 'next/dynamic';

// PERFORMANCE OPTIMIZATION: Lazy load ReactMarkdown for better initial page load
const ReactMarkdown = dynamic(() => import('react-markdown'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded"></div>,
  ssr: false // Render markdown on client side to reduce server load
});

const remarkGfm = dynamic(() => import('remark-gfm'), { ssr: false });

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

  // PERFORMANCE OPTIMIZATION: Memoize expensive computations
  const { normalizedVisualsMap, markdownComponents } = useMemo(() => {
    // Helper function to normalize identifiers for consistent lookup
    const normalizeIdentifier = (identifier) => {
      return identifier?.toString().toUpperCase().trim() || '';
    };

    // Create a normalized lookup map for case-insensitive matching
    const createNormalizedVisualsMap = (originalMap) => {
      if (!originalMap) return new Map();
      const normalizedMap = new Map();
      originalMap.forEach((value, key) => {
        const normalizedKey = normalizeIdentifier(key);
        normalizedMap.set(normalizedKey, value);
      });
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
              <Image
                src={visual.displayUrl}
                alt={props.alt || visual.caption || 'Guidebook Visual'}
                width={700}
                height={394}
                style={{ objectFit: 'contain', maxWidth: '100%', height: 'auto', display: 'block' }}
                className="rounded-md shadow-lg mx-auto"
                loading="lazy" // PERFORMANCE: Lazy load images
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
    <div className="space-y-8">
      <h1 className="text-4xl font-serif text-brand-blue-dark text-center mb-10">
        {section.title || 'Untitled Section'}
      </h1>

      {section.audioUrl && (
        <div className="bg-brand-cream p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-sans font-semibold text-brand-blue-dark mb-4">
            Listen: {section.title || 'Audio Guide'}
          </h2>
          <audio controls controlsList="nodownload" src={section.audioUrl} className="w-full">
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      <div className="bg-brand-cream p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-sans font-semibold text-brand-blue-dark mb-4">
          Read-Along Text
        </h2>
        <div className="prose max-w-none prose-p:text-brand-text-main prose-strong:text-brand-text-main font-sans text-brand-text-main">
          <Suspense fallback={<div className="animate-pulse bg-gray-200 h-32 rounded">Loading content...</div>}>
            <ReactMarkdown 
              components={markdownComponents} 
              remarkPlugins={[remarkGfm]}
            >
              {section.markdownContent}
            </ReactMarkdown>
          </Suspense>
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
  );
}
