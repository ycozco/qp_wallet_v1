import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import {
  Banknote,
  TrendingUp,
  TrendingDown,
  CreditCard
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { OverviewChart } from '@/components/dashboard/overview-chart'
import { RecentTransactions } from '@/components/dashboard/recent-transactions'
import { Suspense } from 'react'

async function getDashboardData(userId: string) {
  const now = new Date()
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  // Optimization: Parallel fetch if possible, but Prisma query is sequential in logic here.
  // Actually count queries can be parallelized with findMany.
  const [transactions, accountsCount] = await Promise.all([
    prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: firstDay,
          lte: lastDay,
        },
      },
    }),
    prisma.account.count({
      where: { userId },
    })
  ])

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const balance = totalIncome - totalExpense

  return {
    totalIncome,
    totalExpense,
    balance,
    accountsCount,
    transactionsCount: transactions.length,
  }
}

export default async function DashboardPage() {
  const session = await auth()
  const data = await getDashboardData(session!.user.id)

  const stats = [
    {
      name: 'Balance del Mes',
      value: `S/ ${data.balance.toFixed(2)}`,
      icon: Banknote,
      color: 'indigo'
    },
    {
      name: 'Ingresos',
      value: `S/ ${data.totalIncome.toFixed(2)}`,
      icon: TrendingUp,
      color: 'emerald'
    },
    {
      name: 'Gastos',
      value: `S/ ${data.totalExpense.toFixed(2)}`,
      icon: TrendingDown,
      color: 'rose'
    },
    {
      name: 'Cuentas',
      value: data.accountsCount.toString(),
      icon: CreditCard,
      color: 'blue'
    },
  ]

  return (
    <div className="space-y-8 pb-8">
      <div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg">
          Bienvenido de vuelta, {session?.user?.name}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <GlassCard
            key={stat.name}
            className="group p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`rounded-xl p-2 bg-${stat.color}-100 dark:bg-${stat.color}-900/20 text-${stat.color}-600 dark:text-${stat.color}-400 transition-colors group-hover:scale-110 duration-200`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <span className="text-xs font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">
                +2.5%
              </span>
            </div>
            <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{stat.name}</dt>
            <dd className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {stat.value}
            </dd>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <OverviewChart />
        <RecentTransactions />
      </div>
    </div>
  )
}
