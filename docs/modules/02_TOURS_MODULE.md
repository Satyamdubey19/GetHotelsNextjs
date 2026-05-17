# Tours & Trips Module Documentation

**Module Type:** Group Travel & Experiences  
**Files Location:**

- Services: [services/tour.service.ts](../../services/tour.service.ts)
- API: [app/api/tours/](../../app/api/tours/)
- Components: [components/tour/](../../components/tour/)

---

## 📖 Module Overview

The Tours & Trips module manages group travel packages with itineraries, participants, and bookings. Unlike hotels (which are static facilities), tours are time-bound experiences with flexible group sizes, daily schedules, and participant management.

---

## 🎯 Core Functionality

### 1. Tour Package Management

- **Create Tour Package**: Define destination, itinerary, duration, pricing
- **Set Itinerary**: Day-by-day activities, meals, accommodations
- **Group Size Management**: Set min/max participants, capacity
- **Dynamic Pricing**: Price per person with volume discounts
- **Category & Tags**: Adventure, Cultural, Wellness, etc.
- **Difficulty Levels**: Easy, Moderate, Challenging

### 2. Participant Management

- **Add Participants**: Track each booking's participant details
- **Guest Information**: Name, age, relationship, special requirements
- **Group Dynamics**: Manage groups of 2-30+ participants
- **Waitlist**: Manage overbooking situations
- **Participant Communication**: Enable tour chat

### 3. Tour Scheduling

- **Multiple Start Dates**: Flexible departure dates
- **Repeat Patterns**: Weekly/monthly recurring tours
- **Season Management**: Peak and off-season pricing
- **Booking Windows**: Set advance booking requirements
- **Cancellation Policies**: Weather, minimum participants, etc.

### 4. Tour Experience Features

- **Live Chat**: Real-time participant communication
- **Itinerary Details**: Activities, meals, locations per day
- **Inclusion/Exclusion**: Clear what's included
- **Reviews & Ratings**: Post-tour guest feedback
- **Host Communication**: Direct Q&A with tour operator

---

## 📊 Data Models

### Tour Model

```typescript
interface Tour {
  id: string;
  hostId: string;
  slug: string;
  title: string;
  description: string;
  destination: string;

  // Duration
  duration: string; // "5 Days / 4 Nights"
  durationDays: number;
  startDate: Date;
  endDate: Date;

  // Participants
  groupSizeMin: number;
  groupSizeMax: number;
  currentParticipants: number;
  maxParticipants: number;

  // Pricing
  pricePerPerson: Decimal;
  originalPrice?: Decimal;

  // Category
  category: "Adventure" | "Cultural" | "Relaxation" | "Wellness";
  difficulty: "Easy" | "Moderate" | "Challenging";
  tags: string[];

  // Content
  itinerary: TourItinerary[];
  included: string[];
  excluded: string[];

  // Media
  images: string[];

  // Ratings
  averageRating: number;
  totalReviews: number;

  // Status
  status: ListingStatus;
  isApproved: boolean;
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

interface TourItinerary {
  dayNumber: number;
  title: string;
  description: string;
  activities: string[];
  meals: string[]; // Breakfast, Lunch, Dinner
  accommodation: string;
}

interface TourParticipant {
  id: string;
  bookingId: string;
  name: string;
  age: number;
  relationship: "Self" | "Family" | "Friend";
  specialRequirements?: string;
}
```

### TourBooking Model

```typescript
interface TourBooking {
  id: string;
  bookingCode: string;
  tourId: string;
  userId: string;

  // Participants
  participantCount: number;
  participants: TourParticipant[];
  departureDate: Date;

  // Pricing
  subtotal: Decimal;
  taxes: Decimal;
  totalAmount: Decimal;

  // Contact
  contactName: string;
  contactEmail: string;
  contactPhone: string;

  // Status
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  paymentStatus: "PENDING" | "COMPLETED";

  createdAt: Date;
}
```

---

