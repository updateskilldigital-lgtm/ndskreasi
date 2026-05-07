import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateArticle, calculateSeoScore, type AIProvider } from '@/lib/services/ai-content'
import { generateArticleImage } from '@/lib/services/image-gen'

export const maxDuration = 300

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const articleId = parseInt(id)

  const article = await prisma.article.findUnique({
    where: { id: articleId },
    include: { keyword: true },
  })
  if (!article) return NextResponse.json({ error: 'Artikel tidak ditemukan' }, { status: 404 })

  const keyword     = article.keyword?.keyword ?? article.title
  const provider    = (article.keyword?.ai_provider ?? article.ai_provider ?? 'openai') as AIProvider
  const tone        = article.keyword?.focus_tone   ?? 'informatif'
  const wordCount   = article.keyword?.target_words ?? 1500
  const useHumanizer = article.keyword?.use_humanizer ?? false

  try {
    const result = await generateArticle(keyword, provider, { tone, wordCount, useHumanizer })

    const seoScore = calculateSeoScore({
      title: result.title,
      metaDescription: result.metaDescription,
      content: result.content,
      excerpt: result.excerpt,
    })

    const updated = await prisma.article.update({
      where: { id: articleId },
      data: {
        title:            result.title !== 'Artikel Baru' ? result.title : article.title,
        headline:         result.headline  || null,
        excerpt:          result.excerpt   || null,
        content:          result.content,
        meta_title:       result.title !== 'Artikel Baru' ? result.title : article.meta_title,
        meta_description: result.metaDescription || null,
        faq_data:         result.faqs.length > 0 ? JSON.stringify(result.faqs) : null,
        word_count:       result.wordCount,
        seo_score:        seoScore,
        updated_at:       new Date(),
      },
    })

    // Refresh image too (non-fatal)
    try {
      const image = await generateArticleImage(updated.title, keyword, article.slug)
      if (image.url) {
        await prisma.article.update({
          where: { id: articleId },
          data: { featured_image: image.url, image_alt: image.alt },
        })
      }
    } catch { /* image failure is non-fatal */ }

    return NextResponse.json({ success: true, article: updated })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 })
  }
}
