# API Routes Documentation

**Organization:** RESTful API endpoints  
**Base URL:** `/api/`  
**Authentication:** JWT Bearer Token (Authorization header)  
**Response Format:** JSON

---

## 📡 API Overview

### Base Response Structure

```json
{
  "success": true,
  "data": {...} | [...],
  "error": null,
  "message": "Success"
}
```

### Error Response

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
```

### HTTP Status Codes

- `200 OK` - Successful GET/PUT/DELETE
- `201 Created` - Successful POST (resource created)
- `204 No Content` - Successful DELETE (no response body)
- `400 Bad Request` - Invalid parameters
- `401 Unauthorized` - Missing/invalid authentication
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Duplicate/conflict (email exists)
- `422 Unprocessable Entity` - Validation failed
- `429 Too Many Requests` - Rate limited
- `500 Internal Server Error` - Server error

---

## 🔐 Authentication Endpoints

### POST `/api/auth/signup`

Register new user account.

**Request:**

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe",
  "role": "USER"
}
```

**Response:** `201 Created`

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER"
  },
  "token": "jwt_token",
  "refreshToken": "refresh_token"
}
```

### POST `/api/auth/login`

Authenticate user with email and password.

**Request:**

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:** `200 OK`

```json
{
  "user": {...},
  "token": "jwt_token",
  "refreshToken": "refresh_token"
}
```

### POST `/api/auth/logout`

Logout current user (requires authentication).

**Headers:** `Authorization: Bearer token`

**Response:** `200 OK`

```json
{
  "message": "Logged out successfully"
}
```

### POST `/api/auth/refresh`

Refresh access token using refresh token.

**Request:**

```json
{
  "refreshToken": "refresh_token"
}
```

**Response:** `200 OK`

```json
{
  "token": "new_jwt_token",
  "refreshToken": "new_refresh_token"
}
```

### GET `/api/auth/profile`

Get authenticated user profile.

**Headers:** `Authorization: Bearer token`

**Response:** `200 OK`

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER",
    "avatar": "cloudinary_url",
    "bio": "Bio text",
    "city": "Bangalore",
    "country": "India"
  }
}
```

### PUT `/api/auth/profile`

Update user profile (requires authentication).

**Headers:** `Authorization: Bearer token`

**Request:**

```json
{
  "name": "Jane Doe",
  "bio": "Updated bio",
  "city": "Mumbai",
  "language": "en",
  "currency": "INR"
}
```

**Response:** `200 OK`

```json
{
  "user": {...}
}
```

---

## 🏨 Hotels Endpoints

### GET `/api/hotels`

List hotels with optional filters.

**Query Parameters:**

```
destination=bali
checkIn=2026-05-20
checkOut=2026-05-25
guests=2
minPrice=2000
maxPrice=50000
amenities=wifi,pool
propertyType=hotel
sort=relevance
page=1
limit=20
```

**Response:** `200 OK`

```json
{
  "data": [
    {
      "id": "uuid",
      "slug": "hotel-name",
      "name": "Hotel Name",
      "city": "Bali",
      "pricePerNight": 2500,
      "averageRating": 4.5,
      "totalReviews": 234,
      "images": ["url1", "url2"],
      "amenities": ["WiFi", "Pool"]
    }
  ],
  "total": 245,
  "page": 1,
  "pages": 13
}
```

### GET `/api/hotels/:slug`

Get hotel detail with rooms and reviews.

**Response:** `200 OK`

```json
{
  "hotel": {
    "id": "uuid",
    "slug": "hotel-name",
    "name": "Hotel Name",
    "description": "Full description",
    "address": "123 Main St",
    "city": "Bali",
    "amenities": ["WiFi", "Pool", "Spa"],
    "images": ["url1", "url2"],
    "rooms": [
      {
        "id": "uuid",
        "name": "Deluxe Room",
        "roomType": "Luxury",
        "maxGuests": 2,
        "basePrice": 3000,
        "amenities": ["AC", "TV"]
      }
    ],
    "reviews": [...]
  }
}
```

### POST `/api/hotels` (Host/Admin)

Create new hotel listing.

**Headers:** `Authorization: Bearer token`  
**Content-Type:** `multipart/form-data`

**Request:**

```json
{
  "name": "Hotel Name",
  "description": "Description",
  "address": "123 Main St",
  "city": "Bali",
  "country": "Indonesia",
  "propertyType": "Hotel",
  "pricePerNight": 2500,
  "checkinTime": "14:00",
  "checkoutTime": "11:00",
  "amenities": ["WiFi", "Pool"],
  "images": [File, File]
}
```

**Response:** `201 Created`

