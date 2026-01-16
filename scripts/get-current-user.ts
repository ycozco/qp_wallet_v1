import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      fullName: true,
      createdAt: true,
      _count: {
        select: {
          accounts: true,
          transactions: true,
          categories: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  if (users.length === 0) {
    console.log('❌ No hay usuarios en la base de datos')
    console.log('\nCrea un usuario primero con:')
    console.log('  npm run create-user')
    return
  }

  console.log('\n📋 Usuarios en la base de datos:\n')
  
  users.forEach((user, index) => {
    console.log(`${index + 1}. ${user.username}`)
    console.log(`   ID: ${user.id}`)
    console.log(`   Email: ${user.email || 'N/A'}`)
    console.log(`   Nombre: ${user.fullName || 'N/A'}`)
    console.log(`   Billeteras: ${user._count.accounts}`)
    console.log(`   Transacciones: ${user._count.transactions}`)
    console.log(`   Categorías: ${user._count.categories}`)
    console.log(`   Creado: ${user.createdAt.toLocaleDateString('es-ES')}`)
    console.log('')
  })

  console.log('\n💡 Para poblar datos de prueba, ejecuta:')
  console.log(`   npm run seed-data ${users[0].id}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