## 🔌 API Endpoints

### Tour Management

#### List Tours

```
GET /api/tours?
  destination=bali&
  category=adventure&
  minPrice=5000&
  maxPrice=20000&
  minDays=2&
  maxDays=7&
  sort=recommended&
  page=1

Response:
{
  data: Tour[],
  total: number,
  pages: number
}
```

#### Get Tour Detail

```
GET /api/tours/:slug

Response:
{
  tour: Tour,
  participants: User[],
  reviews: Review[],
  chat: ChatMessage[] (if booked)
}
```

#### Create Tour (Host)

```
POST /api/tours
Authorization: Bearer token

Request:
{
  title: string
  destination: string
  description: string
  duration: string
  durationDays: number
  category: string
  difficulty: string
  groupSizeMin: number
  groupSizeMax: number
  pricePerPerson: number
  itinerary: [{dayNumber, title, description, activities}]
  included: string[]
  excluded: string[]
  images: File[]
}

Response: 201 Created
{ tour: Tour }
```

### Booking Endpoints

#### Create Tour Booking

```
POST /api/tour-bookings/create
Authorization: Bearer token

Request:
{
  tourId: string
  departureDate: date
  participants: [
    { name, age, relationship }
  ]
  contactName: string
  contactEmail: string
  contactPhone: string
}

Response: 201 Created
{
  booking: TourBooking,
  payment: { orderId, amount }
}
```

#### Get Tour Bookings (User)

```
GET /api/tour-bookings/my-bookings
Authorization: Bearer token

Response:
{ bookings: TourBooking[] }
```

#### Update Participant List

```
PUT /api/tour-bookings/:bookingId/participants
Authorization: Bearer token

Request:
{ participants: TourParticipant[] }

Response: 200 OK
{ booking: TourBooking }
```

---

## 💬 Chat & Communication

### Tour Participant Chat

#### Get Chat Messages

```
GET /api/tours/:tourId/chat?limit=50

Response:
{
  messages: [
    { userId, userName, message, timestamp }
  ]
}
```

#### Send Message

```
POST /api/tours/:tourId/chat
Authorization: Bearer token
Content-Type: application/json

Request:
{ message: string }

Response: 201 Created
{ message: ChatMessage }
```

### WebSocket Connection (Socket.io)

```
Socket Event: 'tour-message'
Subscribe: socket.on('tour-message', (msg) => {...})
Emit: socket.emit('tour-message', {tourId, message})

Event: 'participant-joined'
Event: 'participant-left'
```

---

## 🔄 Business Workflows

### Tour Creation Workflow

```
1. Host clicks "Create Tour"
   ↓
2. Fills basic info (title, destination, category)
   ↓
3. Sets duration and dates
   ↓
4. Creates day-by-day itinerary
   ↓
5. Sets group size and pricing
   ↓
6. Uploads images
   ↓
7. Sets inclusions/exclusions
   ↓
8. Submits for review
   ↓
9. Admin approves
   ↓
10. Tour visible on /tours
```

### Booking Workflow

```
1. User browses /tours
   ↓
2. Clicks tour card
   ↓
3. Views full itinerary and details
   ↓
4. Selects departure date
   ↓
5. Enters participant details (name, age, etc.)
   ↓
6. Reviews pricing breakdown
   ↓
7. Initiates payment
   ↓
8. Payment confirmed
   ↓
9. Booking confirmed (gets booking code)
   ↓
10. Participant added to tour group
    ↓
11. Gets access to tour chat
    ↓
12. Receives pre-tour communication
```

### Tour Execution

```
Day 1: Departure
   ├── Participants meet at meeting point
   ├── Group orientation
   └── Day 1 activities start

Days 2-N: Daily Activities
   ├── Follow itinerary
   ├── Group chat active
   ├── Tour guide coordination
   └── Meals and accommodation

Final Day: Completion
   ├── Return to starting point
   ├── Farewell dinner
   └── Await reviews
```

