'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Eye, Plus, Wallet, CreditCard, Banknote, PiggyBank } from 'lucide-react'
import { WalletActions } from './wallet-actions'

interface WalletCardProps {
    wallet: {
        id: string
        name: string
        type: string
        currency: string
        openingBalance: number
    }
    index: number
}

const WALLET_ICONS = {
    cash: Banknote,
    bank: CreditCard,
    card: CreditCard,
    wallet: PiggyBank,
}

const WALLET_COLORS = {
    cash: 'from-emerald-500 to-teal-500',
    bank: 'from-indigo-500 to-purple-500',
    card: 'from-orange-500 to-amber-500',
    wallet: 'from-rose-500 to-pink-500',
}

function getWalletIcon(type: string) {
    return WALLET_ICONS[type as keyof typeof WALLET_ICONS] || Wallet
}

function getWalletColor(type: string) {
    return WALLET_COLORS[type as keyof typeof WALLET_COLORS] || 'from-blue-500 to-cyan-500'
}

export function WalletCard({ wallet, index }: WalletCardProps) {
    const router = useRouter()
    const IconComponent = getWalletIcon(wallet.type)
    const colorGradient = getWalletColor(wallet.type)

    const handleCardClick = () => {
        router.push(`/dashboard/wallets/${wallet.id}`)
    }

    const handleViewDetails = (e: React.MouseEvent) => {
        e.stopPropagation()
        router.push(`/dashboard/wallets/${wallet.id}`)
    }

    const handleNewTransaction = (e: React.MouseEvent) => {
        e.stopPropagation()
        router.push(`/dashboard/transactions/new?accountId=${wallet.id}`)
    }

    const handleMenuClick = (e: React.MouseEvent) => {
        e.stopPropagation()
    }

    return (
        <div 
            className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group"
            onClick={handleCardClick}
        >
            {/* Card Header */}
            <div className={`p-6 bg-gradient-to-br ${colorGradient} relative`}>
                <div className="flex items-start justify-between mb-8">
                    <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                        <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex gap-2 relative z-10" onClick={handleMenuClick}>
                        <button
                            type="button"
                            onClick={handleViewDetails}
                            className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-colors cursor-pointer"
                            title="Ver detalles"
                            aria-label="Ver detalles"
                        >
                            <Eye className="h-4 w-4 text-white" />
                        </button>
                        <WalletActions walletId={wallet.id} />
                    </div>
                </div>
                <div>
                    <p className="text-white/80 text-xs font-medium uppercase tracking-wider mb-1">
                        {wallet.type === 'cash' && 'Efectivo'}
                        {wallet.type === 'bank' && 'Cuenta Bancaria'}
                        {wallet.type === 'card' && 'Tarjeta'}
                        {wallet.type === 'wallet' && 'Billetera Digital'}
                    </p>
                    <h3 className="text-white text-xl font-bold">{wallet.name}</h3>
                </div>
            </div>

            {/* Card Body */}
            <div className="p-6 bg-slate-900">
                <div className="flex items-baseline justify-between mb-6">
                    <span className="text-sm font-medium text-slate-400">Saldo disponible</span>
                    <span className="text-sm font-semibold text-slate-300">
                        {wallet.currency}
                    </span>
                </div>
                <div className="text-3xl font-bold text-white mb-6">
                    {wallet.currency === 'PEN' ? 'S/' : '$'} {Number(wallet.openingBalance).toFixed(2)}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 relative z-10">
                    <button
                        type="button"
                        onClick={handleViewDetails}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
                        aria-label="Ver detalles de la cuenta"
                    >
                        <Eye className="h-4 w-4" />
                        Ver Detalles
                    </button>
                    <button
                        type="button"
                        onClick={handleNewTransaction}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
                        aria-label="Nueva transacción"
                    >
                        <Plus className="h-4 w-4" />
                        Transacción
                    </button>
                </div>
            </div>
        </div>
    )
}
