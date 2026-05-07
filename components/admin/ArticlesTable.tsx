'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Globe, EyeOff, Trash2, ExternalLink, Search, RefreshCw, Pencil } from 'lucide-react'

type Article = {
  id: number
  title: string
  slug: string
  ai_provider: string | null
  word_count: number
  seo_score: number
  status: string
  published_at: string | null
  created_at: string
  featured_image: string | null
  keyword: { keyword: string } | null
}

const statusCfg: Record<string, { label: string; cls: string }> = {
  draft:     { label: 'Draft',     cls: 'bg-gray-100 text-gray-600' },
  published: { label: 'Published', cls: 'bg-green-100 text-green-700' },
}

function SeoBar({ score }: { score: number }) {
  const color = score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-400'
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs text-gray-500">{score}</span>
    </div>
  )
}

export function ArticlesTable({ articles: initial }: { articles: Article[] }) {
  const [articles, setArticles] = useState(initial)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('')
  const [refreshing, setRefreshing] = useState<number | null>(null)

  const filtered = articles.filter(a => {
    const q = search.toLowerCase()
    return (
      (q === '' || a.title.toLowerCase().includes(q) || a.keyword?.keyword.toLowerCase().includes(q)) &&
      (filter === '' || a.status === filter)
    )
  })

  async function togglePublish(article: Article) {
    const newStatus = article.status === 'published' ? 'draft' : 'published'
    await fetch(`/api/admin/articles/${article.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    setArticles(prev => prev.map(a => a.id === article.id ? { ...a, status: newStatus } : a))
  }

  async function handleRefresh(article: Article) {
    if (!confirm(`Regenerate konten artikel "${article.title}"?\nKonten lama akan diganti — judul & slug tetap sama.`)) return
    setRefreshing(article.id)
    try {
      const res = await fetch(`/api/admin/articles/${article.id}/refresh`, { method: 'POST' })
      const data = await res.json()
      if (res.ok) {
        setArticles(prev => prev.map(a =>
          a.id === article.id
            ? { ...a, title: data.article.title, word_count: data.article.word_count, seo_score: data.article.seo_score, featured_image: data.article.featured_image }
            : a
        ))
      } else {
        alert(data.error ?? 'Refresh gagal')
      }
    } catch {
      alert('Network error')
    } finally {
      setRefreshing(null)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Hapus artikel ini? Tindakan tidak bisa dibatalkan.')) return
    await fetch(`/api/admin/articles/${id}`, { method: 'DELETE' })
    setArticles(prev => prev.filter(a => a.id !== id))
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari judul atau keyword..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1564]/20 focus:border-[#1a1564]"
          />
        </div>
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1564]/20"
        >
          <option value="">Semua Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Judul</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Keyword</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">SEO</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Kata</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="py-10 text-center text-sm text-gray-400">
                  Belum ada artikel
                </td>
              </tr>
            )}
            {filtered.map(article => {
              const cfg = statusCfg[article.status] ?? statusCfg.draft
              return (
                <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      {article.featured_image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={article.featured_image}
                          alt=""
                          className="w-12 h-8 object-cover rounded shrink-0 bg-gray-100"
                        />
                      ) : (
                        <div className="w-12 h-8 bg-gray-100 rounded shrink-0 flex items-center justify-center text-gray-300 text-xs">
                          —
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-gray-900 line-clamp-1">{article.title}</div>
                        <div className="text-xs text-gray-400 mt-0.5">/{article.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <span className="text-xs text-gray-600">{article.keyword?.keyword ?? '-'}</span>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <SeoBar score={article.seo_score} />
                  </td>
                  <td className="py-3 px-4 text-gray-500 text-xs hidden md:table-cell">
                    {article.word_count.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cfg.cls}`}>
                      {cfg.label}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {article.status === 'published' && (
                        <Link
                          href={`/blog/${article.slug}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 bg-[#1a1564]/5 hover:bg-[#1a1564]/10 text-[#1a1564] text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Lihat
                        </Link>
                      )}
                      <Link
                        href={`/admin/articles/${article.id}/edit`}
                        className="inline-flex items-center bg-amber-50 hover:bg-amber-100 text-amber-600 text-xs p-1.5 rounded-lg transition-colors"
                        title="Edit artikel"
                      >
                        <Pencil className="h-3 w-3" />
                      </Link>
                      <button
                        onClick={() => togglePublish(article)}
                        className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors ${
                          article.status === 'published'
                            ? 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                            : 'bg-green-50 hover:bg-green-100 text-green-700'
                        }`}
                      >
                        {article.status === 'published'
                          ? <><EyeOff className="h-3 w-3" /> Unpublish</>
                          : <><Globe className="h-3 w-3" /> Publish</>
                        }
                      </button>
                      <button
                        onClick={() => handleRefresh(article)}
                        disabled={refreshing === article.id}
                        title="Regenerate konten artikel"
                        className="inline-flex items-center bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs p-1.5 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <RefreshCw className={`h-3 w-3 ${refreshing === article.id ? 'animate-spin' : ''}`} />
                      </button>
                      <button
                        onClick={() => handleDelete(article.id)}
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
    </div>
  )
}
