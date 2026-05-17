# Route: /admin/listings

- Source file: app/admin/listings/page.tsx
- Rendering mode: Client Component
- useEffect hooks: 2
- State variables detected: 9

## Purpose
This page is documented from source code structure and in-component logic. It includes UI sections, user actions, data/state flow, and integration points.

## UI Structure
- No explicit JSX section comments detected; page structure inferred via components and headings.

### User-visible headings detected
- {pageCopy.title}

## Functionalities
- Handles rendering, interactions, and route-specific behaviors defined in this page.
- Event handlers and interactions:
- () => fetchListings()
- () => openListing(row)
- () => updateListing(selected)
- () => updateListing(selected, 'ACTIVE', true)
- () => updateListing(selected, 'ARCHIVED', false)
- () => updateListing(selected, 'PAUSED', false)
- () => updateListing(selected, 'REJECTED', false)
- (event) => setDecisionReason(event.target.value)
- (event) => setSearch(event.target.value)
- (event) => setSelectedDraft((current) => current ? { ...current, title: event.target.value
- (event) => setSelectedDraft((current) => current ? {
                                ...current,
                                inventoryDetails: current.inventoryDetails.map((room, roomIndex) => roomIndex === index ? { ...room, available: Number(event.target.value)
- (event) => setSelectedDraft((current) => current ? {
                                ...current,
                                inventoryDetails: current.inventoryDetails.map((room, roomIndex) => roomIndex === index ? { ...room, pricePerNight: Number(event.target.value)
- (event) => setSelectedDraft((current) => current ? {
                                ...current,
                                inventoryDetails: current.inventoryDetails.map((room, roomIndex) => roomIndex === index ? { ...room, total: Number(event.target.value)
- (event) => setSelectedDraft((current) => current ? {
                              ...current,
                              inventoryDetails: current.inventoryDetails.map((room, roomIndex) => roomIndex === index ? { ...room, isActive: event.target.checked
- (tab) => setStatus(tab)
- (tab) => setType(tab)

## State Management
- decisionReason
- listings
- loading
- saving
- search
- selected
- selectedDraft
- status
- type
- Side effects: 2 useEffect hook(s) used for async loading, subscriptions, or lifecycle logic.

## API / Data Integrations
- No direct HTTP calls detected in this file (data may come via props/child components).

## Internal Dependencies
- @/components/ui/FilterTabs
- @/components/ui/Input
- @/components/ui/loading-skeletons
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