'use client'

import { motion } from 'framer-motion'
import { Calendar, BookOpen, MessageSquare, Sparkles, GraduationCap, Target } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import ChatWidget from '@/components/ChatWidget'

// Chat conversation for the booking demo
const chatConversation = [
  { role: 'user', message: "I need a Physics slot for Tuesday." },
  { role: 'ai', message: "Checking the calendar... Tuesday at 4 PM is available. Book it?" },
  { role: 'user', message: "Yes please." },
  { role: 'ai', message: "✓ Confirmed! You're all set. See you Tuesday!" },
]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: `linear-gradient(to right, black 1px, transparent 1px),
                               linear-gradient(to bottom, black 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Hero Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-sm"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                Now Accepting Students
              </motion.div>

              {/* Headline */}
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-black leading-[1.1] tracking-tight"
                style={{ fontFamily: "var(--font-oswald)" }}
              >
                Alam&apos;s Tutoring
              </h1>

              {/* Sub-headline */}
              <p className="text-lg sm:text-xl text-zinc-600 max-w-lg leading-relaxed">
                Connect directly with Raquib Alam for personalized tutoring in any STEM subject. From Middle School to College, get the 1-on-1 guidance you need to succeed.
              </p>

              {/* Buttons - Stack on mobile, row on desktop */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/login">
                  <motion.span
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-block w-full sm:w-auto text-center px-8 py-4 bg-black text-white font-semibold rounded-xl hover:bg-zinc-800 transition-colors shadow-lg shadow-black/20 cursor-pointer"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    Book a Session
                  </motion.span>
                </Link>
                <Link href="/login">
                  <motion.span
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-block w-full sm:w-auto text-center px-8 py-4 bg-transparent text-black font-semibold rounded-xl border-2 border-black hover:bg-black hover:text-white transition-colors cursor-pointer"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    Student Portal
                  </motion.span>
                </Link>
              </div>
            </motion.div>

            {/* Right: Chat Demo - Hidden on small screens */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative hidden lg:block"
            >
              <ChatDemo />
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works - 3 Step Process */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-4"
              style={{ fontFamily: "var(--font-oswald)" }}
            >
              How It Works
            </h2>
            <p className="text-zinc-600 text-base sm:text-lg max-w-2xl mx-auto">
              Simple, direct, and effective. Here&apos;s how we&apos;ll work together.
            </p>
          </motion.div>

          {/* 3-Step Cards */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <StepCard
              step={1}
              icon={<Calendar className="w-8 h-8" />}
              title="Connect"
              description="Schedule a session directly with me. No agencies, no friction."
              delay={0}
            />
            <StepCard
              step={2}
              icon={<GraduationCap className="w-8 h-8" />}
              title="Learn"
              description="Personalized instruction tailored to your specific class and learning style."
              delay={0.1}
              highlighted
            />
            <StepCard
              step={3}
              icon={<Target className="w-8 h-8" />}
              title="Succeed"
              description="Access notes, review past sessions, and build confidence in your STEM skills."
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section className="py-20 bg-zinc-100">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2
              className="text-3xl sm:text-4xl font-bold text-black mb-4"
              style={{ fontFamily: "var(--font-oswald)" }}
            >
              Subjects Offered
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-3"
          >
            {[
              'Calculus', 'Physics', 'Linear Algebra', 'Chemistry',
              'Computer Science', 'Statistics', 'Pre-Calculus', 'Algebra',
              'AP Exam Prep', 'SAT Math'
            ].map((subject, i) => (
              <motion.span
                key={subject}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="px-4 sm:px-5 py-2 sm:py-2.5 bg-white text-zinc-700 rounded-full border border-zinc-200 text-sm font-medium hover:bg-black hover:text-white hover:border-black transition-colors cursor-default"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {subject}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white"
              style={{ fontFamily: "var(--font-oswald)" }}
            >
              Ready to Level Up?
            </h2>
            <p className="text-zinc-400 text-base sm:text-lg max-w-xl mx-auto">
              Book your first session and experience the difference of personalized STEM mentorship.
            </p>
            <Link href="/login">
              <motion.span
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-block px-10 py-4 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-colors cursor-pointer"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Get Started Today
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Bottom Spacing for Dock */}
      <div className="h-32 bg-black" />

      {/* GuapBot Chat Widget */}
      <ChatWidget context="landing" />
    </main>
  )
}

// Step Card Component
function StepCard({
  step,
  icon,
  title,
  description,
  delay,
  highlighted = false,
}: {
  step: number
  icon: React.ReactNode
  title: string
  description: string
  delay: number
  highlighted?: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -5 }}
      className={`p-6 sm:p-8 rounded-2xl border transition-all duration-300 ${
        highlighted
          ? 'bg-black text-white border-black shadow-xl shadow-black/10'
          : 'bg-zinc-50 border-zinc-200 hover:border-zinc-300'
      }`}
    >
      <div className={`w-12 sm:w-14 h-12 sm:h-14 rounded-xl flex items-center justify-center mb-6 ${
        highlighted ? 'bg-white/10' : 'bg-black text-white'
      }`}>
        {icon}
      </div>
      <div className="flex items-center gap-3 mb-3">
        <span
          className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded ${
            highlighted ? 'bg-white/20 text-white' : 'bg-zinc-200 text-zinc-600'
          }`}
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Step {step}
        </span>
      </div>
      <h4
        className="text-xl sm:text-2xl font-bold mb-4"
        style={{ fontFamily: "var(--font-oswald)" }}
      >
        {title}
      </h4>
      <p className={`text-sm sm:text-base leading-relaxed ${highlighted ? 'text-zinc-300' : 'text-zinc-600'}`}>
        {description}
      </p>
    </motion.div>
  )
}

