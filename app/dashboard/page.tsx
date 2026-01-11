import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { 
  BanknotesIcon, 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  CreditCardIcon 
} from '@heroicons/react/24/outline'

async function getDashboardData(userId: string) {
  const now = new Date()
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: {
        gte: firstDay,
        lte: lastDay,
      },
    },
  })

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const balance = totalIncome - totalExpense

  const accountsCount = await prisma.account.count({
    where: { userId },
  })

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
      icon: BanknotesIcon,
      color: 'indigo'
    },
    { 
      name: 'Ingresos', 
      value: `S/ ${data.totalIncome.toFixed(2)}`,
      icon: ArrowTrendingUpIcon,
      color: 'green'
    },
    { 
      name: 'Gastos', 
      value: `S/ ${data.totalExpense.toFixed(2)}`,
      icon: ArrowTrendingDownIcon,
      color: 'red'
    },
    { 
      name: 'Cuentas', 
      value: data.accountsCount.toString(),
      icon: CreditCardIcon,
      color: 'blue'
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-slate-400 text-lg">Resumen de tus finanzas</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="overflow-hidden rounded-2xl bg-slate-900 border-2 border-slate-800 p-8 hover:border-slate-700 transition-all duration-200 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={`h-10 w-10 text-${stat.color}-400`} />
            </div>
            <dt className="text-base font-medium text-slate-400 mb-2">{stat.name}</dt>
            <dd className="text-3xl font-bold text-white">
              {stat.value}
            </dd>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-slate-900 border-2 border-slate-800 p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-4">
          Actividad del Mes
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="text-lg text-slate-300">
              {data.transactionsCount > 0 
                ? `Has realizado ${data.transactionsCount} movimientos este mes` 
                : 'No hay movimientos este mes'}
            </p>
          </div>
          {data.transactionsCount > 0 && (
            <div className="text-right">
              <p className="text-sm text-slate-400">Promedio diario</p>
              <p className="text-2xl font-bold text-white">
                {Math.round(data.transactionsCount / new Date().getDate())}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
