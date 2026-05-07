'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Upload } from 'lucide-react'

const PROVIDERS = [
  { value: 'openai',  label: 'OpenAI GPT-4o mini' },
  { value: 'claude',  label: 'Anthropic Claude' },
  { value: 'gemini',  label: 'Google Gemini' },
  { value: 'groq',    label: 'Groq (Gratis, Cepat)' },
]

const TONES = [
  { value: 'informatif', label: 'Informatif' },
  { value: 'persuasif',  label: 'Persuasif' },
  { value: 'review',     label: 'Review' },
  { value: 'how-to',     label: 'How-to / Tutorial' },
  { value: 'berita',     label: 'Berita' },
]

const INTENTS = [
  { value: 'transaksional', label: '🔥 Transaksional', desc: 'jasa, harga, beli — lead langsung', priority: 9 },
  { value: 'komparasi',     label: '⚖️ Komparasi',     desc: 'vs, terbaik, rekomendasi — warm lead', priority: 7 },
  { value: 'masalah',       label: '🔧 Masalah',       desc: 'cara mengatasi, kenapa — problem-aware', priority: 6 },
  { value: 'informasional', label: '📚 Informasional', desc: 'apa itu, tips — awareness', priority: 5 },
]

type Mode = 'manual' | 'csv'

export function KeywordForm() {
  const router = useRouter()
  const [mode, setMode]           = useState<Mode>('manual')
  const [keywords, setKeywords]   = useState('')
  const [provider, setProvider]   = useState('openai')
  const [tone, setTone]           = useState('informatif')
  const [wordCount, setWordCount] = useState('1500')
  const [intent, setIntent]       = useState('transaksional')
  const [useHumanizer, setUseHumanizer] = useState(false)
  const [loading, setLoading]     = useState(false)
  const [result, setResult]       = useState<{ created: number; skipped: number } | null>(null)
  const [csvPreview, setCsvPreview] = useState<string[]>([])
  const fileRef = useRef<HTMLInputElement>(null)

  function handleCsvFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const text = ev.target?.result as string
      const lines = text
        .split(/\r?\n/)
        .map(l => l.replace(/^["']|["']$/g, '').trim())
        .filter(Boolean)
        .slice(0, 100)
      setKeywords(lines.join('\n'))
      setCsvPreview(lines.slice(0, 5))
    }
    reader.readAsText(file)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    const res = await fetch('/api/admin/blog/keywords', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        keywords,
        ai_provider:   provider,
        focus_tone:    tone,
        target_words:  wordCount,
        intent,
        use_humanizer: useHumanizer,
      }),
    })

    setLoading(false)

    let data: Record<string, unknown> = {}
    try { data = await res.json() } catch { /* non-JSON */ }

    if (res.ok) {
      setResult(data as { created: number; skipped: number })
      setKeywords('')
      setCsvPreview([])
      if (fileRef.current) fileRef.current.value = ''
      router.refresh()
    } else {
      alert((data.error as string) ?? `Server error ${res.status}`)
    }
  }

  const kwCount = keywords.split('\n').filter(k => k.trim()).length
  const selectedIntent = INTENTS.find(i => i.value === intent)!

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Plus className="h-4 w-4 text-[#1a1564]" />
        Tambah Keywords
      </h2>

      {/* Mode tabs */}
      <div className="flex bg-gray-100 rounded-lg p-1 mb-4 text-xs font-semibold">
        <button type="button" onClick={() => setMode('manual')}
          className={`flex-1 py-1.5 rounded-md transition-colors ${mode === 'manual' ? 'bg-white text-[#1a1564] shadow-sm' : 'text-gray-500'}`}>
          Manual
        </button>
        <button type="button" onClick={() => setMode('csv')}
          className={`flex-1 py-1.5 rounded-md transition-colors ${mode === 'csv' ? 'bg-white text-[#1a1564] shadow-sm' : 'text-gray-500'}`}>
          Import CSV
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'manual' ? (
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Keywords <span className="text-gray-400">(1 per baris, max 20)</span>
            </label>
            <textarea
              value={keywords}
              onChange={e => setKeywords(e.target.value)}
              rows={5}
              required
              placeholder={"jasa pembuatan website murah\nharga website company profile\ncara memilih hosting terbaik"}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1564]/20 focus:border-[#1a1564] resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">{kwCount} keyword</p>
          </div>
        ) : (
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Upload CSV <span className="text-gray-400">(1 keyword per baris, max 100)</span>
            </label>
            <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-[#1a1564]/40 hover:bg-gray-50 transition-colors">
              <Upload className="h-5 w-5 text-gray-400 mb-1.5" />
              <span className="text-xs text-gray-500">Klik atau drag & drop file CSV</span>
              <input ref={fileRef} type="file" accept=".csv,.txt" onChange={handleCsvFile} className="hidden" />
            </label>
            {csvPreview.length > 0 && (
              <div className="mt-2 p-2 bg-green-50 rounded-lg text-xs text-green-700">
                <strong>{kwCount} keyword dimuat:</strong> {csvPreview.join(', ')}{kwCount > 5 ? ` +${kwCount - 5} lainnya` : ''}
              </div>
            )}
            {kwCount > 0 && <input type="hidden" required value={keywords} />}
          </div>
        )}

        {/* Intent — paling penting */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            Intent Keyword <span className="text-xs text-gray-400">(menentukan prioritas generate)</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {INTENTS.map(i => (
              <button
                key={i.value}
                type="button"
                onClick={() => setIntent(i.value)}
                className={`text-left p-2.5 rounded-lg border-2 transition-all ${
                  intent === i.value
                    ? 'border-[#1a1564] bg-[#1a1564]/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-xs font-semibold text-gray-800">{i.label}</div>
                <div className="text-[10px] text-gray-400 mt-0.5">{i.desc}</div>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-1.5">
            Prioritas auto: <strong className="text-[#1a1564]">{selectedIntent.priority}/10</strong> · {
              intent === 'transaksional' ? 'Di-generate pertama oleh scheduler' :
              intent === 'komparasi'     ? 'Di-generate setelah transaksional' :
              intent === 'masalah'       ? 'Di-generate setelah komparasi' :
                                          'Di-generate terakhir'
            }
          </p>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">AI Provider</label>
          <select value={provider} onChange={e => setProvider(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1564]/20 focus:border-[#1a1564]">
            {PROVIDERS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Tone</label>
            <select value={tone} onChange={e => setTone(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1564]/20">
              {TONES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Jumlah Kata</label>
            <input type="number" value={wordCount} onChange={e => setWordCount(e.target.value)}
              min={500} max={4000} step={100}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1564]/20" />
          </div>
        </div>

        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" checked={useHumanizer} onChange={e => setUseHumanizer(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#1a1564] focus:ring-[#1a1564]/20" />
          <div>
            <span className="text-sm font-medium text-gray-800">Aktifkan Humanizer</span>
            <p className="text-xs text-gray-400 mt-0.5">AI pass kedua agar lebih natural (lebih lambat, lebih berkualitas)</p>
          </div>
        </label>

        {result && (
          <div className="text-sm bg-green-50 text-green-700 px-3 py-2 rounded-lg">
            {result.created} keyword ditambahkan{result.skipped > 0 ? `, ${result.skipped} dilewati (duplikat)` : ''}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || (mode === 'csv' && kwCount === 0)}
          className="w-full bg-[#1a1564] hover:bg-[#2520a8] text-white font-semibold py-2.5 rounded-lg transition-colors text-sm disabled:opacity-60"
        >
          {loading ? 'Menyimpan...' : `Tambahkan${kwCount > 0 ? ` (${kwCount})` : ''} Keywords`}
        </button>
      </form>
    </div>
  )
}
