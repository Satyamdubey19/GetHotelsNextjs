# Home Page Documentation

**Route:** `/`  
**File:** [app/page.tsx](../../app/page.tsx)  
**Component:** [components/home/HomePage.tsx](../../components/home/HomePage.tsx)  
**Type:** Public page (accessible to all users)  
**Authentication:** Not required

---

## 📖 Overview

The Home Page is the main landing page of GetHotels platform. It serves as the entry point for visitors and provides access to all major modules: Hotels/Stays, Tours/Trips, Activities, and Contests. The page features hero section, destination showcase, featured listings, trust indicators, and promotional content.

---

## 🎨 UI Structure

### Header Section

```
┌─────────────────────────────────────────────────────────────┐
│                    Platform Header                          │
│  • Logo/Brand (GH)                                          │
│  • Navigation Links (Explore, Tours, Activities, etc.)      │
│  • Search Bar (sticky on scroll)                            │
│  • User Profile / Auth Buttons                              │
└─────────────────────────────────────────────────────────────┘
```

### Hero Section

- **Hero Banner**: Full-width background image/gradient
- **Hero Title**: Platform tagline/value proposition
- **CTA Buttons**: Primary action (Search Hotels, Explore Tours)
- **Search Component**: Quick access search bar with filters
  - Input fields for destination, dates, guests
  - Filter options (price range, rating, amenities)
  - Search button trigger

### Main Content Sections

#### 1. Featured Stays Section

- **Grid Display**: 4-6 featured hotel cards
- **Hotel Cards** contain:
  - Hotel image/carousel
  - Hotel name
  - Location (city, country)
  - Star rating & review count
  - Price per night (₹/night)
  - Key amenities (WiFi, Pool, Parking, etc.)
  - Wishlist heart button (click to add/remove)
  - Quick book button

- **Features**:
  - Horizontal scrollable on mobile
  - Click card → Detail page
  - Wishlist functionality integrated
  - Show "View All" link to listings

#### 2. Featured Tours Section

- **Similar structure** to stays section
- **Tour Cards** contain:
  - Tour image
  - Tour name & destination
  - Duration (e.g., "5 Days")
  - Group size
  - Starting price
  - Participant count / reviews
  - Wishlist button
  - Quick book button

#### 3. Featured Activities Section

- **Activity cards** with similar layout
- Shows: Title, location, difficulty level, price, availability slots

#### 4. Destination Cards Section

- **Grid of popular destinations** (usually 3-4 columns)
- Each card shows:
  - Destination image
  - Destination name
  - Number of properties available
  - Click → Filtered listings for that destination

#### 5. Trust & Statistics Section

```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│   10K+      │   50K+      │   4.8★      │   500+      │
│  Properties │   Bookings  │  Avg Rating │  Experiences│
└─────────────┴─────────────┴─────────────┴─────────────┘
```

#### 6. How It Works Section

- Step-by-step guide (Usually 4 steps)
- Example: Search → Select → Book → Enjoy

#### 7. Call-to-Action Sections

- **Become a Host CTA**: Encourage property owners to list
- **Promotional Banner**: Seasonal offers, referral programs
- **Community Posts CTA**: Highlight travel stories
- **Special Offers**: Featured discounts

#### 8. Footer

- Links to different modules
- Company info
- Social media links
- Legal links (Terms, Privacy)

---

## 🔧 Key Components

### Main Component

```typescript
// HomePage.tsx
export default function HomePage() {
  // State for featured data
  const [featuredStays, setFeaturedStays] = useState([])
  const [featuredTours, setFeaturedTours] = useState([])
  const [featuredActivities, setFeaturedActivities] = useState([])

  // Fetch featured data on mount
  useEffect(() => {
    // API calls
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* Hero Section */}
      {/* Featured Stays */}
      {/* Featured Tours */}
      {/* Featured Activities */}
      {/* Destinations */}
      {/* Trust Stats */}
      {/* How It Works */}
      {/* CTAs */}
      <Footer />
    </div>
  )
}
```

