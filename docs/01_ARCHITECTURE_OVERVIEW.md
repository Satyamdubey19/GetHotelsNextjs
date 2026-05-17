# GetHotels - Architecture Overview

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER (Frontend)                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Next.js App Router (React 19)                           │   │
│  │  - Pages & Dynamic Routes                               │   │
│  │  - Server Components & Client Components                │   │
│  │  - Layout System                                        │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  State Management (Context API)                          │   │
│  │  - AuthContext (User, Session)                          │   │
│  │  - WishlistContext (Favorites)                          │   │
│  │  - Redux Toolkit (Optional)                             │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  UI Components (Tailwind CSS + shadcn/ui)               │   │
│  │  - Reusable Components (Button, Card, Modal, etc.)      │   │
│  │  - Page-Specific Components                             │   │
│  │  - Layout Components (Header, Footer, Nav)              │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                                 ↕
┌─────────────────────────────────────────────────────────────────┐
│                     API LAYER (Next.js Routes)                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  /api/ Routes (RESTful API)                             │   │
│  │  - Auth Endpoints                                       │   │
│  │  - Hotels/Stays Endpoints                              │   │
│  │  - Tours/Trips Endpoints                               │   │
│  │  - Activities Endpoints                                │   │
│  │  - Bookings & Payments Endpoints                        │   │
│  │  - User & Profile Endpoints                            │   │
│  │  - Admin & Moderation Endpoints                         │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                                 ↕
┌─────────────────────────────────────────────────────────────────┐
│                 BUSINESS LOGIC LAYER (Services)                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Services Layer (/lib/services/)                        │   │
│  │  - hotelService.ts       (Listing, search, filters)    │   │
│  │  - tourService.ts        (Itineraries, participants)   │   │
│  │  - activityService.ts    (Availability, slots)         │   │
│  │  - bookingService.ts     (Reservations, status)        │   │
│  │  - authService.ts        (JWT, sessions)               │   │
│  │  - paymentService.ts     (Razorpay integration)        │   │
│  │  - etc.                                                 │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Utility Layer (/lib/)                                  │   │
│  │  - axios.ts              (HTTP client setup)            │   │
│  │  - utils.ts              (Helpers, formatters)          │   │
│  │  - validators.ts         (Input validation)             │   │
│  │  - hash.ts               (Password hashing)             │   │
│  │  - cloudinary.ts         (Image handling)               │   │
│  │  - socket-server.ts      (Real-time communication)      │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                                 ↕
┌─────────────────────────────────────────────────────────────────┐
│                   DATA LAYER (Prisma ORM)                        │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Prisma Client                                          │   │
│  │  - Database Models (30+ tables)                         │   │
│  │  - Relations & Relationships                            │   │
│  │  - Migrations                                           │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                                 ↕
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE LAYER                                │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  PostgreSQL Database                                    │   │
│  │  - Users, Authentication                               │   │
│  │  - Hotels, Rooms, Availability                          │   │
│  │  - Tours, Participants, Itineraries                     │   │
│  │  - Activities, Slots, Bookings                          │   │
│  │  - Payments, Transactions                               │   │
│  │  - Reviews, Ratings                                     │   │
│  │  - Admin, KYC, Moderation                               │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

### Frontend Stack

| Technology          | Version  | Purpose                         |
| ------------------- | -------- | ------------------------------- |
| **Next.js**         | 16.2.6   | React framework with App Router |
| **React**           | 19.2.4   | UI library                      |
| **TypeScript**      | Latest   | Type safety                     |
| **Tailwind CSS**    | Latest   | Utility-first styling           |
| **shadcn/ui**       | Latest   | Component library               |
| **Lucide React**    | 1.8.0    | Icon library                    |
| **Framer Motion**   | 12.38.0  | Animations                      |
| **React Hook Form** | 7.75.0   | Form management                 |
| **Axios**           | 1.15.0   | HTTP client                     |
| **React Query**     | 5.100.10 | Data fetching & caching         |
| **Socket.io**       | Latest   | Real-time communication         |

### Backend Stack

