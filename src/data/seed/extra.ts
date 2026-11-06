import type {
  Announcement, AppNotification, Conversation, Message, OrganizationApplication, OrganizationInquiry,
  OrganizationInvitation, OrgCollaboration, OrgInterest, FoundingWorkspace, Resource,
  ProjectMilestone, ProjectFile, Block,
} from '../../types'

// ALL SEED CONTENT IS FICTIONAL. Resources below are DEMO placeholders: they intentionally carry
// no eligibility, hours, costs or contact details, because those must come from verified official sources.

const at = (day: string, time: string) => `2026-${day}T${time}:00-05:00`

const resource = (r: Omit<Resource, 'sourceType'>): Resource => ({ sourceType: 'demo', ...r })

export function createExtraSeed(): {
  conversations: Conversation[]; messages: Message[]; resources: Resource[]
  orgApplications: OrganizationApplication[]; orgInvitations: OrganizationInvitation[]
  inquiries: OrganizationInquiry[]; announcements: Announcement[]; notifications: AppNotification[]
  orgInterests: OrgInterest[]; orgCollaborations: OrgCollaboration[]; foundingWorkspaces: FoundingWorkspace[]
  milestones: ProjectMilestone[]; projectFiles: ProjectFile[]; blocks: Block[]
} {
  return {
    conversations: [
      { id: 'conv-film-board', type: 'organization-board', organizationId: 'org-film', participantIds: [], title: 'Board Chat' },
      { id: 'conv-film-members', type: 'organization-members', organizationId: 'org-film', participantIds: [], title: 'Member Chat' },
      { id: 'conv-founders-board', type: 'organization-board', organizationId: 'org-founders', participantIds: [], title: 'Board Chat' },
      { id: 'conv-founders-members', type: 'organization-members', organizationId: 'org-founders', participantIds: [], title: 'Member Chat' },
      { id: 'conv-radio-board', type: 'organization-board', organizationId: 'org-radio', participantIds: [], title: 'Board Chat' },
      { id: 'conv-radio-members', type: 'organization-members', organizationId: 'org-radio', participantIds: [], title: 'Member Chat' },
      { id: 'conv-dm-1', type: 'direct', participantIds: ['stu-alex', 'stu-morgan'] },
    ],
    messages: [
      { id: 'msg-1', conversationId: 'conv-film-board', senderId: 'stu-alex', body: 'Budget review before the next screening night. Morgan, can you bring the numbers?', createdAt: at('11-03', '20:00') },
      { id: 'msg-2', conversationId: 'conv-film-board', senderId: 'stu-morgan', body: 'Yep, will bring them Thursday.', createdAt: at('11-03', '20:12') },
      { id: 'msg-3', conversationId: 'conv-film-members', senderId: 'stu-alex', body: 'Welcome everyone! Screening night is coming up. Details in announcements.', createdAt: at('11-02', '10:00') },
      { id: 'msg-4', conversationId: 'conv-film-members', senderId: 'stu-taylor', body: 'Excited! Can I help with the projector setup?', createdAt: at('11-02', '10:30') },
      { id: 'msg-5', conversationId: 'conv-dm-1', senderId: 'stu-alex', body: 'Hey, are you in for the Night Shift shoot?', createdAt: at('11-04', '09:00') },
      { id: 'msg-6', conversationId: 'conv-founders-board', senderId: 'stu-morgan', body: 'Draft agenda for pitch night is in the doc.', createdAt: at('11-03', '09:30') },
    ],
    resources: [
      resource({ id: 'res-advising', title: 'Academic advising (demo entry)', description: 'Placeholder entry about getting help with course planning and academic questions. Look up your own advisor through official Temple sources.', category: 'academic', locationName: 'Charles Library' }),
      resource({ id: 'res-tutoring', title: 'Tutoring and study help (demo entry)', description: 'Placeholder entry for finding study support. This prototype does not list real services, times or eligibility.', category: 'academic', locationName: 'Charles Library' }),
      resource({ id: 'res-career', title: 'Career exploration (demo entry)', description: 'Placeholder entry for resume help, internships and networking. Check official Temple career pages for real offerings.', category: 'career', locationName: 'Annenberg Hall' }),
      resource({ id: 'res-wellness', title: 'Wellness and counseling (demo entry)', description: 'Placeholder entry for mental health and wellness support. If you or someone you know needs help now, use official campus or emergency services.', category: 'wellness' }),
      resource({ id: 'res-finaid', title: 'Financial aid questions (demo entry)', description: 'Placeholder entry for questions about aid and billing. This prototype does not state eligibility, deadlines or contacts.', category: 'financial' }),
      resource({ id: 'res-tech', title: 'Technology help (demo entry)', description: 'Placeholder entry for computer, network and software support.', category: 'campus-life', locationName: 'TECH Center' }),
      resource({ id: 'res-student-center', title: 'Student center spaces (demo entry)', description: 'Placeholder entry about places to meet, eat and hang out between classes.', category: 'campus-life', locationName: 'Howard Gittis Student Center' }),
      { id: 'res-peer-tips', title: 'Peer tips: finding quiet study spots', description: 'Student-submitted tip list. Not official information.', category: 'campus-life', sourceType: 'student-submitted' },
    ],
    orgApplications: [
      { id: 'app-1', organizationId: 'org-film', studentId: 'stu-jordan', message: 'I edit video and would love to help with post-production.', status: 'pending', createdAt: at('11-04', '13:00') },
    ],
    orgInvitations: [
      { id: 'inv-1', organizationId: 'org-founders', studentId: 'stu-taylor', invitedById: 'stu-morgan', status: 'pending', createdAt: at('11-03', '16:00') },
    ],
    inquiries: [
      { id: 'inq-1', organizationId: 'org-film', studentId: 'stu-jordan', subject: 'Do I need my own camera?', body: 'Thinking about joining. Is equipment provided for members?', status: 'new', replies: [], createdAt: at('11-04', '10:30') },
    ],
    announcements: [
      { id: 'ann-1', title: 'Welcome to the Temple Student Hub prototype', body: 'Everything here is fictional demo content for testing the experience. It is not connected to Temple systems.', pinned: true, createdAt: at('11-01', '09:00') },
      { id: 'ann-2', organizationId: 'org-film', authorId: 'stu-alex', title: 'Screening night next week', body: 'Bring a short film (under 10 minutes) to share. Everyone is welcome.', pinned: true, createdAt: at('11-03', '12:00') },
      { id: 'ann-3', organizationId: 'org-radio', authorId: 'stu-sam', title: 'Open slots for guest DJs', body: 'Interested in a guest set? Ask a question from our page.', pinned: false, createdAt: at('11-02', '12:00') },
    ],
    notifications: [
      { id: 'not-1', studentId: 'stu-jordan', title: 'Welcome', body: 'Explore the Feed, Events and Projects to get started.', link: '/feed', read: false, createdAt: at('11-01', '09:05') },
      { id: 'not-2', studentId: 'stu-taylor', title: 'Invitation from Demo Founders Circle', body: 'Morgan invited you to join.', link: '/organizations/org-founders', read: false, createdAt: at('11-03', '16:00') },
      { id: 'not-3', studentId: 'stu-taylor', title: 'New join request', body: 'Morgan asked to help on Portfolio site feedback.', link: '/projects/proj-3', read: false, createdAt: at('11-04', '09:00') },
    ],
    orgInterests: [] as OrgInterest[],
    orgCollaborations: [
      { id: 'collab-1', organizationIds: ['org-radio', 'org-film'], status: 'pending', projectTitle: 'Joint Screening + Live Soundtrack Night', files: [], activity: [{ id: 'act-1', organizationId: 'org-radio', text: 'Invited Demo Film Collective to collaborate', at: at('11-04', '15:00') }], createdAt: at('11-04', '15:00') },
    ],
    foundingWorkspaces: [],
    milestones: [
      { id: 'ms-1', projectId: 'proj-4', title: 'Script locked', dueAt: '2026-11-12', done: true },
      { id: 'ms-2', projectId: 'proj-4', title: 'Shoot weekend 1', dueAt: '2026-11-21', done: false },
      { id: 'ms-3', projectId: 'proj-2', title: 'Record trailer episode', dueAt: '2026-11-18', done: false },
    ],
    projectFiles: [
      { id: 'pf-1', projectId: 'proj-4', name: 'night-shift-script-v3.pdf', addedById: 'stu-alex', createdAt: at('11-03', '10:00') },
    ],
    blocks: [],
  }
}
