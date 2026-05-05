import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { sepolia } from 'wagmi/chains'

export const config = getDefaultConfig({
  appName: 'BlindHire',
  projectId: 'ca8f14d7931a25a609ab9391bda05fde',
  chains: [sepolia],
  ssr: true,
})
