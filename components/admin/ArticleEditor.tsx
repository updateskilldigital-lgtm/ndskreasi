'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TiptapImage from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { marked } from 'marked'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  Bold, Italic, Strikethrough, Code, Image as ImageIcon,
  Link as LinkIcon, List, ListOrdered, Quote, Minus,
  Heading2, Heading3, ChevronLeft, Globe, EyeOff, Save,
  Wand2, Eye,
} from 'lucide-react'

type Article = {
  id: number
  title: string
  slug: string
  headline: string | null
  excerpt: string | null
  content: string
  meta_title: string | null
  meta_description: string | null
  featured_image: string | null
  image_alt: string | null
  status: string
  seo_score: number
  word_count: number
  category_id: number | null
  tags: string[]
}

type Category = { id: number; name: string; slug: string; color: string }

function isMarkdown(text: string): boolean {
  return /^#{1,3} /m.test(text) || /\*\*[\s\S]+?\*\*/.test(text) || /^[-*] /m.test(text)
}

function mdToHtml(md: string): string {
  return marked.parse(md, { async: false }) as string
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

export function ArticleEditor({ article, categories }: { article: Article; categories: Category[] }) {
  const router = useRouter()

  const initialContent = useMemo(() => {
    const c = article.content
    return isMarkdown(c) ? mdToHtml(c) : c
  }, [article.content])

  const [title, setTitle]             = useState(article.title)
  const [headline, setHeadline]       = useState(article.headline ?? '')
  const [excerpt, setExcerpt]         = useState(article.excerpt ?? '')
  const [metaTitle, setMetaTitle]     = useState(article.meta_title ?? '')
  const [metaDesc, setMetaDesc]       = useState(article.meta_description ?? '')
  const [featuredImg, setFeaturedImg] = useState(article.featured_image ?? '')
  const [imageAlt, setImageAlt]       = useState(article.image_alt ?? '')
  const [status, setStatus]           = useState(article.status)
  const [categoryId, setCategoryId]   = useState<number | null>(article.category_id)
  const [tags, setTags]               = useState<string[]>(article.tags)
  const [tagInput, setTagInput]       = useState('')
  const [saving, setSaving]           = useState(false)
  const [saved, setSaved]             = useState(false)
  const [liveScore, setLiveScore]     = useState(article.seo_score)
  const [liveWords, setLiveWords]     = useState(article.word_count)

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ link: { openOnClick: false } }),
      TiptapImage.configure({ inline: false, allowBase64: false }),
      Placeholder.configure({ placeholder: 'Tulis atau edit konten artikel...' }),
    ],
    content: initialContent,
    onUpdate({ editor }) {
      const html  = editor.getHTML()
      const words = stripHtml(html).split(/\s+/).filter(Boolean).length
      setLiveWords(words)
    },
    editorProps: {
      attributes: {
        class: 'prose prose-gray max-w-none min-h-[500px] focus:outline-none px-8 py-6',
      },
    },
  })

  function handleAutoFill() {
    if (!editor) return
    const html = editor.getHTML()
    const text = stripHtml(html)

    if (!metaTitle)  setMetaTitle(title.slice(0, 65))
    if (!excerpt)    setExcerpt(text.slice(0, 250).trim())
    if (!metaDesc) {
      const raw = text.slice(0, 160).trim()
      setMetaDesc(raw.length >= 120 ? raw : text.slice(0, 155).trim())
    }
  }

  async function handleSave(overrideStatus?: string) {
    if (!editor) return
    setSaving(true)
    const finalStatus = overrideStatus ?? status
    const html        = editor.getHTML()
    try {
      const res = await fetch(`/api/admin/articles/${article.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          headline,
          excerpt,
          content:          html,
          meta_title:       metaTitle,
          meta_description: metaDesc,
          featured_image:   featuredImg,
          image_alt:        imageAlt,
          status:           finalStatus,
          category_id:      categoryId,
          tags,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        setStatus(finalStatus)
        setLiveScore(data.seo_score ?? liveScore)
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
      } else {
        alert('Gagal menyimpan artikel')
      }
    } finally {
      setSaving(false)
    }
  }

  function handlePreview() {
    if (status === 'published') {
      window.open(`/blog/${article.slug}`, '_blank')
    } else {
      const go = confirm('Artikel masih Draft. Publish dulu untuk preview tampilan publik?\n\nKlik OK untuk publish & preview, Cancel untuk batal.')
      if (go) handleSave('published').then(() => window.open(`/blog/${article.slug}`, '_blank'))
    }
  }

  function addImage() {
    const url = window.prompt('URL gambar:')
    if (url) editor?.chain().focus().setImage({ src: url }).run()
  }

  function addLink() {
    const url = window.prompt('URL link:')
    if (url) editor?.chain().focus().setLink({ href: url }).run()
  }

  const toolbarItems = [
    { icon: Bold,          action: () => editor?.chain().focus().toggleBold().run(),                active: () => !!editor?.isActive('bold'),                   title: 'Bold' },
    { icon: Italic,        action: () => editor?.chain().focus().toggleItalic().run(),              active: () => !!editor?.isActive('italic'),                 title: 'Italic' },
    { icon: Strikethrough, action: () => editor?.chain().focus().toggleStrike().run(),              active: () => !!editor?.isActive('strike'),                 title: 'Strikethrough' },
    null,
    { icon: Heading2,      action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(), active: () => !!editor?.isActive('heading', { level: 2 }), title: 'Heading 2' },
    { icon: Heading3,      action: () => editor?.chain().focus().toggleHeading({ level: 3 }).run(), active: () => !!editor?.isActive('heading', { level: 3 }), title: 'Heading 3' },
    null,
    { icon: List,          action: () => editor?.chain().focus().toggleBulletList().run(),          active: () => !!editor?.isActive('bulletList'),             title: 'Bullet list' },
    { icon: ListOrdered,   action: () => editor?.chain().focus().toggleOrderedList().run(),         active: () => !!editor?.isActive('orderedList'),            title: 'Numbered list' },
    { icon: Quote,         action: () => editor?.chain().focus().toggleBlockquote().run(),          active: () => !!editor?.isActive('blockquote'),             title: 'Blockquote' },
    { icon: Code,          action: () => editor?.chain().focus().toggleCodeBlock().run(),           active: () => !!editor?.isActive('codeBlock'),              title: 'Code block' },
    null,
    { icon: ImageIcon,     action: addImage,                                                        active: () => false,                                        title: 'Sisipkan gambar' },
    { icon: LinkIcon,      action: addLink,                                                         active: () => !!editor?.isActive('link'),                   title: 'Sisipkan link' },
    { icon: Minus,         action: () => editor?.chain().focus().setHorizontalRule().run(),         active: () => false,                                        title: 'Garis pemisah' },
  ] as const

  const scoreColor = liveScore >= 80 ? 'text-green-600' : liveScore >= 60 ? 'text-yellow-600' : 'text-red-500'
  const scoreRing  = liveScore >= 80 ? 'stroke-green-500' : liveScore >= 60 ? 'stroke-yellow-500' : 'stroke-red-400'
  const circumference = 2 * Math.PI * 16
  const dashOffset    = circumference - (liveScore / 100) * circumference

  return (
    <div className="flex flex-col h-screen">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white shrink-0">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Kembali
        </button>

        <div className="flex items-center gap-2">
          {saved && <span className="text-xs text-green-600 font-medium animate-pulse">✓ Tersimpan</span>}
          <span className="text-xs text-gray-400 hidden sm:block">/blog/{article.slug}</span>

          <button
            onClick={handlePreview}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
            title="Preview artikel"
          >
            <Eye className="h-3.5 w-3.5" />
            Preview
          </button>
          <button
            onClick={() => handleSave('draft')}
            disabled={saving}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 disabled:opacity-50 transition-colors"
          >
            <Save className="h-3.5 w-3.5" />
            Simpan Draft
          </button>
          <button
            onClick={() => handleSave('published')}
            disabled={saving}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-[#1a1564] hover:bg-[#1a1564]/90 text-white rounded-lg disabled:opacity-50 transition-colors"
          >
            {status === 'published'
              ? <><EyeOff className="h-3.5 w-3.5" /> Update & Publish</>
              : <><Globe className="h-3.5 w-3.5" /> Publish</>
            }
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor column */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          <div className="px-8 pt-8 pb-2 border-b border-gray-100">
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Judul artikel..."
              className="w-full text-3xl font-bold text-gray-900 border-none outline-none placeholder-gray-300 bg-transparent"
            />
            <input
              value={headline}
              onChange={e => setHeadline(e.target.value)}
              placeholder="Headline / tagline singkat (opsional)..."
              className="w-full text-base text-gray-500 border-none outline-none mt-2 placeholder-gray-300 bg-transparent"
            />
          </div>

          {/* Toolbar */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-8 py-2 flex flex-wrap items-center gap-0.5 shrink-0">
            {toolbarItems.map((item, i) => {
              if (item === null) return <span key={i} className="w-px h-5 bg-gray-200 mx-1 shrink-0" />
              const Icon = item.icon
              return (
                <button
                  key={i}
                  onClick={item.action}
                  title={item.title}
                  className={`p-1.5 rounded hover:bg-gray-100 transition-colors shrink-0 ${
                    item.active() ? 'bg-gray-200 text-gray-900' : 'text-gray-500'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </button>
              )
            })}
          </div>

          <EditorContent editor={editor} className="flex-1" />
        </div>

        {/* Sidebar */}
        <aside className="w-72 shrink-0 border-l border-gray-200 bg-gray-50 overflow-y-auto p-5 space-y-5">

          {/* SEO Score ring */}
          <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
            <svg width="44" height="44" viewBox="0 0 44 44" className="-rotate-90 shrink-0">
              <circle cx="22" cy="22" r="16" fill="none" stroke="#f3f4f6" strokeWidth="4" />
              <circle
                cx="22" cy="22" r="16" fill="none"
                className={scoreRing}
                strokeWidth="4"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.5s ease' }}
              />
            </svg>
            <div>
              <p className={`text-2xl font-bold ${scoreColor}`}>{liveScore}<span className="text-sm font-normal text-gray-400">/100</span></p>
              <p className="text-xs text-gray-500">SEO Score</p>
            </div>
          </div>

          {/* SEO tips */}
          <div className="text-xs space-y-1 text-gray-500">
            <div className={`flex items-center gap-1.5 ${metaDesc.length >= 120 && metaDesc.length <= 160 ? 'text-green-600' : 'text-gray-400'}`}>
              <span>{metaDesc.length >= 120 ? '✓' : '○'}</span> Meta description (120–160 karakter)
            </div>
            <div className={`flex items-center gap-1.5 ${excerpt ? 'text-green-600' : 'text-gray-400'}`}>
              <span>{excerpt ? '✓' : '○'}</span> Excerpt diisi
            </div>
            <div className={`flex items-center gap-1.5 ${liveWords >= 1000 ? 'text-green-600' : liveWords >= 500 ? 'text-yellow-600' : 'text-gray-400'}`}>
              <span>{liveWords >= 1000 ? '✓' : '○'}</span> Jumlah kata: {liveWords.toLocaleString()}
            </div>
          </div>

          {/* Category */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Kategori</p>
            <select
              value={categoryId ?? ''}
              onChange={e => setCategoryId(e.target.value ? parseInt(e.target.value) : null)}
              className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a1564]/20 bg-white"
            >
              <option value="">— Tanpa kategori —</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            {!categoryId && (
              <p className="text-xs text-amber-500 mt-1">+5 SEO poin jika diisi</p>
            )}
          </div>

          {/* Tags */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Tag</p>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tags.map(tag => (
                <span key={tag} className="inline-flex items-center gap-1 bg-[#1a1564]/10 text-[#1a1564] text-xs px-2 py-0.5 rounded-full">
                  #{tag}
                  <button onClick={() => setTags(prev => prev.filter(t => t !== tag))} className="hover:text-red-500">×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                placeholder="Tambah tag, Enter"
                className="flex-1 text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a1564]/20 bg-white"
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ',') {
                    e.preventDefault()
                    const newTags = tagInput.split(',').map(t => t.trim().toLowerCase()).filter(t => t && !tags.includes(t))
                    if (newTags.length) { setTags(prev => [...prev, ...newTags]); setTagInput('') }
                  }
                }}
              />
            </div>
            {tags.length === 0 && (
              <p className="text-xs text-amber-500 mt-1">+5 SEO poin jika ada tag</p>
            )}
          </div>

          {/* Status */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Status</p>
            <span className={`inline-flex text-xs font-medium px-2.5 py-1 rounded-full ${
              status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
            }`}>
              {status === 'published' ? 'Published' : 'Draft'}
            </span>
          </div>

          {/* Featured image */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Featured Image</p>
            {featuredImg && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={featuredImg} alt="" className="w-full h-32 object-cover rounded-lg mb-2 bg-gray-100" />
            )}
            <input
              value={featuredImg}
              onChange={e => setFeaturedImg(e.target.value)}
              placeholder="https://... (URL gambar)"
              className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a1564]/20 bg-white"
            />
            <input
              value={imageAlt}
              onChange={e => setImageAlt(e.target.value)}
              placeholder="Alt text gambar"
              className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-[#1a1564]/20 bg-white"
            />
          </div>

          {/* Excerpt */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-gray-400 uppercase">Excerpt</p>
              <button
                onClick={handleAutoFill}
                title="Auto-isi dari konten artikel"
                className="flex items-center gap-1 text-xs text-[#1a1564] hover:text-[#1a1564]/70 font-medium"
              >
                <Wand2 className="h-3 w-3" /> Auto-isi
              </button>
            </div>
            <textarea
              value={excerpt}
              onChange={e => setExcerpt(e.target.value)}
              placeholder="Ringkasan singkat artikel..."
              rows={3}
              className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a1564]/20 resize-none bg-white"
            />
          </div>

          {/* SEO metadata */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-gray-400 uppercase">SEO Metadata</p>
            </div>
            <div className="space-y-2">
              <input
                value={metaTitle}
                onChange={e => setMetaTitle(e.target.value)}
                placeholder="Meta title"
                className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a1564]/20 bg-white"
              />
              <p className={`text-xs -mt-1 ${metaTitle.length > 65 ? 'text-red-500' : 'text-gray-400'}`}>
                {metaTitle.length}/65 karakter
              </p>
              <textarea
                value={metaDesc}
                onChange={e => setMetaDesc(e.target.value)}
                placeholder="Meta description (120–160 karakter ideal)"
                rows={4}
                className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a1564]/20 resize-none bg-white"
              />
              <p className={`text-xs ${metaDesc.length > 160 ? 'text-red-500' : metaDesc.length >= 120 ? 'text-green-600' : 'text-gray-400'}`}>
                {metaDesc.length}/160 karakter
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
