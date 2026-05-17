# Hotels & Stays Module Documentation

**Module Type:** Core Booking Module  
**Files Location:**

- Controllers: [controllers/hotel.controller.ts](../../controllers/hotel.controller.ts)
- Services: [services/hotel.service.ts](../../services/hotel.service.ts)
- API: [app/api/hotels/](../../app/api/hotels/)
- Components: [components/hotel/](../../components/hotel/)

---

## 📖 Module Overview

The Hotels & Stays module is the core booking system for accommodations. It handles hotel listings, room management, availability tracking, pricing, booking creation, payment processing, and guest reviews. This module is critical to the platform's revenue generation.

---

## 🎯 Core Functionality

### 1. Hotel Management

- **Create Hotel Listing**: Host can create new hotel properties
- **Edit Hotel Details**: Update basic info, amenities, policies
- **Upload Images**: Multiple hotel images with Cloudinary integration
- **Set Pricing**: Dynamic pricing per night
- **Define Amenities**: Multiple amenity selection
- **Room Management**: Create and manage room types

### 2. Availability & Inventory

- **Room Inventory**: Track available units per date
- **Pricing Calendar**: Set dynamic pricing for date ranges
- **Block Dates**: Host can block dates for maintenance
- **Occupancy Rules**: Set max occupancy per room type
- **Auto-updates**: Inventory decrements on booking

### 3. Booking Management

- **Create Booking**: User selects dates, guests, room type
- **Booking Confirmation**: Instant confirmation with booking code
- **Booking Modification**: Users can modify dates (if allowed)
- **Booking Cancellation**: Cancel with refund calculation
- **Booking History**: Track all bookings per user

### 4. Guest Reviews & Ratings

- **Post Review**: After checkout, guests can leave reviews
- **Rating System**: 1-5 star ratings with categories
- **Review Moderation**: Admin can moderate reviews
- **Host Response**: Host can respond to reviews
- **Review Display**: Reviews shown on hotel detail page

### 5. Payment Processing

- **Payment Integration**: Razorpay payment gateway
- **Refund Management**: Process refunds on cancellation
- **Invoice Generation**: Create invoices for bookings
- **Payment Status Tracking**: Track payment lifecycle

---

## 📊 Data Models

### Hotel Model

```typescript
interface Hotel {
  id: string;
  hostId: string;
  slug: string;
  name: string;
  description: string;

  // Location
  address: string;
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;

  // Media
  imageUrl: string;
  images: string[];

  // Classification
  propertyType: "Hotel" | "Resort" | "Villa" | "Apartment";
  starRating: number;

  // Amenities
  amenities: string[];

  // Pricing
  pricePerNight: Decimal;
  currency: string;

  // Policies
  checkinTime: string;
  checkoutTime: string;
  cancellationPolicy: string;

  // Status
  isActive: boolean;
  isApproved: boolean;
  status: ListingStatus;

  // Ratings
  averageRating: number;
  totalReviews: number;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}
```

### Room Model

```typescript
interface Room {
  id: string;
  hotelId: string;
  name: string;
  roomType: string; // Luxury, Standard, Budget
  bedType: string; // Double, Twin, Suite
  maxGuests: number;
  basePrice: Decimal;
  amenities: string[];
  images: string[];
  totalUnits: number;

  // Relations
  inventory: RoomInventory[];
}
```

### Booking Model

```typescript
interface Booking {
  id: string;
  bookingCode: string;
  hotelId: string;
  userId: string;

  // Dates
  checkInDate: Date;
  checkOutDate: Date;
  numberOfNights: number;

  // Guest Info
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  numberOfGuests: number;

  // Rooms
  rooms: {
    roomId: string;
    quantity: number;
    nightlyRate: Decimal;
    totalPrice: Decimal;
  }[];

  // Pricing
  subtotal: Decimal;
  taxes: Decimal;
  totalAmount: Decimal;

  // Status
  status: "PENDING" | "CONFIRMED" | "CHECKED_IN" | "CHECKED_OUT" | "CANCELLED";
  paymentStatus: "PENDING" | "COMPLETED" | "FAILED";

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🔌 API Endpoints

### Hotel Endpoints

#### List Hotels

```
GET /api/hotels?
  destination=bali&
  checkIn=2026-05-20&
  checkOut=2026-05-25&
  guests=2&
  minPrice=2000&
  maxPrice=50000&
  amenities=wifi,pool&
  sort=relevance&
  page=1&
  limit=20

