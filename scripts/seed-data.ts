import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedUserData(userId: string) {
  console.log('🌱 Poblando datos para usuario:', userId)

  try {
    // 1. Crear categorías si no existen
    console.log('📂 Creando categorías...')
    const categories = await Promise.all([
      prisma.category.upsert({
        where: { id: `cat-food-${userId}` },
        update: {},
        create: {
          id: `cat-food-${userId}`,
          userId,
          name: 'Comida',
          kind: 'expense',
          icon: '🍔'
        }
      }),
      prisma.category.upsert({
        where: { id: `cat-transport-${userId}` },
        update: {},
        create: {
          id: `cat-transport-${userId}`,
          userId,
          name: 'Transporte',
          kind: 'expense',
          icon: '🚗'
        }
      }),
      prisma.category.upsert({
        where: { id: `cat-shopping-${userId}` },
        update: {},
        create: {
          id: `cat-shopping-${userId}`,
          userId,
          name: 'Compras',
          kind: 'expense',
          icon: '🛒'
        }
      }),
      prisma.category.upsert({
        where: { id: `cat-entertainment-${userId}` },
        update: {},
        create: {
          id: `cat-entertainment-${userId}`,
          userId,
          name: 'Entretenimiento',
          kind: 'expense',
          icon: '🎬'
        }
      }),
      prisma.category.upsert({
        where: { id: `cat-salary-${userId}` },
        update: {},
        create: {
          id: `cat-salary-${userId}`,
          userId,
          name: 'Salario',
          kind: 'income',
          icon: '💼'
        }
      }),
      prisma.category.upsert({
        where: { id: `cat-services-${userId}` },
        update: {},
        create: {
          id: `cat-services-${userId}`,
          userId,
          name: 'Servicios',
          kind: 'expense',
          icon: '💡'
        }
      })
    ])
    console.log(`✅ ${categories.length} categorías creadas`)

    // 2. Obtener las wallets existentes del usuario
    const wallets = await prisma.account.findMany({
      where: { userId }
    })

    if (wallets.length === 0) {
      console.log('⚠️  No hay billeteras para este usuario. Creando billeteras de ejemplo...')
      
      const newWallets = await Promise.all([
        prisma.account.create({
          data: {
            userId,
            name: 'Principal BCP',
            type: 'bank',
            currency: 'PEN',
            openingBalance: 12450.00
          }
        }),
        prisma.account.create({
          data: {
            userId,
            name: 'Ahorros Interbank',
            type: 'bank',
            currency: 'USD',
            openingBalance: 5000.00
          }
        }),
        prisma.account.create({
          data: {
            userId,
            name: 'Efectivo',
            type: 'cash',
            currency: 'PEN',
            openingBalance: 450.00
          }
        })
      ])
      
      wallets.push(...newWallets)
      console.log(`✅ ${newWallets.length} billeteras creadas`)
    } else {
      console.log(`📊 Usando ${wallets.length} billeteras existentes`)
    }

    // 3. Crear transacciones de prueba para cada wallet
    console.log('💳 Creando transacciones...')
    let totalTransactions = 0

    for (const wallet of wallets) {
      const today = new Date()
      const transactions = []

      // Últimos 30 días de transacciones
      for (let i = 0; i < 30; i++) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)

        // 1-3 transacciones por día
        const numTransactions = Math.floor(Math.random() * 3) + 1

        for (let j = 0; j < numTransactions; j++) {
          const isExpense = Math.random() > 0.3 // 70% gastos, 30% ingresos
          const expenseCategories = categories.filter(c => c.kind === 'expense' || c.kind === 'both')
          const incomeCategories = categories.filter(c => c.kind === 'income' || c.kind === 'both')
          
          const categoryList = isExpense ? expenseCategories : incomeCategories
          const category = categoryList[Math.floor(Math.random() * categoryList.length)]

          const amount = isExpense 
            ? (Math.random() * 500 + 20).toFixed(2) // Gastos: 20-520
            : (Math.random() * 2000 + 500).toFixed(2) // Ingresos: 500-2500

          const descriptions = {
            '🍔': ['Supermercado Metro', 'Restaurant', 'Delivery de comida', 'Almuerzo'],
            '🚗': ['Gasolina', 'Uber', 'Taxi', 'Estacionamiento'],
            '🛒': ['Tienda por departamentos', 'Ropa', 'Accesorios', 'Electrónicos'],
            '🎬': ['Netflix', 'Cine', 'Concierto', 'Videojuegos'],
            '💼': ['Salario mensual', 'Bono', 'Pago freelance'],
            '💡': ['Luz', 'Agua', 'Internet', 'Teléfono']
          }

          const descList = descriptions[category.icon as keyof typeof descriptions] || ['Transacción']
          const description = descList[Math.floor(Math.random() * descList.length)]

          transactions.push({
            userId,
            accountId: wallet.id,
            categoryId: category.id,
            type: isExpense ? 'expense' : 'income',
            amount: parseFloat(amount),
            date,
            description
          })
        }
      }

      // Insertar transacciones en batch
      await prisma.transaction.createMany({
        data: transactions
      })
      
      totalTransactions += transactions.length
      console.log(`  ✅ ${transactions.length} transacciones para ${wallet.name}`)
    }

    console.log(`✅ Total: ${totalTransactions} transacciones creadas`)

    console.log('\n🎉 ¡Datos poblados exitosamente!')
    console.log('\n📊 Resumen:')
    console.log(`   Categorías: ${categories.length}`)
    console.log(`   Billeteras: ${wallets.length}`)
    console.log(`   Transacciones: ${totalTransactions}`)

  } catch (error) {
    console.error('❌ Error poblando datos:', error)
    throw error
  }
}

async function main() {
  const args = process.argv.slice(2)
  const userId = args[0]

  if (!userId) {
    console.error('❌ Error: Debes proporcionar un userId')
    console.log('\nUso:')
    console.log('  npm run seed-data <userId>')
    console.log('\nPara obtener tu userId, ejecuta:')
    console.log('  npm run get-user')
    process.exit(1)
  }

  // Verificar que el usuario existe
  const user = await prisma.user.findUnique({
    where: { id: userId }
  })

  if (!user) {
    console.error(`❌ Error: Usuario con ID '${userId}' no encontrado`)
    process.exit(1)
  }

  console.log(`👤 Usuario encontrado: ${user.username} (${user.email || 'sin email'})`)
  
  await seedUserData(userId)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
