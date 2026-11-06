import type { PersistedAppState } from '../../types'

type Row = Record<string, unknown>
type Obj = Record<string, unknown>

/** Lista de filhos (tabela auxiliar) ligada a uma linha pai. */
export interface ChildSpec {
  table: string
  parentCol: string
  /** Propriedade do objeto do app que guarda os filhos (ex.: `replies`). */
  field: string
  toRow: (item: unknown, index: number) => Row
  fromRow: (row: Row) => unknown
  orderBy?: string
}

export interface TableSpec {
  /** Chave em PersistedAppState. */
  key: keyof PersistedAppState
  table: string
  /** Propriedades do app que NÃO são colunas desta tabela. */
  omit?: string[]
  /** Valores usados quando a propriedade é undefined (nullables, arrays, booleans). */
  defaults?: Obj
  /** Propriedades opcionais que voltam como array vazio e devem virar undefined. */
  dropEmpty?: string[]
  toRow?: (o: Obj) => Row
  fromRow?: (r: Row) => Obj
  children?: ChildSpec[]
}

const camelToSnake = (k: string) => k.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`)
const snakeToCamel = (k: string) => k.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase())

export const toSnake = (o: Obj): Row => Object.fromEntries(Object.entries(o).map(([k, v]) => [camelToSnake(k), v]))

/** Timestamps do Postgres (+00:00) viram ISO com Z, igual ao que o app gera com toISOString(). */
const TZ_ISO = /^\d{4}-\d\d-\d\dT[\d:.]+(\+00:00|Z)$/
const normalize = (v: unknown): unknown =>
  typeof v === 'string' && TZ_ISO.test(v) ? new Date(v).toISOString() : v

export const toCamel = (r: Row): Obj =>
  Object.fromEntries(
    Object.entries(r)
      .filter(([, v]) => v !== null && v !== undefined)
      .map(([k, v]) => [snakeToCamel(k), normalize(v)]),
  )

const plain = (field: string, parentCol: string, table: string, orderBy?: string): ChildSpec => ({
  table, parentCol, field, orderBy,
  toRow: (item) => toSnake(item as Obj),
  fromRow: (r) => toCamel(r),
})

export const TABLES: TableSpec[] = [
  { key: 'students', table: 'students', defaults: { major: null, college: null, classYear: null, bio: null, coverUrl: null, theme: null, sectionOrder: null } },
  { key: 'accounts', table: 'demo_accounts' },
  { key: 'organizations', table: 'organizations' },
  { key: 'memberships', table: 'organization_memberships', defaults: { joinedAt: null } },
  { key: 'orgApplications', table: 'organization_applications', defaults: { message: null } },
  { key: 'orgInvitations', table: 'organization_invitations' },
  {
    key: 'inquiries', table: 'organization_inquiries', omit: ['replies'], defaults: { assignedToId: null },
    children: [{ ...plain('replies', 'inquiry_id', 'inquiry_replies', 'created_at') }],
  },
  { key: 'orgInterests', table: 'organization_interests' },
  {
    key: 'orgCollaborations', table: 'organization_collaborations', omit: ['organizationIds', 'files', 'activity'],
    toRow: (o) => {
      const ids = o.organizationIds as [string, string]
      return { org_a_id: ids[0], org_b_id: ids[1] }
    },
    fromRow: (r) => ({ organizationIds: [r.org_a_id as string, r.org_b_id as string] }),
    children: [plain('files', 'collaboration_id', 'collaboration_files'), plain('activity', 'collaboration_id', 'collaboration_activity', 'at')],
  },
  { key: 'announcements', table: 'announcements', defaults: { organizationId: null, authorId: null } },
  {
    key: 'posts', table: 'posts', dropEmpty: ['mediaUrls'],
    defaults: { organizationId: null, title: null, body: null, mediaLabel: null, mediaUrls: [], audioUrl: null, linkUrl: null, isDraft: false, pinned: false, relatedId: null },
  },
  { key: 'comments', table: 'comments' },
  { key: 'follows', table: 'follows' },
  { key: 'hiddenPosts', table: 'hidden_posts' },
  { key: 'blocks', table: 'blocks' },
  { key: 'savedItems', table: 'saved_items' },
  { key: 'notifications', table: 'notifications', defaults: { link: null } },
  { key: 'events', table: 'events', defaults: { hostOrganizationId: null, coverUrl: null, campus: null } },
  { key: 'eventParticipations', table: 'event_participations' },
  { key: 'communities', table: 'communities' },
  { key: 'communityMemberships', table: 'community_memberships' },
  { key: 'threads', table: 'discussion_threads', defaults: { kind: null, linkUrl: null } },
  { key: 'threadReplies', table: 'thread_replies' },
  {
    key: 'foundingWorkspaces', table: 'founding_workspaces', omit: ['founders', 'checklist'],
    children: [
      {
        table: 'founding_founders', parentCol: 'workspace_id', field: 'founders',
        toRow: (i) => toSnake(i as Obj), fromRow: (r) => toCamel(r),
      },
      {
        table: 'founding_checklist', parentCol: 'workspace_id', field: 'checklist', orderBy: 'position',
        toRow: (i, idx) => ({ ...toSnake(i as Obj), position: idx }),
        fromRow: (r) => { const { position: _p, ...rest } = toCamel(r); return rest },
      },
    ],
  },
  {
    key: 'projects', table: 'projects', dropEmpty: ['roles', 'perks'],
    defaults: { deadline: null, pitch: null, coverUrl: null, roles: [], perks: [], commitment: null },
  },
  { key: 'projectMemberships', table: 'project_memberships', defaults: { contributionSummary: null } },
  { key: 'projectJoinRequests', table: 'project_join_requests', defaults: { message: null } },
  { key: 'tasks', table: 'project_tasks', defaults: { description: null, assigneeId: null, dueAt: null } },
  { key: 'milestones', table: 'project_milestones', defaults: { dueAt: null } },
  { key: 'projectFiles', table: 'project_files' },
  {
    key: 'collections', table: 'collections', omit: ['itemIds'], defaults: { description: null },
    children: [{
      table: 'collection_items', parentCol: 'collection_id', field: 'itemIds', orderBy: 'position',
      toRow: (postId, i) => ({ post_id: postId, position: i }), fromRow: (r) => r.post_id,
    }],
  },
  { key: 'portfolioItems', table: 'portfolio_items', dropEmpty: ['credits', 'skills'], defaults: { description: null, credits: [], skills: [], linkUrl: null } },
  {
    key: 'conversations', table: 'conversations', omit: ['participantIds'], defaults: { organizationId: null, projectId: null, title: null },
    children: [{
      table: 'conversation_participants', parentCol: 'conversation_id', field: 'participantIds',
      toRow: (studentId) => ({ student_id: studentId }), fromRow: (r) => r.student_id,
    }],
  },
  { key: 'messages', table: 'messages' },
  { key: 'resources', table: 'resources', defaults: { officialUrl: null, contact: null, locationName: null, eligibility: null, cost: null, lastVerifiedAt: null } },
]

/** Objeto do app -> linha do banco (sem filhos). */
export function buildRow(spec: TableSpec, o: Obj): Row {
  const omit = new Set(spec.omit ?? [])
  const base = Object.fromEntries(Object.entries(o).filter(([k]) => !omit.has(k)))
  const withDefaults: Obj = { ...spec.defaults, ...Object.fromEntries(Object.entries(base).filter(([, v]) => v !== undefined)) }
  const row = spec.toRow ? { ...toSnake(withDefaults), ...spec.toRow(o) } : toSnake(withDefaults)
  return row
}

/** Linha do banco + filhos -> objeto do app. */
export function buildObj(spec: TableSpec, row: Row, children: Record<string, Row[]> = {}): Obj {
  let obj: Obj = toCamel(row)
  for (const k of spec.dropEmpty ?? []) if (Array.isArray(obj[k]) && (obj[k] as unknown[]).length === 0) delete obj[k]
  if (spec.fromRow) {
    for (const k of ['orgAId', 'orgBId']) delete obj[k]
    obj = { ...obj, ...spec.fromRow(row) }
  }
  for (const c of spec.children ?? []) {
    obj[c.field] = (children[c.table] ?? []).map((r) => {
      const { [c.parentCol]: _parent, ...rest } = r
      return c.fromRow(rest)
    })
  }
  return obj
}
