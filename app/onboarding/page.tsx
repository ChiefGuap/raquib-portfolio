'use client'

import { createClient } from '@/utils/supabase/client'
import { motion } from 'framer-motion'
import { User, GraduationCap, Phone, Instagram, Target, Loader2, ArrowRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type GradeLevel = 'middle_school' | 'high_school' | 'college' | 'other' | ''

export default function OnboardingPage() {
  const supabase = createClient()
  const router = useRouter()

  const [userId, setUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [fullName, setFullName] = useState('')
  const [gradeLevel, setGradeLevel] = useState<GradeLevel>('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [instagramHandle, setInstagramHandle] = useState('')
  const [goals, setGoals] = useState('')

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error || !user) {
        router.push('/login')
        return
      }

      setUserId(user.id)
      
      // Pre-fill name if available from OAuth
      if (user.user_metadata?.full_name) {
        setFullName(user.user_metadata.full_name)
      }

      setIsCheckingAuth(false)
    }

    checkAuth()
  }, [supabase, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (!fullName.trim()) {
      setError('Please enter your full name')
      return
    }
    if (!gradeLevel) {
      setError('Please select your grade level')
      return
    }
    if (!phoneNumber.trim()) {
      setError('Please enter your phone number')
      return
    }
    if (!goals.trim()) {
      setError('Please tell us about your tutoring goals')
      return
    }

    if (!userId) {
      setError('Authentication error. Please try logging in again.')
      return
    }

    setIsLoading(true)

    const { error: insertError } = await supabase.from('profiles').upsert({
      id: userId,
      full_name: fullName.trim(),
      grade_level: gradeLevel,
      phone_number: phoneNumber.trim(),
      instagram_handle: instagramHandle.trim() || null,
      goals: goals.trim(),
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    })

    setIsLoading(false)

    if (insertError) {
      console.error('Onboarding error:', insertError)
      setError('Failed to save your profile. Please try again.')
      return
    }

    // Success - redirect to dashboard
    router.push('/dashboard')
  }

  // Show loading while checking auth
  if (isCheckingAuth) {
    return (
      <main className="min-h-screen bg-zinc-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-zinc-100">
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to right, black 1px, transparent 1px),
                             linear-gradient(to bottom, black 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative max-w-2xl mx-auto px-6 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 rounded-2xl bg-black flex items-center justify-center mx-auto mb-6">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1
            className="text-4xl lg:text-5xl font-bold text-black mb-4"
            style={{ fontFamily: "var(--font-oswald)" }}
          >
            Welcome Aboard!
          </h1>
          <p
            className="text-zinc-600 text-lg max-w-md mx-auto"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Let&apos;s get to know you better so I can personalize your learning experience.
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl border border-zinc-200 shadow-xl shadow-black/5 p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 border border-red-200 rounded-xl"
              >
                <p className="text-red-600 text-sm" style={{ fontFamily: "var(--font-mono)" }}>
                  {error}
                </p>
              </motion.div>
            )}

            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-zinc-700 mb-2"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-12 pr-4 py-4 bg-zinc-100 border border-zinc-200 rounded-xl text-black placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  style={{ fontFamily: "var(--font-mono)" }}
                />
              </div>
            </div>

            {/* Grade Level */}
            <div>
              <label
                htmlFor="gradeLevel"
                className="block text-sm font-medium text-zinc-700 mb-2"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Current Grade Level *
              </label>
              <div className="relative">
                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <select
                  id="gradeLevel"
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value as GradeLevel)}
                  className="w-full pl-12 pr-4 py-4 bg-zinc-100 border border-zinc-200 rounded-xl text-black appearance-none focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all cursor-pointer"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  <option value="">Select your grade level...</option>
                  <option value="middle_school">Middle School</option>
                  <option value="high_school">High School</option>
                  <option value="college">College</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-zinc-700 mb-2"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="(555) 123-4567"
                  className="w-full pl-12 pr-4 py-4 bg-zinc-100 border border-zinc-200 rounded-xl text-black placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  style={{ fontFamily: "var(--font-mono)" }}
                />
              </div>
            </div>

            {/* Instagram Handle */}
            <div>
              <label
                htmlFor="instagram"
                className="block text-sm font-medium text-zinc-700 mb-2"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Instagram Handle{' '}
                <span className="text-zinc-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <input
                  id="instagram"
                  type="text"
                  value={instagramHandle}
                  onChange={(e) => setInstagramHandle(e.target.value)}
                  placeholder="@username"
                  className="w-full pl-12 pr-4 py-4 bg-zinc-100 border border-zinc-200 rounded-xl text-black placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  style={{ fontFamily: "var(--font-mono)" }}
                />
              </div>
            </div>

            {/* Goals */}
            <div>
              <label
                htmlFor="goals"
                className="block text-sm font-medium text-zinc-700 mb-2"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                <span className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  What do you aim to get out of tutoring? *
                </span>
              </label>
              <textarea
                id="goals"
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                placeholder="E.g., I want to improve my calculus grade from a B to an A, prepare for the AP Physics exam, or build a stronger foundation in programming..."
                rows={4}
                className="w-full px-4 py-4 bg-zinc-100 border border-zinc-200 rounded-xl text-black placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all resize-none"
                style={{ fontFamily: "var(--font-mono)" }}
              />
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.01 }}
              whileTap={{ scale: isLoading ? 1 : 0.99 }}
              className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-black text-white font-semibold rounded-xl hover:bg-zinc-800 transition-colors shadow-lg shadow-black/10 disabled:opacity-70 disabled:cursor-not-allowed"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  Continue to Dashboard
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Footer Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-sm text-zinc-500 mt-8"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Your information is kept private and secure.
        </motion.p>
      </div>

      {/* Bottom Spacing for Dock */}
      <div className="h-32" />
    </main>
  )
}


