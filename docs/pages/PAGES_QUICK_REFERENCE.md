# Quick Reference - All Pages

**Purpose**: Quick lookup for all pages in the application  
**Format**: Table with page path, purpose, authentication, and key features

---

## 📄 User-Facing Pages

| Route                | File                                                                   | Purpose            | Auth | Key Features                             |
| -------------------- | ---------------------------------------------------------------------- | ------------------ | ---- | ---------------------------------------- |
| `/`                  | [app/page.tsx](../../app/page.tsx)                                     | Home/Landing       | ✗    | Hero, featured stays/tours, CTAs, search |
| `/hotels`            | [app/hotels/page.tsx](../../app/hotels/page.tsx)                       | Hotel Listing      | ✗    | Filter, sort, availability, wishlist     |
| `/hotels/[slug]`     | [app/hotels/[slug]/page.tsx](../../app/hotels/[slug]/page.tsx)         | Hotel Detail       | ✗    | Room info, booking, reviews, gallery     |
| `/tours`             | [app/tours/page.tsx](../../app/tours/page.tsx)                         | Tour Listing       | ✗    | Search, filter by category, sort         |
| `/tours/[slug]`      | [app/tours/[slug]/page.tsx](../../app/tours/[slug]/page.tsx)           | Tour Detail        | ✗    | Itinerary, pricing, booking, reviews     |
| `/tours/[slug]/chat` | [app/tours/[slug]/chat/page.tsx](../../app/tours/[slug]/chat/page.tsx) | Tour Chat          | ✓    | Real-time messages, participants         |
| `/activities`        | [app/activities/page.tsx](../../app/activities/page.tsx)               | Activities Listing | ✗    | Browse, filter by type, search           |
| `/activities/[slug]` | [app/activities/[slug]/page.tsx](../../app/activities/[slug]/page.tsx) | Activity Detail    | ✗    | Slots, pricing, booking, reviews         |
| `/login`             | [app/login/page.tsx](../../app/login/page.tsx)                         | Login              | ✗    | Email/password auth, forgot password     |
| `/signup`            | [app/signup/page.tsx](../../app/signup/page.tsx)                       | Sign Up            | ✗    | Registration form, email verification    |
| `/forgot-password`   | [app/forgot-password/page.tsx](../../app/forgot-password/page.tsx)     | Password Reset     | ✗    | Email-based reset, new password          |
| `/profile`           | [app/profile/page.tsx](../../app/profile/page.tsx)                     | User Profile       | ✓    | Edit info, upload avatar, preferences    |
| `/my-bookings`       | [app/my-bookings/page.tsx](../../app/my-bookings/page.tsx)             | Booking History    | ✓    | List bookings, cancel, modify dates      |
| `/wishlist`          | [app/wishlist/page.tsx](../../app/wishlist/page.tsx)                   | Saved Items        | ✓    | Wishlist items, remove, quick book       |
| `/posts`             | [app/posts/page.tsx](../../app/posts/page.tsx)                         | Travel Posts       | ✗    | Community stories, comments, likes       |
| `/terms`             | [app/terms/page.tsx](../../app/terms/page.tsx)                         | Terms & Conditions | ✗    | Legal text, policies                     |

---

## 🏨 Host Panel Pages

| Route               | File                                                                 | Purpose          | Auth   | Key Features                           |
| ------------------- | -------------------------------------------------------------------- | ---------------- | ------ | -------------------------------------- |
| `/host`             | [app/host/page.tsx](../../app/host/page.tsx)                         | Host Dashboard   | ✓ Host | Overview, stats, quick links           |
| `/host/hotels`      | [app/host/hotels/page.tsx](../../app/host/hotels/page.tsx)           | Manage Hotels    | ✓ Host | List hotels, add new, edit             |
| `/host/hotels/[id]` | [app/host/hotels/[id]/page.tsx](../../app/host/hotels/[id]/page.tsx) | Edit Hotel       | ✓ Host | Hotel form, images, amenities, pricing |
| `/host/tours`       | [app/host/tours/page.tsx](../../app/host/tours/page.tsx)             | Manage Tours     | ✓ Host | List tours, create, edit               |
| `/host/tours/[id]`  | [app/host/tours/[id]/page.tsx](../../app/host/tours/[id]/page.tsx)   | Edit Tour        | ✓ Host | Tour form, itinerary, pricing          |
| `/host/bookings`    | [app/host/bookings/page.tsx](../../app/host/bookings/page.tsx)       | Host Bookings    | ✓ Host | Incoming bookings, guests, status      |
| `/host/analytics`   | [app/host/analytics/page.tsx](../../app/host/analytics/page.tsx)     | Analytics        | ✓ Host | Revenue, occupancy, trends             |
| `/host/kyc`         | [app/host/kyc/page.tsx](../../app/host/kyc/page.tsx)                 | KYC Verification | ✓ Host | Document upload, verification status   |
| `/host/payouts`     | [app/host/payouts/page.tsx](../../app/host/payouts/page.tsx)         | Payout History   | ✓ Host | Earnings, payouts, withdrawal          |

