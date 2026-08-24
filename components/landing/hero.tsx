'use client'

import { useEffect, useState } from 'react'

export function Hero() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const t = window.setTimeout(() => setMounted(true), 300)
    return () => window.clearTimeout(t)
  }, [])

  return (
    <section className="relative w-full h-screen overflow-hidden flex items-end justify-center">
      {/* Background video */}
      <div
        className={`absolute inset-0 transition-[transform,opacity] duration-[1400ms] ease-entrance ${
          mounted ? 'scale-100 opacity-100' : 'scale-105 opacity-0'
        }`}
      >
        <video
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260819_212700_3bb9329b-5c50-4257-a09b-ca85cf3654a3.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        />
      </div>

      {/* Foreground */}
      <div className="relative z-10 text-center px-6 pb-16 md:pb-24 max-w-4xl mx-auto">
        <h1
          className={`font-instrument text-white text-[2.5rem] leading-[0.95] sm:text-5xl md:text-6xl lg:text-7xl mb-5 md:mb-6 transition-[transform,opacity] duration-900 ease-entrance ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: mounted ? '400ms' : '0ms' }}
        >
          A carefully curated
          <br className="hidden sm:block" /> collection beyond compare
        </h1>

        <p
          className={`text-white/70 text-base md:text-lg mb-8 md:mb-10 max-w-md mx-auto transition-[transform,opacity] duration-900 ease-entrance ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: mounted ? '600ms' : '0ms' }}
        >
          Reserve your place in our private gallery.
        </p>

        <a
          href="#"
          className={`inline-block px-8 py-3.5 bg-white text-black text-sm md:text-base font-medium rounded-full hover:bg-white/90 transition-[transform,opacity] duration-900 ease-entrance ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: mounted ? '800ms' : '0ms' }}
        >
          Join the waitlist
        </a>
      </div>
    </section>
  )
}
