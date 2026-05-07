import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export type ImageSource = 'dalle' | 'unsplash' | 'none'

export interface ArticleImage {
  url: string
  alt: string
  source: ImageSource
}

function buildDallePrompt(title: string, keyword: string): string {
  return `Professional wide-format banner photograph for an Indonesian business blog article.
Topic: "${title}" — keyword: "${keyword}".
Style: Clean, modern, professional. Warm and inviting colors. Relevant to Indonesian SME/startup/digital business context.
Show: People working on laptops or phones, modern office or co-working space, relevant business objects — naturally composed.
No text overlays. No watermarks. No logos. No UI mockups. Cinematic lighting. 16:9 landscape format.`
}

async function downloadAndSave(url: string, slug: string): Promise<string> {
  const uploadDir = join(process.cwd(), 'public', 'uploads', 'articles')
  await mkdir(uploadDir, { recursive: true })

  const res = await fetch(url, { signal: AbortSignal.timeout(30_000) })
  if (!res.ok) throw new Error(`Download failed: ${res.status}`)

  const buffer = Buffer.from(await res.arrayBuffer())
  const filename = `${slug}-${Date.now()}.jpg`
  await writeFile(join(uploadDir, filename), buffer)
  return `/uploads/articles/${filename}`
}

async function generateDalleImage(title: string, keyword: string, slug: string): Promise<ArticleImage> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('OPENAI_API_KEY not set')

  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt: buildDallePrompt(title, keyword),
      n: 1,
      size: '1792x1024',
      quality: 'standard',
      response_format: 'url',
    }),
    signal: AbortSignal.timeout(90_000),
  })

  if (!res.ok) throw new Error(`DALL-E error ${res.status}: ${await res.text()}`)
  const data = await res.json()
  const imageUrl: string = data.data?.[0]?.url
  if (!imageUrl) throw new Error('No image URL returned from DALL-E')

  const localPath = await downloadAndSave(imageUrl, slug)

  return {
    url: localPath,
    alt: `Ilustrasi artikel: ${title}`,
    source: 'dalle',
  }
}

async function fetchUnsplashImage(keyword: string, title: string): Promise<ArticleImage> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY
  if (!accessKey) throw new Error('UNSPLASH_ACCESS_KEY not set')

  // Try keyword first, fallback to generic business query
  const queries = [keyword, `${keyword} business`, 'indonesia business digital']

  for (const query of queries) {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape&content_filter=high`,
      {
        headers: { Authorization: `Client-ID ${accessKey}` },
        signal: AbortSignal.timeout(15_000),
      }
    )

    if (!res.ok) continue

    const data = await res.json()
    const photo = data.results?.[0]
    if (!photo) continue

    // Trigger Unsplash download event (required by API terms)
    fetch(`${photo.links.download_location}?client_id=${accessKey}`).catch(() => {})

    return {
      url: `${photo.urls.regular}&utm_source=ndskreasi&utm_medium=referral`,
      alt: photo.alt_description ?? `Foto ilustrasi: ${keyword}`,
      source: 'unsplash',
    }
  }

  throw new Error('No Unsplash photo found')
}

export async function generateArticleImage(
  title: string,
  keyword: string,
  slug: string
): Promise<ArticleImage> {
  // Try DALL-E 3 first
  if (process.env.OPENAI_API_KEY) {
    try {
      const result = await generateDalleImage(title, keyword, slug)
      console.log(`[ImageGen] DALL-E success: ${result.url}`)
      return result
    } catch (err) {
      console.error('[ImageGen] DALL-E failed, trying Unsplash:', err instanceof Error ? err.message : err)
    }
  }

  // Fallback to Unsplash
  if (process.env.UNSPLASH_ACCESS_KEY) {
    try {
      const result = await fetchUnsplashImage(keyword, title)
      console.log(`[ImageGen] Unsplash success: ${result.url}`)
      return result
    } catch (err) {
      console.error('[ImageGen] Unsplash failed:', err instanceof Error ? err.message : err)
    }
  }

  return { url: '', alt: '', source: 'none' }
}
