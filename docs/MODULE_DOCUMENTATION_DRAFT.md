# Module Documentation Draft

Generated from static analysis on 2026-05-14T16:03:32.552Z.

## Architecture Flow
- Typical request flow: page -> component -> /app/api/.../route.ts -> controller -> service -> prisma/lib -> DB/external API.
- Client pages/components usually call local API routes via fetch/axios wrappers in lib modules.
- Controllers are mostly thin adapters; services centralize domain/business rules.
- lib contains both server infra (prisma, jwt, mail, razorpay) and client-side helpers (axios wrappers, data shaping).

### API Route to Controller Mapping (high-level)
- app/api/activity/[id]/route.ts -> controllers/activity.controller.ts
- app/api/activity/route.ts -> controllers/activity.controller.ts
- app/api/admin/bookings/[id]/route.ts -> controllers/admin.controller.ts
- app/api/admin/bookings/route.ts -> controllers/admin.controller.ts
- app/api/admin/dashboard/route.ts -> controllers/admin.controller.ts
- app/api/admin/hosts/[id]/route.ts -> controllers/admin.controller.ts
- app/api/admin/hosts/route.ts -> controllers/admin.controller.ts
- app/api/admin/kyc/[id]/route.ts -> controllers/admin.controller.ts
- app/api/admin/kyc/route.ts -> controllers/admin.controller.ts
- app/api/admin/listings/[type]/[id]/route.ts -> controllers/admin.controller.ts
- app/api/admin/listings/route.ts -> controllers/admin.controller.ts
- app/api/admin/payouts/[id]/route.ts -> controllers/admin.controller.ts
- app/api/admin/payouts/route.ts -> controllers/admin.controller.ts
- app/api/admin/posts/route.ts -> controllers/admin.controller.ts
- app/api/admin/users/[id]/route.ts -> controllers/admin.controller.ts
- app/api/admin/users/route.ts -> controllers/admin.controller.ts
- app/api/auth/forgot-password/route.ts -> controllers/auth.controller.ts
- app/api/auth/login/route.ts -> controllers/auth.controller.ts
- app/api/auth/logout/route.ts -> controllers/auth.controller.ts
- app/api/auth/me/route.ts -> controllers/auth.controller.ts
- app/api/auth/register/route.ts -> controllers/auth.controller.ts
- app/api/auth/reset-password/route.ts -> controllers/auth.controller.ts
- app/api/auth/verify/route.ts -> controllers/auth.controller.ts
- app/api/booking/[id]/route.ts -> controllers/booking.controller.ts
- app/api/booking/route.ts -> controllers/booking.controller.ts
- app/api/forgot-password/route.ts -> controllers/auth.controller.ts
- app/api/host/hotels/[id]/route.ts -> controllers/hotel.controller.ts
- app/api/host/hotels/route.ts -> controllers/hotel.controller.ts
- app/api/hotel/[id]/route.ts -> controllers/hotel.controller.ts
- app/api/hotel/route.ts -> controllers/hotel.controller.ts
- app/api/my-bookings/route.ts -> controllers/my-bookings.controller.ts
- app/api/rental/[id]/route.ts -> controllers/rental.controller.ts
- app/api/rental/route.ts -> controllers/rental.controller.ts
- app/api/reset-password/route.ts -> controllers/auth.controller.ts
- app/api/tour/[id]/booking/route.ts -> controllers/tour.controller.ts
- app/api/tour/[id]/chat/route.ts -> controllers/tour.controller.ts
- app/api/tour/[id]/join-request/[requestId]/route.ts -> controllers/tour.controller.ts
- app/api/tour/[id]/join-request/route.ts -> controllers/tour.controller.ts
- app/api/tour/[id]/participants/route.ts -> controllers/tour.controller.ts
- app/api/tour/[id]/payment/order/route.ts -> controllers/tour.controller.ts
- app/api/tour/[id]/payment/verify/route.ts -> controllers/tour.controller.ts
- app/api/tour/[id]/route.ts -> controllers/tour.controller.ts
- app/api/tour/route.ts -> controllers/tour.controller.ts
- app/api/wishlist/route.ts -> controllers/wishlist.controller.ts

## controllers

### controllers/activity.controller.ts
- Role: API request orchestrator; validates/parses request, calls service, shapes HTTP response
- Main exports/functions: getActivities, getActivity, createActivityController, updateActivityController, deleteActivityController, getActivitiesController
- Key dependencies: internal: lib/auth.ts, services/hotel.service.ts, services/activity.service.ts | external: next/server, next-auth
- Used by (high-level): 2 imports; top areas: app(2); sample: app/api/activity/route.ts, app/api/activity/[id]/route.ts

### controllers/admin.controller.ts
- Role: API request orchestrator; validates/parses request, calls service, shapes HTTP response
- Main exports/functions: adminDashboard, adminBookings, adminUpdateBooking, adminUsers, adminUpdateUser, adminHosts, adminUpdateHost, adminPayouts, adminUpdatePayout, adminKyc, adminUpdateKyc, adminListings, adminPosts, adminUpdateListing
- Key dependencies: internal: utils/admin-auth.ts, utils/api-response.ts, utils/admin-query.ts, services/admin.service.ts, validators/admin.validators.ts | external: next/server
- Used by (high-level): 14 imports; top areas: app(14); sample: app/api/admin/bookings/route.ts, app/api/admin/bookings/[id]/route.ts, app/api/admin/dashboard/route.ts, app/api/admin/hosts/route.ts, app/api/admin/hosts/[id]/route.ts

