'use client'
import { useConnectModal, useAccountModal } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { Button } from '@/components/ui/button'

export function ConnectWallet() {
    const { openConnectModal } = useConnectModal()
    const { openAccountModal } = useAccountModal()
    const { address, isConnected } = useAccount()

    if (isConnected && address) {
        return (
            <Button
                size="sm"
                variant="outline"
                onClick={openAccountModal}>
                {address.slice(0, 6)}...{address.slice(-4)}
            </Button>
        )
    }

    return (
        <Button
            size="sm"
            onClick={openConnectModal}>
            Connect Wallet
        </Button>
    )
}
