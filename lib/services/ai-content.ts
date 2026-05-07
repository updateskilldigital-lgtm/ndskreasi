export type AIProvider = 'openai' | 'claude' | 'gemini' | 'groq'

export interface GeneratedArticle {
  title: string
  headline: string
  metaDescription: string
  excerpt: string
  content: string
  faqs: { question: string; answer: string }[]
  wordCount: number
}

// Higher temperature = more varied, less robotic output
const TEMPERATURES: Record<AIProvider, number> = {
  openai: 0.88,
  claude: 0.85,
  gemini: 0.87,
  groq: 0.92,
}

// ─── Persona & Anti-AI System Prompt ────────────────────────────────────────

function buildSystemPersona(): string {
  return `Kamu adalah Rizki Pratama, content writer senior dari Surabaya dengan 9 tahun pengalaman menulis konten bisnis, marketing digital, dan teknologi untuk UMKM dan startup Indonesia. Kamu pernah berkontribusi di DailySocial, Kompas Tekno, dan beberapa blog brand tech lokal.

KARAKTERISTIK TULISANMU:
- Kalimat bervariasi panjang secara alami: ada yang 4-6 kata, ada yang 20+ kata. Tidak pernah monoton.
- Bicara langsung ke pembaca tanpa kaku: "coba bayangkan...", "ini yang sering terjadi:", "jujur saja...", "yang jarang dibahas adalah..."
- Selalu sertakan angka/data spesifik dengan sumber (BPS, Kemenkop, Katadata, Think with Google Indonesia, APJII)
- Gunakan contoh nyata ekosistem Indonesia: Tokopedia, Shopee, Gojek, Traveloka, Kopi Kenangan, Warung Pintar, Bukalapak
- Konteks pembayaran digital: QRIS, GoPay, OVO, Dana, ShopeePay, Midtrans
- Sesekali beri opini/nuansa: "yang menarik dari data ini...", "menurut pengalaman kami bekerja dengan UMKM..."
- Paragraf pertama selalu hook kuat — langsung masuk ke masalah, fakta mengejutkan, atau pertanyaan provokatif

FRASA YANG DILARANG KERAS (jangan gunakan sama sekali):
× "Dalam era digital saat ini" / "Di era digital ini"
× "Tidak dapat dipungkiri bahwa"
× "Penting untuk diketahui bahwa" / "Sangat penting untuk"
× "Perlu diperhatikan bahwa" / "Perlu dicatat bahwa"
× "Sebagai kesimpulan" / "Kesimpulannya" / "Dapat disimpulkan"
× "Hal ini menunjukkan bahwa"
× "Dengan demikian" / "Oleh karena itu" (sebagai pembuka kalimat)
× "Mari kita bahas" / "Mari kita pelajari bersama"
× "Tidak hanya itu saja"
× "Pada dasarnya" / "Pada hakikatnya"
× Daftar 5 poin persis berformat identik untuk setiap section
× Pembuka dengan definisi KBBI`
}

// ─── Indonesian Context Injector ────────────────────────────────────────────

