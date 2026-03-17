'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTrips } from '@/hooks/useTrips'

export default function NewTripPage() {
  const router = useRouter()
  const { addTrip } = useTrips()
  const [form, setForm] = useState({ name: '', destination: '', trip_date: '', notes: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.trip_date) return
    setLoading(true)
    const err = await addTrip({
      name: form.name,
      destination: form.destination || undefined,
      trip_date: form.trip_date,
      notes: form.notes || undefined,
    })
    if (err) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
      return
    }
    router.push('/trips')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="px-4 pt-12 pb-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
        <button onClick={() => router.back()} className="text-gray-500 dark:text-gray-400 active:text-gray-800">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">New Trip</h1>
      </header>

      <form onSubmit={handleSubmit} className="px-4 py-6 space-y-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden divide-y divide-gray-100 dark:divide-gray-800">
          <Field label="Trip name *">
            <input
              type="text"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              required
              placeholder="e.g. Weekend in Barcelona"
              className="flex-1 text-base bg-transparent focus:outline-none placeholder-gray-400 dark:placeholder-gray-600 text-gray-900 dark:text-white"
            />
          </Field>
          <Field label="Destination">
            <input
              type="text"
              value={form.destination}
              onChange={e => set('destination', e.target.value)}
              placeholder="e.g. Barcelona, Spain"
              className="flex-1 text-base bg-transparent focus:outline-none placeholder-gray-400 dark:placeholder-gray-600 text-gray-900 dark:text-white"
            />
          </Field>
          <Field label="Date *">
            <input
              type="date"
              value={form.trip_date}
              onChange={e => set('trip_date', e.target.value)}
              required
              className="flex-1 text-base bg-transparent focus:outline-none text-gray-800 dark:text-white"
            />
          </Field>
          <Field label="Notes">
            <input
              type="text"
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder="Optional notes…"
              className="flex-1 text-base bg-transparent focus:outline-none placeholder-gray-400 dark:placeholder-gray-600 text-gray-900 dark:text-white"
            />
          </Field>
        </div>

        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading || !form.name || !form.trip_date}
          className="w-full bg-rose-500 text-white font-semibold rounded-2xl py-4 text-base disabled:opacity-40 active:bg-rose-600"
        >
          {loading ? 'Saving…' : 'Save trip'}
        </button>
      </form>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <span className="text-sm text-gray-400 w-28 flex-shrink-0">{label}</span>
      {children}
    </div>
  )
}
