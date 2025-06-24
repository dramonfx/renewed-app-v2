
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
  required = false 
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
      characteristics: ['Fear-based thinking', 'Anxiety and worry', 'Self-condemnation', 'Doubt and insecurity']
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
      characteristics: ['Recognizing old patterns', 'Seeking truth', 'Growing awareness', 'Choosing transformation']
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
      characteristics: ['Love-centered thinking', 'Joy and peace', 'Divine wisdom', 'Spiritual discernment']
    }
  ];

  const handleMindsetSelect = (mindset: MindsetType): void => {
    setSelectedMindset(mindset);
    onChange?.(mindset);
  };

  return (
    <div className="space-y-4">
      {/* Sacred Header */}
      <div className="text-center mb-6">
        <h3 className="font-sacred-serif text-lg font-bold text-sacred-blue-800 mb-2">
          Sacred Mind Discernment
        </h3>
        <p className="text-sm text-sacred-blue-600 leading-relaxed">
          Which mindset guided your thoughts during this reflection? 
          {required && <span className="text-red-500 ml-1">*</span>}
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
                relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-md hover:scale-[1.02]
                ${isSelected 
                  ? `${mindset.borderColor} ${mindset.selectedBg} shadow-lg scale-[1.02]` 
                  : 'border-sacred-blue-200 bg-white hover:border-sacred-blue-300'
                }
              `}
            >
              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3">
                  <div className={`w-6 h-6 rounded-full ${mindset.selectedBg} border-2 ${mindset.borderColor} flex items-center justify-center`}>
                    <Check className={`w-3 h-3 ${mindset.iconColor}`} />
                  </div>
                </div>
              )}

              <div className="flex items-start gap-4">
                {/* Sacred Icon */}
                <div className={`
                  flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${mindset.color} 
                  flex items-center justify-center shadow-sm
                `}>
                  <Icon className={`w-6 h-6 ${mindset.iconColor}`} />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h4 className={`font-semibold text-base mb-1 ${isSelected ? mindset.textColor : 'text-sacred-blue-800'}`}>
                    {mindset.title}
                  </h4>
                  <p className={`text-sm mb-3 ${isSelected ? mindset.textColor : 'text-sacred-blue-600'}`}>
                    {mindset.description}
                  </p>

                  {/* Characteristics */}
                  <div className="grid grid-cols-2 gap-1">
                    {mindset.characteristics.map((characteristic, index) => (
                      <div key={index} className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? mindset.iconColor.replace('text-', 'bg-') : 'bg-sacred-blue-300'}`} />
                        <span className={`text-xs ${isSelected ? mindset.textColor : 'text-sacred-blue-600'}`}>
                          {characteristic}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sacred Selection Glow Effect */}
              {isSelected && (
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${mindset.color} opacity-20 pointer-events-none`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Sacred Guidance Message */}
      <div className="mt-6 p-4 bg-gradient-to-r from-sacred-blue-50 to-purple-50 border border-sacred-blue-200 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-sacred-blue-400 to-purple-400 rounded-full flex items-center justify-center flex-shrink-0">
            <Heart className="w-4 h-4 text-white" />
          </div>
          <div>
            <h5 className="text-sm font-semibold text-sacred-blue-800 mb-1">
              Sacred Discernment Guidance
            </h5>
            <p className="text-xs text-sacred-blue-600 leading-relaxed">
              This reflection on your mindset helps track your spiritual journey from natural thinking patterns 
              toward the renewed mind of Christ. Be honest and gentle with yourself—growth is a process.
            </p>
          </div>
        </div>
      </div>

      {/* Validation Message */}
      {required && !selectedMindset && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm font-medium">
            Please select a mindset to continue with your sacred reflection.
          </p>
        </div>
      )}
    </div>
  );
}

// Export prop types for external use
export type { MindsetSelectorProps, MindsetTypeConfig };
