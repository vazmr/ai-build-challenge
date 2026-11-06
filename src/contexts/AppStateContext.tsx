import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { localStorageRepository } from '../adapters/local-storage/localStorageRepository'
import { supabaseEnabled, supabaseRepository } from '../adapters/supabase/supabaseRepository'
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
  repository = supabaseEnabled ? supabaseRepository : localStorageRepository,
}: {
  children: ReactNode
  repository?: AppStateRepository
}) {
  const [state, setState] = useState<PersistedAppState>(() => repository.load())
  // Com backend remoto, espera a primeira carga (máx. 5s) para não mostrar dados defasados.
  const [ready, setReady] = useState(!repository.hydrate)

  useEffect(() => {
    if (!repository.hydrate) return
    let alive = true
    const timeout = setTimeout(() => alive && setReady(true), 5000)
    repository.hydrate().then((remote) => {
      if (!alive) return
      if (remote) setState(remote)
      setReady(true)
    })
    return () => { alive = false; clearTimeout(timeout) }
  }, [repository])

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

  if (!ready) {
    return <div role="status" aria-live="polite" style={{ display: 'grid', placeItems: 'center', minHeight: '100vh', color: '#5f646b' }}>Loading Temple Student Hub…</div>
  }

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}
