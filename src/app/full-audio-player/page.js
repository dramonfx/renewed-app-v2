// src/app/full-audio-player/page.js
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';
import { PlaylistProvider } from '@/contexts/PlaylistContext';
import AudioPlayer from '@/components/AudioPlayer';
import { useAudioTracks } from '@/hooks';

export default function FullAudioPlayerPage() {
  // Temporarily bypass chart visual loading to test
  const [chartVisual, setChartVisual] = useState(null);
  const [chartLoading, setChartLoading] = useState(false); // Set to false for testing
  const [chartError, setChartError] = useState(null);

  // Temporarily use hardcoded working data while we investigate the loading issue
  const tracks = [
    { id: 1, title: "Prologue", slug: "00_prologue", audioUrl: "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAEAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV6urq6urq6urq6urq6urq6urq6urq6urq6v////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAASDs90hvAAAAAAAAAAAAAAAAAAAA//OEZAAAAAGkAAAAAAAAA0gAAAAATEFN//OEZAMAAAGkAAAAAAAAA0gAAAAARTMu//OEZAYAAAGkAAAAAAAAA0gAAAAAOTku//OEZAkAAAGkAAAAAAAAA0gAAAAANVVV" },
    { id: 2, title: "Introduction Through Next Steps", slug: "01_intro_through_next_steps", audioUrl: "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAEAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV6urq6urq6urq6urq6urq6urq6urq6urq6v////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAASDs90hvAAAAAAAAAAAAAAAAAAAA//OEZAAAAAGkAAAAAAAAA0gAAAAATEFN//OEZAMAAAGkAAAAAAAAA0gAAAAARTMu//OEZAYAAAGkAAAAAAAAA0gAAAAAOTku//OEZAkAAAGkAAAAAAAAA0gAAAAANVVV" },
    { id: 3, title: "Kingdom Government", slug: "02_kingdom_government", audioUrl: "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAEAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV6urq6urq6urq6urq6urq6urq6urq6urq6v////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAASDs90hvAAAAAAAAAAAAAAAAAAAA//OEZAAAAAGkAAAAAAAAA0gAAAAATEFN//OEZAMAAAGkAAAAAAAAA0gAAAAARTMu//OEZAYAAAGkAAAAAAAAA0gAAAAAOTku//OEZAkAAAGkAAAAAAAAA0gAAAAANVVV" },
    { id: 4, title: "Elephant in the Kingdom", slug: "03_elephant_in_the_kingdom", audioUrl: "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAEAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV6urq6urq6urq6urq6urq6urq6urq6urq6v////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAASDs90hvAAAAAAAAAAAAAAAAAAAA//OEZAAAAAGkAAAAAAAAA0gAAAAATEFN//OEZAMAAAGkAAAAAAAAA0gAAAAARTMu//OEZAYAAAGkAAAAAAAAA0gAAAAAOTku//OEZAkAAAGkAAAAAAAAA0gAAAAANVVV" },
    { id: 5, title: "Characteristics of Principles", slug: "04_characteristics_of_principles", audioUrl: "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAEAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV6urq6urq6urq6urq6urq6urq6urq6urq6v////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAASDs90hvAAAAAAAAAAAAAAAAAAAA//OEZAAAAAGkAAAAAAAAA0gAAAAATEFN//OEZAMAAAGkAAAAAAAAA0gAAAAARTMu//OEZAYAAAGkAAAAAAAAA0gAAAAAOTku//OEZAkAAAGkAAAAAAAAA0gAAAAANVVV" }
  ];
  const tracksLoading = false;
  const tracksError = null;
  
  // const { data: tracks, loading: tracksLoading, error: tracksError } = useAudioTracks();

  // Temporarily comment out chart visual loading for testing
  /*
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
  */

  const isLoading = tracksLoading || chartLoading;
  const error = tracksError || chartError;

  if (isLoading) {
    return <div className="text-center p-10 font-sans text-brand-text-main">Loading Audiobook Experience...</div>;
  }
  if (error) {
    return <div className="text-center p-10 font-sans text-red-500">Error loading data: {error}</div>;
  }
  if (tracks.length === 0) {
    return <div className="text-center p-10 font-sans text-brand-text-main">No audio tracks found for the guidebook.</div>;
  }

  return (
    <PlaylistProvider initialTracks={tracks}>
      <div className="space-y-8">
        <h1 className="text-4xl font-serif text-brand-blue-dark text-center mb-6">
          Full Audiobook Player
        </h1>
        <p className="text-brand-text-muted text-center font-sans -mt-6 mb-10">
          Listen to the entire guidebook from beginning to end.
        </p>

        <div className="rounded-xl shadow-lg"> {/* Player component now has its own padding and background */}
          <AudioPlayer className="text-brand-cream" />
        </div>

        {chartVisual && chartVisual.src && (
          <div className="mt-12 bg-brand-cream p-6 rounded-xl shadow-lg flex flex-col items-center">
            <h2 className="text-2xl font-sans font-semibold text-brand-blue-dark mb-6 text-center">
              Mind Transformation Chart
            </h2>
            <div className="relative w-full max-w-3xl">
              <Image
                src={chartVisual.src}
                alt={chartVisual.alt}
                width={1200}
                height={800}
                style={{ objectFit: 'contain', maxWidth: '100%', height: 'auto' }}
                className="rounded-md"
                priority
              />
            </div>
          </div>
        )}
      </div>
    </PlaylistProvider>
  );
}