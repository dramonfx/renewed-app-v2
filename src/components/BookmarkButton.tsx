// src/components/BookmarkButton.tsx
'use client';

import React from 'react';
import { Bookmark } from 'lucide-react';

interface BookmarkButtonProps {
  onSaveBookmark: () => void;
  canSave: boolean;
  isLoading?: boolean;
  className?: string;
}

/**
 * Simple Bookmark Button Component
 * 
 * Clean, professional bookmark creation button with proper states
 */
export function BookmarkButton({ 
  onSaveBookmark, 
  canSave, 
  isLoading = false,
  className = '' 
}: BookmarkButtonProps) {
  return (
    <button
      onClick={onSaveBookmark}
      disabled={!canSave || isLoading}
      className={`
        inline-flex items-center gap-2 px-3 py-2 rounded-lg
        transition-all duration-200 ease-in-out
        ${canSave && !isLoading
          ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }
        ${className}
      `}
      title={canSave ? 'Save bookmark at current time' : 'Maximum bookmarks reached'}
    >
      <Bookmark 
        size={16} 
        className={isLoading ? 'animate-pulse' : ''}
      />
      <span className="text-sm font-medium">
        {isLoading ? 'Saving...' : 'Bookmark'}
      </span>
    </button>
  );
}

export default BookmarkButton;
