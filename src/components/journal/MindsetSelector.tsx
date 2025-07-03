// src/components/journal/MindsetSelector.tsx
// Sacred Mindset Selector - Help users discern between Natural vs Spiritual Mind

'use client';

import React, { useState } from 'react';
import { Brain, Heart, Zap, Check, LucideIcon } from 'lucide-react';
import type { MindsetType } from '@/types';

// Define component prop types
interface MindsetSelectorProps {
  value?: MindsetType | null;
  onChange?: (mindset: MindsetType) => void;
  required?: boolean;
}

// Define mindset configuration types
interface MindsetTypeConfig {
  value: MindsetType;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  borderColor: string;
  textColor: string;
  iconColor: string;
  selectedBg: string;
  characteristics: string[];
}

export default function MindsetSelector({
  value,
  onChange,
  required = false,
}: MindsetSelectorProps): React.ReactElement {
  const [selectedMindset, setSelectedMindset] = useState<MindsetType | null>(value || null);

  // Sacred mindset types for spiritual discernment
  const mindsetTypes: MindsetTypeConfig[] = [
    {
      value: 'natural',
      title: 'The Natural Mind',
      description: 'Governed by fear, anxiety, and condemnation',
      icon: Brain,
      color: 'from-red-100 to-red-200',
      borderColor: 'border-red-300',
      textColor: 'text-red-700',
      iconColor: 'text-red-600',
      selectedBg: 'bg-red-100',
      characteristics: [
        'Fear-based thinking',
        'Anxiety and worry',
        'Self-condemnation',
        'Doubt and insecurity',
      ],
    },
    {
      value: 'transition',
      title: 'In Transition',
      description: 'Moving from natural patterns to spiritual truth',
      icon: Zap,
      color: 'from-amber-100 to-orange-200',
      borderColor: 'border-amber-300',
      textColor: 'text-amber-700',
      iconColor: 'text-amber-600',
      selectedBg: 'bg-amber-100',
      characteristics: [
        'Recognizing old patterns',
        'Seeking truth',
        'Growing awareness',
        'Choosing transformation',
      ],
    },
    {
      value: 'spiritual',
      title: 'The Spiritual Mind',
      description: 'Governed by love, joy, and peace',
      icon: Heart,
      color: 'from-emerald-100 to-green-200',
      borderColor: 'border-emerald-300',
      textColor: 'text-emerald-700',
      iconColor: 'text-emerald-600',
      selectedBg: 'bg-emerald-100',
      characteristics: [
        'Love-centered thinking',
        'Joy and peace',
        'Divine wisdom',
        'Spiritual discernment',
      ],
    },
  ];

  const handleMindsetSelect = (mindset: MindsetType): void => {
    setSelectedMindset(mindset);
    onChange?.(mindset);
  };

  return (
    <div className="space-y-4">
      {/* Sacred Header */}
      <div className="mb-6 text-center">
        <h3 className="mb-2 font-sacred-serif text-lg font-bold text-sacred-blue-800">
          Sacred Mind Discernment
        </h3>
        <p className="text-sm leading-relaxed text-sacred-blue-600">
          Which mindset guided your thoughts during this reflection?
          {required && <span className="ml-1 text-red-500">*</span>}
        </p>
      </div>

      {/* Mindset Selection Cards */}
      <div className="space-y-3">
        {mindsetTypes.map((mindset) => {
          const isSelected = selectedMindset === mindset.value;
          const Icon = mindset.icon;

          return (
            <div
              key={mindset.value}
              onClick={() => handleMindsetSelect(mindset.value)}
              className={`
                relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-md
                ${
                  isSelected
                    ? `${mindset.borderColor} ${mindset.selectedBg} scale-[1.02] shadow-lg`
                    : 'border-sacred-blue-200 bg-white hover:border-sacred-blue-300'
                }
              `}
            >
              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute right-3 top-3">
                  <div
                    className={`h-6 w-6 rounded-full ${mindset.selectedBg} border-2 ${mindset.borderColor} flex items-center justify-center`}
                  >
                    <Check className={`h-3 w-3 ${mindset.iconColor}`} />
                  </div>
                </div>
              )}

              <div className="flex items-start gap-4">
                {/* Sacred Icon */}
                <div
                  className={`
                  h-12 w-12 flex-shrink-0 rounded-xl bg-gradient-to-br ${mindset.color} 
                  flex items-center justify-center shadow-sm
                `}
                >
                  <Icon className={`h-6 w-6 ${mindset.iconColor}`} />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h4
                    className={`mb-1 text-base font-semibold ${isSelected ? mindset.textColor : 'text-sacred-blue-800'}`}
                  >
                    {mindset.title}
                  </h4>
                  <p
                    className={`mb-3 text-sm ${isSelected ? mindset.textColor : 'text-sacred-blue-600'}`}
                  >
                    {mindset.description}
                  </p>

                  {/* Characteristics */}
                  <div className="grid grid-cols-2 gap-1">
                    {mindset.characteristics.map((characteristic, index) => (
                      <div key={index} className="flex items-center gap-1.5">
                        <div
                          className={`h-1.5 w-1.5 rounded-full ${isSelected ? mindset.iconColor.replace('text-', 'bg-') : 'bg-sacred-blue-300'}`}
                        />
                        <span
                          className={`text-xs ${isSelected ? mindset.textColor : 'text-sacred-blue-600'}`}
                        >
                          {characteristic}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sacred Selection Glow Effect */}
              {isSelected && (
                <div
                  className={`absolute inset-0 rounded-xl bg-gradient-to-br ${mindset.color} pointer-events-none opacity-20`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Sacred Guidance Message */}
      <div className="mt-6 rounded-xl border border-sacred-blue-200 bg-gradient-to-r from-sacred-blue-50 to-purple-50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-sacred-blue-400 to-purple-400">
            <Heart className="h-4 w-4 text-white" />
          </div>
          <div>
            <h5 className="mb-1 text-sm font-semibold text-sacred-blue-800">
              Sacred Discernment Guidance
            </h5>
            <p className="text-xs leading-relaxed text-sacred-blue-600">
              This reflection on your mindset helps track your spiritual journey from natural
              thinking patterns toward the renewed mind of Christ. Be honest and gentle with
              yourself—growth is a process.
            </p>
          </div>
        </div>
      </div>

      {/* Validation Message */}
      {required && !selectedMindset && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3">
          <p className="text-sm font-medium text-red-700">
            Please select a mindset to continue with your sacred reflection.
          </p>
        </div>
      )}
    </div>
  );
}

// Export prop types for external use
export type { MindsetSelectorProps, MindsetTypeConfig };
