import { useSyncExternalStore } from 'react'

/**
 * Per-student record of stamps the student has already watched land in the book, with the day each was inked.
 * It is a UI convenience only (the stamps themselves are derived), so it lives outside the app state schema.
 * Missing/blocked storage just means every earned stamp counts as "new" again.
 */
const KEY = 'temple-student-hub:passport-v1'

type Book = Record<string, Record<string, string>>

let cache: Book | null = null
const listeners = new Set<() => void>()

function read(): Book {
  if (cache) return cache
  try {
    cache = JSON.parse(window.localStorage.getItem(KEY) ?? '{}') as Book
  } catch {
    cache = {}
  }
  return cache
}

function subscribe(fn: () => void) {
  listeners.add(fn)
  return () => { listeners.delete(fn) }
}

const EMPTY: Record<string, string> = {}
export const useStampDates = (studentId: string) =>
  useSyncExternalStore(subscribe, () => read()[studentId] ?? EMPTY, () => EMPTY)

export function markStamped(studentId: string, stopId: string, when = new Date()) {
  const book = read()
  if (book[studentId]?.[stopId]) return
  cache = { ...book, [studentId]: { ...book[studentId], [stopId]: when.toISOString() } }
  try { window.localStorage.setItem(KEY, JSON.stringify(cache)) } catch { /* ignore */ }
  listeners.forEach((fn) => fn())
}

export function clearPassportMemory() {
  cache = {}
  try { window.localStorage.removeItem(KEY) } catch { /* ignore */ }
  listeners.forEach((fn) => fn())
}
