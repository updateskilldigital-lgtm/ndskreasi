export type PortfolioItem = {
  id: number
  title: string
  category: string
  image: string
  description: string
  client: string
  year: string
  result: string
}

export const portfolioItems: PortfolioItem[] = [
  {
    id: 1,
    title: 'Website Cafe Bahagia',
    category: 'Kuliner',
    image: 'https://placehold.co/600x400/0A0A0A/D4AF37?text=Cafe+Bahagia',
    description: 'Website pemesanan online dengan sistem loyalty point terintegrasi',
    client: 'Cafe Bahagia Group',
    year: '2024',
    result: '+150% orders in 2 months',
  },
  {
    id: 2,
    title: 'Landing Page Fashion Store',
    category: 'Fashion',
    image: 'https://placehold.co/600x400/0A0A0A/D4AF37?text=Fashion+Store',
    description: 'High-converting landing page untuk campaign Ramadhan 2024',
    client: 'Fashion Store Indonesia',
    year: '2024',
    result: '40% conversion rate',
  },
  {
    id: 3,
    title: 'Website Jasa Konsultan',
    category: 'Jasa',
    image: 'https://placehold.co/600x400/0A0A0A/D4AF37?text=Konsultan',
    description: 'Portfolio digital dengan lead generation system otomatis',
    client: 'Konsultan Pro Group',
    year: '2023',
    result: '300% more leads',
  },
  {
    id: 4,
    title: 'E-commerce Kuliner',
    category: 'Kuliner',
    image: 'https://placehold.co/600x400/0A0A0A/D4AF37?text=E-commerce',
    description: 'Platform e-commerce untuk bisnis kuliner dengan sistem delivery',
    client: 'FoodHub',
    year: '2024',
    result: '1000+ orders/month',
  },
  {
    id: 5,
    title: 'Branding Website Agency',
    category: 'Jasa',
    image: 'https://placehold.co/600x400/0A0A0A/D4AF37?text=Agency',
    description: 'Website corporate dengan sistem booking online',
    client: 'Creative Agency',
    year: '2023',
    result: '50+ leads/month',
  },
  {
    id: 6,
    title: 'Landing Page Produk Digital',
    category: 'Digital',
    image: 'https://placehold.co/600x400/0A0A0A/D4AF37?text=Digital+Product',
    description: 'Landing page untuk launch produk digital dengan sistem pre-order',
    client: 'Tech Startup',
    year: '2024',
    result: 'Rp500M+ sales in launch week',
  },
]

export const portfolioCategories = ['Semua', 'Kuliner', 'Fashion', 'Jasa', 'Digital']
