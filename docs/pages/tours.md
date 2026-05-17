# Route: /tours

- Source file: app/tours/page.tsx
- Rendering mode: Client Component
- useEffect hooks: 1
- State variables detected: 7

## Purpose
This page is documented from source code structure and in-component logic. It includes UI sections, user actions, data/state flow, and integration points.

## UI Structure
- Hero Section
- Search Section
- Filters & Controls
- Results Info
- Tours Grid/List
- Features Section
- CTA Section

### User-visible headings detected
- Discover Incredible
- Why Travel With Us
- Can&apos;t Find Your Perfect Tour?
- No tours found
- {feature.title}

## Functionalities
- Handles rendering, interactions, and route-specific behaviors defined in this page.
- Event handlers and interactions:
- () => { clearSearch(); setActiveCategory('all')
- () => setActiveCategory(cat.id)
- () => setViewMode('grid')
- () => setViewMode('list')
- (e) => setSearchInput(e.target.value)
- (e) => setSortBy(e.target.value as SortOption)
- clearSearch
- handleSearch

## State Management
- activeCategory
- isLoading
- searchInput
- searchQuery
- sortBy
- tours
- viewMode
- Side effects: 1 useEffect hook(s) used for async loading, subscriptions, or lifecycle logic.

## API / Data Integrations
- GET /tour

## Internal Dependencies
- @/components/layout/Footer/Footer
- @/components/layout/Header/Header
- @/components/tour/TourCard
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