export const ABOUT_HERO = {
  eyebrow: 'About us',
  // three bare words read thin as a page headline — this keeps the same
  // design/build/ship spine but says the thing that actually separates the
  // studio (they don't hand off at launch), which the process content and
  // the "team that stays on the line" promise both already back up
  headlineLines: ['We design it, build it,', 'and stay after it ships.'],
  sub: 'Two studios, one team. We partner with businesses end to end — research and UI through engineering, launch, and everything after.',
}

export const STUDIOS = {
  eyebrow: 'Two studios. One team.',
  body: 'Ethixweb builds the web presence — marketing sites, e-commerce, and platforms. MegaCloudWorks is aimed squarely at apps: native and cross-platform products designed and engineered end to end. Same team, same standards, two focused studios.',
}

export const ABOUT_STEPS = [
  {
    n: '01',
    title: 'Understand',
    body: "We start with your problem, not a template: who this is for, what it has to do, and what counts as done.",
  },
  {
    n: '02',
    title: 'Design',
    body: 'We shape the flows before the pixels, then draw an interface that makes the next step obvious.',
  },
  {
    n: '03',
    title: 'Build',
    body: 'We develop it properly — tested, reviewed, and built to hold up as the product and its traffic grow.',
  },
  {
    n: '04',
    title: 'Ship & Evolve',
    body: 'We launch, watch how it is actually used, and keep improving it release after release.',
  },
] as const

export const COVERAGE = {
  eyebrow: 'Our coverage',
  titleLines: ['Built for', 'American teams.'],
  body: "We ship on your calendar, not ours. And everywhere else, we're still one call away.",
}