### controllers/auth.controller.ts
- Role: API request orchestrator; validates/parses request, calls service, shapes HTTP response
- Main exports/functions: register, login, forgotPassword, ResetPasswordHandler, me, updateMe, logout, verifyEmail
- Key dependencies: internal: services/auth.service.ts, lib/auth.ts | external: next/server, next/headers, next-auth
- Used by (high-level): 9 imports; top areas: app(9); sample: app/api/auth/forgot-password/route.ts, app/api/auth/login/route.ts, app/api/auth/logout/route.ts, app/api/auth/me/route.ts, app/api/auth/register/route.ts

### controllers/booking.controller.ts
- Role: API request orchestrator; validates/parses request, calls service, shapes HTTP response
- Main exports/functions: listUserBookingsController, createHotelBookingController, getBookingByIdController, cancelBookingController
- Key dependencies: internal: lib/auth.ts, services/auth.service.ts, services/booking.service.ts, validators/booking.validators.ts | external: next/headers, next-auth, next/server
- Used by (high-level): 2 imports; top areas: app(2); sample: app/api/booking/route.ts, app/api/booking/[id]/route.ts

### controllers/hotel.controller.ts
- Role: API request orchestrator; validates/parses request, calls service, shapes HTTP response
- Main exports/functions: getHostHotels, getHostHotel, createHostHotel, updateHostHotel, deleteHostHotel, getAllHotelsController, getHotelByIdController, getHotelBySlugController, getHotelsByLocationController, searchHotelsController, getRandomHotelsController
- Key dependencies: internal: lib/auth.ts, services/auth.service.ts, services/hotel.service.ts | external: next/server, next-auth, next/headers
- Used by (high-level): 4 imports; top areas: app(4); sample: app/api/host/hotels/route.ts, app/api/host/hotels/[id]/route.ts, app/api/hotel/route.ts, app/api/hotel/[id]/route.ts

### controllers/my-bookings.controller.ts
- Role: API request orchestrator; validates/parses request, calls service, shapes HTTP response
- Main exports/functions: listMyBookingsController
- Key dependencies: internal: lib/auth.ts, services/auth.service.ts, services/my-bookings.service.ts | external: next/server, next/headers, next-auth
- Used by (high-level): 1 imports; top areas: app(1); sample: app/api/my-bookings/route.ts

### controllers/rental.controller.ts
- Role: API request orchestrator; validates/parses request, calls service, shapes HTTP response
- Main exports/functions: getRentals, getRental, createRentalController, updateRentalController, deleteRentalController, getRentalsController
- Key dependencies: internal: lib/auth.ts, services/hotel.service.ts, services/rental.service.ts | external: next/server, next-auth
- Used by (high-level): 2 imports; top areas: app(2); sample: app/api/rental/route.ts, app/api/rental/[id]/route.ts

### controllers/tour.controller.ts
- Role: API request orchestrator; validates/parses request, calls service, shapes HTTP response
- Main exports/functions: getTours, getTour, createTourController, updateTourController, deleteTourController, getToursController, createJoinRequestController, reviewJoinRequestController, createTourBookingController, createTourPaymentOrderController, verifyTourPaymentController, listTourParticipantsController, getTourChatController, sendTourChatMessageController
- Key dependencies: internal: lib/auth.ts, services/auth.service.ts, services/hotel.service.ts, services/tour.service.ts | external: next/server, next/headers, next-auth
- Used by (high-level): 9 imports; top areas: app(9); sample: app/api/tour/route.ts, app/api/tour/[id]/booking/route.ts, app/api/tour/[id]/chat/route.ts, app/api/tour/[id]/join-request/route.ts, app/api/tour/[id]/join-request/[requestId]/route.ts

### controllers/wishlist.controller.ts
- Role: API request orchestrator; validates/parses request, calls service, shapes HTTP response
- Main exports/functions: getWishlistController, addToWishlistController, removeFromWishlistController
- Key dependencies: internal: lib/auth.ts, services/auth.service.ts, services/wishlist.service.ts | external: next/server, next-auth, next/headers, @prisma/client
- Used by (high-level): 1 imports; top areas: app(1); sample: app/api/wishlist/route.ts

## services

### services/activity.service.ts
- Role: Business logic and data orchestration layer between controllers and data/lib
- Main exports/functions: ActivityInput, listActivities, getActivityById, listPublicActivities, getPublicActivityBySlug, ActivityRecord, normalizeActivityForForm, normalizeActivityForPublic, createActivity, updateActivity, deleteActivity
- Key dependencies: internal: lib/prisma.ts, lib/activities.ts | external: @prisma/client
- Used by (high-level): 1 imports; top areas: controllers(1); sample: controllers/activity.controller.ts

### services/admin.service.ts
- Role: Business logic and data orchestration layer between controllers and data/lib
- Main exports/functions: getAdminDashboard, listAdminBookings, updateAdminBooking, listAdminUsers, updateAdminUser, listAdminHosts, updateAdminHost, listAdminPayouts, updateAdminPayout, listAdminKyc, decideAdminKyc, listAdminListings, listAdminPosts, updateAdminListing
- Key dependencies: internal: lib/prisma.ts, utils/admin-auth.ts, utils/admin-query.ts | external: @prisma/client
- Used by (high-level): 1 imports; top areas: controllers(1); sample: controllers/admin.controller.ts

