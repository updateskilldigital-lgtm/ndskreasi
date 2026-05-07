'use client'

import { usePathname } from 'next/navigation'
import { Header } from './Header'
import { Footer } from './Footer'
import { StickyCTA } from './StickyCTA'

export function SiteLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  if (pathname.startsWith('/admin')) {
    return <>{children}</>
  }

  return (
    <>
      <Header />
      <main className="pt-16">{children}</main>
      <Footer />
      <StickyCTA />
    </>
  )
}
