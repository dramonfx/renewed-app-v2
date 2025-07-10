'use client';

import { ClockIcon, TagIcon, SpeakerWaveIcon, PlayIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export default function JournalEntryCard({ entry, onClick }) {
  const router = useRouter();

  // Handle navigation to audio moment
  const handleAudioNavigation = (e) => {
    e.stopPropagation(); // Prevent card click
    
    if (entry.section_id && entry.audio_timestamp) {
      // Navigate to the section with timestamp
      const sectionUrl = `/book/${entry.section_id}?t=${entry.audio_timestamp}`;
      router.push(sectionUrl);
    } else if (entry.section_id) {
      // Navigate to section without timestamp
      router.push(`/book/${entry.section_id}`);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getMindsetColor = (mindset) => {
    switch (mindset) {
      case 'Natural':
        return 'bg-red-100 text-red-800';
      case 'Transition':
        return 'bg-yellow-100 text-yellow-800';
      case 'Spiritual':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getReflectionTypeColor = (type) => {
    switch (type) {
      case 'assessment':
        return 'bg-blue-100 text-blue-800';
      case 'daily':
        return 'bg-purple-100 text-purple-800';
      case 'intention':
        return 'bg-indigo-100 text-indigo-800';
      case 'completion':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer rounded-lg border border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-gray-200 hover:shadow-md"
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="mb-2 text-lg font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
            {entry.title || 'Untitled Reflection'}
          </h3>

          <div className="mb-2 flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <ClockIcon className="h-4 w-4" />
              <span>{formatDate(entry.created_at)}</span>
            </div>

            {entry.tags && entry.tags.length > 0 && (
              <div className="flex items-center space-x-1">
                <TagIcon className="h-4 w-4" />
                <span>
                  {entry.tags.length} tag{entry.tags.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>

          {/* Audio Context Information */}
          {(entry.section_title || entry.audio_title) && (
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-blue-600">
                <SpeakerWaveIcon className="h-4 w-4" />
                <span className="font-medium">
                  {entry.section_title || entry.audio_title}
                </span>
                {entry.formatted_timestamp && (
                  <span className="font-mono bg-blue-50 px-2 py-0.5 rounded text-xs">
                    {entry.formatted_timestamp}
                  </span>
                )}
              </div>
              
              {entry.section_id && (
                <button
                  onClick={handleAudioNavigation}
                  className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors"
                  title="Jump to audio moment"
                >
                  <PlayIcon className="h-3 w-3" />
                  <span>Play</span>
                </button>
              )}
            </div>
          )}
        </div>

        <div className="ml-4 flex flex-col space-y-2">
          {entry.mindset && (
            <span
              className={`rounded-full px-2 py-1 text-xs font-medium ${getMindsetColor(entry.mindset)}`}
            >
              {entry.mindset}
            </span>
          )}

          {entry.reflection_type && entry.reflection_type !== 'general' && (
            <span
              className={`rounded-full px-2 py-1 text-xs font-medium capitalize ${getReflectionTypeColor(entry.reflection_type)}`}
            >
              {entry.reflection_type}
            </span>
          )}
        </div>
      </div>

      {entry.content && (
        <div className="leading-relaxed text-gray-700">
          <p>{truncateText(entry.content)}</p>
        </div>
      )}

      {entry.tags && entry.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {entry.tags.slice(0, 5).map((tag, index) => (
            <span key={index} className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600">
              {tag}
            </span>
          ))}
          {entry.tags.length > 5 && (
            <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600">
              +{entry.tags.length - 5} more
            </span>
          )}
        </div>
      )}
    </div>
  );
}
