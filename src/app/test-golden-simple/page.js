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

        // EXACT golden snippet pattern from working supabase-test
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
          throw new Error(
            'Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
          );
        }

        const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

        // Create signed URL for audio file from book-assets bucket (EXACT pattern)

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

        setResult({
          audioFilePath: data.audio_file_path,
          signedUrl: signedUrlData.signedUrl,
          success: true,
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
      <div className="mx-auto max-w-4xl space-y-8">
        <SacredCard variant="heavy" className="p-8">
          <div className="text-center">
            <h1 className="mb-4 font-serif text-3xl text-sacred-blue-900">
              🧪 Simple Golden Snippet Test
            </h1>
            <p className="mb-4 text-lg text-sacred-blue-600">
              Testing the exact golden snippet pattern from working supabase-test page but inside a
              React component with useEffect.
            </p>
          </div>
        </SacredCard>

        <SacredCard variant="glass" className="p-6">
          <h2 className="mb-4 text-center font-serif text-xl text-sacred-blue-900">
            Golden Snippet Test Results
          </h2>

          {loading && (
            <div className="space-y-3 text-center">
              <div className="mx-auto flex h-12 w-12 animate-pulse items-center justify-center rounded-full bg-sacred-gradient">
                <span className="text-lg text-white">🔍</span>
              </div>
              <p className="text-sacred-blue-600">Testing golden snippet pattern...</p>
            </div>
          )}

          {error && (
            <div className="space-y-3 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <span className="text-lg text-red-600">❌</span>
              </div>
              <h3 className="font-serif text-lg text-red-700">Error</h3>
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {result && result.success && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <span className="text-lg text-green-600">✅</span>
                </div>
                <h3 className="mb-4 font-serif text-lg text-green-700">Success!</h3>
              </div>

              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <h4 className="mb-2 font-semibold text-green-900">Results:</h4>
                <div className="space-y-2 text-sm">
                  <p className="text-green-700">
                    <strong>Audio File Path:</strong> {result.audioFilePath}
                  </p>
                  <p className="break-all text-green-700">
                    <strong>Signed URL:</strong> {result.signedUrl}
                  </p>
                  <p className="mt-2 text-xs text-green-600">
                    ✨ Golden snippet pattern working correctly in React component!
                  </p>
                </div>
              </div>
            </div>
          )}
        </SacredCard>

        <SacredCard variant="glass" className="p-4">
          <h3 className="text-md mb-3 text-center font-serif text-sacred-blue-900">
            Environment Status
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <p className="font-semibold text-sacred-blue-900">Supabase URL</p>
              <p className="text-sacred-blue-600">
                {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}
              </p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-sacred-blue-900">Supabase Key</p>
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
