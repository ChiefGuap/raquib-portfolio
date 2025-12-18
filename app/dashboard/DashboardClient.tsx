'use client'

import { createClient } from '@/utils/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, 
  Clock, 
  Target, 
  Video, 
  ExternalLink, 
  FileText, 
  BookOpen, 
  Plus, 
  AlertCircle,
  MoreVertical,
  CalendarClock,
  XCircle,
  Loader2,
  X,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  DollarSign
} from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { DashboardData, Session } from './page'
import BookingModal from '@/components/dashboard/BookingModal'
import LogoutButton from '@/components/LogoutButton'
import ChatWidget from '@/components/ChatWidget'

type TabType = 'upcoming' | 'past'

export default function DashboardClient({ data }: { data: DashboardData }) {
  const [activeTab, setActiveTab] = useState<TabType>('upcoming')
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <main className="min-h-screen bg-zinc-100">
      {/* Booking Modal */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userId={data.userId}
      />

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10"
        >
          <div>
            <h1
              className="text-4xl lg:text-5xl font-bold text-black mb-2"
              style={{ fontFamily: "var(--font-oswald)" }}
            >
              Welcome back, {data.student.name}
            </h1>
            <p className="text-zinc-500" style={{ fontFamily: "var(--font-mono)" }}>
              {data.student.email}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => setIsModalOpen(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-6 py-4 bg-black text-white font-semibold rounded-xl hover:bg-zinc-800 transition-colors shadow-lg shadow-black/10"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <Plus className="w-5 h-5" />
              Book New Session
            </motion.button>
            <LogoutButton />
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
        >
          <StatCard
            icon={<Calendar className="w-6 h-6" />}
            label="Next Session"
            value={data.stats.nextSession?.date || 'None scheduled'}
            subValue={data.stats.nextSession?.time || 'Book a session'}
          />
          <StatCard
            icon={<Clock className="w-6 h-6" />}
            label="Hours Completed"
            value={data.stats.hoursCompleted.toString()}
            subValue="total hours"
          />
          <StatCard
            icon={<Target className="w-6 h-6" />}
            label="Active Focus"
            value={data.stats.activeFocus}
            subValue="current subject"
          />
        </motion.div>

        {/* Payment Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-10"
        >
          <div className="bg-white rounded-xl border border-zinc-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                <DollarSign className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3
                  className="text-lg font-bold text-black mb-2"
                  style={{ fontFamily: "var(--font-oswald)" }}
                >
                  Payments
                </h3>
                <p className="text-sm text-zinc-600 mb-3" style={{ fontFamily: "var(--font-mono)" }}>
                  Payments are handled via Venmo or Zelle after each session.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-100 text-zinc-800 rounded-lg text-sm font-medium"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    Venmo: <span className="text-emerald-600 font-bold">@Raquib-Alam</span>
                  </span>
                  <span
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-100 text-zinc-800 rounded-lg text-sm font-medium"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    Zelle: <span className="text-emerald-600 font-bold">raquib.alam00@gmail.com</span>
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-3" style={{ fontFamily: "var(--font-mono)" }}>
                  Rates: $30-$60/hr • First session is FREE
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs System */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden"
        >
          {/* Tab Headers */}
          <div className="flex border-b border-zinc-200">
            <TabButton
              active={activeTab === 'upcoming'}
              onClick={() => setActiveTab('upcoming')}
              label="Upcoming Sessions"
              count={data.upcomingSessions.length}
            />
            <TabButton
              active={activeTab === 'past'}
              onClick={() => setActiveTab('past')}
              label="Past Sessions"
              count={data.pastSessions.length}
            />
          </div>

          {/* Tab Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === 'upcoming' ? (
                <motion.div
                  key="upcoming"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {data.upcomingSessions.length === 0 ? (
                    <EmptyState 
                      message="No upcoming sessions." 
                      actionLabel="Book your first session"
                      onAction={() => setIsModalOpen(true)}
                    />
                  ) : (
                    data.upcomingSessions.map((session, i) => (
                      <UpcomingSessionCard 
                        key={session.id} 
                        session={session} 
                        index={i} 
                        userEmail={data.student.email}
                      />
                    ))
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="past"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {data.pastSessions.length === 0 ? (
                    <EmptyState message="No past sessions yet." />
                  ) : (
                    data.pastSessions.map((session, i) => (
                      <PastSessionCard key={session.id} session={session} index={i} />
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Bottom Spacing for Dock */}
      <div className="h-32" />

      {/* GuapBot Chat Widget */}
      <ChatWidget context="dashboard" />
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
  subValue,
}: {
  icon: React.ReactNode
  label: string
  value: string
  subValue: string
}) {
  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-600">
          {icon}
        </div>
        <span
          className="text-xs uppercase tracking-wider text-zinc-400"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {label}
        </span>
      </div>
      <p
        className="text-2xl font-bold text-black mb-1"
        style={{ fontFamily: "var(--font-oswald)" }}
      >
        {value}
      </p>
      <p className="text-sm text-zinc-500" style={{ fontFamily: "var(--font-mono)" }}>
        {subValue}
      </p>
    </div>
  )
}

function TabButton({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean
  onClick: () => void
  label: string
  count: number
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex-1 px-6 py-4 text-sm font-medium transition-colors ${
        active ? 'text-black' : 'text-zinc-500 hover:text-zinc-700'
      }`}
      style={{ fontFamily: "var(--font-mono)" }}
    >
      <span className="flex items-center justify-center gap-2">
        {label}
        <span
          className={`px-2 py-0.5 rounded-full text-xs ${
            active ? 'bg-black text-white' : 'bg-zinc-200 text-zinc-600'
          }`}
        >
          {count}
        </span>
      </span>
      {active && (
        <motion.div
          layoutId="activeTab"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"
        />
      )}
    </button>
  )
}

function UpcomingSessionCard({
  session,
  index,
  userEmail,
}: {
  session: Session
  index: number
  userEmail: string
}) {
  const [showMenu, setShowMenu] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showRescheduleModal, setShowRescheduleModal] = useState(false)

  const hasPendingChange = !!session.pendingChangeType

  return (
    <>
      {/* Cancel Modal */}
      <CancelModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        sessionId={session.id}
        sessionTopic={session.topic}
        userEmail={userEmail}
      />

      {/* Reschedule Modal */}
      <RescheduleModal
        isOpen={showRescheduleModal}
        onClose={() => setShowRescheduleModal(false)}
        sessionId={session.id}
        sessionTopic={session.topic}
        currentTime={session.rawStartTime}
        userEmail={userEmail}
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-zinc-50 rounded-xl border border-zinc-200 hover:border-zinc-300 transition-colors"
      >
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span
              className="text-xs px-2 py-1 bg-zinc-200 text-zinc-700 rounded"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {session.subject}
            </span>
            <span className="text-zinc-400 text-sm" style={{ fontFamily: "var(--font-mono)" }}>
              {session.date}
            </span>
            {/* Change Pending Badge */}
            {hasPendingChange && (
              <span
                className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full flex items-center gap-1"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                <Clock className="w-3 h-3" />
                {session.pendingChangeType === 'cancel' ? 'Cancel' : 'Reschedule'} Pending
              </span>
            )}
          </div>
          <h3
            className="text-lg font-bold text-black mb-1"
            style={{ fontFamily: "var(--font-oswald)" }}
          >
            {session.topic}
          </h3>
          <p className="text-sm text-zinc-500" style={{ fontFamily: "var(--font-mono)" }}>
            {session.time}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom Link Button */}
          {session.zoomLink ? (
            <motion.a
              href={session.zoomLink}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg font-medium text-sm bg-black text-white hover:bg-zinc-800 transition-colors"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <Video className="w-4 h-4" />
              Join Zoom
            </motion.a>
          ) : (
            <div
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg font-medium text-sm bg-zinc-200 text-zinc-400 cursor-not-allowed"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <AlertCircle className="w-4 h-4" />
              Link Pending
            </div>
          )}

          {/* Manage Button - Only show if no pending change */}
          {!hasPendingChange && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="w-10 h-10 rounded-lg bg-zinc-200 flex items-center justify-center text-zinc-600 hover:bg-zinc-300 hover:text-zinc-800 transition-colors"
              >
                <MoreVertical className="w-5 h-5" />
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {showMenu && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowMenu(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -5 }}
                      className="absolute right-0 top-full mt-2 z-50 w-48 bg-white rounded-xl border border-zinc-200 shadow-xl overflow-hidden"
                    >
                      <button
                        onClick={() => {
                          setShowMenu(false)
                          setShowRescheduleModal(true)
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        <CalendarClock className="w-4 h-4" />
                        Reschedule Session
                      </button>
                      <button
                        onClick={() => {
                          setShowMenu(false)
                          setShowCancelModal(true)
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        <XCircle className="w-4 h-4" />
                        Cancel Session
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>
    </>
  )
}

function PastSessionCard({
  session,
  index,
}: {
  session: Session
  index: number
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const hasNotes = !!session.sessionNotes
  const hasResources = session.resources.length > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-xl border border-zinc-200 overflow-hidden hover:shadow-sm transition-shadow"
    >
      {/* Main Content */}
      <div className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1">
            {/* Header */}
            <div className="flex items-center gap-3 mb-2">
              <span
                className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full flex items-center gap-1"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                <CheckCircle className="w-3 h-3" />
                Completed
              </span>
              <span className="text-zinc-400 text-sm" style={{ fontFamily: "var(--font-mono)" }}>
                {session.date}
              </span>
            </div>

            {/* Topic */}
            <h3
              className="text-lg font-bold text-zinc-800 mb-1"
              style={{ fontFamily: "var(--font-oswald)" }}
            >
              {session.topic}
            </h3>
            <p className="text-sm text-zinc-400" style={{ fontFamily: "var(--font-mono)" }}>
              {session.time}
            </p>
          </div>

          {/* Expand Button (only if there's content to show) */}
          {(hasNotes || hasResources) && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-100 text-zinc-600 rounded-lg text-sm font-medium hover:bg-zinc-200 transition-colors"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Hide Details
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  View Details
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (hasNotes || hasResources) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-4 border-t border-zinc-100 pt-4">
              {/* Session Notes */}
              {hasNotes && (
                <div>
                  <p
                    className="text-xs uppercase tracking-wider text-zinc-400 mb-2 flex items-center gap-2"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    <FileText className="w-4 h-4" />
                    Session Notes
                  </p>
                  <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                    <p
                      className="text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {session.sessionNotes}
                    </p>
                  </div>
                </div>
              )}

              {/* Resources */}
              {hasResources && (
                <div>
                  <p
                    className="text-xs uppercase tracking-wider text-zinc-400 mb-2 flex items-center gap-2"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    <BookOpen className="w-4 h-4" />
                    Resources
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {session.resources.map((resource, i) => (
                      <a
                        key={i}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        <ExternalLink className="w-4 h-4" />
                        {resource.title || 'View Session Resources'}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function EmptyState({ 
  message, 
  actionLabel, 
  onAction 
}: { 
  message: string
  actionLabel?: string
  onAction?: () => void 
}) {
  return (
    <div className="py-12 text-center">
      <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mx-auto mb-4">
        <Calendar className="w-8 h-8 text-zinc-400" />
      </div>
      <p className="text-zinc-500 mb-4" style={{ fontFamily: "var(--font-mono)" }}>
        {message}
      </p>
      {actionLabel && onAction && (
        <motion.button
          onClick={onAction}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 px-5 py-3 bg-black text-white font-medium rounded-lg hover:bg-zinc-800 transition-colors"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <Plus className="w-4 h-4" />
          {actionLabel}
        </motion.button>
      )}
    </div>
  )
}

// ============================================
// CANCEL MODAL
// ============================================

function CancelModal({
  isOpen,
  onClose,
  sessionId,
  sessionTopic,
  userEmail,
}: {
  isOpen: boolean
  onClose: () => void
  sessionId: string
  sessionTopic: string
  userEmail: string
}) {
  const supabase = createClient()
  const router = useRouter()
  const [reason, setReason] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!reason.trim()) {
      setError('Please provide a reason for cancellation')
      return
    }

    setIsLoading(true)
    setError(null)

    const { error: updateError } = await supabase
      .from('bookings')
      .update({
        pending_change_type: 'cancel',
        change_reason: reason.trim(),
      })
      .eq('id', sessionId)

    setIsLoading(false)

    if (updateError) {
      console.error('Cancel error:', updateError)
      setError('Failed to submit cancellation request. Please try again.')
      return
    }

    // SMS Simulation
    console.log('📱 [MOCK SMS SENT TO RAQUIB]: Student ' + userEmail + ' requested to cancel their session.')

    // Success
    handleClose()
    router.refresh()
  }

  const handleClose = () => {
    setReason('')
    setError(null)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xl w-full max-w-md pointer-events-auto">
              <div className="flex items-center justify-between p-6 border-b border-zinc-200">
                <h2
                  className="text-xl font-bold text-black"
                  style={{ fontFamily: "var(--font-oswald)" }}
                >
                  Cancel Session
                </h2>
                <button
                  onClick={handleClose}
                  className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-500 hover:bg-zinc-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-700" style={{ fontFamily: "var(--font-mono)" }}>
                    You are requesting to cancel: <strong>{sessionTopic}</strong>
                  </p>
                </div>

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

                <div>
                  <label
                    htmlFor="cancelReason"
                    className="block text-sm text-zinc-600 mb-2"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    Reason for Cancellation *
                  </label>
                  <textarea
                    id="cancelReason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Please explain why you need to cancel..."
                    rows={3}
                    className="w-full px-4 py-3 bg-zinc-100 border border-zinc-200 rounded-xl text-black placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black transition-all resize-none"
                    style={{ fontFamily: "var(--font-mono)" }}
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isLoading}
                    className="flex-1 px-6 py-4 bg-zinc-100 text-zinc-700 font-semibold rounded-xl border border-zinc-200 hover:bg-zinc-200 transition-colors disabled:opacity-50"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    Keep Session
                  </button>
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: isLoading ? 1 : 1.01 }}
                    whileTap={{ scale: isLoading ? 1 : 0.99 }}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-500 transition-colors disabled:opacity-70"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Request Cancel'
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
// RESCHEDULE MODAL
// ============================================

function RescheduleModal({
  isOpen,
  onClose,
  sessionId,
  sessionTopic,
  currentTime,
  userEmail,
}: {
  isOpen: boolean
  onClose: () => void
  sessionId: string
  sessionTopic: string
  currentTime: string
  userEmail: string
}) {
  const supabase = createClient()
  const router = useRouter()
  const [newTime, setNewTime] = useState('')
  const [reason, setReason] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newTime) {
      setError('Please select a new date and time')
      return
    }

    if (!reason.trim()) {
      setError('Please provide a reason for rescheduling')
      return
    }

    const requestedTime = new Date(newTime)
    if (requestedTime <= new Date()) {
      setError('Please select a future date and time')
      return
    }

    setIsLoading(true)
    setError(null)

    const { error: updateError } = await supabase
      .from('bookings')
      .update({
        pending_change_type: 'reschedule',
        requested_time: requestedTime.toISOString(),
        change_reason: reason.trim(),
      })
      .eq('id', sessionId)

    setIsLoading(false)

    if (updateError) {
      console.error('Reschedule error:', updateError)
      setError('Failed to submit reschedule request. Please try again.')
      return
    }

    // SMS Simulation
    console.log('📱 [MOCK SMS SENT TO RAQUIB]: Student ' + userEmail + ' requested to reschedule their session.')

    // Success
    handleClose()
    router.refresh()
  }

  const handleClose = () => {
    setNewTime('')
    setReason('')
    setError(null)
    onClose()
  }

  const getMinDateTime = () => {
    const now = new Date()
    now.setHours(now.getHours() + 1)
    return now.toISOString().slice(0, 16)
  }

  const formatCurrentTime = () => {
    return new Date(currentTime).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xl w-full max-w-md pointer-events-auto">
              <div className="flex items-center justify-between p-6 border-b border-zinc-200">
                <h2
                  className="text-xl font-bold text-black"
                  style={{ fontFamily: "var(--font-oswald)" }}
                >
                  Reschedule Session
                </h2>
                <button
                  onClick={handleClose}
                  className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-500 hover:bg-zinc-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="p-4 bg-zinc-100 border border-zinc-200 rounded-xl">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1" style={{ fontFamily: "var(--font-mono)" }}>
                    Current Session
                  </p>
                  <p className="text-sm text-zinc-800 font-medium" style={{ fontFamily: "var(--font-mono)" }}>
                    {sessionTopic}
                  </p>
                  <p className="text-sm text-zinc-600" style={{ fontFamily: "var(--font-mono)" }}>
                    {formatCurrentTime()}
                  </p>
                </div>

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

                <div>
                  <label
                    htmlFor="newTime"
                    className="block text-sm text-zinc-600 mb-2"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    New Requested Time *
                  </label>
                  <div className="relative">
                    <CalendarClock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                    <input
                      id="newTime"
                      type="datetime-local"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      min={getMinDateTime()}
                      className="w-full pl-12 pr-4 py-4 bg-zinc-100 border border-zinc-200 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-black transition-all"
                      style={{ fontFamily: "var(--font-mono)" }}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="rescheduleReason"
                    className="block text-sm text-zinc-600 mb-2"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    Reason for Rescheduling *
                  </label>
                  <textarea
                    id="rescheduleReason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Please explain why you need to reschedule..."
                    rows={3}
                    className="w-full px-4 py-3 bg-zinc-100 border border-zinc-200 rounded-xl text-black placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black transition-all resize-none"
                    style={{ fontFamily: "var(--font-mono)" }}
                  />
                </div>

                <div className="flex gap-3 pt-2">
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
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-black text-white font-semibold rounded-xl hover:bg-zinc-800 transition-colors disabled:opacity-70"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Request Reschedule'
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
