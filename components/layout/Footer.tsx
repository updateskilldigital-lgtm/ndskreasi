import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Mail, Phone, MapPin } from 'lucide-react'
import { FaFacebook, FaInstagram, FaLinkedin, FaXTwitter, FaTiktok } from 'react-icons/fa6'

const footerLinks = {
  Perusahaan: [
    { name: 'Tentang Kami', href: '/about' },
    { name: 'Karir', href: '/careers' },
    { name: 'Blog', href: '/blog' },
  ],
  Layanan: [
    { name: 'Website Development', href: '/services/website-dev' },
    { name: 'Landing Page', href: '/services/landing-page' },
    { name: 'Digital Products', href: '/services/digital-products' },
  ],
  Dukungan: [
    { name: 'FAQ', href: '/faq' },
    { name: 'Kontak', href: '/contact' },
    { name: 'Kebijakan Privasi', href: '/privacy' },
  ],
}

const socialLinks = [
  { name: 'Instagram', Icon: FaInstagram, href: '#' },
  { name: 'Facebook', Icon: FaFacebook, href: '#' },
  { name: 'TikTok', Icon: FaTiktok, href: '#' },
  { name: 'LinkedIn', Icon: FaLinkedin, href: '#' },
  { name: 'Twitter / X', Icon: FaXTwitter, href: '#' },
]

export function Footer() {
  return (
    <footer className="bg-primary-dark text-white">
      <div className="border-b border-white/10">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 py-12">
            {/* Brand */}
            <div className="lg:col-span-2">
              <Link href="/" className="inline-flex items-center gap-1 text-xl font-extrabold mb-4">
                <span className="text-white">NDS</span>
                <span className="text-accent">Kreasi</span>
              </Link>
              <p className="text-white/60 text-sm mb-5 max-w-xs leading-relaxed">
                Membangun mesin penjualan digital untuk bisnis Anda. Website bukan hanya keren, tapi menghasilkan.
              </p>

              {/* Social */}
              <div className="flex gap-2">
                {socialLinks.map(({ name, Icon, href }) => (
                  <a
                    key={name}
                    href={href}
                    aria-label={name}
                    className="w-8 h-8 bg-white/10 hover:bg-accent rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 className="font-semibold text-white text-sm mb-4">{title}</h4>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} className="text-white/55 hover:text-accent transition-colors text-sm">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* Contact bar */}
      <div className="border-b border-white/10">
        <Container>
          <div className="flex flex-wrap gap-6 py-4 text-sm text-white/55">
            <span className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-accent" />
              {process.env.NEXT_PUBLIC_COMPANY_PHONE}
            </span>
            <span className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-accent" />
              {process.env.NEXT_PUBLIC_COMPANY_EMAIL}
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-accent" />
              {process.env.NEXT_PUBLIC_COMPANY_ADDRESS}
            </span>
          </div>
        </Container>
      </div>

      {/* Copyright */}
      <Container>
        <div className="py-4 text-center text-white/40 text-xs">
          &copy; {new Date().getFullYear()} NDS Kreasi. All rights reserved.
        </div>
      </Container>
    </footer>
  )
}

