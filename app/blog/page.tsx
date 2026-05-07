import type { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import { blogPosts } from '@/lib/data/blog'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Blog & Edukasi | NDS Kreasi',
  description: 'Insight terbaru tentang digital marketing, website, dan strategi bisnis online untuk UMKM Indonesia.',
}

export default async function BlogPage() {
  const dbArticles = await prisma.article.findMany({
    where: { status: 'published' },
    orderBy: { published_at: 'desc' },
    select: {
      slug: true, title: true, excerpt: true, word_count: true,
      published_at: true, featured_image: true, image_alt: true,
      category: { select: { name: true, slug: true, color: true } },
    },
  })

  const aiPosts = dbArticles.map(a => ({
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt ?? '',
    date: a.published_at
      ? new Date(a.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
      : '',
    readTime: `${Math.max(1, Math.round(a.word_count / 200))} menit`,
    category: a.category?.name ?? 'AI Generated',
    categorySlug: a.category?.slug ?? null,
    categoryColor: a.category?.color ?? null,
    isAI: true,
    featured_image: a.featured_image,
    image_alt: a.image_alt,
  }))

  const staticPosts = blogPosts.map(p => ({
    ...p, isAI: false, featured_image: null as string | null, image_alt: null as string | null,
  }))
  const allPosts = [...aiPosts, ...staticPosts]

  return (
    <>
      <section className="py-20 bg-primary">
        <Container>
          <div className="max-w-2xl">
            <span className="inline-block bg-white/10 text-white/80 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
              Blog
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Blog & Edukasi</h1>
            <p className="text-white/70 text-lg">
              Insight digital marketing, tips website, dan strategi bisnis online
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16 bg-background-alt">
        <Container>
          {allPosts.length === 0 ? (
            <p className="text-center text-gray-500 py-20">Belum ada artikel tersedia.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allPosts.map(post => (
                <Link href={`/blog/${post.slug}`} key={post.slug} className="group">
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 h-full flex flex-col overflow-hidden">
                    {post.featured_image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={post.featured_image}
                        alt={post.image_alt ?? post.title}
                        className="w-full h-44 object-cover"
                      />
                    )}
                    <div className="p-6 flex flex-col h-full">
                      <div className="mb-3 flex items-center justify-between">
                        {'categorySlug' in post && post.categorySlug ? (
                          <Link
                            href={`/blog/kategori/${post.categorySlug}`}
                            onClick={e => e.stopPropagation()}
                            className="inline-block text-white text-xs font-bold px-2.5 py-1 rounded-full"
                            style={{ backgroundColor: post.categoryColor ?? '#f97316' }}
                          >
                            {post.category}
                          </Link>
                        ) : (
                          <span className="inline-block bg-accent/10 text-accent text-xs font-bold px-2.5 py-1 rounded-full">
                            {post.category}
                          </span>
                        )}
                        {post.isAI && (
                          <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">AI</span>
                        )}
                      </div>
                      <h2 className="text-lg font-bold text-primary mb-3 group-hover:text-accent transition-colors leading-snug">
                        {post.title}
                      </h2>
                      <p className="text-text-secondary text-sm mb-4 flex-1 line-clamp-3">{post.excerpt}</p>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-3 text-xs text-text-secondary">
                          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{post.date}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{post.readTime}</span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  )
}
