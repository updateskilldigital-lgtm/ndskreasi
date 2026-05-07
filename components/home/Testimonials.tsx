'use client'

import { useState } from 'react'
import { Container } from '@/components/ui/Container'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const testimonials = [
  {
    id: 1,
    name: 'Budi Santoso',
    role: 'Owner Cafe Bahagia',
    content: 'Setelah menggunakan website dari NDS Kreasi, omset kami naik 150% dalam 2 bulan. Timnya sangat profesional dan responsif!',
    rating: 5,
    initials: 'BS',
  },
  {
    id: 2,
    name: 'Siti Aisyah',
    role: 'Founder Fashion Store',
    content: 'Landing page yang dibuat sangat efektif. Conversion rate kami mencapai 40%! Sangat direkomendasikan untuk UMKM yang ingin go digital.',
    rating: 5,
    initials: 'SA',
  },
  {
    id: 3,
    name: 'Andi Wijaya',
    role: 'CEO Konsultan Pro',
    content: 'Mereka tidak hanya bikin website, tapi benar-benar memahami bisnis kami. Leads meningkat 300% setelah menggunakan website baru.',
    rating: 5,
    initials: 'AW',
  },
]

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(1)

  const next = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }
  const prev = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }
  const goTo = (idx: number) => {
    setDirection(idx > currentIndex ? 1 : -1)
    setCurrentIndex(idx)
  }

  const t = testimonials[currentIndex]

  return (
    <section className="py-20 bg-primary overflow-hidden">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="inline-block bg-white/10 text-white/80 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
            Testimoni
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Apa Kata Klien Kami
          </h2>
          <p className="text-white/60">
            Kepercayaan klien adalah bukti terbaik dari kualitas layanan kami
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <div className="relative min-h-[220px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={t.id}
                custom={direction}
                initial={{ opacity: 0, x: direction * 60, scale: 0.97 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: direction * -60, scale: 0.97 }}
                transition={{ duration: 0.4, ease }}
                className="glass-card rounded-2xl p-8 relative"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                  ))}
                </div>

                <p className="text-text-secondary text-lg leading-relaxed mb-6 italic font-serif">
                  &ldquo;{t.content}&rdquo;
                </p>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-bold text-primary">{t.name}</p>
                    <p className="text-text-secondary text-sm">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-white/30 text-white/70 hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goTo(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-accent' : 'w-2 bg-white/30'}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-white/30 text-white/70 hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </Container>
    </section>
  )
}
