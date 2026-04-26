import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { sepolia } from 'wagmi/chains'

export const config = getDefaultConfig({
  appName: 'BlindHire',
  projectId: 'blindhire',
  chains: [sepolia],
  ssr: true,
})
