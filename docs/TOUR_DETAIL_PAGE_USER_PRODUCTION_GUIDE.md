# Tour Detail Page User Documentation (Features, UI, Flow, Production Plan)

Last updated: 2026-05-15
Scope: Traveler/User experience from tour search to booking confirmation

## 1. Objective

This document defines:

- Current user-facing features and UI of the tour detail journey
- End-to-end user flow from discovery to booking
- Production-level improvements to increase conversion, trust, and reliability

This is focused on the traveler side only.

## 2. User Journey: Search to Booking

## 2.1 Step 1: User discovers tours on listing page

Entry route:

- /tours

Primary actions:

- Search by destination/city/activity/tag
- Filter by category (All, Adventure, Relaxation, Cultural)
- Sort by recommended, price, rating, duration
- Toggle card layout (grid/list on desktop)
- Open a tour card to navigate into detail page

Key UX intent:

- Fast shortlisting and clear relevance before entering detail

## 2.2 Step 2: User evaluates the tour detail page

Entry route:

- /tours/[slug]

Primary actions:

- Scan hero metadata: title, destination, rating, duration, price
- Browse photos via grid/lightbox
- Read overview and day-wise itinerary
- Inspect inclusions/exclusions
- Validate safety and eligibility rules
- Check host trust indicators
- Review ratings and traveler feedback
- Inspect departure batches, seat availability, and dynamic pricing

Key UX intent:

- Build confidence quickly using trust + clarity + social proof

## 2.3 Step 3: User starts join or booking action

Decision branch:

- If host approval required: user sends join request
- If instant booking enabled: user proceeds to payment

Primary action points:

- Desktop sticky booking card
- Mobile bottom action bar

Key UX intent:

- Keep booking CTA visible at all times with no confusion

## 2.4 Step 4: User completes GroupBooking modal

Modal behavior:

- If unauthenticated: login required prompt with redirect support
- If authenticated:
  - contact details prefilled from user profile
  - guest count control for instant booking
  - intro text for approval mode
  - special request text for instant mode
  - pricing breakdown (subtotal, taxes, total)

Submission branch:

- Approval flow: create join request, show request success state
- Instant flow: create booking -> create payment order -> Razorpay checkout -> verify payment -> show booking success state

## 2.5 Step 5: Post-booking outcomes

Post success:

- Booking reference shown in modal success screen
- Booking appears in /my-bookings under TOUR category
- Chat preview unlocks only when participant access is valid
- User can open /tours/[slug]/chat once joined

## 3. Current Tour Detail Page UI (How It Looks)

## 3.1 Visual style

- Modern editorial hero with immersive cover image
- Strong contrast overlay for text readability
- Rounded card language across all sections
- Cyan/emerald accents for trust and action states
- Sticky navigation and sticky booking elements for conversion persistence

## 3.2 Above-the-fold section

Elements visible immediately:

- Back to all tours chip/button
- Category badge
- Difficulty badge
- Slots-left badge
- Destination line
- Large title typography
- Rating/reviews/duration/price row
- Summary description
- Gallery preview panel + View all photos action

Utility controls:

- Share floating button
- Save/favorite floating button
- Copied link feedback micro-state

## 3.3 Sticky section navigation

Horizontal anchor list:

- Overview
- Gallery
- Itinerary
- Safety
- Host
- Reviews
- Location
- FAQ

Benefits:

- Fast section jumping on long pages
- Better mobile navigation for deep content

## 3.4 Main content sections

Overview section:

- Info cards for duration, group size, difficulty, language, category, dates, deadline
- Expand/collapse long overview description

Gallery section:

- Responsive image tile grid
- Lightbox on image click

Highlights section:

- Value cards for unique trip points

Itinerary section:

- Day filter chips
- Expandable day cards
- Day description, activities, meals
- Transfer/stay note cards

Inclusions and exclusions:

- Split into green included panel and red excluded panel

Safety and access:

- Explicit cards for women-only, solo safety, verified travelers, host approval
- Additional trust cards for emergency/escalation/community enforcement

Host section:

- Verified host identity block
- Experience metrics badges
- Message host and view profile actions

Community preview:

- Sample traveler cards with trust indicators

Chat preview section (conditional):

- Appears only when user has valid participant access
- Shows recent sample/real messages
- Open group chat button

Reviews section:

- Aggregate rating summary panel
- Traveler review cards with rating and trust tag

Location section:

- Stylized route/map panel
- Supporting location logistics cards

Policies section:

- Accordion for cancellation/refund/rules/safety/docs/eligibility

FAQ section:

- Two-column answer cards for common concerns

Similar tours:

- Recommended related cards at bottom

## 3.5 Booking surfaces

Desktop:

- Sticky booking sidebar with:
  - current price and strike-through original price
  - discount badge
  - departure selection cards
  - seat count and date snapshot
  - travelers stepper
  - safety/access badges
  - cost calculation row
  - primary Join or Waitlist button
  - Save and Host quick buttons

Mobile:

- Fixed bottom booking bar with:
  - starting price
  - save action
  - primary join/request/waitlist action

## 4. Current User Flow Logic and System Behavior

## 4.1 Data loading strategy

- Initial local fallback data used for fast page render
- API refresh for latest detail data
- Parallel fetches for:
  - departures
  - announcements
  - reviews
- Conditional chat access probe for authenticated users

## 4.2 Access and state rules

- Booking actions require authentication
- Sold-out departures push user to waitlist path
- Chat is locked unless user is valid joined participant
- Approval-required tours split flow before payment

