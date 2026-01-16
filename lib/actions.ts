'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// Schema for Wallet Creation
const CreateWalletSchema = z.object({
    name: z.string().min(1, 'El nombre es obligatorio'),
    type: z.enum(['cash', 'bank', 'card', 'wallet']),
    currency: z.enum(['PEN', 'USD']),
    openingBalance: z.coerce.number().min(0, 'El saldo inicial no puede ser negativo'),
})

export type CreateWalletState = {
    errors?: {
        name?: string[]
        type?: string[]
        currency?: string[]
        openingBalance?: string[]
    }
    message?: string | null
    success?: boolean
}

export async function createWallet(prevState: CreateWalletState, formData: FormData) {
    // Check Authentication
    const session = await auth()
    if (!session?.user?.id) {
        return {
            message: 'No autenticado. Por favor inicie sesión.',
        }
    }

    // Validate Fields
    const validatedFields = CreateWalletSchema.safeParse({
        name: formData.get('name'),
        type: formData.get('type'),
        currency: formData.get('currency'),
        openingBalance: formData.get('openingBalance'),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Faltan campos obligatorios. Revisa el formulario.',
        }
    }

    const { name, type, currency, openingBalance } = validatedFields.data

    try {
        await prisma.account.create({
            data: {
                userId: session.user.id,
                name,
                type,
                currency,
                openingBalance,
            },
        })
    } catch (error) {
        console.error('Database Error:', error)
        return {
            message: 'Error de base de datos: Falló la creación de la billetera.',
        }
    }

    revalidatePath('/dashboard/wallets')
    return { message: 'Billetera creada exitosamente!', success: true }
}

export async function getWallets() {
    const session = await auth()
    if (!session?.user?.id) return []

    try {
        const wallets = await prisma.account.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' }
        })
        return wallets
    } catch (error) {
        console.error('Failed to fetch wallets:', error)
        return []
    }
}

export async function getWalletDetails(walletId: string, startDate?: Date, endDate?: Date) {
    const session = await auth()
    if (!session?.user?.id) return null

    try {
        const wallet = await prisma.account.findUnique({
            where: { id: walletId, userId: session.user.id },
            include: {
                transactions: {
                    where: {
                        date: {
                            gte: startDate,
                            lte: endDate
                        }
                    },
                    include: {
                        category: true
                    },
                    orderBy: { date: 'desc' }
                }
            }
        })

        if (!wallet) return null

        // Calculate totals and category breakdown
        let totalIncome = 0
        let totalExpense = 0
        const categoryTotals = new Map<string, { name: string, total: number, icon: string | null }>()

        wallet.transactions.forEach(tx => {
            const amount = Number(tx.amount)
            if (tx.type === 'income') {
                totalIncome += amount
            } else {
                totalExpense += amount
                // Group expenses by category
                if (tx.category) {
                    const existing = categoryTotals.get(tx.category.id)
                    if (existing) {
                        existing.total += amount
                    } else {
                        categoryTotals.set(tx.category.id, {
                            name: tx.category.name,
                            total: amount,
                            icon: tx.category.icon
                        })
                    }
                } else {
                    // Sin categoría
                    const existing = categoryTotals.get('uncategorized')
                    if (existing) {
                        existing.total += amount
                    } else {
                        categoryTotals.set('uncategorized', {
                            name: 'Sin categoría',
                            total: amount,
                            icon: '📦'
                        })
                    }
                }
            }
        })

        // Prepare chart data (daily)
        const dailyData = wallet.transactions.reduce((acc, tx) => {
            const dateStr = tx.date.toLocaleDateString('es-ES', { weekday: 'short' })
            return acc
        }, {} as Record<string, number>)

        // Serializing Decimal to number for Client Components
        const transactions = wallet.transactions.map(tx => ({
            ...tx,
            amount: Number(tx.amount),
        }))

        // Convert category map to array for pie chart
        const expensesByCategory = Array.from(categoryTotals.values())

        return {
            ...wallet,
            openingBalance: Number(wallet.openingBalance),
            transactions,
            summary: {
                income: totalIncome,
                expense: totalExpense
            },
            expensesByCategory
        }
    } catch (error) {
        console.error('Failed to fetch wallet details:', error)
        return null
    }
}

export async function deleteWallet(walletId: string) {
    const session = await auth()
    if (!session?.user?.id) return { success: false, message: 'No authenticated' }

    try {
        await prisma.account.delete({
            where: {
                id: walletId,
                userId: session.user.id
            }
        })
        revalidatePath('/dashboard/wallets')
        return { success: true, message: 'Billetera eliminada' }
    } catch (error) {
        console.error('Failed to delete wallet:', error)
        return { success: false, message: 'Error al eliminar billetera' }
    }
}
