import type { Metadata } from 'next'
import './globals.css'
import FloatingDock from '@/components/FloatingDock'

export const metadata: Metadata = {
  title: "Alam's Tutoring | Expert STEM Mentorship",
  description: 'Personalized 1-on-1 tutoring for Math, Physics, and Computer Science. From Middle School to College.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        {/* Global Floating Dock - appears on all pages */}
        <FloatingDock />
      </body>
    </html>
  )
}
