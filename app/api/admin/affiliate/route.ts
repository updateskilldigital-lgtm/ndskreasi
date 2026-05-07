import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const links = await prisma.affiliateLink.findMany({
    orderBy: { created_at: 'desc' },
  })
  return NextResponse.json(links)
}

export async function POST(req: NextRequest) {
  const { keyword, url, label, type, image_url, price, badge } = await req.json()
  if (!keyword?.trim() || !url?.trim()) {
    return NextResponse.json({ error: 'keyword dan url wajib diisi' }, { status: 400 })
  }

  try {
    const link = await prisma.affiliateLink.create({
      data: {
        keyword: keyword.trim().toLowerCase(),
        url: url.trim(),
        label: label?.trim() || null,
        type: type ?? 'link',
        image_url: image_url || null,
        price: price?.trim() || null,
        badge: badge?.trim() || null,
      },
    })
    return NextResponse.json(link, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Keyword sudah ada' }, { status: 409 })
  }
}
