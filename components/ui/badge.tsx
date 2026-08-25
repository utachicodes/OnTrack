import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary/10 text-primary',
        secondary: 'border-transparent bg-muted text-text-secondary',
        outline: 'border-border text-text-secondary',
        coral: 'border-transparent bg-[#fff5f3] text-[#ee705f]',
        emerald: 'border-transparent bg-[#ebf7ef] text-[#5fb87e]',
        amber: 'border-transparent bg-[#f4e6cf] text-[#d4a05a]',
        indigo: 'border-transparent bg-[#edf2ff] text-[#5266b6]',
        danger: 'border-transparent bg-danger-soft text-danger',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return (
    <div
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
