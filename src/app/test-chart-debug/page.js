'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

export default function ChartDebugPage() {
  const [debugInfo, setDebugInfo] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function debugChart() {
      setLoading(true);
      let logs = [];

      try {
        logs.push('🔍 Starting chart debug using golden snippet pattern...');

        // Golden snippet Supabase client setup
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
          throw new Error('Missing Supabase environment variables');
        }
        logs.push('✅ Environment variables found');

        const supabase = createClient(supabaseUrl, supabaseAnonKey);
        logs.push('✅ Supabase client created');

        // Check what's in the visuals table
        logs.push('🔍 Querying visuals table...');
        const { data: allVisuals, error: allVisualsError } = await supabase
          .from('visuals')
          .select('*');

        if (allVisualsError) {
          logs.push(`❌ Error querying visuals table: ${allVisualsError.message}`);
        } else {
          logs.push(`✅ Found ${allVisuals?.length || 0} visuals in table:`);
          allVisuals?.forEach((visual, index) => {
            logs.push(
              `  ${index + 1}. ID: ${visual.id}, Tag: "${visual.markdown_tag}", Path: "${visual.file_path}"`
            );
          });
        }

        // Try specific chart query
        logs.push('🔍 Querying for NEXT_STEPS_CHART...');
        const { data: chartData, error: chartError } = await supabase
          .from('visuals')
          .select('*')
          .eq('markdown_tag', 'NEXT_STEPS_CHART')
          .single();

        if (chartError) {
          if (chartError.code === 'PGRST116') {
            logs.push('ℹ️ No NEXT_STEPS_CHART found, trying alternatives...');

            const alternativeTags = ['![MTC]', 'MTC', 'CHART', 'TRANSFORMATION_CHART'];

            for (const tag of alternativeTags) {
              logs.push(`🔍 Trying tag: "${tag}"`);
              const { data: altData, error: altError } = await supabase
                .from('visuals')
                .select('*')
                .eq('markdown_tag', tag)
                .single();

              if (!altError && altData) {
                logs.push(`✅ Found chart with tag: ${tag}`);
                logs.push(`   File path: ${altData.file_path}`);

                // Try creating signed URL
                logs.push('🔍 Creating signed URL...');
                const { data: signedUrlData, error: urlError } = await supabase.storage
                  .from('book-assets')
                  .createSignedUrl(altData.file_path, 3600);

                if (urlError) {
                  logs.push(`❌ Signed URL error: ${urlError.message}`);
                } else {
                  logs.push(
                    `✅ Signed URL created: ${signedUrlData.signedUrl?.substring(0, 100)}...`
                  );
                }
                break;
              } else {
                logs.push(`❌ Tag "${tag}" not found or error: ${altError?.message || 'unknown'}`);
              }
            }
          } else {
            logs.push(`❌ Database error: ${chartError.message}`);
          }
        } else {
          logs.push(`✅ Found NEXT_STEPS_CHART with path: ${chartData.file_path}`);
        }

        // List storage bucket contents
        logs.push('🔍 Checking book-assets bucket contents...');
        const { data: storageList, error: storageError } = await supabase.storage
          .from('book-assets')
          .list('', { limit: 100 });

        if (storageError) {
          logs.push(`❌ Storage list error: ${storageError.message}`);
        } else {
          logs.push(`✅ Found ${storageList?.length || 0} items in book-assets root:`);
          storageList?.slice(0, 10).forEach((item, index) => {
            logs.push(`  ${index + 1}. ${item.name} (${item.metadata?.size || 'unknown size'})`);
          });
        }

        // Check visuals subdirectory
        logs.push('🔍 Checking book-assets/visuals directory...');
        const { data: visualsList, error: visualsError } = await supabase.storage
          .from('book-assets')
          .list('visuals', { limit: 100 });

        if (visualsError) {
          logs.push(`❌ Visuals directory error: ${visualsError.message}`);
        } else {
          logs.push(`✅ Found ${visualsList?.length || 0} items in visuals directory:`);
          visualsList?.forEach((item, index) => {
            logs.push(
              `  ${index + 1}. visuals/${item.name} (${item.metadata?.size || 'unknown size'})`
            );
          });
        }
      } catch (e) {
        logs.push(`❌ Unexpected error: ${e.message}`);
      }

      setDebugInfo(logs.join('\n'));
      setLoading(false);
    }

    debugChart();
  }, []);

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Chart Loading Debug</h1>

      {loading ? (
        <div>Loading debug info...</div>
      ) : (
        <pre className="whitespace-pre-wrap rounded bg-gray-100 p-4 text-sm">{debugInfo}</pre>
      )}
    </div>
  );
}
