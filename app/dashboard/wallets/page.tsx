'use client'

import { GlassCard } from '@/components/ui/glass-card'
import { Plus, Wallet, ArrowUpRight, ArrowDownLeft, MoreHorizontal } from 'lucide-react'

const wallets = [
    { id: 1, name: 'Principal BCP', type: 'Débito', balance: '12,450.00', currency: 'PEN', color: 'from-indigo-500 to-purple-500' },
    { id: 2, name: 'Ahorros Interbank', type: 'Ahorros', balance: '5,000.00', currency: 'USD', color: 'from-emerald-500 to-teal-500' },
    { id: 3, name: 'Efectivo', type: 'Físico', balance: '450.00', currency: 'PEN', color: 'from-orange-500 to-amber-500' },
]

export default function WalletsPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Mis Billeteras</h1>
                    <p className="text-slate-500 dark:text-slate-400">Gestiona tus cuentas y tarjetas</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors shadow-lg shadow-indigo-500/20">
                    <Plus className="h-5 w-5" />
                    <span>Nueva Billetera</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wallets.map((wallet, index) => (
                    <GlassCard key={wallet.id} delay={index * 0.1} className="group cursor-pointer">
                        <div className={`absolute inset-0 bg-gradient-to-br ${wallet.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                        <div className="flex justify-between items-start mb-8">
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${wallet.color} shadow-lg`}>
                                <Wallet className="h-6 w-6 text-white" />
                            </div>
                            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                <MoreHorizontal className="h-6 w-6" />
                            </button>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{wallet.type}</p>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">{wallet.name}</h3>
                        </div>

                        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                            <div className="flex justify-between items-baseline">
                                <span className="text-sm text-slate-500 dark:text-slate-400">Saldo disponible</span>
                                <span className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {wallet.currency === 'PEN' ? 'S/' : '$'} {wallet.balance}
                                </span>
                            </div>
                        </div>
                    </GlassCard>
                ))}

                <button className="group relative flex h-full min-h-[240px] flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 hover:bg-slate-100 hover:border-indigo-400 dark:border-slate-700 dark:bg-slate-900/20 dark:hover:bg-slate-900/50 dark:hover:border-indigo-500 transition-all duration-300">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 group-hover:bg-indigo-100 dark:bg-slate-800 dark:group-hover:bg-indigo-900/30 transition-colors">
                        <Plus className="h-8 w-8 text-slate-400 group-hover:text-indigo-600 dark:text-slate-500 dark:group-hover:text-indigo-400" />
                    </div>
                    <p className="text-base font-medium text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        Agregar Nueva Cuenta
                    </p>
                </button>
            </div>

            <div className="mt-12">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Actividad Reciente</h2>
                <GlassCard>
                    <div className="divide-y divide-slate-200 dark:divide-slate-800">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-full ${item % 2 === 0 ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400' : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'}`}>
                                        {item % 2 === 0 ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownLeft className="h-5 w-5" />}
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900 dark:text-white">Supermercado Metro</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Hace 2 horas • Principal BCP</p>
                                    </div>
                                </div>
                                <span className={`font-bold ${item % 2 === 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                    {item % 2 === 0 ? '-' : '+'} S/ 320.50
                                </span>
                            </div>
                        ))}
                    </div>
                </GlassCard>
            </div>
        </div>
    )
}
