import LoginForm from './LoginForm'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-lg">
        <div className="bg-slate-900 rounded-2xl shadow-2xl px-10 py-12 border border-slate-800">
          <div className="text-center mb-10">
            <div className="mb-4">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-white text-2xl font-bold shadow-lg shadow-indigo-600/50">
                W
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-3">
              Wallet
            </h1>
            <p className="text-slate-400 text-base">
              Gestiona tus finanzas de forma simple
            </p>
          </div>
          <LoginForm />
          <div className="mt-8 pt-8 border-t border-slate-800">
            <p className="text-center text-sm font-medium text-slate-400 mb-3">
              Usuarios de prueba
            </p>
            <div className="flex gap-4 justify-center">
              <div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
                <p className="text-xs text-slate-500 mb-1">Admin</p>
                <p className="text-sm font-mono text-slate-300">admin / admin123</p>
              </div>
              <div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
                <p className="text-xs text-slate-500 mb-1">Demo</p>
                <p className="text-sm font-mono text-slate-300">demo / demo123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
