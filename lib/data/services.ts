import { Code, Layout, ShoppingBag, type LucideIcon } from 'lucide-react'

export type Service = {
  slug: string
  icon: LucideIcon
  title: string
  shortDescription: string
  fullDescription: string
  price: string
  features: string[]
  deliverables: string[]
  process: { step: number; title: string; description: string }[]
  faqs: { question: string; answer: string }[]
}

export const services: Service[] = [
  {
    slug: 'website-dev',
    icon: Code,
    title: 'Website Development',
    shortDescription: 'Website profesional berbasis konversi dengan fast delivery 3-7 hari.',
    fullDescription:
      'Kami membangun website bukan sekadar online — tapi website yang bekerja sebagai mesin penjualan 24 jam. Setiap elemen dirancang untuk mengubah pengunjung menjadi calon pelanggan.',
    price: 'Mulai Rp6,9jt',
    features: ['Responsive mobile-first', 'SEO optimized', 'Meta Pixel + GA4', 'WhatsApp API'],
    deliverables: [
      'Website live di domain Anda',
      'Desain custom sesuai brand',
      'Integrasi Google Analytics 4',
      'Meta Pixel untuk tracking iklan',
      'Form kontak + WhatsApp redirect',
      'Training penggunaan dasar',
      'Garansi revisi 3x',
      'Support 30 hari setelah launch',
    ],
    process: [
      { step: 1, title: 'Konsultasi', description: 'Diskusi kebutuhan, target pasar, dan tujuan bisnis Anda.' },
      { step: 2, title: 'Desain', description: 'Kami buat mockup desain yang bisa Anda review dan berikan feedback.' },
      { step: 3, title: 'Development', description: 'Pengembangan website dengan teknologi modern, cepat, dan aman.' },
      { step: 4, title: 'Testing', description: 'Pengujian di berbagai perangkat dan browser sebelum launch.' },
      { step: 5, title: 'Launch', description: 'Website live dan siap menerima pengunjung dan pelanggan.' },
    ],
    faqs: [
      { question: 'Berapa lama proses pembuatan?', answer: 'Umumnya 3-7 hari kerja tergantung kompleksitas proyek.' },
      { question: 'Apakah saya perlu menyiapkan konten?', answer: 'Idealnya ya, tapi kami bisa bantu copywriting dasar dengan tambahan biaya.' },
      { question: 'Domain dan hosting termasuk?', answer: 'Domain dan hosting tahun pertama termasuk dalam paket standar.' },
    ],
  },
  {
    slug: 'landing-page',
    icon: Layout,
    title: 'Landing Page',
    shortDescription: 'High-converting landing page untuk campaign & product launch.',
    fullDescription:
      'Landing page yang dioptimalkan untuk satu tujuan: mengubah pengunjung menjadi leads atau pembeli. Ideal untuk kampanye iklan, peluncuran produk, atau promosi musiman.',
    price: 'Mulai Rp3,5jt',
    features: ['A/B testing ready', 'Copywriting include', 'Fast loading <2s', 'Form integration'],
    deliverables: [
      'Landing page 1 halaman',
      'Copywriting persuasif termasuk',
      'Integrasi form + notifikasi email',
      'Loading time <2 detik',
      'Optimasi mobile',
      'Integrasi Meta Pixel',
      'Garansi revisi 2x',
    ],
    process: [
      { step: 1, title: 'Brief', description: 'Kami pahami produk, target audiens, dan tujuan kampanye Anda.' },
      { step: 2, title: 'Copywriting', description: 'Tim kami tulis headline, benefit, dan CTA yang menarik.' },
      { step: 3, title: 'Desain', description: 'Desain visual yang mendukung pesan dan menggerakkan aksi.' },
      { step: 4, title: 'Development', description: 'Implementasi dengan performa tinggi dan loading cepat.' },
      { step: 5, title: 'Launch & Optimasi', description: 'Live dan siap untuk kampanye iklan Anda.' },
    ],
    faqs: [
      { question: 'Apakah cocok untuk iklan Meta/Google Ads?', answer: 'Ya, landing page kami dioptimalkan untuk Quality Score iklan berbayar.' },
      { question: 'Bisa A/B test dua versi?', answer: 'Bisa dengan tambahan biaya. Kami juga bisa setup tracking konversi.' },
      { question: 'Berapa lama proses pengerjaan?', answer: '2-4 hari kerja untuk landing page standar.' },
    ],
  },
  {
    slug: 'digital-products',
    icon: ShoppingBag,
    title: 'Digital Products',
    shortDescription: 'Template, UI kit, dan aset digital siap pakai untuk bisnis Anda.',
    fullDescription:
      'Koleksi template website, UI kit, dan aset digital premium yang bisa langsung Anda gunakan untuk mempercepat proyek. Dibuat dengan standar profesional dan mudah dikustomisasi.',
    price: 'Mulai Rp299rb',
    features: ['Downloadable instantly', 'Lifetime access', 'Free updates 6 months', 'Commercial license'],
    deliverables: [
      'File sumber (Figma/HTML/React)',
      'Dokumentasi penggunaan',
      'Commercial license',
      'Update gratis 6 bulan',
      'Akses seumur hidup',
    ],
    process: [
      { step: 1, title: 'Pilih Produk', description: 'Browse katalog dan pilih produk yang sesuai kebutuhan.' },
      { step: 2, title: 'Checkout', description: 'Pembayaran aman via transfer bank atau e-wallet.' },
      { step: 3, title: 'Download', description: 'File langsung tersedia setelah pembayaran dikonfirmasi.' },
      { step: 4, title: 'Implementasi', description: 'Gunakan dengan panduan dokumentasi yang kami sediakan.' },
    ],
    faqs: [
      { question: 'Format file apa yang tersedia?', answer: 'Figma, HTML/CSS, dan beberapa dalam format React/Next.js.' },
      { question: 'Boleh digunakan untuk klien?', answer: 'Ya, commercial license termasuk untuk penggunaan proyek klien.' },
      { question: 'Bagaimana cara mendapatkan update?', answer: 'Update gratis selama 6 bulan pertama, bisa didownload ulang kapan saja.' },
    ],
  },
]

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug)
}
