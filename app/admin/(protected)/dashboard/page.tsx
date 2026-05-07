import { prisma } from '@/lib/prisma'
import { Users, TrendingUp, MessageCircle, Star, Eye, MousePointerClick, FileText, Mail } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const statusConfig: Record<string, { label: string; color: string }> = {
  new: { label: 'Baru', color: 'bg-blue-100 text-blue-700' },
  contacted: { label: 'Dihubungi', color: 'bg-yellow-100 text-yellow-700' },
  proposal: { label: 'Proposal', color: 'bg-purple-100 text-purple-700' },
  converted: { label: 'Converted', color: 'bg-green-100 text-green-700' },
  lost: { label: 'Gagal', color: 'bg-gray-100 text-gray-500' },
}

export default async function DashboardPage() {
  const [
    total, byStatus, recentLeads,
    publishedArticles, totalViews, totalWaClicks,
    subscriberCount, topArticles, recentArticles,
    pendingKeywords,
  ] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.groupBy({ by: ['status'], _count: { status: true } }),
    prisma.lead.findMany({ orderBy: { created_at: 'desc' }, take: 5 }),
    prisma.article.count({ where: { status: 'published' } }),
    prisma.article.aggregate({ _sum: { view_count: true } }),
    prisma.article.aggregate({ _sum: { wa_click_count: true } }),
    prisma.subscriber.count(),
    prisma.article.findMany({
      where: { status: 'published' },
      orderBy: { view_count: 'desc' },
      take: 5,
      select: { id: true, title: true, slug: true, view_count: true, wa_click_count: true, seo_score: true },
    }),
    prisma.article.findMany({
      where: { status: 'published' },
      orderBy: { published_at: 'desc' },
      take: 3,
      select: { id: true, title: true, slug: true, published_at: true },
    }),
    prisma.keyword.count({ where: { status: 'pending' } }),
  ])

  const statusMap = Object.fromEntries(byStatus.map(s => [s.status, s._count.status]))
  const newCount = statusMap['new'] ?? 0
  const convertedCount = statusMap['converted'] ?? 0
  const convRate = total > 0 ? Math.round((convertedCount / total) * 100) : 0
  const views = totalViews._sum.view_count ?? 0
  const waClicks = totalWaClicks._sum.wa_click_count ?? 0
  const ctr = views > 0 ? ((waClicks / views) * 100).toFixed(1) : '0'

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h1>
      <p className="text-gray-500 text-sm mb-8">Overview performa leads & konten</p>

      {/* Lead stats */}
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Leads</p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Leads', value: total, icon: Users, bg: 'bg-blue-50', color: 'text-blue-600' },
          { label: 'Leads Baru', value: newCount, icon: Star, bg: 'bg-orange-50', color: 'text-orange-500' },
          { label: 'Converted', value: convertedCount, icon: TrendingUp, bg: 'bg-green-50', color: 'text-green-600' },
          { label: 'Conv. Rate', value: `${convRate}%`, icon: MessageCircle, bg: 'bg-purple-50', color: 'text-purple-600' },
        ].map(({ label, value, icon: Icon, bg, color }) => (
          <div key={label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${bg}`}>
              <Icon className={`h-4 w-4 ${color}`} />
            </div>
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <div className="text-sm text-gray-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Blog & conversion stats */}
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Konten & Konversi</p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Artikel Published', value: publishedArticles, icon: FileText, bg: 'bg-indigo-50', color: 'text-indigo-600' },
          { label: 'Total Views', value: views.toLocaleString(), icon: Eye, bg: 'bg-sky-50', color: 'text-sky-600' },
          { label: 'WA Clicks', value: waClicks, icon: MousePointerClick, bg: 'bg-green-50', color: 'text-green-600' },
          { label: 'Email Subscribers', value: subscriberCount, icon: Mail, bg: 'bg-pink-50', color: 'text-pink-600' },
        ].map(({ label, value, icon: Icon, bg, color }) => (
          <div key={label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${bg}`}>
              <Icon className={`h-4 w-4 ${color}`} />
            </div>
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <div className="text-sm text-gray-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Top articles by views */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-900">Top Artikel</h2>
              <p className="text-xs text-gray-500 mt-0.5">Berdasarkan views · WA CTR: {ctr}%</p>
            </div>
            <Link href="/admin/articles" className="text-xs text-[#1a1564] font-medium hover:underline">Semua →</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {topArticles.length === 0 ? (
              <p className="p-8 text-sm text-gray-400 text-center">Belum ada artikel published</p>
            ) : topArticles.map((a, i) => {
              const articleCtr = a.view_count > 0 ? ((a.wa_click_count / a.view_count) * 100).toFixed(1) : '0'
              const maxViews = topArticles[0]?.view_count || 1
              return (
                <div key={a.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-bold text-gray-300 w-4 shrink-0 mt-0.5">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <Link href={`/blog/${a.slug}`} target="_blank"
                        className="text-sm font-medium text-gray-900 hover:text-[#1a1564] line-clamp-1">
                        {a.title}
                      </Link>
                      <div className="flex items-center gap-3 mt-1.5">
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full">
                          <div className="h-1.5 bg-[#1a1564] rounded-full"
                            style={{ width: `${Math.round((a.view_count / maxViews) * 100)}%` }} />
                        </div>
                        <span className="text-xs text-gray-500 shrink-0">{a.view_count} views</span>
                        <span className="text-xs text-green-600 font-medium shrink-0">{articleCtr}% CTR</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent leads */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Lead Terbaru</h2>
            <Link href="/admin/leads" className="text-xs text-[#1a1564] font-medium hover:underline">Semua →</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentLeads.length === 0 ? (
              <p className="p-8 text-sm text-gray-400 text-center">Belum ada lead masuk</p>
            ) : recentLeads.map(lead => {
              const cfg = statusConfig[lead.status] ?? statusConfig.new
              return (
                <Link key={lead.id} href={`/admin/leads/${lead.id}`}
                  className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-[#1a1564]/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-[#1a1564]">{lead.name[0]?.toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{lead.name}</p>
                    <p className="text-xs text-gray-500 truncate">{lead.business_name}</p>
                  </div>
                  <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${cfg.color}`}>{cfg.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* Quick actions row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { href: '/admin/blog-generator', label: `${pendingKeywords} keyword pending`, sub: 'Generate sekarang →', color: 'border-yellow-200 bg-yellow-50' },
          { href: '/admin/topic-cluster', label: 'Topic Cluster', sub: 'Buat konten terstruktur →', color: 'border-indigo-200 bg-indigo-50' },
          { href: '/admin/subscribers', label: `${subscriberCount} subscribers`, sub: 'Kelola email list →', color: 'border-pink-200 bg-pink-50' },
          { href: '/admin/affiliate-links', label: 'Affiliate Links', sub: 'Kelola monetisasi →', color: 'border-green-200 bg-green-50' },
        ].map(item => (
          <Link key={item.href} href={item.href}
            className={`block p-4 rounded-xl border ${item.color} hover:shadow-sm transition-shadow`}>
            <p className="text-sm font-semibold text-gray-900">{item.label}</p>
            <p className="text-xs text-gray-500 mt-0.5">{item.sub}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
