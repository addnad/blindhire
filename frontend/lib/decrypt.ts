import { BLINDHIRE_ADDRESS } from "./abi"

export async function decryptMatchResult(
  handle: string,
  userAddress: string,
  signMessage: (message: string) => Promise<string>
): Promise<boolean | null> {
  const { createInstance, SepoliaConfigV2 } = await import("@zama-fhe/relayer-sdk/web")

  const instance = await createInstance({
    ...SepoliaConfigV2,
    network: window.ethereum,
  })

  const { privateKey, publicKey } = instance.generateKeypair()

  const startTimestamp = Math.floor(Date.now() / 1000)
  const durationDays = 1

  const eip712 = instance.createEIP712(
    publicKey,
    [BLINDHIRE_ADDRESS],
    startTimestamp,
    durationDays
  )

  const signature = await signMessage(JSON.stringify(eip712))

  const res = await fetch('/api/decrypt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      handle,
      contractAddress: BLINDHIRE_ADDRESS,
      userAddress,
      publicKey,
      privateKey,
      signature,
      startTimestamp,
      durationDays,
    }),
  })

  if (!res.ok) return null
  const data = await res.json()
  return data.result === 'true' || data.result === '1'
}
