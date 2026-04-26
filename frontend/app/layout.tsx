import React from "react"
import type {Metadata} from 'next'
import {Geist, Geist_Mono} from 'next/font/google'
import {Analytics} from '@vercel/analytics/next'
import './globals.css'
import FooterSection from "@/components/footer"
import {HeroHeader} from "@/components/header"
import {Web3Provider} from "@/components/web3-provider"
import {ThemeProvider} from "@/components/theme-provider"

const _geist = Geist({subsets: ["latin"]})
const _geistMono = Geist_Mono({subsets: ["latin"]})

export const metadata: Metadata = {
    title: 'BlindHire — Confidential Hiring on-chain',
    description: 'Bias-free hiring powered by Fully Homomorphic Encryption. Employers and candidates match without revealing private data.',
    icons: {
        icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
        apple: '/icon.svg',
    },
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <Web3Provider>
            <HeroHeader/>
            {children}
            <FooterSection/>
            <Analytics/>
        </Web3Provider>
        </ThemeProvider>
        </body>
        </html>
    )
}
