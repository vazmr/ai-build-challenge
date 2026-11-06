import type { CampusEvent, Community, CommunityMembership, DiscussionThread, Follow, PersistedAppState, Post, Project, StudentProfile, ThreadReply } from '../../types'

// ALL SEED CONTENT IS FICTIONAL. Extra demo content so the prototype feels populated.

const NOW = '2026-11-01T12:00:00.000Z'
const at = (day: string, time: string) => `2026-${day}T${time}:00-05:00`
const privacy = { overview: 'temple-only', blog: 'public', collections: 'public', portfolio: 'public', collaborations: 'temple-only', about: 'public' } as const

const stu = (id: string, displayName: string, extra: Partial<StudentProfile>): StudentProfile =>
  ({ id, displayName, interests: [], skills: [], privacy: { ...privacy }, createdAt: NOW, updatedAt: NOW, ...extra })
const post = (p: Partial<Post> & Pick<Post, 'id' | 'authorId' | 'type' | 'createdAt'>): Post => ({ tags: [], visibility: 'public', updatedAt: p.createdAt, ...p })
const event = (e: Omit<CampusEvent, 'status' | 'isDemoContent' | 'campus'>): CampusEvent => ({ status: 'published', isDemoContent: true, campus: 'Main Campus', ...e })
const community = (c: Omit<Community, 'visibility' | 'isOfficialOrganization'>): Community => ({ visibility: 'open', isOfficialOrganization: false, ...c })
const cm = (id: string, communityId: string, studentId: string, role: CommunityMembership['role'] = 'participant'): CommunityMembership => ({ id, communityId, studentId, role, status: 'active' })
const project = (p: Partial<Project> & Pick<Project, 'id' | 'ownerId' | 'title' | 'description' | 'category'>): Project =>
  ({ kind: 'collaborators', skillsNeeded: [], status: 'recruiting', isPublished: true, createdAt: NOW, updatedAt: NOW, ...p })
const fol = (id: string, followerId: string, targetType: Follow['targetType'], targetId: string): Follow => ({ id, followerId, targetType, targetId, createdAt: NOW })
const thread = (t: DiscussionThread) => t
const reply = (r: ThreadReply) => r

