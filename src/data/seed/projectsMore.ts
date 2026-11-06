import type { PersistedAppState, Project, ProjectMembership, ProjectMilestone, ProjectTask } from '../../types'

// ALL SEED CONTENT IS FICTIONAL. Extra projects that fill the "Find Help" and "My Projects" tabs.
// Covers are Unsplash photos (Unsplash License) loaded by URL; a generated cover is used if one fails.
const NOW = '2026-11-01T12:00:00.000Z'
const img = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1400&q=75`

const project = (p: Partial<Project> & Pick<Project, 'id' | 'ownerId' | 'title' | 'description' | 'category'>): Project => ({
  kind: 'collaborators', skillsNeeded: [], status: 'recruiting', isPublished: true, createdAt: NOW, updatedAt: NOW, ...p,
})
const member = (id: string, projectId: string, studentId: string, role: string, contributionSummary?: string): ProjectMembership =>
  ({ id, projectId, studentId, role, status: 'active', ...(contributionSummary ? { contributionSummary } : {}) })

const PROJECTS: Project[] = [
  // ---- Find Help: students asking for a hand ----
  project({
    id: 'proj-8', ownerId: 'stu-alex', kind: 'need-help', category: 'Technology', deadline: '2026-11-20',
    title: 'Beta testers for our film-festival site',
    description: 'We are launching a ticketing page for the student film festival and need real people to try it on their phones before it goes live.',
    skillsNeeded: ['QA testing', 'UX feedback'],
    coverUrl: img('1517694712202-14dd9538aa97'),
    pitch: 'Try to buy a festival ticket on your phone and tell us the exact moment you got confused.',
    commitment: 'One 30-minute session',
    roles: [
      { title: 'Phone tester', description: 'Walk through browsing films and “buying” a ticket on your own phone. Screen-record if you can, and say what you expected to happen.' },
      { title: 'Accessibility check', description: 'Try the page with a screen reader or keyboard only and note anything you cannot reach or understand.' },
    ],
    perks: ['Free festival pass for every tester', 'Named in the site credits', 'Your feedback ships before opening night'],
  }),
  project({
    id: 'proj-9', ownerId: 'stu-riley', kind: 'offer-help', category: 'Design & Creative',
    title: 'Photo editing coaching, no experience needed',
    description: 'Free short coaching sessions on editing phone and camera photos so they look like you meant it.',
    skillsNeeded: ['photography', 'Lightroom'],
    coverUrl: img('1452860606245-08befc0ff44b'),
    pitch: 'Bring one photo you like and one you are not sure about. We will make both better together.',
    commitment: '45-minute sessions, Thursdays',
    roles: [
      { title: 'Editing basics', description: 'Exposure, color and crop in Lightroom or a free phone app, using your own photos.' },
      { title: 'Portfolio shot list', description: 'Plan eight frames for a portfolio or zine page, then review them together.' },
    ],
    perks: ['Free, no strings, students helping students', 'Leave with a preset you can reuse', 'Optional feature in the next campus zine'],
  }),
  project({
    id: 'proj-10', ownerId: 'stu-devon', kind: 'offer-help', category: 'Technology',
    title: 'Debugging hours for homework and side projects',
    description: 'Stuck on a bug for more than an hour? Bring it. Open pairing sessions for React, TypeScript, Python and Git.',
    skillsNeeded: ['React', 'TypeScript', 'Git'],
    coverUrl: img('1516321318423-f06f85e504b3'),
    pitch: 'Two heads, one terminal. Most bugs are a five-minute fix once someone else is looking.',
    commitment: 'Drop in, 30–60 minutes',
    roles: [
      { title: 'React and TypeScript help', description: 'Component state, hooks, types that will not compile. Bring the error message.' },
      { title: 'Git rescue', description: 'Merge conflicts, lost commits, “I pushed to the wrong branch”. We will sort it out calmly.' },
    ],
    perks: ['Pairing, not lectures: you keep the keyboard', 'Learn how to debug, not only this one bug'],
  }),
  project({
    id: 'proj-11', ownerId: 'stu-sam', kind: 'need-help', category: 'Music', deadline: '2026-11-25',
    title: 'Voices for the campus radio station promos',
    description: 'We are recording a set of short station promos and want a mix of student voices instead of just ours.',
    skillsNeeded: ['voice acting', 'sound check'],
    coverUrl: img('1511671782779-c97d3d27a1d4'),
    pitch: 'Ten seconds each, say a line, hear yourself on air all semester.',
    commitment: 'One 20-minute recording slot',
    roles: [
      { title: 'Voice for promos', description: 'Read three short lines in your own voice. No acting experience needed, just be yourself.' },
      { title: 'Sound check helper', description: 'Sit in the booth, listen for pops and room noise, and give a thumbs up or down.' },
    ],
    perks: ['Your voice on rotation', 'A tour of the booth', 'First pick of guest DJ slots'],
  }),

  // ---- My Projects (Jordan): one you run, one you joined, one you finished ----
  project({
    id: 'proj-12', ownerId: 'stu-jordan', category: 'Design & Creative', status: 'active', deadline: '2026-12-08',
    title: 'Freshman Field Guide',
    description: 'A one-page, illustrated guide to surviving the first semester, written by first-years for first-years.',
    skillsNeeded: ['illustration', 'writing'],
    coverUrl: img('1522202176988-66273c2fd55f'),
    pitch: 'Everything I wish someone had told me in week one, in one page you will actually keep.',
    commitment: 'About 2 hrs/week for 4 weeks',
    roles: [
      { title: 'Illustrator', description: 'Draw six small spot illustrations for the sections. Any style that feels friendly works.' },
      { title: 'Writer', description: 'Turn rough notes into short, funny, honest tips of about 40 words each.' },
    ],
    perks: ['Byline and credit on the guide', 'Printed copies for orientation tables'],
  }),
  project({
    id: 'proj-13', ownerId: 'stu-morgan', category: 'Media & Production', status: 'completed', isPublished: true,
    title: 'Welcome Week Recap Video',
    description: 'A two-minute recap video of Welcome Week, shot by four students over one weekend.',
    skillsNeeded: ['video editing'],
    coverUrl: img('1523240795612-9a054b0db644'),
    pitch: 'Finished and shown at the fall mixer. Two minutes, four editors, one very long weekend.',
    commitment: 'Completed',
    perks: ['Credited on the published video', 'A finished piece for your reel'],
  }),
]

const MEMBERSHIPS: ProjectMembership[] = [
  member('pm-s1', 'proj-8', 'stu-alex', 'Owner'),
  member('pm-s2', 'proj-9', 'stu-riley', 'Owner'),
  member('pm-s3', 'proj-10', 'stu-devon', 'Owner'),
  member('pm-s4', 'proj-11', 'stu-sam', 'Owner'),
  member('pm-s5', 'proj-12', 'stu-jordan', 'Owner'),
  member('pm-s6', 'proj-12', 'stu-casey', 'Illustrator'),
  member('pm-s7', 'proj-2', 'stu-jordan', 'Co-host'),
  member('pm-s8', 'proj-13', 'stu-morgan', 'Owner'),
  member('pm-s9', 'proj-13', 'stu-jordan', 'Editor', 'Cut the final two-minute recap and color-corrected the footage'),
  member('pm-s10', 'proj-13', 'stu-riley', 'Photographer', 'Shot the b-roll for the opening'),
]

const TASKS: ProjectTask[] = [
  { id: 'task-s1', projectId: 'proj-12', title: 'Write the “first week” section', assigneeId: 'stu-jordan', status: 'in-progress' },
  { id: 'task-s2', projectId: 'proj-12', title: 'Sketch six spot illustrations', assigneeId: 'stu-casey', status: 'todo' },
  { id: 'task-s3', projectId: 'proj-12', title: 'Collect tips from five first-years', assigneeId: 'stu-jordan', status: 'done' },
  { id: 'task-s4', projectId: 'proj-2', title: 'Prepare three interview questions', assigneeId: 'stu-jordan', status: 'todo' },
  { id: 'task-s5', projectId: 'proj-13', title: 'Export final cut', assigneeId: 'stu-jordan', status: 'done' },
]

const MILESTONES: ProjectMilestone[] = [
  { id: 'ms-s1', projectId: 'proj-12', title: 'Draft copy done', dueAt: '2026-11-18', done: false },
  { id: 'ms-s2', projectId: 'proj-12', title: 'Illustrations in', dueAt: '2026-11-30', done: false },
  { id: 'ms-s3', projectId: 'proj-13', title: 'Premiere at the fall mixer', dueAt: '2026-10-24', done: true },
]

export function withMoreProjects(s: PersistedAppState): PersistedAppState {
  return {
    ...s,
    projects: [...s.projects, ...PROJECTS],
    projectMemberships: [...s.projectMemberships, ...MEMBERSHIPS],
    tasks: [...s.tasks, ...TASKS],
    milestones: [...s.milestones, ...MILESTONES],
  }
}
