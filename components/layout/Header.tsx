'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Phone } from 'lucide-react'
import { Container } from '@/components/ui/Container'

const navigation = [
  { name: 'Beranda', href: '/' },
  { name: 'Layanan', href: '/services' },
  { name: 'Portofolio', href: '/portfolio' },
  { name: 'Blog', href: '/blog' },
  { name: 'Tentang', href: '/about' },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled
        ? 'bg-white/80 backdrop-blur-xl shadow-sm border-b border-white/20'
        : 'bg-white border-b border-gray-100'
    }`}>
      <Container>
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 text-xl font-extrabold">
            <span className="text-primary">NDS</span>
            <span className="text-accent">Kreasi</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-text-secondary hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">

            <Link href="/#lead-form">
              <button className="bg-accent hover:bg-accent-dark text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-colors">
                Konsultasi Gratis
              </button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-text-secondary"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>
      </Container>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white/90 backdrop-blur-xl border-t border-gray-100 shadow-lg animate-fade-in">
          <div className="flex flex-col px-4 py-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="py-2.5 px-3 text-text-secondary hover:text-primary hover:bg-background-alt rounded-lg transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-2">
              <Link href="/#lead-form" onClick={() => setIsOpen(false)}>
                <button className="w-full bg-accent hover:bg-accent-dark text-white font-bold py-3 rounded-lg transition-colors">
                  Konsultasi Gratis
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
