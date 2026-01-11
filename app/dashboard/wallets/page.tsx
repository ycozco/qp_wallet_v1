import { CreateWalletDialog } from '@/components/dashboard/create-wallet-dialog'
import { RecentTransactions } from '@/components/dashboard/recent-transactions'
import { GlassCard } from '@/components/ui/glass-card'
import { getWallets } from '@/lib/actions'
import { Plus, Wallet, MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const WALLET_COLORS = [
    'from-indigo-500 to-purple-500',
    'from-emerald-500 to-teal-500',
    'from-orange-500 to-amber-500',
    'from-blue-500 to-cyan-500',
    'from-rose-500 to-pink-500',
]

function getWalletColor(index: number) {
    return WALLET_COLORS[index % WALLET_COLORS.length]
}

export default async function WalletsPage() {
    const wallets = await getWallets()

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Mis Billeteras</h1>
                    <p className="text-slate-500 dark:text-slate-400">Gestiona tus cuentas y tarjetas</p>
                </div>
                <CreateWalletDialog>
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors shadow-lg shadow-indigo-500/20">
                        <Plus className="h-5 w-5" />
                        <span>Nueva Billetera</span>
                    </button>
                </CreateWalletDialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wallets.map((wallet, index) => (
                    <GlassCard key={wallet.id} delay={index * 0.1} className="group relative h-full">
                        {/* Clickable Card Link */}
                        <Link href={`/dashboard/wallets/${wallet.id}`} className="absolute inset-0 z-10" />

                        <div className={`absolute inset-0 bg-gradient-to-br ${getWalletColor(index)} opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none`} />

                        <div className="flex justify-between items-start mb-8 relative z-20 pointer-events-none">
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${getWalletColor(index)} shadow-lg`}>
                                <Wallet className="h-6 w-6 text-white" />
                            </div>
                            <div className="pointer-events-auto">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                                            <MoreHorizontal className="h-6 w-6" />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>
                                            Editar
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400">
                                            Eliminar
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        <div className="relative z-10 pointer-events-none">
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase">{wallet.type}</p>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">{wallet.name}</h3>
                        </div>

                        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 relative z-10 pointer-events-none">
                            <div className="flex justify-between items-baseline">
                                <span className="text-sm text-slate-500 dark:text-slate-400">Saldo disponible</span>
                                <span className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {wallet.currency === 'PEN' ? 'S/' : '$'} {Number(wallet.openingBalance).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </GlassCard>
                ))}

                <CreateWalletDialog>
                    <button className="w-full group relative flex h-full min-h-[240px] flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 hover:bg-slate-100 hover:border-indigo-400 dark:border-slate-700 dark:bg-slate-900/20 dark:hover:bg-slate-900/50 dark:hover:border-indigo-500 transition-all duration-300">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 group-hover:bg-indigo-100 dark:bg-slate-800 dark:group-hover:bg-indigo-900/30 transition-colors">
                            <Plus className="h-8 w-8 text-slate-400 group-hover:text-indigo-600 dark:text-slate-500 dark:group-hover:text-indigo-400" />
                        </div>
                        <p className="text-base font-medium text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            Agregar Nueva Cuenta
                        </p>
                    </button>
                </CreateWalletDialog>
            </div>

            <div className="mt-12">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Actividad Reciente</h2>
                <RecentTransactions />
            </div>
        </div>
    )
}
