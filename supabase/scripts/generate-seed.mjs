// Gera supabase/seed.sql a partir do seed real do app (src/data/**).
// Uso: veja supabase/README.md  ->  node supabase/scripts/generate-seed.mjs <seed.json> <seed.sql>
import { readFileSync, writeFileSync } from 'node:fs'

const [, , inPath, outPath] = process.argv
const { state: s, places, scripts, avatars } = JSON.parse(readFileSync(inPath, 'utf8'))

const q = (v) => (v === undefined || v === null ? 'null' : `'${String(v).replace(/'/g, "''")}'`)
const b = (v) => (v ? 'true' : 'false')
const arr = (a) => (a && a.length ? `array[${a.map(q).join(', ')}]::text[]` : `'{}'::text[]`)
const json = (o) => `${q(JSON.stringify(o))}::jsonb`
const ts = (v) => (v ? `${q(v)}::timestamptz` : 'null')

const out = []
const insert = (table, cols, rows, fn) => {
  if (!rows.length) return
  out.push(`-- ${table} (${rows.length})`)
  out.push(`insert into ${table} (${cols.join(', ')}) values`)
  out.push(rows.map((r) => `  (${fn(r).join(', ')})`).join(',\n') + ';\n')
}

const tables = [
  'assistant_scripts', 'campus_places', 'resources', 'conversation_participants', 'messages', 'conversations',
  'collection_items', 'collections', 'portfolio_items', 'project_files', 'project_milestones', 'project_tasks',
  'project_join_requests', 'project_memberships', 'projects', 'founding_checklist', 'founding_founders',
  'founding_workspaces', 'thread_replies', 'discussion_threads', 'community_memberships', 'communities',
  'event_participations', 'events', 'notifications', 'saved_items', 'blocks', 'hidden_posts', 'follows',
  'comments', 'posts', 'announcements', 'collaboration_activity', 'collaboration_files',
  'organization_collaborations', 'organization_interests', 'inquiry_replies', 'organization_inquiries',
  'organization_invitations', 'organization_applications', 'organization_memberships', 'organizations',
  'demo_accounts', 'students',
]
out.push('-- Dados de demonstração do Temple Student Hub (TODO o conteúdo é fictício).')
out.push('-- Gerado por supabase/scripts/generate-seed.mjs a partir de src/data/seed. Idempotente: limpa e recarrega.\n')
out.push(`truncate table ${tables.join(', ')} restart identity cascade;\n`)

insert('students', ['id', 'display_name', 'major', 'college', 'class_year', 'bio', 'avatar_url', 'cover_url', 'interests', 'skills', 'theme', 'section_order', 'privacy', 'created_at', 'updated_at'], s.students,
  (r) => [q(r.id), q(r.displayName), q(r.major), q(r.college), q(r.classYear), q(r.bio), q(avatars[r.displayName]), q(r.coverUrl), arr(r.interests), arr(r.skills),
    r.theme ?? 'null', r.sectionOrder ? arr(r.sectionOrder) : 'null', json(r.privacy), ts(r.createdAt), ts(r.updatedAt)])
insert('demo_accounts', ['id', 'profile_id', 'display_name', 'is_default'], s.accounts, (r) => [q(r.id), q(r.profileId), q(r.displayName), b(r.id === s.activeAccountId)])
insert('organizations', ['id', 'name', 'description', 'tags', 'verification_status', 'created_at', 'updated_at'], s.organizations,
  (r) => [q(r.id), q(r.name), q(r.description), arr(r.tags), q(r.verificationStatus), ts(r.createdAt), ts(r.updatedAt)])
insert('organization_memberships', ['id', 'organization_id', 'student_id', 'role', 'status', 'permissions', 'joined_at'], s.memberships,
  (r) => [q(r.id), q(r.organizationId), q(r.studentId), q(r.role), q(r.status), arr(r.permissions), ts(r.joinedAt)])
