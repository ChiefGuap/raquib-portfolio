'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, X, Send, Loader2, Bot, User } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface ChatWidgetProps {
  context: 'landing' | 'dashboard'
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

// OpenRouter response type
interface ChatResponse {
  choices?: Array<{
    message: {
      content: string
    }
  }>
  error?: string
}

export default function ChatWidget({ context }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Submit handler - now uses JSON response (no streaming)
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
    }

    // Add user message to chat
    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      // Call API with JSON request
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          context,
        }),
      })

      // Parse JSON response
      const data: ChatResponse = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to get response')
      }

      // Extract reply from OpenAI-compatible response format
      const reply = data.choices?.[0]?.message?.content ?? ''

      // Add assistant message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: reply || 'Sorry, I could not generate a response.',
      }

      setMessages((prev) => [...prev, assistantMessage])

    } catch (error) {
      console.error('Chat error:', error)
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <>
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-6 z-50 w-[350px] bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-black text-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3
                    className="text-sm font-semibold"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    GuapBot
                  </h3>
                  <p className="text-xs text-zinc-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                    Online
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="h-[320px] overflow-y-auto p-4 space-y-4 bg-zinc-50">
              {/* Welcome Message */}
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-full bg-zinc-200 flex items-center justify-center mx-auto mb-3">
                    <MessageSquare className="w-6 h-6 text-zinc-500" />
                  </div>
                  <p
                    className="text-sm text-zinc-500"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {context === 'landing'
                      ? 'Ask me anything about tutoring!'
                      : 'How can I help you study today?'}
                  </p>
                </div>
              )}

              {/* Message List */}
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`flex items-start gap-2 max-w-[85%] ${
                      message.role === 'user' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center ${
                        message.role === 'user'
                          ? 'bg-black text-white'
                          : 'bg-zinc-200 text-zinc-600'
                      }`}
                    >
                      {message.role === 'user' ? (
                        <User className="w-3 h-3" />
                      ) : (
                        <Bot className="w-3 h-3" />
                      )}
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={`px-3 py-2 rounded-xl text-sm ${
                        message.role === 'user'
                          ? 'bg-black text-white rounded-br-md'
                          : 'bg-white text-zinc-800 border border-zinc-200 rounded-bl-md'
                      }`}
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {message.content}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Loading Indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-zinc-200 flex items-center justify-center">
                      <Bot className="w-3 h-3 text-zinc-600" />
                    </div>
                    <div className="px-3 py-2 bg-white border border-zinc-200 rounded-xl rounded-bl-md">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={onSubmit} className="p-3 border-t border-zinc-200 bg-white">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2.5 bg-zinc-100 border border-zinc-200 rounded-xl text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  style={{ fontFamily: "var(--font-mono)" }}
                />
                <motion.button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-black text-white shadow-lg shadow-black/20 flex items-center justify-center hover:bg-zinc-800 transition-colors"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageSquare className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  )
}
