# Bookings & Payments Module Documentation

**Module Type:** Core Transaction Processing  
**Files Location:**

- Services: [services/booking.service.ts](../../services/booking.service.ts)
- API: [app/api/bookings/](../../app/api/bookings/)

---

## 📖 Overview

The Bookings & Payments module handles all reservation processing, payment transactions, invoices, and financial workflows. It serves as the central hub connecting all booking types (hotels, tours, activities, rentals) with the Razorpay payment gateway.

---

## 🎯 Core Functionality

### 1. Booking Management

- **Create Booking**: Initialize booking with item details
- **Modify Booking**: Change dates, guests, room count
- **Cancel Booking**: Process cancellation with refund
- **Confirm Booking**: Payment processed, booking confirmed
- **Track Status**: PENDING → CONFIRMED → COMPLETED/CANCELLED

### 2. Payment Processing

- **Razorpay Integration**: Payment gateway for cards, UPI, wallets
- **Payment Methods**: Multiple payment options
- **Secure Transactions**: PCI DSS compliant
- **Payment Verification**: Server-side validation
- **Retry Logic**: Handle failed payments with retry

### 3. Invoice Management

- **Auto-generate**: Create invoice after payment
- **Email Invoice**: Send to guest email
- **Invoice History**: User can download past invoices
- **Refund Invoicing**: Credit notes for refunds

### 4. Refund Processing

- **Automatic Refunds**: Based on cancellation policy
- **Manual Refunds**: Admin-initiated refunds
- **Partial Refunds**: Handle multi-item bookings
- **Refund Status**: Track refund lifecycle

### 5. Financial Reporting

- **Transaction History**: All payments and refunds
- **Revenue Reports**: Daily, weekly, monthly summaries
- **Host Payouts**: Calculate and process host earnings
- **Admin Reconciliation**: Payment verification

---

## 📊 Data Models

### Booking Model (Polymorphic)

```typescript
interface Booking {
  id: string
  bookingCode: string  // Unique reference

  // Entity References (one of these is populated)
  hotelId?: string
  tourId?: string
  activityId?: string
  rentalId?: string

  // Participants
  userId: string
  hostId: string
  numberOfGuests: number

  // Dates (varies by type)
  checkInDate?: Date
  checkOutDate?: Date
  departureDate?: Date
  activityDate?: Date
  pickupDate?: Date

  // Pricing Breakdown
  subtotal: Decimal
  taxes: Decimal
  discount: Decimal
  totalAmount: Decimal
  currency: string  // 'INR'

  // Contact Information
  guestName: string
  guestEmail: string
  guestPhone: string

  // Special Requests
  specialRequests?: string

  // Status Tracking
  status: BookingStatus  // PENDING, CONFIRMED, CANCELLED, COMPLETED
  paymentStatus: PaymentStatus  // PENDING, COMPLETED, FAILED

  // Cancellation
  cancellationReason?: string
  cancelledAt?: Date
  refundAmount?: Decimal
  refundStatus?: PaymentStatus

  // Timestamps
  createdAt: Date
  updatedAt: Date
}

enum BookingStatus {
  PENDING          // Initial state
  CONFIRMED        // Payment successful
  CHECKED_IN       // User checked in (for hotels)
  COMPLETED        // Booking finished
  CANCELLED        // Booking cancelled
}

enum PaymentStatus {
  PENDING           // Awaiting payment
  COMPLETED         // Payment received
  FAILED            // Payment failed
  PARTIALLY_REFUNDED // Partial refund issued
  REFUNDED          // Full refund issued
}
```

### Payment Model

```typescript
interface Payment {
  id: string
  transactionId: string  // Unique transaction reference

  // Associated Booking
  bookingId: string
  bookingType: 'HOTEL' | 'TOUR' | 'ACTIVITY' | 'RENTAL'

  // Amount
  amount: Decimal
  currency: string  // 'INR'

  // Payment Method
  paymentMethod: PaymentMethod
  paymentGatewayId: string  // Razorpay order ID
  paymentGatewayRef: string  // Razorpay payment ID

  // Customer Information
  customerEmail: string
  customerPhone: string

  // Status
  status: PaymentStatus

  // Additional Fields
  signature?: string  // For verification
  failureReason?: string

  // Timestamps
  createdAt: Date
  completedAt?: Date
  refundedAt?: Date
}

enum PaymentMethod {
  RAZORPAY
  STRIPE
  PAYPAL
  BANK_TRANSFER
}
```

