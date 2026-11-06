import type { Project } from '../../types'

// Fictional demo copy. Covers are Unsplash photos (Unsplash License) loaded by URL.
const img = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1400&q=75`

export const PROJECT_EXTRAS: Record<string, Partial<Project>> = {
  'proj-1': {
    description: "A short documentary about student life, told by the students living it. We follow ten people through one ordinary day each, from first alarm to last light in the library, and cut them into a single honest portrait. Right now it is early planning, so what you join is shaped by who joins.",
    coverUrl: img('1625690303837-654c9666d2d0'),
    pitch: 'Ten students, ten ordinary days. One honest portrait of what student life really feels like.',
    commitment: 'Flexible · early planning',
    perks: ['Director and producer credits for the whole crew', 'A finished short for your reel'],
  },
  'proj-2': {
    description: "A weekly show about campus creators: the person running a radio show at 2 a.m., the student sewing their own line, the team building an app between classes. Each episode is a 30-minute conversation recorded in a campus studio. We have the format, the first guests and the recording time booked. We need a second voice and someone who loves making audio sound good.",
    coverUrl: img('1559523161-0fc0d8b38a7a'),
    pitch: 'Every week, one student making something you never knew existed on campus. We need a second voice and an ear for sound.',
    commitment: '3–4 hrs/week for 8 episodes',
    roles: [
      { title: 'Co-host', description: 'Sit across from the guest, keep the conversation moving and ask the questions the audience is thinking. No broadcast experience needed.' },
      { title: 'Audio editor', description: 'Cut, clean and publish a 30-minute episode each week. We’ll share a template so you are not starting from zero.' },
    ],
    perks: ['Your name on every episode', 'A published series to show in internship applications', 'Meet a new campus creator every week'],
  },
  'proj-3': {
    description: "I’m applying for summer internships and my portfolio site is the first thing recruiters will see. The work is there, but I can’t tell if the site shows it well. I’m looking for fresh eyes: people who will click around, tell me where they got confused and be honest about what feels off. It takes about half an hour and I’ll happily review yours back.",
    coverUrl: img('1496181133206-80ce9b88a853'),
    pitch: 'Internship applications are open and my portfolio site isn’t ready. I need a few honest eyes on it.',
    commitment: 'One 30-minute review',
    roles: [
      { title: 'UX reviewer', description: 'Click through the site as a recruiter would and tell me where you got lost.' },
      { title: 'Visual design eye', description: 'Flag type, spacing and color choices that feel off, and suggest what to try.' },
    ],
    perks: ['A thank-you credit on the site', 'Return feedback on your own work, happy to swap'],
  },
  'proj-4': {
    description: "Night Shift is a ten-minute thriller set on the last bus of the night, shot over two weekends. Picture and story are in good shape. What it needs is a sound designer to make the dark feel alive: engine hum, distant sirens, the thing you hear behind you. You’d work directly with the director on every scene.",
    coverUrl: img('1586165877141-3dbcfc059283'),
    pitch: 'A ten-minute thriller set on the last bus of the night. It looks great. Now it needs to sound terrifying.',
    commitment: '2 shoot weekends, then ~5 hrs/week in post',
    roles: [
      { title: 'Sound designer', description: 'Build the ambience, foley and final mix from scratch. You own how every scene feels.' },
    ],
    perks: ['Sound design credit on festival submissions', 'Work alongside the film’s director and producer', 'A mix you can put straight into your reel'],
  },
  'proj-5': {
    description: "Campus Style Zine is a printed magazine about how students really dress, from thrift flips to full looks. Issue 1 got passed around the whole floor. For issue 2 we’re planning four editorials and a bigger layout, and we need people who see things visually to help us pull it off.",
    coverUrl: img('1525247663235-1d5a3ae627fd'),
    pitch: 'Issue 2 of a printed zine about how students actually dress. We have the styling, we need the pictures and the page.',
    commitment: 'About 4 hrs/week for 5 weeks',
    roles: [
      { title: 'Photographer', description: 'Shoot four short editorials around campus and Center City, with styled looks already planned.' },
      { title: 'Layout designer', description: 'Turn photos and words into a 24-page printed zine. Experience in any layout tool is enough.' },
    ],
    perks: ['Byline on every page you touch', 'Printed copies to keep', 'A real publication for your portfolio'],
  },
  'proj-6': {
    description: "Four people, four timetables, forty messages to find one free hour. This small web app matches study group times automatically. The matching logic already works. What it lacks is a clean interface that makes people want to use it, and a second pair of hands on the front end.",
    coverUrl: img('1498050108023-c5249f4df085'),
    pitch: 'Finding a time when four people are free shouldn’t take forty messages. The logic works, it just needs to look and feel good.',
    commitment: '2–3 hrs/week for a month',
    roles: [
      { title: 'UI designer', description: 'Design the three core screens so a group can agree on a time in under a minute.' },
      { title: 'React developer', description: 'Help turn the designs into components and review pull requests together.' },
    ],
    perks: ['Co-credit on a shipped app', 'Real feedback from students who’ll use it', 'Open-source commit history'],
  },
  'proj-7': {
    description: "I’m pitching a snack startup at pitch night in two weeks and I have a ten-slide deck I’ve stared at for too long. I need people who haven’t seen it to tell me honestly where the story lags and which numbers don’t convince. Twenty minutes of your time could change how the room reacts.",
    coverUrl: img('1505373877841-8d25f7d46678'),
    pitch: 'Pitch night is in two weeks. I need people who will tell me which slide loses the room.',
    commitment: 'One 20-minute review',
    roles: [
      { title: 'Storytelling coach', description: 'Tell me where the story drags and what the first 30 seconds should say.' },
      { title: 'Finance sanity check', description: 'Look at the numbers slide and poke holes in the assumptions.' },
    ],
    perks: ['Front-row seat to the pitch', 'A mention in the finished deck'],
  },
}
