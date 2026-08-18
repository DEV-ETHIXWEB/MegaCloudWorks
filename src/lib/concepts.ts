export type ConceptIconName =
  | 'CalendarClock'
  | 'MapPin'
  | 'FileText'
  | 'Camera'
  | 'Users'
  | 'WifiOff'
  | 'Stamp'
  | 'Bell'
  | 'Gift'
  | 'ScanLine'
  | 'CalendarCheck2'
  | 'Clock'
  | 'Repeat'
  | 'Smartphone'
  | 'ClipboardList'
  | 'Activity'
  | 'FolderClock'
  | 'PenLine'
  | 'Kanban'
  | 'Filter'
  | 'UserPlus'
  | 'Mail'
  /* --- tab-bar glyphs --- */
  | 'Radio'
  | 'Route'
  | 'Images'
  | 'CalendarDays'
  | 'Wallet'
  | 'QrCode'
  | 'Sparkles'
  | 'Compass'
  | 'Clock4'
  | 'BadgeCheck'
  | 'CalendarHeart'
  | 'Store'
  | 'HeartPulse'
  | 'Stethoscope'
  | 'LayoutGrid'
  | 'Layers'
  | 'BellRing'
  | 'TrendingUp'
  | 'Contact'
  | 'Plus'
  | 'Search'

export type ConceptFeature = {
  icon: ConceptIconName
  title: string
  body: string
}

/**
 * How this app moves between screens.
 *
 * Five products built by one studio will share a component kit - that is the
 * point of a kit - but they must not share a *feel*. A dispatch console snaps;
 * a wallet of cards lifts and drops; a calendar slides sideways along the week
 * it is already showing; a chart-first clinical app dissolves because nothing
 * in it should ever feel thrown; a pipeline board racks across like a shelf.
 *
 * The value is published to the device as `data-motion`, and every signature
 * has its own keyframes in styles-concept.css.
 */
export type ConceptMotion = 'console' | 'deck' | 'calendar' | 'chart' | 'board'

/**
 * What the app's surfaces are made of.
 *
 * Colour alone is not an identity: recoloured, all five would still be the same
 * app. The skin drives the things underneath colour - corner radius, whether a
 * card is a filled tile or a hairline outline, how hard its shadow is, and how
 * the tab bar is cut. See `skinVars` in lib/iosKit.tsx.
 */
export type ConceptSkin =
  | 'industrial'
  | 'paper'
  | 'glass'
  | 'clinical'
  | 'neon'

/**
 * The figure drawn behind the case study's hero and band.
 *
 * Each concept gets its own generated backdrop rather than the one stock
 * photograph, so the five pages do not open on the same picture five times.
 */
export type ConceptMotif = 'grid' | 'strata' | 'week' | 'pulse' | 'rays'

/**
 * How the case study sets its own big type.
 *
 * The site has exactly one family - Geologica, self-hosted, variable across
 * 100–900 - and importing a second one per concept would cost a network
 * round-trip to say something a weight axis already says. So the five pages
 * differ by *treatment* instead: mass is the studio's extrabold grotesque,
 * editorial runs the same face thin and wide at a larger size, and kinetic
 * sits between them with the tracking opened up.
 */
export type ConceptHeadline = 'mass' | 'editorial' | 'kinetic'

export type ConceptPalette = {
  name: string
  swatch: string
  hex: string
  note: string
}

/**
 * One item in the concept's glass tab bar.
 *
 * The bar is not decoration: index `i` here is screen `i` in CONCEPT_SCREENS,
 * so tapping a tab inside the device actually moves the case study along.
 */
export type ConceptTab = {
  icon: ConceptIconName
  label: string
}

/**
 * What the concept's Dynamic Island is playing.
 *
 * Invented tracks, named for the world each product lives in - the island on
 * the case-study page is a live activity you can open, and it should be that
 * concept's music, not a shared placeholder.
 */
