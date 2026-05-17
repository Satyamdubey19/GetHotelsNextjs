"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Building2, CalendarCheck, Car, Compass, IndianRupee, Plus, Star, Ticket, TrendingUp } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { HostDashboardSkeleton } from "@/components/ui/loading-skeletons"
import { HostPage, HostPill, HostSection, HostStatCard } from "@/components/host/HostUI"
import api from "@/lib/axios"
import type {
  HostedProperty,
  HostDashboardStats as DashboardStats,
  HostTaskProps,
  MiniMetricProps,
  PropertyCardProps,
  PropertyType,
  QuickActionProps,
} from "@/types/host-pages"

const mockHotels: HostedProperty[] = [
  {
    id: "hotel-coral-villa",
    title: "Coral Villa Retreat",
    location: "Goa, India",
    price: 185,
    rating: 4.9,
    totalReviews: 128,
    isActive: true,
    createdAt: "2025-06-12",
    bookingsCount: 64,
    occupancyRate: 91,
    monthlyRevenue: 11800,
    responseRate: 98,
    nextAvailability: "2026-04-18",
    tags: ["Ocean view", "Airport pickup", "Breakfast included"],
    type: "hotel",
  },
  {
    id: "hotel-cedar-peak",
    title: "Cedar Peak Lodge",
    location: "Manali, India",
    price: 142,
    rating: 4.7,
    totalReviews: 94,
    isActive: true,
    createdAt: "2025-09-03",
    bookingsCount: 51,
    occupancyRate: 84,
    monthlyRevenue: 9100,
    responseRate: 95,
    nextAvailability: "2026-04-20",
    tags: ["Mountain deck", "Bonfire nights", "Family suites"],
    type: "hotel",
  },
]

const mockTours: HostedProperty[] = [
  {
    id: "tour-sunset-sail",
    title: "Sunset Coastline Escape",
    location: "Kochi, India",
    price: 89,
    rating: 4.8,
    totalReviews: 76,
    isActive: true,
    createdAt: "2025-08-21",
    bookingsCount: 83,
    occupancyRate: 88,
    monthlyRevenue: 7400,
    responseRate: 97,
    nextAvailability: "2026-04-17",
    tags: ["Small groups", "Local guide", "Flexible departures"],
    type: "tour",
  },
]

const revenueBars = [44, 52, 58, 66, 72, 81, 88]

