# Hotels & Stays Listing Page Documentation

**Route:** `/hotels`  
**File:** [app/hotels/page.tsx](../../app/hotels/page.tsx)  
**Type:** Public page (accessible to all users)  
**Authentication:** Not required (login required for booking)

---

## 📖 Overview

The Hotels Listing Page displays available accommodations with advanced filtering, sorting, and search capabilities. Users can browse properties, apply filters by price/amenities/rating, sort results, toggle view modes (grid/list), and navigate to detailed property information. This is a critical page for the booking flow.

---

## 🎨 UI Structure

### Header Section

```
┌─────────────────────────────────────────────────────────────┐
│                    Header Navigation                        │
│  • Logo (GH)                                                │
│  • Breadcrumb: Home > Hotels                                │
│  • Search Bar (sticky)                                      │
│  • Profile / Auth                                           │
└─────────────────────────────────────────────────────────────┘
```

### Main Layout (2 Column on Desktop)

```
┌──────────────┬──────────────────────────────────────────────┐
│              │                                              │
│   FILTERS    │           HOTEL LISTINGS                     │
│   SIDEBAR    │    ┌────────────┬────────────┐               │
│              │    │   Grid View │ List View  │               │
│ • Location   │    └────────────┴────────────┘               │
│ • Price      │    Sort: Relevance ▼                         │
│ • Rating     │    Showing 1-20 of 245 results               │
│ • Amenities  │                                              │
│ • Rooms      │    ┌────────────────────────────────────┐   │
│ • Check-in   │    │  [Hotel Card 1]  [Hotel Card 2]    │   │
│ • Check-out  │    │  [Hotel Card 3]  [Hotel Card 4]    │   │
│              │    │  [Hotel Card 5]  [Hotel Card 6]    │   │
│  [RESET]     │    └────────────────────────────────────┘   │
│              │    [Load More] or [Pagination]               │
└──────────────┴──────────────────────────────────────────────┘
```

### Filter Sidebar Components

#### 1. Search Bar (Top)

```
┌─────────────────────────────────┐
│ 📍 Destination (e.g., "Bali")   │
│ 📅 Check-in: May 20, 2026       │
│ 📅 Check-out: May 25, 2026      │
│ 👥 Guests: 2 Adults, 0 Children │
│ [SEARCH]                        │
└─────────────────────────────────┘
```

#### 2. Price Range Filter

```
₹0 ━━━●━━━━━━━━━━━━ ₹100,000
Min: ₹2,000  |  Max: ₹50,000
```

#### 3. Rating Filter

- Star rating checkboxes (5 stars, 4+ stars, 3+ stars, etc.)
- Show only rated properties option

#### 4. Property Type Filter

- Hotel, Resort, Villa, Apartment, Guesthouse
- Checkbox selection (multiple)

#### 5. Amenities Filter

- Checkboxes for: WiFi, Pool, Parking, Gym, Restaurant, Spa, etc.
- Organized in columns or expandable sections

#### 6. Room Type Filter

- Luxury, Standard, Budget, Dormitory
- With bed type sub-filters

#### 7. Distance from Center

- Slider: 0 - 50 km
- Show on map option

#### 8. Sort & View Options

```
┌──────────────────────────────┐
│ Sort By:                     │
│ ○ Relevance (default)        │
│ ○ Price: Low to High         │
│ ○ Price: High to Low         │
│ ○ Rating: High to Low        │
│ ○ Reviews: Most Recent       │
└──────────────────────────────┘

┌──────────────────────────────┐
│ View:                        │
│ [Grid] [List]                │
└──────────────────────────────┘
```

### Hotel Card (Grid View)

```
┌─────────────────────────────────────┐
│                                     │
│  [  Hotel Image Carousel    ]       │
│  ♡ (Wishlist button)                │
│  ⭐ 4.8 (234 reviews)                │
│                                     │
│  Hotel Name                         │
│  📍 City, State                      │
│                                     │
│  🏊 Pool 🅿️ Parking 📶 WiFi          │
│                                     │
│  ₹2,450 per night                   │
│  [Check Availability]               │
│                                     │
└─────────────────────────────────────┘
```

### Hotel Card (List View)

```
┌──────────────────────────────────────────────────────┐
│ [Image]  Hotel Name      ⭐ 4.8 (234)   ₹2,450/night│
│          📍 City, State                  [Book Now]  │
│          🏊 Pool 🅿️ Parking 📶 WiFi      ♡          │
│          Deluxe room with ocean view                 │
└──────────────────────────────────────────────────────┘
```

---

## 🔧 Key Components

### Main Component Structure

