'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import SacredCard from '@/components/ui/sacred-card';
import EnhancedUnifiedAudioPlayer from '@/components/EnhancedUnifiedAudioPlayer';

export default function FullAudioPlayerPageNew() {
  const [chartVisual, setChartVisual] = useState(null);
  const [chartLoading, setChartLoading] = useState(true);
  const [chartError, setChartError] = useState(null);

  useEffect(() => {
    async function fetchChartVisual() {
      setChartLoading(true);
      setChartError(null);

      try {
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

        setChartVisual({
          src: data.chart.src,
          alt: data.chart.alt || 'Mind Transformation Chart',
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
      <div className="mx-auto max-w-6xl">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <SacredCard variant="heavy" className="p-8">
            <div className="text-center">
              <h1 className="mb-4 font-serif text-3xl text-sacred-blue-900 md:text-4xl">
                Full Audiobook Experience
              </h1>
              <p className="mx-auto mb-2 max-w-2xl text-lg text-sacred-blue-600">
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
          <EnhancedUnifiedAudioPlayer mode="full" />
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
                <h2 className="mb-6 font-serif text-2xl text-sacred-blue-900">
                  Mind Transformation Chart
                </h2>
                <div className="relative mx-auto w-full max-w-4xl">
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
                <p className="mt-4 text-sm text-sacred-blue-600">
                  Reference this chart as you progress through your spiritual transformation journey
                </p>
                <p className="mt-2 text-xs text-sacred-blue-400">
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
            className="py-8 text-center"
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
            className="py-8 text-center"
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
