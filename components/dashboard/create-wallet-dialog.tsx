'use client'

import { useState, useEffect, useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { createWallet } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Loader2 } from 'lucide-react'

// Wrapper for Submit Button to show loading state
function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" disabled={pending}>
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando...
                </>
            ) : (
                'Crear Billetera'
            )}
        </Button>
    )
}

export function CreateWalletDialog({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false)
    const [state, formAction] = useActionState(createWallet, { message: null, errors: {} })

    useEffect(() => {
        if (state.success) {
            setOpen(false)
            // Reset state? useFormState doesn't verify reset easily, but closing dialog is enough
        }
    }, [state.success])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Nueva Billetera</DialogTitle>
                    <DialogDescription>
                        Crea una nueva cuenta para gestionar tus gastos e ingresos.
                    </DialogDescription>
                </DialogHeader>
                <form action={formAction} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nombre</Label>
                        <Input id="name" name="name" placeholder="Ej. BCP Principal" required />
                        {state.errors?.name && (
                            <p className="text-sm text-red-500">{state.errors.name.join(', ')}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="type">Tipo</Label>
                            <Select name="type" required defaultValue="bank">
                                <SelectTrigger>
                                    <SelectValue placeholder="Tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="bank">Banco</SelectItem>
                                    <SelectItem value="cash">Efectivo</SelectItem>
                                    <SelectItem value="card">Tarjeta</SelectItem>
                                    <SelectItem value="wallet">Virtual</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="currency">Moneda</Label>
                            <Select name="currency" required defaultValue="PEN">
                                <SelectTrigger>
                                    <SelectValue placeholder="Moneda" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PEN">Soles (S/)</SelectItem>
                                    <SelectItem value="USD">Dólares ($)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="openingBalance">Saldo Inicial</Label>
                        <Input
                            id="openingBalance"
                            name="openingBalance"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            required
                        />
                        {state.errors?.openingBalance && (
                            <p className="text-sm text-red-500">{state.errors.openingBalance.join(', ')}</p>
                        )}
                    </div>

                    {state.message && !state.success && (
                        <p className="text-sm text-red-500">{state.message}</p>
                    )}

                    <DialogFooter>
                        <SubmitButton />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
