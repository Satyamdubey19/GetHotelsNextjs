# GetHotels UI Feature Detail

Last scanned: 2026-05-13

This document describes the user-facing UI currently present in the GetHotels Next.js project. It is organized by product area and route group.

## 1. Global UI Shell

### Header and Navigation

Source: `components/layout/Header/Header.tsx`

- Sticky top header with GetHotels brand mark.
- Location detector shown near the logo on desktop.
- Main navigation links:
  - Tours: `/tours`
  - Contest: `/posts`
  - Car Rental: `/car-rental` link exists in navigation, but no matching page was found in `app/`.
  - Activities: `/activities`
- Mobile hamburger menu with the same navigation links.
- Auth-aware profile button:
  - Guest users see sign in, create account, host sign in, and host signup actions.
  - Logged-in users see profile header, account links, wishlist count, host dashboard or become-host link, settings/help links, and sign out.
  - Host/admin users get a role badge.
- Dropdown supports hover, click, click-outside close, and Escape key close.

### Footer

Source: `components/layout/Footer/*`

- Site footer includes grouped discover, terms, and about links.
- Newsletter/subscribe component exists for email capture UI.

### AI Travel Assistant

Source: `components/AIChatWidget.tsx`

- Floating chat launcher at the bottom-right of the public site.
- Persistent chat history in local storage.
- Assistant greeting and suggestion chips.
- User can ask about hotels, prices, popular stays, and tours.
- Sends messages to `/api/ai`.
- Renders assistant responses with optional hotel cards and tour cards linking to detail pages.
- Includes loading/typing state, clear chat action, disabled input state, and error fallback message.

### Shared UI Components

Source: `components/ui/*`

- Buttons, cards, dialogs, modal, alert, checkbox, input, status badge, stat card, spinner, skeletons, empty state, filter tabs, back link, section card, toggle switch, social auth button, and photo uploader.
- Loading skeletons are used by admin, host, and general app shells.
- Modal component is used in admin review flows.
- Photo uploader is used in host listing forms.

## 2. Public Marketplace UI

### Home Page

Route: `/`

Source: `app/page.tsx`

- Hotel slider hero with featured property imagery.
- Floating hotel search bar underneath the slider.
- Trust bar with verified stays, tour routes, average rating, and support stats.
- Featured properties section using `HomeFeaturedHotels`.
- Popular destination cards for Mumbai, Goa, and Jaipur linking into hotel search by city.
- Featured tours section using `HomeFeaturedTours`.
- Promise bar for verified stays, clear pricing, and trip support.
- City facts carousel.
- AI chat widget is available on the page.

### Hotel Listing Page

Route: `/hotels`

Source: `app/hotels/page.tsx`

- Search and discovery page for stays.
- Loads hotels from `/api/hotel`, with fallback behavior.
- Supports city/location query and GPS location lookup through `/api/location/gps`.
- View modes:
  - Grid cards
  - List cards
- Sorting:
  - Relevance
  - Price low to high
  - Price high to low
  - Rating
- Hotel cards show image, city, title, location, rating, review count, amenities, price per night, and CTA.
- Wishlist toggle available on each hotel card.
- Filter sidebar/component supports city, price range, rating, and amenities.
- Includes feature cards for price guarantee, support, and exclusive deals.

### Hotel Detail Page

Route: `/hotels/[slug]`

Source: `app/hotels/[slug]/page.tsx`

- Loads hotel detail by slug from `/api/hotel/[slug]`, including date availability when check-in/check-out are selected.
- Header, gallery, rating, location, sharing, and wishlist controls.
- Sticky navigation appears after scroll.
- Room selection with date inputs, guest count, room availability, room price, room capacity, and room details.
- Detail tabs include rooms, amenities, reviews, and rules.
- Map section and hotel location presentation.
- Booking modal flow:
  - Select room/date/guest details.
  - Enter contact details and special requests.
  - Promo code UI.
  - Booking submission to `/api/booking`.
  - Confirmation state with booking id.
