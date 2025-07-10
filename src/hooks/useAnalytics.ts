
'use client';

import { useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { spiritualAnalytics } from '@/lib/analytics/SpiritualAnalytics';
import type { CommunityReadinessMetrics } from '@/lib/analytics/SpiritualAnalytics';

export const useAnalytics = () => {
  const pathname = usePathname();

  // Track page visits automatically
  useEffect(() => {
    if (pathname) {
      const pageName = pathname.split('/').pop() || 'home';
      spiritualAnalytics.trackPageVisit(pageName);
    }
  }, [pathname]);

  // Exposed analytics functions
  const trackAction = useCallback((action: string, context?: Record<string, any>) => {
    spiritualAnalytics.trackSpiritualAction(action, context);
  }, []);

  const trackMilestone = useCallback((milestoneId: string, stage: string, details?: Record<string, any>) => {
    spiritualAnalytics.trackMilestone(milestoneId, stage, details);
  }, []);

  const trackFeatureUnlock = useCallback((featureKey: string, stage: string) => {
    spiritualAnalytics.trackFeatureUnlock(featureKey, stage);
  }, []);

  const getPhase2Readiness = useCallback((): CommunityReadinessMetrics => {
    return spiritualAnalytics.checkPhase2Readiness();
  }, []);

  const getAnalyticsReport = useCallback(() => {
    return spiritualAnalytics.getAnalyticsReport();
  }, []);

  return {
    trackAction,
    trackMilestone,
    trackFeatureUnlock,
    getPhase2Readiness,
    getAnalyticsReport
  };
};

// Hook for Phase 2 readiness monitoring
export const usePhase2Readiness = () => {
  const { getPhase2Readiness } = useAnalytics();

  const checkReadiness = useCallback(() => {
    return getPhase2Readiness();
  }, [getPhase2Readiness]);

  const isReadyForCommunity = useCallback(() => {
    const readiness = getPhase2Readiness();
    return readiness.communityReadiness;
  }, [getPhase2Readiness]);

  const getReadinessScore = useCallback(() => {
    const readiness = getPhase2Readiness();
    return {
      engagement: readiness.totalEngagementScore,
      consistency: readiness.consistencyRating,
      social: readiness.socialInteractionPotential,
      guidance: readiness.guidanceCapability
    };
  }, [getPhase2Readiness]);

  return {
    checkReadiness,
    isReadyForCommunity,
    getReadinessScore
  };
};

export default useAnalytics;