function buildIndonesianContext(keyword: string): string {
  const kw = keyword.toLowerCase()

  const base = `Data konteks Indonesia terkini (gunakan yang paling relevan):
• 67 juta UMKM berkontribusi 61% PDB (Kemenkop 2023)
• 215 juta pengguna internet aktif (APJII 2024)
• 78% transaksi e-commerce via mobile (IPSOS 2023)
• Platform dominan: WhatsApp Business (60 juta merchant), Instagram, TikTok Shop, Tokopedia, Shopee`

  if (kw.includes('website') || kw.includes('landing page') || kw.includes('web')) {
    return `${base}
• 64% UMKM Indonesia belum punya website profesional (Kemenkop 2023)
• CMS populer: WordPress (43% market share), Wix, Shopify untuk e-commerce
• Hosting lokal terpercaya: Niagahoster, Domainesia, Rumahweb, IDwebhost
• Rata-rata biaya website UMKM: Rp 3–15 juta (custom) atau Rp 150–500rb/bulan (SaaS)
• Konversi rata-rata landing page Indonesia: 2.5–4.5% (benchmark industri 2023)`
  }

  if (kw.includes('seo') || kw.includes('google') || kw.includes('ranking')) {
    return `${base}
• Google kuasai 97.4% search engine Indonesia
• 80% pembeli online Indonesia cek Google sebelum beli (Think with Google 2023)
• Rata-rata CTR posisi 1 Google: 28.5%, posisi 2: 15.7%, posisi 3: 11%
• Voice search naik 45% di Indonesia, terutama Bahasa Indonesia dan Jawa
• Core Web Vitals: 68% website Indonesia masih belum lulus (data Lighthouse 2024)`
  }

  if (kw.includes('digital marketing') || kw.includes('iklan') || kw.includes('ads')) {
    return `${base}
• Budget digital marketing UMKM rata-rata Rp 500rb–2jt/bulan
• ROAS rata-rata Meta Ads Indonesia: 3–6x untuk produk FMCG
• TikTok Shop: GMV Indonesia terbesar di Asia Tenggara 2023
• CPM Instagram Indonesia 2024: Rp 15.000–45.000 (tergantung target)
• Email open rate rata-rata Indonesia: 21.3% (lebih tinggi dari rata-rata global 19.8%)`
  }

  if (kw.includes('bisnis') || kw.includes('usaha') || kw.includes('umkm') || kw.includes('startup')) {
    return `${base}
• Modal awal UMKM online Indonesia rata-rata Rp 5–50 juta
• Sektor UMKM terbesar: kuliner (30%), fashion (25%), kerajinan (20%)
• KUR 2024: plafon hingga Rp 500 juta, bunga 6% per tahun
• 23% UMKM sudah onboard marketplace (sisanya masih offline/WhatsApp only)
• Rata-rata omzet UMKM digital 2.7x lebih besar dari non-digital (BPS 2023)`
  }

  if (kw.includes('aplikasi') || kw.includes('software') || kw.includes('teknologi')) {
    return `${base}
• Penetrasi smartphone Indonesia: 73.7% populasi (GSMA 2024)
• Android dominasi 90.3% market share Indonesia
• Top app category: e-commerce, ride-hailing, financial services, social media
• SaaS adoption UMKM naik 67% pasca-pandemi (Gartner Indonesia 2023)
• Rata-rata UMKM Indonesia pakai 3–5 aplikasi bisnis setiap hari`
  }

  return base
}

// ─── Article Structure Variants ─────────────────────────────────────────────

function getArticleStructure(tone: string, keyword: string): string {
  // Rotate structure based on keyword hash to avoid identical patterns
  const hash = keyword.split('').reduce((a, c) => a + c.charCodeAt(0), 0)

  if (tone === 'how-to') {
    const variants = [
      `## Kenapa Kebanyakan Orang Salah Paham soal ${keyword}
## Yang Harus Disiapkan Sebelum Mulai
### [Sub-persiapan spesifik]
## Langkah 1: [Aksi konkret dengan hasil terukur]
### Detail dan tips implementasi
## Langkah 2: [Aksi konkret]
## Langkah 3: [Aksi konkret]
## Kesalahan Paling Mahal yang Harus Dihindari
## Berapa Lama Sampai Hasilnya Terasa?`,
      `## Sebelum Mulai: Ukur Dulu Kondisimu
## Fondasi yang Tidak Bisa Dilewati
### [Elemen kritis 1]
### [Elemen kritis 2]
## Cara Melakukannya dengan Benar
### Step-by-step praktis
## Tanda Kamu Sudah di Jalur yang Benar
## Ketika Hasilnya Tidak Sesuai Ekspektasi`,
    ]
    return variants[hash % variants.length]
  }

  if (tone === 'review') {
    return `## Gambaran Cepat: Worth It atau Tidak?
## Apa yang Sebenarnya Ditawarkan
### Keunggulan yang jarang disebut kompetitor
### Kekurangan yang sering disembunyikan
## Perbandingan Langsung dengan Alternatif Populer
## Siapa yang Akan Paling Diuntungkan?
## Bicara Harga: Realistis untuk UMKM?
## Rekomendasi Final Kami`
  }

  if (tone === 'persuasif') {
    return `## Masalah yang Mungkin Tidak Kamu Sadari
## Data yang Mengubah Perspektif
### [Statistik counter-intuitive]
## Bukti dari Bisnis yang Sudah Berhasil
### Mini studi kasus UMKM Indonesia
## Langkah Pertama yang Bisa Dilakukan Hari Ini
## Biaya vs Nilai: Kalkulasi yang Jujur`
  }

  if (tone === 'berita') {
    return `## Ringkasan: Apa yang Berubah
## Latar Belakang dan Konteks
## Detail Perkembangan Terbaru
### [Aspek teknis/regulasi]
### [Dampak ke industri]
## Respons dari Pelaku Industri
## Apa Artinya untuk Bisnis Kamu?`
  }

  // Informatif — 3 variants based on hash
  const informatifVariants = [
    `## Gambaran Lengkap yang Perlu Kamu Tahu
### [Aspek fundamental]
### [Aspek yang sering disalahpahami]
## Cara Kerjanya di Lapangan
### Implementasi praktis
### Contoh nyata
## Data Terbaru dari Indonesia
## Yang Membedakan yang Berhasil dan Gagal
## Panduan Memulai`,
    `## Mengapa Ini Lebih Penting dari yang Kamu Kira
## Anatomi [keyword]: Breakdown Komprehensif
### Komponen A
### Komponen B
## Studi Kasus: UMKM yang Melakukannya dengan Tepat
## Apa yang Harus Diprioritaskan?
## Tools dan Resource yang Direkomendasikan`,
    `## Realita vs Ekspektasi
## Fondasi yang Sering Diabaikan
### [Detail kritis 1]
### [Detail kritis 2]
## Strategi yang Terbukti Bekerja di Pasar Indonesia
### [Strategi 1]
### [Strategi 2]
## Indikator Keberhasilan yang Bisa Diukur
## Langkah Selanjutnya`,
  ]
  return informatifVariants[hash % informatifVariants.length]
}

