'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { CalendarEvent } from '@/types/database'

export function useCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchEvents = useCallback(async () => {
    const { data } = await supabase
      .from('calendar_events')
      .select('*')
      .order('event_date', { ascending: true })
      .order('event_time', { ascending: true })
    if (data) setEvents(data as CalendarEvent[])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchEvents()

    function handleVisibility() {
      if (document.visibilityState === 'visible') fetchEvents()
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [fetchEvents])

  async function addEvent(event: {
    title: string
    event_date: string
    event_time?: string
    notes?: string
  }) {
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('calendar_events').insert({
      title: event.title,
      event_date: event.event_date,
      event_time: event.event_time || null,
      notes: event.notes || null,
      created_by: user?.id ?? null,
    })
    if (!error) fetchEvents()
    return error
  }

  async function deleteEvent(id: string) {
    await supabase.from('calendar_events').delete().eq('id', id)
    fetchEvents()
  }

  return { events, loading, addEvent, deleteEvent }
}
