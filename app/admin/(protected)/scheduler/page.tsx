import { prisma } from '@/lib/prisma'
import { SchedulerPanel } from '@/components/admin/SchedulerPanel'

export const dynamic = 'force-dynamic'

export default async function SchedulerPage() {
  const settings = await prisma.setting.findMany({
    where: { key: { in: ['scheduler_enabled', 'scheduler_max_per_day', 'scheduler_last_run'] } },
  })
  const map = Object.fromEntries(settings.map(s => [s.key, s.value]))

  const pendingCount = await prisma.keyword.count({ where: { status: 'pending' } })

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Auto-Scheduler</h1>
        <p className="text-gray-500 text-sm mt-1">
          {pendingCount} keyword pending siap di-generate · Scheduler {map.scheduler_enabled === 'true' ? '✅ aktif' : '⏸ nonaktif'}
        </p>
      </div>
      <SchedulerPanel
        enabled={map.scheduler_enabled === 'true'}
        maxPerDay={parseInt(map.scheduler_max_per_day ?? '3')}
        lastRun={map.scheduler_last_run ?? null}
      />
    </div>
  )
}
