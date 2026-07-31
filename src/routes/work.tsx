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
  Code2,
  X,
  BarChart3,
  Smartphone,
  ArrowRight,
  Award,
  TrendingUp,
  CheckCircle2,
  Cpu,
  ShieldCheck,
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
  previewType: 'dashboard' | 'mobile' | 'code' | 'brand' | 'ai' | 'iot'
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
    previewType: 'dashboard',
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
    previewType: 'mobile',
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
    previewType: 'code',
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
    previewType: 'brand',
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
    previewType: 'ai',
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
    previewType: 'iot',
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

      {/* ================= HERO SECTION (Services Inspired) ================= */}
      <section className="relative overflow-hidden px-6 pb-20 pt-36 sm:px-10 lg:px-20 lg:pt-44">
        {/* Breathing background glow */}
        <div
          data-glow
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-40 h-[42rem] w-[42rem] rounded-full opacity-70 blur-3xl"
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
            className="mt-6 font-display text-[clamp(2.75rem,7vw,5.5rem)] font-extrabold leading-[0.92] tracking-[-0.03em] text-[var(--ink)]"
          >
            Products engineered for{' '}
            <span className="bg-gradient-to-r from-[var(--brand)] via-[#ff6a3d] to-[#f5333b] bg-clip-text text-transparent">
              impact & craft.
            </span>
          </h1>
          <p
            data-hero
            className="mt-7 text-lg leading-relaxed text-[var(--ink-soft)]"
          >
            An inside look at how we combine strategic product design, modern engineering, and smooth visual polish to ship industry-defining software.
          </p>
        </div>

        {/* 4 Approach Columns with Animated Accent Lines */}
        <div
          data-columns
          className="relative mt-20 grid gap-10 sm:grid-cols-2 lg:grid-cols-4"
        >
          {APPROACH_COLUMNS.map((c) => (
            <div data-reveal key={c.kicker} className="relative pt-7">
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
      <section className="relative px-6 py-12 sm:px-10 lg:px-20">
        {/* Decorative dashed background ring */}
        <div
          data-ring
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 top-1/2 hidden h-[32rem] w-[32rem] -translate-y-1/2 rounded-full border border-dashed border-[var(--line-strong)] lg:block opacity-40"
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

          <div className="group relative overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--paper)] shadow-[0_20px_60px_rgba(16,16,20,0.08)] transition-all duration-700 hover:border-[var(--brand)]/40 hover:shadow-[0_30px_80px_rgba(245,51,59,0.15)]">
            {/* Glowing corner accent */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-[var(--brand)]/15 blur-3xl transition-opacity duration-700 group-hover:opacity-100" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-[var(--brand-2)]/10 blur-3xl" />

            <div className="grid lg:grid-cols-[1.1fr_1.3fr]">
              {/* Left Details */}
              <div className="relative z-10 flex flex-col justify-between p-8 sm:p-10 lg:p-12">
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

                  <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-[var(--ink)] sm:text-4xl lg:text-5xl">
                    {featuredProject.name}
                  </h2>

                  <p className="mt-4 text-base leading-relaxed text-[var(--ink-soft)] sm:text-lg">
                    {featuredProject.blurb}
                  </p>

                  {/* Impact Badges */}
                  <div className="mt-8 grid grid-cols-3 gap-4 rounded-2xl border border-[var(--line)] bg-[var(--paper-2)]/80 p-4 backdrop-blur-md">
                    {featuredProject.metrics.map((m) => (
                      <div key={m.label}>
                        <p className="font-display text-lg font-extrabold text-[var(--ink)] sm:text-xl">
                          {m.value}
                        </p>
                        <p className="text-[11px] font-semibold text-[var(--ink-faint)]">
                          {m.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Button
                    onClick={() => setSelectedProject(featuredProject)}
                    size="lg"
                    className="group/btn relative overflow-hidden bg-[var(--brand)] text-white shadow-lg transition-all duration-300 hover:bg-[var(--brand-strong)] hover:shadow-xl hover:shadow-[var(--brand)]/30"
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

              {/* Right Stylized Interactive Graphic Placeholder */}
              <div className="relative min-h-[320px] overflow-hidden bg-gradient-to-br from-[#121014] via-[#1a1216] to-[#0c0c0f] p-6 lg:min-h-[440px]">
                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />

                {/* Dashboard Frame Graphic */}
                <div className="relative h-full w-full rounded-2xl border border-white/10 bg-[#16141a]/90 p-5 shadow-2xl backdrop-blur-xl transition-all duration-700 group-hover:scale-[1.02]">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
                      <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                      <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
                      <span className="ml-2 text-xs font-mono text-white/50">
                        finlytics-os.app/analytics
                      </span>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-white/5 px-2.5 py-1 text-[11px] font-medium text-emerald-400">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      Live Stream: 48,200 ops/s
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                      <p className="text-xs font-medium text-white/60">
                        Quarterly Revenue Growth
                      </p>
                      <p className="mt-1 font-display text-2xl font-bold text-white">
                        $14,892,400{' '}
                        <span className="text-xs font-semibold text-emerald-400">
                          +34.2%
                        </span>
                      </p>
                      <svg className="mt-3 h-14 w-full" viewBox="0 0 200 50">
                        <defs>
                          <linearGradient id="grad-spot" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#f5333b" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#ff6a3d" stopOpacity="0.8" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M0,40 Q30,10 60,30 T120,15 T180,35 T200,5"
                          fill="none"
                          stroke="url(#grad-spot)"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                      <p className="text-xs font-medium text-white/60">
                        Active API Consumers
                      </p>
                      <p className="mt-1 font-display text-2xl font-bold text-white">
                        124,900{' '}
                        <span className="text-xs font-semibold text-emerald-400">
                          +18.4%
                        </span>
                      </p>
                      <div className="mt-4 space-y-2">
                        <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                          <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-[var(--brand)] to-[var(--brand-2)]" />
                        </div>
                        <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                          <div className="h-full w-[62%] rounded-full bg-gradient-to-r from-orange-400 to-amber-300" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-xs text-white/70">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-[var(--brand)]" />
                      <span>WebGL Real-time Pipeline Active</span>
                    </div>
                    <span className="font-mono text-[11px] text-white/50">
                      v2.4.0-release
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FILTER & CONTROLS BAR ================= */}
      <section className="px-6 py-8 sm:px-10 lg:px-20">
        <div data-reveal className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between border-y border-[var(--line)] py-6">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`relative rounded-full px-4 py-2 text-xs font-bold transition-all duration-300 ${
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
            <div className="relative min-w-[240px] flex-1 sm:flex-none">
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

      {/* ================= PROJECT CARDS SECTION (Services Card Layout) ================= */}
      <section className="px-6 py-8 sm:px-10 lg:px-20">
        {filteredProjects.length === 0 ? (
          <div className="my-16 rounded-3xl border border-dashed border-[var(--line-strong)] bg-[var(--paper-2)]/50 p-12 text-center">
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
          <div className="grid gap-8 sm:grid-cols-2 lg:gap-10">
            {filteredProjects.map((p) => (
              <article
                key={p.id}
                data-reveal
                onClick={() => setSelectedProject(p)}
                className="group relative cursor-pointer overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--paper)] shadow-[0_1px_2px_rgba(16,16,20,0.04)] transition-all duration-500 hover:-translate-y-1.5 hover:border-[var(--brand)]/30 hover:shadow-[0_25px_60px_rgba(16,16,20,0.12),0_0_0_1px_rgba(245,51,59,0.1)]"
              >
                {/* Glowing red accent line that animates on hover */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 rounded-full bg-[var(--brand)] opacity-0 shadow-[0_0_16px_rgba(245,51,59,0.85)] transition-all duration-500 group-hover:scale-x-100 group-hover:opacity-100"
                />

                {/* Corner red glow accent */}
                <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 origin-top-right scale-0 bg-gradient-to-br from-[var(--brand)]/15 via-[var(--brand-2)]/10 to-transparent opacity-0 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-100" />

                {/* Custom Stylized Visual Graphic Placeholder */}
                <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-[#141217] via-[#1d171d] to-[#0e0d11] p-6">
                  {/* Top Badges */}
                  <div className="absolute left-4 top-4 z-10 flex items-center gap-2">
                    <span className="font-display text-2xl font-extrabold text-[var(--brand)]">
                      {p.number}
                    </span>
                    <span className="rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-bold text-[var(--ink)] backdrop-blur-sm shadow-sm">
                      {p.year}
                    </span>
                  </div>

                  <div className="absolute right-4 top-4 z-10">
                    <span className="rounded-full bg-[var(--brand)]/80 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm shadow-sm">
                      {p.impact}
                    </span>
                  </div>

                  {/* Interactive Graphic Preview */}
                  <ProjectGraphicPlaceholder type={p.previewType} name={p.name} />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-30" />
                </div>

                {/* Content Section */}
                <div className="relative p-6 sm:p-8">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--brand)]">
                      {p.category} · {p.client}
                    </p>
                    <ArrowUpRight className="h-5 w-5 -translate-y-1 translate-x-1 text-[var(--brand)] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
                  </div>

                  <h3 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-[var(--ink)] transition-colors duration-300 group-hover:text-[var(--brand)] sm:text-3xl">
                    {p.name}
                  </h3>

                  <p className="mt-3 text-[15px] leading-relaxed text-[var(--ink-soft)]">
                    {p.blurb}
                  </p>

                  {/* Tags */}
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <li
                        key={t}
                        className="rounded-full border border-[var(--line)] bg-[var(--paper-2)] px-3 py-1 text-xs font-medium text-[var(--ink-soft)] transition-all duration-300 group-hover:border-[var(--brand)]/30 group-hover:bg-[var(--brand)]/5 group-hover:text-[var(--brand)]"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>

                  {/* Explore Details CTA Prompt */}
                  <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--brand)] transition-all duration-300 group-hover:translate-x-1">
                    <span>Explore Case Details</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* List View Layout */
          <div className="flex flex-col gap-4">
            {filteredProjects.map((p) => (
              <article
                key={p.id}
                data-reveal
                onClick={() => setSelectedProject(p)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-6 shadow-sm transition-all duration-300 hover:border-[var(--brand)]/30 hover:shadow-lg sm:p-8"
              >
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div className="max-w-2xl">
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

                    <h3 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-[var(--ink)] transition-colors group-hover:text-[var(--brand)]">
                      {p.name}
                    </h3>

                    <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
                      {p.blurb}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
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

                  <div className="flex shrink-0 items-center justify-between gap-4 border-t border-[var(--line)] pt-4 md:border-t-0 md:pt-0">
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

      {/* ================= PROCESS SECTION (Services Step-by-Step Style) ================= */}
      <section className="px-6 py-24 sm:px-10 lg:px-20">
        <div data-reveal className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--brand)]">
            Execution Method
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-[var(--ink)] sm:text-4xl">
            How we ship, step by step
          </h2>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
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
      <section className="px-6 pb-20 sm:px-10 lg:px-20">
        <div
          data-reveal
          className="relative overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--paper-2)] p-10 shadow-lg sm:p-12 lg:p-14"
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
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-[var(--ink)] sm:text-4xl">
              Proven momentum across every release.
            </h2>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((s) => {
              const Icon = s.icon
              return (
                <div
                  key={s.label}
                  className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-6 shadow-sm transition-all duration-300 hover:border-[var(--brand)]/30 hover:shadow-md"
                >
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand)]/10 text-[var(--brand)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="font-display text-3xl font-extrabold tracking-tight text-[var(--ink)] sm:text-4xl">
                    {s.value}
                  </p>
                  <p className="mt-2 text-xs font-semibold text-[var(--ink-soft)]">
                    {s.label}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ================= CTA SECTION (Services CTA Style) ================= */}
      <section className="px-6 pb-28 sm:px-10 lg:px-20">
        <div
          data-reveal
          className="relative overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--paper-2)] p-8 sm:p-12"
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
          <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--brand)]/30 bg-[var(--brand)]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--brand)]">
                <Zap className="h-3.5 w-3.5" />
                Available Q3/Q4 2025
              </span>
              <h2 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-[var(--ink)] sm:text-3xl">
                Could your product be next?
              </h2>
              <p className="mt-2 text-[var(--ink-soft)]">
                We take on a limited number of high-impact products each quarter. Tell us about your project.
              </p>
            </div>
            <Button asChild size="lg" className="shrink-0 group">
              <Link to="/contact" className="flex items-center gap-2">
                <span>Start a Project</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ================= PROJECT DETAIL QUICK-VIEW MODAL ================= */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10">
          <div
            onClick={() => setSelectedProject(null)}
            className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-300"
          />

          <div className="animate-modal-scale relative z-10 flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--paper)] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--line)] px-6 py-5 sm:px-8">
              <div className="flex items-center gap-3">
                <span className="font-display font-bold text-[var(--brand)]">
                  {selectedProject.number}
                </span>
                <span className="rounded-full bg-[var(--brand)]/10 px-3 py-1 text-xs font-bold text-[var(--brand)]">
                  {selectedProject.category}
                </span>
                <span className="text-xs font-semibold text-[var(--ink-soft)]">
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

            <div className="overflow-y-auto p-6 sm:p-8 space-y-8">
              <div>
                <h2 className="font-display text-3xl font-extrabold text-[var(--ink)] sm:text-4xl">
                  {selectedProject.name}
                </h2>
                <p className="mt-3 text-lg leading-relaxed text-[var(--ink-soft)]">
                  {selectedProject.description}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 rounded-2xl border border-[var(--line)] bg-[var(--paper-2)] p-4 sm:p-6">
                {selectedProject.metrics.map((m) => (
                  <div key={m.label}>
                    <p className="font-display text-xl font-extrabold text-[var(--brand)] sm:text-2xl">
                      {m.value}
                    </p>
                    <p className="text-xs font-semibold text-[var(--ink-soft)]">
                      {m.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="rounded-2xl border border-[var(--line)] p-6 bg-[var(--paper-2)]/50">
                  <h4 className="font-display text-base font-bold text-[var(--ink)]">
                    The Challenge
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
                    {selectedProject.challenge}
                  </p>
                </div>
                <div className="rounded-2xl border border-[var(--line)] p-6 bg-[var(--paper-2)]/50">
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

            <div className="flex items-center justify-between border-t border-[var(--line)] px-6 py-4 bg-[var(--paper-2)]/50">
              <span className="text-xs font-semibold text-[var(--ink-faint)]">
                Megacloudworks Case Study
              </span>
              <Button
                onClick={() => setSelectedProject(null)}
                className="bg-[var(--brand)] text-white hover:bg-[var(--brand-strong)]"
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

/**
 * Custom SVG & CSS Stylized Placeholder Graphic Component
 * Renders sleek, high-tech UI visual mockups matching brand palette
 */
function ProjectGraphicPlaceholder({
  type,
  name,
}: {
  type: Project['previewType']
  name: string
}) {
  switch (type) {
    case 'dashboard':
      return (
        <div className="relative h-full w-full rounded-xl border border-white/10 bg-[#161318]/90 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </div>
            <span className="font-mono text-[10px] text-white/40">
              {name.toLowerCase().replace(/\s+/g, '')}.io
            </span>
          </div>
          <div className="mt-3 space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-white/5 p-3">
              <div>
                <div className="h-2 w-20 rounded bg-white/30" />
                <div className="mt-2 h-4 w-28 rounded bg-gradient-to-r from-[var(--brand)] to-orange-400" />
              </div>
              <div className="h-8 w-8 rounded-lg bg-[var(--brand)]/20 flex items-center justify-center text-[var(--brand)]">
                <BarChart3 className="h-4 w-4" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="h-16 rounded-lg bg-white/5 p-2.5">
                <div className="h-2 w-12 rounded bg-white/20" />
                <div className="mt-2 h-3 w-16 rounded bg-emerald-400/80" />
              </div>
              <div className="h-16 rounded-lg bg-white/5 p-2.5">
                <div className="h-2 w-12 rounded bg-white/20" />
                <div className="mt-2 h-3 w-16 rounded bg-amber-400/80" />
              </div>
            </div>
          </div>
        </div>
      )

    case 'mobile':
      return (
        <div className="flex h-full w-full items-center justify-center">
          <div className="relative h-[90%] w-48 rounded-[28px] border-4 border-white/20 bg-[#161215] p-3 shadow-2xl">
            <div className="mx-auto h-3 w-16 rounded-full bg-white/20" />
            <div className="mt-4 flex flex-col items-center justify-center text-center">
              <div className="h-14 w-14 rounded-full border-2 border-[var(--brand)]/60 bg-[var(--brand)]/20 flex items-center justify-center text-[var(--brand)]">
                <Smartphone className="h-6 w-6" />
              </div>
              <div className="mt-3 h-3 w-24 rounded bg-white/40" />
              <div className="mt-2 h-2 w-16 rounded bg-white/20" />
            </div>
            <div className="mt-5 space-y-2">
              <div className="h-8 rounded-xl bg-white/10 p-2 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <div className="h-2 w-20 rounded bg-white/30" />
              </div>
              <div className="h-8 rounded-xl bg-white/10 p-2 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[var(--brand)]" />
                <div className="h-2 w-16 rounded bg-white/30" />
              </div>
            </div>
          </div>
        </div>
      )

    case 'code':
      return (
        <div className="h-full w-full rounded-xl border border-white/10 bg-[#0d0c10] p-4 font-mono text-[11px] text-white/80">
          <div className="flex items-center gap-2 border-b border-white/10 pb-2 text-white/40">
            <Code2 className="h-3.5 w-3.5 text-[var(--brand)]" />
            <span>api.ledger.dev/v1/stream</span>
          </div>
          <div className="mt-3 space-y-1.5 text-xs">
            <p className="text-emerald-400">
              <span className="text-purple-400">POST</span> /v1/transactions/sync
            </p>
            <p className="text-white/40">Host: api.ledger.io</p>
            <p className="text-white/40">Authorization: Bearer sk_live_99x</p>
            <div className="mt-3 rounded-lg bg-white/5 p-2 text-amber-300/90">
              {`{ "status": 200, "latency": "14ms", "synced": true }`}
            </div>
          </div>
        </div>
      )

    case 'brand':
      return (
        <div className="flex h-full w-full flex-col justify-between rounded-xl border border-white/10 bg-gradient-to-br from-[#1d1216] to-[#120d12] p-5">
          <div className="flex items-center justify-between">
            <span className="font-display font-extrabold tracking-widest text-white/90">
              MERIDIAN
            </span>
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/60">
              Collection &apos;25
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="aspect-square rounded-lg bg-[var(--brand)]/30 border border-[var(--brand)]/40" />
            <div className="aspect-square rounded-lg bg-amber-500/20 border border-amber-500/30" />
            <div className="aspect-square rounded-lg bg-rose-500/20 border border-rose-500/30" />
          </div>
          <div className="h-3 w-3/4 rounded bg-white/20" />
        </div>
      )

    case 'ai':
      return (
        <div className="relative h-full w-full rounded-xl border border-white/10 bg-[#140f16] p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-400">
            <Cpu className="h-4 w-4 animate-spin" />
            <span>Neural Diffusion Canvas</span>
          </div>
          <div className="mt-4 flex items-center justify-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 font-mono text-[10px]">
              Prompt
            </div>
            <div className="h-0.5 w-8 bg-gradient-to-r from-purple-500 to-[var(--brand)]" />
            <div className="h-16 w-16 rounded-xl bg-[var(--brand)]/20 border border-[var(--brand)]/40 flex items-center justify-center text-[var(--brand)] shadow-lg shadow-[var(--brand)]/20">
              <Sparkles className="h-6 w-6" />
            </div>
          </div>
        </div>
      )

    case 'iot':
      return (
        <div className="h-full w-full rounded-xl border border-white/10 bg-[#0e1417] p-4">
          <div className="flex items-center justify-between text-xs text-cyan-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              <span>Fleet Telemetry</span>
            </div>
            <span className="font-mono text-[10px] text-white/40">18.5k Online</span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-white/5 p-2 text-center">
              <p className="text-[10px] text-white/50">Avg Battery</p>
              <p className="font-display text-lg font-bold text-emerald-400">94%</p>
            </div>
            <div className="rounded-lg bg-white/5 p-2 text-center">
              <p className="text-[10px] text-white/50">Est Range</p>
              <p className="font-display text-lg font-bold text-cyan-400">310 mi</p>
            </div>
          </div>
        </div>
      )

    default:
      return null
  }
}
