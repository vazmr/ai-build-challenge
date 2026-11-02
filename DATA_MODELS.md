# Data Models

These are conceptual TypeScript-oriented domain models. Copilot should implement only the models needed for the current milestone, but must preserve the relationships and permission semantics.

## 1. Shared conventions

- Use stable string IDs.
- Store timestamps as ISO strings.
- Use explicit enums or string unions for statuses.
- Prefer normalized records and IDs over deeply duplicated nested objects.
- Add `createdAt` and `updatedAt` to mutable domain records where useful.
- Do not store passwords, tokens or sensitive personal data.
- Seed data must be fictional.

## 2. Core identity and session

```ts
type DemoRole = "student" | "organization-member" | "organization-officer" | "organization-admin";

interface StudentProfile {
  id: string;
  displayName: string;
  major?: string;
  college?: string;
  classYear?: string;
  bio?: string;
  avatarUrl?: string;
  coverUrl?: string;
  interests: string[];
  skills: string[];
  links?: { label: string; url: string }[];
  privacy: Record<string, "public" | "temple-only" | "private">;
  createdAt: string;
  updatedAt: string;
}

interface DemoAccount {
  id: string;
  profileId: string;
  displayName: string;
  // This is a demo persona only; never a credential.
}

interface SessionState {
  activeAccountId: string;
}
```

Demo account presets: Jordan, Taylor, Morgan and Alex. A student profile can have multiple organization memberships with different roles.

## 3. Organizations and membership

```ts
type OrganizationRole =
  | "president" | "vice-president" | "treasurer" | "secretary"
  | "board-member" | "moderator" | "member";

type MembershipStatus = "pending" | "active" | "declined" | "inactive";

interface Organization {
  id: string;
  name: string;
  description: string;
  tags: string[];
  logoUrl?: string;
  coverUrl?: string;
  verificationStatus: "demo" | "unverified" | "verified";
  createdAt: string;
  updatedAt: string;
}

interface OrganizationMembership {
  id: string;
  organizationId: string;
  studentId: string;
  role: OrganizationRole;
  status: MembershipStatus;
  permissions: string[];
  joinedAt?: string;
}
```

Permissions must be explicit and organization-scoped. Do not infer broad permissions from role labels alone. A student may have separate membership records in multiple organizations.

## 4. Feed and social content

```ts
type PostType =
  | "text" | "photo" | "album" | "video" | "audio" | "link"
  | "quote" | "discussion" | "event" | "organization" | "project" | "resource";

interface Post {
  id: string;
  authorId: string;
  organizationId?: string;
  type: PostType;
  body?: string;
  mediaUrls?: string[];
  linkUrl?: string;
  tags: string[];
  visibility: "public" | "temple-only" | "private";
  createdAt: string;
  updatedAt: string;
}

interface Follow {
  id: string;
  followerId: string;
  targetType: "student" | "organization" | "topic";
  targetId: string;
  createdAt: string;
}

interface Comment {
  id: string;
  postId: string;
  authorId: string;
  body: string;
  createdAt: string;
}
```

No public follower/following counts. Do not use private messages, private files or membership records as recommendation inputs.

## 5. Events

```ts
type EventStatus = "draft" | "published" | "cancelled";

interface CampusEvent {
  id: string;
  title: string;
  description: string;
  hostOrganizationId?: string;
  hostStudentId?: string;
  category: string;
  startAt: string;
  endAt: string;
  locationName: string;
  priceLabel: string;
  status: EventStatus;
  isDemoContent: boolean;
}

interface EventParticipation {
  id: string;
  eventId: string;
  studentId: string;
  state: "saved" | "going" | "attended";
  updatedAt: string;
}
```

Demo RSVP is not real registration. `attended` must represent confirmed attendance, not merely an RSVP.

## 6. Communities

```ts
interface Community {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  createdByStudentId: string;
  visibility: "open" | "private";
  isOfficialOrganization: false;
}

interface CommunityMembership {
  id: string;
  communityId: string;
  studentId: string;
  role: "participant" | "moderator" | "founder";
  status: "active" | "invited" | "pending";
}

interface DiscussionThread {
  id: string;
  communityId: string;
  authorId: string;
  title: string;
  body: string;
  createdAt: string;
}
```

