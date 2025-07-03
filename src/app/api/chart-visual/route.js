import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    // Golden snippet Supabase client setup
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables for chart loading');
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Query visuals table using golden snippet pattern
    let visualData = null;

    const { data: initialData, error: visualError } = await supabase
      .from('visuals')
      .select('file_path, caption')
      .eq('markdown_tag', 'NEXT_STEPS_CHART')
      .single();

    if (visualError) {
      if (visualError.code === 'PGRST116') {
        // Try alternative chart tags
        const alternativeTags = ['![MTC]', 'MTC', 'CHART', 'TRANSFORMATION_CHART'];
        let foundVisual = null;

        for (const tag of alternativeTags) {
          const { data: altData, error: altError } = await supabase
            .from('visuals')
            .select('file_path, caption')
            .eq('markdown_tag', tag)
            .single();

          if (!altError && altData) {
            foundVisual = altData;
            break;
          }
        }

        if (!foundVisual) {
          throw new Error('No transformation chart found with any known tags');
        }

        visualData = foundVisual;
      } else {
        console.error('❌ Database query error:', visualError);
        throw new Error(`Database query failed: ${visualError.message}`);
      }
    } else {
      visualData = initialData;
    }

    if (!visualData?.file_path) {
      throw new Error('Chart visual found but no file_path available');
    }

    // Create signed URL using golden snippet pattern
    const { data: signedUrlData, error: urlError } = await supabase.storage
      .from('book-assets')
      .createSignedUrl(visualData.file_path, 3600); // 1 hour expiry

    if (urlError) {
      console.error('❌ Signed URL generation error:', urlError);
      throw new Error(`Signed URL generation failed: ${urlError.message}`);
    }

    if (!signedUrlData?.signedUrl) {
      throw new Error('Signed URL generation succeeded but no URL returned');
    }

    return NextResponse.json({
      success: true,
      chart: {
        src: signedUrlData.signedUrl,
        alt: visualData.caption || 'Mind Transformation Chart',
        file_path: visualData.file_path,
      },
    });
  } catch (error) {
    console.error('❌ Failed to load chart visual:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'An unexpected error occurred.',
      },
      { status: 500 }
    );
  }
}
