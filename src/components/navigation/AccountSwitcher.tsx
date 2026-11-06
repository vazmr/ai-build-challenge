import { UserRound } from 'lucide-react'
import { useAppState } from '../../hooks/useAppState'

export function AccountSwitcher() {
  const { state, activeAccount, switchAccount } = useAppState()
  return (
    <label className="flex items-center gap-1.5 text-sm">
      <UserRound aria-hidden className="hidden size-4 text-muted-foreground sm:block" />
      <span className="sr-only">Demo account</span>
      <select
        value={activeAccount.id}
        onChange={(e) => switchAccount(e.target.value)}
        className="min-h-9 rounded-lg border border-border bg-surface px-2 text-sm"
      >
        {state.accounts.map((a) => (
          <option key={a.id} value={a.id}>{a.displayName}</option>
        ))}
      </select>
    </label>
  )
}