```json
{
  "hotel": {...}
}
```

---

## 🎯 Tours Endpoints

### GET `/api/tours`

List tours with filters.

**Query Parameters:**

```
destination=bali
category=adventure
minPrice=5000
maxPrice=20000
minDays=2
maxDays=7
sort=recommended
page=1
```

**Response:** `200 OK`

```json
{
  "data": [
    {
      "id": "uuid",
      "slug": "tour-name",
      "title": "Tour Title",
      "destination": "Bali",
      "duration": "3 Days",
      "pricePerPerson": 8500,
      "groupSize": { "min": 2, "max": 30 },
      "participants": 15,
      "rating": 4.7,
      "images": ["url1"]
    }
  ],
  "total": 45,
  "page": 1
}
```

### GET `/api/tours/:slug`

Get tour detail with itinerary.

**Response:** `200 OK`

```json
{
  "tour": {
    "id": "uuid",
    "title": "Tour Title",
    "description": "Description",
    "itinerary": [
      {
        "dayNumber": 1,
        "title": "Day 1: Arrival",
        "description": "Description",
        "activities": ["Activity 1", "Activity 2"],
        "meals": ["Lunch", "Dinner"],
        "accommodation": "Hotel Name"
      }
    ],
    "included": ["Transport", "Meals"],
    "excluded": ["Travel insurance"]
  }
}
```

### POST `/api/tour-bookings/create` (Authenticated)

Create tour booking.

**Headers:** `Authorization: Bearer token`

**Request:**

```json
{
  "tourId": "uuid",
  "departureDate": "2026-06-15",
  "participants": [
    { "name": "John", "age": 30, "relationship": "Self" },
    { "name": "Jane", "age": 28, "relationship": "Spouse" }
  ],
  "contactName": "John",
  "contactEmail": "john@email.com",
  "contactPhone": "+91-9876543210"
}
```

**Response:** `201 Created`

```json
{
  "booking": {
    "id": "uuid",
    "bookingCode": "TOU-2026-001234",
    "status": "PENDING",
    "totalAmount": 17000
  },
  "payment": {
    "orderId": "razorpay_order_id",
    "amount": 17000,
    "currency": "INR"
  }
}
```

---

## 🎭 Activities Endpoints

### GET `/api/activities`

List activities.

**Query Parameters:**

```
city=bangalore
category=adventure
difficulty=moderate
minPrice=500
maxPrice=5000
page=1
```

**Response:** `200 OK`

```json
{
  "data": [
    {
      "id": "uuid",
      "slug": "activity-name",
      "title": "Activity Title",
      "city": "Bangalore",
      "category": "Adventure",
      "difficulty": "Moderate",
      "price": 1500,
      "duration": "2 hours",
      "rating": 4.6
    }
  ],
  "total": 120,
  "page": 1
}
```

### GET `/api/activities/:slug`

Get activity detail with available slots.

**Response:** `200 OK`

```json
{
  "activity": {
    "id": "uuid",
    "title": "Activity Title",
    "slots": [
      {
        "id": "uuid",
        "date": "2026-05-25",
        "startTime": "09:00",
        "endTime": "11:00",
        "availableSlots": 15,
        "status": "OPEN"
      }
    ]
  }
}
```

---

## 📅 Booking Endpoints

### POST `/api/bookings/create` (Authenticated)

Create booking for any property type.

**Headers:** `Authorization: Bearer token`

**Request:**

```json
{
  "hotelId": "uuid",
  "checkInDate": "2026-05-20",
  "checkOutDate": "2026-05-25",
  "numberOfGuests": 2,
  "roomId": "uuid",
  "guestName": "John Doe",
  "guestEmail": "john@email.com",
  "guestPhone": "+91-9876543210"
}
```

**Response:** `201 Created`

```json
{
  "booking": {...},
  "payment": {...}
}
```

### GET `/api/bookings/my-bookings` (Authenticated)

Get user's bookings.

**Headers:** `Authorization: Bearer token`

**Query Parameters:**

```
status=CONFIRMED
page=1
limit=20
```

**Response:** `200 OK`

```json
{
  "bookings": [
    {
      "id": "uuid",
      "bookingCode": "HO-2026-001234",
      "propertyName": "Hotel Name",
      "checkInDate": "2026-05-20",
      "checkOutDate": "2026-05-25",
      "totalAmount": 6880,
      "status": "CONFIRMED"
    }
  ],
  "total": 5,
  "page": 1
}
```

### POST `/api/bookings/:bookingId/cancel` (Authenticated)

Cancel a booking.

**Headers:** `Authorization: Bearer token`

**Request:**

