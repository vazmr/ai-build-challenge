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
