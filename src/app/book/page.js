// src/app/book/page.js (Guidebook Home/Overview)
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export const revalidate = 0;

async function getFirstSectionSlug() {
  const { data, error } = await supabase
    .from('sections')
    .select('slug')
    .order('order', { ascending: true })
    .limit(1)
    .single();

  if (error || !data) {
    console.error('Error fetching first section slug:', error?.message || 'No first section found');
    return '00_prologue'; // Fallback
  }
  return data.slug;
}

export default async function BookHomePage() {
  const firstSectionSlug = await getFirstSectionSlug();

  return (
    <div className="text-center space-y-8 py-10">
      <h1 className="text-5xl font-serif text-brand-blue-dark mb-4">
        Renewed: The New Man Story
      </h1>
      <p className="text-xl text-brand-text-main max-w-2xl mx-auto">
        Welcome to your interactive guidebook experience. Navigate through the sections using the sidebar,
        or begin your journey with the first section.
      </p>
      <div className="mt-10">
        <Link
          href={`/book/${firstSectionSlug}`}
          className="bg-brand-gold hover:bg-yellow-400 text-brand-blue-dark font-sans font-semibold py-3 px-8 text-lg rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out inline-block"
        >
          Start with: Prologue (or First Section)
        </Link>
      </div>
      <p className="text-brand-text-muted font-sans mt-6">
        Alternatively, listen to the entire audiobook continuously.
      </p>
      <Link
        href="/full-audio-player"
        className="text-brand-blue-medium hover:text-brand-blue-dark font-sans font-semibold py-2 px-6 rounded-lg border border-brand-blue-medium hover:border-brand-blue-dark transition-colors duration-150 ease-in-out inline-block"
      >
        Go to Full Audiobook Player
      </Link>
    </div>
  );
}