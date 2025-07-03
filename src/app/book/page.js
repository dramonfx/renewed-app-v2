'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import SacredButton from '@/components/ui/sacred-button';
import SacredCard from '@/components/ui/sacred-card';

export default function BookHomePage() {
  const router = useRouter();
  const [firstSectionSlug, setFirstSectionSlug] = useState('00_prologue');
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSections() {
      try {
        // Try to fetch from Supabase first
        const { data, error } = await supabase
          .from('sections')
          .select('title, slug, order')
          .order('order', { ascending: true });

        if (error) {
          console.warn('Supabase error, using fallback data:', error.message);
          // Fallback to static data
          const fallbackSections = [
            { title: 'Prologue', slug: '00_prologue', order: 1 },
            {
              title: 'Introduction Through Next Steps',
              slug: '01_intro_through_next_steps',
              order: 2,
            },
            { title: 'Kingdom Government', slug: '02_kingdom_government', order: 3 },
            { title: 'Elephant in the Kingdom', slug: '03_elephant_in_the_kingdom', order: 4 },
            {
              title: 'Characteristics of Principles',
              slug: '04_characteristics_of_principles',
              order: 5,
            },
            { title: 'Approved', slug: '05_approved', order: 6 },
            { title: '30 Key Principles (01–10)', slug: '06_key_principles_01-10', order: 7 },
            { title: '30 Key Principles (11–20)', slug: '06_key_principles_11-20', order: 8 },
            { title: '30 Key Principles (21–30)', slug: '06_key_principles_21-30', order: 9 },
            { title: 'Conclusion', slug: '07_conclusion', order: 10 },
          ];
          setSections(fallbackSections);
          setFirstSectionSlug(fallbackSections[0]?.slug || '00_prologue');
        } else if (data && data.length > 0) {
          setSections(data);
          setFirstSectionSlug(data[0]?.slug || '00_prologue');
        } else {
          // No data returned, use fallback
          const fallbackSections = [
            { title: 'Prologue', slug: '00_prologue', order: 1 },
            {
              title: 'Introduction Through Next Steps',
              slug: '01_intro_through_next_steps',
              order: 2,
            },
            { title: 'Kingdom Government', slug: '02_kingdom_government', order: 3 },
          ];
          setSections(fallbackSections);
          setFirstSectionSlug('00_prologue');
        }
      } catch (err) {
        console.error('Error fetching sections:', err);
        // Final fallback
        setSections([
          { title: 'Prologue', slug: '00_prologue', order: 1 },
          {
            title: 'Introduction Through Next Steps',
            slug: '01_intro_through_next_steps',
            order: 2,
          },
        ]);
        setFirstSectionSlug('00_prologue');
      } finally {
        setLoading(false);
      }
    }

    fetchSections();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <SacredCard variant="heavy" className="p-8">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 animate-pulse items-center justify-center rounded-full bg-sacred-gradient shadow-lg">
              <span className="text-2xl text-white">📖</span>
            </div>
            <p className="text-sacred-blue-600">Loading your guidebook...</p>
          </div>
        </SacredCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <SacredCard variant="heavy" className="p-8 md:p-12">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-sacred-gradient shadow-lg">
              <span className="text-3xl text-white">📖</span>
            </div>
            <h1 className="mb-4 font-serif text-4xl text-sacred-blue-900 md:text-5xl">
              Renewed: The{' '}
              <span className="bg-sacred-gradient bg-clip-text text-transparent">
                New Man Story
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-xl leading-relaxed text-sacred-blue-600">
              Welcome to your interactive guidebook experience. Navigate through the sections using
              the sidebar, or begin your journey with the first section below.
            </p>
          </SacredCard>
        </motion.div>

        {/* Quick Start Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-10 grid gap-6 md:grid-cols-2"
        >
          <SacredCard variant="glass" className="p-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sacred-gradient shadow-lg">
              <span className="text-2xl text-white">📚</span>
            </div>
            <h3 className="mb-3 font-serif text-xl text-sacred-blue-900">Start Reading</h3>
            <p className="mb-4 text-sm leading-relaxed text-sacred-blue-600">
              Begin your spiritual journey with the first section and progress through each chapter
            </p>
            <SacredButton
              onClick={() => router.push(`/book/${firstSectionSlug}`)}
              variant="gold"
              size="lg"
              className="w-full"
            >
              Start with: Prologue ✨
            </SacredButton>
          </SacredCard>

          <SacredCard variant="glass" className="p-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sacred-purple-gradient shadow-lg">
              <span className="text-2xl text-white">🎧</span>
            </div>
            <h3 className="mb-3 font-serif text-xl text-sacred-blue-900">Audio Experience</h3>
            <p className="mb-4 text-sm leading-relaxed text-sacred-blue-600">
              Listen to the entire audiobook with guided reflections and peaceful narration
            </p>
            <SacredButton
              onClick={() => router.push('/full-audio-player')}
              variant="primary"
              size="lg"
              className="w-full"
            >
              Open Audio Player 🎵
            </SacredButton>
          </SacredCard>
        </motion.div>

        {/* Sections Overview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <SacredCard variant="heavy" className="p-6 md:p-8">
            <h2 className="mb-6 text-center font-serif text-2xl text-sacred-blue-900">
              Guidebook Sections
            </h2>
            <div className="space-y-3">
              {sections.map((section, index) => (
                <motion.div
                  key={section.slug}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                >
                  <Link href={`/book/${section.slug}`}>
                    <div className="group flex cursor-pointer items-center justify-between rounded-lg bg-white/50 p-4 transition-all duration-300 hover:bg-white/80 hover:shadow-md">
                      <div className="flex items-center space-x-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sacred-blue-100 text-sm font-semibold text-sacred-blue-600 transition-colors group-hover:bg-sacred-blue-600 group-hover:text-white">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-serif text-lg text-sacred-blue-900 transition-colors group-hover:text-sacred-blue-700">
                            {section.title}
                          </h4>
                        </div>
                      </div>
                      <div className="text-sacred-blue-400 transition-colors group-hover:text-sacred-blue-600">
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </SacredCard>
        </motion.div>
      </div>
    </div>
  );
}
