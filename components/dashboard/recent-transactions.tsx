'use client'

import { GlassCard } from '@/components/ui/glass-card'
import { ArrowUpRight, ArrowDownLeft, Receipt } from 'lucide-react'

// TODO: Accept props for real data
export function RecentTransactions() {
    return (
        <GlassCard className="col-span-4 md:col-span-3 lg:col-span-2 lg:h-[400px]">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Transacciones Recientes</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Últimos movimientos</p>
                </div>
            </div>

            <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center justify-between group cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-colors">
                        <div className="flex items-center gap-4">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${i % 2 === 0 ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30' : 'bg-rose-100 text-rose-600 dark:bg-rose-900/30'}`}>
                                {i % 2 === 0 ? <Receipt className="h-5 w-5" /> : <ArrowDownLeft className="h-5 w-5" />}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-900 dark:text-white">Pago de Servicios</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Hace 2 horas</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className={`text-sm font-bold ${i % 2 === 0 ? 'text-slate-900 dark:text-white' : 'text-slate-900 dark:text-white'}`}>
                                -S/ 150.00
                            </p>
                        </div>
                    </div>
                ))}

                <button className="w-full mt-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors">
                    Ver todas las transacciones
                </button>
            </div>
        </GlassCard>
    )
}
