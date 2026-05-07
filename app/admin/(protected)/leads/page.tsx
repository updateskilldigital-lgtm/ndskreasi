import { prisma } from '@/lib/prisma'
import { LeadsTable } from '@/components/admin/LeadsTable'

export default async function LeadsPage() {
  const leads = await prisma.lead.findMany({
    orderBy: { created_at: 'desc' },
  })

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
        <p className="text-gray-500 text-sm mt-1">{leads.length} lead terdaftar</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <LeadsTable leads={leads} />
      </div>
    </div>
  )
}
