'use client'

import { Category } from '@prisma/client'
import { TrashIcon, TagIcon } from '@heroicons/react/24/outline'
import { deleteCategory } from '@/lib/actions/categories'
import { useState } from 'react'

export default function CategoriesList({ categories }: { categories: Category[] }) {
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta categoría?')) return

    setDeleting(id)
    await deleteCategory(id)
    setDeleting(null)
  }

  const kindLabels: Record<string, { label: string; color: string }> = {
    expense: { label: 'Gasto', color: 'red' },
    income: { label: 'Ingreso', color: 'green' },
    both: { label: 'Ambos', color: 'blue' }
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => {
        const kind = kindLabels[category.kind]
        return (
          <div 
            key={category.id}
            className="rounded-2xl bg-slate-900 border-2 border-slate-800 p-6 hover:border-slate-700 transition-all duration-200 shadow-lg"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3 flex-1">
                <div className={`p-3 rounded-xl bg-${kind.color}-500/10 border border-${kind.color}-500/30`}>
                  <TagIcon className={`h-6 w-6 text-${kind.color}-400`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">
                    {category.name}
                  </h3>
                  <span className={`inline-flex rounded-lg px-2 py-1 text-xs font-medium text-${kind.color}-400 bg-${kind.color}-500/10 border border-${kind.color}-500/30`}>
                    {kind.label}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleDelete(category.id)}
                disabled={deleting === category.id}
                className="text-slate-400 hover:text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition-all disabled:opacity-50 ml-2"
              >
                <TrashIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
