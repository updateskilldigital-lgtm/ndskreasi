'use client'

import { Container } from '@/components/ui/Container'
import { Rocket, Target, TrendingUp, Clock, ShieldCheck, BarChart } from 'lucide-react'
import { motion } from 'framer-motion'

const benefits = [
  { icon: Target,      title: 'Conversion-First',   description: 'Website didesain untuk mengkonversi visitor menjadi leads & penjualan nyata.' },
  { icon: Rocket,      title: 'Fast Delivery',       description: 'Website siap dalam 3–7 hari, jauh lebih cepat dari rata-rata agensi.' },
  { icon: TrendingUp,  title: 'Include Tracking',    description: 'Meta Pixel, GA4, dan WhatsApp API sudah terintegrasi sejak awal.' },
  { icon: Clock,       title: '24/7 Support',        description: 'Tim support siap membantu kapan pun Anda butuhkan melalui WhatsApp.' },
  { icon: ShieldCheck, title: 'Keamanan Terjamin',   description: 'SSL certificate, daily backup otomatis, dan proteksi dari serangan umum.' },
  { icon: BarChart,    title: 'Data-Driven',         description: 'Setiap keputusan desain didasarkan pada data analytics dan riset pasar.' },
]

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

export function Benefits() {
  return (
    <section className="py-20 bg-white">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <span className="inline-block bg-accent/10 text-accent text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
            Kenapa Harus Kami
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4">
            Lebih dari Sekadar Pembuatan Website
          </h2>
          <p className="text-text-secondary">
            Kami membantu Anda membangun mesin penjualan digital yang sesungguhnya
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map(({ icon: Icon, title, description }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: index * 0.08, ease }}
              className="group flex gap-4 p-5 rounded-xl border border-gray-100 hover:border-accent/30 hover:bg-background-alt transition-all duration-200"
            >
              <div className="shrink-0 w-11 h-11 bg-primary/8 rounded-lg flex items-center justify-center group-hover:bg-accent group-hover:scale-110 transition-all">
                <Icon className="h-5 w-5 text-primary group-hover:text-white transition-colors" />
              </div>
              <div>
                <h3 className="font-bold text-primary mb-1">{title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