### services/auth.service.ts
- Role: Business logic and data orchestration layer between controllers and data/lib
- Main exports/functions: createSessionToken, verifySessionToken, toAuthUser, registerUser, LoginUser, authorizeCredentials, handleGoogleAuth, getAuthUserById, VerifyEmail, getUserFromSessionToken, updateAuthenticatedUser, RequestResetPassword, ResetPassword
- Key dependencies: internal: lib/prisma.ts, lib/hash.ts, lib/mail.ts, types/auth.ts | external: bcrypt, jsonwebtoken, @prisma/client
- Used by (high-level): 9 imports; top areas: controllers(6), app(1), lib(1), utils(1); sample: app/api/auth/google-login/route.ts, controllers/auth.controller.ts, controllers/booking.controller.ts, controllers/hotel.controller.ts, controllers/my-bookings.controller.ts

### services/availability.service.ts
- Role: Business logic and data orchestration layer between controllers and data/lib
- Main exports/functions: AvailabilityInput, AvailabilityQuote, parseStayDate, getTodayStayDate, enumerateStayDates, RoomAvailabilityCalendarInput, createRoomAvailabilityCalendar, checkRoomAvailability, reserveRoomInventory, releaseReservedRoomInventory
- Key dependencies: internal: lib/prisma.ts | external: @prisma/client
- Used by (high-level): 3 imports; top areas: services(2), validators(1); sample: services/booking.service.ts, services/hotel.service.ts, validators/booking.validators.ts

### services/booking.service.ts
- Role: Business logic and data orchestration layer between controllers and data/lib
- Main exports/functions: getBookingById, listBookingsForUser, createHotelBooking, cancelHotelBooking
- Key dependencies: internal: lib/prisma.ts, lib/mail.ts, services/availability.service.ts, validators/booking.validators.ts | external: @prisma/client
- Used by (high-level): 1 imports; top areas: controllers(1); sample: controllers/booking.controller.ts

### services/hotel.service.ts
- Role: Business logic and data orchestration layer between controllers and data/lib
- Main exports/functions: HotelInput, RoomInput, getHostByUserId, listHotels, getHotelById, HotelWithRelations, normalizeHotelForForm, createHotel, updateHotel, deleteHotel, HotelDateRange, getRoomAvailabilityByDate, getAllHotels, getPublicHotelById, getPublicHotelBySlug, getHotelsByLocation, searchHotels, getRandomHotels
- Key dependencies: internal: lib/prisma.ts, services/availability.service.ts | external: @prisma/client
- Used by (high-level): 4 imports; top areas: controllers(4); sample: controllers/activity.controller.ts, controllers/hotel.controller.ts, controllers/rental.controller.ts, controllers/tour.controller.ts

### services/my-bookings.service.ts
- Role: Business logic and data orchestration layer between controllers and data/lib
- Main exports/functions: listUnifiedBookingsForUser
- Key dependencies: internal: lib/prisma.ts, types/my-bookings.ts
- Used by (high-level): 1 imports; top areas: controllers(1); sample: controllers/my-bookings.controller.ts

### services/rental.service.ts
- Role: Business logic and data orchestration layer between controllers and data/lib
- Main exports/functions: RentalInput, RentalDetailsInput, listRentals, getRentalById, listPublicRentals, getPublicRentalBySlug, RentalWithRelations, normalizeRentalForForm, normalizeRentalForPublic, createRental, updateRental, deleteRental
- Key dependencies: internal: lib/prisma.ts, lib/rentals.ts | external: @prisma/client
- Used by (high-level): 1 imports; top areas: controllers(1); sample: controllers/rental.controller.ts

### services/tour.service.ts
- Role: Business logic and data orchestration layer between controllers and data/lib
- Main exports/functions: TourInput, ItineraryDayInput, TourBookingInput, VerifyTourPaymentInput, parseLanguages, listTours, getTourById, listPublicTours, getPublicTourBySlug, TourWithRelations, normalizeTourForForm, normalizeTourForPublic, createTour, updateTour, deleteTour, checkTourJoinEligibility, createTourJoinRequest, approveTourJoinRequest, rejectTourJoinRequest, createTourBooking, createTourPaymentOrder, verifyTourPayment, confirmTourBooking, listTourParticipants, TourChatAccessScope, getTourChatPreview, sendTourChatMessage
- Key dependencies: internal: lib/prisma.ts, lib/razorpay.ts, lib/mail.ts, lib/tours.ts | external: crypto, @prisma/client
- Used by (high-level): 2 imports; top areas: controllers(1), lib(1); sample: controllers/tour.controller.ts, lib/socket-server.ts

### services/wishlist.service.ts
- Role: Business logic and data orchestration layer between controllers and data/lib
- Main exports/functions: getWishlistService, addToWishlistService, removeFromWishlistService
- Key dependencies: internal: lib/prisma.ts | external: @prisma/client
- Used by (high-level): 1 imports; top areas: controllers(1); sample: controllers/wishlist.controller.ts

## lib

### lib/activities.ts
- Role: Shared infrastructure/client utilities (Prisma, auth, API clients, payments, mail, helpers)
- Main exports/functions: ActivityCategory, Activity, activities, getActivityBySlug, activityCities
- Key dependencies: None detected
- Used by (high-level): 3 imports; top areas: app(2), services(1); sample: app/activities/page.tsx, app/activities/[slug]/page.tsx, services/activity.service.ts

### lib/auth.ts
- Role: Shared infrastructure/client utilities (Prisma, auth, API clients, payments, mail, helpers)
- Main exports/functions: authOptions
- Key dependencies: internal: services/auth.service.ts | external: next-auth, next-auth/jwt, next-auth/providers/credentials, next-auth/providers/google
- Used by (high-level): 11 imports; top areas: controllers(8), app(2), utils(1); sample: app/api/auth/google-login/route.ts, app/api/auth/[...nextauth]/route.ts, controllers/activity.controller.ts, controllers/auth.controller.ts, controllers/booking.controller.ts