## 4.3 Pricing behavior

- Uses selected departure current price when available
- Falls back to base tour price otherwise
- GroupBooking modal calculates taxes and final total

## 4.4 Failure and fallback behavior

- If detail API fails, fallback local tour is used
- If chat access fails, chat preview is hidden/locked
- If payment script fails, user gets clear error message
- If waitlist request fails, inline user message is shown

## 5. Production-Level Gaps and Upgrades to Add

## 5.1 High priority (must-have for production)

1. Real availability hold and timer

- Hold seats for 5 to 10 minutes once checkout starts
- Prevent overselling during concurrent payments

2. Strong booking validation on server and client

- Validate minimum/maximum guests per departure
- Validate age/eligibility constraints where applicable
- Normalize and validate phone/email formatting strictly

3. Transparent cancellation and refund calculator

- Show exact refundable amount by date/time before checkout
- Include policy summary in booking modal and booking confirmation

4. Trust and safety proof expansion

- Show host verification date, KYC status, emergency contact policy
- Show incident-free score or safety compliance markers

5. Structured error UX

- Add retry actions for network errors
- Add clear next-step guidance per error type

6. Analytics instrumentation

- Track funnel steps: search -> detail -> cta click -> modal open -> submit -> payment success
- Capture drop-offs by device, departure type, and approval mode

## 5.2 Medium priority (conversion and retention)

1. Comparison mode from listing

- Let users compare 2 to 3 tours on price, duration, safety, inclusions

2. Personalized recommendation modules

- Similar tours by behavior and price sensitivity
- Better than simple category/city matching

3. Rich departure cards

- Add occupancy trend, early-bird expiry countdown, refund cutoff display

4. Review quality controls

- Verified-trip badge per review
- Photo reviews and helpful vote sorting

5. Booking confidence nudges

- "X people viewed this today"
- "Last booking Y hours ago"
- "Only N seats left in this departure"

## 5.3 Nice-to-have (premium experience)

1. Interactive map with route pins

- Day-by-day route checkpoints and stay locations

2. Multi-currency support

- Detect locale and present INR + selected currency estimate

3. Voice/video host intro

- 30 to 60 second host intro clip for trust

4. Trip prep center

- Checklist, packing list, permit reminders, pre-departure tasks

## 6. Recommended UX/UI Updates for Production Readiness

## 6.1 Detail page information architecture improvements

- Add top-level quick facts rail under hero:
  - effort level
  - climate
  - cancellation window
  - refundable until
- Move critical policy snippets above fold near booking CTA
- Add “Why this trip” summary chips in first viewport

## 6.2 Booking modal improvements

- Progress indicator:
  - Traveler details
  - Departure and guests
  - Payment
  - Confirmation
- Inline field validation with precise copy
- Show final payable amount in sticky footer
- Add checkboxes for policy acceptance and consent

## 6.3 Mobile conversion improvements

- Expand mobile bottom bar with:
  - selected departure
  - seats left
  - total for selected guests
- Add swipe-up mini sheet for fast booking preview

## 6.4 Accessibility and compliance upgrades

- Ensure full keyboard navigation for accordions, chips, and gallery
- Add aria labels for all icon-only actions
- Improve color contrast where subtle gray text appears on light backgrounds
- Add alt text strategy for gallery images beyond generic labels

## 7. End-to-End User Flow Blueprint (Production)

1. User opens /tours
2. User searches or filters tours
3. User opens /tours/[slug]
4. User reviews hero trust signals and core details
5. User checks departure seats and pricing
6. User validates itinerary, inclusions, host, and reviews
7. User taps Join or Request button
8. If not logged in: redirect to login and return
9. User completes modal fields
10. Branch A: approval-required

- request submitted
- status visible in my bookings or profile timeline
- payment unlocked after approval

11. Branch B: instant booking

- booking created
- Razorpay checkout completed
- payment verified
- booking confirmed and reference displayed

12. User gets confirmation email and sees booking in /my-bookings
13. If joined, user can access group chat

## 8. Production Acceptance Criteria

A release should not be considered production-ready unless all are true:

1. Functional

- All booking branches work end-to-end (approval and instant)
- Seat counts remain consistent under concurrent load
- Waitlist path works for sold-out departures

2. UX

- Mobile and desktop conversion UI is clear and fast
- Error messages are actionable and recoverable
- Policy and pricing transparency is visible pre-payment

3. Reliability

- API failures have user-safe fallback states
- Payment verification is idempotent and auditable
- Observability exists for funnel and payment failures

4. Security and trust

- Auth checks enforce all protected actions
- Chat and participant access is role-safe
- Host and tour trust signals are accurate and not misleading

## 9. Implementation Pointers for Next Iteration

Frontend targets:

- app/tours/page.tsx
- app/tours/[slug]/page.tsx
- components/tour/GroupBooking.tsx
- components/tour/TourCard.tsx

Backend targets:

- app/api/tour/[id]/booking/route.ts
- app/api/tour/[id]/payment/order/route.ts
- app/api/tour/[id]/payment/verify/route.ts
- app/api/tour/[id]/batches/route.ts
- app/api/tour/[id]/waitlist/route.ts

Service/controller targets:

- controllers/tour.controller.ts
- services/tour.service.ts
- controllers/tour-operations.controller.ts
- services/tour-operations.service.ts

---

This document is the user-side source of truth for Tour Detail page behavior and production readiness planning, covering the full funnel from search to confirmed booking.
