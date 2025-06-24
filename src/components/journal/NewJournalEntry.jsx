
'use client'

import { useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

export default function NewJournalEntry({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    mindset: '',
    reflection_type: 'general',
    tags: []
  })
  const [tagInput, setTagInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title.trim() && !formData.content.trim()) {
      setError('Please provide either a title or content for your reflection.')
      return
    }

    setLoading(true)
    setError('')

    try {
      await onSave(formData)
      // Reset form
      setFormData({
        title: '',
        content: '',
        mindset: '',
        reflection_type: 'general',
        tags: []
      })
      setTagInput('')
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      onClose()
      setError('')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">New Sacred Reflection</h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Title */}
          <div className="mb-6">
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
          <div className="mb-6">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Your Reflection
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              rows={8}
              placeholder="Share your thoughts, insights, and spiritual reflections..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
          <div className="mb-8">
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

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || (!formData.title.trim() && !formData.content.trim())}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save Reflection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
