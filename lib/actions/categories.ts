'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const CategorySchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  kind: z.enum(['expense', 'income', 'both']),
})

export async function createCategory(formData: FormData) {
  const session = await auth()
  if (!session?.user) throw new Error('No autorizado')

  const validatedFields = CategorySchema.safeParse({
    name: formData.get('name'),
    kind: formData.get('kind'),
  })

  if (!validatedFields.success) {
    return { error: 'Datos inválidos' }
  }

  try {
    await prisma.category.create({
      data: {
        ...validatedFields.data,
        userId: session.user.id,
      },
    })

    revalidatePath('/dashboard/categories')
    return { success: true }
  } catch (error) {
    return { error: 'Error al crear la categoría' }
  }
}

export async function getCategories() {
  const session = await auth()
  if (!session?.user) throw new Error('No autorizado')

  return await prisma.category.findMany({
    where: { userId: session.user.id },
    orderBy: { name: 'asc' },
  })
}

export async function deleteCategory(id: string) {
  const session = await auth()
  if (!session?.user) throw new Error('No autorizado')

  try {
    await prisma.category.deleteMany({
      where: { id, userId: session.user.id },
    })

    revalidatePath('/dashboard/categories')
    return { success: true }
  } catch (error) {
    return { error: 'Error al eliminar la categoría' }
  }
}
