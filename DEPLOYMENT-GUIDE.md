# Panduan Deploy Blog System ke Website Baru

## Gambaran Sistem

```
ndskreasi/
├── app/              → Halaman & API routes
├── components/       → UI components
├── lib/              → Services (AI, image gen, dll)
├── prisma/           → Schema database
├── public/           → Aset statis & uploads
├── .env.local        → Konfigurasi (API keys, brand, dll)
└── dev.db            → Database SQLite lokal
```

Untuk deploy ke website baru: **copy semua folder, ganti .env.local, ganti warna & nama brand, deploy.**

---

## Langkah 1: Copy Codebase

```bash
# Di terminal, dari folder parent (c:\laragon\www\)
xcopy ndskreasi kioshijab /E /I /H

# Atau di Windows Explorer: copy-paste folder ndskreasi → rename
```

Setelah copy, masuk ke folder baru:
```bash
cd kioshijab
npm install
```

---

## Langkah 2: Ganti Nama Brand & Warna

### A. Warna Utama — `app/globals.css`

Ganti color variables di baris 5–12:

```css
/* kioshijab.com — Rose/Pink */
--color-primary:       #9d174d;   /* rose-800 */
--color-primary-light: #be185d;   /* rose-700 */
--color-primary-dark:  #831843;   /* rose-900 */
--color-accent:        #f59e0b;   /* amber-400 */
--color-accent-light:  #fbbf24;
--color-accent-dark:   #d97706;

/* amanahmuliaemas.id — Gold */
--color-primary:       #92400e;   /* amber-800 */
--color-primary-light: #b45309;   /* amber-700 */
--color-primary-dark:  #78350f;   /* amber-900 */
--color-accent:        #d97706;   /* amber-600 */
--color-accent-light:  #f59e0b;
--color-accent-dark:   #92400e;
```

### B. Nama Brand & Gradient — 4 File

**1. `components/layout/Header.tsx` (baris 36–37)**
```tsx
// Sebelum:
<span className="font-black text-primary">NDS</span>
<span className="font-black text-accent">Kreasi</span>

// kioshijab:
<span className="font-black text-primary">Kios</span>
<span className="font-black text-accent">Hijab</span>

// amanahmuliaemas:
<span className="font-black text-primary">Amanah</span>
<span className="font-black text-accent">Mulia Emas</span>
```

**2. `components/layout/Footer.tsx` (baris 41–42, 45)**
```tsx
// Ganti nama brand dan deskripsi bisnis
```

**3. `components/home/Hero.tsx` (baris 28)**
```tsx
// Ganti gradient warna:
// kioshijab:
className="... from-[#9d174d] via-[#be185d] to-[#831843]"

// amanahmuliaemas:
className="... from-[#92400e] via-[#b45309] to-[#78350f]"
```

**4. `app/admin/login/page.tsx` (baris 43, 47–48)**
```tsx
// Ganti gradient + nama brand di halaman login admin
className="... from-[#9d174d] via-[#be185d] to-[#831843]"
```

### C. Fallback URL — 3 File

Cari dan ganti `'https://ndskreasi.com'` di:
- `app/blog/[slug]/page.tsx` (baris 18)
- `app/feed.xml/route.ts` (baris 4)
- `app/sitemap.ts` (baris 5)

```tsx
// Ganti dengan domain baru:
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kioshijab.com'
```

### D. Nomor WA Default — `components/blog/ScrollLeadForm.tsx` (baris 6)
```tsx
// Ganti fallback hardcoded:
const waNumber = process.env.NEXT_PUBLIC_WA_NUMBER ?? '6281234567890'
// → ganti '6281234567890' dengan nomor WA bisnis baru
```

---

## Langkah 3: Konfigurasi .env.local

Buat file `.env.local` baru (jangan copy dari ndskreasi — API key berbeda per website):

