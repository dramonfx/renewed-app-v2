import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { ContentEngineItem } from '@/types/content-engine';

interface SacredCardProps {
  content: ContentEngineItem;
  isCompleted?: boolean;
  onMarkComplete?: () => void;
  className?: string;
}

export function SacredCard({ content, isCompleted, onMarkComplete, className }: SacredCardProps) {
  const kingdomColors = {
    light: 'bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200',
    darkness: 'bg-gradient-to-br from-gray-50 to-slate-100 border-gray-300'
  };

  const kingdomBadgeColors = {
    light: 'bg-blue-100 text-blue-800 border-blue-200',
    darkness: 'bg-gray-100 text-gray-800 border-gray-200'
  };

  return (
    <Card className={`${kingdomColors[content.kingdom]} transition-all duration-300 hover:shadow-lg ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Badge 
            variant="outline" 
            className={`${kingdomBadgeColors[content.kingdom]} font-medium`}
          >
            Principle {content.principle_number}
          </Badge>
          <Badge 
            variant="outline" 
            className={`${kingdomBadgeColors[content.kingdom]} capitalize`}
          >
            {content.kingdom === 'light' ? '✨ Light' : '⚡ Darkness'}
          </Badge>
        </div>
        <CardTitle className="text-lg font-bold text-gray-800 leading-tight">
          {content.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 leading-relaxed mb-4">
          {content.content}
        </p>
        
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">
            {content.section}
          </Badge>
          
          {onMarkComplete && (
            <button
              onClick={onMarkComplete}
              disabled={isCompleted}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isCompleted
                  ? 'bg-green-100 text-green-800 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
              }`}
            >
              {isCompleted ? '✓ Completed' : 'Mark Complete'}
            </button>
          )}
        </div>
        
        {isCompleted && (
          <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-sm font-medium">🎉 Principle Mastered!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}