
// src/components/journal/JournalHeader.jsx
// Sacred Journal Header - Welcoming gateway to reflection sanctuary

'use client';

import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, Heart, Sparkles } from 'lucide-react';

export default function JournalHeader() {
  const { user } = useAuth();

  // Extract first name from email if available
  const getFirstName = () => {
    if (!user?.email) return 'Fellow Traveler';
    const emailName = user.email.split('@')[0];
    return emailName.charAt(0).toUpperCase() + emailName.slice(1);
  };

  const firstName = getFirstName();

  return (
    <div className="text-center mb-12">
      {/* Sacred Icon */}
      <div className="sacred-icon-bg w-20 h-20 mx-auto mb-6">
        <BookOpen className="w-10 h-10" />
      </div>

      {/* Sacred Welcome Message */}
      <h1 className="font-sacred-serif text-4xl lg:text-5xl font-bold text-sacred-blue-800 mb-4">
        Sacred Journaling Workshop
      </h1>
      
      <p className="text-lg text-sacred-blue-600 mb-6 max-w-2xl mx-auto">
        Welcome, {firstName}. This is your sacred space for reflection, growth, and spiritual transformation.
        Let your thoughts flow freely as you journey from the Natural Mind to the Spiritual Mind.
      </p>

      {/* Sacred Inspiration */}
      <div className="sacred-glass p-6 max-w-3xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-3">
          <Heart className="w-5 h-5 text-sacred-gold-500" />
          <Sparkles className="w-5 h-5 text-sacred-gold-500" />
          <Heart className="w-5 h-5 text-sacred-gold-500" />
        </div>
        <p className="text-sacred-blue-700 italic font-medium">
          "Write your thoughts, capture your insights, and watch as the light of understanding 
          illuminates the path from fear to love, from anxiety to peace."
        </p>
      </div>
    </div>
  );
}
