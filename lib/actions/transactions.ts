'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { validateSufficientFunds } from './balances'

const TransactionSchema = z.object({
  accountId: z.string().min(1),
  categoryId: z.string().optional(),
  type: z.enum(['expense', 'income']),
  amount: z.number().positive(),
  date: z.string(),
  description: z.string().optional(),
})

export async function createTransaction(formData: FormData) {
  const session = await auth()
  if (!session?.user) throw new Error('No autorizado')

  const validatedFields = TransactionSchema.safeParse({
    accountId: formData.get('accountId'),
    categoryId: formData.get('categoryId') || undefined,
    type: formData.get('type'),
    amount: Number(formData.get('amount')),
    date: formData.get('date'),
    description: formData.get('description') || undefined,
  })

  if (!validatedFields.success) {
    return { error: 'Datos inválidos' }
  }

  // Validar fondos suficientes para gastos
  if (validatedFields.data.type === 'expense') {
    const fundsCheck = await validateSufficientFunds(
      validatedFields.data.accountId,
      validatedFields.data.amount
    )

    if (!fundsCheck.valid) {
      return { error: fundsCheck.message || 'Fondos insuficientes' }
    }
  }

  try {
    const { categoryId, date, ...rest } = validatedFields.data
    await prisma.transaction.create({
      data: {
        ...rest,
        categoryId: categoryId || null,
        date: new Date(date),
        userId: session.user.id,
      },
    })

    revalidatePath('/dashboard/transactions')
    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    return { error: 'Error al crear la transacción' }
  }
}

export async function getTransactions() {
  const session = await auth()
  if (!session?.user) throw new Error('No autorizado')

  return await prisma.transaction.findMany({
    where: { userId: session.user.id },
    include: {
      account: true,
      category: true,
    },
    orderBy: { date: 'desc' },
    take: 50,
  })
}

export async function deleteTransaction(id: string) {
  const session = await auth()
  if (!session?.user) throw new Error('No autorizado')

  try {
    await prisma.transaction.deleteMany({
      where: { id, userId: session.user.id },
    })

    revalidatePath('/dashboard/transactions')
    return { success: true }
  } catch (error) {
    return { error: 'Error al eliminar la transacción' }
  }
}
