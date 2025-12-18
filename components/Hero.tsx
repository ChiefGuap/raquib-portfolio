'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Signature from './Signature'
import { ChevronDown } from 'lucide-react'

export default function Hero() {
  const scrollToTimeline = () => {
    const timeline = document.getElementById('timeline')
    if (timeline) {
      timeline.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative h-screen w-full overflow-hidden bg-zinc-400">
      {/* Layer 0: Background - Solid Gray (already set via bg-zinc-400) */}

      {/* Top-left: Logo/Copyright */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute top-6 left-6 z-30 text-zinc-700/80"
      >
        <p className="text-xs font-mono tracking-wide">© Alam&apos;s Tutoring</p>
      </motion.div>

      {/* Top-right: Description */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="absolute top-6 right-6 z-30 max-w-xs text-right"
      >
        <p className="text-xs leading-relaxed text-zinc-700/90 font-mono">
          Computer Science student at UC Davis.
          <br />
          Building scalable systems and elegant interfaces.
          <br />
          Seeking high-impact internship opportunities.
        </p>
      </motion.div>

      {/* Small floating label - Creative Designer & Developer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="absolute top-[40%] right-[10%] z-30 text-right"
      >
        <p className="text-sm font-mono text-zinc-700 tracking-widest">Creative</p>
        <p className="text-sm font-mono text-zinc-700 tracking-widest">Designer & Developer</p>
      </motion.div>

      {/* Layer 1: Interactive Image with Color Hover (z-10 - Middle Layer) */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ 
          duration: 1.2, 
          delay: 0.6,
          ease: [0.22, 1, 0.36, 1]
        }}
        className="absolute bottom-0 left-[30%] -translate-x-1/2 z-10"
      >
        <motion.div 
          className="relative h-[85vh] w-auto drop-shadow-2xl cursor-pointer"
          whileHover="hover"
          initial="initial"
        >
          {/* Bottom Layer: Grayscale Image (Always Visible) */}
          <Image
            src="/hero-grayscale.png"
            alt="Raquib Ahmed"
            width={800}
            height={1200}
            priority
            className="h-full w-auto object-contain object-bottom"
            style={{
              filter: 'brightness(95%) contrast(105%)'
            }}
          />
          
          {/* Top Layer: Colored Image (Fades In on Hover) */}
          <motion.div
            className="absolute inset-0"
            variants={{
              initial: { opacity: 0 },
              hover: { opacity: 1 }
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <Image
              src="/hero-colored.png"
              alt="Raquib Ahmed"
              width={800}
              height={1200}
              className="h-full w-auto object-contain object-bottom"
              style={{
                filter: 'brightness(95%) contrast(105%)'
              }}
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Layer 2: Animated Signature (z-20 - In Front of Image) */}
      <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-full pointer-events-none z-20">
        <Signature />
      </div>

      {/* Desktop-only: View Experience Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        onClick={scrollToTimeline}
        className="hidden md:flex absolute bottom-[118px] left-[45%] -translate-x-1/2 z-30 items-center gap-2 px-6 py-3 bg-black/80 backdrop-blur-sm text-white rounded-full hover:bg-black transition-colors cursor-pointer group"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        <span className="text-sm font-medium">View Experience</span>
        <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
      </motion.button>
    </section>
  )
}

