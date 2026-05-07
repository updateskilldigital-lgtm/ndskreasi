import { Hero } from '@/components/home/Hero'
import { Services } from '@/components/home/Services'
import { Benefits } from '@/components/home/Benefits'
import { Portfolio } from '@/components/home/Portfolio'
import { Testimonials } from '@/components/home/Testimonials'
import { LeadForm } from '@/components/forms/LeadForm'

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <Benefits />
      <Portfolio />
      <Testimonials />
      <section className="py-20 bg-background-alt">
        <LeadForm />
      </section>
    </>
  )
}
