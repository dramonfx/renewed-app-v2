
// src/components/journal/NewJournalEntry.jsx
// Sacred New Journal Entry - Creation sanctuary for spiritual thoughts

'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import JournalEditor from './JournalEditor';
import MindsetSelector from './MindsetSelector';
import { X, Save, Sparkles, Tag, Heart, Brain, Zap } from 'lucide-react';

export default function NewJournalEntry({ onSave, onCancel }) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [reflectionType, setReflectionType] = useState('gratitude');
  const [mindset, setMindset] = useState(null);
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // Enhanced Sacred reflection types for spiritual discernment
  const reflectionTypes = [
    { 
      value: 'gratitude', 
      label: 'Gratitude & Appreciation', 
      icon: '🙏', 
      description: 'Focusing on blessings and thankfulness',
      color: 'text-emerald-600'
    },
    { 
      value: 'challenge', 
      label: 'Challenge & Growth', 
      icon: '⚡', 
      description: 'Working through difficulties with wisdom',
      color: 'text-orange-600'
    },
    { 
      value: 'insight', 
      label: 'Spiritual Insight', 
      icon: '✨', 
      description: 'Moments of divine understanding',
      color: 'text-purple-600'
    },
    { 
      value: 'prayer', 
      label: 'Prayer & Communion', 
      icon: '🕊️', 
      description: 'Sacred communication and requests',
      color: 'text-blue-600'
    },
    { 
      value: 'discernment', 
      label: 'Mind Discernment', 
      icon: '🧠', 
      description: 'Distinguishing Natural vs Spiritual thoughts',
      color: 'text-indigo-600'
    },
    { 
      value: 'transformation', 
      label: 'Personal Transformation', 
      icon: '🦋', 
      description: 'Documenting spiritual growth and change',
      color: 'text-pink-600'
    },
    { 
      value: 'peace', 
      label: 'Peace & Joy', 
      icon: '☀️', 
      description: 'Celebrating moments of divine peace',
      color: 'text-yellow-600'
    }
  ];

  // Sacred spiritual tags for organization
  const spiritualTags = [
    'gratitude', 'peace', 'joy', 'love', 'forgiveness', 'wisdom',
    'growth', 'challenge', 'breakthrough', 'prayer', 'meditation',
    'discernment', 'transformation', 'healing', 'faith', 'hope',
    'surrender', 'trust', 'compassion', 'mindfulness'
  ];

  // Handle spiritual tag addition
  const handleAddTag = (tag = null) => {
    const tagToAdd = tag || newTag.trim();
    if (tagToAdd && !tags.includes(tagToAdd) && tags.length < 8) {
      setTags(prev => [...prev, tagToAdd]);
      if (!tag) setNewTag('');
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

    if (!mindset) {
      newErrors.mindset = 'Please select a mindset to complete your spiritual discernment';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save using direct Supabase operations
  const handleSave = async () => {
    if (!validateForm() || !user) return;

    try {
      setSaving(true);

      // Prepare reflection data
      const reflectionData = {
        user_id: user.id,
        question_text: title.trim(),
        answer_text: content.trim(),
        reflection_type: reflectionType,
        mindset: mindset,
        tags: tags
      };

      // Insert using Supabase client directly
      const { data: reflection, error } = await supabase
        .from('reflections')
        .insert(reflectionData)
        .select()
        .single();

      if (error) {
        console.error('Error saving reflection:', error);
        setErrors({ submit: error.message || 'Failed to save your reflection' });
        return;
      }

      // Transform to journal entry format and callback
      const journalEntry = {
        id: reflection.id,
        title: reflection.question_text,
        content: reflection.answer_text,
        tags: reflection.tags || [],
        reflection_type: reflection.reflection_type,
        mindset: reflection.mindset,
        created_at: reflection.created_at,
        updated_at: reflection.updated_at
      };

      onSave?.(journalEntry);
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
      gratitude: "What fills your heart with gratitude today? Share the blessings that lift your spirit...",
      challenge: "What challenge are you facing, and how might you grow through it with divine wisdom?",
      insight: "What spiritual insight or understanding has illuminated your path today?",
      prayer: "Share your sacred conversation, your hopes, requests, and communion with the divine...",
      discernment: "Reflect on your thoughts today. Which came from your Natural Mind vs your Spiritual Mind?",
      transformation: "How are you growing and transforming on this sacred journey of renewal?",
      peace: "What brings you joy and fills your spirit with divine peace and light?"
    };
    return placeholders[type] || "Begin your sacred reflection... What is your heart telling you today?";
  };

  // Get current reflection type details
  const currentReflectionType = reflectionTypes.find(type => type.value === reflectionType);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden shadow-2xl">
        {/* Sacred Header */}
        <div className="bg-gradient-to-r from-sacred-blue-50 to-sacred-blue-100 border-b border-sacred-blue-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="sacred-icon-bg-gold w-12 h-12">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-sacred-serif text-3xl font-bold text-sacred-blue-800">
                  New Sacred Reflection
                </h2>
                <p className="text-sm text-sacred-blue-600 mt-1">
                  Create a space for spiritual discernment and growth
                </p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="p-3 hover:bg-sacred-blue-200 rounded-xl transition-colors group"
              title="Close"
            >
              <X className="w-6 h-6 text-sacred-blue-600 group-hover:text-sacred-blue-800" />
            </button>
          </div>
        </div>

        {/* Two-Column Sacred Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-10 h-[calc(95vh-180px)]">
          {/* Left Column - Metadata (30%) */}
          <div className="lg:col-span-3 border-r border-sacred-blue-100 bg-sacred-blue-25 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Sacred Title */}
              <div>
                <label className="block text-sm font-semibold text-sacred-blue-700 mb-2">
                  Title of Your Reflection
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give your reflection a meaningful title..."
                  className={`w-full p-3 border-2 rounded-xl bg-white/70 backdrop-blur-sm transition-all focus:ring-2 focus:ring-sacred-blue-300 focus:border-sacred-blue-400 ${
                    errors.title ? 'border-red-300 bg-red-50' : 'border-sacred-blue-200'
                  }`}
                  maxLength={200}
                />
                {errors.title && (
                  <p className="text-red-600 text-xs mt-1 font-medium">{errors.title}</p>
                )}
              </div>

              {/* Sacred Reflection Type */}
              <div>
                <label className="block text-sm font-semibold text-sacred-blue-700 mb-2">
                  Type of Reflection
                </label>
                <select
                  value={reflectionType}
                  onChange={(e) => setReflectionType(e.target.value)}
                  className="w-full p-3 border-2 border-sacred-blue-200 rounded-xl bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-sacred-blue-300 focus:border-sacred-blue-400 transition-all"
                >
                  {reflectionTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
                {currentReflectionType && (
                  <p className={`text-xs mt-2 font-medium ${currentReflectionType.color}`}>
                    {currentReflectionType.description}
                  </p>
                )}
              </div>

              {/* Sacred Tags */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-sacred-blue-700 mb-2">
                  <Tag className="w-4 h-4" />
                  Sacred Tags
                </label>
                
                {/* Quick Sacred Tags */}
                <div className="mb-3">
                  <p className="text-xs text-sacred-blue-600 mb-2 font-medium">Quick Tags:</p>
                  <div className="flex flex-wrap gap-1">
                    {spiritualTags.slice(0, 6).map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleAddTag(tag)}
                        disabled={tags.includes(tag) || tags.length >= 8}
                        className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                          tags.includes(tag)
                            ? 'bg-sacred-blue-200 text-sacred-blue-800 cursor-not-allowed'
                            : 'bg-sacred-blue-100 text-sacred-blue-700 hover:bg-sacred-blue-200 hover:scale-105'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Tag Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={handleTagKeyPress}
                    placeholder="Custom tag..."
                    className="flex-1 p-2 border-2 border-sacred-blue-200 rounded-lg bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-sacred-blue-300 focus:border-sacred-blue-400 text-sm"
                    maxLength={20}
                  />
                  <button
                    type="button"
                    onClick={() => handleAddTag()}
                    disabled={!newTag.trim() || tags.length >= 8}
                    className="px-3 py-2 bg-sacred-blue-500 text-white rounded-lg hover:bg-sacred-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium"
                  >
                    Add
                  </button>
                </div>

                {/* Selected Tags */}
                {tags.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-sacred-blue-600 mb-2 font-medium">Selected:</p>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-sacred-blue-100 to-sacred-blue-200 text-sacred-blue-700 rounded-full text-sm font-medium shadow-sm"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="hover:text-sacred-blue-900 hover:bg-sacred-blue-300 rounded-full p-0.5 transition-all"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <p className="text-xs text-sacred-blue-500 mt-2">
                  Add up to 8 tags to help organize your spiritual journey
                </p>
              </div>

              {/* Sacred Mindset Discernment */}
              <div>
                <MindsetSelector
                  value={mindset}
                  onChange={setMindset}
                  required={true}
                />
                {errors.mindset && (
                  <p className="text-red-600 text-sm mt-2 font-medium">{errors.mindset}</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Sacred Writing Sanctuary (70%) */}
          <div className="lg:col-span-7 flex flex-col">
            {/* Editor Header */}
            <div className="border-b border-sacred-blue-100 p-4 bg-white">
              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5 text-sacred-blue-500" />
                <div>
                  <h3 className="font-semibold text-sacred-blue-800">
                    Your Sacred Writing Space
                  </h3>
                  <p className="text-sm text-sacred-blue-600">
                    Let your heart speak through your words
                  </p>
                </div>
              </div>
            </div>

            {/* Sacred Editor */}
            <div className="flex-1 p-6">
              <JournalEditor
                content={content}
                onChange={setContent}
                placeholder={getPlaceholder(reflectionType)}
              />
              {errors.content && (
                <p className="text-red-600 text-sm mt-3 font-medium">{errors.content}</p>
              )}
            </div>
          </div>
        </div>

        {/* Sacred Footer */}
        <div className="border-t border-sacred-blue-200 bg-gradient-to-r from-sacred-blue-50 to-sacred-blue-100 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sacred-blue-500" />
              <p className="text-sm text-sacred-blue-700 font-medium italic">
                Take your time. Let your sacred thoughts flow naturally.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="px-6 py-3 text-sacred-blue-600 hover:bg-sacred-blue-200 rounded-xl transition-all font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !user}
                className="sacred-button flex items-center gap-2 px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving Sacred Reflection...' : 'Save Reflection'}
              </button>
            </div>
          </div>

          {/* Sacred Error Message */}
          {errors.submit && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 font-medium">{errors.submit}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
