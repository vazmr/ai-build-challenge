import { dayKey } from './format'

export type Urgency = 'now' | 'tonight' | 'today' | 'tomorrow' | 'soon' | 'later' | 'past'

/** Human, exciting timing label for an event relative to `now`. */
export function whenInfo(startIso: string, endIso: string, now: Date): { label: string; urgency: Urgency } {
  const start = new Date(startIso)
  const end = new Date(endIso)
  if (end < now) return { label: 'Ended', urgency: 'past' }
  if (start <= now) return { label: 'Happening now', urgency: 'now' }
  const today = dayKey(now)
  const startDay = dayKey(start)
  const tomorrow = dayKey(new Date(now.getTime() + 86_400_000))
  const hour = Number(new Intl.DateTimeFormat('en-US', { hour: 'numeric', hour12: false, timeZone: 'America/New_York' }).format(start))
  if (startDay === today) return { label: hour >= 17 ? 'Tonight' : 'Today', urgency: hour >= 17 ? 'tonight' : 'today' }
  if (startDay === tomorrow) return { label: 'Tomorrow', urgency: 'tomorrow' }
  const days = Math.round((start.getTime() - now.getTime()) / 86_400_000)
  if (days <= 6) return { label: `In ${days} days`, urgency: 'soon' }
  return { label: `In ${Math.round(days / 7)} wk`, urgency: 'later' }
}

export const monthAbbr = (iso: string) => new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: 'America/New_York' }).format(new Date(iso)).toUpperCase()
export const dayNumber = (iso: string) => new Intl.DateTimeFormat('en-US', { day: 'numeric', timeZone: 'America/New_York' }).format(new Date(iso))

/** Minimal .ics file so an RSVP'd event can be added to a real calendar (user-initiated download). */
export function buildIcs(e: { id: string; title: string; description: string; startAt: string; endAt: string; locationName: string }): string {
  const fmt = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  const esc = (t: string) => t.replace(/\\|;|,/g, (m) => '\\' + m).replace(/\n/g, '\\n')
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Temple Student Hub//EN', 'BEGIN:VEVENT', `UID:${e.id}@templestudenthub`,
    `DTSTAMP:${fmt(new Date().toISOString())}`, `DTSTART:${fmt(e.startAt)}`, `DTEND:${fmt(e.endAt)}`, `SUMMARY:${esc(e.title)}`,
    `DESCRIPTION:${esc(e.description)}`, `LOCATION:${esc(e.locationName)}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n')
}
