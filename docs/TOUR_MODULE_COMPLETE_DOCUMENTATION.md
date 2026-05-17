# Tour Module Complete Documentation (User + Host + Admin)

Last verified: 2026-05-15

This document is the complete functional and UI specification for the Tours module across all personas:

- Traveler/User
- Host
- Admin

It includes page-level UI behavior, role-based flows, API mapping, data states, and operational rules.

## 1. Module Overview

The Tours module supports:

- Public tour discovery and detail viewing
- Role-aware joining and booking (approval-first or instant payment)
- Participant-only and host chat rooms
- Host-side creation and lifecycle management of tours
- Admin moderation and governance of tour listings

Core architecture pattern:

- Frontend: Next.js app routes with client-side fetching and rich stateful UI
- Backend: Next API routes -> controllers -> services -> Prisma/PostgreSQL
- Real-time: Socket.IO for live chat
- Payments: Razorpay order + verification flow

## 2. Persona and Access Matrix

### Traveler/User

- Can browse `/tours` and `/tours/[slug]` without login
- Must be authenticated for:
  - Join request submission
  - Booking creation and payment
  - Waitlist joining
  - Participant list access
  - Participant chat access
  - Review submission (only after completed booking)

### Host

- Can manage own tours via host dashboard and editor
- Can create/edit/delete own tours
- Can review join requests (approve/reject)
- Can access host chat scope for owned tours
- Can create operational assets (batches, announcements, documents)

### Admin

- Can review and moderate tour listings
- Can move listings across moderation statuses
- Can set active/paused/archive decisions with reasons

## 3. Route Inventory

## 3.1 Traveler-facing routes

- `/tours` -> discovery, search, filters, sorting, card layouts
- `/tours/[slug]` -> detailed conversion page with booking/join entry points
- `/tours/[slug]/chat` -> participant chat room (joined traveler only)
- `/my-bookings` -> unified bookings including tours

## 3.2 Host-facing routes

- `/host/tours` -> host tour operations dashboard and listing management
- `/host/tours/[id]` -> create/edit tour studio (`id = new` for create)
- `/host/tours/[id]/participants` -> participant review UI (currently local/mock UI)
- `/host/tours/[id]/chat` -> host moderation chat panel

## 3.3 Admin-facing routes

- `/admin/tours` -> dedicated tour moderation center

## 3.4 Tour API routes

- `GET /api/tour` -> list public tours
- `POST /api/tour` -> create tour (host)
- `GET /api/tour/[id]` -> get public tour by slug/id OR host form data with `scope=mine`
- `PUT /api/tour/[id]` -> update host-owned tour
- `DELETE /api/tour/[id]` -> delete host-owned tour
- `POST /api/tour/[id]/join-request` -> traveler join request
- `PATCH /api/tour/[id]/join-request/[requestId]` -> host approve/reject request
- `POST /api/tour/[id]/booking` -> create tour booking
- `POST /api/tour/[id]/payment/order` -> create Razorpay order for booking
- `POST /api/tour/[id]/payment/verify` -> verify and confirm booking
- `GET /api/tour/[id]/participants` -> joined participant roster
- `GET /api/tour/[id]/chat` -> chat preview and messages (role/scope protected)
- `POST /api/tour/[id]/chat` -> send chat message
- `GET /api/tour/[id]/reviews` -> published reviews list
- `POST /api/tour/[id]/reviews` -> create/update review (completed bookings only)
- `GET /api/tour/[id]/batches` -> list departures (with fallback departure)
- `POST /api/tour/[id]/batches` -> create departure batch (host)
- `GET /api/tour/[id]/announcements` -> list announcements
- `POST /api/tour/[id]/announcements` -> create announcement (host)
- `GET /api/tour/[id]/documents` -> list documents (optionally participant scoped)
- `POST /api/tour/[id]/documents` -> create document (host)
- `POST /api/tour/[id]/waitlist` -> join waitlist

## 3.5 Admin API routes used by tour moderation

- `GET /api/admin/listings?type=tour&status=...&search=...` -> moderation list
- `PATCH /api/admin/listings/tour/[id]` -> moderation decision update

## 4. Traveler UI and Functionality

## 4.1 Tours Listing Page (`/tours`)

### Visual sections