---

## 👨‍💼 Admin Panel Pages

| Route              | File                                                               | Purpose            | Auth    | Key Features                       |
| ------------------ | ------------------------------------------------------------------ | ------------------ | ------- | ---------------------------------- |
| `/admin`           | [app/admin/page.tsx](../../app/admin/page.tsx)                     | Admin Dashboard    | ✓ Admin | KPI, pending approvals, alerts     |
| `/admin/users`     | [app/admin/users/page.tsx](../../app/admin/users/page.tsx)         | User Management    | ✓ Admin | List users, ban, view details      |
| `/admin/listings`  | [app/admin/listings/page.tsx](../../app/admin/listings/page.tsx)   | Listing Moderation | ✓ Admin | Approve/reject hotels/tours        |
| `/admin/bookings`  | [app/admin/bookings/page.tsx](../../app/admin/bookings/page.tsx)   | Booking Management | ✓ Admin | View all bookings, refunds, issues |
| `/admin/kyc`       | [app/admin/kyc/page.tsx](../../app/admin/kyc/page.tsx)             | KYC Review         | ✓ Admin | Verify documents, approve hosts    |
| `/admin/payouts`   | [app/admin/payouts/page.tsx](../../app/admin/payouts/page.tsx)     | Payout Management  | ✓ Admin | Process payouts, view ledger       |
| `/admin/posts`     | [app/admin/posts/page.tsx](../../app/admin/posts/page.tsx)         | Post Moderation    | ✓ Admin | Review community posts, moderate   |
| `/admin/analytics` | [app/admin/analytics/page.tsx](../../app/admin/analytics/page.tsx) | System Analytics   | ✓ Admin | Platform metrics, reports          |

---

## 🔐 Page Access Levels

### Public Pages (No Authentication)

- Home
- Hotels Listing & Detail
- Tours Listing & Detail
- Activities Listing & Detail
- Travel Posts
- Terms & Conditions
- Login
- Signup
- Forgot Password

### Authenticated User Pages

- Profile (user can edit own)
- My Bookings
- Wishlist
- Tour Chat (if participant)

### Host-Only Pages

- Host Dashboard
- Manage Hotels
- Manage Tours
- Host Bookings
- Analytics
- KYC
- Payouts

### Admin-Only Pages

- Admin Dashboard
- User Management
- Listing Moderation
- Booking Management
- KYC Review
- Payout Management
- Post Moderation
- System Analytics

---

## 📊 Page Categorization

### Booking Pages

- Hotels Listing → Hotel Detail → Checkout (implicit)
- Tours Listing → Tour Detail → Checkout (implicit)
- Activities Listing → Activity Detail → Checkout (implicit)

### User Management Pages

- Signup → Email Verification
- Login → Password Reset (forgot-password) → Home
- Profile → Edit Profile
- My Bookings → View/Cancel Bookings

### Host Pages (Requires Host Role)

- Dashboard → View metrics
- Hotels Management → CRUD operations
- Tours Management → CRUD operations
- Bookings → Manage incoming bookings
- KYC → Submit documents
- Payouts → Request withdrawals

### Admin Pages (Requires Admin Role)

- Dashboard → System overview
- Users → Manage user accounts
- Listings → Approve content
- Bookings → Resolve issues
- KYC → Verify documents
- Payouts → Process withdrawals
- Posts → Moderate content
- Analytics → View reports

---

