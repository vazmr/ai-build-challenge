// Domain types. Conceptual source: DATA_MODELS.md. Only models needed so far are
// fleshed out; the rest preserve relationships for later milestones.

export type Visibility = 'public' | 'temple-only' | 'private'

export interface StudentProfile {
  id: string
  displayName: string
  major?: string
  college?: string
  classYear?: string
  bio?: string
  interests: string[]
  skills: string[]
  /** Profile customization: index into the shared palette list (cover + accent). */
  theme?: number
  /** Custom order of profile tabs after Overview. */
  sectionOrder?: string[]
  privacy: Record<string, Visibility>
  createdAt: string
  updatedAt: string
}

/** Demo persona only — never a credential. */
export interface DemoAccount {
  id: string
  profileId: string
  displayName: string
}

export type OrganizationRole =
  | 'president' | 'vice-president' | 'treasurer' | 'secretary'
  | 'board-member' | 'moderator' | 'member'
export type MembershipStatus = 'pending' | 'active' | 'declined' | 'inactive'

/** Explicit, organization-scoped permissions. Never inferred from role labels. */
export type OrganizationPermission =
  | 'org.view-members'
  | 'org.review-applications'
  | 'org.manage-members'
  | 'org.access-board'
  | 'org.manage-invitations'
  | 'org.read-inquiries'
  | 'org.post-announcements'
  | 'org.manage-events'

export interface Organization {
  id: string
  name: string
  description: string
  tags: string[]
  verificationStatus: 'demo' | 'unverified' | 'verified'
  createdAt: string
  updatedAt: string
}

export interface OrganizationMembership {
  id: string
  organizationId: string
  studentId: string
  role: OrganizationRole
  status: MembershipStatus
  permissions: OrganizationPermission[]
  joinedAt?: string
}

export type PostType =
  | 'text' | 'photo' | 'album' | 'video' | 'audio' | 'link' | 'quote'
  | 'discussion' | 'event' | 'organization' | 'project' | 'resource'

export interface Post {
  id: string
  authorId: string
  organizationId?: string
  type: PostType
  title?: string
  body?: string
  /** Label for photo/video/audio placeholders (no real media in the prototype). */
  mediaLabel?: string
  linkUrl?: string
  isDraft?: boolean
  pinned?: boolean
  /** Related event/project id for event/project post types. */
  relatedId?: string
  tags: string[]
  visibility: Visibility
  createdAt: string
  updatedAt: string
}

export interface Follow {
  id: string
  followerId: string
  targetType: 'student' | 'organization' | 'topic' | 'community'
  targetId: string
  createdAt: string
}

export interface CampusEvent {
  id: string
  title: string
  description: string
  hostOrganizationId?: string
  category: string
  startAt: string
  endAt: string
  locationName: string
  priceLabel: string
  campus?: 'Main Campus' | 'Center City' | 'Online'
  status: 'draft' | 'published' | 'cancelled'
  isDemoContent: boolean
}

export interface EventParticipation {
  id: string
  eventId: string
  studentId: string
  state: 'saved' | 'going' | 'attended'
  updatedAt: string
}

export interface Comment {
  id: string
  postId: string
  authorId: string
  body: string
  createdAt: string
}

export interface PostHide {
  id: string
  studentId: string
  postId: string
  reason: 'hidden' | 'not-interested'
}

export interface CommunityMembership {
  id: string
  communityId: string
  studentId: string
  role: 'participant' | 'moderator' | 'founder'
  status: 'active' | 'invited' | 'pending'
}

export type ThreadKind = 'discussion' | 'question' | 'announcement' | 'collab-request' | 'resource'

export interface DiscussionThread {
  id: string
  communityId: string
  authorId: string
  kind?: ThreadKind
  title: string
  body: string
  linkUrl?: string
  createdAt: string
}

export interface ThreadReply {
  id: string
  threadId: string
  authorId: string
  body: string
  createdAt: string
}

export interface Community {
  id: string
  name: string
  description: string
  category: string
  tags: string[]
  createdByStudentId: string
  visibility: 'open' | 'private'
  isOfficialOrganization: false
}

export type ProjectStatus = 'private' | 'recruiting' | 'active' | 'completed' | 'archived'

export type ProjectKind = 'collaborators' | 'need-help' | 'offer-help'

export interface Project {
  id: string
  ownerId: string
  kind: ProjectKind
  title: string
  description: string
  category: string
  skillsNeeded: string[]
  status: ProjectStatus
  isPublished: boolean
  deadline?: string
  createdAt: string
  updatedAt: string
}

export interface ProjectMembership {
  id: string
  projectId: string
  studentId: string
  role: string
  status: 'invited' | 'active' | 'removed'
  contributionSummary?: string
}

export interface ProjectJoinRequest {
  id: string
  projectId: string
  studentId: string
  message?: string
  status: 'pending' | 'accepted' | 'declined' | 'withdrawn'
  createdAt: string
}

