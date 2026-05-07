'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Container } from '@/components/ui/Container'
import { Card } from '@/components/ui/Card'
import { Eye, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const portfolioItems = [
  {
    id: 1,
    title: 'Website Cafe Bahagia',
    category: 'Kuliner',
    image: 'https://placehold.co/600x400/0f2c6e/f97316?text=Cafe+Bahagia',
    description: 'Website pemesanan online dengan sistem loyalty point',
    result: '+150% orders in 2 months',
  },
  {
    id: 2,
    title: 'Landing Page Fashion Store',
    category: 'Fashion',
    image: 'https://placehold.co/600x400/0f2c6e/f97316?text=Fashion+Store',
    description: 'High-converting landing page untuk campaign Ramadhan',
    result: '40% conversion rate',
  },
  {
    id: 3,
    title: 'Website Jasa Konsultan',
    category: 'Jasa',
    image: 'https://placehold.co/600x400/0f2c6e/f97316?text=Konsultan',
    description: 'Portfolio digital dengan lead generation system',
    result: '300% more leads',
  },
]

const categories = ['Semua', 'Kuliner', 'Fashion', 'Jasa']

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

export function Portfolio() {
  const [activeCategory, setActiveCategory] = useState('Semua')
  const [selectedItem, setSelectedItem] = useState<typeof portfolioItems[0] | null>(null)

  const filteredItems = activeCategory === 'Semua'
    ? portfolioItems
    : portfolioItems.filter((item) => item.category === activeCategory)

  return (
    <section className="py-20 bg-background-alt" id="portfolio">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <span className="inline-block bg-accent/10 text-accent text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
            Portofolio
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4">
            Proyek yang Telah Kami Selesaikan
          </h2>
          <p className="text-text-secondary">
            Lihat hasil nyata yang telah kami capai untuk klien kami
          </p>
        </motion.div>

        {/* Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${activeCategory === category
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-text-secondary hover:border-primary hover:text-primary'
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: index * 0.1, ease }}
                layout
              >
                <Card className="group cursor-pointer h-full" onClick={() => setSelectedItem(item)}>
                  <div className="relative overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-primary/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="flex items-center gap-2 bg-white/90 text-primary font-semibold text-sm px-4 py-2 rounded-lg">
                        <Eye className="h-4 w-4" /> Lihat Detail
                      </div>
                    </div>
                    <span className="absolute top-3 right-3 bg-white text-primary text-xs font-bold px-2.5 py-1 rounded-full shadow">
                      {item.category}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-primary mb-1">{item.title}</h3>
                    <p className="text-text-secondary text-sm mb-3">{item.description}</p>
                    <span className="inline-block bg-accent/10 text-accent text-xs font-semibold px-3 py-1 rounded-full">
                      {item.result}
                    </span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="text-center mt-10">
          <Link href="/portfolio">
            <button className="inline-flex items-center gap-2 border border-primary text-primary hover:bg-primary hover:text-white font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm">
              Lihat Semua Portofolio
              <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
        </div>
      </Container>

      {/* Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 24 }}
              transition={{ duration: 0.3, ease }}
              className="glass-card rounded-2xl max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={selectedItem.image} alt={selectedItem.title} className="w-full h-52 object-cover rounded-t-2xl" />
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-primary">{selectedItem.title}</h3>
                    <span className="text-xs text-accent font-semibold">{selectedItem.category}</span>
                  </div>
                  <button onClick={() => setSelectedItem(null)} className="text-text-secondary hover:text-primary text-lg">✕</button>
                </div>
                <p className="text-text-secondary text-sm mb-4">{selectedItem.description}</p>
                <div className="bg-accent/10 rounded-xl p-4 mb-4 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-accent">{selectedItem.result}</p>
                    <p className="text-xs text-text-secondary">Hasil yang dicapai</p>
                  </div>
                </div>
                <Link href="/#lead-form" onClick={() => setSelectedItem(null)}>
                  <button className="w-full py-2.5 bg-accent hover:bg-accent-dark text-white rounded-lg font-semibold transition-colors text-sm">
                    Buat Proyek Serupa
                  </button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