```env
# ─── Database ────────────────────────────────────────────────
DATABASE_URL=file:./dev.db

# ─── URL Website ─────────────────────────────────────────────
NEXT_PUBLIC_SITE_URL=https://kioshijab.com

# ─── Kontak Bisnis ───────────────────────────────────────────
NEXT_PUBLIC_WA_NUMBER=628xxxxxxxxxxxx
NEXT_PUBLIC_COMPANY_EMAIL=hello@kioshijab.com
NEXT_PUBLIC_COMPANY_PHONE=+62 8xx xxxx xxxx
NEXT_PUBLIC_COMPANY_ADDRESS=Jakarta, Indonesia

# ─── Admin ───────────────────────────────────────────────────
ADMIN_SECRET=ganti-dengan-password-kuat-unik

# ─── AI Providers (minimal 1) ────────────────────────────────
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini

# ANTHROPIC_API_KEY=
# GEMINI_API_KEY=
# GROQ_API_KEY=

# ─── Image Generation (opsional) ─────────────────────────────
UNSPLASH_ACCESS_KEY=

# ─── Email Marketing (opsional) ──────────────────────────────
BREVO_API_KEY=
BREVO_LIST_ID=
BREVO_FROM_EMAIL=hello@kioshijab.com
BREVO_FROM_NAME=Kios Hijab

# ─── AdSense (opsional) ──────────────────────────────────────
NEXT_PUBLIC_ADSENSE_CLIENT=
NEXT_PUBLIC_ADSENSE_SLOT_TOP=
NEXT_PUBLIC_ADSENSE_SLOT_MID=
NEXT_PUBLIC_ADSENSE_SLOT_BOT=

# ─── Scheduler ───────────────────────────────────────────────
CRON_SECRET=cron-secret-unik
```

---

## Langkah 4: Setup Database Baru

```bash
# Di folder website baru
npx prisma db push
npx prisma generate
```

Database kosong baru akan dibuat di `dev.db`. Tidak ada data dari ndskreasi yang ikut terbawa.

---

## Langkah 5: Test Lokal

```bash
npm run dev
# Buka: localhost:3001 (atau port lain jika 3000 sudah dipakai)
```

Cek:
- [ ] Homepage tampil dengan brand baru
- [ ] Admin bisa login di `/admin/login` dengan ADMIN_SECRET baru
- [ ] Bisa tambah keyword dan generate artikel
- [ ] Warna & nama brand sudah sesuai

---

## Langkah 6: Deploy ke Server

### Pilihan A: VPS (Recommended untuk SQLite)

SQLite butuh persistent disk — cocok untuk VPS, tidak cocok untuk Vercel/Netlify.

```bash
# Di server (Ubuntu 22.04):
# 1. Install Node.js 20+
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
sudo apt-get install -y nodejs

# 2. Install PM2 (process manager)
npm install -g pm2

# 3. Upload codebase (via git atau scp)
git clone https://github.com/username/kioshijab.git
cd kioshijab
npm install
npm run build

# 4. Jalankan dengan PM2
pm2 start npm --name "kioshijab" -- start
pm2 save
pm2 startup

# 5. Setup Nginx reverse proxy
# /etc/nginx/sites-available/kioshijab.com
server {
    server_name kioshijab.com www.kioshijab.com;
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# 6. SSL dengan Certbot
sudo certbot --nginx -d kioshijab.com -d www.kioshijab.com
```

### Pilihan B: Railway.app (Termudah, ada persistent disk)

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login dan init project
railway login
railway init

# 3. Tambah persistent volume untuk database
# Di dashboard Railway: Add Volume → mount di /app/

# 4. Set environment variables di dashboard Railway
# (copy dari .env.local)

# 5. Deploy
railway up
```

### Pilihan C: Laragon (Lokal/Development saja)

```bash
# Jalankan di port berbeda dari ndskreasi
PORT=3001 npm run dev

