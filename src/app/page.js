'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { SacredButton } from '@/components/ui/sacred-button'
import { SacredCard } from '@/components/ui/sacred-card'
import { SacredInput } from '@/components/ui/sacred-input'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function HomePage() {
  const { user, login, isLoading } = useAuth()
  const router = useRouter()
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (user && !isLoading) {
      router.push('/dashboard')
    }
  }, [user, isLoading, router])

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      await login(credentials.email, credentials.password)
      // Navigation will happen via useEffect
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <SacredCard className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Sacred Path</h1>
          <p className="text-purple-200">Begin your journey of renewal</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <SacredInput
              type="email"
              placeholder="Email"
              value={credentials.email}
              onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>
          
          <div>
            <SacredInput
              type="password"
              placeholder="Password"
              value={credentials.password}
              onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
              required
            />
          </div>
          
          <SacredButton 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Entering...' : 'Enter Sacred Path'}
          </SacredButton>
        </form>
        
        <div className="mt-6 text-center">
          <a href="/forgot-password" className="text-purple-300 hover:text-purple-100 text-sm">
            Forgotten your path?
          </a>
        </div>
      </SacredCard>
    </div>
  )
}
