export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--line)]">
      <div className="mx-auto flex max-w-[1100px] flex-col items-center gap-4 px-5 py-16 text-center sm:px-8">
        <a href="#top" className="flex items-center no-underline">
          <img src="/logo.svg" alt="Megacloudworks" className="h-6 w-auto" />
        </a>

        <a
          href="mailto:hello@megacloudworks.com"
          className="text-sm font-medium text-[var(--ink-soft)] no-underline transition-colors hover:text-[var(--brand)]"
        >
          hello@megacloudworks.com
        </a>

        <p className="text-xs text-[var(--ink-faint)]">
          © {new Date().getFullYear()} Megacloudworks. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default SiteFooter
