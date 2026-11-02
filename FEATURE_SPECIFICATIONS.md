# Feature Specifications

This document defines expected behavior for the initial prototype. All data is fictional and local to the browser.

## 1. Feed

A mixed-media social feed for student expression and campus discovery—not a short-video-only feed.

### Content types
- Text/status posts, questions and campus updates
- Photos and albums
- Short- and long-form video placeholders
- Audio, music, podcasts, interviews and demos
- Links and resources
- Quote posts (copyright-safe)
- Discussion prompts and long-form writing
- Campus events and promotions
- Organization posts and page previews
- Creative work and shared collections
- Project opportunities and highlights
- Campus resource recommendations

### Feed modes
- **For You:** selected interests, followed topics and behavioral relevance.
- **Following:** content from followed students and organizations.
- **Discover:** new creators, topics and communities.

Use fair surfacing. Do not rank only by popularity. Provide controls to hide a post, mark not interested, edit interests and reset recommendations.

### Interactions
Comment, save privately, share, follow a profile or organization, and RSVP where relevant. Do not show public like counts, follower counts or public follower/following lists.

### Tags
Suggest existing curated tags where possible, allow custom tags, and make tags useful discovery paths across posts, collections, projects, portfolios, communities and events.

## 2. Map

Purpose: “What is happening around me, and where can I find it?”

- Search buildings, places and events.
- Show an illustrative map with interactive pins and a nearby discovery panel.
- Layers: Study, Dining, Events, Resources, Organizations, Technology, Campus Life and Other.
- Example landmarks: Howard Gittis Student Center, Charles Library, TECH Center and Tuttleman Learning Center.
- Map data is illustrative. Do not request or imply live location access.
- Do not claim live availability, operating hours or food-cart wait times.

## 3. Events

### Views
- Discover
- My Events
- Calendar

### Discovery
Search events, organizations and activities. Filters include campus, all events and free. Categories:
- Music & Entertainment
- Arts & Culture
- Social
- Academic
- Professional
- Sports & Recreation
- Community Service
- Food & Freebies

Show a **Happening Today** horizontal strip near the top.

### Event details
Show description, host, date/time, location and price, with Save and RSVP actions. My Events tracks saved and going states. Calendar supports month, list and agenda views.

RSVP is simulated; do not imply real registration.

### Fictional seed events
- WHIP Radio Live — Fri Nov 6, 2026, 6–9 PM, Howard Gittis Student Center, free.
- Student Art Showcase — Sat Nov 7, 2026, 12–4 PM, Charles Library, free.
- Music Producers Meetup — Mon Nov 9, 2026, 5:30–7 PM, TECH Center, free.
- Creative Careers & Networking — Wed Nov 11, 2026, 3–5 PM, Annenberg Hall, free.

These are fictional examples, not verified Temple events.

## 4. Community

An open, interest-based discussion space with the feel of classic message boards.

- Student-created interest groups.
- Threaded discussions, questions and replies.
- Public group announcements.
- Shared media and resources.
- Collaboration requests.
- Search, categories and tags.

Example categories: Music & Music Production, Film & Media, Fashion & Style, Gaming, Entrepreneurship, Temple Student Life, Photography & Visual Arts, Study Groups, Philadelphia Events & Culture.

Community groups are informal student-created interest spaces, not automatically official Temple clubs.

## 5. Projects & Collaborations

This is a peer collaboration space, not a freelance marketplace.

### Main areas
1. **Find Help:** students request or offer specific help.
2. **Find Collaborators:** discover project ideas and join teams.
3. **My Projects:** manage active teams, tasks, files, conversations and milestones.

### Post types
- I can help — skill, details and availability.
- I need help — project description, category and deadline.
- Looking for collaborators — roles, skills, timeline and commitment.

Categories: Media & Production, Design & Creative, Technology, Business & Entrepreneurship, Music, Academic & Research.

### Project lifecycle
A student can create a private project workspace immediately, then choose whether to publish an opportunity. Interested students request to join; the owner approves them. Accepted collaborators gain access to the relevant workspace.

### Workspace
- Team members and roles
- Tasks and progress
- Private project conversation
- Shared files/documents (prototype placeholders/local metadata only)
- Schedule and milestones
- Contributor credits
- Archive

Do not include rates, bidding or purchasing services. Encourage clear ownership and credit. Academic collaboration must not facilitate cheating.

## 6. Student profiles