- Hero with gradient background and top-level stats
- Search strip with query input and clear action
- Sticky filter/control row
- Result summary + clear filters state
- Grid/list card results
- Empty state when no records match
- Trust/features strip and custom-tour CTA section

### Functional behaviors

- Starts with local fallback data, then fetches public tours from API
- Search matches title, destination, city, country, tags
- Category filters: all/adventure/relaxation/cultural
- Sort options: recommended, price asc/desc, rating desc, shortest duration
- Desktop grid/list toggle
- Card click opens tour details; wishlist action is isolated from navigation

### State handling

- Loading: only summary text indicates loading
- API failure: fallback tours remain visible
- Empty: reset button restores all tours

## 4.2 Tour Card Component

### Grid mode

- Cover image, duration chip, category chip, rating chip
- Wishlist heart in top area
- Title, destination, truncated description
- Highlights chips with overflow count
- Group size and best-time metadata
- Price and CTA

### List mode

- Left image, right content panel
- Rating and review summary near title
- Up to four highlights
- Meta row with duration/group/time
- Larger details CTA

### Wishlist behavior

- Context-based toggle (`type: tour`)
- Adds/removes with optimistic heart animation
- Payload uses slug as stable id for wishlist entries

## 4.3 Tour Detail Page (`/tours/[slug]`)

### Data loading

- Reads route slug
- Tries local fallback first
- Fetches latest from `GET /api/tour/[slug]`
- On auth, probes chat access via `GET /api/tour/[slug]/chat?scope=participant`
- Loads:
  - Departure batches
  - Announcements
  - Reviews

### Hero and top conversion UI

- Large media hero with overlays
- Back navigation to listing
- Category, difficulty, and availability badges
- Destination, rating, duration, and price emphasis
- Gallery quick previews and lightbox launcher

### Section nav and content blocks

- Sticky anchor nav: overview, gallery, itinerary, safety, host, reviews, location, FAQ
- Overview cards include duration/group/difficulty/language/timing facts
- Gallery grid with lightbox interactions
- Itinerary day accordion and day jump controls
- Inclusions/exclusions lists
- Safety/eligibility controls shown as explicit chips/cards
- Host profile summary block
- Similar tours recommendations block

### Batch and availability operations

- Departure selector if multiple batches exist
- Availability and pricing adjust per selected batch
- Sold-out handling surfaces waitlist action
- Waitlist join calls `POST /api/tour/[slug]/waitlist`

### Booking/join entry points

- If `joinApprovalRequired = true`:
  - CTA opens request flow in GroupBooking modal
- If approval not required:
  - CTA opens instant booking + payment flow in GroupBooking modal

### Chat teaser and unlock logic

- Chat preview only unlocks when participant scope is authorized
- Unlocked users can open `/tours/[slug]/chat`
- Locked users see restricted state until they join/confirm

## 4.4 GroupBooking Modal (shared conversion component)

### Access and prefill

- Guest users are prompted to login (`/login?next=/tours/[slug]`)
- Authenticated users get prefilled contact name/email/phone from auth context

### Two operating modes

- Approval mode:
  - Submits introduction to `/api/tour/[id]/join-request`
  - Success state returns request id and pending status
- Instant booking mode:
  - Creates booking `/api/tour/[id]/booking`
  - Creates payment order `/api/tour/[id]/payment/order`
  - Opens Razorpay checkout
  - Verifies payment `/api/tour/[id]/payment/verify`
  - Success state returns booking code and confirmation details

### Input and validation behavior

- Requires contact details for submit
- Instant mode includes guest stepper and dynamic pricing summary
- Blocks submit on sold-out state
- Shows inline error panel for API/payment failures

### Pricing display

- Unit price from selected batch when available, else tour base price
- Tax applied at 12%
- Real-time subtotal/tax/total breakdown

## 4.5 Traveler Chat Page (`/tours/[slug]/chat`)

### Authorization and load

- Requires authenticated user
- Loads room and messages with participant scope
- Shows lock message when scope check fails

### Real-time features

- Socket connects to `NEXT_PUBLIC_SOCKET_URL` (fallback localhost)
- Room join event uses `tour:join`
- Receives:
  - `tour:message:new`
  - typing start/stop events
  - reaction events
  - message errors
- Sends via socket when connected, falls back to REST POST otherwise

### UI states

- Loading placeholder
- Locked panel on authorization errors
- Empty-room message
- Message list with sender and reaction chips
- Disabled composer during blocked/sending conditions

