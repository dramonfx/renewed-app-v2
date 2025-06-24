
// src/lib/supabaseClient.ts
import { createClient, SupabaseClient, AuthSession, User } from '@supabase/supabase-js';
import { mockSections, mockMarkdownContent, mockVisuals, mockJournalEntries, mockAudioTracks, MockSection, MockVisual } from './mockData';
import type { JournalEntry, AudioTrack } from '@/types';

// Database type definitions
interface Database {
  public: {
    Tables: {
      sections: {
        Row: MockSection;
        Insert: Omit<MockSection, 'id'>;
        Update: Partial<Omit<MockSection, 'id'>>;
      };
      visuals: {
        Row: MockVisual;
        Insert: Omit<MockVisual, 'id'>;
        Update: Partial<Omit<MockVisual, 'id'>>;
      };
      reflections: {
        Row: JournalEntry;
        Insert: Omit<JournalEntry, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<JournalEntry, 'id' | 'created_at' | 'updated_at'>>;
      };
      audio_tracks: {
        Row: AudioTrack;
        Insert: Omit<AudioTrack, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<AudioTrack, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}

// Mock query builder interfaces
interface MockQueryResult<T> {
  data: T | null;
  error: any | null;
}

interface MockQueryBuilder<T> {
  select(columns?: string): MockQueryBuilder<T>;
  order(column: string, options?: { ascending?: boolean }): MockQueryBuilder<T>;
  limit(count: number): MockQueryBuilder<T>;
  eq(column: string, value: any): MockQueryBuilder<T>;
  single(): Promise<MockQueryResult<T>>;
  then(resolve: (result: MockQueryResult<T[]>) => void): void;
}

// Mock storage interface
interface MockStorage {
  from(bucket: string): {
    createSignedUrl(path: string, expiresIn: number): Promise<MockQueryResult<{ signedUrl: string }>>;
    download(path: string): Promise<MockQueryResult<Blob>>;
  };
}

// Mock auth interface
interface MockAuth {
  onAuthStateChange(callback: (event: string, session: AuthSession | null) => void): { 
    data: { subscription: { unsubscribe: () => void } } 
  };
  getSession(): Promise<MockQueryResult<{ session: AuthSession | null }>>;
  signUp(credentials: { email: string; password: string }): Promise<MockQueryResult<{ user: User | null; session: AuthSession | null }>>;
  signInWithPassword(credentials: { email: string; password: string }): Promise<MockQueryResult<{ user: User | null; session: AuthSession | null }>>;
  signOut(): Promise<{ error: any | null }>;
  getUser(): Promise<MockQueryResult<{ user: User | null }>>;
}

// Mock Supabase client interface
interface MockSupabaseClient {
  from<T = any>(table: string): MockQueryBuilder<T>;
  storage: MockStorage;
  auth: MockAuth;
}

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase: SupabaseClient<Database> | MockSupabaseClient;

if (supabaseUrl && supabaseAnonKey) {
  // Use the real Supabase client if credentials are provided
  supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
} else {
  // Use the new, smarter mock client if credentials are NOT found
  console.warn("Supabase environment variables not found. Using mock data for development.");

  const createMockQueryBuilder = <T>(initialData: T[]): MockQueryBuilder<T> => {
    let data = [...initialData]; // Create a mutable copy

    const builder: MockQueryBuilder<T> = {
      // Chaining methods: they modify the data and return the builder itself.
      select: function(columns?: string) { 
        return this; 
      }, // Mock doesn't need to filter columns
      
      order: function(column: string, options: { ascending?: boolean } = {}) {
        // A simple mock sort implementation
        data.sort((a: any, b: any) => {
          if (a[column] < b[column]) return options.ascending ? -1 : 1;
          if (a[column] > b[column]) return options.ascending ? 1 : -1;
          return 0;
        });
        return this;
      },
      
      limit: function(count: number) {
        data = data.slice(0, count);
        return this;
      },
      
      eq: function(column: string, value: any) {
        data = data.filter((item: any) => String(item[column]) === String(value));
        return this;
      },

      // Terminator methods: they return the final data in a promise.
      single: function(): Promise<MockQueryResult<T>> {
        return Promise.resolve({ data: data[0] || null, error: null });
      },

      // This allows the builder to be awaited directly
      then: function(resolve: (result: MockQueryResult<T[]>) => void) {
        resolve({ data, error: null });
      }
    };
    return builder;
  };

  const mockClient: MockSupabaseClient = {
    from: <T>(table: string): MockQueryBuilder<T> => {
      if (table === 'sections') {
        return createMockQueryBuilder(Object.values(mockSections)) as MockQueryBuilder<T>;
      }
      if (table === 'visuals') {
        // For visuals, we start with all of them and let .eq() filter by section_id
        const allVisuals = Object.values(mockVisuals).flat();
        return createMockQueryBuilder(allVisuals) as MockQueryBuilder<T>;
      }
      if (table === 'reflections') {
        // Mock reflections table for development
        return createMockQueryBuilder(mockJournalEntries) as MockQueryBuilder<T>;
      }
      if (table === 'audio_tracks') {
        // Mock audio tracks
        const allTracks = Object.values(mockAudioTracks).flat();
        return createMockQueryBuilder(allTracks) as MockQueryBuilder<T>;
      }
      return createMockQueryBuilder([]) as MockQueryBuilder<T>;
    },
    
    storage: {
      from: (bucket: string) => ({
        createSignedUrl: (path: string, expiresIn: number) => 
          Promise.resolve({ data: { signedUrl: `/mock-assets/${path}` }, error: null }),
        download: (path: string) => {
          const content = mockMarkdownContent[path] || 'Mock content not found.';
          const blob = new Blob([content], { type: 'text/plain' });
          return Promise.resolve({ data: blob, error: null });
        },
      }),
    },
    
    auth: {
      onAuthStateChange: (callback: (event: string, session: AuthSession | null) => void) => ({ 
        data: { subscription: { unsubscribe: () => {} } } 
      }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signUp: (credentials: { email: string; password: string }) => 
        Promise.resolve({ 
          data: { user: null, session: null }, 
          error: { message: 'Mock mode - no real authentication' } 
        }),
      signInWithPassword: (credentials: { email: string; password: string }) => 
        Promise.resolve({ 
          data: { user: null, session: null }, 
          error: { message: 'Mock mode - no real authentication' } 
        }),
      signOut: () => Promise.resolve({ error: null }),
      getUser: () => Promise.resolve({ 
        data: { user: null }, 
        error: { message: 'Mock mode - no real authentication' } 
      }),
    },
  };

  supabase = mockClient;
}

// Type-safe export
export { supabase };
export type { Database, MockSupabaseClient };

// Helper function to check if using mock client
export const isMockClient = (): boolean => {
  return !supabaseUrl || !supabaseAnonKey;
};

// Helper function to get client type
export const getClientType = (): 'real' | 'mock' => {
  return isMockClient() ? 'mock' : 'real';
};
