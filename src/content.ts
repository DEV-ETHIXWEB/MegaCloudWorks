// Single source of truth for copy across all 6 design concepts.
// Pulled verbatim from the production MegaCloudWorks site so every concept
// is judged on design alone, not on different words.

export const BRAND = {
  name: 'MegaCloudWorks',
  tagline: 'App design & development studio',
  email: 'hello@megacloudworks.com',
}

export const NAV = [
  { label: 'What we do', href: '#services' },
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
] as const

export const HERO = {
  eyebrow: 'App design & development studio',
  headline: 'We design and build apps end to end.',
  sub: 'Research, UI, and engineering under one roof: nine weeks, start to store.',
  cta: 'Get in touch',
  ctaSecondary: 'View our work',
}

export const SERVICES = [
  {
    title: 'App Design',
    desc: 'Thoughtful UX and polished interfaces.',
  },
  {
    title: 'App Development',
    desc: 'Clean, and performant code, shipped on time.',
  },
  {
    title: 'Brand & UI',
    desc: 'Visual systems that feel cohesive.',
  },
] as const

export const STEPS = [
  {
    n: '01',
    title: 'Discover',
    meta: 'Week 1',
    blurb: 'We map the job the product has to do, and what it must never do.',
    points: [
      'Stakeholder interviews',
      'Scope written down',
      'Success measures agreed',
    ],
  },
  {
    n: '02',
    title: 'Design',
    meta: 'Weeks 2-3',
    blurb: 'Flows, then screens. Prototyped early so you can feel it working.',
    points: [
      'Flows and states',
      'Clickable prototype',
      'Design system started',
    ],
  },
  {
    n: '03',
    title: 'Build',
    meta: 'Weeks 4-8',
    blurb: 'Typed, tested, reviewed. Shipped to a staging build every week.',
    points: ['Weekly staging builds', 'Automated tests', 'Code review on everything'],
  },
  {
    n: '04',
    title: 'Launch',
    meta: 'Week 9',
    blurb: 'Store submission, analytics, and a team that stays on the line.',
    points: ['Store submission', 'Analytics live at launch', 'Post-launch support'],
  },
] as const

export const WORK = [
  { title: 'Northbound', category: 'Fintech · iOS & Android', img: '/card-design.webp' },
  { title: 'Ridgeline', category: 'Logistics · Web app', img: '/card-development.webp' },
  { title: 'Halo Health', category: 'Healthcare · Brand + App', img: '/card-brand.webp' },
] as const

export const STATS = [
  { value: '40+', label: 'Apps shipped' },
  { value: '9', label: 'Weeks, average' },
  { value: '98%', label: 'Client retention' },
] as const
