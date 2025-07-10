/**
 * Sacred Journal localStorage Management System
 *
 * This module provides complete CRUD operations for journal entries
 * using localStorage for client-side persistence without authentication.
 */

// Storage keys
const STORAGE_KEYS = {
  ENTRIES: 'sacred_journal_entries',
  SETTINGS: 'sacred_journal_settings',
  STATS: 'sacred_journal_stats',
};

// Generate unique ID for entries
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

// Validate entry data structure
const validateEntry = (entry) => {
  if (!entry || typeof entry !== 'object') {
    throw new Error('Entry must be a valid object');
  }

  if (!entry.title?.trim() && !entry.content?.trim()) {
    throw new Error('Entry must have either a title or content');
  }

  return true;
};

// Safe JSON operations with error handling
const safeJSONParse = (data, fallback = []) => {
  try {
    return JSON.parse(data) || fallback;
  } catch (error) {
    console.warn('Failed to parse JSON data:', error);
    return fallback;
  }
};

const safeJSONStringify = (data) => {
  try {
    return JSON.stringify(data);
  } catch (error) {
    console.error('Failed to stringify data:', error);
    throw new Error('Failed to save data');
  }
};

// Check localStorage availability and quota
const checkStorageAvailability = () => {
  try {
    const testKey = '__sacred_journal_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    console.error('localStorage not available:', error);
    return false;
  }
};

/**
 * Core Journal Storage Operations
 */
