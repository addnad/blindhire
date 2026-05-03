# BlindHire

Bias-free confidential hiring powered by Fully Homomorphic Encryption.

Built for the Zama Developer Program — Mainnet Season 2.

## Contract

Deployed on Sepolia: `0x38940809D0e5a390d1d83eF3e871C0ed9A9dea1c`

[View on Etherscan](https://sepolia.etherscan.io/address/0x38940809D0e5a390d1d83eF3e871C0ed9A9dea1c)

## How it works

Employers encrypt minimum requirements. Candidates encrypt credentials. The smart contract computes the match using FHE — neither party ever sees the other's raw data.

```solidity
ebool yearsOk = FHE.not(FHE.lt(encYears, roles[roleId].minYears));
ebool scoreOk = FHE.not(FHE.lt(encScore, roles[roleId].minScore));
ebool matched = FHE.and(yearsOk, scoreOk);
```

## Stack

- Solidity + @fhevm/solidity (FHE operations)
- @zama-fhe/relayer-sdk (client-side encryption)
- Next.js 16, wagmi, RainbowKit, Tailwind CSS
- Sepolia testnet

## Run locally

```bash
git clone https://github.com/addnad/blindhire
cd blindhire
pnpm install
pnpm dev
```

## License

MIT
