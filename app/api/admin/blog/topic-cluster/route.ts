import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { AIProvider } from '@/lib/services/ai-content'

export const maxDuration = 60

async function generateCluster(topic: string, provider: AIProvider): Promise<{
  pillar: string
  clusters: string[]
}> {
  const prompt = `Kamu adalah SEO strategist expert. Buat content cluster untuk topik berikut dalam Bahasa Indonesia.

Topik Utama: "${topic}"

Balas PERSIS dengan format ini:

[PILLAR]
(satu judul artikel pillar yang komprehensif, 55-65 karakter, SEO-friendly)

[CLUSTERS]
(8 keyword/topik supporting article, satu per baris, bervariasi: how-to, review, tips, perbandingan, biaya, dll)

Hanya balas dengan format di atas, tanpa penjelasan tambahan.`

  const { generateArticle } = await import('@/lib/services/ai-content')

  // Reuse the provider call by calling a minimal article gen and parsing
  // Instead, call the provider directly via a helper
  const raw = await callProvider(prompt, provider)

  const pillarBlock = raw.indexOf('[PILLAR]')
  const clustersBlock = raw.indexOf('[CLUSTERS]')
  const pillar = pillarBlock !== -1 && clustersBlock !== -1
    ? raw.slice(pillarBlock + '[PILLAR]'.length, clustersBlock).trim()
    : topic
  const clustersRaw = clustersBlock !== -1 ? raw.slice(clustersBlock + '[CLUSTERS]'.length) : raw

  const clusters = clustersRaw
    .split('\n')
    .map(l => l.replace(/^\d+\.\s*|-\s*/, '').trim())
    .filter(Boolean)
    .slice(0, 10)

  return { pillar, clusters }
}

async function callProvider(prompt: string, provider: AIProvider): Promise<string> {
  switch (provider) {
    case 'openai': {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
        body: JSON.stringify({ model: process.env.OPENAI_MODEL ?? 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }], temperature: 0.6 }),
        signal: AbortSignal.timeout(30_000),
      })
      const d = await res.json()
      return d.choices?.[0]?.message?.content ?? ''
    }
    case 'groq': {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
        body: JSON.stringify({ model: process.env.GROQ_MODEL ?? 'llama-3.3-70b-versatile', messages: [{ role: 'user', content: prompt }], temperature: 0.6 }),
        signal: AbortSignal.timeout(30_000),
      })
      const d = await res.json()
      return d.choices?.[0]?.message?.content ?? ''
    }
    case 'gemini': {
      const model = process.env.GEMINI_MODEL ?? 'gemini-2.0-flash'
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        signal: AbortSignal.timeout(30_000),
      })
      const d = await res.json()
      return d.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
    }
    case 'claude': {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY ?? '', 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({ model: process.env.CLAUDE_MODEL ?? 'claude-haiku-4-5-20251001', max_tokens: 1024, messages: [{ role: 'user', content: prompt }] }),
        signal: AbortSignal.timeout(30_000),
      })
      const d = await res.json()
      return d.content?.[0]?.text ?? ''
    }
    default:
      throw new Error('Provider tidak dikenal')
  }
}

export async function POST(req: NextRequest) {
  const { topic, provider = 'openai', tone = 'informatif', target_words = 1500 } = await req.json()
  if (!topic?.trim()) return NextResponse.json({ error: 'Topic wajib diisi' }, { status: 400 })

  const { pillar, clusters } = await generateCluster(topic.trim(), provider as AIProvider)

  const allKeywords = [pillar, ...clusters]
  let created = 0
  let skipped = 0

  for (const kw of allKeywords) {
    try {
      await prisma.keyword.create({
        data: {
          keyword: kw,
          ai_provider: provider,
          focus_tone: tone,
          target_words: kw === pillar ? Math.max(target_words, 2000) : target_words,
          priority: kw === pillar ? 10 : 5,
          category: topic.trim(),
        },
      })
      created++
    } catch {
      skipped++
    }
  }

  return NextResponse.json({ pillar, clusters, created, skipped })
}
