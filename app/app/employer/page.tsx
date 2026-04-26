import { Navigation } from '@/components/landing/navigation'
import { FooterSection } from '@/components/landing/footer-section'
import EmployerForm from '@/components/employer-form'

export default function EmployerPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden noise-overlay">
      <Navigation />
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-40 pb-32">
        <div className="max-w-2xl">
          <EmployerForm />
        </div>
      </div>
      <FooterSection />
    </main>
  )
}
