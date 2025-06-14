
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, User, Mail, Heart, Target, Sparkles } from 'lucide-react'
import Link from 'next/link'

interface OnboardingStep {
  id: number
  title: string
  description: string
  icon: React.ReactNode
  component: React.ReactNode
}

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    goals: [] as string[],
    preferences: {
      notifications: true,
      newsletter: false,
      darkMode: false,
    }
  })

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const steps: OnboardingStep[] = [
    {
      id: 0,
      title: "Welcome to Your Sacred Journey",
      description: "Let's begin this peaceful path together",
      icon: <Sparkles className="w-8 h-8" />,
      component: <WelcomeStep />
    },
    {
      id: 1,
      title: "Tell Us About Yourself",
      description: "Share your basic information with us",
      icon: <User className="w-8 h-8" />,
      component: <PersonalInfoStep formData={formData} updateFormData={updateFormData} />
    },
    {
      id: 2,
      title: "Your Sacred Goals",
      description: "What would you like to achieve on this journey?",
      icon: <Target className="w-8 h-8" />,
      component: <GoalsStep formData={formData} updateFormData={updateFormData} />
    },
    {
      id: 3,
      title: "Preferences & Settings",
      description: "Customize your experience",
      icon: <Heart className="w-8 h-8" />,
      component: <PreferencesStep formData={formData} updateFormData={updateFormData} />
    },
    {
      id: 4,
      title: "Journey Complete",
      description: "You're all set to begin your sacred path",
      icon: <Check className="w-8 h-8" />,
      component: <CompletionStep formData={formData} />
    }
  ]

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
    switch (currentStep) {
      case 1:
        return formData.name.trim() !== '' && formData.email.trim() !== ''
      case 2:
        return formData.goals.length > 0
      default:
        return true
    }
  }

  return (
    <div className="min-h-screen bg-serene-water bg-cover bg-center bg-fixed dreamlike-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
          
          <div className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div 
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          className="w-full bg-muted rounded-full h-2 mb-12"
        >
          <motion.div 
            className="bg-sacred-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </motion.div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="sacred-card p-8 md:p-12"
            >
              {/* Step Header */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-16 h-16 bg-sacred-blue-100 dark:bg-sacred-blue-900 rounded-full flex items-center justify-center mx-auto mb-4 text-sacred-blue-600"
                >
                  {steps[currentStep].icon}
                </motion.div>
                
                <h1 className="text-3xl md:text-4xl font-sacred-serif font-bold text-foreground mb-3">
                  {steps[currentStep].title}
                </h1>
                
                <p className="text-lg text-muted-foreground">
                  {steps[currentStep].description}
                </p>
              </div>

              {/* Step Content */}
              <div className="mb-8">
                {steps[currentStep].component}
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2 px-6 py-3 text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </button>

                {currentStep < steps.length - 1 ? (
                  <button
                    onClick={nextStep}
                    disabled={!canProceed()}
                    className="sacred-button disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <Link href="/dashboard">
                    <button className="sacred-button flex items-center gap-2">
                      Enter Dashboard
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

// Step Components
function WelcomeStep() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-6"
    >
      <div className="space-y-4">
        <p className="text-lg text-muted-foreground leading-relaxed">
          Welcome to a sacred space designed for your personal growth and renewal. 
          This gentle onboarding process will help us understand your needs and 
          create a personalized experience just for you.
        </p>
        
        <div className="bg-sacred-blue-50 dark:bg-sacred-blue-950 p-6 rounded-lg">
          <p className="text-sacred-blue-700 dark:text-sacred-blue-300 font-medium">
            ✨ Take your time - there's no rush on this sacred journey
          </p>
        </div>
      </div>
    </motion.div>
  )
}

function PersonalInfoStep({ formData, updateFormData }: { formData: any, updateFormData: (field: string, value: any) => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Your Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => updateFormData('name', e.target.value)}
            placeholder="Enter your name"
            className="sacred-input w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData('email', e.target.value)}
            placeholder="Enter your email"
            className="sacred-input w-full"
          />
        </div>
      </div>

      <div className="bg-sacred-gold-50 dark:bg-sacred-gold-950 p-4 rounded-lg">
        <p className="text-sm text-sacred-gold-700 dark:text-sacred-gold-300">
          🔒 Your information is sacred to us and will never be shared without your permission.
        </p>
      </div>
    </motion.div>
  )
}

function GoalsStep({ formData, updateFormData }: { formData: any, updateFormData: (field: string, value: any) => void }) {
  const goalOptions = [
    { id: 'mindfulness', label: 'Practice Mindfulness', icon: '🧘' },
    { id: 'growth', label: 'Personal Growth', icon: '🌱' },
    { id: 'peace', label: 'Find Inner Peace', icon: '☮️' },
    { id: 'balance', label: 'Work-Life Balance', icon: '⚖️' },
    { id: 'creativity', label: 'Boost Creativity', icon: '🎨' },
    { id: 'health', label: 'Improve Wellness', icon: '💚' },
  ]

  const toggleGoal = (goalId: string) => {
    const currentGoals = formData.goals || []
    const newGoals = currentGoals.includes(goalId)
      ? currentGoals.filter((g: string) => g !== goalId)
      : [...currentGoals, goalId]
    updateFormData('goals', newGoals)
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <p className="text-muted-foreground text-center">
        Select the goals that resonate with your sacred journey (choose as many as you like):
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goalOptions.map((goal, index) => (
          <motion.button
            key={goal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => toggleGoal(goal.id)}
            className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
              formData.goals?.includes(goal.id)
                ? 'border-sacred-blue-500 bg-sacred-blue-50 dark:bg-sacred-blue-950'
                : 'border-border hover:border-sacred-blue-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{goal.icon}</span>
              <span className="font-medium">{goal.label}</span>
              {formData.goals?.includes(goal.id) && (
                <Check className="w-5 h-5 text-sacred-blue-500 ml-auto" />
              )}
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

function PreferencesStep({ formData, updateFormData }: { formData: any, updateFormData: (field: string, value: any) => void }) {
  const updatePreference = (key: string, value: boolean) => {
    updateFormData('preferences', {
      ...formData.preferences,
      [key]: value
    })
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <p className="text-muted-foreground text-center">
        Customize your experience to match your preferences:
      </p>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div>
            <h3 className="font-medium text-foreground">Gentle Notifications</h3>
            <p className="text-sm text-muted-foreground">Receive peaceful reminders and updates</p>
          </div>
          <button
            onClick={() => updatePreference('notifications', !formData.preferences.notifications)}
            className={`w-12 h-6 rounded-full transition-colors ${
              formData.preferences.notifications ? 'bg-sacred-blue-500' : 'bg-gray-300'
            }`}
          >
            <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
              formData.preferences.notifications ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div>
            <h3 className="font-medium text-foreground">Sacred Newsletter</h3>
            <p className="text-sm text-muted-foreground">Monthly inspiration and guidance</p>
          </div>
          <button
            onClick={() => updatePreference('newsletter', !formData.preferences.newsletter)}
            className={`w-12 h-6 rounded-full transition-colors ${
              formData.preferences.newsletter ? 'bg-sacred-blue-500' : 'bg-gray-300'
            }`}
          >
            <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
              formData.preferences.newsletter ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

function CompletionStep({ formData }: { formData: any }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-6"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: "spring" }}
        className="w-20 h-20 bg-sacred-blue-100 dark:bg-sacred-blue-900 rounded-full flex items-center justify-center mx-auto"
      >
        <Check className="w-10 h-10 text-sacred-blue-600" />
      </motion.div>

      <div className="space-y-4">
        <h2 className="text-2xl font-sacred-serif font-bold text-foreground">
          Welcome, {formData.name}! 🌟
        </h2>
        
        <p className="text-lg text-muted-foreground">
          Your sacred journey is now ready to begin. We've prepared a personalized 
          experience based on your goals and preferences.
        </p>

        <div className="bg-sacred-blue-50 dark:bg-sacred-blue-950 p-6 rounded-lg">
          <h3 className="font-medium text-sacred-blue-700 dark:text-sacred-blue-300 mb-2">
            Your Selected Goals:
          </h3>
          <div className="flex flex-wrap gap-2">
            {formData.goals?.map((goal: string) => (
              <span key={goal} className="px-3 py-1 bg-sacred-blue-200 dark:bg-sacred-blue-800 text-sacred-blue-700 dark:text-sacred-blue-300 rounded-full text-sm">
                {goal.charAt(0).toUpperCase() + goal.slice(1)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