Response: 200 OK
{
  data: Hotel[],
  total: number,
  pages: number,
  page: number
}
```

#### Get Hotel Detail

```
GET /api/hotels/:slug

Response: 200 OK
{
  hotel: Hotel,
  rooms: Room[],
  availability: RoomInventory[],
  reviews: Review[],
  host: HostInfo
}
```

#### Create Hotel (Host Only)

```
POST /api/hotels
Authorization: Bearer token
Content-Type: multipart/form-data

Request:
{
  name: string
  description: string
  address: string
  city: string
  state: string
  country: string
  propertyType: string
  amenities: string[]
  pricePerNight: number
  images: File[]
  checkinTime: string
  checkoutTime: string
  cancellationPolicy: string
}

Response: 201 Created
{ hotel: Hotel }
```

#### Update Hotel (Host Only)

```
PUT /api/hotels/:id
Authorization: Bearer token
Content-Type: multipart/form-data

Response: 200 OK
{ hotel: Hotel }
```

#### Delete Hotel (Host/Admin)

```
DELETE /api/hotels/:id
Authorization: Bearer token

Response: 200 OK
{ message: 'Hotel deleted' }
```

### Room Management Endpoints

#### Add Room

```
POST /api/hotels/:hotelId/rooms
Authorization: Bearer token

Request:
{
  name: string
  roomType: string
  bedType: string
  maxGuests: number
  basePrice: number
  amenities: string[]
  images: File[]
}

Response: 201 Created
{ room: Room }
```

#### Update Room Inventory

```
PUT /api/hotels/:hotelId/rooms/:roomId/inventory
Authorization: Bearer token

Request:
{
  date: date (YYYY-MM-DD),
  available: number,
  price: number
}

Response: 200 OK
{ updated: true }
```

### Booking Endpoints

#### Create Booking

```
POST /api/bookings/create
Authorization: Bearer token

Request:
{
  hotelId: string
  roomId: string
  checkInDate: date
  checkOutDate: date
  numberOfGuests: number
  guestName: string
  guestEmail: string
  guestPhone: string
  roomQuantity: number
  specialRequests?: string
}

Response: 201 Created
{
  booking: Booking,
  payment: {
    id: string,
    orderId: string,
    amount: number,
    currency: string
  }
}
```

#### Get User Bookings

```
GET /api/bookings/my-bookings
Authorization: Bearer token

Response: 200 OK
{ bookings: Booking[] }
```

#### Cancel Booking

```
POST /api/bookings/:bookingId/cancel
Authorization: Bearer token

Request:
{
  cancellationReason: string
}

Response: 200 OK
{
  booking: Booking,
  refund: {
    amount: number,
    status: string
  }
}
```

---

## 🔄 Business Workflows

### Hotel Listing Workflow

```
1. Host navigates to /host/hotels
   ↓
2. Clicks "Add New Hotel"
   ↓
3. Fills hotel form (name, address, amenities, images)
   ↓
4. Uploads hotel images (via Cloudinary)
   ↓
5. Sets pricing and policies
   ↓
6. Adds room types and pricing
   ↓
7. Sets initial room inventory
   ↓
8. Submits for review
   ↓
9. POST /api/hotels with all data
   ↓
10. Hotel created with status = PENDING_REVIEW
    ↓
11. Admin reviews and approves
    ↓
