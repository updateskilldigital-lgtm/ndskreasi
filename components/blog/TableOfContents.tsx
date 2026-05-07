'use client'

import { useState, useEffect } from 'react'
import { List } from 'lucide-react'
import type { Heading } from '@/lib/utils/markdown'

export function TableOfContents({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string>('')
  const [open, setOpen] = useState(true)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
            break
          }
        }
      },
      { rootMargin: '0px 0px -60% 0px', threshold: 0 }
    )

    headings.forEach(h => {
      const el = document.getElementById(h.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings])

  return (
    <nav className="mb-8 bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
      >
        <span className="flex items-center gap-2">
          <List className="h-4 w-4 text-[#1a1564]" />
          Daftar Isi
        </span>
        <span className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>

      {open && (
        <ol className="px-5 pb-4 pt-1 space-y-1.5 border-t border-gray-200">
          {headings.map((h, i) => (
            <li key={h.id} className={h.level === 3 ? 'pl-4' : ''}>
              <a
                href={`#${h.id}`}
                onClick={e => {
                  e.preventDefault()
                  document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  setActiveId(h.id)
                }}
                className={`flex items-start gap-2 text-sm py-0.5 transition-colors ${
                  activeId === h.id
                    ? 'text-[#1a1564] font-semibold'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <span className="shrink-0 text-gray-400 mt-0.5 text-xs">{i + 1}.</span>
                {h.text}
              </a>
            </li>
          ))}
        </ol>
      )}
    </nav>
  )
}
