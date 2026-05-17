# Home Page UI Feature and Functionality Specification

Last scanned: 2026-05-14

This document describes the UI and functionality of the GetHotels home page. It is written as a design/build checklist for recreating or improving the home page experience.

Primary route: `/`

Primary file: `app/page.tsx`

Main home components:

- `components/layout/Header/Header.tsx`
- `components/hotel/HotelSlider.tsx`
- `components/search/SearchBar.tsx`
- `components/sections/HomeFeaturedHotels.tsx`
- `components/sections/HomeFeaturedTours.tsx`
- `components/sections/CityFactsCarousel.tsx`
- `components/AIChatWidget.tsx`
- `components/layout/Footer/Footer.tsx`

## 1. Home Page Purpose

The home page is the main entry point for travelers. It should quickly help users:

1. Discover featured hotels.
2. Search for stays by destination, date, and guests.
3. See trust signals for the platform.
4. Browse featured properties.
5. Explore popular destination cities.
6. Discover curated tours.
7. Understand key promises: verification, pricing clarity, and support.
8. Use the AI assistant for hotel/tour discovery.

## 2. Page Structure

Current section order:

1. Header
2. Featured hotel slider
3. Floating search bar
4. Trust bar
5. Featured hotels
6. Popular destinations
7. Featured tours
8. Promise bar
9. City facts carousel
10. Footer
11. Floating AI chat widget

## 3. Header on Home Page

Source: `components/layout/Header/Header.tsx`

### Visible UI

- Sticky top navigation.
- GetHotels logo mark with `GH`.
- Desktop location detector beside the logo.
- Navigation links:
  - Tours
  - Contest
  - Car Rental
  - Activities
- Mobile hamburger menu.
- Profile/account circle on the right.

### Guest Account Menu

Guest users see:

- Welcome panel.
- Traveler actions:
  - Sign In
  - Create Account
- Host actions:
  - Host Sign In
  - List Your Property
- Wishlist shortcut appears when wishlist has items.

### Logged-In Account Menu

Logged-in users see:

- Profile header with initials, name, email, and role badge.
- Account links:
  - My Profile
  - My Bookings
  - Wishlist with count
  - Travel Posts
- Property section:
  - Host Dashboard for hosts/admins
  - Become a Host for normal users
  - Rewards & Referrals
- More section:
  - Settings
  - Help & Support
- Sign out button.

### Interactions

- Profile menu opens on hover and click.
- Click outside closes the profile menu.
- Escape key closes the profile menu.
- Mobile menu toggles from hamburger button.
- Active nav link is highlighted based on current path.

### Design Notes

- Header should stay compact because the home hero starts immediately below it.
- Account menu is a major entry point for traveler/host flows, so it should remain easy to scan.

## 4. Featured Hotel Slider

Source: `components/hotel/HotelSlider.tsx`

### Purpose

The slider is the home page hero. It promotes featured stays using large imagery, pricing, rating, and quick detail links.

### Data Loading

- Uses browser geolocation when available.
- If geolocation succeeds:
  - Calls `/api/location/gps?lat=...&lng=...`.
  - Uses the resolved city to request nearby hotels.
- Hotel API calls:
  - `/api/hotel?city=[city]&random=4` when a city is known.
  - `/api/hotel?random=4` as fallback.
- Maps API hotels into slider cards with:
  - slug
  - title
  - location
  - city
  - price
  - original price
  - rating
  - image
  - description
- Uses remote fallback images when hotel images are missing.
- Tracks failed images and swaps to local fallback.

### Loading State

- While loading, shows a 420px tall animated pulse gradient placeholder.

### Empty State

- If no hotels are loaded, the slider renders nothing.

### Slider UI

Each slide includes:

- Full-width background hotel image.
- Dark left-to-right gradient for text readability.
- Bottom fade.
- Location/feature badge:
  - "Hotels near [city]" when location is resolved.
  - "Featured stay" otherwise.
- Hotel name.
- Location line with map pin.
- Two-line description.
- Rating pill when rating is greater than 0.
- Original price strikethrough when available.
- Current price per night.
- Save percentage badge when discount exists.
- Primary CTA: "View hotel".
- Hover/focus detail card on the right.
- Slide counter.

