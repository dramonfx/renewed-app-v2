
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if onboarding is completed
    const isCompleted = localStorage.getItem('renewedOnboardingCompleted');
    if (!isCompleted) {
      router.push('/onboarding');
    }
  }, [router]);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-serif text-sacred-blue-900 mb-4">
            Welcome to Your Dashboard
          </h1>
          <p className="text-sacred-blue-600 text-lg">
            Your spiritual journey continues here. Track your progress and explore the guidebook.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Quick Access Cards */}
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="text-xl font-serif text-sacred-blue-900 mb-3">
              Continue Reading
            </h3>
            <p className="text-sacred-blue-600 mb-4">
              Pick up where you left off in your spiritual journey.
            </p>
            <a 
              href="/book" 
              className="inline-block bg-sacred-blue-600 text-white px-4 py-2 rounded-lg hover:bg-sacred-blue-700 transition-colors"
            >
              Open Guidebook
            </a>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="text-xl font-serif text-sacred-blue-900 mb-3">
              Audio Experience
            </h3>
            <p className="text-sacred-blue-600 mb-4">
              Listen to the full audiobook experience.
            </p>
            <a 
              href="/full-audio-player" 
              className="inline-block bg-sacred-blue-600 text-white px-4 py-2 rounded-lg hover:bg-sacred-blue-700 transition-colors"
            >
              Start Listening
            </a>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="text-xl font-serif text-sacred-blue-900 mb-3">
              Your Progress
            </h3>
            <p className="text-sacred-blue-600 mb-4">
              Track your journey through the principles.
            </p>
            <div className="bg-sacred-blue-100 rounded-lg p-3">
              <div className="text-sm text-sacred-blue-700">
                Journey in progress...
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
