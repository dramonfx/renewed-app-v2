// src/components/journal/JournalStats.jsx
// Sacred Journal Statistics - Gentle tracking of spiritual growth

&apos;use client&apos;;

import { useMemo } from &apos;react&apos;;
import { BookOpen, Calendar, TrendingUp, Sparkles } from &apos;lucide-react&apos;;

export default function JournalStats({ entries = [] }) {
  // Calculate sacred statistics
  const stats = useMemo(() => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const totalEntries = entries.length;
    const entriesThisWeek = entries.filter(
      (entry) => new Date(entry.created_at) >= oneWeekAgo
    ).length;
    const entriesThisMonth = entries.filter(
      (entry) => new Date(entry.created_at) >= oneMonthAgo
    ).length;

    const averageWordsPerEntry =
      entries.length > 0
        ? Math.round(
            entries.reduce((sum, entry) => sum + (entry.content?.split(&apos; &apos;).length || 0), 0) /
              entries.length
          )
        : 0;

    // Find most common reflection type
    const typeCount = entries.reduce((acc, entry) => {
      const type = entry.reflection_type || &apos;journal&apos;;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    const favoriteReflectionType = Object.keys(typeCount).reduce(
      (a, b) => (typeCount[a] > typeCount[b] ? a : b),
      &apos;journal&apos;
    );

    // Calculate writing streak (consecutive days with entries)
    const sortedDates = [
      ...new Set(entries.map((entry) => new Date(entry.created_at).toDateString())),
    ].sort((a, b) => new Date(b) - new Date(a));

    let currentStreak = 0;
    const today = new Date().toDateString();

    for (let i = 0; i < sortedDates.length; i++) {
      const expectedDate = new Date();
      expectedDate.setDate(expectedDate.getDate() - i);

      if (sortedDates[i] === expectedDate.toDateString()) {
        currentStreak++;
      } else {
        break;
      }
    }

    return {
      totalEntries,
      entriesThisWeek,
      entriesThisMonth,
      averageWordsPerEntry,
      favoriteReflectionType,
      currentStreak,
    };
  }, [entries]);

  // Sacred stat cards configuration
  const statCards = [
    {
      title: &apos;Total Reflections&apos;,
      value: stats.totalEntries,
      icon: BookOpen,
      color: &apos;sacred-blue&apos;,
      description: &apos;Sacred thoughts captured&apos;,
    },
    {
      title: &apos;This Week&apos;,
      value: stats.entriesThisWeek,
      icon: Calendar,
      color: &apos;sacred-gold&apos;,
      description: &apos;Recent reflections&apos;,
    },
    {
      title: &apos;Writing Streak&apos;,
      value: `${stats.currentStreak} days`,
      icon: TrendingUp,
      color: &apos;sacred-purple&apos;,
      description: &apos;Consistent practice&apos;,
    },
    {
      title: &apos;Avg. Words&apos;,
      value: stats.averageWordsPerEntry,
      icon: Sparkles,
      color: &apos;sacred-blue&apos;,
      description: &apos;Depth of reflection&apos;,
    },
  ];

  // Don&apos;t show stats if no entries
  if (stats.totalEntries === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="sacred-glass p-6 text-center transition-shadow duration-300 hover:shadow-lg"
          >
            <div
              className={`sacred-icon-bg-${stat.color === &apos;sacred-gold&apos; ? &apos;gold&apos; : &apos;&apos;} mx-auto mb-4 h-12 w-12`}
            >
              <stat.icon className="h-6 w-6" />
            </div>
            <div className="mb-1 text-2xl font-bold text-sacred-blue-800">{stat.value}</div>
            <div className="mb-1 text-sm font-semibold text-sacred-blue-700">{stat.title}</div>
            <div className="text-xs text-sacred-blue-500">{stat.description}</div>
          </div>
        ))}
      </div>

      {/* Sacred Growth Message */}
      {stats.totalEntries >= 5 && (
        <div className="sacred-glass mt-4 bg-gradient-to-r from-sacred-gold-50 to-sacred-blue-50 p-4">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-sacred-gold-500" />
            <p className="font-medium text-sacred-blue-700">
              Beautiful work! You&apos;ve written {stats.totalEntries} reflections on your spiritual
              journey. Keep nurturing this sacred practice.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
