# Route: /host/hotels/[id]

- Source file: app/host/hotels/[id]/page.tsx
- Rendering mode: Client Component
- useEffect hooks: 1
- State variables detected: 3

## Purpose
This page is documented from source code structure and in-component logic. It includes UI sections, user actions, data/state flow, and integration points.

## UI Structure
- Page header
- ── BASICS ──
- ── CONTACT & POLICIES ──
- ── LOCATION ──
- ── ROOMS ──
- ── AMENITIES ──
- ── HOUSE RULES ──
- ── IMAGES ──
- ── STICKY SUBMIT ──

### User-visible headings detected
- {isEdit ? "Edit Hotel" : "Add New Hotel"}
- {title}

## Functionalities
- Handles rendering, interactions, and route-specific behaviors defined in this page.
- Event handlers and interactions:
- () => addToList("rules")
- () => removeFromList("rules", idx)
- () => removeRoom(idx)
- () => set("isActive", !form.isActive)
- () => toggleAmenity(label)
- () => toggleRoomAmenity(idx, a)
- () => updateRoom(idx, "isActive", !(room.isActive ?? true))
- () => updateRoom(idx, "smokingAllowed", !room.smokingAllowed)
- addRoom
- e => { set("title", e.target.value); if (!isEdit) set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""))
- e => set("address", e.target.value)
- e => set("cancellationPolicy", e.target.value)
- e => set("checkInTime", e.target.value)
- e => set("checkOutTime", e.target.value)
- e => set("childPolicy", e.target.value)
- e => set("city", e.target.value)
- e => set("country", e.target.value)
- e => set("description", e.target.value)
- e => set("email", e.target.value)
- e => set("latitude", e.target.value)
- e => set("location", e.target.value)
- e => set("longitude", e.target.value)
- e => set("petPolicy", e.target.value)
- e => set("phone", e.target.value)
- e => set("postalCode", e.target.value)
- e => set("propertyType", e.target.value)
- e => set("slug", e.target.value)
- e => set("starRating", e.target.value)
- e => set("state", e.target.value)
- e => updateList("rules", idx, e.target.value)
- e => updateRoom(idx, "availableRooms", e.target.value)
- e => updateRoom(idx, "bedConfiguration", e.target.value)
- e => updateRoom(idx, "cancellationPolicy", e.target.value)
- e => updateRoom(idx, "capacity", e.target.value)
- e => updateRoom(idx, "description", e.target.value)
- e => updateRoom(idx, "maxAdults", e.target.value)
- e => updateRoom(idx, "maxChildren", e.target.value)
- e => updateRoom(idx, "name", e.target.value)
- e => updateRoom(idx, "originalPrice", e.target.value)
- e => updateRoom(idx, "pricePerNight", e.target.value)

## State Management
- form
- loading
- submitting
- Side effects: 1 useEffect hook(s) used for async loading, subscriptions, or lifecycle logic.

## API / Data Integrations
- No direct HTTP calls detected in this file (data may come via props/child components).

## Internal Dependencies
- @/components/ui/PhotoUploader
- @/types/host-forms

## UX/Responsive Notes
- Uses Tailwind utility classes; responsive behavior is primarily controlled with sm/md/lg/xl breakpoints in JSX class names.
- Verify at 360px, 768px, 1024px, and 1440px breakpoints for layout integrity, overflow, and interaction accessibility.

## Validation Checklist
- Route renders without runtime errors.
- Primary action buttons and links are clickable.
- Empty/loading/error states are reachable and visually stable.
- No horizontal overflow on mobile.