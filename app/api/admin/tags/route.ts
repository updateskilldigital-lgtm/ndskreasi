import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function toSlug(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export async function GET() {
  const tags = await prisma.tag.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { articles: true } } },
  })
  return NextResponse.json(tags)
}

export async function POST(req: NextRequest) {
  const { name } = await req.json()
  if (!name?.trim()) return NextResponse.json({ error: 'Nama wajib diisi' }, { status: 400 })

  const slug = toSlug(name)
  const tag = await prisma.tag.upsert({
    where: { slug },
    update: {},
    create: { name: name.trim(), slug },
  })
  return NextResponse.json(tag, { status: 201 })
}
