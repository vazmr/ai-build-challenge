import { Plus, Search } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge, Button, Card, EmptyState, Field, Input, PageHeader, Select, Tags, Textarea } from '../../components/shared/ui'
import { parseList } from '../../utils/parseList'
import { CoverArt } from '../../components/shared/CoverArt'
import { useAppState } from '../../hooks/useAppState'
import { createCommunity } from '../../services/communityService'

const CATEGORIES = [
  'Music & Music Production', 'Film & Media', 'Fashion & Style', 'Gaming', 'Entrepreneurship',
  'Temple Student Life', 'Photography & Visual Arts', 'Study Groups', 'Philadelphia Events & Culture',
]

export function CommunityPage() {
  const { state, activeStudent, update } = useAppState()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', category: CATEGORIES[0], tags: '' })

  const q = query.trim().toLowerCase()
  const list = state.communities.filter((c) =>
    (!category || c.category === category) &&
    (!q || `${c.name} ${c.description} ${c.tags.join(' ')}`.toLowerCase().includes(q)))

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    update((s) => createCommunity(s, activeStudent.id, form.name, form.description, form.category, parseList(form.tags)))
    setCreating(false)
    setForm({ name: '', description: '', category: CATEGORIES[0], tags: '' })
  }

  return (
    <div>
      <PageHeader title="Community" description="Informal student interest groups, not official Temple clubs."
        actions={<div className="flex gap-2"><Link to="/organizations" className="inline-flex min-h-10 items-center rounded-lg border border-border bg-surface px-3.5 text-sm font-semibold hover:bg-surface-muted">Browse organizations</Link><Button variant="primary" onClick={() => setCreating((c) => !c)} aria-expanded={creating}><Plus aria-hidden className="size-4" /> Start a group</Button></div>} />

      {creating && (
        <Card className="mb-5">
          <form onSubmit={submit} className="space-y-3">
            <Field label="Group name"><Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
            <Field label="Description"><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
            <Field label="Category"><Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</Select></Field>
            <Field label="Tags" hint="Comma-separated, e.g. music, tech"><Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} /></Field>
            <div className="flex gap-2"><Button type="submit" variant="primary" disabled={!form.name.trim()}>Create group</Button><Button onClick={() => setCreating(false)}>Cancel</Button></div>
            <p className="text-xs text-muted-foreground">Groups are informal. Starting one does not create an official Temple organization.</p>
          </form>
        </Card>
      )}

      <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_auto]">
        <div className="relative">
          <Search aria-hidden className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" />
          <Input aria-label="Search groups" placeholder="Search groups and tags" className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <Select aria-label="Category" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </Select>
      </div>

      {list.length === 0 ? <EmptyState title="No groups found" description="Try another search, or start your own group." /> : (
        <div className="grid gap-4 md:grid-cols-2">
          {list.map((c) => {
            const member = state.communityMemberships.some((m) => m.communityId === c.id && m.studentId === activeStudent.id && m.status === 'active')
            const following = state.follows.some((f) => f.followerId === activeStudent.id && f.targetType === 'community' && f.targetId === c.id)
            const threads = state.threads.filter((t) => t.communityId === c.id).length
            return (
              <Card key={c.id} className="!p-0 overflow-hidden">
                <CoverArt seed={c.id + c.category} className="h-10" />
                <div className="p-4">
                <div className="flex flex-wrap gap-1.5"><Badge>Informal group</Badge>{member && <Badge tone="success">Member</Badge>}{following && <Badge tone="info">Following</Badge>}</div>
                <h2 className="mt-2 font-semibold"><Link to={`/community/${c.id}`} className="hover:underline">{c.name}</Link></h2>
                <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
                <div className="mt-2"><Tags tags={c.tags} /></div>
                <p className="mt-2 text-xs text-muted-foreground">{threads} discussion{threads === 1 ? '' : 's'}</p>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
