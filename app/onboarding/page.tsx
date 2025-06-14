'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, User, Mail, Heart, Target, Sparkles } from 'lucide-react'
import Link from 'next/link'

interface FormData {
  name: string
  email: string
  goals: string[]
  preferences: {
    notifications: boolean
    newsletter: boolean
  }
}

interface StepConfig {
  id: string
  title: string
  description: string
  icon: React.ReactNode
}

const initialFormData: FormData = {
  name: '',
  email: '',
  goals: [],
  preferences: {
    notifications: true,
    newsletter: false
  }
}

const steps: StepConfig[] = [
  {
    id: 'welcome',
    title: 'Welcome to Your Sacred Journey',
    description: "Let's begin this peaceful path together",
    icon: <Heart className="w-8 h-8 text-sacred-blue-500" />
  },
  {
    id: 'personal',
    title: 'Tell Us About Yourself',
    description: 'Help us personalize your experience',
    icon: <User className="w-8 h-8 text-sacred-blue-500" />
  },
  {
    id: 'goals',
    title: 'What Are Your Sacred Goals?',
    description: 'Choose what matters most to you',
    icon: <Target className="w-8 h-8 text-sacred-blue-500" />
  },
  {
    id: 'preferences',
    title: 'Customize Your Experience',
    description: 'Set your preferences for the journey ahead',
    icon: <Sparkles className="w-8 h-8 text-sacred-blue-500" />
  },
  {
    id: 'complete',
    title: 'Your Journey Begins Now',
    description: "You're all set to begin your sacred path",
    icon: <Check className="w-8 h-8 text-sacred-blue-500" />
  }
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>(initialFormData)

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    switch (steps[currentStep].id) {
      case 'personal':
        return formData.name.trim() !== '' && formData.email.trim() !== ''
      case 'goals':
        return formData.goals.length > 0
      default:
        return true
    }
  }

  const handleComplete = () => {
    // Here you would typically save the onboarding data
    console.log('Onboarding completed:', formData)
    // Redirect to main app or dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sacred-blue-50 via-white to-sacred-gold-50 dark:from-sacred-blue-950 dark:via-gray-900 dark:to-sacred-gold-950">
      <div className="container mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-sacred-blue-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
            >
              {/* Step Header */}
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  {steps[currentStep].icon}
                </div>
                <h1 className="text-3xl font-sacred-serif font-bold text-foreground mb-2">
                  {steps[currentStep].title}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {steps[currentStep].description}
                </p>
              </div>

              {/* Step Content */}
              {renderStepContent()}

              {/* Navigation */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-border">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </button>

                {currentStep === steps.length - 1 ? (
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 bg-sacred-blue-500 hover:bg-sacred-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Start Your Journey
                    <Sparkles className="w-4 h-4" />
                  </Link>
                ) : (
                  <button
                    onClick={nextStep}
                    disabled={!canProceed()}
                    className="flex items-center gap-2 bg-sacred-blue-500 hover:bg-sacred-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )

  function renderStepContent() {
    switch (steps[currentStep].id) {
      case 'welcome':
        return (
          <div className="text-center space-y-6">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-sacred-blue-100 to-sacred-gold-100 dark:from-sacred-blue-900 dark:to-sacred-gold-900 rounded-full flex items-center justify-center">
              <Heart className="w-16 h-16 text-sacred-blue-500" />
            </div>
            
            <div className="space-y-4">
              <p className="text-lg text-muted-foreground">
                Welcome to a space designed for your spiritual growth and inner peace. 
                We&apos;re here to guide you through a personalized journey of self-discovery and mindfulness.
              </p>
              
              <p className="text-muted-foreground">
                This brief setup will help us understand your goals and preferences to 
                create a personalized experience just for you.
              </p>
              
              <div className="bg-sacred-blue-50 dark:bg-sacred-blue-950 p-6 rounded-lg">
                <p className="text-sacred-blue-700 dark:text-sacred-blue-300 font-medium">
                  ✨ Take your time - there&apos;s no rush on this sacred journey
                </p>
              </div>
            </div>
          </div>
        )

      case 'personal':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                  What should we call you? *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  placeholder="Enter your preferred name"
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-sacred-blue-500 focus:border-transparent bg-background text-foreground"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-sacred-blue-500 focus:border-transparent bg-background text-foreground"
                />
              </div>
            </div>
          </div>
        )

      case 'goals':
        const goalOptions = [
          { id: 'mindfulness', label: 'Practice Mindfulness', icon: '🧘' },
          { id: 'growth', label: 'Personal Growth', icon: '🌱' },
          { id: 'peace', label: 'Find Inner Peace', icon: '☮️' },
          { id: 'balance', label: 'Work-Life Balance', icon: '⚖️' },
          { id: 'creativity', label: 'Boost Creativity', icon: '🎨' },
          { id: 'health', label: 'Improve Wellness', icon: '💚' },
        ]

        const toggleGoal = (goalId: string) => {
          const newGoals = formData.goals.includes(goalId)
            ? formData.goals.filter(g => g !== goalId)
            : [...formData.goals, goalId]
          updateFormData('goals', newGoals)
        }

        return (
          <div className="space-y-6">
            <p className="text-center text-muted-foreground">
              Select all that resonate with your current journey (choose at least one):
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {goalOptions.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => toggleGoal(goal.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    formData.goals.includes(goal.id)
                      ? 'border-sacred-blue-500 bg-sacred-blue-50 dark:bg-sacred-blue-950'
                      : 'border-border hover:border-sacred-blue-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{goal.icon}</span>
                    <span className="font-medium text-foreground">{goal.label}</span>
                    {formData.goals.includes(goal.id) && (
                      <Check className="w-5 h-5 text-sacred-blue-500 ml-auto" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )

      case 'preferences':
        const updatePreference = (key: keyof FormData['preferences'], value: boolean) => {
          updateFormData('preferences', {
            ...formData.preferences,
            [key]: value
          })
        }

        return (
          <div className="space-y-6">
            <p className="text-center text-muted-foreground">
              Customize how you&apos;d like to experience your journey:
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <h3 className="font-medium text-foreground">Daily Reminders</h3>
                  <p className="text-sm text-muted-foreground">Get gentle notifications for your practice</p>
                </div>
                <button
                  onClick={() => updatePreference('notifications', !formData.preferences.notifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.preferences.notifications ? 'bg-sacred-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.preferences.notifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <h3 className="font-medium text-foreground">Weekly Insights</h3>
                  <p className="text-sm text-muted-foreground">Receive weekly spiritual insights and tips</p>
                </div>
                <button
                  onClick={() => updatePreference('newsletter', !formData.preferences.newsletter)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.preferences.newsletter ? 'bg-sacred-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.preferences.newsletter ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        )

      case 'complete':
        return (
          <div className="text-center space-y-6">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-sacred-blue-100 to-sacred-gold-100 dark:from-sacred-blue-900 dark:to-sacred-gold-900 rounded-full flex items-center justify-center">
              <Check className="w-16 h-16 text-sacred-blue-500" />
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-sacred-serif font-bold text-foreground">
                Welcome, {formData.name}! 🌟
              </h2>
              
              <p className="text-lg text-muted-foreground">
                Your sacred journey is now ready to begin. We&apos;ve prepared a personalized 
                experience based on your goals and preferences.
              </p>

              <div className="bg-sacred-gold-50 dark:bg-sacred-gold-950 p-6 rounded-lg">
                <h3 className="font-medium text-sacred-gold-700 dark:text-sacred-gold-300 mb-2">
                  Your Selected Goals:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {formData.goals.map((goal) => (
                    <span
                      key={goal}
                      className="px-3 py-1 bg-sacred-gold-200 dark:bg-sacred-gold-800 text-sacred-gold-800 dark:text-sacred-gold-200 rounded-full text-sm"
                    >
                      {goal.charAt(0).toUpperCase() + goal.slice(1)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }
}