12. Hotel becomes APPROVED and visible
```

### Booking Workflow

```
1. User browses /hotels with filters
   ↓
2. GET /api/hotels?filters
   ↓
3. User clicks hotel card
   ↓
4. GET /api/hotels/:id (loads detail)
   ↓
5. User enters check-in, check-out, guests
   ↓
6. GET /api/hotels/:id/availability (checks availability)
   ↓
7. User selects room type and quantity
   ↓
8. System calculates pricing (basePrice × nights × quantity)
   ↓
9. User confirms and enters guest info
   ↓
10. POST /api/bookings/create
    ↓
11. Razorpay payment initiated
    ↓
12. User completes payment
    ↓
13. Payment callback received
    ↓
14. Booking status set to CONFIRMED
    ↓
15. Invoice generated
    ↓
16. Confirmation email sent to guest
    ↓
17. Booking appears in user's /my-bookings
```

### Cancellation Workflow

```
1. User clicks "Cancel Booking" on /my-bookings
   ↓
2. Modal opens asking cancellation reason
   ↓
3. User confirms cancellation
   ↓
4. POST /api/bookings/:id/cancel
   ↓
5. System checks cancellation policy
   ↓
6. Calculates refund amount based on timing:
   - Full refund if cancelled > 7 days before
   - 50% refund if cancelled 3-7 days before
   - No refund if cancelled < 3 days before
   ↓
7. Refund initiated through Razorpay
   ↓
8. Room inventory updated (freed up)
   ↓
9. Cancellation email sent
   ↓
10. Host notified of cancellation
```

---

## 🔐 Access Control

### Who Can Do What

| Action            | User    | Host (Own) | Host (Other) | Admin |
| ----------------- | ------- | ---------- | ------------ | ----- |
| Create Hotel      | ✗       | ✓          | -            | ✓     |
| View Hotel        | ✓       | ✓          | ✓            | ✓     |
| Edit Hotel        | ✗       | ✓          | ✗            | ✓     |
| Delete Hotel      | ✗       | ✓          | ✗            | ✓     |
| Approve Hotel     | ✗       | ✗          | -            | ✓     |
| View Analytics    | ✗       | ✓          | ✗            | ✓     |
| Create Booking    | ✓       | ✓          | ✓            | ✓     |
| Cancel Booking    | ✓ (own) | ✓          | ✗            | ✓     |
| Respond to Review | ✗       | ✓ (own)    | ✗            | ✓     |

---

## 💰 Pricing & Payment

### Pricing Formula

```
Subtotal = (Room Base Price × Number of Nights × Quantity)
           + (Additional Room 2 × Nights × Quantity)
           + ...

Taxes = Subtotal × Tax Rate (18% in India)
Discount = Applied coupon amount (if any)

