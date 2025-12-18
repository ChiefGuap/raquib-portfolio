'use client'

import { createClient } from '@/utils/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, BookOpen, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
}

export default function BookingModal({ isOpen, onClose, userId }: BookingModalProps) {
  const supabase = createClient()
  const router = useRouter()

  const [topic, setTopic] = useState('')
  const [subject, setSubject] = useState('')
  const [dateTime, setDateTime] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (!topic.trim()) {
      setError('Please enter a topic')
      return
    }
    if (!subject.trim()) {
      setError('Please select a subject')
      return
    }
    if (!dateTime) {
      setError('Please select a date and time')
      return
    }

    const startTime = new Date(dateTime)

    // Check if date is in the future
    if (startTime <= new Date()) {
      setError('Please select a future date and time')
      return
    }

    setIsLoading(true)

    const { error: insertError } = await supabase.from('bookings').insert({
      student_id: userId,
      topic: topic.trim(),
      start_time: startTime.toISOString(),
      status: 'upcoming',
    })

    setIsLoading(false)

    if (insertError) {
      console.error('Booking error:', insertError)
      setError('Failed to book session. Please try again.')
      return
    }

    // Success - close modal and refresh
    handleClose()
    router.refresh()
  }

  const handleClose = () => {
    setTopic('')
    setSubject('')
    setDateTime('')
    setError(null)
    onClose()
  }

  // Get minimum datetime (now + 1 hour)
  const getMinDateTime = () => {
    const now = new Date()
    now.setHours(now.getHours() + 1)
    return now.toISOString().slice(0, 16)
  }

  const subjects = [
    'Calculus',
    'Physics',
    'Linear Algebra',
    'Chemistry',
    'Computer Science',
    'Statistics',
    'Pre-Calculus',
    'Algebra',
    'AP Exam Prep',
    'SAT Math',
    'Other',
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg pointer-events-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-zinc-200">
                <h2
                  className="text-2xl font-bold text-black"
                  style={{ fontFamily: "var(--font-oswald)" }}
                >
                  Book a Session
                </h2>
                <button
                  onClick={handleClose}
                  className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-500 hover:bg-zinc-200 hover:text-zinc-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
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

                {/* Subject Select */}
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm text-zinc-600 mb-2"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    Subject
                  </label>
                  <div className="relative">
                    <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                    <select
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-zinc-100 border border-zinc-200 rounded-xl text-black appearance-none focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all cursor-pointer"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      <option value="">Select a subject...</option>
                      {subjects.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Topic Input */}
                <div>
                  <label
                    htmlFor="topic"
                    className="block text-sm text-zinc-600 mb-2"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    Topic / What do you need help with?
                  </label>
                  <input
                    id="topic"
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., Integration by Parts, Newton's Laws..."
                    className="w-full px-4 py-4 bg-zinc-100 border border-zinc-200 rounded-xl text-black placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    style={{ fontFamily: "var(--font-mono)" }}
                  />
                </div>

                {/* Date & Time Input */}
                <div>
                  <label
                    htmlFor="datetime"
                    className="block text-sm text-zinc-600 mb-2"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    Preferred Date & Time
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                    <input
                      id="datetime"
                      type="datetime-local"
                      value={dateTime}
                      onChange={(e) => setDateTime(e.target.value)}
                      min={getMinDateTime()}
                      className="w-full pl-12 pr-4 py-4 bg-zinc-100 border border-zinc-200 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                      style={{ fontFamily: "var(--font-mono)" }}
                    />
                  </div>
                  <p className="text-xs text-zinc-400 mt-2" style={{ fontFamily: "var(--font-mono)" }}>
                    Sessions are 1 hour long. I&apos;ll confirm availability.
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isLoading}
                    className="flex-1 px-6 py-4 bg-zinc-100 text-zinc-700 font-semibold rounded-xl border border-zinc-200 hover:bg-zinc-200 transition-colors disabled:opacity-50"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: isLoading ? 1 : 1.01 }}
                    whileTap={{ scale: isLoading ? 1 : 0.99 }}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-black text-white font-semibold rounded-xl hover:bg-zinc-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Booking...
                      </>
                    ) : (
                      'Confirm Booking'
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

