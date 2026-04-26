import { Suspense } from 'react'
import { Navigation } from '@/components/landing/navigation'
import { FooterSection } from '@/components/landing/footer-section'
import CandidateForm from '@/components/candidate-form'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function CandidatePage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden noise-overlay">
      <Navigation />
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-40 pb-32">
        <Link href="/roles" className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-foreground transition-colors mb-12 group">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to roles
        </Link>
        <div className="max-w-2xl">
          <Suspense fallback={null}>
            <CandidateForm />
          </Suspense>
        </div>
      </div>
      <FooterSection />
    </main>
  )
}
