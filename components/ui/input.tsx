import { cn } from '@/lib/utils'

function Input({
  className,
  type = 'text',
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'flex h-10 w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-foreground transition-colors',
        'placeholder:text-text-tertiary',
        'focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/10 focus-visible:outline-none',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'aria-invalid:border-danger aria-invalid:ring-3 aria-invalid:ring-danger/10',
        className
      )}
      {...props}
    />
  )
}

export { Input }
