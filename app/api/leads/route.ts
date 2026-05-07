import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

// Rate limiting: simple in-memory store (for production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX = 5 // 5 requests per minute

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const record = rateLimitStore.get(ip)
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 }
  }
  
  if (record.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0 }
  }
  
  record.count++
  rateLimitStore.set(ip, record)
  return { allowed: true, remaining: RATE_LIMIT_MAX - record.count }
}

// Validation schema
const leadSchema = z.object({
  name: z.string().min(2).max(100),
  business_name: z.string().min(2).max(100),
  whatsapp: z.string().regex(/^62[0-9]{9,13}$/),
  has_website: z.enum(['yes', 'no']),
  timeline: z.enum(['<1 month', '1-3 months', '>3 months']),
  budget: z.string().optional(),
  need_description: z.string().min(20).max(1000),
})

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
    const rateLimit = checkRateLimit(ip)
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Terlalu banyak permintaan. Silakan coba lagi dalam 1 menit.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    
    // Validate input
    const validation = leadSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Data tidak valid', details: validation.error.errors },
        { status: 400 }
      )
    }
    
    const data = validation.data

    const lead = await prisma.lead.create({
      data: {
        name: data.name,
        business_name: data.business_name,
        whatsapp: data.whatsapp,
        has_website: data.has_website,
        timeline: data.timeline,
        budget: data.budget ?? null,
        need_description: data.need_description,
        status: 'new',
      },
    })

    if (resend && process.env.NEXT_PUBLIC_COMPANY_EMAIL) {
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: process.env.NEXT_PUBLIC_COMPANY_EMAIL,
        subject: `Lead baru: ${lead.name} dari ${lead.business_name}`,
        html: `
          <h2>Lead Baru Masuk</h2>
          <table>
            <tr><td><strong>Nama</strong></td><td>${lead.name}</td></tr>
            <tr><td><strong>Bisnis</strong></td><td>${lead.business_name}</td></tr>
            <tr><td><strong>WhatsApp</strong></td><td>${lead.whatsapp}</td></tr>
            <tr><td><strong>Punya Website</strong></td><td>${lead.has_website === 'yes' ? 'Ya' : 'Belum'}</td></tr>
            <tr><td><strong>Timeline</strong></td><td>${lead.timeline}</td></tr>
            <tr><td><strong>Budget</strong></td><td>${lead.budget ?? '-'}</td></tr>
            <tr><td><strong>Kebutuhan</strong></td><td>${lead.need_description}</td></tr>
            <tr><td><strong>Waktu</strong></td><td>${lead.created_at.toLocaleString('id-ID')}</td></tr>
          </table>
          <p><a href="https://wa.me/${lead.whatsapp}">Hubungi via WhatsApp →</a></p>
        `,
      }).catch((err) => console.error('Email error:', err))
    }

    return NextResponse.json({ message: 'Lead saved successfully', lead }, { 
      status: 201,
      headers: {
        'X-RateLimit-Remaining': rateLimit.remaining.toString(),
      }
    })
  } catch (error) {
    console.error('Error saving lead:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
