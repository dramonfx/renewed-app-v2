// src/app/book/[sectionSlug]/page.js
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import SectionPageClient from './SectionPageClient';

export default async function SectionPage({ params }) {
  // Pass the full params object to client component to avoid Next.js 15 static analysis error
  // Client components can safely destructure params
  const awaitedParams = await params;
  const { sectionSlug } = awaitedParams;
  
  if (!sectionSlug) {
    notFound();
  }

  try {
    // Fetch section details from sections table
    const { data: section, error: sectionError } = await supabase
      .from('sections')
      .select('*')
      .eq('slug', sectionSlug)
      .single();

    if (sectionError || !section) {
      console.error('Section fetch error:', sectionError?.message);
      notFound();
    }

    // Fetch audio signed URL if audio file exists
    let audioUrl = null;
    if (section.audio_file_path) {
      const { data: audioData, error: audioError } = await supabase.storage
        .from('book-assets')
        .createSignedUrl(section.audio_file_path, 60 * 60);
      
      if (audioError) {
        console.error('Audio Signed URL Error:', audioError.message);
      } else {
        audioUrl = audioData.signedUrl;
      }
    }

    // Fetch markdown content if text file exists
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
      console.warn("Text file is not a .md file, plain text rendering might occur or fail if expecting markdown.");
    }

    // Fetch associated visuals from visuals table
    const { data: visualsData, error: visualsError } = await supabase
      .from('visuals')
      .select('*')
      .eq('section_id', section.id)
      .order('display_order', { ascending: true });

    if (visualsError) {
      console.error('Visuals fetch error:', visualsError.message);
    }

    // Generate signed URLs for all visual files
    let visualsWithUrls = [];
    let visualsMap = new Map();
    
    if (visualsData && visualsData.length > 0) {
      visualsWithUrls = await Promise.all(
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

      // Create visuals map for markdown rendering
      visualsWithUrls.forEach(vis => {
        if (vis.markdown_tag && vis.displayUrl) {
          visualsMap.set(vis.markdown_tag, vis);
        }
      });
    }

    // Prepare section data with all fetched content
    const sectionData = {
      ...section,
      audioUrl,
      markdownContent
    };

    return (
      <SectionPageClient 
        section={sectionData}
        visuals={visualsWithUrls}
        visualsMap={visualsMap}
        params={awaitedParams}
      />
    );
  } catch (error) {
    console.error('Unexpected error in SectionPage:', error);
    notFound();
  }
}
