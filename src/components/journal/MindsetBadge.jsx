
// src/components/journal/MindsetBadge.jsx
// Sacred Mindset Badge - Display mindset state on journal entries

'use client';

import { Brain, Heart, Zap } from 'lucide-react';

export default function MindsetBadge({ mindset, size = 'normal', showIcon = true, showText = true }) {
  if (!mindset) return null;

  // Sacred mindset configurations
  const mindsetConfig = {
    Natural: {
      label: 'Natural Mind',
      shortLabel: 'Natural',
      icon: Brain,
      colors: {
        bg: 'bg-red-100',
        text: 'text-red-700',
        border: 'border-red-200',
        icon: 'text-red-600'
      }
    },
    Transition: {
      label: 'In Transition',
      shortLabel: 'Transition',
      icon: Zap,
      colors: {
        bg: 'bg-amber-100',
        text: 'text-amber-700',
        border: 'border-amber-200',
        icon: 'text-amber-600'
      }
    },
    Spiritual: {
      label: 'Spiritual Mind',
      shortLabel: 'Spiritual',
      icon: Heart,
      colors: {
        bg: 'bg-emerald-100',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        icon: 'text-emerald-600'
      }
    }
  };

  const config = mindsetConfig[mindset];
  if (!config) return null;

  const Icon = config.icon;

  // Size configurations
  const sizeConfig = {
    small: {
      container: 'px-2 py-1',
      text: 'text-xs',
      icon: 'w-3 h-3'
    },
    normal: {
      container: 'px-3 py-1.5',
      text: 'text-sm',
      icon: 'w-4 h-4'
    },
    large: {
      container: 'px-4 py-2',
      text: 'text-base',
      icon: 'w-5 h-5'
    }
  };

  const currentSize = sizeConfig[size] || sizeConfig.normal;

  return (
    <div 
      className={`
        inline-flex items-center gap-1.5 rounded-full border font-semibold
        ${config.colors.bg} ${config.colors.text} ${config.colors.border}
        ${currentSize.container} ${currentSize.text}
      `}
      title={`Mindset: ${config.label}`}
    >
      {showIcon && (
        <Icon className={`${currentSize.icon} ${config.colors.icon}`} />
      )}
      {showText && (
        <span>
          {size === 'small' ? config.shortLabel : config.label}
        </span>
      )}
    </div>
  );
}
