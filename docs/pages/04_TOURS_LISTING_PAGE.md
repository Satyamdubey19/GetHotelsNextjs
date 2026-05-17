# Tours & Trips Listing Page Documentation

**Route:** `/tours`  
**File:** [app/tours/page.tsx](../../app/tours/page.tsx)  
**Type:** Public page (accessible to all users)  
**Authentication:** Not required (login required for booking)

---

## 📖 Overview

The Tours Listing Page showcases group travel packages and experiences. Users can search for tours by destination/keyword, filter by duration/price/difficulty, sort results, and browse tour details. Tours are multi-day packages with itineraries, group sizes, and participant management.

---

## 🎨 UI Structure

### Header & Navigation

- Sticky search bar with destination autocomplete
- Category tabs (All Tours, Adventure, Relaxation, Cultural, etc.)
- View mode toggle (Grid/List)
- Sort dropdown

### Category Navigation

```
🌍 All Tours | 🏔️ Adventure | 🏖️ Relaxation | 🏛️ Cultural | 🎯 Other
```

### Main Content Area

```
┌─────────────────────────────────────────────────────┐
│ Showing X results | Sort: [Recommended ▼]           │
│ Grid [▦] List [≡]                                  │
├─────────────────────────────────────────────────────┤
│ ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│ │ Tour Card 1  │  │ Tour Card 2  │  │ Tour Card 3  │ │
│ └──────────────┘  └──────────────┘  └──────────────┘ │
│ ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│ │ Tour Card 4  │  │ Tour Card 5  │  │ Tour Card 6  │ │
│ └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────┘
[Load More] or Pagination
```

### Tour Card (Grid View)

```
┌───────────────────────────────────┐
│  [Tour Image with Badge]          │
│  • "3 Days" badge                 │
│  • Category icon                  │
│  ♡ (Wishlist heart)               │
├───────────────────────────────────┤
│ Tour Title                        │
│ 📍 Destination                    │
│ ⭐ 4.6 (189 reviews)              │
│                                   │
│ 👥 8-15 Participants / Difficulty │
│ 📅 Flexible Dates                │
│ ₹8,500 per person                │
│ [View Details] [Book Now]         │
└───────────────────────────────────┘
```

### Tour Card (List View)

```
┌────────────────────────────────────────────────────┐
│ [Image] Tour Title      ⭐ 4.6 (189)  ₹8,500/person│
│         📍 Destination                 [Book Now]  │
│         3 Days • 8-15 Ppl • Adventure  ♡          │
│         Brief description of tour...              │
└────────────────────────────────────────────────────┘
```

---

## 🔧 Key Components

### Main Component

```typescript
'use client'

type SortOption = 'recommended' | 'price-low' | 'price-high' | 'rating' | 'duration'
type ViewMode = 'grid' | 'list'

interface Tour {
  id: string
  slug: string
  title: string
  destination: string
  image: string
  duration: string  // "3 Days"
  description: string
  category: TourCategory
  difficulty: 'Easy' | 'Moderate' | 'Challenging'
  groupSize: { min: number, max: number }
  price: number
  rating: number
  reviews: number
  participants: number
  startDates: Date[]
  itinerary: ItineraryDay[]
}

export default function ToursPage() {
  const [tours, setTours] = useState<Tour[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [sortBy, setSortBy] = useState<SortOption>('recommended')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  // Fetch tours based on filters
  useEffect(() => {
    loadTours()
  }, [activeCategory, searchQuery, sortBy])

  return (
    <>
      <Header />
      <SearchBar />
      <CategoryTabs />
      <ViewAndSortOptions />
      <TourGrid />
      <Footer />
    </>
  )
}
```

### Sub-Components

- **SearchBar** - Search input with autocomplete
- **CategoryTabs** - Category filter tabs
- **TourCard** - Individual tour card
- **ViewToggle** - Grid/List switcher
- **SortDropdown** - Sort options
- **Pagination** - Page navigation
- **LoadingSkeletons** - Loading placeholders

---

## 📡 API Calls & Data Flow

### Primary Endpoints

#### 1. List Tours with Filters

```
GET /api/tours?
  search=bali&
  category=adventure&
  minPrice=5000&
  maxPrice=20000&
  minDuration=2&
  maxDuration=7&
  difficulty=moderate&
  sort=recommended&
  page=1&
  limit=20

Response:
{
  data: Tour[],
  total: number,
  page: number,
  pages: number
}
```

#### 2. Get Tour Categories

```
GET /api/tours/categories
Response: {
  categories: [
    { id: 'adventure', label: 'Adventure', icon: '🏔️' },
    { id: 'relaxation', label: 'Relaxation', icon: '🏖️' },
    ...
  ]
}
```

#### 3. Search Autocomplete

```
GET /api/tours/search?query=bal
Response: { suggestions: string[] }
```

### Tour Data Model

