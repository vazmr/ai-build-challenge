# Copilot Development Instructions

These instructions govern Copilot's work in this repository. Product and technical decisions in `/docs` are the source of truth.

## 1. Before coding

1. Read `README.md` and all relevant documents in `/docs`.
2. Identify the current milestone in `PROTOTYPE_PRIORITIES.md`.
3. Summarize the files you intend to create or modify.
4. State assumptions and identify any ambiguity before implementation.
5. Do not redesign product behavior or invent missing requirements.

## 2. Locked technology decisions

Use:
- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide React
- LocalStorage for initial prototype persistence
- GitHub for version control
- Vercel as deployment target

Do not switch to Next.js, another framework, another CSS system or a hosted backend without explicit approval.

Do not add Supabase in the initial prototype. Keep repository interfaces backend-ready.

## 3. Architecture rules

- Use the feature-based folder structure in `COMPONENT_ARCHITECTURE.md`.
- Keep feature-specific UI and logic inside the relevant feature folder.
- Put genuinely reusable UI in shared components.
- UI components must not read or write LocalStorage directly.
- Access data through hooks/application services and repository interfaces.
- LocalStorage implementation belongs in the adapter layer.
- Keep business rules and permission checks out of presentational components.
- Use TypeScript types; avoid `any`.
- Prefer small, composable components.
- Avoid premature abstractions and unnecessary dependencies.

## 4. Product rules that must not be violated

- Mobile-first responsive app; one application across mobile, tablet and desktop.
- Primary navigation order: Map, Events, Feed, Community, Projects.
- Feed is the default destination.
- Demo accounts: Jordan, Taylor, Morgan and Alex.
- A student may have different roles in different organizations.
- Organization permissions are scoped to each organization.
- Following is private and one-way; no public follower/following counts or lists.
- No public like counts.
- Do not add Top 8 to profiles.
- Do not add generic Connect or generic Collaborate profile actions.
- Collaboration means actual confirmed work on a project.
- Project workspaces are private until the owner grants access by accepting a collaborator.
- Community groups are informal and distinct from official organizations.
- Public community followers do not automatically become founders or organization members.
- Private messages, files, membership records and organization channels must respect permissions.
- All seed content is fictional.
- Do not imply live Temple integration, official verification, real RSVP, real-time messaging or production AI.

## 5. LocalStorage rules

- Use one namespaced, versioned persistence strategy.
- Parse stored data defensively.
- Handle malformed, missing and outdated state.
- Initialize sample data on first launch.
- Persist relevant prototype changes across refreshes.
- Provide a reset/reseed function.
- Do not store passwords, authentication tokens or sensitive personal information.
- Do not access browser storage from render-time code in a way that causes hydration assumptions or inconsistent initial state.

## 6. Implementation workflow

For each assignment:
1. Confirm the goal and acceptance criteria.
2. Inspect existing files before changing them.
3. Propose a concise implementation plan.
4. Make the smallest coherent set of changes.
5. Run relevant checks (`npm run build`, type checks and tests if configured).
6. Fix errors caused by the changes.
7. Summarize changed files, behavior, validation results and known limitations.
8. Do not claim a check passed unless it was actually run.

Do not rewrite unrelated files or refactor the entire project during a focused task.

## 7. Credit-conscious behavior

- Do not repeatedly regenerate the same solution.
- Inspect existing code and errors before proposing fixes.
- Ask one targeted clarification when a product decision is genuinely unresolved.
- Prefer a concise plan followed by one implementation pass.
- Do not create elaborate speculative features beyond the assignment.
- Do not make broad changes when a targeted fix is sufficient.

## 8. First substantial assignment

The first substantial Copilot assignment is **application foundation setup only**.

Expected result:
- Create/configure the Vite + React + TypeScript application.
- Configure Tailwind CSS.
- Add React Router and Lucide React.
- Establish the documented folder structure.
- Create responsive application shell and primary navigation.
- Add placeholder route pages for the five primary destinations and supporting routes.
- Add simulated demo account switcher with the four named demo personas.
- Create typed domain/persistence scaffolding and versioned LocalStorage adapter.
- Seed fictional demo data minimally.
- Add reset/reseed control.
- Add basic permission utility scaffolding for organization/project access.
- Create README and ensure the docs folder is present.

Do not implement full feature functionality in this assignment. Do not add Supabase, real authentication, live Temple data, production messaging or AI integration.

### First assignment acceptance checklist
- App runs with `npm run dev`.
- `npm run build` succeeds.
- Responsive shell works on mobile/tablet/desktop.
- Primary navigation order is correct.
- Feed is default route.
- Demo account switcher changes active account.
- LocalStorage persists and reset/reseed works.
- Storage access is isolated behind the adapter/repository layer.
- No prohibited profile or social features have been introduced.
