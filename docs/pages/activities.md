# Route: /activities

- Source file: app/activities/page.tsx
- Rendering mode: Client Component
- useEffect hooks: 0
- State variables detected: 6

## Purpose
This page is documented from source code structure and in-component logic. It includes UI sections, user actions, data/state flow, and integration points.

## UI Structure
- No explicit JSX section comments detected; page structure inferred via components and headings.

### User-visible headings detected
- Activities, tours, and city experiences.
- Filters
- Bookable activities
- No activities match this search
- {activity.title}

## Functionalities
- Handles rendering, interactions, and route-specific behaviors defined in this page.
- Event handlers and interactions:
- () => {
                    setCity("")
                    setQuery("")
                    setCategory("all")
                    setDifficulty("all")
                    setMaxPrice(4000)
                    setSort("recommended")
- () => setCategory(option.value)
- () => setCity(item)
- (event) => setCity(event.target.value)
- (event) => setDifficulty(event.target.value)
- (event) => setMaxPrice(Number(event.target.value))
- (event) => setQuery(event.target.value)
- (event) => setSort(event.target.value)

## State Management
- category
- city
- difficulty
- maxPrice
- query
- sort
- No useEffect hooks detected.

## API / Data Integrations
- No direct HTTP calls detected in this file (data may come via props/child components).

## Internal Dependencies
- @/components/layout/Footer/Footer
- @/components/layout/Header/Header
- @/lib/activities

## UX/Responsive Notes
- Uses Tailwind utility classes; responsive behavior is primarily controlled with sm/md/lg/xl breakpoints in JSX class names.
- Verify at 360px, 768px, 1024px, and 1440px breakpoints for layout integrity, overflow, and interaction accessibility.

## Validation Checklist
- Route renders without runtime errors.
- Primary action buttons and links are clickable.
- Empty/loading/error states are reachable and visually stable.
- No horizontal overflow on mobile.