'use client'
import React from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { ConnectWallet } from '@/components/connect-button'
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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display">Your roles</h2>
        <Button asChild size="sm" className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-6">
          <Link href="/employer">Post new role</Link>
        </Button>
      </div>
      {!roleIds || roleIds.length === 0 ? (
        <div className="border border-foreground/10 p-8 text-center">
          <p className="text-muted-foreground font-mono text-sm mb-4">No roles posted yet.</p>
          <Button asChild variant="outline" size="sm" className="rounded-full">
            <Link href="/employer">Post your first role</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {roleIds.map((id) => (
            <div key={id.toString()} className="border border-foreground/10 p-6 flex items-center justify-between hover:border-foreground/20 transition-colors">
              <div className="space-y-1">
                <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Role ID</p>
                <p className="text-3xl font-display">{id.toString()}</p>
              </div>
              <span className="font-mono text-xs text-muted-foreground border border-foreground/10 px-3 py-1">
                requirements encrypted ✓
              </span>
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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display">Your applications</h2>
        <Button asChild size="sm" className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-6">
          <Link href="/roles">Browse roles</Link>
        </Button>
      </div>
      {!appIds || appIds.length === 0 ? (
        <div className="border border-foreground/10 p-8 text-center">
          <p className="text-muted-foreground font-mono text-sm mb-4">No applications yet.</p>
          <Button asChild variant="outline" size="sm" className="rounded-full">
            <Link href="/roles">Browse open roles</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {appIds.map((id) => (
            <div key={id.toString()} className="border border-foreground/10 p-6 hover:border-foreground/20 transition-colors">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Application ID</p>
                  <p className="text-3xl font-display">{id.toString()}</p>
                </div>
                <span className="font-mono text-xs text-muted-foreground border border-foreground/10 px-3 py-1">
                  match computed ✓
                </span>
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
      {/* Header */}
      <div className="mb-16">
        <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
          <span className="w-8 h-px bg-foreground/30" />
          Dashboard
        </span>
        <h1 className="text-4xl lg:text-6xl font-display tracking-tight mb-6">
          Your
          <br />
          <span className="text-muted-foreground">activity.</span>
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
          Track your roles and applications. All match data stays encrypted on-chain.
        </p>
      </div>

      {!isConnected ? (
        <div className="border border-foreground/10 p-8 flex flex-col items-center gap-4 text-center">
          <p className="text-muted-foreground font-mono text-sm">Connect your wallet to view your activity.</p>
          <ConnectWallet />
        </div>
      ) : (
        <div className="space-y-10">
          {/* Tab switcher */}
          <div className="flex gap-0 border-b border-foreground/10">
            <button onClick={() => setView('employer')}
              className={`font-mono text-sm px-6 py-3 transition-colors border-b-2 -mb-px ${view === 'employer' ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
              Employer
            </button>
            <button onClick={() => setView('candidate')}
              className={`font-mono text-sm px-6 py-3 transition-colors border-b-2 -mb-px ${view === 'candidate' ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
              Candidate
            </button>
          </div>

          {view === 'employer' ? <EmployerDashboard address={address!} /> : <CandidateDashboard address={address!} />}
        </div>
      )}
    </div>
  )
}
