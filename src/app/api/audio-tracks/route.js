
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

/**
 * Golden Snippet Audio Tracks API
 * 
 * Uses the EXACT working pattern from /supabase-test
 * Provides real signed URLs for client-side audio components
 */
export async function GET() {
  try {
    console.log('🔍 API: Loading audio tracks using golden snippet pattern...');

    // EXACT golden snippet Supabase client setup (from working test)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    console.log('🔍 API: Querying sections table for all audio tracks...');

    // Query all sections with audio (EXACT golden snippet pattern)
    const { data: sectionsData, error: sectionsError } = await supabase
      .from('sections')
      .select('id, title, slug, order, audio_file_path')
      .order('order', { ascending: true });

    if (sectionsError) {
      console.error('❌ API: Database query error:', sectionsError);
      throw new Error(`Database query failed: ${sectionsError.message}`);
    }

    if (!sectionsData || sectionsData.length === 0) {
      throw new Error('No sections found in database');
    }

    console.log(`✅ API: Found ${sectionsData.length} sections, generating signed URLs...`);

    // Generate signed URLs using EXACT golden snippet pattern
    const tracksWithUrls = await Promise.all(
      sectionsData.map(async (section) => {
        if (!section.audio_file_path) {
          console.log(`ℹ️ API: Section "${section.title}" has no audio file`);
          return null; // Filter out sections without audio
        }

        try {
          // EXACT golden snippet signed URL generation
          const { data: signedUrlData, error: urlError } = await supabase.storage
            .from('book-assets')
            .createSignedUrl(section.audio_file_path, 3600); // 1 hour expiry

          if (urlError) {
            console.error(`❌ API: Signed URL generation error for ${section.audio_file_path}:`, urlError);
            return null; // Filter out failed URLs
          }

          if (!signedUrlData?.signedUrl) {
            console.error(`❌ API: No signed URL returned for ${section.audio_file_path}`);
            return null; // Filter out empty URLs
          }

          console.log(`✅ API: Generated signed URL for "${section.title}"`);

          return {
            id: section.id,
            title: section.title,
            slug: section.slug || String(section.id),
            audioUrl: signedUrlData.signedUrl,
            order: section.order
          };
        } catch (urlError) {
          console.error(`❌ API: Error processing audio for section ${section.id}:`, urlError);
          return null; // Filter out errors
        }
      })
    );

    // Filter out null entries (sections without audio or errors)
    const validTracks = tracksWithUrls.filter(track => track !== null);
    
    console.log(`✅ API: Successfully processed ${validTracks.length} tracks with signed URLs`);

    return NextResponse.json({
      success: true,
      tracks: validTracks,
      count: validTracks.length,
      message: `Successfully loaded ${validTracks.length} audio tracks using golden snippet pattern`
    });

  } catch (error) {
    console.error('❌ API: Golden snippet audio tracks error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      tracks: [],
      count: 0
    }, { status: 500 });
  }
}
