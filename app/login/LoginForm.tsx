'use client'

import { useState } from 'react'
import { login } from '@/lib/actions/auth'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    try {
      const result = await login(formData)
      
      if (result?.error) {
        setError(result.error)
        setLoading(false)
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } catch (error) {
      if (error && typeof error === 'object' && 'digest' in error) {
        router.push('/dashboard')
        router.refresh()
      } else {
        setError('Ocurrió un error. Intenta nuevamente.')
        setLoading(false)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      {error && (
        <div className="bg-red-500/10 border-2 border-red-500/50 text-red-400 rounded-xl p-4 text-base font-medium">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="username" className="block text-base font-semibold text-slate-200 mb-3">
          Usuario
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          autoComplete="username"
          className="block w-full rounded-xl bg-slate-800 border-2 border-slate-700 text-white text-lg px-5 py-4 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 focus:outline-none placeholder-slate-500 transition-all"
          placeholder="Tu usuario"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-base font-semibold text-slate-200 mb-3">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          minLength={6}
          className="block w-full rounded-xl bg-slate-800 border-2 border-slate-700 text-white text-lg px-5 py-4 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 focus:outline-none placeholder-slate-500 transition-all"
          placeholder="Tu contraseña"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center items-center rounded-xl bg-indigo-600 px-6 py-5 text-lg font-bold text-white shadow-lg shadow-indigo-600/50 hover:bg-indigo-500 hover:shadow-xl hover:shadow-indigo-500/50 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-95"
      >
        {loading ? (
          <span className="flex items-center gap-3">
            <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Iniciando sesión...</span>
          </span>
        ) : (
          'Iniciar Sesión'
        )}
      </button>
    </form>
  )
}
