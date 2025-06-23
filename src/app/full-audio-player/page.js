
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import SacredCard from '@/components/ui/sacred-card';
import UnifiedAudioPlayer from '@/components/UnifiedAudioPlayer';

export default function FullAudioPlayerPageNew() {
  const [chartVisual, setChartVisual] = useState(null);
  const [chartLoading, setChartLoading] = useState(true);
  const [chartError, setChartError] = useState(null);

  useEffect(() => {
    async function fetchChartVisual() {
      setChartLoading(true);
      setChartError(null);
      
      try {
        console.log('🔍 Loading Mind Transformation Chart via Golden Snippet API...');
        
        // Fetch from our golden snippet API route (matches audio-tracks pattern)
        const response = await fetch('/api/chart-visual');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || `API request failed with status ${response.status}`);
        }

        if (!data.success) {
          throw new Error(data.error || 'API returned unsuccessful response');
        }

        if (!data.chart?.src) {
          throw new Error('Chart data received but no image URL available');
        }

        console.log('✅ Successfully loaded chart via Golden Snippet API');
        
        setChartVisual({
          src: data.chart.src,
          alt: data.chart.alt || 'Mind Transformation Chart'
        });

      } catch (e) {
        console.error('❌ Failed to load chart visual:', e);
        setChartError(e.message || 'An unexpected error occurred.');
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
              <p className="text-sacred-blue-600 text-lg max-w-2xl mx-auto mb-2">
                Immerse yourself in the complete spiritual journey. Listen to the entire guidebook 
                with advanced playbook controls, bookmarks, and progress tracking.
              </p>
              <p className="text-xs text-sacred-blue-500">
                🌟 Powered by Golden Snippet Integration - Real Supabase URLs
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
          <UnifiedAudioPlayer mode="full" />
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
                <p className="text-xs text-sacred-blue-400 mt-2">
                  ✨ Chart loaded using Golden Snippet pattern
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
              <div className="space-y-2">
                <div className="text-sacred-blue-600">Loading transformation chart...</div>
                <div className="text-xs text-sacred-blue-400">Using golden snippet pattern</div>
              </div>
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
              <div className="space-y-2">
                <div className="text-red-600">Chart Error: {chartError}</div>
                <div className="text-xs text-red-400">Golden snippet pattern failed</div>
              </div>
            </SacredCard>
          </motion.div>
        )}
      </div>
    </div>
  );
}
