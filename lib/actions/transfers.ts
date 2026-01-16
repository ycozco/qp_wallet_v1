'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { validateSufficientFunds } from './balances'

const TransferSchema = z.object({
  fromAccountId: z.string().min(1),
  toAccountId: z.string().min(1),
  amount: z.number().positive(),
  date: z.string(),
  description: z.string().optional(),
})

export async function createTransfer(formData: FormData) {
  const session = await auth()
  if (!session?.user) throw new Error('No autorizado')

  const validatedFields = TransferSchema.safeParse({
    fromAccountId: formData.get('fromAccountId'),
    toAccountId: formData.get('toAccountId'),
    amount: Number(formData.get('amount')),
    date: formData.get('date'),
    description: formData.get('description') || undefined,
  })

  if (!validatedFields.success) {
    return { error: 'Datos inválidos' }
  }

  if (validatedFields.data.fromAccountId === validatedFields.data.toAccountId) {
    return { error: 'Las cuentas deben ser diferentes' }
  }

  // Validar fondos suficientes en cuenta origen
  const fundsCheck = await validateSufficientFunds(
    validatedFields.data.fromAccountId,
    validatedFields.data.amount
  )

  if (!fundsCheck.valid) {
    return { error: fundsCheck.message || 'Fondos insuficientes en cuenta origen' }
  }

  try {
    const { date, ...rest } = validatedFields.data
    await prisma.transfer.create({
      data: {
        ...rest,
        date: new Date(date),
        userId: session.user.id,
      },
    })

    revalidatePath('/dashboard/transfers')
    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    return { error: 'Error al crear la transferencia' }
  }
}

export async function getTransfers() {
  const session = await auth()
  if (!session?.user) throw new Error('No autorizado')

  return await prisma.transfer.findMany({
    where: { userId: session.user.id },
    include: {
      fromAccount: true,
      toAccount: true,
    },
    orderBy: { date: 'desc' },
    take: 50,
  })
}

export async function deleteTransfer(id: string) {
  const session = await auth()
  if (!session?.user) throw new Error('No autorizado')

  try {
    await prisma.transfer.deleteMany({
      where: { id, userId: session.user.id },
    })

    revalidatePath('/dashboard/transfers')
    return { success: true }
  } catch (error) {
    return { error: 'Error al eliminar la transferencia' }
  }
}