- Supports loading state, booking loading state, and booking error state.

### Tours Listing Page

Route: `/tours`

Source: `app/tours/page.tsx`

- Loads tours from `/api/tour`, with static fallback tours.
- Hero with package count, destination count, average rating, and support stats.
- Search by destination, city, country, activity, or tag.
- Category pills:
  - All Tours
  - Adventure
  - Relaxation
  - Cultural
- Sorting:
  - Recommended
  - Price low to high
  - Price high to low
  - Top rated
  - Shortest first
- Grid/list view switch on desktop.
- Results count with active search/filter summary.
- Empty state with reset action.
- Tour cards link to detail pages.
- Feature section and custom-tour CTA.

### Tour Detail Page

Route: `/tours/[slug]`

Source: `app/tours/[slug]/page.tsx`

- Loads tour from `/api/tour/[slug]`, with fallback data.
- Full-viewport visual hero with gallery thumbnails, category, difficulty, slots, destination, rating, duration, and price.
- Sticky in-page navigation:
  - Overview
  - Gallery
  - Itinerary
  - Safety
  - Host
  - Reviews
  - Location
  - FAQ
- Overview cards for duration, group size, difficulty, languages, category, start/end date, and deadline.
- Read-more tour overview.
- Gallery grid with lightbox.
- Highlights cards.
- Expandable itinerary day controls with quick day filter buttons.
- Inclusions and exclusions lists.
- Safety/access controls:
  - Women-only
  - Safe for solo women
  - Verified travelers only
  - Host approval required
- Host profile card and host message/view profile buttons.
- Travel group preview cards.
- Chat preview section is shown only when `/api/tour/[slug]/chat?scope=participant` confirms the logged-in user is a joined participant.
- Open group chat CTA links to `/tours/[slug]/chat`.
- Reviews summary and review cards.
- Destination/location presentation.
- Accordion policies and FAQ.
- Similar tours.
- Sticky desktop booking sidebar and mobile bottom booking bar.
- Group booking modal opened from join/request buttons.

### Traveler Tour Chat

Route: `/tours/[slug]/chat`

Source: `app/tours/[slug]/chat/page.tsx`

- Requires logged-in user.
- Loads chat room/messages from `/api/tour/[slug]/chat?scope=participant`.
- Participant-only access: only joined travelers should be able to load/send.
- Socket.IO client connects to `NEXT_PUBLIC_SOCKET_URL` or `http://localhost:3001`.
- Joins `tour:[slug]` room.
- Sends messages through socket with `scope: "participant"` or falls back to POST.
- Displays room name, locked state, loading state, empty-chat state, and message list.
- Composer disables when chat is locked, unauthenticated, loading, or sending.

### Activities Listing Page

Route: `/activities`

Source: `app/activities/page.tsx`

- Activity marketplace for local experiences.
- Hero explains activity booking.
- Search by city and activity keywords.
- City suggestion chips.
- Sidebar filters:
  - Category
  - Difficulty
  - Max price slider
  - Sort
- Sort options:
  - Recommended
  - Price low to high
  - Top rated
- Activity cards show image, category, city, title, rating, duration, difficulty, price, highlights, and detail link.
- Empty state when no activity matches filters.

### Activity Detail Page

Route: `/activities/[slug]`

Source: `app/activities/[slug]/page.tsx`

- Detail page for a local activity.
- Not-found state with return link.
- Hero/detail layout with image, title, location, rating, duration, category, and booking affordances.
- Content sections for full activity flow, highlights, inclusions/exclusions, reviews, FAQ, and booking panel.
- Guest count stepper.
- Booking-style CTA and sticky purchase panel behavior.

### Travel Contest Posts

Route: `/posts`

Source: `app/posts/page.tsx`

