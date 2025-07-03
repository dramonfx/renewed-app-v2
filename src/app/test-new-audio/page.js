'use client';

import { motion } from 'framer-motion';
import SacredCard from '@/components/ui/sacred-card';
import UnifiedAudioPlayer from '@/components/UnifiedAudioPlayer';

export default function TestNewAudioPage() {
  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-12">
        {/* Test Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <SacredCard variant="heavy" className="p-8">
            <div className="text-center">
              <h1 className="mb-4 font-serif text-3xl text-sacred-blue-900 md:text-4xl">
                🧪 Golden Snippet Audio System Test
              </h1>
              <p className="mx-auto mb-4 max-w-2xl text-lg text-sacred-blue-600">
                Testing the new audio system powered by proven golden snippet Supabase integration.
                This should load real signed URLs instead of mock data.
              </p>
              <div className="mx-auto max-w-xl rounded-lg border border-green-200 bg-green-50 p-4">
                <p className="text-sm font-semibold text-green-700">✅ Golden Snippet Features:</p>
                <ul className="mt-2 space-y-1 text-sm text-green-600">
                  <li>• Direct environment variable access</li>
                  <li>• Real Supabase signed URLs (not mock)</li>
                  <li>• Proven working database queries</li>
                  <li>• Enhanced bookmark system</li>
                  <li>• Comprehensive error handling</li>
                </ul>
              </div>
            </div>
          </SacredCard>
        </motion.div>

        {/* Full Audio Player Test */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <SacredCard variant="heavy" className="p-8">
            <h2 className="mb-6 text-center font-serif text-2xl text-sacred-blue-900">
              🎧 Full Audiobook Player Test
            </h2>
            <UnifiedAudioPlayer mode="full" />
          </SacredCard>
        </motion.div>

        {/* Single Section Player Test */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <SacredCard variant="heavy" className="p-8">
            <h2 className="mb-6 text-center font-serif text-2xl text-sacred-blue-900">
              🎵 Single Section Player Test (Prologue)
            </h2>
            <div className="mx-auto max-w-2xl">
              <UnifiedAudioPlayer mode="single" singleTrackSlug="00_prologue" />
            </div>
          </SacredCard>
        </motion.div>

        {/* Debug Information */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <SacredCard variant="glass" className="p-6">
            <h3 className="mb-4 text-center font-serif text-lg text-sacred-blue-900">
              🔍 Debug Information
            </h3>
            <div className="grid gap-4 text-sm md:grid-cols-2">
              <div className="rounded-lg bg-blue-50 p-4">
                <h4 className="mb-2 font-semibold text-blue-900">Environment Check</h4>
                <p className="text-blue-700">
                  Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}
                </p>
                <p className="text-blue-700">
                  Supabase Key:{' '}
                  {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}
                </p>
              </div>
              <div className="rounded-lg bg-purple-50 p-4">
                <h4 className="mb-2 font-semibold text-purple-900">System Status</h4>
                <p className="text-purple-700">Hook: useAudioPlayer (Golden Snippet)</p>
                <p className="text-purple-700">Pattern: Direct createClient usage</p>
                <p className="text-purple-700">URLs: Real signed URLs (not mock)</p>
              </div>
            </div>
          </SacredCard>
        </motion.div>
      </div>
    </div>
  );
}