insert('organization_applications', ['id', 'organization_id', 'student_id', 'message', 'status', 'created_at'], s.orgApplications,
  (r) => [q(r.id), q(r.organizationId), q(r.studentId), q(r.message), q(r.status), ts(r.createdAt)])
insert('organization_invitations', ['id', 'organization_id', 'student_id', 'invited_by_id', 'status', 'created_at'], s.orgInvitations,
  (r) => [q(r.id), q(r.organizationId), q(r.studentId), q(r.invitedById), q(r.status), ts(r.createdAt)])
insert('organization_inquiries', ['id', 'organization_id', 'student_id', 'subject', 'body', 'status', 'assigned_to_id', 'created_at'], s.inquiries,
  (r) => [q(r.id), q(r.organizationId), q(r.studentId), q(r.subject), q(r.body), q(r.status), q(r.assignedToId), ts(r.createdAt)])
insert('inquiry_replies', ['id', 'inquiry_id', 'author_id', 'body', 'created_at'], s.inquiries.flatMap((i) => i.replies.map((r) => ({ ...r, inquiryId: i.id }))),
  (r) => [q(r.id), q(r.inquiryId), q(r.authorId), q(r.body), ts(r.createdAt)])
insert('organization_interests', ['id', 'student_id', 'organization_id'], s.orgInterests, (r) => [q(r.id), q(r.studentId), q(r.organizationId)])
insert('organization_collaborations', ['id', 'org_a_id', 'org_b_id', 'status', 'project_title', 'created_at'], s.orgCollaborations,
  (r) => [q(r.id), q(r.organizationIds[0]), q(r.organizationIds[1]), q(r.status), q(r.projectTitle), ts(r.createdAt)])
insert('collaboration_files', ['id', 'collaboration_id', 'name', 'shared_by_org_id', 'permission'], s.orgCollaborations.flatMap((c) => c.files.map((f) => ({ ...f, cid: c.id }))),
  (r) => [q(r.id), q(r.cid), q(r.name), q(r.sharedByOrgId), q(r.permission)])
insert('collaboration_activity', ['id', 'collaboration_id', 'organization_id', 'text', 'at'], s.orgCollaborations.flatMap((c) => c.activity.map((a) => ({ ...a, cid: c.id }))),
  (r) => [q(r.id), q(r.cid), q(r.organizationId), q(r.text), ts(r.at)])
insert('announcements', ['id', 'organization_id', 'author_id', 'title', 'body', 'pinned', 'created_at'], s.announcements,
  (r) => [q(r.id), q(r.organizationId), q(r.authorId), q(r.title), q(r.body), b(r.pinned), ts(r.createdAt)])
insert('posts', ['id', 'author_id', 'organization_id', 'type', 'title', 'body', 'media_label', 'media_urls', 'audio_url', 'link_url', 'is_draft', 'pinned', 'related_id', 'tags', 'visibility', 'created_at', 'updated_at'], s.posts,
  (r) => [q(r.id), q(r.authorId), q(r.organizationId), q(r.type), q(r.title), q(r.body), q(r.mediaLabel), arr(r.mediaUrls), q(r.audioUrl), q(r.linkUrl), b(r.isDraft), b(r.pinned), q(r.relatedId), arr(r.tags), q(r.visibility), ts(r.createdAt), ts(r.updatedAt)])
