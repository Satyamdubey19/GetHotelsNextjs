# Route: /admin/tours

- Source file: app/admin/tours/page.tsx
- Rendering mode: Client Component
- useEffect hooks: 1
- State variables detected: 8

## Purpose
This page is documented from source code structure and in-component logic. It includes UI sections, user actions, data/state flow, and integration points.

## UI Structure
- No explicit JSX section comments detected; page structure inferred via components and headings.

### User-visible headings detected
- Tour review center
- No tours in this queue
- Tour quality distribution
- {selected.title}

## Functionalities
- Handles rendering, interactions, and route-specific behaviors defined in this page.
- Event handlers and interactions:
- () => setSelected(row)
- () => setStatus(tab)
- () => updateListing(selected, "ACTIVE", true)
- () => updateListing(selected, "ARCHIVED", false)
- () => updateListing(selected, "PAUSED", false)
- () => updateListing(selected, "PENDING_REVIEW", false)
- () => updateListing(selected, "REJECTED", false)
- () => void load()
- (event) => setInternalNotes(event.target.value)
- (event) => setReason(event.target.value)
- (event) => setSearch(event.target.value)

## State Management
- internalNotes
- loading
- reason
- rows
- saving
- search
- selected
- status
- Side effects: 1 useEffect hook(s) used for async loading, subscriptions, or lifecycle logic.

## API / Data Integrations
- No direct HTTP calls detected in this file (data may come via props/child components).

## Internal Dependencies
- @/components/ui/Modal
- @/components/ui/StatusBadge
- @/lib/axios

## UX/Responsive Notes
- Uses Tailwind utility classes; responsive behavior is primarily controlled with sm/md/lg/xl breakpoints in JSX class names.
- Verify at 360px, 768px, 1024px, and 1440px breakpoints for layout integrity, overflow, and interaction accessibility.

## Validation Checklist
- Route renders without runtime errors.
- Primary action buttons and links are clickable.
- Empty/loading/error states are reachable and visually stable.
- No horizontal overflow on mobile.