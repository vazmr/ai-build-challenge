# Design System

## 1. Visual direction

A clean, contemporary, student-centered interface. The experience should feel social, creative, welcoming and organized—not like an administrative portal.

### Brand foundation
- Temple cherry red: `#A71930`
- White: `#FFFFFF`
- Neutral surfaces: warm/cool light neutrals as appropriate
- Charcoal typography for primary text

Use red as an accent for primary actions, active states and key highlights. Do not flood every surface with red.

## 2. Layout principles

- Mobile-first, responsive layouts.
- Clear visual hierarchy and generous spacing.
- Cards should be scannable, with consistent radius, spacing and metadata.
- Avoid dense dashboards on mobile.
- Use progressive disclosure for complex organization/project administration.
- Keep primary actions visible and unambiguous.
- Avoid unnecessary decorative gradients, excessive shadows and visual clutter.

## 3. Typography

Use a highly legible modern sans-serif system stack or a carefully chosen web-safe font. Establish a consistent scale for:
- Display/page titles
- Section headings
- Card titles
- Body text
- Supporting metadata
- Labels and helper text

Maintain readable line lengths and adequate contrast.

## 4. Color tokens

Define reusable CSS variables or Tailwind theme tokens rather than scattering raw values.

Suggested semantic tokens:
- `brand`: Temple cherry red `#A71930`
- `brand-foreground`: white
- `background`: app canvas
- `surface`: cards and panels
- `surface-muted`: secondary panels
- `foreground`: primary text
- `muted-foreground`: supporting text
- `border`: subtle separators
- `success`, `warning`, `danger`, `info`: accessible semantic states

Check contrast, particularly for small text and button labels.

## 5. Responsive behavior

### Mobile
- Bottom navigation.
- Compact top header.
- Single-column feed and cards.
- Sheets/dialogs for quick actions where appropriate.
- Forms use full-width controls.

### Tablet
- Use two-column layouts where content benefits.
- Keep navigation accessible.
- Organization and project workspaces may use a secondary panel.

### Desktop
- Sidebar navigation.
- Wider content canvas with sensible max-width.
- Multi-column layouts for admin/workspace views.
- Keep reading widths controlled; do not stretch long text across the full viewport.

## 6. Components and interaction

- Use consistent buttons: primary, secondary, subtle/ghost and destructive.
- Use clear hover, focus, active, disabled and loading states.
- Keyboard focus must be visible.
- Inputs need labels, validation and helper/error text.
- Dialogs must have clear titles, close actions and accessible focus behavior.
- Use Lucide React icons consistently; pair unfamiliar icons with labels or tooltips.
- Avoid icon-only controls for critical actions.

## 7. Accessibility

- Semantic HTML.
- Keyboard-accessible navigation and controls.
- Visible focus indicators.
- Sufficient color contrast.
- Do not communicate status by color alone.
- Provide alt text for meaningful images.
- Respect reduced-motion preferences.
- Ensure touch targets are comfortably sized.
- Do not rely on hover for essential mobile actions.

## 8. Content and imagery

- Use realistic but fictional demo content.
- Avoid using Temple logos or official identity assets without permission.
- Do not use actual student personal information.
- Use image placeholders or clearly licensed assets.
- Label fictional sample events and organizations when necessary.
