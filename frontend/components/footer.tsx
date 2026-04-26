'use client'
import Link from 'next/link'

export default function FooterSection() {
    return (
        <footer className="border-t border-border py-12">
            <div className="mx-auto max-w-6xl px-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                    <div className="space-y-2">
                        <p className="font-mono text-lg font-bold">BlindHire</p>
                        <p className="text-sm text-muted-foreground max-w-xs">Bias-free confidential hiring powered by Fully Homomorphic Encryption on Ethereum.</p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="space-y-3">
                            <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">App</p>
                            <div className="flex flex-col gap-2">
                                <Link href="/employer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Post a Role</Link>
                                <Link href="/candidate" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Apply</Link>
                                <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Built with</p>
                            <div className="flex flex-col gap-2">
                                <a href="https://docs.zama.org" target="_blank" rel="noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Zama FHEVM</a>
                                <a href="https://github.com/OpenZeppelin/openzeppelin-confidential-contracts" target="_blank" rel="noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">OpenZeppelin Confidential</a>
                                <a href="https://sepolia.etherscan.io/address/0xa0bB4e71d0d28068b39DA4c22EFeB8f9A72dfD2e" target="_blank" rel="noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-mono">Contract ↗</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-6 border-t border-border flex items-center justify-end">
                    <p className="text-xs text-muted-foreground font-mono">Deployed on Sepolia · 0xa0bB4e71...dfD2e</p>
                </div>
            </div>
        </footer>
    )
}
