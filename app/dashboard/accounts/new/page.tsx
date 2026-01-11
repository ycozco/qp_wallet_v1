import AccountForm from '../AccountForm'
import Link from 'next/link'

export default function NewAccountPage() {
  return (
    <div>
      <div className="mb-8">
        <Link
          href="/dashboard/accounts"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          ← Volver a Cuentas
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">Nueva Cuenta</h1>
      </div>

      <div className="mx-auto max-w-2xl">
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
          <AccountForm />
        </div>
      </div>
    </div>
  )
}
