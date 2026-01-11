'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Wallet,
  PieChart,
  ArrowRightLeft,
  Settings,
  LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Billeteras', href: '/dashboard/wallets', icon: Wallet },
  { name: 'Transacciones', href: '/dashboard/transactions', icon: ArrowRightLeft },
  { name: 'Reportes', href: '/dashboard/reports', icon: PieChart },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 transition-colors duration-300">
      <div className="flex h-16 items-center px-6 border-b border-slate-200 dark:border-slate-800">
        <Wallet className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
        <span className="ml-2 text-xl font-bold text-slate-900 dark:text-white">
          QP Wallet
        </span>
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
        <nav className="mt-5 flex-1 space-y-1 px-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white',
                  'group flex items-center rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200'
                )}
              >
                <item.icon
                  className={cn(
                    isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 group-hover:text-slate-500 dark:text-slate-500 dark:group-hover:text-slate-300',
                    'mr-3 h-5 w-5 flex-shrink-0 transition-colors'
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="border-t border-slate-200 p-4 dark:border-slate-800">
        <Link
          href="/settings"
          className="group flex w-full items-center rounded-xl px-3 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition-all duration-200"
        >
          <Settings className="mr-3 h-5 w-5 text-slate-400 group-hover:text-slate-500 dark:text-slate-500 dark:group-hover:text-slate-300" />
          Configuración
        </Link>
        <button
          // TODO: Implement logout action
          className="mt-1 group flex w-full items-center rounded-xl px-3 py-3 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-all duration-200"
        >
          <LogOut className="mr-3 h-5 w-5 text-slate-400 group-hover:text-red-600 dark:text-slate-500 dark:group-hover:text-red-400" />
          Cerrar Sesión
        </button>
      </div>
    </div>
  )
}
