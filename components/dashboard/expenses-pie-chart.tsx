'use client'

import React from 'react'
import { GlassCard } from '@/components/ui/glass-card'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface ExpenseData {
    name: string
    value: number
    color: string
}

interface ExpensesPieChartProps {
    data: ExpenseData[]
    title?: string
    currency?: string
}

const COLORS = [
    '#ef4444', // red-500
    '#f97316', // orange-500
    '#f59e0b', // amber-500
    '#84cc16', // lime-500
    '#10b981', // emerald-500
    '#06b6d4', // cyan-500
    '#3b82f6', // blue-500
    '#6366f1', // indigo-500
    '#8b5cf6', // violet-500
    '#ec4899', // pink-500
]

const CustomTooltip = ({ active, payload, currency = 'S/' }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-700">
                <p className="text-sm font-medium text-white">{payload[0].name}</p>
                <p className="text-sm font-bold text-indigo-400">
                    {currency} {payload[0].value.toFixed(2)}
                </p>
                <p className="text-xs text-slate-400">
                    {((payload[0].percent || 0) * 100).toFixed(1)}%
                </p>
            </div>
        )
    }
    return null
}

export function ExpensesPieChart({ data, title = "Gastos por Categoría", currency = "S/" }: ExpensesPieChartProps) {
    if (!data || data.length === 0) {
        return (
            <GlassCard className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
                <div className="flex items-center justify-center h-64">
                    <p className="text-slate-400 text-center">
                        No hay datos de gastos para mostrar
                    </p>
                </div>
            </GlassCard>
        )
    }

    const total = data.reduce((sum, item) => sum + item.value, 0)

    return (
        <GlassCard className="p-6">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                <p className="text-sm text-slate-400">
                    Total: {currency} {total.toFixed(2)}
                </p>
            </div>
            
            <div className="w-full" style={{ minHeight: '350px', height: '350px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data as any}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip currency={currency} />} />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
                {data.slice(0, 6).map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: item.color || COLORS[index % COLORS.length] }}
                        />
                        <span className="text-xs text-slate-400 truncate">
                            {item.name}: {currency} {item.value.toFixed(2)}
                        </span>
                    </div>
                ))}
                {data.length > 6 && (
                    <div className="col-span-2 text-xs text-slate-400 text-center mt-2">
                        +{data.length - 6} categorías más
                    </div>
                )}
            </div>
        </GlassCard>
    )
}
