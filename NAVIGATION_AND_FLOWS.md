# Navigation and User Flows

## 1. Global information architecture

### Primary navigation
Mobile bottom navigation, in this order:
1. Map
2. Events
3. Feed
4. Community
5. Projects

Feed is the default landing screen and receives the central visual emphasis.

### Global header
- My Campus Calendar shortcut (opens the student's calendar, not event discovery)
- Announcements
- Notifications
- More menu

### More menu
- My Profile
- Resources
- Saved Items
- Settings & Privacy

Organization profiles/workspaces are reached through search, feed content, Community links and profile discovery. The AI Campus Assistant is available through Resources/contextual entry points.

## 2. Responsive navigation

- Mobile: bottom navigation and compact header.
- Tablet: adaptive navigation; use available width without crowding.
- Desktop: persistent sidebar or expanded navigation with a content workspace.
- Keep destinations and route meaning consistent across sizes.

## 3. Primary student journeys

### A. New student discovers a community
1. Open Feed or Community.
2. Browse suggested topics/groups.
3. Open a community.
4. Read public discussions and group information.
5. Follow or participate.
6. If a project opportunity is relevant, open the project and request to join.

Following a community does not automatically create organization membership.

### B. Student discovers and RSVPs to an event
1. Open Events or tap an event card in Feed/Map.
2. Search or filter.
3. Open event details.
4. Save or RSVP.
5. Find it under My Events and the personal campus calendar.

RSVP is a prototype state only.

### C. Student creates a project
1. Open Projects.
2. Choose Find Help, Find Collaborators or My Projects.
3. Create a project with title, description, category, skills/roles and timeline.
4. A private owner workspace is created.
5. Owner chooses whether to publish the opportunity.
6. Other students request to join.
7. Owner accepts or declines.
8. Accepted collaborators gain workspace access.
9. Team coordinates tasks, milestones and contributions.
10. Archive the project when complete.

### D. Student follows a profile
1. Discover a student through Feed, Community, Projects or search.
2. Open profile.
3. Review public sections and privacy settings.
4. Follow.
5. Eligible public content may appear in Following.

Following is private and one-way; it does not grant private access.

### E. Student requests to join an organization
1. Discover organization profile.
2. Review public information and events.
3. Choose Request to Join or Ask a Question.
4. Organization officers/admins review the request in Applications.
5. Approve or decline.
6. Approved student receives member-level access according to permissions.

### F. Organization officer manages membership
1. Switch to an account with the relevant organization role.
2. Open that organization's workspace.
3. Review Applications.
4. Accept/decline requests.
5. Manage Members, Board and Invitations according to assigned permissions.
6. Changes are scoped to that organization and represented in the local demo state.

### G. Student seeks a resource
1. Open More → Resources or use the assistant.
2. Search a need or choose “I need help with…”
3. Review relevant resource cards.
4. Follow verified official link or view location details.
5. If using simulated assistant responses, review the source/trust panel.

## 4. Route suggestions

Use React Router. Exact route names may be refined during implementation, but preserve clear feature boundaries.

- `/feed`
- `/map`
- `/events`
- `/community`
- `/projects`
- `/projects/:projectId`
- `/profile/:userId`
- `/organizations/:organizationId`
- `/organizations/:organizationId/workspace`
- `/resources`
- `/assistant`
- `/saved`
- `/calendar`
- `/announcements`
- `/notifications`
- `/settings`

## 5. Navigation behavior rules

- The Feed is the default route after entering the simulated app.
- Header calendar shortcut opens My Campus Calendar.
- Events navigation opens event discovery, not the personal calendar.
- A project link opens the project detail/workspace appropriate to the current user's access.
- Unauthorized organization/project views must show a clear access state, not private content.
- Back navigation should preserve useful search/filter context where practical.
