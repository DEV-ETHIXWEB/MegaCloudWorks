import { Button } from '#/components/ui/button'

export function SiteHeader() {
  const scrollToNotify = () => {
    document
      .getElementById('notify')
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    document.getElementById('notify-email')?.focus({ preventScroll: true })
  }

  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-[7px] py-5 sm:px-[11px]">
        <a href="#top" className="flex shrink-0 items-center no-underline">
          <img
            src="/logo-resized.svg"
            alt="Megacloudworks"
            className="h-[30px] w-auto sm:h-[34px]"
          />
        </a>

        <Button size="sm" className="h-10 px-5" onClick={scrollToNotify}>
          Get notified
        </Button>
      </div>
    </header>
  )
}

export default SiteHeader