### lib/axios.ts
- Role: Shared infrastructure/client utilities (Prisma, auth, API clients, payments, mail, helpers)
- Main exports/functions: getApiErrorMessage, default
- Key dependencies: external: axios
- Used by (high-level): 26 imports; top areas: app(20), components(4), contexts(1), lib(1); sample: app/admin/bookings/page.tsx, app/admin/kyc/page.tsx, app/admin/listings/page.tsx, app/admin/payouts/page.tsx, app/admin/posts/page.tsx

### lib/booking.ts
- Role: Shared infrastructure/client utilities (Prisma, auth, API clients, payments, mail, helpers)
- Main exports/functions: BookingStatus, BookingRoom, BookingRecord, fetchUserBookings, fetchBookingById, cancelUserBooking
- Key dependencies: internal: lib/axios.ts
- Used by (high-level): 1 imports; top areas: app(1); sample: app/profile/page.tsx

### lib/cloudinary.ts
- Role: Shared infrastructure/client utilities (Prisma, auth, API clients, payments, mail, helpers)
- Main exports/functions: default
- Key dependencies: external: cloudinary
- Used by (high-level): 2 imports; top areas: app(1), middleware(1); sample: app/api/upload/route.ts, middleware/multer.ts

### lib/hash.ts
- Role: Shared infrastructure/client utilities (Prisma, auth, API clients, payments, mail, helpers)
- Main exports/functions: generateToken, hashToken
- Key dependencies: external: crypto
- Used by (high-level): 1 imports; top areas: services(1); sample: services/auth.service.ts

### lib/homeData.ts
- Role: Shared infrastructure/client utilities (Prisma, auth, API clients, payments, mail, helpers)
- Main exports/functions: HomeFeature, HotelCard, HomeData, homeData
- Key dependencies: None detected
- Used by (high-level): 2 imports; top areas: components(1), types(1); sample: components/HomePage.tsx, types/component-props.ts

### lib/hotels.ts
- Role: Shared infrastructure/client utilities (Prisma, auth, API clients, payments, mail, helpers)
- Main exports/functions: HotelReview, Hotel, hotels, getHotelBySlug, getHotelSlugs
- Key dependencies: None detected
- Used by (high-level): 6 imports; top areas: components(4), app(2); sample: app/hotels/page.tsx, app/hotels/[slug]/page.tsx, components/hotel/HotelList.tsx, components/hotel/HotelReviews.tsx, components/sections/HomeFeaturedHotels.tsx

### lib/jwt.ts
- Role: Shared infrastructure/client utilities (Prisma, auth, API clients, payments, mail, helpers)
- Main exports/functions: signJwt, verifyJwt
- Key dependencies: internal: types/auth.ts | external: jsonwebtoken
- Used by (high-level): No direct imports detected (entrypoint/dynamic/unused)

### lib/mail.ts
- Role: Shared infrastructure/client utilities (Prisma, auth, API clients, payments, mail, helpers)
- Main exports/functions: sendAuthEmail, sendBookingConfirmationEmail, sendVerificationEmail
- Key dependencies: internal: lib/resend.ts, types/mail.ts
- Used by (high-level): 3 imports; top areas: services(3); sample: services/auth.service.ts, services/booking.service.ts, services/tour.service.ts

### lib/prisma.ts
- Role: Shared infrastructure/client utilities (Prisma, auth, API clients, payments, mail, helpers)
- Main exports/functions: No named export detected
- Key dependencies: external: @prisma/adapter-pg, @prisma/client, pg
- Used by (high-level): 12 imports; top areas: services(10), app(2); sample: app/api/ai/route.ts, app/api/verify/route.ts, services/activity.service.ts, services/admin.service.ts, services/auth.service.ts

### lib/razorpay.ts
- Role: Shared infrastructure/client utilities (Prisma, auth, API clients, payments, mail, helpers)
- Main exports/functions: razorpay
- Key dependencies: external: razorpay
- Used by (high-level): 1 imports; top areas: services(1); sample: services/tour.service.ts

### lib/rentals.ts
- Role: Shared infrastructure/client utilities (Prisma, auth, API clients, payments, mail, helpers)
- Main exports/functions: RentalType, Rental, rentals, getRentalBySlug, rentalCities
- Key dependencies: None detected
- Used by (high-level): 1 imports; top areas: services(1); sample: services/rental.service.ts

### lib/resend.ts
- Role: Shared infrastructure/client utilities (Prisma, auth, API clients, payments, mail, helpers)
- Main exports/functions: resend
- Key dependencies: external: resend
- Used by (high-level): 1 imports; top areas: lib(1); sample: lib/mail.ts

### lib/socket-server.ts
- Role: Shared infrastructure/client utilities (Prisma, auth, API clients, payments, mail, helpers)
- Main exports/functions: No named export detected
- Key dependencies: internal: services/tour.service.ts | external: http, dotenv, socket.io
- Used by (high-level): No direct imports detected (entrypoint/dynamic/unused)

### lib/tours.ts
- Role: Shared infrastructure/client utilities (Prisma, auth, API clients, payments, mail, helpers)
- Main exports/functions: Itinerary, Tour, tours
- Key dependencies: None detected
- Used by (high-level): 11 imports; top areas: components(8), app(2), services(1); sample: app/tours/page.tsx, app/tours/[slug]/page.tsx, components/HomePage.tsx, components/sections/HomeFeaturedTours.tsx, components/sections/PopularTourPackages.tsx