- Weekly travel contest carousel.
- Shows one post at a time with image, category badge, leading badge, user info, caption, and hashtags.
- Like/unlike interaction stored in local storage.
- Previous/next controls with animated slide transition.
- Top posts leaderboard based on likes.
- Participation instruction card.

### Wishlist

Route: `/wishlist`

Source: `app/wishlist/page.tsx`

- Displays saved hotels/tours from wishlist context.
- Empty state encourages exploration.
- Item cards include image, title, price, type, detail link, and remove action.
- Clear/remove behavior handled through wishlist context.

### Terms

Route: `/terms`

Source: `app/terms/page.tsx`

- Static terms/help-style page.

## 3. Authentication and Traveler Account UI

### Login

Route: `/login`

Source: `app/login/page.tsx`, `components/auth/LoginForm.tsx`

- Role-aware login presentation:
  - Traveler login
  - Host login via `?role=HOST`
  - Admin login via `?role=admin`
- Left-side feature panel changes by role.
- Login form supports email/password, password visibility, remember-style controls, and Google sign-in button UI.
- Routes users based on role after login.

### Signup

Route: `/signup`

Source: `app/signup/page.tsx`, `components/auth/SignupForm.tsx`

- Account type switch between traveler and host-like signup.
- Fields for name, email, phone, optional business/brand name, password, and confirm password.
- Password visibility toggles.
- Terms link.
- Google sign-up button UI.

### Host Signup

Route: `/host/signup`

Source: `app/host/signup/page.tsx`, `components/auth/HostSignupForm.tsx`

- Dedicated host onboarding page.
- Product/category selection for hosting:
  - Hotels
  - Tours
  - Cars and bikes
  - Activities
- Property/host type selection.
- Host identity and account fields.
- Google sign-up button UI.

### Forgot Password

Route: `/forgot-password`

Source: `app/forgot-password/page.tsx`

- Password recovery UI connected to forgot/reset password API routes.

### Profile

Route: `/profile`

Source: `app/profile/page.tsx`

- Auth-aware profile center with sidebar tabs:
  - Profile
  - My Bookings
  - Account
  - Preferences
  - Notifications
  - Privacy & Security
  - Danger Zone
- Profile overview includes avatar/initials, identity, contact info, travel preferences, and stats.
- Edit mode allows saving profile changes to `/api/auth/me`.
- Profile data, notifications, and privacy settings are persisted in local storage.
- Bookings tab loads user bookings and supports cancellation through booking helpers.
- Notification toggles for email, push, and SMS.
- Privacy controls for profile visibility and field visibility.
- Password/change-password UI, two-factor/login alerts UI, dark-mode toggle UI, copy user id, export/download-style actions, and delete-account confirmation UI.
- Unauthenticated users see a prompt to sign in.

### My Bookings

Route: `/my-bookings`

Source: `app/my-bookings/page.tsx`

- Unified booking timeline for hotels, tours, rentals, and activities.
- Loads from `/api/my-bookings`.
- Filter pills with counts:
  - All
  - Hotels
  - Tours
  - Rentals
  - Activities
- Booking cards show category, status, payment status, title, subtitle, date range, location, booking code, amount, currency, and view details link.
- Includes loading skeletons, error state, and empty state with hotel/tour exploration CTAs.

## 4. Host Workspace UI

### Host Access Gate and Host Layout

Route group: `/host/*`

Source: `app/host/layout.tsx`

- Requires login.
- If user is not a host, shows host activation screen.
- Host activation collects business/brand name and phone number.
- Host workspace uses a dark collapsible sidebar.
- Sidebar links:
  - Dashboard
  - KYC
  - Add Hotel
  - Tours
  - Bookings
  - Payments
  - Reviews
  - Analytics
  - Home
- Mobile sidebar overlay and toggle.
- User card and logout action.

### Host Dashboard

Route: `/host`

Source: `app/host/page.tsx`

