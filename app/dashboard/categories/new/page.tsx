'use client'

import { createCategory } from '@/lib/actions/categories'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeftIcon, TagIcon } from '@heroicons/react/24/outline'

export default function NewCategoryPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const result = await createCategory(formData)

    if (!result.error) {
      router.push('/dashboard/categories')
      router.refresh()
    } else {
      alert(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link 
          href="/dashboard/categories" 
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span className="font-medium">Volver</span>
        </Link>
      </div>

      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Nueva Categoría</h1>
        <p className="text-lg text-slate-400">Crea una categoría para organizar tus movimientos</p>
      </div>

      <div className="max-w-2xl rounded-2xl bg-slate-900 border-2 border-slate-800 p-8 shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-7">
          <div>
            <label className="block text-base font-semibold text-slate-200 mb-3">
              Nombre de la categoría *
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="Ej: Alimentación, Transporte, Salario..."
              className="block w-full rounded-xl bg-slate-800 border-2 border-slate-700 text-white text-lg px-5 py-4 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 focus:outline-none placeholder-slate-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-base font-semibold text-slate-200 mb-3">
              Tipo de categoría *
            </label>
            <select
              name="kind"
              required
              className="block w-full rounded-xl bg-slate-800 border-2 border-slate-700 text-white text-lg px-5 py-4 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 focus:outline-none transition-all"
            >
              <option value="expense">Gasto</option>
              <option value="income">Ingreso</option>
              <option value="both">Ambos (Ingreso y Gasto)</option>
            </select>
            <p className="mt-2 text-sm text-slate-400">
              Selecciona si esta categoría es para gastos, ingresos o ambos
            </p>
          </div>

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
              {loading ? 'Guardando...' : 'Guardar Categoría'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
