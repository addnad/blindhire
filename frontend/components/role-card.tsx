'use client'
import React from 'react'
import { useReadContract } from 'wagmi'
import { BLINDHIRE_ABI, BLINDHIRE_ADDRESS } from '@/lib/abi'
import Link from 'next/link'
import Image from 'next/image'

export default function RoleCard({ roleId }: { roleId: number }) {
    const { data } = useReadContract({
        address: BLINDHIRE_ADDRESS,
        abi: BLINDHIRE_ABI,
        functionName: 'getRoleMetadata',
        args: [BigInt(roleId)],
    })

    const title = data ? (data as any)[0] as string : null
    const description = data ? (data as any)[1] as string : null
    const category = data ? (data as any)[2] as string : null
    const employer = data ? (data as any)[3] as string : null
    const active = data ? (data as any)[4] as boolean : true

    return (
        <Link href={`/candidate?roleId=${roleId}`} className="block group">
            <div className="relative rounded-2xl overflow-hidden border border-white/10 cursor-pointer transition-transform duration-200 group-hover:scale-[1.01]"
                style={{
                    backgroundImage: 'url(/card-base-blindhire.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    aspectRatio: '3/4',
                    maxWidth: '280px',
                }}>
                <div className="absolute inset-0 bg-black/40" />

                <div className="relative h-full p-5 flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                        <Image src="/icon.svg" alt="BlindHire" width={28} height={28} className="rounded-md opacity-90"/>
                        <div className="flex flex-col items-end gap-1">
                            {category && (
                                <span className="font-mono text-xs px-2 py-0.5 rounded-full border border-white/20 text-white/60">
                                    {category}
                                </span>
                            )}
                            <span className={`font-mono text-xs px-2 py-0.5 rounded-full border ${active ? 'border-white/20 text-white/50' : 'border-red-500/30 text-red-400/60'}`}>
                                {active ? 'active' : 'closed'}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <p className="font-mono text-xs text-white/30 uppercase tracking-widest mb-1">Role #{roleId}</p>
                            <p className="font-mono text-xl font-bold text-white leading-tight">
                                {title || '···'}
                            </p>
                        </div>
                        {description && (
                            <p className="font-mono text-xs text-white/50 leading-relaxed line-clamp-3">
                                {description}
                            </p>
                        )}
                        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                            <p className="font-mono text-xs text-white/30">
                                {employer ? `${employer.slice(0, 6)}...${employer.slice(-4)}` : '···'}
                            </p>
                            <p className="font-mono text-xs text-white/40 group-hover:text-white/80 transition-colors">Apply →</p>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}
