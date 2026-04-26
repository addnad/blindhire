'use client'
import React from 'react'
import { cn } from '@/lib/utils'

interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: string[]
}

export function SelectInput({ options, className, ...props }: SelectInputProps) {
  return (
    <select
      className={cn(
        "w-full bg-secondary border border-border rounded-md px-4 py-3 text-foreground focus:outline-none focus:ring-1 focus:ring-ring font-mono appearance-none cursor-pointer",
        className
      )}
      {...props}>
      {options.map(o => (
        <option key={o} value={o} className="bg-background text-foreground">{o}</option>
      ))}
    </select>
  )
}
