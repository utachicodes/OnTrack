'use client'

import { useEffect, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'

function Dialog({
  open,
  onClose,
  children,
  className,
}: {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
}) {
  const backdropRef = useRef<HTMLDivElement>(null)

  const handleBackdrop = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === backdropRef.current) onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdrop}
      className="fixed inset-0 z-50 grid place-items-center bg-[rgba(20,24,40,0.45)] p-5"
    >
      <div
        data-slot="dialog"
        className={cn(
          'flex w-full max-w-[420px] flex-col gap-4 rounded-2xl bg-surface p-6 shadow-[0_20px_60px_rgba(20,24,40,0.18)]',
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

function DialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="dialog-header"
      className={cn('flex items-start justify-between', className)}
      {...props}
    />
  )
}

function DialogTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      data-slot="dialog-title"
      className={cn('font-display text-lg font-bold leading-tight tracking-tight text-text-primary', className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      data-slot="dialog-description"
      className={cn('text-xs text-text-secondary', className)}
      {...props}
    />
  )
}

function DialogClose({
  onClick,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      data-slot="dialog-close"
      type="button"
      onClick={onClick}
      className={cn(
        'border-0 bg-transparent p-1.5 text-text-secondary transition-colors hover:text-text-primary',
        className
      )}
      {...props}
    />
  )
}

export { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogClose }
