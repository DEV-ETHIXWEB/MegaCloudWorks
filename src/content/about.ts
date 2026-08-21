export const ABOUT_HERO = {
  eyebrow: 'About us',
  // three bare words read thin as a page headline; this keeps the same
  // design/build/ship spine but says the thing that actually separates the
  // studio (they don't hand off at launch), which the process content and
  // the "team that stays on the line" promise both already back up
  headlineLines: ['We design it, build it,', 'and stay after it ships.'],
  sub: 'Two studios, one team. We partner with businesses end to end: research and UI through engineering, launch, and everything after.',
}

export const STUDIOS = {
  eyebrow: 'Two studios. One team.',
  body: 'Ethixweb handles the web side, marketing sites, e-commerce, the platforms a business runs on. MegaCloudWorks grew out of that same team turning its attention to apps, native and cross-platform, held to the same bar by the same people.',
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
    body: 'We develop it properly: tested, reviewed, and built to hold up as the product and its traffic grow.',
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

export const ORIGIN = {
  eyebrow: 'Where this started',
  quote: 'We spent years building the web side of other people’s products under Ethixweb. MegaCloudWorks exists because the app work kept showing up, and it deserved its own team instead of a side project.',
  attribution: 'The founding brief, more or less',
}

export const VALUES = [
  {
    n: '01',
    title: 'No handoffs',
    body: 'The people who scope the work are the people who build it. Nothing gets thrown over a wall to a team that never met the client.',
  },
  {
    n: '02',
    title: 'Real engineering',
    body: 'Typed, tested, and reviewed. We build things we would be comfortable maintaining ourselves in a year.',
  },
  {
    n: '03',
    title: 'One team, two studios',
    body: 'Web and apps run under the same standards and the same reviews, not two different vendors wearing one logo.',
  },
  {
    n: '04',
    title: 'Say no early',
    body: "If something is not going to work, we would rather tell you in week one than let you find out in week nine.",
  },
] as const
