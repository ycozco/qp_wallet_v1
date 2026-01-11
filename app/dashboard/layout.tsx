import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/dashboard/Sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  return (
    <div className="bg-slate-950 min-h-screen">
      <Sidebar />
      <div className="lg:pl-80">
        <main className="py-8">
          <div className="px-6 sm:px-8 lg:px-10">{children}</div>
        </main>
      </div>
    </div>
  )
}
