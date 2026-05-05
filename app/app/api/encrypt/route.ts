import { createInstance, SepoliaConfigV2 } from "@zama-fhe/relayer-sdk/node"
import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"
export const maxDuration = 60

function toHex(bytes: Uint8Array | Record<string, number>): `0x${string}` {
  const arr = bytes instanceof Uint8Array ? bytes : Object.values(bytes)
  return ('0x' + Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('')) as `0x${string}`
}

const isAddress = (v: string) => /^0x[0-9a-fA-F]{40}$/.test(v)

export async function POST(req: NextRequest) {
  try {
    const { value, contractAddress, userAddress, valueType } = await req.json()

    if (!isAddress(contractAddress) || !isAddress(userAddress)) {
      return NextResponse.json({ error: "Invalid address" }, { status: 400 })
    }

    const num = Number(value)
    if (!Number.isInteger(num) || isNaN(num)) {
      return NextResponse.json({ error: "Invalid value" }, { status: 400 })
    }

    const max = valueType === 'years' ? 40 : 100
    if (num < 0 || num > max) {
      return NextResponse.json({ error: `Value must be between 0 and ${max}` }, { status: 400 })
    }

    const instance = await createInstance({
      ...SepoliaConfigV2,
      network: process.env.SEPOLIA_RPC_URL ?? "https://ethereum-sepolia-rpc.publicnode.com",
    })
    const input = instance.createEncryptedInput(contractAddress, userAddress)
    input.add32(num)
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
