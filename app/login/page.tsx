'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Invalid email or password.')
      setLoading(false)
      return
    }

    router.push('/home')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">👫</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Planning App</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-rose-500 text-white font-semibold rounded-xl py-3 text-base disabled:opacity-60 active:bg-rose-600"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