// ─── Main Prompt Builder ─────────────────────────────────────────────────────

function buildPrompt(keyword: string, tone: string, wordCount: number): string {
  const context = buildIndonesianContext(keyword)
  const structure = getArticleStructure(tone, keyword)

  return `Tulis artikel ${tone} berkualitas tinggi dalam Bahasa Indonesia tentang: "${keyword}"
Target panjang konten: ${wordCount} kata.

DATA KONTEKS INDONESIA (gunakan yang relevan, jangan semua):
${context}

STRUKTUR ARTIKEL (panduan fleksibel — adaptasi jika perlu):
${structure}

FORMAT OUTPUT WAJIB:

[TITLE]
(judul 55-65 karakter, mengandung keyword, buat yang membuat orang terdorong klik — bukan sekadar deskripsi)

[HEADLINE]
(satu kalimat pendukung yang memperkuat judul dari sudut berbeda, bukan mengulangnya)

[META_DESCRIPTION]
(150-160 karakter, mengandung keyword, ada value proposition spesifik)

[EXCERPT]
(2-3 kalimat pembuka yang langsung hook — jangan mulai dengan "Artikel ini membahas" atau definisi)

[CONTENT]
(artikel lengkap sesuai struktur, ${wordCount} kata)

[FAQ]
Q: (pertanyaan yang benar-benar diketik orang di Google tentang "${keyword}")
A: (jawaban 3-4 kalimat, konkret, langsung berguna)

Q: (pertanyaan berbeda angle)
A: (jawaban)

Q: (pertanyaan tentang biaya/waktu/cara — paling sering dicari)
A: (jawaban)

Q: (pertanyaan tentang masalah umum atau alternatif)
A: (jawaban)

ATURAN KRITIS ARTIKEL:
1. Paragraf pertama WAJIB hook — mulai dengan fakta mengejutkan, angka, atau pertanyaan provokatif
2. Setiap H2 section minimal 150 kata, variatif strukturnya (tidak semua berformat daftar)
3. Minimal 2 data/statistik spesifik dengan sumber (BPS/Kemenkop/Think with Google/dll)
4. Minimal 1 contoh nyata bisnis atau brand Indonesia yang relevan
5. **Bold** hanya untuk angka kunci dan konsep terpenting (bukan sembarang kata)
6. Variasikan panjang kalimat — mix pendek dan panjang, jangan monoton
7. Akhiri dengan satu langkah konkret yang bisa dilakukan pembaca hari ini`
}

// ─── Humanizer Pass ───────────────────────────────────────────────────────────

async function humanizeContent(raw: string, provider: AIProvider): Promise<string> {
  const prompt = `Kamu adalah editor konten senior yang bertugas merevisi artikel berikut agar terasa lebih natural, personal, dan tidak terdeteksi sebagai konten AI generik. JANGAN ubah struktur, data, atau format tag.

ARTIKEL:
${raw}

INSTRUKSI REVISI (fokus pada diksi dan ritme, bukan struktur):
1. Variasikan panjang kalimat drastis — campurkan kalimat 4-6 kata dengan kalimat panjang 20+ kata
2. Hapus semua frasa AI generik yang tersisa dan ganti dengan ungkapan lebih hidup:
   • "tidak dapat dipungkiri" → "faktanya" / "nyatanya" / hapus saja
   • "sangat penting" → tunjukkan kenapa penting dengan contoh konkret
   • "sebagai kesimpulan" → langsung ke poin penutupnya
   • "dalam era digital" → konteks spesifik yang relevan
3. Buat satu kalimat per H2 section yang "berbicara langsung" ke pembaca
4. Tambahkan satu kalimat opini/nuansa ringan per 2-3 section ("yang menarik dari ini...", "jujur saja...")
5. Pastikan paragraf pembuka [CONTENT] adalah hook yang kuat dan tidak klise
6. PERTAHANKAN persis: semua tag [TITLE][HEADLINE][META_DESCRIPTION][EXCERPT][CONTENT][FAQ], semua heading ##/###, semua data/angka, semua format **bold** dan list

Kembalikan artikel LENGKAP dengan semua tag dan format persis sama.`

  try {
    // Use same provider but higher temperature for humanizer
    const temp = Math.min(TEMPERATURES[provider] + 0.05, 1.0)
    return await callProviderRaw(provider, prompt, temp) || raw
  } catch {
    return raw
  }
}

