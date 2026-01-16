'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

/**
 * Calcula el balance actual de una cuenta
 */
export async function calculateAccountBalance(accountId: string): Promise<number> {
  const session = await auth()
  if (!session?.user) throw new Error('No autorizado')

  // Obtener cuenta con balance inicial
  const account = await prisma.account.findUnique({
    where: { id: accountId, userId: session.user.id },
  })

  if (!account) return 0

  let balance = Number(account.openingBalance)

  // Sumar ingresos
  const incomes = await prisma.transaction.aggregate({
    where: {
      accountId,
      userId: session.user.id,
      type: 'income',
    },
    _sum: {
      amount: true,
    },
  })

  balance += Number(incomes._sum.amount || 0)

  // Restar gastos
  const expenses = await prisma.transaction.aggregate({
    where: {
      accountId,
      userId: session.user.id,
      type: 'expense',
    },
    _sum: {
      amount: true,
    },
  })

  balance -= Number(expenses._sum.amount || 0)

  // Sumar transferencias recibidas
  const transfersIn = await prisma.transfer.aggregate({
    where: {
      toAccountId: accountId,
      userId: session.user.id,
    },
    _sum: {
      amount: true,
    },
  })

  balance += Number(transfersIn._sum.amount || 0)

  // Restar transferencias enviadas
  const transfersOut = await prisma.transfer.aggregate({
    where: {
      fromAccountId: accountId,
      userId: session.user.id,
    },
    _sum: {
      amount: true,
    },
  })

  balance -= Number(transfersOut._sum.amount || 0)

  return balance
}

/**
 * Obtiene todos los balances de las cuentas del usuario
 */
export async function getAllAccountBalances() {
  const session = await auth()
  if (!session?.user) return []

  const accounts = await prisma.account.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })

  const balances = await Promise.all(
    accounts.map(async (account) => ({
      id: account.id,
      name: account.name,
      type: account.type,
      currency: account.currency,
      openingBalance: Number(account.openingBalance),
      currentBalance: await calculateAccountBalance(account.id),
    }))
  )

  return balances
}

/**
 * Obtiene el balance total del usuario en una moneda específica
 */
export async function getTotalBalance(currency: string = 'PEN') {
  const balances = await getAllAccountBalances()
  
  const total = balances
    .filter((acc) => acc.currency === currency)
    .reduce((sum, acc) => sum + acc.currentBalance, 0)

  return total
}

/**
 * Obtiene estadísticas de ingresos y gastos del usuario
 */
export async function getFinancialStats(startDate?: Date, endDate?: Date) {
  const session = await auth()
  if (!session?.user) return null

  const dateFilter = {
    ...(startDate && { gte: startDate }),
    ...(endDate && { lte: endDate }),
  }

  // Total de ingresos
  const totalIncome = await prisma.transaction.aggregate({
    where: {
      userId: session.user.id,
      type: 'income',
      ...(startDate || endDate ? { date: dateFilter } : {}),
    },
    _sum: {
      amount: true,
    },
  })

  // Total de gastos
  const totalExpenses = await prisma.transaction.aggregate({
    where: {
      userId: session.user.id,
      type: 'expense',
      ...(startDate || endDate ? { date: dateFilter } : {}),
    },
    _sum: {
      amount: true,
    },
  })

  return {
    totalIncome: Number(totalIncome._sum.amount || 0),
    totalExpenses: Number(totalExpenses._sum.amount || 0),
    netBalance: Number(totalIncome._sum.amount || 0) - Number(totalExpenses._sum.amount || 0),
  }
}

/**
 * Valida que una cuenta tiene fondos suficientes para un gasto/transferencia
 */
export async function validateSufficientFunds(
  accountId: string,
  amount: number
): Promise<{ valid: boolean; currentBalance: number; message?: string }> {
  const currentBalance = await calculateAccountBalance(accountId)

  if (currentBalance < amount) {
    return {
      valid: false,
      currentBalance,
      message: `Fondos insuficientes. Balance actual: ${currentBalance.toFixed(2)}`,
    }
  }

  return {
    valid: true,
    currentBalance,
  }
}
