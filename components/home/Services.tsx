'use client'

import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Code, Layout, ShoppingBag, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'

const services = [
  {
    slug: 'website-dev',
    icon: Code,
    title: 'Website Development',
    description: 'Website profesional berbasis konversi. Fast delivery 3–7 hari kerja.',
    price: 'Mulai Rp6,9jt',
    features: ['Responsive mobile-first', 'SEO optimized', 'Meta Pixel + GA4', 'WhatsApp API'],
    highlight: false,
  },
  {
    slug: 'landing-page',
    icon: Layout,
    title: 'Landing Page',
    description: 'High-converting landing page untuk campaign & product launch.',
    price: 'Mulai Rp3,5jt',
    features: ['A/B testing ready', 'Copywriting include', 'Fast loading <2s', 'Form integration'],
    highlight: true,
  },
  {
    slug: 'digital-products',
    icon: ShoppingBag,
    title: 'Digital Products',
    description: 'Template, UI kit, dan aset digital siap pakai untuk bisnis Anda.',
    price: 'Mulai Rp299rb',
    features: ['Download langsung', 'Lifetime access', 'Update gratis 6 bulan', 'Commercial license'],
    highlight: false,
  },
]

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

export function Services() {
  return (
    <section className="py-20 bg-background-alt" id="services">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="inline-block bg-accent/10 text-accent text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
            Layanan Kami
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4">
            Solusi Digital untuk Bisnis Anda
          </h2>
          <p className="text-text-secondary">
            Pilih layanan yang sesuai dengan kebutuhan dan budget bisnis Anda
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <motion.div
                key={service.slug}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: index * 0.15, ease }}
                className={`relative bg-white rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col
                  ${service.highlight
                    ? 'border-accent shadow-lg shadow-accent/10 ring-1 ring-accent'
                    : 'border-gray-200 shadow-sm'
                  }`}
              >
                {service.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-accent text-white text-xs font-bold px-4 py-1 rounded-full shadow">
                      Paling Populer
                    </span>
                  </div>
                )}

                <div className="p-7 flex flex-col h-full">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 ${service.highlight ? 'bg-accent' : 'bg-primary/10'}`}>
                    <Icon className={`h-7 w-7 ${service.highlight ? 'text-white' : 'text-primary'}`} />
                  </div>

                  <h3 className="text-xl font-bold text-primary mb-2">{service.title}</h3>
                  <p className="text-text-secondary text-sm mb-5">{service.description}</p>

                  <div className="mb-5">
                    <span className="text-2xl font-extrabold text-accent">{service.price}</span>
                  </div>

                  <ul className="space-y-2.5 mb-7 flex-1">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2.5 text-sm text-text-secondary">
                        <CheckCircle className="h-4 w-4 text-accent shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link href={`/services/${service.slug}`}>
                    <button className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-colors
                      ${service.highlight
                        ? 'bg-accent hover:bg-accent-dark text-white'
                        : 'border border-primary text-primary hover:bg-primary hover:text-white'
                      }`}>
                      Pelajari Lebih Lanjut →
                    </button>
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
