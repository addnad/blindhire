'use client'
import React from 'react'
import { useAccount, useReadContract, useSignTypedData } from 'wagmi'
import { Button } from '@/components/ui/button'
import { BLINDHIRE_ABI, BLINDHIRE_ADDRESS } from '@/lib/abi'

interface Props {
  appId: bigint
}

export default function MatchResult({ appId }: Props) {
  const { address } = useAccount()
  const [result, setResult] = React.useState<boolean | null>(null)
  const [details, setDetails] = React.useState<{ yearsOk: boolean; scoreOk: boolean } | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')

  const { data: encryptedHandle } = useReadContract({
    address: BLINDHIRE_ADDRESS,
    abi: BLINDHIRE_ABI,
    functionName: 'getMatchResult',
    args: [appId],
  })

  const { data: matchDetails } = useReadContract({
    address: BLINDHIRE_ADDRESS,
    abi: BLINDHIRE_ABI,
    functionName: 'getMatchDetails',
    args: [appId],
  })

  const { signTypedDataAsync } = useSignTypedData()

  const handleDecrypt = async () => {
    if (!address || !encryptedHandle) return
    setLoading(true)
    setError('')

    try {
      const { createInstance, SepoliaConfigV2 } = await import('@zama-fhe/relayer-sdk/web')

      const instance = await createInstance({
        ...SepoliaConfigV2,
        network: window.ethereum,
      })

      const { privateKey, publicKey } = instance.generateKeypair()
      const startTimestamp = Math.floor(Date.now() / 1000)
      const durationDays = 1

      const eip712 = instance.createEIP712(publicKey, [BLINDHIRE_ADDRESS], startTimestamp, durationDays)
      const signature = await signTypedDataAsync(eip712 as any)

      const res = await fetch('/api/decrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          handle: encryptedHandle,
          contractAddress: BLINDHIRE_ADDRESS,
          userAddress: address,
          publicKey,
          privateKey,
          signature,
          startTimestamp,
          durationDays,
        }),
      })

      if (!res.ok) throw new Error('Decryption failed')
      const data = await res.json()
      const matched = data.result === 'true' || data.result === '1' || data.result === true
      setResult(matched)

      if (matchDetails) {
        const yearsHandle = (matchDetails as any)[0]
        const scoreHandle = (matchDetails as any)[1]

        const [yearsRes, scoreRes] = await Promise.all([
          fetch('/api/decrypt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              handle: yearsHandle,
              contractAddress: BLINDHIRE_ADDRESS,
              userAddress: address,
              publicKey,
              privateKey,
              signature,
              startTimestamp,
              durationDays,
            }),
          }),
          fetch('/api/decrypt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              handle: scoreHandle,
              contractAddress: BLINDHIRE_ADDRESS,
              userAddress: address,
              publicKey,
              privateKey,
              signature,
              startTimestamp,
              durationDays,
            }),
          })
        ])

        const yearsData = await yearsRes.json()
        const scoreData = await scoreRes.json()

        setDetails({
          yearsOk: yearsData.result === 'true' || yearsData.result === '1' || yearsData.result === true,
          scoreOk: scoreData.result === 'true' || scoreData.result === '1' || scoreData.result === true,
        })
      }

    } catch (err) {
      console.error(err)
      setError('Decryption failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!encryptedHandle) return null

  return (
    <div className="mt-4 space-y-3">
      {result === null ? (
        <Button variant="outline" size="sm" onClick={handleDecrypt} disabled={loading}>
          {loading ? 'Sign to decrypt...' : 'Reveal match result'}
        </Button>
      ) : (
        <div className="space-y-3">
          <div className={`rounded-md px-4 py-3 font-mono text-sm border ${result ? 'bg-secondary border-border text-foreground' : 'bg-secondary border-border text-muted-foreground'}`}>
            {result ? 'Match — you cleared the bar ✓' : 'No match — requirements not met ✗'}
          </div>
          {details && (
            <div className="bg-secondary rounded-md p-4 font-mono text-xs space-y-2">
              <p className="text-muted-foreground uppercase tracking-widest text-xs mb-2">Confidential score breakdown</p>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Experience requirement</span>
                <span className={details.yearsOk ? 'text-foreground' : 'text-muted-foreground'}>
                  {details.yearsOk ? 'met ✓' : 'not met ✗'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Skill score requirement</span>
                <span className={details.scoreOk ? 'text-foreground' : 'text-muted-foreground'}>
                  {details.scoreOk ? 'met ✓' : 'not met ✗'}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-2 mt-2">
                <span className="text-muted-foreground">Overall match</span>
                <span className="text-foreground font-bold">
                  {[details.yearsOk, details.scoreOk].filter(Boolean).length}/2 requirements
                </span>
              </div>
            </div>
          )}
        </div>
      )}
      {error && <p className="text-xs text-destructive font-mono">{error}</p>}
    </div>
  )
}
