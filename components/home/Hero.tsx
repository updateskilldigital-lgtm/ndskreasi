'use client'

import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { ArrowRight, CheckCircle, Globe, Zap, TrendingUp, Star, Crown, Shield, Award } from 'lucide-react'
import { motion } from 'framer-motion'

const stats = [
  { value: '45+', label: 'Klien Premium' },
  { value: '3 Hari', label: 'Express Delivery' },
  { value: '98%', label: 'Client Satisfaction' },
  { value: '2+ Thn', label: 'Industry Experience' },
]

const highlights = [
  'Premium design dengan attention to detail',
  'Full SEO optimization & analytics setup',
  'Priority support 30 hari setelah launch',
  'Money-back guarantee jika tidak sesuai',
]

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy-900 text-white">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-gold-500/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-gold-600/15 blur-[100px]" />
        
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgNDBWMGg0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDIxMiwxNzUsNTUsMC4wMykiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==')] opacity-30" />
      </div>

      <Container>
        <div className="relative grid lg:grid-cols-2 gap-12 xl:gap-20 items-center py-24 md:py-32 xl:py-40">

          {/* Left Content */}
          <motion.div
            initial={{ x: -40 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.8, ease }}
          >
            {/* Premium Badge */}
            <motion.div
              initial={{ y: -16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1, ease }}
              className="inline-flex items-center gap-2.5 bg-gradient-to-r from-gold-500/20 to-gold-600/10 backdrop-blur-md rounded-full px-5 py-2 mb-8 border border-gold-500/30 shadow-gold"
            >
              <Crown className="w-4 h-4 text-gold-400" />
              <span className="text-sm font-semibold text-gold-400 tracking-wide">PREMIUM WEB DEVELOPMENT</span>
            </motion.div>

            {/* Main Headline with Serif Font */}
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2, ease }}
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6 tracking-tight"
            >
              Website Elegan yang<br />
              <span className="text-gradient-gold">Meningkatkan Nilai</span><br />
              Bisnis Anda
            </motion.h1>

            {/* Enhanced Description */}
            <motion.p
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3, ease }}
              className="text-lg lg:text-xl text-slate-300 mb-8 max-w-xl leading-relaxed font-light"
            >
              Kami menciptakan <strong className="text-white font-medium">digital experience premium</strong> yang mengkonversi visitor menjadi loyal customers. 
              Design elegan, performa maksimal, hasil terukur.
            </motion.p>

            {/* Feature Highlights */}
            <ul className="space-y-3 mb-10">
              {highlights.map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.1, ease }}
                  className="flex items-start gap-3 text-slate-200"
                >
                  <span className="shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center shadow-gold mt-0.5">
                    <CheckCircle className="h-3.5 w-3.5 text-white" />
                  </span>
                  <span className="text-base">{item}</span>
                </motion.li>
              ))}
            </ul>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7, ease }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/#lead-form">
                <button className="group inline-flex items-center gap-2.5 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 text-base shadow-lg shadow-gold-500/30 hover:shadow-xl hover:shadow-gold-500/40 hover:-translate-y-1">
                  Konsultasi Gratis Sekarang
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="/portfolio">
                <button className="inline-flex items-center gap-2.5 border border-white/20 hover:border-gold-500/50 text-white font-medium px-8 py-4 rounded-xl transition-all duration-300 text-base bg-white/5 hover:bg-white/10 backdrop-blur-sm">
                  <Award className="h-5 w-5" />
                  Lihat Portofolio
                </button>
              </Link>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="mt-10 flex items-center gap-6 text-sm text-slate-400"
            >
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-gold-500" />
                <span>Secure & Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-gold-500 text-gold-500" />
                <span>5-Star Rated</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right - Premium Card Display */}
          <motion.div
            initial={{ x: 40 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease }}
            className="hidden lg:flex justify-center items-center"
          >
            <div className="relative py-12 px-8 w-full flex justify-center">
              <div className="relative w-full max-w-[320px] xl:max-w-[360px]">

                {/* Main Premium Result Card */}
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.5, ease }}
                  className="glass-card rounded-3xl p-6 shadow-2xl relative z-10"
                >
                  {/* Card Header */}
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                    <div className="w-12 h-12 shrink-0 bg-gradient-to-br from-gold-500 to-gold-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Globe className="h-6 w-6 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-display font-bold text-text-primary text-sm truncate">Website Premium Client</p>
                      <p className="text-xs text-text-secondary">client-premium.com</p>
                    </div>
                    <span className="ml-auto shrink-0 flex items-center gap-1.5 text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Live
                    </span>
                  </div>

                  {/* Performance Metrics */}
                  <div className="space-y-3 mb-4">
                    {[
                      { icon: TrendingUp,  label: 'Conversion Rate', value: '+245%', color: 'text-green-600', bg: 'bg-green-50' },
                      { icon: Zap,         label: 'Page Speed',      value: '0.8s',  color: 'text-gold-600', bg: 'bg-gold-50' },
                      { icon: Award,       label: 'Quality Score',   value: '99/100', color: 'text-navy-800', bg: 'bg-slate-100' },
                    ].map(({ icon: Icon, label, value, color, bg }) => (
                      <div key={label} className={`flex items-center justify-between p-3 ${bg} rounded-xl`}>
                        <div className="flex items-center gap-2 text-xs text-text-secondary">
                          <Icon className={`h-4 w-4 shrink-0 ${color}`} />
                          <span className="font-medium">{label}</span>
                        </div>
                        <span className={`text-sm font-bold ml-2 shrink-0 ${color}`}>{value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Badge */}
                  <div className="text-center text-xs text-text-secondary bg-gradient-to-r from-gold-50 to-gold-100/50 border border-gold-200 rounded-xl py-3">
                    Delivered in <strong className="text-gold-600 font-semibold">5 business days</strong> ✨
                  </div>
                </motion.div>

                {/* Floating: Google Rating Badge */}
                <motion.div
                  initial={{ opacity: 0, y: -15, scale: 0.85 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.9, ease }}
                  className="absolute -top-8 -right-6 xl:-right-8 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3 border border-gray-100 z-20"
                >
                  <div className="text-2xl">&#11088;</div>
                  <div>
                    <p className="text-xs font-bold text-gray-800 leading-tight">Google Reviews</p>
                    <div className="flex gap-0.5 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Floating: Limited Slots Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.7, rotate: -10 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ duration: 0.6, delay: 1.1, ease }}
                  className="absolute -bottom-8 -left-6 xl:-left-8 bg-gradient-to-r from-gold-500 to-gold-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-xl shadow-gold-500/40 whitespace-nowrap z-20"
                >
                  🔥 Only 3 slots left this month
                </motion.div>

              </div>
            </div>
          </motion.div>

        </div>
      </Container>

      {/* Stats Bar - Premium Version */}
      <div className="relative border-t border-gold-500/20 bg-navy-900/80 backdrop-blur-sm">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gold-500/10">
            {stats.map(({ value, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + i * 0.1, ease }}
                className="py-6 px-4 text-center"
              >
                <div className="text-2xl md:text-3xl font-display font-extrabold text-gradient-gold">{value}</div>
                <div className="text-xs text-slate-400 mt-1 font-medium tracking-wide uppercase">{label}</div>
              </motion.div>
            ))}
          </div>
        </Container>
      </div>
    </section>
  )
}
