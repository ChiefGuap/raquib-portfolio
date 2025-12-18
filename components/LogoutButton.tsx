'use client'

import { createClient } from '@/utils/supabase/client'
import { LogOut, Loader2 } from 'lucide-react'
import { useState } from 'react'

export default function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSignOut = async () => {
    setIsLoading(true)
    
    const supabase = createClient()
    await supabase.auth.signOut()
    
    // Force redirect to home page
    window.location.href = '/'
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={isLoading}
      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-600 bg-transparent border border-zinc-300 rounded-lg hover:bg-zinc-100 hover:text-zinc-800 hover:border-zinc-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      style={{ fontFamily: "var(--font-mono)" }}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Signing out...
        </>
      ) : (
        <>
          <LogOut className="w-4 h-4" />
          Sign Out
        </>
      )}
    </button>
  )
}


