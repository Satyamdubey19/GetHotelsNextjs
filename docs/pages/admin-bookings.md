# Route: /admin/bookings

- Source file: app/admin/bookings/page.tsx
- Rendering mode: Client Component
- useEffect hooks: 1
- State variables detected: 9

## Purpose
This page is documented from source code structure and in-component logic. It includes UI sections, user actions, data/state flow, and integration points.

## UI Structure
- Filter Tabs
- Bookings Table
- Override Modal

### User-visible headings detected
- All bookings

## Functionalities
- Handles rendering, interactions, and route-specific behaviors defined in this page.
- Event handlers and interactions:
- () => handleOverrideClick(booking)
- () => setShowOverrideModal(false)
- (e) => setNewStatus(e.target.value)
- (e) => setOverrideReason(e.target.value)
- (tab) => setFilter(tab as typeof filter)
- handleSubmitOverride

## State Management
- bookings
- feedback
- filter
- loading
- newStatus
- overrideReason
- overriding
- selectedBooking
- showOverrideModal
- Side effects: 1 useEffect hook(s) used for async loading, subscriptions, or lifecycle logic.

## API / Data Integrations
- GET /admin/bookings

## Internal Dependencies
- @/components/ui/FilterTabs
- @/components/ui/loading-skeletons
- @/components/ui/Modal
- @/components/ui/Spinner
- @/components/ui/StatusBadge
- @/contexts/AuthContext
- @/lib/axios
- @/types/admin

## UX/Responsive Notes
- Uses Tailwind utility classes; responsive behavior is primarily controlled with sm/md/lg/xl breakpoints in JSX class names.
- Verify at 360px, 768px, 1024px, and 1440px breakpoints for layout integrity, overflow, and interaction accessibility.

## Validation Checklist
- Route renders without runtime errors.
- Primary action buttons and links are clickable.
- Empty/loading/error states are reachable and visually stable.
- No horizontal overflow on mobile.