import { Plus } from 'lucide-react'
import { Avatar } from '../../components/shared/ui'
import { useAppState } from '../../hooks/useAppState'
import { goingStudents } from '../../services/eventsService'

const MAX_AVATARS = 3

/** Social proof: up to 3 avatars, a "+N" bubble for the rest, and the total simulated RSVP count. */
export function EventAttendees({ eventId }: { eventId: string }) {
  const { state, activeStudent } = useAppState()
  const going = goingStudents(state, activeStudent.id, eventId)
  if (going.length === 0) return <p className="mt-2 text-xs text-muted-foreground">Be the first to RSVP.</p>

  const shown = going.slice(0, MAX_AVATARS)
  const extra = going.length - shown.length
  const names = shown.map((s) => (s.id === activeStudent.id ? 'You' : s.displayName)).join(', ')
  const label = `${going.length} going: ${names}${extra > 0 ? ` and ${extra} more` : ''}`

  return (
    <div className="mt-2 flex items-center gap-2" title={label}>
      <span className="sr-only">{label}</span>
      <span className="flex -space-x-2" aria-hidden>
        {shown.map((s) => <span key={s.id} className="rounded-full ring-2 ring-surface"><Avatar name={s.displayName} size={26} /></span>)}
        {extra > 0 && (
          <span className="flex h-[26px] min-w-[26px] items-center justify-center gap-px rounded-full bg-surface-muted px-1 text-[11px] font-semibold text-muted-foreground ring-2 ring-surface">
            <Plus className="size-3" />{extra}
          </span>
        )}
      </span>
      <span aria-hidden className="text-xs text-muted-foreground">{going.length} going</span>
    </div>
  )
}
