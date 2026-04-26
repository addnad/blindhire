'use client'
import { Navigation } from '@/components/landing/navigation'
import { FooterSection } from '@/components/landing/footer-section'
import dynamic from 'next/dynamic'

const RolesList = dynamic(() => import('@/components/roles-list'), { ssr: false })

export default function RolesPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden noise-overlay">
      <Navigation />
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-40 pb-32">
        <div className="mb-16">
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
            <span className="w-8 h-px bg-foreground/30" />
            Open roles
          </span>
          <h1 className="text-4xl lg:text-6xl font-display tracking-tight mb-6">
            Browse
            <br />
            <span className="text-muted-foreground">open roles.</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
            All requirements are encrypted. Apply without revealing your credentials until matched.
          </p>
        </div>
        <RolesList />
      </div>
      <FooterSection />
    </main>
  )
}
