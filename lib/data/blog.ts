export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  content: string
  author: string
  date: string
  readTime: string
  category: string
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'mengapa-website-penting-untuk-umkm',
    title: 'Mengapa Website Penting untuk UMKM di Era Digital',
    excerpt: 'Pelajari mengapa memiliki website bukan lagi pilihan tapi keharusan untuk UMKM yang ingin bertahan dan berkembang.',
    content: `Di era digital ini, kehadiran online bukan lagi sekadar pilihan — ini adalah kebutuhan mendasar bagi setiap bisnis, termasuk UMKM.

**Mengapa Website Penting?**

Pertama, website adalah "kantor digital" Anda yang buka 24 jam sehari, 7 hari seminggu. Calon pelanggan bisa menemukan informasi produk dan layanan Anda kapan saja, bahkan saat Anda tidur.

Kedua, website membangun kredibilitas bisnis. Survei menunjukkan 75% konsumen menilai kredibilitas bisnis berdasarkan desain websitenya. Bisnis tanpa website sering dianggap tidak profesional.

**Fakta yang Perlu Anda Tahu**

- 97% konsumen mencari produk/jasa secara online sebelum membeli
- UMKM dengan website rata-rata mengalami peningkatan pendapatan 39%
- Biaya website jauh lebih murah dibanding sewa toko fisik

**Langkah Memulai**

Mulailah dengan landing page sederhana yang berisi informasi kontak, produk/layanan utama, dan call-to-action yang jelas. Tidak perlu sempurna dari awal — yang penting hadir dulu di dunia digital.`,
    author: 'Tim Agency Digital',
    date: '15 Januari 2024',
    readTime: '5 menit',
    category: 'Edukasi',
  },
  {
    slug: 'tips-landing-page-high-converting',
    title: '7 Tips Landing Page High Converting untuk Bisnis Anda',
    excerpt: 'Tingkatkan conversion rate landing page Anda hingga 300% dengan tips sederhana ini.',
    content: `Landing page yang baik bukan hanya soal tampilan — tapi soal bagaimana halaman tersebut menggerakkan pengunjung untuk mengambil tindakan.

**1. Headline yang Jelas dan Benefit-Focused**

Hindari headline yang hanya mendeskripsikan produk. Fokus pada manfaat utama yang didapat pelanggan. Contoh: "Tingkatkan Penjualan 3x Lipat dengan Website Profesional" lebih baik dari "Jasa Pembuatan Website".

**2. Social Proof yang Kuat**

Tampilkan testimoni nyata, logo klien, atau angka-angka hasil kerja (mis: "45+ klien puas", "Rp2M+ revenue dihasilkan"). Otak manusia secara naluriah mengikuti apa yang dilakukan orang lain.

**3. Satu CTA yang Dominan**

Jangan beri pengunjung terlalu banyak pilihan. Fokus pada satu tindakan utama — apakah itu "Konsultasi Gratis" atau "Beli Sekarang".

**4. Loading Time di Bawah 2 Detik**

53% pengunjung mobile meninggalkan halaman yang loadingnya lebih dari 3 detik. Optimalkan gambar dan gunakan hosting yang cepat.

**5. Mobile-First Design**

Lebih dari 60% traffic saat ini dari mobile. Pastikan landing page Anda terlihat dan berfungsi sempurna di smartphone.

**6. Urgency dan Scarcity**

"Hanya 5 slot tersedia" atau "Penawaran berakhir Jumat ini" terbukti meningkatkan konversi. Tapi pastikan ini nyata — jangan buat urgency palsu.

**7. Form yang Simpel**

Setiap field tambahan di form bisa menurunkan konversi 10-15%. Tanyakan hanya yang benar-benar perlu.`,
    author: 'Tim Agency Digital',
    date: '10 Januari 2024',
    readTime: '7 menit',
    category: 'Tips',
  },
  {
    slug: 'funnel-marketing-untuk-pemula',
    title: 'Panduan Funnel Marketing untuk Pemula',
    excerpt: 'Pahami konsep funnel marketing dan bagaimana menerapkannya untuk bisnis online Anda.',
    content: `Funnel marketing adalah cara sistematis untuk mengubah orang asing menjadi pelanggan setia. Memahami konsep ini akan mengubah cara Anda melihat bisnis digital.

**Apa itu Funnel Marketing?**

Bayangkan sebuah corong (funnel). Di bagian atas, ada banyak orang yang mungkin tertarik dengan produk Anda. Semakin ke bawah, jumlahnya semakin sedikit tapi semakin "panas" — artinya semakin siap membeli.

**4 Tahap Funnel Utama**

**Awareness (Kesadaran)**
Orang mengenal bisnis Anda untuk pertama kali. Ini bisa lewat iklan, konten media sosial, atau rekomendasi teman. Tujuannya: buat orang tahu Anda ada.

**Interest (Minat)**
Mereka mulai tertarik dan ingin tahu lebih banyak. Mereka mengunjungi website, membaca blog, atau mengikuti Instagram Anda. Tujuannya: berikan value dan bangun kepercayaan.

**Decision (Pertimbangan)**
Mereka membandingkan Anda dengan kompetitor. Di sinilah landing page, testimonial, dan penawaran menarik berperan penting. Tujuannya: buat mereka memilih Anda.

**Action (Tindakan)**
Mereka membeli atau menghubungi Anda. Tujuannya: buat proses ini semudah mungkin.

**Cara Menerapkan untuk Bisnis Anda**

Mulai dengan mengidentifikasi di mana sebagian besar pelanggan Anda berasal. Lalu fokus mengoptimalkan tahap yang paling banyak kehilangan prospek (disebut "leaky funnel").`,
    author: 'Tim Agency Digital',
    date: '5 Januari 2024',
    readTime: '8 menit',
    category: 'Marketing',
  },
]

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug)
}
