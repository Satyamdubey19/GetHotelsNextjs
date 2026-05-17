# UI Components Library

**Framework:** React 19 + TypeScript  
**Styling:** Tailwind CSS + shadcn/ui  
**Icons:** Lucide React

---

## 🎨 Component Categories

### Layout Components

#### Header

**Location:** [components/layout/Header/Header.tsx](../../components/layout/Header/Header.tsx)

```typescript
// Desktop: Logo | Search | Nav Links | User Menu
// Mobile: Logo | Menu Button | User Menu

Features:
- Responsive layout (desktop/mobile)
- Search bar with autocomplete
- User dropdown menu
- Authentication status
- Wishlist icon with count
- Sticky on scroll

Usage:
<Header />
```

#### Footer

**Location:** [components/layout/Footer/Footer.tsx](../../components/layout/Footer/Footer.tsx)

```typescript
Features:
- Company info
- Links by section (Hotels, Tours, Activities)
- Newsletter signup
- Social media links
- Payment methods icons
- Copyright

Usage:
<Footer />
```

#### Mobile Bottom Navigation

**Location:** [components/home/MobileBottomNav.tsx](../../components/home/MobileBottomNav.tsx)

```typescript
Routes:
- Explore (Home)
- Tours
- Activities
- Trips (My Bookings)
- Host

Features:
- 5 main routes
- Icon + Label
- Active state highlighting
- Mobile only (< 640px)

Usage:
<MobileBottomNav />
```

#### Sidebar

**Location:** [components/layout/Sidebar/](../../components/layout/Sidebar/)

```typescript
Features:
- Filter options
- Search
- Collapsible on mobile
- Sticky position

Usage:
<HotelFilters />
<TourFilters />
```

---

### Navigation Components

#### Navigation Tabs

```typescript
Features:
- Horizontal scroll on mobile
- Active tab highlighting
- Icon + Label support
- Disable option

Props:
- tabs: {id, label, icon}[]
- activeTab: string
- onChange: (id) => void

Usage:
<Tabs tabs={categories} activeTab={selected} onChange={setSelected} />
```

#### Breadcrumb

```typescript
Props:
- items: {label, href}[]

Usage:
<Breadcrumb items={[
  {label: "Home", href: "/"},
  {label: "Hotels", href: "/hotels"},
  {label: "Bali"}
]} />
```

---

### Card Components

#### HotelCard

```typescript
Props:
- hotel: Hotel
- viewMode: 'grid' | 'list'
- onWishlistToggle: (id) => void
- isWishlisted: boolean

Features:
- Image carousel
- Star rating
- Amenities icons
- Price display
- Wishlist button
- Quick book button

Usage:
<HotelCard hotel={hotel} viewMode="grid" />
```

#### TourCard

```typescript
Props:
- tour: Tour
- onWishlistToggle: (id) => void

Features:
- Tour image
- Duration badge
- Category tag
- Participants count
- Price per person
- Wishlist toggle
- Rating display

Usage:
<TourCard tour={tour} />
```

#### ActivityCard

```typescript
Props:
- activity: Activity
- onWishlistToggle: (id) => void

Features:
- Activity image
- Duration
- Difficulty badge
- Location
- Price
- Available slots
- Wishlist button

Usage:
<ActivityCard activity={activity} />
```

---

### Form Components

#### SearchBar

```typescript
Props:
- onSearch: (query) => void
- placeholder: string
- suggestions: string[]
- onSuggestionSelect: (suggestion) => void

Features:
- Text input
- Autocomplete suggestions
- Clear button
- Search icon
- Recent searches

Usage:
<SearchBar onSearch={handleSearch} />
```

#### DatePicker

```typescript
Features:
- Calendar view
- Date range selection
- Disabled dates
- Month/year navigation
- Mobile calendar

Props:
- value: Date
- onChange: (date) => void
- disabledDates: Date[]

Usage:
<DatePicker value={checkIn} onChange={setCheckIn} />
```

#### GuestSelector

```typescript
Features:
- Adults/children select
- Increment/decrement buttons
- Age picker
- Room quantity

Props:
- adults: number
- children: number
- onAdultsChange: (n) => void
- onChildrenChange: (n) => void

Usage:
<GuestSelector adults={2} children={1} onAdultsChange={setAdults} />
```

#### RoomSelector

```typescript
Features:
- Room type list
- Quantity selector
- Price display
- Availability

Props:
- rooms: Room[]
- onSelect: (roomId, quantity) => void

Usage:
<RoomSelector rooms={rooms} onSelect={handleSelect} />
```