| Technology             | Version | Purpose          |
| ---------------------- | ------- | ---------------- |
| **Node.js**            | Latest  | Runtime          |
| **Next.js API Routes** | 16.2.6  | API layer        |
| **TypeScript**         | Latest  | Type safety      |
| **Prisma**             | Latest  | ORM              |
| **PostgreSQL**         | Latest  | Database         |
| **NextAuth.js**        | 4.24.14 | Authentication   |
| **JWT**                | 9.0.3   | Token management |
| **Bcrypt**             | 6.0.0   | Password hashing |

### External Services

| Service        | Purpose             |
| -------------- | ------------------- |
| **Razorpay**   | Payment processing  |
| **Cloudinary** | Image hosting & CDN |
| **Resend**     | Email delivery      |
| **OpenAI**     | AI Chat features    |
| **Socket.io**  | Real-time chat      |

---

## 📊 Database Schema Overview

### Core Models (30+ tables)

#### User Management

- **User** - User accounts with authentication
- **Host** - Host profiles with KYC
- **HostBankDetails** - Payment information
- **UserDocument** - ID verification

#### Hotels & Stays

- **Hotel** - Hotel listings
- **Room** - Room types within hotels
- **RoomImage** - Room photos
- **RoomInventory** - Availability & pricing
- **HotelReview** - Ratings & reviews

#### Tours & Trips

- **Tour** - Tour packages
- **TourItinerary** - Day-by-day itinerary
- **TourParticipant** - Tour participants list
- **TourBooking** - Tour reservations
- **TourReview** - Ratings & reviews

#### Activities

- **Activity** - Activity listings
- **ActivitySlot** - Time slots
- **ActivityBooking** - Activity reservations
- **ActivityBookingGuest** - Guest details

#### Rentals

- **Rental** - Vehicle/equipment rentals
- **RentalBooking** - Rental reservations
- **RentalReview** - Ratings & reviews

#### Bookings & Payments

- **Booking** - Hotel booking records
- **Payment** - Payment transactions
- **Invoice** - Invoices for bookings
- **Transaction** - Payment logs

#### Admin & Moderation

- **KYCApplication** - KYC verification queue
- **ModeratedContent** - Moderation logs
- **SystemSettings** - Configuration

#### Community

- **UserPost** - Travel posts/blogs
- **PostComment** - Comments on posts
- **WishlistItem** - Saved properties

#### Reviews & Ratings

- **Review** - Generic review model
- **ReviewResponse** - Host responses to reviews

---

## 🗂️ Project Directory Structure

