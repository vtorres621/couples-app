'use client'

import { useState } from 'react'

interface AddItemFormProps {
  onAdd: (text: string) => Promise<void>
  placeholder?: string
}

export default function AddItemForm({ onAdd, placeholder = 'Add item…' }: AddItemFormProps) {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    setLoading(true)
    await onAdd(trimmed)
    setText('')
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
      <input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder={placeholder}
        className="flex-1 text-base bg-transparent focus:outline-none placeholder-gray-400 dark:placeholder-gray-600 text-gray-900 dark:text-white"
      />
      <button
        type="submit"
        disabled={!text.trim() || loading}
        className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center disabled:opacity-30 flex-shrink-0"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
          <path d="M12 5v14M5 12h14" strokeLinecap="round" />
        </svg>
      </button>
    </form>
  )
}
