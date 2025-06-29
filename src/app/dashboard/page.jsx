'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { SacredCard } from '@/components/ui/sacred-card'
import { SacredButton } from '@/components/ui/sacred-button'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function DashboardPage() {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isLoading && !user) {
      router.push('/')
    }
  }, [user, isLoading, router, mounted])

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Sacred Dashboard</h1>
            <p className="text-purple-200">Welcome back, {user?.email}</p>
          </div>
          <SacredButton onClick={handleLogout} variant="outline">
            Leave Path
          </SacredButton>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <SacredCard className="cursor-pointer hover:scale-105 transition-transform" onClick={() => router.push('/book')}>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">📖</div>
              <h3 className="text-xl font-semibold text-white mb-2">Sacred Book</h3>
              <p className="text-purple-200">Explore the wisdom within</p>
            </div>
          </SacredCard>

          <SacredCard className="cursor-pointer hover:scale-105 transition-transform" onClick={() => router.push('/journal')}>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-white mb-2">Sacred Journal</h3>
              <p className="text-purple-200">Record your journey</p>
            </div>
          </SacredCard>

          <SacredCard className="cursor-pointer hover:scale-105 transition-transform" onClick={() => router.push('/full-audio-player')}>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🎵</div>
              <h3 className="text-xl font-semibold text-white mb-2">Sacred Sounds</h3>
              <p className="text-purple-200">Listen to the path</p>
            </div>
          </SacredCard>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SacredCard>
            <div className="p-6 text-center">
              <h4 className="text-lg font-semibold text-white mb-2">Days on Path</h4>
              <p className="text-3xl font-bold text-purple-300">42</p>
            </div>
          </SacredCard>

          <SacredCard>
            <div className="p-6 text-center">
              <h4 className="text-lg font-semibold text-white mb-2">Chapters Read</h4>
              <p className="text-3xl font-bold text-purple-300">7</p>
            </div>
          </SacredCard>

          <SacredCard>
            <div className="p-6 text-center">
              <h4 className="text-lg font-semibold text-white mb-2">Journal Entries</h4>
              <p className="text-3xl font-bold text-purple-300">15</p>
            </div>
          </SacredCard>
        </div>
      </div>
    </div>
  )
}
