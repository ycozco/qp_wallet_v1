'use client'

import React from 'react'
import { GlassCard } from '@/components/ui/glass-card'
import { Receipt, TrendingDown } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface Transaction {
    id: string
    type: string
    description: string | null
    amount: number | string
    date: Date
    category?: {
        id: string
        name: string
        icon: string | null
    } | null
}

interface ExpensesListProps {
    transactions: Transaction[]
    currency?: string
}

export function ExpensesList({ transactions, currency = 'S/' }: ExpensesListProps) {
    const expenses = transactions.filter(tx => tx.type === 'expense')

    if (expenses.length === 0) {
        return (
            <GlassCard className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Gastos Detallados</h3>
                <div className="flex flex-col items-center justify-center py-12">
                    <TrendingDown className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-3" />
                    <p className="text-slate-500 dark:text-slate-400 text-center">
                        No hay gastos registrados en este periodo
                    </p>
                </div>
            </GlassCard>
        )
    }

    return (
        <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Gastos Detallados</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        {expenses.length} transacciones
                    </p>
                </div>
                <div className="px-3 py-1 bg-rose-100 dark:bg-rose-900/30 rounded-full">
                    <span className="text-sm font-medium text-rose-600 dark:text-rose-400">
                        {currency} {expenses.reduce((sum, tx) => sum + Number(tx.amount), 0).toFixed(2)}
                    </span>
                </div>
            </div>

            <div className="max-h-[600px] overflow-y-auto custom-scrollbar space-y-3">
                {expenses.map((tx) => (
                    <div 
                        key={tx.id} 
                        className="flex items-start justify-between p-3 rounded-xl hover:bg-white/5 transition-colors border border-slate-200 dark:border-slate-800"
                    >
                        <div className="flex items-start gap-3 flex-1">
                            <div className="h-10 w-10 rounded-full flex items-center justify-center bg-rose-100 text-rose-600 dark:bg-rose-900/30 flex-shrink-0">
                                <Receipt className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                    {tx.description || 'Sin descripción'}
                                </p>
                                {tx.category && (
                                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">
                                        {tx.category.icon} {tx.category.name}
                                    </p>
                                )}
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    {format(new Date(tx.date), "dd 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })}
                                </p>
                            </div>
                        </div>
                        <div className="text-right ml-3 flex-shrink-0">
                            <p className="text-base font-bold text-rose-600 dark:text-rose-400">
                                -{currency} {Number(tx.amount).toFixed(2)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </GlassCard>
    )
}
