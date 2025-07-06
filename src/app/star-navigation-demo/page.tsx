
'use client';

import React from 'react';
import { Star, Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import SacredButton from '@/components/ui/sacred-button';
import SacredCard from '@/components/ui/sacred-card';

const mockTracks = [
  { id: '1', title: 'Prologue', slug: '00_prologue' },
  { id: '2', title: 'Introduction Through Next Steps', slug: '01_intro_through_next_steps' },
  { id: '3', title: 'Kingdom Government', slug: '02_kingdom_government' },
  { id: '4', title: 'Elephant in the Kingdom', slug: '03_elephant_in_the_kingdom' },
  { id: '5', title: 'Characteristics of Principles', slug: '04_characteristics_of_principles' },
];

const mockReflectionCounts: Record<string, number> = {
  '00_prologue': 3,
  '01_intro_through_next_steps': 2,
  '02_kingdom_government': 5,
  '03_elephant_in_the_kingdom': 1,
  '04_characteristics_of_principles': 4,
};

export default function StarNavigationDemo() {
  const [currentTrackIndex, setCurrentTrackIndex] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);

  const getSectionReflectionCount = (sectionSlug: string) => {
    return mockReflectionCounts[sectionSlug] || 0;
  };

  const handleNavigateToSection = (sectionSlug: string) => {
    alert(`Navigating to section: ${sectionSlug}`);
    // In real implementation: router.push(`/book/${sectionSlug}`);
  };

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <SacredCard variant="heavy" className="p-8">
            <div className="text-center">
              <h1 className="mb-4 font-serif text-3xl text-sacred-blue-900 md:text-4xl">
                ⭐ Star Navigation Demo
              </h1>
              <p className="mx-auto mb-2 max-w-2xl text-lg text-sacred-blue-600">
                This demonstrates the implemented star navigation system for the Deep Reflections feature.
                Click on the star indicators to navigate to section-specific reflections.
              </p>
              <p className="text-sm text-sacred-gold-600 font-semibold">
                ✅ Successfully implemented - ready for deployment!
              </p>
            </div>
          </SacredCard>
        </div>

        <SacredCard variant="glass" className="overflow-hidden">
          <div className="space-y-6 p-6">
            {/* Current Track Info */}
            <div className="text-center">
              <h3 className="mb-1 text-lg font-semibold text-sacred-blue-900">
                {mockTracks[currentTrackIndex]?.title}
              </h3>
              <p className="text-sm text-sacred-blue-600">
                Track {currentTrackIndex + 1} of {mockTracks.length}
              </p>
              <div className="mt-2 flex items-center justify-center space-x-2 text-xs text-sacred-blue-500">
                <Star className="w-3 h-3 fill-current" />
                <span>Star navigation active</span>
              </div>
            </div>

            {/* Progress Bar (Mock) */}
            <div className="space-y-2">
              <div className="h-2 w-full overflow-hidden rounded-full bg-sacred-blue-200">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-sacred-blue-500 to-sacred-gold-500"
                  style={{ width: '35%' }}
                />
              </div>
              <div className="flex justify-between text-xs text-sacred-blue-600">
                <span>2:15</span>
                <span>6:42</span>
              </div>
            </div>

            {/* Main Controls */}
            <div className="flex items-center justify-center space-x-6">
              <SacredButton
                variant="ghost"
                size="sm"
                onClick={() => setCurrentTrackIndex(Math.max(0, currentTrackIndex - 1))}
                disabled={currentTrackIndex === 0}
                className="opacity-80 hover:opacity-100"
              >
                <SkipBack className="h-4 w-4" />
              </SacredButton>

              <SacredButton
                variant="primary"
                size="lg"
                onClick={() => setIsPlaying(!isPlaying)}
                className="relative"
              >
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="ml-1 h-6 w-6" />}
              </SacredButton>

              <SacredButton
                variant="ghost"
                size="sm"
                onClick={() => setCurrentTrackIndex(Math.min(mockTracks.length - 1, currentTrackIndex + 1))}
                disabled={currentTrackIndex === mockTracks.length - 1}
                className="opacity-80 hover:opacity-100"
              >
                <SkipForward className="h-4 w-4" />
              </SacredButton>
            </div>

            {/* STAR NAVIGATION - The Key Feature */}
            <div className="space-y-3">
              <div className="flex justify-center space-x-4">
                <SacredButton
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentTrackIndex(Math.max(0, currentTrackIndex - 1))}
                  disabled={currentTrackIndex === 0}
                  className="opacity-80 hover:opacity-100"
                >
                  <SkipBack className="h-4 w-4" />
                </SacredButton>

                <SacredButton
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentTrackIndex(Math.min(mockTracks.length - 1, currentTrackIndex + 1))}
                  disabled={currentTrackIndex === mockTracks.length - 1}
                  className="opacity-80 hover:opacity-100"
                >
                  <SkipForward className="h-4 w-4" />
                </SacredButton>
              </div>

              <div className="max-h-64 space-y-1 overflow-y-auto">
                <h4 className="text-sm font-semibold text-sacred-blue-700 mb-2 text-center">
                  📚 Section Navigation with Star Indicators
                </h4>
                {mockTracks.map((track, index) => {
                  const reflectionCount = getSectionReflectionCount(track.slug);
                  const hasReflections = reflectionCount > 0;

                  return (
                    <div key={track.id} className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentTrackIndex(index)}
                        className={`flex-1 rounded p-3 text-left text-sm transition-colors ${
                          index === currentTrackIndex
                            ? 'bg-sacred-blue-200 text-sacred-blue-900'
                            : 'bg-white/10 text-sacred-blue-700 hover:bg-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="flex-1">{index + 1}. {track.title}</span>
                        </div>
                      </button>

                      {/* ⭐ STAR NAVIGATION - This is the key feature! */}
                      {hasReflections && (
                        <button
                          onClick={() => handleNavigateToSection(track.slug)}
                          className="flex-shrink-0 px-3 py-2 rounded-lg bg-sacred-gold-100 hover:bg-sacred-gold-200 transition-all duration-200 group border border-sacred-gold-300 hover:border-sacred-gold-400"
                          title={`View ${reflectionCount} of 5 reflections in ${track.title}`}
                        >
                          <div className="flex items-center space-x-2 text-sm">
                            <Star className="h-4 w-4 text-sacred-gold-600 fill-current group-hover:text-sacred-gold-800" />
                            <span className="text-sacred-gold-700 font-medium group-hover:text-sacred-gold-900">
                              {reflectionCount} of 5
                            </span>
                          </div>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 p-4 bg-sacred-gold-50 rounded-lg border border-sacred-gold-200">
              <h4 className="font-semibold text-sacred-gold-800 mb-2">✅ Star Navigation Features:</h4>
              <ul className="text-sm text-sacred-gold-700 space-y-1">
                <li>• <strong>Star indicators</strong> show reflection counts (⭐ X of 5)</li>
                <li>• <strong>Clickable navigation</strong> to single section players</li>
                <li>• <strong>Visual feedback</strong> with hover effects and borders</li>
                <li>• <strong>Section-specific limits</strong> (5 reflections per section)</li>
                <li>• <strong>Clean interface</strong> - no global Deep Reflections panel</li>
              </ul>
            </div>
          </div>
        </SacredCard>
      </div>
    </div>
  );
}
