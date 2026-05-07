import { prisma } from '@/lib/prisma'
import { KeywordForm } from '@/components/admin/KeywordForm'
import { KeywordsTable } from '@/components/admin/KeywordsTable'

export const dynamic = 'force-dynamic'

export default async function BlogGeneratorPage() {
  const keywords = await prisma.keyword.findMany({
    orderBy: [{ priority: 'desc' }, { created_at: 'desc' }],
    include: { articles: { select: { id: true, slug: true, status: true } } },
  })

  const total = keywords.length
  const pending = keywords.filter(k => k.status === 'pending').length
  const done = keywords.filter(k => k.status === 'done').length
  const failed = keywords.filter(k => k.status === 'failed').length

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Blog Generator</h1>
        <p className="text-gray-500 text-sm mt-1">Generate artikel SEO otomatis menggunakan AI</p>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Total Keywords', value: total, color: 'text-gray-900' },
          { label: 'Pending', value: pending, color: 'text-yellow-600' },
          { label: 'Selesai', value: done, color: 'text-green-600' },
          { label: 'Gagal', value: failed, color: 'text-red-500' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[320px_1fr] gap-6">
        <KeywordForm />
        <KeywordsTable keywords={keywords.map(k => ({
          ...k,
          created_at: k.created_at.toISOString(),
        }))} />
      </div>
    </div>
  )
}
