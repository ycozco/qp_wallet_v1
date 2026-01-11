'use client'

import { ThemeToggle } from '@/components/theme-toggle'
import { Bell } from 'lucide-react'

export function Navbar() {
    return (
        <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80 transition-colors duration-300">
            <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                    Bienvenido
                </h2>
            </div>

            <div className="flex items-center gap-4">
                <button className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors">
                    <Bell className="h-5 w-5" />
                    <span className="sr-only">Notificaciones</span>
                </button>

                <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />

                <ThemeToggle />

                <div className="ml-2 h-8 w-8 overflow-hidden rounded-full bg-indigo-100 dark:bg-indigo-900 border border-indigo-200 dark:border-indigo-800">
                    <img
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                        alt="User"
                        className="h-full w-full object-cover"
                    />
                </div>
            </div>
        </header>
    )
}
