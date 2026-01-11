import { getTransfers } from '@/lib/actions/transfers'
import Link from 'next/link'
import { PlusIcon, ArrowsRightLeftIcon } from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default async function TransfersPage() {
  const transfers = await getTransfers()

  return (
    <div className="space-y-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Transferencias</h1>
          <p className="text-lg text-slate-400">
            Movimientos entre tus cuentas
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/dashboard/transfers/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-indigo-600/50 hover:bg-indigo-500 hover:shadow-xl hover:shadow-indigo-500/50 transition-all duration-200 active:scale-95"
          >
            <PlusIcon className="h-6 w-6" />
            Nueva Transferencia
          </Link>
        </div>
      </div>

      {transfers.length === 0 ? (
        <div className="text-center rounded-2xl bg-slate-900 border-2 border-slate-800 py-16 px-8">
          <div className="mx-auto w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
            <ArrowsRightLeftIcon className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No hay transferencias</h3>
          <p className="text-base text-slate-400 mb-6">Transfiere dinero entre tus cuentas</p>
          <Link
            href="/dashboard/transfers/new"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-indigo-600/50 hover:bg-indigo-500 transition-all duration-200 active:scale-95"
          >
            <PlusIcon className="h-6 w-6" />
            Nueva Transferencia
          </Link>
        </div>
      ) : (
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
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-400">
                    S/ {Number(transfer.amount).toFixed(2)}
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
