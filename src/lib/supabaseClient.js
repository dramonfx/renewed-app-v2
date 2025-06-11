import { createClient } from '@supabase/supabase-js';
import { mockSections, mockMarkdownContent, mockVisuals } from './mockData';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create a mock Supabase client for development when env vars are missing
const createMockSupabaseClient = () => {
  return {
    from: (table) => ({
      select: (columns) => {
        // Create a promise-like object that handles all the chaining patterns
        const createQueryResult = (data, error = null) => {
          const result = Promise.resolve({ data, error });
          
          // Add chainable methods
          result.eq = (column, value) => {
            if (table === 'sections') {
              const section = mockSections[value];
              const newResult = Promise.resolve({ 
                data: section || null, 
                error: section ? null : { message: 'Section not found' } 
              });
              newResult.single = () => newResult;
              return newResult;
            } else if (table === 'visuals') {
              const visuals = mockVisuals[value] || [];
              const newResult = Promise.resolve({ data: visuals, error: null });
              newResult.order = () => newResult;
              return newResult;
            }
            return Promise.resolve({ data: null, error: { message: 'Table not found' } });
          };
          
          result.order = (orderColumn, options) => {
            if (table === 'sections') {
              const sections = Object.values(mockSections).sort((a, b) => a.display_order - b.display_order);
              const newResult = Promise.resolve({ data: sections, error: null });
              newResult.limit = (count) => {
                const limitedData = sections.slice(0, count);
                const limitResult = Promise.resolve({ data: limitedData, error: null });
                limitResult.single = () => Promise.resolve({ 
                  data: limitedData[0] || null, 
                  error: limitedData[0] ? null : { message: 'No data found' } 
                });
                return limitResult;
              };
              return newResult;
            }
            return Promise.resolve({ data: [], error: null });
          };
          
          result.single = () => result;
          result.limit = (count) => result;
          
          return result;
        };
        
        if (table === 'sections') {
          const sections = Object.values(mockSections);
          return createQueryResult(sections);
        } else if (table === 'visuals') {
          return createQueryResult([]);
        }
        
        return createQueryResult([]);
      }
    }),
    storage: {
      from: (bucket) => ({
        createSignedUrl: async (path, expiresIn) => {
          // Return mock signed URLs for development
          return {
            data: { signedUrl: 'https://i.ytimg.com/vi/NVg0GfEtGQA/maxresdefault.jpg' },
            error: null
          };
        },
        download: async (path) => {
          // Return mock markdown content
          const filename = path.split('/').pop();
          const content = mockMarkdownContent[filename] || 'Mock content not available.';
          const blob = new Blob([content], { type: 'text/plain' });
          return { data: blob, error: null };
        }
      })
    },
    auth: {
      getSession: async () => {
        // Return no session for development
        return { data: { session: null }, error: null };
      },
      onAuthStateChange: (callback) => {
        // Return a mock subscription object
        return {
          data: {
            unsubscribe: () => {
              // Mock unsubscribe function
            }
          }
        };
      },
      signUp: async (credentials) => {
        return { data: { user: null, session: null }, error: { message: 'Auth not available in development mode' } };
      },
      signInWithPassword: async (credentials) => {
        return { data: { user: null, session: null }, error: { message: 'Auth not available in development mode' } };
      },
      signOut: async () => {
        return { error: null };
      }
    }
  };
};

// Use real Supabase client if env vars are available, otherwise use mock
let supabase;
if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn('Supabase environment variables not found. Using mock data for development.');
  supabase = createMockSupabaseClient();
}

export { supabase };