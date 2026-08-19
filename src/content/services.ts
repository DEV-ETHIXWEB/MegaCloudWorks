export const SERVICES_HERO = {
  eyebrow: 'About our approach to work',
  headlineLines: ['Design and engineering,', 'under one roof.'],
  sub: 'Three tightly connected services. Take one, or hand us the whole journey, from first sketch to shipped product.',
}

export const COLUMNS = [
  { kicker: 'Services', title: 'Design & UX', body: 'Research, flows and high-fidelity interfaces, the whole product design journey, not just pretty screens.' },
  { kicker: 'Technology', title: 'Modern stacks', body: 'Well-supported, maintainable engineering that keeps working long after launch day.' },
  { kicker: 'Difference', title: 'One team', body: 'Designers and engineers in the same room, so nothing gets lost in a handoff between vendors.' },
  { kicker: 'The promise', title: 'Shipped, not stalled', body: 'We move in tight increments you can review, and get real product in front of real users fast.' },
] as const

export const CIRCLES = [
  { n: '01', title: 'App Design', hash: '#app-design' },
  { n: '02', title: 'Development', hash: '#app-development' },
  { n: '03', title: 'Brand & UI', hash: '#brand-ui' },
] as const

export const SERVICE_DETAILS = [
  {
    id: 'app-design',
    n: '01',
    title: 'App Design',
    tagline: 'Product design & UX',
    img: '/card-design-400.webp',
    body: 'We turn a rough idea into a clear, usable product. Research and flows first, then interfaces people actually enjoy, designed in high fidelity and handed off ready to build.',
    includes: [
      'Discovery, user flows & information architecture',
      'Wireframes and interactive prototypes',
      'High-fidelity UI for every core screen',
      'Design system & component library',
      'Developer-ready handoff and specs',
    ],
  },
  {
    id: 'app-development',
    n: '02',
    title: 'App Development',
    tagline: 'Web & mobile engineering',
    img: '/card-development-400.webp',
    body: 'Clean, performant, maintainable code, shipped on a schedule you can plan around. We build with modern, well-supported stacks so what we ship keeps working after launch.',
    includes: [
      'Web apps, PWAs & cross-platform mobile',
      'API design and backend integration',
      'Performance, accessibility & SEO baked in',
      'CI/CD, testing and release pipelines',
      'Post-launch support and iteration',
    ],
  },
  {
    id: 'brand-ui',
    n: '03',
    title: 'Brand & UI',
    tagline: 'Identity & visual systems',
    img: '/card-brand-400.webp',
    body: 'A visual language that feels cohesive everywhere, from the logo to the smallest button. We build systems, not one-off screens, so your product looks intentional as it grows.',
    includes: [
      'Logo, colour and typography systems',
      'Brand guidelines & usage rules',
      'Reusable UI kit and design tokens',
      'Marketing site and social templates',
      'Illustration and iconography direction',
    ],
  },
] as const

export const FACTS = [
  { label: 'Reply time', value: 'One business day' },
  { label: 'Typical build', value: 'Nine weeks' },
  { label: 'Where we are', value: 'India, building for US teams' },
] as const
