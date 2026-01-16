'use client'

import { useState } from 'react'
import { ArrowsRightLeftIcon, TrashIcon } from '@heroicons/react/24/outline'
import { deleteTransfer } from '@/lib/actions/transfers'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

type Transfer = {
  id: string
  amount: any
  date: Date
  description: string | null
  fromAccount: {
    name: string
  }
  toAccount: {
    name: string
  }
}

export default function TransfersList({ transfers }: { transfers: Transfer[] }) {
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta transferencia?')) return

    setDeleting(id)
    const result = await deleteTransfer(id)
    
    if (result.error) {
      alert(result.error)
    }
    setDeleting(null)
  }

  return (
    <div className="space-y-3">
      {transfers.map((transfer) => (
        <div 
          key={transfer.id}
          className="rounded-2xl bg-slate-900 border-2 border-slate-800 p-6 hover:border-slate-700 transition-all duration-200 shadow-lg"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30">
                <ArrowsRightLeftIcon className="h-6 w-6 text-indigo-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-lg font-bold text-white">
                    {transfer.fromAccount.name}
                  </span>
                  <span className="text-slate-500">→</span>
                  <span className="text-lg font-bold text-white">
                    {transfer.toAccount.name}
                  </span>
                </div>
                <p className="text-sm text-slate-400 mb-2">
                  {transfer.description || 'Sin descripción'}
                </p>
                <p className="text-xs text-slate-500">
                  {format(new Date(transfer.date), "d 'de' MMMM, yyyy", { locale: es })}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-400">
                  S/ {Number(transfer.amount).toFixed(2)}
                </p>
              </div>
              <button
                onClick={() => handleDelete(transfer.id)}
                disabled={deleting === transfer.id}
                className="text-slate-400 hover:text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition-all disabled:opacity-50"
                title="Eliminar transferencia"
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