## 4.6 My Bookings integration

- Tours appear under booking type `TOUR`
- Booking card shows:
  - booking status
  - payment status
  - date range
  - amount and reference data
- Unified filtering with hotels/rentals/activities

## 5. Host UI and Functionality

## 5.1 Host Tour Dashboard (`/host/tours`)

### Top-level dashboard

- Header with create-tour CTA
- KPI cards:
  - active tours
  - upcoming
  - total bookings
  - estimated revenue
  - average rating
  - pending review count

### Search/filter/sort controls

- Search by title/destination/city/status
- Status filter: all, DRAFT, PENDING_REVIEW, ACTIVE, PAUSED, REJECTED, ARCHIVED
- Sort: newest, bookings, rating, slots left

### Tour cards and quick actions

- Card-level status badge and operational metrics
- Actions:
  - Edit (`/host/tours/[id]`)
  - Participants (`/host/tours/[id]/participants`)
  - Chat (`/host/tours/[id]/chat`)
  - Duplicate (UI placeholder)
  - Archive (UI placeholder)

## 5.2 Host Tour Studio (`/host/tours/[id]`)

### Form modes

- Create mode when `id = new`
- Edit mode when `id` is existing tour id

### Persistent editing behavior

- Local draft auto-save to localStorage
- Draft restore in create mode
- Unsaved changes warning on page unload
- Progress tracker across major sections

### Sectioned editor (10 blocks)

- Basics
- Location
- Schedule
- Group
- Safety
- Pricing
- Content
- Itinerary
- Media
- Policies

### Field-level behavior highlights

- Auto slug from title (create mode)
- Duration auto-sync with start/end date and itinerary day count
- Itinerary reorder/move up/down controls
- Multi-value dynamic lists for tags/highlights/included/excluded
- Language chip toggles merged into comma-separated storage
- Image management through photo uploader component

### Validation rules (client)

- Required title, slug, destination, description length, date consistency
- Registration deadline must be before start date
- Slots and available slots coherence checks
- Price required and original price floor checks
- At least one image and one itinerary day required

### Submit behavior

- Create -> `POST /api/tour`
- Update -> `PUT /api/tour/[id]`
- Clears draft on success and redirects to host area

## 5.3 Host Participants Page (`/host/tours/[id]/participants`)

Current status:

- UI-rich safety review surface with:
  - search
  - participant list
  - profile panel
  - approve/reject controls
  - private notes
- Data is currently static mock data in the page component

Production note:

- Approval actions should be wired to join request APIs for full backend parity.

## 5.4 Host Chat Page (`/host/tours/[id]/chat`)

### Host operations layout

- Left rail: category shortcuts (announcements/pins/images/system)
- Center: room stream + composer
- Right rail: moderation controls (mute/remove/pin/share/safety notice)

### Data and real-time behavior

- Loads via `GET /api/tour/[id]/chat`
- Sends via socket `tour:message:send` or REST fallback
- Maintains connected/reconnecting status banner

## 5.5 Host operational APIs (departures, announcements, docs)

### Departure batches

- `GET /api/tour/[id]/batches` lists stored batches or fallback primary departure
- `POST /api/tour/[id]/batches` creates host-owned batch
- Derived batch status logic includes `SOLD_OUT` and `ALMOST_FULL`

### Announcements

- `GET /api/tour/[id]/announcements` latest pinned-first list
- `POST /api/tour/[id]/announcements` requires title + message

### Documents

- `GET /api/tour/[id]/documents` supports participant scope filtering
- `POST /api/tour/[id]/documents` creates host document with visibility flags

## 6. Admin UI and Functionality

## 6.1 Admin Tour Moderation (`/admin/tours`)

### Page objectives

- Review host-submitted tours before and after activation
- Detect risk and enforce listing policy

### Dashboard and filters

- KPI cards (tours, approved, flagged, bookings, revenue, complaints)
- Search by tour/host/destination
- Status tabs: all, pending, active, rejected, paused, archived

### Risk scoring presentation

- Row-level computed risk labels:
  - Low risk
  - Review needed
  - High risk
- Based on status, approval flag, booking-review mismatch, price, slot count

### Review modal

