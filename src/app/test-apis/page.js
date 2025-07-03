'use client';

import { useEffect, useState } from 'react';

export default function TestAPIs() {
  const [audioResult, setAudioResult] = useState('Loading...');
  const [chartResult, setChartResult] = useState('Loading...');

  useEffect(() => {
    // Test audio API
    fetch('/api/audio-tracks')
      .then((response) => response.json())
      .then((data) => {
        setAudioResult(`Success: ${data.success}, Tracks: ${data.tracks?.length || 0}`);
      })
      .catch((error) => {
        console.error('❌ Audio API error:', error);
        setAudioResult(`Error: ${error.message}`);
      });

    // Test chart API
    fetch('/api/chart-visual')
      .then((response) => response.json())
      .then((data) => {
        setChartResult(`Success: ${data.success}, Chart: ${data.chart ? 'Found' : 'Missing'}`);
      })
      .catch((error) => {
        console.error('❌ Chart API error:', error);
        setChartResult(`Error: ${error.message}`);
      });
  }, []);

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">API Test Results</h1>

      <div className="space-y-4">
        <div className="rounded border p-4">
          <h2 className="font-bold">Audio Tracks API:</h2>
          <p>{audioResult}</p>
        </div>

        <div className="rounded border p-4">
          <h2 className="font-bold">Chart Visual API:</h2>
          <p>{chartResult}</p>
        </div>
      </div>
    </div>
  );
}
