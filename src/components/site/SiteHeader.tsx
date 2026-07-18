import { Button } from '#/components/ui/button'

const NAV = [
  { label: 'What we do', href: '#what-we-do' },
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: 'mailto:hello@megacloudworks.com' },
]

export function SiteHeader() {
  const scrollToNotify = () => {
    document
      .getElementById('notify')
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    document.getElementById('notify-email')?.focus({ preventScroll: true })
  }

  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-3 px-5 py-5 sm:px-8">
        <a href="#top" className="flex shrink-0 items-center no-underline">
          <img
            src="/logo.svg"
            alt="Megacloudworks"
            className="h-6 w-auto sm:h-7"
          />
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-semibold text-[var(--ink)] no-underline transition-colors hover:text-[var(--brand)]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <Button size="sm" className="h-10 px-5" onClick={scrollToNotify}>
          Get notified
        </Button>
      </div>
    </header>
  )
}

export default SiteHeader