- Tour snapshot and metrics
- Risk checklist panel
- Host-visible decision reason
- Internal moderation notes
- Decision actions:
  - Approve -> ACTIVE + active true
  - Reject -> REJECTED + active false
  - Suspend -> PAUSED + active false
  - Archive -> ARCHIVED + active false
  - Changes requested -> PENDING_REVIEW + active false

### API integration

- List: `GET /api/admin/listings?type=tour&...`
- Decision update: `PATCH /api/admin/listings/tour/[id]`

## 7. Backend Flow Specifications

## 7.1 Listing visibility and retrieval

- Public listing returns only tours meeting:
  - status ACTIVE
  - isActive true
  - isApproved true
- Host listing scope returns host-owned tours regardless of public visibility state

## 7.2 Join eligibility gate

Before join request or booking:

- Tour must exist and have slots
- Tour must not have started
- Registration deadline must be valid
- User must not already be active participant
- No duplicate pending join request
- Women-only gate checks traveler profile gender
- Verified-only gate requires completed profile

## 7.3 Join request flow (approval-required tours)

1. Traveler posts join request
2. Host reviews with approve/reject action
3. Approve action:
   - marks request approved
   - upserts tour participant as approved
   - ensures chat room exists
4. Reject action marks request rejected

## 7.4 Instant booking and payment flow

1. Traveler submits booking request with guests/contact details
2. System validates availability and approval constraints
3. Booking created in PENDING with payment row in PENDING
4. Razorpay order generated
5. Client completes Razorpay checkout
6. Payment verify endpoint checks HMAC signature
7. Confirmation transaction:
   - decrements tour slots atomically
   - decrements selected batch seats when batch selected
   - marks payment success
   - upserts participant status JOINED
   - ensures chat room exists
   - marks booking CONFIRMED
   - appends timeline event
8. Confirmation email is dispatched

## 7.5 Waitlist flow

- On sold-out conditions user can join waitlist
- Position is assigned as max existing + 1
- Upsert prevents duplicate queue entries per user/tour/batch scope
- System notification is created for the user

## 7.6 Chat authorization model

- Host-or-participant scope:
  - host owner OR participant status JOINED
- Participant scope:
  - participant status JOINED only
- Chat disabled for completed/cancelled tours
- Message length max 2000 chars
- Room auto-created on first message/approval/confirmation event

## 7.7 Reviews flow

- Public `GET` returns published tour reviews
- `POST` requires authenticated user and completed tour booking
- Upsert per booking id avoids duplicate reviews per completed booking

## 8. Status and State Models

## 8.1 Listing status lifecycle (tour listing)

- DRAFT
- PENDING_REVIEW
- ACTIVE
- PAUSED
- REJECTED
- ARCHIVED

Moderation influence:

- Admin decision controls status + active visibility flag

## 8.2 Participant status lifecycle

- PENDING (join requested)
- APPROVED (approved before booking)
- JOINED (booking/payment confirmed)
- COMPLETED (post-tour)
- REJECTED/CANCELLED terminal variants

## 8.3 Booking/payment lifecycle

- Booking: PENDING -> CONFIRMED -> COMPLETED/CANCELLED
- Payment: PENDING -> PROCESSING -> SUCCESS (or failed states)

## 9. UI State Inventory by Role

## 9.1 Traveler critical UI states

- Listing loading/fallback/empty
- Detail loading/not-found
- Chat locked vs unlocked preview
- GroupBooking guest prompt vs authenticated form
- Join request success vs booking payment success
- Sold-out with waitlist path

## 9.2 Host critical UI states

- Dashboard loading/empty/list
- Editor validation errors and save states
- Draft restored and autosave timestamp
- Chat connected vs reconnecting

## 9.3 Admin critical UI states

- Queue loading/empty/list
- Risk-tag variance
- Review modal open/saving/decision applied

## 10. Security, Validation, and Enforcement Notes

- Auth resolution supports cookie token and NextAuth session fallback
- Host-only mutating endpoints verify host ownership against tour hostId
- Admin endpoints are wrapped with admin guard checks
- Payment confirmation protected by Razorpay signature verification
- Slot deductions are transactional with serializable isolation for consistency
- Participant chat and participant list are role-gated

## 11. Known Implementation Gaps and Practical Notes

- Host participants page currently uses static participant data in UI and is not yet wired to live participant/join-request APIs
- Host dashboard duplicate/archive quick-action buttons are present as UI controls and need API wiring for full behavior
- Some tour detail computed dates (hero/summary placeholders) are client-computed display values and not always direct DB schedule values
- Tour reviews increment logic increments total counter during review writes; audit strategy may be needed to avoid drift if many edits occur

