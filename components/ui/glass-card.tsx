'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
    className?: string
}

export function GlassCard({ children, className, ...props }: GlassCardProps) {
    return (
        <div
            className={cn(
                'relative overflow-hidden rounded-2xl border border-slate-200 bg-white',
                'dark:border-slate-800 dark:bg-slate-900',
                'shadow-lg hover:shadow-xl transition-shadow duration-300',
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
}
