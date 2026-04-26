'use client'
import React from 'react'
import { useReadContract } from 'wagmi'
import { Button } from '@/components/ui/button'
import { BLINDHIRE_ABI, BLINDHIRE_ADDRESS } from '@/lib/abi'
import Link from 'next/link'
import DecryptedText from '@/components/DecryptedText'
import RoleCard from '@/components/role-card'

export default function RolesList() {
    const { data: roleCount } = useReadContract({
        address: BLINDHIRE_ADDRESS,
        abi: BLINDHIRE_ABI,
        functionName: 'roleCount',
    })

    const count = roleCount ? Number(roleCount) : 0

    return (
        <div>
            <div className="mb-10">
                <DecryptedText
                    text="Browse — Open Roles"
                    animateOn="view"
                    revealDirection="start"
                    sequential
                    useOriginalCharsOnly={false}
                    speed={70}
                    className='font-mono text-muted-foreground bg-black rounded-md uppercase text-xs'
                />
                <h1 className="mt-4 text-4xl font-semibold">Open roles.</h1>
                <p className="mt-3 text-muted-foreground text-lg">All requirements are encrypted. Apply with confidence — employers never see your raw credentials.</p>
            </div>

            {count === 0 ? (
                <div className="border border-border rounded-lg p-8 text-center space-y-4">
                    <p className="text-muted-foreground">No roles posted yet.</p>
                    <Button asChild variant="outline" size="sm">
                        <Link href="/employer">Be the first to post a role</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.from({ length: count }, (_, i) => (
                        <RoleCard key={i} roleId={i} />
                    ))}
                </div>
            )}
        </div>
    )
}