export function withMoreContent(s: PersistedAppState): PersistedAppState {
  return {
    ...s,
    students: [
      ...s.students,
      stu('stu-casey', 'Casey', { major: 'Fashion Design', classYear: '2027', bio: 'Thrift flips and zine making.', interests: ['fashion', 'art', 'philly'], skills: ['sewing', 'illustration'] }),
      stu('stu-devon', 'Devon', { major: 'Information Science', classYear: '2028', bio: 'Game jams and tiny apps.', interests: ['gaming', 'tech'], skills: ['Unity', 'Python'] }),
      stu('stu-priya', 'Priya', { major: 'Entrepreneurship', classYear: '2027', bio: 'Building a snack startup between classes.', interests: ['entrepreneurship', 'career', 'study'], skills: ['pitching', 'market research'] }),
      stu('stu-marcus', 'Marcus', { major: 'Kinesiology', classYear: '2029', bio: 'Runner. Always up for a pickup game.', interests: ['student-life', 'philly'], skills: ['coaching'] }),
    ],
    posts: [
      ...s.posts,
      post({ id: 'post-15', authorId: 'stu-casey', type: 'album', title: 'Thrift haul and what I made from it', body: 'Five pieces, $23 total.', mediaLabel: 'Album: 5 outfits', tags: ['fashion', 'art'], createdAt: at('11-05', '08:00') }),
      post({ id: 'post-16', authorId: 'stu-devon', type: 'video', title: '30-second game jam recap', body: 'We built a platformer in 48 hours. Rough, but ours.', mediaLabel: 'Video: 0:30 recap', tags: ['gaming', 'tech'], createdAt: at('11-04', '23:10') }),
      post({ id: 'post-17', authorId: 'stu-priya', type: 'discussion', title: 'How do you validate an idea before building it?', body: 'Surveys, interviews, or a quick landing page? What worked for you?', tags: ['entrepreneurship', 'career'], createdAt: at('11-04', '19:30') }),
      post({ id: 'post-18', authorId: 'stu-marcus', type: 'text', body: 'Pickup basketball Thursday at 7. All levels welcome, bring water.', tags: ['student-life'], createdAt: at('11-04', '16:20') }),
      post({ id: 'post-19', authorId: 'stu-casey', type: 'project', title: 'Campus Style Zine is recruiting', body: 'Need photographers and a layout person for issue 2.', relatedId: 'proj-5', tags: ['fashion', 'photography'], createdAt: at('11-03', '21:00') }),
      post({ id: 'post-20', authorId: 'stu-riley', type: 'quote', title: 'Writing this on my desk', body: '"Make something every day, even if it is small."', linkUrl: 'https://example.com/another-quote', tags: ['art'], createdAt: at('11-03', '07:45') }),
      post({ id: 'post-21', authorId: 'stu-sam', type: 'resource', title: 'Quiet study spots (student tips)', body: 'A short list of student-submitted tips. Not official information.', relatedId: 'res-peer-tips', tags: ['study', 'student-life'], createdAt: at('11-02', '20:15') }),
      post({ id: 'post-22', authorId: 'stu-devon', type: 'audio', title: 'Chiptune loop for the jam', body: 'Free to use if you credit me.', mediaLabel: 'Audio: 1:12 chiptune loop', tags: ['music', 'gaming'], createdAt: at('11-02', '14:05') }),
      post({ id: 'post-23', authorId: 'stu-priya', organizationId: 'org-founders', type: 'event', title: 'Startup Pitch Night (demo)', body: 'Practice a 3-minute pitch and get friendly feedback.', relatedId: 'ev-pitch', tags: ['entrepreneurship'], createdAt: at('11-02', '10:00') }),
      post({ id: 'post-24', authorId: 'stu-marcus', type: 'photo', title: 'Sunrise run, campus loop', body: 'Cold, quiet, perfect.', mediaLabel: 'Photo: campus loop at sunrise', tags: ['philly', 'student-life'], createdAt: at('11-01', '07:30') }),
      post({ id: 'post-25', authorId: 'stu-taylor', type: 'text', body: 'Hack night next week. Beginners welcome, I will help you set up your environment.', tags: ['tech', 'study'], createdAt: at('10-31', '18:00') }),
      post({ id: 'post-26', authorId: 'stu-alex', organizationId: 'org-film', type: 'organization', title: 'Demo Film Collective: screening night recap', body: 'Thanks to everyone who shared a short. See our page for what is next.', relatedId: 'org-film', tags: ['film'], createdAt: at('10-30', '22:00') }),
      post({ id: 'post-27', authorId: 'stu-casey', type: 'photo', title: 'Zine cover draft', body: 'Which colorway reads better in print?', mediaLabel: 'Photo: zine cover draft', tags: ['fashion', 'art'], createdAt: at('10-30', '11:00') }),
      post({ id: 'post-28', authorId: 'stu-morgan', type: 'link', title: 'Budgeting template for student orgs', body: 'A simple spreadsheet structure I use. Adapt freely.', linkUrl: 'https://example.com/budget-template', tags: ['entrepreneurship', 'career'], createdAt: at('10-29', '12:00') }),
    ],
    follows: [
      ...s.follows,
      fol('fol-6', 'stu-jordan', 'student', 'stu-sam'),
      fol('fol-7', 'stu-jordan', 'community', 'com-photo'),
      fol('fol-8', 'stu-taylor', 'student', 'stu-devon'),
      fol('fol-9', 'stu-taylor', 'organization', 'org-founders'),
      fol('fol-10', 'stu-morgan', 'student', 'stu-priya'),
      fol('fol-11', 'stu-alex', 'student', 'stu-casey'),
    ],
    comments: [
      ...s.comments,
      { id: 'com-3', postId: 'post-15', authorId: 'stu-riley', body: 'The second outfit is amazing.', createdAt: at('11-05', '08:30') },
      { id: 'com-4', postId: 'post-17', authorId: 'stu-morgan', body: 'Landing page plus 5 interviews worked for us.', createdAt: at('11-04', '20:00') },
      { id: 'com-5', postId: 'post-16', authorId: 'stu-taylor', body: 'Playable?! Link please.', createdAt: at('11-05', '00:10') },
    ],
    events: [
      ...s.events,
      event({ id: 'ev-gym', title: 'Open Gym Night', description: 'Pickup basketball and volleyball. Fictional sample event.', category: 'Sports & Recreation', startAt: at('11-06', '19:00'), endAt: at('11-06', '21:00'), locationName: 'Howard Gittis Student Center', priceLabel: 'Free' }),
      event({ id: 'ev-resume', title: 'Resume Clinic', description: 'Drop in for friendly resume feedback from peers. Fictional sample event.', category: 'Professional', startAt: at('11-10', '14:00'), endAt: at('11-10', '16:00'), locationName: 'Annenberg Hall', priceLabel: 'Free' }),
      event({ id: 'ev-game', title: 'Game Night Tournament', description: 'Board games and console brackets. Fictional sample event.', category: 'Social', startAt: at('11-16', '18:00'), endAt: at('11-16', '21:00'), locationName: 'TECH Center', priceLabel: 'Free' }),
      event({ id: 'ev-swap', title: 'Fashion Swap', description: 'Bring something, take something. Fictional sample event.', category: 'Arts & Culture', startAt: at('11-17', '12:00'), endAt: at('11-17', '15:00'), locationName: 'Howard Gittis Student Center', priceLabel: 'Free' }),
      event({ id: 'ev-pitch', title: 'Startup Pitch Night', description: 'Practice a 3-minute pitch with friendly feedback. Fictional sample event.', hostOrganizationId: 'org-founders', category: 'Professional', startAt: at('11-18', '18:00'), endAt: at('11-18', '20:30'), locationName: 'Tuttleman Learning Center', priceLabel: 'Free' }),
      event({ id: 'ev-jazz', title: 'Jazz on the Lawn', description: 'Live student jazz ensembles. Fictional sample event.', hostOrganizationId: 'org-radio', category: 'Music & Entertainment', startAt: at('11-19', '16:00'), endAt: at('11-19', '18:00'), locationName: 'Campus lawn', priceLabel: 'Free' }),
      event({ id: 'ev-film', title: 'Student Film Screening Night', description: 'Short films by students. Fictional sample event.', hostOrganizationId: 'org-film', category: 'Arts & Culture', startAt: at('11-20', '19:00'), endAt: at('11-20', '21:30'), locationName: 'Charles Library', priceLabel: 'Free' }),
      event({ id: 'ev-study', title: 'Finals Study Jam', description: 'Quiet tables and snacks. Fictional sample event.', category: 'Academic', startAt: at('11-21', '10:00'), endAt: at('11-21', '17:00'), locationName: 'Charles Library', priceLabel: 'Free' }),
    ],
    eventParticipations: [
      ...s.eventParticipations,
      { id: 'ep-4', eventId: 'ev-whip', studentId: 'stu-taylor', state: 'going', updatedAt: NOW },
      { id: 'ep-5', eventId: 'ev-pitch', studentId: 'stu-morgan', state: 'going', updatedAt: NOW },
    ],
    communities: [
      ...s.communities,
      community({ id: 'com-fashion', name: 'Fashion & Style', description: 'Thrifting, upcycling and outfit feedback. Informal student group.', category: 'Fashion & Style', tags: ['fashion', 'art'], createdByStudentId: 'stu-casey' }),
      community({ id: 'com-startup', name: 'Entrepreneurship', description: 'Idea swaps and pitch practice. Informal student group.', category: 'Entrepreneurship', tags: ['entrepreneurship', 'career'], createdByStudentId: 'stu-priya' }),
      community({ id: 'com-life', name: 'Temple Student Life', description: 'Tips, questions and good finds around campus. Informal student group.', category: 'Temple Student Life', tags: ['student-life'], createdByStudentId: 'stu-marcus' }),
    ],
    communityMemberships: [
      ...s.communityMemberships,
      cm('cmem-9', 'com-fashion', 'stu-casey', 'founder'),
      cm('cmem-10', 'com-startup', 'stu-priya', 'founder'),
      cm('cmem-11', 'com-life', 'stu-marcus', 'founder'),
      cm('cmem-12', 'com-startup', 'stu-morgan'),
      cm('cmem-13', 'com-gaming', 'stu-devon'),
      cm('cmem-14', 'com-life', 'stu-jordan'),
    ],
    threads: [
      ...s.threads,
      thread({ id: 'thr-6', communityId: 'com-fashion', authorId: 'stu-casey', title: 'Best spots for thrifting in Philly?', body: 'Looking for places that are budget friendly and not too picked over.', createdAt: at('11-04', '13:00') }),
      thread({ id: 'thr-7', communityId: 'com-startup', authorId: 'stu-priya', title: 'Share your 3-minute pitch structure', body: 'What order do you cover problem, solution, ask?', createdAt: at('11-03', '15:00') }),
      thread({ id: 'thr-8', communityId: 'com-life', authorId: 'stu-marcus', title: 'Cheap eats near campus', body: 'Student-submitted tips only. Prices change, so double check.', createdAt: at('11-02', '12:00') }),
      thread({ id: 'thr-9', communityId: 'com-gaming', authorId: 'stu-devon', title: 'Game jam team forming', body: 'Need one artist and one sound person for the next jam.', createdAt: at('11-01', '20:00') }),
    ],
    threadReplies: [
      ...s.threadReplies,
      reply({ id: 'rep-6', threadId: 'thr-6', authorId: 'stu-riley', body: 'South Street has a few good ones. Go on a weekday.', createdAt: at('11-04', '14:00') }),
      reply({ id: 'rep-7', threadId: 'thr-7', authorId: 'stu-morgan', body: 'Problem, quick demo, ask. Keep the ask specific.', createdAt: at('11-03', '16:00') }),
      reply({ id: 'rep-8', threadId: 'thr-8', authorId: 'stu-jordan', body: 'Anything near the student center after 8 is a safe bet.', createdAt: at('11-02', '13:00') }),
      reply({ id: 'rep-9', threadId: 'thr-9', authorId: 'stu-sam', body: 'I can do sound if the jam is on a weekend.', createdAt: at('11-02', '09:00') }),
    ],
    projects: [
      ...s.projects,
      project({ id: 'proj-5', ownerId: 'stu-casey', title: 'Campus Style Zine', description: 'A printed zine of student fashion. Looking for photographers and a layout person for issue 2.', category: 'Design & Creative', skillsNeeded: ['photography', 'layout'], deadline: '2026-12-05' }),
      project({ id: 'proj-6', ownerId: 'stu-devon', kind: 'need-help', title: 'Study group scheduler app', description: 'Small web app to match study group times. Need help with UI design.', category: 'Technology', skillsNeeded: ['UI design', 'React'], deadline: '2026-12-12' }),
      project({ id: 'proj-7', ownerId: 'stu-priya', kind: 'need-help', title: 'Pitch deck review', description: 'Looking for honest feedback on a 10-slide deck before pitch night.', category: 'Business & Entrepreneurship', skillsNeeded: ['storytelling', 'finance'], deadline: '2026-11-17' }),
    ],
    projectMemberships: [
      ...s.projectMemberships,
      { id: 'pm-7', projectId: 'proj-5', studentId: 'stu-casey', role: 'Owner', status: 'active' },
      { id: 'pm-8', projectId: 'proj-5', studentId: 'stu-riley', role: 'Photographer', status: 'active', contributionSummary: 'Cover shoot' },
      { id: 'pm-9', projectId: 'proj-6', studentId: 'stu-devon', role: 'Owner', status: 'active' },
      { id: 'pm-10', projectId: 'proj-7', studentId: 'stu-priya', role: 'Owner', status: 'active' },
    ],
    tasks: [
      ...s.tasks,
      { id: 'task-5', projectId: 'proj-5', title: 'Pick cover photo', assigneeId: 'stu-riley', status: 'in-progress' },
      { id: 'task-6', projectId: 'proj-5', title: 'Outline issue 2 layout', assigneeId: 'stu-casey', status: 'todo' },
    ],
    collections: [
      ...s.collections,
      { id: 'col-4', ownerId: 'stu-casey', title: 'Zine inspiration', description: 'Layouts and colors I love.', visibility: 'public', itemIds: ['post-15', 'post-27'] },
      { id: 'col-5', ownerId: 'stu-devon', title: 'Game jam toolkit', visibility: 'public', itemIds: ['post-22'] },
    ],
    portfolioItems: [
      ...s.portfolioItems,
      { id: 'port-4', ownerId: 'stu-casey', title: 'Upcycled denim series', description: 'Six garments from thrifted materials.', category: 'Design', visibility: 'public' },
      { id: 'port-5', ownerId: 'stu-devon', title: '48-hour platformer', description: 'Game jam entry made with a team of four.', category: 'Apps & Websites', visibility: 'public' },
    ],
  }
}
