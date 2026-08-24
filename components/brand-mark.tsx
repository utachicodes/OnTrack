'use client'

import Image from 'next/image'
import type { CSSProperties } from 'react'

interface BrandMarkProps {
  height?: number
  variant?: 'full' | 'mark'
  className?: string
  priority?: boolean
  style?: CSSProperties
}

export function BrandMark({ height = 32, variant = 'full', className, priority, style }: BrandMarkProps) {
  const width = variant === 'mark' ? height * 1.7 : height * 3.4
  return (
    <Image
      src="/logo.png"
      alt="Utachi Industries"
      width={Math.round(width)}
      height={height}
      className={className}
      style={{ height, width: 'auto', ...style }}
      priority={priority}
    />
  )
}