import { createInstance, SepoliaConfigV2 } from "@zama-fhe/relayer-sdk/node"
import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"
export const maxDuration = 60

const isAddress = (v: string) => /^0x[0-9a-fA-F]{40}$/.test(v)
const isBytes32 = (v: string) => /^0x[0-9a-fA-F]{64}$/.test(v)

export async function POST(req: NextRequest) {
  try {
    const { handle, contractAddress, userAddress, publicKey, privateKey, signature, startTimestamp, durationDays } = await req.json()

    if (!isAddress(contractAddress) || !isAddress(userAddress)) {
      return NextResponse.json({ error: "Invalid address" }, { status: 400 })
    }

    if (!isBytes32(handle)) {
      return NextResponse.json({ error: "Invalid handle" }, { status: 400 })
    }

    if (!publicKey || !privateKey || !signature) {
      return NextResponse.json({ error: "Missing keypair or signature" }, { status: 400 })
    }

    if (typeof startTimestamp !== 'number' || typeof durationDays !== 'number') {
      return NextResponse.json({ error: "Invalid timestamp or duration" }, { status: 400 })
    }

    const instance = await createInstance({
      ...SepoliaConfigV2,
      network: process.env.SEPOLIA_RPC_URL ?? "https://ethereum-sepolia-rpc.publicnode.com",
    })
    const result = await instance.userDecrypt(
      [{ handle, contractAddress }],
      privateKey,
      publicKey,
      signature,
      [contractAddress],
      userAddress,
      startTimestamp,
      durationDays,
    )
    const value = result[handle]
    return NextResponse.json({ result: value?.toString() ?? null })
  } catch (err) {
    console.error("Decryption error:", err)
    return NextResponse.json({ error: "Decryption failed" }, { status: 500 })
  }
}
