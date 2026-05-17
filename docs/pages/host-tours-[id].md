# Route: /host/tours/[id]

- Source file: app/host/tours/[id]/page.tsx
- Rendering mode: Client Component
- useEffect hooks: 5
- State variables detected: 8

## Purpose
This page is documented from source code structure and in-component logic. It includes UI sections, user actions, data/state flow, and integration points.

## UI Structure
- No explicit JSX section comments detected; page structure inferred via components and headings.

### User-visible headings detected
- {isEdit ? "Edit tour experience" : "Create tour experience"}
- {title}
- {title}

## Functionalities
- Handles rendering, interactions, and route-specific behaviors defined in this page.
- Event handlers and interactions:
- () => { set("latitude", form.latitude || "32.2432"); set("longitude", form.longitude || "77.1892")
- () => {
                        const next = active ? selectedLanguages.filter((item) => item !== language) : [...selectedLanguages, language]
                        set("languages", next.join(", "))
- () => moveDay(dayIndex, 1)
- () => moveDay(dayIndex, -1)
- () => navigator.clipboard?.writeText(`/tours/${form.slug
- () => onChange(!checked)
- () => onRemove(index)
- () => setDuration(String(Number(form.duration || 1) + 1))
- () => setExpandedDays((current) => expanded ? current.filter((item) => item !== day.day) : [...current, day.day])
- () => setExpandedDays([])
- () => setExpandedDays(form.itinerary.map((day: ItineraryDay) => day.day))
- (event) => { set("title", event.target.value); if (!isEdit) set("slug", slugify(event.target.value))
- (event) => { set("totalSlots", event.target.value); if (Number(form.availableSlots) > Number(event.target.value)) set("availableSlots", event.target.value)
- (event) => onChange(index, event.target.value)
- (event) => set("availableSlots", event.target.value)
- (event) => set("cancellationPolicy", event.target.value)
- (event) => set("category", event.target.value)
- (event) => set("city", event.target.value)
- (event) => set("country", event.target.value)
- (event) => set("description", event.target.value)
- (event) => set("destination", event.target.value)
- (event) => set("difficulty", event.target.value)
- (event) => set("latitude", event.target.value)
- (event) => set("longitude", event.target.value)
- (event) => set("maxGroupSize", event.target.value)
- (event) => set("originalPrice", event.target.value)
- (event) => set("pricePerPerson", event.target.value)
- (event) => set("slug", slugify(event.target.value))
- (event) => set("state", event.target.value)
- (event) => set("status", event.target.value)
- (event) => setDuration(event.target.value)
- (event) => setScheduleDate("endDate", event.target.value)
- (event) => setScheduleDate("registrationDeadline", event.target.value)
- (event) => setScheduleDate("startDate", event.target.value)
- (event) => updateItineraryDay(dayIndex, { description: event.target.value
- (event) => updateItineraryDay(dayIndex, { stayNotes: event.target.value
- (event) => updateItineraryDay(dayIndex, { title: event.target.value
- (event) => updateItineraryDay(dayIndex, { travelNotes: event.target.value
- (index, value) => updateArray("excluded", index, value)
- (index, value) => updateArray("highlights", index, value)

## State Management
- dirty
- errors
- expandedDays
- form
- lastSavedAt
- loading
- submitting
- toast
- Side effects: 5 useEffect hook(s) used for async loading, subscriptions, or lifecycle logic.

## API / Data Integrations
- POST /tour

## Internal Dependencies
- @/components/ui/PhotoUploader
- @/lib/axios
- @/types/host-forms

## UX/Responsive Notes
- Uses Tailwind utility classes; responsive behavior is primarily controlled with sm/md/lg/xl breakpoints in JSX class names.
- Verify at 360px, 768px, 1024px, and 1440px breakpoints for layout integrity, overflow, and interaction accessibility.

## Validation Checklist
- Route renders without runtime errors.
- Primary action buttons and links are clickable.
- Empty/loading/error states are reachable and visually stable.
- No horizontal overflow on mobile.