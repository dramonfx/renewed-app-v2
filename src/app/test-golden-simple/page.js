
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import SacredCard from '@/components/ui/sacred-card';

export default function TestGoldenSimplePage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function testGoldenSnippet() {
      try {
        setLoading(true);
        setError(null);

        console.log('🔍 Testing golden snippet pattern in React component...');

        // EXACT golden snippet pattern from working supabase-test
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
          throw new Error('Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
        }

        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        console.log('🔍 Querying sections table for prologue...');

        // Query sections table for prologue (EXACT pattern from working test)
        const { data, error } = await supabase
          .from('sections')
          .select('audio_file_path')
          .eq('slug', '00_prologue')
          .single();

        if (error) {
          console.error('❌ Database query error:', error);
          throw new Error(`Database query failed: ${error.message}`);
        }

        if (!data) {
          throw new Error('No prologue section found with slug "00_prologue"');
        }

        if (!data.audio_file_path) {
          throw new Error('Prologue section found but no audio_file_path available');
        }

        console.log('✅ Found prologue section with audio file path:', data.audio_file_path);

        // Create signed URL for audio file from book-assets bucket (EXACT pattern)
        console.log('🔗 Creating signed URL for audio file...');

        const { data: signedUrlData, error: urlError } = await supabase.storage
          .from('book-assets')
          .createSignedUrl(data.audio_file_path, 3600); // 1 hour expiry

        if (urlError) {
          console.error('❌ Signed URL generation error:', urlError);
          throw new Error(`Signed URL generation failed: ${urlError.message}`);
        }

        if (!signedUrlData?.signedUrl) {
          throw new Error('Signed URL generation succeeded but no URL returned');
        }

        console.log('✅ Successfully generated signed URL');

        setResult({
          audioFilePath: data.audio_file_path,
          signedUrl: signedUrlData.signedUrl,
          success: true
        });

      } catch (err) {
        console.error('❌ Golden snippet test error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    testGoldenSnippet();
  }, []);

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <SacredCard variant="heavy" className="p-8">
          <div className="text-center">
            <h1 className="text-3xl font-serif text-sacred-blue-900 mb-4">
              🧪 Simple Golden Snippet Test
            </h1>
            <p className="text-sacred-blue-600 text-lg mb-4">
              Testing the exact golden snippet pattern from working supabase-test page
              but inside a React component with useEffect.
            </p>
          </div>
        </SacredCard>

        <SacredCard variant="glass" className="p-6">
          <h2 className="text-xl font-serif text-sacred-blue-900 mb-4 text-center">
            Golden Snippet Test Results
          </h2>
          
          {loading && (
            <div className="text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-sacred-gradient flex items-center justify-center animate-pulse">
                <span className="text-white text-lg">🔍</span>
              </div>
              <p className="text-sacred-blue-600">Testing golden snippet pattern...</p>
            </div>
          )}

          {error && (
            <div className="text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-red-600 text-lg">❌</span>
              </div>
              <h3 className="text-lg font-serif text-red-700">Error</h3>
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {result && result.success && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-3">
                  <span className="text-green-600 text-lg">✅</span>
                </div>
                <h3 className="text-lg font-serif text-green-700 mb-4">Success!</h3>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-2">Results:</h4>
                <div className="space-y-2 text-sm">
                  <p className="text-green-700">
                    <strong>Audio File Path:</strong> {result.audioFilePath}
                  </p>
                  <p className="text-green-700 break-all">
                    <strong>Signed URL:</strong> {result.signedUrl}
                  </p>
                  <p className="text-green-600 text-xs mt-2">
                    ✨ Golden snippet pattern working correctly in React component!
                  </p>
                </div>
              </div>
            </div>
          )}
        </SacredCard>

        <SacredCard variant="glass" className="p-4">
          <h3 className="text-md font-serif text-sacred-blue-900 mb-3 text-center">
            Environment Status
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <p className="text-sacred-blue-900 font-semibold">Supabase URL</p>
              <p className="text-sacred-blue-600">
                {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sacred-blue-900 font-semibold">Supabase Key</p>
              <p className="text-sacred-blue-600">
                {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}
              </p>
            </div>
          </div>
        </SacredCard>
      </div>
    </div>
  );
}
