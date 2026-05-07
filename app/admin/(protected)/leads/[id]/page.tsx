import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MessageCircle, Calendar, Globe, DollarSign, Clock } from 'lucide-react'
import { StatusSelect } from '@/components/admin/StatusSelect'

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const lead = await prisma.lead.findUnique({ where: { id: parseInt(id) } })

  if (!lead) notFound()

  const waMessage = encodeURIComponent(
    `Halo ${lead.name}, saya dari NDS Kreasi. Kami menerima permintaan konsultasi untuk ${lead.business_name}. Apakah kita bisa berdiskusi lebih lanjut?`
  )

  return (
    <div className="p-8 max-w-3xl">
      <Link
        href="/admin/leads"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Leads
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{lead.name}</h1>
          <p className="text-gray-500 mt-1">{lead.business_name}</p>
        </div>
        <a
          href={`https://wa.me/${lead.whatsapp.replace(/\D/g, '')}?text=${waMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shrink-0"
        >
          <MessageCircle className="h-4 w-4" />
          Hubungi via WhatsApp
        </a>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-4">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Update Status</h2>
        <StatusSelect leadId={lead.id} currentStatus={lead.status} />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-4">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Informasi Lead</h2>
        <div className="grid grid-cols-2 gap-5">
          {[
            { icon: MessageCircle, label: 'WhatsApp', value: lead.whatsapp },
            {
              icon: Globe,
              label: 'Punya Website',
              value: lead.has_website === 'yes' ? 'Sudah punya' : 'Belum punya',
            },
            { icon: Clock, label: 'Timeline', value: lead.timeline },
            { icon: DollarSign, label: 'Budget', value: lead.budget ?? 'Tidak disebutkan' },
            {
              icon: Calendar,
              label: 'Tanggal Masuk',
              value: new Date(lead.created_at).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              }),
            },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label}>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                <Icon className="h-3 w-3" />
                {label}
              </div>
              <p className="text-sm font-medium text-gray-900">{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Kebutuhan</h2>
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
          {lead.need_description}
        </p>
      </div>
    </div>
  )
}
