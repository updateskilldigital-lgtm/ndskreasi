'use client'

import { useEffect, useRef } from 'react'

export function ArticleTracker({ slug }: { slug: string }) {
  const tracked = useRef(false)

  useEffect(() => {
    if (tracked.current) return
    tracked.current = true
    fetch(`/api/blog/${slug}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'view' }),
    }).catch(() => {})
  }, [slug])

  return null
}

export function WaTracker({ slug, children }: { slug: string; children: React.ReactNode }) {
  function handleClick() {
    fetch(`/api/blog/${slug}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'wa_click' }),
    }).catch(() => {})
  }

  return (
    <span onClick={handleClick} className="contents">
      {children}
    </span>
  )
}
