'use client'

import React from 'react'

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts'
import { GlassCard } from '@/components/ui/glass-card'

interface OverviewChartProps {
    data?: { name: string; total: number }[]
    title?: string
    subtitle?: string
}

export function OverviewChart({ data = [], title = "Resumen Semanal", subtitle = "Actividad de transacciones" }: OverviewChartProps) {
    const chartData = data.length > 0 ? data : [
        { name: 'Lun', total: 0 },
        { name: 'Mar', total: 0 },
        { name: 'Mie', total: 0 },
        { name: 'Jue', total: 0 },
        { name: 'Vie', total: 0 },
        { name: 'Sab', total: 0 },
        { name: 'Dom', total: 0 },
    ]

    return (
        <GlassCard className="col-span-4 pl-0 pr-0 md:col-span-3 lg:h-[400px]">
            <div className="px-6 mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
            </div>
            <ResponsiveContainer width="100%" height={320}>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} vertical={false} />
                    <XAxis
                        dataKey="name"
                        stroke="#94a3b8"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#94a3b8"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `S/${value}`}
                    />
                    <Tooltip
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: 'none', borderRadius: '12px', color: '#fff' }}
                    />
                    <Bar dataKey="total" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
            </ResponsiveContainer>
        </GlassCard>
    )
}
