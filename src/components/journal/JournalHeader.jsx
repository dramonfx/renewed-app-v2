
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { PlusIcon, BookOpenIcon, MagnifyingGlassIcon, AdjustmentsHorizontalIcon, SparklesIcon } from '@heroicons/react/24/outline'
import SacredButton from '@/components/ui/sacred-button'
import SacredCard from '@/components/ui/sacred-card'

export default function JournalHeader({ entries, stats, filters, onFilterChange, onNewEntry }) {
  const [showFilters, setShowFilters] = useState(false)
  
  const totalEntries = entries.length
  const mindsetCounts = stats.mindset_counts || {}

  const handleSearchChange = (e) => {
    onFilterChange({ search: e.target.value })
  }

  const handleMindsetFilter = (mindset) => {
    const newMindset = filters.mindset === mindset ? '' : mindset
    onFilterChange({ mindset: newMindset })
  }

  const handleReflectionTypeFilter = (type) => {
    const newType = filters.reflectionType === type ? '' : type
    onFilterChange({ reflectionType: newType })
  }

  const clearFilters = () => {
    onFilterChange({ mindset: '', reflectionType: '', search: '' })
  }

  const hasActiveFilters = filters.mindset || filters.reflectionType || filters.search

  return (
    <div className="mb-8">
      <SacredCard variant="heavy" className="p-8 mb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center space-x-3 mb-3">
              <SparklesIcon className="w-8 h-8 text-blue-600" />
              <h1 className="text-4xl font-bold text-sacred-dark font-serif">
                Sacred Journal
              </h1>
            </div>
            <p className="text-sacred-medium text-lg">
              Your personal sanctuary for spiritual reflection and conscious growth
            </p>
            <p className="text-sacred-medium text-sm mt-2 opacity-80">
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
              <PlusIcon className="w-5 h-5 mr-2" />
              Begin Sacred Reflection
            </SacredButton>
          </motion.div>
        </div>
      </SacredCard>

      {/* Search and Filters */}
      <SacredCard variant="glass" className="p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search your reflections..."
              value={filters.search}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
              hasActiveFilters 
                ? 'bg-blue-50 border-blue-200 text-blue-700' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <AdjustmentsHorizontalIcon className="w-5 h-5" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                {[filters.mindset, filters.reflectionType, filters.search].filter(Boolean).length}
              </span>
            )}
          </button>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Mindset Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mindset
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Natural', 'Transition', 'Spiritual'].map((mindset) => (
                    <button
                      key={mindset}
                      onClick={() => handleMindsetFilter(mindset)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {['general', 'assessment', 'daily', 'intention', 'completion'].map((type) => (
                    <button
                      key={type}
                      onClick={() => handleReflectionTypeFilter(type)}
                      className={`px-3 py-1 rounded-full text-sm capitalize transition-colors ${
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
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <BookOpenIcon className="w-5 h-5 mr-2" />
            Your Spiritual Journey
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {stats.total_entries || totalEntries}
              </div>
              <div className="text-sm text-gray-600">Total Reflections</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {mindsetCounts.Natural || 0}
              </div>
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
            <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
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
  )
}