- Overview dashboard with host greeting.
- Quick actions to add hotel, tour, rental, and activity.
- KPI cards:
  - Monthly revenue
  - Bookings
  - Occupancy
  - Average rating
- Revenue rhythm bar chart.
- Action queue cards for bookings, media refresh, and guest feedback.
- Portfolio inventory cards for hotels and tours with live/paused status, location, price, ratings, revenue, occupancy, response rate, and availability.

### Host KYC

Route: `/host/kyc`

Source: `app/host/kyc/page.tsx`

- Host verification form.
- Loads KYC data from `/api/host/kyc`.
- Sections:
  - Personal information
  - Identity verification
  - Business documents
- Fields include first name, last name, nationality, date of birth, document type, id number, and document uploads.
- Submits multipart form data to `/api/host/kyc`.
- Shows status and validation/error states.

### Host Hotel Form

Route: `/host/hotels/[id]` and `/host/hotels/new`

Source: `app/host/hotels/[id]/page.tsx`

- Host-facing hotel create/edit form exists.
- Connected to host hotel API routes.
- Used from host sidebar add-hotel flow.
- Includes listing form style for hotel details and media.

### Host Tours Dashboard

Route: `/host/tours`

Source: `app/host/tours/page.tsx`

- Loads host tours from `/api/tour?scope=mine`.
- Tour portfolio dashboard with listing cards/table-like cards.
- Actions include create/edit tour, participants, chat, duplicate, and archive.
- Displays status, slots, price, bookings, review/moderation information, and quick management links.

### Host Tour Create/Edit Form

Route: `/host/tours/[id]`, including `/host/tours/new`

Source: `app/host/tours/[id]/page.tsx`

- Full tour builder with autosaved local draft for new tours.
- Unsaved-changes warning on browser unload.
- Section sidebar/progress UI with completion count.
- Sections:
  - Tour Basics: title, slug, category, description, tags.
  - Map & Location: destination, city, state, country, latitude, longitude, map picker placeholder.
  - Schedule & Registration: start date, end date, registration deadline, duration.
  - Group Settings: total slots, available slots, max group size.
  - Traveler Safety & Access: women-only, solo-women-safe, verified-travelers-only, host-approval-required toggles.
  - Pricing: price per person, original price, difficulty, discount preview.
  - Content, Inclusions & Languages: language chips, highlights, included, excluded.
  - Day-wise Itinerary: expand/collapse all, add day, reorder days, day title, description, activities, meals, stay notes, travel notes.
  - Media: photo uploader, cover image guidance.
  - Policies & Publishing: cancellation policy and listing status.
- Validation scrolls to the first error section.
- Bottom sticky action bar:
  - Draft/autosave status.
  - Copy tour link.
  - Cancel.
  - Create tour / Save changes.
- Create submits to `/api/tour`; edit submits to `/api/tour/[id]`.

### Host Tour Chat

Route: `/host/tours/[id]/chat`

Source: `app/host/tours/[id]/chat/page.tsx`

- Host group chat workspace for a tour.
- Loads chat from `/api/tour/[id]/chat`.
- Socket.IO live chat support.
- Left sidebar modes:
  - Announcements
  - Pinned messages
  - Images
  - System log
- Main chat pane shows pinned notice, loading/error/empty states, and message bubbles.
- Composer supports text message sending, socket fallback to POST, and attachment button UI.
- Right moderation panel includes controls for mute participant, remove participant, pin message, share image, and safety notice.

### Host Tour Participants

Route: `/host/tours/[id]/participants`

Source: `app/host/tours/[id]/participants/page.tsx`

- Participant management UI.
- Search participant field.
- Participant list with status and details.
- Selected participant detail panel.
- Private participant notes field.
- Actions for approve, reject, and message traveler.
- Bulk approve/reject buttons are present in UI.

### Host Bookings

Route: `/host/bookings`

Source: `app/host/bookings/page.tsx`

