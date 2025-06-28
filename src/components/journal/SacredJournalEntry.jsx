
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XMarkIcon, CloudIcon, CheckCircleIcon, SparklesIcon } from '@heroicons/react/24/outline'

import SacredCard from '@/components/ui/sacred-card'
import SacredButton from '@/components/ui/sacred-button'
import MindsetDiscernmentCards from './MindsetDiscernmentCards'

export default function SacredJournalEntry({ isOpen, onClose, onSave }) {
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
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [currentPrompts, setCurrentPrompts] = useState([])
  const [inspirationVisible, setInspirationVisible] = useState(true)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        title: '',
        content: '',
        mindset: '',
        reflection_type: 'general',
        tags: []
      })
      setTagInput('')
      setError('')
      setSaveSuccess(false)
      setCurrentPrompts([])
      setInspirationVisible(true)
    }
  }, [isOpen])

  const handleMindsetSelect = (mindset) => {
    setFormData(prev => ({ ...prev, mindset }))
  }

  const handlePromptsUpdate = (prompts) => {
    setCurrentPrompts(prompts)
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

    if (!formData.mindset) {
      setError('Please select a mindset to guide your reflection.')
      return
    }

    setLoading(true)
    setError('')

    try {
      await onSave(formData)
      setSaveSuccess(true)
      
      setFormData({
        title: '',
        content: '',
        mindset: '',
        reflection_type: 'general',
        tags: []
      })
      setTagInput('')
      
      setTimeout(() => {
        setSaveSuccess(false)
        onClose()
      }, 1500)
      
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
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-7xl max-h-[95vh] overflow-hidden"
      >
        <SacredCard variant="heavy" className="overflow-hidden">
          {/* Sacred Header */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <SparklesIcon className="w-8 h-8 text-blue-600" />
                  <div>
                    <h2 className="text-2xl font-semibold text-sacred-dark font-serif">
                      Sacred Reflection
                    </h2>
                    <p className="text-sm text-sacred-medium">
                      A workshop for the soul
                    </p>
                  </div>
                </div>


                {/* Success message */}
                {saveSuccess && (
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex items-center mt-2 text-sm text-green-600"
                  >
                    <CheckCircleIcon className="w-4 h-4 mr-1" />
                    <span>Reflection saved successfully!</span>
                  </motion.div>
                )}
              </div>
              
              <button
                onClick={handleClose}
                disabled={loading}
                className="text-gray-400 hover:text-gray-600 disabled:opacity-50 p-2 rounded-lg hover:bg-white/50 transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Two-Column Sacred Layout */}
          <div className="flex h-[calc(95vh-200px)]">
            {/* Left Column - Mindset Discernment */}
            <div className="w-1/3 p-6 border-r border-gray-200 bg-gradient-to-b from-blue-25 to-indigo-25 overflow-y-auto">
              <MindsetDiscernmentCards
                selectedMindset={formData.mindset}
                onMindsetSelect={handleMindsetSelect}
                onPromptsUpdate={handlePromptsUpdate}
              />

              {/* Inspiration Section */}
              <AnimatePresence>
                {inspirationVisible && currentPrompts.length > 0 && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    className="mt-6"
                  >
                    <SacredCard variant="glass" className="p-4">
                      <h4 className="text-sm font-semibold text-sacred-dark mb-3 flex items-center">
                        <SparklesIcon className="w-4 h-4 mr-2 text-blue-500" />
                        Reflection Starters
                      </h4>
                      <div className="space-y-2">
                        {currentPrompts.map((prompt, index) => (
                          <motion.button
                            key={index}
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                content: prev.content + (prev.content ? '\n\n' : '') + prompt + '\n'
                              }))
                            }}
                            className="w-full text-left text-xs text-sacred-medium hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-200"
                          >
                            {prompt}
                          </motion.button>
                        ))}
                      </div>
                    </SacredCard>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Column - Journal Entry Form */}
            <div className="flex-1 p-6 overflow-y-auto">
              <form onSubmit={handleSubmit} className="h-full flex flex-col">
                {error && (
                  <motion.div
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
                  >
                    <p className="text-red-800">{error}</p>
                  </motion.div>
                )}

                {/* Title */}
                <div className="mb-6">
                  <label htmlFor="title" className="block text-sm font-medium text-sacred-dark mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Give your reflection a meaningful title..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                  />
                </div>

                {/* Content - Takes remaining space */}
                <div className="flex-1 mb-6">
                  <label htmlFor="content" className="block text-sm font-medium text-sacred-dark mb-2">
                    Your Sacred Reflection
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    placeholder="Share your thoughts, insights, and spiritual reflections..."
                    className="w-full h-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white/80 backdrop-blur-sm min-h-[300px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Reflection Type */}
                  <div>
                    <label htmlFor="reflection_type" className="block text-sm font-medium text-sacred-dark mb-2">
                      Reflection Type
                    </label>
                    <select
                      id="reflection_type"
                      name="reflection_type"
                      value={formData.reflection_type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                    >
                      <option value="general">General Reflection</option>
                      <option value="assessment">Self Assessment</option>
                      <option value="daily">Daily Practice</option>
                      <option value="intention">Intention Setting</option>
                      <option value="completion">Completion Ceremony</option>
                    </select>
                  </div>

                  {/* Tags */}
                  <div>
                    <label htmlFor="tagInput" className="block text-sm font-medium text-sacred-dark mb-2">
                      Tags (Optional)
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        id="tagInput"
                        name="tagInput"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Add meaningful tags..."
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                      />
                      <SacredButton
                        type="button"
                        onClick={handleAddTag}
                        variant="ghost"
                        size="sm"
                      >
                        Add
                      </SacredButton>
                    </div>
                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
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
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <SacredButton
                    type="button"
                    onClick={handleClose}
                    disabled={loading}
                    variant="ghost"
                  >
                    Cancel
                  </SacredButton>
                  <SacredButton
                    type="submit"
                    disabled={loading || (!formData.title.trim() && !formData.content.trim()) || !formData.mindset}
                    loading={loading}
                    variant="primary"
                  >
                    {loading ? 'Saving...' : 'Save Sacred Reflection'}
                  </SacredButton>
                </div>
              </form>
            </div>
          </div>
        </SacredCard>
      </motion.div>
    </div>
  )
}
