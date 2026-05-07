import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateArticle, calculateSeoScore, toSlug, type AIProvider } from '@/lib/services/ai-content'
import { generateArticleImage } from '@/lib/services/image-gen'

export const maxDuration = 300

export async function POST(req: NextRequest) {
  const cronSecret  = process.env.CRON_SECRET
  const authHeader  = req.headers.get('authorization')

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const settings = await prisma.setting.findMany({
    where: { key: { in: ['scheduler_enabled', 'scheduler_max_per_day', 'scheduler_last_run'] } },
  })
  const settingMap = Object.fromEntries(settings.map(s => [s.key, s.value]))

  if (settingMap.scheduler_enabled !== 'true') {
    return NextResponse.json({ skipped: true, reason: 'Scheduler disabled' })
  }

  const maxPerDay = parseInt(settingMap.scheduler_max_per_day ?? '3')
  const lastRun   = settingMap.scheduler_last_run ? new Date(settingMap.scheduler_last_run) : null
  const today     = new Date()
  today.setHours(0, 0, 0, 0)

  if (lastRun && lastRun >= today) {
    return NextResponse.json({ skipped: true, reason: 'Already ran today' })
  }

  // Priority order: transaksional(9) > komparasi(7) > masalah(6) > informasional(5)
  const pendingKeywords = await prisma.keyword.findMany({
    where: { status: 'pending' },
    orderBy: [{ priority: 'desc' }, { created_at: 'asc' }],
    take: maxPerDay,
  })

  if (pendingKeywords.length === 0) {
    return NextResponse.json({ generated: 0, reason: 'No pending keywords' })
  }

  await prisma.setting.upsert({
    where:  { key: 'scheduler_last_run' },
    update: { value: new Date().toISOString() },
    create: { key: 'scheduler_last_run', value: new Date().toISOString() },
  })

  let generated = 0
  const errors: string[] = []

  for (const keyword of pendingKeywords) {
    try {
      await prisma.keyword.update({ where: { id: keyword.id }, data: { status: 'processing' } })

      const result = await generateArticle(keyword.keyword, keyword.ai_provider as AIProvider, {
        tone:         keyword.focus_tone,
        wordCount:    keyword.target_words,
        useHumanizer: keyword.use_humanizer,
      })

      // Fallback title
      if (result.title === 'Artikel Baru') {
        result.title = keyword.keyword
          .split(' ')
          .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(' ')
      }

      let slug = toSlug(result.title) || toSlug(keyword.keyword)
      const existing = await prisma.article.findUnique({ where: { slug } })
      if (existing) slug = `${slug}-${Date.now()}`

      const seoScore = calculateSeoScore({
        title:           result.title,
        metaDescription: result.metaDescription,
        content:         result.content,
        excerpt:         result.excerpt,
      })

      const article = await prisma.article.create({
        data: {
          keyword_id:       keyword.id,
          title:            result.title,
          slug,
          headline:         result.headline  || null,
          excerpt:          result.excerpt   || null,
          content:          result.content,
          ai_provider:      keyword.ai_provider,
          meta_title:       result.title,
          meta_description: result.metaDescription || null,
          faq_data:         result.faqs.length > 0 ? JSON.stringify(result.faqs) : null,
          word_count:       result.wordCount,
          seo_score:        seoScore,
          status:           'draft',
        },
      })

      // Generate image (non-fatal)
      try {
        const image = await generateArticleImage(result.title, keyword.keyword, slug)
        if (image.url) {
          await prisma.article.update({
            where: { id: article.id },
            data:  { featured_image: image.url, image_alt: image.alt },
          })
        }
      } catch (imgErr) {
        console.error('[Cron] Image failed:', imgErr instanceof Error ? imgErr.message : imgErr)
      }

      await prisma.keyword.update({ where: { id: keyword.id }, data: { status: 'done' } })
      generated++
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      await prisma.keyword.update({ where: { id: keyword.id }, data: { status: 'failed', error_msg: msg } })
      errors.push(`${keyword.keyword}: ${msg}`)
    }
  }

  return NextResponse.json({ generated, errors, total: pendingKeywords.length })
}
