
'use client';

import { motion } from 'framer-motion';
import SacredCard from '@/components/ui/sacred-card';
import FullAudiobookPlayer from '@/components/FullAudiobookPlayer';
import SingleSectionPlayer from '@/components/SingleSectionPlayer';

export default function TestNewAudioPage() {
  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Test Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <SacredCard variant="heavy" className="p-8">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-serif text-sacred-blue-900 mb-4">
                🧪 Golden Snippet Audio System Test
              </h1>
              <p className="text-sacred-blue-600 text-lg max-w-2xl mx-auto mb-4">
                Testing the new audio system powered by proven golden snippet Supabase integration.
                This should load real signed URLs instead of mock data.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-xl mx-auto">
                <p className="text-green-700 text-sm font-semibold">✅ Golden Snippet Features:</p>
                <ul className="text-green-600 text-sm mt-2 space-y-1">
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
            <h2 className="text-2xl font-serif text-sacred-blue-900 mb-6 text-center">
              🎧 Full Audiobook Player Test
            </h2>
            <FullAudiobookPlayer />
          </SacredCard>
        </motion.div>

        {/* Single Section Player Test */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <SacredCard variant="heavy" className="p-8">
            <h2 className="text-2xl font-serif text-sacred-blue-900 mb-6 text-center">
              🎵 Single Section Player Test (Prologue)
            </h2>
            <div className="max-w-2xl mx-auto">
              <SingleSectionPlayer sectionSlug="00_prologue" />
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
            <h3 className="text-lg font-serif text-sacred-blue-900 mb-4 text-center">
              🔍 Debug Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Environment Check</h4>
                <p className="text-blue-700">
                  Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}
                </p>
                <p className="text-blue-700">
                  Supabase Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-2">System Status</h4>
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
