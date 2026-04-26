import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { TextEffect } from "@/components/motion-primitives/text-effect"
import { AnimatedGroup } from "@/components/motion-primitives/animated-group"
import DecryptedText from "@/components/DecryptedText"
import { transitionVariants } from "@/lib/utils"

export default function HeroSection() {
    return (
        <main className="overflow-x-hidden">
            <section className='min-h-screen flex items-center'>
                <div className="mx-auto max-w-6xl px-6 pt-32 pb-24 md:pt-40 md:pb-32">
                    <div className="max-w-3xl">
                        <div className='mt-4'>
                            <DecryptedText
                                text="Powered by Fully Homomorphic Encryption — Zama Protocol"
                                animateOn="view"
                                revealDirection="start"
                                sequential
                                useOriginalCharsOnly={false}
                                speed={70}
                                className='font-mono text-muted-foreground bg-black rounded-md uppercase text-xs'
                            />
                        </div>

                        <TextEffect
                            preset="fade-in-blur"
                            speedSegment={0.3}
                            as="h1"
                            className="mt-6 text-6xl font-semibold md:text-7xl xl:text-8xl">
                            Hire without
                        </TextEffect>
                        <TextEffect
                            preset="fade-in-blur"
                            speedSegment={0.3}
                            as="h1"
                            className="text-6xl font-semibold md:text-7xl xl:text-8xl text-muted-foreground">
                            bias or exposure.
                        </TextEffect>

                        <TextEffect
                            per="line"
                            preset="fade-in-blur"
                            speedSegment={0.3}
                            delay={0.5}
                            as="p"
                            className="mt-8 max-w-xl text-pretty text-lg text-muted-foreground">
                            Employers encrypt their requirements. Candidates encrypt their credentials. The blockchain computes the match. Nobody sees the other side's data — ever.
                        </TextEffect>

                        <AnimatedGroup
                            variants={{
                                container: {
                                    visible: {
                                        transition: {
                                            staggerChildren: 0.05,
                                            delayChildren: 0.75,
                                        },
                                    },
                                },
                                ...transitionVariants,
                            }}
                            className="mt-12 flex flex-col items-start gap-3 sm:flex-row">
                            <Button
                                asChild
                                size="lg"
                                className="px-6 text-base">
                                <Link href="/employer">
                                    <span>Post a Role</span>
                                </Link>
                            </Button>
                            <Button
                                asChild
                                size="lg"
                                variant="outline"
                                className="px-6 text-base">
                                <Link href="/candidate">
                                    <span>Apply as Candidate</span>
                                </Link>
                            </Button>
                        </AnimatedGroup>
                    </div>
                </div>
            </section>
        </main>
    )
}