- Booking queue for host reservations.
- Loads bookings through host booking API.
- KPI cards and status filters.
- Reservation list with empty state.
- Host can update booking status through API.

### Host Booking Detail

Route: `/host/bookings/[bookingId]`

Source: `app/host/bookings/[bookingId]/page.tsx`

- Detail screen for a specific host booking.
- Intended for reservation review and operational detail.

### Host Payments

Route: `/host/payments`

Source: `app/host/payments/page.tsx`

- Payments and payouts dashboard.
- KPI cards for total payments, completed payments, and amount.
- Available balance/withdrawal section.
- Payout request UI with amount and notes.
- Payment history section with empty state.

### Host Reviews

Route: `/host/reviews`

Source: `app/host/reviews/page.tsx`

- Review management screen.
- Displays review stats, review cards, and empty state.
- Built using host page and section components.

### Host Analytics

Route: `/host/analytics`

Source: `app/host/analytics/page.tsx`

- Analytics dashboard.
- KPI cards.
- Monthly revenue and booking velocity chart cards.
- Property scoreboard table/card section.

## 5. Admin Workspace UI

### Admin Layout

Route group: `/admin/*`

Source: `app/admin/layout.tsx`

- Requires admin user.
- Dark collapsible sidebar with priority queue summary.
- Sidebar navigation:
  - Dashboard
  - KYC Reviews
  - Bookings
  - All Listings
  - Hotels
  - Tours
  - Rentals
  - Posts
  - Payouts
  - Hosts
  - Users
  - Analytics
- Sticky top control center header.
- Global admin search over admin sections with quick result popover.
- Top shortcuts for KYC, listings, posts, and payouts.
- Notification button and platform status chip.
- Admin profile card and logout action.

### Admin Dashboard

Route: `/admin`

Source: `app/admin/page.tsx`

- Command center hero with greeting and operational health.
- Hero metrics for gross revenue, active hosts, confirmed bookings.
- Quick actions for KYC queue, payouts, and account review.
- Health metrics:
  - KYC approval rate
  - Payout coverage
  - Booking stability
- Stat cards:
  - Platform users
  - Host partners
  - Pending KYC
  - Bookings tracked
- Priority workflow cards for compliance, payout batch, booking exceptions, and host portfolio.
- Revenue trend panel.
- Workspace view switcher:
  - Operations
  - Compliance
  - Growth
- Recent operational events list.

### Admin KYC Management

Route: `/admin/kyc`

Source: `app/admin/kyc/page.tsx`

- Loads KYC submissions by status.
- Filter controls for KYC status.
- KYC cards/list entries with user/business information.
- Detail modal with ID front/back previews and fields.
- Admin can approve or reject KYC.
- Rejection requires/uses rejection reason text area.

### Admin Listings

Route: `/admin/listings`

Source: `app/admin/listings/page.tsx`

- Review center for all listing types.
- Loads listings from `/api/admin/listings`.
- Search by listing, owner, or city.
- Filters by type/status.
- Listing table/cards show listing metadata, owner, city, status, and review action.
- Review modal includes listing detail, notes field, and moderation actions:
  - Approve
  - Reject
  - Pause
  - Archive
  - Save note/request

### Admin Tours Review Center

Route: `/admin/tours`

Source: `app/admin/tours/page.tsx`

- Tour-specific moderation queue.
- Search by tour, host, or destination.
- Status tabs.
- Tour rows/cards with review action.
- Quality distribution panel.
- Moderation modal with tour detail, rejection/change reason, internal notes, and actions:
  - Approve
  - Reject
  - Suspend
  - Archive
  - Request changes

### Admin Bookings

Route: `/admin/bookings`

Source: `app/admin/bookings/page.tsx`

- Booking management screen.
- Loads bookings from `/api/admin/bookings`.
- Booking rows/cards with booking status and operational details.
- Admin can update booking status through `/api/admin/bookings/[id]`.
- Detail/action modal behavior exists for selected booking.

