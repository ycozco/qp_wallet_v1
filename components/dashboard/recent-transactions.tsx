'use client'

import React from 'react'

import { GlassCard } from '@/components/ui/glass-card'
import { ArrowUpRight, ArrowDownLeft, Receipt } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface Transaction {
    id: string
    type: string
    description: string | null
    amount: number | string // Decimal is string in JSON/Prisma mostly unless mapped
    date: Date
}

interface RecentTransactionsProps {
    transactions?: Transaction[]
    limit?: number
}

export function RecentTransactions({ transactions = [], limit }: RecentTransactionsProps) {
    const displayTransactions = limit ? transactions.slice(0, limit) : transactions

    return (
        <GlassCard className="col-span-4 md:col-span-3 lg:col-span-2 lg:h-[400px] overflow-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-6 sticky top-0 bg-inherit z-10 p-2 backdrop-blur-md">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Transacciones Recientes</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Últimos movimientos</p>
                </div>
            </div>

            <div className="space-y-4 px-2">
                {displayTransactions.length === 0 ? (
                    <p className="text-center text-slate-500 py-8">No hay transacciones recientes.</p>
                ) : (
                    displayTransactions.map((tx) => (
                        <div key={tx.id} className="flex items-center justify-between group cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${tx.type === 'income' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30' : 'bg-rose-100 text-rose-600 dark:bg-rose-900/30'}`}>
                                    {tx.type === 'income' ? <ArrowDownLeft className="h-5 w-5" /> : <Receipt className="h-5 w-5" />}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">{tx.description || 'Sin descripción'}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                                        {format(new Date(tx.date), 'dd MMM, HH:mm', { locale: es })}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`text-sm font-bold ${tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                                    {tx.type === 'income' ? '+' : '-'} S/ {Number(tx.amount).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    ))
                )}

                <Link href="/dashboard/transactions" className="block w-full text-center mt-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors">
                    Ver todas las transacciones
                </Link>
            </div>
        </GlassCard>
    )
}
