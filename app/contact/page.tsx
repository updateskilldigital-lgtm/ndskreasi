import type { Metadata } from 'next'
import { Container } from '@/components/ui/Container'
import { Mail, Phone, MapPin, MessageCircle, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Kontak | NDS Kreasi',
  description: 'Hubungi tim NDS Kreasi untuk konsultasi gratis. Kami siap membantu bisnis Anda tumbuh secara digital.',
}

const contactItems = [
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: process.env.NEXT_PUBLIC_COMPANY_PHONE ?? '',
    href: `https://wa.me/${process.env.NEXT_PUBLIC_WA_NUMBER}?text=Halo%2C%20saya%20ingin%20konsultasi%20gratis`,
    color: 'bg-green-500',
  },
  {
    icon: Mail,
    label: 'Email',
    value: process.env.NEXT_PUBLIC_COMPANY_EMAIL ?? '',
    href: `mailto:${process.env.NEXT_PUBLIC_COMPANY_EMAIL}`,
    color: 'bg-accent',
  },
  {
    icon: MapPin,
    label: 'Lokasi',
    value: process.env.NEXT_PUBLIC_COMPANY_ADDRESS ?? '',
    href: '#',
    color: 'bg-primary',
  },
]

export default function ContactPage() {
  return (
    <>
      <section className="py-20 bg-primary">
        <Container>
          <div className="max-w-2xl">
            <span className="inline-block bg-white/10 text-white/80 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
              Kontak
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Hubungi Kami</h1>
            <p className="text-white/70 text-lg">Tim kami siap membantu Anda. Pilih cara yang paling nyaman.</p>
          </div>
        </Container>
      </section>

      <section className="py-16 bg-white">
        <Container>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-14">
            {contactItems.map(({ icon: Icon, label, value, href, color }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="group flex flex-col items-center p-6 bg-white border border-gray-200 rounded-xl text-center hover:border-accent/40 hover:shadow-lg transition-all"
              >
                <div className={`w-14 h-14 ${color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="font-bold text-primary mb-1">{label}</h3>
                <p className="text-text-secondary text-sm">{value}</p>
              </a>
            ))}
          </div>

          <div className="max-w-sm mx-auto bg-background-alt rounded-2xl p-7 text-center border border-gray-200">
            <Clock className="h-8 w-8 text-accent mx-auto mb-3" />
            <h2 className="text-xl font-bold text-primary mb-3">Jam Operasional</h2>
            <div className="space-y-1.5 text-text-secondary text-sm">
              <p><strong>Senin – Jumat:</strong> 09.00 – 18.00 WIB</p>
              <p><strong>Sabtu:</strong> 09.00 – 14.00 WIB</p>
              <p><strong>Minggu:</strong> Libur</p>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
