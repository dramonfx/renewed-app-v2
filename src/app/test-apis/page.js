
'use client';

import { useEffect, useState } from 'react';

export default function TestAPIs() {
  const [audioResult, setAudioResult] = useState('Loading...');
  const [chartResult, setChartResult] = useState('Loading...');

  useEffect(() => {
    console.log('🔍 Testing APIs...');
    
    // Test audio API
    fetch('/api/audio-tracks')
      .then(response => response.json())
      .then(data => {
        console.log('📱 Audio API result:', data);
        setAudioResult(`Success: ${data.success}, Tracks: ${data.tracks?.length || 0}`);
      })
      .catch(error => {
        console.error('❌ Audio API error:', error);
        setAudioResult(`Error: ${error.message}`);
      });

    // Test chart API
    fetch('/api/chart-visual')
      .then(response => response.json())
      .then(data => {
        console.log('🖼️ Chart API result:', data);
        setChartResult(`Success: ${data.success}, Chart: ${data.chart ? 'Found' : 'Missing'}`);
      })
      .catch(error => {
        console.error('❌ Chart API error:', error);
        setChartResult(`Error: ${error.message}`);
      });
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">API Test Results</h1>
      
      <div className="space-y-4">
        <div className="p-4 border rounded">
          <h2 className="font-bold">Audio Tracks API:</h2>
          <p>{audioResult}</p>
        </div>
        
        <div className="p-4 border rounded">
          <h2 className="font-bold">Chart Visual API:</h2>
          <p>{chartResult}</p>
        </div>
      </div>
    </div>
  );
}
