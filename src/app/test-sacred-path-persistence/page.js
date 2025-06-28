
'use client';
import { useState, useEffect } from 'react';
import { onboardingStorage } from '@/lib/onboardingStorage';

export default function TestSacredPathPersistence() {
  const [testResults, setTestResults] = useState({});
  const [sacredPath, setSacredPath] = useState('');
  const [onboardingInfo, setOnboardingInfo] = useState(null);

  // Test Sacred Path persistence on page load
  useEffect(() => {
    const runTests = () => {
      // Check initial state
      const initialPath = onboardingStorage.getSacredPath();
      const initialCompleted = onboardingStorage.isOnboardingCompleted();
      const initialInfo = onboardingStorage.getSacredPathInfo();

      setTestResults({
        initialPath,
        initialCompleted,
        initialInfo
      });

      setSacredPath(initialPath || 'Not Set');
      setOnboardingInfo(initialInfo);
    };

    runTests();
  }, []);

  const testSavePath = (pathType) => {
    const testData = {
      selectedPath: pathType,
      intentions: ['Test Intention 1', 'Test Intention 2'],
      selectedMind: 'new'
    };

    const saved = onboardingStorage.saveSacredPath(testData);
    
    if (saved) {
      // Refresh data
      const newPath = onboardingStorage.getSacredPath();
      const newInfo = onboardingStorage.getSacredPathInfo();
      const completed = onboardingStorage.isOnboardingCompleted();

      setSacredPath(newPath);
      setOnboardingInfo(newInfo);
      
      setTestResults(prev => ({
        ...prev,
        lastSaved: pathType,
        saveSuccess: true,
        currentPath: newPath,
        completed
      }));
    } else {
      setTestResults(prev => ({
        ...prev,
        lastSaved: pathType,
        saveSuccess: false
      }));
    }
  };

  const clearData = () => {
    const cleared = onboardingStorage.clearOnboardingData();
    if (cleared) {
      setSacredPath('Not Set');
      setOnboardingInfo(null);
      setTestResults(prev => ({
        ...prev,
        cleared: true,
        currentPath: null,
        completed: false
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sacred-blue-50 to-sacred-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
          <h1 className="text-3xl font-serif text-sacred-blue-900 mb-4">
            Sacred Path Persistence Test
          </h1>
          <p className="text-sacred-blue-600">
            Testing the localStorage persistence functionality for Sacred Path onboarding data.
          </p>
        </div>

        {/* Current State */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <h2 className="text-2xl font-serif text-sacred-blue-900 mb-4">Current State</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-sacred-blue-800 mb-2">Sacred Path</h3>
              <p className="text-lg text-sacred-blue-600 bg-sacred-blue-50 p-3 rounded-lg">
                {sacredPath}
              </p>
            </div>
            <div>
              <h3 className="font-medium text-sacred-blue-800 mb-2">Onboarding Completed</h3>
              <p className="text-lg text-sacred-blue-600 bg-sacred-blue-50 p-3 rounded-lg">
                {testResults.completed ? 'Yes' : 'No'}
              </p>
            </div>
          </div>
          
          {onboardingInfo && (
            <div className="mt-6">
              <h3 className="font-medium text-sacred-blue-800 mb-3">Complete Onboarding Data</h3>
              <pre className="bg-sacred-blue-50 p-4 rounded-lg text-sm text-sacred-blue-700 overflow-auto">
                {JSON.stringify(onboardingInfo, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Test Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <h2 className="text-2xl font-serif text-sacred-blue-900 mb-4">Test Actions</h2>
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <button
              onClick={() => testSavePath('gentle')}
              className="bg-sacred-gold-gradient text-white px-4 py-3 rounded-lg hover:shadow-lg transition-all"
            >
              Save Gentle Path
            </button>
            <button
              onClick={() => testSavePath('balanced')}
              className="bg-sacred-gradient text-white px-4 py-3 rounded-lg hover:shadow-lg transition-all"
            >
              Save Balanced Path
            </button>
            <button
              onClick={() => testSavePath('intensive')}
              className="bg-sacred-purple-gradient text-white px-4 py-3 rounded-lg hover:shadow-lg transition-all"
            >
              Save Intensive Path
            </button>
            <button
              onClick={clearData}
              className="bg-gray-500 text-white px-4 py-3 rounded-lg hover:bg-gray-600 transition-all"
            >
              Clear All Data
            </button>
          </div>
        </div>

        {/* Test Results */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-serif text-sacred-blue-900 mb-4">Test Results</h2>
          <div className="space-y-4">
            {testResults.saveSuccess !== undefined && (
              <div className={`p-4 rounded-lg ${testResults.saveSuccess ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                <strong>Last Save Test:</strong> {testResults.saveSuccess ? 'SUCCESS' : 'FAILED'} 
                {testResults.lastSaved && ` - ${testResults.lastSaved} path`}
              </div>
            )}
            
            {testResults.cleared && (
              <div className="p-4 rounded-lg bg-blue-50 text-blue-700">
                <strong>Clear Test:</strong> Data successfully cleared
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Raw Test Data</h3>
              <pre className="text-sm text-gray-600 overflow-auto">
                {JSON.stringify(testResults, null, 2)}
              </pre>
            </div>
          </div>
        </div>

        {/* Back to Onboarding */}
        <div className="mt-8 text-center">
          <a
            href="/onboarding"
            className="inline-block bg-sacred-gradient text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
          >
            ← Back to Onboarding
          </a>
        </div>
      </div>
    </div>
  );
}
