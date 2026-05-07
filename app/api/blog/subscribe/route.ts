import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

async function syncToBrevo(email: string, name: string, isNew: boolean) {
  const brevoKey    = process.env.BREVO_API_KEY
  const brevoListId = process.env.BREVO_LIST_ID ? parseInt(process.env.BREVO_LIST_ID) : null
  if (!brevoKey) return

  // Add contact to list
  if (brevoListId) {
    fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'api-key': brevoKey },
      body: JSON.stringify({
        email,
        attributes: { FIRSTNAME: name || '' },
        listIds: [brevoListId],
        updateEnabled: true,
      }),
    }).catch(() => {})
  }

  // Send welcome email only to new subscribers
  if (!isNew) return
  const welcomeTemplateId = process.env.BREVO_WELCOME_TEMPLATE_ID
    ? parseInt(process.env.BREVO_WELCOME_TEMPLATE_ID)
    : null

  if (welcomeTemplateId) {
    fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'api-key': brevoKey },
      body: JSON.stringify({
        to: [{ email, name: name || email }],
        templateId: welcomeTemplateId,
        params: { FIRSTNAME: name || 'Teman', SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ndskreasi.com' },
      }),
    }).catch(() => {})
  } else {
    // Fallback: plain welcome email (no template needed)
    const siteUrl  = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ndskreasi.com'
    const fromEmail = process.env.BREVO_FROM_EMAIL ?? 'hello@ndskreasi.com'
    const fromName  = process.env.BREVO_FROM_NAME  ?? 'NDS Kreasi'
    fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'api-key': brevoKey },
      body: JSON.stringify({
        sender: { email: fromEmail, name: fromName },
        to: [{ email, name: name || email }],
        subject: `Selamat datang di komunitas NDS Kreasi! 🎉`,
        htmlContent: `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;color:#111">
  <div style="margin-bottom:24px">
    <span style="font-weight:800;font-size:20px;color:#1a1564">NDS</span>
    <span style="font-weight:800;font-size:20px;color:#f97316">Kreasi</span>
  </div>
  <h2 style="color:#1a1564;margin-bottom:8px">Halo${name ? `, ${name}` : ''}! Selamat bergabung 👋</h2>
  <p style="color:#555;line-height:1.6">Terima kasih sudah menjadi bagian dari komunitas NDS Kreasi. Kami rutin berbagi:</p>
  <ul style="color:#555;line-height:2;padding-left:20px">
    <li>Tips website & SEO untuk UMKM Indonesia</li>
    <li>Studi kasus digital marketing lokal</li>
    <li>Update tools & strategi terbaru</li>
  </ul>
  <div style="margin:28px 0;padding:20px;background:#f0f4ff;border-radius:8px">
    <p style="margin:0 0 12px;font-weight:600;color:#1a1564">Selagi menunggu konten berikutnya:</p>
    <a href="${siteUrl}/blog" style="display:inline-block;background:#1a1564;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:600;font-size:14px">
      Baca Artikel Terbaru →
    </a>
  </div>
  <p style="color:#555;line-height:1.6">Punya proyek atau butuh konsultasi? Balas email ini atau hubungi kami langsung — kami senang berdiskusi.</p>
  <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
  <p style="color:#999;font-size:12px">NDS Kreasi · Jasa Website & Digital Marketing Indonesia<br>
    <a href="${siteUrl}" style="color:#1a1564">${siteUrl}</a>
  </p>
</div>`,
      }),
    }).catch(() => {})
  }
}

export async function POST(req: NextRequest) {
  const { email, name, source } = await req.json()
  if (!email?.trim()) return NextResponse.json({ error: 'Email wajib diisi' }, { status: 400 })

  const normalizedEmail = email.trim().toLowerCase()
  const normalizedName  = name?.trim() || null

  try {
    const existing = await prisma.subscriber.findUnique({ where: { email: normalizedEmail } })
    const isNew = !existing

    await prisma.subscriber.upsert({
      where:  { email: normalizedEmail },
      update: {},
      create: { email: normalizedEmail, name: normalizedName, source: source || null },
    })

    // Fire-and-forget — don't block the response
    syncToBrevo(normalizedEmail, normalizedName ?? '', isNew)

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: true })
  }
}
