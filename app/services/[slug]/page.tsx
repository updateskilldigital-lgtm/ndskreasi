import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { ArrowLeft, CheckCircle, Zap } from 'lucide-react'
import { services, getService } from '@/lib/data/services'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const service = getService(slug)
  if (!service) return {}
  return {
    title: `${service.title} | Agency Digital`,
    description: service.shortDescription,
  }
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params
  const service = getService(slug)
  if (!service) notFound()

  const Icon = service.icon

  return (
    <>
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <Container>
          <Link href="/services" className="inline-flex items-center gap-2 text-text-secondary hover:text-accent transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" />
            Semua Layanan
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center mb-6">
                <Icon className="h-8 w-8 text-accent" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">{service.title}</h1>
              <p className="text-text-secondary text-lg mb-6">{service.fullDescription}</p>
              <p className="text-accent font-bold text-2xl mb-6">{service.price}</p>
              <div className="flex gap-4">
                <Link href="/#lead-form">
                  <button className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-light transition-colors">
                    Konsultasi Gratis
                  </button>
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="font-bold text-primary text-lg mb-4">Yang Anda Dapatkan</h3>
              <ul className="space-y-3">
                {service.deliverables.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-text-secondary">
                    <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <h2 className="text-3xl font-bold text-primary text-center mb-12">Proses Pengerjaan</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {service.process.map((step) => (
              <div key={step.step} className="text-center">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-3 text-primary font-bold">
                  {step.step}
                </div>
                <h4 className="font-semibold text-primary mb-1">{step.title}</h4>
                <p className="text-text-secondary text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 bg-gray-50">
        <Container maxWidth="lg">
          <h2 className="text-3xl font-bold text-primary text-center mb-12">Pertanyaan Umum</h2>
          <div className="space-y-4">
            {service.faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-primary mb-2">{faq.question}</h4>
                    <p className="text-text-secondary">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/#lead-form">
              <button className="bg-accent text-primary px-8 py-3 rounded-lg font-semibold hover:bg-accent-light transition-colors">
                Mulai Konsultasi Gratis →
              </button>
            </Link>
          </div>
        </Container>
      </section>
    </>
  )
}
