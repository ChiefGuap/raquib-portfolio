'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Linkedin, Github, Send, Loader2, CheckCircle } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Log to console for now (can hook up to API later)
    console.log('📧 Contact Form Submitted:', formData)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSubmitting(false)
    setIsSubmitted(true)
    setFormData({ name: '', email: '', message: '' })

    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000)
  }

  const contactMethods = [
    {
      icon: Mail,
      label: 'Email',
      value: 'raquib.alam00@gmail.com',
      href: 'mailto:raquib.alam00@gmail.com',
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      value: 'linkedin.com/in/raquibalam',
      href: 'https://linkedin.com/in/raquibalam',
    },
    {
      icon: Github,
      label: 'GitHub',
      value: 'github.com/raquibalam',
      href: 'https://github.com/raquibalam',
    },
  ]

  return (
    <main className="min-h-screen bg-zinc-100">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold text-black mb-6"
            style={{ fontFamily: 'Oswald, sans-serif' }}
          >
            Get in Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-zinc-600 max-w-2xl mx-auto"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            Have a question about tutoring or want to discuss a project?
            <br />
            I&apos;d love to hear from you.
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="pb-24 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
          {/* Contact Methods */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2
              className="text-2xl font-bold text-black mb-8"
              style={{ fontFamily: 'Oswald, sans-serif' }}
            >
              Contact Methods
            </h2>

            <div className="space-y-4">
              {contactMethods.map((method, index) => (
                <motion.a
                  key={method.label}
                  href={method.href}
                  target={method.label !== 'Email' ? '_blank' : undefined}
                  rel={method.label !== 'Email' ? 'noopener noreferrer' : undefined}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  className="flex items-center gap-4 p-4 bg-white rounded-xl border border-zinc-200 hover:border-black hover:shadow-lg transition-all group"
                >
                  <div className="w-12 h-12 rounded-lg bg-black flex items-center justify-center group-hover:bg-zinc-800 transition-colors">
                    <method.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p
                      className="text-sm text-zinc-500 uppercase tracking-wider"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      {method.label}
                    </p>
                    <p
                      className="text-black font-medium"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      {method.value}
                    </p>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-8 p-6 bg-zinc-200/50 rounded-xl border border-zinc-300"
            >
              <p
                className="text-sm text-zinc-600 leading-relaxed"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                <strong className="text-black">Response Time:</strong> I typically respond within 24 hours.
                For tutoring inquiries, please include your current grade level and subjects of interest.
              </p>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2
              className="text-2xl font-bold text-black mb-8"
              style={{ fontFamily: 'Oswald, sans-serif' }}
            >
              Send a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm text-zinc-600 mb-2"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-white border border-zinc-300 rounded-xl text-black placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  style={{ fontFamily: 'var(--font-mono)' }}
                  placeholder="Your name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm text-zinc-600 mb-2"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-white border border-zinc-300 rounded-xl text-black placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  style={{ fontFamily: 'var(--font-mono)' }}
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm text-zinc-600 mb-2"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  Message
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-white border border-zinc-300 rounded-xl text-black placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all resize-none"
                  style={{ fontFamily: 'var(--font-mono)' }}
                  placeholder="How can I help you?"
                />
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                className="w-full py-4 bg-black text-white font-semibold rounded-xl hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : isSubmitted ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Message Sent!
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </motion.button>
            </form>

            {isSubmitted && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-sm text-green-600 text-center"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                Thanks for reaching out! I&apos;ll get back to you soon.
              </motion.p>
            )}
          </motion.div>
        </div>
      </section>
    </main>
  )
}
