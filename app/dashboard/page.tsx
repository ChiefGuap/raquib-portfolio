import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import DashboardClient from './DashboardClient'

// Admin email
const ADMIN_EMAIL = 'raquib.alam00@gmail.com'

// Types for database rows
interface ResourceItem {
  title: string
  url: string
}

interface Booking {
  id: string
  student_id: string
  start_time: string
  topic: string
  status: string
  meeting_link: string | null
  session_notes: string | null
  resources: ResourceItem[] | null
  pending_change_type: string | null
  change_reason: string | null
  requested_time: string | null
  created_at: string
}

interface Profile {
  id: string
  full_name: string
  grade_level: string
  phone_number: string
  instagram_handle: string | null
  goals: string
  onboarding_completed: boolean
}

export interface SessionResource {
  title: string
  url: string
}

export interface Session {
  id: string
  date: string
  time: string
  topic: string
  subject: string
  zoomLink: string | null
  sessionNotes: string | null
  resources: SessionResource[]
  pendingChangeType: string | null
  rawStartTime: string // ISO string for reschedule modal
  status: string
}

export interface DashboardData {
  userId: string
  student: {
    name: string
    email: string
  }
  stats: {
    nextSession: {
      date: string
      time: string
    } | null
    hoursCompleted: number
    activeFocus: string
  }
  upcomingSessions: Session[]
  pastSessions: Session[]
}

// Helper to format date
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })
}

// Helper to format time (for single timestamp, assume 1 hour session)
function formatTime(startTime: string): string {
  const start = new Date(startTime)
  const end = new Date(start.getTime() + 60 * 60 * 1000) // +1 hour
  
  const formatTimeOnly = (d: Date) =>
    d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  
  return `${formatTimeOnly(start)} - ${formatTimeOnly(end)}`
}

// Helper to transform booking to session
function bookingToSession(booking: Booking): Session {
  // Transform database resources to session resources
  const sessionResources: SessionResource[] = booking.resources
    ? booking.resources.map(r => ({ title: r.title, url: r.url }))
    : []

  return {
    id: booking.id,
    date: formatDate(booking.start_time),
    time: formatTime(booking.start_time),
    topic: booking.topic,
    subject: 'Session', // Default since we don't have subject column
    zoomLink: booking.meeting_link,
    sessionNotes: booking.session_notes,
    resources: sessionResources,
    pendingChangeType: booking.pending_change_type,
    rawStartTime: booking.start_time,
    status: booking.status,
  }
}

export default async function DashboardPage() {
  const supabase = createClient()

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  // Redirect to login if not authenticated
  if (authError || !user) {
    redirect('/login')
  }

  // ============================================
  // SMART REDIRECT: Admin Check
  // ============================================
  if (user.email === ADMIN_EMAIL) {
    redirect('/admin')
  }

  // ============================================
  // SMART REDIRECT: Onboarding Check
  // ============================================
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // If no profile exists or onboarding not completed, redirect to onboarding
  if (profileError || !profile || !profile.onboarding_completed) {
    redirect('/onboarding')
  }

  // ============================================
  // NORMAL STATE: Fetch Dashboard Data
  // ============================================

  // Fetch all bookings for this user
  const { data: bookings, error: bookingsError } = await supabase
    .from('bookings')
    .select('*')
    .eq('student_id', user.id)
    .order('start_time', { ascending: false })

  if (bookingsError) {
    console.error('Error fetching bookings:', bookingsError)
  }

  const now = new Date()
  const allBookings: Booking[] = bookings || []

  // Split into upcoming and past sessions based on status and date
  const upcomingSessions: Session[] = []
  const pastSessions: Session[] = []

  allBookings.forEach((booking) => {
    const sessionDate = new Date(booking.start_time)
    const session = bookingToSession(booking)

    if (booking.status === 'completed' || sessionDate < now) {
      pastSessions.push(session)
    } else {
      upcomingSessions.push(session)
    }
  })

  // Sort upcoming sessions ascending (nearest first)
  upcomingSessions.sort((a, b) => {
    const bookingA = allBookings.find(bk => bk.id === a.id)
    const bookingB = allBookings.find(bk => bk.id === b.id)
    const dateA = new Date(bookingA?.start_time || 0)
    const dateB = new Date(bookingB?.start_time || 0)
    return dateA.getTime() - dateB.getTime()
  })

  // Calculate hours completed (assuming 1 hour per session)
  const hoursCompleted = pastSessions.length

  // Get next session info
  const nextBooking = upcomingSessions.length > 0
    ? allBookings.find(b => b.id === upcomingSessions[0].id)
    : null

  // Determine active focus from goals or default
  const activeFocus = profile.goals?.split(' ').slice(0, 3).join(' ') + '...' || 'Learning'

  // Prepare dashboard data - use profile.full_name for welcome message
  const dashboardData: DashboardData = {
    userId: user.id,
    student: {
      name: profile.full_name || user.user_metadata?.full_name || 'Student',
      email: user.email || '',
    },
    stats: {
      nextSession: nextBooking
        ? {
            date: formatDate(nextBooking.start_time),
            time: new Date(nextBooking.start_time).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            }),
          }
        : null,
      hoursCompleted,
      activeFocus: activeFocus.length > 20 ? activeFocus.slice(0, 20) + '...' : activeFocus,
    },
    upcomingSessions,
    pastSessions,
  }

  return <DashboardClient data={dashboardData} />
}