// Chat Demo Component
function ChatDemo() {
  const [visibleMessages, setVisibleMessages] = useState<number>(0)
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    if (visibleMessages < chatConversation.length) {
      setIsTyping(true)
      const timer = setTimeout(() => {
        setIsTyping(false)
        setVisibleMessages(prev => prev + 1)
      }, visibleMessages === 0 ? 1000 : 1500)
      return () => clearTimeout(timer)
    } else {
      // Reset and loop after a pause
      const resetTimer = setTimeout(() => {
        setVisibleMessages(0)
      }, 3000)
      return () => clearTimeout(resetTimer)
    }
  }, [visibleMessages])

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xl shadow-black/10 overflow-hidden">
      {/* Chat Header */}
      <div className="px-5 py-4 border-b border-zinc-100 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h4 className="font-semibold text-zinc-900 text-sm">GuapBot</h4>
          <p className="text-xs text-emerald-600 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            Online
          </p>
        </div>
        <div className="ml-auto">
          <Calendar className="w-5 h-5 text-zinc-400" />
        </div>
      </div>

      {/* Chat Messages */}
      <div className="p-5 space-y-4 min-h-[280px] bg-zinc-50">
        {chatConversation.slice(0, visibleMessages).map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm ${
                msg.role === 'user'
                  ? 'bg-black text-white rounded-br-md'
                  : 'bg-white text-zinc-800 border border-zinc-200 rounded-bl-md'
              }`}
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {msg.message}
            </div>
          </motion.div>
        ))}

        {/* Typing Indicator */}
        {isTyping && visibleMessages < chatConversation.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`flex ${chatConversation[visibleMessages]?.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`px-4 py-3 rounded-2xl ${
              chatConversation[visibleMessages]?.role === 'user'
                ? 'bg-black'
                : 'bg-white border border-zinc-200'
            }`}>
              <div className="flex gap-1">
                <span className={`w-2 h-2 rounded-full animate-bounce ${
                  chatConversation[visibleMessages]?.role === 'user' ? 'bg-white/60' : 'bg-zinc-400'
                }`} style={{ animationDelay: '0ms' }} />
                <span className={`w-2 h-2 rounded-full animate-bounce ${
                  chatConversation[visibleMessages]?.role === 'user' ? 'bg-white/60' : 'bg-zinc-400'
                }`} style={{ animationDelay: '150ms' }} />
                <span className={`w-2 h-2 rounded-full animate-bounce ${
                  chatConversation[visibleMessages]?.role === 'user' ? 'bg-white/60' : 'bg-zinc-400'
                }`} style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Chat Input (decorative) */}
      <div className="px-5 py-4 border-t border-zinc-100 bg-white">
        <div className="flex items-center gap-3 px-4 py-3 bg-zinc-100 rounded-xl">
          <span className="text-zinc-400 text-sm" style={{ fontFamily: "var(--font-mono)" }}>
            Type a message...
          </span>
        </div>
      </div>
    </div>
  )
}
