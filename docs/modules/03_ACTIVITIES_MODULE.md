# Activities Module Documentation

**Module Type:** Experiential Bookings  
**Files Location:**

- Services: [services/activity.service.ts](../../services/activity.service.ts)
- API: [app/api/activities/](../../app/api/activities/)
- Components: [components/activity/](../../components/activity/)

---

## 📖 Overview

The Activities module manages time-based, slot-based experiences like adventure sports, wellness sessions, food experiences, cultural tours, and sports activities. Unlike hotels (location-based), activities are event-based with specific time slots, group sizes, and capacity limits.

---

## 🎯 Core Functionality

### 1. Activity Creation

- **Define Activity**: Title, description, category, difficulty
- **Location Mapping**: GPS coordinates, meeting point
- **Time Slots**: Create multiple time slots per day
- **Group Size**: Min/max participants, capacity per slot
- **Pricing**: Per person pricing, group discounts
- **Duration**: Activity length (1-8+ hours)
- **Inclusions**: What's provided (equipment, meals, etc.)

### 2. Slot Management

- **Create Slots**: Multiple time slots per day
- **Capacity Tracking**: Available vs booked slots
- **Slot Status**: Open, Full, Cancelled
- **Recurring Slots**: Daily, weekly patterns
- **Slot History**: Track past and future slots

### 3. Booking System

- **Instant Booking**: Reserve slot immediately
- **Group Booking**: Book multiple guests in one slot
- **Private Groups**: Exclusive group option (additional pricing)
- **Guest Management**: Track each participant

### 4. Experience Features

- **Pre-activity Communication**: Send instructions, weather info
- **Difficulty Levels**: Easy, Moderate, Challenging
- **Language Support**: Indicate guide languages
- **Special Requirements**: Dietary, mobility, skill levels
- **Reviews & Ratings**: Post-activity feedback

---

## 📊 Data Models

### Activity Model

```typescript
interface Activity {
  id: string;
  hostId: string;
  slug: string;
  title: string;
  description: string;
  category: ActivityCategory; // Adventure, Wellness, Food, etc.
  difficulty: ActivityDifficulty; // Easy, Moderate, Challenging

  // Location
  city: string;
  meetingPoint: string;
  meetingLat: number;
  meetingLng: number;

  // Duration & Timing
  duration: string; // "2 hours", "1 day"
  startTime?: string;
  endTime?: string;

  // Group & Capacity
  groupSizeMin: number;
  groupSizeMax: number;
  totalSlots: number;
  availableSlots: number;

  // Pricing
  price: Decimal;
  originalPrice?: Decimal;

  // Content
  highlights: string[];
  included: string[]; // Gear, guide, insurance, etc.
  excluded: string[];

  // Features
  language: string;
  meetingInstructions?: string;
  cancellationPolicy: string;

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

interface ActivitySlot {
  id: string;
  activityId: string;
  date: Date;
  startTime: string;
  endTime: string;
  availableSlots: number;
  booked: number;
  status: "OPEN" | "FULL" | "CANCELLED";
}

interface ActivityBookingGuest {
  name: string;
  age: number;
  email?: string;
  phone?: string;
  specialRequirements?: string;
}
```

---

## 🔌 API Endpoints

### List Activities

```
GET /api/activities?
  city=bangalore&
  category=adventure&
  difficulty=moderate&
  minPrice=500&
  maxPrice=5000&
  page=1

Response:
{
  data: Activity[],
  total: number,
  pages: number
}
```

### Get Activity Detail

```
GET /api/activities/:slug

Response:
{
  activity: Activity,
  slots: ActivitySlot[],  // Upcoming slots
  reviews: Review[],
  availability: {}
}
```

### Create Activity (Host)

```
POST /api/activities
Authorization: Bearer token

Request:
{
  title: string
  description: string
  category: string
  difficulty: string
  city: string
  meetingPoint: string
  duration: string
  groupSizeMin: number
  groupSizeMax: number
  price: number
  highlights: string[]
  included: string[]
  excluded: string[]
  images: File[]
}

Response: 201 Created
{ activity: Activity }
```

### Create Activity Slots

```
POST /api/activities/:activityId/slots
Authorization: Bearer token

Request:
{
  dates: [{date, startTime, endTime, capacity}]
}

Response: 201 Created
{ slots: ActivitySlot[] }
```

### Create Activity Booking

```
POST /api/activity-bookings/create
Authorization: Bearer token

Request:
{
  activityId: string
  slotId: string
  privateGroup: boolean
  guestCount: number
  guests: [
    { name, age, email, specialRequirements }
  ]
  contactName: string
  contactEmail: string
  contactPhone: string
}

Response: 201 Created
{
  booking: ActivityBooking,
  payment: { orderId, amount }
}
```

---

## 🔄 Workflows

### Activity Listing Workflow

