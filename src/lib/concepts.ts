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

export type ConceptFeature = {
  icon: ConceptIconName
  title: string
  body: string
}

export type ConceptPalette = {
  name: string
  swatch: string
  hex: string
  note: string
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
}

export const CONCEPTS: Concept[] = [
  {
    slug: 'fieldly',
    name: 'Fieldly',
    tagline: 'From quote to close.',
    category: 'Field Service',
    year: '2025',
    platform: 'iOS & Android',
    timeline: '4 weeks',
    blurb:
      'Job scheduling, technician dispatch, quote-to-invoice, and photo job docs, built for plumbing, HVAC, and electrical teams.',
    problemTitle: "Contractors shouldn't need six apps to run one job.",
    problemBody: [
      'Most field-service teams in plumbing, HVAC, and electrical work are held together by a patchwork of tools: a scheduling spreadsheet, a group chat for dispatch, a separate quote template, and a folder of phone photos that may or may not make it back to the office.',
      'The result is missed jobs, lost quotes, and no paper trail when a client disputes the work. Fieldly replaces all of that with a single, focused tool, built specifically for the trades, not adapted from a generic CRM.',
      'Everything from the first quote to the final invoice lives in one place, accessible on-site from a phone, even offline.',
    ],
    screens: [
      'Dispatch Board',
      'Quote-to-Invoice',
      'Photo Job Docs',
      'Weekly Schedule',
    ],
    screensSubtitle: 'Four screens that run the whole job.',
    featuresSubtitle: 'Everything the job needs.',
    features: [
      {
        icon: 'CalendarClock',
        title: 'Job Scheduling',
        body: 'Plan and assign jobs to the right tech at the right time, every time.',
      },
      {
        icon: 'MapPin',
        title: 'Technician Dispatch',
        body: 'Real-time status updates and location tracking from the field.',
      },
      {
        icon: 'FileText',
        title: 'Quote-to-Invoice',
        body: 'Generate quotes, get sign-off, and convert to invoice in one tap.',
      },
      {
        icon: 'Camera',
        title: 'Photo Documentation',
        body: 'Before/after photos and technician notes attached to every job record.',
      },
      {
        icon: 'Users',
        title: 'Team Management',
        body: 'Manage your roster, skills, and availability from a single dashboard.',
      },
      {
        icon: 'WifiOff',
        title: 'Offline Mode',
        body: 'Works in basements and dead zones. Syncs automatically when back online.',
      },
    ],
    palette: [
      {
        name: 'Safety Amber',
        swatch: '#FFB300',
        hex: '#FFB300',
        note: 'Primary actions & wordmark',
      },
      {
        name: 'Navy Charcoal',
        swatch: '#14213A',
        hex: '#14213A',
        note: 'Base ink & dark surfaces',
      },
      {
        name: 'Status Green',
        swatch: '#1F9D55',
        hex: '#1F9D55',
        note: 'En route / done',
      },
    ],
    accent: '#FFB300',
    accentInk: '#14213A',
    typeface: 'Barlow',
    heroFrom: '#2c3524',
    heroTo: '#0e120b',
  },
  {
    slug: 'stamp',
    name: 'Stamp',
    tagline: 'Keep them coming back.',
    category: 'Loyalty & Rewards',
    year: '2025',
    platform: 'iOS & Android',
    timeline: '3 weeks',
    blurb:
      'Points and punch-card loyalty with push notifications, for local retail, convenience stores, and neighbourhood businesses.',
    problemTitle: 'Regulars get forgotten. Paper punch cards get lost.',
    problemBody: [
      'Big chains have slick loyalty apps with push notifications and tiered rewards. The corner store down the street has a card that lives crumpled at the bottom of a wallet, if it hasn’t been thrown out already.',
      'Stamp gives small retailers a loyalty program that actually gets used: points and stamps in one place, no hardware required. A shop owner sets up in minutes; a customer scans once and starts earning.',
      'A push notification can reach a regular where the paper card never could, a live double-stamp offer at the café two blocks from their office.',
    ],
    screens: [
      'Stamp Card',
      'Rewards Wallet',
      'Nearby Offers',
      'Redeem at Till',
    ],
    screensSubtitle: 'Four screens that keep them coming back.',
    featuresSubtitle: 'Everything a loyal customer needs.',
    features: [
      {
        icon: 'Stamp',
        title: 'Digital Punch Cards',
        body: 'Buy 10, get 1 free, configurable per product or storewide.',
      },
      {
        icon: 'Gift',
        title: 'Points & Rewards',
        body: 'Flexible earn-and-redeem rules that fit any till setup.',
      },
      {
        icon: 'Bell',
        title: 'Push Offers',
        body: 'Reach regulars with time-boxed, location-aware promotions.',
      },
      {
        icon: 'ScanLine',
        title: 'One-Tap Scan',
        body: 'A single QR scan at checkout, no extra hardware.',
      },
      {
        icon: 'MapPin',
        title: 'Nearby Discovery',
        body: 'Surface participating shops to customers close by.',
      },
      {
        icon: 'Users',
        title: 'Customer Insights',
        body: 'See who your regulars are and what keeps them returning.',
      },
    ],
    palette: [
      {
        name: 'Loyalty Purple',
        swatch: '#7C3AED',
        hex: '#7C3AED',
        note: 'Primary actions & wordmark',
      },
      {
        name: 'Warm Cream',
        swatch: '#FBF4EA',
        hex: '#FBF4EA',
        note: 'Card & surface background',
      },
      {
        name: 'Ink',
        swatch: '#1D1B23',
        hex: '#1D1B23',
        note: 'Text & dark panels',
      },
    ],
    accent: '#7C3AED',
    accentInk: '#1D1B23',
    typeface: 'Fraunces',
    heroFrom: '#241c33',
    heroTo: '#0d0a12',
  },
  {
    slug: 'slate',
    name: 'Slate',
    tagline: 'Your calendar, simplified.',
    category: 'Booking & Scheduling',
    year: '2025',
    platform: 'iOS & Android',
    timeline: '4 weeks',
    blurb:
      'Lightweight appointment booking for single-location salons, clinics, and home services.',
    problemTitle:
      'One chair, one calendar, and a phone that won’t stop ringing.',
    problemBody: [
      'Single-location salons, clinics, and home-service pros run on phone calls, messages, and a paper appointment book taped to the counter. Double-bookings happen. Calls come in mid-service. A no-show on a quiet Tuesday quietly costs the whole afternoon.',
      'The big scheduling platforms are built for chains and franchises, too heavy, too much setup for one location run by one person. Most independents try them once, give up on the config, and go back to the notepad.',
      'Slate does one thing well: let clients book an open slot themselves, and send the reminder so they actually show up. No training required, online in an afternoon.',
    ],
    screens: [
      'Book a Slot',
      'Booking Confirmed',
      'My Appointments',
      'Today’s Schedule',
    ],
    screensSubtitle: 'Four screens that fill the calendar.',
    featuresSubtitle: 'Everything a booking needs.',
    features: [
      {
        icon: 'CalendarCheck2',
        title: 'Self-Serve Booking',
        body: 'Clients pick an open slot themselves, no back-and-forth calls.',
      },
      {
        icon: 'Clock',
        title: 'Smart Reminders',
        body: 'Automatic reminders that cut down on no-shows.',
      },
      {
        icon: 'Repeat',
        title: 'Reschedule & Cancel',
        body: 'Clients manage their own bookings without calling the desk.',
      },
      {
        icon: 'ClipboardList',
        title: 'Daily Schedule View',
        body: 'A clean, single view of every booked and open slot.',
      },
      {
        icon: 'Smartphone',
        title: 'Add to Calendar',
        body: 'One tap adds the appointment to the client’s phone calendar.',
      },
      {
        icon: 'Users',
        title: 'Client History',
        body: 'See past visits and preferences at a glance.',
      },
    ],
    palette: [
      {
        name: 'Slate Teal',
        swatch: '#0F766E',
        hex: '#0F766E',
        note: 'Primary actions & wordmark',
      },
      {
        name: 'Paper',
        swatch: '#FFFFFF',
        hex: '#FFFFFF',
        note: 'Surfaces & backgrounds',
      },
      {
        name: 'Slate Ink',
        swatch: '#1E293B',
        hex: '#1E293B',
        note: 'Text & headings',
      },
    ],
    accent: '#0F766E',
    accentInk: '#1E293B',
    typeface: 'Manrope',
    heroFrom: '#12312d',
    heroTo: '#081a17',
  },
  {
    slug: 'prophy',
    name: 'Prophy',
    tagline: 'Built for the chair, not the desk.',
    category: 'Practice Management',
    year: '2025',
    platform: 'iOS & Android',
    timeline: '5 weeks',
    blurb:
      'Recall, charting, and scheduling for dental practices, built lean for small teams who don’t need Salesforce.',
    problemTitle: 'Recall lists live in spreadsheets nobody opens.',
    problemBody: [
      'Small dental practices are stuck between two bad options: enterprise practice-management suites with modules they’ll never touch, or a patchwork of spreadsheets, sticky notes, and a paper recall list that quietly goes stale.',
      'Prophy focuses on the handful of things that actually run a small practice day to day: the chart, the recall, the next slot, instead of trying to be everything.',
      'A hygienist can find a patient’s notes in seconds. The front desk sees exactly who’s overdue for a recall this month, without exporting anything.',
    ],
    screens: [
      'Patient Recall',
      'Chart Notes',
      'Day Schedule',
      'Treatment Plan',
    ],
    screensSubtitle: 'Four screens that run the practice.',
    featuresSubtitle: 'Everything the practice needs.',
    features: [
      {
        icon: 'FolderClock',
        title: 'Recall Tracking',
        body: 'See who’s due for a check-up this month, automatically.',
      },
      {
        icon: 'PenLine',
        title: 'Chart Notes',
        body: 'Fast, structured charting built around a hygienist’s workflow.',
      },
      {
        icon: 'CalendarClock',
        title: 'Chair Scheduling',
        body: 'A day view built around chairs and providers, not generic events.',
      },
      {
        icon: 'Activity',
        title: 'Treatment Plans',
        body: 'Track proposed, accepted, and completed treatment in one place.',
      },
      {
        icon: 'Bell',
        title: 'Recall Reminders',
        body: 'Automatic patient reminders when a recall is coming due.',
      },
      {
        icon: 'Users',
        title: 'Patient Records',
        body: 'One record per patient: history, notes, and plan together.',
      },
    ],
    palette: [
      {
        name: 'Clinical Blue',
        swatch: '#2563EB',
        hex: '#2563EB',
        note: 'Primary actions & wordmark',
      },
      {
        name: 'Soft White',
        swatch: '#F8FAFC',
        hex: '#F8FAFC',
        note: 'Surfaces & backgrounds',
      },
      {
        name: 'Chart Ink',
        swatch: '#0F172A',
        hex: '#0F172A',
        note: 'Text & headings',
      },
    ],
    accent: '#2563EB',
    accentInk: '#0F172A',
    typeface: 'Source Sans 3',
    heroFrom: '#132038',
    heroTo: '#080d18',
  },
  {
    slug: 'leadr',
    name: 'Leadr',
    tagline: 'Your pipeline, finally moving.',
    category: 'CRM',
    year: '2025',
    platform: 'iOS & Android',
    timeline: '4 weeks',
    blurb:
      'Lead capture, follow-up reminders, and a simple pipeline view, built lean for small teams who don’t need Salesforce.',
    problemTitle:
      'Leads go cold in the gap between "interested" and "follow up."',
    problemBody: [
      'Small sales teams lose deals not to competitors, but to their own inbox. A lead comes in, gets a reply, and then quietly falls off the bottom of someone’s to-do list.',
      'Full CRM platforms solve this with a hundred features a five-person team will never configure. Leadr solves it with four: capture the lead, see the pipeline, get reminded to follow up, close the deal.',
      'It’s built to be set up in an afternoon by whoever’s actually going to use it, not a dedicated ops hire.',
    ],
    screens: [
      'Pipeline Board',
      'Lead Detail',
      'Follow-Up Reminders',
      'Weekly Digest',
    ],
    screensSubtitle: 'Four screens that move the pipeline.',
    featuresSubtitle: 'Everything the pipeline needs.',
    features: [
      {
        icon: 'UserPlus',
        title: 'Lead Capture',
        body: 'Add a lead from a call, form, or business card in seconds.',
      },
      {
        icon: 'Kanban',
        title: 'Simple Pipeline',
        body: 'A clear, drag-friendly view of every deal and its stage.',
      },
      {
        icon: 'Bell',
        title: 'Follow-Up Reminders',
        body: 'Never let a warm lead go quiet, reminders that actually fire.',
      },
      {
        icon: 'Filter',
        title: 'Quick Filters',
        body: 'Sort by stage, owner, or how long a lead has gone untouched.',
      },
      {
        icon: 'Mail',
        title: 'Activity Log',
        body: 'Every call, email, and note tied to the lead automatically.',
      },
      {
        icon: 'Users',
        title: 'Team View',
        body: 'See the whole team’s pipeline without a separate report.',
      },
    ],
    palette: [
      {
        name: 'Signal Green',
        swatch: '#16A34A',
        hex: '#16A34A',
        note: 'Primary actions & wordmark',
      },
      {
        name: 'Deep Forest',
        swatch: '#0B2318',
        hex: '#0B2318',
        note: 'Dark surfaces & panels',
      },
      {
        name: 'Mist',
        swatch: '#F1F5F2',
        hex: '#F1F5F2',
        note: 'Light surfaces & backgrounds',
      },
    ],
    accent: '#16A34A',
    accentInk: '#0B2318',
    typeface: 'Work Sans',
    heroFrom: '#132b1c',
    heroTo: '#07130c',
  },
]

export function getConcept(slug: string): Concept | undefined {
  return CONCEPTS.find((c) => c.slug === slug)
}