## 12. End-to-End Flow Summaries

## 12.1 Traveler flow A: Approval-required tour

1. Traveler discovers tour in listing and opens detail page
2. Opens booking modal in request mode
3. Submits introduction and contact details
4. Host approves request from host operations workflow
5. Traveler proceeds to booking/payment
6. Booking confirms and traveler gets chat access

## 12.2 Traveler flow B: Instant booking tour

1. Traveler chooses departure and guest count
2. Creates booking and Razorpay order
3. Completes checkout and verification
4. Booking confirmed, slots updated, email sent, chat unlocked

## 12.3 Host flow

1. Host creates/edits tour in studio
2. Sets safety, pricing, itinerary, media, and policy details
3. Submits for review or updates existing listing
4. Manages participants, announcements, documents, and chat

## 12.4 Admin flow

1. Admin opens tour moderation queue
2. Filters by status and risk context
3. Reviews listing detail and notes
4. Applies moderation decision with optional reason
5. Listing visibility and lifecycle state updates accordingly

## 13. Source Files Referenced

Primary implementation files:

- `app/tours/page.tsx`
- `app/tours/[slug]/page.tsx`
- `app/tours/[slug]/chat/page.tsx`
- `components/tour/TourCard.tsx`
- `components/tour/GroupBooking.tsx`
- `app/host/tours/page.tsx`
- `app/host/tours/[id]/page.tsx`
- `app/host/tours/[id]/participants/page.tsx`
- `app/host/tours/[id]/chat/page.tsx`
- `app/admin/tours/page.tsx`
- `controllers/tour.controller.ts`
- `controllers/tour-operations.controller.ts`
- `services/tour.service.ts`
- `services/tour-operations.service.ts`
- `controllers/admin.controller.ts`
- `services/admin.service.ts`

API route files:

- `app/api/tour/route.ts`
- `app/api/tour/[id]/route.ts`
- `app/api/tour/[id]/join-request/route.ts`
- `app/api/tour/[id]/join-request/[requestId]/route.ts`
- `app/api/tour/[id]/booking/route.ts`
- `app/api/tour/[id]/payment/order/route.ts`
- `app/api/tour/[id]/payment/verify/route.ts`
- `app/api/tour/[id]/participants/route.ts`
- `app/api/tour/[id]/chat/route.ts`
- `app/api/tour/[id]/reviews/route.ts`
- `app/api/tour/[id]/batches/route.ts`
- `app/api/tour/[id]/announcements/route.ts`
- `app/api/tour/[id]/documents/route.ts`
- `app/api/tour/[id]/waitlist/route.ts`
- `app/api/admin/listings/route.ts`
- `app/api/admin/listings/[type]/[id]/route.ts`

## 14. In-Depth UI Element Inventory (Complete)

This section enumerates the full UI surface used in the tour module, grouped by page and component.

## 14.1 Global Tour UI Primitives

These element types repeat across traveler, host, and admin pages:

- Page wrappers:
  - Full-height shells (`min-h-screen` patterns)
  - Section containers with max-width constraints
  - Sticky sub-navigation zones
- Cards:
  - Standard rounded cards
  - Elevated KPI/summary cards
  - Action cards with hover lift and shadow transitions
- Chips and pills:
  - Category pills
  - Status pills
  - Risk level pills
  - Tag/highlight chips
- Buttons:
  - Primary CTA buttons (filled)
  - Secondary action buttons (outline)
  - Ghost/icon-only controls
  - Disabled and loading variants
- Inputs:
  - Text, email, phone, numeric, date, textarea
  - Select dropdowns
  - Search bars with icon prefix
  - Toggle/switch controls
- State placeholders:
  - Loading skeleton blocks
  - Empty state message panels
  - Error/alert strips with warning icon
  - Success confirmation panels
- Navigation blocks:
  - Back links
  - Sticky anchor links
  - Sidebar section maps

## 14.2 Traveler Listing UI (`/tours`)

### Hero region elements

- Background layers:
  - Multi-stop blue-indigo gradient base
  - Decorative blurred circular gradients
- Header content:
  - Eyebrow capsule (package count)
  - Two-line headline
  - Supporting paragraph
