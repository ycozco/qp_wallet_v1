import TransferForm from './TransferForm'
import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

export default function NewTransferPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link 
          href="/dashboard/transfers" 
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span className="font-medium">Volver</span>
        </Link>
      </div>

      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Nueva Transferencia</h1>
        <p className="text-lg text-slate-400">Transfiere dinero entre tus cuentas</p>
      </div>

      <TransferForm />
    </div>
  )
}
