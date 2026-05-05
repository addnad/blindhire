'use client'
import React from 'react'
import { useReadContract } from 'wagmi'
import { BLINDHIRE_ABI, BLINDHIRE_ADDRESS } from '@/lib/abi'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const PAGE_SIZE = 5

function RoleCard({ roleId }: { roleId: bigint }) {
  const { data } = useReadContract({
    address: BLINDHIRE_ADDRESS,
    abi: BLINDHIRE_ABI,
    functionName: 'getRoleMetadata',
    args: [roleId],
  })

  if (!data || !data[4]) return null
  const [title, description, category] = data

  return (
    <div className="border border-foreground/10 p-8 hover:border-foreground/20 transition-all duration-300 group">
      <div className="flex items-start justify-between gap-6 mb-6">
        <div className="space-y-2">
          <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">{category}</span>
          <h3 className="text-2xl lg:text-3xl font-display group-hover:translate-x-1 transition-transform duration-300">{title}</h3>
          <p className="text-muted-foreground leading-relaxed max-w-xl">{description}</p>
        </div>
        <span className="font-mono text-xs text-muted-foreground border border-foreground/10 px-3 py-1 shrink-0">
          #{roleId.toString()}
        </span>
      </div>
      <div className="flex items-center justify-between pt-6 border-t border-foreground/10">
        <span className="font-mono text-xs text-muted-foreground">requirements encrypted ✓</span>
        <Button asChild size="sm" className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-6">
          <Link href={`/candidate?roleId=${roleId.toString()}`}>Apply</Link>
        </Button>
      </div>
    </div>
  )
}

export default function RolesList() {
  const [page, setPage] = React.useState(0)

  const { data: roleCount } = useReadContract({
    address: BLINDHIRE_ADDRESS,
    abi: BLINDHIRE_ABI,
    functionName: 'roleCount',
  })

  const count = roleCount ? Number(roleCount) : 0
  const totalPages = Math.ceil(count / PAGE_SIZE)
  const start = page * PAGE_SIZE
  const end = Math.min(start + PAGE_SIZE, count)
  const roleIds = Array.from({ length: end - start }, (_, i) => BigInt(start + i))

  if (count === 0) return (
    <div className="border border-foreground/10 p-12 text-center">
      <p className="text-muted-foreground font-mono text-sm mb-6">No roles posted yet.</p>
      <Button asChild className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-8">
        <Link href="/employer">Post the first role</Link>
      </Button>
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {roleIds.map(id => <RoleCard key={id.toString()} roleId={id} />)}
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-6 border-t border-foreground/10">
          <span className="font-mono text-xs text-muted-foreground">
            Showing {start + 1}–{end} of {count} roles
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="rounded-full px-4"
            >
              ← Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="rounded-full px-4"
            >
              Next →
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