### lib/userPosts.ts
- Role: Shared infrastructure/client utilities (Prisma, auth, API clients, payments, mail, helpers)
- Main exports/functions: UserPost, userPosts
- Key dependencies: None detected
- Used by (high-level): 1 imports; top areas: app(1); sample: app/posts/page.tsx

### lib/utils.ts
- Role: Shared infrastructure/client utilities (Prisma, auth, API clients, payments, mail, helpers)
- Main exports/functions: cn
- Key dependencies: external: clsx, tailwind-merge
- Used by (high-level): 11 imports; top areas: components(11); sample: components/ui/Alert.tsx, components/ui/avatar.tsx, components/ui/badge.tsx, components/ui/Button.tsx, components/ui/Card.tsx

## contexts

### contexts/AuthContext.tsx
- Role: React context provider/hook for shared client state
- Main exports/functions: AuthRole, AuthUser, AuthProvider, useAuth
- Key dependencies: internal: lib/axios.ts | external: react, next-auth/react
- Used by (high-level): 19 imports; top areas: app(15), components(4); sample: app/admin/analytics/page.tsx, app/admin/bookings/page.tsx, app/admin/hosts/page.tsx, app/admin/layout.tsx, app/admin/page.tsx

### contexts/WishlistContext.tsx
- Role: React context provider/hook for shared client state
- Main exports/functions: WishlistItem, WishlistProvider, useWishlist
- Key dependencies: external: react
- Used by (high-level): 9 imports; top areas: components(5), app(4); sample: app/hotels/page.tsx, app/hotels/[slug]/page.tsx, app/layout.tsx, app/wishlist/page.tsx, components/hotel/HotelCard.tsx

## validators

### validators/admin.validators.ts
- Role: Schema and payload validation helpers for routes/controllers
- Main exports/functions: parseListingUpdate, parseKycDecision, parsePayoutUpdate, parseAccountUpdate, parseBookingUpdate
- Key dependencies: None detected
- Used by (high-level): 1 imports; top areas: controllers(1); sample: controllers/admin.controller.ts

### validators/booking.validators.ts
- Role: Schema and payload validation helpers for routes/controllers
- Main exports/functions: CreateHotelBookingInput, parseCreateHotelBooking
- Key dependencies: internal: services/availability.service.ts
- Used by (high-level): 2 imports; top areas: controllers(1), services(1); sample: controllers/booking.controller.ts, services/booking.service.ts

## components

### components/AIChatWidget.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: AIChatWidget, default
- Key dependencies: internal: types/ai-chat.ts | external: react, next/link, axios
- Used by (high-level): 1 imports; top areas: app(1); sample: app/page.tsx

### components/auth/HostSignupForm.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: HostSignupForm, default
- Key dependencies: internal: components/ui/Alert.tsx, components/ui/Checkbox.tsx, components/ui/SocialAuthButton.tsx, contexts/AuthContext.tsx | external: next/link, next/navigation, react, lucide-react, next-auth/react
- Used by (high-level): 1 imports; top areas: app(1); sample: app/host/signup/page.tsx

### components/auth/LoginForm.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: LoginForm, default
- Key dependencies: internal: components/ui/Alert.tsx, components/ui/Input.tsx, components/ui/Button.tsx, components/ui/Checkbox.tsx, components/ui/FormLabel.tsx, components/ui/SocialAuthButton.tsx | external: react, next/navigation, next/link, next-auth/react
- Used by (high-level): 1 imports; top areas: app(1); sample: app/login/page.tsx

### components/auth/SignupForm.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: SignupForm, default
- Key dependencies: internal: components/ui/Input.tsx, components/ui/Button.tsx, components/ui/Checkbox.tsx, components/ui/FormLabel.tsx, components/ui/SocialAuthButton.tsx, components/ui/Alert.tsx | external: react, next/navigation, next/link, next-auth/react
- Used by (high-level): 1 imports; top areas: app(1); sample: app/signup/page.tsx

### components/home/HeroSlider.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: HeroSlider, default
- Key dependencies: internal: components/ui/badge.tsx, components/home/home-types.ts | external: next/link, lucide-react, framer-motion, swiper/modules, swiper/react, swiper/css
- Used by (high-level): No direct imports detected (entrypoint/dynamic/unused)

### components/home/home-types.ts
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: HomeHotel, HomeDestination
- Key dependencies: None detected
- Used by (high-level): 1 imports; top areas: components(1); sample: components/home/HeroSlider.tsx

### components/home/SearchCard.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: SearchCard, default
- Key dependencies: internal: components/ui/Button.tsx, components/search/LocationInput.tsx, components/search/DatePicker.tsx, types/search.ts | external: react, next/navigation, lucide-react, framer-motion
- Used by (high-level): No direct imports detected (entrypoint/dynamic/unused)

### components/HomePage.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: HomePage, default
- Key dependencies: internal: lib/homeData.ts, lib/tours.ts | external: next/link, next/image
- Used by (high-level): No direct imports detected (entrypoint/dynamic/unused)

### components/host/HostUI.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: HostPage, HostSection, HostStatCard, HostEmptyState, HostPill
- Key dependencies: external: react, clsx, tailwind-merge
- Used by (high-level): 5 imports; top areas: app(5); sample: app/host/analytics/page.tsx, app/host/bookings/page.tsx, app/host/page.tsx, app/host/payments/page.tsx, app/host/reviews/page.tsx

### components/hotel/HotelCard.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: default
- Key dependencies: internal: contexts/WishlistContext.tsx | external: react, lucide-react
- Used by (high-level): 1 imports; top areas: components(1); sample: components/hotel/HotelList.tsx

