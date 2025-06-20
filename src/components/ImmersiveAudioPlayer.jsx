
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  SkipBack, 
  SkipForward,
  RotateCcw,
  Download
} from 'lucide-react';
import SacredButton from '@/components/ui/sacred-button';
import SacredCard from '@/components/ui/sacred-card';

export default function ImmersiveAudioPlayer({ audioUrl, title, className = '' }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const audioRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleError = (e) => {
      setError('Audio failed to load');
      setIsLoading(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [audioUrl]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    const progressBar = progressRef.current;
    if (!audio || !progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const seekTime = percent * duration;
    
    audio.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const skip = (seconds) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const restart = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = 0;
    setCurrentTime(0);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (error) {
    return (
      <SacredCard variant="glass" className={`p-6 ${className}`}>
        <div className="text-center text-red-600">
          <VolumeX className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="font-semibold">Audio Unavailable</p>
          <p className="text-sm opacity-75 mt-1">{error}</p>
        </div>
      </SacredCard>
    );
  }

  return (
    <SacredCard variant="glass" className={`p-6 ${className}`}>
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
      />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-serif text-sacred-blue-900 mb-1">
            Audio Experience
          </h3>
          <p className="text-sacred-blue-600 text-sm">
            {title || 'Sacred Journey Audio'}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {audioUrl && (
            <SacredButton
              variant="ghost"
              size="sm"
              onClick={() => window.open(audioUrl, '_blank')}
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </SacredButton>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin w-8 h-8 border-2 border-sacred-blue-500 border-t-transparent rounded-full mx-auto mb-3"></div>
          <p className="text-sacred-blue-600">Loading audio...</p>
        </div>
      ) : (
        <>
          {/* Progress Bar */}
          <div className="mb-6">
            <div 
              ref={progressRef}
              className="w-full h-2 bg-sacred-blue-100 rounded-full cursor-pointer relative overflow-hidden"
              onClick={handleSeek}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-sacred-blue-500 to-sacred-gold-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.1 }}
              />
              <motion.div
                className="absolute top-0 w-4 h-4 bg-white border-2 border-sacred-blue-500 rounded-full shadow-lg transform -translate-y-1 -translate-x-2 cursor-grab"
                style={{ left: `${progressPercent}%` }}
                whileHover={{ scale: 1.1 }}
                whileDrag={{ scale: 1.2 }}
              />
            </div>
            <div className="flex justify-between mt-2 text-sm text-sacred-blue-600">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            <motion.button
              onClick={restart}
              className="p-2 text-sacred-blue-600 hover:text-sacred-blue-800 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <RotateCcw className="w-5 h-5" />
            </motion.button>

            <motion.button
              onClick={() => skip(-15)}
              className="p-2 text-sacred-blue-600 hover:text-sacred-blue-800 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <SkipBack className="w-6 h-6" />
            </motion.button>

            <motion.button
              onClick={togglePlayPause}
              className="p-4 bg-gradient-to-r from-sacred-blue-500 to-sacred-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isPlaying ? (
                <Pause className="w-8 h-8" />
              ) : (
                <Play className="w-8 h-8 ml-1" />
              )}
            </motion.button>

            <motion.button
              onClick={() => skip(15)}
              className="p-2 text-sacred-blue-600 hover:text-sacred-blue-800 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <SkipForward className="w-6 h-6" />
            </motion.button>

            <motion.button
              onClick={toggleMute}
              className="p-2 text-sacred-blue-600 hover:text-sacred-blue-800 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </motion.button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center space-x-3">
            <Volume2 className="w-4 h-4 text-sacred-blue-600" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="flex-1 h-1 bg-sacred-blue-100 rounded-full outline-none slider"
            />
            <span className="text-sm text-sacred-blue-600 min-w-[3rem] text-right">
              {Math.round((isMuted ? 0 : volume) * 100)}%
            </span>
          </div>
        </>
      )}
    </SacredCard>
  );
}
