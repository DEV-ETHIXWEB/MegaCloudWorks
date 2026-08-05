import { useEffect, useRef, useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SiteHeader } from '#/components/site/SiteHeader'
import { SiteFooter } from '#/components/site/SiteFooter'
import { Button } from '#/components/ui/button'
import {
  Search,
  Grid,
  List,
  ArrowUpRight,
  Sparkles,
  Zap,
  X,
  ArrowRight,
  Award,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react'

export const Route = createFileRoute('/work')({ component: Work })

type Project = {
  id: string
  number: string
  name: string
  client: string
  category: 'Fintech' | 'Health' | 'Dev Tools' | 'E-Commerce' | 'AI & SaaS'
  blurb: string
  description: string
  tags: string[]
  year: string
  impact: string
  featured?: boolean
  techStack: string[]
  challenge: string
  solution: string
  metrics: { label: string; value: string }[]
  placeholderLabel: string
}

const APPROACH_COLUMNS = [
  {
    kicker: '01 / Impact',
    title: 'Measurable Growth',
    body: 'We design for clear business metrics — higher retention, lower latency, and faster conversions.',
  },
  {
    kicker: '02 / Precision',
    title: 'Design & Code Craft',
    body: 'Pixel-perfect interfaces backed by modern, high-performance architecture built to scale.',
  },
  {
    kicker: '03 / Speed',
    title: 'Rapid Execution',
    body: 'Short, iterative cycles that get real product in front of real users early and often.',
  },
  {
    kicker: '04 / Ownership',
    title: 'End-to-End Delivery',
    body: 'One unified team handling everything from initial strategy to production scaling.',
  },
]

const PROJECTS: Project[] = [
  {
    id: 'finlytics',
    number: '01',
    name: 'Finlytics OS',
    client: 'Finlytics Inc.',
    category: 'Fintech',
    blurb: 'A next-gen financial analytics suite turning complex transaction data into real-time glanceable insights.',
    description: 'Finlytics needed to rebuild their legacy web app into a high-speed, intuitive personal and enterprise financial intelligence hub. We redesigned the UX architecture, built custom WebGL chart primitives, and optimized data stream performance.',
    tags: ['Product Design', 'React & WebGL', 'Data Viz', 'iOS App'],
    year: '2025',
    impact: '+340% User Conversion',
    featured: true,
    techStack: ['React 19', 'TypeScript', 'D3.js', 'TailwindCSS', 'Node.js'],
    challenge: 'Handling over 50,000 live transaction events per second without UI lag or frame drops.',
    solution: 'Designed an asynchronous off-main-thread canvas renderer paired with sleek dark-mode glass UI elements.',
    metrics: [
      { label: 'Latency Reduction', value: '78%' },
      { label: 'ARR Growth', value: '$4.2M' },
      { label: 'App Rating', value: '4.9 ★' },
    ],
    placeholderLabel: 'Project 1',
  },
  {
    id: 'halo-health',
    number: '02',
    name: 'Halo Wellness',
    client: 'Halo Health Labs',
    category: 'Health',
    blurb: 'Gentle habit and biometric tracker built around subtle nudges rather than streak-shaming.',
    description: 'Halo reimagines health tracking by replacing aggressive notification spam with calm visual check-ins and AI wellness forecasting.',
    tags: ['UX Research', 'Design System', 'React Native', 'Biometrics'],
    year: '2025',
    impact: '88% Daily Retention',
    techStack: ['React Native', 'Swift', 'HealthKit', 'GraphQL', 'Tailwind'],
    challenge: 'Creating a non-intrusive UI that encourages healthy habits without anxiety.',
    solution: 'Engineered a fluid, ambient ring visualization that updates based on HRV and sleep data.',
    metrics: [
      { label: 'Active Users', value: '250K+' },
      { label: 'Day-30 Retention', value: '64%' },
      { label: 'App Store Feature', value: '#1 App' },
    ],
    placeholderLabel: 'Project 2',
  },
  {
    id: 'ledger-engine',
    number: '03',
    name: 'Ledger Engine',
    client: 'Ledger Tech',
    category: 'Dev Tools',
    blurb: 'Developer API portal & docs experience making complex cloud integrations feel seamless.',
    description: 'Ledger gives developers instant access to high-throughput financial infrastructure APIs with interactive code sandboxes and automated SDK generators.',
    tags: ['API Design', 'Docs System', 'Web Application', 'Developer UX'],
    year: '2024',
    impact: '5x Faster Onboarding',
    techStack: ['Next.js', 'Rust', 'WebAssembly', 'OpenAPI', 'Tailwind'],
    challenge: 'Documenting hundreds of endpoints while offering instant code copy and live sandbox execution.',
    solution: 'Created an ultra-fast search-first documentation portal with integrated live API runner.',
    metrics: [
      { label: 'Time-to-First-Call', value: '3 mins' },
      { label: 'Monthly API Requests', value: '1.2B' },
      { label: 'Dev Satisfaction', value: '98%' },
    ],
    placeholderLabel: 'Project 3',
  },
  {
    id: 'meridian-studio',
    number: '04',
    name: 'Meridian DTC',
    client: 'Meridian Goods',
    category: 'E-Commerce',
    blurb: 'Full brand transformation & storefront rebuild for a luxury DTC home goods brand.',
    description: 'Meridian needed a modern, immersive shopping experience that matched the artisan quality of their handcrafted furniture and home line.',
    tags: ['Brand Identity', 'Storefront Architecture', '3D Configurator', 'Shopify'],
    year: '2024',
    impact: '+215% Mobile Sales',
    techStack: ['Three.js', 'Shopify Storefront API', 'TailwindCSS', 'GSAP'],
    challenge: 'Enabling customers to view furniture items in custom 3D environments on mobile web browsers.',
    solution: 'Custom lightweight WebGL viewer with dynamic realistic lighting and soft shadows.',
    metrics: [
      { label: 'Cart Conversion', value: '+42%' },
      { label: 'Page Load Speed', value: '0.8s' },
      { label: 'Return Rate', value: '-35%' },
    ],
    placeholderLabel: 'Project 4',
  },
  {
    id: 'aura-ai',
    number: '05',
    name: 'Aura Studio',
    client: 'Aura Systems',
    category: 'AI & SaaS',
    blurb: 'Generative AI canvas empowering design teams to synthesize visual prototypes rapidly.',
    description: 'Aura Studio combines node-based prompt workflows with real-time vector canvas rendering for enterprise design & product teams.',
    tags: ['AI Interface', 'Canvas Engine', 'Real-Time Sync', 'WebGPU'],
    year: '2025',
    impact: '10x Prototyping Speed',
    techStack: ['TypeScript', 'WebGPU', 'Python AI Microservices', 'React 19'],
    challenge: 'Streaming real-time AI image generation directly onto an infinite multiplayer canvas.',
    solution: 'Built a multi-threaded WebWorker pipeline that processes generative diffusions seamlessly.',
    metrics: [
      { label: 'Generations / Day', value: '2.5M' },
      { label: 'Team Accounts', value: '1,400+' },
      { label: 'Net Promoter Score', value: '74' },
    ],
    placeholderLabel: 'Project 5',
  },
  {
    id: 'veloce-mobility',
    number: '06',
    name: 'Veloce Telemetry',
    client: 'Veloce Fleet Inc.',
    category: 'AI & SaaS',
    blurb: 'Smart EV fleet management and telemetry suite with predictive maintenance alerts.',
    description: 'Veloce provides EV fleet operators with real-time battery analytics, dynamic route optimization, and autonomous charging schedule algorithms.',
    tags: ['IoT Dashboard', 'Telemetry Data', 'Mobile App', 'Mapbox GL'],
    year: '2024',
    impact: '30% Energy Saved',
    techStack: ['React', 'Mapbox GL', 'Go Backend', 'MQTT', 'Tailwind'],
    challenge: 'Monitoring thousands of vehicles with real-time GPS and battery diagnostics.',
    solution: 'High-density vector map interface with instant filtering and automated charging dispatch.',
    metrics: [
      { label: 'Fleet Vehicles Tracked', value: '18,500' },
      { label: 'Uptime Guarantee', value: '99.99%' },
      { label: 'Cost Reduction', value: '24%' },
    ],
    placeholderLabel: 'Project 6',
  },
]

const CATEGORIES = [
  'All',
  'Fintech',
  'Health',
  'Dev Tools',
  'E-Commerce',
  'AI & SaaS',
] as const

const PROCESS = [
  { step: '01', title: 'Discover & Align', body: 'We map out your business objectives, target audience, and key technical constraints.' },
  { step: '02', title: 'Design & Prototype', body: 'High-fidelity UI, user flows, and design systems validated before writing production code.' },
  { step: '03', title: 'Engineered Build', body: 'Clean, performant TypeScript & modern stack development with rigorous automated testing.' },
  { step: '04', title: 'Launch & Measure', body: 'Zero-downtime deployment, continuous monitoring, and data-driven post-launch polish.' },
]

const STATS = [
  { value: '40+', label: 'Products Launched', icon: RocketIcon },
  { value: '$250M+', label: 'Client Capital Raised', icon: TrendingUp },
  { value: '99.4%', label: 'On-Time Ship Rate', icon: CheckCircle2 },
  { value: '14', label: 'Design & Tech Awards', icon: Award },
]

function RocketIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.63 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.58-5.84a14.98 14.98 0 00-6.16 12.12" />
    </svg>
  )
}