### Slider Controls

- Previous arrow.
- Next arrow.
- Bottom progress bar.
- Auto-advance every 4.5 seconds.
- Auto-advance pauses on:
  - Mouse enter
  - Focus
- Auto-advance resumes on:
  - Mouse leave
  - Blur

### Slide Interactions

- Entire slide is keyboard/click navigable to `/hotels/[slug]`.
- Enter or Space opens the hotel detail page.
- CTA links to `/hotels/[slug]`.
- Image zooms slightly on hover.
- Right detail card slides/fades in on hover/focus.

### Design Requirements

- Hero image must remain legible with strong gradient overlays.
- CTA should be visible even when the right detail card is hidden.
- Slider should support keyboard users through focus-visible styling.
- Height is fixed at 420px in current implementation.

## 5. Floating Search Bar

Source: `components/search/SearchBar.tsx`

### Purpose

The search bar lets travelers start a hotel search directly from the home page.

### Placement

- Rendered immediately below the slider.
- Uses negative top margin so it visually overlaps the hero.
- Centered with max width.

### Fields

Destination:

- Icon: map pin.
- Label: Destination.
- Input placeholder: "City, hotel, or destination..."
- Uses `LocationInput`.

Check-in:

- Icon: calendar.
- Label: Check-in.
- Uses `DatePicker`.

Check-out:

- Icon: calendar.
- Label: Check-out.
- Uses `DatePicker`.

Guests:

- Icon: users.
- Label: Guests.
- Stepper with minus and plus buttons.
- Default guests: 2.
- Minimum guests: 1.

Search button:

- Gradient cyan/blue button.
- Search icon and "Search" text.

### Functionality

On submit:

- Prevents default form submit.
- Trims destination.
- Calls optional `onSearch(query)` callback.
- Builds query params:
  - `q`
  - `checkIn`
  - `checkOut`
  - `guests`
- Navigates to:
  - `/hotels?[params]` when search/date params exist.
  - `/hotels` when no params exist.

Live behavior:

- Destination changes call `onSearch(v)` immediately.
- On the home page, this updates `hotelSearch` and filters/reloads featured hotels.

### Design Requirements

- Search bar should feel like the main action on the home page.
- On smaller screens, fields may need stacking or horizontal overflow handling if redesigned.
- Current implementation is a single horizontal form and may need mobile refinement.

## 6. Trust Bar

Source: `app/page.tsx`

### Purpose

The trust bar quickly communicates platform scale and reliability.

### Visible Items

Four stat blocks:

- `120+` Verified stays
- `32` Tour routes
- `4.8★` Average rating
- `24/7` Booking support

### UI Details

- White background.
- Top and bottom border.
- Four-column layout on desktop.
- Two-column layout on mobile.
- Dividers between columns.
- Each item has:
  - Icon
  - Large value
  - Small label

### Design Notes

- Should sit close to the search bar to reinforce confidence before browsing.
- Icons are dark navy on pale navy background.

## 7. Featured Hotels Section

Source:

- `app/page.tsx`
- `components/sections/HomeFeaturedHotels.tsx`

### Section Header

Visible elements:

- Eyebrow: "Featured properties".
- Heading: "Beautiful stays, ready when you are".
- Description: "Fresh picks from verified hosts across India."
- CTA link: "View all hotels" to `/hotels`.

### Data Loading

The component:

- Attempts to resolve current user location via browser geolocation.
- Calls `/api/location/gps?lat=...&lng=...` to get city.
- Waits for location resolution before fetching hotels.
- Fetches hotels from:
  - `/api/hotel?q=[searchQuery]` when search is active.
  - `/api/hotel?city=[currentLocation]` when location is known.
  - `/api/hotel` otherwise.
- If city-based result is empty, falls back to `/api/hotel`.
- Maps API hotel data into UI hotel cards.

### Loading State

- Shows four hotel card skeletons.
- Each skeleton includes image block and text placeholders.

### Empty State

Visible when no hotels are returned:

- Dashed card.
- Title: "No hotels found".
- Description: "Try another destination or clear the search to see all stays."

### Location/Search Indicator

Visible when search query or current location exists:

- Pill with map pin.
- Text:
  - "Showing hotels for [query]"
  - "Showing hotels near [currentLocation]"

