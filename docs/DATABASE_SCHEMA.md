# Database Schema Reference

**Generated:** May 16, 2026  
**Database:** PostgreSQL with Prisma ORM  
**Purpose:** Complete reference for all database tables, relationships, and fields

---

## 🗄️ Complete Database Schema

### User Management

#### User Model

```prisma
model User {
  id              String      @id @default(uuid())
  email           String      @unique
  password        String
  name            String
  phone           String?

  // Profile
  avatar          String?
  bio             String?
  dateOfBirth     DateTime?
  gender          String?
  nationality     String?

  // Address
  address         String?
  city            String?
  state           String?
  country         String?
  zipCode         String?

  // Verification & Status
  emailVerified   DateTime?
  phoneVerified   DateTime?
  documentVerified Boolean @default(false)
  role            UserRole    @default(USER)  // USER, HOST, ADMIN
  status          UserStatus  @default(ACTIVE)

  // Preferences
  currency        String      @default("INR")
  language        String      @default("en")
  newsletter      Boolean     @default(true)

  // Timestamps
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  deletedAt       DateTime?

  // Relations
  Host            Host?
  Bookings        Booking[]
  TourBookings    TourBooking[]
  ActivityBookings ActivityBooking[]
  RentalBookings  RentalBooking[]
  Reviews         Review[]
  ReviewResponses ReviewResponse[]
  WishlistItems   WishlistItem[]
  UserPosts       UserPost[]
  PostComments    PostComment[]
  Documents       UserDocument[]
  PaymentMethods  PaymentMethod[]
  Invoices        Invoice[]

  // Admin actions
  ReviewedKYCs    KYCApplication[] @relation("ReviewedBy")
  ReviewedListings Activity[] @relation("ActivityReviewer")

  @@index([email])
  @@index([role, status])
}

enum UserRole {
  USER
  HOST
  ADMIN
}

enum UserStatus {
  ACTIVE
  INACTIVE
  SUSPENDED
  BANNED
}
```

#### Host Model

```prisma
model Host {
  id              String      @id @default(uuid())
  userId          String      @unique
  businessName    String?
  businessType    String?     // Individual, Company, NGO
  gstNumber       String?
  panNumber       String?

  // Verification
  kycStatus       KYCStatus   @default(PENDING)
  kycVerifiedAt   DateTime?
  kycDocument     String?

  // Banking
  accountHolderName String?
  bankName        String?
  accountNumber   String?
  ifscCode        String?

  // Ratings & Performance
  totalListings   Int         @default(0)
  averageRating   Float       @default(0)
  totalReviews    Int         @default(0)
  totalBookings   Int         @default(0)
  responseRate    Float       @default(0)

  // Payout
  totalEarnings   Decimal     @db.Decimal(12, 2)
  totalPayouts    Decimal     @db.Decimal(12, 2)
  pendingBalance  Decimal     @db.Decimal(12, 2)

  // Timestamps
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  // Relations
  User            User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  Hotels          Hotel[]
  Tours           Tour[]
  Activities      Activity[]
  Rentals         Rental[]
  BankDetails     HostBankDetails[]
  Bookings        Booking[]
  TourBookings    TourBooking[]
  ActivityBookings ActivityBooking[]
  RentalBookings  RentalBooking[]

  @@index([userId])
  @@index([kycStatus])
}

enum KYCStatus {
  PENDING
  VERIFIED
  REJECTED
  EXPIRED
}
```

#### UserDocument Model

```prisma
model UserDocument {
  id              String      @id @default(uuid())
  userId          String
  documentType    String      // PASSPORT, AADHAR, PAN, DRIVER_LICENSE
  documentNumber  String
  fileUrl         String
  expiryDate      DateTime?
  status          DocumentStatus @default(PENDING)

  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  User            User        @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([status])
}

enum DocumentStatus {
  PENDING
  VERIFIED
  REJECTED
  EXPIRED
}
```

---

### Hotels & Stays Module

#### Hotel Model

