# Route: /activities/[slug]

- Source file: app/activities/[slug]/page.tsx
- Rendering mode: Client Component
- useEffect hooks: 0
- State variables detected: 8

## Purpose
This page is documented from source code structure and in-component logic. It includes UI sections, user actions, data/state flow, and integration points.

## UI Structure
- No explicit JSX section comments detected; page structure inferred via components and headings.

### User-visible headings detected
- Activity not found
- {activity.title}
- Your activity from start to finish
- Highlights worth booking for
- What is included and what is not
- {activity.rating} out of 5 stars
- Frequently asked
- {activity.host.name}
- What to bring
- Cancellation policy

## Functionalities
- Handles rendering, interactions, and route-specific behaviors defined in this page.
- Event handlers and interactions:
- () => setActiveImage(i)
- () => setGuests(Math.max(1, guests - 1))
- () => setGuests(Math.min(12, guests + 1))
- () => setHelpfulVotes((v) => ({ ...v, [i]: !v[i]
- () => setOpenFaq(openFaq === i ? null : i)
- () => setTime(slot)
- () => time && setConfirmed(true)
- (e) => setDate(e.target.value)
- (e) => setPrivateGroup(e.target.checked)

## State Management
- activeImage
- confirmed
- date
- guests
- helpfulVotes
- openFaq
- privateGroup
- time
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