'use client'

import { TrashIcon } from '@heroicons/react/24/outline'
import { deleteAccount } from '@/lib/actions/accounts'
import { useState } from 'react'

type AccountWithBalance = {
  id: string
  name: string
  type: string
  currency: string
  openingBalance: number
  currentBalance: number
}

export default function AccountsList({ accounts }: { accounts: AccountWithBalance[] }) {
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta cuenta?')) return

    setDeleting(id)
    await deleteAccount(id)
    setDeleting(null)
  }

  const accountTypes: Record<string, string> = {
    cash: 'Efectivo',
    bank: 'Banco',
    card: 'Tarjeta',
    wallet: 'Billetera Digital'
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {accounts.map((account) => (
        <div 
          key={account.id}
          className="rounded-2xl bg-slate-900 border-2 border-slate-800 p-6 hover:border-slate-700 transition-all duration-200 shadow-lg"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <span className="inline-flex rounded-lg bg-indigo-500/10 border border-indigo-500/30 px-3 py-1 text-sm font-medium text-indigo-400">
                {accountTypes[account.type]}
              </span>
            </div>
            <button
              onClick={() => handleDelete(account.id)}
              disabled={deleting === account.id}
              className="text-slate-400 hover:text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition-all disabled:opacity-50"
            >
              <TrashIcon className="h-6 w-6" />
            </button>
          </div>
          
          <h3 className="text-xl font-bold text-white mb-3">
            {account.name}
          </h3>
          
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-slate-400">Balance inicial:</span>
              <span className="text-sm font-semibold text-slate-300">
                {account.currency} {account.openingBalance.toFixed(2)}
              </span>
            </div>
            <div className="flex items-baseline justify-between pt-2 border-t border-slate-700">
              <span className="text-sm text-slate-400">Balance actual:</span>
              <span className={`text-2xl font-bold ${
                account.currentBalance >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {account.currency} {account.currentBalance.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
