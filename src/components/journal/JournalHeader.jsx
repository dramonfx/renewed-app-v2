'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  PlusIcon,
  BookOpenIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import SacredButton from '@/components/ui/sacred-button';
import SacredCard from '@/components/ui/sacred-card';

export default function JournalHeader({ entries, stats, filters, onFilterChange, onNewEntry }) {
  const [showFilters, setShowFilters] = useState(false);

  const totalEntries = entries.length;
  const mindsetCounts = stats.mindset_counts || {};

  const handleSearchChange = (e) => {
    onFilterChange({ search: e.target.value });
  };

  const handleMindsetFilter = (mindset) => {
    const newMindset = filters.mindset === mindset ? '' : mindset;
    onFilterChange({ mindset: newMindset });
  };

  const handleReflectionTypeFilter = (type) => {
    const newType = filters.reflectionType === type ? '' : type;
    onFilterChange({ reflectionType: newType });
  };

  const clearFilters = () => {
    onFilterChange({ mindset: '', reflectionType: '', search: '' });
  };

  const hasActiveFilters = filters.mindset || filters.reflectionType || filters.search;

  return (
    <div className="mb-8">
      <SacredCard variant="heavy" className="mb-6 p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-3 flex items-center space-x-3">
              <SparklesIcon className="h-8 w-8 text-blue-600" />
              <h1 className="text-sacred-dark font-serif text-4xl font-bold">Sacred Journal</h1>
            </div>
            <p className="text-sacred-medium text-lg">
              Your personal sanctuary for spiritual reflection and conscious growth
            </p>
            <p className="text-sacred-medium mt-2 text-sm opacity-80">
              A workshop for the soul • Mindful reflection • Sacred space
            </p>
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-shrink-0"
          >
            <SacredButton
              onClick={onNewEntry}
              variant="primary"
              size="lg"
              className="shadow-xl hover:shadow-2xl"
            >
              <PlusIcon className="mr-2 h-5 w-5" />
              Begin Sacred Reflection
            </SacredButton>
          </motion.div>
        </div>
      </SacredCard>

      {/* Search and Filters */}
      <SacredCard variant="glass" className="mb-6 p-6">
        <div className="flex flex-col gap-4 md:flex-row">
          {/* Search */}
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
            <input
              type="text"
              placeholder="Search your reflections..."
              value={filters.search}
              onChange={handleSearchChange}
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 rounded-lg border px-4 py-2 transition-colors ${
              hasActiveFilters
                ? 'border-blue-200 bg-blue-50 text-blue-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <AdjustmentsHorizontalIcon className="h-5 w-5" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="rounded-full bg-blue-500 px-2 py-1 text-xs text-white">
                {[filters.mindset, filters.reflectionType, filters.search].filter(Boolean).length}
              </span>
            )}
          </button>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="mt-4 border-t border-gray-200 pt-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Mindset Filter */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Mindset</label>
                <div className="flex flex-wrap gap-2">
                  {['Natural', 'Transition', 'Spiritual'].map((mindset) => (
                    <button
                      key={mindset}
                      onClick={() => handleMindsetFilter(mindset)}
                      className={`rounded-full px-3 py-1 text-sm transition-colors ${
                        filters.mindset === mindset
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {mindset} ({mindsetCounts[mindset] || 0})
                    </button>
                  ))}
                </div>
              </div>

              {/* Reflection Type Filter */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Type</label>
                <div className="flex flex-wrap gap-2">
                  {['general', 'assessment', 'daily', 'intention', 'completion'].map((type) => (
                    <button
                      key={type}
                      onClick={() => handleReflectionTypeFilter(type)}
                      className={`rounded-full px-3 py-1 text-sm capitalize transition-colors ${
                        filters.reflectionType === type
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}
      </SacredCard>

      {/* Statistics */}
      {totalEntries > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <SacredCard variant="glass" className="p-6">
            <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-800">
              <BookOpenIcon className="mr-2 h-5 w-5" />
              Your Spiritual Journey
            </h3>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {stats.total_entries || totalEntries}
                </div>
                <div className="text-sm text-gray-600">Total Reflections</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{mindsetCounts.Natural || 0}</div>
                <div className="text-sm text-gray-600">Natural Mind</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {mindsetCounts.Transition || 0}
                </div>
                <div className="text-sm text-gray-600">In Transition</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {mindsetCounts.Spiritual || 0}
                </div>
                <div className="text-sm text-gray-600">Spiritual Mind</div>
              </div>
            </div>

            {stats.entries_this_week !== undefined && (
              <div className="mt-4 grid grid-cols-2 gap-4 border-t border-gray-100 pt-4 text-center md:grid-cols-3">
                <div>
                  <div className="text-lg font-semibold text-blue-600">
                    {stats.entries_this_week}
                  </div>
                  <div className="text-sm text-gray-600">This Week</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-purple-600">
                    {stats.entries_this_month}
                  </div>
                  <div className="text-sm text-gray-600">This Month</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-indigo-600">
                    {stats.average_content_length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Avg. Words</div>
                </div>
              </div>
            )}
          </SacredCard>
        </motion.div>
      )}
    </div>
  );
}