- Hero stat grid (4 cards):
  - Tour packages count
  - Destinations count
  - Average rating
  - Support availability

### Search strip elements

- Search form container with rounded corners
- Left search icon inside input
- Search input with destination/activity placeholder
- Clear input button (`X`) shown only when query exists
- Submit search button with responsive label/icon behavior

### Filter and control row elements

- Sticky horizontal control bar
- Category pill set with emoji + text:
  - All Tours
  - Adventure
  - Relaxation
  - Cultural
- Sort dropdown with icon prefix and five sort options
- Desktop-only view mode toggle buttons:
  - Grid
  - List

### Results header elements

- Summary text line:
  - Loading text variant
  - Loaded count variant
  - Search-context variant
  - Category-context variant
- Clear filters text-action button

### Result body elements

- Responsive card grid in grid mode
- Stacked wide cards in list mode
- Empty state block:
  - Visual icon
  - No results title
  - Help text
  - Reset action button

### Post-listing marketing elements

- Feature value row cards:
  - Curated Experiences
  - Best Price Guarantee
  - 24/7 Support
- Bottom CTA panel:
  - Heading
  - Supporting copy
  - Request custom tour action button

## 14.3 Tour Card UI (`components/tour/TourCard.tsx`)

### Shared card elements

- Clickable container (`Link` wrapper)
- Cover image area with gradient overlays
- Wishlist icon button (heart)
- Category badge
- Price block
- CTA text/button region

### Grid mode specific elements

- Image area overlays:
  - Duration pill (bottom-left)
  - Rating+reviews pill (bottom-right)
- Body blocks:
  - Title (line clamp)
  - Destination row with map pin
  - Description (line clamp)
  - Highlight chips (+overflow chip)
  - Metadata row (group size, best-time)
  - Price with per-person suffix
  - Explore CTA

### List mode specific elements

- Two-column layout:
  - Left: wide image panel
  - Right: content stack
- Header row:
  - Title
  - Rating + review count
- Body rows:
  - Destination row
  - Description
  - Up to four highlight chips
  - Duration/group/time metadata
  - Price block
  - View details CTA

### Wishlist interaction UI

- Default state: neutral/white background heart button
- Selected state: red background filled heart
- Interaction effects:
  - Hover scale
  - Heart pulse animation on toggle

## 14.4 Tour Detail UI (`/tours/[slug]`)

### Hero and media zone elements

- Full-height hero image background
- Dark gradient readability overlay
- Back link row
- Top badges:
  - Category
  - Difficulty
  - Slots left
- Core metadata line:
  - Destination
  - Rating
  - Duration
  - Price
- Description paragraph
- Side gallery preview cluster (desktop)
- View all photos action

### Detail utility actions

- Like/favorite control
- Share control
- Copy-link feedback state

### Sticky section navigation elements

- Horizontal anchor pill links:
  - Overview
  - Gallery
  - Itinerary
  - Safety
  - Host
  - Reviews
  - Location
  - FAQ

### Overview section elements

- Section eyebrow + title + description
- Info card matrix:
  - Duration
  - Group size
  - Difficulty
  - Languages
  - Category
  - Start date
  - End date
  - Deadline
- Expandable long-description card with read more/less toggle

### Gallery section elements

- Multi-tile responsive image grid
- Highlighted first image tile
- Image tile hover overlays
- Click-to-open lightbox behavior
- Lightbox close control

### Itinerary section elements

- Day quick-filter chips/buttons
- Expandable day cards (accordion behavior)
- Day header:
  - Day number marker
  - Day title
  - Expand/collapse icon
- Day body:
  - Description paragraph
  - Activities list
  - Meals list
- Included and excluded list panels

### Safety and eligibility section elements

- Safety badges/cards for:
  - Women only
  - Solo women safe
  - Verified travelers only
  - Host approval required
- Policy/eligibility explanatory text blocks

### Departure and availability elements

- Departure batch selector cards/controls
- Batch-specific price and seat display
- Batch urgency indicators (`ALMOST_FULL`, `SOLD_OUT`)
- Waitlist input/action when sold out

### Host block elements

- Host avatar/profile card
- Host name and trust cues
- Host message button
- View profile button

### Review block elements

- Average rating summary
- Review count
- Individual review cards:
  - Reviewer name
  - Rating stars
  - Optional title
  - Comment text
  - Timestamp

