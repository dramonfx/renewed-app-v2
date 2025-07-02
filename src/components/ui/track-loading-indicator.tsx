
// src/components/ui/track-loading-indicator.tsx
'use client';

/**
 * Track Loading Indicator Components - Phase 5.1 Foundation
 * 
 * Provides visual feedback during track loading and cross-track navigation.
 * Includes loading states, progress indicators, and error handling UI.
 */

import React from 'react';
import { TrackLoadingState, CrossTrackNavigationError } from '../../types/audio';

// === COMPONENT TYPES ===

export interface TrackLoadingIndicatorProps {
  state: TrackLoadingState;
  trackSlug?: string;
  progress?: number; // 0-100
  error?: CrossTrackNavigationError;
  onCancel?: () => void;
  onRetry?: () => void;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'minimal' | 'detailed' | 'overlay';
}

export interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export interface ProgressBarProps {
  progress: number; // 0-100
  className?: string;
  showPercentage?: boolean;
}

export interface ErrorDisplayProps {
  error: CrossTrackNavigationError;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

// === LOADING SPINNER ===

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  className = ''
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8'
  };

  return (
    <div className={`inline-block ${sizeClasses[size]} ${className}`}>
      <div className="animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 h-full w-full"></div>
    </div>
  );
};

// === PROGRESS BAR ===

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  className = '',
  showPercentage = false
}) => {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className={`w-full ${className}`}>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${clampedProgress}%` }}
        ></div>
      </div>
      {showPercentage && (
        <div className="text-xs text-gray-600 mt-1 text-center">
          {Math.round(clampedProgress)}%
        </div>
      )}
    </div>
  );
};

// === ERROR DISPLAY ===

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  onDismiss,
  className = ''
}) => {
  const getErrorIcon = () => {
    switch (error.code) {
      case 'TRACK_NOT_FOUND':
        return '🔍';
      case 'LOADING_TIMEOUT':
        return '⏱️';
      case 'SECTION_NOT_LOADED':
        return '📂';
      default:
        return '⚠️';
    }
  };

  const getErrorTitle = () => {
    switch (error.code) {
      case 'TRACK_NOT_FOUND':
        return 'Track Not Found';
      case 'LOADING_TIMEOUT':
        return 'Loading Timeout';
      case 'SECTION_NOT_LOADED':
        return 'Section Not Loaded';
      default:
        return 'Loading Error';
    }
  };

  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start">
        <div className="text-2xl mr-3">{getErrorIcon()}</div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-red-800">
            {getErrorTitle()}
          </h3>
          <p className="text-sm text-red-700 mt-1">
            {error.message}
          </p>
          {error.trackSlug && (
            <p className="text-xs text-red-600 mt-1">
              Track: {error.trackSlug}
            </p>
          )}
          <div className="flex gap-2 mt-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className="text-xs bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded transition-colors"
              >
                Retry
              </button>
            )}
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded transition-colors"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// === MAIN TRACK LOADING INDICATOR ===

export const TrackLoadingIndicator: React.FC<TrackLoadingIndicatorProps> = ({
  state,
  trackSlug,
  progress = 0,
  error,
  onCancel,
  onRetry,
  className = '',
  size = 'medium',
  variant = 'detailed'
}) => {
  // Don't render anything if idle
  if (state === 'idle') {
    return null;
  }

  // Error state
  if (state === 'error' && error) {
    return (
      <ErrorDisplay
        error={error}
        onRetry={onRetry}
        onDismiss={onCancel}
        className={className}
      />
    );
  }

  // Loading states
  const renderMinimal = () => (
    <div className={`flex items-center gap-2 ${className}`}>
      <LoadingSpinner size={size} />
      {variant !== 'minimal' && (
        <span className="text-sm text-gray-600">
          {state === 'resolving' && 'Finding track...'}
          {state === 'loading' && 'Loading...'}
          {state === 'loaded' && 'Ready'}
        </span>
      )}
    </div>
  );

  const renderDetailed = () => (
    <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <LoadingSpinner size={size} />
          <div>
            <h3 className="text-sm font-medium text-blue-800">
              {state === 'resolving' && 'Resolving Track'}
              {state === 'loading' && 'Loading Audio'}
              {state === 'loaded' && 'Track Ready'}
            </h3>
            {trackSlug && (
              <p className="text-xs text-blue-600 mt-1">
                {trackSlug}
              </p>
            )}
          </div>
        </div>
        {onCancel && state !== 'loaded' && (
          <button
            onClick={onCancel}
            className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
      
      {(state === 'loading' || state === 'resolving') && progress > 0 && (
        <ProgressBar progress={progress} showPercentage />
      )}
      
      {state === 'loaded' && (
        <div className="text-xs text-green-600 flex items-center gap-1">
          <span>✓</span>
          <span>Track loaded successfully</span>
        </div>
      )}
    </div>
  );

  const renderOverlay = () => (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${className}`}>
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <div className="text-center">
          <LoadingSpinner size="large" className="mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {state === 'resolving' && 'Finding Track'}
            {state === 'loading' && 'Loading Audio'}
            {state === 'loaded' && 'Ready to Play'}
          </h3>
          {trackSlug && (
            <p className="text-sm text-gray-600 mb-4">
              {trackSlug}
            </p>
          )}
          
          {(state === 'loading' || state === 'resolving') && progress > 0 && (
            <div className="mb-4">
              <ProgressBar progress={progress} showPercentage />
            </div>
          )}
          
          {onCancel && state !== 'loaded' && (
            <button
              onClick={onCancel}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );

  switch (variant) {
    case 'minimal':
      return renderMinimal();
    case 'overlay':
      return renderOverlay();
    case 'detailed':
    default:
      return renderDetailed();
  }
};

