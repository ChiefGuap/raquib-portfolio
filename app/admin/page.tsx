import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import AdminDashboardClient from './AdminDashboardClient'

// Admin email whitelist
const ADMIN_EMAIL = 'raquib.alam00@gmail.com'

// Profile data from join
export interface StudentProfile {
  full_name: string | null
  grade_level: string | null
  goals: string | null
}

export interface ResourceItem {
  title: string
  url: string
}

export interface Booking {
  id: string
  student_id: string
  topic: string
  start_time: string
  status: string
  meeting_link: string | null
  session_notes: string | null
  resources: ResourceItem[] | null
  created_at: string
  // Joined profile data
  profiles: StudentProfile | null
}

export interface AdminDashboardData {
  stats: {
    totalBookings: number
    pendingSessions: number
    completedHours: number
    uniqueStudents: number
  }
  bookings: Booking[]
}

export default async function AdminPage() {
  const supabase = createClient()

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  // Redirect if not authenticated
  if (authError || !user) {
    redirect('/login')
  }

  // Security check - only allow admin email
  if (user.email !== ADMIN_EMAIL) {
    redirect('/dashboard')
  }

  // Fetch ALL bookings with joined profile data
  const { data: bookings, error: bookingsError } = await supabase
    .from('bookings')
    .select(`
      *,
      profiles (
        full_name,
        grade_level,
        goals
      )
    `)
    .order('start_time', { ascending: false })

  if (bookingsError) {
    console.error('Error fetching bookings:', bookingsError)
  }

  const allBookings: Booking[] = bookings || []

  // Calculate stats
  const totalBookings = allBookings.length
  const pendingSessions = allBookings.filter(b => b.status === 'upcoming').length
  const completedHours = allBookings.filter(b => b.status === 'completed').length
  const uniqueStudents = new Set(allBookings.map(b => b.student_id)).size

  const adminData: AdminDashboardData = {
    stats: {
      totalBookings,
      pendingSessions,
      completedHours,
      uniqueStudents,
    },
    bookings: allBookings,
  }

  return <AdminDashboardClient data={adminData} />
}
