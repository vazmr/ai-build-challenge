import { createExtraSeed } from './extra'
import { withMoreContent } from './more'
import { withMoreProjects } from './projectsMore'
import { AUDIO, EVENT_PHOTOS, MEDIA } from './media'
import { PROJECT_EXTRAS } from './projectExtras'
import type {
  CampusEvent, Community, CommunityMembership, DemoAccount, DiscussionThread, OrganizationMembership,
  OrganizationPermission, PersistedAppState, Post, Project, StudentProfile, ThreadReply,
} from '../../types'

// ALL SEED CONTENT IS FICTIONAL. Not real Temple organizations, people or events.

export const SCHEMA_VERSION = 12

/** Curated tags suggested across feed, projects, communities and events. */
export const CURATED_TAGS = [
  'music', 'film', 'photography', 'art', 'tech', 'gaming', 'fashion',
  'entrepreneurship', 'career', 'study', 'philly', 'student-life',
]

const NOW = '2026-11-01T12:00:00.000Z'
const at = (day: string, time: string) => `2026-${day}T${time}:00-05:00`

const student = (id: string, displayName: string, extra: Partial<StudentProfile>): StudentProfile => ({
  id,
  displayName,
  interests: [],
  skills: [],
  privacy: { overview: 'temple-only', blog: 'public', collections: 'public', portfolio: 'public', collaborations: 'temple-only', about: 'public' },
  createdAt: NOW,
  updatedAt: NOW,
  ...extra,
})

const OFFICER_PERMS: OrganizationPermission[] = [
  'org.view-members', 'org.review-applications', 'org.manage-members',
  'org.access-board', 'org.manage-invitations', 'org.read-inquiries', 'org.post-announcements', 'org.manage-events',
]
const BOARD_PERMS: OrganizationPermission[] = ['org.view-members', 'org.access-board']
const MEMBER_PERMS: OrganizationPermission[] = ['org.view-members']

const membership = (
  id: string, organizationId: string, studentId: string,
  role: OrganizationMembership['role'], permissions: OrganizationPermission[],
): OrganizationMembership => ({ id, organizationId, studentId, role, status: 'active', permissions, joinedAt: NOW })

const post = (p: Partial<Post> & Pick<Post, 'id' | 'authorId' | 'type' | 'createdAt'>): Post => ({
  tags: [], visibility: 'public', updatedAt: p.createdAt, ...p,
})

const event = (e: Omit<CampusEvent, 'status'>): CampusEvent => ({
  status: 'published', ...e,
})

const community = (c: Omit<Community, 'visibility' | 'isOfficialOrganization'>): Community => ({
  visibility: 'open', isOfficialOrganization: false, ...c,
})

const cm = (id: string, communityId: string, studentId: string, role: CommunityMembership['role'] = 'participant'): CommunityMembership =>
  ({ id, communityId, studentId, role, status: 'active' })

const thread = (t: DiscussionThread): DiscussionThread => t
const reply = (r: ThreadReply): ThreadReply => r

const project = (p: Partial<Project> & Pick<Project, 'id' | 'ownerId' | 'title' | 'description' | 'category'>): Project => ({
  kind: 'collaborators', skillsNeeded: [], status: 'private', isPublished: false, createdAt: NOW, updatedAt: NOW, ...p,
})

export function createSeedState(): PersistedAppState {
  const seed = withMoreProjects(withMoreContent(buildBaseSeed()))
  return { ...seed, projects: seed.projects.map((p) => ({ ...p, ...PROJECT_EXTRAS[p.id] })) }
}

