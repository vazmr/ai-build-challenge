import { CalendarCheck, Megaphone, Menu } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAppState } from '../../hooks/useAppState'
import { usePresence } from '../../hooks/usePresence'
import { Avatar } from '../shared/ui'
import { AccountList } from './AccountSwitcher'
import { SETTINGS_NAV, secondaryGroups, type NavGroup } from './navItems'

/** Mobile-only menu (the sidebar replaces it from md up). Same destinations as the sidebar, grouped. */
export function MoreMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { activeStudent } = useAppState()
  const pop = usePresence(open, 140)

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

  const groups: NavGroup[] = [
    {
      id: 'updates',
      label: 'Updates',
      items: [
        { to: '/calendar', label: 'My Campus Calendar', icon: CalendarCheck },
        { to: '/announcements', label: 'Announcements', icon: Megaphone },
      ],
    },
    ...secondaryGroups(activeStudent.id),
    { id: 'settings', label: 'Settings', items: [SETTINGS_NAV] },
  ]

  return (
    <div ref={ref} className="relative md:hidden">
      <button
        type="button"
        aria-label="More"
        data-tour="more"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        title="More" className="flex size-11 items-center justify-center rounded-full hover:bg-surface-muted"
      >
        <Menu aria-hidden className="size-5" />
      </button>
      {pop.mounted && (
        <div role="menu" data-state={pop.state} className="motion-pop absolute right-0 z-40 mt-1 max-h-[calc(100dvh-5rem)] w-72 overflow-y-auto rounded-xl border border-border bg-surface p-2 shadow-lg">
          <div className="flex items-center gap-3 px-2 pb-2 pt-1">
            <Avatar name={activeStudent.displayName} size={40} />
            <div className="min-w-0"><p className="truncate text-sm font-semibold">{activeStudent.displayName}</p>{activeStudent.major && <p className="truncate text-xs text-muted-foreground">{activeStudent.major}</p>}</div>
          </div>
          {groups.map((g) => (
            <div key={g.id} role="none" className="border-t border-border pt-1 first-of-type:border-t-0">
              <p className="px-3 pb-0.5 pt-1.5 text-xs font-semibold text-muted-foreground">{g.label}</p>
              <ul role="none">
                {g.items.map(({ to, label, icon: Icon }) => (
                  <li key={to} role="none">
                    <NavLink
                      role="menuitem"
                      to={to}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) => `flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm ${isActive ? 'bg-brand-soft font-semibold text-brand' : 'hover:bg-surface-muted'}`}
                    >
                      <Icon aria-hidden className="size-4" /> {label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div role="none" className="mt-1 border-t border-border px-1 py-2">
            <p className="mb-1 text-xs font-semibold text-muted-foreground">Demo accounts</p>
            <AccountList onPick={() => setOpen(false)} />
          </div>
        </div>
      )}
    </div>
  )
}
