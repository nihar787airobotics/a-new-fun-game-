'use client'

import { useEffect, useState } from 'react'
import { Play, Sparkles, Flame, Snowflake, Zap } from 'lucide-react'
import Link from 'next/link'
import { Suspense, lazy } from 'react'

const LazySpline = lazy(() => import('@splinetool/react-spline'))

function SplineFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="relative flex h-64 w-64 items-center justify-center">
        <div className="absolute h-full w-full animate-spin rounded-full border border-neon-fire/20" style={{ animationDuration: '8s' }} />
        <div className="absolute h-3/4 w-3/4 animate-spin rounded-full border border-neon-ice/20" style={{ animationDuration: '6s', animationDirection: 'reverse' }} />
        <div className="absolute h-1/2 w-1/2 animate-spin rounded-full border border-neon-lightning/20" style={{ animationDuration: '4s' }} />
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
      </div>
    </div>
  )
}

function Spline3DScene() {
  const [showSpline, setShowSpline] = useState(false)

  useEffect(() => {
    // Delay loading Spline to not block initial render
    const timer = setTimeout(() => setShowSpline(true), 500)
    return () => clearTimeout(timer)
  }, [])

  if (!showSpline) {
    return <SplineFallback />
  }

  return (
    <Suspense fallback={<SplineFallback />}>
      <LazySpline
        scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
        className="h-full w-full"
      />
    </Suspense>
  )
}

export function HeroSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="relative min-h-screen overflow-hidden bg-background">
      {/* Ambient glow effects */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full blur-[128px]"
          style={{ background: 'oklch(0.75 0.2 40 / 0.08)' }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full blur-[128px]"
          style={{ background: 'oklch(0.7 0.15 210 / 0.08)' }}
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-5 md:px-12">
        <div
          className={`flex items-center gap-2 transition-all duration-700 ${mounted ? 'translate-x-0 opacity-100' : '-translate-x-5 opacity-0'}`}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">
            {'Play & Draw 3D'}
          </span>
        </div>

        <div
          className={`hidden items-center gap-8 md:flex transition-all duration-700 ${mounted ? 'translate-x-0 opacity-100' : 'translate-x-5 opacity-0'}`}
        >
          <a href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Features</a>
          <a href="#controls" className="text-sm text-muted-foreground transition-colors hover:text-foreground">How to Play</a>
          <Link href="/play" className="text-sm font-medium text-primary transition-colors hover:text-primary/80">Launch Game</Link>
        </div>
      </nav>

      {/* Main content */}
      <div className="relative z-10 flex min-h-[calc(100vh-76px)] flex-col lg:flex-row">
        {/* Left side - Text content */}
        <div className="flex flex-1 flex-col justify-center px-6 py-12 md:px-12 lg:py-0">
          <div
            className={`mb-4 transition-all duration-700 delay-200 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-xs font-medium text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              Hand-Tracking Powered
            </span>
          </div>

          <h1
            className={`text-balance text-5xl font-bold leading-tight tracking-tight md:text-7xl lg:text-8xl transition-all duration-700 delay-300 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
          >
            <span className="text-foreground">Play.</span>
            <br />
            <span className="bg-gradient-to-r from-neon-fire to-neon-lightning bg-clip-text text-transparent">Draw.</span>
            <br />
            <span className="text-foreground">Enjoy</span>{' '}
            <span className="bg-gradient-to-r from-neon-ice to-accent bg-clip-text text-transparent">Colors.</span>
          </h1>

          <p
            className={`mt-6 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg transition-all duration-700 delay-[400ms] ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
          >
            Unleash fire, ice, and lightning from your hands. An immersive hand-tracking experience that turns your webcam into a creative playground.
          </p>

          <div
            className={`mt-8 flex flex-col gap-4 sm:flex-row sm:items-center transition-all duration-700 delay-500 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
          >
            <Link href="/play" className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl animate-glow-pulse">
              <Play className="h-5 w-5 transition-transform group-hover:scale-110" />
              Click to Play
            </Link>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="h-px w-8 bg-border" />
              No install needed
            </div>
          </div>

          {/* Power indicators */}
          <div
            className={`mt-12 flex items-center gap-6 transition-all duration-700 delay-700 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: 'oklch(0.75 0.2 40 / 0.1)' }}>
                <Flame className="h-4 w-4 text-neon-fire" />
              </div>
              Fire
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: 'oklch(0.7 0.15 210 / 0.1)' }}>
                <Snowflake className="h-4 w-4 text-neon-ice" />
              </div>
              Ice
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: 'oklch(0.85 0.12 90 / 0.1)' }}>
                <Zap className="h-4 w-4 text-neon-lightning" />
              </div>
              Lightning
            </div>
          </div>
        </div>

        {/* Right side - 3D Visual */}
        <div
          className={`flex flex-1 items-center justify-center p-4 lg:p-0 transition-all duration-1000 delay-300 ${mounted ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}
        >
          <div className="relative h-[400px] w-full max-w-xl lg:h-[600px] lg:max-w-none">
            <Spline3DScene />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className={`absolute bottom-8 left-1/2 z-10 -translate-x-1/2 transition-all duration-700 delay-[1200ms] ${mounted ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">Scroll to explore</span>
          <div className="flex h-8 w-5 items-start justify-center rounded-full border border-border p-1">
            <div className="h-2 w-1.5 animate-bounce rounded-full bg-primary" />
          </div>
        </div>
      </div>
    </section>
  )
}
