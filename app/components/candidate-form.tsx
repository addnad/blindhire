'use client'
import React from 'react'
import { Button } from '@/components/ui/button'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { ConnectWallet } from '@/components/connect-button'
import DecryptedText from '@/components/DecryptedText'
import { BLINDHIRE_ABI, BLINDHIRE_ADDRESS } from '@/lib/abi'
import { encryptUint32 } from '@/lib/fhevm'
import { useSearchParams } from 'next/navigation'

export default function CandidateForm() {
  const { isConnected, address } = useAccount()
  const searchParams = useSearchParams()
  const [roleId, setRoleId] = React.useState(searchParams.get('roleId') || '0')
  const [years, setYears] = React.useState('')
  const [score, setScore] = React.useState('')
  const [encrypting, setEncrypting] = React.useState(false)
  const [error, setError] = React.useState('')
  const [submitted, setSubmitted] = React.useState(false)

  const { writeContract, data: txHash, isPending, reset } = useWriteContract()
  const { isSuccess, isLoading: isMining } = useWaitForTransactionReceipt({ hash: txHash })

  React.useEffect(() => { if (isSuccess) setSubmitted(true) }, [isSuccess])

  const handleReset = () => {
    setSubmitted(false); setYears(''); setScore(''); setRoleId('0'); setError(''); reset()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!address) return
    setError('')

    const parsedYears = parseInt(years)
    const parsedScore = parseInt(score)

    if (isNaN(parsedYears) || parsedYears < 0 || parsedYears > 40) {
      setError('Years of experience must be a number between 0 and 40.')
      return
    }
    if (isNaN(parsedScore) || parsedScore < 0 || parsedScore > 100) {
      setError('Skill score must be a number between 0 and 100.')
      return
    }

    setEncrypting(true)
    try {
      const encYears = await encryptUint32(parsedYears, BLINDHIRE_ADDRESS, address)
      const encScore = await encryptUint32(parsedScore, BLINDHIRE_ADDRESS, address)
      writeContract({
        address: BLINDHIRE_ADDRESS,
        abi: BLINDHIRE_ABI,
        functionName: 'applyForRole',
        args: [BigInt(roleId), encYears.handle, encYears.proof, encScore.handle, encScore.proof],
      })
    } catch (err) {
      setError('Encryption failed. Please try again.')
      console.error(err)
    } finally {
      setEncrypting(false)
    }
  }

  const inputClass = "w-full bg-secondary border border-border rounded-md px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring font-mono"
  const labelClass = "text-sm font-medium font-mono uppercase tracking-wide text-muted-foreground"

  return (
    <div>
      <div className="mb-8">
        <DecryptedText text="Candidate — Apply for a Role" animateOn="view" revealDirection="start" sequential useOriginalCharsOnly={false} speed={70} className="font-mono text-muted-foreground bg-black rounded-md uppercase text-xs" />
        <h1 className="mt-4 text-4xl font-semibold">Submit your credentials.</h1>
        <p className="mt-3 text-muted-foreground text-lg">Your data is encrypted before it touches the chain. The employer will never see your actual numbers.</p>
      </div>
      {!isConnected ? (
        <div className="border border-border rounded-lg p-8 flex flex-col items-center gap-4 text-center">
          <p className="text-muted-foreground">Connect your wallet to apply.</p>
          <ConnectWallet />
        </div>
      ) : submitted ? (
        <div className="border border-foreground/10 p-8 flex flex-col gap-6">
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground">
            <span className="w-8 h-px bg-foreground/30" />
            Application submitted on-chain
          </span>
          <div>
            <h2 className="text-3xl font-display mb-3">You applied.</h2>
            <p className="text-muted-foreground leading-relaxed">
              Your credentials were encrypted and submitted to the FHE contract.
              The match has already been computed on-chain — your scores were never revealed.
            </p>
          </div>

          <div className="border border-foreground/10 p-4 font-mono text-xs text-muted-foreground space-y-2">
            <p>tx &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→ <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" rel="noreferrer" className="text-foreground underline">{txHash?.slice(0, 20)}...</a></p>
            <p>FHE.and() → <span className="text-foreground">computed ✓</span></p>
            <p>status &nbsp;&nbsp;→ <span className="text-foreground">confirmed ✓</span></p>
          </div>

          <div className="border border-foreground/10 p-6 flex flex-col gap-3">
            <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">What happens next</p>
            <p className="text-foreground leading-relaxed">
              Go to your <strong>Dashboard → Candidate tab</strong> to reveal your match result.
              You will be asked to sign a message with your wallet to decrypt your personal result.
              The employer never sees your scores — only you can decrypt your outcome.
            </p>
          </div>

          <div className="flex gap-3">
            <Button asChild size="lg" className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-8">
              <a href="/dashboard">Reveal my result →</a>
            </Button>
            <Button variant="outline" className="rounded-full px-8" onClick={handleReset}>Apply Again</Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className={labelClass}>Role ID</label>
            <input type="number" min="0" required value={roleId} onChange={e => setRoleId(e.target.value)} placeholder="e.g. 0" className={inputClass} />
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Years of experience</label>
            <input type="number" min="0" max="40" required value={years} onChange={e => setYears(e.target.value)} placeholder="e.g. 5" className={inputClass} />
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Skill score (0–100)</label>
            <input type="number" min="0" max="100" required value={score} onChange={e => setScore(e.target.value)} placeholder="e.g. 82" className={inputClass} />
          </div>
          {error && <p className="text-sm text-destructive font-mono">{error}</p>}
          <Button type="submit" size="lg" className="w-full" disabled={encrypting || isPending || isMining}>
            {encrypting ? 'Encrypting...' : isPending ? 'Confirm in wallet...' : isMining ? 'Submitting to chain...' : 'Encrypt & Apply'}
          </Button>
          <p className="text-xs text-muted-foreground text-center font-mono">Values are encrypted client-side via FHEVM before submission</p>
        </form>
      )}
    </div>
  )
}
