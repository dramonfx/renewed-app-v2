// src/app/book/[sectionSlug]/page.js
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import SectionPageClient from './SectionPageClient';
import { performanceCache } from '@/lib/performanceCache';

// PERFORMANCE: Add request timeout wrapper
const withTimeout = (promise, timeoutMs = 10000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error(`Request timeout after ${timeoutMs}ms`)), timeoutMs)
    )
  ]);
};

// PERFORMANCE: Circuit breaker for failing operations
class CircuitBreaker {
  constructor(threshold = 3, timeout = 30000) {
    this.failureCount = 0;
    this.threshold = threshold;
    this.timeout = timeout;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.nextAttempt = Date.now();
  }

  async execute(operation) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit breaker is OPEN');
      }
      this.state = 'HALF_OPEN';
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }

  onFailure() {
    this.failureCount++;
    if (this.failureCount >= this.threshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.timeout;
    }
  }
}

const circuitBreaker = new CircuitBreaker();

export default async function SectionPage({ params }) {
  const startTime = Date.now();
  
  try {
    // Pass the full params object to client component to avoid Next.js 15 static analysis error
    const awaitedParams = await params;
    const { sectionSlug } = awaitedParams;
    
    if (!sectionSlug) {
      notFound();
    }

    // PERFORMANCE: Check cache first
    const cacheKey = `section_${sectionSlug}`;
    const cachedData = performanceCache.get(cacheKey);
    if (cachedData) {
      console.log(`Cache hit for ${sectionSlug} - served in ${Date.now() - startTime}ms`);
      return (
        <SectionPageClient 
          section={cachedData.section}
          visuals={cachedData.visuals}
          visualsMap={cachedData.visualsMap}
          params={awaitedParams}
        />
      );
    }

    // PERFORMANCE: Use circuit breaker for database operations
    const sectionData = await circuitBreaker.execute(async () => {
      return await withTimeout(
        supabase
          .from('sections')
          .select('*')
          .eq('slug', sectionSlug)
          .single(),
        5000 // 5 second timeout for section fetch
      );
    });

    const { data: section, error: sectionError } = sectionData;

    if (sectionError || !section) {
      console.error('Section fetch error for slug:', sectionSlug, 'Error:', sectionError?.message);
      console.error('Available sections:', Object.keys(require('@/lib/mockData').mockSections));
      notFound();
    }

    // PERFORMANCE: Optimized parallel operations with individual timeouts
    const [audioResult, markdownResult, visualsResult] = await Promise.allSettled([
      // Audio with shorter timeout
      section.audio_file_path 
        ? withTimeout(
            supabase.storage
              .from('book-assets')
              .createSignedUrl(section.audio_file_path, 60 * 60),
            3000 // 3 second timeout for audio
          ).catch(error => ({ data: null, error }))
        : Promise.resolve({ data: null, error: null }),
      
      // Markdown with chunking and size limits
      section.text_file_path && section.text_file_path.endsWith('.md')
        ? withTimeout(
            processMarkdownContent(section.text_file_path),
            8000 // 8 second timeout for markdown
          ).catch(error => ({ content: 'Content temporarily unavailable', error }))
        : Promise.resolve({ 
            content: section.text_file_path 
              ? 'Content is not in Markdown format or path is incorrect.' 
              : 'Text content not available for this section.',
            error: null 
          }),
      
      // Visuals with timeout
      withTimeout(
        supabase
          .from('visuals')
          .select('*')
          .eq('section_id', section.id)
          .order('display_order', { ascending: true }),
        5000 // 5 second timeout for visuals
      ).catch(error => ({ data: [], error }))
    ]);

    // Process results with error handling
    let audioUrl = null;
    if (audioResult.status === 'fulfilled' && audioResult.value.data) {
      audioUrl = audioResult.value.data.signedUrl;
    } else if (audioResult.status === 'rejected') {
      console.error('Audio fetch failed:', audioResult.reason);
    }

    let markdownContent = 'Content temporarily unavailable';
    if (markdownResult.status === 'fulfilled') {
      markdownContent = markdownResult.value.content;
    } else {
      console.error('Markdown fetch failed:', markdownResult.reason);
    }

    let visualsData = [];
    if (visualsResult.status === 'fulfilled' && visualsResult.value.data) {
      visualsData = visualsResult.value.data;
    } else {
      console.error('Visuals fetch failed:', visualsResult.reason);
    }

    // PERFORMANCE: Optimized visual processing with early returns
    let visualsWithUrls = [];
    let visualsMap = new Map();
    
    if (visualsData.length > 0) {
      // Limit visual processing to prevent timeouts
      const MAX_VISUALS = 20;
      const limitedVisuals = visualsData.slice(0, MAX_VISUALS);
      
      try {
        visualsWithUrls = await processVisualsOptimized(limitedVisuals);
        
        // Create visuals map for markdown rendering
        visualsWithUrls.forEach(vis => {
          if (vis.markdown_tag && vis.displayUrl) {
            visualsMap.set(vis.markdown_tag, vis);
          }
        });
      } catch (error) {
        console.error('Visual processing failed:', error);
        // Continue without visuals rather than failing completely
      }
    }

    // Prepare section data
    const finalSectionData = {
      ...section,
      audioUrl,
      markdownContent
    };

    // PERFORMANCE: Cache the result
    const cacheData = {
      section: finalSectionData,
      visuals: visualsWithUrls,
      visualsMap
    };
    performanceCache.set(cacheKey, cacheData, 300000); // 5 minute cache

    const totalTime = Date.now() - startTime;
    console.log(`Section ${sectionSlug} loaded in ${totalTime}ms`);

    return (
      <SectionPageClient 
        section={finalSectionData}
        visuals={visualsWithUrls}
        visualsMap={visualsMap}
        params={awaitedParams}
      />
    );
  } catch (error) {
    console.error('Unexpected error in SectionPage:', error);
    const totalTime = Date.now() - startTime;
    console.error(`Section failed after ${totalTime}ms`);
    notFound();
  }
}

