import Hero from '@/components/Hero'
import ExperienceTimeline from '@/components/ExperienceTimeline'

export default function ProjectsPage() {
  return (
    <main>
      {/* Portfolio Hero Section */}
      <Hero />
      
      {/* Visual Separator */}
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-zinc-200" />
            <span 
              className="text-sm text-zinc-400 uppercase tracking-widest"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Experience
            </span>
            <div className="flex-1 h-px bg-zinc-200" />
          </div>
        </div>
      </div>
      
      {/* Experience Timeline Section - Full width white wrapper */}
      <div className="bg-white">
        <ExperienceTimeline />
        
        {/* Bottom Spacing for Dock */}
        <div className="h-32" />
      </div>
    </main>
  )
}
