import type { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { CheckCircle } from 'lucide-react'
import { services } from '@/lib/data/services'

export const metadata: Metadata = {
  title: 'Layanan | NDS Kreasi',
  description: 'Website Development, Landing Page, dan Digital Products untuk UMKM dan startup Indonesia. Mulai Rp299rb.',
}

export default function ServicesPage() {
  return (
    <>
      <section className="py-20 bg-primary">
        <Container>
          <div className="max-w-2xl">
            <span className="inline-block bg-white/10 text-white/80 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
              Layanan
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Layanan Kami</h1>
            <p className="text-white/70 text-lg">Pilih layanan yang sesuai dengan kebutuhan bisnis Anda</p>
          </div>
        </Container>
      </section>

      <section className="py-16 bg-background-alt">
        <Container>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service) => {
              const Icon = service.icon
              return (
                <div
                  key={service.slug}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  <div className="p-7 flex flex-col h-full">
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-5">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <h2 className="text-xl font-bold text-primary mb-2">{service.title}</h2>
                    <p className="text-text-secondary text-sm mb-5">{service.shortDescription}</p>
                    <div className="mb-5">
                      <span className="text-2xl font-extrabold text-accent">{service.price}</span>
                    </div>
                    <ul className="space-y-2.5 mb-7 flex-1">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2.5 text-sm text-text-secondary">
                          <CheckCircle className="h-4 w-4 text-accent shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link href={`/services/${service.slug}`}>
                      <button className="w-full py-2.5 bg-primary hover:bg-primary-light text-white rounded-lg font-semibold text-sm transition-colors">
                        Pelajari Lebih Lanjut →
                      </button>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </Container>
      </section>

      <section className="py-16 bg-white">
        <Container>
          <div className="bg-primary rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">Butuh Solusi Khusus?</h2>
            <p className="text-white/60 mb-6">Kami juga menerima custom development sesuai kebutuhan spesifik bisnis Anda.</p>
            <Link href="/#lead-form">
              <button className="bg-accent hover:bg-accent-dark text-white font-bold px-8 py-3.5 rounded-lg transition-colors">
                Konsultasi Custom Project
              </button>
            </Link>
          </div>
        </Container>
      </section>
    </>
  )
}
