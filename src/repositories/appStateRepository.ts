import type { PersistedAppState } from '../types'

/**
 * Backend-agnostic persistence contract. The LocalStorage adapter implements it
 * today; a future Supabase adapter can implement the same interface.
 */
export interface AppStateRepository {
  /** Load state, falling back to freshly seeded data if missing/malformed/outdated. */
  load(): PersistedAppState
  save(state: PersistedAppState): void
  /** Discard saved state and return freshly seeded data. */
  reset(): PersistedAppState
}
