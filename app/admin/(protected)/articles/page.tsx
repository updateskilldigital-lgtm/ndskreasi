import { prisma } from '@/lib/prisma'
import { ArticlesTable } from '@/components/admin/ArticlesTable'

export const dynamic = 'force-dynamic'

export default async function ArticlesPage() {
  const articles = await prisma.article.findMany({
    orderBy: { created_at: 'desc' },
    include: { keyword: { select: { keyword: true } } },
  })

  const published = articles.filter(a => a.status === 'published').length
  const draft = articles.filter(a => a.status === 'draft').length
  const avgSeo = articles.length
    ? Math.round(articles.reduce((sum, a) => sum + a.seo_score, 0) / articles.length)
    : 0

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Artikel</h1>
        <p className="text-gray-500 text-sm mt-1">{articles.length} artikel tersimpan</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Published', value: published, color: 'text-green-600' },
          { label: 'Draft', value: draft, color: 'text-gray-500' },
          { label: 'Rata-rata SEO Score', value: `${avgSeo}/100`, color: 'text-[#1a1564]' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <ArticlesTable articles={articles.map(a => ({
          ...a,
          published_at: a.published_at?.toISOString() ?? null,
          created_at: a.created_at.toISOString(),
          updated_at: a.updated_at.toISOString(),
          keyword: a.keyword,
        }))} />
      </div>
    </div>
  )
}
