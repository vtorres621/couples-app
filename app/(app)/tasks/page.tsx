'use client'

import { useTasks } from '@/hooks/useTasks'
import ChecklistItem from '@/components/shared/ChecklistItem'
import AddItemForm from '@/components/shared/AddItemForm'

export default function TasksPage() {
  const { tasks, loading, addTask, toggleTask, deleteTask } = useTasks()

  const unchecked = tasks.filter(t => !t.is_checked)
  const checked = tasks.filter(t => t.is_checked)

  return (
    <div className="flex flex-col h-full">
      <header className="px-4 pt-12 pb-4 bg-white border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
        <p className="text-sm text-gray-400 mt-0.5">{unchecked.length} remaining</p>
      </header>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <LoadingSkeleton />
        ) : tasks.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="rounded-2xl mx-4 mt-4 overflow-hidden shadow-sm border border-gray-100">
            {unchecked.map(task => (
              <ChecklistItem
                key={task.id}
                id={task.id}
                text={task.text}
                isChecked={task.is_checked}
                onToggle={toggleTask}
                onDelete={deleteTask}
              />
            ))}
            {checked.length > 0 && unchecked.length > 0 && (
              <div className="px-4 py-2 bg-gray-50 text-xs text-gray-400 font-medium uppercase tracking-wide border-t border-gray-100">
                Done
              </div>
            )}
            {checked.map(task => (
              <ChecklistItem
                key={task.id}
                id={task.id}
                text={task.text}
                isChecked={task.is_checked}
                onToggle={toggleTask}
                onDelete={deleteTask}
              />
            ))}
          </div>
        )}
      </div>

      <div className="mx-4 mb-4 rounded-2xl overflow-hidden shadow-sm border border-gray-100">
        <AddItemForm onAdd={addTask} placeholder="Add a task…" />
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-8">
      <div className="text-5xl mb-4">✅</div>
      <p className="text-gray-500">No tasks yet. Add one below!</p>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="mx-4 mt-4 rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
      {[1,2,3].map(i => (
        <div key={i} className="flex items-center gap-3 px-4 py-3.5 bg-white border-b border-gray-100">
          <div className="w-6 h-6 rounded-full bg-gray-200" />
          <div className="flex-1 h-4 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  )
}