// === BATCH LOADING INDICATOR ===

export interface BatchLoadingIndicatorProps {
  totalTracks: number;
  loadedTracks: number;
  currentTrack?: string;
  errors?: CrossTrackNavigationError[];
  onCancel?: () => void;
  className?: string;
}

export const BatchLoadingIndicator: React.FC<BatchLoadingIndicatorProps> = ({
  totalTracks,
  loadedTracks,
  currentTrack,
  errors = [],
  onCancel,
  className = ''
}) => {
  const progress = totalTracks > 0 ? (loadedTracks / totalTracks) * 100 : 0;
  const isComplete = loadedTracks >= totalTracks;

  return (
    <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {!isComplete ? (
            <LoadingSpinner size="medium" />
          ) : (
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          )}
          <div>
            <h3 className="text-sm font-medium text-blue-800">
              {isComplete ? 'Batch Loading Complete' : 'Loading Tracks'}
            </h3>
            <p className="text-xs text-blue-600">
              {loadedTracks} of {totalTracks} tracks loaded
            </p>
          </div>
        </div>
        {onCancel && !isComplete && (
          <button
            onClick={onCancel}
            className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
      
      <ProgressBar progress={progress} showPercentage className="mb-3" />
      
      {currentTrack && !isComplete && (
        <p className="text-xs text-blue-600 mb-2">
          Currently loading: {currentTrack}
        </p>
      )}
      
      {errors.length > 0 && (
        <div className="mt-3">
          <p className="text-xs text-red-600 mb-2">
            {errors.length} error{errors.length !== 1 ? 's' : ''} occurred:
          </p>
          <div className="max-h-20 overflow-y-auto">
            {errors.slice(0, 3).map((error, index) => (
              <p key={index} className="text-xs text-red-500">
                • {error.trackSlug}: {error.message}
              </p>
            ))}
            {errors.length > 3 && (
              <p className="text-xs text-red-500">
                ... and {errors.length - 3} more
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// === CROSS-TRACK NAVIGATION INDICATOR ===

export interface CrossTrackNavigationIndicatorProps {
  sourceTrack?: string;
  targetTrack: string;
  state: TrackLoadingState;
  progress?: number;
  onCancel?: () => void;
  className?: string;
}

export const CrossTrackNavigationIndicator: React.FC<CrossTrackNavigationIndicatorProps> = ({
  sourceTrack,
  targetTrack,
  state,
  progress = 0,
  onCancel,
  className = ''
}) => {
  if (state === 'idle') return null;

  return (
    <div className={`bg-purple-50 border border-purple-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <LoadingSpinner size="medium" />
          <div>
            <h3 className="text-sm font-medium text-purple-800">
              Cross-Track Navigation
            </h3>
            <div className="text-xs text-purple-600 mt-1">
              {sourceTrack && (
                <div>From: {sourceTrack}</div>
              )}
              <div>To: {targetTrack}</div>
            </div>
          </div>
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-xs bg-purple-100 hover:bg-purple-200 text-purple-800 px-3 py-1 rounded transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
      
      {progress > 0 && (
        <ProgressBar progress={progress} className="mb-2" />
      )}
      
      <div className="text-xs text-purple-600">
        {state === 'resolving' && 'Resolving target track...'}
        {state === 'loading' && 'Loading target track...'}
        {state === 'loaded' && 'Navigation complete'}
      </div>
    </div>
  );
};

// === EXPORTS ===

export default TrackLoadingIndicator;

export {
  TrackLoadingIndicator,
  LoadingSpinner,
  ProgressBar,
  ErrorDisplay,
  BatchLoadingIndicator,
  CrossTrackNavigationIndicator
};
