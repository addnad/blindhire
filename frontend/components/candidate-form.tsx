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

    React.useEffect(() => {
        if (isSuccess) setSubmitted(true)
    }, [isSuccess])

    const handleReset = () => {
        setSubmitted(false)
        setYears('')
        setScore('')
        setRoleId('0')
        setError('')
        reset()
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!address) return
        setError('')
        setEncrypting(true)

        try {
            const encYears = await encryptUint32(parseInt(years), BLINDHIRE_ADDRESS, address)
            const encScore = await encryptUint32(parseInt(score), BLINDHIRE_ADDRESS, address)

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

    return (
        <div>
            <div className='mb-8'>
                <DecryptedText
                    text="Candidate — Apply for a Role"
                    animateOn="view"
                    revealDirection="start"
                    sequential
                    useOriginalCharsOnly={false}
                    speed={70}
                    className='font-mono text-muted-foreground bg-black rounded-md uppercase text-xs'
                />
                <h1 className="mt-4 text-4xl font-semibold">Submit your credentials.</h1>
                <p className="mt-3 text-muted-foreground text-lg">Your data is encrypted before it touches the chain. The employer will never see your actual numbers.</p>
            </div>

            {!isConnected ? (
                <div className="border border-border rounded-lg p-8 flex flex-col items-center gap-4 text-center">
                    <p className="text-muted-foreground">Connect your wallet to apply.</p>
                    <ConnectWallet />
                </div>
            ) : submitted ? (
                <div className="border border-border rounded-lg p-8 flex flex-col gap-3">
                    <DecryptedText
                        text="Application submitted on-chain."
                        animateOn="view"
                        revealDirection="start"
                        sequential
                        useOriginalCharsOnly={false}
                        speed={50}
                        className='font-mono text-muted-foreground bg-black rounded-md uppercase text-xs'
                    />
                    <h2 className="text-2xl font-semibold">Application submitted.</h2>
                    <p className="text-muted-foreground">The FHE contract computed your match result on encrypted data. Neither you nor the employer saw each other's raw values.</p>
                    <div className="mt-4 bg-secondary rounded-md p-4 font-mono text-xs text-muted-foreground space-y-1">
                        <p>tx &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→ <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" rel="noreferrer" className="text-foreground underline truncate">{txHash?.slice(0,20)}...</a></p>
                        <p>FHE.and() → <span className="text-foreground">computed ✓</span></p>
                        <p>status &nbsp;&nbsp;→ <span className="text-foreground">confirmed ✓</span></p>
                    </div>
                    <div className="flex gap-3 mt-2">
                        <Button variant="outline" onClick={handleReset}>Apply Again</Button>
                        <Button asChild variant="outline">
                            <a href="/dashboard">View Dashboard</a>
                        </Button>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium font-mono uppercase tracking-wide text-muted-foreground">
                            Role ID
                        </label>
                        <input
                            type="number"
                            min="0"
                            required
                            value={roleId}
                            onChange={e => setRoleId(e.target.value)}
                            placeholder="e.g. 0"
                            className="w-full bg-secondary border border-border rounded-md px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring font-mono"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium font-mono uppercase tracking-wide text-muted-foreground">
                            Years of experience
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="40"
                            required
                            value={years}
                            onChange={e => setYears(e.target.value)}
                            placeholder="e.g. 5"
                            className="w-full bg-secondary border border-border rounded-md px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring font-mono"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium font-mono uppercase tracking-wide text-muted-foreground">
                            Skill score (0–100)
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            required
                            value={score}
                            onChange={e => setScore(e.target.value)}
                            placeholder="e.g. 82"
                            className="w-full bg-secondary border border-border rounded-md px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring font-mono"
                        />
                    </div>

                    {error && <p className="text-sm text-destructive font-mono">{error}</p>}

                    <Button
                        type="submit"
                        size="lg"
                        className="w-full"
                        disabled={encrypting || isPending || isMining}>
                        {encrypting ? 'Encrypting...' : isPending ? 'Confirm in wallet...' : isMining ? 'Submitting to chain...' : 'Encrypt & Apply'}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center font-mono">
                        Values are encrypted client-side via FHEVM before submission
                    </p>
                </form>
            )}
        </div>
    )
}
