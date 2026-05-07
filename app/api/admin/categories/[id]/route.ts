import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function toSlug(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json()
  const data: Record<string, unknown> = {}
  if (body.name)                { data.name = body.name.trim(); data.slug = toSlug(body.name) }
  if ('description' in body)    data.description = body.description || null
  if (body.color)               data.color = body.color

  const category = await prisma.category.update({ where: { id: parseInt(id) }, data })
  return NextResponse.json(category)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  await prisma.category.delete({ where: { id: parseInt(id) } })
  return NextResponse.json({ success: true })
}
