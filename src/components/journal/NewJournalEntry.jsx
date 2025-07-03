'use client';

import { useState, useEffect, useCallback } from 'react';
import { XMarkIcon, CloudIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import journalStorage from '@/lib/journalStorage';

export default function NewJournalEntry({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    mindset: '',
    reflection_type: 'general',
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [autoSaveStatus, setAutoSaveStatus] = useState(''); // 'saving', 'saved', 'error'
  const [draftRestored, setDraftRestored] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Auto-save function with debouncing
  const autoSave = useCallback(async () => {
    if (formData.title.trim() || formData.content.trim()) {
      setAutoSaveStatus('saving');
      try {
        const success = journalStorage.saveDraft(formData);
        setAutoSaveStatus(success ? 'saved' : 'error');

        // Clear status after 2 seconds
        setTimeout(() => setAutoSaveStatus(''), 2000);
      } catch (error) {
        setAutoSaveStatus('error');
        setTimeout(() => setAutoSaveStatus(''), 2000);
      }
    }
  }, [formData]);

  // Load draft when modal opens
  useEffect(() => {
    if (isOpen && !draftRestored) {
      const draft = journalStorage.loadDraft();
      if (draft) {
        setFormData({
          title: draft.title || '',
          content: draft.content || '',
          mindset: draft.mindset || '',
          reflection_type: draft.reflection_type || 'general',
          tags: draft.tags || [],
        });
        setDraftRestored(true);
      }
    }
  }, [isOpen, draftRestored]);

  // Auto-save with debouncing
  useEffect(() => {
    if (!isOpen) return;

    const timeoutId = setTimeout(() => {
      autoSave();
    }, 1000); // Auto-save after 1 second of inactivity

    return () => clearTimeout(timeoutId);
  }, [formData, isOpen, autoSave]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        title: '',
        content: '',
        mindset: '',
        reflection_type: 'general',
        tags: [],
      });
      setTagInput('');
      setError('');
      setAutoSaveStatus('');
      setDraftRestored(false);
      setSaveSuccess(false);
    }
  }, [isOpen]);

  const handleAddTag = (e) => {
    e.preventDefault();
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.target.name === 'tagInput') {
      e.preventDefault();
      handleAddTag(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() && !formData.content.trim()) {
      setError('Please provide either a title or content for your reflection.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onSave(formData);

      // Show success message
      setSaveSuccess(true);

      // Reset form
      setFormData({
        title: '',
        content: '',
        mindset: '',
        reflection_type: 'general',
        tags: [],
      });
      setTagInput('');

      // Clear draft since we successfully saved
      journalStorage.clearDraft();

      // Close modal after a short delay
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 1500);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      setError('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900">New Sacred Reflection</h2>

            {/* Auto-save status indicator */}
            {autoSaveStatus && (
              <div className="mt-1 flex items-center text-sm">
                {autoSaveStatus === 'saving' && (
                  <div className="flex items-center text-blue-600">
                    <CloudIcon className="mr-1 h-4 w-4 animate-pulse" />
                    <span>Saving draft...</span>
                  </div>
                )}
                {autoSaveStatus === 'saved' && (
                  <div className="flex items-center text-green-600">
                    <CloudIcon className="mr-1 h-4 w-4" />
                    <span>Draft saved</span>
                  </div>
                )}
                {autoSaveStatus === 'error' && (
                  <div className="flex items-center text-red-600">
                    <CloudIcon className="mr-1 h-4 w-4" />
                    <span>Error saving draft</span>
                  </div>
                )}
              </div>
            )}

            {/* Success message */}
            {saveSuccess && (
              <div className="mt-1 flex items-center text-sm text-green-600">
                <CheckCircleIcon className="mr-1 h-4 w-4" />
                <span>Reflection saved successfully!</span>
              </div>
            )}
          </div>

          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Title */}
          <div className="mb-6">
            <label htmlFor="title" className="mb-2 block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Give your reflection a meaningful title..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Content */}
          <div className="mb-6">
            <label htmlFor="content" className="mb-2 block text-sm font-medium text-gray-700">
              Your Reflection
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              rows={8}
              placeholder="Share your thoughts, insights, and spiritual reflections..."
              className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Mindset */}
            <div>
              <label htmlFor="mindset" className="mb-2 block text-sm font-medium text-gray-700">
                Current Mindset
              </label>
              <select
                id="mindset"
                name="mindset"
                value={formData.mindset}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose your mindset...</option>
                <option value="Natural">Natural Mind</option>
                <option value="Transition">In Transition</option>
                <option value="Spiritual">Spiritual Mind</option>
              </select>
            </div>

            {/* Reflection Type */}
            <div>
              <label
                htmlFor="reflection_type"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Reflection Type
              </label>
              <select
                id="reflection_type"
                name="reflection_type"
                value={formData.reflection_type}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
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
            <label htmlFor="tagInput" className="mb-2 block text-sm font-medium text-gray-700">
              Tags (Optional)
            </label>
            <div className="mb-3 flex space-x-2">
              <input
                type="text"
                id="tagInput"
                name="tagInput"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add tags to categorize your reflection..."
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="rounded-lg bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200"
              >
                Add
              </button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="flex items-center space-x-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 border-t border-gray-200 pt-6">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="rounded-lg border border-gray-300 px-6 py-2 text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || (!formData.title.trim() && !formData.content.trim())}
              className="flex items-center space-x-2 rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading && <CloudIcon className="h-4 w-4 animate-spin" />}
              <span>{loading ? 'Saving...' : 'Save Reflection'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
