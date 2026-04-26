'use client'
import React from 'react'
import { AnimatedGroup } from '@/components/motion-primitives/animated-group'
import { transitionVariants } from '@/lib/utils'

const steps = [
  {
    number: '01',
    title: 'Employer encrypts requirements',
    description: 'Minimum years of experience and skill score are encrypted client-side using the FHEVM SDK. The contract stores only ciphertexts — never plaintext.',
    tag: 'FHE.fromExternal()',
  },
  {
    number: '02',
    title: 'Candidate encrypts credentials',
    description: 'The candidate encrypts their actual scores locally. Their wallet address is baked into the ciphertext — only they can decrypt their own result.',
    tag: 'createEncryptedInput()',
  },
  {
    number: '03',
    title: 'Contract computes the match',
    description: 'The smart contract runs FHE.and(FHE.not(FHE.lt(...))) on both sets of ciphertexts. The comparison happens entirely in encrypted space — no decryption mid-computation.',
    tag: 'FHE.and() + FHE.not()',
  },
  {
    number: '04',
    title: 'Each party gets their boolean',
    description: 'FHE.allow() grants each wallet the right to decrypt only the final yes/no result. The employer never sees the candidate\'s scores. The candidate never sees the thresholds.',
    tag: 'FHE.allow()',
  },
]

export default function HowItWorks() {
  return (
    <section className="py-24 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">
        <AnimatedGroup
          variants={{
            container: {
              visible: {
                transition: { staggerChildren: 0.08, delayChildren: 0.1 },
              },
            },
            ...transitionVariants,
          }}
        >
          <div className="mb-16">
            <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-4">How it works</p>
            <h2 className="text-4xl font-semibold max-w-xl">Four steps. Zero data exposure.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
            {steps.map((step) => (
              <div key={step.number} className="bg-background p-8 flex flex-col gap-4">
                <span className="font-mono text-xs text-muted-foreground">{step.number}</span>
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                <span className="font-mono text-xs bg-secondary text-muted-foreground px-3 py-1 rounded-md self-start">{step.tag}</span>
              </div>
            ))}
          </div>
        </AnimatedGroup>
      </div>
    </section>
  )
}
