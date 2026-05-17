# GetHotels - Complete Project Documentation

**Last Updated:** May 16, 2026  
**Project:** GetHotels Next.js Application  
**Type:** Full-Stack Travel & Hospitality Platform

---

## 📋 Quick Navigation

### �️ **Core Architecture & Schema**

- **[System Architecture Overview](./01_ARCHITECTURE_OVERVIEW.md)** - Tech stack, system design, deployment
- **[Database Schema Reference](./DATABASE_SCHEMA.md)** - Complete Prisma schema with all models

### 📄 **User-Facing Pages** ✅ Partially Complete

✅ [Home Page](./pages/01_HOME_PAGE.md) - Hero, featured listings, trust section  
✅ [Hotels/Stays Listing](./pages/02_HOTELS_LISTING_PAGE.md) - Search, filters, grid/list view  
✅ [Tours Listing](./pages/04_TOURS_LISTING_PAGE.md) - Browse, filters, categories  
📋 [Hotel Detail](./pages/03_HOTEL_DETAIL_PAGE.md) - Rooms, availability, reviews  
📋 [Tour Detail](./pages/05_TOUR_DETAIL_PAGE.md) - Itinerary, participants, booking  
📋 [Activities Listing](./pages/ACTIVITIES_LISTING_PAGE.md) - Search, filters  
📋 [Activity Detail](./pages/07_ACTIVITY_DETAIL_PAGE.md) - Slots, capacity, booking  
📋 [My Bookings](./pages/08_MY_BOOKINGS_PAGE.md) - Booking list, status, cancellation  
📋 [Wishlist](./pages/09_WISHLIST_PAGE.md) - Saved items management  
📋 [Profile](./pages/10_PROFILE_PAGE.md) - User info, preferences, avatar  
📋 [Travel Posts](./pages/11_TRAVEL_POSTS_PAGE.md) - Community posts, comments  
📋 [Login](./pages/12_LOGIN_PAGE.md) - Authentication  
📋 [Signup](./pages/13_SIGNUP_PAGE.md) - Registration, verification  
📋 [Terms & Conditions](./pages/14_TERMS_PAGE.md) - Legal content  
**[Pages Quick Reference](./pages/PAGES_QUICK_REFERENCE.md)** - All 30+ pages lookup table

### 🏢 **Host Panel Pages** (Coming Soon)

- Host Dashboard, Manage Hotels, Manage Tours, Bookings, KYC, Payments, Analytics

### 👨‍💼 **Admin Panel Pages** (Coming Soon)

- Admin Dashboard, Users, Listings, Bookings, KYC, Payouts, Analytics

### 🎯 **Business Modules** ✅ Mostly Complete

✅ [Hotels & Stays Module](./modules/01_HOTELS_MODULE.md) - Booking, inventory, reviews, pricing  
✅ [Tours & Trips Module](./modules/02_TOURS_MODULE.md) - Packages, participants, itineraries, chat  
✅ [Activities Module](./modules/03_ACTIVITIES_MODULE.md) - Slot-based booking, capacity management  
✅ [Bookings & Payments Module](./modules/05_BOOKINGS_PAYMENTS_MODULE.md) - Transactions, refunds, invoicing  
✅ [User Auth & Profile Module](./modules/06_USER_AUTH_MODULE.md) - Authentication, profiles, roles  
✅ [Admin & Moderation Module](./modules/08_ADMIN_MODERATION_MODULE.md) - Content moderation, KYC, governance  
📋 [Rentals Module](./modules/04_RENTALS_MODULE.md) - Vehicle/equipment rental  
📋 [Wishlist & Reviews Module](./modules/07_WISHLIST_REVIEWS_MODULE.md) - Ratings, reviews  
📋 [Community Module](./modules/09_COMMUNITY_MODULE.md) - User posts, engagement

### 🔌 **API Routes & Integration** ✅ Complete

- **[Complete API Reference](./api/01_API_REFERENCE.md)** - All endpoints, methods, requests, responses
  - Auth APIs (signup, login, refresh, profile)
  - Hotels APIs (list, detail, create, rooms, inventory)
  - Tours APIs (list, detail, participants, chat)
  - Activities APIs (list, slots, booking)
  - Bookings APIs (create, cancel, list)
  - Payments APIs (Razorpay verification)
  - Admin APIs (moderation, users, KYC)

