
import { createClient } from '@supabase/supabase-js'

export default async function SupabaseTest() {
  // Initialize Supabase client with environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Check for missing environment variables
  if (!supabaseUrl || !supabaseAnonKey) {
    return (
      <div>
        <h1>Supabase Connection Test</h1>
        <h2>Error:</h2>
        <p>Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.</p>
      </div>
    )
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  try {
    console.log('🔍 Querying sections table for prologue...')
    
    // Query sections table for prologue
    const { data, error } = await supabase
      .from('sections')
      .select('audio_file_path')
      .eq('slug', '00_prologue')
      .single()

    if (error) {
      console.error('❌ Database query error:', error)
      throw new Error(`Database query failed: ${error.message}`)
    }

    if (!data) {
      throw new Error('No prologue section found with slug "00_prologue"')
    }

    if (!data.audio_file_path) {
      throw new Error('Prologue section found but no audio_file_path available')
    }

    console.log('✅ Found prologue section with audio file path:', data.audio_file_path)

    // Create signed URL for audio file from book-assets bucket
    console.log('🔗 Creating signed URL for audio file...')
    
    const { data: signedUrlData, error: urlError } = await supabase.storage
      .from('book-assets')
      .createSignedUrl(data.audio_file_path, 3600) // 1 hour expiry

    if (urlError) {
      console.error('❌ Signed URL generation error:', urlError)
      throw new Error(`Signed URL generation failed: ${urlError.message}`)
    }

    if (!signedUrlData?.signedUrl) {
      throw new Error('Signed URL generation succeeded but no URL returned')
    }

    console.log('✅ Successfully generated signed URL')

    return (
      <div>
        <h1>Supabase Connection Test</h1>
        <h2>Prologue Audio URL:</h2>
        <p>{signedUrlData.signedUrl}</p>
      </div>
    )

  } catch (error) {
    console.error('❌ Supabase test error:', error)
    
    return (
      <div>
        <h1>Supabase Connection Test</h1>
        <h2>Error:</h2>
        <p>{error.message}</p>
      </div>
    )
  }
}