// ─── Provider Calls ───────────────────────────────────────────────────────────

async function callProviderRaw(provider: AIProvider, prompt: string, temperature: number): Promise<string> {
  switch (provider) {
    case 'openai': {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL ?? 'gpt-4o-mini',
          messages: [
            { role: 'system', content: buildSystemPersona() },
            { role: 'user', content: prompt },
          ],
          temperature,
        }),
        signal: AbortSignal.timeout(180_000),
      })
      if (!res.ok) throw new Error(`OpenAI error ${res.status}: ${await res.text()}`)
      const d = await res.json()
      return d.choices?.[0]?.message?.content ?? ''
    }

    case 'claude': {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY ?? '',
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: process.env.CLAUDE_MODEL ?? 'claude-haiku-4-5-20251001',
          max_tokens: 8192,
          temperature,
          system: buildSystemPersona(),
          messages: [{ role: 'user', content: prompt }],
        }),
        signal: AbortSignal.timeout(180_000),
      })
      if (!res.ok) throw new Error(`Claude error ${res.status}: ${await res.text()}`)
      const d = await res.json()
      return d.content?.[0]?.text ?? ''
    }

    case 'gemini': {
      const model = process.env.GEMINI_MODEL ?? 'gemini-2.0-flash'
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: buildSystemPersona() }] },
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature, maxOutputTokens: 8192 },
          }),
          signal: AbortSignal.timeout(180_000),
        }
      )
      if (!res.ok) throw new Error(`Gemini error ${res.status}: ${await res.text()}`)
      const d = await res.json()
      return d.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
    }

    case 'groq': {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
        body: JSON.stringify({
          model: process.env.GROQ_MODEL ?? 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: buildSystemPersona() },
            { role: 'user', content: prompt },
          ],
          temperature,
        }),
        signal: AbortSignal.timeout(120_000),
      })
      if (!res.ok) throw new Error(`Groq error ${res.status}: ${await res.text()}`)
      const d = await res.json()
      return d.choices?.[0]?.message?.content ?? ''
    }

    default:
      throw new Error(`Provider tidak dikenal: ${provider}`)
  }
}

// ─── Response Parser ──────────────────────────────────────────────────────────

function extract(raw: string, startTag: string, endTag: string | null): string {
  // Try exact tag, then bold-wrapped variant, then case-insensitive
  const candidates = [
    startTag,
    `**${startTag}**`,
    startTag.toLowerCase(),
  ]
  let startIdx = -1
  let tagLen = startTag.length

  for (const candidate of candidates) {
    const idx = raw.indexOf(candidate)
    if (idx !== -1) {
      startIdx = idx
      tagLen = candidate.length
      break
    }
  }

  if (startIdx === -1) return ''
  const from = startIdx + tagLen

  let to = raw.length
  if (endTag) {
    // Try same variants for endTag
    const endCandidates = [endTag, `**${endTag}**`, endTag.toLowerCase()]
    for (const candidate of endCandidates) {
      const idx = raw.indexOf(candidate, from)
      if (idx !== -1) { to = idx; break }
    }
  }

  return raw.slice(from, to).trim()
}

