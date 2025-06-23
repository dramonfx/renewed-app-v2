
// src/components/journal/JournalEntryModal.jsx
// Sacred Journal Entry Modal - Full view and editing of spiritual reflections

'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import JournalEditor from './JournalEditor';
import { 
  X, 
  Edit, 
  Save, 
  Trash2, 
  Calendar, 
  Tag, 
  Eye,
  AlertTriangle 
} from 'lucide-react';

export default function JournalEntryModal({ entry, onClose, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(entry.title);
  const [editContent, setEditContent] = useState(entry.content);
  const [editReflectionType, setEditReflectionType] = useState(entry.reflection_type);
  const [editTags, setEditTags] = useState(entry.tags || []);
  const [newTag, setNewTag] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
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

  // Get reflection type info
  const getReflectionTypeInfo = (type) => {
    return reflectionTypes.find(t => t.value === type) || reflectionTypes[0];
  };

  // Handle tag addition
  const handleAddTag = () => {
    if (newTag.trim() && !editTags.includes(newTag.trim()) && editTags.length < 5) {
      setEditTags(prev => [...prev, newTag.trim()]);
      setNewTag('');
    }
  };

  // Handle tag removal
  const handleRemoveTag = (tagToRemove) => {
    setEditTags(prev => prev.filter(tag => tag !== tagToRemove));
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

    if (!editTitle.trim()) {
      newErrors.title = 'Title is required for your sacred reflection';
    }

    if (!editContent.trim() || editContent.trim() === '<p></p>') {
      newErrors.content = 'Please share your thoughts and reflections';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save changes
  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);

      const response = await fetch(`/api/journal/${entry.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editTitle.trim(),
          content: editContent.trim(),
          reflection_type: editReflectionType,
          tags: editTags
        }),
      });

      if (response.ok) {
        const data = await response.json();
        onUpdate?.(data.entry);
        setIsEditing(false);
        setErrors({});
      } else {
        const errorData = await response.json();
        setErrors({ submit: errorData.error || 'Failed to update your reflection' });
      }
    } catch (error) {
      console.error('Error updating journal entry:', error);
      setErrors({ submit: 'Failed to update your reflection. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      setDeleting(true);

      const response = await fetch(`/api/journal/${entry.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onDelete?.(entry.id);
      } else {
        setErrors({ submit: 'Failed to delete your reflection. Please try again.' });
      }
    } catch (error) {
      console.error('Error deleting journal entry:', error);
      setErrors({ submit: 'Failed to delete your reflection. Please try again.' });
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditTitle(entry.title);
    setEditContent(entry.content);
    setEditReflectionType(entry.reflection_type);
    setEditTags(entry.tags || []);
    setErrors({});
    setIsEditing(false);
  };

  const typeInfo = getReflectionTypeInfo(entry.reflection_type);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Sacred Header */}
        <div className="sticky top-0 bg-sacred-blue-50 border-b border-sacred-blue-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{typeInfo.icon}</span>
              <div className="flex-1">
                {isEditing ? (
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className={`font-sacred-serif text-xl font-bold text-sacred-blue-800 bg-transparent border-0 border-b-2 border-sacred-blue-300 focus:border-sacred-blue-500 outline-none w-full ${errors.title ? 'border-red-500' : ''}`}
                    maxLength={200}
                  />
                ) : (
                  <h2 className="font-sacred-serif text-xl font-bold text-sacred-blue-800">
                    {entry.title}
                  </h2>
                )}
                <div className="flex items-center gap-4 mt-2 text-sm text-sacred-blue-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {format(new Date(entry.created_at), 'MMMM d, yyyy • h:mm a')}
                    </span>
                  </div>
                  {entry.updated_at !== entry.created_at && (
                    <span className="text-xs italic">
                      Updated {format(new Date(entry.updated_at), 'MMM d, yyyy')}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 hover:bg-sacred-blue-100 rounded-lg transition-colors"
                  title="Edit reflection"
                >
                  <Edit className="w-5 h-5 text-sacred-blue-600" />
                </button>
              )}
              
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                title="Delete reflection"
              >
                <Trash2 className="w-5 h-5 text-red-600" />
              </button>
              
              <button
                onClick={onClose}
                className="p-2 hover:bg-sacred-blue-100 rounded-lg transition-colors"
                title="Close"
              >
                <X className="w-6 h-6 text-sacred-blue-600" />
              </button>
            </div>
          </div>
          
          {errors.title && (
            <p className="sacred-error mt-2">{errors.title}</p>
          )}
        </div>

        {/* Sacred Content */}
        <div className="p-6">
          {/* Sacred Reflection Type */}
          {isEditing ? (
            <div className="mb-6">
              <label className="sacred-label">Type of Reflection</label>
              <select
                value={editReflectionType}
                onChange={(e) => setEditReflectionType(e.target.value)}
                className="sacred-input"
              >
                {reflectionTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="mb-6">
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold bg-sacred-blue-100 text-sacred-blue-700`}>
                {typeInfo.icon} {typeInfo.label}
              </span>
            </div>
          )}

          {/* Sacred Tags */}
          <div className="mb-6">
            <label className="sacred-label flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4" />
              Tags
            </label>
            
            {isEditing ? (
              <>
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
                    disabled={!newTag.trim() || editTags.length >= 5}
                    className="sacred-button px-4"
                  >
                    Add
                  </button>
                </div>
                {editTags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {editTags.map((tag, index) => (
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
              </>
            ) : (
              <div className="flex flex-wrap gap-2">
                {entry.tags && entry.tags.length > 0 ? (
                  entry.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-sacred-blue-100 text-sacred-blue-700 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-sacred-blue-500 text-sm italic">No tags</span>
                )}
              </div>
            )}
          </div>

          {/* Sacred Content */}
          <div>
            <label className="sacred-label mb-3 block">Content</label>
            {isEditing ? (
              <>
                <JournalEditor
                  content={editContent}
                  onChange={setEditContent}
                  placeholder="Share your sacred thoughts and reflections..."
                />
                {errors.content && (
                  <p className="sacred-error mt-2">{errors.content}</p>
                )}
              </>
            ) : (
              <div 
                className="prose prose-lg max-w-none sacred-glass p-6"
                dangerouslySetInnerHTML={{ __html: entry.content }}
              />
            )}
          </div>

          {/* Sacred Error Message */}
          {errors.submit && (
            <div className="sacred-error-message mt-4">
              {errors.submit}
            </div>
          )}
        </div>

        {/* Sacred Footer */}
        {isEditing && (
          <div className="sticky bottom-0 bg-sacred-blue-50 border-t border-sacred-blue-200 p-6 rounded-b-2xl">
            <div className="flex items-center justify-between">
              <p className="text-sm text-sacred-blue-600 italic">
                Take your time to refine your sacred reflection.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleCancelEdit}
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
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sacred Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="font-sacred-serif text-lg font-semibold text-gray-800">
                Delete Sacred Reflection?
              </h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{entry.title}"? This action cannot be undone, 
              and your sacred reflection will be permanently removed.
            </p>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
              >
                Keep Reflection
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors font-medium"
              >
                {deleting ? 'Deleting...' : 'Delete Forever'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
