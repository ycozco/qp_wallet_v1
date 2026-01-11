'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  HomeIcon,
  CreditCardIcon,
  TagIcon,
  ArrowsRightLeftIcon,
  ChartBarIcon,
  UserIcon,
  ArrowRightStartOnRectangleIcon
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Cuentas', href: '/dashboard/accounts', icon: CreditCardIcon },
  { name: 'Categorías', href: '/dashboard/categories', icon: TagIcon },
  { name: 'Movimientos', href: '/dashboard/transactions', icon: ChartBarIcon },
  { name: 'Transferencias', href: '/dashboard/transfers', icon: ArrowsRightLeftIcon },
  { name: 'Perfil', href: '/dashboard/profile', icon: UserIcon },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-80 lg:flex-col">
      <div className="flex grow flex-col gap-y-6 overflow-y-auto bg-slate-950 px-8 pb-6 border-r border-slate-800">
        <div className="flex h-20 shrink-0 items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white text-xl font-bold shadow-lg shadow-indigo-600/50">
            W
          </div>
          <h1 className="text-white text-2xl font-bold">Wallet</h1>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-8">
            <li>
              <ul role="list" className="space-y-2">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`
                          group flex gap-x-4 rounded-xl p-4 text-base font-semibold transition-all duration-200
                          ${isActive 
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/50' 
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                          }
                        `}
                      >
                        <item.icon className="h-7 w-7 shrink-0" aria-hidden="true" />
                        {item.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </li>
            <li className="mt-auto">
              <form action="/api/auth/signout" method="POST">
                <button
                  type="submit"
                  className="group flex gap-x-4 rounded-xl p-4 text-base font-semibold text-slate-400 hover:bg-red-500/10 hover:text-red-400 w-full transition-all duration-200 border-2 border-slate-800 hover:border-red-500/50"
                >
                  <ArrowRightStartOnRectangleIcon className="h-7 w-7 shrink-0" aria-hidden="true" />
                  Cerrar Sesión
                </button>
              </form>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}