```prisma
model Hotel {
  id              String      @id @default(uuid())
  hostId          String
  slug            String      @unique
  name            String
  description     String?

  // Location
  address         String
  city            String
  state           String?
  country         String     @default("India")
  latitude        Float?
  longitude       Float?

  // Media
  imageUrl        String?
  images          String[]
  thumbnail       String?

  // Classification
  propertyType    PropertyType // Hotel, Resort, Villa, Apartment
  starRating      Int?        // 1-5 stars

  // Amenities & Features
  amenities       String[]
  facilities      String[]
  languages       String[]

  // Pricing
  pricePerNight   Decimal     @db.Decimal(10, 2)
  originalPrice   Decimal?    @db.Decimal(10, 2)
  currency        String      @default("INR")

  // Occupancy
  maxOccupancy    Int
  minOccupancy    Int         @default(1)

  // Policies
  checkinTime     String      @default("14:00")
  checkoutTime    String      @default("11:00")
  cancellationPolicy String?

  // Ratings & Reviews
  averageRating   Float       @default(0)
  totalReviews    Int         @default(0)

  // Inventory
  totalRooms      Int         @default(0)
  availableRooms  Int         @default(0)

  // Status & Moderation
  isActive        Boolean     @default(true)
  isApproved      Boolean     @default(false)
  featured        Boolean     @default(false)
  status          ListingStatus @default(PENDING_REVIEW)

  // Moderation Metadata
  submittedForReviewAt DateTime?
  approvedAt      DateTime?
  rejectedAt      DateTime?
  reviewedById    String?
  rejectionReason String?
  moderationNotes String?

  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  deletedAt       DateTime?

  // Relations
  Host            Host        @relation(fields: [hostId], references: [id], onDelete: Cascade)
  Rooms           Room[]
  Bookings        Booking[]
  Reviews         Review[]
  WishlistItems   WishlistItem[]

  @@index([hostId, isApproved, isActive])
  @@index([city, country])
  @@index([status])
}

enum PropertyType {
  HOTEL
  RESORT
  VILLA
  APARTMENT
  GUESTHOUSE
  BED_AND_BREAKFAST
  HOMESTAY
}

enum ListingStatus {
  DRAFT
  PENDING_REVIEW
  APPROVED
  REJECTED
  ARCHIVED
}
```

#### Room Model

```prisma
model Room {
  id              String      @id @default(uuid())
  hotelId         String
  name            String
  description     String?

  // Room Type
  roomType        String      // Luxury, Standard, Budget
  bedType         String      // Single, Double, Twin, Suite

  // Capacity
  maxGuests       Int
  beds             Int

  // Media
  images          String[]
  thumbnail       String?

  // Amenities
  amenities       String[]

  // Pricing
  basePrice       Decimal     @db.Decimal(10, 2)

  // Inventory
  totalUnits      Int         @default(1)

  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  Hotel           Hotel       @relation(fields: [hotelId], references: [id], onDelete: Cascade)
  Inventory       RoomInventory[]
  BookingRooms    BookingRoom[]

  @@index([hotelId])
}

model RoomInventory {
  id              String      @id @default(uuid())
  roomId          String
  date            DateTime    @db.Date
  available       Int
  price           Decimal     @db.Decimal(10, 2)
  blockedReason   String?

  Room            Room        @relation(fields: [roomId], references: [id], onDelete: Cascade)

  @@unique([roomId, date])
  @@index([roomId, date])
}
```

---

### Tours & Trips Module

#### Tour Model

