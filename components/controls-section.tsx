'use client'

import { useEffect, useRef, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Flame, Snowflake, Zap, Hand, Grab, Play } from 'lucide-react'
import Link from 'next/link'

const controls = [
  {
    key: '1',
    label: 'Fire & Ice',
    description: 'Left hand summons fire, right hand conjures ice',
    icons: [Flame, Snowflake],
    colors: ['text-neon-fire', 'text-neon-ice'],
  },
  {
    key: '2',
    label: 'Lightning',
    description: 'Open your hands to call down lightning bolts',
    icons: [Zap],
    colors: ['text-neon-lightning'],
  },
  {
    key: '3',
    label: 'Red & Blue',
    description: 'Pure elemental glow in red and blue energy',
    icons: [Flame, Snowflake],
    colors: ['text-destructive', 'text-neon-ice'],
  },
]

const gestures = [
  {
    icon: Hand,
    label: 'Open Hand',
    description: 'Spread fingers to activate your chosen power and build intensity',
  },
  {
    icon: Grab,
    label: 'Pinch',
    description: 'Touch thumb and index finger together to paint with particles',
  },
]

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, inView }
}

export function ControlsSection() {
  const { ref: sectionRef, inView } = useInView(0.1)

  return (
    <section id="controls" ref={sectionRef} className="relative bg-background px-6 py-24 md:px-12">
      <div className="pointer-events-none absolute inset-x-0 top-0">
        <div className="mx-auto h-px w-1/2 bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
      </div>

      <div className="mx-auto max-w-6xl">
        <div
          className={`mb-16 text-center transition-all duration-700 ${inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
        >
          <h2 className="text-balance text-3xl font-bold tracking-tight md:text-5xl text-foreground">
            How to Play
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-muted-foreground md:text-lg">
            Master your elemental powers with simple hand gestures and keyboard shortcuts.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Power modes */}
          <div
            className={`transition-all duration-700 delay-100 ${inView ? 'translate-x-0 opacity-100' : '-translate-x-5 opacity-0'}`}
          >
            <h3 className="mb-6 text-xl font-semibold text-foreground">Power Modes</h3>
            <div className="flex flex-col gap-4">
              {controls.map((ctrl) => (
                <Card key={ctrl.key} className="border-border bg-card transition-all duration-300 hover:border-primary/30">
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary font-mono text-lg font-bold text-foreground">
                      {ctrl.key}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">{ctrl.label}</span>
                        <div className="flex items-center gap-1">
                          {ctrl.icons.map((Icon, i) => (
                            <Icon key={i} className={`h-4 w-4 ${ctrl.colors[i]}`} />
                          ))}
                        </div>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{ctrl.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Gestures */}
          <div
            className={`transition-all duration-700 delay-200 ${inView ? 'translate-x-0 opacity-100' : 'translate-x-5 opacity-0'}`}
          >
            <h3 className="mb-6 text-xl font-semibold text-foreground">Hand Gestures</h3>
            <div className="flex flex-col gap-4">
              {gestures.map((gesture) => (
                <Card key={gesture.label} className="border-border bg-card transition-all duration-300 hover:border-accent/30">
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                      <gesture.icon className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <span className="font-semibold text-foreground">{gesture.label}</span>
                      <p className="mt-1 text-sm text-muted-foreground">{gesture.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* CTA */}
            <div
              className={`mt-8 transition-all duration-700 delay-300 ${inView ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}
            >
              <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
                <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
                  <h3 className="text-2xl font-bold text-foreground">Ready to Play?</h3>
                  <p className="text-sm text-muted-foreground">Allow camera access and start creating.</p>
                  <Link
                    href="/play"
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3 font-semibold text-primary-foreground transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                  >
                    <Play className="h-5 w-5" />
                    Launch Game
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
