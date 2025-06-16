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

    const builder = {
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
      insert: function(records) {
        // Mock insert - just return success for reflections table
        const recordsArray = Array.isArray(records) ? records : [records];
        const insertedData = recordsArray.map(record => ({
          id: Math.random().toString(36).substr(2, 9),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...record
        }));
        
        return {
          select: () => ({
            single: () => Promise.resolve({ data: insertedData[0], error: null }),
            then: (resolve) => resolve({ data: insertedData, error: null })
          }),
          then: (resolve) => resolve({ data: insertedData, error: null })
        };
      },

      // Terminator methods: they return the final data in a promise.
      single: function() {
        return Promise.resolve({ data: data[0] || null, error: null });
      },

      // This allows the builder to be awaited directly
      then: function(resolve) {
        resolve({ data, error: null });
      }
    };
    return builder;
  };

  supabase = {
    from: (table) => {
      if (table === 'sections') {
        return createMockQueryBuilder(Object.values(mockSections));
      }
      if (table === 'visuals') {
        // For visuals, we start with all of them and let .eq() filter by section_id
        const allVisuals = Object.values(mockVisuals).flat();
        return createMockQueryBuilder(allVisuals);
      }
      if (table === 'reflections') {
        // Mock reflections table
        return createMockQueryBuilder([]);
      }
      return createMockQueryBuilder([]);
    },
    storage: {
      from: () => ({
        createSignedUrl: (path, expiresIn) => Promise.resolve({ data: { signedUrl: `/mock-assets/${path}` }, error: null }),
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
      getUser: () => Promise.resolve({ 
        data: { 
          user: { 
            id: 'mock-user-id-12345',
            email: 'mock@example.com'
          } 
        }, 
        error: null 
      }),
      // Add other mock auth methods as needed
    },
  };
}

export { supabase };