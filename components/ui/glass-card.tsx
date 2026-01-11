'use client'

import React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'initial' | 'animate' | 'transition'> {
    children: React.ReactNode
    className?: string
    delay?: number
}

export function GlassCard({ children, className, delay = 0, ...props }: GlassCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay, ease: 'easeOut' }}
            className={cn(
                'relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl',
                'dark:border-slate-800/50 dark:bg-slate-900/50',
                'shadow-lg hover:shadow-xl transition-shadow duration-300',
                className
            )}
            {...props}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent dark:from-white/5 opacity-50 pointer-events-none" />
            <div className="relative z-10">{children}</div>
        </motion.div>
    )
}
