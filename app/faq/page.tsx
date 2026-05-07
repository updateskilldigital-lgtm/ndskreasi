import type { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'

export const metadata: Metadata = {
  title: 'FAQ | NDS Kreasi',
  description: 'Temukan jawaban atas pertanyaan yang sering ditanyakan seputar layanan NDS Kreasi.',
}

const faqs = [
  {
    category: 'Umum',
    items: [
      { q: 'Berapa lama proses pembuatan website?', a: 'Website Development umumnya 3-7 hari kerja, Landing Page 2-4 hari kerja, tergantung kompleksitas dan kecepatan feedback dari klien.' },
      { q: 'Apakah saya perlu menyiapkan materi konten?', a: 'Kami akan membantu Anda dengan checklist konten yang diperlukan. Untuk copywriting, kami bisa bantu dengan biaya tambahan.' },
      { q: 'Apakah ada garansi setelah website selesai?', a: 'Ya, semua layanan kami dilengkapi garansi support 30 hari setelah launch dan revisi yang disesuaikan per paket.' },
    ],
  },
  {
    category: 'Harga & Pembayaran',
    items: [
      { q: 'Bagaimana sistem pembayaran?', a: 'Pembayaran dilakukan 50% di awal sebagai tanda jadi, dan 50% saat website siap di-review sebelum launch.' },
      { q: 'Apakah ada biaya tahunan?', a: 'Domain dan hosting memerlukan perpanjangan tahunan. Kami akan menginformasikan jadwal renewal minimal 30 hari sebelumnya.' },
      { q: 'Metode pembayaran apa yang diterima?', a: 'Transfer bank (BCA, Mandiri, BRI, BNI), GoPay, OVO, dan QRIS.' },
    ],
  },
  {
    category: 'Teknis',
    items: [
      { q: 'Apakah website bisa dikelola sendiri?', a: 'Tergantung paket. Kami menyediakan training dasar dan beberapa paket dilengkapi dengan CMS yang mudah digunakan.' },
      { q: 'Apakah website saya akan muncul di Google?', a: 'Website kami dibangun dengan praktik SEO dasar. Untuk hasil optimal, kami sarankan kombinasi dengan layanan SEO terpisah.' },
      { q: 'Apa yang terjadi jika website bermasalah setelah launch?', a: 'Kami menyediakan support 30 hari post-launch. Laporkan masalah via WhatsApp dan kami tangani dalam 1x24 jam kerja.' },
    ],
  },
]

export default function FAQPage() {
  return (
    <>
      <section className="py-20 bg-primary">
        <Container>
          <div className="max-w-2xl">
            <span className="inline-block bg-white/10 text-white/80 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">FAQ</span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Pertanyaan yang Sering Ditanyakan</h1>
            <p className="text-white/70 text-lg">Tidak menemukan jawaban? Hubungi kami langsung.</p>
          </div>
        </Container>
      </section>

      <section className="py-16 bg-white">
        <Container maxWidth="lg">
          <div className="space-y-10">
            {faqs.map(({ category, items }) => (
              <div key={category}>
                <h2 className="text-lg font-extrabold text-primary mb-4 pb-2 border-b-2 border-accent/20">{category}</h2>
                <div className="space-y-3">
                  {items.map(({ q, a }) => (
                    <details key={q} className="group bg-white border border-gray-200 rounded-xl overflow-hidden">
                      <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-primary list-none hover:bg-background-alt transition-colors">
                        <span>{q}</span>
                        <span className="ml-4 w-6 h-6 bg-accent/10 text-accent rounded-full flex items-center justify-center text-xs group-open:rotate-180 transition-transform shrink-0">▼</span>
                      </summary>
                      <div className="px-5 pb-5 text-text-secondary text-sm border-t border-gray-100 pt-3">{a}</div>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-text-secondary mb-4 text-sm">Masih ada pertanyaan?</p>
            <Link href="/contact">
              <button className="bg-accent hover:bg-accent-dark text-white font-bold px-8 py-3 rounded-lg transition-colors">
                Hubungi Kami
              </button>
            </Link>
          </div>
        </Container>
      </section>
    </>
  )
}
