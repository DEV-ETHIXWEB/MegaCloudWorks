import { useEffect } from 'react'

const SITE_URL = 'https://megacloudworks.com'
const SITE_NAME = 'MegaCloudWorks'
const DEFAULT_IMAGE = `${SITE_URL}/logo512.png`

function setMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setCanonical(href: string) {
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

export function PageMeta({
  title,
  description,
  path,
  image = DEFAULT_IMAGE,
}: {
  title: string
  description: string
  path: string
  image?: string
}) {
  useEffect(() => {
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} · ${SITE_NAME}`
    const url = `${SITE_URL}${path}`
    document.title = fullTitle

    setMeta('description', description)
    setMeta('og:type', 'website', 'property')
    setMeta('og:site_name', SITE_NAME, 'property')
    setMeta('og:title', fullTitle, 'property')
    setMeta('og:description', description, 'property')
    setMeta('og:url', url, 'property')
    setMeta('og:image', image, 'property')
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', fullTitle)
    setMeta('twitter:description', description)
    setMeta('twitter:image', image)
    setCanonical(url)

    // A route change normally resets to the top, but not when the URL
    // carries a hash. Scrolling to 0 unconditionally is what made deep
    // links like /about#how-we-work (linked from the Services page) land
    // the reader at the top of the page instead of the section they asked
    // for. The target may mount a frame later, so defer the lookup.
    const { hash } = window.location
    if (hash) {
      requestAnimationFrame(() => {
        const el = document.querySelector(hash)
        if (el) el.scrollIntoView({ block: 'start' })
        else window.scrollTo({ top: 0 })
      })
      return
    }
    window.scrollTo({ top: 0 })
  }, [title, description, path, image])

  return null
}
