import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function intentToPriority(intent?: string): number {
  switch (intent) {
    case 'transaksional': return 9
    case 'komparasi':     return 7
    case 'masalah':       return 6
    default:              return 5 // informasional
  }
}

export async function GET() {
  const keywords = await prisma.keyword.findMany({
    orderBy: [{ priority: 'desc' }, { created_at: 'desc' }],
    include: { articles: { select: { id: true, slug: true, status: true } } },
  })
  return NextResponse.json(keywords)
}

export async function POST(request: NextRequest) {
  const { keywords, ai_provider, focus_tone, target_words, category, priority, use_humanizer, intent } = await request.json()

  if (!keywords || typeof keywords !== 'string') {
    return NextResponse.json({ error: 'Keywords wajib diisi' }, { status: 400 })
  }

  const lines = keywords
    .split('\n')
    .map((k: string) => k.trim())
    .filter(Boolean)

  if (!lines.length) {
    return NextResponse.json({ error: 'Tidak ada keyword valid' }, { status: 400 })
  }

  const created = []
  for (const keyword of lines) {
    const existing = await prisma.keyword.findFirst({ where: { keyword } })
    if (existing) continue

    const kw = await prisma.keyword.create({
      data: {
        keyword,
        category: category || null,
        ai_provider: ai_provider ?? 'openai',
        focus_tone: focus_tone ?? 'informatif',
        target_words: parseInt(target_words) || 1500,
        priority: parseInt(priority) || intentToPriority(intent),
        use_humanizer: use_humanizer === true,
        intent: intent ?? 'informasional',
        status: 'pending',
      },
    })
    created.push(kw)
  }

  return NextResponse.json({ created: created.length, skipped: lines.length - created.length })
}
