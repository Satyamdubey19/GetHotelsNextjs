# Route: /hotels/[slug]

- Source file: app/hotels/[slug]/page.tsx
- Rendering mode: Client Component
- useEffect hooks: 3
- State variables detected: 20

## Purpose
This page is documented from source code structure and in-component logic. It includes UI sections, user actions, data/state flow, and integration points.

## UI Structure
- Top bar
- Hero content
- Price card
- ── Sticky Nav ─────────────────────────────────
- ── Quick Stats ────────────────────────────────
- ── Gallery ──────────────────────────────────
- ── About + Map row ──────────────────────────
- About
- Map
- ── Tab Navigation ───────────────────────────
- ── Main Content Grid ────────────────────────
- Left Content
- Rooms Tab
- Deluxe Room
- Premium Suite
- Amenities Tab
- Why Stay With Us
- Reviews Tab
- House Rules Tab
- ── Sidebar ────────────────────────────────
- Booking Card
- Date Selection
- Price Breakdown
- CTA
- Trust Badges
- Property Details
- Rating in details
- Reviews Summary
- ── Floating CTA ───────────────────────────────
- ── Booking Modal ──────────────────────────────

### User-visible headings detected
- Hotel Not Found
- {hotel.title}
- {hotel.title}
- {item.title}
- A more complete stay view before you book.
- About This Property
- Location
- Select Your Room
- Hotel Amenities
- Guest Reviews
- House Rules
- {bookingConfirmed ? 'Booking Confirmed!' : 'Complete Your Reservation'}
- Deluxe Room
- Premium Suite
- Why Stay With Us
- Book Your Stay
- Booking Confirmed!

## Functionalities
- Handles rendering, interactions, and route-specific behaviors defined in this page.
- Event handlers and interactions:
- () => checkIn && checkOut && selectedRoomIsAvailable ? setBookingStep(2) : undefined
- () => contactName && contactEmail && contactPhone ? handleConfirmBooking() : undefined
- () => firstRoom && ((hasDateRange ? firstRoom.dateAvailableRooms ?? firstRoom.totalRooms : firstRoom.totalRooms) > 0) ? openBooking(firstRoom.id) : undefined
- () => firstRoom && ((hasDateRange ? firstRoom.dateAvailableRooms ?? firstRoom.totalRooms : firstRoom.totalRooms) > 0) ? setSelectedRoom(firstRoom.id) : undefined
- () => openBooking()
- () => secondRoom && ((hasDateRange ? secondRoom.dateAvailableRooms ?? secondRoom.totalRooms : secondRoom.totalRooms) > 0) ? openBooking(secondRoom.id) : undefined
- () => secondRoom && ((hasDateRange ? secondRoom.dateAvailableRooms ?? secondRoom.totalRooms : secondRoom.totalRooms) > 0) ? setSelectedRoom(secondRoom.id) : undefined
- () => setActiveTab(key)
- () => setBookingStep(1)
- () => setGuests(Math.max(1, guests - 1))
- () => setGuests(Math.min(8, guests + 1))
- (e) => { setPromoCode(e.target.value); setPromoApplied(false)
- (e) => {
                              setCheckIn(e.target.value)
                              if (checkOut && e.target.value >= checkOut) setCheckOut('')
- (e) => {
                            setCheckIn(e.target.value)
                            if (checkOut && e.target.value >= checkOut) setCheckOut('')
- (e) => setCheckOut(e.target.value)
- (e) => setContactEmail(e.target.value)
- (e) => setContactName(e.target.value)
- (e) => setContactPhone(e.target.value)
- (e) => setSpecialRequests(e.target.value)
- closeBookingModal
- handleApplyPromo
- handleShare
- handleWishlist

## State Management
- activeTab
- bookingConfirmed
- bookingError
- bookingId
- bookingLoading
- bookingStep
- checkIn
- checkOut
- contactEmail
- contactName
- contactPhone
- copied
- guests
- hotel
- promoApplied
- promoCode
- selectedRoom
- showBookingModal
- showStickyNav
- specialRequests
- Side effects: 3 useEffect hook(s) used for async loading, subscriptions, or lifecycle logic.

## API / Data Integrations
- POST /booking

## Internal Dependencies
- @/components/hotel/HotelGallery
- @/components/hotel/HotelReviews
- @/components/hotel/MapSection
- @/components/layout/Footer/Footer
- @/components/layout/Header/Header
- @/contexts/WishlistContext
- @/lib/axios
- @/lib/hotels
- @/types/component-props

## UX/Responsive Notes
- Uses Tailwind utility classes; responsive behavior is primarily controlled with sm/md/lg/xl breakpoints in JSX class names.
- Verify at 360px, 768px, 1024px, and 1440px breakpoints for layout integrity, overflow, and interaction accessibility.

## Validation Checklist
- Route renders without runtime errors.
- Primary action buttons and links are clickable.
- Empty/loading/error states are reachable and visually stable.
- No horizontal overflow on mobile.