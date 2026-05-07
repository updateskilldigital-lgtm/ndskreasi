'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, MessageCircle } from 'lucide-react'

type Lead = {
  id: number
  name: string
  business_name: string
  whatsapp: string
  has_website: string
  timeline: string
  budget: string | null
  need_description: string
  status: string
  created_at: Date
}

const statusOptions = [
  { value: '', label: 'Semua Status' },
  { value: 'new', label: 'Baru' },
  { value: 'contacted', label: 'Dihubungi' },
  { value: 'proposal', label: 'Proposal' },
  { value: 'converted', label: 'Converted' },
  { value: 'lost', label: 'Gagal' },
]

const statusMap: Record<string, { label: string; color: string }> = {
  new: { label: 'Baru', color: 'bg-blue-100 text-blue-700' },
  contacted: { label: 'Dihubungi', color: 'bg-yellow-100 text-yellow-700' },
  proposal: { label: 'Proposal', color: 'bg-purple-100 text-purple-700' },
  converted: { label: 'Converted', color: 'bg-green-100 text-green-700' },
  lost: { label: 'Gagal', color: 'bg-gray-100 text-gray-500' },
}

export function LeadsTable({ leads: initialLeads }: { leads: Lead[] }) {
  const [leads, setLeads] = useState(initialLeads)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  const filtered = leads.filter((l) => {
    const q = search.toLowerCase()
    const matchSearch =
      q === '' ||
      l.name.toLowerCase().includes(q) ||
      l.business_name.toLowerCase().includes(q) ||
      l.whatsapp.includes(q)
    const matchStatus = filterStatus === '' || l.status === filterStatus
    return matchSearch && matchStatus
  })

  async function updateStatus(id: number, status: string) {
    await fetch(`/api/admin/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)))
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, bisnis, atau nomor..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1564]/20 focus:border-[#1a1564]"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1564]/20 focus:border-[#1a1564]"
        >
          {statusOptions.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Nama</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Bisnis</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Timeline</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Budget</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Tanggal</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="py-10 text-center text-gray-400 text-sm">
                  Tidak ada lead ditemukan
                </td>
              </tr>
            )}
            {filtered.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4">
                  <Link
                    href={`/admin/leads/${lead.id}`}
                    className="font-semibold text-gray-900 hover:text-[#1a1564]"
                  >
                    {lead.name}
                  </Link>
                </td>
                <td className="py-3 px-4 text-gray-600">{lead.business_name}</td>
                <td className="py-3 px-4 text-gray-600 hidden md:table-cell">{lead.timeline}</td>
                <td className="py-3 px-4 text-gray-600 hidden lg:table-cell">{lead.budget ?? '-'}</td>
                <td className="py-3 px-4">
                  <select
                    value={lead.status}
                    onChange={(e) => updateStatus(lead.id, e.target.value)}
                    className="border border-gray-200 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[#1a1564]/20"
                  >
                    {statusOptions.filter((s) => s.value !== '').map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-3 px-4 text-gray-500 text-xs hidden md:table-cell">
                  {new Date(lead.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: '2-digit',
                  })}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <a
                      href={`https://wa.me/${lead.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 bg-green-50 text-green-600 hover:bg-green-100 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors"
                    >
                      <MessageCircle className="h-3 w-3" />
                      WA
                    </a>
                    <Link
                      href={`/admin/leads/${lead.id}`}
                      className="text-xs font-medium text-[#1a1564] bg-[#1a1564]/5 hover:bg-[#1a1564]/10 px-2.5 py-1.5 rounded-lg transition-colors"
                    >
                      Detail
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