### components/hotel/HotelFilters.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: FilterOptions, HotelFilters
- Key dependencies: external: react, lucide-react
- Used by (high-level): 1 imports; top areas: app(1); sample: app/hotels/page.tsx

### components/hotel/HotelGallery.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: default
- Key dependencies: internal: types/hotel-components.ts | external: react
- Used by (high-level): 1 imports; top areas: app(1); sample: app/hotels/[slug]/page.tsx

### components/hotel/HotelList.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: default
- Key dependencies: internal: components/hotel/HotelCard.tsx, lib/hotels.ts | external: next/link
- Used by (high-level): 1 imports; top areas: components(1); sample: components/sections/PopularHotels.tsx

### components/hotel/HotelReviews.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: default
- Key dependencies: internal: lib/hotels.ts, types/hotel-components.ts | external: react
- Used by (high-level): 1 imports; top areas: app(1); sample: app/hotels/[slug]/page.tsx

### components/hotel/HotelSearchBar.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: HotelSearchBar
- Key dependencies: external: react
- Used by (high-level): No direct imports detected (entrypoint/dynamic/unused)

### components/hotel/HotelSlider.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: HotelSlider, default
- Key dependencies: internal: types/hotel-components.ts, lib/axios.ts | external: next/link, react, next/navigation, lucide-react
- Used by (high-level): 1 imports; top areas: app(1); sample: app/page.tsx

### components/hotel/MapModal.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: MapModal, default
- Key dependencies: internal: types/map.ts
- Used by (high-level): 1 imports; top areas: components(1); sample: components/hotel/MapSection.tsx

### components/hotel/MapPreview.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: MapPreview, default
- Key dependencies: internal: types/map.ts | external: react
- Used by (high-level): 1 imports; top areas: components(1); sample: components/hotel/MapSection.tsx

### components/hotel/MapSection.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: MapSection, default
- Key dependencies: internal: components/hotel/MapPreview.tsx, components/hotel/MapModal.tsx, types/map.ts | external: react
- Used by (high-level): 1 imports; top areas: app(1); sample: app/hotels/[slug]/page.tsx

### components/layout/Footer/Footer.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: default
- Key dependencies: internal: components/layout/Footer/FooterLinks.tsx, components/layout/Footer/Subscribe.tsx
- Used by (high-level): 12 imports; top areas: app(12); sample: app/activities/page.tsx, app/activities/[slug]/page.tsx, app/hotels/page.tsx, app/hotels/[slug]/page.tsx, app/my-bookings/page.tsx

### components/layout/Footer/FooterLinks.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: FooterLinks, default
- Key dependencies: internal: types/layout.ts
- Used by (high-level): 1 imports; top areas: components(1); sample: components/layout/Footer/Footer.tsx

### components/layout/Footer/Subscribe.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: Subscribe, default
- Key dependencies: None detected
- Used by (high-level): 1 imports; top areas: components(1); sample: components/layout/Footer/Footer.tsx

### components/layout/Header/Header.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: default
- Key dependencies: internal: components/search/LocationDetector.tsx, contexts/WishlistContext.tsx, contexts/AuthContext.tsx | external: react, next/link, next/navigation, lucide-react
- Used by (high-level): 12 imports; top areas: app(12); sample: app/activities/page.tsx, app/activities/[slug]/page.tsx, app/hotels/page.tsx, app/hotels/[slug]/page.tsx, app/my-bookings/page.tsx

### components/layout/Header/Logo.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: Logo, default
- Key dependencies: external: next/link
- Used by (high-level): No direct imports detected (entrypoint/dynamic/unused)

### components/layout/Header/NavLinks.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: default
- Key dependencies: external: next/link
- Used by (high-level): No direct imports detected (entrypoint/dynamic/unused)

### components/layout/Header/UserMenu.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: UserMenu, default
- Key dependencies: None detected
- Used by (high-level): No direct imports detected (entrypoint/dynamic/unused)

### components/PlanHoliday.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: PlanHoliday, default
- Key dependencies: None detected
- Used by (high-level): No direct imports detected (entrypoint/dynamic/unused)

### components/search/DatePicker.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: DatePicker, default
- Key dependencies: internal: types/search.ts
- Used by (high-level): 2 imports; top areas: components(2); sample: components/home/SearchCard.tsx, components/search/SearchBar.tsx

### components/search/LocationDetector.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: LocationDetector, default
- Key dependencies: internal: lib/axios.ts, types/search.ts | external: lucide-react, react
- Used by (high-level): 1 imports; top areas: components(1); sample: components/layout/Header/Header.tsx

### components/search/LocationInput.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: LocationInput, default
- Key dependencies: internal: components/ui/Input.tsx, types/search.ts
- Used by (high-level): 2 imports; top areas: components(2); sample: components/home/SearchCard.tsx, components/search/SearchBar.tsx

### components/search/SearchBar.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: default
- Key dependencies: internal: components/search/LocationInput.tsx, components/search/DatePicker.tsx, types/search.ts | external: react, next/navigation, lucide-react
- Used by (high-level): 2 imports; top areas: app(2); sample: app/hotels/page.tsx, app/page.tsx

### components/sections/BlogSection.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: BlogSection, default
- Key dependencies: None detected
- Used by (high-level): No direct imports detected (entrypoint/dynamic/unused)

### components/sections/BrandsSection.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: BrandsSection, default
- Key dependencies: None detected
- Used by (high-level): No direct imports detected (entrypoint/dynamic/unused)

