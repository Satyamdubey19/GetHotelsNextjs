# Route: /host/tours

- Source file: app/host/tours/page.tsx
- Rendering mode: Client Component
- useEffect hooks: 1
- State variables detected: 5

## Purpose
This page is documented from source code structure and in-component logic. It includes UI sections, user actions, data/state flow, and integration points.

## UI Structure
- No explicit JSX section comments detected; page structure inferred via components and headings.

### User-visible headings detected
- Host tour dashboard
- No tours found
- {tour.title}

## Functionalities
- Handles rendering, interactions, and route-specific behaviors defined in this page.
- Event handlers and interactions:
- (event) => setSearch(event.target.value)
- (event) => setSort(event.target.value)
- (event) => setStatus(event.target.value)

## State Management
- loading
- search
- sort
- status
- tours
- Side effects: 1 useEffect hook(s) used for async loading, subscriptions, or lifecycle logic.

## API / Data Integrations
- GET /tour?scope=mine

## Internal Dependencies
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