import React from 'react'
import { CreateWalletDialog } from '@/components/dashboard/create-wallet-dialog'
import { WalletCard } from '@/components/dashboard/wallet-card'
import { RecentTransactions } from '@/components/dashboard/recent-transactions'
import { getWallets } from '@/lib/actions'
import { Plus, Wallet, ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function WalletsPage() {
    const wallets = await getWallets()

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Mis Billeteras</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                        Administra tus cuentas y monitorea tus finanzas
                    </p>
                </div>
                <CreateWalletDialog>
                    <button 
                        type="button"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300"
                    >
                        <Plus className="h-5 w-5" />
                        <span>Nueva Cuenta</span>
                    </button>
                </CreateWalletDialog>
            </div>

            {/* Stats Summary */}
            {wallets.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Cuentas</p>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{wallets.length}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-900/30">
                                <Wallet className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Saldo Total (PEN)</p>
                                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                                    S/ {wallets.filter(w => w.currency === 'PEN').reduce((sum, w) => sum + Number(w.openingBalance), 0).toFixed(2)}
                                </p>
                            </div>
                            <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                                <ArrowUpRight className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Saldo Total (USD)</p>
                                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                                    $ {wallets.filter(w => w.currency === 'USD').reduce((sum, w) => sum + Number(w.openingBalance), 0).toFixed(2)}
                                </p>
                            </div>
                            <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30">
                                <ArrowDownLeft className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Wallets Grid */}
            <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Todas las Cuentas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wallets.map((wallet, index) => (
                        <WalletCard 
                            key={wallet.id} 
                            wallet={{
                                ...wallet,
                                openingBalance: Number(wallet.openingBalance)
                            }} 
                            index={index} 
                        />
                    ))}

                    {/* Add New Wallet Card */}
                    <CreateWalletDialog>
                        <button 
                            type="button"
                            className="w-full group flex h-full min-h-[360px] flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 hover:bg-indigo-50 hover:border-indigo-400 dark:border-slate-700 dark:bg-slate-900/20 dark:hover:bg-indigo-900/20 dark:hover:border-indigo-500 transition-all duration-300"
                        >
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 group-hover:scale-110 transition-transform shadow-lg">
                                <Plus className="h-8 w-8 text-white" />
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                    Agregar Nueva Cuenta
                                </p>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                    Crea una nueva billetera
                                </p>
                            </div>
                        </button>
                    </CreateWalletDialog>
                </div>
            </div>

            {/* Recent Transactions Section */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Actividad Reciente</h2>
                    <Link 
                        href="/dashboard/transactions"
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                    >
                        Ver todas →
                    </Link>
                </div>
                <RecentTransactions />
            </div>
        </div>
    )
}
