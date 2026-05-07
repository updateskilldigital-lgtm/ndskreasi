import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { SiteLayout } from '@/components/layout/SiteLayout'
import { Analytics } from '@vercel/analytics/react'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'NDS Kreasi | Premium Website Development untuk Bisnis Anda',
    template: '%s | NDS Kreasi',
  },
  description: 'Jasa pembuatan website premium yang elegan dan profesional. Tingkatkan kredibilitas bisnis Anda dengan website berkualitas tinggi. Konsultasi gratis untuk UMKM & startup.',
  keywords: ['jasa pembuatan website premium', 'web design elegan', 'website profesional', 'digital agency', 'NDS Kreasi'],
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    siteName: 'NDS Kreasi',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT

  return (
    <html lang="id" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
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
