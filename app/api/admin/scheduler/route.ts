import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const { enabled, max_per_day } = await req.json()

  await prisma.$transaction([
    prisma.setting.upsert({
      where: { key: 'scheduler_enabled' },
      update: { value: String(enabled) },
      create: { key: 'scheduler_enabled', value: String(enabled) },
    }),
    prisma.setting.upsert({
      where: { key: 'scheduler_max_per_day' },
      update: { value: String(max_per_day) },
      create: { key: 'scheduler_max_per_day', value: String(max_per_day) },
    }),
  ])

  return NextResponse.json({ ok: true })
}
