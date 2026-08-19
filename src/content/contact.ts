export const CONTACT_HERO = {
  word: 'CONTACT',
  h1: 'Get in touch',
  sub: 'Tell us what you’re building and where you’re headed. We read every message and reply personally.',
}

export const DETAILS: { label: string; value: string; href?: string }[] = [
  { label: 'Email us', value: 'hello@megacloudworks.com', href: 'mailto:hello@megacloudworks.com' },
  { label: 'Reply time', value: 'Within one business day' },
  { label: 'Where we are', value: 'India, building for US teams' },
]

export const NEXT = [
  { n: '01', title: 'You send it', body: 'Straight to the team building the work, not a shared inbox.' },
  { n: '02', title: 'We read it properly', body: 'A person reads it and works out who should answer.' },
  { n: '03', title: 'You hear back', body: 'A real reply within one business day. No autoresponder.' },
] as const
