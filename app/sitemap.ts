import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { blogPosts } from '@/lib/data/blog'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ndskreasi.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/layanan`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/portofolio`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/tentang`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ]

  const dbArticles = await prisma.article.findMany({
    where: { status: 'published' },
    select: { slug: true, updated_at: true, published_at: true },
    orderBy: { published_at: 'desc' },
  })

  const dbPages: MetadataRoute.Sitemap = dbArticles.map(a => ({
    url: `${SITE_URL}/blog/${a.slug}`,
    lastModified: a.updated_at,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  const dbSlugs = new Set(dbArticles.map(a => a.slug))
  const staticBlogPages: MetadataRoute.Sitemap = blogPosts
    .filter(p => !dbSlugs.has(p.slug))
    .map(p => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    }))

  return [...staticPages, ...dbPages, ...staticBlogPages]
}