### Hotel Card UI

Each featured hotel card includes:

- Hotel image.
- Rating badge.
- City badge.
- Wishlist button.
- Wishlist toast popup.
- Hotel title.
- Location line.
- Two-line description.
- Price per night.
- Computed original price strikethrough.
- View CTA.

### Wishlist Interaction

Uses `WishlistContext`.

Behavior:

- Clicking wishlist prevents card navigation.
- Adds/removes hotel from wishlist.
- Shows short popup:
  - "Saved to wishlist"
  - "Removed"
- Animates heart for 420ms.
- Popup disappears after 1.6 seconds.

Wishlist payload:

- `id`
- `slug`
- `title`
- `image`
- `price`
- `type: "hotel"`

### Navigation

- Card body links to `/hotels/[slug]`.
- Section CTA links to `/hotels`.

### Design Requirements

- Cards should be image-forward but compact.
- Rating, city, and wishlist controls should not overlap important image content.
- Skeleton cards should preserve layout height to avoid page jump.

## 8. Popular Destinations Section

Source: `app/page.tsx`

### Purpose

This section gives users a quick city-based browsing path into hotels.

### Visible Cities

Current static city cards:

- Mumbai
  - "38 verified stays"
- Goa
  - "45 verified stays"
- Jaipur
  - "27 verified stays"

### Card UI

Each card includes:

- Background city image.
- Dark gradient overlay.
- City name.
- Stay count.
- Hover lift and image zoom.

### Navigation

Each card links to:

- `/hotels?city=Mumbai`
- `/hotels?city=Goa`
- `/hotels?city=Jaipur`

### Design Requirements

- Destination cards should feel editorial and visually inviting.
- Text must stay readable on top of varied city photography.

## 9. Featured Tours Section

Source:

- `app/page.tsx`
- `components/sections/HomeFeaturedTours.tsx`

### Section Header

Visible elements:

- Eyebrow: "Curated tours".
- Heading: "Trips with the itinerary already shaped."
- CTA link: "View all tours" to `/tours`.

### Data Source

- Uses static `tours` from `lib/tours`.
- Displays the first three tours.

### Tour Card UI

Each featured tour card includes:

- Tour image.
- Duration badge.
- Wishlist button.
- Wishlist toast popup.
- Tour title.
- Destination with map pin.
- Two-line description.
- Up to three highlight chips.
- Footer with:
  - Price
  - View tour button

### Wishlist Interaction

Uses `WishlistContext`.

Behavior:

- Clicking wishlist prevents navigation.
- Adds/removes tour from wishlist.
- Shows toast:
  - Added to wishlist
  - Removed from wishlist
- Heart animates when toggled.

Wishlist payload:

- `id`
- `slug`
- `title`
- `image`
- `price`
- `type: "tour"`

### Navigation

- Image and View tour button link to `/tours/[slug]`.
- Section CTA links to `/tours`.

### Design Requirements

- Tours should feel distinct from hotel cards: more itinerary/community oriented.
- Highlight chips should help scan what makes the tour special.

## 10. Promise Bar

Source: `app/page.tsx`

### Purpose

The promise bar communicates why users can trust GetHotels before they leave the home page.

### Visual Style

- Dark navy background.
- White text.
- Three promise cards with subtle white translucent backgrounds.
- CTA row separated by top border.

### Promise Cards

Cards:

- Verified stays
  - "Host profiles, amenities, rooms, and pricing are reviewed before they go live."
- Clear pricing
  - "See nightly rates, taxes, and stay details before you commit."
- Trip support
  - "Get booking help, host coordination, and itinerary assistance when you need it."

### Bottom CTA

Visible elements:

- Heading: "Ready for your next stay?"
- Copy: "Search hotels, compare rooms, and reserve in one smooth flow."
- CTA: "Find a stay" linking to `/hotels`.

### Design Requirements

- This section should feel like a confidence close before footer content.
- CTA should contrast strongly against the dark background.

## 11. City Facts Carousel

Source: `components/sections/CityFactsCarousel.tsx`

### Purpose

The city facts carousel shows location-aware travel tips based on the user's cached city.

### Data Source

Static facts exist for:

