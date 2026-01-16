'use client'

import { useState } from 'react'
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, TrashIcon } from '@heroicons/react/24/outline'
import { deleteTransaction } from '@/lib/actions/transactions'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

type Transaction = {
  id: string
  type: string
  amount: any
  date: Date
  description: string | null
  account: {
    name: string
  }
  category: {
    name: string
  } | null
}

export default function TransactionsList({ transactions }: { transactions: Transaction[] }) {
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este movimiento?')) return

    setDeleting(id)
    const result = await deleteTransaction(id)
    
    if (result.error) {
      alert(result.error)
    }
    setDeleting(null)
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="rounded-2xl bg-slate-900 border-2 border-slate-800 p-6 hover:border-slate-700 transition-all duration-200 shadow-lg"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <div className={`p-3 rounded-xl ${transaction.type === 'income'
                  ? 'bg-green-500/10 border border-green-500/30'
                  : 'bg-red-500/10 border border-red-500/30'
                }`}>
                {transaction.type === 'income' ? (
                  <ArrowTrendingUpIcon className="h-6 w-6 text-green-400" />
                ) : (
                  <ArrowTrendingDownIcon className="h-6 w-6 text-red-400" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-white">
                    {transaction.account.name}
                  </h3>
                  {transaction.category && (
                    <span className="text-xs px-2 py-1 rounded-lg bg-slate-800 text-slate-400 border border-slate-700">
                      {transaction.category.name}
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-400 mb-2">
                  {transaction.description || 'Sin descripción'}
                </p>
                <p className="text-xs text-slate-500">
                  {format(new Date(transaction.date), "d 'de' MMMM, yyyy", { locale: es })}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-right">
                <p className={`text-2xl font-bold ${transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                  }`}>
                  {transaction.type === 'income' ? '+' : '-'} S/ {Number(transaction.amount).toFixed(2)}
                </p>
              </div>
              <button
                onClick={() => handleDelete(transaction.id)}
                disabled={deleting === transaction.id}
                className="text-slate-400 hover:text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition-all disabled:opacity-50"
                title="Eliminar movimiento"
              >
                <TrashIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
