import { Bookmark, BookmarkCheck, MapPin, Search, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { OPEN_ASSISTANT_EVENT } from '../assistant/AssistantWidget'
import { Badge, Button, Card, EmptyState, Input, PageHeader } from '../../components/shared/ui'
import { useAppState } from '../../hooks/useAppState'
import { isSaved, toggleSaved } from '../../services/socialService'
import type { Resource } from '../../types'

type Cat = 'all' | Resource['category']
const CATS: { id: Cat; label: string }[] = [
  { id: 'all', label: 'All Resources' }, { id: 'academic', label: 'Academic' }, { id: 'career', label: 'Career' },
  { id: 'wellness', label: 'Wellness' }, { id: 'financial', label: 'Financial' }, { id: 'campus-life', label: 'Campus Life' },
]
const NEEDS: { label: string; cat: Cat }[] = [
  { label: 'Help with classes', cat: 'academic' }, { label: 'Finding a job or internship', cat: 'career' },
  { label: 'Feeling overwhelmed', cat: 'wellness' }, { label: 'Paying for school', cat: 'financial' }, { label: 'Meeting people', cat: 'campus-life' },
]
const SOURCE: Record<Resource['sourceType'], { label: string; tone: 'success' | 'info' | 'warning' }> = {
  official: { label: 'Official', tone: 'success' }, 'student-submitted': { label: 'Student-submitted', tone: 'info' }, unverified: { label: 'Not yet verified', tone: 'warning' },
}

export function ResourcesPage() {
  const { state, activeStudent, update } = useAppState()
  const [cat, setCat] = useState<Cat>('all')
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()
  const list = state.resources.filter((r) => (cat === 'all' || r.category === cat) && (!q || `${r.title} ${r.description}`.toLowerCase().includes(q)))

  return (
    <div>
      <PageHeader title="Resources" description="Find support, services and opportunities. Confirm details with official Temple sources."
        actions={<button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_ASSISTANT_EVENT))} className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-brand px-3.5 text-sm font-semibold text-brand-foreground hover:bg-brand-hover"><Sparkles aria-hidden className="size-4" /> Ask the assistant</button>} />
      <div className="relative mb-3 max-w-md">
        <Search aria-hidden className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" />
        <Input aria-label="Search resources" placeholder="Search services, support and opportunities" className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      <section aria-labelledby="need-h" className="mb-4">
        <h2 id="need-h" className="mb-2 text-sm font-semibold">I need help with…</h2>
        <div className="flex flex-wrap gap-2">{NEEDS.map((n) => <button key={n.label} type="button" onClick={() => setCat(n.cat)} className="min-h-9 rounded-full border border-border bg-surface px-3 text-sm hover:bg-surface-muted">{n.label}</button>)}</div>
      </section>
      <div role="tablist" aria-label="Resource categories" className="mb-5 flex gap-1 overflow-x-auto border-b border-border">
        {CATS.map((c) => <button key={c.id} type="button" role="tab" aria-selected={cat === c.id} onClick={() => setCat(c.id)} className={`min-h-11 shrink-0 border-b-2 px-3.5 text-sm font-medium ${cat === c.id ? 'border-brand text-brand' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>{c.label}</button>)}
      </div>
      {list.length === 0 ? <EmptyState title="No resources match" description="Try another category or ask the assistant." /> : (
        <div className="grid gap-4 md:grid-cols-2">{list.map((r) => {
          const saved = isSaved(state, activeStudent.id, 'resource', r.id)
          return (
            <Card key={r.id}>
              <div className="flex flex-wrap gap-1.5"><Badge tone={SOURCE[r.sourceType].tone}>{SOURCE[r.sourceType].label}</Badge><Badge>{r.category}</Badge></div>
              <h3 className="mt-2 font-semibold">{r.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{r.description}</p>
              {r.locationName && <p className="mt-2 flex items-center gap-1 text-sm"><MapPin aria-hidden className="size-3.5" /> {r.locationName} <Link to="/map" className="text-brand hover:underline">(see map)</Link></p>}
              <p className="mt-2 text-xs text-muted-foreground">{r.officialUrl ? 'Official link provided.' : 'Not yet verified: check official Temple sources for links, hours, contacts and eligibility.'}</p>
              <div className="mt-3"><Button aria-pressed={saved} onClick={() => update((s) => toggleSaved(s, activeStudent.id, 'resource', r.id))}>{saved ? <BookmarkCheck aria-hidden className="size-4 text-brand" /> : <Bookmark aria-hidden className="size-4" />} {saved ? 'Saved' : 'Save'}</Button></div>
            </Card>
          )
        })}</div>
      )}
    </div>
  )
}
