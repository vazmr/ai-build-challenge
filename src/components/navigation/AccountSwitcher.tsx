import { Check, ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useAppState } from '../../hooks/useAppState'
import { usePresence } from '../../hooks/usePresence'
import { Avatar } from '../shared/ui'

// Demo-only: what each simulated account can do, so the choice is meaningful.
const ROLE_LABEL: Record<string, string> = {
  'stu-jordan': 'General student',
  'stu-taylor': 'Organization member',
  'stu-morgan': 'Organization officer',
  'stu-alex': 'Organization administrator',
}

/** Radio-style list of demo accounts, each with photo, name and role. */
export function AccountList({ onPick }: { onPick?: () => void }) {
  const { state, activeAccount, switchAccount } = useAppState()
  return (
    <ul role="listbox" aria-label="Switch demo account" className="space-y-0.5">
      {state.accounts.map((a) => {
        const selected = a.id === activeAccount.id
        return (
          <li key={a.id} role="none">
            <button
              type="button"
              role="option"
              aria-selected={selected}
              onClick={() => { switchAccount(a.id); onPick?.() }}
              className={`flex min-h-12 w-full items-center gap-3 rounded-lg px-2 text-left ${selected ? 'bg-brand-soft' : 'hover:bg-surface-muted'}`}
            >
              <Avatar name={a.displayName} size={36} />
              <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{a.displayName}</span><span className="block truncate text-xs text-muted-foreground">{ROLE_LABEL[a.profileId] ?? 'Student'}</span></span>
              {selected && <Check aria-hidden className="size-4 text-brand" />}
            </button>
          </li>
        )
      })}
    </ul>
  )
}

/** Profile-style trigger (photo + name). Opens the list of other demo accounts. */
export function AccountSwitcher() {
  const { activeAccount, activeStudent } = useAppState()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const pop = usePresence(open, 140)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const onClick = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClick)
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onClick) }
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Signed in as ${activeAccount.displayName}. Switch demo account`}
        onClick={() => setOpen((o) => !o)}
        className="flex min-h-11 items-center gap-2 rounded-full border border-border py-1 pl-1 pr-3 hover:bg-surface-muted"
      >
        <Avatar name={activeStudent.displayName} size={32} />
        <span className="text-sm font-semibold">{activeAccount.displayName}</span>
        <ChevronDown aria-hidden className={`size-4 text-muted-foreground transition-transform duration-200 ease-out ${open ? 'rotate-180' : ''}`} />
      </button>
      {pop.mounted && (
        <div data-state={pop.state} className="motion-pop absolute right-0 z-40 mt-2 w-64 rounded-xl border border-border bg-surface p-2 shadow-lg">
          <p className="px-2 pb-1.5 pt-1 text-xs font-semibold text-muted-foreground">Demo accounts</p>
          <AccountList onPick={() => setOpen(false)} />
          <p className="mt-1 border-t border-border px-2 pb-1 pt-2 text-xs text-muted-foreground">Simulated sign-in. No passwords are collected.</p>
        </div>
      )}
    </div>
  )
}
