
'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  Trash2, 
  ExternalLink, 
  Heart, 
  BookOpen, 
  Clock,
  Sparkles,
  Navigation
} from 'lucide-react';
import SacredButton from '@/components/ui/sacred-button';
import SacredCard from '@/components/ui/sacred-card';
import type { DeepReflection } from '@/hooks/useDeepReflections';

export interface DeepReflectionsPanelProps {
  reflections: DeepReflection[];
  onNavigateToReflection: (reflection: DeepReflection) => void;
  onDeleteReflection: (reflectionId: string) => void;
  onClearAllReflections: () => void;
  formatTime: (time: number) => string;
  mode: 'single' | 'full';
  className?: string;
  currentSection?: string; // Current section for filtering
  allReflections?: Record<string, DeepReflection[]>; // All reflections for cross-section info
}

interface ReflectionItemProps {
  reflection: DeepReflection;
  onNavigate: (reflection: DeepReflection) => void;
  onDelete: (reflectionId: string) => void;
  formatTime: (time: number) => string;
  mode: 'single' | 'full';
  index: number;
}

/**
 * Individual Deep Reflection Item Component
 */
const ReflectionItem: React.FC<ReflectionItemProps> = ({
  reflection,
  onNavigate,
  onDelete,
  formatTime,
  mode,
  index,
}) => {
  const timeStr = formatTime(reflection.timestamp);
  const isFromFullPlayer = reflection.isFromFullPlayer;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="group"
    >
      <SacredCard variant="glass" className="p-4 transition-all duration-300 hover:shadow-lg">
        <div className="space-y-3">
          {/* Header with section info */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2 flex-1">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sacred-blue-500 to-sacred-gold-500 flex items-center justify-center">
                  <Star className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-sacred-blue-900 truncate">
                  {reflection.sectionTitle}
                </h4>
                <div className="flex items-center space-x-2 text-xs text-sacred-blue-600">
                  <Clock className="w-3 h-3" />
                  <span>{timeStr}</span>
                  {isFromFullPlayer && mode === 'single' && (
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-sacred-gold-100 text-sacred-gold-700">
                      <Sparkles className="w-3 h-3" />
                      <span>From Journey</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <button
              onClick={() => onDelete(reflection.id)}
              className="flex-shrink-0 p-1 rounded-lg text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-600 hover:bg-red-50"
              aria-label="Delete reflection"
              title="Delete this reflection"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Spiritual prompt */}
          {reflection.spiritualPrompt && (
            <div className="bg-sacred-blue-50 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <Heart className="w-4 h-4 text-sacred-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-sacred-blue-700 italic leading-relaxed">
                  {reflection.spiritualPrompt}
                </p>
              </div>
            </div>
          )}

          {/* User reflection text */}
          {reflection.reflectionText && reflection.reflectionText !== reflection.spiritualPrompt && (
            <div className="bg-sacred-gold-50 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <BookOpen className="w-4 h-4 text-sacred-gold-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-sacred-gold-800 leading-relaxed">
                  {reflection.reflectionText}
                </p>
              </div>
            </div>
          )}

          {/* Action button */}
          <div className="flex justify-end">
            <SacredButton
              variant="ghost"
              size="sm"
              onClick={() => onNavigate(reflection)}
              className="text-sacred-blue-600 hover:text-sacred-blue-800 group"
            >
              <Navigation className="w-4 h-4 mr-2 transition-transform group-hover:translate-x-0.5" />
              {mode === 'full' ? 'Study Deeply' : 'Jump to Moment'}
              {mode === 'full' && <ExternalLink className="w-3 h-3 ml-1" />}
            </SacredButton>
          </div>
        </div>
      </SacredCard>
    </motion.div>
  );
};

/**
 * Deep Reflections Panel Component
 * 
 * Displays saved Deep Reflections with spiritual framing and engagement features.
 * Encourages deeper meditation and provides contextual navigation.
 */
export default function DeepReflectionsPanel({
  reflections,
  onNavigateToReflection,
  onDeleteReflection,
  onClearAllReflections,
  formatTime,
  mode,
  className = '',
  currentSection,
  allReflections,
}: DeepReflectionsPanelProps) {
  const hasReflections = reflections.length > 0;
  const maxReflections = 5;
  
  // Calculate total reflections across all sections
  const totalReflectionsCount = allReflections 
    ? Object.values(allReflections).reduce((total, sectionReflections) => total + sectionReflections.length, 0)
    : reflections.length;
  
  // Calculate sections with reflections count
  const sectionsWithReflections = allReflections 
    ? Object.keys(allReflections).length 
    : (hasReflections ? 1 : 0);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sacred-blue-500 to-sacred-gold-500 flex items-center justify-center">
            <Star className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-sacred-blue-900">
              {mode === 'single' && currentSection ? 'Section Reflections' : 'Deep Reflections'}
            </h3>
            <p className="text-sm text-sacred-blue-600">
              {mode === 'single' && currentSection ? (
                <>
                  {reflections.length} of {maxReflections} in this section
                  {totalReflectionsCount > reflections.length && (
                    <span className="ml-2 text-xs opacity-75">
                      ({totalReflectionsCount} total across {sectionsWithReflections} sections)
                    </span>
                  )}
                </>
              ) : (
                <>
                  {totalReflectionsCount} total reflections across {sectionsWithReflections} sections
                </>
              )}
            </p>
          </div>
        </div>

        {hasReflections && (
          <SacredButton
            variant="ghost"
            size="sm"
            onClick={onClearAllReflections}
            className="text-red-500 hover:text-red-700 opacity-70 hover:opacity-100"
          >
            Clear All
          </SacredButton>
        )}
      </div>

      {/* Spiritual Instruction */}
      <SacredCard variant="glass" className="p-4 bg-gradient-to-r from-sacred-blue-50 to-sacred-gold-50">
        <div className="flex items-start space-x-3">
          <Sparkles className="w-5 h-5 text-sacred-gold-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-sacred-blue-700">
            <p className="font-medium mb-1">
              {mode === 'single' && currentSection ? 'Section Meditation Space' : 'Moments of Divine Revelation'}
            </p>
            <p className="text-xs opacity-90 leading-relaxed">
              {mode === 'single' && currentSection ? (
                'These are sacred moments from this specific section where the Spirit spoke to your heart. Each section becomes its own focused meditation space.'
              ) : (
                <>
                  These are sacred moments where the Spirit spoke to your heart across your spiritual journey. 
                  {mode === 'full' 
                    ? ' Click to study them deeply in their original context.' 
                    : ' Click to return to those transformative moments.'
                  }
                </>
              )}
            </p>
          </div>
        </div>
      </SacredCard>

      {/* Reflections List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {hasReflections ? (
            reflections
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((reflection, index) => (
                <ReflectionItem
                  key={reflection.id}
                  reflection={reflection}
                  onNavigate={onNavigateToReflection}
                  onDelete={onDeleteReflection}
                  formatTime={formatTime}
                  mode={mode}
                  index={index}
                />
              ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <SacredCard variant="glass" className="p-8">
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-sacred-blue-100 to-sacred-gold-100 flex items-center justify-center">
                    <Heart className="w-8 h-8 text-sacred-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-sacred-blue-900 mb-2">
                      No Reflections Yet
                    </h4>
                    <p className="text-sm text-sacred-blue-600 leading-relaxed max-w-xs mx-auto">
                      As you listen, save moments that speak to your heart. 
                      These become sacred touchstones for deeper meditation.
                    </p>
                  </div>
                </div>
              </SacredCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Reflection Counter */}
      {hasReflections && (
        <div className="text-center pt-2">
          <div className="inline-flex items-center space-x-2 text-xs text-sacred-blue-500">
            <div className="flex space-x-1">
              {Array.from({ length: maxReflections }).map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index < reflections.length
                      ? 'bg-sacred-gold-400'
                      : 'bg-sacred-blue-200'
                  }`}
                />
              ))}
            </div>
            <span>
              {maxReflections - reflections.length} more moments available
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export { ReflectionItem };
export type { ReflectionItemProps };
