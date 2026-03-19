'use client'

import Link from 'next/link'
import { useCalendar } from '@/hooks/useCalendar'
import type { CalendarEvent } from '@/types/database'

export default function CalendarPage() {
  const { events, loading, deleteEvent } = useCalendar()

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const upcoming = events.filter(e => new Date(e.event_date + 'T00:00:00') >= today)
  const past = events.filter(e => new Date(e.event_date + 'T00:00:00') < today)

  // Group upcoming by month
  const grouped = groupByMonth(upcoming)

  return (
    <div className="flex flex-col h-full">
      <header className="px-4 pt-12 pb-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Calendar</h1>
          <p className="text-sm text-gray-400 mt-0.5">{upcoming.length} upcoming</p>
        </div>
        <Link
          href="/calendar/new"
          className="w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center shadow-sm"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </svg>
        </Link>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
        {loading ? (
          <LoadingSkeleton />
        ) : events.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {grouped.length === 0 && past.length > 0 && (
              <p className="text-sm text-gray-400 text-center py-8">No upcoming events.</p>
            )}
            {grouped.map(({ month, events: monthEvents }) => (
              <div key={month}>
                <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 px-1">{month}</h2>
                <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
                  {monthEvents.map((event, idx) => (
                    <EventRow
                      key={event.id}
                      event={event}
                      onDelete={deleteEvent}
                      last={idx === monthEvents.length - 1}
                    />
                  ))}
                </div>
              </div>
            ))}

            {past.length > 0 && (
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-300 dark:text-gray-600 mb-2 px-1">Past</h2>
                <div className="rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 opacity-50">
                  {[...past].reverse().map((event, idx) => (
                    <EventRow
                      key={event.id}
                      event={event}
                      onDelete={deleteEvent}
                      last={idx === past.length - 1}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function EventRow({ event, onDelete, last }: { event: CalendarEvent; onDelete: (id: string) => void; last: boolean }) {
  const dateObj = new Date(event.event_date + 'T00:00:00')
  const dateLabel = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

  let timeLabel = ''
  if (event.event_time) {
    const [h, m] = event.event_time.split(':').map(Number)
    const d = new Date()
    d.setHours(h, m)
    timeLabel = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  }

  return (
    <div className={`flex items-center gap-3 px-4 py-3.5 bg-white dark:bg-gray-900 ${!last ? 'border-b border-gray-100 dark:border-gray-800' : ''}`}>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-900 dark:text-white truncate">{event.title}</div>
        <div className="text-sm text-gray-400 mt-0.5">
          {dateLabel}{timeLabel ? ` · ${timeLabel}` : ''}
        </div>
        {event.notes && (
          <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate">{event.notes}</div>
        )}
      </div>
      <button
        onClick={() => onDelete(event.id)}
        className="text-gray-200 dark:text-gray-700 active:text-red-400 p-1 flex-shrink-0"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}

function groupByMonth(events: CalendarEvent[]): { month: string; events: CalendarEvent[] }[] {
  const map = new Map<string, CalendarEvent[]>()
  for (const event of events) {
    const key = new Date(event.event_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(event)
  }
  return Array.from(map.entries()).map(([month, events]) => ({ month, events }))
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-8">
      <div className="text-5xl mb-4">📅</div>
      <p className="text-gray-500 dark:text-gray-400">No events yet. Tap + to add one!</p>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 animate-pulse">
      {[1,2,3].map(i => (
        <div key={i} className="flex items-center gap-3 px-4 py-3.5 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}
