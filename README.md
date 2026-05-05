# BlindHire

Bias-free confidential hiring powered by Fully Homomorphic Encryption.

Built for the Zama Developer Program — Mainnet Season 2.

## Contract

Deployed on Sepolia: `0x0f2Aae67f74EBDA62767084B15Fb7524f8ec2D86`

[View on Etherscan](https://sepolia.etherscan.io/address/0x0f2Aae67f74EBDA62767084B15Fb7524f8ec2D86)

## How it works

Employers encrypt minimum requirements. Candidates encrypt credentials. The smart contract computes the match using FHE — neither party ever sees the other's raw data.

```solidity
ebool yearsOk = FHE.not(FHE.lt(encYears, roles[roleId].minYears));
ebool scoreOk = FHE.not(FHE.lt(encScore, roles[roleId].minScore));
ebool matched = FHE.and(yearsOk, scoreOk);
```

## Features

- **Confidential matching** — FHE computations on encrypted data, plaintext never touches the chain
- **One application per role** — candidates cannot reapply to the same role
- **Client-side decryption** — private keys are generated in the browser and never leave the device
- **Candidate dashboard** — view applications, trigger decryption, see match breakdown
- **Employer dashboard** — see applicant count and confirmed match count per role, close roles
- **Match confirmation** — when a candidate decrypts a match, `confirmMatch()` is called on-chain, notifying the employer
- **Privacy-preserving** — employers never see candidate addresses or individual results, only aggregate match counts
- **Role management** — employers can close roles to stop new applications

## Stack

- Solidity + @fhevm/solidity (FHE operations)
- @zama-fhe/relayer-sdk (client-side encryption & decryption)
- Next.js 16, wagmi 2, RainbowKit 2, Tailwind CSS 4
- Sepolia testnet

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

## License

MIT
