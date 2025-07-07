
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Sparkles, Clock, BookOpen, Send } from 'lucide-react';
import { useDeepReflection } from '@/hooks/useDeepReflection';
import type { CreateDeepReflectionRequest } from '@/types';

interface DeepReflectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionId: string;
  sectionTitle: string;
  audioTitle?: string;
  currentTimestamp: number;
  onReflectionSaved?: () => void;
}

/**
 * Sacred Deep Reflection Modal
 * A beautiful, gentle interface for capturing spiritual insights during audio playback
 */
export default function DeepReflectionModal({
  isOpen,
  onClose,
  sectionId,
  sectionTitle,
  audioTitle,
  currentTimestamp,
  onReflectionSaved
}: DeepReflectionModalProps) {
  const [reflectionText, setReflectionText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { createReflection } = useDeepReflection();

  // Format timestamp for display
  const formatTimestamp = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Auto-focus textarea when modal opens
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 300); // Delay to allow animation to start
    }
  }, [isOpen]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setReflectionText('');
      setIsSubmitting(false);
      setShowSuccess(false);
    }
  }, [isOpen]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reflectionText.trim() || isSubmitting) return;

    setIsSubmitting(true);

    const reflectionData: CreateDeepReflectionRequest = {
      section_id: sectionId,
      section_title: sectionTitle,
      audio_title: audioTitle,
      audio_timestamp: currentTimestamp,
      answer_text: reflectionText.trim(),
      tags: [] // Could be enhanced to extract tags automatically
    };

    const result = await createReflection(reflectionData);

    if (result.success) {
      setShowSuccess(true);
      onReflectionSaved?.();
      
      // Auto-close after success animation
      setTimeout(() => {
        onClose();
      }, 2000);
    } else {
      console.error('Failed to save reflection:', result.error);
    }

    setIsSubmitting(false);
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit(e as any);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            className="relative w-full max-w-md mx-auto"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ 
              type: 'spring', 
              stiffness: 300, 
              damping: 30,
              duration: 0.4 
            }}
          >
            {/* Sacred Glow Effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-sacred-blue-200/20 to-sacred-blue-300/20 blur-xl" />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent" />

            {/* Modal Content */}
            <div className="relative bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
              {/* Success State */}
              <AnimatePresence>
                {showSuccess && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center z-10"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <div className="text-center">
                      <motion.div
                        className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                      >
                        <Heart className="w-8 h-8 text-emerald-600" />
                      </motion.div>
                      <motion.h3
                        className="text-lg font-semibold text-emerald-700 mb-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        Reflection Saved
                      </motion.h3>
                      <motion.p
                        className="text-sm text-emerald-600"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        Your sacred insight has been preserved
                      </motion.p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Header */}
              <div className="relative px-6 pt-6 pb-4">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 transition-colors"
                  aria-label="Close reflection modal"
                >
                  <X className="w-5 h-5 text-sacred-blue-600" />
                </button>

                <div className="pr-12">
                  <motion.div
                    className="flex items-center gap-3 mb-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sacred-blue-400 to-sacred-blue-600 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-sacred-blue-900">
                        Deep Reflection
                      </h2>
                      <p className="text-sm text-sacred-blue-600">
                        Capture this sacred moment
                      </p>
                    </div>
                  </motion.div>

                  {/* Context Info */}
                  <motion.div
                    className="flex items-center gap-4 text-xs text-sacred-blue-600 bg-sacred-blue-50 rounded-lg p-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      <span className="font-medium">{sectionTitle}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span className="font-mono">{formatTimestamp(currentTimestamp)}</span>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="px-6 pb-6">
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {/* Reflection Textarea */}
                  <div>
                    <label
                      htmlFor="reflection-text"
                      className="block text-sm font-medium text-sacred-blue-700 mb-2"
                    >
                      What spiritual insight is arising for you in this moment?
                    </label>
                    <textarea
                      ref={textareaRef}
                      id="reflection-text"
                      value={reflectionText}
                      onChange={(e) => setReflectionText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Share your sacred insight, realization, or how this moment speaks to your spiritual journey..."
                      className="w-full min-h-[120px] p-4 rounded-xl border border-sacred-blue-200 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-sacred-blue-400 focus:border-transparent transition-all duration-200 resize-none text-sacred-blue-900 placeholder-sacred-blue-400"
                      maxLength={1000}
                      required
                    />
                    <div className="flex justify-between items-center mt-2 text-xs text-sacred-blue-500">
                      <span>Press ⌘+Enter to save</span>
                      <span>{reflectionText.length}/1000</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-4 py-3 text-sacred-blue-600 bg-sacred-blue-50 hover:bg-sacred-blue-100 rounded-xl transition-colors duration-200 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!reflectionText.trim() || isSubmitting}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-sacred-blue-500 to-sacred-blue-600 hover:from-sacred-blue-600 hover:to-sacred-blue-700 text-white rounded-xl transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Save Reflection
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export type { DeepReflectionModalProps };
