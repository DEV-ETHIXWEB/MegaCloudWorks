const SITE_URL = 'https://megacloudworks.com'
const SITE_NAME = 'MegaCloudWorks'
const DEFAULT_OG_IMAGE = `${SITE_URL}/logo512.png`

export function seo({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
}: {
  title: string
  description: string
  path: string
  image?: string
}) {
  const fullTitle = title.includes(SITE_NAME)
    ? title
    : `${title} · ${SITE_NAME}`
  const url = `${SITE_URL}${path}`

  return {
    meta: [
      { title: fullTitle },
      { name: 'description', content: description },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: SITE_NAME },
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: description },
      { property: 'og:url', content: url },
      { property: 'og:image', content: image },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
    ],
    links: [{ rel: 'canonical', href: url }],
  }
}
