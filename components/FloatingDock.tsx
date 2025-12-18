'use client'

import { usePathname, useRouter } from 'next/navigation'
import MacOSDock from './ui/mac-os-dock'

export default function FloatingDock() {
  const router = useRouter()
  const pathname = usePathname()

  const apps = [
    { 
      id: 'home', 
      name: 'Tutoring',
      path: '/',
      icon: (
        <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center p-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-full h-full">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
          </svg>
        </div>
      )
    },
    { 
      id: 'projects', 
      name: 'Portfolio',
      path: '/projects',
      icon: (
        <div className="w-full h-full bg-gradient-to-br from-zinc-700 to-zinc-900 rounded-xl flex items-center justify-center p-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-full h-full">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
          </svg>
        </div>
      )
    },
    { 
      id: 'contact', 
      name: 'Contact',
      path: '/contact',
      icon: (
        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center p-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-full h-full">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
          </svg>
        </div>
      )
    },
  ]

  const handleAppClick = (appId: string) => {
    const app = apps.find(a => a.id === appId)
    if (!app) return

    // Check if it's an external link
    if ('external' in app && app.external) {
      window.open(app.path, '_blank')
    } else {
      // Navigate to internal page
      router.push(app.path)
    }
  }

  // Determine which apps are "open" (active) based on current route
  const getOpenApps = () => {
    const openApps: string[] = []
    
    apps.forEach(app => {
      if ('external' in app && app.external) return
      
      if (app.path === '/' && pathname === '/') {
        openApps.push(app.id)
      } else if (app.path !== '/' && pathname.startsWith(app.path)) {
        openApps.push(app.id)
      }
    })
    
    return openApps
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <MacOSDock
        apps={apps}
        onAppClick={handleAppClick}
        openApps={getOpenApps()}
      />
    </div>
  )
}