export type ConceptTrack = {
  title: string
  artist: string
  album: string
  /** running time in seconds, used by the player's progress bar */
  length: number
}

export type Concept = {
  slug: string
  name: string
  tagline: string
  category: string
  year: string
  platform: string
  timeline: string
  blurb: string
  problemTitle: string
  problemBody: string[]
  screens: string[]
  screensSubtitle: string
  featuresSubtitle: string
  features: ConceptFeature[]
  palette: ConceptPalette[]
  accent: string
  accentInk: string
  typeface: string
  heroFrom: string
  heroTo: string
  track: ConceptTrack

  /* ---------------- the app's own design system ---------------- */

  /** secondary accent - the far stop of every gradient inside the app */
  accent2: string
  /** whether the app itself is a dark product or a light one */
  surface: 'dark' | 'light'
  /** the app canvas, top to bottom */
  appBg: [string, string]
  /** primary text colour on that canvas */
  appInk: string
  /** muted text colour on that canvas */
  appInkSoft: string
  /** the tint the glass tab bar is frosted with */
  glass: string
  /**
   * The deep, saturated version of the accent.
   *
   * On a snow-light page the accent itself is a graphic colour, not a text
   * one - #2F6FD0 on white is fine for a 40px headline and thin at 13px. So
   * every accent carries a darkened twin that body copy, eyebrows and rules
   * are set in, and that the ticker paints its type with.
   *
   * Hand-picked rather than derived: a computed darkening lands on a muddy
   * colour more often than not.
   */
  band: string
  /**
   * The palest tint of the accent - one or two per cent of it in snow.
   *
   * The old pages carried their colour by painting whole sections in it. This
   * one carries it the way weather does: the page stays white, and the accent
   * arrives as a wash you notice only when it stops. Used for the soft
   * stretches, card fills and the hero's far haze.
   */
  wash: string
  /** the name of this concept's interaction pattern */
  flow: string
  /** one line on why that pattern, shown beside the device */
  flowNote: string
  /** four tabs, one per screen, in screen order */
  tabs: ConceptTab[]

  /* ---------------- what makes it feel like its own app ---------------- */

  /** how screens replace each other inside the glass */
  motion: ConceptMotion
  /** one line on why that motion, shown beside the device */
  motionNote: string
  /** what the app's cards, radii and hairlines are made of */
  skin: ConceptSkin
  /** the figure drawn behind this case study's hero */
  motif: ConceptMotif
  /** how this case study sets its own big type */
  headline: ConceptHeadline
}