```
gethotels/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Home page
│   ├── layout.tsx                # Root layout
│   ├── (auth)/                   # Auth routes
│   │   ├── login/
│   │   ├── signup/
│   │   └── forgot-password/
│   ├── hotels/                   # Hotel routes
│   │   ├── page.tsx              # Listing
│   │   └── [slug]/               # Detail
│   ├── tours/                    # Tour routes
│   │   ├── page.tsx
│   │   ├── [slug]/
│   │   └── [slug]/chat/
│   ├── activities/               # Activity routes
│   │   ├── page.tsx
│   │   └── [slug]/
│   ├── host/                     # Host dashboard
│   │   ├── hotels/
│   │   ├── tours/
│   │   ├── bookings/
│   │   ├── analytics/
│   │   └── kyc/
│   ├── admin/                    # Admin panel
│   │   ├── users/
│   │   ├── listings/
│   │   ├── bookings/
│   │   ├── kyc/
│   │   └── analytics/
│   ├── api/                      # API routes
│   │   ├── auth/
│   │   ├── hotels/
│   │   ├── tours/
│   │   ├── bookings/
│   │   └── admin/
│   └── my-bookings/
│
├── components/                   # React components
│   ├── layout/                   # Layout components
│   │   ├── Header/
│   │   ├── Footer/
│   │   └── Navigation/
│   ├── home/                     # Home page components
│   ├── hotel/                    # Hotel-specific components
│   ├── tour/                     # Tour-specific components
│   ├── activity/                 # Activity components
│   ├── auth/                     # Auth forms
│   ├── search/                   # Search components
│   ├── ui/                       # Shared UI components
│   └── sections/                 # Reusable sections
│
├── lib/                          # Utility functions & services
│   ├── axios.ts                  # HTTP client
│   ├── auth.ts                   # Auth utilities
│   ├── hotels.ts                 # Hotel functions
│   ├── tours.ts                  # Tour functions
│   ├── bookings.ts               # Booking functions
│   ├── payment/                  # Payment utilities
│   ├── cloudinary.ts             # Image hosting
│   ├── socket-server.ts          # WebSocket server
│   └── utils.ts                  # General helpers
│
├── services/                     # Business logic services
│   ├── hotel.service.ts
│   ├── tour.service.ts
│   ├── activity.service.ts
│   ├── booking.service.ts
│   ├── payment.service.ts
│   ├── auth.service.ts
│   └── admin.service.ts
│
├── controllers/                  # API request handlers
│   ├── hotel.controller.ts
│   ├── tour.controller.ts
│   ├── activity.controller.ts
│   ├── booking.controller.ts
│   └── admin.controller.ts
│
├── contexts/                     # React Context API
│   ├── AuthContext.tsx           # User auth state
│   └── WishlistContext.tsx       # Favorites state
│
├── types/                        # TypeScript definitions
│   ├── auth.ts
│   ├── hotel-components.ts
│   ├── page-types.ts
│   └── ... (all type definitions)
│
├── middleware/                   # Express-like middleware
│   └── multer.ts                 # File upload handling
│
├── prisma/                       # Database
│   ├── schema.prisma             # Prisma schema
│   ├── seed.ts                   # Database seeding
│   └── migrations/               # Migration history
│
├── public/                       # Static assets
│   └── images/
│
├── docs/                         # Documentation (you are here)
│   ├── 00_DOCUMENTATION_INDEX.md
│   ├── pages/
│   ├── modules/
│   └── api/
│
├── package.json                  # Dependencies
├── next.config.ts                # Next.js config
├── tsconfig.json                 # TypeScript config
├── tailwind.config.js            # Tailwind config
├── middleware.ts                 # Next.js middleware
└── .env.local                    # Environment variables
```

---

## 🔄 Data Flow

### User Registration & Authentication Flow

```
1. User visits /signup
   ↓
2. Signup form component displays
   ↓
3. User submits form (email, password, name)
   ↓
4. POST /api/auth/signup
   ↓
5. authController.signup() validates input
   ↓
6. authService.createUser() creates user in DB with hashed password
   ↓
7. JWT token generated & sent to client
   ↓
8. User added to AuthContext
   ↓
9. Redirect to home page or dashboard
```

### Hotel Booking Flow

```
1. User browses /hotels with filters
   ↓
2. GET /api/hotels with filters
   ↓
3. hotelService.getHotels() queries database
   ↓
4. Results rendered with availability
   ↓
5. User clicks on hotel → Detail page /hotels/[slug]
   ↓
6. GET /api/hotels/[id] fetches details
   ↓
7. User selects room & dates → Opens booking modal
   ↓
8. User fills guest info & confirms
   ↓
9. POST /api/bookings/create
   ↓
10. Payment initiated (Razorpay)
    ↓
11. Payment callback → Booking confirmed
    ↓
12. Booking appears in /my-bookings
```

### Tour Booking Flow

```
1. User browses /tours with filters
   ↓
2. GET /api/tours with filters & search
   ↓
3. Tour list displayed with participant counts
   ↓
4. User clicks tour → Detail page /tours/[slug]
   ↓
5. GET /api/tours/[id] + Participants
   ↓
6. User selects date & guest count → Opens booking modal
   ↓
7. POST /api/bookings/create (tourBooking)
   ↓
8. Payment → Confirmation
   ↓
9. User can access chat /tours/[slug]/chat
   ↓
10. Join tour participant group
```

---

## 🔐 Authentication & Authorization

### Authentication Methods

- **Email/Password** - Primary auth with JWT
- **NextAuth.js** - Session management
- **JWT Tokens** - API authentication
- **Refresh Tokens** - Long-term sessions

### User Roles & Permissions

