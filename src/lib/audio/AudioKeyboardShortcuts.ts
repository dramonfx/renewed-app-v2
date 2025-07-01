// src/lib/audio/AudioKeyboardShortcuts.ts
'use client';

/**
 * Audio Keyboard Shortcuts System
 * 
 * Provides comprehensive keyboard control for audio players with
 * customizable shortcuts and accessibility features.
 */

export interface KeyboardShortcut {
  key: string;
  code: string;
  modifiers: {
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    meta?: boolean;
  };
  action: string;
  description: string;
  enabled: boolean;
}

export interface KeyboardShortcutsConfig {
  enabled: boolean;
  preventDefaultOnInputs: boolean;
  showNotifications: boolean;
  customShortcuts: KeyboardShortcut[];
}

export interface AudioPlayerControls {
  playPause: () => void;
  skipForward: (seconds?: number) => void;
  skipBackward: (seconds?: number) => void;
  volumeUp: () => void;
  volumeDown: () => void;
  mute: () => void;
  seek: (time: number) => void;
  nextTrack?: () => void;
  previousTrack?: () => void;
  restart?: () => void;
}

export class AudioKeyboardShortcuts {
  private config: KeyboardShortcutsConfig;
  private controls: AudioPlayerControls | null = null;
  private shortcuts: Map<string, KeyboardShortcut> = new Map();
  private isEnabled: boolean = true;
  private eventListeners: Map<string, Function[]> = new Map();

  constructor(config: Partial<KeyboardShortcutsConfig> = {}) {
    this.config = {
      enabled: true,
      preventDefaultOnInputs: true,
      showNotifications: false,
      customShortcuts: [],
      ...config
    };

    this.initializeDefaultShortcuts();
    this.initializeCustomShortcuts();
    
    if (this.config.enabled) {
      this.enable();
    }
  }

  /**
   * Initialize default keyboard shortcuts
   */
  private initializeDefaultShortcuts(): void {
    const defaultShortcuts: KeyboardShortcut[] = [
      {
        key: ' ',
        code: 'Space',
        modifiers: {},
        action: 'playPause',
        description: 'Play/Pause',
        enabled: true
      },
      {
        key: 'ArrowLeft',
        code: 'ArrowLeft',
        modifiers: {},
        action: 'skipBackward',
        description: 'Skip backward 10 seconds',
        enabled: true
      },
      {
        key: 'ArrowRight',
        code: 'ArrowRight',
        modifiers: {},
        action: 'skipForward',
        description: 'Skip forward 10 seconds',
        enabled: true
      },
      {
        key: 'ArrowUp',
        code: 'ArrowUp',
        modifiers: {},
        action: 'volumeUp',
        description: 'Volume up',
        enabled: true
      },
      {
        key: 'ArrowDown',
        code: 'ArrowDown',
        modifiers: {},
        action: 'volumeDown',
        description: 'Volume down',
        enabled: true
      },
      {
        key: 'm',
        code: 'KeyM',
        modifiers: {},
        action: 'mute',
        description: 'Toggle mute',
        enabled: true
      },
      {
        key: 'r',
        code: 'KeyR',
        modifiers: {},
        action: 'restart',
        description: 'Restart track',
        enabled: true
      },
      {
        key: 'n',
        code: 'KeyN',
        modifiers: {},
        action: 'nextTrack',
        description: 'Next track',
        enabled: true
      },
      {
        key: 'p',
        code: 'KeyP',
        modifiers: {},
        action: 'previousTrack',
        description: 'Previous track',
        enabled: true
      }
    ];

    defaultShortcuts.forEach(shortcut => {
      const key = this.generateShortcutKey(shortcut);
      this.shortcuts.set(key, shortcut);
    });
  }

  /**
   * Initialize custom shortcuts from config
   */
  private initializeCustomShortcuts(): void {
    this.config.customShortcuts.forEach(shortcut => {
      const key = this.generateShortcutKey(shortcut);
      this.shortcuts.set(key, shortcut);
    });
  }

  /**
   * Generate unique key for shortcut mapping
   */
  private generateShortcutKey(shortcut: KeyboardShortcut): string {
    const modifiers = [];
    if (shortcut.modifiers.ctrl) modifiers.push('ctrl');
    if (shortcut.modifiers.shift) modifiers.push('shift');
    if (shortcut.modifiers.alt) modifiers.push('alt');
    if (shortcut.modifiers.meta) modifiers.push('meta');
    
    return `${modifiers.join('+')}_${shortcut.code}`;
  }

  /**
   * Set audio player controls
   */
  public setControls(controls: AudioPlayerControls): void {
    this.controls = controls;
  }

