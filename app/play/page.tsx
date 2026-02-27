import { GameCanvas } from '@/components/game-canvas'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Play | Play & Draw 3D',
  description: 'Launch the hand-tracking game with fire, ice, and lightning effects.',
}

export default function PlayPage() {
  return <GameCanvas />
}
