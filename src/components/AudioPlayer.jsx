// src/components/AudioPlayer.jsx
'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { usePlaylist } from '@/contexts/PlaylistContext';
import {
  FaPlay, FaPause, FaStepBackward, FaStepForward,
  FaBackward, FaForward, FaBookmark, FaUndo, FaTimes
} from 'react-icons/fa';

export default function AudioPlayer({ className = '' }) {
  const { tracks, currentIdx, playIdx, next, prev } = usePlaylist();
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [isActuallyPlaying, setIsActuallyPlaying] = useState(false);
  const [rate, setRate] = useState(1);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [hasBookmark, setHasBookmark] = useState(false);
  const [bookmarkRefreshKey, setBookmarkRefreshKey] = useState(0);

  const track = tracks[currentIdx];
  const progressKey = track ? `audio-progress-${track.slug || track.id}` : null;
  const globalBookmarkKey = 'audio-bookmark-global';

  // Effect to load new track source and apply playback rate
  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement || !track || !track.audioUrl) {
      if (audioElement) audioElement.src = '';
      setPlaying(false); 
      setIsActuallyPlaying(false);
      setDuration(0); setCurrentTime(0); 
      return;
    }
    const currentSrc = audioElement.src;
    const newSrc = track.audioUrl;
    if (currentSrc !== newSrc) {
        audioElement.src = newSrc;
        setCurrentTime(0); 
        setDuration(0);    
        audioElement.load(); 
    }
    audioElement.playbackRate = rate;
  }, [track, rate]);

  // Effect to handle actual play/pause based on 'playing' (intent) state
  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement || !track || !track.audioUrl) return;
    if (playing) {
      audioElement.play()
        .then(() => setIsActuallyPlaying(true))
        .catch(e => {
          console.error("Error attempting to play audio:", e);
          setPlaying(false); 
          setIsActuallyPlaying(false);
        });
    } else {
      audioElement.pause();
      setIsActuallyPlaying(false);
    }
  }, [playing, track, track?.audioUrl]); 

  const handleNextTrack = useCallback(() => {
    if (track && progressKey) localStorage.removeItem(progressKey);
    next();
    setPlaying(true);
  }, [next, track, progressKey]);

  const handlePrevTrack = useCallback(() => {
    if (track && progressKey) localStorage.removeItem(progressKey);
    prev();
    setPlaying(true);
  }, [prev, track, progressKey]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el || !track) return; 
    const updateCurrentAudioTime = () => setCurrentTime(el.currentTime);
    const saveProgress = () => {
      if (progressKey && el.currentTime > 0 && el.duration > 0 && el.currentTime < el.duration && !isNaN(el.duration)) {
        localStorage.setItem(progressKey, el.currentTime.toString());
      }
    };
    const handleLoadedMeta = () => {
      setDuration(el.duration || 0);
      const jumpToGlobalBookmarkTimeStr = sessionStorage.getItem('jumpToGlobalBookmarkTime');
      if (jumpToGlobalBookmarkTimeStr !== null && track && localStorage.getItem(globalBookmarkKey)?.includes(track.slug)) {
          const jumpTime = parseFloat(jumpToGlobalBookmarkTimeStr);
          sessionStorage.removeItem('jumpToGlobalBookmarkTime'); 
          if (!isNaN(jumpTime) && jumpTime < (el.duration || Infinity)) {
              el.currentTime = jumpTime; setCurrentTime(jumpTime);
          }
      } else if (progressKey) { 
        const savedTime = localStorage.getItem(progressKey);
        if (savedTime && !isNaN(parseFloat(savedTime))) {
          const timeToSet = parseFloat(savedTime);
          if (timeToSet < (el.duration || Infinity) && timeToSet > 0.1) { 
            el.currentTime = timeToSet; setCurrentTime(timeToSet);
          } else { el.currentTime = 0; setCurrentTime(0); }
        } else { el.currentTime = 0; setCurrentTime(0); }
      } else { el.currentTime = 0; setCurrentTime(0); }
    };
    const handleAudioPlay = () => setIsActuallyPlaying(true);
    const handleAudioPause = () => setIsActuallyPlaying(false);
    const onEnded = () => {
      if (currentIdx < tracks.length - 1) { handleNextTrack(); }
      else { setPlaying(false); setIsActuallyPlaying(false); }
    };
    el.addEventListener('timeupdate', updateCurrentAudioTime);
    el.addEventListener('loadedmetadata', handleLoadedMeta);
    el.addEventListener('ended', onEnded);
    el.addEventListener('play', handleAudioPlay);
    el.addEventListener('pause', handleAudioPause);
    const progressInterval = setInterval(saveProgress, 5000);
    el.addEventListener('pause', saveProgress); 
    return () => {
      el.removeEventListener('timeupdate', updateCurrentAudioTime);
      el.removeEventListener('loadedmetadata', handleLoadedMeta);
      el.removeEventListener('ended', onEnded);
      el.removeEventListener('play', handleAudioPlay);
      el.removeEventListener('pause', handleAudioPause);
      clearInterval(progressInterval);
      el.removeEventListener('pause', saveProgress);
    };
  }, [track, progressKey, currentIdx, tracks.length, handleNextTrack]);

  useEffect(() => {
    if (!track) return;
    const raw = localStorage.getItem(globalBookmarkKey);
    try {
      const data = JSON.parse(raw);
      setHasBookmark(!!data && !!data.slug && !isNaN(data.time));
    } catch { setHasBookmark(false); }
  }, [track, bookmarkRefreshKey]);

  const togglePlay = () => {
    if (!audioRef.current || !track || !track.audioUrl) return;
    setPlaying(prevPlaying => !prevPlaying);
  };

  const skip = useCallback((secs) => () => {
    if (audioRef.current) {
      audioRef.current.currentTime += secs;
      setCurrentTime(audioRef.current.currentTime); 
    }
  }, []);

  const toggleRate = () => {
    const speedOptions = [1, 1.25, 1.5, 2];
    const currentIndex = speedOptions.indexOf(rate);
    const nextIndex = (currentIndex + 1) % speedOptions.length;
    const newRate = speedOptions[nextIndex];
    setRate(newRate);
  };

  const handleSeek = (e) => {
    if (!audioRef.current || !track) return;
    const value = parseFloat(e.target.value);
    audioRef.current.currentTime = value; setCurrentTime(value);
    if (progressKey) localStorage.setItem(progressKey, value.toString());
  };

  const handleBookmark = () => {
    if (!audioRef.current || !track) return;
    const bookmark = { slug: track.slug, time: audioRef.current.currentTime, trackTitle: track.title };
    localStorage.setItem(globalBookmarkKey, JSON.stringify(bookmark));
    setHasBookmark(true); setBookmarkRefreshKey(prev => prev + 1);
  };

  const handleClearBookmark = () => {
    localStorage.removeItem(globalBookmarkKey);
    setHasBookmark(false);
    setBookmarkRefreshKey(prev => prev + 1);
  };

  const handleJumpToBookmark = () => {
    const raw = localStorage.getItem(globalBookmarkKey);
    try {
      const data = JSON.parse(raw);
      if (!data || !data.slug || isNaN(data.time)) throw new Error('Invalid bookmark data');
      const index = tracks.findIndex(t => t.slug === data.slug);
      if (index === -1) throw new Error('Bookmarked track not found');
      setPlaying(false); 
      if (currentIdx === index) {
        if (audioRef.current) { audioRef.current.currentTime = data.time; setCurrentTime(data.time); }
        setPlaying(true); 
      } else {
        sessionStorage.setItem('jumpToGlobalBookmarkTime', data.time.toString()); 
        playIdx(index); 
        setPlaying(true);
      }
    } catch (err) { console.error("Error jumping to bookmark:", err); }
  };

  const formatTime = (t) => {
    if (isNaN(t) || t === Infinity) return '0:00';
    const minutes = Math.floor(t / 60); const seconds = Math.floor(t % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // --- AESTHETIC STYLE ADJUSTMENTS ---
  const playerCardActualBg = 'bg-brand-blue-medium/70 backdrop-blur-sm'; 
  
  const mainControlIconSize = "h-5 w-5"; 
  const playPauseIconSize = "h-6 w-6"; 

  const mainCircularButton = `p-3 w-11 h-11 flex items-center justify-center rounded-full bg-brand-blue-dark text-brand-cream hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-opacity-70 transition-colors shadow-md`;
  const playPauseButtonMockup = `${mainCircularButton} text-brand-gold`;
  // --- MODIFIED bottomTextButtonMockup for darker buttons ---
  const bottomTextButtonMockup = "py-1.5 px-3.5 rounded-full font-sans text-xs text-brand-cream bg-brand-blue-dark/60 hover:bg-brand-blue-dark/80 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 focus:ring-offset-brand-blue-medium transition-colors flex items-center gap-1.5 shadow-sm";

  if (!track) {
    return <div className={`text-brand-cream ${className} p-4 text-center`}>Loading player or no tracks...</div>;
  }

  return (
    <div className={`flex flex-col gap-4 ${className} items-center p-6 rounded-2xl ${playerCardActualBg} shadow-xl`}>
      <audio ref={audioRef} className="hidden" controls={false} />
      
      <span className="text-xl font-semibold text-center text-brand-cream block">
        {track.title}
      </span>
      
      <div className="w-full flex items-center gap-3 text-sm text-brand-cream px-2">
        <span>{formatTime(currentTime)}</span>
        <input
          type="range"
          className="flex-grow h-1.5 bg-brand-blue-dark/50 rounded-full appearance-none cursor-pointer accent-brand-gold" 
          min={0} max={duration || 100} value={currentTime} step={0.5}
          onChange={handleSeek} title="Seek"
        />
        <span>{formatTime(duration)}</span>
      </div>

      <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
        <button onClick={handlePrevTrack} className={mainCircularButton} title="Previous Track">
          <FaStepBackward className={mainControlIconSize} />
        </button>
        <button onClick={skip(-10)} className={mainCircularButton} title="Rewind 10 seconds">
          <FaBackward className={mainControlIconSize} />
        </button>
        <button onClick={togglePlay} className={playPauseButtonMockup} title={isActuallyPlaying ? "Pause" : "Play"}>
          {isActuallyPlaying ? <FaPause className={playPauseIconSize} /> : <FaPlay className={playPauseIconSize} />}
        </button>
        <button onClick={skip(10)} className={mainCircularButton} title="Forward 10 seconds">
          <FaForward className={mainControlIconSize} />
        </button>
        <button onClick={handleNextTrack} className={mainCircularButton} title="Next Track">
          <FaStepForward className={mainControlIconSize} />
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mt-3">
        <button onClick={toggleRate} className={bottomTextButtonMockup} title="Playback Speed">
          {rate}×
        </button>
        <button onClick={handleBookmark} className={bottomTextButtonMockup} title="Set Bookmark">
          <FaBookmark className="h-3.5 w-3.5" /> Bookmark
        </button>
        <button
          onClick={handleJumpToBookmark}
          className={`${bottomTextButtonMockup} ${hasBookmark ? 'text-green-300 font-semibold' : 'opacity-70'}`}
          title={hasBookmark ? 'Jump to your saved bookmark' : 'No bookmark saved'}
          disabled={!hasBookmark}
        >
          <FaUndo className="h-3.5 w-3.5" /> Return
        </button>
        <button onClick={handleClearBookmark} className={`${bottomTextButtonMockup} ${!hasBookmark ? 'opacity-50' : ''}`} disabled={!hasBookmark} title="Clear saved bookmark">
            <FaTimes className="h-3.5 w-3.5" /> Clear
        </button>
      </div>
    </div>
  );
}