- Dehradun
- Mussoorie
- Rishikesh
- India fallback

The component reads `localStorage.userLocation` and uses `saved.city`.

### Location Sync

Behavior:

- On mount, reads cached city.
- Listens for `storage` event.
- Re-checks cached city every 5 seconds.
- Resets active slide to 0 when city changes.

### Carousel UI

Visible elements:

- Eyebrow: "City pulse".
- Heading: "Useful facts around [city]."
- Description about location-aware travel notes.
- Previous/next icon buttons.
- Large dark carousel panel.
- Current fact content:
  - Gradient icon tile.
  - Fact title.
  - Fact value.
  - Fact detail.
- Side grid of all fact buttons.
- Bottom dot indicators.

### Auto-Rotation

- Slides advance every 3.2 seconds.
- Pauses on mouse enter and focus.
- Resumes on mouse leave and blur.

### Interactions

- Previous button moves to previous fact.
- Next button moves to next fact.
- Clicking side fact button jumps to that fact.
- Clicking dot indicator jumps to that fact.

### Design Requirements

- Should feel useful, not decorative.
- Fact cards should be readable on dark background.
- City name should reflect user location when available.

## 12. AI Travel Assistant on Home Page

Source: `components/AIChatWidget.tsx`

### Purpose

The AI widget lets users ask for hotel/tour suggestions directly from the home page.

### Launcher UI

Visible elements:

- Floating bottom-right chat button.
- Prompt bubble when closed: "Ask AI about hotels ✨".
- Pulsing ring when closed.
- Toggle icon changes between assistant/star icon and close icon.

### Panel UI

Visible when open:

- Fixed bottom-right chat panel.
- Header with "AI Travel Assistant".
- Online indicator.
- Clear chat button.
- Scrollable message list.
- Suggestion chips on initial state.
- Input bar.
- Send button.

### Suggestions

Initial suggestions:

- "Find hotels under ₹3000"
- "Best hotels in Goa"
- "Show popular stays"

### Functionality

- Messages persist in local storage under `gethotels-ai-chat`.
- Opening panel focuses the input.
- Message list auto-scrolls to bottom.
- Sends POST to `/api/ai` with:
  - `message`
  - `history`
- Assistant response can include:
  - Text
  - Hotel cards
  - Tour cards
- Hotel cards link to returned hotel link.
- Tour cards link to returned tour link.
- Clear button resets to the initial assistant message.

### States

- Initial greeting.
- Loading typing indicator.
- Error fallback: "Something went wrong. Please try again."
- Disabled input while loading.
- Disabled send when input is empty.

### Design Requirements

- Widget should not block home page CTAs.
- On mobile, panel width and height must remain within viewport.
- Hotel/tour result cards should be compact and tappable.

## 13. Footer on Home Page

Source: `components/layout/Footer/Footer.tsx`

### Purpose

The footer provides final navigation and brand/support links.

### Expected UI

- Link groups for discovery, terms, and about.
- Subscribe/newsletter component exists in footer components.
- Footer should close the page after the city facts carousel.

## 14. Home Page State Map

### Local Page State

In `app/page.tsx`:

- `hotelSearch`
  - Updated by `SearchBar`.
  - Passed to `HomeFeaturedHotels`.

### Slider State

In `HotelSlider`:

- `currentIndex`
- `isPaused`
- `hotels`
- `failedImages`
- `loading`
- `locationCity`

### Search State

In `SearchBar`:

- `destination`
- `checkIn`
- `checkOut`
- `guests`

### Featured Hotels State

In `HomeFeaturedHotels`:

- `currentLocation`
- `locationResolved`
- `popup`
- `animating`
- `hotels`
- `loading`

### Featured Tours State

In `HomeFeaturedTours`:

- `popup`
- `animating`

### City Facts State

In `CityFactsCarousel`:

- `city`
- `activeIndex`
- `isPaused`

### AI Widget State

In `AIChatWidget`:

- `open`
- `messages`
- `input`
- `loading`

## 15. API Endpoints Used by Home Page

Hotel slider:

- `GET /api/location/gps?lat=[lat]&lng=[lng]`
- `GET /api/hotel?city=[city]&random=4`
- `GET /api/hotel?random=4`

