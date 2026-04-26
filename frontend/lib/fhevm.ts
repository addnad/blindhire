export async function encryptUint32(
  value: number,
  contractAddress: string,
  userAddress: string
): Promise<{ handle: `0x${string}`; proof: `0x${string}` }> {
  const res = await fetch('/api/encrypt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ value, contractAddress, userAddress }),
  })
  if (!res.ok) throw new Error('Encryption failed')
  return res.json()
}
