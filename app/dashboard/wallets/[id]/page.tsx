import React from 'react'
import { getWalletDetails } from '@/lib/actions'
import { WalletDateFilter } from '@/components/dashboard/wallet-date-filter'
import { ExpensesPieChart } from '@/components/dashboard/expenses-pie-chart'
import { ExpensesList } from '@/components/dashboard/expenses-list'
import { OverviewChart } from '@/components/dashboard/overview-chart'
import { GlassCard } from '@/components/ui/glass-card'
import { ArrowLeft, Wallet, TrendingUp, TrendingDown, Plus, ArrowLeftRight, Download } from 'lucide-react'
import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'
export const revalidate = 0

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

    // Prepare pie chart data with colors
    const CATEGORY_COLORS = [
        '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981',
        '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899'
    ]

    const pieChartData = (wallet.expensesByCategory || []).map((cat, index) => ({
        name: cat.name,
        value: cat.total,
        color: CATEGORY_COLORS[index % CATEGORY_COLORS.length]
    }))

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <Link href="/dashboard/wallets" className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors w-fit">
                    <ArrowLeft className="h-6 w-6 text-slate-500" />
                </Link>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Wallet className="h-8 w-8 text-indigo-500" />
                        {wallet.name}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 capitalize mt-1">
                        {wallet.type === 'cash' && 'Efectivo'}
                        {wallet.type === 'bank' && 'Cuenta Bancaria'}
                        {wallet.type === 'card' && 'Tarjeta'}
                        {wallet.type === 'wallet' && 'Billetera Digital'}
                        {' • '}
                        {wallet.currency}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <WalletDateFilter />
                    <Link
                        href={`/dashboard/transactions/new?accountId=${wallet.id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        Nueva Transacción
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GlassCard className="p-6 bg-gradient-to-br from-indigo-500 to-purple-500">
                    <p className="text-white/80 text-sm font-medium mb-1">Saldo Actual</p>
                    <h2 className="text-4xl font-bold text-white">
                        {wallet.currency === 'PEN' ? 'S/' : '$'} {wallet.openingBalance.toFixed(2)}
                    </h2>
                    <p className="text-white/60 text-xs mt-2">
                        Actualizado ahora
                    </p>
                </GlassCard>
                <GlassCard className="p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                            <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Ingresos</p>
                    </div>
                    <h2 className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                        {wallet.currency === 'PEN' ? 'S/' : '$'} {wallet.summary.income.toFixed(2)}
                    </h2>
                    <p className="text-slate-400 text-xs mt-1">Periodo seleccionado</p>
                </GlassCard>
                <GlassCard className="p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-full bg-rose-100 dark:bg-rose-900/30">
                            <TrendingDown className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Gastos</p>
                    </div>
                    <h2 className="text-3xl font-bold text-rose-600 dark:text-rose-400">
                        {wallet.currency === 'PEN' ? 'S/' : '$'} {wallet.summary.expense.toFixed(2)}
                    </h2>
                    <p className="text-slate-400 text-xs mt-1">Periodo seleccionado</p>
                </GlassCard>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                    href={`/dashboard/transactions/new?accountId=${wallet.id}&type=income`}
                    className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 transition-colors group"
                >
                    <div className="p-2 rounded-lg bg-emerald-500 text-white group-hover:scale-110 transition-transform">
                        <TrendingUp className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="font-semibold text-emerald-900 dark:text-emerald-100">Agregar Ingreso</p>
                        <p className="text-sm text-emerald-600 dark:text-emerald-400">Registrar entrada de dinero</p>
                    </div>
                </Link>
                
                <Link
                    href={`/dashboard/transactions/new?accountId=${wallet.id}&type=expense`}
                    className="flex items-center gap-3 p-4 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-900/20 dark:hover:bg-rose-900/30 border border-rose-200 dark:border-rose-800 transition-colors group"
                >
                    <div className="p-2 rounded-lg bg-rose-500 text-white group-hover:scale-110 transition-transform">
                        <TrendingDown className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="font-semibold text-rose-900 dark:text-rose-100">Agregar Gasto</p>
                        <p className="text-sm text-rose-600 dark:text-rose-400">Registrar salida de dinero</p>
                    </div>
                </Link>

                <Link
                    href={`/dashboard/transfers/new?fromId=${wallet.id}`}
                    className="flex items-center gap-3 p-4 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 transition-colors group"
                >
                    <div className="p-2 rounded-lg bg-indigo-500 text-white group-hover:scale-110 transition-transform">
                        <ArrowLeftRight className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="font-semibold text-indigo-900 dark:text-indigo-100">Transferir</p>
                        <p className="text-sm text-indigo-600 dark:text-indigo-400">Entre tus cuentas</p>
                    </div>
                </Link>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ExpensesPieChart 
                    data={pieChartData} 
                    title="Gastos por Categoría" 
                    currency={wallet.currency === 'PEN' ? 'S/' : '$'} 
                />
                <OverviewChart data={chartData} title="Gastos del Periodo" subtitle="Desglose por día" />
            </div>

            {/* Transactions List */}
            <ExpensesList 
                transactions={wallet.transactions} 
                currency={wallet.currency === 'PEN' ? 'S/' : '$'} 
            />
        </div>
    )
}
