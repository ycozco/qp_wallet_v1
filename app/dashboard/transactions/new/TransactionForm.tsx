'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createTransaction } from '@/lib/actions/transactions'
import { getAccounts } from '@/lib/actions/accounts'
import { getCategories } from '@/lib/actions/categories'
import { Account, Category } from '@prisma/client'

export default function TransactionForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [accounts, setAccounts] = useState<Account[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [type, setType] = useState<'income' | 'expense'>('expense')

  useEffect(() => {
    async function loadData() {
      const [accountsData, categoriesData] = await Promise.all([
        getAccounts(),
        getCategories()
      ])
      setAccounts(accountsData)
      setCategories(categoriesData)
    }
    loadData()
  }, [])

  const filteredCategories = categories.filter(
    cat => cat.kind === type || cat.kind === 'both'
  )

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const result = await createTransaction(formData)

    if (!result.error) {
      router.push('/dashboard/transactions')
      router.refresh()
    } else {
      alert(result.error)
      setLoading(false)
    }
  }

  if (accounts.length === 0) {
    return (
      <div className="max-w-2xl rounded-2xl bg-slate-900 border-2 border-slate-800 p-8 shadow-lg text-center">
        <h3 className="text-xl font-bold text-white mb-2">No tienes cuentas</h3>
        <p className="text-slate-400 mb-4">Necesitas crear al menos una cuenta para registrar movimientos</p>
        <button
          onClick={() => router.push('/dashboard/accounts/new')}
          className="rounded-xl bg-indigo-600 px-6 py-3 text-base font-bold text-white hover:bg-indigo-500 transition-all"
        >
          Crear Cuenta
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl rounded-2xl bg-slate-900 border-2 border-slate-800 p-8 shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-7">
        {/* Tipo */}
        <div>
          <label className="block text-base font-semibold text-slate-200 mb-3">
            Tipo de movimiento *
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`rounded-xl p-4 text-base font-bold transition-all duration-200 ${
                type === 'expense'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/50'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border-2 border-slate-700'
              }`}
            >
              Gasto
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`rounded-xl p-4 text-base font-bold transition-all duration-200 ${
                type === 'income'
                  ? 'bg-green-600 text-white shadow-lg shadow-green-600/50'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border-2 border-slate-700'
              }`}
            >
              Ingreso
            </button>
          </div>
          <input type="hidden" name="type" value={type} />
        </div>

        {/* Monto */}
        <div>
          <label className="block text-base font-semibold text-slate-200 mb-3">
            Monto *
          </label>
          <div className="relative">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-lg font-bold">
              S/
            </span>
            <input
              type="number"
              name="amount"
              required
              step="0.01"
              min="0.01"
              placeholder="0.00"
              className="block w-full rounded-xl bg-slate-800 border-2 border-slate-700 text-white text-lg px-5 py-4 pl-14 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 focus:outline-none placeholder-slate-500 transition-all"
            />
          </div>
        </div>

        {/* Cuenta */}
        <div>
          <label className="block text-base font-semibold text-slate-200 mb-3">
            Cuenta *
          </label>
          <select
            name="accountId"
            required
            className="block w-full rounded-xl bg-slate-800 border-2 border-slate-700 text-white text-lg px-5 py-4 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 focus:outline-none transition-all"
          >
            <option value="">Selecciona una cuenta</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name} ({account.currency} {Number(account.openingBalance).toFixed(2)})
              </option>
            ))}
          </select>
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-base font-semibold text-slate-200 mb-3">
            Categoría (opcional)
          </label>
          <select
            name="categoryId"
            className="block w-full rounded-xl bg-slate-800 border-2 border-slate-700 text-white text-lg px-5 py-4 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 focus:outline-none transition-all"
          >
            <option value="">Sin categoría</option>
            {filteredCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {filteredCategories.length === 0 && (
            <p className="mt-2 text-sm text-slate-400">
              No hay categorías disponibles para {type === 'income' ? 'ingresos' : 'gastos'}
            </p>
          )}
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-base font-semibold text-slate-200 mb-3">
            Descripción (opcional)
          </label>
          <textarea
            name="description"
            rows={3}
            placeholder="Ej: Compra de supermercado, pago de alquiler..."
            className="block w-full rounded-xl bg-slate-800 border-2 border-slate-700 text-white text-lg px-5 py-4 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 focus:outline-none placeholder-slate-500 transition-all resize-none"
          />
        </div>

        {/* Fecha */}
        <div>
          <label className="block text-base font-semibold text-slate-200 mb-3">
            Fecha *
          </label>
          <input
            type="date"
            name="date"
            required
            defaultValue={new Date().toISOString().split('T')[0]}
            className="block w-full rounded-xl bg-slate-800 border-2 border-slate-700 text-white text-lg px-5 py-4 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 focus:outline-none transition-all"
          />
        </div>

        {/* Botones */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 rounded-xl bg-slate-800 border-2 border-slate-700 px-6 py-4 text-base font-bold text-slate-300 hover:bg-slate-700 hover:text-white transition-all duration-200"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-xl bg-indigo-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-indigo-600/50 hover:bg-indigo-500 hover:shadow-xl hover:shadow-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-95"
          >
            {loading ? 'Guardando...' : 'Guardar Movimiento'}
          </button>
        </div>
      </form>
    </div>
  )
}
