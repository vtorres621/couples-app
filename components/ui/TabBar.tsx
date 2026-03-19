'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { href: '/home', label: 'Home', icon: HomeIcon },
  { href: '/tasks', label: 'Tasks', icon: TasksIcon },
  { href: '/groceries', label: 'Groceries', icon: GroceriesIcon },
  { href: '/trips', label: 'Trips', icon: TripsIcon },
  { href: '/calendar', label: 'Calendar', icon: CalendarIcon },
]

export default function TabBar() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 safe-bottom z-50">
      <div className="flex">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/home' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center gap-1 py-2 text-xs font-medium transition-colors ${
                active ? 'text-rose-500' : 'text-gray-400 dark:text-gray-500'
              }`}
            >
              <Icon active={active} />
              {label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  )
}

function TasksIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M9 11l3 3L22 4" strokeLinecap="round" strokeLinejoin="round" opacity={active ? 1 : 0.5} />
      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" strokeLinecap="round" />
    </svg>
  )
}

function GroceriesIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  )
}

function TripsIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
      <circle cx="12" cy="9" r="2.5" fill={active ? 'white' : 'currentColor'} stroke="none" />
    </svg>
  )
}

function CalendarIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="4" width="18" height="18" rx="2" fill={active ? 'currentColor' : 'none'} />
      <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" stroke={active ? 'white' : 'currentColor'} />
      {active ? (
        <>
          <rect x="7" y="13" width="3" height="3" rx="0.5" fill="white" stroke="none" />
          <rect x="14" y="13" width="3" height="3" rx="0.5" fill="white" stroke="none" />
        </>
      ) : (
        <>
          <rect x="7" y="13" width="3" height="3" rx="0.5" fill="currentColor" stroke="none" />
          <rect x="14" y="13" width="3" height="3" rx="0.5" fill="currentColor" stroke="none" />
        </>
      )}
    </svg>
  )
}
