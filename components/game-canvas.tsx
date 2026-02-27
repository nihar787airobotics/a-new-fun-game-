'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Flame, Snowflake, Zap, ArrowLeft, Sparkles, Trash2, Camera, CameraOff } from 'lucide-react'
import Link from 'next/link'

type PowerMode = 'fire_ice' | 'lightning' | 'red_blue'

const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [17, 18], [18, 19], [19, 20],
  [0, 17],
]

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  decay: number
  size: number
  type: string
}

interface LightningBolt {
  path: { x: number; y: number }[]
  life: number
  color: string
}

export function GameCanvas() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [currentPower, setCurrentPower] = useState<PowerMode>('fire_ice')
  const [cameraActive, setCameraActive] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const particlesRef = useRef<Particle[]>([])
  const lightningBoltsRef = useRef<LightningBolt[]>([])
  const handIntensitiesRef = useRef([0, 0])
  const handSurgesRef = useRef([0, 0])
  const lastHandOpenStateRef = useRef([false, false])
  const lightningIntensityRef = useRef(0)
  const startTimeRef = useRef<number | null>(null)
  const currentPowerRef = useRef<PowerMode>('fire_ice')
  const pointingStateRef = useRef({
    left: { frames: 0, active: false, lastWrist: null as { x: number; y: number } | null },
    right: { frames: 0, active: false, lastWrist: null as { x: number; y: number } | null },
  })

  // Keep ref in sync with state
  useEffect(() => {
    currentPowerRef.current = currentPower
  }, [currentPower])

  const spawnParticle = useCallback((x: number, y: number, type: string, isDrawing: boolean, handIndex: number) => {
    const intensities = handIntensitiesRef.current
    const surges = handSurgesRef.current
    if (!isDrawing && Math.random() > intensities[handIndex]) return
    const count = isDrawing ? 2 : 1
    for (let i = 0; i < count; i++) {
      const isIceType = type === 'ice' || type === 'blue'
      particlesRef.current.push({
        x: x + (Math.random() - 0.5) * (isDrawing ? 10 : 15),
        y: y + (Math.random() - 0.5) * (isDrawing ? 10 : 15),
        vx: isDrawing ? 0 : (Math.random() - 0.5) * 4,
        vy: isDrawing ? 0 : isIceType
          ? ((Math.random() * -5) - 2) - (surges[handIndex] * 15)
          : ((Math.random() * -10) - 4) - (surges[handIndex] * 20),
        life: 1.0,
        decay: isDrawing ? 0.0055 : 0.06,
        size: isDrawing ? (Math.random() * 20 + 20) : (Math.random() * 22 + 8),
        type,
      })
    }
  }, [])

  const spawnLightning = useCallback((x: number, y: number) => {
    if (Math.random() > lightningIntensityRef.current) return
    const bolt: { x: number; y: number }[] = []
    let cx = x
    let cy = y
    for (let i = 0; i < 25; i++) {
      bolt.push({ x: cx, y: cy })
      cx += (Math.random() - 0.5) * 80
      cy += (Math.random() - 0.8) * 80
    }
    lightningBoltsRef.current.push({
      path: bolt,
      life: 1.0,
      color: Math.random() > 0.5 ? '#e0ffff' : '#00bfff',
    })
  }, [])

  const isHandOpen = useCallback((landmarks: { x: number; y: number }[]) => {
    let open = 0
    const wrist = landmarks[0]
    const tips = [8, 12, 16, 20]
    const pips = [6, 10, 14, 18]
    for (let i = 0; i < tips.length; i++) {
      const tip = landmarks[tips[i]]
      const pip = landmarks[pips[i]]
      const dTip = Math.hypot(tip.x - wrist.x, tip.y - wrist.y)
      const dPip = Math.hypot(pip.x - wrist.x, pip.y - wrist.y)
      if (dTip > dPip) open++
    }
    return open >= 3
  }, [])

  const isPinchingInternal = useCallback((landmarks: { x: number; y: number }[], state: { frames: number; active: boolean; lastWrist: { x: number; y: number } | null }) => {
    const thumb = landmarks[4]
    const index = landmarks[8]
    const wrist = landmarks[0]

    let velocity = 0
    if (state.lastWrist) {
      velocity = Math.hypot(wrist.x - state.lastWrist.x, wrist.y - state.lastWrist.y)
    }
    state.lastWrist = { x: wrist.x, y: wrist.y }

    if (velocity > 0.05) return false

    const fingers = [12, 16, 20]
    const pips = [10, 14, 18]
    let openCount = 0
    for (let i = 0; i < 3; i++) {
      const tip = landmarks[fingers[i]]
      const pip = landmarks[pips[i]]
      const dTip = Math.hypot(tip.x - wrist.x, tip.y - wrist.y)
      const dPip = Math.hypot(pip.x - wrist.x, pip.y - wrist.y)
      if (dTip > dPip) openCount++
    }
    if (openCount < 2) return false

    const pinchDist = Math.hypot(thumb.x - index.x, thumb.y - index.y)
    const midPip = landmarks[9]
    const handSize = Math.hypot(midPip.x - wrist.x, midPip.y - wrist.y)

    return pinchDist < handSize * 0.35
  }, [])

  const isPinching = useCallback((landmarks: { x: number; y: number }[], isRightHand: boolean) => {
    const state = isRightHand ? pointingStateRef.current.right : pointingStateRef.current.left
    const raw = isPinchingInternal(landmarks, state)

    if (raw) {
      state.frames = 5
      state.active = true
    } else {
      state.frames--
      if (state.frames <= 0) state.active = false
    }
    return state.active
  }, [isPinchingInternal])

  const clearCanvas = useCallback(() => {
    particlesRef.current = []
    lightningBoltsRef.current = []
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '1') setCurrentPower('fire_ice')
      if (e.key === '2') setCurrentPower('lightning')
      if (e.key === '3') setCurrentPower('red_blue')
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    let handsInstance: unknown = null
    let cameraInstance: unknown = null
    let animFrame: number

    async function init() {
      try {
        setLoading(true)
        setError(null)

        // Load MediaPipe scripts
        await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js')
        await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js')

        const video = videoRef.current
        const canvas = canvasRef.current
        if (!video || !canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const Hands = (window as any).Hands
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const Camera = (window as any).Camera

        if (!Hands || !Camera) {
          setError('Failed to load MediaPipe. Please refresh.')
          setLoading(false)
          return
        }

        const hands = new Hands({
          locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
        })
        handsInstance = hands

        hands.setOptions({
          maxNumHands: 2,
          modelComplexity: 1,
          minDetectionConfidence: 0.65,
          minTrackingConfidence: 0.65,
        })

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        hands.onResults((results: any) => {
          canvas.width = window.innerWidth
          canvas.height = window.innerHeight

          if (!startTimeRef.current) startTimeRef.current = Date.now()

          ctx.save()
          ctx.clearRect(0, 0, canvas.width, canvas.height)

          // Draw mirrored video
          ctx.save()
          ctx.scale(-1, 1)
          ctx.drawImage(results.image, -canvas.width, 0, canvas.width, canvas.height)
          ctx.restore()

          // Dark overlay
          ctx.globalCompositeOperation = 'multiply'
          ctx.fillStyle = 'rgba(10, 5, 0, 0.5)'
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          ctx.globalCompositeOperation = 'source-over'

          const power = currentPowerRef.current

          if (results.multiHandLandmarks) {
            let anyHandOpen = false
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            results.multiHandLandmarks.forEach((landmarks: any) => {
              if (isHandOpen(landmarks)) anyHandOpen = true
            })

            if (power === 'lightning') {
              lightningIntensityRef.current += anyHandOpen ? 0.08 : -0.05
            } else {
              lightningIntensityRef.current -= 0.1
            }
            lightningIntensityRef.current = Math.max(0, Math.min(1, lightningIntensityRef.current))

            if (lightningIntensityRef.current > 0.01) {
              if (Math.random() < 0.5 * lightningIntensityRef.current) {
                ctx.fillStyle = `rgba(200, 220, 255, ${0.25 * lightningIntensityRef.current})`
                ctx.fillRect(0, 0, canvas.width, canvas.height)
              }

              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              results.multiHandLandmarks.forEach((landmarks: any) => {
                if (!isHandOpen(landmarks)) return
                const tips = [4, 8, 12, 16, 20]
                tips.forEach((tipIdx: number) => {
                  const pt = landmarks[tipIdx]
                  if (Math.random() < 0.07) spawnLightning(pt.x * canvas.width, pt.y * canvas.height)
                })
                HAND_CONNECTIONS.forEach(([s]) => {
                  if (Math.random() < 0.005) {
                    const start = landmarks[s]
                    spawnLightning(start.x * canvas.width, start.y * canvas.height)
                  }
                })
              })
            }

            // Process each hand
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            results.multiHandLandmarks.forEach((landmarks: any, index: number) => {
              const label = results.multiHandedness[index].label
              const isRightHand = label === 'Right'
              const targetIndex = isRightHand ? 1 : 0

              const isOpen = isHandOpen(landmarks)
              const isPinch = isPinching(landmarks, isRightHand)

              if (power === 'fire_ice' || power === 'red_blue') {
                handIntensitiesRef.current[targetIndex] += (isOpen || isPinch) ? 0.05 : -0.15
                if (isOpen && !lastHandOpenStateRef.current[targetIndex]) {
                  handSurgesRef.current[targetIndex] = 1.0
                }
              } else {
                handIntensitiesRef.current[targetIndex] -= 0.15
              }
              lastHandOpenStateRef.current[targetIndex] = isOpen
              handSurgesRef.current[targetIndex] *= 0.92
              if (handSurgesRef.current[targetIndex] < 0.01) handSurgesRef.current[targetIndex] = 0
              handIntensitiesRef.current[targetIndex] = Math.max(0, Math.min(1, handIntensitiesRef.current[targetIndex]))

              const intensity = handIntensitiesRef.current[targetIndex]
              if (intensity <= 0.01) return

              const palm = landmarks[9]
              const lx = palm.x * canvas.width
              const ly = palm.y * canvas.height

              // Pinch drawing
              if (isPinch && power === 'fire_ice') {
                const elapsed = Date.now() - (startTimeRef.current || 0)
                if (elapsed > 10000) {
                  const indexTip = landmarks[8]
                  const thumbTip = landmarks[4]
                  const tx = ((indexTip.x + thumbTip.x) / 2) * canvas.width
                  const ty = ((indexTip.y + thumbTip.y) / 2) * canvas.height
                  if (!isRightHand) spawnParticle(tx, ty, 'fire', true, 0)
                  else spawnParticle(tx, ty, 'ice', true, 1)
                }
              }

              // Glow and particles based on power
              if (power === 'red_blue') {
                if (!isRightHand) {
                  const flicker = Math.sin(Date.now() * 0.02) * 25
                  const glow = ctx.createRadialGradient(lx, ly, 0, lx, ly, 550 + flicker)
                  glow.addColorStop(0, `rgba(255, 0, 0, ${0.45 * intensity})`)
                  glow.addColorStop(0.5, `rgba(200, 0, 0, ${0.15 * intensity})`)
                  glow.addColorStop(1, 'rgba(0, 0, 0, 0)')
                  ctx.globalCompositeOperation = 'screen'
                  ctx.fillStyle = glow
                  ctx.fillRect(0, 0, canvas.width, canvas.height)
                  landmarks.forEach((pt: { x: number; y: number }) => spawnParticle(pt.x * canvas.width, pt.y * canvas.height, 'red', false, 0))
                } else {
                  const flicker = Math.sin(Date.now() * 0.01) * 20
                  const glow = ctx.createRadialGradient(lx, ly, 0, lx, ly, 400 + flicker)
                  glow.addColorStop(0, `rgba(0, 0, 255, ${0.4 * intensity})`)
                  glow.addColorStop(0.5, `rgba(0, 50, 255, ${0.1 * intensity})`)
                  glow.addColorStop(1, 'rgba(0, 0, 0, 0)')
                  ctx.globalCompositeOperation = 'screen'
                  ctx.fillStyle = glow
                  ctx.fillRect(0, 0, canvas.width, canvas.height)
                  landmarks.forEach((pt: { x: number; y: number }) => spawnParticle(pt.x * canvas.width, pt.y * canvas.height, 'blue', false, 1))
                }
              } else if (power === 'fire_ice') {
                if (!isRightHand) {
                  const flicker = Math.sin(Date.now() * 0.02) * 25
                  const glow = ctx.createRadialGradient(lx, ly, 0, lx, ly, 550 + flicker)
                  glow.addColorStop(0, `rgba(255, 60, 0, ${0.45 * intensity})`)
                  glow.addColorStop(0.5, `rgba(255, 30, 0, ${0.15 * intensity})`)
                  glow.addColorStop(1, 'rgba(0, 0, 0, 0)')
                  ctx.globalCompositeOperation = 'screen'
                  ctx.fillStyle = glow
                  ctx.fillRect(0, 0, canvas.width, canvas.height)
                  landmarks.forEach((pt: { x: number; y: number }) => spawnParticle(pt.x * canvas.width, pt.y * canvas.height, 'fire', false, 0))
                  HAND_CONNECTIONS.forEach(([s, e]) => {
                    const start = landmarks[s]
                    const end = landmarks[e]
                    spawnParticle(((start.x + end.x) / 2) * canvas.width, ((start.y + end.y) / 2) * canvas.height, 'fire', false, 0)
                  })
                } else {
                  const flicker = Math.sin(Date.now() * 0.01) * 20
                  const glow = ctx.createRadialGradient(lx, ly, 0, lx, ly, 400 + flicker)
                  glow.addColorStop(0, `rgba(100, 200, 255, ${0.4 * intensity})`)
                  glow.addColorStop(0.5, `rgba(0, 100, 255, ${0.1 * intensity})`)
                  glow.addColorStop(1, 'rgba(0, 0, 0, 0)')
                  ctx.globalCompositeOperation = 'screen'
                  ctx.fillStyle = glow
                  ctx.fillRect(0, 0, canvas.width, canvas.height)
                  landmarks.forEach((pt: { x: number; y: number }) => spawnParticle(pt.x * canvas.width, pt.y * canvas.height, 'ice', false, 1))
                  HAND_CONNECTIONS.forEach(([s, e]) => {
                    const start = landmarks[s]
                    const end = landmarks[e]
                    spawnParticle(((start.x + end.x) / 2) * canvas.width, ((start.y + end.y) / 2) * canvas.height, 'ice', false, 1)
                  })
                }
              }
            })
          }

          // Render particles
          ctx.globalCompositeOperation = 'lighter'
          const particles = particlesRef.current
          for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i]
            p.x += p.vx
            p.y += p.vy
            p.life -= (p.decay || 0.06)

            if (p.life <= 0) {
              particles.splice(i, 1)
            } else {
              const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size)
              if (p.type === 'ice') {
                gradient.addColorStop(0, `rgba(255, 255, 255, ${p.life})`)
                gradient.addColorStop(0.3, `rgba(180, 240, 255, ${p.life * 0.8})`)
                gradient.addColorStop(0.6, `rgba(0, 150, 255, ${p.life * 0.4})`)
              } else if (p.type === 'red') {
                gradient.addColorStop(0, `rgba(255, 200, 200, ${p.life})`)
                gradient.addColorStop(0.3, `rgba(255, 0, 0, ${p.life * 0.8})`)
                gradient.addColorStop(0.6, `rgba(100, 0, 0, ${p.life * 0.4})`)
              } else if (p.type === 'blue') {
                gradient.addColorStop(0, `rgba(200, 200, 255, ${p.life})`)
                gradient.addColorStop(0.3, `rgba(0, 0, 255, ${p.life * 0.8})`)
                gradient.addColorStop(0.6, `rgba(0, 0, 100, ${p.life * 0.4})`)
              } else {
                gradient.addColorStop(0, `rgba(255, 255, 220, ${p.life})`)
                gradient.addColorStop(0.2, `rgba(255, 180, 0, ${p.life * 0.8})`)
                gradient.addColorStop(0.5, `rgba(255, 40, 0, ${p.life * 0.4})`)
              }
              gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
              ctx.fillStyle = gradient
              ctx.beginPath()
              ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
              ctx.fill()
            }
          }

          // Render lightning
          const bolts = lightningBoltsRef.current
          for (let i = bolts.length - 1; i >= 0; i--) {
            const b = bolts[i]
            b.life -= 0.1
            if (b.life <= 0) {
              bolts.splice(i, 1)
            } else if (b.path.length > 0) {
              ctx.beginPath()
              ctx.moveTo(b.path[0].x, b.path[0].y)
              for (let j = 1; j < b.path.length; j++) {
                ctx.lineTo(b.path[j].x, b.path[j].y)
              }

              ctx.save()
              ctx.globalCompositeOperation = 'lighter'
              ctx.strokeStyle = b.color
              ctx.lineWidth = 20
              ctx.globalAlpha = b.life * 0.3
              ctx.shadowBlur = 30
              ctx.shadowColor = b.color
              ctx.stroke()
              ctx.restore()

              ctx.save()
              ctx.globalCompositeOperation = 'lighter'
              ctx.strokeStyle = b.color
              ctx.lineWidth = 8
              ctx.globalAlpha = b.life * 0.6
              ctx.stroke()
              ctx.restore()

              ctx.save()
              ctx.globalCompositeOperation = 'source-over'
              ctx.strokeStyle = '#ffffff'
              ctx.lineWidth = 2
              ctx.globalAlpha = b.life
              ctx.stroke()
              ctx.restore()
            }
          }

          ctx.restore()
        })

        const camera = new Camera(video, {
          onFrame: async () => {
            await hands.send({ image: video })
          },
          width: 1280,
          height: 720,
        })
        cameraInstance = camera
        await camera.start()
        setCameraActive(true)
        setLoading(false)
      } catch (err) {
        console.error('[v0] Game init error:', err)
        setError('Camera access required. Please allow camera permission and refresh.')
        setLoading(false)
      }
    }

    init()

    return () => {
      if (animFrame) cancelAnimationFrame(animFrame)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (cameraInstance) (cameraInstance as any).stop?.()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (handsInstance) (handsInstance as any).close?.()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      {/* Hidden video element */}
      <video ref={videoRef} className="hidden" />

      {/* Canvas - full screen */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        style={{ transform: 'scaleX(-1)' }}
      />

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="h-12 w-12 animate-spin rounded-full border-3 border-primary border-t-transparent" />
            <h2 className="text-xl font-bold text-white">Initializing Hand Tracking</h2>
            <p className="max-w-xs text-sm text-neutral-400">
              Loading MediaPipe and requesting camera access...
            </p>
          </div>
        </div>
      )}

      {/* Error overlay */}
      {error && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 text-center">
            <CameraOff className="h-12 w-12 text-destructive" />
            <h2 className="text-xl font-bold text-white">Camera Required</h2>
            <p className="max-w-xs text-sm text-neutral-400">{error}</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg bg-secondary px-6 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </div>
      )}

      {/* Top bar overlay */}
      <div className="absolute left-0 right-0 top-0 z-30 flex items-center justify-between px-4 py-3 md:px-6">
        <Link
          href="/"
          className="glass-panel flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Back</span>
        </Link>

        <div className="glass-panel flex items-center gap-2 rounded-xl px-4 py-2.5">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-white">{'Play & Draw 3D'}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={clearCanvas}
            className="glass-panel flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:bg-white/10"
            aria-label="Clear canvas"
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Clear</span>
          </button>
          <div className={`glass-panel flex items-center gap-2 rounded-xl px-3 py-2.5 ${cameraActive ? 'text-green-400' : 'text-neutral-500'}`}>
            {cameraActive ? <Camera className="h-4 w-4" /> : <CameraOff className="h-4 w-4" />}
          </div>
        </div>
      </div>

      {/* Power mode selector - bottom center */}
      <div className="absolute bottom-6 left-1/2 z-30 -translate-x-1/2">
        <div className="glass-panel flex items-center gap-1 rounded-2xl p-1.5">
          <button
            onClick={() => setCurrentPower('fire_ice')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
              currentPower === 'fire_ice'
                ? 'bg-white/15 text-white shadow-lg'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
            aria-label="Fire and Ice mode"
          >
            <Flame className={`h-4 w-4 ${currentPower === 'fire_ice' ? 'text-orange-400' : ''}`} />
            <span className="hidden sm:inline">Fire</span>
            <span className="hidden sm:inline text-neutral-500">{'&'}</span>
            <Snowflake className={`h-4 w-4 ${currentPower === 'fire_ice' ? 'text-cyan-400' : ''}`} />
            <span className="hidden sm:inline">Ice</span>
          </button>

          <button
            onClick={() => setCurrentPower('lightning')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
              currentPower === 'lightning'
                ? 'bg-white/15 text-white shadow-lg'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
            aria-label="Lightning mode"
          >
            <Zap className={`h-4 w-4 ${currentPower === 'lightning' ? 'text-yellow-400' : ''}`} />
            <span className="hidden sm:inline">Lightning</span>
          </button>

          <button
            onClick={() => setCurrentPower('red_blue')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
              currentPower === 'red_blue'
                ? 'bg-white/15 text-white shadow-lg'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
            aria-label="Red and Blue mode"
          >
            <div className={`h-3 w-3 rounded-full ${currentPower === 'red_blue' ? 'bg-red-500' : 'bg-neutral-500'}`} />
            <span className="hidden sm:inline">Red</span>
            <span className="hidden sm:inline text-neutral-500">{'&'}</span>
            <div className={`h-3 w-3 rounded-full ${currentPower === 'red_blue' ? 'bg-blue-500' : 'bg-neutral-500'}`} />
            <span className="hidden sm:inline">Blue</span>
          </button>
        </div>
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="absolute bottom-6 right-6 z-30 hidden lg:block">
        <div className="glass-panel flex flex-col gap-2 rounded-xl px-4 py-3">
          <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">Shortcuts</span>
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <kbd className="flex h-5 min-w-5 items-center justify-center rounded bg-white/10 px-1.5 font-mono text-xs text-neutral-300">1</kbd>
            Fire {'&'} Ice
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <kbd className="flex h-5 min-w-5 items-center justify-center rounded bg-white/10 px-1.5 font-mono text-xs text-neutral-300">2</kbd>
            Lightning
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <kbd className="flex h-5 min-w-5 items-center justify-center rounded bg-white/10 px-1.5 font-mono text-xs text-neutral-300">3</kbd>
            Red {'&'} Blue
          </div>
        </div>
      </div>
    </div>
  )
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = src
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Failed to load ${src}`))
    document.head.appendChild(script)
  })
}
