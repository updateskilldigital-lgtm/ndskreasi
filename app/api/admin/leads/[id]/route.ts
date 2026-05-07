import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const VALID_STATUSES = ['new', 'contacted', 'proposal', 'converted', 'lost']

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { status } = await request.json()

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: 'Status tidak valid' }, { status: 400 })
  }

  try {
    const lead = await prisma.lead.update({
      where: { id: parseInt(id) },
      data: { status },
    })
    return NextResponse.json(lead)
  } catch {
    return NextResponse.json({ error: 'Lead tidak ditemukan' }, { status: 404 })
  }
}
