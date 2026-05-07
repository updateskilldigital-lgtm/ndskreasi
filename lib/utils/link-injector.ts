type AffiliateLink = {
  keyword: string; url: string; label: string | null
  type?: string; image_url?: string | null; price?: string | null; badge?: string | null
}
type InternalArticle = { slug: string; title: string; keyword: string | null }

export function injectAffiliateLinks(html: string, affiliates: AffiliateLink[]): {
  html: string
  hasAffiliate: boolean
} {
  if (!affiliates.length) return { html, hasAffiliate: false }

  let result = html
  let hasAffiliate = false

  for (const aff of affiliates) {
    const escapedKw = aff.keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

    if (aff.type === 'card') {
      // inject product card after the first paragraph that contains the keyword
      const cardHtml = buildProductCardHtmlInline(aff)
      const regex = new RegExp(
        `(<p[^>]*>[^<]*${escapedKw}[^<]*<\/p>)`,
        'i'
      )
      const replaced = result.replace(regex, (match) => {
        hasAffiliate = true
        return `${match}${cardHtml}`
      })
      if (replaced !== result) result = replaced
    } else {
      // inject inline text link on first occurrence in a paragraph
      const regex = new RegExp(
        `(<p[^>]*>(?:(?!<a)[\\s\\S])*?)(${escapedKw})((?:(?!<a)[\\s\\S])*?<\/p>)`,
        'i'
      )
      const replaced = result.replace(regex, (_, before, kw, after) => {
        hasAffiliate = true
        const title = aff.label ? ` title="${aff.label}"` : ''
        return `${before}<a href="${aff.url}" target="_blank" rel="nofollow sponsored noopener" class="text-[#1a1564] underline decoration-dotted underline-offset-2 hover:decoration-solid"${title}>${kw}</a>${after}`
      })
      if (replaced !== result) result = replaced
    }
  }

  return { html: result, hasAffiliate }
}

function buildProductCardHtmlInline(aff: AffiliateLink): string {
  const badge = aff.badge
    ? `<span class="absolute top-2 right-2 bg-[#f97316] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">${aff.badge}</span>`
    : ''
  const img = aff.image_url
    ? `<img src="${aff.image_url}" alt="${aff.label ?? aff.keyword}" class="w-20 h-20 object-contain shrink-0 rounded-lg border border-gray-100" />`
    : `<div class="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 text-2xl">🛍️</div>`

  return `<div class="relative my-4 flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
  ${badge}${img}
  <div class="flex-1 min-w-0">
    <p class="font-semibold text-gray-900 text-sm">${aff.label ?? aff.keyword}</p>
    ${aff.price ? `<p class="text-[#1a1564] font-bold text-base mt-0.5">${aff.price}</p>` : ''}
  </div>
  <a href="${aff.url}" target="_blank" rel="nofollow sponsored noopener" class="shrink-0 bg-[#1a1564] text-white text-xs font-semibold px-4 py-2.5 rounded-lg whitespace-nowrap">Lihat →</a>
</div>`
}

export function injectInternalLinks(
  html: string,
  currentSlug: string,
  articles: InternalArticle[]
): string {
  if (!articles.length) return html

  let result = html

  for (const article of articles) {
    if (article.slug === currentSlug) continue
    if (!article.keyword) continue

    const escapedKw = article.keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(
      `(<p[^>]*>(?:(?!<a)[\\s\\S])*?)(${escapedKw})((?:(?!<a)[\\s\\S])*?<\/p>)`,
      'i'
    )

    result = result.replace(regex, (_, before, kw, after) => {
      return `${before}<a href="/blog/${article.slug}" class="text-[#1a1564] underline decoration-dotted underline-offset-2 hover:decoration-solid" title="${article.title}">${kw}</a>${after}`
    })
  }

  return result
}

export function buildAffiliateDisclosure(): string {
  return `<div class="my-6 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 leading-relaxed">
  <strong>Disclosure:</strong> Artikel ini mengandung link afiliasi. Jika Anda melakukan pembelian melalui link tersebut, kami mendapat komisi tanpa biaya tambahan untuk Anda.
</div>`
}
