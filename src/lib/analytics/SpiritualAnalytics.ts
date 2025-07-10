
'use client';

interface SpiritualEvent {
  event: string;
  category: 'engagement' | 'milestone' | 'journey' | 'feature';
  properties?: Record<string, any>;
  timestamp: Date;
  userId?: string;
}

interface EngagementMetrics {
  sessionDuration: number;
  pagesVisited: string[];
  actionsPerformed: string[];
  deepEngagementScore: number;
  spiritualReadinessScore: number;
}

interface CommunityReadinessMetrics {
  totalEngagementScore: number;
  consistencyRating: number;
  spiritualMaturity: 'seed' | 'growth' | 'maturity' | 'mastery';
  communityReadiness: boolean;
  socialInteractionPotential: number;
  guidanceCapability: number;
}

class SpiritualAnalytics {
  private events: SpiritualEvent[] = [];
  private sessionStartTime: Date = new Date();
  private currentSession: EngagementMetrics = {
    sessionDuration: 0,
    pagesVisited: [],
    actionsPerformed: [],
    deepEngagementScore: 0,
    spiritualReadinessScore: 0
  };

  // Track spiritual events
  track(event: string, category: SpiritualEvent['category'], properties?: Record<string, any>) {
    const spiritualEvent: SpiritualEvent = {
      event,
      category,
      properties,
      timestamp: new Date(),
      userId: this.getUserId()
    };

    this.events.push(spiritualEvent);
    this.updateCurrentSession(spiritualEvent);
    this.saveToLocalStorage();

    // Trigger Phase 2 readiness check if significant milestone
    if (category === 'milestone') {
      this.checkPhase2Readiness();
    }
  }

  // Track page visits for journey mapping
  trackPageVisit(pageName: string) {
    if (!this.currentSession.pagesVisited.includes(pageName)) {
      this.currentSession.pagesVisited.push(pageName);
    }
    
    this.track('page_visit', 'engagement', { 
      page: pageName,
      sessionPages: this.currentSession.pagesVisited.length 
    });
  }

  // Track spiritual actions
  trackSpiritualAction(action: string, context?: Record<string, any>) {
    this.currentSession.actionsPerformed.push(action);
    
    this.track('spiritual_action', 'engagement', {
      action,
      context,
      sessionActions: this.currentSession.actionsPerformed.length
    });
  }

  // Track milestone achievements
  trackMilestone(milestoneId: string, stage: string, details?: Record<string, any>) {
    this.track('milestone_achieved', 'milestone', {
      milestoneId,
      stage,
      details,
      timeToAchieve: this.calculateTimeToMilestone(milestoneId)
    });
  }

  // Track feature unlocks
  trackFeatureUnlock(featureKey: string, stage: string) {
    this.track('feature_unlocked', 'feature', {
      featureKey,
      stage,
      sessionTime: this.getSessionDuration()
    });
  }

  // Calculate deep engagement score
  calculateDeepEngagementScore(): number {
    const sessionTime = this.getSessionDuration();
    const pageDepth = this.currentSession.pagesVisited.length;
    const actionCount = this.currentSession.actionsPerformed.length;
    
    // Scoring algorithm (0-100)
    const timeScore = Math.min(sessionTime / 600, 1) * 30; // 10 min max = 30 points
    const depthScore = Math.min(pageDepth / 5, 1) * 25; // 5 pages max = 25 points
    const actionScore = Math.min(actionCount / 10, 1) * 45; // 10 actions max = 45 points
    
    return Math.round(timeScore + depthScore + actionScore);
  }

  // Calculate spiritual readiness for community features
  calculateSpiritualReadiness(): number {
    const journalEntries = this.getJournalMetrics().totalEntries;
    const audioTime = this.getAudioMetrics().totalTime;
    const milestoneCount = this.getMilestoneCount();
    const consistencyScore = this.getConsistencyScore();
    
    // Spiritual readiness scoring (0-100)
    const journalScore = Math.min(journalEntries / 10, 1) * 25; // 10 entries = 25 points
    const audioScore = Math.min(audioTime / 120, 1) * 25; // 2 hours = 25 points
    const milestoneScore = Math.min(milestoneCount / 5, 1) * 30; // 5 milestones = 30 points
    const consistencyScoreWeight = consistencyScore * 0.20; // 20 points max
    
    return Math.round(journalScore + audioScore + milestoneScore + consistencyScoreWeight);
  }

  // Assess Phase 2 (Community) readiness
  checkPhase2Readiness(): CommunityReadinessMetrics {
    const engagementScore = this.calculateDeepEngagementScore();
    const spiritualReadiness = this.calculateSpiritualReadiness();
    const consistency = this.getConsistencyScore();
    
    // Determine spiritual maturity stage
    const stage = this.determineSpiritualStage();
    
    // Community readiness criteria
    const communityReady = 
      spiritualReadiness >= 60 && 
      consistency >= 70 && 
      engagementScore >= 50 &&
      stage !== 'seed';
    
    const metrics: CommunityReadinessMetrics = {
      totalEngagementScore: engagementScore,
      consistencyRating: consistency,
      spiritualMaturity: stage,
      communityReadiness: communityReady,
      socialInteractionPotential: this.calculateSocialInteractionPotential(),
      guidanceCapability: this.calculateGuidanceCapability()
    };

    // Store Phase 2 readiness metrics (only on client side)
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem('renewedPhase2Readiness', JSON.stringify(metrics));
    }
    
    if (communityReady) {
      this.track('phase2_ready', 'milestone', { metrics });
    }