function cleanContent(content: string): string {
  return content
    // Remove any leftover format tags that leaked into the content block
    .replace(/^\s*\[?(TITLE|HEADLINE|META_DESCRIPTION|EXCERPT|CONTENT|FAQ)\]?\s*$/gim, '')
    // Remove bold-wrapped tag labels: **META_DESCRIPTION**, **EXCERPT**, etc.
    .replace(/\*\*(TITLE|HEADLINE|META_DESCRIPTION|EXCERPT|CONTENT|FAQ)\*\*/gi, '')
    // Remove leading H1 (# ...) — page already renders the title above the content
    .replace(/^#\s+.+\n?/m, '')
    // Collapse 3+ consecutive blank lines into 2
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function parseResponse(raw: string): GeneratedArticle {
  // Normalise: strip stray ** around tags so variants are handled uniformly
  const normalised = raw.replace(/\*\*(\[(?:TITLE|HEADLINE|META_DESCRIPTION|EXCERPT|CONTENT|FAQ)\])\*\*/g, '$1')

  const title = extract(normalised, '[TITLE]', '[HEADLINE]')
  const headline = extract(normalised, '[HEADLINE]', '[META_DESCRIPTION]')
  const metaDescription = extract(normalised, '[META_DESCRIPTION]', '[EXCERPT]')
  const excerpt = extract(normalised, '[EXCERPT]', '[CONTENT]')
  const content = extract(normalised, '[CONTENT]', '[FAQ]')
  const faqRaw = extract(normalised, '[FAQ]', null)

  const faqs: { question: string; answer: string }[] = []
  const lines = faqRaw.split('\n')
  let currentQ = ''
  let currentA = ''

  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.startsWith('Q:')) {
      if (currentQ && currentA) faqs.push({ question: currentQ, answer: currentA })
      currentQ = trimmed.slice(2).trim()
      currentA = ''
    } else if (trimmed.startsWith('A:')) {
      currentA = trimmed.slice(2).trim()
    } else if (currentA && trimmed) {
      currentA += ' ' + trimmed
    }
  }
  if (currentQ && currentA) faqs.push({ question: currentQ, answer: currentA })

  const rawContent = content || raw
  const effectiveContent = cleanContent(rawContent)
  const wordCount = effectiveContent.split(/\s+/).filter(Boolean).length

  if (!title) {
    console.warn('[AI] [TITLE] tag not found in response. First 300 chars:', raw.slice(0, 300))
  }

  return {
    title: title || 'Artikel Baru',
    headline: headline || '',
    metaDescription: metaDescription || '',
    excerpt: excerpt || '',
    content: effectiveContent,
    faqs,
    wordCount,
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function generateArticle(
  keyword: string,
  provider: AIProvider,
  options: { tone?: string; wordCount?: number; useHumanizer?: boolean } = {}
): Promise<GeneratedArticle> {
  const tone = options.tone ?? 'informatif'
  const wordCount = options.wordCount ?? 1500
  const useHumanizer = options.useHumanizer ?? false
  const temperature = TEMPERATURES[provider]
  const prompt = buildPrompt(keyword, tone, wordCount)

  let raw = await callProviderRaw(provider, prompt, temperature)

  if (useHumanizer && raw) {
    console.log('[AI] Running humanizer pass...')
    raw = await humanizeContent(raw, provider)
  }

  return parseResponse(raw)
}

export function calculateSeoScore(article: {
  title: string
  metaDescription: string
  content: string
  excerpt: string
  hasCategory?: boolean
  tagsCount?: number
}): number {
  let score = 0
  const { title, metaDescription, content, excerpt } = article

  if (title.length >= 40 && title.length <= 65) score += 15
  else if (title.length > 0) score += 7

  if (metaDescription.length >= 120 && metaDescription.length <= 160) score += 15
  else if (metaDescription.length > 0) score += 7

  if (excerpt.length > 0) score += 10

  const wc = content.split(/\s+/).filter(Boolean).length
  if (wc >= 1500) score += 20
  else if (wc >= 1000) score += 14
  else if (wc >= 500) score += 7

  // Support both markdown (## ) and HTML (<h2>) heading patterns
  const h2 = (content.match(/^## /gm) ?? []).length +
             (content.match(/<h2[\s>]/gi) ?? []).length
  if (h2 >= 4) score += 15
  else if (h2 >= 2) score += 10
  else if (h2 >= 1) score += 5

  const h3 = (content.match(/^### /gm) ?? []).length +
             (content.match(/<h3[\s>]/gi) ?? []).length
  if (h3 >= 2) score += 10
  else if (h3 >= 1) score += 5

  const hasBold = (content.match(/\*\*.+?\*\*/g) ?? []).length >= 3 ||
                  (content.match(/<strong[\s>]/gi) ?? []).length >= 3
  const hasList = /^[-*] /m.test(content) || /<[uo]l[\s>]/i.test(content)
  if (hasBold) score += 5
  if (hasList) score += 5
  if (/kesimpulan|penutup|langkah selanjutnya/i.test(content)) score += 5
  if (article.hasCategory) score += 5
  if ((article.tagsCount ?? 0) >= 1) score += 5

  return Math.min(100, score)
}

export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[àáâãä]/g, 'a').replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i').replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u').replace(/[ñ]/g, 'n')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}