### Sub-Components

- **SearchBar** - Search input with filters
- **FeaturedCard** - Reusable card component
- **TourCard** - Tour-specific card
- **HotelCard** - Hotel-specific card
- **ActivityCard** - Activity-specific card
- **DestinationCard** - Destination showcase
- **StatCard** - Trust statistics display
- **CTASection** - Call-to-action blocks

---

## 📡 API Calls & Data Flow

### On Page Load

```
1. GET /api/hotels?featured=true&limit=6
   Response: Array of featured hotel objects

2. GET /api/tours?featured=true&limit=6
   Response: Array of featured tour objects

3. GET /api/activities?featured=true&limit=6
   Response: Array of featured activity objects

4. GET /api/hotels/destinations
   Response: Array of popular destinations
```

### Data Structure (Example)

```typescript
// Featured Hotel Response
{
  id: string
  slug: string
  name: string
  city: string
  country: string
  image: string
  images: string[]
  rating: number
  reviews: number
  pricePerNight: number
  amenities: string[]
  featured: boolean
}

// Featured Tour Response
{
  id: string
  slug: string
  title: string
  destination: string
  image: string
  duration: string  // "5 Days"
  groupSize: { min: number, max: number }
  price: number
  participants: number
  featured: boolean
}
```

---

## 🔐 User Interactions

### 1. Search

- User fills search form (destination, dates, guests)
- Click "Search" → Navigate to filtered listing page
- Destination search → `/hotels?destination=...`
- Tour search → `/tours?search=...`

### 2. View Details

- Click on any card → Navigate to detail page
- Hotel card → `/hotels/[slug]`
- Tour card → `/tours/[slug]`
- Activity card → `/activities/[slug]`

### 3. Add to Wishlist

- Click heart icon on card
- If not authenticated → Redirect to login
- If authenticated → Add/remove from wishlist
- WishlistContext updated
- Heart icon filled/unfilled

### 4. Quick Book

- Click "Quick Book" or "Book Now" button
- On hotel: Opens date picker and guest count selector
- On tour: Opens date selector and participant count
- Redirects to booking page with pre-filled data

### 5. Destination Filter

- Click destination card
- Navigate to listing page with destination filter applied
- Example: `/hotels?destination=bali`

### 6. Browse Categories

- Browse Tours by category (Adventure, Relaxation, Cultural)
- Browse Activities by type
- Click category → Filtered listings

---

## 🎯 Functionality Features

### Featured Listings Display

- **Dynamic loading**: Data fetched from API
- **Fallback data**: Pre-defined data if API fails
- **Carousel option**: Horizontal scroll on mobile
- **Responsive grid**: 1 column mobile, 2 tablets, 3-4 desktop

### Search Functionality

- **Location autocomplete**: Smart destination suggestions
- **Date picker**: Calendar for check-in/check-out
- **Guest counter**: Easy incrementor/decrementor
- **Advanced filters**: Price, amenities, rating, etc.

### Wishlist Integration

- **Real-time sync**: Updates WishlistContext
- **Visual feedback**: Heart animation
- **Persistence**: Saved to database (if logged in)
- **Quick access**: Wishlist page at `/wishlist`

### CTAs & Promotions

- **Become Host CTA**: Link to `/host` registration
- **Explore More Links**: "View All Stays", "View All Tours"
- **Seasonal Banners**: Promotional content rotation
- **Mobile CTA**: Full-width buttons on mobile

### Trust & Social Proof

- **Review count display**: Real reviews from bookings
- **Star ratings**: Average property ratings
- **Booking stats**: Total bookings on platform
- **User testimonials**: Optional review showcase

---

## 📱 Mobile Responsiveness

### Mobile Optimizations

