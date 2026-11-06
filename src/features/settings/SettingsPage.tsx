import { Compass, RotateCcw } from 'lucide-react'
import { clearTourSeen, startTour } from '../onboarding/tourStorage'
import { Button, Card, PageHeader, Select } from '../../components/shared/ui'
import { useAppState } from '../../hooks/useAppState'
import { useDirectory } from '../../hooks/useDirectory'
import { toggleBlock } from '../../services/blockService'
import { resetRecommendations } from '../../services/feedService'
import { PROFILE_SECTIONS, setSectionVisibility } from '../../services/profileService'
import type { Visibility } from '../../types'

const VIS: Record<Visibility, string> = { public: 'Public', 'temple-only': 'Temple-only', private: 'Private' }

export function SettingsPage() {
  const { state, activeStudent, update, resetDemoData } = useAppState()
  const { studentName } = useDirectory()
  const me = activeStudent.id
  const blocked = state.blocks.filter((b) => b.studentId === me)
  const hidden = state.hiddenPosts.filter((h) => h.studentId === me).length
  const memberships = state.memberships.filter((m) => m.studentId === me && m.status === 'active')

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <PageHeader title="Settings & Privacy" description={`Signed in as ${activeStudent.displayName}.`} />

      <Card>
        <h2 className="text-lg font-semibold">Profile visibility</h2>
        <p className="mt-1 text-sm text-muted-foreground">Choose who can see each section of your profile. </p>
        <ul className="mt-3 space-y-2">{PROFILE_SECTIONS.map((sec) => (
          <li key={sec.id} className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <label htmlFor={`vis-${sec.id}`} className="font-medium">{sec.label}</label>
            <Select id={`vis-${sec.id}`} className="w-auto" value={activeStudent.privacy[sec.id] ?? 'private'} onChange={(e) => update((s) => setSectionVisibility(s, me, sec.id, e.target.value as Visibility))}>
              {(Object.keys(VIS) as Visibility[]).map((v) => <option key={v} value={v}>{VIS[v]}</option>)}
            </Select>
          </li>
        ))}</ul>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold">What others can and can’t see</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          <li>Who you follow is private. There are no public follower or following lists or counts.</li>
          <li>Your saved items are private.</li>
          <li>Your organization memberships: {memberships.length === 0 ? 'none yet' : memberships.length} (shown on your profile only if the Overview section is visible).</li>
          <li>Private messages, project workspaces and organization channels are limited to people with explicit access.</li>
        </ul>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold">Blocked students</h2>
        {blocked.length === 0 ? <p className="mt-1 text-sm text-muted-foreground">You haven’t blocked anyone. You can block from a profile or a discussion reply.</p> : (
          <ul className="mt-2 space-y-2">{blocked.map((b) => <li key={b.id} className="flex items-center justify-between text-sm">{studentName(b.blockedId)}<Button onClick={() => update((s) => toggleBlock(s, me, b.blockedId))}>Unblock</Button></li>)}</ul>
        )}
      </Card>

      <Card>
        <h2 className="text-lg font-semibold">Feed</h2>
        <p className="mt-1 text-sm text-muted-foreground">{hidden} posts hidden or marked not interested. Edit interests from Feed → Tune your feed.</p>
        <Button className="mt-3" disabled={hidden === 0} onClick={() => update((s) => resetRecommendations(s, me))}><RotateCcw aria-hidden className="size-4" /> Reset recommendations</Button>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold">Product tour</h2>
        <p className="mt-1 text-sm text-muted-foreground">A one-minute walk through Feed, Events, Map, Community, Projects and the assistant.</p>
        <Button className="mt-3" onClick={startTour}><Compass aria-hidden className="size-4" /> Replay tour</Button>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold">App data</h2>
        <p className="mt-1 text-sm text-muted-foreground">Your changes are stored in this browser. Resetting restores the starting data.</p>
        <Button variant="primary" className="mt-4" onClick={() => { if (window.confirm('Reset all app data to the starting state?')) { clearTourSeen(); resetDemoData() } }}><RotateCcw aria-hidden className="size-4" /> Reset app data</Button>
      </Card>
      <Card>
        <h2 className="text-lg font-semibold">About Temple Student Hub</h2>
        <p className="mt-1 max-w-prose text-sm text-muted-foreground">An independent student project, not an official Temple University product. It is not connected to university systems, so events, organizations and resources shown here aren’t officially verified. Always confirm details with official Temple sources.</p>
      </Card>
    </div>
  )
}
