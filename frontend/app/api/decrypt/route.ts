import { createInstance, SepoliaConfigV2 } from "@zama-fhe/relayer-sdk/node"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { handle, contractAddress, userAddress, publicKey, privateKey, signature, startTimestamp, durationDays } = await req.json()

    const instance = await createInstance({
      ...SepoliaConfigV2,
      network: "https://ethereum-sepolia-rpc.publicnode.com",
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
