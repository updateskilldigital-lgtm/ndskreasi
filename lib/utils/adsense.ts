const CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? ''
const SLOT_TOP = process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP ?? ''
const SLOT_MID = process.env.NEXT_PUBLIC_ADSENSE_SLOT_MID ?? ''
const SLOT_BOT = process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOT ?? ''

function adSlot(slot: string): string {
  if (!CLIENT || !slot) return ''
  return `<div class="my-6">
<ins class="adsbygoogle" style="display:block" data-ad-client="${CLIENT}" data-ad-slot="${slot}" data-ad-format="auto" data-full-width-responsive="true"></ins>
<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
</div>`
}

export function injectAdSense(html: string): string {
  if (!CLIENT) return html

  let result = html
  let h2Count = 0

  // inject after 1st h2 (top ad) and after 3rd h2 (mid ad)
  result = result.replace(/<\/h2>/g, match => {
    h2Count++
    if (h2Count === 1 && SLOT_TOP) return `${match}${adSlot(SLOT_TOP)}`
    if (h2Count === 3 && SLOT_MID) return `${match}${adSlot(SLOT_MID)}`
    return match
  })

  // inject before last </div> closing (bottom ad)
  if (SLOT_BOT) {
    const lastP = result.lastIndexOf('</p>')
    if (lastP !== -1) {
      result = result.slice(0, lastP + 4) + adSlot(SLOT_BOT) + result.slice(lastP + 4)
    }
  }

  return result
}
