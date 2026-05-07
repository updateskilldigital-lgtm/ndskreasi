'use client'

import { useState } from 'react'
import { Plus, Trash2, Tag, FolderOpen } from 'lucide-react'

type Category = { id: number; name: string; slug: string; description: string | null; color: string; articleCount: number }
type TagItem   = { id: number; name: string; slug: string; articleCount: number }

const PRESET_COLORS = [
  '#1a1564', '#7c3aed', '#db2777', '#dc2626',
  '#ea580c', '#ca8a04', '#16a34a', '#0891b2',
]

export function CategoryManager({
  initialCategories,
  initialTags,
}: {
  initialCategories: Category[]
  initialTags: TagItem[]
}) {
  const [categories, setCategories] = useState(initialCategories)
  const [tags, setTags]             = useState(initialTags)

  // Category form state
  const [catName, setCatName]         = useState('')
  const [catDesc, setCatDesc]         = useState('')
  const [catColor, setCatColor]       = useState('#1a1564')
  const [catSaving, setCatSaving]     = useState(false)

  // Tag form state
  const [tagInput, setTagInput]   = useState('')
  const [tagSaving, setTagSaving] = useState(false)

  async function addCategory() {
    if (!catName.trim()) return
    setCatSaving(true)
    try {
      const res  = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: catName, description: catDesc, color: catColor }),
      })
      const data = await res.json()
      if (res.ok) {
        setCategories(prev => [...prev, { ...data, articleCount: 0 }])
        setCatName(''); setCatDesc(''); setCatColor('#1a1564')
      } else {
        alert(data.error ?? 'Gagal menambah kategori')
      }
    } finally {
      setCatSaving(false)
    }
  }

  async function deleteCategory(id: number) {
    if (!confirm('Hapus kategori ini? Artikel yang menggunakan kategori ini tidak akan terhapus.')) return
    await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
    setCategories(prev => prev.filter(c => c.id !== id))
  }

  async function addTag() {
    const names = tagInput.split(',').map(t => t.trim()).filter(Boolean)
    if (names.length === 0) return
    setTagSaving(true)
    try {
      const results = await Promise.all(
        names.map(name =>
          fetch('/api/admin/tags', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name }),
          }).then(r => r.json())
        )
      )
      setTags(prev => {
        const existing = new Set(prev.map(t => t.id))
        const newTags  = results.filter(r => r.id && !existing.has(r.id)).map(r => ({ ...r, articleCount: 0 }))
        return [...prev, ...newTags].sort((a, b) => a.name.localeCompare(b.name))
      })
      setTagInput('')
    } finally {
      setTagSaving(false)
    }
  }

  async function deleteTag(id: number) {
    if (!confirm('Hapus tag ini?')) return
    await fetch(`/api/admin/tags/${id}`, { method: 'DELETE' })
    setTags(prev => prev.filter(t => t.id !== id))
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Categories */}
      <div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
            <FolderOpen className="h-4 w-4 text-[#1a1564]" />
            <h2 className="font-semibold text-gray-800">Kategori</h2>
            <span className="ml-auto text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{categories.length}</span>
          </div>

          {/* Add form */}
          <div className="p-5 border-b border-gray-50 space-y-3">
            <input
              value={catName}
              onChange={e => setCatName(e.target.value)}
              placeholder="Nama kategori (contoh: Tutorial, Review, Tips)"
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a1564]/20"
              onKeyDown={e => e.key === 'Enter' && addCategory()}
            />
            <input
              value={catDesc}
              onChange={e => setCatDesc(e.target.value)}
              placeholder="Deskripsi singkat (opsional)"
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a1564]/20"
            />
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Warna:</span>
              {PRESET_COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setCatColor(c)}
                  className={`w-5 h-5 rounded-full border-2 transition-transform ${catColor === c ? 'border-gray-800 scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
              <input type="color" value={catColor} onChange={e => setCatColor(e.target.value)} className="w-6 h-6 rounded cursor-pointer border-0" />
            </div>
            <button
              onClick={addCategory}
              disabled={catSaving || !catName.trim()}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#1a1564] text-white text-sm rounded-lg hover:bg-[#1a1564]/90 disabled:opacity-50 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" /> Tambah Kategori
            </button>
          </div>

          {/* List */}
          <ul className="divide-y divide-gray-50">
            {categories.length === 0 && (
              <li className="py-8 text-center text-sm text-gray-400">Belum ada kategori</li>
            )}
            {categories.map(cat => (
              <li key={cat.id} className="flex items-center gap-3 px-5 py-3">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{cat.name}</p>
                  <p className="text-xs text-gray-400">/{cat.slug} · {cat.articleCount} artikel</p>
                </div>
                <button
                  onClick={() => deleteCategory(cat.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors shrink-0"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Tags */}
      <div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
            <Tag className="h-4 w-4 text-[#1a1564]" />
            <h2 className="font-semibold text-gray-800">Tag</h2>
            <span className="ml-auto text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{tags.length}</span>
          </div>

          {/* Add form */}
          <div className="p-5 border-b border-gray-50 space-y-3">
            <input
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              placeholder="Nama tag, pisahkan dengan koma (mis: ai, seo, tips)"
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a1564]/20"
              onKeyDown={e => e.key === 'Enter' && addTag()}
            />
            <button
              onClick={addTag}
              disabled={tagSaving || !tagInput.trim()}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#1a1564] text-white text-sm rounded-lg hover:bg-[#1a1564]/90 disabled:opacity-50 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" /> Tambah Tag
            </button>
          </div>

          {/* Tag cloud */}
          <div className="p-5 flex flex-wrap gap-2">
            {tags.length === 0 && (
              <p className="text-sm text-gray-400">Belum ada tag</p>
            )}
            {tags.map(tag => (
              <span key={tag.id} className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full">
                #{tag.name}
                <span className="text-gray-400">({tag.articleCount})</span>
                <button onClick={() => deleteTag(tag.id)} className="text-gray-400 hover:text-red-500 transition-colors ml-0.5">×</button>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
