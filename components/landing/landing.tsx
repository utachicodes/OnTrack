'use client'

import { Navbar } from './navbar'
import { Hero } from './hero'

export function Landing() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <Hero />
    </div>
  )
}
