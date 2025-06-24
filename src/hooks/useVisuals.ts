
// src/hooks/useVisuals.ts
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { UseVisualsReturn, Visual } from './types';

/**
 * Custom hook to fetch visuals for a section with signed URLs
 */
export function useVisuals(sectionId: number | null): UseVisualsReturn {
  const [data, setData] = useState<Visual[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [visualsMap, setVisualsMap] = useState<Map<string, Visual>>(new Map());

  useEffect(() => {
    async function fetchVisuals(): Promise<void> {
      if (!sectionId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data: visualsData, error: visualsError } = await supabase
          .from('visuals')
          .select('*')
          .eq('section_id', sectionId)
          .order('display_order', { ascending: true });

        if (visualsError) {
          throw new Error(visualsError.message);
        }

        if (visualsData && visualsData.length > 0) {
          const visualsWithUrls: Visual[] = await Promise.all(
            visualsData.map(async (visual): Promise<Visual> => {
              if (visual.file_path) {
                const { data: signedUrlData, error: signedUrlError } = await supabase.storage
                  .from('book-assets')
                  .createSignedUrl(visual.file_path, 60 * 60);

                if (signedUrlError) {
                  console.error(`Error creating signed URL for visual ${visual.file_path}:`, signedUrlError.message);
                  return { 
                    ...visual, 
                    displayUrl: null, 
                    error: signedUrlError.message 
                  };
                }
                return { 
                  ...visual, 
                  displayUrl: signedUrlData.signedUrl 
                };
              }
              return { 
                ...visual, 
                displayUrl: null, 
                error: 'No file path for visual' 
              };
            })
          );

          // Create visuals map for markdown rendering
          const newVisualsMap = new Map<string, Visual>();
          visualsWithUrls.forEach(vis => {
            if (vis.markdown_tag && vis.displayUrl) {
              newVisualsMap.set(vis.markdown_tag, vis);
            }
          });

          setData(visualsWithUrls);
          setVisualsMap(newVisualsMap);
        } else {
          setData([]);
          setVisualsMap(new Map());
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        console.error('Error fetching visuals:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchVisuals();
  }, [sectionId]);

  return { data, loading, error, visualsMap };
}
