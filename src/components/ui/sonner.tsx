import { Toaster as Sonner, type ToasterProps } from 'sonner'

function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      theme="system"
      className="toaster group"
      position="bottom-center"
      toastOptions={{
        classNames: {
          toast:
            'group toast rounded-2xl border border-[var(--line)] bg-[var(--paper)] text-[var(--ink)] shadow-lg',
          description: 'text-[var(--ink-soft)]',
          actionButton: 'bg-[var(--brand)] text-white',
          cancelButton: 'bg-[var(--paper-2)] text-[var(--ink-soft)]',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
