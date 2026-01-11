import React from 'react'
import { getWalletDetails } from '@/lib/actions'
import { WalletDateFilter } from '@/components/dashboard/wallet-date-filter'
import { RecentTransactions } from '@/components/dashboard/recent-transactions'
import { OverviewChart } from '@/components/dashboard/overview-chart'
import { GlassCard } from '@/components/ui/glass-card'
import { ArrowLeft, Wallet, TrendingUp, TrendingDown } from 'lucide-react'
import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'

interface WalletPageProps {
    params: Promise<{ id: string }>
    searchParams: Promise<{ from?: string; to?: string }>
}

export default async function WalletPage({ params, searchParams }: WalletPageProps) {
    const { id } = await params
    const { from, to } = await searchParams

    const startDate = from ? new Date(from) : new Date(new Date().setDate(new Date().getDate() - 30))
    const endDate = to ? new Date(to) : new Date()

    if (to) {
        endDate.setHours(23, 59, 59, 999)
    }

    const wallet = await getWalletDetails(id, startDate, endDate)

    if (!wallet) {
        notFound()
    }

    // Chart Data Preparation (Simple Daily Grouping)
    const chartMap = new Map<string, number>()

    // Group transactions by day for chart
    wallet.transactions.forEach((tx) => {
        const dateKey = new Date(tx.date).toLocaleDateString('es-ES', { weekday: 'short' })
        if (tx.type === 'expense') {
            chartMap.set(dateKey, (chartMap.get(dateKey) || 0) + Number(tx.amount))
        }
    })

    const chartData = Array.from(chartMap.entries()).map(([name, total]) => ({ name, total }))

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/wallets" className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <ArrowLeft className="h-6 w-6 text-slate-500" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Wallet className="h-6 w-6 text-indigo-500" />
                        {wallet.name}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 capitalize">{wallet.type} • {wallet.currency}</p>
                </div>
                <div className="ml-auto">
                    <WalletDateFilter />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GlassCard className="p-6">
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Saldo Actual</p>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                        {wallet.currency === 'PEN' ? 'S/' : '$'} {wallet.openingBalance.toFixed(2)}
                    </h2>
                </GlassCard>
                <GlassCard className="p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600">
                            <TrendingUp className="h-5 w-5" />
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Ingresos (Periodo)</p>
                    </div>
                    <h2 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {wallet.currency === 'PEN' ? 'S/' : '$'} {wallet.summary.income.toFixed(2)}
                    </h2>
                </GlassCard>
                <GlassCard className="p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600">
                            <TrendingDown className="h-5 w-5" />
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Gastos (Periodo)</p>
                    </div>
                    <h2 className="text-2xl font-bold text-rose-600 dark:text-rose-400">
                        {wallet.currency === 'PEN' ? 'S/' : '$'} {wallet.summary.expense.toFixed(2)}
                    </h2>
                </GlassCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <OverviewChart data={chartData} title="Gastos del Periodo" subtitle="Desglose por día" />
                </div>
                <div className="lg:col-span-1">
                    <RecentTransactions transactions={wallet.transactions} limit={10} />
                </div>
            </div>
        </div>
    )
}
