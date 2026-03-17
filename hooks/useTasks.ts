'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Task } from '@/types/database'

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchTasks = useCallback(async () => {
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: true })
    if (data) setTasks(data as Task[])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchTasks()

    const channel = supabase
      .channel('tasks-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => {
        fetchTasks()
      })
      .subscribe()

    function handleVisibility() {
      if (document.visibilityState === 'visible') fetchTasks()
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      supabase.removeChannel(channel)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [fetchTasks])

  async function addTask(text: string) {
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('tasks').insert({ text, created_by: user?.id ?? null })
  }

  async function toggleTask(id: string, isChecked: boolean) {
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('tasks').update({
      is_checked: isChecked,
      checked_by: isChecked ? (user?.id ?? null) : null,
      checked_at: isChecked ? new Date().toISOString() : null,
    }).eq('id', id)
  }

  async function deleteTask(id: string) {
    await supabase.from('tasks').delete().eq('id', id)
  }

  return { tasks, loading, addTask, toggleTask, deleteTask }
}
