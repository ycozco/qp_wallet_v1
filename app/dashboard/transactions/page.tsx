import React from 'react'
import { getTransactions } from '@/lib/actions/transactions'
import TransactionsList from './TransactionsList'
import Link from 'next/link'
import { PlusIcon } from '@heroicons/react/24/outline'

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
        <TransactionsList transactions={transactions} />
      )}
    </div>
  )
}
