'use client'

import { useState } from 'react'
import { Download, X, FileText } from 'lucide-react'

export function LeadMagnetButton({ slug }: { slug: string }) {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [unlocked, setUnlocked] = useState(false)

  async function handleUnlock(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)

    await fetch('/api/blog/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim(), name: name.trim(), source: `magnet:${slug}` }),
    }).catch(() => {})

    setLoading(false)
    setUnlocked(true)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 bg-[#1a1564]/10 hover:bg-[#1a1564]/20 text-[#1a1564] font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors"
      >
        <FileText className="h-4 w-4" />
        Download Ringkasan PDF
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="bg-[#1a1564] px-6 py-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-bold text-white">Download Ringkasan Gratis</p>
                  <p className="text-white/70 text-xs mt-0.5">Dapatkan versi PDF artikel ini + tips eksklusif</p>
                </div>
                <button onClick={() => setOpen(false)} className="text-white/60 hover:text-white ml-3">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {unlocked ? (
                <div className="text-center">
                  <div className="text-4xl mb-3">🎉</div>
                  <p className="font-bold text-gray-900 mb-1">Terima kasih!</p>
                  <p className="text-sm text-gray-500 mb-4">Klik tombol di bawah untuk membuka & menyimpan PDF.</p>
                  <a
                    href={`/blog/${slug}/print`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-[#1a1564] text-white font-semibold py-2.5 rounded-lg text-sm hover:bg-[#2520a8] transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    Buka & Simpan PDF
                  </a>
                  <p className="text-xs text-gray-400 mt-3">Halaman baru terbuka → Ctrl+P → Save as PDF</p>
                </div>
              ) : (
                <form onSubmit={handleUnlock} className="space-y-3">
                  <p className="text-sm text-gray-600 mb-3">Masukkan email Anda untuk mendapatkan akses:</p>
                  <div>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Nama Anda (opsional)"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1564]/20 mb-2"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      placeholder="email@anda.com"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1564]/20"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#f97316] hover:bg-[#ea6c0a] text-white font-semibold py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    <Download className="h-4 w-4" />
                    {loading ? 'Memproses...' : 'Dapatkan PDF Gratis'}
                  </button>
                  <p className="text-xs text-gray-400 text-center">Gratis selamanya · Tidak ada spam</p>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
