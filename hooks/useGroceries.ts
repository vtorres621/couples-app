'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { GroceryItem } from '@/types/database'

export function useGroceries() {
  const [items, setItems] = useState<GroceryItem[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchItems = useCallback(async () => {
    const { data } = await supabase
      .from('grocery_items')
      .select('*')
      .order('created_at', { ascending: true })
    if (data) setItems(data as GroceryItem[])
    setLoading(false)
  }, [])

  useEffect(() => {
    async function clearChecked() {
      await supabase.from('grocery_items').delete().eq('is_checked', true)
      await fetchItems()
    }
    clearChecked()

    const channel = supabase
      .channel('groceries-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'grocery_items' }, () => {
        fetchItems()
      })
      .subscribe()

    function handleVisibility() {
      if (document.visibilityState === 'visible') fetchItems()
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      supabase.removeChannel(channel)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [fetchItems])

  async function addItem(text: string) {
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('grocery_items').insert({ text, created_by: user?.id ?? null })
  }

  async function toggleItem(id: string, isChecked: boolean) {
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('grocery_items').update({
      is_checked: isChecked,
      checked_by: isChecked ? (user?.id ?? null) : null,
      checked_at: isChecked ? new Date().toISOString() : null,
    }).eq('id', id)
  }

  async function deleteItem(id: string) {
    await supabase.from('grocery_items').delete().eq('id', id)
  }

  return { items, loading, addItem, toggleItem, deleteItem }
}
