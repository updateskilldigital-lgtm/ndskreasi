'use client'

import { useState } from 'react'
import { Clock, Play, Save, RefreshCw } from 'lucide-react'

type Props = {
  enabled: boolean
  maxPerDay: number
  lastRun: string | null
}

export function SchedulerPanel({ enabled: initEnabled, maxPerDay: initMax, lastRun }: Props) {
  const [enabled, setEnabled] = useState(initEnabled)
  const [maxPerDay, setMaxPerDay] = useState(initMax)
  const [saving, setSaving] = useState(false)
  const [running, setRunning] = useState(false)
  const [runResult, setRunResult] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setSaving(true)
    await fetch('/api/admin/scheduler', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled, max_per_day: maxPerDay }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function handleRunNow() {
    setRunning(true)
    setRunResult(null)
    const res = await fetch('/api/cron/auto-generate', { method: 'POST' })
    const data = await res.json()
    setRunning(false)
    if (data.skipped) {
      setRunResult(`Dilewati: ${data.reason}`)
    } else {
      setRunResult(`✅ ${data.generated} artikel di-generate${data.errors?.length ? ` · ${data.errors.length} gagal` : ''}`)
    }
  }

  const lastRunFormatted = lastRun
    ? new Date(lastRun).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : 'Belum pernah'

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Config */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="h-4 w-4 text-[#1a1564]" />
          Konfigurasi Scheduler
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">Auto Generate Harian</p>
              <p className="text-xs text-gray-500 mt-0.5">Generate N artikel pending setiap hari secara otomatis</p>
            </div>
            <button
              onClick={() => setEnabled(!enabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-[#1a1564]' : 'bg-gray-300'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Maksimal Artikel per Hari</label>
            <input
              type="number"
              value={maxPerDay}
              onChange={e => setMaxPerDay(parseInt(e.target.value) || 1)}
              min={1}
              max={20}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1564]/20"
            />
            <p className="text-xs text-gray-400 mt-1">Rekomendasi: 3-5 artikel/hari agar tidak menghambur API cost</p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-[#1a1564] hover:bg-[#2520a8] text-white font-semibold py-2.5 rounded-lg transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Menyimpan...' : saved ? '✅ Tersimpan' : 'Simpan Konfigurasi'}
          </button>
        </div>
      </div>

      {/* Manual trigger + info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Play className="h-4 w-4 text-[#1a1564]" />
          Jalankan Manual
        </h2>

        <div className="space-y-4">
          <div className="p-3 bg-gray-50 rounded-lg text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-xs">Terakhir dijalankan</span>
              <span className="font-medium text-gray-800 text-xs">{lastRunFormatted}</span>
            </div>
          </div>

          <button
            onClick={handleRunNow}
            disabled={running}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${running ? 'animate-spin' : ''}`} />
            {running ? 'Sedang berjalan...' : 'Jalankan Sekarang'}
          </button>

          {runResult && (
            <div className="p-3 bg-blue-50 text-blue-800 text-sm rounded-lg">{runResult}</div>
          )}

          <div className="p-3 border border-dashed border-gray-200 rounded-lg text-xs text-gray-500 leading-relaxed">
            <strong className="text-gray-700">Untuk auto-run harian:</strong><br />
            Tambahkan Windows Task Scheduler yang memanggil:<br />
            <code className="bg-gray-100 px-1 py-0.5 rounded text-[11px] break-all">
              curl -X POST http://localhost:3000/api/cron/auto-generate -H &quot;Authorization: Bearer YOUR_CRON_SECRET&quot;
            </code><br /><br />
            Set <code className="bg-gray-100 px-1">CRON_SECRET</code> di <code className="bg-gray-100 px-1">.env.local</code> untuk keamanan.
          </div>
        </div>
      </div>
    </div>
  )
}
