'use client'

import { useState, useEffect, useRef } from 'react'
import { X, MessageCircle, ChevronRight } from 'lucide-react'

const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER ?? '6281234567890'

export function ScrollLeadForm({ slug }: { slug?: string }) {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const triggered = useRef(false)

  useEffect(() => {
    if (dismissed) return

    // Don't re-show if dismissed in this session
    if (sessionStorage.getItem('scroll-lead-dismissed')) return

    const onScroll = () => {
      if (triggered.current) return
      const scrolled = window.scrollY + window.innerHeight
      const total = document.documentElement.scrollHeight
      if (scrolled / total >= 0.6) {
        triggered.current = true
        setVisible(true)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [dismissed])

  function dismiss() {
    setVisible(false)
    setDismissed(true)
    sessionStorage.setItem('scroll-lead-dismissed', '1')
  }

  async function handleWa(e: React.FormEvent) {
    e.preventDefault()
    if (email.trim()) {
      fetch('/api/blog/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), name: name.trim(), source: slug }),
      }).catch(() => {})
    }
    if (slug) {
      fetch(`/api/blog/${slug}/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'wa_click' }),
      }).catch(() => {})
    }
    const msg = name.trim()
      ? `Halo NDS Kreasi, saya ${name.trim()} ingin konsultasi gratis mengenai bisnis digital saya.`
      : 'Halo NDS Kreasi, saya ingin konsultasi gratis mengenai bisnis digital saya.'
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank')
    setSent(true)
    setTimeout(dismiss, 2000)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-[#1a1564] px-5 py-4 flex items-start justify-between">
          <div>
            <p className="font-bold text-white text-sm">Mau bisnis digital Anda berkembang?</p>
            <p className="text-white/70 text-xs mt-0.5">Konsultasi gratis — 0 biaya, langsung WA</p>
          </div>
          <button
            onClick={dismiss}
            className="text-white/60 hover:text-white transition-colors ml-3 mt-0.5 shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          {sent ? (
            <div className="text-center py-2">
              <div className="text-2xl mb-2">✅</div>
              <p className="text-sm font-semibold text-gray-800">Terima kasih!</p>
              <p className="text-xs text-gray-500 mt-1">Kami akan segera menghubungi Anda.</p>
            </div>
          ) : (
            <form onSubmit={handleWa} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Nama Anda <span className="text-gray-400">(opsional)</span>
                </label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Budi Santoso"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1564]/20 focus:border-[#1a1564]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Email <span className="text-gray-400">(opsional, untuk tips gratis)</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="budi@email.com"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1564]/20 focus:border-[#1a1564]"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#25d366] hover:bg-[#20ba58] text-white font-semibold py-2.5 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                Chat WhatsApp Sekarang
                <ChevronRight className="h-4 w-4" />
              </button>
              <p className="text-center text-xs text-gray-400">
                Atau{' '}
                <a href="/#lead-form" onClick={dismiss} className="text-[#1a1564] hover:underline">
                  isi form di sini
                </a>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
