'use client'

import Link from 'next/link'
import { useTrips } from '@/hooks/useTrips'
import TripCard from '@/components/trips/TripCard'

export default function TripsPage() {
  const { trips, loading, deleteTrip } = useTrips()

  return (
    <div className="flex flex-col h-full">
      <header className="px-4 pt-12 pb-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Trips</h1>
          <p className="text-sm text-gray-400 mt-0.5">{trips.length} planned</p>
        </div>
        <Link
          href="/trips/new"
          className="w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center shadow-sm"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </svg>
        </Link>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {loading ? (
          <LoadingSkeleton />
        ) : trips.length === 0 ? (
          <EmptyState />
        ) : (
          trips.map(trip => (
            <TripCard key={trip.id} trip={trip} onDelete={deleteTrip} />
          ))
        )}
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-8">
      <div className="text-5xl mb-4">✈️</div>
      <p className="text-gray-500 dark:text-gray-400">No trips yet. Tap + to plan one!</p>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <>
      {[1,2].map(i => (
        <div key={i} className="h-20 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 animate-pulse" />
      ))}
    </>
  )
}