## 📱 Mobile Navigation

### Bottom Navigation Bar

```
Explore  |  Tours  |  Activities  |  Trips  |  Host
  (/)    |  (/tours) | (/activities) | (/my-bookings) | (/host)
```

### Header Navigation

- Back button (mobile)
- Search (collapsible on mobile)
- Profile dropdown
- Hamburger menu (mobile)

---

## 🔗 Navigation Flow Diagram

```
        ┌─→ Hotels Listing ─→ Hotel Detail ─→ Book
        │
Home ─→┤─→ Tours Listing ─→ Tour Detail ─→ Tour Chat
        │
        └─→ Activities Listing ─→ Activity Detail ─→ Book

Login/Signup ─→ Profile ─→ My Bookings ─→ Wishlist

Host Panel ─→ Hotels/Tours Management ─→ Analytics
           ─→ Bookings Management
           ─→ KYC
           ─→ Payouts

Admin Panel ─→ Users
            ─→ Listings (Moderation)
            ─→ Bookings
            ─→ KYC Review
            ─→ Payouts
            ─→ Posts (Moderation)
            ─→ Analytics
```

---

## 🎯 Common Tasks & Associated Pages

### User Journey: Book a Hotel

1. Home (/) - Explore
2. Hotels (/hotels) - Search & filter
3. Hotel Detail (/hotels/[slug]) - Review details
4. Checkout (implicit) - Enter guest info & payment
5. My Bookings (/my-bookings) - Confirmation

### User Journey: Join a Tour

1. Home (/) - Browse featured tours
2. Tours (/tours) - Search tours by category
3. Tour Detail (/tours/[slug]) - View itinerary
4. Checkout (implicit) - Add participants
5. Tour Chat (/tours/[slug]/chat) - Connect with group

### Host Journey: List a Hotel

1. Host Dashboard (/host) - Overview
2. Manage Hotels (/host/hotels) - View existing
3. Add Hotel (/host/hotels - create) - Hotel form
4. Edit Hotel (/host/hotels/[id]) - Manage details
5. Bookings (/host/bookings) - Monitor reservations
6. Analytics (/host/analytics) - View performance

### Admin Journey: Approve Content

1. Admin Dashboard (/admin) - Alerts
2. Listings (/admin/listings) - Moderation queue
3. Approve/Reject - In-place action
4. Post Moderation (/admin/posts) - Community moderation
5. Analytics (/admin/analytics) - Monitoring

---

## ⚠️ Page Status & Maintenance

| Page               | Status | Last Updated | Maintained By |
| ------------------ | ------ | ------------ | ------------- |
| Home               | ✓ Live | May 16, 2026 | Dev Team      |
| Hotels Listing     | ✓ Live | May 16, 2026 | Dev Team      |
| Hotels Detail      | ✓ Live | May 16, 2026 | Dev Team      |
| Tours Listing      | ✓ Live | May 16, 2026 | Dev Team      |
| Tours Detail       | ✓ Live | May 16, 2026 | Dev Team      |
| Tours Chat         | ✓ Live | May 16, 2026 | Dev Team      |
| Activities Listing | ✓ Live | May 16, 2026 | Dev Team      |
| Activities Detail  | ✓ Live | May 16, 2026 | Dev Team      |
| Login/Signup       | ✓ Live | May 16, 2026 | Dev Team      |
| Profile            | ✓ Live | May 16, 2026 | Dev Team      |
| My Bookings        | ✓ Live | May 16, 2026 | Dev Team      |
| Wishlist           | ✓ Live | May 16, 2026 | Dev Team      |
| Travel Posts       | ✓ Live | May 16, 2026 | Dev Team      |
| Host Dashboard     | ✓ Live | May 16, 2026 | Dev Team      |
| Host Management    | ✓ Live | May 16, 2026 | Dev Team      |
| Admin Dashboard    | ✓ Live | May 16, 2026 | Dev Team      |
| Admin Moderation   | ✓ Live | May 16, 2026 | Dev Team      |

---

**Last Updated:** May 16, 2026  
**Total Pages:** 30+  
**Public Pages:** 8  
**Authenticated Pages:** 7  
**Host Pages:** 8  
**Admin Pages:** 8  
**Maintained By:** Development Team
