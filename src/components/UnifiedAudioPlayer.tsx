
// src/components/UnifiedAudioPlayer.tsx
'use client';

/**
 * Unified Audio Player Component - Enhanced with Phase 5.1 Integration
 * 
 * Main audio player component that integrates both the original audio player
 * functionality and the new Phase 5.1 cross-track navigation capabilities.
 * Provides a unified interface for all audio playback needs.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { TrackWithUrl, AudioBookmark, TrackLoadingState } from '../types/audio';
import { useAudioPlayerEnhanced } from '../hooks/useAudioPlayerEnhanced';
import { TrackLoadingIndicator } from './ui/track-loading-indicator';

// === COMPONENT TYPES ===

export interface UnifiedAudioPlayerProps {
  // Track configuration
  initialTrack?: TrackWithUrl;
  playlist?: TrackWithUrl[];
  
  // Player configuration
  autoPlay?: boolean;
  showPlaylist?: boolean;
  showBookmarks?: boolean;
  showCrossTrackNavigation?: boolean;
  
  // Phase 5.1 features
  enableRegistry?: boolean;
  enableCaching?: boolean;
  enableCrossTrackNavigation?: boolean;
  
  // UI configuration
  className?: string;
  variant?: 'compact' | 'full' | 'minimal';
  theme?: 'light' | 'dark' | 'auto';
  
  // Event handlers
  onTrackChange?: (track: TrackWithUrl) => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
  onBookmarkAdd?: (bookmark: AudioBookmark) => void;
  onCrossTrackNavigation?: (sourceTrack: string | null, targetTrack: string) => void;
  onError?: (error: string) => void;
}

export interface PlaylistItemProps {
  track: TrackWithUrl;
  isActive: boolean;
  isLoading: boolean;
  onSelect: () => void;
  onRemove?: () => void;
}

export interface BookmarkListProps {
  bookmarks: AudioBookmark[];
  currentTrack?: TrackWithUrl;
  onJumpToBookmark: (id: string) => void;
  onRemoveBookmark: (id: string) => void;
  onAddBookmark?: () => void;
}

export interface PlayerControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isLoading: boolean;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
}

// === PLAYLIST ITEM COMPONENT ===

const PlaylistItem: React.FC<PlaylistItemProps> = ({
  track,
  isActive,
  isLoading,
  onSelect,
  onRemove
}) => {
  return (
    <div 
      className={`
        flex items-center p-3 border-b border-gray-200 cursor-pointer transition-colors
        ${isActive ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'}
      `}
      onClick={onSelect}
    >
      <div className="flex-1 min-w-0">
        <h4 className={`text-sm font-medium truncate ${
          isActive ? 'text-blue-900' : 'text-gray-900'
        }`}>
          {track.title}
        </h4>
        {track.sectionTitle && (
          <p className={`text-xs truncate mt-1 ${
            isActive ? 'text-blue-600' : 'text-gray-500'
          }`}>
            {track.sectionTitle}
          </p>
        )}
        {track.duration && (
          <p className={`text-xs mt-1 ${
            isActive ? 'text-blue-500' : 'text-gray-400'
          }`}>
            {Math.floor(track.duration / 60)}:{String(Math.floor(track.duration % 60)).padStart(2, '0')}
          </p>
        )}
      </div>
      
      <div className="flex items-center gap-2 ml-3">
        {isLoading && (
          <div className="w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
        )}
        {isActive && !isLoading && (
          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
        )}
        {onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

// === BOOKMARK LIST COMPONENT ===

const BookmarkList: React.FC<BookmarkListProps> = ({
  bookmarks,
  currentTrack,
  onJumpToBookmark,
  onRemoveBookmark,
  onAddBookmark
}) => {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  };

  const currentTrackBookmarks = bookmarks.filter(bookmark => 
    !bookmark.trackSlug || bookmark.trackSlug === currentTrack?.slug
  );

  const crossTrackBookmarks = bookmarks.filter(bookmark => 
    bookmark.trackSlug && bookmark.trackSlug !== currentTrack?.slug
  );

  return (
    <div className="space-y-4">
      {onAddBookmark && (
        <button
          onClick={onAddBookmark}
          className="w-full p-2 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 rounded transition-colors"
        >
          + Add Bookmark
        </button>
      )}
      
      {currentTrackBookmarks.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Current Track</h4>
          <div className="space-y-1">
            {currentTrackBookmarks.map(bookmark => (
              <div
                key={bookmark.id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600 font-mono">
                      {formatTime(bookmark.timestamp)}
                    </span>
                    {bookmark.title && (
                      <span className="text-gray-700 truncate">
                        {bookmark.title}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onJumpToBookmark(bookmark.id)}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    ▶
                  </button>
                  <button
                    onClick={() => onRemoveBookmark(bookmark.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {crossTrackBookmarks.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Other Tracks</h4>
          <div className="space-y-1">
            {crossTrackBookmarks.map(bookmark => (
              <div
                key={bookmark.id}
                className="flex items-center justify-between p-2 bg-purple-50 rounded text-sm"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-purple-600 font-mono">
                      {formatTime(bookmark.timestamp)}
                    </span>
                    {bookmark.title && (
                      <span className="text-gray-700 truncate">
                        {bookmark.title}
                      </span>
                    )}
                  </div>
                  {bookmark.trackSlug && (
                    <div className="text-xs text-purple-500 mt-1">
                      Track: {bookmark.trackSlug}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onJumpToBookmark(bookmark.id)}
                    className="text-purple-600 hover:text-purple-800 transition-colors"
                    title="Navigate to bookmark"
                  >
                    🔗
                  </button>
                  <button
                    onClick={() => onRemoveBookmark(bookmark.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {bookmarks.length === 0 && (
        <div className="text-center text-gray-500 text-sm py-4">
          No bookmarks yet
        </div>
      )}
    </div>
  );
};

// === PLAYER CONTROLS COMPONENT ===

const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  isLoading,
  onPlay,
  onPause,
  onSeek,
  onVolumeChange,
  onToggleMute
}) => {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <div className="relative">
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div 
              className="h-2 bg-blue-600 rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={(e) => onSeek(Number(e.target.value))}
            className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
          />
        </div>
      </div>
      
      {/* Control buttons */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={isPlaying ? onPause : onPlay}
          disabled={isLoading}
          className="w-12 h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-full flex items-center justify-center transition-colors"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : isPlaying ? (
            <span className="text-lg">⏸</span>
          ) : (
            <span className="text-lg ml-1">▶</span>
          )}
        </button>
      </div>
      
      {/* Volume control */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMute}
          className="text-gray-600 hover:text-gray-800 transition-colors"
        >
          {isMuted ? '🔇' : volume > 0.5 ? '🔊' : '🔉'}
        </button>
        <div className="flex-1">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => onVolumeChange(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <span className="text-sm text-gray-600 w-8">
          {Math.round((isMuted ? 0 : volume) * 100)}
        </span>
      </div>
    </div>
  );
};

