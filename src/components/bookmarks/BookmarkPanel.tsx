// src/components/bookmarks/BookmarkPanel.tsx
'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  BookmarkManager,
  Bookmark,
  BookmarkCategory,
  BookmarkSearchOptions,
} from '../../lib/bookmarks/BookmarkManager';

/**
 * Bookmark Panel Component - Phase 3 UI
 *
 * Advanced bookmark management interface with search, filtering,
 * categorization, and real-time synchronization.
 */

interface BookmarkPanelProps {
  bookmarkManager: BookmarkManager;
  currentTrackId?: string;
  currentTime?: number;
  onBookmarkSeek?: (timestamp: number) => void;
  onClose?: () => void;
  className?: string;
}

const BookmarkPanel: React.FC<BookmarkPanelProps> = ({
  bookmarkManager,
  currentTrackId,
  currentTime = 0,
  onBookmarkSeek,
  onClose,
  className = '',
}) => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [categories, setCategories] = useState<BookmarkCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'timestamp' | 'createdAt' | 'title'>('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);

  // Form state for creating/editing bookmarks
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    category: 'notes',
    isPublic: false,
  });

  // Load initial data
  useEffect(() => {
    loadBookmarks();
    loadCategories();
    loadStats();

    // Setup event listeners
    const handleBookmarkCreated = () => {
      loadBookmarks();
      loadStats();
    };

    const handleBookmarkUpdated = () => {
      loadBookmarks();
      loadStats();
    };

    const handleBookmarkDeleted = () => {
      loadBookmarks();
      loadStats();
    };

    bookmarkManager.on('bookmarkCreated', handleBookmarkCreated);
    bookmarkManager.on('bookmarkUpdated', handleBookmarkUpdated);
    bookmarkManager.on('bookmarkDeleted', handleBookmarkDeleted);

    return () => {
      bookmarkManager.off('bookmarkCreated', handleBookmarkCreated);
      bookmarkManager.off('bookmarkUpdated', handleBookmarkUpdated);
      bookmarkManager.off('bookmarkDeleted', handleBookmarkDeleted);
    };
  }, [bookmarkManager]);

  // Load bookmarks with current filters
  const loadBookmarks = useCallback(() => {
    const searchOptions: BookmarkSearchOptions = {
      query: searchQuery || undefined,
      categories: selectedCategory === 'all' ? undefined : [selectedCategory],
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      trackId: currentTrackId,
      sortBy,
      sortOrder,
    };

    const results = bookmarkManager.searchBookmarks(searchOptions);
    setBookmarks(results);
  }, [
    bookmarkManager,
    searchQuery,
    selectedCategory,
    selectedTags,
    currentTrackId,
    sortBy,
    sortOrder,
  ]);

  // Load categories
  const loadCategories = useCallback(() => {
    const cats = bookmarkManager.getCategories();
    setCategories(cats);
  }, [bookmarkManager]);

  // Load statistics
  const loadStats = useCallback(() => {
    const statistics = bookmarkManager.getStats();
    setStats(statistics);
  }, [bookmarkManager]);

  // Reload bookmarks when filters change
  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  // Get all unique tags from bookmarks
  const availableTags = useMemo(() => {
    const allTags = new Set<string>();
    bookmarks.forEach((bookmark) => {
      bookmark.tags.forEach((tag) => allTags.add(tag));
    });
    return Array.from(allTags).sort();
  }, [bookmarks]);

  // Handle bookmark creation
  const handleCreateBookmark = async () => {
    if (!currentTrackId || !formData.title.trim()) return;

    setIsLoading(true);
    try {
      await bookmarkManager.createBookmark(currentTrackId, currentTime, formData.title.trim(), {
        description: formData.description.trim() || undefined,
        tags: formData.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
        category: formData.category,
        isPublic: formData.isPublic,
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        tags: '',
        category: 'notes',
        isPublic: false,
      });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Failed to create bookmark:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle bookmark update
  const handleUpdateBookmark = async () => {
    if (!editingBookmark) return;

    setIsLoading(true);
    try {
      await bookmarkManager.updateBookmark(editingBookmark.id, {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        tags: formData.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
        category: formData.category,
        isPublic: formData.isPublic,
      });

      setEditingBookmark(null);
      setFormData({
        title: '',
        description: '',
        tags: '',
        category: 'notes',
        isPublic: false,
      });
    } catch (error) {
      console.error('Failed to update bookmark:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle bookmark deletion
  const handleDeleteBookmark = async (bookmarkId: string) => {
    if (!confirm('Are you sure you want to delete this bookmark?')) return;

    setIsLoading(true);
    try {
      await bookmarkManager.deleteBookmark(bookmarkId);
    } catch (error) {
      console.error('Failed to delete bookmark:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Start editing bookmark
  const startEditingBookmark = (bookmark: Bookmark) => {
    setEditingBookmark(bookmark);
    setFormData({
      title: bookmark.title,
      description: bookmark.description || '',
      tags: bookmark.tags.join(', '),
      category: bookmark.category,
      isPublic: bookmark.isPublic,
    });
    setShowCreateForm(true);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingBookmark(null);
    setShowCreateForm(false);
    setFormData({
      title: '',
      description: '',
      tags: '',
      category: 'notes',
      isPublic: false,
    });
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp: number): string => {
    const minutes = Math.floor(timestamp / 60);
    const seconds = Math.floor(timestamp % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Format date for display
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Get category by ID
  const getCategoryById = (categoryId: string): BookmarkCategory | undefined => {
    return categories.find((cat) => cat.id === categoryId);
  };

  return (
    <div className={`bookmark-panel ${className}`}>
      <style jsx>{`
        .bookmark-panel {
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
          border-radius: 16px;
          padding: 24px;
          color: white;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          max-width: 480px;
          max-height: 600px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }

        .panel-title {
          font-size: 20px;
          font-weight: 600;
          margin: 0;
        }

        .close-button {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .close-button:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .stats-section {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 16px;
          font-size: 12px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          text-align: center;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-size: 16px;
          font-weight: 600;
          color: #60a5fa;
        }

        .stat-label {
          color: #cbd5e1;
          margin-top: 2px;
        }

        .controls-section {
          margin-bottom: 16px;
        }

        .search-bar {
          width: 100%;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          padding: 10px 12px;
          color: white;
          font-size: 14px;
          margin-bottom: 12px;
        }

        .search-bar::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }

        .search-bar:focus {
          outline: none;
          border-color: #60a5fa;
        }

        .filter-row {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
        }

        .filter-select {
          flex: 1;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          padding: 6px 8px;
          color: white;
          font-size: 12px;
        }

        .filter-select:focus {
          outline: none;
          border-color: #60a5fa;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
        }

        .action-button {
          background: rgba(16, 185, 129, 0.2);
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: 6px;
          padding: 8px 12px;
          color: #34d399;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .action-button:hover {
          background: rgba(16, 185, 129, 0.3);
        }

        .action-button.primary {
          background: rgba(59, 130, 246, 0.2);
          border-color: rgba(59, 130, 246, 0.3);
          color: #60a5fa;
        }

        .action-button.primary:hover {
          background: rgba(59, 130, 246, 0.3);
        }

        .bookmarks-list {
          flex: 1;
          overflow-y: auto;
          margin-bottom: 16px;
        }

        .bookmark-item {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .bookmark-item:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-1px);
        }

        .bookmark-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
        }

        .bookmark-title {
          font-size: 14px;
          font-weight: 600;
          margin: 0;
          flex: 1;
        }

        .bookmark-timestamp {
          background: rgba(59, 130, 246, 0.2);
          border-radius: 12px;
          padding: 2px 8px;
          font-size: 11px;
          color: #60a5fa;
          margin-left: 8px;
        }

        .bookmark-description {
          font-size: 12px;
          color: #cbd5e1;
          margin-bottom: 8px;
          line-height: 1.4;
        }

        .bookmark-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 11px;
        }

        .bookmark-tags {
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
        }

        .bookmark-tag {
          background: rgba(168, 85, 247, 0.2);
          border-radius: 10px;
          padding: 2px 6px;
          color: #a78bfa;
        }

        .bookmark-category {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #fbbf24;
        }

        .bookmark-actions {
          display: flex;
          gap: 4px;
          margin-top: 8px;
        }

        .bookmark-action {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 4px;
          padding: 4px 8px;
          color: white;
          font-size: 10px;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .bookmark-action:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .bookmark-action.edit {
          color: #60a5fa;
        }

        .bookmark-action.delete {
          color: #f87171;
        }

        .create-form {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 8px;
          padding: 16px;
          margin-top: 16px;
        }

        .form-group {
          margin-bottom: 12px;
        }

        .form-label {
          display: block;
          font-size: 12px;
          color: #e2e8f0;
          margin-bottom: 4px;
        }

        .form-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          padding: 8px 10px;
          color: white;
          font-size: 14px;
        }

        .form-input:focus {
          outline: none;
          border-color: #60a5fa;
        }

        .form-textarea {
          resize: vertical;
          min-height: 60px;
        }

        .form-checkbox {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
        }

        .form-actions {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
          margin-top: 16px;
        }

        .form-button {
          background: rgba(59, 130, 246, 0.2);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 6px;
          padding: 8px 16px;
          color: #60a5fa;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .form-button:hover {
          background: rgba(59, 130, 246, 0.3);
        }

        .form-button.secondary {
          background: rgba(107, 114, 128, 0.2);
          border-color: rgba(107, 114, 128, 0.3);
          color: #9ca3af;
        }

        .form-button.secondary:hover {
          background: rgba(107, 114, 128, 0.3);
        }

        .empty-state {
          text-align: center;
          padding: 40px 20px;
          color: #9ca3af;
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .empty-title {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .empty-description {
          font-size: 14px;
          line-height: 1.5;
        }

        .loading-spinner {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .spinner {
          width: 24px;
          height: 24px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid #ffffff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>

      {/* Header */}
      <div className="panel-header">
        <h2 className="panel-title">📚 Bookmarks</h2>
        {onClose && (
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        )}
      </div>

      {/* Statistics */}
      {stats && (
        <div className="stats-section">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value">{stats.totalBookmarks}</div>
              <div className="stat-label">Total</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{stats.recentActivity}</div>
              <div className="stat-label">Recent</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{Object.keys(stats.bookmarksByTrack).length}</div>
              <div className="stat-label">Tracks</div>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="controls-section">
        <input
          type="text"
          className="search-bar"
          placeholder="Search bookmarks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="filter-row">
          <select
            className="filter-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.icon} {category.name}
              </option>
            ))}
          </select>

          <select
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <option value="timestamp">By Time</option>
            <option value="createdAt">By Created</option>
            <option value="title">By Title</option>
          </select>

          <select
            className="filter-select"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        <div className="action-buttons">
          <button
            className="action-button primary"
            onClick={() => setShowCreateForm(!showCreateForm)}
            disabled={!currentTrackId}
          >
            {showCreateForm ? 'Cancel' : '+ Add Bookmark'}
          </button>
        </div>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="create-form">
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input
              type="text"
              className="form-input"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter bookmark title..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-input form-textarea"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Optional description..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tags (comma-separated)</label>
            <input
              type="text"
              className="form-input"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="tag1, tag2, tag3..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-input"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-checkbox">
              <input
                type="checkbox"
                checked={formData.isPublic}
                onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
              />
              Make this bookmark public
            </label>
          </div>

          <div className="form-actions">
            <button className="form-button secondary" onClick={cancelEditing} disabled={isLoading}>
              Cancel
            </button>
            <button
              className="form-button"
              onClick={editingBookmark ? handleUpdateBookmark : handleCreateBookmark}
              disabled={isLoading || !formData.title.trim()}
            >
              {isLoading ? 'Saving...' : editingBookmark ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      )}

      {/* Bookmarks List */}
      <div className="bookmarks-list">
        {isLoading && !bookmarks.length ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📖</div>
            <div className="empty-title">No bookmarks found</div>
            <div className="empty-description">
              {currentTrackId
                ? 'Create your first bookmark for this track!'
                : 'Select a track to view and create bookmarks.'}
            </div>
          </div>
        ) : (
          bookmarks.map((bookmark) => {
            const category = getCategoryById(bookmark.category);
            return (
              <div
                key={bookmark.id}
                className="bookmark-item"
                onClick={() => onBookmarkSeek?.(bookmark.timestamp)}
              >
                <div className="bookmark-header">
                  <h4 className="bookmark-title">{bookmark.title}</h4>
                  <div className="bookmark-timestamp">{formatTimestamp(bookmark.timestamp)}</div>
                </div>

                {bookmark.description && (
                  <div className="bookmark-description">{bookmark.description}</div>
                )}

                <div className="bookmark-meta">
                  <div className="bookmark-tags">
                    {bookmark.tags.map((tag) => (
                      <span key={tag} className="bookmark-tag">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {category && (
                    <div className="bookmark-category">
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                    </div>
                  )}
                </div>

                <div className="bookmark-actions" onClick={(e) => e.stopPropagation()}>
                  <button
                    className="bookmark-action edit"
                    onClick={() => startEditingBookmark(bookmark)}
                  >
                    Edit
                  </button>
                  <button
                    className="bookmark-action delete"
                    onClick={() => handleDeleteBookmark(bookmark.id)}
                  >
                    Delete
                  </button>
                </div>

                <div style={{ fontSize: '10px', color: '#9ca3af', marginTop: '4px' }}>
                  Created {formatDate(bookmark.createdAt)}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default BookmarkPanel;
