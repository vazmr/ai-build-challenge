import { Bookmark, BookmarkCheck, EyeOff, Share2, FileText, MessageCircle, ThumbsDown, UserCheck, UserPlus } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PostMedia } from './PostMedia'
import { CommentThread } from './CommentThread'
import { ActionMenu, ActionMenuItem, Avatar, Badge, Button, Card, Tags } from '../../components/shared/ui'
import { useAppState } from '../../hooks/useAppState'
import { useDirectory } from '../../hooks/useDirectory'
import { hidePost, visibleComments } from '../../services/feedService'
import { isFollowing, isSaved, toggleFollow, toggleSaved } from '../../services/socialService'
import type { Post } from '../../types'
import { timeAgo } from '../../utils/format'

const TYPE_LABEL: Record<Post['type'], string> = {
  text: 'Post', photo: 'Photo', album: 'Album', video: 'Video', audio: 'Audio', link: 'Link', quote: 'Quote',
  discussion: 'Discussion', event: 'Event', organization: 'Organization', project: 'Project opportunity', resource: 'Resource',
}

function Related({ post }: { post: Post }) {
  if (!post.relatedId) return null
  const to = post.type === 'event' ? `/events/${post.relatedId}` : post.type === 'project' ? `/projects/${post.relatedId}`
    : post.type === 'organization' ? `/organizations/${post.relatedId}` : null
  if (!to) return null
  const label = post.type === 'event' ? 'View event' : post.type === 'project' ? 'View project' : 'View organization'
  return <Link to={to} className="mt-3 inline-flex min-h-10 items-center rounded-lg border border-border px-3 text-sm font-semibold text-brand hover:bg-brand-soft">{label}</Link>
}

export function PostCard({ post }: { post: Post }) {
  const { state, activeStudent, update } = useAppState()
  const { studentName, orgName } = useDirectory()
  const [showComments, setShowComments] = useState(false)
  const [copied, setCopied] = useState(false)

  const me = activeStudent.id
  const own = post.authorId === me
  const orgId = post.organizationId
  const followTarget = orgId ? ({ type: 'organization', id: orgId } as const) : ({ type: 'student', id: post.authorId } as const)
  const following = isFollowing(state, me, followTarget.type, followTarget.id)
  const saved = isSaved(state, me, 'post', post.id)
  const comments = visibleComments(state, me, post.id)
  const author = studentName(post.authorId)
  const displayName = orgName(orgId) ?? author

  return (
    <Card className="p-4" id={post.id}>
      <div className="flex items-start gap-3">
        <Avatar name={displayName} />
        <div className="min-w-0 flex-1">
          <p className="text-sm">
            <Link to={orgId ? `/organizations/${orgId}` : `/profile/${post.authorId}`} className="inline-block py-1 font-semibold hover:underline">{displayName}</Link>
            {orgId && <span className="text-muted-foreground"> · posted by {author}</span>}
          </p>
          <p className="text-xs text-muted-foreground">{timeAgo(post.createdAt)}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <Badge tone={post.type === 'event' || post.type === 'project' ? 'brand' : 'neutral'}>{TYPE_LABEL[post.type]}</Badge>
          {!own && (
            <Button variant="secondary" className="!min-h-11 !px-2.5" aria-pressed={following} aria-label={`${following ? 'Following' : 'Follow'} ${displayName}`} onClick={() => update((s) => toggleFollow(s, me, followTarget.type, followTarget.id))}>
              {following ? <UserCheck aria-hidden className="motion-bump size-4 text-brand" /> : <UserPlus aria-hidden className="size-4" />} {following ? 'Following' : 'Follow'}
            </Button>
          )}
        </div>
      </div>

      {post.title && <h2 className="mt-3 text-base font-semibold">{post.title}</h2>}
      {post.body && (
        <p className={`mt-1 whitespace-pre-line text-sm ${post.type === 'quote' ? 'border-l-4 border-brand pl-3 italic' : ''}`}>{post.body}</p>
      )}
      <PostMedia post={post} />
      {post.linkUrl && (
        <a href={post.linkUrl} target="_blank" rel="noreferrer noopener" className="mt-3 flex items-center gap-2 rounded-lg border border-border p-3 text-sm text-info hover:bg-surface-muted">
          <FileText aria-hidden className="size-4" /> <span className="truncate">{post.linkUrl}</span>
        </a>
      )}
      <Related post={post} />
      <div className="mt-3"><Tags tags={post.tags} /></div>

      <div className="mt-3 flex flex-wrap gap-1.5 border-t border-border pt-3">
        <Button variant="ghost" aria-pressed={saved} onClick={() => update((s) => toggleSaved(s, me, 'post', post.id))}>
          {saved ? <BookmarkCheck aria-hidden className="motion-bump size-4 text-brand" /> : <Bookmark aria-hidden className="size-4" />} {saved ? 'Saved' : 'Save'}
        </Button>
        <Button variant="ghost" aria-expanded={showComments} onClick={() => setShowComments((v) => !v)}>
          <MessageCircle aria-hidden className="size-4" /> Comment{comments.length ? ` (${comments.length})` : ''}
        </Button>
        <span role="status" className="ml-auto self-center text-xs text-muted-foreground">{copied ? 'Link copied' : ''}</span>
        <ActionMenu label="More actions for this post">
          <ActionMenuItem onClick={() => { void navigator.clipboard?.writeText(`${window.location.origin}/feed#${post.id}`); setCopied(true); setTimeout(() => setCopied(false), 2000) }}>
            <Share2 aria-hidden className="size-4" /> Share link
          </ActionMenuItem>
          {!own && (
            <>
              <ActionMenuItem onClick={() => update((s) => hidePost(s, me, post.id, 'hidden'))}><EyeOff aria-hidden className="size-4" /> Hide this post</ActionMenuItem>
              <ActionMenuItem onClick={() => update((s) => hidePost(s, me, post.id, 'not-interested'))}><ThumbsDown aria-hidden className="size-4" /> Not interested</ActionMenuItem>
            </>
          )}
        </ActionMenu>
      </div>

      {showComments && <div className="motion-fade"><CommentThread postId={post.id} /></div>}
    </Card>
  )
}
