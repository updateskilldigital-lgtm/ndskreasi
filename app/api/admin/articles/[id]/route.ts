import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calculateSeoScore } from '@/lib/services/ai-content'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()

  const data: Record<string, unknown> = {}

  if ('status' in body) {
    data.status = body.status
    if (body.status === 'published') {
      const current = await prisma.article.findUnique({ where: { id: parseInt(id) }, select: { published_at: true } })
      data.published_at = current?.published_at ?? new Date()
    } else {
      data.published_at = null
    }
  }
  if ('title'            in body) data.title            = body.title
  if ('headline'         in body) data.headline         = body.headline || null
  if ('excerpt'          in body) data.excerpt          = body.excerpt || null
  if ('content'          in body) data.content          = body.content
  if ('meta_title'       in body) data.meta_title       = body.meta_title || null
  if ('meta_description' in body) data.meta_description = body.meta_description || null
  if ('featured_image'   in body) data.featured_image   = body.featured_image || null
  if ('image_alt'        in body) data.image_alt        = body.image_alt || null

  if ('category_id' in body) data.category_id = body.category_id ?? null

  if ('content' in body) {
    const text = (body.content as string).replace(/<[^>]+>/g, ' ')
    data.word_count = text.split(/\s+/).filter(Boolean).length
    data.seo_score = calculateSeoScore({
      title:           (body.title           ?? '') as string,
      metaDescription: (body.meta_description ?? '') as string,
      content:         body.content as string,
      excerpt:         (body.excerpt          ?? '') as string,
      hasCategory:     !!(body.category_id ?? data.category_id),
      tagsCount:       Array.isArray(body.tags) ? body.tags.length : 0,
    })
  }

  const articleId = parseInt(id)

  // Handle tags: upsert by name, then sync ArticleTag join table
  if (Array.isArray(body.tags)) {
    const tagNames: string[] = body.tags.map((t: string) => t.trim()).filter(Boolean)

    const upsertedTags = await Promise.all(
      tagNames.map(name => {
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        return prisma.tag.upsert({ where: { slug }, update: {}, create: { name, slug } })
      })
    )

    await prisma.articleTag.deleteMany({ where: { article_id: articleId } })
    if (upsertedTags.length > 0) {
      await prisma.articleTag.createMany({
        data: upsertedTags.map(t => ({ article_id: articleId, tag_id: t.id })),
        skipDuplicates: true,
      })
    }
  }

  const article = await prisma.article.update({
    where: { id: articleId },
    data,
    include: { category: true, tags: { include: { tag: true } } },
  })
  return NextResponse.json(article)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  await prisma.article.delete({ where: { id: parseInt(id) } })
  return NextResponse.json({ success: true })
}