- **Hero section**: Smaller image, adjusted text size
- **Featured cards**: Single column layout, full width
- **Sticky header**: Always visible search
- **Bottom navigation**: Mobile nav bar with 5 main routes
  - Explore (Home)
  - Tours
  - Activities
  - Trips (My Bookings)
  - Host
- **CTA buttons**: Full-width, stacked layout
- **Spacing**: Optimized padding and margins
- **Touch targets**: Minimum 44px height for buttons

### Responsive Breakpoints

- **Mobile**: < 640px (single column, full-width buttons)
- **Tablet**: 640px - 1024px (2-column cards)
- **Desktop**: > 1024px (3-4 column grid)

---

## 🎨 Styling & Design

### Color Scheme

- **Primary**: Blue accent (#3B82F6 or brand color)
- **Secondary**: Neutral grays
- **Success**: Green (#10B981)
- **Danger**: Red (#EF4444)
- **Background**: White (#FFFFFF) or light gray (#F9FAFB)

### Typography

- **Headings**: Large, bold serif or sans-serif
- **Body text**: Regular weight, good readability
- **Labels**: Smaller, medium weight

### Spacing

- **Large sections**: 60-100px vertical spacing
- **Card gaps**: 16-24px horizontal spacing
- **Padding**: 16-32px padding in containers
- **Mobile**: 12-16px spacing, reduced padding

### Hover & Interaction Effects

- **Card hover**: Subtle shadow increase
- **Button hover**: Color shift, slight lift effect
- **Link hover**: Underline or color change
- **Animations**: Smooth transitions (0.3s)

---

## ⚙️ Technology & Dependencies

### Key Libraries Used

- **React**: Component structure
- **Next.js**: Page routing, SSR
- **Axios**: API calls
- **Tailwind CSS**: Styling
- **Lucide Icons**: Icon library
- **React Context API**: WishlistContext
- **Framer Motion**: Optional animations

### State Management

- **React useState**: Local component state
- **React useEffect**: Data fetching
- **WishlistContext**: Global wishlist state
- **AuthContext**: User authentication state

---

## 🔄 Related Pages & Flows

### Navigation Flow

```
Home Page
├── → Featured Stay Card → Hotel Detail (/hotels/[slug])
├── → Featured Tour Card → Tour Detail (/tours/[slug])
├── → Featured Activity Card → Activity Detail (/activities/[slug])
├── → Search Form → Filtered Listings (/hotels?filters)
├── → Destination Card → Destination Filtered (/hotels?city=...)
├── → "View All" Link → Listings (/hotels, /tours, /activities)
├── → Wishlist Heart → Wishlist Page (/wishlist)
├── → "Become Host" → Host Dashboard (/host)
└── → User Menu → Login/Profile (/login, /profile)
```

---

## 🐛 Common Issues & Solutions

| Issue                     | Symptom                       | Solution                                        |
| ------------------------- | ----------------------------- | ----------------------------------------------- |
| Featured data not loading | Blank section                 | Check API endpoint, verify mock fallback data   |
| Cards not responsive      | Horizontal overflow on mobile | Verify Tailwind breakpoints, check grid classes |
| Wishlist not persisting   | Heart resets on reload        | Check API storage, verify authentication        |
| Search not working        | No filtered results           | Verify search API, check query parameters       |
| Images not loading        | Placeholder showing           | Check Cloudinary URL, verify image path         |
| CTA buttons misaligned    | Buttons overlapping           | Check responsive classes, verify padding/margin |

---

## ✅ Testing Checklist

- [ ] All API endpoints return expected data
- [ ] Featured cards display correctly on desktop/mobile
- [ ] Wishlist button adds/removes items
- [ ] Search form submits with correct parameters
- [ ] Navigation links work correctly
- [ ] Images load from Cloudinary
- [ ] Responsive design at all breakpoints
- [ ] Performance: Page loads in < 3 seconds
- [ ] Mobile touch targets are > 44px
- [ ] No console errors or warnings

---

**Last Updated:** May 16, 2026  
**Status:** Complete  
**Maintained By:** Development Team
