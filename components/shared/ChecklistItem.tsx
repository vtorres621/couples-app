'use client'

interface ChecklistItemProps {
  id: string
  text: string
  isChecked: boolean
  onToggle: (id: string, checked: boolean) => void
  onDelete?: (id: string) => void
}

export default function ChecklistItem({ id, text, isChecked, onToggle, onDelete }: ChecklistItemProps) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3.5 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 last:border-b-0 transition-opacity ${isChecked ? 'opacity-50' : ''}`}>
      <button
        onClick={() => onToggle(id, !isChecked)}
        className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
          isChecked
            ? 'bg-rose-500 border-rose-500'
            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900'
        }`}
      >
        {isChecked && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      <span className={`flex-1 text-base ${isChecked ? 'line-through text-gray-400 dark:text-gray-600' : 'text-gray-800 dark:text-gray-100'}`}>
        {text}
      </span>

      {onDelete && (
        <button
          onClick={() => onDelete(id)}
          className="text-gray-300 dark:text-gray-700 active:text-red-400 p-1 -mr-1"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  )
}
