
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

/**
 * Custom hook to fetch visuals for a section with signed URLs
 * @param {number} sectionId - The section ID to fetch visuals for
 * @returns {Object} { data, loading, error, visualsMap }
 */
export function useVisuals(sectionId) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visualsMap, setVisualsMap] = useState(new Map());

  useEffect(() => {
    async function fetchVisuals() {
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
          const visualsWithUrls = await Promise.all(
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
          const newVisualsMap = new Map();
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
        setError(err.message);
        console.error('Error fetching visuals:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchVisuals();
  }, [sectionId]);

  return { data, loading, error, visualsMap };
}