insert('comments', ['id', 'post_id', 'author_id', 'body', 'created_at'], s.comments, (r) => [q(r.id), q(r.postId), q(r.authorId), q(r.body), ts(r.createdAt)])
insert('follows', ['id', 'follower_id', 'target_type', 'target_id', 'created_at'], s.follows, (r) => [q(r.id), q(r.followerId), q(r.targetType), q(r.targetId), ts(r.createdAt)])
insert('hidden_posts', ['id', 'student_id', 'post_id', 'reason'], s.hiddenPosts, (r) => [q(r.id), q(r.studentId), q(r.postId), q(r.reason)])
insert('blocks', ['id', 'student_id', 'blocked_id'], s.blocks, (r) => [q(r.id), q(r.studentId), q(r.blockedId)])
insert('saved_items', ['id', 'student_id', 'item_type', 'item_id', 'created_at'], s.savedItems, (r) => [q(r.id), q(r.studentId), q(r.itemType), q(r.itemId), ts(r.createdAt)])
insert('notifications', ['id', 'student_id', 'title', 'body', 'link', 'read', 'created_at'], s.notifications,
  (r) => [q(r.id), q(r.studentId), q(r.title), q(r.body), q(r.link), b(r.read), ts(r.createdAt)])
insert('events', ['id', 'title', 'description', 'host_organization_id', 'category', 'start_at', 'end_at', 'location_name', 'price_label', 'cover_url', 'campus', 'status'], s.events,
  (r) => [q(r.id), q(r.title), q(r.description), q(r.hostOrganizationId), q(r.category), ts(r.startAt), ts(r.endAt), q(r.locationName), q(r.priceLabel), q(r.coverUrl), q(r.campus), q(r.status)])
insert('event_participations', ['id', 'event_id', 'student_id', 'state', 'updated_at'], s.eventParticipations,
  (r) => [q(r.id), q(r.eventId), q(r.studentId), q(r.state), ts(r.updatedAt)])
insert('communities', ['id', 'name', 'description', 'category', 'tags', 'created_by_student_id', 'visibility', 'is_official_organization'], s.communities,
  (r) => [q(r.id), q(r.name), q(r.description), q(r.category), arr(r.tags), q(r.createdByStudentId), q(r.visibility), 'false'])
insert('community_memberships', ['id', 'community_id', 'student_id', 'role', 'status'], s.communityMemberships, (r) => [q(r.id), q(r.communityId), q(r.studentId), q(r.role), q(r.status)])
insert('discussion_threads', ['id', 'community_id', 'author_id', 'kind', 'title', 'body', 'link_url', 'created_at'], s.threads,
  (r) => [q(r.id), q(r.communityId), q(r.authorId), q(r.kind), q(r.title), q(r.body), q(r.linkUrl), ts(r.createdAt)])
insert('thread_replies', ['id', 'thread_id', 'author_id', 'body', 'created_at'], s.threadReplies, (r) => [q(r.id), q(r.threadId), q(r.authorId), q(r.body), ts(r.createdAt)])
insert('founding_workspaces', ['id', 'community_id', 'owner_id', 'notes', 'stage', 'created_at'], s.foundingWorkspaces,
  (r) => [q(r.id), q(r.communityId), q(r.ownerId), q(r.notes), q(r.stage), ts(r.createdAt)])
insert('founding_founders', ['workspace_id', 'student_id', 'status'], s.foundingWorkspaces.flatMap((w) => w.founders.map((f) => ({ ...f, wid: w.id }))), (r) => [q(r.wid), q(r.studentId), q(r.status)])
insert('founding_checklist', ['id', 'workspace_id', 'label', 'done', 'position'], s.foundingWorkspaces.flatMap((w) => w.checklist.map((c, i) => ({ ...c, wid: w.id, i }))),
  (r) => [q(r.id), q(r.wid), q(r.label), b(r.done), r.i])
insert('projects', ['id', 'owner_id', 'kind', 'title', 'description', 'category', 'skills_needed', 'status', 'is_published', 'deadline', 'pitch', 'cover_url', 'roles', 'perks', 'commitment', 'created_at', 'updated_at'], s.projects,
  (r) => [q(r.id), q(r.ownerId), q(r.kind), q(r.title), q(r.description), q(r.category), arr(r.skillsNeeded), q(r.status), b(r.isPublished), r.deadline ? `${q(r.deadline)}::date` : 'null', q(r.pitch), q(r.coverUrl), json(r.roles ?? []), arr(r.perks), q(r.commitment), ts(r.createdAt), ts(r.updatedAt)])