#### MultiSelect

```typescript
Features:
- Multiple checkbox selection
- Search filter
- Expand/collapse
- Clear all button

Props:
- options: {id, label}[]
- selected: string[]
- onChange: (selected) => void

Usage:
<MultiSelect options={amenities} selected={selected} onChange={setSelected} />
```

---

### Display Components

#### RatingStars

```typescript
Props:
- rating: number (0-5)
- reviewCount: number
- size: 'sm' | 'md' | 'lg'

Features:
- Star display
- Review count
- Interactive (editable version)

Usage:
<RatingStars rating={4.5} reviewCount={234} />
```

#### Badge

```typescript
Props:
- label: string
- variant: 'primary' | 'secondary' | 'success' | 'warning'
- icon?: React.ReactNode

Usage:
<Badge label="Featured" variant="primary" />
<Badge label="Available" variant="success" />
```

#### PricingBreakdown

```typescript
Props:
- subtotal: number
- taxes: number
- discount?: number
- total: number
- currency: string

Features:
- Item-wise breakdown
- Tax calculation
- Discount display
- Total highlight

Usage:
<PricingBreakdown subtotal={6000} taxes={1080} total={6880} />
```

#### Carousel

```typescript
Features:
- Image slides
- Previous/next buttons
- Dots navigation
- Auto-play option
- Touch swipe support

Props:
- images: string[]
- autoPlay: boolean
- interval: number

Usage:
<Carousel images={hotelImages} autoPlay={true} />
```

---

### Modal Components

#### Modal

```typescript
Props:
- isOpen: boolean
- onClose: () => void
- title?: string
- children: React.ReactNode
- size: 'sm' | 'md' | 'lg'

Features:
- Backdrop click close
- Scroll lock
- Close button
- Responsive sizing

Usage:
<Modal isOpen={open} onClose={closeModal} title="Book Room">
  <BookingForm />
</Modal>
```

#### ConfirmationDialog

```typescript
Props:
- isOpen: boolean
- title: string
- message: string
- onConfirm: () => void
- onCancel: () => void
- confirmText: string
- cancelText: string

Usage:
<ConfirmationDialog
  isOpen={showConfirm}
  title="Cancel Booking?"
  message="This action cannot be undone."
  onConfirm={handleCancel}
/>
```

#### Toast

```typescript
Features:
- Success/error/warning messages
- Auto-dismiss
- Position control
- Action buttons

Usage:
toast.success("Booking confirmed!")
toast.error("Payment failed")
toast.loading("Processing...")
```

---

### Button Components

#### Button

```typescript
Props:
- variant: 'primary' | 'secondary' | 'outline' | 'ghost'
- size: 'sm' | 'md' | 'lg'
- disabled: boolean
- loading: boolean
- icon?: React.ReactNode
- onClick: () => void
- children: string

Usage:
<Button variant="primary" size="lg" onClick={handleClick}>
  Book Now
</Button>
```

#### IconButton

```typescript
Props:
- icon: React.ReactNode
- size: 'sm' | 'md' | 'lg'
- variant: 'primary' | 'secondary'
- onClick: () => void
- tooltip?: string

Usage:
<IconButton icon={<Heart />} onClick={toggleWishlist} tooltip="Add to wishlist" />
```

#### ButtonGroup

```typescript
Features:
- Multiple related buttons
- Active state
- Exclusive/multi-select

Props:
- buttons: {label, id}[]
- active: string | string[]
- onChange: (id) => void

Usage:
<ButtonGroup buttons={sortOptions} active={sort} onChange={setSort} />
```

---

### Input Components

#### TextInput

```typescript
Props:
- label: string
- placeholder: string
- value: string
- onChange: (value) => void
- error?: string
- required: boolean

Usage:
<TextInput
  label="Full Name"
  placeholder="John Doe"
  value={name}
  onChange={setName}
/>
```

#### TextArea

```typescript
Props:
- label: string
- placeholder: string
- rows: number
- value: string
- onChange: (value) => void
- maxLength?: number

Usage:
<TextArea label="Special Requests" rows={4} />
```

#### PhoneInput

```typescript
Features:
- Country code selector
- Format validation
- +91 prefix for India

Props:
- value: string
- onChange: (value) => void
- country: string

Usage:
<PhoneInput value={phone} onChange={setPhone} country="IN" />
```