# Atau di package.json tambahkan script:
"dev:kioshijab": "PORT=3001 next dev"
```

---

## Langkah 7: Konfigurasi Konten per Website

### kioshijab.com — Seed Keyword Awal

Masuk ke `/admin/blog-generator`, tambahkan keyword dengan intent yang tepat:

**Transaksional (Priority 9):**
```
beli hijab syari online
toko hijab premium murah
grosir hijab seragam sekolah
hijab daily pasmina terbaru
kerudung segi empat voal premium
```

**Komparasi (Priority 7):**
```
hijab voal vs sifon mana lebih adem
brand hijab lokal terbaik Indonesia
bahan hijab yang tidak panas seharian
```

**Masalah (Priority 6):**
```
hijab untuk wajah bulat yang cocok
cara memilih hijab yang tidak transparan
hijab mudah diatur untuk pemula
```

**Informasional (Priority 5):**
```
cara merawat hijab agar tidak kusut
tutorial hijab simple untuk kerja kantoran
kombinasi warna hijab dengan baju
```

### amanahmuliaemas.id — Seed Keyword Awal

**Transaksional (Priority 9):**
```
beli emas batangan online terpercaya
harga emas antam hari ini
cicil emas online aman
jual emas bekas harga terbaik
beli emas perhiasan 24 karat
```

**Komparasi (Priority 7):**
```
emas antam vs UBS mana lebih bagus
investasi emas vs deposito mana lebih untung
tabungan emas vs beli emas fisik
emas batangan vs emas perhiasan untuk investasi
```

**Masalah (Priority 6):**
```
cara cek keaslian emas batangan
emas perhiasan susah dijual kenapa
cara simpan emas agar tidak dicuri
emas di toko perhiasan berbeda karatnya
```

**Informasional (Priority 5):**
```
cara investasi emas untuk pemula modal kecil
waktu terbaik beli emas saat harga turun
emas turun harus beli atau tunggu
sejarah harga emas 10 tahun terakhir
```

---

## Langkah 8: Tambah Affiliate Links per Website

### kioshijab.com — Affiliate yang Relevan

```
keyword: "mesin jahit"        → tokopedia/shopee affiliate
keyword: "jarum pentul"       → produk sendiri atau marketplace
keyword: "mannequin hijab"    → link ke supplier
keyword: "Canva Pro"          → untuk konten kreator hijab
keyword: "Shopee"             → link toko Shopee kioshijab
```

### amanahmuliaemas.id — Affiliate yang Relevan

```
keyword: "Pegadaian"          → produk tabungan emas Pegadaian
keyword: "brankas"            → link ke produk brankas
keyword: "timbangan emas"     → alat cek emas
keyword: "Antam"              → link ke Logam Mulia
```

### Cross-promotion Antar Website

Di **ndskreasi.com**, tambahkan:
```
keyword: "kioshijab"          → https://kioshijab.com (type: card)
keyword: "beli hijab"         → https://kioshijab.com (type: link)
keyword: "beli emas"          → https://amanahmuliaemas.id (type: link)
keyword: "investasi emas"     → https://amanahmuliaemas.id (type: card)
```

Di **kioshijab.com**, tambahkan:
```
keyword: "website toko hijab" → https://ndskreasi.com (type: link)
keyword: "investasi emas"     → https://amanahmuliaemas.id (type: link)
```

Di **amanahmuliaemas.id**, tambahkan:
```
keyword: "website toko emas"  → https://ndskreasi.com (type: link)
keyword: "hijab"              → https://kioshijab.com (type: link)
```

---

## Checklist Deployment Lengkap

### Sebelum Go-Live
- [ ] `npm run build` berhasil tanpa error
- [ ] Semua halaman tampil dengan brand yang benar
- [ ] Admin panel bisa diakses dan digunakan
- [ ] Generate 1 artikel test — title, konten, gambar muncul
- [ ] Affiliate links ter-inject di artikel yang relevan
- [ ] Form lead/subscribe berfungsi
- [ ] SSL aktif (HTTPS)
- [ ] Domain sudah diarahkan ke server

### Setelah Go-Live
- [ ] Submit sitemap ke Google Search Console: `yourdomain.com/sitemap.xml`
- [ ] Daftarkan properti di Google Analytics
- [ ] Test kecepatan di PageSpeed Insights (target 80+)
- [ ] Generate 10 artikel awal dan publish
- [ ] Aktifkan scheduler (3–5 artikel/hari)
- [ ] Setup cron job untuk auto-generate harian

---

## Ringkasan: File yang WAJIB Diubah

| File | Yang Diubah |
|------|-------------|
| `.env.local` | Semua variabel (buat dari scratch) |
| `app/globals.css` | Color variables baris 5–12 |
| `components/layout/Header.tsx` | Nama brand |
| `components/layout/Footer.tsx` | Nama brand + deskripsi |
| `components/home/Hero.tsx` | Gradient warna |
| `app/admin/login/page.tsx` | Gradient + nama brand |
| `app/blog/[slug]/page.tsx` | Fallback SITE_URL |
| `app/feed.xml/route.ts` | Fallback SITE_URL |
| `app/sitemap.ts` | Fallback SITE_URL |
| `components/blog/ScrollLeadForm.tsx` | Fallback WA number |

**Total: 10 file** — setelah selesai, website siap beroperasi sebagai entitas brand yang terpisah.
