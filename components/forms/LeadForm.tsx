'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

const budgets = ['< Rp 50 Juta', 'Rp 50–150 Juta', 'Rp 150–500 Juta', '> Rp 500 Juta']
const services = ['Brand Strategy', 'UI/UX Design', 'Web Development', 'Digital Growth', 'Full-Service']

export function LeadForm() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-8%' })
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null)
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section id="contact" ref={ref} className="px-6 md:px-16 max-w-screen-xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        {/* Left — CTA copy */}
        <div className="flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="w-6 h-px bg-[#c8a96e]" />
            <span
              className="text-[#c8a96e] text-[10px] tracking-[0.3em] uppercase"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              Start a Project
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="text-[clamp(2.2rem,5vw,4rem)] font-light text-white leading-tight mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Let's Build<br />
            Something<br />
            <em className="text-[#c8a96e]">Remarkable</em>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-[#4a4a4a] text-sm leading-relaxed mb-10 max-w-sm"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Share your vision and we'll respond within 24 hours with a tailored proposal — no fluff, no obligation.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="space-y-5"
          >
            {[
              { label: 'Email', value: 'hello@studio.id' },
              { label: 'WhatsApp', value: '+62 812 3456 7890' },
              { label: 'Location', value: 'Jakarta, Indonesia' },
            ].map((c) => (
              <div key={c.label} className="flex items-center gap-4">
                <span
                  className="text-[#2a2a2a] text-[10px] tracking-[0.2em] uppercase w-20 shrink-0"
                  style={{ fontFamily: "'DM Mono', monospace" }}
                >
                  {c.label}
                </span>
                <span className="w-8 h-px bg-[#1e1e1e]" />
                <span
                  className="text-[#5a5a5a] text-sm"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {c.value}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right — Form */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="border border-[#181818] p-12 flex flex-col items-center justify-center text-center min-h-[500px]"
              >
                <div className="w-12 h-12 border border-[#c8a96e]/40 flex items-center justify-center mb-8">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c8a96e" strokeWidth="1.5">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3
                  className="text-white text-2xl font-light mb-3"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Message Received
                </h3>
                <p
                  className="text-[#4a4a4a] text-sm max-w-xs"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  We'll review your project details and get back to you within 24 hours.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="border border-[#181818] p-8 md:p-10 space-y-7"
              >
                {/* Name + Company */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label
                      className="text-[#3a3a3a] text-[10px] tracking-[0.2em] uppercase block"
                      style={{ fontFamily: "'DM Mono', monospace" }}
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Your full name"
                      className="w-full bg-transparent border-b border-[#1e1e1e] py-3 text-white text-sm placeholder-[#2a2a2a] focus:outline-none focus:border-[#c8a96e] transition-colors duration-300"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      className="text-[#3a3a3a] text-[10px] tracking-[0.2em] uppercase block"
                      style={{ fontFamily: "'DM Mono', monospace" }}
                    >
                      Company
                    </label>
                    <input
                      type="text"
                      placeholder="Your company"
                      className="w-full bg-transparent border-b border-[#1e1e1e] py-3 text-white text-sm placeholder-[#2a2a2a] focus:outline-none focus:border-[#c8a96e] transition-colors duration-300"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label
                    className="text-[#3a3a3a] text-[10px] tracking-[0.2em] uppercase block"
                    style={{ fontFamily: "'DM Mono', monospace" }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="hello@yourcompany.com"
                    className="w-full bg-transparent border-b border-[#1e1e1e] py-3 text-white text-sm placeholder-[#2a2a2a] focus:outline-none focus:border-[#c8a96e] transition-colors duration-300"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  />
                </div>

                {/* Service selector */}
                <div className="space-y-3">
                  <label
                    className="text-[#3a3a3a] text-[10px] tracking-[0.2em] uppercase block"
                    style={{ fontFamily: "'DM Mono', monospace" }}
                  >
                    Service Needed
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {services.map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setSelectedService(s)}
                        className={`px-4 py-2 text-[10px] tracking-[0.15em] uppercase border transition-all duration-200 ${
                          selectedService === s
                            ? 'border-[#c8a96e] text-[#c8a96e] bg-[#c8a96e]/5'
                            : 'border-[#1e1e1e] text-[#3a3a3a] hover:border-[#2e2e2e] hover:text-[#5a5a5a]'
                        }`}
                        style={{ fontFamily: "'DM Mono', monospace" }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Budget selector */}
                <div className="space-y-3">
                  <label
                    className="text-[#3a3a3a] text-[10px] tracking-[0.2em] uppercase block"
                    style={{ fontFamily: "'DM Mono', monospace" }}
                  >
                    Budget Range
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {budgets.map((b) => (
                      <button
                        type="button"
                        key={b}
                        onClick={() => setSelectedBudget(b)}
                        className={`px-4 py-3 text-[10px] tracking-[0.1em] text-left border transition-all duration-200 ${
                          selectedBudget === b
                            ? 'border-[#c8a96e] text-[#c8a96e] bg-[#c8a96e]/5'
                            : 'border-[#1e1e1e] text-[#3a3a3a] hover:border-[#2e2e2e]'
                        }`}
                        style={{ fontFamily: "'DM Mono', monospace" }}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label
                    className="text-[#3a3a3a] text-[10px] tracking-[0.2em] uppercase block"
                    style={{ fontFamily: "'DM Mono', monospace" }}
                  >
                    Project Brief
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about your project goals, timeline, and any specific requirements…"
                    className="w-full bg-transparent border-b border-[#1e1e1e] py-3 text-white text-sm placeholder-[#2a2a2a] focus:outline-none focus:border-[#c8a96e] transition-colors duration-300 resize-none"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full py-4 bg-[#c8a96e] text-[#080808] text-xs tracking-[0.25em] uppercase font-semibold hover:bg-[#d4b97e] active:scale-[0.99] transition-all duration-200"
                  style={{ fontFamily: "'DM Mono', monospace" }}
                >
                  Send Project Brief
                </button>

                <p
                  className="text-center text-[#2a2a2a] text-[10px] tracking-[0.1em]"
                  style={{ fontFamily: "'DM Mono', monospace" }}
                >
                  Response within 24 hours · No spam · No obligation
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