### 🎨 **UI & Components** ✅ Complete

- **[Component Library Reference](./ui/01_COMPONENT_LIBRARY.md)** - All React components
  - Layout Components (Header, Footer, Sidebar, Navigation)
  - Card Components (HotelCard, TourCard, ActivityCard)
  - Form Components (DatePicker, GuestSelector, MultiSelect, Inputs)
  - Display Components (Ratings, Badges, Carousel, Pagination)
  - Modal Components (Modal, Confirmation, Toast)
  - Button Components (Button, IconButton, ButtonGroup)
  - Page Sections (Hero, Featured, CTA)
  - Utility Components (Loading, EmptyState)
- Design System (Colors, typography, breakpoints, responsive)

---

## 🎯 Quick Start Guides

### For Developers

1. Review [Architecture Overview](./01_ARCHITECTURE_OVERVIEW.md)
2. Check relevant [Page Documentation](./pages/)
3. Understand [Module Structure](./modules/)
4. Review [API Routes](./api/)

### For Adding New Features

1. Identify which module the feature belongs to
2. Review the module documentation
3. Check existing pages for similar patterns
4. Follow the UI component patterns from [Component Library](./ui/01_COMPONENT_LIBRARY.md)

### For Bug Fixes

1. Identify the affected page or module
2. Review its documentation
3. Check the controller/service logic
4. Trace through the component hierarchy

---

## 📊 Project Statistics

| Category            | Count                 |
| ------------------- | --------------------- |
| **Pages**           | 20+                   |
| **API Routes**      | 40+                   |
| **Database Tables** | 30+                   |
| **Components**      | 50+                   |
| **Modules**         | 8                     |
| **User Roles**      | 3 (User, Host, Admin) |

---

## 🏗️ Technology Stack

### Frontend

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS, shadcn/ui
- **State Management:** React Context API
- **HTTP Client:** Axios
- **Animations:** Framer Motion, Swiper

### Backend

- **Runtime:** Node.js
- **API:** Next.js API Routes
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** NextAuth.js, JWT

### External Services

- **Payment:** Razorpay
- **Images:** Cloudinary
- **Email:** Resend
- **Real-time:** Socket.io (for chat)
- **Maps:** Integrated GPS/location APIs

---

## 🔐 User Roles & Permissions

### 👤 User (Traveler)

- Browse and book hotels, tours, activities
- Manage bookings and wishlist
- Write reviews and join group tours
- Participate in tour chat

### 🏨 Host

- List and manage properties/tours/activities
- Manage bookings and availability
- View earnings and request payouts
- KYC verification for trust

### 👨‍⚖️ Admin

- Moderate all listings
- Approve/reject KYC applications
- Manage bookings and payments
- View system analytics
- Manage user accounts

---

## 📝 File Organization

```
docs/
├── 00_DOCUMENTATION_INDEX.md (this file)
├── 01_ARCHITECTURE_OVERVIEW.md
├── DATABASE_SCHEMA.md
│
├── pages/
│   ├── 01_HOME_PAGE.md
│   ├── 02_HOTELS_LISTING_PAGE.md
│   ├── ... (all pages)
│   └── host/ & admin/ (separate sections)
│
├── modules/
│   ├── 01_HOTELS_MODULE.md
│   ├── 02_TOURS_MODULE.md
│   ├── ... (all modules)
│
├── api/
│   ├── 01_AUTH_APIS.md
│   ├── 02_HOTELS_APIS.md
│   └── ... (all API routes)
│
└── ui/
    ├── 01_COMPONENT_LIBRARY.md
    ├── 02_DESIGN_SYSTEM.md
    └── 03_MOBILE_NAVIGATION.md
```

---

## 🚀 Getting Started with Documentation

Start with one of these based on your task:

- **New to the project?** → Read [Architecture Overview](./01_ARCHITECTURE_OVERVIEW.md)
- **Building a page?** → Check [Pages](./pages/) + [Component Library](./ui/01_COMPONENT_LIBRARY.md)
- **Working on bookings?** → Read [Bookings Module](./modules/05_BOOKINGS_PAYMENTS_MODULE.md)
- **Debugging an issue?** → Find the page/module → Review relevant section

---

**Note:** This documentation is a living document and should be updated as features change or new functionality is added.