function buildBaseSeed(): PersistedAppState {
  const accounts: DemoAccount[] = [
    { id: 'acct-jordan', profileId: 'stu-jordan', displayName: 'Jordan' },
    { id: 'acct-taylor', profileId: 'stu-taylor', displayName: 'Taylor' },
    { id: 'acct-morgan', profileId: 'stu-morgan', displayName: 'Morgan' },
    { id: 'acct-alex', profileId: 'stu-alex', displayName: 'Alex' },
  ]
  return {
    schemaVersion: SCHEMA_VERSION,
    activeAccountId: 'acct-jordan',
    accounts,
    students: [
      student('stu-jordan', 'Jordan', { coverUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1600&h=420&q=75', major: 'Communication Studies', college: 'Klein College', classYear: '2028', bio: 'Communication major exploring clubs and campus life.', interests: ['music', 'photography', 'career'], skills: ['video editing', 'social media'] }),
      student('stu-taylor', 'Taylor', { major: 'Computer Science', college: 'College of Science', classYear: '2028', bio: 'Hackathon regular and Film Collective member.', interests: ['tech', 'gaming', 'study'], skills: ['React', 'TypeScript'] }),
      student('stu-morgan', 'Morgan', { major: 'Business', college: 'Business School', classYear: '2026', bio: 'Business major who helps run student organizations.', interests: ['entrepreneurship', 'career', 'film'], skills: ['budgeting', 'event planning'] }),
      student('stu-alex', 'Alex', { major: 'Film & Media Arts', college: 'Arts College', classYear: '2027', bio: 'Film major and president of the Film Collective.', interests: ['film', 'art', 'student-life'], skills: ['directing', 'cinematography'] }),
      student('stu-riley', 'Riley', { major: 'Visual Arts', classYear: '2027', bio: 'Street photographer exploring Philly.', interests: ['photography', 'art', 'philly'], skills: ['photography', 'Lightroom'] }),
      student('stu-sam', 'Sam', { major: 'Music Technology', classYear: '2029', bio: 'Producer and podcast host.', interests: ['music', 'tech'], skills: ['audio mixing', 'Ableton'] }),
    ],
    organizations: [
      { id: 'org-film', name: 'Film Collective', description: 'Student filmmakers making short films and hosting screening nights.', tags: ['film', 'art'], verificationStatus: 'demo', createdAt: NOW, updatedAt: NOW },
      { id: 'org-founders', name: 'Founders Circle', description: 'Students building startups with pitch practice, workshops and peer feedback.', tags: ['entrepreneurship', 'career'], verificationStatus: 'demo', createdAt: NOW, updatedAt: NOW },
      { id: 'org-radio', name: 'Campus Radio', description: 'Student-run radio with live shows, DJ sets and music events.', tags: ['music'], verificationStatus: 'demo', createdAt: NOW, updatedAt: NOW },
    ],
    memberships: [
      membership('mem-1', 'org-film', 'stu-alex', 'president', OFFICER_PERMS),
      membership('mem-2', 'org-film', 'stu-morgan', 'vice-president', OFFICER_PERMS),
      membership('mem-3', 'org-film', 'stu-taylor', 'member', MEMBER_PERMS),
      // Roles are scoped per organization: Morgan is board-only here, Alex is a plain member.
      membership('mem-4', 'org-founders', 'stu-morgan', 'treasurer', BOARD_PERMS),
      membership('mem-5', 'org-founders', 'stu-alex', 'member', MEMBER_PERMS),
      membership('mem-6', 'org-radio', 'stu-sam', 'president', OFFICER_PERMS),
    ],
    posts: [
      post({ id: 'post-1', authorId: 'stu-riley', type: 'photo', title: 'Morning on Broad Street', body: 'Shot this on my walk to class. Film grain on purpose.', mediaLabel: 'Photo: Broad Street at sunrise', mediaUrls: MEDIA.broadStreet, tags: ['photography', 'philly'], createdAt: at('11-05', '09:10') }),
      post({ id: 'post-2', authorId: 'stu-sam', organizationId: 'org-radio', type: 'event', title: 'WHIP Radio Live', body: 'Three hours of student DJs, live. Come hang out.', relatedId: 'ev-whip', tags: ['music', 'student-life'], createdAt: at('11-04', '17:30') }),
      post({ id: 'post-3', authorId: 'stu-taylor', type: 'discussion', title: 'What do you use to stay focused during finals?', body: 'Library, coffee shop, or locked in at home? Trying to build a routine.', tags: ['study', 'student-life'], createdAt: at('11-04', '14:00') }),
      post({ id: 'post-4', authorId: 'stu-alex', organizationId: 'org-film', type: 'project', title: 'Looking for a sound designer', body: 'Our short film "Night Shift" needs someone for sound design. Details in the project.', relatedId: 'proj-4', tags: ['film', 'art'], createdAt: at('11-03', '19:00') }),
      post({ id: 'post-5', authorId: 'stu-sam', type: 'audio', title: 'Beat sketch #12', body: 'Rough loop, feedback welcome.', mediaLabel: 'Audio: 1:48 beat sketch', mediaUrls: MEDIA.beatCover, audioUrl: AUDIO.beat, tags: ['music'], createdAt: at('11-03', '11:20') }),
      post({ id: 'post-6', authorId: 'stu-morgan', type: 'text', body: 'Reminder: pitch practice night is next week. No experience needed, just bring an idea.', tags: ['entrepreneurship', 'career'], createdAt: at('11-03', '09:00') }),
      post({ id: 'post-7', authorId: 'stu-alex', type: 'video', title: 'Behind the scenes: lighting test', body: 'Testing a one-light setup for the short.', mediaLabel: 'Video: 0:45 lighting test', mediaUrls: MEDIA.lighting, tags: ['film'], createdAt: at('11-02', '16:45') }),
      post({ id: 'post-8', authorId: 'stu-riley', type: 'quote', body: '"The best camera is the one that\'s with you."', linkUrl: 'https://example.com/quote-source', title: 'A line I keep coming back to', tags: ['photography', 'art'], createdAt: at('11-02', '12:10') }),
      post({ id: 'post-9', authorId: 'stu-taylor', type: 'link', title: 'Free intro to TypeScript course', body: 'Worked through this over the weekend. Good for beginners.', linkUrl: 'https://example.com/typescript-intro', tags: ['tech', 'study'], createdAt: at('11-01', '20:00') }),
      post({ id: 'post-10', authorId: 'stu-morgan', organizationId: 'org-founders', type: 'organization', title: 'Founders Circle is open to new members', body: 'We are welcoming new members this semester. Ask a question or request to join from our page.', relatedId: 'org-founders', tags: ['entrepreneurship'], createdAt: at('11-01', '10:00') }),
      post({ id: 'post-11', authorId: 'stu-sam', type: 'project', title: 'Student Podcast Pilot needs a co-host', body: 'Weekly show about campus creators. Looking for a second voice.', relatedId: 'proj-2', tags: ['music', 'student-life'], createdAt: at('10-31', '15:00') }),
      post({ id: 'post-12', authorId: 'stu-riley', type: 'album', title: 'Fall colors, Main Campus', body: 'Six frames from last weekend.', mediaLabel: 'Album: 6 photos', mediaUrls: MEDIA.fallCampus, tags: ['photography', 'student-life'], createdAt: at('10-30', '13:30') }),
      post({ id: 'post-13', authorId: 'stu-jordan', type: 'text', title: 'Draft: thoughts on my first semester', body: 'Private draft, only visible to me.', visibility: 'private', tags: ['student-life'], createdAt: at('10-29', '21:00') }),
      post({ id: 'post-14', authorId: 'stu-jordan', type: 'text', body: 'Anyone want to start a casual photo walk group? Philly has so many spots.', tags: ['photography', 'philly'], createdAt: at('10-28', '18:00') }),
    ],
    follows: [
      { id: 'fol-1', followerId: 'stu-jordan', targetType: 'student', targetId: 'stu-riley', createdAt: NOW },
      { id: 'fol-2', followerId: 'stu-jordan', targetType: 'organization', targetId: 'org-radio', createdAt: NOW },
      { id: 'fol-3', followerId: 'stu-taylor', targetType: 'student', targetId: 'stu-sam', createdAt: NOW },
      { id: 'fol-4', followerId: 'stu-morgan', targetType: 'organization', targetId: 'org-film', createdAt: NOW },
      { id: 'fol-5', followerId: 'stu-alex', targetType: 'student', targetId: 'stu-riley', createdAt: NOW },
    ],
    comments: [
      { id: 'com-1', postId: 'post-3', authorId: 'stu-riley', body: 'Charles Library 4th floor, every time.', createdAt: at('11-04', '15:00') },
      { id: 'com-2', postId: 'post-1', authorId: 'stu-alex', body: 'That light is unreal.', createdAt: at('11-05', '09:40') },
    ],
    hiddenPosts: [],
    events: [
      event({ id: 'ev-today', coverUrl: EVENT_PHOTOS['ev-today'], title: 'Study Break & Free Pizza', description: 'Take a break between classes.', hostOrganizationId: 'org-founders', category: 'Food & Freebies', startAt: at('11-05', '12:00'), endAt: at('11-05', '13:30'), locationName: 'Howard Gittis Student Center', priceLabel: 'Free', campus: 'Main Campus' }),
      event({ id: 'ev-whip', title: 'WHIP Radio Live', description: 'Student DJs broadcast live.', hostOrganizationId: 'org-radio', category: 'Music & Entertainment', startAt: at('11-06', '18:00'), endAt: at('11-06', '21:00'), locationName: 'Howard Gittis Student Center', priceLabel: 'Free', campus: 'Main Campus' }),
      event({ id: 'ev-art', coverUrl: EVENT_PHOTOS['ev-art'], title: 'Student Art Showcase', description: 'An afternoon of student work across media.', category: 'Arts & Culture', startAt: at('11-07', '12:00'), endAt: at('11-07', '16:00'), locationName: 'Charles Library', priceLabel: 'Free', campus: 'Main Campus' }),
      event({ id: 'ev-producers', title: 'Music Producers Meetup', description: 'Share beats, swap tips, find collaborators.', hostOrganizationId: 'org-radio', category: 'Music & Entertainment', startAt: at('11-09', '17:30'), endAt: at('11-09', '19:00'), locationName: 'TECH Center', priceLabel: 'Free', campus: 'Main Campus' }),
      event({ id: 'ev-careers', title: 'Creative Careers & Networking', description: 'Meet students and alumni in creative fields.', category: 'Professional', startAt: at('11-11', '15:00'), endAt: at('11-11', '17:00'), locationName: 'Annenberg Hall', priceLabel: 'Free', campus: 'Main Campus' }),
      event({ id: 'ev-hack', title: 'Intro to Hack Night', description: 'Build something small with other students. Beginners welcome.', category: 'Academic', startAt: at('11-12', '18:00'), endAt: at('11-12', '21:00'), locationName: 'TECH Center', priceLabel: 'Free', campus: 'Main Campus' }),
      event({ id: 'ev-mic', coverUrl: EVENT_PHOTOS['ev-mic'], title: 'Open Mic Night', description: 'Music, poetry and comedy.', category: 'Social', startAt: at('11-13', '19:00'), endAt: at('11-13', '21:30'), locationName: 'Tuttleman Learning Center', priceLabel: '$5', campus: 'Main Campus' }),
      event({ id: 'ev-cleanup', coverUrl: EVENT_PHOTOS['ev-cleanup'], title: 'Neighborhood Cleanup Day', description: 'Volunteer with other students.', category: 'Community Service', startAt: at('11-14', '10:00'), endAt: at('11-14', '13:00'), locationName: 'Meet at Howard Gittis Student Center', priceLabel: 'Free', campus: 'Main Campus' }),
      event({ id: 'ev-5k', coverUrl: EVENT_PHOTOS['ev-5k'], title: 'Fall Fun Run', description: 'A casual 5K around campus.', category: 'Sports & Recreation', startAt: at('11-15', '09:00'), endAt: at('11-15', '11:00'), locationName: 'Campus loop', priceLabel: 'Free', campus: 'Main Campus' }),
      event({ id: 'ev-past', coverUrl: EVENT_PHOTOS['ev-past'], title: 'Fall Welcome Mixer', description: 'A casual mixer to kick off the fall semester.', category: 'Social', startAt: at('10-20', '17:00'), endAt: at('10-20', '19:00'), locationName: 'Howard Gittis Student Center', priceLabel: 'Free', campus: 'Main Campus' }),
    ],
    eventParticipations: [
      { id: 'ep-1', eventId: 'ev-past', studentId: 'stu-taylor', state: 'attended', updatedAt: NOW },
      { id: 'ep-2', eventId: 'ev-past', studentId: 'stu-alex', state: 'attended', updatedAt: NOW },
      { id: 'ep-3', eventId: 'ev-past', studentId: 'stu-jordan', state: 'attended', updatedAt: NOW },
    ],
    communities: [
      community({ id: 'com-music', name: 'Music & Music Production', description: 'Share beats, gear questions and collaborations. Informal student group.', category: 'Music & Music Production', tags: ['music', 'tech'], createdByStudentId: 'stu-sam' }),
      community({ id: 'com-film', name: 'Film & Media', description: 'Shoots, screenings and crew calls. Informal student group.', category: 'Film & Media', tags: ['film', 'art'], createdByStudentId: 'stu-alex' }),
      community({ id: 'com-photo', name: 'Photography & Visual Arts', description: 'Photo walks, critiques and gear talk. Informal student group.', category: 'Photography & Visual Arts', tags: ['photography', 'art'], createdByStudentId: 'stu-riley' }),
      community({ id: 'com-study', name: 'Study Groups', description: 'Find people to study with. Informal student group.', category: 'Study Groups', tags: ['study'], createdByStudentId: 'stu-taylor' }),
      community({ id: 'com-gaming', name: 'Gaming', description: 'Casual play, tournaments and game nights. Informal student group.', category: 'Gaming', tags: ['gaming'], createdByStudentId: 'stu-taylor' }),
      community({ id: 'com-philly', name: 'Philadelphia Events & Culture', description: 'What to do around the city. Informal student group.', category: 'Philadelphia Events & Culture', tags: ['philly', 'student-life'], createdByStudentId: 'stu-riley' }),
    ],
    communityMemberships: [
      cm('cmem-1', 'com-music', 'stu-sam', 'founder'),
      cm('cmem-2', 'com-film', 'stu-alex', 'founder'),
      cm('cmem-3', 'com-photo', 'stu-riley', 'founder'),
      cm('cmem-4', 'com-study', 'stu-taylor', 'founder'),
      cm('cmem-5', 'com-gaming', 'stu-taylor', 'founder'),
      cm('cmem-6', 'com-philly', 'stu-riley', 'founder'),
      cm('cmem-7', 'com-photo', 'stu-jordan'),
      cm('cmem-8', 'com-music', 'stu-taylor'),
    ],
    threads: [
      thread({ id: 'thr-1', communityId: 'com-photo', authorId: 'stu-riley', title: 'Best cheap film stock for street photography?', body: 'Looking for suggestions under $12 a roll.', createdAt: at('11-04', '10:00') }),
      thread({ id: 'thr-2', communityId: 'com-photo', authorId: 'stu-jordan', title: 'Anyone up for a Saturday photo walk?', body: 'Thinking Old City, 10 AM. All skill levels.', createdAt: at('11-03', '12:00') }),
      thread({ id: 'thr-3', communityId: 'com-music', authorId: 'stu-sam', title: 'Free plugins worth installing', body: 'Drop your favorites and what you use them for.', createdAt: at('11-02', '18:00') }),
      thread({ id: 'thr-4', communityId: 'com-study', authorId: 'stu-taylor', title: 'Data structures study group, Tuesdays?', body: 'Looking for 3-4 people. Library or online.', createdAt: at('11-02', '09:00') }),
      thread({ id: 'thr-5', communityId: 'com-film', authorId: 'stu-alex', title: 'Crew call: weekend shoot', body: 'Need a boom operator and a gaffer for a two-day shoot.', createdAt: at('11-01', '17:00') }),
    ],
    threadReplies: [
      reply({ id: 'rep-1', threadId: 'thr-1', authorId: 'stu-jordan', body: 'I had good luck with 400-speed black and white. Cheap and forgiving.', createdAt: at('11-04', '11:00') }),
      reply({ id: 'rep-2', threadId: 'thr-1', authorId: 'stu-alex', body: 'Seconding that. Also check local shops for expired stock.', createdAt: at('11-04', '12:30') }),
      reply({ id: 'rep-3', threadId: 'thr-2', authorId: 'stu-riley', body: 'In! I know a good spot for golden hour.', createdAt: at('11-03', '13:00') }),
      reply({ id: 'rep-4', threadId: 'thr-3', authorId: 'stu-taylor', body: 'Not a producer but I use a free EQ for my podcast edits.', createdAt: at('11-02', '19:00') }),
      reply({ id: 'rep-5', threadId: 'thr-4', authorId: 'stu-morgan', body: 'Wish I could join, but good luck!', createdAt: at('11-02', '10:00') }),
    ],
    projects: [
      project({ id: 'proj-1', ownerId: 'stu-jordan', title: 'Short Documentary', description: 'A short documentary about student life. Currently in early planning.', category: 'Media & Production' }),
      project({ id: 'proj-2', ownerId: 'stu-sam', title: 'Student Podcast Pilot', description: 'A weekly show about campus creators. We need a co-host and an editor.', category: 'Music', skillsNeeded: ['hosting', 'audio editing'], status: 'recruiting', isPublished: true, deadline: '2026-12-15' }),
      project({ id: 'proj-3', ownerId: 'stu-taylor', kind: 'need-help', title: 'Portfolio site feedback', description: 'Looking for design feedback on my portfolio site before applying to internships.', category: 'Design & Creative', skillsNeeded: ['UX review', 'visual design'], status: 'recruiting', isPublished: true, deadline: '2026-11-30' }),
      project({ id: 'proj-4', ownerId: 'stu-alex', title: 'Short Film: Night Shift', description: 'A 10-minute short shot over two weekends. Seeking a sound designer.', category: 'Media & Production', skillsNeeded: ['sound design'], status: 'recruiting', isPublished: true, deadline: '2026-12-10' }),
    ],
    projectMemberships: [
      { id: 'pm-1', projectId: 'proj-1', studentId: 'stu-jordan', role: 'Owner', status: 'active' },
      { id: 'pm-2', projectId: 'proj-2', studentId: 'stu-sam', role: 'Owner', status: 'active' },
      { id: 'pm-3', projectId: 'proj-2', studentId: 'stu-riley', role: 'Producer', status: 'active', contributionSummary: 'Cover art and promo photos' },
      { id: 'pm-4', projectId: 'proj-3', studentId: 'stu-taylor', role: 'Owner', status: 'active' },
      { id: 'pm-5', projectId: 'proj-4', studentId: 'stu-alex', role: 'Owner', status: 'active' },
      { id: 'pm-6', projectId: 'proj-4', studentId: 'stu-morgan', role: 'Producer', status: 'active', contributionSummary: 'Budget and scheduling' },
    ],
    projectJoinRequests: [
      { id: 'pjr-1', projectId: 'proj-3', studentId: 'stu-morgan', message: 'I can give feedback from a business-branding angle.', status: 'pending', createdAt: at('11-04', '09:00') },
    ],
    tasks: [
      { id: 'task-1', projectId: 'proj-1', title: 'Draft a one-page outline', status: 'todo' },
      { id: 'task-2', projectId: 'proj-4', title: 'Lock shooting schedule', assigneeId: 'stu-morgan', status: 'in-progress' },
      { id: 'task-3', projectId: 'proj-4', title: 'Location scouting', assigneeId: 'stu-alex', status: 'done' },
      { id: 'task-4', projectId: 'proj-2', title: 'Record trailer episode', assigneeId: 'stu-sam', status: 'in-progress' },
    ],
    collections: [
      { id: 'col-1', ownerId: 'stu-riley', title: 'Philly light studies', description: 'Frames I keep returning to.', visibility: 'public', itemIds: ['post-1', 'post-12'] },
      { id: 'col-2', ownerId: 'stu-alex', title: 'Lighting references', visibility: 'public', itemIds: ['post-7'] },
      { id: 'col-3', ownerId: 'stu-jordan', title: 'Ideas (private)', description: 'Personal inspiration board.', visibility: 'private', itemIds: ['post-5'] },
    ],
    portfolioItems: [
      { id: 'port-1', ownerId: 'stu-riley', title: 'Broad Street series', description: 'Documentary photography, film scans.', category: 'Photography', visibility: 'public' },
      { id: 'port-2', ownerId: 'stu-sam', title: 'Beat tape Vol. 1', description: 'Eight original instrumentals.', category: 'Music/Audio', visibility: 'public' },
      { id: 'port-3', ownerId: 'stu-taylor', title: 'Campus event finder', description: 'React + TypeScript side project.', category: 'Apps & Websites', visibility: 'temple-only' },
    ],
    savedItems: [],
    ...createExtraSeed(),
  }
}
