import type { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { CheckCircle, Users, Zap, Award } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Tentang Kami | NDS Kreasi',
  description: 'Kami adalah tim yang berdedikasi membantu UMKM dan startup Indonesia tumbuh secara digital.',
}

const stats = [
  { value: '45+', label: 'Klien Aktif' },
  { value: '3 Hari', label: 'Rata-rata Delivery' },
  { value: '98%', label: 'Kepuasan Klien' },
  { value: '2 Tahun', label: 'Pengalaman' },
]

const values = [
  { icon: Zap,        title: 'Berorientasi Hasil',  description: 'Setiap keputusan desain didasarkan pada data dan tujuan bisnis klien.' },
  { icon: CheckCircle, title: 'Transparan',          description: 'Kami komunikasikan progres secara jelas dan tidak ada biaya tersembunyi.' },
  { icon: Users,      title: 'Kolaboratif',          description: 'Kami adalah mitra bisnis Anda, bukan sekadar vendor yang mengerjakan pesanan.' },
  { icon: Award,      title: 'Berkualitas',           description: 'Standar tinggi dalam setiap detail — dari desain hingga performa teknis.' },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 bg-primary">
        <Container>
          <div className="max-w-3xl">
            <span className="inline-block bg-white/10 text-white/80 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
              Tentang Kami
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
              Kami Bukan Sekadar<br /><span className="text-accent">Pembuat Website</span>
            </h1>
            <p className="text-white/70 text-lg mb-8 max-w-xl">
              NDS Kreasi adalah tim yang berdedikasi membantu UMKM dan startup Indonesia tumbuh secara digital.
              Website yang baik bukan soal tampilan — tapi seberapa besar kontribusinya terhadap bisnis Anda.
            </p>
            <Link href="/#lead-form">
              <button className="bg-accent hover:bg-accent-dark text-white font-bold px-7 py-3.5 rounded-lg transition-colors">
                Mulai Kolaborasi →
              </button>
            </Link>
          </div>
        </Container>
      </section>

      {/* Stats */}
      <section className="bg-primary-dark">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
            {stats.map(({ value, label }) => (
              <div key={label} className="py-8 px-4 text-center">
                <div className="text-3xl font-extrabold text-accent mb-1">{value}</div>
                <div className="text-white/60 text-sm">{label}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <Container>
          <div className="text-center mb-12">
            <span className="inline-block bg-accent/10 text-accent text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
              Nilai Kami
            </span>
            <h2 className="text-3xl font-extrabold text-primary">Yang Membuat Kami Berbeda</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, description }) => (
              <div key={title} className="p-6 rounded-xl border border-gray-200 hover:border-accent/30 hover:bg-background-alt transition-all">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-bold text-primary mb-2">{title}</h3>
                <p className="text-text-secondary text-sm">{description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-16 bg-background-alt">
        <Container>
          <div className="bg-primary rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">Siap Bekerja Sama?</h2>
            <p className="text-white/60 mb-6">Konsultasi gratis — ceritakan kebutuhan Anda.</p>
            <Link href="/#lead-form">
              <button className="bg-accent hover:bg-accent-dark text-white font-bold px-8 py-3.5 rounded-lg transition-colors">
                Konsultasi Gratis Sekarang
              </button>
            </Link>
          </div>
        </Container>
      </section>
    </>
  )
}
