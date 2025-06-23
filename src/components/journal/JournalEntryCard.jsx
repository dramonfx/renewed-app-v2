
// src/components/journal/JournalEntryCard.jsx
// Sacred Journal Entry Card - Individual reflection preview

'use client';

import { formatDistanceToNow } from 'date-fns';
import { BookOpen, Calendar, Tag } from 'lucide-react';

export default function JournalEntryCard({ entry, onClick }) {
  // Sacred reflection type icons
  const getReflectionIcon = (type) => {
    const icons = {
      journal: '📖',
      gratitude: '🙏',
      challenge: '⚡',
      insight: '✨',
      prayer: '🕊️',
      growth: '🌱',
      joy: '☀️',
      general: '💭'
    };
    return icons[type] || icons.general;
  };

  // Sacred reflection type colors
  const getReflectionColor = (type) => {
    const colors = {
      journal: 'bg-sacred-blue-100 text-sacred-blue-700',
      gratitude: 'bg-sacred-gold-100 text-sacred-gold-700',
      challenge: 'bg-red-100 text-red-700',
      insight: 'bg-purple-100 text-purple-700',
      prayer: 'bg-blue-100 text-blue-700',
      growth: 'bg-green-100 text-green-700',
      joy: 'bg-yellow-100 text-yellow-700',
      general: 'bg-gray-100 text-gray-700'
    };
    return colors[type] || colors.general;
  };

  // Strip HTML and truncate content for preview
  const getContentPreview = (content, maxLength = 120) => {
    const stripped = content?.replace(/<[^>]*>/g, '') || '';
    return stripped.length > maxLength 
      ? stripped.substring(0, maxLength) + '...'
      : stripped;
  };

  // Format creation date
  const getFormattedDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div 
      onClick={onClick}
      className="sacred-glass p-6 cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group"
    >
      {/* Sacred Entry Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">
            {getReflectionIcon(entry.reflection_type)}
          </span>
          <div>
            <h3 className="font-sacred-serif text-lg font-semibold text-sacred-blue-800 line-clamp-2 group-hover:text-sacred-blue-900">
              {entry.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Calendar className="w-3 h-3 text-sacred-blue-400" />
              <span className="text-xs text-sacred-blue-500">
                {getFormattedDate(entry.created_at)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sacred Content Preview */}
      <p className="text-sacred-blue-600 text-sm leading-relaxed mb-4 line-clamp-3">
        {getContentPreview(entry.content)}
      </p>

      {/* Sacred Entry Footer */}
      <div className="flex items-center justify-between">
        {/* Sacred Tags */}
        <div className="flex items-center gap-2">
          {entry.tags && entry.tags.length > 0 && (
            <>
              <Tag className="w-3 h-3 text-sacred-blue-400" />
              <div className="flex gap-1 flex-wrap">
                {entry.tags.slice(0, 2).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-sacred-blue-100 text-sacred-blue-600 rounded-full text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
                {entry.tags.length > 2 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-full text-xs">
                    +{entry.tags.length - 2}
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        {/* Sacred Reflection Type Badge */}
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getReflectionColor(entry.reflection_type)}`}>
          {entry.reflection_type?.charAt(0).toUpperCase() + entry.reflection_type?.slice(1) || 'General'}
        </span>
      </div>

      {/* Sacred Read More Indicator */}
      <div className="mt-4 pt-3 border-t border-sacred-blue-100">
        <div className="flex items-center justify-between">
          <span className="text-xs text-sacred-blue-500 font-medium">
            Click to read more
          </span>
          <BookOpen className="w-4 h-4 text-sacred-blue-400 group-hover:text-sacred-blue-600 transition-colors" />
        </div>
      </div>
    </div>
  );
}
