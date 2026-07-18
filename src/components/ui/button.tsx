import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '#/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
  {
    variants: {
      variant: {
        default:
          'bg-[var(--brand)] text-white shadow-[0_10px_30px_-8px_rgba(245,51,59,0.6)] hover:bg-[var(--brand-strong)] active:translate-y-px',
        outline:
          'border border-[var(--line-strong)] bg-transparent text-[var(--ink)] hover:bg-[var(--paper-2)]',
        ghost: 'text-[var(--ink)] hover:bg-[var(--paper-2)]',
        link: 'text-[var(--brand)] underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-11 px-6 has-[>svg]:px-5',
        sm: 'h-9 px-4',
        lg: 'h-12 px-8 text-base',
        icon: 'size-11',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
