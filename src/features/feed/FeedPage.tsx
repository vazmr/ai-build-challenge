import { RotateCcw, SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { DiscoveryRail } from '../../components/layout/DiscoveryRail'
import { Button, Card, EmptyState, PageHeader, Tabs } from '../../components/shared/ui'
import { CURATED_TAGS } from '../../data/seed'
import { useAppState } from '../../hooks/useAppState'
import { getFeed, resetRecommendations, toggleInterest, type FeedMode } from '../../services/feedService'
import { PassportCard } from '../passport/PassportCard'
import { PostCard } from './PostCard'
import { PostComposer } from './PostComposer'
import { StartHere } from './StartHere'

const MODES: { id: FeedMode; label: string }[] = [
  { id: 'for-you', label: 'For You' },
  { id: 'following', label: 'Following' },
  { id: 'discover', label: 'Discover' },
]

const EMPTY: Record<FeedMode, { title: string; description: string }> = {
  'for-you': { title: 'Nothing here yet', description: 'Add a few interests below, or follow people and organizations, to personalize your feed.' },
  following: { title: 'You’re not following anyone with posts yet', description: 'Follow students and organizations from their posts. Following is private; nobody sees who you follow.' },
  discover: { title: 'You’ve seen everything new', description: 'Check back later or reset hidden posts below.' },
}

export function FeedPage() {
  const { state, activeStudent, update } = useAppState()
  const [mode, setMode] = useState<FeedMode>('for-you')
  const [tuning, setTuning] = useState(false)
  const posts = getFeed(state, activeStudent.id, mode)
  const hiddenCount = state.hiddenPosts.filter((h) => h.studentId === activeStudent.id).length

  return (
    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-[minmax(0,40rem)_18rem]">
      <div className="min-w-0">
      <PageHeader title="Feed" actions={<Button onClick={() => setTuning((t) => !t)} aria-expanded={tuning} aria-label="Tune your feed"><SlidersHorizontal aria-hidden className="size-4" /> Tune</Button>} />
      <PassportCard className="mb-5 lg:hidden" />
      <StartHere />

      {tuning && (
        <Card className="motion-rise mb-5">
          <h2 className="font-semibold">Your interests</h2>
          <p className="mt-1 text-sm text-muted-foreground">These shape For You and stay private to you. The feed never shows public like or follower counts.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {CURATED_TAGS.map((t) => {
              const on = activeStudent.interests.includes(t)
              return (
                <button key={t} type="button" aria-pressed={on} onClick={() => update((s) => toggleInterest(s, activeStudent.id, t))}
                  className={`min-h-9 rounded-full border px-3 text-sm ${on ? 'border-brand bg-brand-soft font-semibold text-brand' : 'border-border text-muted-foreground'}`}>
                  #{t}
                </button>
              )
            })}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button disabled={hiddenCount === 0} onClick={() => update((s) => resetRecommendations(s, activeStudent.id))}>
              <RotateCcw aria-hidden className="size-4" /> Reset hidden posts
            </Button>
            <span className="text-sm text-muted-foreground">{hiddenCount} hidden or marked not interested</span>
          </div>
        </Card>
      )}

      <PostComposer />
      <Tabs tabs={MODES} value={mode} onChange={setMode} label="Feed mode" />
      {posts.length === 0 ? (
        <EmptyState {...EMPTY[mode]} action={mode === 'following' ? <Link to="/community" className="text-sm font-semibold text-brand hover:underline">Browse communities</Link> : undefined} />
      ) : (
        <div key={mode} className="motion-stagger space-y-4">{posts.map((p) => <PostCard key={p.id} post={p} />)}</div>
      )}
      </div>
      <div className="lg:pt-[4.5rem]"><DiscoveryRail /></div>
    </div>
  )
}
