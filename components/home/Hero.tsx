'use client'

import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { ArrowRight, CheckCircle, Globe, Zap, TrendingUp, Star } from 'lucide-react'
import { motion } from 'framer-motion'

const stats = [
  { value: '45+', label: 'Klien Aktif' },
  { value: '3 Hari', label: 'Rata-rata Delivery' },
  { value: '98%', label: 'Kepuasan Klien' },
  { value: '2 Thn', label: 'Pengalaman' },
]

const highlights = [
  'Website siap dalam 3-7 hari kerja',
  'Termasuk SEO, Meta Pixel & GA4',
  'Support 30 hari setelah launch',
]

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

export function Hero() {
  return (
       <section className="text-white md:px-6 lg:px-8 bg-gradient-to-r from-theme-400 to-theme-700">
      {/* Gradient & glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1564] via-[#1e1fa8]/60 to-[#0f2c6e]" />
        <div className="absolute right-0 w-[500px] h-[500px] rounded-full bg-[#3730d0]/25 blur-[100px]" />
        <div className="absolute bottom-0 -left-10 w-72 h-72 rounded-full bg-accent/10 blur-[80px]" />
      </div>

      <Container>
        {/* gap lebih kecil di lg, lebih besar di xl */}
        <div className="relative grid lg:grid-cols-2 gap-8 xl:gap-14 items-center py-20 md:py-24 xl:py-28">

          {/* Left */}
          <motion.div
            initial={{ x: -40 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.7, ease }}
          >
            <motion.div
              initial={{ y: -16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1, ease }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6 border border-white/10"
            >
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-sm font-medium text-white/90">Dipercaya 45+ Bisnis di Indonesia</span>
            </motion.div>

            {/* text-5xl di lg, text-6xl di xl */}
            <h1 className="text-3xl font-bold text-white lg:text-4xl font-extrabold text-white leading-[1.15] mb-5 tracking-tight">
              Website yang Tidak<br />
              Hanya Keren, Tapi<br />
              <span className="text-accent">Menghasilkan.</span>
            </h1>


            <p className="text-base lg:text-lg text-white/65 mb-7 max-w-md leading-relaxed">
              Kami bangun <strong className="text-white font-semibold">mesin penjualan digital</strong> yang mengkonversi visitor menjadi pelanggan nyata. Mulai dari Rp3,5jt, siap dalam 7 hari.
            </p>

            <ul className="space-y-2.5 mb-8">
              {highlights.map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease }}
                  className="flex items-center gap-3 text-white/80 text-sm"
                >
                  <span className="shrink-0 w-5 h-5 rounded-md bg-accent/20 flex items-center justify-center">
                    <CheckCircle className="h-3.5 w-3.5 text-accent" />
                  </span>
                  {item}
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6, ease }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Link href="/#lead-form">
                <button className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-bold px-7 py-3.5 rounded-xl transition-all duration-200 text-base shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/40 hover:-translate-y-0.5">
                  Konsultasi Gratis
                  <ArrowRight className="h-5 w-5" />
                </button>
              </Link>
              <Link href="/portfolio">
                <button className="inline-flex items-center gap-2 border border-white/20 hover:border-white/50 text-white font-semibold px-7 py-3.5 rounded-xl transition-all duration-200 text-base bg-white/5 hover:bg-white/10">
                  Lihat Portofolio
                </button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right — card proporsional */}
          <motion.div
            initial={{ x: 40 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease }}
            className="hidden lg:flex justify-center items-center"
          >
            {/* py/px memberi ruang untuk floating card tanpa overflow */}
            <div className="relative py-8 px-6 w-full flex justify-center">
              <div className="relative w-full max-w-[280px] xl:max-w-[320px]">

                {/* Main result card */}
                <div className="glass-card rounded-2xl p-5 shadow-2xl">
                  <div className="flex items-center gap-2.5 mb-3 pb-3 border-b border-gray-100">
                    <div className="w-9 h-9 shrink-0 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Globe className="h-4 w-4 text-accent" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-text-primary text-xs truncate">Website Cafe Bahagia</p>
                      <p className="text-[11px] text-text-secondary">cafabahagia.com</p>
                    </div>
                    <span className="ml-auto shrink-0 flex items-center gap-1 text-[11px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Online
                    </span>
                  </div>

                  <div className="space-y-2 mb-3">
                    {[
                      { icon: TrendingUp,  label: 'Penjualan',    value: '+150%', color: 'text-green-600' },
                      { icon: Zap,         label: 'Loading speed', value: '0.9s',  color: 'text-accent' },
                      { icon: CheckCircle, label: 'Uptime',        value: '99.9%', color: 'text-primary' },
                    ].map(({ icon: Icon, label, value, color }) => (
                      <div key={label} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-1.5 text-[11px] text-text-secondary">
                          <Icon className={`h-3 w-3 shrink-0 ${color}`} />
                          {label}
                        </div>
                        <span className={`text-xs font-bold ml-2 shrink-0 ${color}`}>{value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="text-center text-[11px] text-text-secondary bg-accent/5 border border-accent/10 rounded-lg py-2">
                    Didelivery dalam <strong className="text-accent">5 hari kerja</strong>
                  </div>
                </div>

                {/* Floating: Google Rating — top-right, dalam batas py-8 px-6 wrapper */}
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.8, ease }}
                  className="absolute -top-6 -right-4 xl:-right-5 bg-white rounded-xl shadow-lg px-3 py-2 flex items-center gap-2 border border-gray-100"
                >
                  <span className="text-base">&#11088;</span>
                  <div>
                    <p className="text-[11px] font-bold text-gray-700 leading-tight">Google Rating</p>
                    <div className="flex gap-0.5 mt-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Floating: slot badge — bottom-left, dalam batas wrapper */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ duration: 0.5, delay: 1.0, ease }}
                  className="absolute -bottom-6 -left-4 xl:-left-5 bg-accent text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg shadow-accent/40 whitespace-nowrap"
                >
                  5 slot tersisa bulan ini
                </motion.div>

              </div>
            </div>
          </motion.div>

        </div>
      </Container>

      {/* Stats bar */}
      <div className="border-t border-white/10 bg-black/20">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
            {stats.map(({ value, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 + i * 0.1, ease }}
                className="py-5 px-4 text-center"
              >
                <div className="text-xl md:text-2xl font-extrabold text-accent">{value}</div>
                <div className="text-xs text-white/55 mt-0.5">{label}</div>
              </motion.div>
            ))}
          </div>
        </Container>
      </div>
    </section>
  )
}
