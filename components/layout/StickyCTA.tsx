'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MessageCircle, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

export function StickyCTA() {
  const [isVisible, setIsVisible] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 400)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.35, ease }}
          className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3"
        >
          {/* Popup card (desktop) */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.25, ease }}
                className="hidden md:block glass-card rounded-xl p-4 w-72"
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="font-bold text-primary text-sm">Butuh bantuan?</p>
                  <button onClick={() => setIsOpen(false)} className="text-text-secondary hover:text-primary">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-xs text-text-secondary mb-3">
                  Tim kami siap membantu. Chat langsung via WhatsApp sekarang.
                </p>
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WA_NUMBER}?text=Halo%2C%20saya%20ingin%20konsultasi%20gratis`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat WhatsApp
                </a>
                <Link href="/#lead-form" className="block mt-2">
                  <button className="w-full bg-accent hover:bg-accent-dark text-white text-sm font-semibold py-2.5 rounded-lg transition-colors">
                    Konsultasi Gratis
                  </button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile FAB */}
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WA_NUMBER}?text=Halo%2C%20saya%20tertarik%20dengan%20layanan%20website`}
            target="_blank"
            rel="noopener noreferrer"
            className="md:hidden flex items-center justify-center w-14 h-14 bg-green-500 rounded-full shadow-xl hover:bg-green-600 transition-colors"
            aria-label="Chat WhatsApp"
          >
            <MessageCircle className="h-7 w-7 text-white" />
          </a>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="hidden md:flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-semibold text-sm px-5 py-3 rounded-full shadow-xl transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            {isOpen ? 'Tutup' : 'Konsultasi Gratis'}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
