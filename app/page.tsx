import { HeroSection } from '@/components/hero-section'
import { FeaturesSection } from '@/components/features-section'
import { ControlsSection } from '@/components/controls-section'
import { Footer } from '@/components/footer'

export default function Home() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <ControlsSection />
      <Footer />
    </main>
  )
}
