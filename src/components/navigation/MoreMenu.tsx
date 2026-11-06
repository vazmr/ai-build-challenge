import { Bookmark, BookOpen, Menu, Settings, UserRound } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppState } from '../../hooks/useAppState'

export function MoreMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { activeStudent } = useAppState()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClick)
    }
  }, [open])

  const items = [
    { to: `/profile/${activeStudent.id}`, label: 'My Profile', icon: UserRound },
    { to: '/resources', label: 'Resources', icon: BookOpen },
    { to: '/saved', label: 'Saved Items', icon: Bookmark },
    { to: '/settings', label: 'Settings & Privacy', icon: Settings },
  ]

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="More"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex min-h-10 items-center gap-1.5 rounded-lg px-2.5 text-sm font-medium hover:bg-surface-muted"
      >
        <Menu aria-hidden className="size-5" /> <span className="hidden sm:inline">More</span>
      </button>
      {open && (
        <ul role="menu" className="absolute right-0 mt-1 w-56 rounded-xl border border-border bg-surface p-1 shadow-md">
          {items.map(({ to, label, icon: Icon }) => (
            <li key={to} role="none">
              <Link
                role="menuitem"
                to={to}
                onClick={() => setOpen(false)}
                className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm hover:bg-surface-muted"
              >
                <Icon aria-hidden className="size-4 text-muted-foreground" /> {label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
