'use client'
import React from 'react'
import { Button } from '@/components/ui/button'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { ConnectWallet } from '@/components/connect-button'
import DecryptedText from '@/components/DecryptedText'
import { BLINDHIRE_ABI, BLINDHIRE_ADDRESS } from '@/lib/abi'
import { encryptUint32 } from '@/lib/fhevm'

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
        setEncrypting(true)
        try {
            const encYears = await encryptUint32(parseInt(minYears), BLINDHIRE_ADDRESS, address)
            const encScore = await encryptUint32(parseInt(minScore), BLINDHIRE_ADDRESS, address)
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

    const inputClass = "w-full bg-secondary border border-border rounded-md px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring font-mono"
    const labelClass = "text-sm font-medium font-mono uppercase tracking-wide text-muted-foreground"

    return (
        <div>
            <div className='mb-8'>
                <DecryptedText
                    text="Employer — Post a Role"
                    animateOn="view"
                    revealDirection="start"
                    sequential
                    useOriginalCharsOnly={false}
                    speed={70}
                    className='font-mono text-muted-foreground bg-black rounded-md uppercase text-xs'
                />
                <h1 className="mt-4 text-4xl font-semibold">Set your requirements.</h1>
                <p className="mt-3 text-muted-foreground text-lg">Job details are public. Thresholds are encrypted — candidates will never see your numbers.</p>
            </div>

            {!isConnected ? (
                <div className="border border-border rounded-lg p-8 flex flex-col items-center gap-4 text-center">
                    <p className="text-muted-foreground">Connect your wallet to post a role.</p>
                    <ConnectWallet />
                </div>
            ) : isSuccess ? (
                <div className="border border-border rounded-lg p-8 flex flex-col gap-3">
                    <DecryptedText
                        text="Role posted on-chain."
                        animateOn="view"
                        revealDirection="start"
                        sequential
                        useOriginalCharsOnly={false}
                        speed={50}
                        className='font-mono text-muted-foreground bg-black rounded-md uppercase text-xs'
                    />
                    <h2 className="text-2xl font-semibold">Role live.</h2>
                    <p className="text-muted-foreground">Your role is now on Sepolia. Candidates can browse and apply — your requirements stay encrypted.</p>
                    <div className="mt-4 bg-secondary rounded-md p-4 font-mono text-xs text-muted-foreground space-y-1">
                        <p>title &nbsp;&nbsp;→ <span className="text-foreground">{title}</span></p>
                        <p>tx &nbsp;&nbsp;&nbsp;&nbsp;→ <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" rel="noreferrer" className="text-foreground underline">{txHash?.slice(0,20)}...</a></p>
                        <p>status → <span className="text-foreground">confirmed ✓</span></p>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="pb-4 border-b border-border">
                        <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-4">Public details</p>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className={labelClass}>Job title</label>
                                <input type="text" required value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Senior Solidity Engineer" className={inputClass}/>
                            </div>
                            <div className="space-y-2">
                                <label className={labelClass}>Category</label>
                                <select value={category} onChange={e => setCategory(e.target.value)} className={inputClass}>
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className={labelClass}>Description</label>
                                <textarea required value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the role, responsibilities, and what you're looking for..." rows={4} className={inputClass}/>
                            </div>
                        </div>
                    </div>

                    <div>
                        <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-4">Encrypted thresholds</p>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className={labelClass}>Minimum years of experience</label>
                                <input type="number" min="0" max="20" required value={minYears} onChange={e => setMinYears(e.target.value)} placeholder="e.g. 3" className={inputClass}/>
                            </div>
                            <div className="space-y-2">
                                <label className={labelClass}>Minimum skill score (0–100)</label>
                                <input type="number" min="0" max="100" required value={minScore} onChange={e => setMinScore(e.target.value)} placeholder="e.g. 70" className={inputClass}/>
                            </div>
                        </div>
                    </div>

                    {error && <p className="text-sm text-destructive font-mono">{error}</p>}

                    <Button type="submit" size="lg" className="w-full" disabled={encrypting || isPending || isMining}>
                        {encrypting ? 'Encrypting...' : isPending ? 'Confirm in wallet...' : isMining ? 'Submitting to chain...' : 'Encrypt & Post Role'}
                    </Button>
                    <p className="text-xs text-muted-foreground text-center font-mono">Thresholds are encrypted client-side via FHEVM before submission</p>
                </form>
            )}
        </div>
    )
}
