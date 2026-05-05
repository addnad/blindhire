'use client'
import React from 'react'
import { Button } from '@/components/ui/button'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { ConnectWallet } from '@/components/connect-button'
import { BLINDHIRE_ABI, BLINDHIRE_ADDRESS } from '@/lib/abi'
import { encryptUint32 } from '@/lib/fhevm'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const CATEGORIES = ['Engineering', 'Design', 'Product', 'Marketing', 'Finance', 'Operations', 'Legal', 'Other']

export default function EmployerForm() {
  const { isConnected, address } = useAccount()
  const [title, setTitle] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [category, setCategory] = React.useState('Engineering')
  const [minYears, setMinYears] = React.useState('')
  const [minScore, setMinScore] = React.useState('')
  const [encrypting, setEncrypting] = React.useState(false)
  const [error, setError] = React.useState('')

  const { writeContract, data: txHash, isPending } = useWriteContract()
  const { isSuccess, isLoading: isMining } = useWaitForTransactionReceipt({ hash: txHash })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!address) return
    setError('')

    const parsedYears = parseInt(minYears)
    const parsedScore = parseInt(minScore)

    if (isNaN(parsedYears) || parsedYears < 0 || parsedYears > 40) {
      setError('Minimum years must be a number between 0 and 40.')
      return
    }
    if (isNaN(parsedScore) || parsedScore < 0 || parsedScore > 100) {
      setError('Minimum score must be a number between 0 and 100.')
      return
    }

    setEncrypting(true)
    try {
      const encYears = await encryptUint32(parsedYears, BLINDHIRE_ADDRESS, address)
      const encScore = await encryptUint32(parsedScore, BLINDHIRE_ADDRESS, address)
      writeContract({
        address: BLINDHIRE_ADDRESS,
        abi: BLINDHIRE_ABI,
        functionName: 'postRole',
        args: [encYears.handle, encYears.proof, encScore.handle, encScore.proof, title, description, category],
      })
    } catch (err) {
      setError('Encryption failed. Please try again.')
      console.error(err)
    } finally {
      setEncrypting(false)
    }
  }

  const inputClass = "w-full bg-foreground/[0.03] border border-foreground/10 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30 font-mono text-sm transition-colors"
  const labelClass = "text-xs font-mono uppercase tracking-widest text-muted-foreground"

  return (
    <div>
      <div className="mb-12">
        <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
          <span className="w-8 h-px bg-foreground/30" />
          Employer
        </span>
        <h1 className="text-4xl lg:text-6xl font-display tracking-tight mb-6">
          Set your
          <br />
          <span className="text-muted-foreground">requirements.</span>
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
          Job details are public. Thresholds are encrypted — candidates will never see your numbers.
        </p>
      </div>

      {!isConnected ? (
        <div className="border border-foreground/10 p-8 flex flex-col items-center gap-4 text-center">
          <p className="text-muted-foreground font-mono text-sm">Connect your wallet to post a role.</p>
          <ConnectWallet />
        </div>
      ) : isSuccess ? (
        <div className="border border-foreground/10 p-8 flex flex-col gap-4">
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground">
            <span className="w-8 h-px bg-foreground/30" />
            Role posted on-chain
          </span>
          <h2 className="text-3xl font-display">Role live.</h2>
          <p className="text-muted-foreground">Your role is now on Sepolia. Candidates can browse and apply — your requirements stay encrypted.</p>
          <div className="mt-2 border border-foreground/10 p-4 font-mono text-xs text-muted-foreground space-y-2">
            <p>title &nbsp;&nbsp;→ <span className="text-foreground">{title}</span></p>
            <p>tx &nbsp;&nbsp;&nbsp;&nbsp;→ <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" rel="noreferrer" className="text-foreground underline">{txHash?.slice(0, 20)}...</a></p>
            <p>status → <span className="text-foreground">confirmed ✓</span></p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="pb-8 border-b border-foreground/10">
            <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-6">Public details</p>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className={labelClass}>Job title</label>
                <input type="text" required value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Senior Solidity Engineer" className={inputClass} />
              </div>

              <div className="space-y-2">
                <label className={labelClass}>Category</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-full bg-foreground/[0.03] border border-foreground/10 px-4 py-3 h-auto font-mono text-sm rounded-none focus:ring-0 focus:border-foreground/30">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="font-mono text-sm rounded-none border-foreground/10">
                    {CATEGORIES.map(c => (
                      <SelectItem key={c} value={c} className="font-mono">{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className={labelClass}>Description</label>
                <textarea required value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the role, responsibilities, and what you are looking for..." rows={4} className={inputClass} />
              </div>
            </div>
          </div>

          <div>
            <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-6">Encrypted thresholds</p>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className={labelClass}>Minimum years of experience</label>
                <input type="number" min="0" max="40" required value={minYears} onChange={e => setMinYears(e.target.value)} placeholder="e.g. 3" className={inputClass} />
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Minimum skill score (0–100)</label>
                <input type="number" min="0" max="100" required value={minScore} onChange={e => setMinScore(e.target.value)} placeholder="e.g. 70" className={inputClass} />
              </div>
            </div>
          </div>

          {error && <p className="text-sm text-destructive font-mono">{error}</p>}

          <Button type="submit" size="lg"
            className="w-full bg-foreground hover:bg-foreground/90 text-background rounded-full h-14 text-base"
            disabled={encrypting || isPending || isMining}>
            {encrypting ? 'Encrypting...' : isPending ? 'Confirm in wallet...' : isMining ? 'Submitting to chain...' : 'Encrypt & Post Role'}
          </Button>
          <p className="text-xs text-muted-foreground text-center font-mono">
            Thresholds are encrypted client-side via FHEVM before submission
          </p>
        </form>
      )}
    </div>
  )
}
