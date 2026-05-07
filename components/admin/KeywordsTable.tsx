'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Play, RotateCw, Trash2, ExternalLink, Loader2 } from 'lucide-react'

type Article = { id: number; slug: string; status: string }
type Keyword = {
  id: number
  keyword: string
  category: string | null
  ai_provider: string
  focus_tone: string
  target_words: number
  status: string
  error_msg: string | null
  intent: string
  created_at: string
  articles: Article[]
}

const intentCfg: Record<string, { label: string; cls: string }> = {
  transaksional: { label: '🔥 Trans',  cls: 'bg-red-50 text-red-600' },
  komparasi:     { label: '⚖️ Komp',   cls: 'bg-blue-50 text-blue-600' },
  masalah:       { label: '🔧 Masalah',cls: 'bg-amber-50 text-amber-600' },
  informasional: { label: '📚 Info',   cls: 'bg-gray-100 text-gray-500' },
}

const statusCfg: Record<string, { label: string; cls: string }> = {
  pending:    { label: 'Pending',    cls: 'bg-yellow-100 text-yellow-700' },
  processing: { label: 'Generating', cls: 'bg-blue-100 text-blue-700 animate-pulse' },
  done:       { label: 'Selesai',   cls: 'bg-green-100 text-green-700' },
  failed:     { label: 'Gagal',     cls: 'bg-red-100 text-red-700' },
}

export function KeywordsTable({ keywords: initial }: { keywords: Keyword[] }) {
  const [keywords, setKeywords] = useState(initial)
  const [generating, setGenerating] = useState<number | null>(null)

  useEffect(() => {
    if (!generating) setKeywords(initial)
  }, [initial])

  async function handleGenerate(kw: Keyword) {
    setGenerating(kw.id)
    setKeywords(prev => prev.map(k => k.id === kw.id ? { ...k, status: 'processing', error_msg: null } : k))

    try {
      const res = await fetch(`/api/admin/blog/generate/${kw.id}`, { method: 'POST' })
      const data = await res.json()

      if (res.ok) {
        setKeywords(prev => prev.map(k =>
          k.id === kw.id
            ? { ...k, status: 'done', articles: [...k.articles, { id: data.article.id, slug: data.article.slug, status: 'draft' }] }
            : k
        ))
      } else {
        setKeywords(prev => prev.map(k => k.id === kw.id ? { ...k, status: 'failed', error_msg: data.error } : k))
      }
    } catch {
      setKeywords(prev => prev.map(k => k.id === kw.id ? { ...k, status: 'failed', error_msg: 'Network error' } : k))
    } finally {
      setGenerating(null)
    }
  }

  async function handleGenerateAll() {
    const pending = keywords.filter(k => k.status === 'pending' || k.status === 'failed')
    for (const kw of pending) {
      await handleGenerate(kw)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Hapus keyword ini?')) return
    await fetch(`/api/admin/blog/keywords/${id}`, { method: 'DELETE' })
    setKeywords(prev => prev.filter(k => k.id !== id))
  }

  const pendingCount = keywords.filter(k => k.status === 'pending').length
  const doneCount = keywords.filter(k => k.status === 'done').length
  const failedCount = keywords.filter(k => k.status === 'failed').length

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-5 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-gray-900">Keywords</h2>
          <div className="flex gap-3 mt-1 text-xs text-gray-500">
            <span>{keywords.length} total</span>
            <span className="text-yellow-600">{pendingCount} pending</span>
            <span className="text-green-600">{doneCount} selesai</span>
            {failedCount > 0 && <span className="text-red-600">{failedCount} gagal</span>}
          </div>
        </div>
        {pendingCount > 0 && !generating && (
          <button
            onClick={handleGenerateAll}
            className="flex items-center gap-2 bg-[#1a1564] hover:bg-[#2520a8] text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
          >
            <Play className="h-3 w-3" />
            Generate Semua ({pendingCount})
          </button>
        )}
        {generating && (
          <div className="flex items-center gap-2 text-xs text-blue-600">
            <Loader2 className="h-3 w-3 animate-spin" />
            Generating... (1-2 menit)
          </div>
        )}
      </div>

      {keywords.length === 0 ? (
        <p className="p-10 text-center text-sm text-gray-400">
          Belum ada keyword. Tambahkan keyword di sebelah kiri.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Keyword</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Provider</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Kata</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {keywords.map(kw => {
                const cfg = statusCfg[kw.status] ?? statusCfg.pending
                const isGenerating = generating === kw.id
                const article = kw.articles[kw.articles.length - 1]

                return (
                  <tr key={kw.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded shrink-0 ${(intentCfg[kw.intent] ?? intentCfg.informasional).cls}`}>
                          {(intentCfg[kw.intent] ?? intentCfg.informasional).label}
                        </span>
                        <span className="font-medium text-gray-900">{kw.keyword}</span>
                      </div>
                      {kw.error_msg && (
                        <div className="text-xs text-red-500 mt-0.5 truncate max-w-xs" title={kw.error_msg}>
                          {kw.error_msg}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{kw.ai_provider}</span>
                    </td>
                    <td className="py-3 px-4 text-gray-500 text-xs hidden lg:table-cell">{kw.target_words}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cfg.cls}`}>
                        {isGenerating ? (
                          <span className="flex items-center gap-1"><Loader2 className="h-2.5 w-2.5 animate-spin" /> Generating...</span>
                        ) : cfg.label}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {(kw.status === 'pending' || kw.status === 'failed') && !isGenerating && !generating && (
                          <button
                            onClick={() => handleGenerate(kw)}
                            className="inline-flex items-center gap-1 bg-[#1a1564]/10 hover:bg-[#1a1564]/20 text-[#1a1564] text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors"
                          >
                            {kw.status === 'failed' ? <RotateCw className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                            {kw.status === 'failed' ? 'Retry' : 'Generate'}
                          </button>
                        )}
                        {kw.status === 'done' && !isGenerating && !generating && (
                          <button
                            onClick={() => handleGenerate(kw)}
                            title="Generate ulang artikel baru"
                            className="inline-flex items-center bg-gray-50 hover:bg-gray-100 text-gray-500 text-xs p-1.5 rounded-lg transition-colors"
                          >
                            <RotateCw className="h-3 w-3" />
                          </button>
                        )}
                        {article && (
                          <Link
                            href={`/admin/articles`}
                            className="inline-flex items-center gap-1 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Artikel
                          </Link>
                        )}
                        <button
                          onClick={() => handleDelete(kw.id)}
                          className="inline-flex items-center bg-red-50 hover:bg-red-100 text-red-600 text-xs p-1.5 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
