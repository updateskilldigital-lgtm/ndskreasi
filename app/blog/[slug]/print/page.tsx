import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { markdownToHtml } from '@/lib/utils/markdown'
import { PrintButton } from '@/components/blog/PrintButton'

type Props = { params: Promise<{ slug: string }> }

export default async function PrintPage({ params }: Props) {
  const { slug } = await params

  const article = await prisma.article.findUnique({
    where: { slug, status: 'published' },
  })
  if (!article) notFound()

  const html = markdownToHtml(article.content)
  const faqs: { question: string; answer: string }[] = article.faq_data ? JSON.parse(article.faq_data) : []
  const publishedAt = article.published_at
    ? new Date(article.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    : ''

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; color: #111; background: #fff; padding: 40px; max-width: 800px; margin: 0 auto; font-size: 15px; line-height: 1.7; }
        .header { border-bottom: 3px solid #1a1564; padding-bottom: 20px; margin-bottom: 30px; }
        .brand { font-weight: 800; font-size: 20px; color: #1a1564; }
        .brand span { color: #f97316; }
        h1 { font-size: 26px; font-weight: 700; color: #1a1564; margin: 12px 0 8px; line-height: 1.3; }
        .meta { color: #666; font-size: 13px; margin-bottom: 24px; }
        h2 { font-size: 18px; font-weight: 700; color: #1a1564; margin: 28px 0 10px; padding-bottom: 6px; border-bottom: 1px solid #e5e7eb; }
        h3 { font-size: 16px; font-weight: 600; color: #374151; margin: 20px 0 8px; }
        p { margin-bottom: 12px; color: #374151; }
        ul, ol { padding-left: 20px; margin-bottom: 12px; }
        li { margin-bottom: 4px; }
        strong { color: #111; font-weight: 600; }
        .faq-section { margin-top: 30px; background: #f0f4ff; padding: 20px; border-radius: 8px; }
        .faq-item { margin-bottom: 14px; }
        .faq-q { font-weight: 600; color: #1a1564; margin-bottom: 4px; }
        .faq-a { color: #374151; font-size: 14px; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #1a1564; text-align: center; color: #666; font-size: 13px; }
        .footer a { color: #1a1564; font-weight: 600; }
        @media print {
          .no-print { display: none !important; }
          body { padding: 0; }
          a { color: inherit; text-decoration: none; }
        }
      `}</style>

      <div className="no-print">
        <PrintButton />
      </div>

      <div className="header">
        <div className="brand">NDS<span>Kreasi</span></div>
        <h1>{article.title}</h1>
        {article.headline && <p style={{ color: '#555', fontSize: '16px', marginTop: '6px' }}>{article.headline}</p>}
        <div className="meta">
          Diterbitkan: {publishedAt} · {article.word_count.toLocaleString()} kata · ndskreasi.com/blog/{slug}
        </div>
      </div>

      <div dangerouslySetInnerHTML={{ __html: html }} />

      {faqs.length > 0 && (
        <div className="faq-section">
          <h2 style={{ border: 'none', marginTop: 0 }}>FAQ</h2>
          {faqs.map((faq, i) => (
            <div key={i} className="faq-item">
              <div className="faq-q">Q: {faq.question}</div>
              <div className="faq-a">A: {faq.answer}</div>
            </div>
          ))}
        </div>
      )}

      <div className="footer">
        <p>Artikel ini diproduksi oleh <a href="https://ndskreasi.com">NDS Kreasi</a> — Jasa Pembuatan Website &amp; Digital Marketing</p>
        <p style={{ marginTop: '6px' }}>Konsultasi gratis: ndskreasi.com · WhatsApp tersedia di website</p>
      </div>
    </>
  )
}
