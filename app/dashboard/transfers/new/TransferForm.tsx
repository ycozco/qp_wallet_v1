'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createTransfer } from '@/lib/actions/transfers'
import { getAccounts } from '@/lib/actions/accounts'
import { Account } from '@prisma/client'
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline'

export default function TransferForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [accounts, setAccounts] = useState<Account[]>([])

  useEffect(() => {
    async function loadAccounts() {
      const data = await getAccounts()
      setAccounts(data)
    }
    loadAccounts()
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const fromAccountId = formData.get('fromAccountId') as string
    const toAccountId = formData.get('toAccountId') as string

    if (fromAccountId === toAccountId) {
      alert('No puedes transferir a la misma cuenta')
      setLoading(false)
      return
    }

    const result = await createTransfer(formData)

    if (!result.error) {
      router.push('/dashboard/transfers')
      router.refresh()
    } else {
      alert(result.error)
      setLoading(false)
    }
  }

  if (accounts.length < 2) {
    return (
      <div className="max-w-2xl rounded-2xl bg-slate-900 border-2 border-slate-800 p-8 shadow-lg text-center">
        <h3 className="text-xl font-bold text-white mb-2">Necesitas al menos 2 cuentas</h3>
        <p className="text-slate-400 mb-4">
          Para hacer transferencias necesitas tener al menos dos cuentas creadas
        </p>
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
        {/* Monto */}
        <div>
          <label className="block text-base font-semibold text-slate-200 mb-3">
            Monto a transferir *
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

        {/* Cuenta origen */}
        <div>
          <label className="block text-base font-semibold text-slate-200 mb-3">
            Desde (cuenta origen) *
          </label>
          <select
            name="fromAccountId"
            required
            className="block w-full rounded-xl bg-slate-800 border-2 border-slate-700 text-white text-lg px-5 py-4 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 focus:outline-none transition-all"
          >
            <option value="">Selecciona cuenta origen</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name} ({account.currency} {Number(account.openingBalance).toFixed(2)})
              </option>
            ))}
          </select>
        </div>

        {/* Icono de intercambio */}
        <div className="flex justify-center">
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30">
            <ArrowsRightLeftIcon className="h-8 w-8 text-indigo-400" />
          </div>
        </div>

        {/* Cuenta destino */}
        <div>
          <label className="block text-base font-semibold text-slate-200 mb-3">
            Hacia (cuenta destino) *
          </label>
          <select
            name="toAccountId"
            required
            className="block w-full rounded-xl bg-slate-800 border-2 border-slate-700 text-white text-lg px-5 py-4 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 focus:outline-none transition-all"
          >
            <option value="">Selecciona cuenta destino</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name} ({account.currency} {Number(account.openingBalance).toFixed(2)})
              </option>
            ))}
          </select>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-base font-semibold text-slate-200 mb-3">
            Descripción (opcional)
          </label>
          <textarea
            name="description"
            rows={3}
            placeholder="Ej: Ahorro mensual, pago de deuda..."
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
            {loading ? 'Transfiriendo...' : 'Realizar Transferencia'}
          </button>
        </div>
      </form>
    </div>
  )
}
