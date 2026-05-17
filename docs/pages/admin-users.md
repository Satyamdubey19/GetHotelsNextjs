# Route: /admin/users

- Source file: app/admin/users/page.tsx
- Rendering mode: Client Component
- useEffect hooks: 1
- State variables detected: 3

## Purpose
This page is documented from source code structure and in-component logic. It includes UI sections, user actions, data/state flow, and integration points.

## UI Structure
- Users Table

### User-visible headings detected
- User management

## Functionalities
- Handles rendering, interactions, and route-specific behaviors defined in this page.
- Event handlers and interactions:
- (tab) => setFilter(tab as typeof filter)

## State Management
- filter
- loading
- users
- Side effects: 1 useEffect hook(s) used for async loading, subscriptions, or lifecycle logic.

## API / Data Integrations
- No direct HTTP calls detected in this file (data may come via props/child components).

## Internal Dependencies
- @/components/ui/FilterTabs
- @/components/ui/loading-skeletons
- @/components/ui/Spinner
- @/components/ui/StatCard
- @/components/ui/StatusBadge
- @/contexts/AuthContext

## UX/Responsive Notes
- Uses Tailwind utility classes; responsive behavior is primarily controlled with sm/md/lg/xl breakpoints in JSX class names.
- Verify at 360px, 768px, 1024px, and 1440px breakpoints for layout integrity, overflow, and interaction accessibility.

## Validation Checklist
- Route renders without runtime errors.
- Primary action buttons and links are clickable.
- Empty/loading/error states are reachable and visually stable.
- No horizontal overflow on mobile.