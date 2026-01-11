'use client'

import React, { useTransition } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Pencil, Trash } from 'lucide-react'
import { deleteWallet } from '@/lib/actions'
import { useRouter } from 'next/navigation'

interface WalletActionsProps {
    walletId: string
}

export function WalletActions({ walletId }: WalletActionsProps) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const handleDelete = async () => {
        if (confirm('¿Estás seguro de que quieres eliminar esta billetera? Esta acción no se puede deshacer.')) {
            startTransition(async () => {
                const result = await deleteWallet(walletId)
                if (!result.success) {
                    alert(result.message)
                }
                // revalidatePath handles the UI update on server, but router.refresh() handles client cache
                router.refresh()
            })
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                    <MoreHorizontal className="h-6 w-6" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem className="cursor-pointer" onClick={() => alert('Edición próximamente')}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 cursor-pointer"
                    onClick={handleDelete}
                    disabled={isPending}
                >
                    <Trash className="mr-2 h-4 w-4" />
                    Eliminar
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
