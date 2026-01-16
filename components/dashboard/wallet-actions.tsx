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
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-colors"
                    aria-label="Acciones de billetera"
                    onClick={(e) => e.stopPropagation()}
                >
                    <MoreHorizontal className="h-4 w-4 text-white" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                <DropdownMenuItem 
                    className="cursor-pointer" 
                    onSelect={(e) => {
                        e.preventDefault()
                        alert('Función de edición próximamente')
                    }}
                >
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 cursor-pointer"
                    onSelect={(e) => {
                        e.preventDefault()
                        handleDelete()
                    }}
                    disabled={isPending}
                >
                    <Trash className="mr-2 h-4 w-4" />
                    {isPending ? 'Eliminando...' : 'Eliminar'}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