```typescript
'use client'

type SortOption = 'relevance' | 'price-low' | 'price-high' | 'rating'
type ViewMode = 'grid' | 'list'

interface FilterOptions {
  priceRange: [number, number]
  ratings: number[]
  amenities: string[]
  propertyType: string[]
  roomTypes: string[]
  distance: number
}

export default function StaysPage() {
  // State Management
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<FilterOptions>({})
  const [sortBy, setSortBy] = useState<SortOption>('relevance')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [page, setPage] = useState(1)

  // Search params
  const searchParams = useSearchParams()

  // Data fetching
  useEffect(() => {
    loadHotels()
  }, [filters, sortBy, page])

  // Render logic
  return (
    <>
      <Header />
      <div className="flex gap-6">
        <HotelFilters />
        <HotelListings />
      </div>
      <Footer />
    </>
  )
}
```

### Sub-Components

- **HotelFilters** - Left sidebar with all filter options
- **HotelListings** - Main content area with hotel cards
- **HotelCard** - Individual hotel card (grid or list)
- **PriceRangeSlider** - Price filter component
- **AmenityCheckbox** - Reusable filter checkbox
- **Pagination** - Page navigation
- **ViewToggle** - Grid/List view switcher
- **SortDropdown** - Sort options dropdown
- **LoadingSkeletons** - Skeleton loaders while fetching

---

## 📡 API Calls & Data Flow

### Primary API Endpoints

#### 1. List Hotels with Filters

```
GET /api/hotels?
  destination=bali&
  checkIn=2026-05-20&
  checkOut=2026-05-25&
  guests=2&
  minPrice=2000&
  maxPrice=50000&
  rating=4&
  amenities=wifi,pool&
  propertyType=hotel&
  sort=relevance&
  page=1&
  limit=20

Response:
{
  data: Hotel[],
  total: number,
  page: number,
  limit: number,
  pages: number
}
```

#### 2. Get Hotel Detail

```
GET /api/hotels/:id
Response: Hotel (with full details, rooms, images)
```

#### 3. Get Available Amenities

```
GET /api/hotels/amenities?location=bali
Response: { amenities: string[] }
```

#### 4. Search Autocomplete

```
GET /api/hotels/search/destinations?query=bal
Response: { suggestions: string[] }
```

### Hotel Data Model

```typescript
interface Hotel {
  id: string;
  slug: string;
  name: string;
  description?: string;
  city: string;
  state?: string;
  country: string;
  address: string;
  latitude: number;
  longitude: number;

  // Media
  imageUrl: string;
  images: string[];
  thumbnail: string;

  // Pricing & Availability
  pricePerNight: number;
  originalPrice?: number;
  currency: string;
  occupancy: { adults: number; children: number };

  // Ratings & Reviews
  averageRating: number;
  totalReviews: number;

  // Amenities & Features
  amenities: string[];
  propertyType: "Hotel" | "Resort" | "Villa" | "Apartment";
  rooms: RoomType[];

  // Status
  isActive: boolean;
  isApproved: boolean;
  featured?: boolean;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🔐 User Interactions

### 1. Initial Load & Search

```
User arrives → Apply initial filters from URL → Load results
- Example: /hotels?destination=delhi&checkIn=2026-05-20

Query params auto-populate filter sidebar
API call with these parameters
Results load with selected filters visible
```

### 2. Filter Application

```
User changes any filter:
→ Price slider changed
→ Amenity checkbox clicked
→ Rating selection changed
→ Property type selected

Action:
→ Update local state
→ Trigger API call with new filters
→ Show loading skeleton
→ Update results
→ Scroll to top
```

### 3. Sorting

```
User selects sort option:
○ Relevance
○ Price: Low to High
○ Price: High to Low
○ Rating: High to Low
○ Reviews: Most Recent

Action:
→ Update sortBy state
→ Trigger API call with sortBy param
→ Re-render results in new order
→ Reset to page 1
```

### 4. View Mode Toggle

```
User clicks Grid/List toggle:
→ Update viewMode state
→ Re-render same data in different layout
→ No API call needed
```

### 5. Card Interactions

```
Click Hotel Card:
→ Navigate to /hotels/[slug]
→ Load detail page

Click Wishlist Heart:
→ If not logged in → Redirect to login
→ If logged in → POST /api/wishlist/add
→ Update WishlistContext
→ Heart fills/unfills

Click "Check Availability":
→ Navigate to /hotels/[slug]
→ Scroll to booking section
```

### 6. Pagination

```
User clicks "Next Page" or page number:
→ Update page state
→ Trigger API call with new page param
→ Load new results
→ Scroll to top
→ Update pagination display
```

### 7. Advanced Filter Management

```
Click "More Filters":
→ Expand additional filter options

Click "Reset Filters":
→ Clear all filters to default
→ Reset URL params
→ Reload all hotels

