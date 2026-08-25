import { cn } from '@/lib/utils'

function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      data-slot="label"
      className={cn(
        'flex flex-col gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-text-secondary',
        className
      )}
      {...props}
    />
  )
}

export { Label }