```
1. Host creates activity with basic info
2. Defines difficulty level and categories
3. Creates initial time slots
4. Sets pricing and inclusions
5. Uploads activity images
6. Submits for moderation
7. Admin approves
8. Activity visible on /activities
```

### Booking Workflow

```
1. User browses /activities with filters
2. Clicks activity card
3. Views full details and upcoming slots
4. Selects date and time slot
5. Enters guest count and details
6. Reviews pricing and inclusions
7. Initiates payment
8. Payment confirmed
9. Booking confirmed with code
10. Receives pre-activity instructions
```

### Capacity Management

```
Slot Created: capacity = 20
Booking 1: 4 guests → available = 16
Booking 2: 6 guests → available = 10
Booking 3: 10 guests → available = 0 (FULL)
New booking request → Waitlist option
```

---

## 🎯 Features

### Activity Categories

- **Adventure**: Trekking, rock climbing, paragliding
- **Wellness**: Yoga, meditation, spa
- **Food**: Cooking classes, food tours, tastings
- **Cultural**: Temple tours, museum visits, workshops
- **Sports**: Surfing, skiing, cycling
- **Nature**: Bird watching, nature walks, safaris
- **Other**: Miscellaneous experiences

### Difficulty Levels

```
EASY       → For beginners, minimal physical effort
MODERATE   → Some fitness required, basic skills
CHALLENGING → High fitness, adventure experience needed
```

### Slot Variations

```
Single Session:
- 9:00 AM - 11:00 AM (2-hour class)

Multiple Slots Same Day:
- 9:00 AM - 11:00 AM
- 2:00 PM - 4:00 PM
- 6:00 PM - 8:00 PM

Multi-Day Recurring:
- Monday & Wednesday: 6:00 PM - 7:30 PM
- Full day weekends: 7:00 AM - 5:00 PM
```

### Private Groups Option

```
Standard Booking: Mixed groups, ₹1,500/person
Private Group: Exclusive, ₹2,000/person × group size
Min group for private: Usually 6-8 people
```

### Guest Management

```
Per Guest Info Collected:
- Name (required)
- Age (required for difficulty rating)
- Email (optional)
- Phone (optional)
- Special Requirements (dietary, mobility, etc.)
- Skill Level (for sports/adventure activities)
```

---

## 💰 Pricing Strategy

### Pricing Options

```
Fixed Price: All slots same price
Variable Price: Different times, different prices
  - Morning slots: ₹1,000
  - Afternoon slots: ₹1,200
  - Evening slots: ₹1,500

Group Discounts:
- 1-2 people: Full price
- 3-5 people: 5% discount
- 6-10 people: 10% discount
- 10+ people: 15% discount

Early Bird: Book 7+ days ahead = 10% discount
Last Minute: Book <24 hours = 20% premium
```

---

## 📊 Monitoring & Analytics

### Host Dashboard Metrics

- Bookings per slot
- Occupancy rate
- Revenue per activity
- Popular time slots
- Cancellation rate
- Guest satisfaction (reviews)
- No-show rate

### Slot Performance

```
Slot Status Dashboard:
- Open slots (taking bookings)
- Near Full slots (6 spots left)
- Full slots (waitlisted)
- Cancelled slots (weather/other)
- Past slots (completed/reviewed)
```

---

## 🔐 Access Control

| Action           | User    | Host     | Admin |
| ---------------- | ------- | -------- | ----- |
| View Activity    | ✓       | ✓        | ✓     |
| Create Activity  | ✗       | ✓        | ✓     |
| Edit Activity    | ✗       | Own only | ✓     |
| Approve Activity | ✗       | ✗        | ✓     |
| Book Activity    | ✓       | ✓        | ✓     |
| Create Slots     | ✗       | ✓ (own)  | ✓     |
| Cancel Slot      | ✗       | ✓ (own)  | ✓     |
| View Bookings    | ✓ (own) | ✓ (own)  | ✓     |

---

## ⚡ Performance Optimization

### Caching

- Cache activity list (1 hour)
- Cache available slots (5 minutes)
- Invalidate on booking

### Database Optimization

- Index: city, category, activityId
- Pagination: 20-50 per page
- Lazy load images

### Frontend Optimization

- Skeleton loaders for slots
- Debounced search
- Responsive images

---

## ✅ Testing Checklist

- [ ] Activity creation with all fields
- [ ] Slot creation and management
- [ ] Booking with guest details
- [ ] Payment processing
- [ ] Capacity tracking and full slot handling
- [ ] Reviews posted after activity
- [ ] Difficulty filter works
- [ ] Category filter works
- [ ] Search functionality
- [ ] Mobile responsive layout
- [ ] Pre-activity email sent
- [ ] Cancellation refund calculated

---

**Last Updated:** May 16, 2026  
**Status:** Complete  
**Maintained By:** Development Team
