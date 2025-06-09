// src/app/book/[sectionSlug]/page.js
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const revalidate = 0;

export default async function SectionPage({ params }) {
  const sectionSlug = params.sectionSlug;

  if (!sectionSlug) {
    return <div className="text-red-500 p-6">Error: No section slug provided.</div>;
  }

  // 1. Fetch section data
  const { data: section, error: sectionError } = await supabase
    .from('sections')
    .select('*')
    .eq('slug', sectionSlug)
    .single();

  if (sectionError || !section) {
    return (
      <div className="text-red-500 p-6">
        <p>Error loading section data: {sectionError?.message || 'Section not found.'}</p>
        <p>Attempted to fetch slug: {sectionSlug}</p>
      </div>
    );
  }

  // 2. Fetch visuals for this section, ordered by display_order
  let visualsMap = new Map();
  if (section.id) {
    const { data: visualsData, error: visualsError } = await supabase
      .from('visuals')
      .select('*')
      .eq('section_id', section.id)
      .order('display_order', { ascending: true });

    if (visualsError) {
      console.error('Error fetching visuals:', visualsError.message);
    } else if (visualsData && visualsData.length > 0) {
      const visualsWithUrls = await Promise.all(
        visualsData.map(async (visual) => {
          if (visual.file_path) {
            const { data: signedUrlData, error: signedUrlError } = await supabase.storage
              .from('book-assets')
              .createSignedUrl(visual.file_path, 60 * 60);

            if (signedUrlError) {
              console.error(`Error creating signed URL for visual ${visual.file_path}:`, signedUrlError.message);
              return { ...visual, displayUrl: null, error: signedUrlError.message };
            }
            return { ...visual, displayUrl: signedUrlData.signedUrl };
          }
          return { ...visual, displayUrl: null, error: 'No file path for visual' };
        })
      );
      visualsWithUrls.forEach(vis => {
        if (vis.markdown_tag && vis.displayUrl) {
          visualsMap.set(vis.markdown_tag, vis);
        }
      });
      // --- THIS IS THE DEBUG LOG FOR visualsMap ---
      console.log(`--- DEBUG for slug "${sectionSlug}": visualsMap populated. Size: ${visualsMap.size}`);
      visualsMap.forEach((value, key) => {
        console.log(`--- DEBUG for slug "${sectionSlug}": visualsMap entry - Key: "${key}", Has displayUrl: ${!!value.displayUrl}`);
      });
      // --- END DEBUG LOG FOR visualsMap ---
    }
  }

  // 3. Generate Signed URL for audio
  let audioUrl = null;
  if (section.audio_file_path) {
    const { data, error: audioError } = await supabase.storage
      .from('book-assets')
      .createSignedUrl(section.audio_file_path, 60 * 60);
    if (audioError) {
      console.error('Audio Signed URL Error:', audioError.message);
    } else {
      audioUrl = data.signedUrl;
    }
  }

  // 4. Fetch Markdown file content
  let markdownContent = 'Text content not available for this section.';
  if (section.text_file_path && section.text_file_path.endsWith('.md')) {
    const { data: blobData, error: mdFileDownloadError } = await supabase.storage
      .from('book-assets')
      .download(section.text_file_path);
    if (mdFileDownloadError) {
      console.error('Markdown File Download Error:', mdFileDownloadError.message);
      markdownContent = `Could not load text content. Error: ${mdFileDownloadError.message}`;
    } else if (blobData) {
      try {
        markdownContent = await blobData.text();
      } catch (e) {
        console.error('Markdown File Conversion Error:', e);
        markdownContent = 'Error processing text content.';
      }
    }
  } else if (section.text_file_path) {
    markdownContent = 'Content is not in Markdown format or path is incorrect.';
    console.warn("Text file is not a .md file, plain text rendering might occur or fail if expecting markdown.")
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
      // --- THESE ARE THE DEBUG LOGS FOR THE IMG RENDERER ---
      console.log(`--- MD IMG RENDER for slug "${sectionSlug}": Identifier from MD: "${imageIdentifier}", Alt: "${props.alt}" ---`);
      const visual = visualsMap.get(imageIdentifier);

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

      {audioUrl && (
        <div className="bg-brand-cream p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-sans font-semibold text-brand-blue-dark mb-4">
            Listen: {section.title || 'Audio Guide'}
          </h2>
          <audio controls controlsList="nodownload" src={audioUrl} className="w-full">
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
            {markdownContent}
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