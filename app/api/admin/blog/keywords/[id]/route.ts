import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  await prisma.keyword.delete({ where: { id: parseInt(id) } })
  return NextResponse.json({ success: true })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const data = await request.json()
  const keyword = await prisma.keyword.update({
    where: { id: parseInt(id) },
    data: { status: data.status, error_msg: data.error_msg ?? null },
  })
  return NextResponse.json(keyword)
}
