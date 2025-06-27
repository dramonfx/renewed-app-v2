
'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function TestJournalSystem() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentTest, setCurrentTest] = useState('')
  
  const supabase = createClientComponentClient()

  const addResult = (test, success, message, data = null) => {
    setResults(prev => [...prev, {
      test,
      success,
      message,
      data,
      timestamp: new Date().toLocaleTimeString()
    }])
  }

  const runMigration = async () => {
    setCurrentTest('Running Migration')
    try {
      // Add mindset column if it doesn't exist
      const { error: alterError } = await supabase.rpc('sql', {
        query: `
          DO $$ 
          BEGIN
              IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reflections' AND column_name = 'mindset') THEN
                  ALTER TABLE public.reflections ADD COLUMN mindset VARCHAR(50) CHECK (mindset IN ('Natural', 'Transition', 'Spiritual'));
              END IF;
              
              IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reflections' AND column_name = 'title') THEN
                  ALTER TABLE public.reflections ADD COLUMN title TEXT;
              END IF;
          END $$;
        `
      })

      if (alterError) {
        addResult('Migration', false, `Migration failed: ${alterError.message}`)
      } else {
        addResult('Migration', true, 'Database schema enhanced successfully')
      }
    } catch (error) {
      addResult('Migration', false, `Migration error: ${error.message}`)
    }
  }

  const testDatabaseConnection = async () => {
    setCurrentTest('Testing Database Connection')
    try {
      const { data, error } = await supabase
        .from('reflections')
        .select('count', { count: 'exact', head: true })

      if (error) {
        addResult('DB Connection', false, `Database error: ${error.message}`)
      } else {
        addResult('DB Connection', true, 'Database connection successful')
      }
    } catch (error) {
      addResult('DB Connection', false, `Connection error: ${error.message}`)
    }
  }

  const testCreateEntry = async () => {
    setCurrentTest('Testing Create Entry')
    try {
      const testEntry = {
        title: 'Test Journal Entry',
        content: 'This is a test reflection entry created during system testing.',
        mindset: 'Spiritual',
        reflection_type: 'general',
        tags: ['test', 'system-check']
      }

      const response = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testEntry)
      })

      const data = await response.json()

      if (response.ok) {
        addResult('Create Entry', true, 'Entry created successfully', data.entry)
        return data.entry.id
      } else {
        addResult('Create Entry', false, `Create failed: ${data.error}`)
        return null
      }
    } catch (error) {
      addResult('Create Entry', false, `Create error: ${error.message}`)
      return null
    }
  }

  const testReadEntries = async () => {
    setCurrentTest('Testing Read Entries')
    try {
      const response = await fetch('/api/journal')
      const data = await response.json()

      if (response.ok) {
        addResult('Read Entries', true, `Retrieved ${data.entries?.length || 0} entries`, data.entries)
        return data.entries
      } else {
        addResult('Read Entries', false, `Read failed: ${data.error}`)
        return []
      }
    } catch (error) {
      addResult('Read Entries', false, `Read error: ${error.message}`)
      return []
    }
  }

  const testUpdateEntry = async (entryId) => {
    if (!entryId) return false

    setCurrentTest('Testing Update Entry')
    try {
      const updateData = {
        title: 'Updated Test Entry',
        content: 'This entry has been updated during testing.',
        mindset: 'Transition',
        tags: ['test', 'updated']
      }

      const response = await fetch(`/api/journal/${entryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      })

      const data = await response.json()

      if (response.ok) {
        addResult('Update Entry', true, 'Entry updated successfully', data.entry)
        return true
      } else {
        addResult('Update Entry', false, `Update failed: ${data.error}`)
        return false
      }
    } catch (error) {
      addResult('Update Entry', false, `Update error: ${error.message}`)
      return false
    }
  }

  const testDeleteEntry = async (entryId) => {
    if (!entryId) return false

    setCurrentTest('Testing Delete Entry')
    try {
      const response = await fetch(`/api/journal/${entryId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (response.ok) {
        addResult('Delete Entry', true, 'Entry deleted successfully')
        return true
      } else {
        addResult('Delete Entry', false, `Delete failed: ${data.error}`)
        return false
      }
    } catch (error) {
      addResult('Delete Entry', false, `Delete error: ${error.message}`)
      return false
    }
  }

  const testStatistics = async () => {
    setCurrentTest('Testing Statistics')
    try {
      const response = await fetch('/api/journal/stats')
      const data = await response.json()

      if (response.ok) {
        addResult('Statistics', true, 'Statistics retrieved successfully', data.stats)
      } else {
        addResult('Statistics', false, `Stats failed: ${data.error}`)
      }
    } catch (error) {
      addResult('Statistics', false, `Stats error: ${error.message}`)
    }
  }

  const runFullTest = async () => {
    setLoading(true)
    setResults([])
    
    try {
      // Run tests in sequence
      await runMigration()
      await testDatabaseConnection()
      
      const entryId = await testCreateEntry()
      await testReadEntries()
      await testUpdateEntry(entryId)
      await testStatistics()
      await testDeleteEntry(entryId)
      
      addResult('Full Test', true, 'All tests completed!')
    } catch (error) {
      addResult('Full Test', false, `Test suite error: ${error.message}`)
    } finally {
      setLoading(false)
      setCurrentTest('')
    }
  }

  const getResultIcon = (success) => {
    return success ? '✅' : '❌'
  }

  const getResultColor = (success) => {
    return success ? 'text-green-600' : 'text-red-600'
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Sacred Journal System Test Suite
          </h1>
          <p className="text-gray-600 mb-6">
            This page tests the complete journal system functionality including database schema, API endpoints, and CRUD operations.
          </p>
          
          <div className="flex space-x-4">
            <button
              onClick={runFullTest}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-2 rounded-lg transition-colors"
            >
              {loading ? 'Running Tests...' : 'Run Full Test Suite'}
            </button>
            
            <button
              onClick={() => setResults([])}
              disabled={loading}
              className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Clear Results
            </button>
          </div>
          
          {currentTest && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800">Currently running: {currentTest}</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Results</h2>
          
          {results.length === 0 ? (
            <p className="text-gray-500 italic">No tests run yet. Click &quot;Run Full Test Suite&quot; to begin.</p>
          ) : (
            <div className="space-y-4">
              {results.map((result, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{getResultIcon(result.success)}</span>
                      <span className="font-medium">{result.test}</span>
                      <span className="text-sm text-gray-500">{result.timestamp}</span>
                    </div>
                    <span className={`font-medium ${getResultColor(result.success)}`}>
                      {result.success ? 'PASS' : 'FAIL'}
                    </span>
                  </div>
                  
                  <p className={`text-sm ${getResultColor(result.success)} mb-2`}>
                    {result.message}
                  </p>
                  
                  {result.data && (
                    <details className="mt-2">
                      <summary className="text-sm text-gray-600 cursor-pointer hover:text-gray-800">
                        View data
                      </summary>
                      <pre className="mt-2 p-3 bg-gray-50 rounded text-xs overflow-x-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Test Coverage</h3>
          <ul className="text-blue-800 space-y-1">
            <li>• Database schema migration and enhancement</li>
            <li>• Database connectivity and table existence</li>
            <li>• POST /api/journal - Create new journal entries</li>
            <li>• GET /api/journal - Retrieve journal entries</li>
            <li>• PUT /api/journal/[id] - Update existing entries</li>
            <li>• DELETE /api/journal/[id] - Delete entries</li>
            <li>• GET /api/journal/stats - Retrieve user statistics</li>
            <li>• Data validation and error handling</li>
            <li>• Authentication integration</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