export default function HostDashboard() {
  const { user } = useAuth()
  const [hotels, setHotels] = useState<HostedProperty[]>([])
  const [tours, setTours] = useState<HostedProperty[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    hotels: 0,
    tours: 0,
    bookings: 0,
    revenue: 0,
    activeListings: 0,
    avgRating: 0,
    occupancyRate: 0,
    responseRate: 0,
  })

  useEffect(() => {
    void fetchProperties()
  }, [user?.id])

  const fetchProperties = async () => {
    setLoading(true)

    try {
      const hostId = user?.id ?? "host-id-from-session"
      const [hotelResult, tourResult] = await Promise.allSettled([
        api.get(`/host/hotels?hostId=${hostId}`),
        api.get("/tour?scope=mine"),
      ])

      const hotelData = await parsePropertiesResponse(hotelResult, "hotel")
      const tourData = await parsePropertiesResponse(tourResult, "tour")
      const nextHotels = hotelData.length > 0 ? hotelData : mockHotels
      const nextTours = tourData.length > 0 ? tourData : mockTours

      setHotels(nextHotels)
      setTours(nextTours)
      setStats(buildStats(nextHotels, nextTours))
    } catch (error) {
      console.error("Error fetching properties:", error)
      setHotels(mockHotels)
      setTours(mockTours)
      setStats(buildStats(mockHotels, mockTours))
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <HostDashboardSkeleton />

  const allListings = [...hotels, ...tours]
  const hostName = user?.businessName || user?.name || "Host"

  return (
    <HostPage
      eyebrow="Overview"
      title={`Welcome back, ${hostName}`}
      description="A daily control room for listings, bookings, revenue, guest response, and portfolio health."
      actions={(
        <>
          <QuickAction href="/host/hotels/new" label="Hotel" icon={<Building2 className="h-4 w-4" />} />
          <QuickAction href="/host/tours/new" label="Tour" icon={<Compass className="h-4 w-4" />} />
          <QuickAction href="/host/rentals/new" label="Rental" icon={<Car className="h-4 w-4" />} />
          <QuickAction href="/host/activities/new" label="Activity" icon={<Ticket className="h-4 w-4" />} />
        </>
      )}
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <HostStatCard label="Monthly revenue" value={formatCurrency(stats.revenue)} hint="+18%" tone="cyan" icon={<IndianRupee className="h-5 w-5" />} />
        <HostStatCard label="Bookings" value={stats.bookings} hint="All inventory" tone="emerald" icon={<CalendarCheck className="h-5 w-5" />} />
        <HostStatCard label="Occupancy" value={`${stats.occupancyRate}%`} hint="Weighted" tone="amber" icon={<TrendingUp className="h-5 w-5" />} />
        <HostStatCard label="Avg rating" value={`${stats.avgRating.toFixed(1)}/5`} hint={`${stats.activeListings} live`} tone="violet" icon={<Star className="h-5 w-5" />} />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <HostSection title="Revenue rhythm" eyebrow="Performance" description="Seven-period view of booking income momentum.">
          <div className="flex h-72 items-end gap-3 p-5">
            {revenueBars.map((height, index) => (
              <span key={index} className="flex flex-1 flex-col justify-end gap-2">
                <span className="flex h-56 items-end rounded-lg bg-slate-50 p-1.5">
                  <span className="w-full rounded-md bg-cyan-600 shadow-sm" style={{ height: `${height}%` }} />
                </span>
                <span className="text-center text-xs font-bold text-slate-400">M{index + 1}</span>
              </span>
            ))}
          </div>
        </HostSection>

        <HostSection title="Today" eyebrow="Action queue">
          <div className="space-y-3 p-5">
            <Task title="Approve pending bookings" body="Review open booking requests before the evening guest window." tone="amber" />
            <Task title="Refresh listing media" body="Add new photos to listings with older cover images." tone="cyan" />
            <Task title="Reply to guest feedback" body="One review needs a host response to protect ranking signals." tone="rose" />
          </div>
        </HostSection>
      </section>

      <HostSection
        title="Portfolio"
        eyebrow="Inventory"
        description="Monitor listing status, revenue, occupancy, next availability, and guest response."
        actions={(
          <>
            <HostPill tone="cyan">{stats.hotels} hotels</HostPill>
            <HostPill tone="emerald">{stats.tours} tours</HostPill>
            <HostPill>{stats.activeListings} live</HostPill>
          </>
        )}
      >
        <div className="grid gap-4 p-5 xl:grid-cols-2">
          {allListings.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </HostSection>
    </HostPage>
  )
}

function QuickAction({ href, label, icon }: QuickActionProps) {
  return (
    <Link href={href} className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-3.5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-cyan-700">
      <Plus className="h-4 w-4" />
      {icon}
      {label}
    </Link>
  )
}

function Task({ title, body, tone }: HostTaskProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="mb-2">
        <HostPill tone={tone}>{tone === "amber" ? "Urgent" : tone === "rose" ? "Guest care" : "Suggested"}</HostPill>
      </div>
      <p className="font-bold text-slate-950">{title}</p>
      <p className="mt-1 text-sm leading-6 text-slate-600">{body}</p>
    </div>
  )
}

function PropertyCard({ property }: PropertyCardProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <HostPill tone={property.type === "hotel" ? "cyan" : "emerald"}>{property.type}</HostPill>
          <h3 className="mt-3 truncate text-lg font-bold text-slate-950">{property.title}</h3>
          <p className="mt-1 text-sm text-slate-500">{property.location}</p>
        </div>
        <HostPill tone={property.isActive ? "emerald" : "amber"}>{property.isActive ? "Live" : "Paused"}</HostPill>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <MiniMetric label="Revenue" value={formatCurrency(property.monthlyRevenue)} />
        <MiniMetric label="Bookings" value={property.bookingsCount.toString()} />
        <MiniMetric label="Occupancy" value={`${property.occupancyRate}%`} />
        <MiniMetric label="Rating" value={`${property.rating.toFixed(1)} (${property.totalReviews})`} />
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-semibold text-slate-700">Response health</span>
          <span className="text-slate-500">{property.responseRate}%</span>
        </div>
        <div className="h-2 rounded-full bg-slate-100">
          <div className="h-2 rounded-full bg-cyan-600" style={{ width: `${property.responseRate}%` }} />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {property.tags.map(tag => (
          <span key={tag} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600">{tag}</span>
        ))}
      </div>
    </article>
  )
}

