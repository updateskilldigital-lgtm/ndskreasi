import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json()
  const link = await prisma.affiliateLink.update({
    where: { id: parseInt(id) },
    data: {
      ...(body.keyword !== undefined && { keyword: body.keyword.trim().toLowerCase() }),
      ...(body.url !== undefined && { url: body.url.trim() }),
      ...(body.label !== undefined && { label: body.label?.trim() || null }),
      ...(body.is_active !== undefined && { is_active: body.is_active }),
    },
  })
  return NextResponse.json(link)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  await prisma.affiliateLink.delete({ where: { id: parseInt(id) } })
  return NextResponse.json({ success: true })
}
