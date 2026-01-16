'use client'

import { Bell } from 'lucide-react'

export function Navbar() {
    return (
        <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-900/80 px-6 backdrop-blur-xl">
            <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold text-white">
                    Bienvenido
                </h2>
            </div>

            <div className="flex items-center gap-4">
                <button type="button" className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors">
                    <Bell className="h-5 w-5" />
                    <span className="sr-only">Notificaciones</span>
                </button>

                <div className="h-6 w-px bg-slate-800" />

                <div className="ml-2 h-8 w-8 overflow-hidden rounded-full bg-indigo-900 border border-indigo-800">
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