```prisma
model Tour {
  id              String      @id @default(uuid())
  hostId          String
  slug            String      @unique
  title           String
  description     String?

  // Location & Destination
  destination     String
  city            String?
  state           String?
  country         String     @default("India")

  // Media
  imageUrl        String?
  images          String[]
  thumbnail       String?

  // Duration & Dates
  duration        String      // "3 Days / 2 Nights"
  durationDays    Int
  startDate       DateTime?
  endDate         DateTime?
  repeatPattern   String?     // Weekly, Monthly

  // Group & Participants
  groupSizeMin    Int         @default(2)
  groupSizeMax    Int         @default(30)
  currentParticipants Int     @default(0)
  maxParticipants Int         @default(30)

  // Pricing
  pricePerPerson  Decimal     @db.Decimal(10, 2)
  originalPrice   Decimal?    @db.Decimal(10, 2)
  currency        String      @default("INR")

  // Category & Difficulty
  category        String      // Adventure, Relaxation, Cultural
  difficulty      Difficulty  // Easy, Moderate, Challenging
  tags            String[]

  // Inclusions
  included        String[]    // Meals, Transport, Accommodation, etc.
  excluded        String[]

  // Ratings & Reviews
  averageRating   Float       @default(0)
  totalReviews    Int         @default(0)

  // Status & Moderation
  isActive        Boolean     @default(true)
  isApproved      Boolean     @default(false)
  featured        Boolean     @default(false)
  status          ListingStatus @default(PENDING_REVIEW)

  // Moderation
  submittedForReviewAt DateTime?
  approvedAt      DateTime?
  reviewedById    String?

  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  deletedAt       DateTime?

  // Relations
  Host            Host        @relation(fields: [hostId], references: [id], onDelete: Cascade)
  Itinerary       TourItinerary[]
  Participants    TourParticipant[]
  Bookings        TourBooking[]
  Reviews         Review[]
  WishlistItems   WishlistItem[]

  @@index([hostId, isApproved])
  @@index([destination, category])
  @@index([status])
}

enum Difficulty {
  EASY
  MODERATE
  CHALLENGING
}

model TourItinerary {
  id              String      @id @default(uuid())
  tourId          String
  dayNumber       Int
  title           String
  description     String?
  activities      String[]
  meals           String[]    // Breakfast, Lunch, Dinner
  accommodation   String?

  Tour            Tour        @relation(fields: [tourId], references: [id], onDelete: Cascade)

  @@unique([tourId, dayNumber])
}

model TourParticipant {
  id              String      @id @default(uuid())
  tourId          String
  bookingId       String
  name            String
  age             Int?
  relationship    String?     // Self, Family, Friend

  Tour            Tour        @relation(fields: [tourId], references: [id], onDelete: Cascade)
  TourBooking     TourBooking @relation(fields: [bookingId], references: [id], onDelete: Cascade)

  @@index([tourId, bookingId])
}
```

#### TourBooking Model

```prisma
model TourBooking {
  id              String      @id @default(uuid())
  bookingCode     String      @unique
  tourId          String
  userId          String
  hostId          String

  // Booking Details
  participantCount Int
  participants    TourParticipant[]
  departureDate   DateTime

  // Pricing
  subtotal        Decimal     @db.Decimal(10, 2)
  taxes           Decimal     @default(0) @db.Decimal(10, 2)
  totalAmount     Decimal     @db.Decimal(10, 2)
  currency        String      @default("INR")

  // Contact Info
  contactName     String
  contactEmail    String
  contactPhone    String

  // Status
  status          BookingStatus @default(PENDING)
  paymentStatus   PaymentStatus @default(PENDING)

  // Cancellation
  cancellationReason String?
  cancelledAt     DateTime?
  refundAmount    Decimal?    @db.Decimal(10, 2)

  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  Tour            Tour        @relation(fields: [tourId], references: [id])
  User            User        @relation(fields: [userId], references: [id])
  Host            Host        @relation(fields: [hostId], references: [id])
  Payment         Payment?

  @@index([tourId, userId])
  @@index([status, paymentStatus])
}
```

---

### Activities Module

#### Activity Model

