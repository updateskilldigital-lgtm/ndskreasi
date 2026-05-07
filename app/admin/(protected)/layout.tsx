import Link from 'next/link'
import { LayoutDashboard, Users, Bot, Newspaper, Link2, Layers, Clock, Mail, FolderOpen } from 'lucide-react'
import { LogoutButton } from '@/components/admin/LogoutButton'

export default function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-60 shrink-0 bg-[#1a1564] text-white flex flex-col fixed top-0 left-0 h-full z-40 overflow-y-auto">
        <div className="p-5 border-b border-white/10">
          <span className="font-extrabold text-lg">
            NDS<span className="text-[#f97316]">Kreasi</span>
          </span>
          <p className="text-xs text-white/50 mt-0.5">Admin Panel</p>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          <Link href="/admin/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors text-sm font-medium">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link href="/admin/leads" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors text-sm font-medium">
            <Users className="h-4 w-4" />
            Leads
          </Link>
          <Link href="/admin/subscribers" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors text-sm font-medium">
            <Mail className="h-4 w-4" />
            Subscribers
          </Link>

          <div className="pt-3 pb-1">
            <p className="px-3 text-[10px] font-semibold text-white/30 uppercase tracking-widest">Blog AI</p>
          </div>
          <Link href="/admin/blog-generator" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors text-sm font-medium">
            <Bot className="h-4 w-4" />
            Blog Generator
          </Link>
          <Link href="/admin/topic-cluster" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors text-sm font-medium">
            <Layers className="h-4 w-4" />
            Topic Cluster
          </Link>
          <Link href="/admin/scheduler" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors text-sm font-medium">
            <Clock className="h-4 w-4" />
            Scheduler
          </Link>
          <Link href="/admin/articles" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors text-sm font-medium">
            <Newspaper className="h-4 w-4" />
            Artikel
          </Link>
          <Link href="/admin/affiliate-links" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors text-sm font-medium">
            <Link2 className="h-4 w-4" />
            Affiliate Links
          </Link>
          <Link href="/admin/categories" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors text-sm font-medium">
            <FolderOpen className="h-4 w-4" />
            Kategori & Tag
          </Link>
        </nav>

        <div className="p-3 border-t border-white/10">
          <LogoutButton />
        </div>
      </aside>

      <main className="flex-1 ml-60 min-h-screen">
        {children}
      </main>
    </div>
  )
}
