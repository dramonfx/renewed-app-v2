
'use client'

import { useState } from 'react'
import { XMarkIcon, PencilIcon, TrashIcon, ClockIcon, TagIcon } from '@heroicons/react/24/outline'

export default function JournalEntryModal({ entry, onClose, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    title: entry.title || '',
    content: entry.content || '',
    mindset: entry.mindset || '',
    reflection_type: entry.reflection_type || 'general',
    tags: entry.tags || []
  })
  const [tagInput, setTagInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getMindsetColor = (mindset) => {
    switch (mindset) {
      case 'Natural':
        return 'bg-red-100 text-red-800'
      case 'Transition':
        return 'bg-yellow-100 text-yellow-800'
      case 'Spiritual':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getReflectionTypeColor = (type) => {
    switch (type) {
      case 'assessment':
        return 'bg-blue-100 text-blue-800'
      case 'daily':
        return 'bg-purple-100 text-purple-800'
      case 'intention':
        return 'bg-indigo-100 text-indigo-800'
      case 'completion':
        return 'bg-pink-100 text-pink-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddTag = (e) => {
    e.preventDefault()
    const tag = tagInput.trim()
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.target.name === 'tagInput') {
      e.preventDefault()
      handleAddTag(e)
    }
  }

  const handleSave = async () => {
    if (!formData.title.trim() && !formData.content.trim()) {
      setError('Please provide either a title or content for your reflection.')
      return
    }

    setLoading(true)
    setError('')

    try {
      await onUpdate(entry.id, formData)
      setIsEditing(false)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setLoading(true)
    try {
      await onDelete(entry.id)
    } catch (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      onClose()
      setError('')
      setIsEditing(false)
    }
  }

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form data when canceling edit
      setFormData({
        title: entry.title || '',
        content: entry.content || '',
        mindset: entry.mindset || '',
        reflection_type: entry.reflection_type || 'general',
        tags: entry.tags || []
      })
    }
    setIsEditing(!isEditing)
    setError('')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900">
              {isEditing ? 'Edit Reflection' : 'Sacred Reflection'}
            </h2>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <ClockIcon className="w-4 h-4" />
                <span>Created {formatDate(entry.created_at)}</span>
              </div>
              {entry.updated_at !== entry.created_at && (
                <div className="flex items-center space-x-1">
                  <span>Updated {formatDate(entry.updated_at)}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleEditToggle}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-blue-600 disabled:opacity-50"
              title={isEditing ? "Cancel editing" : "Edit reflection"}
            >
              <PencilIcon className="w-5 h-5" />
            </button>
            
            <button
              onClick={handleDelete}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-red-600 disabled:opacity-50"
              title="Delete reflection"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
            
            <button
              onClick={handleClose}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {isEditing ? (
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Give your reflection a meaningful title..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Content */}
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Reflection
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={12}
                  placeholder="Share your thoughts, insights, and spiritual reflections..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Mindset */}
                <div>
                  <label htmlFor="mindset" className="block text-sm font-medium text-gray-700 mb-2">
                    Current Mindset
                  </label>
                  <select
                    id="mindset"
                    name="mindset"
                    value={formData.mindset}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Choose your mindset...</option>
                    <option value="Natural">Natural Mind</option>
                    <option value="Transition">In Transition</option>
                    <option value="Spiritual">Spiritual Mind</option>
                  </select>
                </div>

                {/* Reflection Type */}
                <div>
                  <label htmlFor="reflection_type" className="block text-sm font-medium text-gray-700 mb-2">
                    Reflection Type
                  </label>
                  <select
                    id="reflection_type"
                    name="reflection_type"
                    value={formData.reflection_type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="general">General Reflection</option>
                    <option value="assessment">Self Assessment</option>
                    <option value="daily">Daily Practice</option>
                    <option value="intention">Intention Setting</option>
                    <option value="completion">Completion Ceremony</option>
                  </select>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label htmlFor="tagInput" className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (Optional)
                </label>
                <div className="flex space-x-2 mb-3">
                  <input
                    type="text"
                    id="tagInput"
                    name="tagInput"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add tags to categorize your reflection..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Add
                  </button>
                </div>
                
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center space-x-1"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Edit Actions */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleEditToggle}
                  disabled={loading}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={loading || (!formData.title.trim() && !formData.content.trim())}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Title and Metadata */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  {entry.title || 'Untitled Reflection'}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  {entry.mindset && (
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMindsetColor(entry.mindset)}`}>
                      {entry.mindset} Mind
                    </span>
                  )}
                  
                  {entry.reflection_type && entry.reflection_type !== 'general' && (
                    <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getReflectionTypeColor(entry.reflection_type)}`}>
                      {entry.reflection_type}
                    </span>
                  )}
                  
                  {entry.tags && entry.tags.length > 0 && (
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <TagIcon className="w-4 h-4" />
                      <span>{entry.tags.length} tag{entry.tags.length !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              {entry.content && (
                <div className="prose max-w-none">
                  <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {entry.content}
                  </div>
                </div>
              )}

              {/* Tags */}
              {entry.tags && entry.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {entry.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