```json
{
  "cancellationReason": "Change of plans"
}
```

**Response:** `200 OK`

```json
{
  "booking": { ...status: "CANCELLED" },
  "refund": {
    "amount": 3440,
    "status": "INITIATED"
  }
}
```

---

## 💳 Payment Endpoints

### POST `/api/payments/verify` (Authenticated)

Verify Razorpay payment.

**Headers:** `Authorization: Bearer token`

**Request:**

```json
{
  "orderId": "razorpay_order_id",
  "paymentId": "razorpay_payment_id",
  "signature": "signature_hash"
}
```

**Response:** `200 OK`

```json
{
  "verified": true,
  "booking": {..., "status": "CONFIRMED"}
}
```

---

## 💬 Chat Endpoints

### GET `/api/tours/:tourId/chat`

Get tour chat messages.

**Headers:** `Authorization: Bearer token`

**Query Parameters:**

```
limit=50
offset=0
```

**Response:** `200 OK`

```json
{
  "messages": [
    {
      "id": "uuid",
      "userId": "uuid",
      "userName": "John",
      "message": "Message text",
      "timestamp": "2026-05-20T10:30:00Z"
    }
  ],
  "total": 234
}
```

### POST `/api/tours/:tourId/chat` (Authenticated)

Send chat message.

**Headers:** `Authorization: Bearer token`

**Request:**

```json
{
  "message": "Hello everyone!"
}
```

**Response:** `201 Created`

```json
{
  "message": {
    "id": "uuid",
    "userId": "uuid",
    "message": "Hello everyone!",
    "timestamp": "2026-05-20T10:30:00Z"
  }
}
```

---

## 👨‍💼 Admin Endpoints

### GET `/api/admin/listings` (Admin Only)

Get pending listings for moderation.

**Headers:** `Authorization: Bearer admin_token`

**Query Parameters:**

```
status=PENDING_REVIEW
type=hotel
page=1
```

**Response:** `200 OK`

```json
{
  "listings": [...]
}
```

### POST `/api/admin/listings/:id/approve` (Admin Only)

Approve a listing.

**Response:** `200 OK`

```json
{
  "listing": { ...status: "APPROVED" }
}
```

### POST `/api/admin/listings/:id/reject` (Admin Only)

Reject a listing.

**Request:**

```json
{
  "rejectionReason": "Reason for rejection"
}
```

**Response:** `200 OK`

```json
{
  "listing": { ...status: "REJECTED" }
}
```

---

## 🔗 Pagination

### Standard Pagination Parameters

```
page=1          // Page number (1-indexed)
limit=20        // Results per page
sort=created    // Sort field
order=desc      // asc or desc
```

### Response Pagination

```json
{
  "data": [...],
  "total": 245,
  "page": 1,
  "limit": 20,
  "pages": 13
}
```

---

## ⚙️ Query Operators

### Date Ranges

```
startDate=2026-05-01
endDate=2026-05-31
```

### Numeric Ranges

```
minPrice=1000
maxPrice=10000
minRating=4
```

### Multiple Values

```
amenities=wifi,pool,gym    // comma-separated
status=confirmed,completed  // multiple statuses
```

### Sorting

```
sort=price&order=asc          // Low to high
sort=rating&order=desc        // High to low
sort=created&order=desc       // Newest first
sort=relevance&order=asc      // Best match first
```

---

## 🛡️ Rate Limiting

### Limits by Endpoint Type

```
Public endpoints: 100 requests/hour per IP
Authenticated: 500 requests/hour per user
Admin: 1000 requests/hour per admin
Login/Signup: 5 attempts/15min per IP
```

### Response Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1621234567
```

---

## 📚 Error Codes

| Code               | HTTP | Meaning                        |
| ------------------ | ---- | ------------------------------ |
| `VALIDATION_ERROR` | 422  | Invalid input parameters       |
| `UNAUTHORIZED`     | 401  | Missing authentication         |
| `FORBIDDEN`        | 403  | Insufficient permissions       |
| `NOT_FOUND`        | 404  | Resource not found             |
| `CONFLICT`         | 409  | Duplicate/conflicting resource |
| `RATE_LIMITED`     | 429  | Too many requests              |
| `SERVER_ERROR`     | 500  | Unexpected server error        |
| `PAYMENT_FAILED`   | 402  | Payment processing failed      |
| `INVALID_TOKEN`    | 401  | Invalid JWT token              |
| `EXPIRED_TOKEN`    | 401  | Expired JWT token              |

---

**Last Updated:** May 16, 2026  
**API Version:** v1  
**Authentication:** JWT Bearer Tokens  
**Base URL:** `/api/`
