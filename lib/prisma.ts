import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Prisma 7 configuración: URL en variable de entorno
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
