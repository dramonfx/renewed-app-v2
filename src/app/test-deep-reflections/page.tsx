
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Clock, Trash2, Plus, Heart } from 'lucide-react';
import SacredCard from '@/components/ui/sacred-card';
import SacredButton from '@/components/ui/sacred-button';
import { useDeepReflections } from '@/hooks/useDeepReflections';

export default function TestDeepReflectionsPage() {
  const [currentTime, setCurrentTime] = useState(120); // Simulate 2 minutes
  const [showReflectionCreator, setShowReflectionCreator] = useState(false);
  const [reflectionText, setReflectionText] = useState('');

  // Test Deep Reflections with a mock section
  const {
    reflections,
    saveReflection,
    deleteReflection,
    canSaveReflection,
    getSpiritualPrompt,
    getSectionReflectionCount,
    getAllSectionsWithReflections,
  } = useDeepReflections({
    mode: 'single',
    currentTrackSlug: '00_prologue',
    currentTrackTitle: 'Prologue',
    maxReflections: 5,
  });

  const formatTime = (time: number): string => {
    if (isNaN(time) || time === Infinity) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleCreateReflection = () => {
    if (!canSaveReflection) return;
    
    const prompt = getSpiritualPrompt();
    const finalText = reflectionText.trim() || prompt;
    
    saveReflection(currentTime, finalText);
    
    // Reset state
    setReflectionText('');
    setShowReflectionCreator(false);
  };

  const handleDeleteReflection = (reflectionId: string) => {
    if (window.confirm('Are you sure you want to delete this sacred reflection?')) {
      deleteReflection(reflectionId);
    }
  };

  const allSectionsWithReflections = getAllSectionsWithReflections();

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <SacredCard variant="heavy" className="p-8 text-center">
            <h1 className="mb-4 font-serif text-3xl text-sacred-blue-900 md:text-4xl">
              Deep Reflections System Test
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-sacred-blue-600">
              Testing the complete Deep Reflections functionality - creation, display, navigation, and section-specific storage.
            </p>
          </SacredCard>
        </motion.div>

        {/* Current Status */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <SacredCard variant="glass" className="p-6">
            <h2 className="mb-4 font-serif text-xl text-sacred-blue-900">System Status</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-sacred-blue-600">Current Section:</p>
                <p className="font-semibold text-sacred-blue-900">Prologue (00_prologue)</p>
              </div>
              <div>
                <p className="text-sm text-sacred-blue-600">Current Time:</p>
                <p className="font-semibold text-sacred-blue-900">{formatTime(currentTime)}</p>
              </div>
              <div>
                <p className="text-sm text-sacred-blue-600">Reflections in This Section:</p>
                <p className="font-semibold text-sacred-blue-900">{reflections.length} of 5</p>
              </div>
              <div>
                <p className="text-sm text-sacred-blue-600">Can Save Reflection:</p>
                <p className="font-semibold text-sacred-blue-900">{canSaveReflection ? 'Yes' : 'No'}</p>
              </div>
            </div>

            <div className="mt-4 flex space-x-2">
              <SacredButton
                variant="ghost"
                size="sm"
                onClick={() => setCurrentTime(prev => prev + 30)}
              >
                +30s
              </SacredButton>
              <SacredButton
                variant="ghost"
                size="sm"
                onClick={() => setCurrentTime(prev => Math.max(0, prev - 30))}
              >
                -30s
              </SacredButton>
            </div>
          </SacredCard>
        </motion.div>

        {/* All Sections Summary */}
        {allSectionsWithReflections.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <SacredCard variant="glass" className="p-6">
              <h2 className="mb-4 font-serif text-xl text-sacred-blue-900">All Sections with Reflections</h2>
              <div className="grid gap-2">
                {allSectionsWithReflections.map(({ sectionSlug, count }) => (
                  <div key={sectionSlug} className="flex items-center justify-between p-2 rounded bg-sacred-blue-50">
                    <span className="text-sacred-blue-800">{sectionSlug}</span>
                    <div className="flex items-center space-x-1 text-xs">
                      <Star className="h-3 w-3 text-sacred-gold-600 fill-current" />
                      <span className="text-sacred-gold-700 font-medium">{count} of 5</span>
                    </div>
                  </div>
                ))}
              </div>
            </SacredCard>
          </motion.div>
        )}

        {/* Deep Reflections Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <SacredCard variant="glass" className="p-8">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="sacred-icon-bg-gold h-12 w-12">
                  <Star className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl text-sacred-blue-900">Sacred Reflections</h2>
                  <p className="text-sm text-sacred-blue-600">
                    Capture divine moments and return for deeper meditation ({reflections.length} of 5)
                  </p>
                </div>
              </div>
              
              {canSaveReflection && (
                <SacredButton
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReflectionCreator(true)}
                  className="opacity-80 hover:opacity-100"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New Reflection
                </SacredButton>
              )}
            </div>

            {/* Existing Reflections */}
            {reflections.length > 0 ? (
              <div className="grid gap-4 mb-6">
                {reflections.map((reflection) => (
                  <SacredCard key={reflection.id} variant="glass" className="p-4 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Clock className="h-4 w-4 text-sacred-gold-600" />
                          <span className="text-sm font-medium text-sacred-blue-700">
                            {formatTime(reflection.timestamp)}
                          </span>
                          <span className="text-xs text-sacred-blue-500">
                            • {new Date(reflection.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div className="mb-3">
                          <p className="text-sm text-sacred-blue-800 italic leading-relaxed">
                            "{reflection.reflectionText}"
                          </p>
                        </div>
                        
                        {reflection.spiritualPrompt && reflection.spiritualPrompt !== reflection.reflectionText && (
                          <div className="mt-2 p-2 bg-sacred-gold-50 rounded border-l-2 border-sacred-gold-300">
                            <p className="text-xs text-sacred-gold-700 font-medium">Original Prompt:</p>
                            <p className="text-xs text-sacred-gold-600 italic">{reflection.spiritualPrompt}</p>
                          </div>
                        )}
                      </div>
                      
                      <button
                        onClick={() => handleDeleteReflection(reflection.id)}
                        className="ml-3 p-1 text-red-400 hover:text-red-600 transition-colors"
                        title="Delete reflection"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </SacredCard>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Star className="mx-auto mb-3 h-12 w-12 text-sacred-gold-400 opacity-50" />
                <p className="text-sacred-blue-600 mb-2">No reflections captured yet</p>
                <p className="text-sm text-sacred-blue-500">
                  Create a reflection to test the Deep Reflections system
                </p>
              </div>
            )}

            {/* Reflection Creator */}
            {showReflectionCreator && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-sacred-blue-200 pt-6"
              >
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Heart className="h-5 w-5 text-sacred-gold-600" />
                    <h3 className="font-semibold text-sacred-blue-900">Capture This Sacred Moment</h3>
                  </div>
                  
                  <div className="mb-3 p-3 bg-sacred-blue-50 rounded">
                    <p className="text-sm text-sacred-blue-700 italic">
                      "{getSpiritualPrompt()}"
                    </p>
                  </div>
                  
                  <textarea
                    value={reflectionText}
                    onChange={(e) => setReflectionText(e.target.value)}
                    placeholder="Share your reflection on this moment of divine wisdom..."
                    className="w-full p-3 border border-sacred-blue-200 rounded-lg focus:ring-2 focus:ring-sacred-blue-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-sacred-blue-600">
                    <Clock className="inline h-4 w-4 mr-1" />
                    Time: {formatTime(currentTime)}
                  </div>
                  
                  <div className="flex space-x-2">
                    <SacredButton
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowReflectionCreator(false);
                        setReflectionText('');
                      }}
                    >
                      Cancel
                    </SacredButton>
                    <SacredButton
                      variant="primary"
                      size="sm"
                      onClick={handleCreateReflection}
                      disabled={!canSaveReflection}
                    >
                      <Star className="mr-2 h-4 w-4" />
                      Save Reflection
                    </SacredButton>
                  </div>
                </div>
              </motion.div>
            )}

            {!canSaveReflection && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded">
                <p className="text-sm text-amber-700">
                  You've reached the maximum of 5 reflections for focused meditation. 
                  Delete a reflection to add a new one.
                </p>
              </div>
            )}
          </SacredCard>
        </motion.div>

        {/* Test Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <SacredCard variant="glass" className="p-6">
            <h2 className="mb-4 font-serif text-xl text-sacred-blue-900">Test Actions</h2>
            <div className="flex flex-wrap gap-2">
              <SacredButton
                variant="ghost"
                size="sm"
                onClick={() => setCurrentTime(60)}
              >
                Set Time to 1:00
              </SacredButton>
              <SacredButton
                variant="ghost"
                size="sm"
                onClick={() => setCurrentTime(180)}
              >
                Set Time to 3:00
              </SacredButton>
              <SacredButton
                variant="ghost"
                size="sm"
                onClick={() => setCurrentTime(300)}
              >
                Set Time to 5:00
              </SacredButton>
              <SacredButton
                variant="secondary"
                size="sm"
                onClick={() => window.location.reload()}
              >
                Reload Page
              </SacredButton>
            </div>
          </SacredCard>
        </motion.div>
      </div>
    </div>
  );
}
