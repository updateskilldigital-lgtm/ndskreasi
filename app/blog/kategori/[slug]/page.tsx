import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Container } from '@/components/ui/Container'
import { Calendar, Clock, ArrowLeft } from 'lucide-react'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = await prisma.category.findUnique({ where: { slug } })
  if (!category) return {}
  return {
    title: `${category.name} | Blog NDS Kreasi`,
    description: category.description ?? `Artikel kategori ${category.name}`,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      articles: {
        where: { status: 'published' },
        orderBy: { published_at: 'desc' },
        select: {
          slug: true, title: true, excerpt: true, word_count: true,
          published_at: true, featured_image: true, image_alt: true,
        },
      },
    },
  })

  if (!category) notFound()

  return (
    <>
      <section className="py-16" style={{ backgroundColor: category.color }}>
        <Container>
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Semua Artikel
          </Link>
          <div className="max-w-2xl">
            <span className="inline-block bg-white/10 text-white/80 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
              Kategori
            </span>
            <h1 className="text-4xl font-extrabold text-white mb-3">{category.name}</h1>
            {category.description && (
              <p className="text-white/70 text-lg">{category.description}</p>
            )}
            <p className="text-white/50 text-sm mt-2">{category.articles.length} artikel</p>
          </div>
        </Container>
      </section>

      <section className="py-16 bg-gray-50">
        <Container>
          {category.articles.length === 0 ? (
            <p className="text-center text-gray-500 py-20">Belum ada artikel di kategori ini.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.articles.map(article => (
                <Link href={`/blog/${article.slug}`} key={article.slug} className="group">
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 h-full flex flex-col overflow-hidden">
                    {article.featured_image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={article.featured_image} alt={article.image_alt ?? article.title} className="w-full h-44 object-cover" />
                    )}
                    <div className="p-6 flex flex-col flex-1">
                      <span
                        className="inline-block text-white text-xs font-bold px-2.5 py-1 rounded-full mb-3 self-start"
                        style={{ backgroundColor: category.color }}
                      >
                        {category.name}
                      </span>
                      <h2 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-accent transition-colors leading-snug line-clamp-2">
                        {article.title}
                      </h2>
                      <p className="text-gray-500 text-sm mb-4 flex-1 line-clamp-3">{article.excerpt}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-400 pt-3 border-t border-gray-100">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {article.published_at
                            ? new Date(article.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                            : '—'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {Math.max(1, Math.round(article.word_count / 200))} menit
                        </span>
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
