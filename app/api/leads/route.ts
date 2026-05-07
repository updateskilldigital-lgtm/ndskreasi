import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const requiredFields = ['name', 'business_name', 'whatsapp', 'has_website', 'timeline', 'need_description']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Field ${field} is required` }, { status: 400 })
      }
    }

    const lead = await prisma.lead.create({
      data: {
        name: body.name,
        business_name: body.business_name,
        whatsapp: body.whatsapp,
        has_website: body.has_website,
        timeline: body.timeline,
        budget: body.budget ?? null,
        need_description: body.need_description,
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

    return NextResponse.json({ message: 'Lead saved successfully', lead }, { status: 201 })
  } catch (error) {
    console.error('Error saving lead:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
