import { useState, useEffect } from 'react';
import { ContentEngineItem, UserProgress } from '@/types/content-engine';

export function useContentEngine() {
  const [content, setContent] = useState<ContentEngineItem[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all content
  const fetchContent = async (section?: string, principle?: number) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (section) params.append('section', section);
      if (principle) params.append('principle', principle.toString());
      
      const response = await fetch(`/api/content-engine/content?${params}`);
      if (!response.ok) throw new Error('Failed to fetch content');
      
      const data = await response.json();
      setContent(data.content);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch user progress
  const fetchUserProgress = async (userId: string) => {
    try {
      const response = await fetch(`/api/content-engine/progress?userId=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch progress');
      
      const data = await response.json();
      setUserProgress(data.progress);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  // Mark principle as completed
  const markCompleted = async (userId: string, principleNumber: number, notes?: string) => {
    try {
      const response = await fetch('/api/content-engine/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          principleNumber,
          completed: true,
          notes,
        }),
      });
      
      if (!response.ok) throw new Error('Failed to update progress');
      
      // Refresh progress
      await fetchUserProgress(userId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  // Get content by section
  const getContentBySection = (section: string) => {
    return content.filter(item => item.section === section);
  };

  // Get content by kingdom
  const getContentByKingdom = (kingdom: 'light' | 'darkness') => {
    return content.filter(item => item.kingdom === kingdom);
  };

  // Get progress percentage
  const getProgressPercentage = () => {
    if (content.length === 0) return 0;
    const completed = userProgress.filter(p => p.completed).length;
    return Math.round((completed / content.length) * 100);
  };

  // Check if principle is completed
  const isPrincipleCompleted = (principleNumber: number) => {
    return userProgress.some(p => p.principle_number === principleNumber && p.completed);
  };

  useEffect(() => {
    fetchContent();
  }, []);

  return {
    content,
    userProgress,
    loading,
    error,
    fetchContent,
    fetchUserProgress,
    markCompleted,
    getContentBySection,
    getContentByKingdom,
    getProgressPercentage,
    isPrincipleCompleted,
  };
}