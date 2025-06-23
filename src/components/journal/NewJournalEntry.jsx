
// src/components/journal/NewJournalEntry.jsx
// Sacred New Journal Entry - Creation sanctuary for spiritual thoughts

'use client';

import { useState } from 'react';
import JournalEditor from './JournalEditor';
import { X, Save, Sparkles, Tag } from 'lucide-react';

export default function NewJournalEntry({ onSave, onCancel }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [reflectionType, setReflectionType] = useState('journal');
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // Sacred reflection types
  const reflectionTypes = [
    { value: 'journal', label: 'Journal Entry', icon: '📖' },
    { value: 'gratitude', label: 'Gratitude', icon: '🙏' },
    { value: 'challenge', label: 'Challenge', icon: '⚡' },
    { value: 'insight', label: 'Insight', icon: '✨' },
    { value: 'prayer', label: 'Prayer', icon: '🕊️' },
    { value: 'growth', label: 'Growth', icon: '🌱' },
    { value: 'joy', label: 'Joy', icon: '☀️' }
  ];

  // Handle tag addition
  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 5) {
      setTags(prev => [...prev, newTag.trim()]);
      setNewTag('');
    }
  };

  // Handle tag removal
  const handleRemoveTag = (tagToRemove) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  // Handle tag input key press
  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required for your sacred reflection';
    }

    if (!content.trim() || content.trim() === '<p></p>') {
      newErrors.content = 'Please share your thoughts and reflections';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save
  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);

      const response = await fetch('/api/journal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          reflection_type: reflectionType,
          tags
        }),
      });

      if (response.ok) {
        const data = await response.json();
        onSave?.(data.entry);
      } else {
        const errorData = await response.json();
        setErrors({ submit: errorData.error || 'Failed to save your reflection' });
      }
    } catch (error) {
      console.error('Error saving journal entry:', error);
      setErrors({ submit: 'Failed to save your reflection. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  // Sacred inspirational prompts based on reflection type
  const getPlaceholder = (type) => {
    const placeholders = {
      journal: "What's on your heart today? Let your thoughts flow freely...",
      gratitude: "What fills your heart with gratitude today?",
      challenge: "What challenge are you facing, and how might you grow through it?",
      insight: "What spiritual insight or understanding has come to you?",
      prayer: "Share your sacred conversation, your hopes and requests...",
      growth: "How are you growing and transforming on this spiritual journey?",
      joy: "What brings you joy and fills your spirit with light?"
    };
    return placeholders[type] || placeholders.journal;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Sacred Header */}
        <div className="sticky top-0 bg-sacred-blue-50 border-b border-sacred-blue-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="sacred-icon-bg-gold w-10 h-10">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-sacred-serif text-2xl font-bold text-sacred-blue-800">
                  New Sacred Reflection
                </h2>
                <p className="text-sm text-sacred-blue-600">
                  Create a space for your thoughts and spiritual insights
                </p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-sacred-blue-100 rounded-lg transition-colors"
              title="Close"
            >
              <X className="w-6 h-6 text-sacred-blue-600" />
            </button>
          </div>
        </div>

        {/* Sacred Form */}
        <div className="p-6 space-y-6">
          {/* Sacred Title Input */}
          <div>
            <label className="sacred-label">
              Title of Your Reflection
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your reflection a meaningful title..."
              className={`sacred-input ${errors.title ? 'error' : ''}`}
              maxLength={200}
            />
            {errors.title && (
              <p className="sacred-error">{errors.title}</p>
            )}
          </div>

          {/* Sacred Reflection Type */}
          <div>
            <label className="sacred-label">
              Type of Reflection
            </label>
            <select
              value={reflectionType}
              onChange={(e) => setReflectionType(e.target.value)}
              className="sacred-input"
            >
              {reflectionTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sacred Tags */}
          <div>
            <label className="sacred-label flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Tags (Optional)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleTagKeyPress}
                placeholder="Add a tag..."
                className="sacred-input flex-1"
                maxLength={20}
              />
              <button
                type="button"
                onClick={handleAddTag}
                disabled={!newTag.trim() || tags.length >= 5}
                className="sacred-button px-4"
              >
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-sacred-blue-100 text-sacred-blue-700 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-sacred-blue-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <p className="text-xs text-sacred-blue-500 mt-1">
              Add up to 5 tags to help categorize your reflection
            </p>
          </div>

          {/* Sacred Editor */}
          <div>
            <label className="sacred-label">
              Your Sacred Reflection
            </label>
            <JournalEditor
              content={content}
              onChange={setContent}
              placeholder={getPlaceholder(reflectionType)}
            />
            {errors.content && (
              <p className="sacred-error mt-2">{errors.content}</p>
            )}
          </div>

          {/* Sacred Error Message */}
          {errors.submit && (
            <div className="sacred-error-message">
              {errors.submit}
            </div>
          )}
        </div>

        {/* Sacred Footer */}
        <div className="sticky bottom-0 bg-sacred-blue-50 border-t border-sacred-blue-200 p-6 rounded-b-2xl">
          <div className="flex items-center justify-between">
            <p className="text-sm text-sacred-blue-600 italic">
              Take your time. Let your thoughts flow naturally.
            </p>
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="px-6 py-2 text-sacred-blue-600 hover:bg-sacred-blue-100 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="sacred-button flex items-center gap-2 px-6"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Reflection'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
