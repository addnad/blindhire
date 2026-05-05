'use client'
import React from 'react'
import { useAccount, useReadContract, useSignTypedData, useWriteContract } from 'wagmi'
import { Button } from '@/components/ui/button'
import { BLINDHIRE_ABI, BLINDHIRE_ADDRESS } from '@/lib/abi'

interface Props {
  appId: bigint
  onMatchConfirmed?: () => void
}

const toBoolean = (val: unknown): boolean => val === true || val === 1 || val === 'true' || val === '1'

export default function MatchResult({ appId, onMatchConfirmed }: Props) {
  const { address } = useAccount()
  const [result, setResult] = React.useState<boolean | null>(null)
  const [details, setDetails] = React.useState<{ yearsOk: boolean; scoreOk: boolean } | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [confirming, setConfirming] = React.useState(false)

  const { data: encryptedHandle } = useReadContract({
    address: BLINDHIRE_ADDRESS,
    abi: BLINDHIRE_ABI,
    functionName: 'getMatchResult',
    args: [appId],
    account: address,
    query: { enabled: !!address },
  })

  const { data: matchDetails } = useReadContract({
    address: BLINDHIRE_ADDRESS,
    abi: BLINDHIRE_ABI,
    functionName: 'getMatchDetails',
    args: [appId],
    account: address,
    query: { enabled: !!address },
  })

  const { data: appInfo, refetch: refetchAppInfo } = useReadContract({
    address: BLINDHIRE_ADDRESS,
    abi: BLINDHIRE_ABI,
    functionName: 'getApplicationInfo',
    args: [appId],
    account: address,
    query: { enabled: !!address },
  })

  const matchAlreadyRevealed = appInfo?.[2] ?? false

  const { signTypedDataAsync } = useSignTypedData()
  const { writeContractAsync } = useWriteContract()

  const handleDecrypt = async () => {
    if (!address || !encryptedHandle) return
    const handle = (encryptedHandle as string).toLowerCase() as `0x${string}`
    if (typeof window === 'undefined' || !window.ethereum) {
      setError('No Ethereum wallet detected. Please install MetaMask or use a Web3 browser.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const sdk = await import('@zama-fhe/relayer-sdk/web')
      const { createInstance, SepoliaConfigV2, initSDK } = sdk

      // Initialize WASM before creating instance

      await initSDK()
      const instance = await createInstance({ ...SepoliaConfigV2, network: window.ethereum })
      const { privateKey, publicKey } = instance.generateKeypair()
      const startTimestamp = Math.floor(Date.now() / 1000)
      const durationDays = 1
      const eip712 = instance.createEIP712(publicKey, [BLINDHIRE_ADDRESS], startTimestamp, durationDays)
      const signature = await signTypedDataAsync(eip712 as any)

      const mainResult = await instance.userDecrypt(
        [{ handle, contractAddress: BLINDHIRE_ADDRESS }],
        privateKey,
        publicKey,
        signature,
        [BLINDHIRE_ADDRESS],
        address,
        startTimestamp,
        durationDays,
      )
      const rawMatch = mainResult[handle]
      if (rawMatch === undefined) {
        setError('Decrypt returned no value — handle not authorized or wrong network')
        setLoading(false)
        return
      }
      const isMatch = toBoolean(rawMatch.toString())
      setResult(isMatch)

      if (matchDetails) {
        const yearsHandle = ((matchDetails as any)[0] as string).toLowerCase() as `0x${string}`
        const scoreHandle = ((matchDetails as any)[1] as string).toLowerCase() as `0x${string}`
        const detailsResult = await instance.userDecrypt(
          [
            { handle: yearsHandle, contractAddress: BLINDHIRE_ADDRESS },
            { handle: scoreHandle, contractAddress: BLINDHIRE_ADDRESS },
          ],
          privateKey,
          publicKey,
          signature,
          [BLINDHIRE_ADDRESS],
          address,
          startTimestamp,
          durationDays,
        )
        setDetails({
          yearsOk: toBoolean(detailsResult[yearsHandle as `0x${string}`]?.toString()),
          scoreOk: toBoolean(detailsResult[scoreHandle as `0x${string}`]?.toString()),
        })
      }

      if (isMatch && !matchAlreadyRevealed) {
        setConfirming(true)
        try {
          await writeContractAsync({
            address: BLINDHIRE_ADDRESS,
            abi: BLINDHIRE_ABI,
            functionName: 'confirmMatch',
            args: [appId],
          })
          await refetchAppInfo()
          onMatchConfirmed?.()
        } catch (confirmErr) {
          console.error('confirmMatch failed:', confirmErr)
        } finally {
          setConfirming(false)
        }
      }
    } catch (err) {
      console.error(err)
      setError('Decryption failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!address) return null
  if (!encryptedHandle) return (
    <p className="text-xs text-muted-foreground font-mono mt-4">Loading match result...</p>
  )

  return (
    <div className="mt-4 space-y-3">
      {result === null ? (
        <Button variant="outline" size="sm" onClick={handleDecrypt} disabled={loading || confirming}>
          {loading ? 'Sign to decrypt...' : confirming ? 'Confirming match on-chain...' : 'Reveal match result'}
        </Button>
      ) : (
        <div className="space-y-3">
          <div className={`rounded-md px-4 py-3 font-mono text-sm border ${result ? 'bg-secondary border-border text-foreground' : 'bg-secondary border-border text-muted-foreground'}`}>
            {result ? 'Match — you cleared the bar ✓' : 'No match — requirements not met ✗'}
          </div>
          {result && (matchAlreadyRevealed || confirming) && (
            <p className="font-mono text-xs text-muted-foreground">
              {confirming ? 'Notifying employer on-chain...' : 'Employer notified on-chain ✓'}
            </p>
          )}
          {details && (
            <div className="bg-secondary rounded-md p-4 font-mono text-xs space-y-2">
              <p className="text-muted-foreground uppercase tracking-widest text-xs mb-2">Confidential score breakdown</p>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Experience requirement</span>
                <span className={details.yearsOk ? 'text-foreground' : 'text-muted-foreground'}>{details.yearsOk ? 'met ✓' : 'not met ✗'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Skill score requirement</span>
                <span className={details.scoreOk ? 'text-foreground' : 'text-muted-foreground'}>{details.scoreOk ? 'met ✓' : 'not met ✗'}</span>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-2 mt-2">
                <span className="text-muted-foreground">Overall match</span>
                <span className="text-foreground font-bold">{[details.yearsOk, details.scoreOk].filter(Boolean).length}/2 requirements</span>
              </div>
            </div>
          )}
        </div>
      )}
      {error && <p className="text-xs text-destructive font-mono">{error}</p>}
    </div>
  )
}
