import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const articles = await prisma.article.findMany({
    orderBy: { created_at: 'desc' },
    include: { keyword: { select: { keyword: true } } },
  })
  return NextResponse.json(articles)
}
