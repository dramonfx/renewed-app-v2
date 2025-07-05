
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  RotateCcw, 
  Clock, 
  Sparkles,
  ArrowRight,
  X
} from 'lucide-react';
import SacredButton from '@/components/ui/sacred-button';
import SacredCard from '@/components/ui/sacred-card';

export interface GlobalResumePanelProps {
  hasValidResumeState: boolean;
  getResumeText: () => string | null;
  onResume: () => void;
  onClearResume: () => void;
  className?: string;
}

/**
 * Global Resume Panel Component
 * 
 * Provides seamless continuation of the spiritual journey by showing
 * where the user left off and offering resume functionality.
 */
export default function GlobalResumePanel({
  hasValidResumeState,
  getResumeText,
  onResume,
  onClearResume,
  className = '',
}: GlobalResumePanelProps) {
  const resumeText = getResumeText();

  if (!hasValidResumeState || !resumeText) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={className}
    >
      <SacredCard variant="heavy" className="overflow-hidden">
        <div className="bg-gradient-to-r from-sacred-blue-500 to-sacred-gold-500 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <RotateCcw className="w-5 h-5 text-white" />
              </div>
              <div className="text-white">
                <h3 className="font-semibold text-sm">Continue Your Journey</h3>
                <p className="text-xs opacity-90">Pick up where your heart left off</p>
              </div>
            </div>
            
            <button
              onClick={onClearResume}
              className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Clear resume state"
              title="Start fresh from the beginning"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {/* Resume Information */}
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-lg bg-sacred-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                <Clock className="w-4 h-4 text-sacred-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sacred-blue-900 font-medium leading-relaxed">
                  {resumeText}
                </p>
                <p className="text-sm text-sacred-blue-600 mt-1">
                  Your spiritual journey continues where divine revelation was flowing.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-2 text-xs text-sacred-blue-500">
                <Sparkles className="w-3 h-3" />
                <span>Sacred continuation enabled</span>
              </div>
              
              <SacredButton
                variant="primary"
                size="sm"
                onClick={onResume}
                className="group"
              >
                <Play className="w-4 h-4 mr-2" />
                Continue Journey
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-0.5" />
              </SacredButton>
            </div>
          </div>
        </div>
      </SacredCard>
    </motion.div>
  );
}