/** Simple "Project N" styled placeholder with gradient accent */
function ProjectPlaceholder({ label, number }: { label: string; number: string }) {
  return (
    <div className="work-placeholder relative flex h-full w-full flex-col items-center justify-center gap-3 select-none">
      {/* Large subtle number watermark */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center font-display text-[8rem] font-extrabold leading-none text-white/[0.04] tracking-[-0.06em]"
      >
        {number}
      </span>
      {/* Centered label pill */}
      <div className="relative z-10 flex flex-col items-center gap-2">
        <div className="h-px w-12 bg-gradient-to-r from-transparent via-[var(--brand)] to-transparent opacity-70" />
        <span className="rounded-full border border-[var(--brand)]/30 bg-[var(--brand)]/10 px-4 py-1.5 font-display text-sm font-bold tracking-widest text-[var(--brand)] backdrop-blur-sm uppercase">
          {label}
        </span>
        <div className="h-px w-12 bg-gradient-to-r from-transparent via-[var(--brand)] to-transparent opacity-70" />
      </div>
    </div>
  )
}

function Work() {
  const root = useRef<HTMLDivElement>(null)
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      // hero elements entrance
      gsap.from('[data-hero]', {
        y: 34,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.12,
      })

      // slow breathing background glow pulse
      gsap.utils.toArray<HTMLElement>('[data-glow]').forEach((el, i) => {
        gsap.to(el, {
          scale: 1.18,
          opacity: 0.85,
          duration: 6 + i,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        })
      })

      // slowly rotating dashed rings (Services section style)
      gsap.utils.toArray<HTMLElement>('[data-ring]').forEach((el, i) => {
        gsap.to(el, {
          rotate: i % 2 === 0 ? 360 : -360,
          duration: 60 + i * 20,
          ease: 'none',
          repeat: -1,
        })
      })

      // approach columns: glowing red accent lines draw in one after another
      gsap.from('[data-line]', {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 0.5,
        ease: 'power2.inOut',
        stagger: 0.34,
        scrollTrigger: {
          trigger: '[data-columns]',
          start: 'top 80%',
          toggleActions: 'restart none none reset',
        },
      })

      // scroll reveals for cards and sections
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          y: 42,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
        })
      })
    }, root)

    return () => ctx.revert()
  }, [activeCategory, searchQuery])

  // Filter projects based on category and search query
  const filteredProjects = PROJECTS.filter((p) => {
    const matchesCategory =
      activeCategory === 'All' || p.category === activeCategory
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.blurb.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const featuredProject = PROJECTS.find((p) => p.featured) || PROJECTS[0]

  return (
    <div ref={root} className="relative min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <SiteHeader />

      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden px-4 pb-16 pt-32 sm:px-8 lg:px-20 lg:pt-44">
        {/* Breathing background glow */}
        <div
          data-glow
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-40 h-[30rem] w-[30rem] rounded-full opacity-70 blur-3xl sm:h-[42rem] sm:w-[42rem]"
          style={{
            background:
              'radial-gradient(circle, rgba(245,51,59,0.14) 0%, rgba(255,106,61,0.09) 40%, rgba(255,255,255,0) 70%)',
          }}
        />

        <div className="relative max-w-3xl">
          <p
            data-hero
            className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--brand)]"
          >
            Selected Portfolio & Case Studies
          </p>
          <h1
            data-hero
            className="mt-5 font-display text-[clamp(2.2rem,7vw,5.5rem)] font-extrabold leading-[0.92] tracking-[-0.03em] text-[var(--ink)]"
          >
            Products engineered for{' '}
            <span className="bg-gradient-to-r from-[var(--brand)] via-[#ff6a3d] to-[#f5333b] bg-clip-text text-transparent">
              impact & craft.
            </span>
          </h1>
          <p
            data-hero
            className="mt-5 text-base leading-relaxed text-[var(--ink-soft)] sm:text-lg"
          >
            An inside look at how we combine strategic product design, modern engineering, and smooth visual polish to ship industry-defining software.
          </p>
        </div>

        {/* 4 Approach Columns with Animated Accent Lines */}
        <div
          data-columns
          className="relative mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {APPROACH_COLUMNS.map((c) => (
            <div data-reveal key={c.kicker} className="relative pt-6">
              {/* faint track + animated glowing accent line */}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px bg-[var(--line)]"
              />
              <span
                data-line
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-[3px] origin-left rounded-full bg-[var(--brand)] shadow-[0_0_16px_rgba(245,51,59,0.85)]"
              />
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[var(--brand)]">
                {c.kicker}
              </p>
              <h3 className="mt-3 font-display text-lg font-bold text-[var(--ink)]">
                {c.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
                {c.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= SPOTLIGHT FEATURED CASE STUDY ================= */}
      <section className="relative px-4 py-10 sm:px-8 lg:px-20">
        <div
          data-ring
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 top-1/2 hidden h-[32rem] w-[32rem] -translate-y-1/2 rounded-full border border-dashed border-[var(--line-strong)] opacity-40 lg:block"
        />

        <div data-reveal className="relative">
          <div className="mb-4 flex items-center justify-between gap-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--brand)]/30 bg-[var(--brand)]/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[var(--brand)] backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" />
              Featured Spotlight
            </span>
            <span className="text-xs font-semibold text-[var(--ink-faint)]">
              Flagship Release
            </span>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--paper)] shadow-[0_20px_60px_rgba(16,16,20,0.08)] transition-all duration-700 hover:border-[var(--brand)]/40 hover:shadow-[0_30px_80px_rgba(245,51,59,0.15)] sm:rounded-3xl">
            {/* Glowing corner accents */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-[var(--brand)]/15 blur-3xl transition-opacity duration-700 group-hover:opacity-100" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-[var(--brand-2)]/10 blur-3xl" />

            <div className="grid lg:grid-cols-[1.1fr_1.3fr]">
              {/* Left Details */}
              <div className="relative z-10 flex flex-col justify-between p-6 sm:p-8 lg:p-12">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-[var(--brand)]">
                      {featuredProject.category}
                    </span>
                    <span className="h-1 w-1 rounded-full bg-[var(--ink-faint)]" />
                    <span className="text-xs font-medium text-[var(--ink-soft)]">
                      {featuredProject.client}
                    </span>
                  </div>

                  <h2 className="mt-4 font-display text-2xl font-extrabold tracking-tight text-[var(--ink)] sm:text-3xl lg:text-5xl">
                    {featuredProject.name}
                  </h2>

                  <p className="mt-4 text-base leading-relaxed text-[var(--ink-soft)]">
                    {featuredProject.blurb}
                  </p>

                  {/* Impact Badges */}
                  <div className="mt-6 grid grid-cols-3 gap-3 rounded-xl border border-[var(--line)] bg-[var(--paper-2)]/80 p-3 backdrop-blur-md sm:mt-8 sm:gap-4 sm:rounded-2xl sm:p-4">
                    {featuredProject.metrics.map((m) => (
                      <div key={m.label}>
                        <p className="font-display text-base font-extrabold text-[var(--ink)] sm:text-xl">
                          {m.value}
                        </p>
                        <p className="text-[10px] font-semibold text-[var(--ink-faint)] sm:text-[11px]">
                          {m.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3 sm:mt-8">
                  <Button
                    onClick={() => setSelectedProject(featuredProject)}
                    size="lg"
                    className="group/btn relative overflow-hidden bg-[var(--brand)] text-white shadow-lg"
                  >
                    <span className="relative z-10 flex items-center gap-2 font-semibold">
                      Explore Case Study
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                    </span>
                  </Button>

                  <div className="flex flex-wrap gap-2">
                    {featuredProject.tags.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-[var(--paper-2)] px-3 py-1 text-xs font-medium text-[var(--ink-soft)]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right — Simple Project Placeholder */}
              <div className="relative min-h-[220px] overflow-hidden bg-gradient-to-br from-[#121014] via-[#1a1216] to-[#0c0c0f] sm:min-h-[300px] lg:min-h-[400px]">
                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
                <ProjectPlaceholder label={featuredProject.placeholderLabel} number={featuredProject.number} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FILTER & CONTROLS BAR ================= */}
      <section className="px-4 py-6 sm:px-8 lg:px-20">
        <div data-reveal className="flex flex-col gap-4 border-y border-[var(--line)] py-5 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
          {/* Category Filter Pills — scrollable on mobile */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:flex-wrap lg:pb-0">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`relative shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all duration-300 ${
                    isActive
                      ? 'bg-[var(--brand)] text-white shadow-md shadow-[var(--brand)]/20'
                      : 'border border-[var(--line)] bg-[var(--paper-2)] text-[var(--ink-soft)] hover:border-[var(--brand)]/40 hover:text-[var(--ink)]'
                  }`}
                >
                  {cat}
                  {isActive && (
                    <span className="ml-1.5 inline-flex h-2 w-2 rounded-full bg-white animate-pulse" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Search Input & View Mode Switcher */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 lg:flex-none lg:min-w-[220px]">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ink-faint)]" />
              <input
                type="text"
                placeholder="Search case studies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-[var(--line)] bg-[var(--paper-2)] pl-10 pr-4 py-2 text-xs font-medium text-[var(--ink)] placeholder-[var(--ink-faint)] outline-none transition-all focus:border-[var(--brand)] focus:bg-[var(--paper)] focus:ring-2 focus:ring-[var(--brand)]/20"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink-faint)] hover:text-[var(--ink)]"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center rounded-full border border-[var(--line)] bg-[var(--paper-2)] p-1">
              <button
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
                className={`rounded-full p-1.5 transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-[var(--paper)] text-[var(--brand)] shadow-sm'
                    : 'text-[var(--ink-faint)] hover:text-[var(--ink)]'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                aria-label="List view"
                className={`rounded-full p-1.5 transition-colors ${
                  viewMode === 'list'
                    ? 'bg-[var(--paper)] text-[var(--brand)] shadow-sm'
                    : 'text-[var(--ink-faint)] hover:text-[var(--ink)]'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PROJECT CARDS SECTION ================= */}
      <section className="px-4 pb-8 sm:px-8 lg:px-20">
        {filteredProjects.length === 0 ? (
          <div className="my-12 rounded-3xl border border-dashed border-[var(--line-strong)] bg-[var(--paper-2)]/50 p-10 text-center sm:my-16 sm:p-12">
            <Sparkles className="mx-auto h-8 w-8 text-[var(--brand)]" />
            <h3 className="mt-4 font-display text-xl font-bold text-[var(--ink)]">
              No matching projects found
            </h3>
            <p className="mt-2 text-sm text-[var(--ink-soft)]">
              Try adjusting your search query or selecting another category.
            </p>
            <Button
              onClick={() => {
                setActiveCategory('All')
                setSearchQuery('')
              }}
              variant="outline"
              className="mt-6"
            >
              Show All Projects
            </Button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid gap-6 sm:grid-cols-2 sm:gap-8 lg:gap-10">
            {filteredProjects.map((p) => (
              <article
                key={p.id}
                data-reveal
                onClick={() => setSelectedProject(p)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--paper)] shadow-[0_1px_2px_rgba(16,16,20,0.04)] transition-all duration-500 hover:-translate-y-1.5 hover:border-[var(--brand)]/30 hover:shadow-[0_25px_60px_rgba(16,16,20,0.12),0_0_0_1px_rgba(245,51,59,0.1)] sm:rounded-3xl"
              >
                {/* Glowing red accent line */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 rounded-full bg-[var(--brand)] opacity-0 shadow-[0_0_16px_rgba(245,51,59,0.85)] transition-all duration-500 group-hover:scale-x-100 group-hover:opacity-100"
                />

                {/* Corner red glow accent */}
                <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 origin-top-right scale-0 bg-gradient-to-br from-[var(--brand)]/15 via-[var(--brand-2)]/10 to-transparent opacity-0 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-100" />

                {/* Placeholder Image Area */}
                <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-[#141217] via-[#1d171d] to-[#0e0d11]">
                  {/* Number + Year overlay */}
                  <div className="absolute left-4 top-4 z-10 flex items-center gap-2">
                    <span className="font-display text-2xl font-extrabold text-[var(--brand)]">
                      {p.number}
                    </span>
                    <span className="rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-bold text-[var(--ink)] shadow-sm">
                      {p.year}
                    </span>
                  </div>

                  {/* Impact badge */}
                  <div className="absolute right-4 top-4 z-10">
                    <span className="rounded-full bg-[var(--brand)]/80 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
                      {p.impact}
                    </span>
                  </div>

                  {/* Simple project placeholder */}
                  <ProjectPlaceholder label={p.placeholderLabel} number={p.number} />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-30" />
                </div>

                {/* Content Section */}
                <div className="relative p-5 sm:p-6 lg:p-8">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--brand)]">
                      {p.category} · {p.client}
                    </p>
                    <ArrowUpRight className="h-5 w-5 shrink-0 -translate-y-1 translate-x-1 text-[var(--brand)] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
                  </div>

                  <h3 className="mt-2 font-display text-xl font-extrabold tracking-tight text-[var(--ink)] transition-colors duration-300 group-hover:text-[var(--brand)] sm:text-2xl">
                    {p.name}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
                    {p.blurb}
                  </p>

                  {/* Tags */}
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <li
                        key={t}
                        className="rounded-full border border-[var(--line)] bg-[var(--paper-2)] px-3 py-1 text-xs font-medium text-[var(--ink-soft)] transition-all duration-300 group-hover:border-[var(--brand)]/30 group-hover:bg-[var(--brand)]/5 group-hover:text-[var(--brand)]"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <div className="mt-5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--brand)] transition-all duration-300 group-hover:translate-x-1">
                    <span>Explore Case Details</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* List View Layout */
          <div className="flex flex-col gap-3 sm:gap-4">
            {filteredProjects.map((p) => (
              <article
                key={p.id}
                data-reveal
                onClick={() => setSelectedProject(p)}
                className="group relative cursor-pointer overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--paper)] p-5 shadow-sm transition-all duration-300 hover:border-[var(--brand)]/30 hover:shadow-lg sm:rounded-2xl sm:p-6 lg:p-8"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="font-display text-lg font-extrabold text-[var(--brand)]">
                        {p.number}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider text-[var(--brand)]">
                        {p.category}
                      </span>
                      <span className="h-1 w-1 rounded-full bg-[var(--ink-faint)]" />
                      <span className="text-xs font-semibold text-[var(--ink-faint)]">
                        {p.year}
                      </span>
                    </div>

                    <h3 className="mt-1 font-display text-xl font-extrabold tracking-tight text-[var(--ink)] transition-colors group-hover:text-[var(--brand)] sm:text-2xl">
                      {p.name}
                    </h3>

                    <p className="mt-1.5 text-sm leading-relaxed text-[var(--ink-soft)]">
                      {p.blurb}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-[var(--paper-2)] px-2.5 py-1 text-[11px] font-medium text-[var(--ink-soft)]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center justify-between gap-4 border-t border-[var(--line)] pt-3 sm:border-t-0 sm:pt-0">
                    <div className="text-right">
                      <p className="font-display text-base font-extrabold text-[var(--ink)]">
                        {p.impact}
                      </p>
                      <p className="text-xs text-[var(--ink-faint)]">Result</p>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--paper-2)] text-[var(--ink)] transition-all group-hover:border-[var(--brand)] group-hover:bg-[var(--brand)] group-hover:text-white">
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* ================= PROCESS SECTION ================= */}
      <section className="px-4 py-16 sm:px-8 sm:py-24 lg:px-20">
        <div data-reveal className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--brand)]">
            Execution Method
          </p>
          <h2 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-[var(--ink)] sm:text-4xl">
            How we ship, step by step
          </h2>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map((p) => (
            <div
              data-reveal
              key={p.step}
              className="group relative border-t border-[var(--line)] pt-6 transition-all duration-300 hover:border-[var(--brand)]"
            >
              <span className="font-display text-sm font-extrabold text-[var(--brand)]">
                {p.step}
              </span>
              <h3 className="mt-2 font-display text-lg font-bold text-[var(--ink)] transition-colors group-hover:text-[var(--brand)]">
                {p.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= STUDIO IMPACT NUMBERS ================= */}
      <section className="px-4 pb-16 sm:px-8 sm:pb-20 lg:px-20">
        <div
          data-reveal
          className="relative overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--paper-2)] p-8 shadow-lg sm:rounded-3xl sm:p-12 lg:p-14"
        >
          <div
            data-glow
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full opacity-70 blur-3xl"
            style={{
              background:
                'radial-gradient(circle, rgba(245,51,59,0.14) 0%, rgba(255,106,61,0.09) 45%, rgba(255,255,255,0) 72%)',
            }}
          />

          <div className="max-w-xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--brand)]">
              Track Record
            </p>
            <h2 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-[var(--ink)] sm:text-4xl">
              Proven momentum across every release.
            </h2>
          </div>

          <div className="mt-10 grid gap-4 grid-cols-2 lg:grid-cols-4">
            {STATS.map((s) => {
              const Icon = s.icon
              return (
                <div
                  key={s.label}
                  className="rounded-xl border border-[var(--line)] bg-[var(--paper)] p-5 shadow-sm transition-all duration-300 hover:border-[var(--brand)]/30 hover:shadow-md sm:rounded-2xl sm:p-6"
                >
                  <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--brand)]/10 text-[var(--brand)] sm:h-10 sm:w-10">
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <p className="font-display text-2xl font-extrabold tracking-tight text-[var(--ink)] sm:text-3xl lg:text-4xl">
                    {s.value}
                  </p>
                  <p className="mt-1.5 text-xs font-semibold text-[var(--ink-soft)]">
                    {s.label}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ================= CTA SECTION ================= */}
      <section className="px-4 pb-24 sm:px-8 sm:pb-28 lg:px-20">
        <div
          data-reveal
          className="relative overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--paper-2)] p-7 sm:rounded-3xl sm:p-12"
        >
          <div
            data-glow
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full opacity-70 blur-3xl"
            style={{
              background:
                'radial-gradient(circle, rgba(245,51,59,0.14) 0%, rgba(255,106,61,0.09) 45%, rgba(255,255,255,0) 72%)',
            }}
          />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--brand)]/30 bg-[var(--brand)]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--brand)]">
                <Zap className="h-3.5 w-3.5" />
                Available Q3/Q4 2025
              </span>
              <h2 className="mt-3 font-display text-xl font-extrabold tracking-tight text-[var(--ink)] sm:text-3xl">
                Could your product be next?
              </h2>
              <p className="mt-2 text-sm text-[var(--ink-soft)] sm:text-base">
                We take on a limited number of high-impact products each quarter. Tell us about your project.
              </p>
            </div>
            <Button asChild size="lg" className="shrink-0 group w-full sm:w-auto">
              <Link to="/contact" className="flex items-center justify-center gap-2">
                <span>Start a Project</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ================= PROJECT DETAIL QUICK-VIEW MODAL ================= */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6 lg:p-10">
          <div
            onClick={() => setSelectedProject(null)}
            className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-300"
          />

          <div className="animate-modal-scale relative z-10 flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl border border-[var(--line)] bg-[var(--paper)] shadow-2xl sm:max-h-[90vh] sm:max-w-4xl sm:rounded-3xl">
            {/* Modal handle (mobile) */}
            <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-[var(--line)] sm:hidden" />

            <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4 sm:px-8 sm:py-5">
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="font-display font-bold text-[var(--brand)]">
                  {selectedProject.number}
                </span>
                <span className="rounded-full bg-[var(--brand)]/10 px-2.5 py-1 text-xs font-bold text-[var(--brand)]">
                  {selectedProject.category}
                </span>
                <span className="hidden text-xs font-semibold text-[var(--ink-soft)] sm:inline">
                  {selectedProject.client} ({selectedProject.year})
                </span>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="rounded-full p-2 text-[var(--ink-soft)] hover:bg-[var(--paper-2)] hover:text-[var(--ink)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-5 sm:p-8 space-y-6 sm:space-y-8">
              <div>
                <h2 className="font-display text-2xl font-extrabold text-[var(--ink)] sm:text-4xl">
                  {selectedProject.name}
                </h2>
                <p className="mt-2 text-sm font-semibold text-[var(--ink-soft)] sm:hidden">
                  {selectedProject.client} · {selectedProject.year}
                </p>
                <p className="mt-3 text-base leading-relaxed text-[var(--ink-soft)]">
                  {selectedProject.description}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 rounded-xl border border-[var(--line)] bg-[var(--paper-2)] p-4 sm:gap-4 sm:rounded-2xl sm:p-6">
                {selectedProject.metrics.map((m) => (
                  <div key={m.label}>
                    <p className="font-display text-lg font-extrabold text-[var(--brand)] sm:text-2xl">
                      {m.value}
                    </p>
                    <p className="text-[10px] font-semibold text-[var(--ink-soft)] sm:text-xs">
                      {m.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                <div className="rounded-xl border border-[var(--line)] p-5 bg-[var(--paper-2)]/50 sm:rounded-2xl">
                  <h4 className="font-display text-base font-bold text-[var(--ink)]">
                    The Challenge
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
                    {selectedProject.challenge}
                  </p>
                </div>
                <div className="rounded-xl border border-[var(--line)] p-5 bg-[var(--paper-2)]/50 sm:rounded-2xl">
                  <h4 className="font-display text-base font-bold text-[var(--ink)]">
                    Our Solution
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
                    {selectedProject.solution}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-display text-sm font-bold uppercase tracking-wider text-[var(--ink-faint)]">
                  Technologies Used
                </h4>
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedProject.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-[var(--line)] bg-[var(--paper)] px-3 py-1.5 text-xs font-semibold text-[var(--ink)] shadow-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-[var(--line)] px-5 py-4 bg-[var(--paper-2)]/50 sm:px-8">
              <span className="text-xs font-semibold text-[var(--ink-faint)]">
                MegaCloudWorks Case Study
              </span>
              <Button
                onClick={() => setSelectedProject(null)}
                className="bg-[var(--brand)] text-white"
              >
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  )
}