```prisma
model Activity {
  id              String      @id @default(uuid())
  hostId          String
  slug            String      @unique
  title           String
  description     String?

  // Location
  city            String
  state           String?
  country         String     @default("India")
  area            String?
  meetingPoint    String?
  meetingLat      Float?
  meetingLng      Float?

  // Media
  imageUrl        String?
  images          String[]
  thumbnail       String?

  // Activity Type
  category        ActivityCategory
  difficulty      ActivityDifficulty @default(EASY)

  // Duration & Timing
  duration        String      // "2 hours"

  // Group & Slots
  groupSizeMin    Int         @default(1)
  groupSizeMax    Int         @default(20)
  totalSlots      Int         @default(20)
  availableSlots  Int         @default(20)

  // Pricing
  price           Decimal     @db.Decimal(10, 2)
  originalPrice   Decimal?    @db.Decimal(10, 2)
  currency        String      @default("INR")

  // Features
  language        String      @default("English")
  highlights      String[]
  included        String[]
  excluded        String[]
  cancellationPolicy String?

  // Ratings
  averageRating   Float       @default(0)
  totalReviews    Int         @default(0)

  // Status
  isActive        Boolean     @default(true)
  isApproved      Boolean     @default(false)
  featured        Boolean     @default(false)
  status          ListingStatus @default(PENDING_REVIEW)

  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  Host            Host        @relation(fields: [hostId], references: [id], onDelete: Cascade)
  Slots           ActivitySlot[]
  Bookings        ActivityBooking[]
  Reviews         Review[]
  WishlistItems   WishlistItem[]

  @@index([hostId, isApproved])
  @@index([city, category])
}

enum ActivityCategory {
  ADVENTURE
  WELLNESS
  CULTURAL
  SPORTS
  FOOD
  NATURE
  OTHER
}

enum ActivityDifficulty {
  EASY
  MODERATE
  CHALLENGING
}

model ActivitySlot {
  id              String      @id @default(uuid())
  activityId      String
  date            DateTime    @db.Date
  startTime       String
  endTime         String
  availableSlots  Int
  booked          Int         @default(0)

  Activity        Activity    @relation(fields: [activityId], references: [id], onDelete: Cascade)
  Bookings        ActivityBooking[]

  @@unique([activityId, date, startTime])
}

model ActivityBooking {
  id              String      @id @default(uuid())
  bookingCode     String      @unique
  activityId      String
  userId          String
  hostId          String
  slotId          String?

  // Booking Details
  date            DateTime
  startTime       String
  guestCount      Int         @default(1)
  privateGroup    Boolean     @default(false)

  // Guests
  guests          ActivityBookingGuest[]

  // Pricing
  subtotal        Decimal     @db.Decimal(10, 2)
  taxes           Decimal     @default(0) @db.Decimal(10, 2)
  totalAmount     Decimal     @db.Decimal(10, 2)

  // Contact
  contactName     String
  contactEmail    String
  contactPhone    String
  specialRequests String?

  // Status
  status          BookingStatus @default(PENDING)
  paymentStatus   PaymentStatus @default(PENDING)

  // Cancellation
  cancellationReason String?
  cancelledAt     DateTime?

  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  Activity        Activity    @relation(fields: [activityId], references: [id])
  User            User        @relation(fields: [userId], references: [id])
  Host            Host        @relation(fields: [hostId], references: [id])
  Slot            ActivitySlot? @relation(fields: [slotId], references: [id])
  Payment         Payment?

  @@index([activityId, userId])
  @@index([status, paymentStatus])
}

model ActivityBookingGuest {
  id              String      @id @default(uuid())
  bookingId       String
  name            String
  age             Int?
  email           String?
  phone           String?

  ActivityBooking ActivityBooking @relation(fields: [bookingId], references: [id], onDelete: Cascade)

  @@index([bookingId])
}
```

---

### Rentals Module

#### Rental Model

```prisma
model Rental {
  id              String      @id @default(uuid())
  hostId          String
  slug            String      @unique
  title           String
  description     String?

  // Type
  rentalType      RentalType  // Car, Bike, Scooter, Equipment

  // Location
  city            String
  pickupLocation  String?

  // Media
  images          String[]

  // Details
  specifications  String[]
  capacity        Int?        // For vehicles
  features        String[]

  // Pricing
  pricePerDay     Decimal     @db.Decimal(10, 2)
  pricePerHour    Decimal?    @db.Decimal(10, 2)

  // Availability
  totalUnits      Int         @default(1)

  // Status
  isActive        Boolean     @default(true)
  isApproved      Boolean     @default(false)

  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  Host            Host        @relation(fields: [hostId], references: [id], onDelete: Cascade)
  Bookings        RentalBooking[]

  @@index([hostId])
}

enum RentalType {
  CAR
  BIKE
  SCOOTER
  EQUIPMENT
  OTHER
}

model RentalBooking {
  id              String      @id @default(uuid())
  rentalId        String
  userId          String
  hostId          String

  pickupDate      DateTime
  returnDate      DateTime

  totalAmount     Decimal     @db.Decimal(10, 2)
  status          BookingStatus @default(PENDING)

  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  Rental          Rental      @relation(fields: [rentalId], references: [id])
  User            User        @relation(fields: [userId], references: [id])
  Host            Host        @relation(fields: [hostId], references: [id])
}
```