### Invoice Model

```typescript
interface Invoice {
  id: string;
  invoiceNumber: string; // Unique invoice number
  bookingId: string;
  userId: string;

  // Issue Details
  issueDate: Date;
  dueDate?: Date;
  paidDate?: Date;

  // Amounts
  subtotal: Decimal;
  tax: Decimal;
  discount?: Decimal;
  total: Decimal;

  // Status
  status: "DRAFT" | "ISSUED" | "PAID" | "OVERDUE";

  // Download Link
  pdfUrl?: string;
}
```

---

## 🔌 API Endpoints

### Create Booking

```
POST /api/bookings/create
Authorization: Bearer token
Content-Type: application/json

Request:
{
  // One of these:
  hotelId?: string,
  tourId?: string,
  activityId?: string,
  rentalId?: string,

  // Common fields
  guestName: string,
  guestEmail: string,
  guestPhone: string,
  numberOfGuests: number,
  specialRequests?: string,

  // Specific to booking type
  checkInDate?: date,        // Hotels
  checkOutDate?: date,       // Hotels
  roomId?: string,           // Hotels
  roomQuantity?: number,     // Hotels
  departureDate?: date,      // Tours
  participants?: [...],      // Tours
  slotId?: string,           // Activities
  pickupDate?: date,         // Rentals
  returnDate?: date,         // Rentals
}

Response: 201 Created
{
  booking: Booking,
  payment: {
    id: string,
    orderId: string,
    amount: number,
    currency: string,
    paymentUrl?: string
  }
}
```

### Get Bookings

```
GET /api/bookings/my-bookings?
  status=CONFIRMED&
  page=1&
  limit=20

Authorization: Bearer token

Response: 200 OK
{
  bookings: Booking[],
  total: number,
  pages: number
}
```

### Cancel Booking

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
    status: string,
    estimatedDate: date
  }
}
```

### Verify Payment

```
POST /api/payments/verify
Authorization: Bearer token
Content-Type: application/json

Request:
{
  orderId: string,
  paymentId: string,
  signature: string
}

Response: 200 OK
{
  verified: boolean,
  booking: Booking
}
```

### Get Invoice

```
GET /api/invoices/:bookingId
Authorization: Bearer token

Response: 200 OK
{
  invoice: Invoice,
  downloadUrl: string
}
```

---

## 💳 Payment Flow

### Complete Payment Workflow

```
1. User clicks "Book Now"
   ↓
2. POST /api/bookings/create
   ├─ Validate booking data
   ├─ Reserve inventory (lock room/slot)
   ├─ Create booking (PENDING status)
   ├─ Create payment record (PENDING)
   ├─ Initialize Razorpay order
   └─ Return payment details
   ↓
3. Client redirects to Razorpay
   ├─ User enters payment details
   ├─ 2FA verification
   └─ Payment processed
   ↓
4. Razorpay webhook hits callback URL
   ├─ Verify signature
   ├─ POST /api/payments/webhook
   ├─ Update payment status
   ├─ Update booking status (CONFIRMED)
   ├─ Release inventory lock
   ├─ Generate invoice
   ├─ Queue confirmation email
   └─ Queue SMS notification
   ↓
5. Return to success page
   ├─ Show booking code
   ├─ Show confirmation details
   └─ Option to download invoice
```

### Failed Payment Handling

```
1. Payment fails at gateway
   ↓
2. User returns to app
   ├─ Show "Payment Failed" message
   ├─ Option to retry payment
   ├─ Inventory auto-released after 15 mins
   ↓
3. User retries
   └─ Create new payment attempt
```

### Cancellation & Refund Flow

```
1. User initiates cancellation
   ├─ Confirm cancellation
   ├─ Select reason
   ├─ Review refund amount
   ↓
2. POST /api/bookings/:id/cancel
   ├─ Fetch cancellation policy
   ├─ Calculate refund amount
   ├─ Create refund transaction
   ├─ Initiate Razorpay refund
   └─ Update payment status
   ↓
3. Razorpay processes refund (5-7 business days)
   ├─ Webhook notification
   ├─ Update refund status
   ├─ Send refund confirmation email
   └─ Release inventory
```

---

## 💰 Pricing Logic

### Price Calculation

#### Hotel Booking

```
Room Base Price: ₹2,000/night
Number of Nights: 3
Number of Rooms: 2
Room Quantity: 1

