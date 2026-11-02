# Prototype Priorities and Acceptance Criteria

## 1. Delivery strategy

Build a coherent, clickable end-to-end prototype rather than shallow mockups of every feature. Establish the application shell and architecture first, then deliver primary student journeys.

## 2. Priority tiers

### P0 — Foundation (must work)
- Vite + React + TypeScript project setup.
- Tailwind configured and design tokens established.
- Responsive app shell and primary navigation.
- Route structure and placeholder pages.
- Simulated account switcher.
- LocalStorage repository layer with versioned state.
- Fictional seed data and reset/reseed control.
- Basic permission-check utilities.
- README and Copilot instructions.

### P1 — Core student experience
- Feed with modes, sample mixed-media cards and basic interactions.
- Events discovery, details, save/RSVP and My Events.
- Community discovery and discussion threads.
- Projects discovery, creation, join requests and workspace access states.
- Student profile with Overview, Blog, Collections, Portfolio, Collaborations and About.
- Responsive mobile/tablet/desktop layouts.

### P2 — Organization experience
- Organization profile.
- Applications, Members, Board and Invitations.
- Role-aware organization workspace.
- Organization messaging and inquiry inbox.
- Cross-organization collaboration simulation.
- Formation pathway screens.

### P3 — Supporting experience and polish
- Map with illustrative pins and layers.
- Resources directory.
- Scripted AI Campus Assistant and source/trust panel.
- Saved Items, notifications and announcements.
- Accessibility, empty states, error states and interaction polish.

The map, assistant and organization admin experiences may be visually represented early, but do not let them delay a working foundation and core student journeys.

## 3. Foundation acceptance criteria

The foundation milestone is complete when:
- `npm run dev` starts successfully.
- `npm run build` completes without errors.
- TypeScript checks pass.
- The app renders a responsive shell at mobile, tablet and desktop widths.
- All five primary navigation destinations load.
- Demo account switching works.
- LocalStorage persists demo changes after refresh.
- Reset/reseed restores known sample data.
- UI components do not directly access LocalStorage.
- No real credentials or sensitive information are stored.
- There is no unapproved backend dependency.

## 4. Feature acceptance criteria

### Feed
- Feed is the default destination.
- For You, Following and Discover can be switched.
- Cards support relevant sample content types.
- Save/follow/comment controls update simulated state.
- No public follower counts or public like counts.

### Events
- Search and filters update visible events.
- Event detail opens from cards.
- Save and RSVP states persist.
- My Events reflects saved/going events.
- Sample events are visibly demo content.

### Community
- Students can browse groups and open discussions.
- Thread detail displays replies.
- Follow/join/participation states are distinct.
- Informal groups are not represented as official clubs.

### Projects
- A student can create a project.
- New project starts private.
- Owner can publish a recruiting opportunity.
- Another student can request to join.
- Owner can accept/decline.
- Only accepted members can access the private workspace.
- Tasks and membership changes persist.

### Profiles
- Four prominent metrics only: Organizations, Projects, Events attended, Collaborations.
- No Top 8, follower counts, Connect or generic Collaborate button.
- Profile sections respect visibility settings.
- Follow is one-way and private.

### Organizations
- Organization context is explicit.
- Switching roles changes only permissions for that organization.
- Regular members cannot access board-only areas.
- Private inquiry and DM content is restricted.
- Public community participation does not automatically make someone a founder/member.

## 5. Definition of done for each feature

A feature is not done merely because its page looks complete. It must have:
- A clear entry point and navigation path.
- Responsive layout.
- Correct role/access behavior.
- Useful empty and error states.
- Working interactions for the prototype scope.
- Persisted state where required.
- Fictional/demo labeling where necessary.
- No unsupported claims about Temple systems or policies.

## 6. Scope control

Do not add features, packages, external services or architectural layers without a documented reason. When requirements conflict, stop and ask for clarification rather than silently inventing product behavior.
