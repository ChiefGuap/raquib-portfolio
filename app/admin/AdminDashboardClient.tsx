'use client'

import { createClient } from '@/utils/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  Users, 
  Link as LinkIcon, 
  Check, 
  X, 
  Loader2,
  ExternalLink,
  AlertCircle,
  GraduationCap,
  Target,
  User,
  FileText,
  ClipboardCheck,
  Pencil
} from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { AdminDashboardData, Booking } from './page'
import LogoutButton from '@/components/LogoutButton'

export default function AdminDashboardClient({ data }: { data: AdminDashboardData }) {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false)
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false)

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* Zoom Link Modal */}
      <ZoomLinkModal
        isOpen={isZoomModalOpen}
        onClose={() => {
          setIsZoomModalOpen(false)
          setSelectedBooking(null)
        }}
        booking={selectedBooking}
      />

      {/* Complete Session Modal */}
      <CompleteSessionModal
        isOpen={isCompleteModalOpen}
        onClose={() => {
          setIsCompleteModalOpen(false)
          setSelectedBooking(null)
        }}
        booking={selectedBooking}
      />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-start justify-between gap-6 mb-10"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <span
                className="text-sm text-zinc-500 uppercase tracking-wider"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Admin Command Center
              </span>
            </div>
            <h1
              className="text-4xl lg:text-5xl font-bold text-white"
              style={{ fontFamily: "var(--font-oswald)" }}
            >
              Tutoring Dashboard
            </h1>
          </div>
          {/* Admin Logout - styled for dark theme */}
          <button
            onClick={async () => {
              const { createClient } = await import('@/utils/supabase/client')
              const supabase = createClient()
              await supabase.auth.signOut()
              window.location.href = '/'
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-400 bg-transparent border border-zinc-700 rounded-lg hover:bg-zinc-800 hover:text-white hover:border-zinc-600 transition-all"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Sign Out
          </button>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
        >
          <StatCard
            icon={<Calendar className="w-6 h-6" />}
            label="Total Bookings"
            value={data.stats.totalBookings.toString()}
            color="blue"
          />
          <StatCard
            icon={<Clock className="w-6 h-6" />}
            label="Pending Sessions"
            value={data.stats.pendingSessions.toString()}
            color="amber"
          />
          <StatCard
            icon={<CheckCircle className="w-6 h-6" />}
            label="Completed Hours"
            value={data.stats.completedHours.toString()}
            color="emerald"
          />
          <StatCard
            icon={<Users className="w-6 h-6" />}
            label="Unique Students"
            value={data.stats.uniqueStudents.toString()}
            color="purple"
          />
        </motion.div>

        {/* Bookings Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden"
        >
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
            <h2
              className="text-xl font-bold text-white"
              style={{ fontFamily: "var(--font-oswald)" }}
            >
              All Bookings
            </h2>
            <span
              className="text-sm text-zinc-500"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {data.bookings.length} total
            </span>
          </div>

          {/* Table */}
          {data.bookings.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-500" style={{ fontFamily: "var(--font-mono)" }}>
                No bookings yet
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th
                      className="px-6 py-4 text-left text-xs uppercase tracking-wider text-zinc-500"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      Student
                    </th>
                    <th
                      className="px-6 py-4 text-left text-xs uppercase tracking-wider text-zinc-500"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      Topic
                    </th>
                    <th
                      className="px-6 py-4 text-left text-xs uppercase tracking-wider text-zinc-500"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      Date & Time
                    </th>
                    <th
                      className="px-6 py-4 text-left text-xs uppercase tracking-wider text-zinc-500"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      Status
                    </th>
                    <th
                      className="px-6 py-4 text-right text-xs uppercase tracking-wider text-zinc-500"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {data.bookings.map((booking, i) => (
                    <BookingRow
                      key={booking.id}
                      booking={booking}
                      index={i}
                      onAddZoomLink={() => {
                        setSelectedBooking(booking)
                        setIsZoomModalOpen(true)
                      }}
                      onCompleteSession={() => {
                        setSelectedBooking(booking)
                        setIsCompleteModalOpen(true)
                      }}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>

      {/* Bottom Spacing for Dock */}
      <div className="h-32" />
    </main>
  )
}

// ============================================
// COMPONENTS
// ============================================

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode
  label: string
  value: string
  color: 'blue' | 'amber' | 'emerald' | 'purple'
}) {
  const colorClasses = {
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  }

  return (
    <div className={`rounded-xl border p-6 ${colorClasses[color]}`}>
      <div className="flex items-center gap-3 mb-4">
        {icon}
        <span
          className="text-xs uppercase tracking-wider opacity-70"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {label}
        </span>
      </div>
      <p
        className="text-4xl font-bold"
        style={{ fontFamily: "var(--font-oswald)" }}
      >
        {value}
      </p>
    </div>
  )
}

function BookingRow({
  booking,
  index,
  onAddZoomLink,
  onCompleteSession,
}: {
  booking: Booking
  index: number
  onAddZoomLink: () => void
  onCompleteSession: () => void
}) {
  const supabase = createClient()
  const router = useRouter()
  const [showGoalsTooltip, setShowGoalsTooltip] = useState(false)
  const [isEditingGoals, setIsEditingGoals] = useState(false)
  const [editedGoals, setEditedGoals] = useState(booking.profiles?.goals || '')
  const [isSavingGoals, setIsSavingGoals] = useState(false)

  const handleSaveGoals = async () => {
    if (!booking.student_id) return
    
    setIsSavingGoals(true)
    
    const { error } = await supabase
      .from('profiles')
      .update({ goals: editedGoals.trim() })
      .eq('id', booking.student_id)
    
    setIsSavingGoals(false)
    
    if (error) {
      console.error('Error updating goals:', error)
      return
    }
    
    setIsEditingGoals(false)
    router.refresh()
  }

  const handleCancelEdit = () => {
    setEditedGoals(booking.profiles?.goals || '')
    setIsEditingGoals(false)
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
    }
  }

  const formatGradeLevel = (grade: string | null) => {
    if (!grade) return 'N/A'
    const labels: Record<string, string> = {
      'middle_school': 'Middle School',
      'high_school': 'High School',
      'college': 'College',
      'other': 'Other',
    }
    return labels[grade] || grade
  }

  const { date, time } = formatDateTime(booking.start_time)
  const isUpcoming = booking.status === 'upcoming'

  const profile = booking.profiles

  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="hover:bg-zinc-800/50 transition-colors"
    >
      {/* Student Info */}
      <td className="px-6 py-4">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 text-zinc-500" />
          </div>
          
          <div className="min-w-0">
            {/* Name */}
            <p className="text-sm font-medium text-white truncate" style={{ fontFamily: "var(--font-mono)" }}>
              {profile?.full_name || 'Unknown Student'}
            </p>
            
            {/* Grade Level */}
            <div className="flex items-center gap-1.5 mt-1">
              <GraduationCap className="w-3.5 h-3.5 text-zinc-500" />
              <span className="text-xs text-zinc-500" style={{ fontFamily: "var(--font-mono)" }}>
                {formatGradeLevel(profile?.grade_level || null)}
              </span>
            </div>

            {/* Goals Section with Inline Edit */}
            <div className="relative mt-1.5">
              {isEditingGoals ? (
                /* Inline Edit Mode */
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute left-0 top-0 z-50 w-72 p-3 bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl"
                >
                  <p className="text-xs text-zinc-400 uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-mono)" }}>
                    Edit Goals
                  </p>
                  <textarea
                    value={editedGoals}
                    onChange={(e) => setEditedGoals(e.target.value)}
                    placeholder="Enter student goals..."
                    rows={3}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-600 rounded-lg text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    style={{ fontFamily: "var(--font-mono)" }}
                    autoFocus
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={handleSaveGoals}
                      disabled={isSavingGoals}
                      className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-500 transition-colors disabled:opacity-50"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {isSavingGoals ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Check className="w-3 h-3" />
                      )}
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      disabled={isSavingGoals}
                      className="flex items-center gap-1 px-2.5 py-1.5 bg-zinc-700 text-zinc-300 rounded-lg text-xs font-medium hover:bg-zinc-600 transition-colors disabled:opacity-50"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      <X className="w-3 h-3" />
                      Cancel
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* View Mode with Edit Button */
                <>
                  <button
                    onMouseEnter={() => setShowGoalsTooltip(true)}
                    onMouseLeave={() => setShowGoalsTooltip(false)}
                    className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    <Target className="w-3.5 h-3.5" />
                    {profile?.goals ? 'View Goals' : 'No Goals Set'}
                  </button>

                  {/* Tooltip with Edit Button */}
                  <AnimatePresence>
                    {showGoalsTooltip && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        onMouseEnter={() => setShowGoalsTooltip(true)}
                        onMouseLeave={() => setShowGoalsTooltip(false)}
                        className="absolute left-0 top-full mt-2 z-50 w-72 p-4 bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs text-zinc-400 uppercase tracking-wider" style={{ fontFamily: "var(--font-mono)" }}>
                            Student Goals
                          </p>
                          <button
                            onClick={() => {
                              setShowGoalsTooltip(false)
                              setIsEditingGoals(true)
                            }}
                            className="flex items-center gap-1 px-2 py-1 bg-zinc-700 text-zinc-300 rounded-md text-xs hover:bg-zinc-600 hover:text-white transition-colors"
                            style={{ fontFamily: "var(--font-mono)" }}
                          >
                            <Pencil className="w-3 h-3" />
                            Edit
                          </button>
                        </div>
                        <p className="text-sm text-zinc-200 leading-relaxed" style={{ fontFamily: "var(--font-mono)" }}>
                          {profile?.goals || 'No goals set for this student.'}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </div>
          </div>
        </div>
      </td>

      {/* Topic */}
      <td className="px-6 py-4">
        <span className="text-sm text-white" style={{ fontFamily: "var(--font-mono)" }}>
          {booking.topic}
        </span>
      </td>

      {/* Date & Time */}
      <td className="px-6 py-4">
        <div>
          <p className="text-sm text-white" style={{ fontFamily: "var(--font-mono)" }}>
            {date}
          </p>
          <p className="text-xs text-zinc-500" style={{ fontFamily: "var(--font-mono)" }}>
            {time}
          </p>
        </div>
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <StatusBadge status={booking.status} />
      </td>

      {/* Actions */}
      <td className="px-6 py-4">
        <div className="flex items-center justify-end gap-2">
          {/* Zoom Link Button */}
          {booking.meeting_link ? (
            <a
              href={booking.meeting_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg text-xs font-medium hover:bg-blue-500/30 transition-colors"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Zoom
            </a>
          ) : (
            <button
              onClick={onAddZoomLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 text-zinc-400 rounded-lg text-xs font-medium hover:bg-zinc-700 hover:text-white transition-colors"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              Add Link
            </button>
          )}

          {/* Mark Complete Button - Opens Modal */}
          {isUpcoming && (
            <button
              onClick={onCompleteSession}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-medium hover:bg-emerald-500/30 transition-colors"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <ClipboardCheck className="w-3.5 h-3.5" />
              Complete
            </button>
          )}

          {/* Already completed indicator */}
          {booking.status === 'completed' && (
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-zinc-600 text-xs"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Done
            </span>
          )}
        </div>
      </td>
    </motion.tr>
  )
}

function StatusBadge({ status }: { status: string }) {
  const isUpcoming = status === 'upcoming'
  
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
        isUpcoming
          ? 'bg-amber-500/20 text-amber-400'
          : 'bg-emerald-500/20 text-emerald-400'
      }`}
      style={{ fontFamily: "var(--font-mono)" }}
    >
      {isUpcoming ? (
        <AlertCircle className="w-3 h-3" />
      ) : (
        <CheckCircle className="w-3 h-3" />
      )}
      {isUpcoming ? 'Upcoming' : 'Completed'}
    </span>
  )
}

// ============================================
// ZOOM LINK MODAL
// ============================================

function ZoomLinkModal({
  isOpen,
  onClose,
  booking,
}: {
  isOpen: boolean
  onClose: () => void
  booking: Booking | null
}) {
  const supabase = createClient()
  const router = useRouter()
  const [zoomLink, setZoomLink] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!booking) return

    if (!zoomLink.trim()) {
      setError('Please enter a Zoom link')
      return
    }

    if (!zoomLink.startsWith('http')) {
      setError('Please enter a valid URL')
      return
    }

    setIsLoading(true)
    setError(null)

    const { error: updateError } = await supabase
      .from('bookings')
      .update({ meeting_link: zoomLink.trim() })
      .eq('id', booking.id)

    setIsLoading(false)

    if (updateError) {
      console.error('Error updating zoom link:', updateError)
      setError('Failed to save. Please try again.')
      return
    }

    setZoomLink('')
    onClose()
    router.refresh()
  }

  const handleClose = () => {
    setZoomLink('')
    setError(null)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && booking && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-2xl w-full max-w-md pointer-events-auto">
              <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                <h2
                  className="text-xl font-bold text-white"
                  style={{ fontFamily: "var(--font-oswald)" }}
                >
                  Add Zoom Link
                </h2>
                <button
                  onClick={handleClose}
                  className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-zinc-700 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700">
                  <p className="text-sm text-zinc-400 mb-1" style={{ fontFamily: "var(--font-mono)" }}>
                    Session with {booking.profiles?.full_name || 'Student'}
                  </p>
                  <p className="text-white font-medium" style={{ fontFamily: "var(--font-mono)" }}>
                    {booking.topic}
                  </p>
                  <p className="text-sm text-zinc-500 mt-1" style={{ fontFamily: "var(--font-mono)" }}>
                    {new Date(booking.start_time).toLocaleString()}
                  </p>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
                  >
                    <p className="text-red-400 text-sm" style={{ fontFamily: "var(--font-mono)" }}>
                      {error}
                    </p>
                  </motion.div>
                )}

                <div>
                  <label
                    htmlFor="zoomLink"
                    className="block text-sm text-zinc-400 mb-2"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    Zoom Meeting URL
                  </label>
                  <div className="relative">
                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                    <input
                      id="zoomLink"
                      type="url"
                      value={zoomLink}
                      onChange={(e) => setZoomLink(e.target.value)}
                      placeholder="https://zoom.us/j/..."
                      className="w-full pl-12 pr-4 py-4 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      style={{ fontFamily: "var(--font-mono)" }}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isLoading}
                    className="flex-1 px-6 py-4 bg-zinc-800 text-zinc-300 font-semibold rounded-xl border border-zinc-700 hover:bg-zinc-700 transition-colors disabled:opacity-50"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: isLoading ? 1 : 1.01 }}
                    whileTap={{ scale: isLoading ? 1 : 0.99 }}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Link'
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

// ============================================
// COMPLETE SESSION MODAL
// ============================================

function CompleteSessionModal({
  isOpen,
  onClose,
  booking,
}: {
  isOpen: boolean
  onClose: () => void
  booking: Booking | null
}) {
  const supabase = createClient()
  const router = useRouter()
  const [sessionNotes, setSessionNotes] = useState('')
  const [resourceLink, setResourceLink] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!booking) return

    if (!sessionNotes.trim()) {
      setError('Please add session notes')
      return
    }

    // Validate resource link if provided
    if (resourceLink.trim() && !resourceLink.startsWith('http')) {
      setError('Please enter a valid URL for the resource link')
      return
    }

    setIsLoading(true)
    setError(null)

    // Build resources array
    const resources = resourceLink.trim() 
      ? [{ title: 'Session Resources', url: resourceLink.trim() }]
      : []

    const { error: updateError } = await supabase
      .from('bookings')
      .update({
        status: 'completed',
        session_notes: sessionNotes.trim(),
        resources: resources,
      })
      .eq('id', booking.id)

    setIsLoading(false)

    if (updateError) {
      console.error('Error completing session:', updateError)
      setError('Failed to complete session. Please try again.')
      return
    }

    // Success
    handleClose()
    router.refresh()
  }

  const handleClose = () => {
    setSessionNotes('')
    setResourceLink('')
    setError(null)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && booking && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-2xl w-full max-w-lg pointer-events-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <ClipboardCheck className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h2
                    className="text-xl font-bold text-white"
                    style={{ fontFamily: "var(--font-oswald)" }}
                  >
                    Wrap Up Session
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-zinc-700 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Session Info */}
                <div className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700">
                  <p className="text-sm text-zinc-400 mb-1" style={{ fontFamily: "var(--font-mono)" }}>
                    Session with {booking.profiles?.full_name || 'Student'}
                  </p>
                  <p className="text-white font-medium" style={{ fontFamily: "var(--font-mono)" }}>
                    {booking.topic}
                  </p>
                  <p className="text-sm text-zinc-500 mt-1" style={{ fontFamily: "var(--font-mono)" }}>
                    {new Date(booking.start_time).toLocaleString()}
                  </p>
                </div>

                {/* Error */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
                  >
                    <p className="text-red-400 text-sm" style={{ fontFamily: "var(--font-mono)" }}>
                      {error}
                    </p>
                  </motion.div>
                )}

                {/* Session Notes */}
                <div>
                  <label
                    htmlFor="sessionNotes"
                    className="block text-sm text-zinc-400 mb-2"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    Session Notes *
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-4 w-5 h-5 text-zinc-500" />
                    <textarea
                      id="sessionNotes"
                      value={sessionNotes}
                      onChange={(e) => setSessionNotes(e.target.value)}
                      placeholder="What did we cover? Key concepts, breakthroughs, areas to work on..."
                      rows={4}
                      className="w-full pl-12 pr-4 py-4 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
                      style={{ fontFamily: "var(--font-mono)" }}
                    />
                  </div>
                </div>

                {/* Resource Link */}
                <div>
                  <label
                    htmlFor="resourceLink"
                    className="block text-sm text-zinc-400 mb-2"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    Resource Link{' '}
                    <span className="text-zinc-600">(Optional)</span>
                  </label>
                  <div className="relative">
                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                    <input
                      id="resourceLink"
                      type="url"
                      value={resourceLink}
                      onChange={(e) => setResourceLink(e.target.value)}
                      placeholder="https://docs.google.com/..."
                      className="w-full pl-12 pr-4 py-4 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      style={{ fontFamily: "var(--font-mono)" }}
                    />
                  </div>
                  <p className="text-xs text-zinc-600 mt-2" style={{ fontFamily: "var(--font-mono)" }}>
                    Link to Google Doc, Drive folder, or other resources
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isLoading}
                    className="flex-1 px-6 py-4 bg-zinc-800 text-zinc-300 font-semibold rounded-xl border border-zinc-700 hover:bg-zinc-700 transition-colors disabled:opacity-50"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: isLoading ? 1 : 1.01 }}
                    whileTap={{ scale: isLoading ? 1 : 0.99 }}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="w-5 h-5" />
                        Save & Complete
                      </>
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