insert('project_memberships', ['id', 'project_id', 'student_id', 'role', 'status', 'contribution_summary'], s.projectMemberships,
  (r) => [q(r.id), q(r.projectId), q(r.studentId), q(r.role), q(r.status), q(r.contributionSummary)])
insert('project_join_requests', ['id', 'project_id', 'student_id', 'message', 'status', 'created_at'], s.projectJoinRequests,
  (r) => [q(r.id), q(r.projectId), q(r.studentId), q(r.message), q(r.status), ts(r.createdAt)])
insert('project_tasks', ['id', 'project_id', 'title', 'description', 'assignee_id', 'status', 'due_at'], s.tasks,
  (r) => [q(r.id), q(r.projectId), q(r.title), q(r.description), q(r.assigneeId), q(r.status), r.dueAt ? `${q(r.dueAt.slice(0, 10))}::date` : 'null'])
insert('project_milestones', ['id', 'project_id', 'title', 'due_at', 'done'], s.milestones,
  (r) => [q(r.id), q(r.projectId), q(r.title), r.dueAt ? `${q(r.dueAt.slice(0, 10))}::date` : 'null', b(r.done)])
insert('project_files', ['id', 'project_id', 'name', 'added_by_id', 'created_at'], s.projectFiles, (r) => [q(r.id), q(r.projectId), q(r.name), q(r.addedById), ts(r.createdAt)])
insert('collections', ['id', 'owner_id', 'title', 'description', 'visibility'], s.collections, (r) => [q(r.id), q(r.ownerId), q(r.title), q(r.description), q(r.visibility)])
insert('collection_items', ['collection_id', 'post_id', 'position'], s.collections.flatMap((c) => c.itemIds.map((p, i) => ({ cid: c.id, p, i }))), (r) => [q(r.cid), q(r.p), r.i])
insert('portfolio_items', ['id', 'owner_id', 'title', 'description', 'category', 'credits', 'skills', 'link_url', 'visibility'], s.portfolioItems,
  (r) => [q(r.id), q(r.ownerId), q(r.title), q(r.description), q(r.category), arr(r.credits), arr(r.skills), q(r.linkUrl), q(r.visibility)])
insert('conversations', ['id', 'type', 'organization_id', 'project_id', 'title'], s.conversations, (r) => [q(r.id), q(r.type), q(r.organizationId), q(r.projectId), q(r.title)])
insert('conversation_participants', ['conversation_id', 'student_id'], s.conversations.flatMap((c) => c.participantIds.map((p) => ({ cid: c.id, p }))), (r) => [q(r.cid), q(r.p)])
insert('messages', ['id', 'conversation_id', 'sender_id', 'body', 'created_at'], s.messages, (r) => [q(r.id), q(r.conversationId), q(r.senderId), q(r.body), ts(r.createdAt)])
insert('resources', ['id', 'title', 'description', 'category', 'official_url', 'contact', 'location_name', 'eligibility', 'cost', 'source_type', 'last_verified_at'], s.resources,
  (r) => [q(r.id), q(r.title), q(r.description), q(r.category), q(r.officialUrl), q(r.contact), q(r.locationName), q(r.eligibility), q(r.cost), q(r.sourceType), ts(r.lastVerifiedAt)])
insert('campus_places', ['id', 'name', 'lat', 'lng', 'layers', 'note', 'featured'], places, (r) => [q(r.id), q(r.name), r.lat, r.lng, arr(r.layers), q(r.note), b(r.featured)])
insert('assistant_scripts', ['id', 'keywords', 'response', 'source_resource_ids', 'is_fallback'], scripts,
  (r) => [q(r.id), arr(r.keywords), q(r.response), arr(r.sourceResourceIds), b(r.id === 'as-fallback')])

writeFileSync(outPath, out.join('\n'))
console.log('seed.sql escrito em', outPath)
