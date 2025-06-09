// src/contexts/PlaylistContext.tsx
'use client';
import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';

// Define the shape of a track
// We only need title and the pre-generated signed audioUrl from the server
interface Track {
  id: string | number; // Or whatever your section ID type is
  title: string;
  slug?: string; // Keep slug if AudioPlayer.jsx uses it for progress keys
  audioUrl: string | null; // This will be the signed URL
  // Add any other track properties your AudioPlayer.jsx might expect from the 'track' object
}

interface PlaylistContextType {
  tracks: Track[];
  currentIdx: number;
  playIdx: (index: number) => void;
  next: () => void;
  prev: () => void;
  isPlaying?: boolean; // Optional: if your advanced player needs to share play state
  setIsPlaying?: (playing: boolean) => void; // Optional
}

const PlaylistContext = createContext<PlaylistContextType | null>(null);

interface PlaylistProviderProps {
  children: ReactNode;
  initialTracks: Track[]; // Accept tracks as a prop
}

export const PlaylistProvider = ({ children, initialTracks }: PlaylistProviderProps) => {
  const [currentIdx, setCurrentIdx] = useState(0);

  // Use the tracks passed in from the server-side fetched data
  const tracks = useMemo(() => initialTracks || [], [initialTracks]);

  const playIdx = useCallback((i: number) => {
    if (i >= 0 && i < tracks.length) {
      setCurrentIdx(i);
    }
  }, [tracks.length]);

  const next = useCallback(() => {
    setCurrentIdx(i => (i + 1 < tracks.length ? i + 1 : i));
  }, [tracks.length]);

  const prev = useCallback(() => {
    setCurrentIdx(i => (i - 1 >= 0 ? i - 1 : i));
  }, []);

  // Optional: Add isPlaying state if your AudioPlayer needs to sync it via context
  // const [isPlaying, setIsPlaying] = useState(false);

  const value = useMemo(
    () => ({
      tracks,
      currentIdx,
      playIdx,
      next,
      prev,
      // isPlaying, // Optional
      // setIsPlaying, // Optional
    }),
    [tracks, currentIdx, playIdx, next, prev /*, isPlaying, setIsPlaying */]
  );

  return <PlaylistContext.Provider value={value}>{children}</PlaylistContext.Provider>;
};

export const usePlaylist = (): PlaylistContextType => {
  const ctx = useContext(PlaylistContext);
  if (!ctx) {
    throw new Error('usePlaylist must be used inside <PlaylistProvider>');
  }
  return ctx;
};