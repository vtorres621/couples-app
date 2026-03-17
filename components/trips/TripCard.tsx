'use client'

import { daysUntil, formatDate } from '@/lib/utils'
import type { Trip } from '@/types/database'

interface TripCardProps {
  trip: Trip
  onDelete?: (id: string) => void
  featured?: boolean
}

export default function TripCard({ trip, onDelete, featured = false }: TripCardProps) {
  const days = daysUntil(trip.trip_date)
  const isPast = days < 0
  const isToday = days === 0

  const countdown = isPast
    ? `${Math.abs(days)} days ago`
    : isToday
    ? 'Today!'
    : days === 1
    ? 'Tomorrow!'
    : `${days} days away`

  if (featured) {
    return (
      <div className="bg-rose-500 text-white rounded-2xl p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-rose-200 text-sm font-medium mb-1">Next trip</p>
            <h2 className="text-2xl font-bold">{trip.name}</h2>
            {trip.destination && (
              <p className="text-rose-200 text-sm mt-0.5">{trip.destination}</p>
            )}
          </div>
          <div className="text-right">
            <div className="text-4xl font-black tabular-nums">
              {isPast ? '–' : isToday ? '🎉' : days}
            </div>
            {!isPast && !isToday && (
              <div className="text-rose-200 text-xs font-medium">days to go</div>
            )}
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-rose-400 flex justify-between text-sm">
          <span className="text-rose-200">{formatDate(trip.trip_date)}</span>
          <span className="text-white font-semibold">{countdown}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center bg-white dark:bg-gray-900 rounded-2xl px-4 py-3.5 shadow-sm border border-gray-100 dark:border-gray-800">
      <div className="flex-1">
        <div className="font-semibold text-gray-900 dark:text-white">{trip.name}</div>
        {trip.destination && (
          <div className="text-sm text-gray-400">{trip.destination}</div>
        )}
        <div className="text-xs text-gray-400 mt-0.5">{formatDate(trip.trip_date)}</div>
      </div>
      <div className="text-right mr-3">
        <div className={`text-xl font-bold tabular-nums ${isPast ? 'text-gray-300 dark:text-gray-600' : 'text-rose-500'}`}>
          {isPast ? 'Past' : isToday ? '🎉' : days}
        </div>
        {!isPast && !isToday && (
          <div className="text-xs text-gray-400">days</div>
        )}
      </div>
      {onDelete && (
        <button
          onClick={() => onDelete(trip.id)}
          className="text-gray-200 dark:text-gray-700 active:text-red-400 p-1"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  )
}
