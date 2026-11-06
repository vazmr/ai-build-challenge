import { Info, Send } from 'lucide-react'
import { useState } from 'react'
import { Badge, Button, Card, PageHeader } from '../../components/shared/ui'
import { FALLBACK, SCRIPTS, type AssistantScript } from '../../data/assistantScripts'
import { useAppState } from '../../hooks/useAppState'

interface Turn { id: number; prompt: string; script: AssistantScript }

const SUGGESTIONS = ['I need help with classes', 'How do I find an internship?', 'I feel overwhelmed', 'Where can I get tech help?']

function answer(prompt: string): AssistantScript {
  const p = prompt.toLowerCase()
  return SCRIPTS.find((s) => s.keywords.some((k) => p.includes(k))) ?? FALLBACK
}

/** Scripted, simulated assistant: no live model. Shows the sources behind every answer. */
export function AssistantPage() {
  const { state } = useAppState()
  const [turns, setTurns] = useState<Turn[]>([])
  const [draft, setDraft] = useState('')
  const ask = (prompt: string) => {
    if (!prompt.trim()) return
    setTurns((t) => [...t, { id: t.length, prompt: prompt.trim(), script: answer(prompt) }])
    setDraft('')
  }
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="AI Campus Assistant" description="Search-first help finding resources." />
      <p className="mb-4 flex items-start gap-2 rounded-lg bg-brand-soft p-3 text-sm"><Info aria-hidden className="mt-0.5 size-4 shrink-0" /> This is a scripted demo, not a live AI. It never invents policies, hours, eligibility or contacts, and it can’t see private messages, memberships or files. It can’t take actions on your account.</p>

      <div className="mb-4 flex flex-wrap gap-2">{SUGGESTIONS.map((s) => <button key={s} type="button" onClick={() => ask(s)} className="min-h-9 rounded-full border border-border bg-surface px-3 text-sm hover:bg-surface-muted">{s}</button>)}</div>

      <ul className="mb-4 space-y-4" aria-live="polite">
        {turns.map((t) => (
          <li key={t.id} className="space-y-2">
            <p className="ml-auto w-fit max-w-[85%] rounded-2xl bg-brand px-3 py-2 text-sm text-brand-foreground">{t.prompt}</p>
            <Card>
              <Badge tone="warning">Simulated answer</Badge>
              <p className="mt-2 text-sm">{t.script.response}</p>
              <div className="mt-3 border-t border-border pt-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Sources and trust</p>
                {t.script.sourceResourceIds.length === 0 ? <p className="mt-1 text-sm text-muted-foreground">No sources: nothing verified to cite.</p> : (
                  <ul className="mt-1 space-y-1 text-sm">{t.script.sourceResourceIds.map((id) => {
                    const r = state.resources.find((x) => x.id === id)
                    return r && <li key={id}>{r.title} <Badge tone={r.sourceType === 'student-submitted' ? 'info' : 'warning'}>{r.sourceType === 'student-submitted' ? 'Student-submitted, not official' : 'Demo entry, not verified'}</Badge> <span className="text-xs text-muted-foreground">{r.lastVerifiedAt ? `Last verified ${r.lastVerifiedAt}` : 'Never verified'}</span></li>
                  })}</ul>
                )}
              </div>
            </Card>
          </li>
        ))}
      </ul>

      <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); ask(draft) }}>
        <input aria-label="Ask the assistant" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Ask about resources…" className="min-h-11 flex-1 rounded-lg border border-border px-3 text-sm" />
        <Button type="submit" variant="primary" disabled={!draft.trim()}><Send aria-hidden className="size-4" /> Ask</Button>
      </form>
    </div>
  )
}
