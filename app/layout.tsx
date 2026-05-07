import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { SiteLayout } from '@/components/layout/SiteLayout'
import { Analytics } from '@vercel/analytics/react'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'NDS Kreasi | Website yang Menghasilkan untuk Bisnis Anda',
    template: '%s | NDS Kreasi',
  },
  description: 'Buat website yang tidak hanya keren, tapi juga menghasilkan penjualan. Konsultasi gratis untuk UMKM & startup. Mulai Rp3,5jt, siap 7 hari.',
  keywords: ['jasa pembuatan website', 'landing page', 'digital marketing agency', 'website UMKM', 'NDS Kreasi'],
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    siteName: 'NDS Kreasi',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT

  return (
    <html lang="id">
      <body className={`${inter.variable} font-sans`}>
        <SiteLayout>{children}</SiteLayout>
        <Analytics />
        {adsenseClient && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  )
}