export interface ProjectTask {
  id: string
  projectId: string
  title: string
  description?: string
  assigneeId?: string
  status: 'todo' | 'in-progress' | 'done'
  dueAt?: string
}

export interface ProjectMilestone { id: string; projectId: string; title: string; dueAt?: string; done: boolean }
export interface ProjectFile { id: string; projectId: string; name: string; addedById: string; createdAt: string }
export interface Block { id: string; studentId: string; blockedId: string }

export interface Collection {
  id: string
  ownerId: string
  title: string
  description?: string
  visibility: Visibility
  itemIds: string[]
}

export interface PortfolioItem {
  id: string
  ownerId: string
  title: string
  description?: string
  category: string
  credits?: string[]
  skills?: string[]
  linkUrl?: string
  visibility: Visibility
}

export interface SavedItem {
  id: string
  studentId: string
  itemType: 'post' | 'event' | 'project' | 'resource' | 'collection'
  itemId: string
  createdAt: string
}

export interface Conversation {
  id: string
  type: 'direct' | 'organization-board' | 'organization-members'
    | 'organization-inquiries' | 'project' | 'custom'
  organizationId?: string
  projectId?: string
  participantIds: string[]
  title?: string
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  body: string
  createdAt: string
}

export interface Resource {
  id: string
  title: string
  description: string
  category: 'academic' | 'career' | 'wellness' | 'financial' | 'campus-life'
  officialUrl?: string
  contact?: string
  locationName?: string
  eligibility?: string
  cost?: string
  sourceType: 'official' | 'student-submitted' | 'demo'
  lastVerifiedAt?: string
}

export interface OrganizationApplication {
  id: string
  organizationId: string
  studentId: string
  message?: string
  status: 'pending' | 'approved' | 'declined'
  createdAt: string
}

export interface OrganizationInvitation {
  id: string
  organizationId: string
  studentId: string
  invitedById: string
  status: 'pending' | 'accepted' | 'declined' | 'revoked'
  createdAt: string
}

export interface InquiryReply { id: string; authorId: string; body: string; createdAt: string }

export interface OrganizationInquiry {
  id: string
  organizationId: string
  studentId: string
  subject: string
  body: string
  status: 'new' | 'assigned' | 'replied' | 'closed'
  assignedToId?: string
  replies: InquiryReply[]
  createdAt: string
}

export interface Announcement {
  id: string
  /** Undefined = campus-wide demo announcement. */
  organizationId?: string
  authorId?: string
  title: string
  body: string
  pinned: boolean
  createdAt: string
}

export interface AppNotification {
  id: string
  studentId: string
  title: string
  body: string
  link?: string
  read: boolean
  createdAt: string
}

export interface OrgInterest { id: string; studentId: string; organizationId: string }

export interface OrgCollaboration {
  id: string
  /** [inviting organization, invited organization] */
  organizationIds: [string, string]
  status: 'pending' | 'active' | 'declined' | 'revoked'
  projectTitle: string
  files: { id: string; name: string; sharedByOrgId: string; permission: 'view' | 'edit' }[]
  activity: { id: string; organizationId: string; text: string; at: string }[]
  createdAt: string
}

export interface FoundingWorkspace {
  id: string
  communityId: string
  ownerId: string
  founders: { studentId: string; status: 'invited' | 'accepted' | 'declined' }[]
  notes: string
  checklist: { id: string; label: string; done: boolean }[]
  stage: 'founding' | 'recognition-prep'
  createdAt: string
}

/** Persisted envelope (DATA_MODELS.md §11). */
export interface PersistedAppState {
  schemaVersion: number
  activeAccountId: string
  accounts: DemoAccount[]
  students: StudentProfile[]
  organizations: Organization[]
  memberships: OrganizationMembership[]
  posts: Post[]
  follows: Follow[]
  comments: Comment[]
  hiddenPosts: PostHide[]
  events: CampusEvent[]
  eventParticipations: EventParticipation[]
  communities: Community[]
  communityMemberships: CommunityMembership[]
  threads: DiscussionThread[]
  threadReplies: ThreadReply[]
  projects: Project[]
  projectMemberships: ProjectMembership[]
  projectJoinRequests: ProjectJoinRequest[]
  tasks: ProjectTask[]
  collections: Collection[]
  portfolioItems: PortfolioItem[]
  savedItems: SavedItem[]
  conversations: Conversation[]
  messages: Message[]
  resources: Resource[]
  orgApplications: OrganizationApplication[]
  orgInvitations: OrganizationInvitation[]
  inquiries: OrganizationInquiry[]
  announcements: Announcement[]
  notifications: AppNotification[]
  orgInterests: OrgInterest[]
  orgCollaborations: OrgCollaboration[]
  foundingWorkspaces: FoundingWorkspace[]
  milestones: ProjectMilestone[]
  projectFiles: ProjectFile[]
  blocks: Block[]
}