Click "Save Search":
→ If logged in → Save filter combination
→ Add to saved searches
```

---

## 🎯 Key Features

### Filtering System

- **Multi-filter support**: Combine multiple filters simultaneously
- **Price range slider**: Dynamic min/max based on available properties
- **Amenity selection**: Multiple amenities can be selected
- **Property type filter**: Single or multiple property types
- **Rating filter**: Show only rated or high-rated properties
- **Date range**: Auto-populate from URL params

### Search & Discovery

- **Destination autocomplete**: Smart suggestions based on typing
- **Search history**: Show recent searches (if logged in)
- **Popular destinations**: Quick access to trending locations
- **Advanced search**: Expand to show all filter options

### Sorting & Organization

- **Multiple sort options**: Relevance, price, rating, reviews
- **Grid/List view**: Toggle between visual preferences
- **Results count**: Show "Showing X of Y results"
- **Active filters display**: Show which filters are applied

### Performance & Loading

- **Pagination**: Load 20-50 results per page
- **Lazy loading**: Load images as they appear
- **Skeleton loaders**: Show placeholders while loading
- **Caching**: Cache filter options and previous searches
- **Infinite scroll option**: Load more on scroll

### Mobile Responsive

- **Collapsible filters**: Hide sidebar on mobile, show toggle button
- **Single column cards**: Stack properly on small screens
- **Touch-friendly**: Large buttons and touch targets
- **Bottom filter button**: Quick access on mobile
- **Sticky header**: Keep search bar visible

---

## 📱 Mobile Responsiveness

### Mobile Layout Changes

```
Desktop (> 1024px):
┌─────────┬────────────────┐
│Filters  │ Hotels Grid    │
│(250px)  │ (Auto width)   │
└─────────┴────────────────┘

Tablet (640-1024px):
┌─────────────────────────────┐
│ Filters  Hotels Grid        │
│ (Narrow) (2 columns)        │
└─────────────────────────────┘

Mobile (< 640px):
┌─────────────────────────────┐
│ 🔍 Search | ⚙️ Filters       │
├─────────────────────────────┤
│ Hotels Grid (1 column)      │
│                             │
└─────────────────────────────┘
```

### Mobile Optimizations

- Filters in drawer/modal activated by button
- Single column hotel cards with full width
- Sticky header with search and filter toggle
- Bottom navigation (Explore, Tours, Activities, Trips, Host)
- Touch-friendly filter controls
- Expandable filter sections

---

## 🎨 Styling

### Color Scheme

- **Primary**: Blue (#3B82F6)
- **Secondary**: Gray (#6B7280)
- **Success**: Green (#10B981)
- **Rating**: Gold/Yellow (#F59E0B)
- **Background**: White/Light gray
- **Card shadow**: Subtle (0 2px 8px rgba(0,0,0,0.1))

### Interactive States

- **Hover**: Card shadow increase, slight lift
- **Active filter**: Blue background, white text
- **Wishlist active**: Red heart fill
- **Loading**: Skeleton opacity animation
- **Disabled**: Gray color, 50% opacity

---

## ⚡ Performance Considerations

### Optimization Strategies

- **API response caching**: Cache filter results for 5-10 minutes
- **Image optimization**: Use Cloudinary with responsive sizing
- **Lazy load images**: Load images as cards become visible
- **Pagination**: Limit initial results to 20-50 per page
- **Debounced filters**: Delay API call 300ms after filter change
- **Code splitting**: Load components on demand

### Performance Metrics

- **Target load time**: < 3 seconds
- **Time to interactive**: < 5 seconds
- **Largest contentful paint**: < 2.5 seconds

---

## 🔄 Related Pages & Navigation Flow

```
Hotels Listing Page
├── Click Hotel Card → Hotel Detail (/hotels/[slug])
│   └── → Book Room → Checkout (/checkout)
├── Click Wishlist Heart → Wishlist Page (/wishlist)
├── Click Destination Link → Same page (filtered)
├── Click Back Button → Home Page (/)
├── Search Results from Header → Same page (filtered)
└── Pagination → Stay on same page (different results)
```

---

## 🐛 Common Issues & Fixes

| Issue                        | Symptom                     | Solution                                       |
| ---------------------------- | --------------------------- | ---------------------------------------------- |
| Filters not updating results | Selected filter ignored     | Check API params, verify filter state          |
| Images not loading           | Placeholder showing         | Verify Cloudinary URLs, check image paths      |
| Pagination broken            | Page doesn't change         | Check page state, verify API pagination params |
| Mobile filters hidden        | Can't see filters on mobile | Check drawer/modal visibility, verify button   |
| Sort not working             | Results not reordered       | Check sortBy param in API, verify sort logic   |
| Wishlist not persisting      | Heart resets after refresh  | Check API authentication, verify storage       |

---

## ✅ Testing Checklist

- [ ] All filters apply correctly and update results
- [ ] Sorting options work and reorder results
- [ ] Grid/List view toggle works
- [ ] Wishlist button adds/removes items
- [ ] Pagination loads new results
- [ ] Mobile filters accessible and functional
- [ ] Images load from Cloudinary
- [ ] Responsive design at all breakpoints
- [ ] API returns correct data structure
- [ ] No console errors
- [ ] Page performance < 3 seconds load time
- [ ] Touch targets > 44px on mobile
- [ ] Search params in URL reflect selected filters

---

**Last Updated:** May 16, 2026  
**Status:** Complete  
**Maintained By:** Development Team