### Location block elements

- Place summary panel
- Coordinate or map context display card
- Route/navigation hint row

### FAQ and policies elements

- Accordion list entries:
  - Cancellation
  - Refund
  - Rules
  - Safety
  - Documents
  - Eligibility
- Expand/collapse chevrons and active-state highlighting

### Related content and booking rails

- Similar tours row (reused tour cards)
- Desktop sticky booking sidebar:
  - Price summary
  - Guest counter controls
  - Join/book CTA
- Mobile bottom booking bar:
  - Price snapshot
  - Primary CTA

## 14.5 GroupBooking Modal UI (`components/tour/GroupBooking.tsx`)

### Modal shell elements

- Full-screen backdrop with blur
- Centered rounded modal container
- Sticky top header with close button
- Scrollable content region
- Sticky footer action row

### Guest (not authenticated) state elements

- Alert icon and explanation block
- Login CTA button
- Secondary close action

### Authenticated form state elements

- Mode badge:
  - Approval required (lock icon)
  - Instant booking (credit card icon)
- Tour summary card:
  - Tour title
  - Destination/date snippets
  - Thumbnail image
  - Guests, availability, estimated total mini cards
- Capacity and policy notice bar:
  - Approval flow message
  - Instant payment verification message
- Traveler count selector (instant mode):
  - Decrement button
  - Current guest count
  - Increment button
- Contact form fields:
  - Full name
  - Email
  - Phone
  - Intro/special requests textarea
- Pricing breakdown card (instant mode):
  - Unit x guests
  - Taxes
  - Total payable
- Inline error panel
- Footer actions:
  - Cancel
  - Submit CTA with spinner state

### Success state elements

- Success header badge
- Success title/body
- Reference panel:
  - Request id or booking code
  - Additional details line
- Done action button

## 14.6 Traveler Chat UI (`/tours/[slug]/chat`)

### Header and room identity elements

- Back-to-tour link
- Room icon badge
- Room title and unlocked hint
- Top-right chat icon

### Message area elements

- Loading bubble
- Locked-state warning panel with lock icon
- Empty-chat placeholder bubble
- Message bubble cards:
  - Sender label
  - Message text
  - System-message visual variant
  - Reaction chips
  - React button
- Typing indicator pill

### Composer elements

- Input field
- Send button
- Disabled states based on auth/loading/error/sending

## 14.7 Host Dashboard UI (`/host/tours`)

### Header band elements

- Eyebrow text
- Main title
- Description
- Create tour CTA

### KPI grid elements

- Six metric cards with icons:
  - Active tours
  - Upcoming
  - Bookings
  - Revenue
  - Avg rating
  - Pending

### Control strip elements

- Search input with icon prefix
- Status dropdown
- Sort dropdown

### Body states

- Loading skeleton card set
- Empty state panel with icon and helper copy
- Tour result cards with:
  - Cover image
  - Status badge
  - Slots left pill
  - Date/bookings/rating/price mini cards
  - Action button row (edit, participants, chat, duplicate, archive)

## 14.8 Host Tour Studio UI (`/host/tours/[id]`)

### Sticky top page header elements

- Back button
- Eyebrow/title/subtitle
- Completion widget:
  - Percentage value
  - Completed sections fraction
  - Progress bar

### Left sidebar elements

- Section navigation list with completion icons
- Draft status panel (unsaved/saved and autosave time)

### Form feedback elements

- Global validation alert panel
- Floating toast banners (success/error)

### Section-by-section UI elements

- Basics:
  - Title input
  - Slug input
  - Category select
  - Description textarea
  - Dynamic tags list
- Location:
  - Destination/city/state/country inputs
  - Latitude/longitude inputs
  - Mock map picker panel and coordinate display
- Schedule:
  - Start date
  - End date
  - Registration deadline
  - Duration numeric input
- Group:
  - Total slots
  - Available slots
  - Max group size
- Safety:
  - Four large toggle cards with icon, label, and description
- Pricing:
  - Price per person
  - Original price
  - Difficulty select
  - Discount preview panel
- Content:
  - Language chip multi-select
  - Dynamic highlights/included/excluded lists
- Itinerary:
  - Expand all/collapse all/add day controls
  - Day cards with reorder buttons
  - Day title/description fields
  - Activities and meals dynamic list controls
  - Stay notes/travel notes textareas
