import { PenLine } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, Field, Input, Select, Textarea } from '../../components/shared/ui'
import { CURATED_TAGS } from '../../data/seed'
import { useAppState } from '../../hooks/useAppState'
import { createPost } from '../../services/feedService'
import type { Post, Visibility } from '../../types'
import { parseList } from '../../utils/parseList'

const TYPES: { id: Post['type']; label: string }[] = [
  { id: 'text', label: 'Status or update' }, { id: 'discussion', label: 'Discussion prompt' },
  { id: 'link', label: 'Link' }, { id: 'quote', label: 'Quote' },
]
const blank = { type: 'text' as Post['type'], title: '', body: '', linkUrl: '', tags: '', visibility: 'public' as Visibility }

export function PostComposer() {
  const { activeStudent, update } = useAppState()
  const [open, setOpen] = useState(false)
  const [done, setDone] = useState(false)
  const [form, setForm] = useState(blank)
  const needsLink = form.type === 'link' || form.type === 'quote'
  const addTag = (t: string) => setForm((f) => ({ ...f, tags: [...new Set([...parseList(f.tags), t])].join(', ') }))

  if (!open) {
    return (
      <div className="mb-4">
        <Button className="w-full justify-start !font-normal text-muted-foreground" onClick={() => { setOpen(true); setDone(false) }}><PenLine aria-hidden className="size-4" /> Share something with campus…</Button>
        {done && <p role="status" className="mt-2 text-sm text-success">Posted. <Link to={`/profile/${activeStudent.id}`} className="font-semibold underline">See it on your profile</Link>. Your own posts don’t appear in your feed.</p>}
      </div>
    )
  }
  return (
    <Card className="mb-4">
      <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); update((s) => createPost(s, activeStudent.id, { ...form, tags: parseList(form.tags) })); setForm(blank); setOpen(false); setDone(true) }}>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Type"><Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as Post['type'] })}>{TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}</Select></Field>
          <Field label="Who can see it"><Select value={form.visibility} onChange={(e) => setForm({ ...form, visibility: e.target.value as Visibility })}><option value="public">Public</option><option value="temple-only">Temple-only (simulated)</option><option value="private">Only me</option></Select></Field>
        </div>
        <Field label="Title (optional)"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
        <Field label={form.type === 'quote' ? 'Quote' : 'Post'}><Textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} /></Field>
        {needsLink && <Field label={form.type === 'quote' ? 'Source link (optional)' : 'Link'}><Input type="url" placeholder="https://" value={form.linkUrl} onChange={(e) => setForm({ ...form, linkUrl: e.target.value })} /></Field>}
        <Field label="Tags" hint="Pick a suggestion or type your own, comma-separated">
          <Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
        </Field>
        <div className="flex flex-wrap gap-1.5">{CURATED_TAGS.map((t) => <button key={t} type="button" onClick={() => addTag(t)} className="min-h-8 rounded-full border border-border px-2.5 text-xs text-muted-foreground hover:bg-surface-muted">#{t}</button>)}</div>
        <div className="flex gap-2"><Button type="submit" variant="primary" disabled={!form.body.trim() && !form.title.trim()}>Post</Button><Button onClick={() => { setOpen(false); setForm(blank) }}>Cancel</Button></div>
      </form>
    </Card>
  )
}
