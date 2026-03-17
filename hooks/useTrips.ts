'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Trip } from '@/types/database'

export function useTrips() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchTrips = useCallback(async () => {
    const { data } = await supabase
      .from('trips')
      .select('*')
      .order('trip_date', { ascending: true })
    if (data) setTrips(data as Trip[])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchTrips()
  }, [fetchTrips])

  async function addTrip(trip: { name: string; destination?: string; trip_date: string; notes?: string }) {
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('trips').insert({
      name: trip.name,
      destination: trip.destination ?? null,
      trip_date: trip.trip_date,
      notes: trip.notes ?? null,
      created_by: user?.id ?? null,
    })
    if (!error) fetchTrips()
    return error
  }

  async function deleteTrip(id: string) {
    await supabase.from('trips').delete().eq('id', id)
    fetchTrips()
  }

  const upcoming = trips.filter(t => {
    const today = new Date(); today.setHours(0, 0, 0, 0)
    return new Date(t.trip_date + 'T00:00:00') >= today
  })

  const next = upcoming[0] ?? null

  return { trips, upcoming, next, loading, addTrip, deleteTrip }
}
