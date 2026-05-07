import { prisma } from '@/lib/prisma'
import { AffiliateTable } from '@/components/admin/AffiliateTable'

export const dynamic = 'force-dynamic'

export default async function AffiliateLinksPage() {
  const links = await prisma.affiliateLink.findMany({
    orderBy: { created_at: 'desc' },
  })

  const active = links.filter(l => l.is_active).length

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Affiliate Links</h1>
        <p className="text-gray-500 text-sm mt-1">
          {links.length} link terdaftar · {active} aktif — otomatis diinjeksi ke artikel yang dipublish
        </p>
      </div>

      <AffiliateTable links={links.map(l => ({
        ...l,
        created_at: l.created_at.toISOString(),
      }))} />
    </div>
  )
}