#### Checkbox

```typescript
Props:
- label: string
- checked: boolean
- onChange: (checked) => void

Usage:
<Checkbox label="Accept terms" checked={agree} onChange={setAgree} />
```

#### Radio Group

```typescript
Props:
- options: {label, value}[]
- value: string
- onChange: (value) => void

Usage:
<RadioGroup
  options={[
    {label: "Easy", value: "EASY"},
    {label: "Moderate", value: "MODERATE"}
  ]}
  value={difficulty}
  onChange={setDifficulty}
/>
```

---

### Page Sections

#### Hero Section

```typescript
Features:
- Full-width background
- Headline + CTA
- Search bar overlay
- Mobile responsive

Usage:
<HeroSection
  title="Find Your Perfect Stay"
  subtitle="Explore hotels, tours, and activities"
  backgroundImage="/hero.jpg"
/>
```

#### Featured Section

```typescript
Features:
- Title + "View All" link
- Card grid (responsive)
- Horizontal scroll (mobile)

Usage:
<FeaturedSection
  title="Featured Hotels"
  items={hotels}
  renderItem={(hotel) => <HotelCard hotel={hotel} />}
/>
```

#### CTASection

```typescript
Features:
- Full-width banner
- Headline + description
- Primary + secondary CTA
- Background image/gradient

Usage:
<CTASection
  title="Become a Host"
  description="Start earning by listing your property"
  primaryCta={{label: "Get Started", onClick: handleStart}}
/>
```

---

### Utility Components

#### Loading Skeleton

```typescript
Features:
- Animated loading state
- Custom shapes (card, line, circle)
- Responsive sizing

Props:
- count: number
- type: 'card' | 'text' | 'circle'

Usage:
<LoadingSkeleton type="card" count={6} />
```

#### EmptyState

```typescript
Props:
- icon: React.ReactNode
- title: string
- description: string
- action?: {label: string, onClick: () => void}

Usage:
<EmptyState
  icon={<BookOpen />}
  title="No bookings yet"
  description="Explore and book your first experience"
  action={{label: "Browse Hotels", onClick: () => navigate("/hotels")}}
/>
```

#### Pagination

```typescript
Props:
- currentPage: number
- totalPages: number
- onPageChange: (page) => void

Usage:
<Pagination currentPage={page} totalPages={10} onPageChange={setPage} />
```

---

## 📏 Responsive Behavior

### Breakpoints

```
Mobile:   < 640px    (sm)
Tablet:   640-1024px (md, lg)
Desktop:  > 1024px   (xl, 2xl)
```

### Mobile Adjustments

- Single column layouts
- Full-width modals
- Bottom sheet drawers
- Touch-friendly (44px minimum)
- Swipe gestures

---

## 🎯 Usage Examples

### Hotel Listing Page

```typescript
<Header />
<HotelFilters onChange={setFilters} />
<div className="grid grid-cols-3">
  {hotels.map(hotel => (
    <HotelCard key={hotel.id} hotel={hotel} />
  ))}
</div>
<Pagination />
<Footer />
```

### Booking Flow

```typescript
<Modal isOpen={showBooking} onClose={closeModal}>
  <DatePicker value={checkIn} onChange={setCheckIn} />
  <DatePicker value={checkOut} onChange={setCheckOut} />
  <GuestSelector />
  <RoomSelector />
  <PricingBreakdown />
  <Button variant="primary">Proceed to Payment</Button>
</Modal>
```

---

## 🎨 Theme Customization

### Colors

```typescript
Primary:   #3B82F6 (Blue)
Secondary: #6B7280 (Gray)
Success:   #10B981 (Green)
Warning:   #F59E0B (Amber)
Danger:    #EF4444 (Red)
```

### Typography

```typescript
Heading 1: 32px, Bold
Heading 2: 24px, Bold
Heading 3: 20px, Bold
Body:      16px, Regular
Small:     14px, Regular
```

---

## ✅ Component Checklist

- [ ] All components have TypeScript types
- [ ] Props are documented
- [ ] Responsive behavior verified
- [ ] Accessibility (ARIA labels)
- [ ] Mobile touch-friendly
- [ ] Loading states
- [ ] Error states
- [ ] Empty states
- [ ] Consistent styling
- [ ] Dark mode compatible (future)

---

**Last Updated:** May 16, 2026  
**Framework:** React 19 + TypeScript  
**Styling:** Tailwind CSS + shadcn/ui  
**Icons:** Lucide React
