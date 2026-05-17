# Route: /my-bookings

- Source file: app/my-bookings/page.tsx
- Rendering mode: Client Component
- useEffect hooks: 1
- State variables detected: 4

## Purpose
This page is documented from source code structure and in-component logic. It includes UI sections, user actions, data/state flow, and integration points.

## UI Structure
- No explicit JSX section comments detected; page structure inferred via components and headings.

### User-visible headings detected
- My Bookings
- No bookings found
- {booking.title}

## Functionalities
- Handles rendering, interactions, and route-specific behaviors defined in this page.
- Event handlers and interactions:
- () => setFilter("ACTIVITY")
- () => setFilter("ALL")
- () => setFilter("HOTEL")
- () => setFilter("RENTAL")
- () => setFilter("TOUR")
- onClick

## State Management
- bookings
- error
- filter
- isLoading
- Side effects: 1 useEffect hook(s) used for async loading, subscriptions, or lifecycle logic.

## API / Data Integrations
- GET /my-bookings

## Internal Dependencies
- @/components/layout/Footer/Footer
- @/components/layout/Header/Header
- @/components/ui/Button
- @/components/ui/Card
- @/contexts/AuthContext
- @/lib/axios
- @/types/my-bookings

## UX/Responsive Notes
- Uses Tailwind utility classes; responsive behavior is primarily controlled with sm/md/lg/xl breakpoints in JSX class names.
- Verify at 360px, 768px, 1024px, and 1440px breakpoints for layout integrity, overflow, and interaction accessibility.

## Validation Checklist
- Route renders without runtime errors.
- Primary action buttons and links are clickable.
- Empty/loading/error states are reachable and visually stable.
- No horizontal overflow on mobile.