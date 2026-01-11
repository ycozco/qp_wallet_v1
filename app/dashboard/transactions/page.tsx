import React from 'react'
import { getTransactions } from '@/lib/actions/transactions'
import Link from 'next/link'
import { PlusIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default async function TransactionsPage() {
  const transactions = await getTransactions()

  return (
    <div className="space-y-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Movimientos</h1>
          <p className="text-lg text-slate-400">
            Historial de ingresos y gastos
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/dashboard/transactions/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-indigo-600/50 hover:bg-indigo-500 hover:shadow-xl hover:shadow-indigo-500/50 transition-all duration-200 active:scale-95"
          >
            <PlusIcon className="h-6 w-6" />
            Nuevo Movimiento
          </Link>
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center rounded-2xl bg-slate-900 border-2 border-slate-800 py-16 px-8">
          <div className="mx-auto w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
            <PlusIcon className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No hay movimientos</h3>
          <p className="text-base text-slate-400 mb-6">Registra tus primeros ingresos o gastos</p>
          <Link
            href="/dashboard/transactions/new"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-indigo-600/50 hover:bg-indigo-500 transition-all duration-200 active:scale-95"
          >
            <PlusIcon className="h-6 w-6" />
            Nuevo Movimiento
          </Link>
        </div>
      ) : (
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
                <div className="text-right">
                  <p className={`text-2xl font-bold ${transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                    }`}>
                    {transaction.type === 'income' ? '+' : '-'} S/ {Number(transaction.amount).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
