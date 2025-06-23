// src/app/full-audio-player/page.js
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';
import SacredCard from '@/components/ui/sacred-card';
import FullAudiobookPlayer from '@/components/FullAudiobookPlayer';

export default function FullAudioPlayerPage() {
  const [chartVisual, setChartVisual] = useState(null);
  const [chartLoading, setChartLoading] = useState(true);
  const [chartError, setChartError] = useState(null);

  useEffect(() => {
    async function fetchChartVisual() {
      setChartLoading(true);
      setChartError(null);
      try {
        const { data: visualData, error: visualError } = await supabase
          .from('visuals')
          .select('file_path, caption')
          .eq('markdown_tag', 'NEXT_STEPS_CHART')
          .single();

        if (visualError && visualError.code !== 'PGRST116') {
          console.error("Error fetching 'NEXT_STEPS_CHART' visual:", visualError.message);
        } else if (visualData && visualData.file_path) {
          const { data: chartUrlData, error: chartUrlError } = await supabase.storage
            .from('book-assets')
            .createSignedUrl(visualData.file_path, 60 * 60);
          if (chartUrlError) {
            console.error("Error creating signed URL for chart visual:", chartUrlError.message);
          } else {
            setChartVisual({ src: chartUrlData.signedUrl, alt: visualData.caption || 'Base Exercise Template Chart' });
          }
        }
      } catch (e) {
        console.error("Failed to load chart visual:", e);
        setChartError(e.message || "An unexpected error occurred.");
      } finally {
        setChartLoading(false);
      }
    }
    fetchChartVisual();
  }, []);

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <SacredCard variant="heavy" className="p-8">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-serif text-sacred-blue-900 mb-4">
                Full Audiobook Experience
              </h1>
              <p className="text-sacred-blue-600 text-lg max-w-2xl mx-auto">
                Immerse yourself in the complete spiritual journey. Listen to the entire guidebook 
                with advanced playback controls, bookmarks, and progress tracking.
              </p>
            </div>
          </SacredCard>
        </motion.div>

        {/* Main Audio Player */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <FullAudiobookPlayer />
        </motion.div>

        {/* Mind Transformation Chart */}
        {chartVisual && chartVisual.src && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <SacredCard variant="heavy" className="p-8">
              <div className="text-center">
                <h2 className="text-2xl font-serif text-sacred-blue-900 mb-6">
                  Mind Transformation Chart
                </h2>
                <div className="relative w-full max-w-4xl mx-auto">
                  <Image
                    src={chartVisual.src}
                    alt={chartVisual.alt}
                    width={1200}
                    height={800}
                    style={{ objectFit: 'contain', maxWidth: '100%', height: 'auto' }}
                    className="rounded-lg shadow-lg"
                    priority
                  />
                </div>
                <p className="text-sacred-blue-600 mt-4 text-sm">
                  Reference this chart as you progress through your spiritual transformation journey
                </p>
              </div>
            </SacredCard>
          </motion.div>
        )}

        {chartLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <SacredCard variant="glass" className="p-6">
              <div className="text-sacred-blue-600">Loading transformation chart...</div>
            </SacredCard>
          </motion.div>
        )}

        {chartError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <SacredCard variant="glass" className="p-6">
              <div className="text-red-600">Error loading chart: {chartError}</div>
            </SacredCard>
          </motion.div>
        )}
      </div>
    </div>
  );
}