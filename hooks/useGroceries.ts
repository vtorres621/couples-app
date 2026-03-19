'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { GroceryItem, GrocerySection } from '@/types/database'

export function useGroceries() {
  const [items, setItems] = useState<GroceryItem[]>([])
  const [sections, setSections] = useState<GrocerySection[]>([])
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

  const fetchSections = useCallback(async () => {
    const { data } = await supabase
      .from('grocery_sections')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true })
    if (data) setSections(data as GrocerySection[])
  }, [])

  useEffect(() => {
    async function init() {
      await supabase.from('grocery_items').delete().eq('is_checked', true)
      await fetchSections()
      await fetchItems()
    }
    init()

    const channel = supabase
      .channel('groceries-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'grocery_items' }, () => {
        fetchItems()
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'grocery_sections' }, () => {
        fetchSections()
      })
      .subscribe()

    function handleVisibility() {
      if (document.visibilityState === 'visible') {
        fetchSections()
        fetchItems()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      supabase.removeChannel(channel)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [fetchItems, fetchSections])

  async function addItem(text: string, sectionId?: string | null) {
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('grocery_items').insert({
      text,
      created_by: user?.id ?? null,
      section_id: sectionId ?? null,
    })
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

  async function addSection(name: string) {
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('grocery_sections').insert({
      name,
      sort_order: sections.length,
      created_by: user?.id ?? null,
    })
  }

  async function deleteSection(id: string) {
    await supabase.from('grocery_sections').delete().eq('id', id)
  }

  return { items, sections, loading, addItem, toggleItem, deleteItem, addSection, deleteSection }
}