Total = Subtotal + Taxes - Discount
```

### Payment Processing

```
1. Razorpay payment gateway integration
2. Payment methods: Cards, UPI, Wallets, Bank Transfer
3. Secure 2FA for card payments
4. PCI DSS compliant
5. Automatic refund on cancellation
6. Payment receipt via email
```

### Commission Model

```
Platform Commission = Total Amount × 15%
Host Payout = Total Amount - Platform Commission
Tax Handling = Platform handles GST/Taxes
```

---

## 📱 User Interface Components

### Hotel Listing Page

- **Components Used**:
  - SearchBar (destination, dates, guests)
  - HotelFilters (price, amenities, rating)
  - HotelCard (grid/list view)
  - Pagination
  - ViewToggle

### Hotel Detail Page

- **Components Used**:
  - ImageCarousel (multiple hotel images)
  - HotelInfo (name, location, rating)
  - AmenitiesList
  - RoomSelector
  - BookingCalendar (date picker)
  - ReviewSection
  - HostInfo

### Booking Flow

- **Components Used**:
  - GuestForm
  - DatePicker
  - RoomSelector
  - PricingBreakdown
  - PaymentForm (Razorpay integration)

---

## 🔧 Key Features

### Smart Search

- Text search by hotel name, location, landmark
- Filter by amenities, price, rating, distance
- Date availability check
- Guest count matching

### Dynamic Pricing

- Set base price per room type
- Apply date-specific pricing (peak/off-season)
- Volume discounts for longer stays
- Last-minute deals

### Availability Management

- Real-time room availability
- Automatic inventory depletion on booking
- Overbooking prevention
- Manual blocking of dates

### Host Dashboard

- Analytics: Bookings, occupancy, revenue
- Calendar view of bookings
- Guest communication
- Review management
- Payout requests

---

## ⚡ Performance Optimization

### Caching Strategy

- Cache hotel list for 1 hour
- Cache hotel details for 30 minutes
- Cache availability for 5 minutes
- Invalidate on booking confirmation

### Database Optimization

- Index on: hostId, city, status, createdAt
- Pagination: 20-50 results per page
- Lazy load images (Cloudinary)
- Connection pooling with Prisma

### Frontend Optimization

- Code splitting: Load component on demand
- Image optimization: Responsive sizes
- Skeleton loaders: Better perceived performance
- Debounced search: Reduce API calls

---

## 🐛 Error Handling

### Common Errors & Handling

| Error              | Cause                   | Solution                      |
| ------------------ | ----------------------- | ----------------------------- |
| Booking Failed     | Room not available      | Show "Out of Stock" message   |
| Payment Failed     | Gateway error           | Retry or use alternate method |
| Hotel Not Found    | Slug doesn't exist      | 404 Not Found page            |
| Unauthorized       | Not logged in           | Redirect to login             |
| Inventory Mismatch | Race condition          | Re-fetch and retry            |
| Invalid Dates      | Checkout before checkin | Validate form input           |

---

## 📊 Monitoring & Analytics

### Key Metrics

- Bookings per day
- Occupancy rate
- Average booking value
- Cancellation rate
- Revenue per host
- Guest satisfaction (review rating)
- Conversion rate (views to bookings)

### Admin Dashboard

- Real-time booking feed
- Revenue dashboard
- Host performance metrics
- Payment reconciliation

---

## 🔗 Related Modules

- **Bookings & Payments**: Payment processing
- **Reviews & Ratings**: Guest reviews on hotels
- **Admin & Moderation**: Content approval
- **User & Auth**: Guest authentication
- **Wishlist**: Save favorite hotels

---

## 📚 Code References

### Service Methods

```typescript
// Create hotel
await hotelService.createHotel(hostId, hotelData);

// Get hotels with filters
await hotelService.getHotels(filters, page, limit);

// Get hotel detail
await hotelService.getHotelDetail(hotelId);

// Check availability
await hotelService.checkAvailability(roomId, checkIn, checkOut, quantity);

// Create booking
await bookingService.createBooking(userId, bookingData);

// Cancel booking
await bookingService.cancelBooking(bookingId, reason);
```

### Controller Endpoints

```typescript
// Hotel Controller
hotelController.listHotels();
hotelController.getHotelDetail();
hotelController.createHotel();
hotelController.updateHotel();
hotelController.deleteHotel();

// Booking Controller
bookingController.createBooking();
bookingController.getMyBookings();
bookingController.cancelBooking();
bookingController.verifyPayment();
```

---

## ✅ Testing Checklist

- [ ] Hotel creation with all required fields
- [ ] Image upload to Cloudinary
- [ ] Availability calendar updates correctly
- [ ] Booking creation with proper pricing calculation
- [ ] Payment integration works
- [ ] Refund on cancellation calculated correctly
- [ ] Reviews can be posted and moderated
- [ ] Filter and search functionality works
- [ ] Pagination works correctly
- [ ] Mobile responsiveness across devices
- [ ] Performance < 3 second load time

---

**Last Updated:** May 16, 2026  
**Status:** Complete  
**Maintained By:** Development Team