Profiles combine social identity, creative expression, blogging, visual curation and collaboration history. They are not LinkedIn-style resumes.

### Identity
Profile photo, cover image, name, major, college, class year, bio, optional links and demo verification indicator.

### Exactly four prominent public metrics
- Organizations
- Projects
- Events attended
- Collaborations

Definitions:
- Organizations = active memberships.
- Projects = accepted role or contribution.
- Events attended = confirmed attendance.
- Collaborations = actual shared project working relationships/contributions.

Metrics are clickable and subject to visibility controls. Do not add follower counts or public following counts.

### Sections and tabs
- Overview
- My Blog
- Collections
- Portfolio
- Collaborations
- About

**My Blog:** original posts only; text, photo, video, audio, link, quote, discussion and long-form formats; tags, archives, drafts, pinned posts, comments and visibility controls. Do not implement reblogging.

**Collections:** visual boards for original/public student content, links, resources, inspiration and recommendations. Support collaborative invitations and permissions.

**Portfolio:** optional finished work such as photography, graphic design, music/audio, film/video, writing, apps/websites, research and entrepreneurship. Include roles, credits, skills and links.

**Collaborations:** active/completed projects and history, based on real confirmed contributions.

**About:** interests, skills, things to learn/explore, conversation prompts and optional profile details.

### Customization and privacy
Allow theme/accent color, cover/background, section order, layout choices and per-section visibility. Respect accessibility contrast and legibility. Visibility levels: public, Temple-only (simulated) and private.

### Profile actions
Follow (private one-way relationship), Message, project-specific invitation and contextual collection invitation/comment. Do not add a generic Connect or generic Collaborate button. Do not add a Top 8 feature.

## 7. Follow, message and collaborate semantics

- **Follow:** privately subscribe to eligible public content. One-way; no public lists/counts.
- **Message:** private communication.
- **Join a project:** request to contribute to a specific project; owner approval required.
- **Collaborate:** only describes actual work on a project with confirmed contribution.

Following does not grant access to private content or project workspaces. Collaboration does not automatically create a follow relationship.

## 8. Organizations

Organizations are distinct from informal Community groups.

### Organization profile
Show cover, logo, name, demo verification state, tags, description, sample counts, pinned announcement and tabs such as Overview, Events and About.

Student-facing actions may include Follow, I'm Interested, Ask a Question and Request to Join. Do not show public follower counts.

### Role-based workspace
Roles may include President, VP, Treasurer, Secretary, Board Member, Moderator and Member. Permissions must be explicit and scoped to that organization; a title alone must not imply every administrative permission.

### Membership management
Prototype screens may include Applications, Members, Board and Invitations. Simulate accept/decline, filtering, role changes, deactivation, transfers and invitations.

### Organization messaging
- Board Chat
- Member Chat
- Announcements
- DMs
- Student Inquiries shared inbox
- Project conversations
- Custom channels/topic boards

Board members must not automatically see all private DMs. Regular members must not access Board Chat or shared inquiries unless explicitly authorized. Inquiry statuses: New, Assigned, Replied and Closed.

### Inter-organization collaboration
Support discovering demo organizations, inviting another organization, accepting/declining, creating shared projects, sharing files with permissions and maintaining separate conversations/activity logs. Access must be revocable.

### Formation pathway
Public interest community → private founding workspace → official organization recognition.

Public followers do not automatically become founders or members. Founders explicitly accept invitations. Private founding conversations, drafts, roles and documents remain restricted. Recognition is not automatic; the university determines official status. Never imply the app approves or registers an organization.

Temple recognition guidance must be checked against current official Temple sources before any live release.

## 9. Resources

A directory and support navigator.

- Search services, support and opportunities.
- “I need help with…” entry point.
- Categories: Academic, Career, Wellness, Financial, Campus Life and All Resources.
- Cards should include description, eligibility, cost, access method, official link/contact and location only when verified.
- Physical resources can link to the Map; online services link to official pages.
- Do not invent Temple policies, eligibility, hours or contacts.

## 10. AI Campus Assistant

Search-first for specific questions and personalized discovery for recommendations.

- Use verified sources and show source/trust context and last-updated information when available.
- Distinguish official information from student-submitted content.
- Do not hallucinate university policy, hours or availability.
- Never expose private organization conversations, membership lists, messages or confidential files.
- Require confirmation for account-changing actions.

Initial prototype uses scripted/simulated responses, not a live AI model.
