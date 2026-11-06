const timeFmt = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/New_York' })
const dayFmt = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'America/New_York' })
const dayKeyFmt = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' })

export const formatDay = (iso: string) => dayFmt.format(new Date(iso))
export const formatTimeRange = (startIso: string, endIso: string) =>
  `${timeFmt.format(new Date(startIso))} – ${timeFmt.format(new Date(endIso))}`
/** YYYY-MM-DD in Eastern time, used to compare calendar days. */
export const dayKey = (iso: string | Date) => dayKeyFmt.format(typeof iso === 'string' ? new Date(iso) : iso)

export function timeAgo(iso: string, now = new Date()): string {
  const mins = Math.max(0, Math.round((now.getTime() - new Date(iso).getTime()) / 60000))
  if (mins < 60) return `${mins}m ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  return days < 30 ? `${days}d ago` : formatDay(iso)
}