An informal community is not an official Temple organization. Public participation does not automatically confer founding status.

## 7. Projects

```ts
type ProjectStatus = "private" | "recruiting" | "active" | "completed" | "archived";
type ProjectRequestStatus = "pending" | "accepted" | "declined" | "withdrawn";

interface Project {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  category: string;
  skillsNeeded: string[];
  status: ProjectStatus;
  isPublished: boolean;
  deadline?: string;
  createdAt: string;
  updatedAt: string;
}

interface ProjectMembership {
  id: string;
  projectId: string;
  studentId: string;
  role: string;
  status: "invited" | "active" | "removed";
  contributionSummary?: string;
}

interface ProjectJoinRequest {
  id: string;
  projectId: string;
  studentId: string;
  message?: string;
  status: ProjectRequestStatus;
  createdAt: string;
}

interface ProjectTask {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  assigneeId?: string;
  status: "todo" | "in-progress" | "done";
  dueAt?: string;
}
```

Only accepted, active project membership grants workspace access. Do not expose private workspace data to applicants or followers.

## 8. Profiles, collections and portfolio

```ts
interface Collection {
  id: string;
  ownerId: string;
  title: string;
  description?: string;
  visibility: "public" | "temple-only" | "private";
  itemIds: string[];
}

interface PortfolioItem {
  id: string;
  ownerId: string;
  title: string;
  description?: string;
  category: string;
  mediaUrls?: string[];
  skills?: string[];
  credits?: string[];
  linkUrl?: string;
  visibility: "public" | "temple-only" | "private";
}

interface SavedItem {
  id: string;
  studentId: string;
  itemType: "post" | "event" | "project" | "resource" | "collection";
  itemId: string;
  createdAt: string;
}
```

Profile metrics are derived from qualifying records. Do not store public follower counts. Do not implement Top 8.

## 9. Messaging and organization channels

```ts
interface Conversation {
  id: string;
  type: "direct" | "organization-board" | "organization-members"
      | "organization-inquiries" | "project" | "custom";
  organizationId?: string;
  projectId?: string;
  participantIds: string[];
  title?: string;
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  createdAt: string;
}

interface OrganizationInquiry {
  id: string;
  organizationId: string;
  studentId: string;
  subject: string;
  body: string;
  status: "new" | "assigned" | "replied" | "closed";
  assignedToId?: string;
  createdAt: string;
}
```

Conversation access must be checked against explicit participant membership and organization/project permissions. Board access must not imply access to all direct messages.

## 10. Resources and assistant

```ts
interface Resource {
  id: string;
  title: string;
  description: string;
  category: "academic" | "career" | "wellness" | "financial" | "campus-life";
  officialUrl?: string;
  contact?: string;
  locationName?: string;
  eligibility?: string;
  cost?: string;
  sourceType: "official" | "student-submitted" | "demo";
  lastVerifiedAt?: string;
}

interface AssistantResponse {
  id: string;
  prompt: string;
  response: string;
  sourceResourceIds: string[];
  isSimulated: true;
}
```

Never invent eligibility, hours, policy or contact information. The initial assistant is scripted/simulated.

## 11. Local persistence envelope

Store versioned application data under a namespaced key, for example `temple-student-hub:v1`.

```ts
interface PersistedAppState {
  schemaVersion: number;
  activeAccountId: string;
  students: StudentProfile[];
  organizations: Organization[];
  memberships: OrganizationMembership[];
  posts: Post[];
  follows: Follow[];
  events: CampusEvent[];
  eventParticipations: EventParticipation[];
  communities: Community[];
  projects: Project[];
  projectMemberships: ProjectMembership[];
  projectJoinRequests: ProjectJoinRequest[];
  tasks: ProjectTask[];
  collections: Collection[];
  portfolioItems: PortfolioItem[];
  savedItems: SavedItem[];
  conversations: Conversation[];
  messages: Message[];
  resources: Resource[];
}
```

The final persisted shape may be split into repositories, but schema versioning, namespacing, safe parsing and reset/reseed support are required. Handle missing, malformed or outdated data gracefully.
