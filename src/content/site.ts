export const BRAND = {
  name: 'MegaCloudWorks',
  tagline: 'App design & development studio',
  email: 'hello@megacloudworks.com',
}

export const NAV = [
  { label: 'What we do', to: '/services' },
  { label: 'Work', to: '/work' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
] as const

export const SOCIALS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
  { label: 'Instagram', href: 'https://www.instagram.com/' },
  { label: 'X', href: 'https://x.com/' },
] as const
