'use client'

import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Code, Layout, ShoppingBag, CheckCircle, Sparkles, Zap, Shield } from 'lucide-react'
import { motion } from 'framer-motion'

const services = [
  {
    slug: 'website-dev',
    icon: Code,
    title: 'Premium Website Development',
    description: 'Website eksklusif dengan design custom dan performa maksimal untuk bisnis premium Anda.',
    price: 'Mulai Rp8,9jt',
    features: ['Custom premium design', 'Advanced SEO optimization', 'Meta Pixel + GA4 Setup', 'Priority WhatsApp API', '30 hari priority support'],
    highlight: true,
  },
  {
    slug: 'landing-page',
    icon: Layout,
    title: 'High-Converting Landing Page',
    description: 'Landing page yang dioptimalkan untuk konversi maksimal pada campaign produk Anda.',
    price: 'Mulai Rp4,5jt',
    features: ['A/B testing ready', 'Professional copywriting', 'Lightning fast <1.5s', 'CRM integration', 'Analytics dashboard'],
    highlight: false,
  },
  {
    slug: 'digital-products',
    icon: ShoppingBag,
    title: 'Digital Products & Assets',
    description: 'Template premium, UI kit, dan aset digital berkualitas tinggi untuk skalabilitas bisnis.',
    price: 'Mulai Rp499rb',
    features: ['Instant download', 'Lifetime updates', 'Commercial license', 'Premium support', 'Source files included'],
    highlight: false,
  },
]

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

export function Services() {
  return (
    <section className="py-24 bg-bg-secondary" id="services">
      <Container>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-flex items-center gap-2 bg-gradient-to-r from-gold-500/15 to-gold-600/10 text-gold-600 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-gold-500/20 mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            Layanan Premium Kami
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-navy-900 mb-6 leading-tight">
            Solusi Digital Kelas Dunia<br />
            <span className="text-gradient-gold">untuk Bisnis Anda</span>
          </h2>
          <p className="text-lg text-text-secondary leading-relaxed">
            Pilih paket layanan yang disesuaikan dengan kebutuhan dan ambisi pertumbuhan bisnis Anda
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <motion.div
                key={service.slug}
                initial={{ opacity: 0, y: 48 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, delay: index * 0.15, ease }}
                className={`relative group card-premium rounded-3xl flex flex-col h-full
                  ${service.highlight 
                    ? 'ring-2 ring-gold-500 shadow-gold scale-105 z-10' 
                    : 'border border-gray-100'
                  }`}
              >
                {service.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                    <span className="bg-gradient-to-r from-gold-500 to-gold-600 text-white text-xs font-bold px-5 py-2 rounded-full shadow-lg shadow-gold-500/30 flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5" />
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div className="p-8 flex flex-col h-full">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110
                    ${service.highlight 
                      ? 'bg-gradient-to-br from-gold-500 to-gold-600 shadow-lg shadow-gold-500/30' 
                      : 'bg-gradient-to-br from-navy-800 to-navy-900'
                    }`}
                  >
                    <Icon className={`h-8 w-8 ${service.highlight ? 'text-white' : 'text-white'}`} />
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-display text-2xl font-bold text-navy-900 mb-3">{service.title}</h3>
                  <p className="text-text-secondary text-base mb-6 leading-relaxed">{service.description}</p>

                  {/* Price */}
                  <div className="mb-6 pb-6 border-b border-gray-100">
                    <span className={`text-3xl font-display font-extrabold ${service.highlight ? 'text-gradient-gold' : 'text-navy-900'}`}>
                      {service.price}
                    </span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3.5 mb-8 flex-1">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm text-text-secondary">
                        <span className="shrink-0 w-5 h-5 rounded-full bg-green-50 flex items-center justify-center mt-0.5">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Link href={`/services/${service.slug}`}>
                    <button className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 group-hover:-translate-y-0.5
                      ${service.highlight
                        ? 'bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-white shadow-lg shadow-gold-500/30'
                        : 'border-2 border-navy-900 text-navy-900 hover:bg-navy-900 hover:text-white'
                      }`}
                    >
                      Pelajari Lebih Lanjut →
                    </button>
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-center"
        >
          {[
            { icon: Zap, title: 'Express Delivery', desc: 'Siap dalam 3-7 hari kerja' },
            { icon: Shield, title: 'Money-Back Guarantee', desc: 'Garansi uang kembali 100%' },
            { icon: Sparkles, title: 'Premium Quality', desc: 'Design award-winning' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center gap-2 p-4">
              <Icon className="w-6 h-6 text-gold-500" />
              <p className="font-semibold text-navy-900">{title}</p>
              <p className="text-sm text-text-secondary">{desc}</p>
            </div>
          ))}
        </motion.div>
      </Container>
    </section>
  )
}
