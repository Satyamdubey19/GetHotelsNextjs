# Route: /host/bookings

- Source file: app/host/bookings/page.tsx
- Rendering mode: Client Component
- useEffect hooks: 1
- State variables detected: 5

## Purpose
This page is documented from source code structure and in-component logic. It includes UI sections, user actions, data/state flow, and integration points.

## UI Structure
- No explicit JSX section comments detected; page structure inferred via components and headings.

## Functionalities
- Handles rendering, interactions, and route-specific behaviors defined in this page.
- Event handlers and interactions:
- event => onChange(event.target.value)
- setFilterStatus
- setFilterType
- value => onStatusChange(booking.id, value)

## State Management
- bookings
- filterStatus
- filterType
- loading
- stats
- Side effects: 1 useEffect hook(s) used for async loading, subscriptions, or lifecycle logic.

## API / Data Integrations
- PUT /host/bookings

## Internal Dependencies
- @/components/host/HostUI
- @/components/ui/Spinner
- @/lib/axios
- @/types/host-pages

## UX/Responsive Notes
- Uses Tailwind utility classes; responsive behavior is primarily controlled with sm/md/lg/xl breakpoints in JSX class names.
- Verify at 360px, 768px, 1024px, and 1440px breakpoints for layout integrity, overflow, and interaction accessibility.

## Validation Checklist
- Route renders without runtime errors.
- Primary action buttons and links are clickable.
- Empty/loading/error states are reachable and visually stable.
- No horizontal overflow on mobile.