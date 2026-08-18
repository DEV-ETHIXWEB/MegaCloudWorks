import { Code2, Compass, PenTool, Rocket } from 'lucide-react'

/**
 * The four steps, in two lengths: `blurb` is what fits on the phone display,
 * `detail` and `points` are what the full-size panel beside it carries. Both
 * sides read from here so they can never drift apart.
 */
export const STEPS = [
  {
    icon: Compass,
    title: 'Discover',
    meta: 'Week 1',
    blurb: 'We map the job the product has to do, and what it must never do.',
    detail:
      'We start with the job to be done, not a feature list. One week of interviews, competitive teardown and a written scope, so the thing we build is the thing you needed rather than the thing that was easiest to describe in a kickoff call.',
    points: [
      'Stakeholder interviews',
      'Scope written down',
      'Success measures agreed',
    ],
  },
  {
    icon: PenTool,
    title: 'Design',
    meta: 'Weeks 2-3',
    blurb: 'Flows, then screens. Prototyped early so you can feel it working.',
    detail:
      'Flows before pixels. You get a clickable prototype in week two - on a real device, in your hand - because opinions about a static mockup and opinions about something you can actually use are not the same opinions.',
    points: [
      'Flows and states',
      'Clickable prototype',
      'Design system started',
    ],
  },
  {
    icon: Code2,
    title: 'Build',
    meta: 'Weeks 4-8',
    blurb: 'Typed, tested, reviewed. Shipped to a staging build every week.',
    detail:
      'Typed end to end, reviewed on every pull request, and deployed to a staging build you can open every single week. No months of silence followed by a big reveal - you watch it become real.',
    points: [
      'Weekly staging builds',
      'Automated tests',
      'Code review on everything',
    ],
  },
  {
    icon: Rocket,
    title: 'Launch',
    meta: 'Week 9',
    blurb: 'Store submission, analytics, and a team that stays on the line.',
    detail:
      'Store submission handled, analytics wired before launch rather than after, and a handover that includes us staying reachable. Shipping is a date in the plan, not a thing that happens when it happens.',
    points: [
      'Store submission',
      'Analytics live at launch',
      'Post-launch support',
    ],
  },
] as const

export type Step = (typeof STEPS)[number]
