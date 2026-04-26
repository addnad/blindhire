'use client'
import HeroSection from "@/components/hero-section"
import HowItWorks from "@/components/how-it-works"
import dynamic from 'next/dynamic'

const Dither = dynamic(() => import('@/components/Dither'), { ssr: false })

export default function Home() {
    return (
        <main className="overflow-x-hidden">
            <div className='absolute w-full h-dvh max-h-155 sm:max-h-115 md:max-h-125 lg:max-h-190 xl:max-h-195 z-0'>
                <Dither
                    waveColor={[0.30980392156862746, 0.30980392156862746, 0.30980392156862746]}
                    disableAnimation={false}
                    enableMouseInteraction
                    mouseRadius={0.3}
                    colorNum={4}
                    pixelSize={2}
                    waveAmplitude={0.3}
                    waveFrequency={3}
                    waveSpeed={0.05}
                />
            </div>
            <div className="relative z-10">
                <HeroSection/>
                <HowItWorks/>
            </div>
        </main>
    )
}
