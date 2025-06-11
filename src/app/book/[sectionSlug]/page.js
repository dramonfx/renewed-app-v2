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
      console.error('Section fetch error for slug:', sectionSlug, 'Error:', sectionError?.message);
      console.error('Available sections:', Object.keys(require('@/lib/mockData').mockSections));
      notFound();
    }

    // PERFORMANCE OPTIMIZATION: Use Promise.all for parallel operations
    const [audioResult, markdownResult, visualsResult] = await Promise.all([
      // Fetch audio signed URL if audio file exists
      section.audio_file_path 
        ? supabase.storage
            .from('book-assets')
            .createSignedUrl(section.audio_file_path, 60 * 60)
            .then(({ data, error }) => ({ data, error }))
        : Promise.resolve({ data: null, error: null }),
      
      // Fetch markdown content if text file exists - with size limit check
      section.text_file_path && section.text_file_path.endsWith('.md')
        ? supabase.storage
            .from('book-assets')
            .download(section.text_file_path)
            .then(async ({ data: blobData, error }) => {
              if (error) return { content: `Could not load text content. Error: ${error.message}`, error };
              if (!blobData) return { content: 'Text content not available for this section.', error: null };
              
              // PERFORMANCE: Check file size before processing
              if (blobData.size > 1024 * 1024) { // 1MB limit
                return { content: 'Content too large to process efficiently.', error: null };
              }
              
              try {
                const content = await blobData.text();
                return { content, error: null };
              } catch (e) {
                console.error('Markdown File Conversion Error:', e);
                return { content: 'Error processing text content.', error: e };
              }
            })
        : Promise.resolve({ 
            content: section.text_file_path 
              ? 'Content is not in Markdown format or path is incorrect.' 
              : 'Text content not available for this section.',
            error: null 
          }),
      
      // Fetch associated visuals from visuals table
      supabase
        .from('visuals')
        .select('*')
        .eq('section_id', section.id)
        .order('display_order', { ascending: true })
        .then(({ data, error }) => ({ data, error }))
    ]);

    // Process results
    let audioUrl = null;
    if (audioResult.error) {
      console.error('Audio Signed URL Error:', audioResult.error.message);
    } else if (audioResult.data) {
      audioUrl = audioResult.data.signedUrl;
    }

    const markdownContent = markdownResult.content;
    if (markdownResult.error) {
      console.error('Markdown processing error:', markdownResult.error);
    }

    if (visualsResult.error) {
      console.error('Visuals fetch error:', visualsResult.error.message);
    }

    // PERFORMANCE OPTIMIZATION: Limit concurrent visual URL generations
    let visualsWithUrls = [];
    let visualsMap = new Map();
    
    if (visualsResult.data && visualsResult.data.length > 0) {
      // Process visuals in batches to avoid overwhelming the server
      const BATCH_SIZE = 5;
      const visualBatches = [];
      
      for (let i = 0; i < visualsResult.data.length; i += BATCH_SIZE) {
        visualBatches.push(visualsResult.data.slice(i, i + BATCH_SIZE));
      }
      
      for (const batch of visualBatches) {
        const batchResults = await Promise.all(
          batch.map(async (visual) => {
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
        
        visualsWithUrls.push(...batchResults);
      }

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