    return metrics;
  }

  // Calculate social interaction potential
  private calculateSocialInteractionPotential(): number {
    const journalQuality = this.getJournalQualityScore();
    const reflectionDepth = this.getReflectionDepthScore();
    const empathyIndicators = this.getEmpathyIndicators();
    
    return Math.round((journalQuality + reflectionDepth + empathyIndicators) / 3);
  }

  // Calculate guidance capability for helping others
  private calculateGuidanceCapability(): number {
    const experienceLevel = this.getExperienceLevel();
    const wisdomIndicators = this.getWisdomIndicators();
    const helpfulnessScore = this.getHelpfulnessScore();
    
    return Math.round((experienceLevel + wisdomIndicators + helpfulnessScore) / 3);
  }

  // Get comprehensive analytics report
  getAnalyticsReport(): any {
    return {
      session: {
        ...this.currentSession,
        duration: this.getSessionDuration(),
        deepEngagementScore: this.calculateDeepEngagementScore()
      },
      spiritual: {
        readinessScore: this.calculateSpiritualReadiness(),
        currentStage: this.determineSpiritualStage(),
        milestonesAchieved: this.getMilestoneCount()
      },
      phase2: this.checkPhase2Readiness(),
      events: this.events.slice(-20) // Last 20 events
    };
  }

  // Helper methods
  private updateCurrentSession(event: SpiritualEvent) {
    this.currentSession.sessionDuration = this.getSessionDuration();
    this.currentSession.deepEngagementScore = this.calculateDeepEngagementScore();
    this.currentSession.spiritualReadinessScore = this.calculateSpiritualReadiness();
  }

  private getSessionDuration(): number {
    return Math.floor((new Date().getTime() - this.sessionStartTime.getTime()) / 1000);
  }

  private getUserId(): string {
    // Only access localStorage on the client side
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return 'anonymous';
    }
    return localStorage.getItem('renewedUserId') || 'anonymous';
  }

  private saveToLocalStorage() {
    // Only access localStorage on the client side
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return;
    }
    
    try {
      localStorage.setItem('renewedAnalytics', JSON.stringify({
        events: this.events.slice(-100), // Keep last 100 events
        session: this.currentSession
      }));
    } catch (error) {
      console.error('Error saving analytics:', error);
    }
  }

  private loadFromLocalStorage() {
    // Only access localStorage on the client side
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return;
    }
    
    try {
      const data = localStorage.getItem('renewedAnalytics');
      if (data) {
        const parsed = JSON.parse(data);
        this.events = parsed.events || [];
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  }

  private getJournalMetrics() {
    // Only access localStorage on the client side
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return { totalEntries: 0, totalWords: 0, averageLength: 0 };
    }
    
    try {
      const entries = JSON.parse(localStorage.getItem('sacred_journal_entries') || '[]');
      return {
        totalEntries: entries.length,
        totalWords: entries.reduce((sum: number, entry: any) => sum + (entry.word_count || 0), 0),
        averageLength: entries.length > 0 ? entries.reduce((sum: number, entry: any) => sum + (entry.word_count || 0), 0) / entries.length : 0
      };
    } catch {
      return { totalEntries: 0, totalWords: 0, averageLength: 0 };
    }
  }

  private getAudioMetrics() {
    // Only access localStorage on the client side
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return { totalTime: 0 };
    }
    
    try {
      const metrics = JSON.parse(localStorage.getItem('renewedSpiritualMetrics') || '{}');
      return {
        totalTime: metrics.totalReadingTime || 0
      };
    } catch {
      return { totalTime: 0 };
    }
  }

  private getMilestoneCount(): number {
    // Only access localStorage on the client side
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return 0;
    }
    
    try {
      const journey = JSON.parse(localStorage.getItem('renewedSpiritualJourney') || '{}');
      return journey.milestones?.filter((m: any) => m.achieved)?.length || 0;
    } catch {
      return 0;
    }
  }

  private getConsistencyScore(): number {
    const journal = this.getJournalMetrics();
    const audioMetrics = this.getAudioMetrics();
    
    // Calculate based on regular usage patterns
    const journalConsistency = Math.min(journal.totalEntries / 7, 1) * 50; // 7 entries = 50%
    const audioConsistency = Math.min(audioMetrics.totalTime / 60, 1) * 50; // 1 hour = 50%
    
    return Math.round(journalConsistency + audioConsistency);
  }

  private determineSpiritualStage(): 'seed' | 'growth' | 'maturity' | 'mastery' {
    const readiness = this.calculateSpiritualReadiness();
    
    if (readiness < 25) return 'seed';
    if (readiness < 50) return 'growth';
    if (readiness < 75) return 'maturity';
    return 'mastery';
  }

  private calculateTimeToMilestone(milestoneId: string): number {
    // Calculate time from session start to milestone achievement
    return this.getSessionDuration();
  }

  private getJournalQualityScore(): number {
    const metrics = this.getJournalMetrics();
    return Math.min(metrics.averageLength / 100, 1) * 100; // 100 words average = 100 points
  }

  private getReflectionDepthScore(): number {
    // Could analyze reflection content for depth indicators
    return 50; // Placeholder
  }

  private getEmpathyIndicators(): number {
    // Could analyze writing for empathy markers
    return 50; // Placeholder
  }

  private getExperienceLevel(): number {
    const milestones = this.getMilestoneCount();
    return Math.min(milestones / 10, 1) * 100; // 10 milestones = 100 points
  }

  private getWisdomIndicators(): number {
    // Could analyze for wisdom-related content
    return 50; // Placeholder
  }

  private getHelpfulnessScore(): number {
    // Could track helpful interactions or sharing behaviors
    return 50; // Placeholder
  }

  // Initialize analytics
  constructor() {
    this.loadFromLocalStorage();
  }
}

// Singleton instance
const spiritualAnalytics = new SpiritualAnalytics();

export { spiritualAnalytics, SpiritualAnalytics };
export type { SpiritualEvent, EngagementMetrics, CommunityReadinessMetrics };
