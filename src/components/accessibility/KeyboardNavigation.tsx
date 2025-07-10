
'use client';

import React, { useEffect, useCallback } from 'react';

interface KeyboardShortcut {
  keys: string[];
  description: string;
  action: () => void;
  context?: string;
}

interface KeyboardNavigationProps {
  shortcuts: KeyboardShortcut[];
  disabled?: boolean;
}

export const KeyboardNavigation: React.FC<KeyboardNavigationProps> = ({
  shortcuts,
  disabled = false
}) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (disabled) return;

    const pressedKeys = [];
    if (event.ctrlKey) pressedKeys.push('ctrl');
    if (event.altKey) pressedKeys.push('alt');
    if (event.shiftKey) pressedKeys.push('shift');
    if (event.metaKey) pressedKeys.push('meta');
    
    const key = event.key.toLowerCase();
    if (!['control', 'alt', 'shift', 'meta'].includes(key)) {
      pressedKeys.push(key);
    }

    const pressedCombination = pressedKeys.join('+');

    for (const shortcut of shortcuts) {
      const shortcutCombination = shortcut.keys.join('+').toLowerCase();
      if (pressedCombination === shortcutCombination) {
        event.preventDefault();
        shortcut.action();
        break;
      }
    }
  }, [shortcuts, disabled]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return null;
};

// Keyboard shortcuts help modal
interface KeyboardHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  shortcuts: KeyboardShortcut[];
}

export const KeyboardHelpModal: React.FC<KeyboardHelpModalProps> = ({
  isOpen,
  onClose,
  shortcuts
}) => {
  if (!isOpen) return null;

  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    const context = shortcut.context || 'General';
    if (!acc[context]) acc[context] = [];
    acc[context].push(shortcut);
    return acc;
  }, {} as Record<string, KeyboardShortcut[]>);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-auto">
        <div className="flex items-center justify-between p-6 border-b border-sacred-blue-100">
          <h2 className="text-xl font-serif text-sacred-blue-900">
            ⌨️ Keyboard Shortcuts
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-sacred-blue-400 hover:text-sacred-blue-600 rounded-lg transition-colors"
            aria-label="Close keyboard shortcuts help"
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {Object.entries(groupedShortcuts).map(([context, contextShortcuts]) => (
            <div key={context}>
              <h3 className="font-medium text-sacred-blue-800 mb-3 text-lg">
                {context}
              </h3>
              <div className="space-y-2">
                {contextShortcuts.map((shortcut, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <span className="text-sacred-blue-700">
                      {shortcut.description}
                    </span>
                    <div className="flex space-x-1">
                      {shortcut.keys.map((key, keyIndex) => (
                        <kbd
                          key={keyIndex}
                          className="
                            px-2 py-1 text-xs font-mono bg-sacred-blue-100 
                            text-sacred-blue-800 rounded border border-sacred-blue-200
                          "
                        >
                          {key}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="px-6 pb-6 text-center">
          <p className="text-sm text-sacred-blue-500">
            Press <kbd className="px-1 py-0.5 text-xs bg-sacred-blue-100 rounded">?</kbd> to toggle this help
          </p>
        </div>
      </div>
    </div>
  );
};

// Global keyboard shortcuts hook
export const useGlobalKeyboardShortcuts = () => {
  const [showHelp, setShowHelp] = React.useState(false);

  const globalShortcuts: KeyboardShortcut[] = [
    {
      keys: ['?'],
      description: 'Show keyboard shortcuts',
      action: () => setShowHelp(true),
      context: 'Help'
    },
    {
      keys: ['escape'],
      description: 'Close modal or dialog',
      action: () => setShowHelp(false),
      context: 'General'
    },
    {
      keys: ['ctrl', 'k'],
      description: 'Search or quick actions',
      action: () => {
        // Could implement search modal
        console.log('Search shortcut triggered');
      },
      context: 'Navigation'
    }
  ];

  return {
    shortcuts: globalShortcuts,
    showHelp,
    setShowHelp
  };
};

export default {
  KeyboardNavigation,
  KeyboardHelpModal,
  useGlobalKeyboardShortcuts
};
