# BlindHire

> Hiring that's always encrypted. Employers encrypt their requirements. Candidates encrypt their credentials. The blockchain computes the match. Nobody sees the other side's data — ever.

Built for the **Zama Developer Program — Mainnet Season 2**.

🔗 **Live demo:** ((https://blindhire-app.vercel.app))  old link blindhire.xyz got blocked
🎥 **Video demo:** *(coming soon)*  
📄 **Contract:** [`0x0f2Aae67f74EBDA62767084B15Fb7524f8ec2D86`](https://sepolia.etherscan.io/address/0x0f2Aae67f74EBDA62767084B15Fb7524f8ec2D86) on Sepolia

---

## What is BlindHire?

Traditional hiring platforms expose candidate data to employers and vice versa. BlindHire flips this — all comparisons happen inside an FHE contract. The employer posts minimum requirements as ciphertext. The candidate submits credentials as ciphertext. The contract evaluates the match entirely in encrypted space using Zama's fhEVM. Neither party ever sees the other's raw values.

---

## How the FHE matching works

```solidity
// Both sides are euint32 ciphertexts — never decrypted by the contract
ebool yearsOk = FHE.not(FHE.lt(encYears, roles[roleId].minYears));
ebool scoreOk = FHE.not(FHE.lt(encScore, roles[roleId].minScore));
ebool matched  = FHE.and(yearsOk, scoreOk);

// Grant decryption access only to the candidate and employer
FHE.allow(matched, msg.sender);            // candidate
FHE.allow(matched, roles[roleId].employer); // employer
FHE.allow(yearsOk, msg.sender);
FHE.allow(scoreOk, msg.sender);
```

The match result is an `ebool` stored on-chain. Only the candidate can decrypt their own result — via a signed EIP-712 keypair generated in the browser, never sent to any server.

---

## Privacy model

| What | Private? |
|---|---|
| Employer's minimum requirements | ✅ Encrypted on-chain, never revealed |
| Candidate's years of experience | ✅ Encrypted on-chain, never revealed |
| Candidate's skill score | ✅ Encrypted on-chain, never revealed |
| Match outcome (yes/no) | ✅ Encrypted until candidate chooses to decrypt |
| Who matched which role | ⚠️ Public on-chain when candidate calls `confirmMatch` |
| Wallet addresses | ⚠️ Always public on-chain |

---

## Features

- **Confidential matching** — FHE operations over encrypted `euint32` values, plaintext never touches the chain
- **Client-side decryption** — keypair generated in the browser via `@zama-fhe/relayer-sdk`, private key never leaves the device
- **Per-candidate access control** — `FHE.allow()` scopes each ciphertext to its owner only
- **Match breakdown** — candidates see which specific requirements they met or missed, all decrypted client-side
- **Employer dashboard** — aggregate match counts only, no individual candidate data visible
- **Candidate dashboard** — full application history with on-demand decryption
- **Match confirmation** — `confirmMatch()` notifies the employer on-chain when a candidate reveals a match
- **Role lifecycle** — employers can open and close roles; one application per candidate per role enforced on-chain

---

## Zama tech used

| Component | Usage |
|---|---|
| `@fhevm/solidity` | `FHE.lt`, `FHE.and`, `FHE.not`, `FHE.allow`, `FHE.allowThis`, `FHE.fromExternal` |
| `@zama-fhe/relayer-sdk` (web) | Client-side `createInstance`, `generateKeypair`, `createEIP712`, `userDecrypt`, `initSDK` |
| `@zama-fhe/relayer-sdk` (node) | Server-side `createEncryptedInput` for encrypting values via API route |
| `externalEuint32` + `inputProof` | Verified encrypted inputs from client to contract |
| `SepoliaConfigV2` | Zama Sepolia relayer at `relayer.testnet.zama.org/v2` |

---

## Architecture

```
Browser
  ├── Encrypt (via /api/encrypt → relayer-sdk node)
  │     └── returns { handle: bytes32, proof: bytes }
  ├── Submit tx (wagmi writeContract → BlindHire.sol)
  │     └── applyForRole(roleId, yearsHandle, yearsProof, scoreHandle, scoreProof)
  └── Decrypt (relayer-sdk web, client-side only)
        ├── generateKeypair()
        ├── signTypedData (EIP-712)
        └── userDecrypt(handle) → ebool → true/false

BlindHire.sol (Sepolia)
  ├── postRole()       — stores encrypted euint32 requirements
  ├── applyForRole()   — computes FHE.and(yearsOk, scoreOk), stores ebool
  ├── getMatchResult() — returns ebool handle to authorized caller
  └── confirmMatch()   — marks match revealed, emits event to employer
```

---

## Stack

- **Smart contract:** Solidity 0.8.24, `@fhevm/solidity`, deployed on Sepolia
- **Frontend:** Next.js 15, wagmi 2, RainbowKit 2, Tailwind CSS
- **FHE SDK:** `@zama-fhe/relayer-sdk` 0.4.2 (web + node)
- **Infra:** Vercel (frontend), public Sepolia RPC

---

## Run locally

```bash
git clone https://github.com/addnad/blindhire
cd blindhire/app
pnpm install
cp .env.local.example .env.local  # add your env vars
pnpm dev
```

## Environment variables

```env
NEXT_PUBLIC_BLINDHIRE_ADDRESS=0x0f2Aae67f74EBDA62767084B15Fb7524f8ec2D86
SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
```

---

## License

MIT
