import { prisma } from '@/lib/prisma'
import { blogPosts } from '@/lib/data/blog'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ndskreasi.com'
const SITE_NAME = 'NDS Kreasi'
const SITE_DESC = 'Tips digital marketing, pembuatan website, dan strategi bisnis online untuk UMKM Indonesia.'

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const dbArticles = await prisma.article.findMany({
    where: { status: 'published' },
    orderBy: { published_at: 'desc' },
    take: 50,
    select: {
      title: true, slug: true, excerpt: true,
      published_at: true, updated_at: true, word_count: true,
    },
  })

  const items = [
    ...dbArticles.map(a => ({
      title: a.title,
      link: `${SITE_URL}/blog/${a.slug}`,
      description: a.excerpt ?? '',
      pubDate: (a.published_at ?? a.updated_at).toUTCString(),
      guid: `${SITE_URL}/blog/${a.slug}`,
    })),
    ...blogPosts.map(p => ({
      title: p.title,
      link: `${SITE_URL}/blog/${p.slug}`,
      description: p.excerpt,
      pubDate: new Date().toUTCString(),
      guid: `${SITE_URL}/blog/${p.slug}`,
    })),
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESC)}</description>
    <language>id</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${items.map(item => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${item.link}</link>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${item.pubDate}</pubDate>
      <guid isPermaLink="true">${item.guid}</guid>
    </item>`).join('\n')}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  })
}