---

### Bookings & Payments

#### Booking Model (Hotels)

```prisma
model Booking {
  id              String      @id @default(uuid())
  bookingCode     String      @unique
  hotelId         String
  userId          String
  hostId          String

  // Dates
  checkInDate     DateTime
  checkOutDate    DateTime
  numberOfNights  Int

  // Guests
  numberOfGuests  Int
  guestName       String
  guestEmail      String
  guestPhone      String

  // Rooms
  rooms           BookingRoom[]

  // Pricing
  subtotal        Decimal     @db.Decimal(12, 2)
  taxes           Decimal     @db.Decimal(10, 2)
  discount        Decimal     @default(0) @db.Decimal(10, 2)
  totalAmount     Decimal     @db.Decimal(12, 2)
  currency        String      @default("INR")

  // Special Requests
  specialRequests String?

  // Status
  status          BookingStatus @default(PENDING)
  paymentStatus   PaymentStatus @default(PENDING)

  // Cancellation
  cancellationReason String?
  cancelledAt     DateTime?
  refundAmount    Decimal?    @db.Decimal(10, 2)

  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  Hotel           Hotel       @relation(fields: [hotelId], references: [id])
  User            User        @relation(fields: [userId], references: [id])
  Host            Host        @relation(fields: [hostId], references: [id])
  Payment         Payment?
  Invoice         Invoice?

  @@index([hotelId, userId])
  @@index([checkInDate, checkOutDate])
  @@index([status, paymentStatus])
}

model BookingRoom {
  id              String      @id @default(uuid())
  bookingId       String
  roomId          String
  quantity        Int         @default(1)
  nightlyRate     Decimal     @db.Decimal(10, 2)
  totalPrice      Decimal     @db.Decimal(10, 2)

  Booking         Booking     @relation(fields: [bookingId], references: [id], onDelete: Cascade)
  Room            Room        @relation(fields: [roomId], references: [id])

  @@index([bookingId])
}

enum BookingStatus {
  PENDING
  CONFIRMED
  CHECKED_IN
  CHECKED_OUT
  CANCELLED
  COMPLETED
}

enum PaymentStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
  PARTIALLY_REFUNDED
}
```

#### Payment Model

```prisma
model Payment {
  id              String      @id @default(uuid())
  transactionId   String      @unique

  // Association (polymorphic)
  bookingId       String?
  tourBookingId   String?
  activityBookingId String?

  // Amount
  amount          Decimal     @db.Decimal(10, 2)
  currency        String      @default("INR")

  // Method
  paymentMethod   PaymentMethod @default(RAZORPAY)
  paymentGatewayId String?
  paymentGatewayRef String?

  // Status
  status          PaymentStatus @default(PENDING)

  // Contact
  customerEmail   String
  customerPhone   String

  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  // Relations
  Booking         Booking?    @relation(fields: [bookingId], references: [id])
  TourBooking     TourBooking? @relation(fields: [tourBookingId], references: [id])
  ActivityBooking ActivityBooking? @relation(fields: [activityBookingId], references: [id])

  @@index([transactionId, status])
  @@index([bookingId, tourBookingId, activityBookingId])
}

enum PaymentMethod {
  RAZORPAY
  STRIPE
  PAYPAL
  BANK_TRANSFER
}
```

---

### Reviews & Ratings

#### Review Model

```prisma
model Review {
  id              String      @id @default(uuid())

  // Polymorphic relation
  hotelId         String?
  tourId          String?
  activityId      String?

  // Author
  userId          String
  rating          Int         // 1-5
  title           String?
  body            String

  // Response
  responses       ReviewResponse[]

  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  Hotel           Hotel?      @relation(fields: [hotelId], references: [id], onDelete: Cascade)
  Tour            Tour?       @relation(fields: [tourId], references: [id], onDelete: Cascade)
  Activity        Activity?   @relation(fields: [activityId], references: [id], onDelete: Cascade)
  User            User        @relation(fields: [userId], references: [id])

  @@index([hotelId, rating])
  @@index([tourId, rating])
  @@index([activityId, rating])
}

model ReviewResponse {
  id              String      @id @default(uuid())
  reviewId        String
  userId          String
  body            String

  createdAt       DateTime    @default(now())

  Review          Review      @relation(fields: [reviewId], references: [id], onDelete: Cascade)
  User            User        @relation(fields: [userId], references: [id])

  @@index([reviewId])
}
```

