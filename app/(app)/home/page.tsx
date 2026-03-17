'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTrips } from '@/hooks/useTrips'
import { useTasks } from '@/hooks/useTasks'
import { useGroceries } from '@/hooks/useGroceries'
import TripCard from '@/components/trips/TripCard'
import { createClient } from '@/lib/supabase/client'

export default function HomePage() {
  const { next, upcoming, loading: tripsLoading } = useTrips()
  const { tasks } = useTasks()
  const { items } = useGroceries()
  const router = useRouter()

  const openTasks = tasks.filter(t => !t.is_checked).length
  const openGroceries = items.filter(i => !i.is_checked).length

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="px-4 pt-12 pb-6 space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Home</h1>
          <p className="text-sm text-gray-400">{greeting()}</p>
        </div>
        <button
          onClick={handleSignOut}
          className="text-xs text-gray-400 active:text-gray-600 bg-white border border-gray-200 rounded-xl px-3 py-1.5"
        >
          Sign out
        </button>
      </header>

      {/* Trip countdown */}
      <section>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Next trip</h2>
        {tripsLoading ? (
          <div className="h-28 bg-rose-100 rounded-2xl animate-pulse" />
        ) : next ? (
          <TripCard trip={next} featured />
        ) : (
          <Link href="/trips/new" className="flex items-center justify-center gap-2 bg-white border-2 border-dashed border-gray-200 rounded-2xl py-8 text-gray-400">
            <span className="text-lg">✈️</span>
            <span className="text-sm font-medium">Plan a trip</span>
          </Link>
        )}
      </section>

      {/* Quick links */}
      <section className="grid grid-cols-2 gap-3">
        <Link href="/tasks" className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-2">
          <div className="text-2xl">✅</div>
          <div className="font-semibold text-gray-800">Tasks</div>
          <div className="text-sm text-gray-400">{openTasks} remaining</div>
        </Link>
        <Link href="/groceries" className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-2">
          <div className="text-2xl">🛒</div>
          <div className="font-semibold text-gray-800">Groceries</div>
          <div className="text-sm text-gray-400">{openGroceries} to get</div>
        </Link>
      </section>

      {/* Upcoming trips */}
      {upcoming.length > 1 && (
        <section>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">All upcoming</h2>
          <div className="space-y-2">
            {upcoming.slice(1).map(trip => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning ☀️'
  if (h < 18) return 'Good afternoon 🌤️'
  return 'Good evening 🌙'
}
