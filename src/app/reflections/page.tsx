
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Heart, 
  Clock, 
  BookOpen, 
  Calendar,
  Filter,
  Search,
  Trash2,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { useDeepReflection } from '@/hooks/useDeepReflection';
import type { DeepReflection } from '@/types';

/**
 * Reflections Page
 * A sacred space to review and manage captured spiritual insights
 */
export default function ReflectionsPage() {
  const { 
    reflections, 
    loading, 
    error, 
    deleteReflection, 
    stats,
    refreshReflections 
  } = useDeepReflection();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Filter reflections based on search and section
  const filteredReflections = reflections.filter(reflection => {
    const matchesSearch = !searchQuery || 
      reflection.answer_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reflection.section_title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSection = selectedSection === 'all' || 
      reflection.section_id === selectedSection;
    
    return matchesSearch && matchesSection;
  });

  // Get unique sections for filter
  const uniqueSections = Array.from(
    new Set(reflections.map(r => r.section_id))
  ).map(sectionId => {
    const reflection = reflections.find(r => r.section_id === sectionId);
    return {
      id: sectionId,
      title: reflection?.section_title || sectionId
    };
  });

  // Handle reflection deletion
  const handleDeleteReflection = async (id: string) => {
    if (!confirm('Are you sure you want to delete this reflection? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(id);
    const result = await deleteReflection(id);
    
    if (!result.success) {
      console.error('Failed to delete reflection:', result.error);
    }
    
    setIsDeleting(null);
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sacred-blue-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <div className="w-12 h-12 mx-auto mb-4 border-2 border-sacred-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sacred-blue-600">Loading your reflections...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sacred-blue-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <Heart className="w-12 h-12 mx-auto mb-4 text-red-400" />
              <p className="text-red-600 mb-4">Unable to load reflections</p>
              <button 
                onClick={refreshReflections}
                className="px-4 py-2 bg-sacred-blue-600 text-white rounded-lg hover:bg-sacred-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sacred-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Navigation */}
            <div className="flex items-center gap-4 mb-6">
              <Link 
                href="/"
                className="flex items-center gap-2 text-sacred-blue-600 hover:text-sacred-blue-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>
            </div>

            {/* Title Section */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-sacred-blue-400 to-sacred-blue-600 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-sacred-blue-900 mb-2">
                Sacred Reflections
              </h1>
              <p className="text-sacred-blue-600 max-w-2xl mx-auto">
                A collection of your spiritual insights and revelations captured during your journey through the teachings
              </p>
            </div>

            {/* Stats */}
            {stats && (
              <motion.div
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 text-center border border-sacred-blue-100">
                  <div className="text-2xl font-bold text-sacred-blue-700 mb-1">
                    {stats.total_reflections}
                  </div>
                  <div className="text-xs text-sacred-blue-600">Total Reflections</div>
                </div>
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 text-center border border-sacred-blue-100">
                  <div className="text-2xl font-bold text-sacred-blue-700 mb-1">
                    {stats.sections_with_reflections}
                  </div>
                  <div className="text-xs text-sacred-blue-600">Sections Explored</div>
                </div>
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 text-center border border-sacred-blue-100">
                  <div className="text-2xl font-bold text-sacred-blue-700 mb-1">
                    {stats.reflections_this_week}
                  </div>
                  <div className="text-xs text-sacred-blue-600">This Week</div>
                </div>
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 text-center border border-sacred-blue-100">
                  <div className="text-2xl font-bold text-sacred-blue-700 mb-1">
                    {Math.round(stats.average_reflection_length)}
                  </div>
                  <div className="text-xs text-sacred-blue-600">Avg. Words</div>
                </div>
              </motion.div>
            )}

            {/* Search and Filter */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-sacred-blue-400" />
                <input
                  type="text"
                  placeholder="Search your reflections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-sacred-blue-200 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-sacred-blue-400 focus:border-transparent transition-all"
                />
              </div>

              {/* Section Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-sacred-blue-400" />
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="pl-10 pr-8 py-3 rounded-xl border border-sacred-blue-200 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-sacred-blue-400 focus:border-transparent transition-all appearance-none cursor-pointer"
                >
                  <option value="all">All Sections</option>
                  {uniqueSections.map(section => (
                    <option key={section.id} value={section.id}>
                      {section.title}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>
          </motion.div>

          {/* Reflections List */}
          {filteredReflections.length === 0 ? (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Heart className="w-16 h-16 mx-auto mb-4 text-sacred-blue-300" />
              <h3 className="text-xl font-semibold text-sacred-blue-700 mb-2">
                {searchQuery || selectedSection !== 'all' 
                  ? 'No reflections match your filters' 
                  : 'No reflections yet'}
              </h3>
              <p className="text-sacred-blue-600 mb-6">
                {searchQuery || selectedSection !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'Start your spiritual journey by listening to a section and capturing your first insight'}
              </p>
              {(!searchQuery && selectedSection === 'all') && (
                <Link 
                  href="/book"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sacred-blue-500 to-sacred-blue-600 text-white rounded-xl hover:from-sacred-blue-600 hover:to-sacred-blue-700 transition-all"
                >
                  <BookOpen className="w-4 h-4" />
                  Begin Your Journey
                </Link>
              )}
            </motion.div>
          ) : (
            <div className="space-y-6">
              {filteredReflections.map((reflection, index) => (
                <motion.div
                  key={reflection.id}
                  className="bg-white/70 backdrop-blur-sm rounded-2xl border border-sacred-blue-100 overflow-hidden hover:shadow-lg transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sacred-blue-400 to-sacred-blue-600 flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sacred-blue-900">
                            {reflection.section_title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-sacred-blue-600">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span className="font-mono">{reflection.formatted_timestamp}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{formatDate(reflection.created_at)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteReflection(reflection.id)}
                        disabled={isDeleting === reflection.id}
                        className="p-2 text-sacred-blue-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                        aria-label="Delete reflection"
                        title="Delete this reflection"
                      >
                        {isDeleting === reflection.id ? (
                          <div className="w-4 h-4 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* Reflection Content */}
                    <div className="prose prose-sacred-blue max-w-none">
                      <p className="text-sacred-blue-800 leading-relaxed">
                        &ldquo;{reflection.answer_text}&rdquo;
                      </p>
                    </div>

                    {/* Tags */}
                    {reflection.tags && reflection.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {reflection.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-3 py-1 bg-sacred-blue-100 text-sacred-blue-700 rounded-full text-xs font-medium"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Footer Message */}
          {filteredReflections.length > 0 && (
            <motion.div
              className="text-center mt-12 py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <p className="text-sacred-blue-600 italic">
                &ldquo;Every reflection is a step deeper into the Spirit&rsquo;s wisdom&rdquo;
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
