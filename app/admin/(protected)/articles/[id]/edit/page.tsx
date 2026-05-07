import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { ArticleEditor } from '@/components/admin/ArticleEditor'

export const dynamic = 'force-dynamic'

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [article, categories] = await Promise.all([
    prisma.article.findUnique({
      where: { id: parseInt(id) },
      include: {
        category: true,
        tags: { include: { tag: true } },
      },
    }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ])

  if (!article) notFound()

  return (
    <ArticleEditor
      article={{
        id:               article.id,
        title:            article.title,
        slug:             article.slug,
        headline:         article.headline,
        excerpt:          article.excerpt,
        content:          article.content,
        meta_title:       article.meta_title,
        meta_description: article.meta_description,
        featured_image:   article.featured_image,
        image_alt:        article.image_alt,
        status:           article.status,
        seo_score:        article.seo_score,
        word_count:       article.word_count,
        category_id:      article.category_id,
        tags:             article.tags.map(at => at.tag.name),
      }}
      categories={categories}
    />
  )
}
