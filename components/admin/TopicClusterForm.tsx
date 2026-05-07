'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Layers, Loader2, CheckCircle2 } from 'lucide-react'

const PROVIDERS = [
  { value: 'openai', label: 'OpenAI GPT-4o mini' },
  { value: 'claude', label: 'Anthropic Claude' },
  { value: 'gemini', label: 'Google Gemini' },
  { value: 'groq', label: 'Groq (Gratis, Cepat)' },
]

type Result = { pillar: string; clusters: string[]; created: number; skipped: number }

export function TopicClusterForm() {
  const router = useRouter()
  const [topic, setTopic] = useState('')
  const [provider, setProvider] = useState('openai')
  const [wordCount, setWordCount] = useState('1500')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    setError('')

    const res = await fetch('/api/admin/blog/topic-cluster', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, provider, target_words: parseInt(wordCount) }),
    })

    const data = await res.json()
    setLoading(false)

    if (res.ok) {
      setResult(data)
      setTopic('')
      router.push('/admin/blog-generator')
    } else {
      setError(data.error ?? 'Gagal generate cluster')
    }
  }

  return (
    <div className="grid lg:grid-cols-[400px_1fr] gap-6">
      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h2 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
          <Layers className="h-4 w-4 text-[#1a1564]" />
          Generate Topic Cluster
        </h2>
        <p className="text-xs text-gray-500 mb-4">Input 1 topik → AI generate 1 pillar + 8 supporting keywords sekaligus</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Topik Utama</label>
            <input
              value={topic}
              onChange={e => setTopic(e.target.value)}
              required
              placeholder="contoh: jasa pembuatan website"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1564]/20 focus:border-[#1a1564]"
            />
            <p className="text-xs text-gray-400 mt-1">AI akan membuat 1 pillar article + 8 supporting articles</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">AI Provider</label>
            <select
              value={provider}
              onChange={e => setProvider(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1564]/20 focus:border-[#1a1564]"
            >
              {PROVIDERS.map(p => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Target Kata per Artikel</label>
            <input
              type="number"
              value={wordCount}
              onChange={e => setWordCount(e.target.value)}
              min={500}
              max={4000}
              step={100}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1564]/20"
            />
            <p className="text-xs text-gray-400 mt-1">Pillar article otomatis 2× lebih panjang</p>
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1a1564] hover:bg-[#2520a8] text-white font-semibold py-2.5 rounded-lg transition-colors text-sm disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Generating cluster... (10-20 detik)</>
            ) : (
              <><Layers className="h-4 w-4" /> Generate Cluster</>
            )}
          </button>
        </form>
      </div>

      {/* Info / Result */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        {result ? (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <h3 className="font-semibold text-gray-900">{result.created} keyword berhasil ditambahkan</h3>
            </div>
            <div className="space-y-2">
              <div className="p-3 bg-[#1a1564]/5 border border-[#1a1564]/10 rounded-lg">
                <span className="text-xs font-bold text-[#1a1564] uppercase tracking-wide">Pillar Article</span>
                <p className="text-sm font-medium text-gray-900 mt-1">{result.pillar}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Supporting Articles ({result.clusters.length})</span>
                <ol className="mt-2 space-y-1">
                  {result.clusters.map((c, i) => (
                    <li key={i} className="text-sm text-gray-700 flex gap-2">
                      <span className="text-gray-400 shrink-0">{i + 1}.</span>
                      {c}
                    </li>
                  ))}
                </ol>
              </div>
              {result.skipped > 0 && (
                <p className="text-xs text-amber-600">{result.skipped} keyword dilewati (sudah ada)</p>
              )}
              <p className="text-xs text-gray-500 mt-2">Mengarahkan ke Blog Generator untuk mulai generate artikel...</p>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col justify-center items-center text-center py-10">
            <Layers className="h-12 w-12 text-gray-200 mb-4" />
            <h3 className="font-semibold text-gray-700 mb-2">Apa itu Topic Cluster?</h3>
            <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
              Strategi SEO terbukti: satu <strong>pillar page</strong> komprehensif didukung banyak <strong>supporting articles</strong> yang saling terhubung — membangun otoritas topik di mata Google.
            </p>
            <div className="mt-5 grid grid-cols-3 gap-3 w-full max-w-sm text-xs text-center">
              {['Topical Authority', 'Internal Linking', 'Rank Faster'].map(f => (
                <div key={f} className="bg-[#1a1564]/5 rounded-lg p-2.5 text-[#1a1564] font-semibold">{f}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
