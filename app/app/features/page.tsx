import { Navigation } from '@/components/landing/navigation'
import { FeaturesSection } from '@/components/landing/features-section'
import { SecuritySection } from '@/components/landing/security-section'
import { FooterSection } from '@/components/landing/footer-section'

export default function FeaturesPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden noise-overlay">
      <Navigation />
      <div className="pt-24">
        <FeaturesSection />
        <SecuritySection />
      </div>
      <FooterSection />
    </main>
  )
}
