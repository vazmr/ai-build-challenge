const KEY = 'temple-student-hub:tour-v1'
export const START_TOUR_EVENT = 'temple:start-tour'

export function hasSeenTour(): boolean {
  try {
    return window.localStorage.getItem(KEY) === 'done'
  } catch {
    return true // storage blocked: don't nag on every load
  }
}

export function markTourSeen() {
  try {
    window.localStorage.setItem(KEY, 'done')
  } catch {
    // ignore
  }
}

export function clearTourSeen() {
  try {
    window.localStorage.removeItem(KEY)
  } catch {
    // ignore
  }
}

export function startTour() {
  window.dispatchEvent(new Event(START_TOUR_EVENT))
}
