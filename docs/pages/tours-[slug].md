# Route: /tours/[slug]

- Source file: app/tours/[slug]/page.tsx
- Rendering mode: Client Component
- useEffect hooks: 2
- State variables detected: 12

## Purpose
This page is documented from source code structure and in-component logic. It includes UI sections, user actions, data/state flow, and integration points.

## UI Structure
- No explicit JSX section comments detected; page structure inferred via components and headings.

### User-visible headings detected
- Loading tour...
- Tour not found
- {tour.title}
- {title}
- Tour overview
- {highlight}
- {day.title}
- {card.label}
- GetHotels Experiences
- {person.name}
- {tour.destination}
- {question}

## Functionalities
- Handles rendering, interactions, and route-specific behaviors defined in this page.
- Event handlers and interactions:
- () => setBookingModal(true)
- () => setExpandedDays((current) => current.includes(day.day) ? current.filter((item) => item !== day.day) : [...current, day.day])
- () => setExpandedDays((current) => open ? current.filter((item) => item !== day.day) : [...current, day.day])
- () => setExpandedPolicy(key)
- () => setGuestCount(Math.max(1, guestCount - 1))
- () => setGuestCount(Math.min(computed.group.left, guestCount + 1))
- () => setLightbox(gallery[0])
- () => setLightbox(image)
- () => setLightbox(null)
- () => setLiked(!liked)
- () => setReadMore(!readMore)
- share

## State Management
- bookingModal
- chatMessages
- chatUnlocked
- copied
- expandedDays
- expandedPolicy
- guestCount
- isLoadingTour
- lightbox
- liked
- readMore
- tour
- Side effects: 2 useEffect hook(s) used for async loading, subscriptions, or lifecycle logic.

## API / Data Integrations
- No direct HTTP calls detected in this file (data may come via props/child components).

## Internal Dependencies
- @/components/layout/Footer/Footer
- @/components/layout/Header/Header
- @/components/tour/GroupBooking
- @/components/tour/TourCard
- @/contexts/AuthContext
- @/lib/axios
- @/lib/tours

## UX/Responsive Notes
- Uses Tailwind utility classes; responsive behavior is primarily controlled with sm/md/lg/xl breakpoints in JSX class names.
- Verify at 360px, 768px, 1024px, and 1440px breakpoints for layout integrity, overflow, and interaction accessibility.

## Validation Checklist
- Route renders without runtime errors.
- Primary action buttons and links are clickable.
- Empty/loading/error states are reachable and visually stable.
- No horizontal overflow on mobile.