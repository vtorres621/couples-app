'use client'

import { useState } from 'react'
import { useGroceries } from '@/hooks/useGroceries'
import ChecklistItem from '@/components/shared/ChecklistItem'
import AddItemForm from '@/components/shared/AddItemForm'

export default function GroceriesPage() {
  const { items, sections, loading, addItem, toggleItem, addSection, deleteSection } = useGroceries()
  const [addingSectionName, setAddingSectionName] = useState('')
  const [showAddSection, setShowAddSection] = useState(false)

  const totalUnchecked = items.filter(i => !i.is_checked).length

  // Items with no section
  const generalItems = items.filter(i => i.section_id === null)
  const generalUnchecked = generalItems.filter(i => !i.is_checked)
  const generalChecked = generalItems.filter(i => i.is_checked)

  async function handleAddSection(e: React.FormEvent) {
    e.preventDefault()
    const name = addingSectionName.trim()
    if (!name) return
    await addSection(name)
    setAddingSectionName('')
    setShowAddSection(false)
  }

  return (
    <div className="flex flex-col h-full">
      <header className="px-4 pt-12 pb-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Groceries</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          {totalUnchecked > 0 ? `${totalUnchecked} to get` : 'All done!'}
        </p>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <>
            {/* General (no section) */}
            {(generalItems.length > 0 || sections.length === 0) && (
              <SectionBlock
                title={sections.length > 0 ? 'General' : null}
                unchecked={generalUnchecked}
                checked={generalChecked}
                onToggle={toggleItem}
                onAdd={(text) => addItem(text, null)}
              />
            )}

            {/* Named sections */}
            {sections.map(section => {
              const sectionItems = items.filter(i => i.section_id === section.id)
              const unchecked = sectionItems.filter(i => !i.is_checked)
              const checked = sectionItems.filter(i => i.is_checked)
              return (
                <SectionBlock
                  key={section.id}
                  title={section.name}
                  unchecked={unchecked}
                  checked={checked}
                  onToggle={toggleItem}
                  onAdd={(text) => addItem(text, section.id)}
                  onDeleteSection={() => deleteSection(section.id)}
                />
              )
            })}

            {/* Add section */}
            <div className="rounded-2xl overflow-hidden border border-dashed border-gray-200 dark:border-gray-700">
              {showAddSection ? (
                <form onSubmit={handleAddSection} className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-900">
                  <input
                    autoFocus
                    type="text"
                    value={addingSectionName}
                    onChange={e => setAddingSectionName(e.target.value)}
                    placeholder="Section name (e.g. Lidl)…"
                    className="flex-1 text-base bg-transparent focus:outline-none placeholder-gray-400 dark:placeholder-gray-600 text-gray-900 dark:text-white"
                  />
                  <button
                    type="submit"
                    disabled={!addingSectionName.trim()}
                    className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center disabled:opacity-30 flex-shrink-0"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowAddSection(false); setAddingSectionName('') }}
                    className="text-gray-300 dark:text-gray-600 active:text-gray-500 p-1"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                    </svg>
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setShowAddSection(true)}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-900 active:bg-gray-50 dark:active:bg-gray-800"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                  </svg>
                  Add section
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

interface SectionBlockProps {
  title: string | null
  unchecked: { id: string; text: string; is_checked: boolean }[]
  checked: { id: string; text: string; is_checked: boolean }[]
  onToggle: (id: string, checked: boolean) => void
  onAdd: (text: string) => Promise<void>
  onDeleteSection?: () => void
}

function SectionBlock({ title, unchecked, checked, onToggle, onAdd, onDeleteSection }: SectionBlockProps) {
  return (
    <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
      {title && (
        <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{title}</span>
          {onDeleteSection && (
            <button
              onClick={onDeleteSection}
              className="text-gray-300 dark:text-gray-600 active:text-red-400 p-1 -mr-1"
              title="Delete section"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
      )}
      {unchecked.map(item => (
        <ChecklistItem
          key={item.id}
          id={item.id}
          text={item.text}
          isChecked={item.is_checked}
          onToggle={onToggle}
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
          onToggle={onToggle}
        />
      ))}
      <AddItemForm onAdd={onAdd} placeholder={`Add to ${title ?? 'list'}…`} />
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 animate-pulse">
      {[1,2,3].map(i => (
        <div key={i} className="flex items-center gap-3 px-4 py-3.5 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
          <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      ))}
    </div>
  )
}
