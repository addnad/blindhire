import { createInstance, SepoliaConfigV2 } from "@zama-fhe/relayer-sdk/node"
import { NextRequest, NextResponse } from "next/server"

function toHex(bytes: Uint8Array | Record<string, number>): `0x${string}` {
  const arr = bytes instanceof Uint8Array ? bytes : Object.values(bytes)
  return ('0x' + Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('')) as `0x${string}`
}

export async function POST(req: NextRequest) {
  try {
    const { value, contractAddress, userAddress } = await req.json()

    const instance = await createInstance({
      ...SepoliaConfigV2,
      network: "https://ethereum-sepolia-rpc.publicnode.com",
    })

    const input = instance.createEncryptedInput(contractAddress, userAddress)
    input.add32(value)
    const encrypted = await input.encrypt()

    return NextResponse.json({
      handle: toHex(encrypted.handles[0]),
      proof: toHex(encrypted.inputProof),
    })
  } catch (err) {
    console.error("Encryption error:", err)
    return NextResponse.json({ error: "Encryption failed" }, { status: 500 })
  }
}
