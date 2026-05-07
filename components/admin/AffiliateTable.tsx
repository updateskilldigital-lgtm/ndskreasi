'use client'

import { useState } from 'react'
import { Trash2, Plus, ExternalLink, ToggleLeft, ToggleRight, Tag } from 'lucide-react'

type AffiliateLink = {
  id: number
  keyword: string
  url: string
  label: string | null
  type: string
  image_url: string | null
  price: string | null
  badge: string | null
  is_active: boolean
  created_at: string
}

export function AffiliateTable({ links: initial }: { links: AffiliateLink[] }) {
  const [links, setLinks] = useState(initial)
  const [keyword, setKeyword] = useState('')
  const [url, setUrl] = useState('')
  const [label, setLabel] = useState('')
  const [type, setType] = useState<'link' | 'card'>('link')
  const [imageUrl, setImageUrl] = useState('')
  const [price, setPrice] = useState('')
  const [badge, setBadge] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/admin/affiliate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        keyword, url, label,
        type, image_url: imageUrl || null, price: price || null, badge: badge || null,
      }),
    })
    const data = await res.json()
    setLoading(false)
    if (res.ok) {
      setLinks(prev => [data, ...prev])
      setKeyword(''); setUrl(''); setLabel('')
      setImageUrl(''); setPrice(''); setBadge('')
    } else {
      setError(data.error ?? 'Gagal menambahkan')
    }
  }

  async function toggleActive(link: AffiliateLink) {
    const res = await fetch(`/api/admin/affiliate/${link.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !link.is_active }),
    })
    if (res.ok) setLinks(prev => prev.map(l => l.id === link.id ? { ...l, is_active: !l.is_active } : l))
  }

  async function handleDelete(id: number) {
    if (!confirm('Hapus affiliate link ini?')) return
    await fetch(`/api/admin/affiliate/${id}`, { method: 'DELETE' })
    setLinks(prev => prev.filter(l => l.id !== id))
  }

  const active = links.filter(l => l.is_active).length

  return (
    <div className="grid lg:grid-cols-[380px_1fr] gap-6">
      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Plus className="h-4 w-4 text-[#1a1564]" />
          Tambah Affiliate Link
        </h2>
        <form onSubmit={handleAdd} className="space-y-3">
          <div className="flex bg-gray-100 rounded-lg p-1 text-xs font-semibold mb-3">
            {(['link', 'card'] as const).map(t => (
              <button key={t} type="button" onClick={() => setType(t)}
                className={`flex-1 py-1.5 rounded-md transition-colors ${type === t ? 'bg-white text-[#1a1564] shadow-sm' : 'text-gray-500'}`}>
                {t === 'link' ? 'Text Link' : 'Product Card'}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Keyword</label>
            <input value={keyword} onChange={e => setKeyword(e.target.value)} required
              placeholder="hosting murah"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1564]/20 focus:border-[#1a1564]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">URL Affiliate</label>
            <input value={url} onChange={e => setUrl(e.target.value)} required type="url"
              placeholder="https://affiliate.example.com/?ref=nds"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1564]/20 focus:border-[#1a1564]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Label / Nama Produk</label>
            <input value={label} onChange={e => setLabel(e.target.value)}
              placeholder="Niagahoster — Hosting Terbaik"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1564]/20 focus:border-[#1a1564]" />
          </div>

          {type === 'card' && (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">URL Gambar Produk</label>
                <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} type="url"
                  placeholder="https://example.com/product.jpg"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1564]/20" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Harga</label>
                  <input value={price} onChange={e => setPrice(e.target.value)}
                    placeholder="Rp 15.000/bln"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1564]/20" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Badge</label>
                  <input value={badge} onChange={e => setBadge(e.target.value)}
                    placeholder="Rekomendasi"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1564]/20" />
                </div>
              </div>
            </>
          )}

          {error && <p className="text-xs text-red-500">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-[#1a1564] hover:bg-[#2520a8] text-white font-semibold py-2.5 rounded-lg transition-colors text-sm disabled:opacity-60">
            {loading ? 'Menyimpan...' : 'Tambahkan'}
          </button>
        </form>

        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 leading-relaxed">
          <strong>Text Link:</strong> Keyword dijadikan hyperlink di paragraf pertama yang mengandungnya.<br />
          <strong>Product Card:</strong> Card visual produk disisipkan setelah paragraf tersebut.
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Affiliate Links</h2>
          <p className="text-xs text-gray-500 mt-0.5">{links.length} total · {active} aktif</p>
        </div>

        {links.length === 0 ? (
          <p className="p-10 text-center text-sm text-gray-400">Belum ada affiliate link.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Keyword</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Tipe</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">URL</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {links.map(link => (
                  <tr key={link.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Tag className="h-3 w-3 text-gray-400 shrink-0" />
                        <div>
                          <div className="font-medium text-gray-900">{link.keyword}</div>
                          {link.label && <div className="text-xs text-gray-400">{link.label}</div>}
                          {link.price && <div className="text-xs font-semibold text-[#1a1564]">{link.price}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        link.type === 'card' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {link.type === 'card' ? '🃏 Card' : '🔗 Link'}
                      </span>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <a href={link.url} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-[#1a1564] hover:underline flex items-center gap-1 max-w-xs truncate">
                        <ExternalLink className="h-3 w-3 shrink-0" />
                        {link.url}
                      </a>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button onClick={() => toggleActive(link)}
                        className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
                          link.is_active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}>
                        {link.is_active ? <><ToggleRight className="h-3 w-3" /> Aktif</> : <><ToggleLeft className="h-3 w-3" /> Nonaktif</>}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button onClick={() => handleDelete(link.id)}
                        className="inline-flex items-center bg-red-50 hover:bg-red-100 text-red-600 text-xs p-1.5 rounded-lg transition-colors">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
