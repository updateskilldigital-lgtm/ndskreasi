'use client'

import { useState } from 'react'

const statuses = [
  { value: 'new', label: 'Baru', color: 'bg-blue-100 text-blue-700' },
  { value: 'contacted', label: 'Dihubungi', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'proposal', label: 'Proposal', color: 'bg-purple-100 text-purple-700' },
  { value: 'converted', label: 'Converted', color: 'bg-green-100 text-green-700' },
  { value: 'lost', label: 'Gagal', color: 'bg-gray-100 text-gray-500' },
]

export function StatusSelect({ leadId, currentStatus }: { leadId: number; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus)
  const [saving, setSaving] = useState(false)

  async function handleChange(newStatus: string) {
    setSaving(true)
    setStatus(newStatus)
    await fetch(`/api/admin/leads/${leadId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    setSaving(false)
  }

  const current = statuses.find((s) => s.value === status)

  return (
    <div className="flex items-center gap-3">
      <select
        value={status}
        onChange={(e) => handleChange(e.target.value)}
        disabled={saving}
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1564]/20 focus:border-[#1a1564] disabled:opacity-60"
      >
        {statuses.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
      {current && (
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${current.color}`}>
          {saving ? 'Menyimpan...' : current.label}
        </span>
      )}
    </div>
  )
}
