import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const username = process.argv[2] || 'admin'
  const password = process.argv[3] || 'admin123'

  const passwordHash = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      username,
      passwordHash,
      fullName: 'Administrador',
      isActive: true,
      authProviders: {
        create: {
          provider: 'local',
        },
      },
    },
  })

  console.log('Usuario creado:', {
    id: user.id,
    username: user.username,
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
