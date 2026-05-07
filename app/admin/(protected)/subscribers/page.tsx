import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function SubscribersPage() {
  const subscribers = await prisma.subscriber.findMany({
    orderBy: { created_at: 'desc' },
  })

  const fromMagnet = subscribers.filter(s => s.source?.startsWith('magnet:')).length
  const fromScroll = subscribers.filter(s => !s.source?.startsWith('magnet:') && s.source).length

  const bySource = subscribers.reduce<Record<string, number>>((acc, s) => {
    const src = s.source ?? 'langsung'
    acc[src] = (acc[src] ?? 0) + 1
    return acc
  }, {})

  const topSources = Object.entries(bySource)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subscribers</h1>
          <p className="text-gray-500 text-sm mt-1">{subscribers.length} total · {fromMagnet} dari lead magnet · {fromScroll} dari scroll form</p>
        </div>
        <a
          href={`data:text/csv;charset=utf-8,${encodeURIComponent(
            ['Email,Nama,Sumber,Tanggal'].concat(
              subscribers.map(s => `${s.email},${s.name ?? ''},${s.source ?? ''},${new Date(s.created_at).toLocaleDateString('id-ID')}`)
            ).join('\n')
          )}`}
          download="subscribers.csv"
          className="inline-flex items-center gap-2 bg-[#1a1564] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#2520a8] transition-colors"
        >
          Export CSV
        </a>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <div className="text-2xl font-bold text-[#1a1564]">{subscribers.length}</div>
          <div className="text-xs text-gray-500 mt-0.5">Total Subscribers</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <div className="text-2xl font-bold text-orange-500">{fromMagnet}</div>
          <div className="text-xs text-gray-500 mt-0.5">Lead Magnet PDF</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <div className="text-2xl font-bold text-green-600">{fromScroll}</div>
          <div className="text-xs text-gray-500 mt-0.5">Scroll Form</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_280px] gap-6">
        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {subscribers.length === 0 ? (
            <p className="p-10 text-center text-sm text-gray-400">Belum ada subscriber.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Email</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Nama</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Sumber</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Tanggal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {subscribers.map(sub => (
                    <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 font-medium text-gray-900">{sub.email}</td>
                      <td className="py-3 px-4 text-gray-600 hidden md:table-cell">{sub.name ?? '—'}</td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        {sub.source ? (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            sub.source.startsWith('magnet:')
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {sub.source.startsWith('magnet:') ? '📄 ' + sub.source.replace('magnet:', '') : '📜 ' + sub.source}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="py-3 px-4 text-xs text-gray-500 text-right">
                        {new Date(sub.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Top sources */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-900 mb-4 text-sm">Top Sumber</h3>
          <div className="space-y-3">
            {topSources.length === 0 ? (
              <p className="text-xs text-gray-400">Belum ada data</p>
            ) : topSources.map(([src, count]) => {
              const pct = Math.round((count / subscribers.length) * 100)
              return (
                <div key={src}>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span className="truncate max-w-[160px]">{src.replace('magnet:', '📄 ')}</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full">
                    <div className="h-1.5 bg-[#1a1564] rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