  /**
   * Enable keyboard shortcuts
   */
  public enable(): void {
    if (typeof window === 'undefined') return;
    
    this.isEnabled = true;
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  /**
   * Disable keyboard shortcuts
   */
  public disable(): void {
    if (typeof window === 'undefined') return;
    
    this.isEnabled = false;
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }

  /**
   * Handle keydown events
   */
  private handleKeyDown = (event: KeyboardEvent): void => {
    if (!this.isEnabled || !this.controls) return;

    // Check if we should prevent default on input elements
    if (this.config.preventDefaultOnInputs && this.isInputElement(event.target)) {
      return;
    }

    const shortcutKey = this.generateShortcutKeyFromEvent(event);
    const shortcut = this.shortcuts.get(shortcutKey);

    if (shortcut && shortcut.enabled) {
      event.preventDefault();
      this.executeShortcut(shortcut);
      
      if (this.config.showNotifications) {
        this.showNotification(shortcut.description);
      }
      
      this.emit('shortcutExecuted', { shortcut, event });
    }
  };

  /**
   * Handle keyup events
   */
  private handleKeyUp = (event: KeyboardEvent): void => {
    // Handle any keyup-specific logic here
    this.emit('keyUp', { event });
  };

  /**
   * Generate shortcut key from keyboard event
   */
  private generateShortcutKeyFromEvent(event: KeyboardEvent): string {
    const modifiers = [];
    if (event.ctrlKey) modifiers.push('ctrl');
    if (event.shiftKey) modifiers.push('shift');
    if (event.altKey) modifiers.push('alt');
    if (event.metaKey) modifiers.push('meta');
    
    return `${modifiers.join('+')}_${event.code}`;
  }

  /**
   * Check if target is an input element
   */
  private isInputElement(target: EventTarget | null): boolean {
    if (!target) return false;
    
    const element = target as HTMLElement;
    const tagName = element.tagName.toLowerCase();
    
    return ['input', 'textarea', 'select', 'button'].includes(tagName) ||
           element.contentEditable === 'true' ||
           element.getAttribute('role') === 'textbox';
  }

  /**
   * Execute a keyboard shortcut action
   */
  private executeShortcut(shortcut: KeyboardShortcut): void {
    if (!this.controls) return;

    switch (shortcut.action) {
      case 'playPause':
        this.controls.playPause();
        break;
      case 'skipForward':
        this.controls.skipForward(10);
        break;
      case 'skipBackward':
        this.controls.skipBackward(10);
        break;
      case 'volumeUp':
        this.controls.volumeUp();
        break;
      case 'volumeDown':
        this.controls.volumeDown();
        break;
      case 'mute':
        this.controls.mute();
        break;
      case 'restart':
        if (this.controls.restart) {
          this.controls.restart();
        } else {
          this.controls.seek(0);
        }
        break;
      case 'nextTrack':
        if (this.controls.nextTrack) {
          this.controls.nextTrack();
        }
        break;
      case 'previousTrack':
        if (this.controls.previousTrack) {
          this.controls.previousTrack();
        }
        break;
      default:
        console.warn(`Unknown shortcut action: ${shortcut.action}`);
    }
  }

  /**
   * Show notification for executed shortcut
   */
  private showNotification(message: string): void {
    // Simple notification implementation
    // In a real app, you might want to use a toast library
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('Audio Player', {
          body: message,
          icon: '/favicon.ico',
          tag: 'audio-shortcut'
        });
      }
    }
  }

  /**
   * Add custom shortcut
   */
  public addShortcut(shortcut: KeyboardShortcut): void {
    const key = this.generateShortcutKey(shortcut);
    this.shortcuts.set(key, shortcut);
  }

  /**
   * Remove shortcut
   */
  public removeShortcut(shortcut: KeyboardShortcut): void {
    const key = this.generateShortcutKey(shortcut);
    this.shortcuts.delete(key);
  }

  /**
   * Get all shortcuts
   */
  public getShortcuts(): KeyboardShortcut[] {
    return Array.from(this.shortcuts.values());
  }

  /**
   * Update shortcut
   */
  public updateShortcut(oldShortcut: KeyboardShortcut, newShortcut: KeyboardShortcut): void {
    this.removeShortcut(oldShortcut);
    this.addShortcut(newShortcut);
  }

  /**
   * Enable/disable specific shortcut
   */
  public toggleShortcut(shortcut: KeyboardShortcut, enabled: boolean): void {
    const key = this.generateShortcutKey(shortcut);
    const existingShortcut = this.shortcuts.get(key);
    
    if (existingShortcut) {
      existingShortcut.enabled = enabled;
    }
  }

  /**
   * Event system
   */
  public on(event: string, listener: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(listener);
  }

  public off(event: string, listener: Function): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data?: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(listener => listener(data));
    }
  }

  /**
   * Update configuration
   */
  public updateConfig(newConfig: Partial<KeyboardShortcutsConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    if (this.config.enabled && !this.isEnabled) {
      this.enable();
    } else if (!this.config.enabled && this.isEnabled) {
      this.disable();
    }
  }

  /**
   * Get help text for all shortcuts
   */
  public getHelpText(): string {
    const enabledShortcuts = Array.from(this.shortcuts.values())
      .filter(shortcut => shortcut.enabled);
    
    return enabledShortcuts
      .map(shortcut => {
        const modifiers = [];
        if (shortcut.modifiers.ctrl) modifiers.push('Ctrl');
        if (shortcut.modifiers.shift) modifiers.push('Shift');
        if (shortcut.modifiers.alt) modifiers.push('Alt');
        if (shortcut.modifiers.meta) modifiers.push('Cmd');
        
        const keyCombo = modifiers.length > 0 
          ? `${modifiers.join('+')}+${shortcut.key}`
          : shortcut.key;
          
        return `${keyCombo}: ${shortcut.description}`;
      })
      .join('\n');
  }

  /**
   * Cleanup
   */
  public cleanup(): void {
    this.disable();
    this.shortcuts.clear();
    this.eventListeners.clear();
    this.controls = null;
  }
}

export default AudioKeyboardShortcuts;