### Admin Payouts

Route: `/admin/payouts`

Source: `app/admin/payouts/page.tsx`

- Payout management screen.
- Loads payout queue from `/api/admin/payouts`.
- Stat cards:
  - Pending requests
  - Pending amount
  - Processing
  - Total completed
- Payout table/list with process action.
- Process payout modal:
  - Mark payout processing/completed/failed.
  - Enter transaction reference.
  - Enter failure/rejection note.

### Admin Posts

Route: `/admin/posts`

Source: `app/admin/posts/page.tsx`

- User-generated content moderation/list screen.
- Search captions, users, hotels, tours, or locations.
- Loads posts from `/api/admin/posts`.
- Displays post records for review and operational tracking.

### Admin Users

Route: `/admin/users`

Source: `app/admin/users/page.tsx`

- User management screen.
- Stat cards for total users, total hosts, admins, and active users.
- User table/list UI for account review.

### Admin Hosts

Route: `/admin/hosts`

Source: `app/admin/hosts/page.tsx`

- Host management page scaffold.
- Intended for host account and business performance review.

### Admin Hotels

Route: `/admin/hotels`

Source: `app/admin/hotels/page.tsx`

- Hotel approvals and inventory admin page scaffold.

### Admin Rentals

Route: `/admin/rentals`

Source: `app/admin/rentals/page.tsx`

- Vehicle/rental supply admin page scaffold.

### Admin Analytics

Route: `/admin/analytics`

Source: `app/admin/analytics/page.tsx`

- Platform analytics page.
- Currently presents a "coming soon" style analytics dashboard.
- Shortcut cards to KYC Reviews, Bookings, and Payouts.

## 6. Important Data and Interaction Patterns

### Axios Usage

Source: `lib/axios.ts`

- Shared Axios client uses base URL `/api` and credentials.
- Most modern page data fetching uses this shared client.
- Some older helper/components still call Axios directly or helper wrappers, for example AI chat uses `axios.post("/api/ai")`.

### Wishlist State

Source: `contexts/WishlistContext.tsx`

- Wishlist context powers hotel/tour save behavior.
- Header profile menu shows wishlist count.
- Wishlist page renders saved items and removal actions.

### Auth State

Source: `contexts/AuthContext.tsx`

- Auth context powers header, host gate, admin gate, profile, and chat access UI.
- Host and admin layouts redirect or block when the user does not have the needed role.

### Tour Chat Access

Sources:

- `app/tours/[slug]/page.tsx`
- `app/tours/[slug]/chat/page.tsx`
- `app/host/tours/[id]/chat/page.tsx`
- `lib/socket-server.ts`

Behavior:

- Traveler chat UI uses participant-only scope.
- Traveler chat option appears only if the logged-in user is a joined participant for that tour.
- Host chat remains available from the host workspace.
- Socket messages share the same access scope behavior.

### Booking UX

- Hotel booking is handled in the hotel detail modal and submits to `/api/booking`.
- Tour booking/joining uses `GroupBooking` from tour detail.
- My Bookings centralizes all booking categories into one traveler timeline.

## 7. Known UI Gaps and Notes

- Header links to `/car-rental`, but no `app/car-rental` page was found. Rental backend/admin routes exist, but public rental UI appears missing or not named the same way.
- Admin hotels, hosts, rentals, and analytics pages appear lighter/scaffold-like compared with KYC/listings/tours/payouts.
- Host hotel form exists, but tour form is much more complete and polished.
- Several UI labels contain encoding artifacts in source text, likely from copied emoji/rupee symbols. These may render incorrectly in some environments and should be cleaned later.
- Some host and admin data is mocked or partially mocked in dashboard screens.
- Some buttons are UI-only placeholders at the moment, including some moderation controls, duplicate/archive tour actions, and profile/danger-zone controls.