Featured hotels:

- `GET /api/location/gps?lat=[lat]&lng=[lng]`
- `GET /api/hotel?q=[query]`
- `GET /api/hotel?city=[city]`
- `GET /api/hotel`

AI assistant:

- `POST /api/ai`

Navigation targets:

- `/hotels`
- `/hotels?q=[query]&checkIn=[date]&checkOut=[date]&guests=[count]`
- `/hotels?city=[city]`
- `/hotels/[slug]`
- `/tours`
- `/tours/[slug]`
- `/posts`
- `/activities`
- `/login`
- `/signup`
- `/host/signup`
- `/host`
- `/wishlist`

## 16. Home Page Data Needed for UI

### Slider Hotel

Needed fields:

- `slug`
- `title`
- `location`
- `city`
- `price`
- `originalPrice`
- `rating`
- `image`
- `description`

### Featured Hotel Card

Needed fields:

- `slug`
- `title`
- `location`
- `city`
- `price`
- `rating`
- `image`
- `description`
- `HotelImage`
- `Room`
- `HotelAmenity`
- `HotelRule`

### Featured Tour Card

Needed fields:

- `id`
- `slug`
- `title`
- `image`
- `duration`
- `destination`
- `description`
- `highlights`
- `price`

### Popular Destination Card

Needed fields:

- `name`
- `stays`
- `image`

### City Fact

Needed fields:

- `title`
- `value`
- `detail`
- `icon`
- `color`

## 17. Responsive Design Requirements

Mobile:

- Header collapses nav into mobile menu.
- Search bar currently uses a wide horizontal layout; redesign may need stacked fields.
- Trust bar uses two columns.
- Featured hotel cards use one column.
- Destination cards stack.
- Featured tour cards stack.
- Promise cards stack.
- AI widget must not cover mobile bottom controls.

Tablet:

- Featured hotels use two columns.
- Popular destinations can use three columns from small breakpoint.
- Search bar may still need responsive care.

Desktop:

- Header shows full nav.
- Slider includes hover detail card.
- Search bar overlaps slider.
- Trust bar uses four columns.
- Featured hotels use four columns on extra-large screens.
- Featured tours use three columns.
- Promise cards use three columns.

## 18. Interaction States to Design

Header:

- Guest menu.
- Authenticated menu.
- Mobile nav open/closed.
- Active route.
- Wishlist count.

Slider:

- Loading skeleton.
- Empty hidden state.
- Active slide.
- Paused on hover/focus.
- Previous/next.
- Image load failure.
- Hover detail card.
- Keyboard focus.

Search:

- Empty fields.
- Destination typed.
- Date selected.
- Guest increment/decrement.
- Submit/navigation.

Featured hotels:

- Loading skeletons.
- No hotels found.
- Showing nearby city.
- Showing search query.
- Wishlist add/remove.
- Wishlist toast.
- Image fallback.

Popular destinations:

- Hover lift.
- City link navigation.

Featured tours:

- Wishlist add/remove.
- Wishlist toast.
- Tour detail navigation.

Promise bar:

- CTA hover.

City facts:

- Active fact.
- Paused auto-rotation.
- Previous/next.
- Dot click.
- City change.

AI widget:

- Closed launcher.
- Open panel.
- Initial suggestions.
- Loading response.
- Error response.
- Hotel result card.
- Tour result card.
- Clear chat.

## 19. Current UI Gaps and Design Notes

- Header includes `/car-rental`, but no matching `app/car-rental` page was found in the project scan.
- Home page search bar is visually strong on desktop but may need a stacked mobile design.
- `HomeFeaturedHotels` uses direct `axios` instead of the shared `lib/axios` instance.
- Some text contains encoding artifacts in source for symbols like star, rupee, arrow, and sparkle. Clean Unicode or icon components should be used in final UI.
- Featured tours are static from `lib/tours`; they do not currently fetch from `/api/tour` on the home page.
- Popular destinations are static and not derived from real inventory counts.
- City facts depend on `localStorage.userLocation`; if no location exists, India fallback is used.
- Slider geolocation request can prompt the browser on first visit. Design should still look complete when permission is denied.
- AI widget uses direct `axios.post("/api/ai")`, not the shared API client.

