'use client'

import { useGroceries } from '@/hooks/useGroceries'
import ChecklistItem from '@/components/shared/ChecklistItem'
import AddItemForm from '@/components/shared/AddItemForm'

export default function GroceriesPage() {
  const { items, loading, addItem, toggleItem, deleteItem } = useGroceries()

  const unchecked = items.filter(i => !i.is_checked)
  const checked = items.filter(i => i.is_checked)

  return (
    <div className="flex flex-col h-full">
      <header className="px-4 pt-12 pb-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Groceries</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          {unchecked.length > 0 ? `${unchecked.length} to get` : 'All done!'}
        </p>
      </header>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <LoadingSkeleton />
        ) : items.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="rounded-2xl mx-4 mt-4 overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
            {unchecked.map(item => (
              <ChecklistItem
                key={item.id}
                id={item.id}
                text={item.text}
                isChecked={item.is_checked}
                onToggle={toggleItem}
              />
            ))}
            {checked.length > 0 && unchecked.length > 0 && (
              <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 text-xs text-gray-400 font-medium uppercase tracking-wide border-t border-gray-100 dark:border-gray-700">
                In cart
              </div>
            )}
            {checked.map(item => (
              <ChecklistItem
                key={item.id}
                id={item.id}
                text={item.text}
                isChecked={item.is_checked}
                onToggle={toggleItem}
              />
            ))}
          </div>
        )}
      </div>

      <div className="mx-4 mb-4 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
        <AddItemForm onAdd={addItem} placeholder="Add to groceries…" />
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-8">
      <div className="text-5xl mb-4">🛒</div>
      <p className="text-gray-500 dark:text-gray-400">Nothing on the list. Add something below!</p>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="mx-4 mt-4 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 animate-pulse">
      {[1,2,3].map(i => (
        <div key={i} className="flex items-center gap-3 px-4 py-3.5 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
          <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      ))}
    </div>
  )
}
