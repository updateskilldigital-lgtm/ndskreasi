export type Heading = { id: string; text: string; level: 2 | 3 }

function toId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export function extractHeadings(md: string): Heading[] {
  const headings: Heading[] = []
  for (const line of md.split('\n')) {
    if (line.startsWith('### ')) {
      const text = line.slice(4).trim()
      headings.push({ id: toId(text), text, level: 3 })
    } else if (line.startsWith('## ')) {
      const text = line.slice(3).trim()
      headings.push({ id: toId(text), text, level: 2 })
    }
  }
  return headings
}

export function markdownToHtml(md: string): string {
  const lines = md.split('\n')
  const out: string[] = []
  let listBuf: string[] = []
  let listType: 'ul' | 'ol' | null = null

  function flushList() {
    if (!listBuf.length || !listType) return
    out.push(`<${listType} class="${listType === 'ul' ? 'list-disc' : 'list-decimal'} pl-6 space-y-1 my-3">`)
    listBuf.forEach(li => out.push(`  <li class="text-gray-700 leading-relaxed">${li}</li>`))
    out.push(`</${listType}>`)
    listBuf = []
    listType = null
  }

  for (const raw of lines) {
    const line = raw.trimEnd()

    if (line.startsWith('### ')) {
      flushList()
      const text = line.slice(4)
      const id = toId(text)
      out.push(`<h3 id="${id}" class="text-xl font-bold text-gray-900 mt-6 mb-2">${inline(text)}</h3>`)
    } else if (line.startsWith('## ')) {
      flushList()
      const text = line.slice(3)
      const id = toId(text)
      out.push(`<h2 id="${id}" class="text-2xl font-bold text-gray-900 mt-8 mb-3 pb-2 border-b border-gray-100">${inline(text)}</h2>`)
    } else if (line.startsWith('> ')) {
      flushList()
      out.push(`<div class="border-l-4 border-accent pl-4 py-1 my-4 bg-accent/5 rounded-r-lg"><p class="text-gray-600 italic text-sm">${inline(line.slice(2))}</p></div>`)
    } else if (/^- |^\* /.test(line)) {
      if (listType === 'ol') flushList()
      listType = 'ul'
      listBuf.push(inline(line.replace(/^[-*] /, '')))
    } else if (/^\d+\. /.test(line)) {
      if (listType === 'ul') flushList()
      listType = 'ol'
      listBuf.push(inline(line.replace(/^\d+\. /, '')))
    } else if (line.trim() === '') {
      flushList()
      out.push('')
    } else {
      flushList()
      out.push(`<p class="text-gray-700 leading-relaxed mb-3">${inline(line)}</p>`)
    }
  }

  flushList()
  return out.join('\n')
}

function inline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
    .replace(/`(.+?)`/g, '<code class="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-primary">$1</code>')
}