---

### Wishlist & Community

#### WishlistItem Model

```prisma
model WishlistItem {
  id              String      @id @default(uuid())
  userId          String

  // Polymorphic
  hotelId         String?
  tourId          String?
  activityId      String?

  addedAt         DateTime    @default(now())

  User            User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  Hotel           Hotel?      @relation(fields: [hotelId], references: [id], onDelete: Cascade)
  Tour            Tour?       @relation(fields: [tourId], references: [id], onDelete: Cascade)
  Activity        Activity?   @relation(fields: [activityId], references: [id], onDelete: Cascade)

  @@unique([userId, hotelId])
  @@unique([userId, tourId])
  @@unique([userId, activityId])
}
```

---

### Admin & Moderation

#### KYCApplication Model

```prisma
model KYCApplication {
  id              String      @id @default(uuid())
  hostId          String
  documentType    String
  documentNumber  String
  documentUrl     String

  status          KYCStatus   @default(PENDING)
  reviewedById    String?
  reviewNotes     String?
  rejectionReason String?

  submittedAt     DateTime    @default(now())
  reviewedAt      DateTime?

  Host            Host        @relation(fields: [hostId], references: [id])
  ReviewedBy      User?       @relation(fields: [reviewedById], references: [id])

  @@index([status, submittedAt])
}
```

---

### Other Models

#### Invoice Model

```prisma
model Invoice {
  id              String      @id @default(uuid())
  invoiceNumber   String      @unique
  bookingId       String      @unique
  userId          String

  issueDate       DateTime    @default(now())
  dueDate         DateTime?
  paidDate        DateTime?

  subtotal        Decimal     @db.Decimal(10, 2)
  tax             Decimal     @db.Decimal(10, 2)
  total           Decimal     @db.Decimal(10, 2)

  status          String      @default("PENDING")  // PENDING, PAID

  Booking         Booking     @relation(fields: [bookingId], references: [id])
  User            User        @relation(fields: [userId], references: [id])
}
```

#### UserPost Model

```prisma
model UserPost {
  id              String      @id @default(uuid())
  userId          String
  title           String
  content         String
  images          String[]

  likes           Int         @default(0)
  comments        PostComment[]

  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  User            User        @relation(fields: [userId], references: [id])

  @@index([userId, createdAt])
}

model PostComment {
  id              String      @id @default(uuid())
  postId          String
  userId          String
  content         String

  createdAt       DateTime    @default(now())

  UserPost        UserPost    @relation(fields: [postId], references: [id], onDelete: Cascade)
  User            User        @relation(fields: [userId], references: [id])
}
```

---

## 📊 Database Relationships Map

```
User (1) ─── (M) Booking
         ─── (M) TourBooking
         ─── (M) ActivityBooking
         ─── (M) Review
         ─── (M) WishlistItem
         ─── (1) Host

Host (1) ─── (M) Hotel
        ─── (M) Tour
        ─── (M) Activity
        ─── (M) Rental

Hotel (1) ─── (M) Room
        ─── (M) Booking
        ─── (M) Review

Tour (1) ─── (M) TourItinerary
       ─── (M) TourParticipant
       ─── (M) TourBooking

Activity (1) ─── (M) ActivitySlot
          ─── (M) ActivityBooking

Booking (1) ─── (M) BookingRoom
         ─── (1) Payment
         ─── (1) Invoice
```

---

## 🔑 Key Constraints & Indexes

### Unique Constraints

- User.email
- Host.userId
- Hotel.slug
- Tour.slug
- Activity.slug
- Rental.slug
- Payment.transactionId
- Invoice.invoiceNumber
- Booking.bookingCode
- TourBooking.bookingCode
- ActivityBooking.bookingCode

### Important Indexes

- User: email, role, status
- Hotel: hostId, city, status
- Tour: hostId, destination, status
- Activity: hostId, city, status
- Booking: hotelId, userId, status
- Payment: transactionId, status

---

**Last Updated:** May 16, 2026  
**Database Version:** PostgreSQL 14+  
**Prisma Version:** Latest
