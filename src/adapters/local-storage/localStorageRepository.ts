import { createSeedState, SCHEMA_VERSION } from '../../data/seed'
import type { AppStateRepository } from '../../repositories/appStateRepository'
import type { PersistedAppState } from '../../types'

export const STORAGE_KEY = `temple-student-hub:v${SCHEMA_VERSION}`

/** Keys that must be arrays for a stored envelope to be considered usable. */
const ARRAY_KEYS: (keyof PersistedAppState)[] = [
  'accounts', 'students', 'organizations', 'memberships', 'posts', 'follows',
  'events', 'eventParticipations', 'communities', 'projects', 'projectMemberships',
  'projectJoinRequests', 'tasks', 'collections', 'portfolioItems', 'savedItems',
  'conversations', 'messages', 'resources',
]

function isValidState(value: unknown): value is PersistedAppState {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  if (v.schemaVersion !== SCHEMA_VERSION) return false
  if (typeof v.activeAccountId !== 'string') return false
  if (!ARRAY_KEYS.every((k) => Array.isArray(v[k]))) return false
  const accounts = v.accounts as { id?: unknown }[]
  return accounts.some((a) => a.id === v.activeAccountId)
}

function getStorage(): Storage | null {
  try {
    return window.localStorage
  } catch {
    return null // blocked or unavailable (private mode, SSR, etc.)
  }
}

export const localStorageRepository: AppStateRepository = {
  load() {
    const storage = getStorage()
    if (storage) {
      try {
        const raw = storage.getItem(STORAGE_KEY)
        if (raw) {
          const parsed: unknown = JSON.parse(raw)
          if (isValidState(parsed)) return parsed
        }
      } catch {
        // malformed JSON — fall through to reseed
      }
    }
    const seed = createSeedState()
    this.save(seed)
    return seed
  },
  save(state) {
    try {
      getStorage()?.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // quota/unavailable: prototype keeps working in memory
    }
  },
  reset() {
    try {
      getStorage()?.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
    const seed = createSeedState()
    this.save(seed)
    return seed
  },
}
