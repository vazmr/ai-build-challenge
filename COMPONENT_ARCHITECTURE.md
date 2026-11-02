# Component Architecture

## 1. Architectural goals

- Feature-based organization.
- Reusable shared UI.
- Strong TypeScript types.
- UI components must not read/write LocalStorage directly.
- Keep data access behind repository interfaces.
- Make the persistence adapter replaceable by a future Supabase adapter.
- Keep permissions and business rules out of presentation-only components.

## 2. Proposed stack

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide React
- LocalStorage adapter
- Vercel deployment

Do not add a backend or Supabase dependency to the initial prototype unless explicitly approved.

## 3. Suggested project structure

```text
temple-student-hub/
├── public/
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── router.tsx
│   │   └── providers/
│   ├── assets/
│   ├── components/
│   │   ├── navigation/
│   │   ├── layout/
│   │   ├── cards/
│   │   ├── forms/
│   │   └── shared/
│   ├── features/
│   │   ├── feed/
│   │   ├── events/
│   │   ├── map/
│   │   ├── community/
│   │   ├── projects/
│   │   ├── organizations/
│   │   ├── profiles/
│   │   ├── resources/
│   │   ├── assistant/
│   │   ├── calendar/
│   │   ├── notifications/
│   │   └── settings/
│   ├── services/
│   ├── repositories/
│   ├── adapters/
│   │   └── local-storage/
│   ├── contexts/
│   ├── hooks/
│   ├── types/
│   ├── utils/
│   ├── data/
│   │   ├── seed/
│   │   └── demo/
│   └── styles/
├── docs/
├── .github/
│   └── copilot-instructions.md
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

Feature folders should own feature-specific components, hooks, types and service logic where appropriate. Shared components belong in `components/`.

## 4. Dependency direction

Preferred flow:

`Page / UI → feature hook or application service → repository interface → storage adapter`

- UI components render state and emit user actions.
- Hooks/application services coordinate workflows and business rules.
- Repository interfaces define data operations.
- LocalStorage adapter implements repository interfaces.
- Seed data initializes the demo environment.

A future Supabase adapter should implement the same interfaces where practical. UI should not need to know which adapter is active.

## 5. State management

Start with React state/context and focused hooks. Do not introduce a large state-management library without a demonstrated need.

Separate:
- Session/demo account state
- Feature data state
- Temporary UI state (dialogs, filters, tabs)
- Persisted domain data

Do not store derived values redundantly when they can be computed.

## 6. Routing and layouts

Use React Router. Build a shared responsive app shell with:
- Header
- Primary navigation
- Main content outlet
- Optional contextual panels

Use route-level feature pages and nested routes for complex project and organization workspaces.

## 7. Error and empty states

Every major feature should include:
- Loading state if applicable
- Empty state with a useful next action
- Error state with understandable language
- Permission-denied state
- Confirmation for destructive or consequential actions

## 8. Testing expectations

At minimum, manually verify:
- App starts and builds without TypeScript errors.
- All primary routes load.
- Responsive navigation works at mobile/tablet/desktop widths.
- Demo account switching updates role-dependent controls.
- LocalStorage data survives refresh.
- Reset/reseed restores sample state.
- Users cannot see organization/project content outside their permissions.
- No feature component directly accesses LocalStorage.
