// src/components/BookmarkList.tsx
'use client';

import React from 'react';
import { Play, Trash2, Clock } from 'lucide-react';
import { Bookmark } from '@/hooks/useBookmarks';

interface BookmarkListProps {
  bookmarks: Bookmark[];
  onJumpToBookmark: (bookmark: Bookmark) => void;
  onDeleteBookmark: (bookmarkId: string) => void;
  className?: string;
}

/**
 * Clean Bookmark List Component
 * 
 * Professional bookmark display with jump and delete functionality
 */
export function BookmarkList({ 
  bookmarks, 
  onJumpToBookmark, 
  onDeleteBookmark,
  className = '' 
}: BookmarkListProps) {
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Unknown';
    }
  };

  if (bookmarks.length === 0) {
    return (
      <div className={`text-center py-8 text-gray-500 ${className}`}>
        <Clock size={48} className="mx-auto mb-4 opacity-50" />
        <p className="text-lg font-medium mb-2">No bookmarks yet</p>
        <p className="text-sm">Save your first bookmark to get started</p>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Bookmarks ({bookmarks.length})
      </h3>
      
      {bookmarks.map((bookmark) => (
        <div
          key={bookmark.id}
          className="
            bg-white border border-gray-200 rounded-lg p-4 shadow-sm
            hover:shadow-md transition-shadow duration-200
          "
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="
                  inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                  bg-blue-100 text-blue-800
                ">
                  {formatTime(bookmark.time)}
                </span>
                {bookmark.sectionSlug && (
                  <span className="
                    inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                    bg-green-100 text-green-800
                  ">
                    {bookmark.sectionSlug}
                  </span>
                )}
              </div>
              
              <p className="text-sm font-medium text-gray-900 mb-1">
                {bookmark.label || 'Untitled Bookmark'}
              </p>
              
              <p className="text-xs text-gray-500">
                Created {formatDate(bookmark.createdAt)}
              </p>
            </div>
            
            <div className="flex items-center gap-2 ml-4">
              <button
                onClick={() => onJumpToBookmark(bookmark)}
                className="
                  inline-flex items-center gap-1 px-3 py-1.5 rounded-md
                  bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium
                  transition-colors duration-200
                "
                title="Jump to this bookmark"
              >
                <Play size={12} />
                Resume
              </button>
              
              <button
                onClick={() => onDeleteBookmark(bookmark.id)}
                className="
                  inline-flex items-center gap-1 px-3 py-1.5 rounded-md
                  bg-red-600 hover:bg-red-700 text-white text-xs font-medium
                  transition-colors duration-200
                "
                title="Delete this bookmark"
              >
                <Trash2 size={12} />
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default BookmarkList;