export const journalStorage = {
  /**
   * Create a new journal entry
   */
  createEntry: (entryData) => {
    if (!checkStorageAvailability()) {
      throw new Error('Storage not available. Please check your browser settings.');
    }

    validateEntry(entryData);

    // Helper function to format timestamp
    const formatTimestamp = (seconds) => {
      if (!seconds || seconds <= 0) return null;
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.floor(seconds % 60);
      return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const newEntry = {
      id: generateId(),
      title: entryData.title?.trim() || '',
      content: entryData.content?.trim() || '',
      mindset: entryData.mindset || '',
      reflection_type: entryData.reflection_type || 'general',
      tags: Array.isArray(entryData.tags) ? entryData.tags : [],
      // Audio integration fields
      audio_title: entryData.audio_title || null,
      audio_timestamp: entryData.audio_timestamp || null,
      section_id: entryData.section_id || null,
      section_title: entryData.section_title || null,
      formatted_timestamp: entryData.audio_timestamp ? formatTimestamp(entryData.audio_timestamp) : null,
      // Standard fields
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      word_count: (entryData.content?.trim() || '').split(/\s+/).filter(Boolean).length,
    };

    try {
      const existingEntries = safeJSONParse(localStorage.getItem(STORAGE_KEYS.ENTRIES), []);
      const updatedEntries = [newEntry, ...existingEntries];

      localStorage.setItem(STORAGE_KEYS.ENTRIES, safeJSONStringify(updatedEntries));

      // Update stats
      journalStorage.updateStats();

      return newEntry;
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        throw new Error('Storage quota exceeded. Please delete some entries or export your data.');
      }
      throw new Error('Failed to save entry: ' + error.message);
    }
  },

  /**
   * Get all journal entries with optional filtering
   */
  getEntries: (filters = {}) => {
    if (!checkStorageAvailability()) {
      return [];
    }

    try {
      const entries = safeJSONParse(localStorage.getItem(STORAGE_KEYS.ENTRIES), []);

      let filteredEntries = [...entries];

      // Apply filters
      if (filters.mindset) {
        filteredEntries = filteredEntries.filter((entry) => entry.mindset === filters.mindset);
      }

      if (filters.reflection_type) {
        filteredEntries = filteredEntries.filter(
          (entry) => entry.reflection_type === filters.reflection_type
        );
      }

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredEntries = filteredEntries.filter(
          (entry) =>
            entry.title?.toLowerCase().includes(searchTerm) ||
            entry.content?.toLowerCase().includes(searchTerm) ||
            entry.tags?.some((tag) => tag.toLowerCase().includes(searchTerm))
        );
      }

      // Sort by created_at (newest first)
      filteredEntries.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      return filteredEntries;
    } catch (error) {
      console.error('Failed to retrieve entries:', error);
      return [];
    }
  },

  /**
   * Get a single entry by ID
   */
  getEntry: (id) => {
    if (!checkStorageAvailability()) {
      return null;
    }

    try {
      const entries = safeJSONParse(localStorage.getItem(STORAGE_KEYS.ENTRIES), []);
      return entries.find((entry) => entry.id === id) || null;
    } catch (error) {
      console.error('Failed to retrieve entry:', error);
      return null;
    }
  },

  /**
   * Update an existing journal entry
   */
  updateEntry: (id, updates) => {
    if (!checkStorageAvailability()) {
      throw new Error('Storage not available');
    }

    try {
      const entries = safeJSONParse(localStorage.getItem(STORAGE_KEYS.ENTRIES), []);
      const entryIndex = entries.findIndex((entry) => entry.id === id);

      if (entryIndex === -1) {
        throw new Error('Entry not found');
      }

      // Validate the updates
      const updatedEntry = { ...entries[entryIndex], ...updates };
      validateEntry(updatedEntry);

      // Update entry with new data
      entries[entryIndex] = {
        ...updatedEntry,
        updated_at: new Date().toISOString(),
        word_count: (updatedEntry.content?.trim() || '').split(/\s+/).filter(Boolean).length,
      };

      localStorage.setItem(STORAGE_KEYS.ENTRIES, safeJSONStringify(entries));

      // Update stats
      journalStorage.updateStats();

      return entries[entryIndex];
    } catch (error) {
      throw new Error('Failed to update entry: ' + error.message);
    }
  },

  /**
   * Delete a journal entry
   */
  deleteEntry: (id) => {
    if (!checkStorageAvailability()) {
      throw new Error('Storage not available');
    }

    try {
      const entries = safeJSONParse(localStorage.getItem(STORAGE_KEYS.ENTRIES), []);
      const filteredEntries = entries.filter((entry) => entry.id !== id);

      if (filteredEntries.length === entries.length) {
        throw new Error('Entry not found');
      }

      localStorage.setItem(STORAGE_KEYS.ENTRIES, safeJSONStringify(filteredEntries));

      // Update stats
      journalStorage.updateStats();

      return true;
    } catch (error) {
      throw new Error('Failed to delete entry: ' + error.message);
    }
  },

  /**
   * Get journal statistics
   */
  getStats: () => {
    if (!checkStorageAvailability()) {
      return {
        total_entries: 0,
        total_words: 0,
        entries_this_month: 0,
        most_common_mindset: null,
        most_common_reflection_type: null,
        longest_streak: 0,
      };
    }

    try {
      const entries = safeJSONParse(localStorage.getItem(STORAGE_KEYS.ENTRIES), []);

      if (entries.length === 0) {
        return {
          total_entries: 0,
          total_words: 0,
          entries_this_month: 0,
          most_common_mindset: null,
          most_common_reflection_type: null,
          longest_streak: 0,
        };
      }

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const stats = {
        total_entries: entries.length,
        total_words: entries.reduce((sum, entry) => sum + (entry.word_count || 0), 0),
        entries_this_month: entries.filter((entry) => {
          const entryDate = new Date(entry.created_at);
          return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
        }).length,
        most_common_mindset: null,
        most_common_reflection_type: null,
        longest_streak: 0,
      };

      // Calculate most common mindset
      const mindsetCounts = {};
      entries.forEach((entry) => {
        if (entry.mindset) {
          mindsetCounts[entry.mindset] = (mindsetCounts[entry.mindset] || 0) + 1;
        }
      });

      if (Object.keys(mindsetCounts).length > 0) {
        stats.most_common_mindset = Object.keys(mindsetCounts).reduce((a, b) =>
          mindsetCounts[a] > mindsetCounts[b] ? a : b
        );
      }

      // Calculate most common reflection type
      const typeCounts = {};
      entries.forEach((entry) => {
        if (entry.reflection_type) {
          typeCounts[entry.reflection_type] = (typeCounts[entry.reflection_type] || 0) + 1;
        }
      });

      if (Object.keys(typeCounts).length > 0) {
        stats.most_common_reflection_type = Object.keys(typeCounts).reduce((a, b) =>
          typeCounts[a] > typeCounts[b] ? a : b
        );
      }

      return stats;
    } catch (error) {
      console.error('Failed to calculate stats:', error);
      return {
        total_entries: 0,
        total_words: 0,
        entries_this_month: 0,
        most_common_mindset: null,
        most_common_reflection_type: null,
        longest_streak: 0,
      };
    }
  },

  /**
   * Update statistics (called after CRUD operations)
   */
  updateStats: () => {
    try {
      const stats = journalStorage.getStats();
      localStorage.setItem(STORAGE_KEYS.STATS, safeJSONStringify(stats));
      return stats;
    } catch (error) {
      console.error('Failed to update stats:', error);
    }
  },

  /**
   * Export all journal data
   */
  exportData: () => {
    try {
      const entries = safeJSONParse(localStorage.getItem(STORAGE_KEYS.ENTRIES), []);
      const stats = journalStorage.getStats();

      return {
        entries,
        stats,
        exported_at: new Date().toISOString(),
        version: '1.0',
      };
    } catch (error) {
      throw new Error('Failed to export data: ' + error.message);
    }
  },

  /**
   * Import journal data (with merge option)
   */
  importData: (data, merge = false) => {
    if (!checkStorageAvailability()) {
      throw new Error('Storage not available');
    }

    try {
      if (!data || !Array.isArray(data.entries)) {
        throw new Error('Invalid import data format');
      }

      let entries = data.entries;

      if (merge) {
        const existingEntries = safeJSONParse(localStorage.getItem(STORAGE_KEYS.ENTRIES), []);
        // Merge, avoiding duplicates based on ID
        const existingIds = new Set(existingEntries.map((e) => e.id));
        const newEntries = entries.filter((e) => !existingIds.has(e.id));
        entries = [...existingEntries, ...newEntries];
      }

      localStorage.setItem(STORAGE_KEYS.ENTRIES, safeJSONStringify(entries));
      journalStorage.updateStats();

      return true;
    } catch (error) {
      throw new Error('Failed to import data: ' + error.message);
    }
  },

  /**
   * Clear all journal data
   */
  clearAllData: () => {
    if (!checkStorageAvailability()) {
      throw new Error('Storage not available');
    }

    try {
      localStorage.removeItem(STORAGE_KEYS.ENTRIES);
      localStorage.removeItem(STORAGE_KEYS.STATS);
      localStorage.removeItem(STORAGE_KEYS.SETTINGS);
      return true;
    } catch (error) {
      throw new Error('Failed to clear data: ' + error.message);
    }
  },

  /**
   * Auto-save draft functionality
   */
  saveDraft: (draftData) => {
    if (!checkStorageAvailability()) {
      return false;
    }

    try {
      localStorage.setItem(
        'sacred_journal_draft',
        safeJSONStringify({
          ...draftData,
          saved_at: new Date().toISOString(),
        })
      );
      return true;
    } catch (error) {
      console.error('Failed to save draft:', error);
      return false;
    }
  },

  /**
   * Load saved draft
   */
  loadDraft: () => {
    if (!checkStorageAvailability()) {
      return null;
    }

    try {
      const draft = safeJSONParse(localStorage.getItem('sacred_journal_draft'), null);

      // Return draft if it's less than 24 hours old
      if (draft && draft.saved_at) {
        const draftAge = Date.now() - new Date(draft.saved_at).getTime();
        const twentyFourHours = 24 * 60 * 60 * 1000;

        if (draftAge < twentyFourHours) {
          return draft;
        }
      }

      return null;
    } catch (error) {
      console.error('Failed to load draft:', error);
      return null;
    }
  },

  /**
   * Clear saved draft
   */
  clearDraft: () => {
    if (!checkStorageAvailability()) {
      return;
    }

    try {
      localStorage.removeItem('sacred_journal_draft');
    } catch (error) {
      console.error('Failed to clear draft:', error);
    }
  },
};

// Export default for easy import
export default journalStorage;