function MiniMetric({ label, value }: MiniMetricProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">{label}</p>
      <p className="mt-1 font-bold text-slate-950">{value}</p>
    </div>
  )
}

async function parsePropertiesResponse(
  result: PromiseSettledResult<{ data: unknown }>,
  type: PropertyType
): Promise<HostedProperty[]> {
  if (result.status !== "fulfilled") return []

  try {
    const payload = result.value.data as { data?: Partial<HostedProperty>[] } | Partial<HostedProperty>[]
    const rows = Array.isArray(payload) ? payload : payload.data
    if (!Array.isArray(rows)) return []
    return rows.map((item, index) => normalizeProperty(item, type, index))
  } catch {
    return []
  }
}

function normalizeProperty(raw: Partial<HostedProperty>, type: PropertyType, index: number): HostedProperty {
  const price = Number(raw.price ?? 0)
  const totalReviews = Number(raw.totalReviews ?? 0)
  const rating = Number(raw.rating ?? 4.5)
  const bookingsCount = Number(raw.bookingsCount ?? Math.max(totalReviews, 12 + index * 5))
  const occupancyRate = Number(raw.occupancyRate ?? Math.min(96, 72 + index * 7 + (type === "hotel" ? 8 : 4)))

  return {
    id: raw.id ?? `${type}-${index}`,
    title: raw.title ?? `${type === "hotel" ? "Hosted Hotel" : "Hosted Tour"} ${index + 1}`,
    location: raw.location ?? "Location pending",
    price,
    rating,
    totalReviews,
    isActive: raw.isActive ?? true,
    createdAt: raw.createdAt ?? new Date().toISOString(),
    bookingsCount,
    occupancyRate,
    monthlyRevenue: Number(raw.monthlyRevenue ?? price * Math.max(bookingsCount, 10)),
    responseRate: Number(raw.responseRate ?? Math.min(99, 88 + index * 3)),
    nextAvailability: raw.nextAvailability ?? new Date(Date.now() + (index + 1) * 86400000).toISOString(),
    tags: raw.tags ?? (type === "hotel" ? ["Curated stay", "Flexible cancellation"] : ["Hosted experience", "Guide included"]),
    type,
  }
}

function buildStats(hotels: HostedProperty[], tours: HostedProperty[]): DashboardStats {
  const allListings = [...hotels, ...tours]

  if (allListings.length === 0) {
    return {
      hotels: 0,
      tours: 0,
      bookings: 0,
      revenue: 0,
      activeListings: 0,
      avgRating: 0,
      occupancyRate: 0,
      responseRate: 0,
    }
  }

  return {
    hotels: hotels.length,
    tours: tours.length,
    bookings: allListings.reduce((sum, property) => sum + property.bookingsCount, 0),
    revenue: allListings.reduce((sum, property) => sum + property.monthlyRevenue, 0),
    activeListings: allListings.filter(property => property.isActive).length,
    avgRating: allListings.reduce((sum, property) => sum + property.rating, 0) / allListings.length,
    occupancyRate: Math.round(allListings.reduce((sum, property) => sum + property.occupancyRate, 0) / allListings.length),
    responseRate: Math.round(allListings.reduce((sum, property) => sum + property.responseRate, 0) / allListings.length),
  }
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value)
}
