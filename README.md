# Temple Student Hub — Project Blueprint

**Tagline:** The campus experience, connected.

This documentation is the product and technical source of truth for the initial Temple Student Hub prototype. Read these documents before implementing features.

## Locked technical foundation

- React + TypeScript + Vite
- Tailwind CSS
- React Router
- Lucide React icons
- Feature-based project structure
- Browser LocalStorage for prototype persistence
- Repository interfaces and adapters to keep storage replaceable
- Simulated student accounts and organization-scoped roles
- GitHub for version control
- VS Code + GitHub Copilot for implementation
- Vercel for deployment
- Supabase is a future backend, not part of the initial prototype

## Read in this order

1. `PRODUCT_REQUIREMENTS.md` — product purpose, users, scope and principles.
2. `FEATURE_SPECIFICATIONS.md` — behavior and requirements for each feature.
3. `NAVIGATION_AND_FLOWS.md` — information architecture and key user journeys.
4. `DESIGN_SYSTEM.md` — visual and responsive design rules.
5. `COMPONENT_ARCHITECTURE.md` — React architecture, folder structure and implementation boundaries.
6. `DATA_MODELS.md` — TypeScript-oriented domain model and persistence requirements.
7. `PROTOTYPE_PRIORITIES.md` — build sequence, acceptance criteria and scope control.
8. `COPILOT_INSTRUCTIONS.md` — how Copilot must approach implementation.

## Product definition

Temple Student Hub is a mobile-first student community and engagement platform that helps Temple students discover people, opportunities, organizations, events, resources and projects in one connected experience.

The platform is not simply a directory or event calendar. Its central value is helping students find their people, get involved and stay connected.

## Prototype limitations

The first prototype uses fictional seed data and simulated accounts. It is not connected to Temple systems, Temple's live directory, OwlConnect, live event registration, real authentication, or a production backend. Do not represent sample organizations or events as officially verified Temple records.

## Getting started

Requires Node 20+.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
npm run lint
```

## Current status

All four tiers in `PROTOTYPE_PRIORITIES.md` (P0 to P3) are implemented as a clickable prototype with fictional data.

- **Feed, Events, Community, Projects, Profiles (P1):** see the feature specs. Highlights: recency-only feed with no public like or follower counts, simulated RSVP, informal community groups with distinct follow / join / participate states, private projects that only accepted members can open, profiles with exactly four derived metrics and per-section visibility.
- **Organizations (P2):** directory and profile (demo-labeled, never "verified"), Follow / I'm Interested / Ask a Question / Request to Join, and a role-aware workspace. Tabs appear only when the signed-in student holds the explicit organization-scoped permission: Applications, Members (role changes, deactivate, transfer presidency), Board chat, Invitations, Student Inquiries shared inbox (New / Assigned / Replied / Closed), announcements and member chat. Cross-organization collaboration (invite, accept or decline, shared file names, revoke, separate activity logs) and the community formation pathway (private founding workspace, explicit founder acceptance, no implied recognition).
- **Messaging:** private 1:1 messages (from a profile's Message button, listed at `/messages`), project team chat, organization chats. Access is checked per conversation.
- **Supporting experience (P3):** illustrative Map with layers and pins (no location access), Resources directory with "I need help with…", scripted AI Campus Assistant with a sources/trust panel, Saved Items, notifications with unread badge, announcements, route error and not-found pages.

Also included: generated placeholder artwork, a desktop discovery rail, a feed composer, blog drafts/pins/archive/comments, collections and portfolio editors, profile theme and section order, private blocking, project milestones/files/credits/completion, "I can help" posts, community announcements, collaboration requests and resource shares, organization events, topic channels, member DMs, month calendar, and an expanded Settings & Privacy page.

Known limits: everything is simulated and local to the browser. Resources are demo placeholders with no invented hours, eligibility or contacts. File sharing stores names only. The About tab doesn't yet have "things to explore" or conversation prompts. Collaborative collection invitations and org-to-org shared chat are not built.

Notes:
- UI never touches LocalStorage; it goes through `AppStateContext` → `AppStateRepository` → `adapters/local-storage`. Business rules live in `src/services/` as pure functions.
- Storage key: `temple-student-hub:v5`. Bump `SCHEMA_VERSION` in `src/data/seed` when the persisted shape changes.
- Demo personas: Jordan (general student), Taylor (org member), Morgan (org officer), Alex (org admin).
- `.github/copilot-instructions.md` mirrors `COPILOT_INSTRUCTIONS.md` so Copilot picks it up automatically.
