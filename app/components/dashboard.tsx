'use client'
import React from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { ConnectWallet } from '@/components/connect-button'
import { Button } from '@/components/ui/button'
import { BLINDHIRE_ABI, BLINDHIRE_ADDRESS } from '@/lib/abi'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const MatchResult = dynamic(() => import('@/components/match-result'), { ssr: false })

function RoleCard({ roleId, employerAddress }: { roleId: bigint, employerAddress: `0x${string}` }) {
  const { data: metadata } = useReadContract({
    address: BLINDHIRE_ADDRESS,
    abi: BLINDHIRE_ABI,
    functionName: 'getRoleMetadata',
    args: [roleId],
  })

  const { data: stats, refetch: refetchStats } = useReadContract({
    address: BLINDHIRE_ADDRESS,
    abi: BLINDHIRE_ABI,
    functionName: 'getRoleStats',
    args: [roleId],
  })

  const { writeContract, data: closeTxHash, isPending: isClosing } = useWriteContract()
  const { isSuccess: closedSuccess } = useWaitForTransactionReceipt({ hash: closeTxHash })

  React.useEffect(() => {
    if (closedSuccess) refetchStats()
  }, [closedSuccess])

  const handleClose = () => {
    writeContract({
      address: BLINDHIRE_ADDRESS,
      abi: BLINDHIRE_ABI,
      functionName: 'closeRole',
      args: [roleId],
    })
  }

  const title = metadata?.[0] ?? '...'
  const category = metadata?.[2] ?? ''
  const active = metadata?.[4] ?? true
  const applicantCount = stats?.[0] ?? 0n
  const matchCount = stats?.[1] ?? 0n
  const hasMatches = matchCount > 0n

  return (
    <div className={`border p-6 transition-colors ${hasMatches ? 'border-foreground/30' : 'border-foreground/10 hover:border-foreground/20'}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-3">
            <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">{category}</p>
            {hasMatches && (
              <span className="font-mono text-xs bg-foreground text-background px-2 py-0.5">
                {matchCount.toString()} match{matchCount > 1n ? 'es' : ''} ✓
              </span>
            )}
            {!active && (
              <span className="font-mono text-xs text-muted-foreground border border-foreground/10 px-2 py-0.5">
                closed
              </span>
            )}
          </div>
          <p className="text-2xl font-display">{title}</p>
          <p className="font-mono text-xs text-muted-foreground">
            {applicantCount.toString()} applicant{applicantCount !== 1n ? 's' : ''} · requirements encrypted ✓
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-mono text-xs text-muted-foreground border border-foreground/10 px-3 py-1">
            #{roleId.toString()}
          </span>
          {active && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClose}
              disabled={isClosing}
              className="rounded-full font-mono text-xs"
            >
              {isClosing ? 'Closing...' : 'Close role'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

function EmployerDashboard({ address }: { address: `0x${string}` }) {
  const { data: roleIds } = useReadContract({
    address: BLINDHIRE_ADDRESS,
    abi: BLINDHIRE_ABI,
    functionName: 'getEmployerRoles',
    args: [address],
  })

  const totalMatches = roleIds?.length ?? 0

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
          {[...roleIds].reverse().map((id) => (
            <RoleCard key={id.toString()} roleId={id} employerAddress={address} />
          ))}
        </div>
      )}
    </div>
  )
}

function ApplicationCard({ appId, userAddress }: { appId: bigint, userAddress: `0x${string}` }) {
  const { data: appInfo } = useReadContract({
    address: BLINDHIRE_ADDRESS,
    abi: BLINDHIRE_ABI,
    functionName: 'getApplicationInfo',
    args: [appId],
  })

  const roleId = appInfo?.[0] ?? 0n
  const matchRevealed = appInfo?.[2] ?? false

  const { data: metadata } = useReadContract({
    address: BLINDHIRE_ADDRESS,
    abi: BLINDHIRE_ABI,
    functionName: 'getRoleMetadata',
    args: [roleId],
    query: { enabled: appInfo !== undefined },
  })

  const title = metadata?.[0] ?? '...'
  const category = metadata?.[2] ?? ''
  const active = metadata?.[4] ?? true

  return (
    <div className="border border-foreground/10 p-6 hover:border-foreground/20 transition-colors">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">{category}</p>
            {!active && (
              <span className="font-mono text-xs text-muted-foreground border border-foreground/10 px-2 py-0.5">
                role closed
              </span>
            )}
            {matchRevealed && (
              <span className="font-mono text-xs bg-foreground text-background px-2 py-0.5">
                match confirmed ✓
              </span>
            )}
          </div>
          <p className="text-2xl font-display">{title}</p>
          <p className="font-mono text-xs text-muted-foreground">Role #{roleId.toString()} · App #{appId.toString()}</p>
        </div>
      </div>
      <MatchResult appId={appId} onMatchConfirmed={() => {}} />
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
          {[...appIds].reverse().map((id) => (
            <ApplicationCard key={id.toString()} appId={id} userAddress={address} />
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
