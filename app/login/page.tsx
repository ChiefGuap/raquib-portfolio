'use client'

import { createClient } from '@/utils/supabase/client'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Mail, Loader2, CheckCircle } from 'lucide-react'

export default function LoginPage() {
  const supabase = createClient()
  
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Google OAuth Sign In
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    setError(null)
    
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  // Magic Link Email Sign In
  const handleMagicLinkSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setError('Please enter your email address')
      return
    }

    setIsLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    setIsLoading(false)

    if (error) {
      setError(error.message)
    } else {
      setMagicLinkSent(true)
    }
  }

  return (
    <main className="min-h-screen bg-zinc-100 flex items-center justify-center px-4">
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

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-xl shadow-black/5 p-10">
          {/* Logo/Brand */}
          <div className="flex justify-center mb-8">
            <div className="w-14 h-14 rounded-xl bg-black flex items-center justify-center">
              <span className="text-white text-2xl font-bold" style={{ fontFamily: "var(--font-oswald)" }}>
                R
              </span>
            </div>
          </div>

          {/* Headline */}
          <h1
            className="text-3xl font-bold text-black text-center mb-3"
            style={{ fontFamily: "var(--font-oswald)" }}
          >
            Student Portal Access
          </h1>

          {/* Subtext */}
          <p
            className="text-zinc-500 text-center mb-10"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Sign in to view your schedule and resources.
          </p>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl"
            >
              <p className="text-red-600 text-sm text-center" style={{ fontFamily: "var(--font-mono)" }}>
                {error}
              </p>
            </motion.div>
          )}

          {/* Google Sign In Button */}
          <motion.button
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            whileHover={{ scale: isGoogleLoading ? 1 : 1.01 }}
            whileTap={{ scale: isGoogleLoading ? 1 : 0.99 }}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-black text-white font-semibold rounded-xl hover:bg-zinc-800 transition-colors shadow-lg shadow-black/10 disabled:opacity-70 disabled:cursor-not-allowed"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {isGoogleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            )}
            {isGoogleLoading ? 'Connecting...' : 'Sign in with Google'}
          </motion.button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-zinc-200" />
            <span className="text-xs text-zinc-400 uppercase tracking-wider" style={{ fontFamily: "var(--font-mono)" }}>
              or continue with email
            </span>
            <div className="flex-1 h-px bg-zinc-200" />
          </div>

          {/* Magic Link Form */}
          {magicLinkSent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center p-6 bg-emerald-50 border border-emerald-200 rounded-xl"
            >
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
              <h3
                className="text-lg font-bold text-emerald-800 mb-2"
                style={{ fontFamily: "var(--font-oswald)" }}
              >
                Check your inbox!
              </h3>
              <p className="text-emerald-600 text-sm" style={{ fontFamily: "var(--font-mono)" }}>
                We sent a magic link to <span className="font-semibold">{email}</span>
              </p>
              <button
                onClick={() => {
                  setMagicLinkSent(false)
                  setEmail('')
                }}
                className="mt-4 text-sm text-emerald-700 underline underline-offset-2 hover:no-underline"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Use a different email
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleMagicLinkSignIn} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm text-zinc-600 mb-2"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@student.edu"
                    className="w-full pl-12 pr-4 py-4 bg-zinc-100 border border-zinc-200 rounded-xl text-black placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    style={{ fontFamily: "var(--font-mono)" }}
                  />
                </div>
              </div>
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.01 }}
                whileTap={{ scale: isLoading ? 1 : 0.99 }}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-zinc-100 text-black font-semibold rounded-xl border-2 border-zinc-200 hover:border-black hover:bg-zinc-50 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending link...
                  </>
                ) : (
                  'Send Magic Link'
                )}
              </motion.button>
            </form>
          )}

          {/* Help Link */}
          <p className="text-center text-sm text-zinc-500 mt-8" style={{ fontFamily: "var(--font-mono)" }}>
            Need help?{' '}
            <a href="/contact" className="text-black underline underline-offset-2 hover:no-underline">
              Contact me
            </a>
          </p>
        </div>

        {/* Footer */}
        <p
          className="text-center text-xs text-zinc-400 mt-6"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Protected by Supabase Auth
        </p>
      </motion.div>

      {/* Bottom Spacing for Dock */}
      <div className="fixed bottom-0 left-0 right-0 h-32 pointer-events-none" />
    </main>
  )
}
