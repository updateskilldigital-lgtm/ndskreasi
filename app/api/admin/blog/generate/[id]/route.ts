import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateArticle, calculateSeoScore, toSlug, type AIProvider } from '@/lib/services/ai-content'
import { generateArticleImage } from '@/lib/services/image-gen'

export const maxDuration = 300

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const keywordId = parseInt(id)

  const keyword = await prisma.keyword.findUnique({ where: { id: keywordId } })
  if (!keyword) return NextResponse.json({ error: 'Keyword tidak ditemukan' }, { status: 404 })

  if (keyword.status === 'processing') {
    return NextResponse.json({ error: 'Sedang dalam proses' }, { status: 409 })
  }

  await prisma.keyword.update({ where: { id: keywordId }, data: { status: 'processing', error_msg: null } })

  try {
    const result = await generateArticle(keyword.keyword, keyword.ai_provider as AIProvider, {
      tone: keyword.focus_tone,
      wordCount: keyword.target_words,
      useHumanizer: keyword.use_humanizer,
    })

    // If AI didn't return a proper title, derive one from the keyword
    if (result.title === 'Artikel Baru') {
      result.title = keyword.keyword
        .split(' ')
        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ')
      console.warn(`[Generate] Fallback title used for keyword: "${keyword.keyword}"`)
    }

    let slug = toSlug(result.title) || toSlug(keyword.keyword)
    const existing = await prisma.article.findUnique({ where: { slug } })
    if (existing) slug = `${slug}-${Date.now()}`

    const seoScore = calculateSeoScore({
      title: result.title,
      metaDescription: result.metaDescription,
      content: result.content,
      excerpt: result.excerpt,
    })

    const article = await prisma.article.create({
      data: {
        keyword_id: keywordId,
        title: result.title,
        slug,
        headline: result.headline || null,
        excerpt: result.excerpt || null,
        content: result.content,
        ai_provider: keyword.ai_provider,
        meta_title: result.title,
        meta_description: result.metaDescription || null,
        faq_data: result.faqs.length > 0 ? JSON.stringify(result.faqs) : null,
        word_count: result.wordCount,
        seo_score: seoScore,
        status: 'draft',
      },
    })

    // Generate image (failure is non-fatal)
    try {
      const image = await generateArticleImage(result.title, keyword.keyword, slug)
      if (image.url) {
        await prisma.article.update({
          where: { id: article.id },
          data: { featured_image: image.url, image_alt: image.alt },
        })
      }
    } catch (imgErr) {
      console.error('[Generate] Image failed:', imgErr instanceof Error ? imgErr.message : imgErr)
    }

    await prisma.keyword.update({
      where: { id: keywordId },
      data: { status: 'done' },
    })

    return NextResponse.json({ success: true, article })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    await prisma.keyword.update({
      where: { id: keywordId },
      data: { status: 'failed', error_msg: message },
    })
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