Subtotal = ₹2,000 × 3 × 1 = ₹6,000
Taxes (18%) = ₹6,000 × 0.18 = ₹1,080
Discount (if coupon) = -₹200
Total = ₹6,000 + ₹1,080 - ₹200 = ₹6,880
```

#### Tour Booking

```
Price per Person: ₹8,500
Number of Participants: 3
Group Discount: 5% (for 3+ people)

Subtotal = ₹8,500 × 3 = ₹25,500
Group Discount = -₹25,500 × 0.05 = -₹1,275
Subtotal After Discount = ₹24,225
Taxes (18%) = ₹24,225 × 0.18 = ₹4,360.50
Total = ₹28,585.50
```

### Cancellation Refund Policy

```
Default Policy:
- Cancel 7+ days before: 100% refund (full amount)
- Cancel 3-7 days before: 50% refund
- Cancel <3 days before: 0% refund (no refund)
- No-show: 0% refund

Custom Policies (can be set per property/tour):
- Flexible: Full refund up to 48 hours
- Moderate: 50% refund up to 7 days
- Strict: Non-refundable
```

---

## 🔐 Security & Compliance

### Payment Security

- **PCI DSS Compliance**: Level 1 compliance via Razorpay
- **No Card Storage**: Cards never stored locally
- **SSL/TLS**: All transactions encrypted
- **Signature Verification**: Verify Razorpay webhooks
- **Rate Limiting**: Prevent brute force on payment endpoints

### Access Control

```
User Can:
- View own bookings
- Create bookings
- Cancel own bookings
- Download own invoices

Host Can:
- View bookings for own properties
- View earnings
- Request payouts

Admin Can:
- View all bookings
- Process refunds
- Modify payments
- View payment reports
- Process host payouts
```

---

## 📊 Financial Workflows

### Host Payout Calculation

```
Booking Total: ₹10,000
Platform Commission (15%): ₹1,500
Host Earnings: ₹8,500

Taxes Collected: ₹1,800 (18% GST)
Platform Handles Taxes: Yes
Host Receives: ₹8,500 (net of platform commission)

Monthly Rollup:
Total Earnings: ₹50,000
Total Commission Deducted: ₹7,500
Payable to Host: ₹42,500
```

### Admin Payout Processing

```
1. Host requests payout on /host/payouts
2. Payout request created (PENDING)
3. Admin reviews on /admin/payouts
4. Admin approves payout
5. Bank transfer initiated
6. Status updated to COMPLETED
7. Host notified via email
```

---

## 📱 User Interface

### Booking Confirmation Page

```
┌─────────────────────────────────────┐
│ ✓ Booking Confirmed!                │
│                                     │
│ Booking Code: GET-2026-05-001234    │
│ Confirmation sent to: user@mail.com │
│                                     │
│ Property: Deluxe Resort, Bali       │
│ Check-in: May 20, 2026              │
│ Check-out: May 23, 2026             │
│ Guests: 2 Adults                    │
│                                     │
│ Subtotal: ₹6,000                    │
│ Taxes (18%): ₹1,080                 │
│ Discount: -₹200                     │
│ Total: ₹6,880                       │
│                                     │
│ [Download Invoice] [View Booking]   │
└─────────────────────────────────────┘
```

### My Bookings Page

```
Confirmed Bookings (3)
├─ Deluxe Resort, Bali (May 20-23)
│  Status: CONFIRMED
│  Booking Code: GET-001234
│  [View Details] [Cancel]
├─ Adventure Tour, Nepal (Jun 15-20)
│  Status: CONFIRMED
│  [View Details] [Cancel]
└─ Yoga Retreat, Goa (Jul 1-8)
   Status: PENDING (Awaiting payment)
   [Complete Payment] [Cancel]

Past Bookings (5)
├─ Hotel, Mumbai (May 5-7) - COMPLETED
└─ ...
```

---

## ✅ Testing Checklist

- [ ] Booking creation flow works end-to-end
- [ ] Razorpay payment integration functions
- [ ] Payment verification validates signatures
- [ ] Webhook callbacks update status correctly
- [ ] Invoice generation creates proper PDFs
- [ ] Cancellation calculates refund correctly
- [ ] Refund processes through Razorpay
- [ ] Email confirmations sent
- [ ] SMS notifications sent
- [ ] Booking can be cancelled before confirmation
- [ ] Analytics dashboard shows correct metrics
- [ ] Host payouts calculated accurately

---

**Last Updated:** May 16, 2026  
**Status:** Complete  
**Maintained By:** Development Team
