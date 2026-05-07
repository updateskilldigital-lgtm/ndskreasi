import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Calendar, Clock, ArrowLeft, Bot } from 'lucide-react'
import { getBlogPost } from '@/lib/data/blog'
import { prisma } from '@/lib/prisma'
import { markdownToHtml, extractHeadings } from '@/lib/utils/markdown'
import { TableOfContents } from '@/components/blog/TableOfContents'
import { injectAffiliateLinks, injectInternalLinks, buildAffiliateDisclosure } from '@/lib/utils/link-injector'
import { injectAdSense } from '@/lib/utils/adsense'
import { ScrollLeadForm } from '@/components/blog/ScrollLeadForm'
import { ArticleTracker, WaTracker } from '@/components/blog/ArticleTracker'
import { LeadMagnetButton } from '@/components/blog/LeadMagnetButton'

export const dynamic = 'force-dynamic'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ndskreasi.com'
const SITE_NAME = 'NDS Kreasi'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params

  const dbArticle = await prisma.article.findUnique({
    where: { slug, status: 'published' },
  })

  if (dbArticle) {
    const title = dbArticle.meta_title ?? dbArticle.title
    const description = dbArticle.meta_description ?? dbArticle.excerpt ?? ''
    const url = `${SITE_URL}/blog/${slug}`

    const ogImage = dbArticle.featured_image
      ? dbArticle.featured_image.startsWith('/')
        ? `${SITE_URL}${dbArticle.featured_image}`
        : dbArticle.featured_image
      : undefined

    return {
      title: `${title} | ${SITE_NAME}`,
      description,
      alternates: { canonical: url },
      openGraph: {
        type: 'article',
        url,
        title,
        description,
        siteName: SITE_NAME,
        publishedTime: dbArticle.published_at?.toISOString(),
        modifiedTime: dbArticle.updated_at.toISOString(),
        authors: [SITE_NAME],
        ...(ogImage && { images: [{ url: ogImage, width: 1792, height: 1024, alt: title }] }),
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        ...(ogImage && { images: [ogImage] }),
      },
    }
  }

  const post = getBlogPost(slug)
  if (!post) return {}

  const title = `${post.title} | ${SITE_NAME}`
  const url = `${SITE_URL}/blog/${slug}`
  return {
    title,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: post.title,
      description: post.excerpt,
      siteName: SITE_NAME,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params

  const dbArticle = await prisma.article.findUnique({
    where: { slug, status: 'published' },
    include: { keyword: true, category: true, tags: { include: { tag: true } } },
  })

  if (dbArticle) {
    const intent = dbArticle.keyword?.intent ?? 'informasional'
    const [affiliates, relatedArticles] = await Promise.all([
      prisma.affiliateLink.findMany({ where: { is_active: true } }),
      prisma.article.findMany({
        where: { status: 'published', slug: { not: slug } },
        select: { slug: true, title: true, keyword: { select: { keyword: true } } },
        orderBy: { published_at: 'desc' },
        take: 20,
      }),
    ])

    const rawHtml = markdownToHtml(dbArticle.content)
    const headings = extractHeadings(dbArticle.content)

    const { html: afterAffiliate, hasAffiliate } = injectAffiliateLinks(
      rawHtml,
      affiliates.map(a => ({
        keyword: a.keyword, url: a.url, label: a.label,
        type: a.type, image_url: a.image_url, price: a.price, badge: a.badge,
      }))
    )

    const afterInternal = injectInternalLinks(
      afterAffiliate,
      slug,
      relatedArticles.map(a => ({ slug: a.slug, title: a.title, keyword: a.keyword?.keyword ?? null }))
    )

    const withAds = injectAdSense(afterInternal)
    const htmlWithCta = injectInlineCta(withAds, slug, intent)
    const readTime = Math.max(1, Math.round(dbArticle.word_count / 200))
    const faqs: { question: string; answer: string }[] =
      dbArticle.faq_data ? JSON.parse(dbArticle.faq_data) : []
    const publishedAt = dbArticle.published_at
      ? new Date(dbArticle.published_at).toLocaleDateString('id-ID', {
          day: 'numeric', month: 'long', year: 'numeric',
        })
      : ''

    const heroImageUrl = dbArticle.featured_image
      ? dbArticle.featured_image.startsWith('/')
        ? `${SITE_URL}${dbArticle.featured_image}`
        : dbArticle.featured_image
      : undefined

    const articleSchema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: dbArticle.title,
      description: dbArticle.excerpt ?? dbArticle.meta_description ?? '',
      datePublished: dbArticle.published_at?.toISOString(),
      dateModified: dbArticle.updated_at.toISOString(),
      wordCount: dbArticle.word_count,
      ...(heroImageUrl && { image: heroImageUrl }),
      author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
      publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
      mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blog/${slug}` },
    }

    const faqSchema = faqs.length > 0 ? {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    } : null

    const breadcrumbItems = [
      { name: 'Home',  url: SITE_URL },
      { name: 'Blog',  url: `${SITE_URL}/blog` },
      ...(dbArticle.category
        ? [{ name: dbArticle.category.name, url: `${SITE_URL}/blog/kategori/${dbArticle.category.slug}` }]
        : []),
      { name: dbArticle.title },
    ]
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbItems.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
        ...('url' in item ? { item: item.url } : {}),
      })),
    }

    return (
      <section className="py-20">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
        {faqSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
          />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />

        <Container maxWidth="md">
          <Link href="/blog" className="inline-flex items-center gap-2 text-text-secondary hover:text-accent transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Blog
          </Link>

          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {dbArticle.category && (
                <Link
                  href={`/blog/kategori/${dbArticle.category.slug}`}
                  className="inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full text-white"
                  style={{ backgroundColor: dbArticle.category.color }}
                >
                  {dbArticle.category.name}
                </Link>
              )}
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-accent bg-accent/10 px-2.5 py-1 rounded-full">
                <Bot className="h-3 w-3" /> AI Generated
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary mt-2 mb-4 leading-tight">
              {dbArticle.title}
            </h1>
            {dbArticle.headline && (
              <p className="text-xl text-gray-600 mb-4">{dbArticle.headline}</p>
            )}
            <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{publishedAt}</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{readTime} menit baca</span>
              <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{dbArticle.word_count.toLocaleString()} kata</span>
              {dbArticle.seo_score > 0 && (
                <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded">
                  SEO {dbArticle.seo_score}/100
                </span>
              )}
            </div>
            <div className="mt-4">
              <LeadMagnetButton slug={slug} />
            </div>
          </div>

          {dbArticle.featured_image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={dbArticle.featured_image}
              alt={dbArticle.image_alt ?? dbArticle.title}
              className="w-full rounded-xl object-cover mb-8"
              style={{ maxHeight: '420px' }}
            />
          )}

          {headings.length >= 3 && <TableOfContents headings={headings} />}

          {hasAffiliate && (
            <div dangerouslySetInnerHTML={{ __html: buildAffiliateDisclosure() }} />
          )}

          <div
            className="prose prose-lg max-w-none mb-10"
            dangerouslySetInnerHTML={{ __html: htmlWithCta }}
          />

          {faqs.length > 0 && (
            <div className="mb-10 bg-blue-50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-primary mb-5">Pertanyaan yang Sering Ditanyakan</h2>
              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <details key={i} className="group bg-white rounded-lg border border-blue-100">
                    <summary className="flex items-center justify-between p-4 cursor-pointer font-medium text-gray-900 list-none">
                      {faq.question}
                      <span className="text-accent group-open:rotate-180 transition-transform shrink-0 ml-3">&#9660;</span>
                    </summary>
                    <div className="px-4 pb-4 text-sm text-gray-700 leading-relaxed">{faq.answer}</div>
                  </details>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {dbArticle.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-8 pt-4 border-t border-gray-100">
              <span className="text-xs text-gray-400 font-medium">Tags:</span>
              {dbArticle.tags.map(({ tag }) => (
                <Link
                  key={tag.id}
                  href={`/blog/tag/${tag.slug}`}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-2.5 py-1 rounded-full transition-colors"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          )}

          <div className="p-6 bg-accent/10 rounded-xl text-center">
            <p className="font-bold text-primary mb-2">Butuh bantuan untuk bisnis digital Anda?</p>
            <p className="text-text-secondary text-sm mb-4">Konsultasi gratis dengan tim NDS Kreasi sekarang.</p>
            <Link href="/#lead-form">
              <button className="bg-accent text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-accent-dark transition-colors">
                Konsultasi Gratis
              </button>
            </Link>
          </div>
        </Container>

        <ArticleTracker slug={slug} />
        <ScrollLeadForm slug={slug} />
      </section>
    )
  }

  // Fall back to static posts
  const post = getBlogPost(slug)
  if (!post) notFound()

  const paragraphs = post.content.split('\n\n')

  return (
    <section className="py-20">
      <Container maxWidth="md">
        <Link href="/blog" className="inline-flex items-center gap-2 text-text-secondary hover:text-accent transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Blog
        </Link>

        <div className="mb-6">
          <span className="text-accent font-semibold text-sm">{post.category}</span>
          <h1 className="text-3xl md:text-4xl font-bold text-primary mt-2 mb-4">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{post.date}</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{post.readTime}</span>
          </div>
        </div>

        <div className="prose prose-lg max-w-none text-text-secondary space-y-4">
          {paragraphs.map((paragraph, i) => {
            if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
              return <h2 key={i} className="text-xl font-bold text-primary mt-8 mb-2">{paragraph.replace(/\*\*/g, '')}</h2>
            }
            if (paragraph.startsWith('- ')) {
              const items = paragraph.split('\n').filter(Boolean)
              return (
                <ul key={i} className="list-disc list-inside space-y-1">
                  {items.map((item, j) => <li key={j}>{item.replace(/^- /, '')}</li>)}
                </ul>
              )
            }
            return <p key={i}>{paragraph}</p>
          })}
        </div>

        <div className="mt-12 p-6 bg-accent/10 rounded-xl text-center">
          <p className="font-bold text-primary mb-2">Siap wujudkan bisnis digital Anda?</p>
          <p className="text-text-secondary text-sm mb-4">Konsultasi gratis dengan tim kami sekarang.</p>
          <Link href="/#lead-form">
            <button className="bg-accent text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-accent-dark transition-colors">
              Konsultasi Gratis
            </button>
          </Link>
        </div>
      </Container>
    </section>
  )
}

function injectInlineCta(html: string, _slug: string, intent = 'informasional'): string {
  const waNumber = process.env.NEXT_PUBLIC_WA_NUMBER ?? '6281234567890'

  const CTA_VARIANTS: Record<string, string> = {
    transaksional: `
<div class="my-8 p-5 bg-gradient-to-r from-[#1a1564] to-[#2520a8] rounded-xl flex flex-col sm:flex-row items-center gap-4 text-white">
  <div class="flex-1">
    <p class="font-bold text-lg mb-1">Siap Mulai Proyek Anda?</p>
    <p class="text-white/80 text-sm">Tim NDS Kreasi siap konsultasi GRATIS — respons cepat, tanpa biaya tersembunyi.</p>
  </div>
  <div class="flex flex-col sm:flex-row gap-2 shrink-0">
    <a href="https://wa.me/${waNumber}?text=Halo%20NDS%20Kreasi%2C%20saya%20ingin%20konsultasi" target="_blank"
      class="bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors whitespace-nowrap text-center">
      💬 Chat WhatsApp
    </a>
    <a href="/#lead-form" class="bg-white/20 hover:bg-white/30 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors whitespace-nowrap text-center">
      Isi Form →
    </a>
  </div>
</div>`,

    komparasi: `
<div class="my-8 p-5 bg-amber-50 border border-amber-200 rounded-xl flex flex-col sm:flex-row items-center gap-4">
  <div class="flex-1">
    <p class="font-bold text-gray-900 text-base mb-1">Bingung Pilih yang Tepat untuk Bisnis Anda?</p>
    <p class="text-gray-600 text-sm">Konsultasikan kebutuhan Anda — kami bantu pilihkan solusi yang paling efisien dan sesuai budget.</p>
  </div>
  <a href="https://wa.me/${waNumber}?text=Halo%2C%20saya%20butuh%20rekomendasi%20solusi%20digital" target="_blank"
    class="shrink-0 bg-[#f97316] hover:bg-[#ea6c0a] text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors whitespace-nowrap">
    Minta Rekomendasi →
  </a>
</div>`,

    masalah: `
<div class="my-8 p-5 bg-red-50 border border-red-100 rounded-xl flex flex-col sm:flex-row items-center gap-4">
  <div class="flex-1">
    <p class="font-bold text-gray-900 text-base mb-1">Punya Masalah Serupa di Bisnis Anda?</p>
    <p class="text-gray-600 text-sm">Ceritakan situasinya — tim kami bantu diagnosa dan carikan solusi yang tepat, gratis.</p>
  </div>
  <a href="https://wa.me/${waNumber}?text=Halo%20NDS%20Kreasi%2C%20saya%20punya%20masalah%20dan%20butuh%20bantuan" target="_blank"
    class="shrink-0 bg-[#1a1564] hover:bg-[#2520a8] text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors whitespace-nowrap">
    💬 Ceritakan Masalahnya
  </a>
</div>`,

    informasional: `
<div class="my-8 p-5 bg-gradient-to-r from-[#1a1564]/5 to-[#f97316]/5 border border-[#1a1564]/10 rounded-xl flex flex-col sm:flex-row items-center gap-4">
  <div class="flex-1">
    <p class="font-bold text-[#1a1564] text-base mb-1">Mau Tips Digital Marketing Lebih Lanjut?</p>
    <p class="text-gray-600 text-sm">Dapatkan insight eksklusif dan studi kasus UMKM Indonesia langsung di inbox Anda.</p>
  </div>
  <a href="/#lead-form" class="shrink-0 bg-[#f97316] hover:bg-[#ea6c0a] text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors whitespace-nowrap">
    Konsultasi Gratis →
  </a>
</div>`,
  }

  const CTA_HTML = CTA_VARIANTS[intent] ?? CTA_VARIANTS.informasional

  // inject after the 2nd </h2>
  let count = 0
  return html.replace(/<\/h2>/g, (match) => {
    count++
    return count === 2 ? `${match}${CTA_HTML}` : match
  })
}
