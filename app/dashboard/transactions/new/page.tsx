import TransactionForm from './TransactionForm'
import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

export default function NewTransactionPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link 
          href="/dashboard/transactions" 
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span className="font-medium">Volver</span>
        </Link>
      </div>

      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Nuevo Movimiento</h1>
        <p className="text-lg text-slate-400">Registra un ingreso o gasto en tus cuentas</p>
      </div>

      <TransactionForm />
    </div>
  )
}