// === MAIN UNIFIED AUDIO PLAYER COMPONENT ===

export const UnifiedAudioPlayer: React.FC<UnifiedAudioPlayerProps> = ({
  initialTrack,
  playlist = [],
  autoPlay = false,
  showPlaylist = true,
  showBookmarks = true,
  showCrossTrackNavigation = true,
  enableRegistry = true,
  enableCaching = true,
  enableCrossTrackNavigation = true,
  className = '',
  variant = 'full',
  theme = 'light',
  onTrackChange,
  onPlayStateChange,
  onBookmarkAdd,
  onCrossTrackNavigation,
  onError
}) => {
  // Enhanced audio player hook
  const {
    state,
    controls,
    bookmarks,
    addBookmark,
    removeBookmark,
    jumpToBookmark,
    jumpToBookmarkCrossTrack
  } = useAudioPlayerEnhanced({
    autoPlay,
    enableRegistry,
    enableCaching,
    enableCrossTrackNavigation,
    onError,
    onTrackResolutionComplete: (slug, track) => {
      onTrackChange?.(track);
    },
    onPlay: () => onPlayStateChange?.(true),
    onPause: () => onPlayStateChange?.(false),
    onCrossTrackNavigationStart: (sourceSlug, targetSlug) => {
      onCrossTrackNavigation?.(sourceSlug, targetSlug);
    }
  });

  // Local state
  const [activeTab, setActiveTab] = useState<'player' | 'playlist' | 'bookmarks'>('player');
  const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState(0);

  // Load initial track
  useEffect(() => {
    if (initialTrack && !state.track) {
      controls.loadTrack(initialTrack);
    }
  }, [initialTrack, state.track, controls]);

  // Handle playlist navigation
  const handlePlaylistSelect = useCallback(async (track: TrackWithUrl, index: number) => {
    setCurrentPlaylistIndex(index);
    if (track.slug) {
      await controls.loadTrackBySlug(track.slug);
    } else {
      await controls.loadTrack(track);
    }
  }, [controls]);

  // Handle bookmark creation
  const handleAddBookmark = useCallback(() => {
    const title = prompt('Bookmark title (optional):');
    addBookmark(state.currentTime, title || undefined, state.track?.slug);
    onBookmarkAdd?.({
      id: Date.now().toString(),
      timestamp: state.currentTime,
      title: title || undefined,
      trackSlug: state.track?.slug,
      createdAt: new Date().toISOString()
    });
  }, [state.currentTime, state.track?.slug, addBookmark, onBookmarkAdd]);

  // Handle cross-track bookmark navigation
  const handleJumpToBookmark = useCallback(async (bookmarkId: string) => {
    const bookmark = bookmarks.find(b => b.id === bookmarkId);
    if (!bookmark) return;

    if (bookmark.trackSlug && bookmark.trackSlug !== state.track?.slug) {
      // Cross-track navigation
      await jumpToBookmarkCrossTrack(bookmarkId, {
        targetTrackSlug: bookmark.trackSlug,
        autoPlay: state.isPlaying
      });
    } else {
      // Same track navigation
      jumpToBookmark(bookmarkId);
    }
  }, [bookmarks, state.track?.slug, state.isPlaying, jumpToBookmark, jumpToBookmarkCrossTrack]);

  // Render based on variant
  const renderContent = () => {
    if (variant === 'minimal') {
      return (
        <div className="space-y-4">
          {state.track && (
            <div className="text-center">
              <h3 className="font-medium text-gray-900">{state.track.title}</h3>
              {state.track.sectionTitle && (
                <p className="text-sm text-gray-600">{state.track.sectionTitle}</p>
              )}
            </div>
          )}
          <PlayerControls
            isPlaying={state.isPlaying}
            currentTime={state.currentTime}
            duration={state.duration}
            volume={state.volume}
            isMuted={state.isMuted}
            isLoading={state.isLoading}
            onPlay={controls.play}
            onPause={controls.pause}
            onSeek={controls.seek}
            onVolumeChange={controls.setVolume}
            onToggleMute={controls.toggleMute}
          />
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {/* Track info and loading indicator */}
        {state.track && (
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900">{state.track.title}</h3>
            {state.track.sectionTitle && (
              <p className="text-sm text-gray-600 mt-1">{state.track.sectionTitle}</p>
            )}
          </div>
        )}
        
        {/* Loading indicator for cross-track navigation */}
        {(state.loadingState !== 'idle' || state.isNavigatingCrossTrack) && (
          <TrackLoadingIndicator
            state={state.loadingState}
            trackSlug={state.navigationTarget || state.track?.slug}
            progress={state.resolutionProgress}
            onCancel={controls.cancelCrossTrackNavigation}
          />
        )}
        
        {/* Tab navigation */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('player')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'player'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Player
          </button>
          {showPlaylist && playlist.length > 0 && (
            <button
              onClick={() => setActiveTab('playlist')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'playlist'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Playlist ({playlist.length})
            </button>
          )}
          {showBookmarks && (
            <button
              onClick={() => setActiveTab('bookmarks')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'bookmarks'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Bookmarks ({bookmarks.length})
            </button>
          )}
        </div>
        
        {/* Tab content */}
        <div className="min-h-[200px]">
          {activeTab === 'player' && (
            <PlayerControls
              isPlaying={state.isPlaying}
              currentTime={state.currentTime}
              duration={state.duration}
              volume={state.volume}
              isMuted={state.isMuted}
              isLoading={state.isLoading}
              onPlay={controls.play}
              onPause={controls.pause}
              onSeek={controls.seek}
              onVolumeChange={controls.setVolume}
              onToggleMute={controls.toggleMute}
            />
          )}
          
          {activeTab === 'playlist' && (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {playlist.map((track, index) => (
                <PlaylistItem
                  key={track.id || track.slug || index}
                  track={track}
                  isActive={index === currentPlaylistIndex}
                  isLoading={state.isLoading && index === currentPlaylistIndex}
                  onSelect={() => handlePlaylistSelect(track, index)}
                />
              ))}
            </div>
          )}
          
          {activeTab === 'bookmarks' && (
            <BookmarkList
              bookmarks={bookmarks}
              currentTrack={state.track}
              onJumpToBookmark={handleJumpToBookmark}
              onRemoveBookmark={removeBookmark}
              onAddBookmark={handleAddBookmark}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`
      bg-white border border-gray-200 rounded-lg shadow-sm
      ${variant === 'compact' ? 'p-4' : 'p-6'}
      ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : ''}
      ${className}
    `}>
      {renderContent()}
    </div>
  );
};

export default UnifiedAudioPlayer;
