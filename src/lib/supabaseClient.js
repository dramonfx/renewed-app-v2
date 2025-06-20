// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';
import { mockSections, mockMarkdownContent, mockVisuals } from './mockData';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase;

if (supabaseUrl && supabaseAnonKey) {
  // Use the real Supabase client if credentials are provided
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  // Use the new, smarter mock client if credentials are NOT found
  console.warn("Supabase environment variables not found. Using mock data for development.");

  const createMockQueryBuilder = (initialData) => {
    let data = [...initialData]; // Create a mutable copy

    return {
      // Chaining methods: they modify the data and return the builder itself.
      select: function() { return this; }, // Mock doesn't need to filter columns
      order: function(column, options) {
        // A simple mock sort implementation
        data.sort((a, b) => {
          if (a[column] < b[column]) return options.ascending ? -1 : 1;
          if (a[column] > b[column]) return options.ascending ? 1 : -1;
          return 0;
        });
        return this;
      },
      limit: function(count) {
        data = data.slice(0, count);
        return this;
      },
      eq: function(column, value) {
        data = data.filter(item => String(item[column]) === String(value));
        return this;
      },

      // Terminator methods: they return the final data in a promise.
      single: function() {
        return Promise.resolve({ data: data[0] || null, error: null });
      },

      // Make this thenable for direct await
      then: function(onFulfilled, onRejected) {
        return Promise.resolve({ data, error: null }).then(onFulfilled, onRejected);
      },

      catch: function(onRejected) {
        return Promise.resolve({ data, error: null }).catch(onRejected);
      }
    };
  };

  supabase = {
    from: (table) => {
      if (table === 'sections') {
        const sectionsArray = Object.values(mockSections).sort((a, b) => a.order - b.order);
        // Return a simple thenable object that resolves to the sections data
        return Promise.resolve({ data: sectionsArray, error: null });
      }
      if (table === 'visuals') {
        // For visuals, we start with all of them and let .eq() filter by section_id
        const allVisuals = Object.values(mockVisuals).flat();
        return createMockQueryBuilder(allVisuals);
      }
      return createMockQueryBuilder([]);
    },
    storage: {
      from: () => ({
        createSignedUrl: (path, expiresIn) => {
          // For audio files, return a working sample audio URL
          if (path && path.includes('audio.mp3')) {
            // Create a simple base64-encoded silent audio file (1 second of silence)
            // This is a minimal MP3 file that all browsers can play
            const silentAudioDataUrl = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAEAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV6urq6urq6urq6urq6urq6urq6urq6urq6v////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAASDs90hvAAAAAAAAAAAAAAAAAAAA//OEZAAAAAGkAAAAAAAAA0gAAAAATEFN//OEZAMAAAGkAAAAAAAAA0gAAAAARTMu//OEZAYAAAGkAAAAAAAAA0gAAAAAOTku//OEZAkAAAGkAAAAAAAAA0gAAAAANVVV';
            
            console.log(`Mock audio URL for ${path}: Using silent audio data URL`);
            return Promise.resolve({ data: { signedUrl: silentAudioDataUrl }, error: null });
          }
          
          // For other files, return the original mock path
          return Promise.resolve({ data: { signedUrl: `/mock-assets/${path}` }, error: null });
        },
        download: (path) => {
          const content = mockMarkdownContent[path] || 'Mock content not found.';
          const blob = new Blob([content], { type: 'text/plain' });
          return Promise.resolve({ data: blob, error: null });
        },
      }),
    },
    auth: {
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      // Add other mock auth methods as needed
    },
  };
}

export { supabase };