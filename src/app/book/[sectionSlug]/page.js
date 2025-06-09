// src/app/book/[sectionSlug]/page.js
'use client';

import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useSection, useVisuals } from '@/hooks';

export default function SectionPage({ params }) {
  const sectionSlug = params.sectionSlug;
  
  const { data: section, loading: sectionLoading, error: sectionError } = useSection(sectionSlug);
  const { visualsMap, loading: visualsLoading, error: visualsError } = useVisuals(section?.id);

  if (sectionLoading || visualsLoading) {
    return <div className="text-center p-10 font-sans text-brand-text-main">Loading section...</div>;
  }

  if (sectionError) {
    return (
      <div className="text-red-500 p-6">
        <p>Error loading section data: {sectionError}</p>
        <p>Attempted to fetch slug: {sectionSlug}</p>
      </div>
    );
  }

  if (!section) {
    return <div className="text-red-500 p-6">Section not found.</div>;
  }

  if (visualsError) {
    console.error('Error loading visuals:', visualsError);
  }

  // Debug logs for visualsMap
  console.log(`--- DEBUG for slug "${sectionSlug}": visualsMap populated. Size: ${visualsMap?.size || 0}`);
  visualsMap?.forEach((value, key) => {
    console.log(`--- DEBUG for slug "${sectionSlug}": visualsMap entry - Key: "${key}", Has displayUrl: ${!!value.displayUrl}`);
  });

  const markdownComponents = {
    p: ({ node, children }) => {
      if (node.children.length === 1 && node.children[0].tagName === 'img') {
        return <>{children}</>;
      }
      return <p className="mb-4">{children}</p>;
    },
    img: ({ node, ...props }) => {
      const imageIdentifier = props.src;
      // --- THESE ARE THE DEBUG LOGS FOR THE IMG RENDERER ---
      console.log(`--- MD IMG RENDER for slug "${sectionSlug}": Identifier from MD: "${imageIdentifier}", Alt: "${props.alt}" ---`);
      const visual = visualsMap?.get(imageIdentifier);

      if (visual) {
        console.log(`--- MD IMG RENDER for slug "${sectionSlug}": Found visual in map for "${imageIdentifier}". Display URL: ${visual.displayUrl}`);
      } else {
        console.error(`--- MD IMG RENDER ERROR for slug "${sectionSlug}": No visual found in map for identifier: "${imageIdentifier}" ---`);
      }
      // --- END DEBUG LOGS FOR IMG RENDERER ---

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
              priority={true}
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
          <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]}>
            {section.markdownContent}
          </ReactMarkdown>
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