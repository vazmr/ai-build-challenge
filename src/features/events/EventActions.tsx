import { Bookmark, BookmarkCheck, CalendarCheck, CircleCheck } from 'lucide-react'
import { Button } from '../../components/shared/ui'
import { useAppState } from '../../hooks/useAppState'
import { participationFor, toggleGoing, toggleSaveEvent } from '../../services/eventsService'

/** Save and (simulated) RSVP controls. RSVP is not real registration. */
export function EventActions({ eventId }: { eventId: string }) {
  const { state, activeStudent, update } = useAppState()
  const me = activeStudent.id
  const cur = participationFor(state, me, eventId)?.state
  if (cur === 'attended') {
    return <span className="inline-flex items-center gap-1.5 text-sm font-medium text-success"><CircleCheck aria-hidden className="size-4" /> Attended (confirmed)</span>
  }
  return (
    <div className="flex flex-wrap gap-2">
      <Button aria-pressed={cur === 'saved'} disabled={cur === 'going'} onClick={() => update((s) => toggleSaveEvent(s, me, eventId))}>
        {cur === 'saved' ? <BookmarkCheck aria-hidden className="size-4 text-brand" /> : <Bookmark aria-hidden className="size-4" />} {cur === 'saved' ? 'Saved' : 'Save'}
      </Button>
      <Button variant={cur === 'going' ? 'secondary' : 'primary'} aria-pressed={cur === 'going'} onClick={() => update((s) => toggleGoing(s, me, eventId))}>
        <CalendarCheck aria-hidden className="size-4" /> {cur === 'going' ? 'Going (demo RSVP) · Cancel' : 'RSVP (demo)'}
      </Button>
    </div>
  )
}