// PERFORMANCE: Optimized markdown processing with chunking
async function processMarkdownContent(textFilePath) {
  try {
    const { data: blobData, error } = await supabase.storage
      .from('book-assets')
      .download(textFilePath);

    if (error) {
      return { content: `Could not load text content. Error: ${error.message}`, error };
    }
    
    if (!blobData) {
      return { content: 'Text content not available for this section.', error: null };
    }

    // PERFORMANCE: Check file size and implement chunking
    const MAX_SIZE = 512 * 1024; // 512KB limit
    if (blobData.size > MAX_SIZE) {
      // For large files, read in chunks
      const reader = blobData.stream().getReader();
      let content = '';
      let totalSize = 0;
      
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          totalSize += value.length;
          if (totalSize > MAX_SIZE) {
            content += '\n\n[Content truncated due to size limits]';
            break;
          }
          
          content += new TextDecoder().decode(value);
        }
        return { content, error: null };
      } finally {
        reader.releaseLock();
      }
    }

    // For smaller files, process normally
    const content = await blobData.text();
    return { content, error: null };
  } catch (e) {
    console.error('Markdown File Processing Error:', e);
    return { content: 'Error processing text content.', error: e };
  }
}

// PERFORMANCE: Optimized visual processing with concurrency control
async function processVisualsOptimized(visuals) {
  const CONCURRENT_LIMIT = 3; // Process max 3 visuals at once
  const results = [];
  
  for (let i = 0; i < visuals.length; i += CONCURRENT_LIMIT) {
    const batch = visuals.slice(i, i + CONCURRENT_LIMIT);
    
    const batchPromises = batch.map(async (visual) => {
      if (!visual.file_path) {
        return { ...visual, displayUrl: null, error: 'No file path for visual' };
      }
      
      try {
        const { data: signedUrlData, error: signedUrlError } = await withTimeout(
          supabase.storage
            .from('book-assets')
            .createSignedUrl(visual.file_path, 60 * 60),
          2000 // 2 second timeout per visual
        );

        if (signedUrlError) {
          console.error(`Error creating signed URL for visual ${visual.file_path}:`, signedUrlError.message);
          return { ...visual, displayUrl: null, error: signedUrlError.message };
        }
        
        return { ...visual, displayUrl: signedUrlData.signedUrl };
      } catch (error) {
        console.error(`Timeout or error processing visual ${visual.file_path}:`, error);
        return { ...visual, displayUrl: null, error: error.message };
      }
    });
    
    const batchResults = await Promise.allSettled(batchPromises);
    const processedBatch = batchResults.map(result => 
      result.status === 'fulfilled' ? result.value : { displayUrl: null, error: 'Processing failed' }
    );
    
    results.push(...processedBatch);
  }
  
  return results;
}