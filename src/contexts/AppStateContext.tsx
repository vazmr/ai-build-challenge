import { createContext, useCallback, useMemo, useState, type ReactNode } from 'react'
import { localStorageRepository } from '../adapters/local-storage/localStorageRepository'
import type { AppStateRepository } from '../repositories/appStateRepository'
import type { DemoAccount, PersistedAppState, StudentProfile } from '../types'

export interface AppStateContextValue {
  state: PersistedAppState
  activeAccount: DemoAccount
  activeStudent: StudentProfile
  switchAccount: (accountId: string) => void
  /** Apply an immutable update and persist it through the repository. */
  update: (updater: (s: PersistedAppState) => PersistedAppState) => void
  resetDemoData: () => void
}

// eslint-disable-next-line react-refresh/only-export-components
export const AppStateContext = createContext<AppStateContextValue | null>(null)

export function AppStateProvider({
  children,
  repository = localStorageRepository,
}: {
  children: ReactNode
  repository?: AppStateRepository
}) {
  const [state, setState] = useState<PersistedAppState>(() => repository.load())

  const update = useCallback(
    (updater: (s: PersistedAppState) => PersistedAppState) => {
      setState((prev) => {
        const next = updater(prev)
        repository.save(next)
        return next
      })
    },
    [repository],
  )

  const switchAccount = useCallback(
    (accountId: string) => {
      update((s) =>
        s.accounts.some((a) => a.id === accountId) ? { ...s, activeAccountId: accountId } : s,
      )
    },
    [update],
  )

  const resetDemoData = useCallback(() => setState(repository.reset()), [repository])

  const value = useMemo<AppStateContextValue>(() => {
    const activeAccount = state.accounts.find((a) => a.id === state.activeAccountId) ?? state.accounts[0]
    const activeStudent = state.students.find((s) => s.id === activeAccount.profileId) ?? state.students[0]
    return { state, activeAccount, activeStudent, switchAccount, update, resetDemoData }
  }, [state, switchAccount, update, resetDemoData])

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}