```
┌─────────────────┬──────────────┬──────────────┬──────────────┐
│ Resource        │ User (Guest) │ Host         │ Admin        │
├─────────────────┼──────────────┼──────────────┼──────────────┤
│ Browse Hotels   │ ✓            │ ✓            │ ✓            │
│ Book Hotels     │ ✓            │ ✓            │ ✓            │
│ Create Hotel    │ ✗            │ ✓            │ ✓            │
│ Edit Hotel      │ ✗            │ Own only     │ ✓            │
│ Approve Hotel   │ ✗            │ ✗            │ ✓            │
│ View Analytics  │ ✗            │ Own hotels   │ ✓            │
│ Manage Users    │ ✗            │ ✗            │ ✓            │
│ Request Payout  │ ✗            │ ✓            │ ✗            │
│ Review KYC      │ ✗            │ ✗            │ ✓            │
└─────────────────┴──────────────┴──────────────┴──────────────┘
```

---

## 📡 API Architecture

### API Endpoint Organization

```
/api/
├── auth/              # Authentication
│   ├── signup         # User registration
│   ├── login          # User login
│   ├── logout         # Logout
│   └── refresh        # Refresh token
│
├── hotels/            # Hotel listings & management
│   ├── GET /          # List all hotels
│   ├── POST /         # Create hotel (host)
│   ├── GET /[id]      # Get hotel details
│   ├── PUT /[id]      # Update hotel (host)
│   └── [id]/rooms     # Room management
│
├── tours/             # Tour listings & management
│   ├── GET /          # List tours
│   ├── POST /         # Create tour (host)
│   ├── GET /[id]      # Get tour details
│   └── [id]/chat      # Tour chat
│
├── bookings/          # Booking management
│   ├── POST /create   # Create booking
│   ├── GET /my-bookings
│   ├── PUT /[id]      # Update booking
│   └── DELETE /[id]   # Cancel booking
│
├── admin/             # Admin operations
│   ├── users/         # Manage users
│   ├── listings/      # Approve listings
│   ├── bookings/      # Manage bookings
│   └── analytics/     # System analytics
│
└── payments/          # Payment operations
    ├── verify         # Verify payment
    └── webhook        # Payment webhook
```

---

## 🎯 Key Features by Module

### Hotels & Stays Module

- List hotels with filters (location, price, rating, amenities)
- Hotel detail page with room information
- Room availability calendar
- Booking with guest details
- Multiple payment methods
- Reviews and ratings
- Wishlist functionality

### Tours & Trips Module

- Tour packages with full itineraries
- Group size management
- Participant management
- Tour chat for participants
- Multi-day tours with daily schedules
- Flexible cancellation policies
- Group discounts

### Activities Module

- Time slot-based booking
- Group activities (min/max participants)
- Private group option
- Duration-based pricing
- Location mapping
- Difficulty levels

### Admin & Moderation

- User & Host approval
- KYC verification
- Listing moderation
- Booking management
- Payment oversight
- Analytics & reporting
- Content moderation

---

## ⚡ Performance Considerations

### Frontend Optimization

- Server-side rendering (SSR) for pages
- Image optimization with Cloudinary
- Code splitting & lazy loading
- Caching with React Query
- Responsive design mobile-first

### Backend Optimization

- Database indexing on frequently queried fields
- Connection pooling with Prisma
- API response pagination
- Caching strategies
- Rate limiting

---

## 🚀 Deployment & Environment

### Environment Variables Required

```
DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://...
NEXTAUTH_SECRET=...
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
RESEND_API_KEY=...
OPENAI_API_KEY=...
JWT_SECRET=...
```

### Build & Deployment

- Next.js production build
- Database migrations before deployment
- Environment variable setup
- Static asset optimization
- CDN setup for images (Cloudinary)

---

## 📚 Next Steps

1. Review specific page documentation in `/docs/pages/`
2. Understand module structure in `/docs/modules/`
3. Check API routes in `/docs/api/`
4. Review component library in `/docs/ui/`
5. Set up development environment with `.env.local`

---

**Last Updated:** May 16, 2026
