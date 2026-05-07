import { prisma } from '@/lib/prisma'
import { CategoryManager } from '@/components/admin/CategoryManager'

export const dynamic = 'force-dynamic'

export default async function CategoriesPage() {
  const [categories, tags] = await Promise.all([
    prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { articles: true } } },
    }),
    prisma.tag.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { articles: true } } },
    }),
  ])

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Kategori & Tag</h1>
        <p className="text-gray-500 text-sm mt-1">Organisasi konten untuk SEO dan navigasi</p>
      </div>
      <CategoryManager
        initialCategories={categories.map(c => ({ ...c, created_at: c.created_at.toISOString(), articleCount: c._count.articles }))}
        initialTags={tags.map(t => ({ ...t, created_at: t.created_at.toISOString(), articleCount: t._count.articles }))}
      />
    </div>
  )
}
