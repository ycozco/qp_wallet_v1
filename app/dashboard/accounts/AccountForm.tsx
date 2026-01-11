'use client'

import { createAccount } from '@/lib/actions/accounts'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AccountForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const result = await createAccount(formData)

    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      router.push('/dashboard/accounts')
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      {error && (
        <div className="bg-red-50 text-red-800 rounded-md p-3 text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nombre de la Cuenta *
        </label>
        <input
          type="text"
          name="name"
          id="name"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
          Tipo de Cuenta *
        </label>
        <select
          name="type"
          id="type"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
        >
          <option value="cash">Efectivo</option>
          <option value="bank">Banco</option>
          <option value="card">Tarjeta</option>
          <option value="wallet">Billetera Digital</option>
        </select>
      </div>

      <div>
        <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
          Moneda
        </label>
        <select
          name="currency"
          id="currency"
          defaultValue="PEN"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
        >
          <option value="PEN">PEN - Soles</option>
          <option value="USD">USD - Dólares</option>
          <option value="EUR">EUR - Euros</option>
        </select>
      </div>

      <div>
        <label htmlFor="openingBalance" className="block text-sm font-medium text-gray-700">
          Balance Inicial
        </label>
        <input
          type="number"
          name="openingBalance"
          id="openingBalance"
          step="0.01"
          defaultValue="0.00"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Guardando...' : 'Guardar Cuenta'}
        </button>
      </div>
    </form>
  )
}