- Media:
  - Photo uploader component surface
  - Media validation message
- Policies:
  - Cancellation policy textarea
  - Listing status select
  - Review summary hint panel

### Sticky bottom action bar elements

- Save-state indicator
- Copy link button
- Cancel link button
- Save/create submit button with loading spinner

## 14.9 Host Participants UI (`/host/tours/[id]/participants`)

### Header actions

- Back button to host tours
- Bulk approve button
- Bulk reject button

### Main two-pane layout elements

- Left pane:
  - Search input
  - Participant rows with avatar badge
  - Gender/language metadata
  - Verification chip
  - Alert chip
  - Status pill
- Right pane profile card:
  - Participant name and bio
  - Trust score card
  - Status card
  - Private notes textarea
  - Approve button
  - Reject button
  - Message traveler button

## 14.10 Host Chat UI (`/host/tours/[id]/chat`)

### Left rail elements

- Back link
- Page title/description
- Category quick-switch buttons:
  - Announcements
  - Pinned messages
  - Images
  - System log

### Center stream elements

- Room header with connection status
- Announce action button
- Pinned message banner
- Loading/empty/error states
- Message bubbles with sender/time
- Composer with attachment icon and send button

### Right moderation rail elements

- Action buttons:
  - Mute participant
  - Remove participant
  - Pin message
  - Share image
  - Safety notice

## 14.11 Admin Tour Moderation UI (`/admin/tours`)

### Header and high-level counters

- Moderation heading area
- Pending review counter card
- KPI cards for tours, approved, flagged, bookings, revenue, complaints

### Filter elements

- Search input + enter-to-search behavior
- Search button
- Status tab pills

### Queue table elements

- Loading skeleton rows
- Empty queue panel
- Data table columns:
  - Tour
  - Host
  - Risk
  - Status
  - Slots
  - Pricing
  - Reports
  - Action
- Review action button opening modal

### Analytics panel elements

- Quality distribution mini-bar chart panel
- Risk indicators list panel

### Review modal elements

- Tour preview header with status badge
- Metric mini-cards (bookings, reviews, price, slots)
- Risk checklist checkbox set
- Host-visible reason textarea
- Internal notes textarea
- Sticky modal action row:
  - Approve
  - Reject
  - Suspend
  - Archive
  - Changes requested

## 14.12 Iconography and Visual Language Used Across Tour Module

- Traveler-facing common icons:
  - Search, map pin, clock, users, star, calendar, heart, lock, send
- Host-facing common icons:
  - Plus/create, edit, archive, shield-check, users, message-circle, save, copy, image
- Admin-facing common icons:
  - Eye/review, check-circle, ban, archive, alert-triangle, shield-alert, trend metrics

Visual pattern consistency:

- Rounded corners heavily used (`xl` to `3xl` scale)
- Soft neutral backgrounds with cyan accents for primary interactions
- Strong black/cyan CTA buttons
- Frequent icon+label pair controls for scanability
- Distinct color codings for state:
  - Success (green)
  - Warning (amber)
  - Error/risk (red)
  - Informational/primary (cyan/blue)

## 14.13 UI State and Interaction Matrix (Element-Level)

- Hover interactions:
  - Card lift on tours
  - CTA darkening on primary buttons
  - Outline button background tint on hover
- Focus interactions:
  - Ring highlights on text fields/selects
  - Keyboard-friendly button focus behavior
- Disabled interactions:
  - Reduced opacity and blocked pointer actions for invalid/sending states
- Animated states:
  - Wishlist pulse
  - Loading skeleton pulse
  - Spinner for long-running submit actions
- Scroll behavior:
  - Sticky controls on listing/detail/admin and host studio surfaces
  - Modal internal scroll for long content

## 14.14 Mobile and Responsive UI Elements

- Listing:
  - Single-column cards on small screens
  - Horizontal scroll for category pills
- Detail page:
  - Anchor nav horizontal scroll
  - Bottom mobile booking bar
  - Gallery and info cards collapse to single-column stacks
- Host/admin dashboards:
  - KPI grids collapse from multi-column to stacked layouts
  - Table wrappers use horizontal scroll for narrow widths
- Modals:
  - Max-height with internal scroll to avoid viewport overflow

---

This document is intended as the single source of truth for current Tours module behavior across UI, backend, and role-based flows.