---

## 👥 Participant Management

### Participant Lifecycle

```
1. User books tour → Primary participant created
2. Add other participants → Secondary participants
3. Get participant list → View all attendees
4. Pre-tour info sent → Via email/chat
5. Check-in at meeting point
6. Tour experience
7. Post-tour review invitation
```

### Group Dynamics

- **Solo Travelers**: Can join group tours
- **Family Groups**: Multiple participants from one booking
- **Friend Groups**: Friends joining same tour
- **Special Requirements**: Dietary, mobility, language needs
- **Group Chat**: All participants communicate

---

## 🌟 Advanced Features

### Flexible Cancellation

```
Cancellation Policy Options:
- Free cancellation up to 7 days before
- 50% refund if cancelled 3-7 days before
- No refund if cancelled < 3 days before
- No refund for no-show

Weather Contingency:
- Force majeure clause
- Tour may be rescheduled/cancelled
- Full refund if cancelled by operator
```

### Volume Discounts

```
Group Rates:
- 10+ people: 5% discount
- 15+ people: 10% discount
- 20+ people: 15% discount
- Corporate rates: Custom pricing
```

### Seasonal Pricing

```
Peak Season: April-June, Dec-Jan (full price)
Mid Season: Jul-Aug, Sep-Oct (10% discount)
Off Season: Nov, Feb-Mar (20% discount)
Special Events: Premium pricing
```

---

## 🔐 Access Control

| Action            | User       | Host      | Admin |
| ----------------- | ---------- | --------- | ----- |
| View Tour         | ✓          | ✓         | ✓     |
| Create Tour       | ✗          | ✓         | ✓     |
| Edit Tour         | ✗          | Own only  | ✓     |
| Delete Tour       | ✗          | Own only  | ✓     |
| Book Tour         | ✓          | ✓         | ✓     |
| View Participants | ✗          | Own tours | ✓     |
| Access Chat       | ✓ (booked) | ✓ (own)   | ✓     |
| Send Message      | ✓ (booked) | ✓ (own)   | ✓     |

---

## 📊 Analytics & Reporting

### Host Dashboard Metrics

- Bookings per departure date
- Revenue per tour
- Average group size
- Occupancy rate
- Cancellation rate
- Participant satisfaction
- Chat engagement

### Admin Monitoring

- Total tours active
- Booking volume trends
- Revenue trends
- New tour approvals
- Review moderation queue

---

## 🔧 Technical Implementation

### Service Methods

```typescript
// Tour Management
await tourService.createTour(hostId, tourData);
await tourService.getTours(filters);
await tourService.getTourDetail(tourId);
await tourService.updateTour(tourId, updates);

// Booking Management
await tourService.createBooking(userId, tourId, data);
await tourService.addParticipant(bookingId, participant);
await tourService.getParticipants(tourId);

// Chat
await tourService.sendMessage(tourId, userId, message);
await tourService.getMessages(tourId, limit);
```

### Real-time Communication (Socket.io)

```typescript
// Server Events
io.on("connection", (socket) => {
  socket.on("join-tour", (tourId) => {
    socket.join(`tour-${tourId}`);
  });

  socket.on("send-message", (tourId, message) => {
    io.to(`tour-${tourId}`).emit("new-message", message);
  });
});
```

---

## ✅ Testing Checklist

- [ ] Tour creation with complete itinerary
- [ ] Image upload works
- [ ] Booking with multiple participants
- [ ] Payment processing succeeds
- [ ] Participant list updates correctly
- [ ] Chat messages send/receive in real-time
- [ ] Cancellation refunds calculated correctly
- [ ] Reviews posted after tour completion
- [ ] Filter and search work across tours
- [ ] Mobile responsive layout
- [ ] Email notifications sent for bookings
- [ ] Itinerary displays properly with activities/meals

---

**Last Updated:** May 16, 2026  
**Status:** Complete  
**Maintained By:** Development Team
