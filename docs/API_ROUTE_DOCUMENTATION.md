# API Route Documentation

Generated from static source analysis.

## Routes

### /activity/[id]
- File: app/api/activity/[id]/route.ts
- Methods: GET, PUT, DELETE
- Controllers: activity.controller

### /activity
- File: app/api/activity/route.ts
- Methods: GET, POST
- Controllers: activity.controller

### /admin/bookings/[id]
- File: app/api/admin/bookings/[id]/route.ts
- Methods: PATCH
- Controllers: admin.controller

### /admin/bookings
- File: app/api/admin/bookings/route.ts
- Methods: GET
- Controllers: admin.controller

### /admin/dashboard
- File: app/api/admin/dashboard/route.ts
- Methods: GET
- Controllers: admin.controller

### /admin/hosts/[id]
- File: app/api/admin/hosts/[id]/route.ts
- Methods: PATCH
- Controllers: admin.controller

### /admin/hosts
- File: app/api/admin/hosts/route.ts
- Methods: GET
- Controllers: admin.controller

### /admin/kyc/[id]
- File: app/api/admin/kyc/[id]/route.ts
- Methods: PATCH
- Controllers: admin.controller

### /admin/kyc
- File: app/api/admin/kyc/route.ts
- Methods: GET
- Controllers: admin.controller

### /admin/listings/[type]/[id]
- File: app/api/admin/listings/[type]/[id]/route.ts
- Methods: PATCH
- Controllers: admin.controller

### /admin/listings
- File: app/api/admin/listings/route.ts
- Methods: GET
- Controllers: admin.controller

### /admin/payouts/[id]
- File: app/api/admin/payouts/[id]/route.ts
- Methods: PATCH
- Controllers: admin.controller

### /admin/payouts
- File: app/api/admin/payouts/route.ts
- Methods: GET
- Controllers: admin.controller

### /admin/posts
- File: app/api/admin/posts/route.ts
- Methods: Unknown
- Controllers: admin.controller

### /admin/users/[id]
- File: app/api/admin/users/[id]/route.ts
- Methods: PATCH
- Controllers: admin.controller

### /admin/users
- File: app/api/admin/users/route.ts
- Methods: GET
- Controllers: admin.controller

### /ai
- File: app/api/ai/route.ts
- Methods: POST

### /auth/[...nextauth]
- File: app/api/auth/[...nextauth]/route.ts
- Methods: Unknown

### /auth/forgot-password
- File: app/api/auth/forgot-password/route.ts
- Methods: POST
- Controllers: auth.controller

### /auth/google-login
- File: app/api/auth/google-login/route.ts
- Methods: GET
- Services: auth.service

### /auth/login
- File: app/api/auth/login/route.ts
- Methods: POST
- Controllers: auth.controller

### /auth/logout
- File: app/api/auth/logout/route.ts
- Methods: POST
- Controllers: auth.controller

### /auth/me
- File: app/api/auth/me/route.ts
- Methods: GET, PATCH
- Controllers: auth.controller

### /auth/register
- File: app/api/auth/register/route.ts
- Methods: POST
- Controllers: auth.controller

### /auth/reset-password
- File: app/api/auth/reset-password/route.ts
- Methods: POST
- Controllers: auth.controller

### /auth/verify
- File: app/api/auth/verify/route.ts
- Methods: GET
- Controllers: auth.controller

### /booking/[id]
- File: app/api/booking/[id]/route.ts
- Methods: GET, PATCH, DELETE
- Controllers: booking.controller

### /booking
- File: app/api/booking/route.ts
- Methods: GET, POST
- Controllers: booking.controller

### /forgot-password
- File: app/api/forgot-password/route.ts
- Methods: POST
- Controllers: auth.controller

### /host/hotels/[id]
- File: app/api/host/hotels/[id]/route.ts
- Methods: GET, PUT, DELETE
- Controllers: hotel.controller

### /host/hotels
- File: app/api/host/hotels/route.ts
- Methods: GET, POST
- Controllers: hotel.controller

### /hotel/[id]
- File: app/api/hotel/[id]/route.ts
- Methods: GET
- Controllers: hotel.controller

### /hotel
- File: app/api/hotel/route.ts
- Methods: GET
- Controllers: hotel.controller

### /location/gps
- File: app/api/location/gps/route.ts
- Methods: GET

### /location/ip
- File: app/api/location/ip/route.ts
- Methods: GET

### /my-bookings
- File: app/api/my-bookings/route.ts
- Methods: GET
- Controllers: my-bookings.controller

### /rental/[id]
- File: app/api/rental/[id]/route.ts
- Methods: GET, PUT, DELETE
- Controllers: rental.controller

### /rental
- File: app/api/rental/route.ts
- Methods: GET, POST
- Controllers: rental.controller

### /reset-password
- File: app/api/reset-password/route.ts
- Methods: POST
- Controllers: auth.controller

### /tour/[id]/booking
- File: app/api/tour/[id]/booking/route.ts
- Methods: POST
- Controllers: tour.controller

### /tour/[id]/chat
- File: app/api/tour/[id]/chat/route.ts
- Methods: GET, POST
- Controllers: tour.controller

### /tour/[id]/join-request/[requestId]
- File: app/api/tour/[id]/join-request/[requestId]/route.ts
- Methods: PATCH
- Controllers: tour.controller

### /tour/[id]/join-request
- File: app/api/tour/[id]/join-request/route.ts
- Methods: POST
- Controllers: tour.controller

### /tour/[id]/participants
- File: app/api/tour/[id]/participants/route.ts
- Methods: GET
- Controllers: tour.controller

### /tour/[id]/payment/order
- File: app/api/tour/[id]/payment/order/route.ts
- Methods: POST
- Controllers: tour.controller

### /tour/[id]/payment/verify
- File: app/api/tour/[id]/payment/verify/route.ts
- Methods: POST
- Controllers: tour.controller

### /tour/[id]
- File: app/api/tour/[id]/route.ts
- Methods: GET, PUT, DELETE
- Controllers: tour.controller

### /tour
- File: app/api/tour/route.ts
- Methods: GET, POST
- Controllers: tour.controller

### /upload
- File: app/api/upload/route.ts
- Methods: POST

### /verify
- File: app/api/verify/route.ts
- Methods: GET

### /wishlist
- File: app/api/wishlist/route.ts
- Methods: GET, POST, DELETE
- Controllers: wishlist.controller

## Coverage
- Total API route files: 51