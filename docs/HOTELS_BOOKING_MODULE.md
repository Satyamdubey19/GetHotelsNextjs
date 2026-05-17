# Hotels & Stays Booking Module — Complete Documentation

> Scanned and verified against actual source code.  
> Every section references the real file that implements it.

---

## Table of Contents

1. [Module Overview](#1-module-overview)
2. [Architecture Map](#2-architecture-map)
3. [Database Schema](#3-database-schema)
4. [Guest-Facing Pages](#4-guest-facing-pages)
5. [Booking Flow — Step-by-Step](#5-booking-flow--step-by-step)
6. [API Routes](#6-api-routes)
7. [Controllers](#7-controllers)
8. [Services](#8-services)
9. [Availability & Inventory Engine](#9-availability--inventory-engine)
10. [Validators](#10-validators)
11. [Host-Facing Pages & Management](#11-host-facing-pages--management)
12. [Admin-Facing Booking Management](#12-admin-facing-booking-management)
13. [User Booking Management](#13-user-booking-management)
14. [Email Notifications](#14-email-notifications)
15. [Pricing & Financial Calculations](#15-pricing--financial-calculations)
16. [Cancellation Flow](#16-cancellation-flow)
17. [Wishlist Integration](#17-wishlist-integration)
18. [Component Library Used](#18-component-library-used)
19. [Known Gaps & Incomplete Wiring](#19-known-gaps--incomplete-wiring)
20. [Data Flow Diagram](#20-data-flow-diagram)

---

## 1. Module Overview

The Hotels & Stays module is the core booking vertical of GetHotels. It covers:

- Public hotel discovery (browse, search, filter by city/amenity)
- Hotel detail page with live availability, room selection, and modal booking
- A serializable Prisma transaction that reserves inventory, creates records, and dispatches a confirmation email atomically
- Guest self-service for viewing and cancelling bookings
- Host-side hotel CRUD with room management
- Admin-side booking audit and status overrides

**Currency:** All amounts are in INR by default.  
**Platform fee:** 10 % of total.  
**Tax rate:** 12 % on subtotal.  
**Inventory hold:** 15 minutes on each new PENDING booking.

---

## 2. Architecture Map

```
Browser (Guest)
  └─ app/hotels/page.tsx               ← Browse hotels
  └─ app/hotels/[slug]/page.tsx        ← Detail + booking modal
       └─ GET /api/hotel/{slug|id}     ← Load hotel + room availability
       └─ POST /api/booking            ← Create booking

API Layer
  └─ app/api/hotel/route.ts            ← List, search, city, random
  └─ app/api/hotel/[id]/route.ts       ← Single hotel by id or slug
  └─ app/api/booking/route.ts          ← Create, list user bookings
  └─ app/api/booking/[id]/route.ts     ← Get, cancel single booking
  └─ app/api/my-bookings/route.ts      ← Unified travel timeline

Controllers
  └─ controllers/hotel.controller.ts  ← Public + host hotel handlers
  └─ controllers/booking.controller.ts← Booking CRUD + auth resolution

Services
  └─ services/hotel.service.ts        ← Hotel persistence + availability
  └─ services/booking.service.ts      ← Booking transaction + email
  └─ services/availability.service.ts ← Inventory calendar engine
  └─ services/my-bookings.service.ts  ← Unified booking timeline merge

Validators
  └─ validators/booking.validators.ts ← Payload parsing + validation

Database
  └─ prisma/schema.prisma             ← Booking, Hotel, Room, etc.

Email
  └─ lib/mail.ts                      ← Booking confirmation email

Client Helpers
  └─ lib/booking.ts                   ← Browser-side GET/PATCH wrappers
  └─ lib/axios.ts                     ← Shared API client (base: /api)
```

---

## 3. Database Schema

### 3.1 `Hotel`

> `prisma/schema.prisma`

| Field                           | Type            | Notes                                                 |
| ------------------------------- | --------------- | ----------------------------------------------------- |
| `id`                            | UUID            | Primary key                                           |
| `hostId`                        | FK → Host       | Owner of the listing                                  |
| `slug`                          | String (unique) | URL identifier                                        |
| `title`                         | String          | Display name                                          |
| `description`                   | String          | Rich property description                             |
| `location`                      | String          | Human-readable area                                   |
| `address`                       | String?         | Street address                                        |
| `city`, `state`, `country`      | String          | Location breakdown                                    |
| `latitude`, `longitude`         | Float?          | GPS for map widget                                    |
| `propertyType`                  | Enum            | HOTEL, APARTMENT, VILLA, RESORT, HOMESTAY, GUESTHOUSE |
| `starRating`                    | Int?            | 1–5                                                   |
| `checkInTime`                   | String          | Default 14:00                                         |
| `checkOutTime`                  | String          | Default 11:00                                         |
| `cancellationPolicy`            | String?         | Free text                                             |
| `childPolicy`, `petPolicy`      | String?         | Free text                                             |
| `status`                        | Enum            | DRAFT, PENDING_REVIEW, ACTIVE, REJECTED, ARCHIVED     |
| `isActive`                      | Boolean         | Host-toggled live switch                              |
| `isApproved`                    | Boolean         | Admin approval gate                                   |
| `averageRating`                 | Float           | Recomputed from reviews                               |
| `totalReviews`, `totalBookings` | Int             | Denormalised counters                                 |
| `deletedAt`                     | DateTime?       | Soft delete                                           |

**Relations:** `HotelImage[]`, `HotelAmenity[]`, `HotelRule[]`, `Room[]`, `Review[]`, `Booking[]`, `WishlistItem[]`, `Post[]`

---

### 3.2 `Room`

| Field                      | Type       | Notes                                       |
| -------------------------- | ---------- | ------------------------------------------- |
| `id`                       | UUID       |                                             |
| `hotelId`                  | FK → Hotel |                                             |
| `name`                     | String     | e.g. "Deluxe King"                          |
| `type`                     | Enum       | STANDARD, DELUXE, SUITE, …                  |
| `pricePerNight`            | Decimal    | Base nightly rate                           |
| `originalPrice`            | Decimal?   | Crossed-out price for discounts             |
| `capacity`                 | Int        | Total guests                                |
| `maxAdults`, `maxChildren` | Int        | Separate caps                               |
| `totalRooms`               | Int        | Physical unit count                         |
| `instantBook`              | Boolean    | (schema only; not yet used in booking flow) |
| `minAdvanceDays`           | Int        | Days ahead required to book                 |
| `maxAdvanceDays`           | Int?       | Max days ahead allowed                      |
| `amenities`                | String[]   | Room-specific amenities                     |
| `images`                   | String[]   | Room image URLs                             |
| `isActive`                 | Boolean    |                                             |

**Relations:** `RoomAvailability[]`, `BookingRoom[]`, `InventoryReservation[]`, `BlackoutDate[]`, `SeasonalPricing[]`

---

### 3.3 `Booking`

| Field                                         | Type            | Notes                                                                  |
| --------------------------------------------- | --------------- | ---------------------------------------------------------------------- |
| `id`                                          | UUID            |                                                                        |
| `bookingCode`                                 | String (unique) | `GH` + base36 timestamp + random                                       |
| `userId`                                      | FK → User       | Guest                                                                  |
| `hostId`                                      | FK → Host       | Property owner                                                         |
| `hotelId`                                     | FK → Hotel?     | Null for tour/rental bookings                                          |
| `checkIn`, `checkOut`                         | DateTime?       | Stay window                                                            |
| `totalGuests`                                 | Int             | adults + children + infants                                            |
| `adults`, `children`, `infants`               | Int             | Breakdown                                                              |
| `contactName`, `contactEmail`, `contactPhone` | String          | Guest contact snapshot                                                 |
| `specialRequests`                             | String?         |                                                                        |
| `subtotal`                                    | Decimal         | Room total before tax                                                  |
| `taxes`                                       | Decimal         | 12 % of subtotal                                                       |
| `discount`                                    | Decimal         | Coupon savings                                                         |
| `totalAmount`                                 | Decimal         | Final charge                                                           |
| `currency`                                    | String          | Default INR                                                            |
| `status`                                      | Enum            | PENDING → CONFIRMED → CHECKED_IN → CHECKED_OUT → COMPLETED / CANCELLED |
| `expiresAt`                                   | DateTime?       | PENDING hold expiry (+15 min)                                          |
| `cancellationReason`                          | String?         |                                                                        |
| `cancelledAt`                                 | DateTime?       |                                                                        |

**Relations:** `BookingRoom[]`, `BookingTimeline[]`, `InventoryReservation[]`, `Payment?`, `Review?`, `BookingGuest[]`, `CouponRedemption[]`

---

### 3.4 `BookingRoom`

Snapshot of room details at time of booking, so pricing stays correct even if the room changes later.

| Field                           | Notes                                                     |
| ------------------------------- | --------------------------------------------------------- |
| `roomId`                        | FK → Room                                                 |
| `roomName`, `roomType`          | Denormalised snapshot                                     |
| `pricePerNight`                 | Effective rate for this booking                           |
| `originalPrice`                 | For strike-through display                                |
| `quantity`                      | Rooms booked                                              |
| `checkIn`, `checkOut`, `nights` | Per-room dates                                            |
| `total`                         | Subtotal for this room line                               |
| `inventoryReserved`             | Set to true after calendar reservation; cleared on cancel |

---

### 3.5 `RoomAvailability`

Per-day inventory calendar row, one row per `(roomId, date)`.

| Field                | Notes                         |
| -------------------- | ----------------------------- |
| `date`               | Calendar date (UTC midnight)  |
| `totalInventory`     | Physical unit count           |
| `soldInventory`      | Confirmed-paid rooms          |
| `reservedInventory`  | Held by PENDING bookings      |
| `availableInventory` | `total - sold - reserved`     |
| `basePrice`          | Standard rate for this date   |
| `priceOverride`      | Overrides base if set         |
| `isClosed`           | Blocks all bookings           |
| `closedToCheckIn`    | Blocks arrival on this date   |
| `closedToCheckOut`   | Blocks departure on this date |
| `minStay`, `maxStay` | Night restrictions            |

---

### 3.6 `InventoryReservation`

Tracks the hold created when a booking enters PENDING status.

| Field                 | Notes                          |
| --------------------- | ------------------------------ |
| `roomId`, `bookingId` | FK links                       |
| `checkIn`, `checkOut` | Date-only                      |
| `quantity`            | Rooms held                     |
| `expiresAt`           | 15-minute expiry from creation |
| `status`              | ACTIVE → CANCELLED             |

---

### 3.7 `Payment`

One-to-one with `Booking`.

| Field                                  | Notes                                 |
| -------------------------------------- | ------------------------------------- |
| `amount`                               | Mirrors booking `totalAmount`         |
| `hostEarnings`                         | 90 % of total                         |
| `platformFee`                          | 10 % of total                         |
| `currency`                             | INR                                   |
| `provider`                             | "razorpay" (integration pending)      |
| `status`                               | PENDING → SUCCESS → REFUNDED / FAILED |
| `providerOrderId`, `providerPaymentId` | Razorpay fields (set post-payment)    |
| `refundedAt`, `refundReason`           | Populated on cancel-after-payment     |

---

### 3.8 Supporting Models

| Model                         | Purpose                                                             |
| ----------------------------- | ------------------------------------------------------------------- |
| `HotelImage`                  | Photos with sort order and cover flag                               |
| `HotelAmenity`                | Join table to global `Amenity` catalogue                            |
| `HotelRule`                   | Free-text house rules                                               |
| `BlackoutDate`                | Room-level blocked dates with optional reason                       |
| `SeasonalPricing`             | Date-range price overrides per room                                 |
| `BookingTimeline`             | Audit events: CREATED, CONFIRMED, CANCELLED, etc.                   |
| `BookingGuest`                | Individual guest details (name, ID doc, age)                        |
| `Coupon` / `CouponRedemption` | Promo code engine (schema defined; UI uses "GETHOTELS10" demo code) |
| `Review`                      | One review per booking; attached to Hotel + User                    |

---

## 4. Guest-Facing Pages

### 4.1 Hotel Listing Page

**File:** `app/hotels/page.tsx`

**Features:**

- Calls `GET /api/hotel` on mount; falls back to demo data from `lib/hotels.ts` on error
- City search via `GET /api/hotel?city={city}` and text search via `GET /api/hotel?q={query}`
- Renders results in **Grid** (default) or **List** layout toggle
- Sort options: Relevance (default), Price Low→High, Price High→Low, Rating
- Filter panel (`components/hotel/HotelFilters.tsx`): price range, amenities, star rating, property type
- Each card shows: cover image, city label, star rating badge, amenity chips, price per night
- Shimmer loading skeleton while API responds
- Wishlist heart button on each card with animation
- Convenience section: Best Price Guarantee, 24/7 Support, Exclusive Deals

---

### 4.2 Hotel Detail Page

**File:** `app/hotels/[slug]/page.tsx`

**Features:**

**Data loading**

- Fetches `GET /api/hotel/{slug}?checkIn=&checkOut=` on mount and re-fetches whenever dates change
- API resolves by `slug OR id` — the service `getPublicHotelById` does `WHERE id = $1 OR slug = $1`

**Gallery & Navigation**

- `HotelGallery` component with lightbox and swipe
- Sticky section nav (Overview / Rooms / Amenities / Reviews / Rules) appears after 400 px scroll
- Share button uses Web Share API with clipboard fallback

**Room Selector**

- Lists all active rooms for the hotel
- When dates are selected, shows `dateAvailableRooms` returned by the availability-enriched API
- Highlights "Only X left" when availability is tight
- Selecting a room updates the booking modal's price summary

**Booking Modal** (3-step)

1. **Stay details:** check-in, check-out, adult count, room picker, special requests, promo code field
2. **Contact details:** name, email, phone
3. **Confirmation:** booking code, total paid, next-steps prompt

**Price summary (live in modal)**

- Room subtotal: `pricePerNight × nights`
- 10 % discount if promo `GETHOTELS10` is applied (UI-side only; real discount logic is server-side in the Coupon model)
- 12 % tax on discounted subtotal
- Final total displayed before confirmation

**Map**

- `MapSection` and `MapPreview` components render a location pin
- `MapModal` opens a larger view on demand

**Reviews**

- `HotelReviews` component; shows up to 10 most recent from the API include

**Stay Highlights**

- Verified Host, Secure Checkout, Stay Support, Prime Area — static info blocks

**Wishlist**

- Heart toggle saves to `WishlistContext` (localStorage-backed)

---

## 5. Booking Flow — Step-by-Step

### 5.1 Pre-booking (client)

```
1. User lands on /hotels/{slug}
2. Page loads hotel via GET /api/hotel/{slug}?checkIn=&checkOut=
3. Service checks RoomAvailability calendar and attaches
   dateAvailableRooms / isAvailableForDates to each Room
4. User selects room → price summary updates
5. User clicks "Book Now" → booking modal opens (step 1)
6. User fills stay details → step 2 (contact) → step 3 triggers POST
```

### 5.2 Booking Creation (server)

**Route:** `POST /api/booking`  
**Controller:** `createHotelBookingController` in `controllers/booking.controller.ts`

```
1. Auth check (JWT cookie → NextAuth session fallback)
   → 401 if unauthenticated

2. Payload parsing via parseCreateHotelBooking (validators/booking.validators.ts)
   Validates:
   - checkIn not in the past (compared at Asia/Kolkata midnight)
   - checkOut > checkIn
   - contactEmail format
   - All required string fields present
   - quantity ≥ 1, adults ≥ 1, children/infants ≥ 0

3. createHotelBooking (services/booking.service.ts) — Serializable transaction:
   a. Find Room WHERE id = roomId AND hotelId = hotelId
      AND isActive = true AND Hotel.isActive AND Hotel.isApproved AND Hotel.status = ACTIVE
   b. Validate guest count vs room.maxAdults / maxChildren
   c. checkRoomAvailability (availability.service.ts):
      - Enumerate all stay dates (checkIn to checkOut exclusive)
      - Check minAdvanceDays / maxAdvanceDays on Room
      - Load RoomAvailability rows for date range
      - Load BlackoutDate rows for date range
      - Fail fast on: blackout, isClosed, closedToCheckIn, closedToCheckOut,
        minStay violation, maxStay violation, insufficient inventory
      - Calculate subtotal summing priceOverride ?? basePrice per night × quantity
   d. reserveRoomInventory — decrements availableInventory per calendar day
   e. Create Booking + BookingRoom + InventoryReservation + Payment + BookingTimeline
      all within the same transaction
   f. Return the booking record

4. After transaction: sendBookingConfirmationEmail (async, fire-and-forget)
5. Respond 201 { success: true, data: booking }
```

**Error codes returned:**
| Condition | HTTP Status |
|---|---|
| Missing / invalid field | 409 or 400 |
| Room/hotel not found | 404 |
| Unavailable dates | 409 |
| Unauthenticated | 401 |

---

## 6. API Routes

### Public Hotel Routes

| Method | Path              | Query Params          | Action                                                        |
| ------ | ----------------- | --------------------- | ------------------------------------------------------------- |
| GET    | `/api/hotel`      | none                  | All active/approved hotels (sorted by rating)                 |
| GET    | `/api/hotel`      | `?q={term}`           | Full-text search on title, location, city, state, description |
| GET    | `/api/hotel`      | `?city={name}`        | Filter by city (case-insensitive)                             |
| GET    | `/api/hotel`      | `?random=N`           | N random hotels (max 20)                                      |
| GET    | `/api/hotel`      | `?random=N&city=X`    | N random hotels in city                                       |
| GET    | `/api/hotel/{id}` | `?checkIn=&checkOut=` | Single hotel + date-aware room availability                   |

> **Note:** The `[id]` route resolves both UUID and slug via `WHERE id = $1 OR slug = $1`

**Files:** `app/api/hotel/route.ts`, `app/api/hotel/[id]/route.ts`, `controllers/hotel.controller.ts`

---

### Booking Routes (authenticated)

| Method | Path                | Body / Query              | Action                                   |
| ------ | ------------------- | ------------------------- | ---------------------------------------- |
| POST   | `/api/booking`      | JSON body                 | Create hotel booking                     |
| GET    | `/api/booking`      | —                         | List all bookings for authenticated user |
| GET    | `/api/booking/{id}` | —                         | Get single booking (ownership check)     |
| PATCH  | `/api/booking/{id}` | `{ cancellationReason? }` | Cancel booking                           |
| DELETE | `/api/booking/{id}` | `{ reason? }`             | Cancel booking (alias)                   |

**File:** `app/api/booking/route.ts`, `app/api/booking/[id]/route.ts`

---

### My Bookings Route (authenticated)

| Method | Path               | Action                                            |
| ------ | ------------------ | ------------------------------------------------- |
| GET    | `/api/my-bookings` | Unified Hotel + Tour + Rental + Activity timeline |

**File:** `app/api/my-bookings/route.ts`

---

### Host Hotel Routes

| Method | Path                    | Action                        | File                              |
| ------ | ----------------------- | ----------------------------- | --------------------------------- |
| GET    | `/api/host/hotels/{id}` | Load hotel for editing        | `controllers/hotel.controller.ts` |
| POST   | `/api/host/hotels`      | Create new hotel listing      | `controllers/hotel.controller.ts` |
| PUT    | `/api/host/hotels/{id}` | Update hotel + rooms + images | `controllers/hotel.controller.ts` |
| DELETE | `/api/host/hotels/{id}` | Hard delete hotel             | `controllers/hotel.controller.ts` |

> **⚠ Gap:** No `app/api/host/hotels` route file exists. The host hotel editor calls `/api/host/hotels` and `/api/host/hotels/{id}` via `axios`, but no matching Next.js route files were found. This means the host form will receive 404s until those route files are created. The controller functions exist (`createHotelController`, `updateHotelController`, etc.) and just need to be wired.

---

### Host Booking Route

| Method | Path                 | Action                      |
| ------ | -------------------- | --------------------------- |
| GET    | `/api/host/bookings` | Booking queue for this host |
| PUT    | `/api/host/bookings` | Update booking status       |

> **⚠ Gap:** No `app/api/host/bookings` route file exists. The Host Bookings page (`app/host/bookings/page.tsx`) calls this endpoint but will receive 404s.

---

## 7. Controllers

### `controllers/hotel.controller.ts`

**Public handlers:**
| Function | HTTP | Notes |
|---|---|---|
| `getAllHotelsController` | GET `/api/hotel` | |
| `getHotelByIdController` | GET `/api/hotel/{id}` | Passes checkIn/checkOut from query params |
| `getHotelBySlugController` | GET — | Defined but **not routed** |
| `getHotelsByLocationController` | GET `?city=` | |
| `searchHotelsController` | GET `?q=` | Falls back to getAllHotels for empty query |
| `getRandomHotelsController` | GET `?random=` | |

**Host handlers (need route files):**
| Function | Notes |
|---|---|
| `createHotelController` | Requires authenticated host; calls `createHotel` service |
| `updateHotelController` | Re-submits to admin review on every edit |
| `deleteHotelController` | Hard delete |
| `getHostHotelController` | Returns hotel with full editable data for the form |

---

### `controllers/booking.controller.ts`

| Function                       | Notes                                              |
| ------------------------------ | -------------------------------------------------- |
| `createHotelBookingController` | Auth → parse → `createHotelBooking`                |
| `listUserBookingsController`   | Returns all bookings for caller                    |
| `getBookingByIdController`     | Ownership check (booking.userId === caller)        |
| `cancelBookingController`      | Accepts `cancellationReason` or `reason` from body |

**Auth resolution order:**

1. JWT cookie (`token`) → `getUserFromSessionToken`
2. NextAuth session → `getServerSession(authOptions)`

---

## 8. Services

### `services/hotel.service.ts`

**Public functions:**
| Function | Description |
|---|---|
| `getAllHotels()` | Active + approved hotels, sorted by rating desc |
| `getPublicHotelById(id, range?)` | Hotel by id or slug; attaches room availability if dates provided |
| `getPublicHotelBySlug(slug, range?)` | Hotel by slug or id; same availability enrichment |
| `getHotelsByLocation(city)` | Case-insensitive city filter |
| `searchHotels(query)` | Multi-field text search |
| `getRandomHotels(count, city?)` | Random sample with optional city filter |
| `getRoomAvailabilityByDate(db, roomIds, range)` | Min available count per room for stay window |

**Host functions:**
| Function | Description |
|---|---|
| `createHotel(hostId, data)` | Creates Hotel + images + amenities + rules + rooms in transaction |
| `updateHotel(id, data)` | Replaces images, amenities, rules; syncs room array |
| `deleteHotel(id)` | Hard delete |

**`PUBLIC_WHERE` filter (applied to every guest query):**

```ts
{ isActive: true, isApproved: true, status: "ACTIVE", deletedAt: null }
```

---

### `services/booking.service.ts`

| Function                                  | Description                                                                        |
| ----------------------------------------- | ---------------------------------------------------------------------------------- |
| `createHotelBooking(userId, input)`       | Serializable transaction (see §5.2)                                                |
| `cancelHotelBooking(userId, id, reason?)` | Serializable transaction; releases inventory, updates Payment, adds timeline event |
| `getBookingById(id)`                      | Full include: Hotel, BookingRoom, BookingTimeline, InventoryReservation, Payment   |
| `listBookingsForUser(userId)`             | Hotel + BookingRoom + Payment summary, desc by createdAt                           |

**Constants:**

```ts
TAX_RATE = 0.12;
HOLD_MINUTES = 15;
PLATFORM_FEE_RATE = 0.1;
```

---

### `services/availability.service.ts`

The core inventory engine. See §9 for full detail.

---

### `services/my-bookings.service.ts`

Merges hotel, tour, rental, and activity bookings into a single `UnifiedBookingRecord[]` sorted by date. Shapes each record with:

- `bookingType`: HOTEL | TOUR | RENTAL | ACTIVITY
- `title`, `subtitle`, `location`
- `startDate`, `endDate`
- `status`, `paymentStatus`
- `totalAmount`, `currency`
- `bookingCode`
- `href` — deep link to detail page

---

## 9. Availability & Inventory Engine

**File:** `services/availability.service.ts`

### Core functions

#### `createRoomAvailabilityCalendar(input)`

Creates one `RoomAvailability` row per date from `startDate` to `endDate` (default today + 365 days). Uses `skipDuplicates` so it is safe to call multiple times. Called when a new room is created.

#### `checkRoomAvailability(input, db?): AvailabilityQuote`

Checks a proposed `{ roomId, checkIn, checkOut, quantity }` against live calendar data.

**Checks in order:**

1. Stay dates not empty (checkOut > checkIn)
2. checkIn not in past (evaluated at `Asia/Kolkata` midnight)
3. Room exists and is active
4. `minAdvanceDays` — booking too close to check-in
5. `maxAdvanceDays` — booking too far in advance
6. Any `BlackoutDate` rows in range → fail with reason
7. Per-date loop through `RoomAvailability`:
   - `isClosed` → fail
   - First date: `closedToCheckIn` → fail
   - Last date: `closedToCheckOut` → fail
   - `minStay` / `maxStay` violation → fail
   - Accumulate `minAvailable` (minimum availability across all stay dates)
   - Sum `priceOverride ?? basePrice` × `quantity` into subtotal
8. `minAvailable < quantity` → fail with count message
9. Return `{ available: true, nights, minAvailable, subtotal }`

#### `reserveRoomInventory(input, db)`

Decrements `availableInventory` per calendar date for the stay. Uses `updateMany` with optimistic locking condition `availableInventory >= quantity`. Throws if any date cannot be reserved.

#### `releaseReservedRoomInventory(input, db)`

Increments `availableInventory` per calendar date during cancellation.

#### `enumerateStayDates(checkIn, checkOut)`

Returns one `Date` per booked **night** (excludes checkout date).

#### `getTodayStayDate()`

Returns today at UTC midnight in `Asia/Kolkata` timezone, used for past-date validation.

---

## 10. Validators

**File:** `validators/booking.validators.ts`

**`parseCreateHotelBooking(request): CreateHotelBookingInput`**

Validates and returns:

| Field             | Type    | Rules                                                     |
| ----------------- | ------- | --------------------------------------------------------- |
| `hotelId`         | string  | Required, non-empty                                       |
| `roomId`          | string  | Required, non-empty                                       |
| `checkIn`         | Date    | Required; parsed at UTC midnight; must not be in the past |
| `checkOut`        | Date    | Required; must be strictly after checkIn                  |
| `quantity`        | int ≥ 1 | Defaults to 1                                             |
| `adults`          | int ≥ 1 | Falls back to `guests` if `adults` absent                 |
| `children`        | int ≥ 0 | Defaults to 0                                             |
| `infants`         | int ≥ 0 | Defaults to 0                                             |
| `contactName`     | string  | Required                                                  |
| `contactEmail`    | string  | Required; must match `@` email pattern                    |
| `contactPhone`    | string  | Required                                                  |
| `specialRequests` | string? | Optional                                                  |

---

## 11. Host-Facing Pages & Management

### 11.1 Hotel Create / Edit Form

**File:** `app/host/hotels/[id]/page.tsx`

The page works for both create (`/host/hotels/new`) and edit (`/host/hotels/{id}`).

**Sections in the form:**

1. **Basic Information** — name, slug (auto-generated), property type, star rating, listing status (view only on edit), active toggle, description
2. **Contact & Policies** — phone, email, check-in / check-out time, cancellation policy, pet policy, child policy
3. **Location** — display location, street address, city, state, country, postal code, optional GPS coordinates
4. **Amenities** — multi-select chip grid (12 options with icons: WiFi, Pool, Gym, Restaurant, Bar, Conference, Parking, Room Service, Spa, Laundry, Pet, AC)
5. **House Rules** — dynamic list of free-text rules
6. **Property Images** — dynamic list of Cloudinary URLs via `PhotoUploader`
7. **Room Types** — dynamic room array; per room: name, type, description, pricing, capacity, bed config, size, view, amenities (14 options), images, smoking/active flags
8. **Submit** — calls POST `/api/host/hotels` (create) or PUT `/api/host/hotels/{id}` (update)

**Edit note:** Any save on an existing hotel resets its `status` to `PENDING_REVIEW`, removing it from public listing until re-approved by admin.

---

### 11.2 Host Booking Queue

**File:** `app/host/bookings/page.tsx`

**Features:**

- Fetches `GET /api/host/bookings?status=&type=` with filter support
- Stats bar: total bookings, confirmed, pending review, total revenue
- Table view (desktop) + card view (mobile)
- Per-booking status dropdown: Pending → Confirm → Complete → Cancel
- Calls `PUT /api/host/bookings { bookingId, status }` on status change

**⚠ Note:** Route `/api/host/bookings` does not exist yet (see §19).

---

## 12. Admin-Facing Booking Management

**File:** `app/admin/bookings/page.tsx`  
**Route:** `app/api/admin/bookings/route.ts`

Allows admins to:

- View all bookings across all hotels, tours, and rentals
- Filter by status, type, date range
- Override booking status
- View booking details, guest info, payment status

Authentication is enforced via `utils/admin-auth.ts` — only ADMIN role users can access these routes.

---

## 13. User Booking Management

### 13.1 My Bookings Page

**File:** `app/my-bookings/page.tsx`

- Calls `GET /api/my-bookings` to load the unified timeline
- Filter tabs: All / Hotels / Tours / Rentals / Activities with counts
- Each booking card shows: type badge, status badge, payment status, title, dates, location, booking code, total amount
- "View details" button links to booking detail (e.g. `/profile`)
- Loading skeleton of 4 cards during fetch
- Graceful error state and empty state with CTA links

### 13.2 Profile Page Bookings

**File:** `app/profile/page.tsx`

Uses `lib/booking.ts` helpers:

- `getUserBookings()` → `GET /api/booking`
- `cancelBooking(id, reason)` → `PATCH /api/booking/{id}`

**`lib/booking.ts` functions:**
| Function | Method | Endpoint |
|---|---|---|
| `getUserBookings()` | GET | `/booking` |
| `getBookingById(id)` | GET | `/booking/{id}` |
| `cancelBooking(id, reason?)` | PATCH | `/booking/{id}` |

---

## 14. Email Notifications

**File:** `lib/mail.ts`

**`sendBookingConfirmationEmail(params)`** is called immediately after the booking transaction succeeds. It is fire-and-forget (`await ... .catch(err => log(err))`) so email failure does not roll back the booking.

**Email includes:**

- Guest name and booking code
- Hotel name and city
- Check-in / check-out dates
- Room breakdown table (room name, quantity, nights, price per night, total)
- Grand total with currency
- Link to profile page for booking management

The email uses the `resend` library (configured in `lib/resend.ts`).

---

## 15. Pricing & Financial Calculations

All calculations happen inside `services/booking.service.ts`:

```
Room subtotal  = priceOverride_or_basePrice_per_night × quantity × nights
Tax            = subtotal × 0.12
Total amount   = subtotal + taxes
Platform fee   = totalAmount × 0.10
Host earnings  = totalAmount - platformFee
```

All values are stored as `Decimal(10,2)` in Postgres to avoid floating-point drift. Intermediate calculations use `Number.toFixed(2)` via the `toMoney()` helper before being wrapped in `new Prisma.Decimal(...)`.

**Seasonal pricing:** The `SeasonalPricing` model exists in the schema for future date-range price overrides per room, but the `checkRoomAvailability` function currently reads `priceOverride` from the `RoomAvailability` calendar rows, not from `SeasonalPricing` directly.

---

## 16. Cancellation Flow

**Trigger:** `PATCH /api/booking/{id}` or `DELETE /api/booking/{id}`  
**Service:** `cancelHotelBooking(userId, id, reason)` — Serializable transaction

**Steps inside transaction:**

1. Find booking by `{ id, userId }` — ensures guest can only cancel own bookings
2. If already `CANCELLED` → return early (idempotent)
3. If status is not `PENDING` or `CONFIRMED` → throw "can no longer be cancelled"
4. For each `BookingRoom` where `inventoryReserved = true`:
   - Call `releaseReservedRoomInventory` → increments `availableInventory` per calendar day
5. Update all `ACTIVE` `InventoryReservation` rows for this booking → `CANCELLED`
6. Set all `BookingRoom.inventoryReserved = false`
7. Update `Payment`:
   - If `SUCCESS` → `REFUNDED` with `refundedAt` and `refundReason`
   - If `PENDING` → `FAILED`
8. Update `Booking.status = CANCELLED`, set `cancelledAt`, `cancellationReason`
9. Add `BookingTimeline` event: type `CANCELLED`

**Result:** Inventory is immediately released for the cancelled stay dates, making those rooms bookable again.

---

## 17. Wishlist Integration

**Context:** `contexts/WishlistContext.tsx` (localStorage-backed)

Hotels can be wishlisted from:

- `/hotels` listing page — heart button on each card
- `/hotels/{slug}` detail page — heart button in header area

**`WishlistItem` shape:**

```ts
{ id: string, slug: string, title: string, image: string, price: number, type: "hotel" }
```

The wishlist count is displayed in the profile dropdown menu. The `/wishlist` page shows the full saved list.

---

## 18. Component Library Used

| Component       | File                                | Purpose                             |
| --------------- | ----------------------------------- | ----------------------------------- |
| `HotelGallery`  | `components/hotel/HotelGallery.tsx` | Image gallery with lightbox         |
| `HotelReviews`  | `components/hotel/HotelReviews.tsx` | Review list                         |
| `HotelFilters`  | `components/hotel/HotelFilters.tsx` | Filter panel on listing page        |
| `MapSection`    | `components/hotel/MapSection.tsx`   | Location map embed                  |
| `MapPreview`    | `components/hotel/MapPreview.tsx`   | Compact map thumbnail               |
| `MapModal`      | `components/hotel/MapModal.tsx`     | Full-size map modal                 |
| `SearchBar`     | `components/search/SearchBar.tsx`   | Location + date search              |
| `PhotoUploader` | `components/ui/PhotoUploader.tsx`   | Cloudinary image upload (host form) |

---

## 19. Known Gaps & Incomplete Wiring

| Gap                                        | Impact                                                                                                 | Fix Required                                                                                                                                                                               |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| No `app/api/host/hotels` route file        | Host form gets 404 on create/update                                                                    | Create `app/api/host/hotels/route.ts` and `app/api/host/hotels/[id]/route.ts` wired to `createHotelController`, `updateHotelController`, `getHostHotelController`, `deleteHotelController` |
| No `app/api/host/bookings` route file      | Host booking queue is non-functional                                                                   | Create `app/api/host/bookings/route.ts` with GET (list by hostId) and PUT (status update)                                                                                                  |
| `getHotelBySlugController` not routed      | Slug-based lookup controller exists but is dead code                                                   | Either wire it to a new route or remove it (the existing `[id]` route already resolves slugs via service)                                                                                  |
| Razorpay payment not integrated            | `Payment.provider = "razorpay"` but no payment gateway call exists                                     | Add Razorpay order creation after booking is created, and a webhook handler to set `Payment.status = SUCCESS`                                                                              |
| `SeasonalPricing` not used in availability | Model and schema exist but `checkRoomAvailability` reads from `RoomAvailability` not `SeasonalPricing` | Populate `priceOverride` from `SeasonalPricing` when building the calendar, or read it directly during the quote                                                                           |
| Hold expiry not enforced                   | PENDING bookings with expired `expiresAt` are not automatically released                               | Add a cron job or background task that cancels expired PENDING bookings and releases their inventory                                                                                       |
| Promo "GETHOTELS10" is client-only         | The 10 % discount is calculated in the browser; the server always sets `discount = 0`                  | Wire the promo to the `Coupon` model in the booking service                                                                                                                                |
| `BookingGuest` not populated               | The schema has a detailed guest info model but the booking creation does not write to it               | Extend the booking form and creation service if per-traveller identity is required                                                                                                         |

---

## 20. Data Flow Diagram

```
Guest Browser
     │
     ├─ GET /api/hotel?q=manali
     │        └─ searchHotels("manali") → Hotel[] with Rooms, Images, Amenities
     │
     ├─ GET /api/hotel/{slug}?checkIn=2026-06-01&checkOut=2026-06-03
     │        └─ getPublicHotelById(slug, { checkIn, checkOut })
     │             ├─ Find hotel (isActive + isApproved + ACTIVE + not deleted)
     │             ├─ getRoomAvailabilityByDate(roomIds, range)
     │             │    ├─ Load RoomAvailability rows for date range
     │             │    └─ Subtract overlapping PENDING/CONFIRMED BookingRoom quantities
     │             └─ Return Hotel + Rooms with dateAvailableRooms
     │
     ├─ User fills modal → POST /api/booking
     │        └─ parseCreateHotelBooking(request) — validate
     │             └─ createHotelBooking(userId, input)  ← Serializable TX
     │                  ├─ findFirst Room (active hotel, active room)
     │                  ├─ checkRoomAvailability  ← availability.service.ts
     │                  │    ├─ RoomAvailability calendar rows
     │                  │    └─ BlackoutDate rows
     │                  ├─ reserveRoomInventory  ← decrements calendar
     │                  ├─ create Booking
     │                  ├─ create BookingRoom (snapshot)
     │                  ├─ create InventoryReservation (15-min hold)
     │                  ├─ create Payment (PENDING)
     │                  └─ create BookingTimeline (CREATED)
     │             └─ sendBookingConfirmationEmail (async)
     │             └─ return 201 { bookingCode, ... }
     │
     ├─ GET /api/my-bookings
     │        └─ Merge hotel + tour + rental + activity bookings → UnifiedBookingRecord[]
     │
     └─ PATCH /api/booking/{id}  { cancellationReason }
              └─ cancelHotelBooking(userId, id)  ← Serializable TX
                   ├─ releaseReservedRoomInventory per BookingRoom
                   ├─ InventoryReservation → CANCELLED
                   ├─ BookingRoom.inventoryReserved → false
                   ├─ Payment → REFUNDED / FAILED
                   ├─ Booking.status → CANCELLED
                   └─ BookingTimeline (CANCELLED)
```

---

_Document generated by scanning source code. Last updated: May 2026._
