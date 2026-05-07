export function buildProductCardHtml(aff: {
  keyword: string
  url: string
  label: string | null
  image_url: string | null
  price: string | null
  badge: string | null
}): string {
  const badge = aff.badge
    ? `<span class="absolute top-2 right-2 bg-[#f97316] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">${aff.badge}</span>`
    : ''
  const img = aff.image_url
    ? `<img src="${aff.image_url}" alt="${aff.label ?? aff.keyword}" class="w-20 h-20 object-contain shrink-0 rounded-lg border border-gray-100" />`
    : `<div class="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 text-2xl">🛍️</div>`

  return `<div class="relative my-6 flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
  ${badge}
  ${img}
  <div class="flex-1 min-w-0">
    <p class="font-semibold text-gray-900 text-sm leading-snug">${aff.label ?? aff.keyword}</p>
    ${aff.price ? `<p class="text-[#1a1564] font-bold text-base mt-0.5">${aff.price}</p>` : ''}
    <p class="text-xs text-gray-500 mt-0.5 truncate">${aff.url.replace(/^https?:\/\//, '').split('/')[0]}</p>
  </div>
  <a href="${aff.url}" target="_blank" rel="nofollow sponsored noopener"
    class="shrink-0 bg-[#1a1564] hover:bg-[#2520a8] text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap">
    Lihat →
  </a>
</div>`
}
