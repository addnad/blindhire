'use client'
import React from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { ConnectWallet } from '@/components/connect-button'
import DecryptedText from '@/components/DecryptedText'
import { Button } from '@/components/ui/button'
import { BLINDHIRE_ABI, BLINDHIRE_ADDRESS } from '@/lib/abi'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const MatchResult = dynamic(() => import('@/components/match-result'), { ssr: false })

function EmployerDashboard({ address }: { address: `0x${string}` }) {
    const { data: roleIds } = useReadContract({
        address: BLINDHIRE_ADDRESS,
        abi: BLINDHIRE_ABI,
        functionName: 'getEmployerRoles',
        args: [address],
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Your roles</h2>
                <Button asChild size="sm">
                    <Link href="/employer">Post new role</Link>
                </Button>
            </div>
            {!roleIds || roleIds.length === 0 ? (
                <div className="border border-border rounded-lg p-8 text-center">
                    <p className="text-muted-foreground mb-4">No roles posted yet.</p>
                    <Button asChild variant="outline" size="sm">
                        <Link href="/employer">Post your first role</Link>
                    </Button>
                </div>
            ) : (
                <div className="space-y-3">
                    {roleIds.map((id) => (
                        <div key={id.toString()} className="border border-border rounded-lg p-6 flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="font-mono text-xs text-muted-foreground uppercase tracking-wide">Role ID</p>
                                <p className="text-2xl font-semibold">{id.toString()}</p>
                            </div>
                            <div className="bg-secondary rounded-md px-4 py-2 font-mono text-xs text-muted-foreground">
                                requirements encrypted ✓
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

function CandidateDashboard({ address }: { address: `0x${string}` }) {
    const { data: appIds } = useReadContract({
        address: BLINDHIRE_ADDRESS,
        abi: BLINDHIRE_ABI,
        functionName: 'getCandidateApplications',
        args: [address],
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Your applications</h2>
                <Button asChild size="sm">
                    <Link href="/roles">Browse roles</Link>
                </Button>
            </div>
            {!appIds || appIds.length === 0 ? (
                <div className="border border-border rounded-lg p-8 text-center">
                    <p className="text-muted-foreground mb-4">No applications yet.</p>
                    <Button asChild variant="outline" size="sm">
                        <Link href="/roles">Browse open roles</Link>
                    </Button>
                </div>
            ) : (
                <div className="space-y-3">
                    {appIds.map((id) => (
                        <div key={id.toString()} className="border border-border rounded-lg p-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="font-mono text-xs text-muted-foreground uppercase tracking-wide">Application ID</p>
                                    <p className="text-2xl font-semibold">{id.toString()}</p>
                                </div>
                                <div className="bg-secondary rounded-md px-4 py-2 font-mono text-xs text-muted-foreground">
                                    match computed ✓
                                </div>
                            </div>
                            <MatchResult appId={id} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default function Dashboard() {
    const { isConnected, address } = useAccount()
    const [view, setView] = React.useState<'employer' | 'candidate'>('employer')

    return (
        <div>
            <div className="mb-10">
                <DecryptedText
                    text="Dashboard — Your activity"
                    animateOn="view"
                    revealDirection="start"
                    sequential
                    useOriginalCharsOnly={false}
                    speed={70}
                    className='font-mono text-muted-foreground bg-black rounded-md uppercase text-xs'
                />
                <h1 className="mt-4 text-4xl font-semibold">Activity.</h1>
                <p className="mt-3 text-muted-foreground text-lg">Track your roles and applications. All match data stays encrypted on-chain.</p>
            </div>

            {!isConnected ? (
                <div className="border border-border rounded-lg p-8 flex flex-col items-center gap-4 text-center">
                    <p className="text-muted-foreground">Connect your wallet to view your activity.</p>
                    <ConnectWallet />
                </div>
            ) : (
                <div className="space-y-8">
                    <div className="flex gap-2 border-b border-border pb-4">
                        <button
                            onClick={() => setView('employer')}
                            className={`font-mono text-sm px-4 py-2 rounded-md transition-colors ${view === 'employer' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                            Employer
                        </button>
                        <button
                            onClick={() => setView('candidate')}
                            className={`font-mono text-sm px-4 py-2 rounded-md transition-colors ${view === 'candidate' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                            Candidate
                        </button>
                    </div>

                    {view === 'employer' ? (
                        <EmployerDashboard address={address!} />
                    ) : (
                        <CandidateDashboard address={address!} />
                    )}
                </div>
            )}
        </div>
    )
}