```typescript
interface Tour {
  id: string;
  slug: string;
  title: string;
  destination: string;
  description: string;
  image: string;
  images: string[];

  // Duration & Difficulty
  duration: string; // "3 Days / 2 Nights"
  difficulty: "Easy" | "Moderate" | "Challenging";

  // Group & Participants
  groupSizeMin: number;
  groupSizeMax: number;
  currentParticipants: number;

  // Pricing
  pricePerPerson: number;
  originalPrice?: number;

  // Ratings & Reviews
  averageRating: number;
  totalReviews: number;

  // Category & Tags
  category: string;
  tags: string[];

  // Dates
  startDates: Date[];
  endDates: Date[];

  // Itinerary
  itinerary: ItineraryDay[];

  // Status
  isActive: boolean;
  isApproved: boolean;
  featured?: boolean;

  // Moderation
  status: ListingStatus;
  submittedForReviewAt: Date;
  approvedAt?: Date;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

interface ItineraryDay {
  dayNumber: number;
  title: string;
  description: string;
  activities: string[];
  meals: string[];
  accommodation?: string;
}
```

---

## 🔐 User Interactions

### 1. Search & Filter

```
User enters search term:
→ Query updates on submit
→ API call with search parameter
→ Results filtered to matching tours
→ Display "Showing X results for 'query'"
```

### 2. Category Selection

```
User clicks category tab:
→ activeCategory state updates
→ API call with category filter
→ Show only tours in that category
→ Tab visual highlight
```

### 3. Sorting

```
User selects sort option:
○ Recommended (default)
○ Price: Low to High
○ Price: High to Low
○ Rating: High to Low
○ Duration: Short to Long

→ Update sortBy state
→ Re-fetch tours with new sort
→ Re-render results
```

### 4. View Toggle

```
User clicks Grid/List:
→ Toggle viewMode state
→ Re-render same data in new layout
→ No API call
```

### 5. Card Interactions

```
Click Tour Card:
→ Navigate to /tours/[slug]

Click Wishlist Heart:
→ If not logged in → Login redirect
→ If logged in → Add/remove from wishlist
→ POST /api/wishlist/add

Click "View Details":
→ Navigate to /tours/[slug]

Click "Book Now":
→ Navigate to /tours/[slug]
→ Scroll to booking section
```

### 6. Pagination

```
User clicks page number or "Next":
→ Update page state
→ API call with new page
→ Load results for page
→ Scroll to top
```

---

## 🎯 Key Features

### Search & Discovery

- **Text search**: Find tours by title, destination, keyword
- **Search suggestions**: Popular tour searches
- **Category browsing**: Pre-defined tour categories
- **Recent searches**: Show previously searched tours (logged-in users)

### Filtering & Sorting

- **Multiple sort options**: Recommended, price, rating, duration
- **Price range**: Min-max slider
- **Difficulty filter**: Easy, Moderate, Challenging
- **Duration filter**: 1 day to 2 weeks+
- **Group size filter**: Filter by participant capacity

### Display Options

- **Grid view**: 3-column card layout (desktop)
- **List view**: Full-width detailed rows
- **Card information**: Image, title, destination, duration, price, rating
- **Results count**: "Showing X of Y tours"

### Performance & Loading

- **Pagination**: 20-50 results per page
- **Lazy loading**: Images load as needed
- **Skeleton loaders**: Show while fetching
- **Infinite scroll option**: Load more on scroll

### Mobile Responsive

- **Collapsible search**: Full search on mobile
- **Single column cards**: Stack vertically
- **Category tabs**: Horizontal scroll on mobile
- **Sticky header**: Keep search visible
- **Bottom nav**: Quick access to main features

---

## 📱 Mobile Optimization

### Mobile Layout

- Full-width search bar
- Horizontal scrolling category tabs
- Single-column card grid
- Larger touch targets
- Simplified sort/view options

### Mobile Features

- Category tabs as horizontal scroll
- Quick filter button (opens modal)
- Bottom navigation with tours link
- Swipe to navigate cards option

---

## 🎨 Styling

### Colors & Design

- **Primary**: Brand blue
- **Category badges**: Color-coded by category
- **Difficulty badges**: Color progression (green → yellow → red)
- **Card shadow**: Subtle elevation
- **Hover effects**: Lift and shadow increase

### Typography

- **Tour title**: Bold, 18-20px
- **Destination**: Gray, 14px
- **Price**: Bold, 16-18px
- **Rating**: Gold/yellow, 14px

---

## 🔄 Related Pages & Flows

```
Tours Listing Page
├── Click Tour Card → Tour Detail (/tours/[slug])
│   └── Book Tour → Checkout (/checkout)
├── Click Wishlist → Wishlist Page (/wishlist)
├── View Details → Tour Detail Page
├── Join Tour Chat → /tours/[slug]/chat (after booking)
└── Category Selection → Filtered same page
```

---

## ✅ Testing Checklist

- [ ] Search functionality works and filters results
- [ ] Category tabs switch between categories
- [ ] Sorting options reorder results correctly
- [ ] Grid/List view toggle works
- [ ] Wishlist button adds/removes tours
- [ ] Pagination loads new results
- [ ] Mobile layout responsive
- [ ] Images load from Cloudinary
- [ ] No console errors
- [ ] Page loads in < 3 seconds
- [ ] Touch targets > 44px on mobile

---

**Last Updated:** May 16, 2026  
**Status:** Complete  
**Maintained By:** Development Team