### components/sections/CityFactsCarousel.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: CityFactsCarousel, default
- Key dependencies: internal: types/sections.ts | external: react, lucide-react
- Used by (high-level): 1 imports; top areas: app(1); sample: app/page.tsx

### components/sections/HeroSection.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: HeroSection, default
- Key dependencies: None detected
- Used by (high-level): No direct imports detected (entrypoint/dynamic/unused)

### components/sections/HomeFeaturedHotels.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: HomeFeaturedHotels, default
- Key dependencies: internal: components/ui/skeleton.tsx, contexts/WishlistContext.tsx, lib/hotels.ts, types/hotel-components.ts, types/sections.ts | external: react, next/image, next/link, lucide-react, axios
- Used by (high-level): 1 imports; top areas: app(1); sample: app/page.tsx

### components/sections/HomeFeaturedTours.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: HomeFeaturedTours, default
- Key dependencies: internal: components/ui/Card.tsx, components/ui/Button.tsx, contexts/WishlistContext.tsx, lib/tours.ts, types/sections.ts | external: react, next/image, next/link, lucide-react
- Used by (high-level): 1 imports; top areas: app(1); sample: app/page.tsx

### components/sections/LocationStories.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: LocationStories, default
- Key dependencies: external: react
- Used by (high-level): No direct imports detected (entrypoint/dynamic/unused)

### components/sections/NewsletterSection.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: NewsletterSection, default
- Key dependencies: external: react
- Used by (high-level): No direct imports detected (entrypoint/dynamic/unused)

### components/sections/PopularDestinations.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: default
- Key dependencies: external: next/link
- Used by (high-level): No direct imports detected (entrypoint/dynamic/unused)

### components/sections/PopularHotels.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: default
- Key dependencies: internal: components/hotel/HotelList.tsx
- Used by (high-level): No direct imports detected (entrypoint/dynamic/unused)

### components/sections/PopularTourPackages.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: default
- Key dependencies: internal: lib/tours.ts | external: react, next/image, next/link
- Used by (high-level): No direct imports detected (entrypoint/dynamic/unused)

### components/sections/StatsSection.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: StatsSection, default
- Key dependencies: external: react
- Used by (high-level): No direct imports detected (entrypoint/dynamic/unused)

### components/sections/TestimonialsSection.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: TestimonialsSection, default
- Key dependencies: external: react
- Used by (high-level): No direct imports detected (entrypoint/dynamic/unused)

### components/sections/TourPackages.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: default
- Key dependencies: internal: lib/tours.ts | external: react, next/link
- Used by (high-level): No direct imports detected (entrypoint/dynamic/unused)

### components/sections/WhyChooseUs.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: WhyChooseUs, default
- Key dependencies: None detected
- Used by (high-level): No direct imports detected (entrypoint/dynamic/unused)

### components/sections/WorldTour.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: WorldTour, default
- Key dependencies: None detected
- Used by (high-level): No direct imports detected (entrypoint/dynamic/unused)

### components/tour/BudgetPlanner.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: BudgetBreakdown, BudgetPlanner
- Key dependencies: external: react
- Used by (high-level): No direct imports detected (entrypoint/dynamic/unused)

### components/tour/GroupBooking.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: GroupBooking
- Key dependencies: internal: contexts/AuthContext.tsx, lib/tours.ts, lib/axios.ts | external: next/link, react, lucide-react
- Used by (high-level): 1 imports; top areas: app(1); sample: app/tours/[slug]/page.tsx

### components/tour/ItineraryCard.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: ItineraryCard
- Key dependencies: internal: lib/tours.ts | external: react
- Used by (high-level): No direct imports detected (entrypoint/dynamic/unused)

### components/tour/NearbyHotels.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: NearbyHotels
- Key dependencies: internal: lib/hotels.ts | external: next/image
- Used by (high-level): No direct imports detected (entrypoint/dynamic/unused)

### components/tour/TourCard.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: TourCard
- Key dependencies: internal: lib/tours.ts, contexts/WishlistContext.tsx | external: next/image, next/link, react, lucide-react
- Used by (high-level): 2 imports; top areas: app(2); sample: app/tours/page.tsx, app/tours/[slug]/page.tsx

### components/tour/TourPlanning.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: TourPlanning
- Key dependencies: internal: lib/tours.ts | external: react
- Used by (high-level): No direct imports detected (entrypoint/dynamic/unused)

### components/ui/Alert.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: default
- Key dependencies: internal: lib/utils.ts | external: react, class-variance-authority
- Used by (high-level): 3 imports; top areas: components(3); sample: components/auth/HostSignupForm.tsx, components/auth/LoginForm.tsx, components/auth/SignupForm.tsx

### components/ui/avatar.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: No named export detected
- Key dependencies: internal: lib/utils.ts | external: react, @radix-ui/react-avatar
- Used by (high-level): No direct imports detected (entrypoint/dynamic/unused)

### components/ui/BackLink.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: BackLink, default
- Key dependencies: external: next/link
- Used by (high-level): 1 imports; top areas: app(1); sample: app/admin/kyc/page.tsx

### components/ui/badge.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: No named export detected
- Key dependencies: internal: lib/utils.ts | external: react
- Used by (high-level): 1 imports; top areas: components(1); sample: components/home/HeroSlider.tsx

### components/ui/Button.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: default
- Key dependencies: internal: lib/utils.ts | external: react, class-variance-authority, radix-ui
- Used by (high-level): 8 imports; top areas: components(5), app(3); sample: app/forgot-password/page.tsx, app/my-bookings/page.tsx, app/profile/page.tsx, components/auth/LoginForm.tsx, components/auth/SignupForm.tsx

