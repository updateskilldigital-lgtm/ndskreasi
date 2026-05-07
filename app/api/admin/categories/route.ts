import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function toSlug(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { articles: true } } },
  })
  return NextResponse.json(categories)
}

export async function POST(req: NextRequest) {
  const { name, description, color } = await req.json()
  if (!name?.trim()) return NextResponse.json({ error: 'Nama wajib diisi' }, { status: 400 })

  const slug = toSlug(name)
  const category = await prisma.category.create({
    data: { name: name.trim(), slug, description: description || null, color: color || '#1a1564' },
  })
  return NextResponse.json(category, { status: 201 })
}