export const CONCEPTS: Concept[] = [
  {
    slug: 'fieldly',
    name: 'Fieldly',
    tagline: 'Every van, every job, one screen.',
    category: 'Field Service',
    year: '2025',
    platform: 'iOS & Android',
    timeline: '4 weeks',
    blurb:
      'A daylight dispatch console for plumbing, HVAC and electrical crews - the day’s board, the quote, and the photo proof in a single thumb-reachable app.',
    problemTitle: 'A working day should not be spread across six apps.',
    problemBody: [
      'Ask a three-van HVAC outfit how a job gets from a phone call to a paid invoice and you will be handed a tour: a shared spreadsheet, a group chat, a quote template in someone’s email drafts, and a camera roll nobody has ever backed up.',
      'Nothing in that chain is wrong on its own. Together they lose things - the callout that never got assigned, the quote that was verbally agreed, the before-photo that would have ended a dispute in one message.',
      'Fieldly collapses the chain into one board. Open the app in a van at 7am and the whole day is already there, in an interface built to survive winter glare on a cracked screen protector, read with one hand.',
    ],
    screens: ['Dispatch', 'Job Card', 'Proof', 'The Week'],
    screensSubtitle: 'Four screens, and the day runs itself.',
    featuresSubtitle: 'Built for the van, not the office chair.',
    features: [
      {
        icon: 'Radio',
        title: 'Live dispatch board',
        body: 'Every job, every crew, colour-coded by state - assigned, rolling, on site, done.',
      },
      {
        icon: 'Route',
        title: 'Drive order that makes sense',
        body: 'The board sorts itself by route, so nobody crosses town twice before lunch.',
      },
      {
        icon: 'FileText',
        title: 'Quote to invoice in one tap',
        body: 'Price it on the driveway, take the signature, convert it before pulling away.',
      },
      {
        icon: 'Camera',
        title: 'Proof that ends arguments',
        body: 'Before and after shots, timestamped and welded to the job record forever.',
      },
      {
        icon: 'Users',
        title: 'Who is free, right now',
        body: 'Skills, certifications and availability on one roster the dispatcher trusts.',
      },
      {
        icon: 'WifiOff',
        title: 'Basements and dead zones',
        body: 'Everything is writable offline and reconciles itself the moment signal returns.',
      },
    ],
    palette: [
      {
        name: 'Ember',
        swatch: '#E0511C',
        hex: '#E0511C',
        note: 'Primary action, live state, wordmark',
      },
      {
        name: 'Beacon',
        swatch: '#F2A93B',
        hex: '#F2A93B',
        note: 'The vest colour - second stop, and only ever a signal',
      },
      {
        name: 'Snowfield',
        swatch: '#EDF1F6',
        hex: '#EDF1F6',
        note: 'App canvas - daylight, because the windscreen is',
      },
      {
        name: 'Gravel',
        swatch: '#6B7480',
        hex: '#6B7480',
        note: 'Secondary text & inactive tabs',
      },
    ],
    accent: '#E0511C',
    accentInk: '#14181F',
    typeface: 'Barlow',
    heroFrom: '#FFFFFF',
    heroTo: '#E8EEF5',
    track: {
      title: 'Ember Hours',
      artist: 'Night Shift Radio',
      album: 'Callout',
      length: 214,
    },
    accent2: '#F2A93B',
    surface: 'light',
    appBg: ['#FFFFFF', '#EDF1F6'],
    appInk: '#14181F',
    appInkSoft: '#6B7480',
    glass: 'rgba(255,255,255,0.72)',
    band: '#9C3208',
    wash: '#FBEEE7',
    flow: 'Ops console',
    flowNote:
      'A bright board that survives glare on a windscreen at eight in the morning. The tab bar floats clear of the list so a thumb never covers the job it is reaching for.',
    tabs: [
      { icon: 'Radio', label: 'Board' },
      { icon: 'FileText', label: 'Job' },
      { icon: 'Images', label: 'Proof' },
      { icon: 'CalendarDays', label: 'Week' },
    ],
    motion: 'console',
    motionNote:
      'Screens cut in hard and square, one frame of overshoot and done. Nothing eases gently on a machine you are meant to operate at speed with one hand.',
    skin: 'industrial',
    motif: 'grid',
    headline: 'mass',
  },
  {
    slug: 'stamp',
    name: 'Stamp',
    tagline: 'The card that never falls out of a wallet.',
    category: 'Loyalty',
    year: '2025',
    platform: 'iOS & Android',
    timeline: '3 weeks',
    blurb:
      'A warm, paper-feeling loyalty wallet for corner shops and independent cafés - stamps, points and a push that actually gets someone through the door.',
    problemTitle: 'The chain has an app. The corner shop has a bit of card.',
    problemBody: [
      'A café two streets over has been serving the same forty people every weekday for six years and has no way to reach a single one of them. Their loyalty programme is a rubber stamp and a piece of card that lives crumpled under a bus ticket.',
      'The card is not a bad idea. It is a good idea with no memory: it cannot tell the owner who stopped coming in March, and it cannot tell a regular that today is double stamps.',
      'Stamp keeps everything the card got right - the satisfying fill, the sense of being owed something - and gives it the one thing paper never had. A shop is set up in the time it takes to make a flat white.',
    ],
    screens: ['Wallet', 'Stamp Card', 'Rewards', 'Nearby'],
    screensSubtitle: 'Four screens between a regular and a free coffee.',
    featuresSubtitle: 'Everything paper did, plus a memory.',
    features: [
      {
        icon: 'Wallet',
        title: 'A wallet of real cards',
        body: 'Every shop is a card you can shuffle through, not a row in a list.',
      },
      {
        icon: 'Stamp',
        title: 'The fill still feels good',
        body: 'Ten holes, one tap, and a card that visibly turns into a reward.',
      },
      {
        icon: 'BellRing',
        title: 'A push worth allowing',
        body: 'Double stamps, ending at four, from the café you already walk past.',
      },
      {
        icon: 'QrCode',
        title: 'One scan at the till',
        body: 'No terminal, no dongle, no extra thirty seconds in the queue.',
      },
      {
        icon: 'Compass',
        title: 'Shops on the way home',
        body: 'Nearby surfaces participating places along the route already being walked.',
      },
      {
        icon: 'Users',
        title: 'Who your regulars are',
        body: 'The owner finally learns which forty people keep the lights on.',
      },
    ],
    palette: [
      {
        name: 'Rowan',
        swatch: '#C4682A',
        hex: '#C4682A',
        note: 'Primary action & the ink the stamp is cut in',
      },
      {
        name: 'Butter',
        swatch: '#F0B860',
        hex: '#F0B860',
        note: 'Filled holes, reward states & card gradients',
      },
      {
        name: 'Oat',
        swatch: '#FBF5EA',
        hex: '#FBF5EA',
        note: 'App canvas - stock, never white',
      },
      {
        name: 'Espresso',
        swatch: '#2A1A12',
        hex: '#2A1A12',
        note: 'Text & the deep face of a filled card',
      },
    ],
    accent: '#C4682A',
    accentInk: '#2A1A12',
    typeface: 'Fraunces',
    heroFrom: '#FFFDF8',
    heroTo: '#F1E5D2',
    track: {
      title: 'Tenth One Free',
      artist: 'Corner Store',
      album: 'Regulars',
      length: 187,
    },
    accent2: '#F0B860',
    surface: 'light',
    appBg: ['#FFFDF8', '#F3E9D9'],
    appInk: '#2A1A12',
    appInkSoft: '#8A7462',
    glass: 'rgba(255,253,248,0.74)',
    band: '#8A4212',
    wash: '#F8EEE0',
    flow: 'Wallet-first',
    flowNote:
      'Cards stack like a real wallet and lift when picked. The tab bar is warm frosted stock so the deck reads through it instead of stopping at a bar.',
    tabs: [
      { icon: 'Wallet', label: 'Wallet' },
      { icon: 'Stamp', label: 'Card' },
      { icon: 'Gift', label: 'Rewards' },
      { icon: 'Compass', label: 'Nearby' },
    ],
    motion: 'deck',
    motionNote:
      'A screen is a card off the top of the deck: it lifts, rotates a degree and drops into place. The one it replaced sinks rather than slides, because a wallet has depth and no sideways.',
    skin: 'paper',
    motif: 'strata',
    headline: 'editorial',
  },
  {
    slug: 'slate',
    name: 'Slate',
    tagline: 'Pick a time. That is the entire app.',
    category: 'Booking',
    year: '2025',
    platform: 'iOS & Android',
    timeline: '4 weeks',
    blurb:
      'Glacier-clean self-serve booking for one-chair salons, single-room clinics and home-service pros - a week strip, an open slot, and a reminder that lands.',
    problemTitle: 'One chair, one diary, and a phone that rings mid-cut.',
    problemBody: [
      'An independent stylist takes bookings the only way available: the phone, while holding scissors. The diary is a paper book taped to the counter, and the cost of a Tuesday no-show is the whole afternoon.',
      'The platforms that solve this were designed for chains - service catalogues, staff permissions, deposit rules, a setup wizard nobody with one chair will ever finish. Most independents try one, stall on configuration, and go back to the book.',
      'Slate does the two things that matter and refuses the rest: let someone book an open slot without speaking to anyone, then make sure they turn up. Live in an afternoon, no training, no manual.',
    ],
    screens: ['Pick a Time', 'Confirmed', 'My Visits', 'Front Desk'],
    screensSubtitle: 'Four screens that fill a week.',
    featuresSubtitle: 'Two jobs, done properly.',
    features: [
      {
        icon: 'CalendarCheck2',
        title: 'Book without a phone call',
        body: 'A week strip, the free slots, done - no account, no back and forth.',
      },
      {
        icon: 'Clock4',
        title: 'Reminders that stop no-shows',
        body: 'Timed to when someone can still act on it, not the night before.',
      },
      {
        icon: 'Repeat',
        title: 'Move it themselves',
        body: 'Reschedule and cancel without anyone picking up mid-service.',
      },
      {
        icon: 'ClipboardList',
        title: 'The front desk view',
        body: 'One column, today, every gap visible at a glance from the counter.',
      },
      {
        icon: 'BadgeCheck',
        title: 'Straight into their calendar',
        body: 'One tap and it is in the phone they actually look at.',
      },
      {
        icon: 'Users',
        title: 'What they had last time',
        body: 'Previous visits and preferences sitting on the booking, unasked.',
      },
    ],
    palette: [
      {
        name: 'Glacier',
        swatch: '#2F6FD0',
        hex: '#2F6FD0',
        note: 'Primary action & the slot you picked',
      },
      {
        name: 'Mist',
        swatch: '#A9D2F5',
        hex: '#A9D2F5',
        note: 'Free slots & soft fills',
      },
      {
        name: 'Porcelain',
        swatch: '#F3F7FC',
        hex: '#F3F7FC',
        note: 'App canvas - cool and quiet',
      },
      {
        name: 'Slate Ink',
        swatch: '#0F1A2B',
        hex: '#0F1A2B',
        note: 'Text, headings & the confirm sheet',
      },
    ],
    accent: '#2F6FD0',
    accentInk: '#0F1A2B',
    typeface: 'Manrope',
    heroFrom: '#FFFFFF',
    heroTo: '#E4EDF9',
    track: {
      title: 'Open Slot',
      artist: 'Waiting Room',
      album: 'Ten Minutes Early',
      length: 231,
    },
    accent2: '#A9D2F5',
    surface: 'light',
    appBg: ['#FFFFFF', '#E8EFF9'],
    appInk: '#0F1A2B',
    appInkSoft: '#66748A',
    glass: 'rgba(255,255,255,0.72)',
    band: '#17458F',
    wash: '#E9F1FB',
    flow: 'Calendar-first',
    flowNote:
      'The week never leaves the screen. Confirmation arrives as a sheet over the calendar rather than a new page, so the choice just made stays visible behind it.',
    tabs: [
      { icon: 'CalendarDays', label: 'Book' },
      { icon: 'BadgeCheck', label: 'Confirm' },
      { icon: 'CalendarHeart', label: 'Visits' },
      { icon: 'Store', label: 'Desk' },
    ],
    motion: 'calendar',
    motionNote:
      'Everything travels along the axis the week runs on - horizontally, at the speed of a thumb pushing days. Nothing in a booking app should ever appear to come toward you.',
    skin: 'glass',
    motif: 'week',
    headline: 'kinetic',
  },
  {
    slug: 'prophy',
    name: 'Prophy',
    tagline: 'The chair’s software, not the back office’s.',
    category: 'Practice Mgmt',
    year: '2025',
    platform: 'iOS & Android',
    timeline: '5 weeks',
    blurb:
      'Recall, charting and the chair day for small dental practices - the four things a hygienist touches hourly, and nothing they never will.',
    problemTitle: 'The recall list is a spreadsheet nobody has opened since May.',
    problemBody: [
      'A two-surgery practice gets offered enterprise software with claims modules, marketing automation and a per-seat licence, or it gets a shared drive full of spreadsheets. Most take the spreadsheets and quietly accept that recall is now a memory exercise.',
      'The cost is invisible until it is counted: patients who drift off the six-month cycle and never come back, chairs sitting empty on a Wednesday, and a front desk exporting CSVs to answer a question that should take one tap.',
      'Prophy is deliberately small. The chart, the recall, the next slot, the plan - designed at chairside with gloves on, where a two-second interaction is the entire budget.',
    ],
    screens: ['Recall', 'Chart', 'Chair Day', 'Plan'],
    screensSubtitle: 'Four screens a hygienist touches hourly.',
    featuresSubtitle: 'Small on purpose.',
    features: [
      {
        icon: 'HeartPulse',
        title: 'Recall that chases itself',
        body: 'Who is overdue, this month, ranked - no export, no filtering, no CSV.',
      },
      {
        icon: 'Stethoscope',
        title: 'Charting with gloves on',
        body: 'A tooth map sized for a gloved fingertip and a two-second interaction.',
      },
      {
        icon: 'CalendarClock',
        title: 'A day built from chairs',
        body: 'Columns are surgeries and providers, not a generic calendar grid.',
      },
      {
        icon: 'Activity',
        title: 'Plans that show their state',
        body: 'Proposed, accepted, completed - visible on the patient, not in a report.',
      },
      {
        icon: 'BellRing',
        title: 'Reminders before the gap',
        body: 'Patients hear from the practice while the slot can still be filled.',
      },
      {
        icon: 'Contact',
        title: 'One record per person',
        body: 'History, notes and treatment on one card instead of three systems.',
      },
    ],
    palette: [
      {
        name: 'Pine',
        swatch: '#17897A',
        hex: '#17897A',
        note: 'Primary action & healthy state',
      },
      {
        name: 'Spearmint',
        swatch: '#9AE0CD',
        hex: '#9AE0CD',
        note: 'Charts, fills & completed work',
      },
      {
        name: 'Bone',
        swatch: '#F3F9F7',
        hex: '#F3F9F7',
        note: 'App canvas - clean, not cold',
      },
      {
        name: 'Overdue',
        swatch: '#F0463C',
        hex: '#F0463C',
        note: 'The one alarm colour, used exactly once',
      },
    ],
    accent: '#17897A',
    accentInk: '#0B221E',
    typeface: 'Source Sans 3',
    heroFrom: '#FFFFFF',
    heroTo: '#E3EFEC',
    track: {
      title: 'Six Months',
      artist: 'Second Molar',
      album: 'Chairside',
      length: 168,
    },
    accent2: '#9AE0CD',
    surface: 'light',
    appBg: ['#FFFFFF', '#E6F1EE'],
    appInk: '#0B221E',
    appInkSoft: '#64837C',
    glass: 'rgba(255,255,255,0.72)',
    band: '#0B5A4E',
    wash: '#E7F3EF',
    flow: 'Chart-first',
    flowNote:
      'Everything is a card with one job. Red appears exactly once in the whole app - on overdue - so it never has to compete for attention with itself.',
    tabs: [
      { icon: 'HeartPulse', label: 'Recall' },
      { icon: 'Stethoscope', label: 'Chart' },
      { icon: 'CalendarClock', label: 'Day' },
      { icon: 'Activity', label: 'Plan' },
    ],
    motion: 'chart',
    motionNote:
      'Screens dissolve and settle a hair, never travel. Chairside the device is held at arm’s length in someone else’s mouth-light; movement across the glass reads as a slip of the hand.',
    skin: 'clinical',
    motif: 'pulse',
    headline: 'editorial',
  },
  {
    slug: 'leadr',
    name: 'Leadr',
    tagline: 'Nothing goes cold on your watch.',
    category: 'CRM',
    year: '2025',
    platform: 'iOS & Android',
    timeline: '4 weeks',
    blurb:
      'A first-light pipeline for five-person sales teams - capture, stage, nudge, close, and not one field a nobody will ever fill in.',
    problemTitle: 'Deals are not lost to competitors. They are lost to Thursday.',
    problemBody: [
      'A small team rarely loses on price. It loses in the eight days between a good call and the follow-up nobody sent, because the lead was sitting in an inbox behind forty other things.',
      'Full CRM platforms answer this with configuration - custom objects, workflow builders, required fields - and a five-person team will not finish setting that up, so the pipeline slowly becomes a fiction that gets updated the night before a board meeting.',
      'Leadr has four screens and one obsession: never let a warm lead go quiet. Set up in an afternoon by the person who has to live in it, not a dedicated ops hire.',
    ],
    screens: ['Pipeline', 'Deal', 'Nudges', 'The Week'],
    screensSubtitle: 'Four screens that keep the pipeline honest.',
    featuresSubtitle: 'One obsession, four screens.',
    features: [
      {
        icon: 'UserPlus',
        title: 'Capture in ten seconds',
        body: 'From a call, a card or a form - before the memory of it goes.',
      },
      {
        icon: 'Kanban',
        title: 'A board you can read cold',
        body: 'Stages as columns, deals as cards, value on the face of each one.',
      },
      {
        icon: 'BellRing',
        title: 'Nudges that actually fire',
        body: 'Escalating, unignorable, and aimed at whoever owns the deal.',
      },
      {
        icon: 'Filter',
        title: 'Sort by gone quiet',
        body: 'The only filter that matters: what has not been touched in a week.',
      },
      {
        icon: 'Mail',
        title: 'The thread on the deal',
        body: 'Every call, email and note attached without anyone logging anything.',
      },
      {
        icon: 'TrendingUp',
        title: 'The week, in one card',
        body: 'What came in, what moved, what closed - no report to run.',
      },
    ],
    palette: [
      {
        name: 'Dusk',
        swatch: '#5B57C4',
        hex: '#5B57C4',
        note: 'Primary action & active stage',
      },
      {
        name: 'Blush',
        swatch: '#E5749C',
        hex: '#E5749C',
        note: 'Second gradient stop - and only ever *won*',
      },
      {
        name: 'First Light',
        swatch: '#F1F1FA',
        hex: '#F1F1FA',
        note: 'App canvas - light by default',
      },
      {
        name: 'Haze',
        swatch: '#6F6C88',
        hex: '#6F6C88',
        note: 'Secondary text & inactive tabs',
      },
    ],
    accent: '#5B57C4',
    accentInk: '#14132A',
    typeface: 'Work Sans',
    heroFrom: '#FFFFFF',
    heroTo: '#E9E9F7',
    track: {
      title: 'Gone Quiet',
      artist: 'Warm Lead',
      album: 'Pipeline',
      length: 202,
    },
    accent2: '#E5749C',
    surface: 'light',
    appBg: ['#FFFFFF', '#ECECF8'],
    appInk: '#14132A',
    appInkSoft: '#6F6C88',
    glass: 'rgba(255,255,255,0.72)',
    band: '#383497',
    wash: '#EEEEF9',
    flow: 'Pipeline board',
    flowNote:
      'The board scrolls sideways under a fixed header, so the stage being read never scrolls away from the deals inside it. Dusk carries the state; blush is reserved for won.',
    tabs: [
      { icon: 'LayoutGrid', label: 'Pipeline' },
      { icon: 'Contact', label: 'Deal' },
      { icon: 'BellRing', label: 'Nudges' },
      { icon: 'TrendingUp', label: 'Week' },
    ],
    motion: 'board',
    motionNote:
      'Screens rack across like a shelf being pushed - the whole board moves as one piece, with a little weight behind it and none of the bounce that would make a pipeline feel playful.',
    skin: 'neon',
    motif: 'rays',
    headline: 'mass',
  },
]

export function getConcept(slug: string): Concept | undefined {
  return CONCEPTS.find((c) => c.slug === slug)
}
