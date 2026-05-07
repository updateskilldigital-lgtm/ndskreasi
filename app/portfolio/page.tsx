'use client'

import { useState } from 'react'
import { Container } from '@/components/ui/Container'
import { Card } from '@/components/ui/Card'
import { ExternalLink, Eye } from 'lucide-react'
import { portfolioItems, portfolioCategories } from '@/lib/data/portfolio'
import type { PortfolioItem } from '@/lib/data/portfolio'

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState('Semua')
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null)

  const filteredItems = activeCategory === 'Semua'
    ? portfolioItems
    : portfolioItems.filter((item) => item.category === activeCategory)

  return (
    <>
      <section className="py-20">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Portofolio Kami</h1>
            <p className="text-text-secondary text-lg">
              Lihat proyek-proyek yang telah kami selesaikan untuk klien kami
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {portfolioCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2 rounded-full transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-accent text-primary font-semibold shadow-md'
                    : 'bg-white border border-gray-200 text-text-secondary hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <Card key={item.id} className="group cursor-pointer overflow-hidden" onClick={() => setSelectedItem(item)}>
                <div className="relative overflow-hidden h-48">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <Eye className="h-6 w-6 text-white" />
                    <ExternalLink className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-primary text-lg">{item.title}</h3>
                    <span className="text-xs text-accent font-semibold">{item.category}</span>
                  </div>
                  <p className="text-text-secondary text-sm mb-3 line-clamp-2">{item.description}</p>
                  <p className="text-xs text-accent font-semibold">{item.result}</p>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedItem(null)}
        >
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <img src={selectedItem.image} alt={selectedItem.title} className="w-full h-64 object-cover rounded-t-2xl" />
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-primary">{selectedItem.title}</h3>
                  <p className="text-text-secondary">Client: {selectedItem.client}</p>
                </div>
                <button onClick={() => setSelectedItem(null)} className="text-text-secondary hover:text-primary text-2xl">✕</button>
              </div>
              <div className="flex gap-4 mb-4 text-sm">
                <span className="bg-accent/10 text-accent px-3 py-1 rounded-full">{selectedItem.category}</span>
                <span className="text-text-secondary">{selectedItem.year}</span>
              </div>
              <p className="text-text-secondary mb-4">{selectedItem.description}</p>
              <div className="bg-accent/10 rounded-lg p-4 mb-4">
                <p className="text-lg font-bold text-accent">{selectedItem.result}</p>
                <p className="text-sm text-text-secondary">Hasil yang dicapai</p>
              </div>
              <a href="/#lead-form">
                <button className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors">
                  Buat Proyek Serupa
                </button>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
