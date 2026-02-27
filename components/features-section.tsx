'use client'

import { useEffect, useRef, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Hand, Palette, Wand2, Layers, MonitorPlay, Gauge } from 'lucide-react'

const features = [
  {
    icon: Hand,
    title: 'Hand Tracking',
    description: 'Real-time hand detection using MediaPipe. Open your hand to unleash elemental effects.',
    color: 'text-neon-fire',
    bg: 'bg-neon-fire/10',
  },
  {
    icon: Palette,
    title: 'Multiple Powers',
    description: 'Switch between Fire & Ice, Lightning, and Red & Blue modes with keyboard shortcuts.',
    color: 'text-neon-ice',
    bg: 'bg-neon-ice/10',
  },
  {
    icon: Wand2,
    title: 'Pinch to Draw',
    description: 'Pinch your fingers to paint with elemental particles that persist on screen.',
    color: 'text-neon-lightning',
    bg: 'bg-neon-lightning/10',
  },
  {
    icon: Layers,
    title: 'Depth Effects',
    description: 'Dynamic lighting, radial glow, and multi-layer compositing for cinematic visuals.',
    color: 'text-neon-fire',
    bg: 'bg-neon-fire/10',
  },
  {
    icon: MonitorPlay,
    title: 'Live Camera',
    description: 'Your webcam feed becomes the canvas backdrop with dynamic dark-mode processing.',
    color: 'text-neon-ice',
    bg: 'bg-neon-ice/10',
  },
  {
    icon: Gauge,
    title: '60 FPS Target',
    description: 'Optimized particle system and rendering pipeline for smooth, responsive experience.',
    color: 'text-neon-lightning',
    bg: 'bg-neon-lightning/10',
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

export function FeaturesSection() {
  const { ref: sectionRef, inView } = useInView(0.1)

  return (
    <section id="features" ref={sectionRef} className="relative bg-background px-6 py-24 md:px-12">
      {/* Section glow divider */}
      <div className="pointer-events-none absolute inset-x-0 top-0">
        <div className="mx-auto h-px w-1/2 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </div>

      <div className="mx-auto max-w-6xl">
        <div
          className={`mb-16 text-center transition-all duration-700 ${inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
        >
          <h2 className="text-balance text-3xl font-bold tracking-tight md:text-5xl">
            <span className="text-foreground">Powered by </span>
            <span className="bg-gradient-to-r from-neon-fire via-neon-lightning to-neon-ice bg-clip-text text-transparent">
              Real Magic
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-muted-foreground md:text-lg">
            Your webcam becomes a portal to elemental powers. No controllers, no special equipment needed.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`transition-all duration-500 ${inView ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
              style={{ transitionDelay: inView ? `${index * 100}ms` : '0ms' }}
            >
              <Card className="group relative overflow-hidden border-border bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                <CardContent className="p-6">
                  <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl ${feature.bg} transition-transform duration-300 group-hover:scale-110`}>
                    <feature.icon className={`h-5 w-5 ${feature.color}`} />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
