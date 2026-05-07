import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const { type } = await req.json() as { type: 'view' | 'wa_click' }

  try {
    if (type === 'view') {
      await prisma.article.update({
        where: { slug, status: 'published' },
        data: { view_count: { increment: 1 } },
      })
    } else if (type === 'wa_click') {
      await prisma.article.update({
        where: { slug, status: 'published' },
        data: { wa_click_count: { increment: 1 } },
      })
    }
  } catch {
    // article not found — silently ignore
  }

  return NextResponse.json({ ok: true })
}