### components/ui/Card.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: No named export detected
- Key dependencies: internal: lib/utils.ts | external: react
- Used by (high-level): 3 imports; top areas: app(2), components(1); sample: app/my-bookings/page.tsx, app/profile/page.tsx, components/sections/HomeFeaturedTours.tsx

### components/ui/Checkbox.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: default
- Key dependencies: internal: lib/utils.ts | external: react, radix-ui, lucide-react
- Used by (high-level): 3 imports; top areas: components(3); sample: components/auth/HostSignupForm.tsx, components/auth/LoginForm.tsx, components/auth/SignupForm.tsx

### components/ui/dialog.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: No named export detected
- Key dependencies: internal: lib/utils.ts, components/ui/Button.tsx | external: react, radix-ui, lucide-react
- Used by (high-level): No direct imports detected (entrypoint/dynamic/unused)

### components/ui/EmptyState.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: EmptyState, default
- Key dependencies: external: next/link
- Used by (high-level): No direct imports detected (entrypoint/dynamic/unused)

### components/ui/FilterTabs.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: FilterTabs, default
- Key dependencies: None detected
- Used by (high-level): 6 imports; top areas: app(6); sample: app/admin/bookings/page.tsx, app/admin/hosts/page.tsx, app/admin/kyc/page.tsx, app/admin/listings/page.tsx, app/admin/payouts/page.tsx

### components/ui/FormLabel.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: FormLabel, default
- Key dependencies: external: react
- Used by (high-level): 3 imports; top areas: components(2), app(1); sample: app/forgot-password/page.tsx, components/auth/LoginForm.tsx, components/auth/SignupForm.tsx

### components/ui/Input.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: default
- Key dependencies: internal: lib/utils.ts | external: react
- Used by (high-level): 7 imports; top areas: app(4), components(3); sample: app/admin/hosts/page.tsx, app/admin/listings/page.tsx, app/admin/posts/page.tsx, app/forgot-password/page.tsx, components/auth/LoginForm.tsx

### components/ui/loading-skeletons.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: AppShellSkeleton, AdminDashboardSkeleton, HostDashboardSkeleton, TablePageSkeleton
- Key dependencies: internal: components/ui/skeleton.tsx
- Used by (high-level): 11 imports; top areas: app(11); sample: app/admin/bookings/page.tsx, app/admin/hosts/page.tsx, app/admin/kyc/page.tsx, app/admin/layout.tsx, app/admin/listings/page.tsx

### components/ui/Modal.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: Modal, default
- Key dependencies: internal: types/ui.ts | external: react, lucide-react
- Used by (high-level): 5 imports; top areas: app(5); sample: app/admin/bookings/page.tsx, app/admin/kyc/page.tsx, app/admin/listings/page.tsx, app/admin/payouts/page.tsx, app/admin/tours/page.tsx

### components/ui/PhotoUploader.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: PhotoUploader, default
- Key dependencies: internal: types/ui.ts | external: react, lucide-react, axios
- Used by (high-level): 2 imports; top areas: app(2); sample: app/host/hotels/[id]/page.tsx, app/host/tours/[id]/page.tsx

### components/ui/SectionCard.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: SectionCard, default
- Key dependencies: internal: types/ui.ts
- Used by (high-level): 1 imports; top areas: app(1); sample: app/profile/page.tsx

### components/ui/separator.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: No named export detected
- Key dependencies: internal: lib/utils.ts | external: react, @radix-ui/react-separator
- Used by (high-level): No direct imports detected (entrypoint/dynamic/unused)

### components/ui/sheet.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: No named export detected
- Key dependencies: internal: lib/utils.ts | external: react, @radix-ui/react-dialog, lucide-react
- Used by (high-level): No direct imports detected (entrypoint/dynamic/unused)

### components/ui/skeleton.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: No named export detected
- Key dependencies: internal: lib/utils.ts
- Used by (high-level): 3 imports; top areas: components(3); sample: components/sections/HomeFeaturedHotels.tsx, components/ui/loading-skeletons.tsx, components/ui/Spinner.tsx

### components/ui/SocialAuthButton.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: SocialAuthButton, default
- Key dependencies: external: react
- Used by (high-level): 3 imports; top areas: components(3); sample: components/auth/HostSignupForm.tsx, components/auth/LoginForm.tsx, components/auth/SignupForm.tsx

### components/ui/Spinner.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: Spinner, default
- Key dependencies: internal: components/ui/skeleton.tsx
- Used by (high-level): 9 imports; top areas: app(9); sample: app/admin/bookings/page.tsx, app/admin/hosts/page.tsx, app/admin/kyc/page.tsx, app/admin/payouts/page.tsx, app/admin/users/page.tsx

### components/ui/StatCard.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: StatCard, default
- Key dependencies: external: react, next/link, lucide-react
- Used by (high-level): 4 imports; top areas: app(4); sample: app/admin/hosts/page.tsx, app/admin/page.tsx, app/admin/payouts/page.tsx, app/admin/users/page.tsx

### components/ui/StatusBadge.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: StatusBadge, default
- Key dependencies: None detected
- Used by (high-level): 11 imports; top areas: app(11); sample: app/admin/bookings/page.tsx, app/admin/hosts/page.tsx, app/admin/kyc/page.tsx, app/admin/listings/page.tsx, app/admin/page.tsx

### components/ui/ToggleSwitch.tsx
- Role: Reusable UI building block (page section, domain UI, or primitive component)
- Main exports/functions: ToggleSwitch, default
- Key dependencies: internal: types/ui.ts
- Used by (high-level): 1 imports; top areas: app(1); sample: app/profile/page.tsx

