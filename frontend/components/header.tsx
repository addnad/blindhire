'use client'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import React from 'react'
import { ConnectWallet } from '@/components/connect-button'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import Image from 'next/image'

export const HeroHeader = () => {
    const [menuOpen, setMenuOpen] = React.useState(false)
    const pathname = usePathname()

    const links = [
        { href: '/roles', label: 'Browse Roles' },
        { href: '/employer', label: 'Post a Role' },
        { href: '/candidate', label: 'Apply' },
        { href: '/dashboard', label: 'Dashboard' },
    ]

    return (
        <header>
            <nav className="bg-background/50 fixed z-20 w-full border-b backdrop-blur-3xl">
                <div className="mx-auto max-w-6xl px-6">
                    <div className="flex items-center justify-between py-3 lg:py-4">
                        <Link href="/" aria-label="home" className="flex items-center gap-2">
                            <Image src="/icon.svg" alt="BlindHire" width={28} height={28} className="rounded-md"/>
                            <span className="font-mono text-lg font-bold tracking-tight">BlindHire</span>
                        </Link>

                        <div className="hidden lg:flex items-center gap-6">
                            {links.map(link => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "text-sm font-mono transition-colors hover:text-foreground",
                                        pathname === link.href ? "text-foreground" : "text-muted-foreground"
                                    )}>
                                    {link.label}
                                </Link>
                            ))}
                            <ConnectWallet />
                        </div>

                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="lg:hidden p-2"
                            aria-label="Toggle menu">
                            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                        </button>
                    </div>

                    {menuOpen && (
                        <div className="lg:hidden border-t border-border py-4 flex flex-col gap-4">
                            {links.map(link => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMenuOpen(false)}
                                    className={cn(
                                        "text-sm font-mono transition-colors hover:text-foreground px-2",
                                        pathname === link.href ? "text-foreground" : "text-muted-foreground"
                                    )}>
                                    {link.label}
                                </Link>
                            ))}
                            <div className="px-2">
                                <ConnectWallet />
                            </div>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    )
}
