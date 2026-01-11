import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { UserIcon, CalendarIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default async function ProfilePage() {
  const session = await auth()
  
  const user = await prisma.user.findUnique({
    where: { id: session!.user.id },
    include: {
      authProviders: true,
      _count: {
        select: {
          accounts: true,
          categories: true,
          transactions: true,
          transfers: true
        }
      }
    }
  })

  if (!user) {
    return <div>Usuario no encontrado</div>
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Mi Perfil</h1>
        <p className="text-lg text-slate-400">Información de tu cuenta</p>
      </div>

      {/* Card de información del usuario */}
      <div className="rounded-2xl bg-slate-900 border-2 border-slate-800 p-8 shadow-lg">
        <div className="flex items-start gap-6">
          <div className="p-4 rounded-2xl bg-indigo-500/10 border-2 border-indigo-500/30">
            <UserIcon className="h-16 w-16 text-indigo-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-2">
              {user.fullName || user.username}
            </h2>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-400">
                <span className="text-sm font-medium">Usuario:</span>
                <span className="text-white font-mono">{user.username}</span>
              </div>
              {user.email && (
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="text-sm font-medium">Email:</span>
                  <span className="text-white">{user.email}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-slate-400">
                <CalendarIcon className="h-4 w-4" />
                <span className="text-sm">
                  Miembro desde {format(new Date(user.createdAt), "MMMM 'de' yyyy", { locale: es })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheckIcon className={`h-5 w-5 ${user.isActive ? 'text-green-400' : 'text-red-400'}`} />
                <span className={`text-sm font-medium ${user.isActive ? 'text-green-400' : 'text-red-400'}`}>
                  Cuenta {user.isActive ? 'activa' : 'inactiva'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Estadísticas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl bg-slate-900 border-2 border-slate-800 p-6 shadow-lg">
            <p className="text-sm text-slate-400 mb-2">Cuentas</p>
            <p className="text-3xl font-bold text-white">{user._count.accounts}</p>
          </div>
          <div className="rounded-2xl bg-slate-900 border-2 border-slate-800 p-6 shadow-lg">
            <p className="text-sm text-slate-400 mb-2">Categorías</p>
            <p className="text-3xl font-bold text-white">{user._count.categories}</p>
          </div>
          <div className="rounded-2xl bg-slate-900 border-2 border-slate-800 p-6 shadow-lg">
            <p className="text-sm text-slate-400 mb-2">Movimientos</p>
            <p className="text-3xl font-bold text-white">{user._count.transactions}</p>
          </div>
          <div className="rounded-2xl bg-slate-900 border-2 border-slate-800 p-6 shadow-lg">
            <p className="text-sm text-slate-400 mb-2">Transferencias</p>
            <p className="text-3xl font-bold text-white">{user._count.transfers}</p>
          </div>
        </div>
      </div>

      {/* Métodos de autenticación */}
      <div className="rounded-2xl bg-slate-900 border-2 border-slate-800 p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-6">Métodos de Autenticación</h2>
        <div className="space-y-3">
          {user.authProviders.map((provider) => (
            <div 
              key={provider.id}
              className="flex items-center gap-4 p-4 rounded-xl bg-slate-800 border border-slate-700"
            >
              <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/30">
                <ShieldCheckIcon className="h-5 w-5 text-indigo-400" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-white capitalize">{provider.provider}</p>
                <p className="text-sm text-slate-400">
                  Conectado el {format(new Date(provider.createdAt), "d 'de' MMMM, yyyy", { locale: es })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
