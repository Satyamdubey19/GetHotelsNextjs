"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BedDouble,
  CalendarDays,
  Headphones,
  Landmark,
  MapIcon,
  MapPin,
  Plane,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Utensils,
  WalletCards,
  Users,
} from "lucide-react"
import { FreeMode } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/effect-fade"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import Header from "@/components/layout/Header/Header"
import AIChatWidget from "@/components/AIChatWidget"
import MobileBottomNav from "@/components/home/MobileBottomNav"
import HomeFooter from "@/components/home/HomeFooter"
import TravelListingCard from "@/components/home/TravelListingCard"
import LocationInput from "@/components/search/LocationInput"
import DatePicker from "@/components/search/DatePicker"
import { usePathname, useRouter } from "next/navigation"
import { useWishlist } from "@/contexts/WishlistContext"
import api from "@/lib/axios"
import { tours as fallbackTours } from "@/lib/tours"

type HomeHotel = {
  slug: string
  title: string
  location: string
  city: string
  country: string
  price: number
  rating: number
  image: string
  description: string
}

type HomeTour = {
  slug: string
  title: string
  destination: string
  price: number
  rating: number
  image: string
  duration: number
  description: string
  groupSize: string
}

type Destination = {
  city: string
  country: string
  image: string
  stays: number
}

const fallbackHero = "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=1800&q=85"
const fallbackHotel = "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80"
const fallbackTour = "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=900&q=80"

const staticDestinations = [
  {
    city: "Mumbai",
    country: "India",
    stays: 342,
    image: "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&w=900&q=85",
  },
  {
    city: "Goa",
    country: "India",
    stays: 191,
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=85",
  },
  {
    city: "Jaipur",
    country: "India",
    stays: 289,
    image: "https://images.unsplash.com/photo-1477587458883-47145ed6979e?auto=format&fit=crop&w=900&q=85",
  },
]

const trustStats = [
  { icon: BedDouble, value: "10k+", label: "Stays", text: "Verified luxury properties" },
  { icon: MapIcon, value: "500+", label: "Routes", text: "Curated tour itineraries" },
  { icon: Star, value: "4.9/5", label: "Stars", text: "Average user satisfaction" },
  { icon: Headphones, value: "24/7", label: "Support", text: "Real-time trip assistance" },
]

const promises = [
  {
    icon: ShieldCheck,
    title: "Verified Stays",
    text: "Every property undergoes a 50-point inspection by our hospitality experts to ensure premium standards.",
  },
  {
    icon: WalletCards,
    title: "Clear Pricing",
    text: "Honest pricing with zero hidden service fees. The price you see during search is the total you pay.",
  },
  {
    icon: Plane,
    title: "Trip Support",
    text: "Our concierge team is available 24/7 via the app for real-time assistance during your journey.",
  },
]

const facts = [
  {
    icon: Landmark,
    title: "40 UNESCO Heritage Sites",
    text: "India hosts some of the world's most significant cultural landmarks across every region.",
  },
  {
    icon: Sparkles,
    title: "1,000+ Annual Festivals",
    text: "Experience the vibrant pulse of local traditions through a calendar of non-stop celebrations.",
  },
  {
    icon: Utensils,
    title: "The Spice Route",
    text: "Discover infinite regional spice blends that define the diverse culinary map of the nation.",
  },
]

function mapHotel(h: Record<string, unknown>): HomeHotel {
  const images = (h.HotelImage as { url: string; isCover?: boolean }[]) ?? []
  const rooms = (h.Room as { pricePerNight: number }[]) ?? []
  const city = String(h.city ?? "")
  const country = String(h.country ?? "India")

  return {
    slug: String(h.slug ?? h.id ?? ""),
    title: String(h.title ?? "Premium Stay"),
    location: [city, country].filter(Boolean).join(", "),
    city,
    country,
    price: rooms.length ? Math.min(...rooms.map((room) => room.pricePerNight)) : Number(h.pricePerNight ?? 0),
    rating: Number(h.averageRating ?? 0),
    image: images.find((image) => image.isCover)?.url ?? images[0]?.url ?? fallbackHotel,
    description: String(h.description ?? "Curated boutique hotels and luxury experiences for the discerning traveler."),
  }
}

function mapTour(t: Record<string, unknown>): HomeTour {
  const images = (t.images as string[]) ?? []
  return {
    slug: String(t.slug ?? t.id ?? ""),
    title: String(t.title ?? "Curated Tour"),
    destination: String(t.destination ?? t.city ?? "India"),
    price: Number(t.price ?? t.pricePerPerson ?? 0),
    rating: Number(t.rating ?? t.averageRating ?? 0),
    image: String((t.image as string) ?? images[0] ?? fallbackTour),
    duration: Number(t.duration ?? 1),
    description: String(t.description ?? "Guided routes and group experiences curated for effortless travel."),
    groupSize: String(t.groupSize ?? "Small group"),
  }
}

function getDestinations(hotels: HomeHotel[]): Destination[] {
  const grouped = new Map<string, Destination>()
  hotels.forEach((hotel) => {
    if (!hotel.city) return
    const key = hotel.city.toLowerCase()
    const existing = grouped.get(key)
    if (existing) {
      existing.stays += 1
      if (!existing.image && hotel.image) existing.image = hotel.image
      return
    }
    grouped.set(key, {
      city: hotel.city,
      country: hotel.country,
      image: hotel.image,
      stays: 1,
    })
  })

  return staticDestinations.map((destination) => {
    const dynamic = grouped.get(destination.city.toLowerCase())
    return {
      ...destination,
      stays: dynamic?.stays ?? destination.stays,
    }
  })
}

function swapBrokenImage(event: React.SyntheticEvent<HTMLImageElement>, fallback: string) {
  if (event.currentTarget.src !== fallback) {
    event.currentTarget.src = fallback
  }
}

function SearchCard({ onSearch }: { onSearch: (query: string) => void }) {
  const router = useRouter()
  const pathname = usePathname()
  const [destination, setDestination] = useState("")
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState(2)

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    const query = destination.trim()
    onSearch(query)
    const params = new URLSearchParams()
    if (query) params.set("q", query)
    if (checkIn) params.set("checkIn", checkIn)
    if (checkOut) params.set("checkOut", checkOut)
    if (query || checkIn || checkOut) params.set("guests", String(guests))
    const target = params.toString() ? `/hotels?${params.toString()}` : "/hotels"
    if (pathname !== target) router.push(target)
  }

  const inputClass = "h-auto border-0 bg-transparent p-0 text-sm font-semibold text-slate-950 outline-none placeholder:text-slate-400 focus:ring-0"

  return (
    <form
      onSubmit={submit}
      className="mx-auto flex w-full max-w-6xl flex-col gap-3 rounded-[30px] border border-white/80 bg-white/95 p-3 shadow-[0_24px_80px_rgba(15,23,42,0.18)] ring-1 ring-slate-950/[0.03] backdrop-blur-xl md:flex-row md:items-center md:px-4 md:py-3"
    >
      <div className="grid flex-1 grid-cols-1 gap-1 md:grid-cols-4">
        <div className="rounded-2xl px-4 py-2.5 transition hover:bg-teal-50/70 md:border-r md:border-slate-100">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-teal-700">Destination</p>
          <div className="mt-1 flex items-center gap-2">
            <Search className="size-4 text-slate-400" />
            <LocationInput
              value={destination}
              onChange={(value) => {
                setDestination(value)
                onSearch(value)
              }}
              placeholder="Where are you going?"
              className={inputClass}
            />
          </div>
        </div>
        <div className="rounded-2xl px-4 py-2.5 transition hover:bg-teal-50/70 md:border-r md:border-slate-100">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-teal-700">Check-in</p>
          <div className="mt-1 flex items-center gap-2">
            <CalendarDays className="size-4 text-slate-400" />
            <DatePicker value={checkIn} onChange={setCheckIn} className={inputClass} />
          </div>
        </div>
        <div className="rounded-2xl px-4 py-2.5 transition hover:bg-teal-50/70 md:border-r md:border-slate-100">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-teal-700">Check-out</p>
          <div className="mt-1 flex items-center gap-2">
            <CalendarDays className="size-4 text-slate-400" />
            <DatePicker value={checkOut} onChange={setCheckOut} className={inputClass} />
          </div>
        </div>
        <div className="rounded-2xl px-4 py-2.5 transition hover:bg-teal-50/70">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-teal-700">Guests</p>
          <div className="mt-1 flex items-center justify-between gap-2 text-sm font-semibold text-slate-950">
            <span className="flex items-center gap-2">
              <Users className="size-4 text-slate-400" />
              {guests} Adults
            </span>
            <span className="flex items-center gap-2">
              <button type="button" onClick={() => setGuests((value) => Math.max(1, value - 1))}>-</button>
              <button type="button" onClick={() => setGuests((value) => value + 1)}>+</button>
            </span>
          </div>
        </div>
      </div>
      <button className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-700 to-slate-950 px-8 text-sm font-black text-white shadow-[0_16px_34px_rgba(15,118,110,0.28)] transition hover:from-teal-600 hover:to-slate-900 md:w-20 md:px-0" type="submit">
        <Search className="size-5" />
        <span className="md:hidden">Search Hotels</span>
      </button>
    </form>
  )
}

function HotelCard({ hotel }: { hotel: HomeHotel }) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const saved = isInWishlist(hotel.slug, "hotel")

  const toggleWishlist = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    if (saved) {
      removeFromWishlist(hotel.slug, "hotel")
      return
    }
    addToWishlist({ id: hotel.slug, slug: hotel.slug, title: hotel.title, image: hotel.image, price: hotel.price, type: "hotel" })
  }

  return (
    <TravelListingCard
      href={`/hotels/${hotel.slug}`}
      title={hotel.title}
      image={hotel.image || fallbackHotel}
      imageFallback={fallbackHotel}
      location={hotel.location}
      eyebrow={hotel.city || hotel.country || "Premium stay"}
      rating={hotel.rating}
      description={hotel.description}
      price={hotel.price}
      originalPrice={Math.round(hotel.price * 1.22)}
      priceLabel="Per night"
      ctaLabel="View"
      meta={[
        { icon: BedDouble, label: "Verified stay" },
        { icon: Sparkles, label: "Guest loved" },
      ]}
      wishlist={{
        saved,
        label: "Save hotel",
        activeLabel: "Remove hotel from wishlist",
        onToggle: toggleWishlist,
      }}
    />
  )
}

function TourCard({ tour }: { tour: HomeTour }) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const saved = isInWishlist(tour.slug, "tour")

  const toggleWishlist = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    if (saved) {
      removeFromWishlist(tour.slug, "tour")
      return
    }
    addToWishlist({ id: tour.slug, slug: tour.slug, title: tour.title, image: tour.image, price: tour.price, type: "tour" })
  }

  return (
    <TravelListingCard
      href={`/tours/${tour.slug}`}
      title={tour.title}
      image={tour.image || fallbackTour}
      imageFallback={fallbackTour}
      location={tour.destination}
      eyebrow="Curated tour"
      rating={tour.rating}
      description={tour.description}
      price={tour.price}
      priceLabel="Per person"
      ctaLabel="View tour"
      imageClassName="h-64"
      meta={[
        { icon: CalendarDays, label: `${tour.duration} days` },
        { icon: Users, label: tour.groupSize },
      ]}
      wishlist={{
        saved,
        label: "Save tour",
        activeLabel: "Remove tour from wishlist",
        onToggle: toggleWishlist,
      }}
    />
  )
}

export default function HomePage() {
  const router = useRouter()
  const [hotelSearch, setHotelSearch] = useState("")
  const [hotels, setHotels] = useState<HomeHotel[]>([])
  const [tours, setTours] = useState<HomeTour[]>([])
  const [city, setCity] = useState("India")
  const [activeHero, setActiveHero] = useState(0)

  useEffect(() => {
    let cancelled = false
    async function loadHotels() {
      try {
        const query = hotelSearch.trim() || (city && city !== "India" ? city : "")
        const endpoint = query ? `/hotel?q=${encodeURIComponent(query)}` : "/hotel?random=8"
        const { data } = await api.get(endpoint)
        let next = ((data?.data ?? []) as Record<string, unknown>[]).map(mapHotel).filter((hotel) => hotel.slug)

        if (!next.length && query) {
          const fallback = await api.get("/hotel?random=8")
          next = ((fallback.data?.data ?? []) as Record<string, unknown>[]).map(mapHotel).filter((hotel) => hotel.slug)
        }

        if (!cancelled) setHotels(next)
      } catch (error) {
        console.error(error)
        if (!cancelled) setHotels([])
      }
    }
    loadHotels()
    return () => {
      cancelled = true
    }
  }, [city, hotelSearch])

  useEffect(() => {
    let cancelled = false
    async function loadTours() {
      try {
        const { data } = await api.get("/tour")
        const raw = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []
        const next = (raw as Record<string, unknown>[]).map(mapTour).filter((tour) => tour.slug)
        if (!cancelled) setTours(next)
      } catch (error) {
        if (!cancelled) setTours(fallbackTours.slice(0, 6).map((tour) => mapTour(tour as unknown as Record<string, unknown>)))
      }
    }
    loadTours()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const { data } = await api.get(`/location/gps?lat=${coords.latitude}&lng=${coords.longitude}`)
          setCity(String(data?.city || "India"))
        } catch {
          setCity("India")
        }
      },
      () => setCity("India"),
      { timeout: 5000 },
    )
  }, [])

  const heroSlides = hotels.length
    ? hotels.slice(0, 5)
    : [{ slug: "", title: "Maldives Azure", location: "North Male Atoll, Maldives", city: "Maldives", country: "Maldives", price: 1250, rating: 4.9, image: fallbackHero, description: "Overwater villas with private infinity pools and 24/7 butler service." }]
  const destinations = useMemo(() => getDestinations(hotels), [hotels])
  const currentHero = heroSlides[activeHero % heroSlides.length]
  const currentHeroHref = currentHero.slug ? `/hotels/${currentHero.slug}` : "/hotels"

  useEffect(() => {
    if (heroSlides.length <= 1) return
    const timer = window.setInterval(() => {
      setActiveHero((value) => (value + 1) % heroSlides.length)
    }, 5000)
    return () => window.clearInterval(timer)
  }, [heroSlides.length])

  return (
    <>
      <Header />
      <main className="overflow-x-hidden bg-[#f7f9fb] text-slate-950">
        <section
          className="relative isolate block h-[280px] w-full cursor-pointer overflow-hidden bg-slate-950 shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)] md:h-[340px]"
          role="link"
          tabIndex={0}
          aria-label={`Open ${activeHero === 0 ? "Maldives Azure" : currentHero.title}`}
          onClick={(event) => {
            if ((event.target as HTMLElement).closest("a,button,input")) return
            router.push(currentHeroHref)
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") router.push(currentHeroHref)
          }}
        >
          {heroSlides.map((hotel, index) => (
            <div
              key={hotel.slug || index}
              className={`absolute inset-0 transition-opacity duration-700 ${index === activeHero % heroSlides.length ? "opacity-100" : "opacity-0"}`}
              aria-hidden={index !== activeHero % heroSlides.length}
            >
              <img
                src={index === 0 ? fallbackHero : hotel.image || fallbackHero}
                alt={hotel.title}
                onError={(event) => swapBrokenImage(event, fallbackHero)}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/82 via-slate-950/38 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/45 to-transparent" />
          <div className="absolute inset-y-0 left-0 hidden w-1/2 bg-gradient-to-r from-slate-950/70 via-slate-950/20 to-transparent md:block" />

          <div className="relative z-10 mx-auto flex h-full max-w-[1880px] items-center px-4 sm:px-6 lg:px-12">
            <div className="max-w-md text-white">
              <span className="inline-flex rounded-full border border-teal-300/30 bg-teal-600/20 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-teal-200">Featured Luxury</span>
              <h1 className="mt-3 text-3xl font-black leading-tight tracking-tight md:text-4xl">Find Your Next Extraordinary Stay</h1>
              <p className="mt-3 line-clamp-2 max-w-sm text-sm leading-6 text-white/78">Curated boutique hotels and luxury experiences for the discerning global traveler.</p>
              <div className="mt-5 flex items-center gap-3">
                <Link href={currentHeroHref} className="inline-flex rounded-xl bg-teal-700 px-5 py-3 text-xs font-black text-white shadow-lg shadow-teal-950/20 transition hover:bg-teal-600">Explore</Link>
                <Link href={currentHeroHref} className="hidden rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-xs font-black text-white backdrop-blur transition hover:bg-white/20 md:inline-flex">Preview</Link>
              </div>
            </div>

            <div className="absolute right-10 top-1/2 hidden w-80 -translate-y-1/2 overflow-hidden rounded-3xl border border-white/20 bg-white/15 p-5 text-white shadow-[0_24px_60px_rgba(15,23,42,0.28)] backdrop-blur-xl lg:block">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/80">Now Showing</p>
                  <h2 className="mt-2 max-w-[240px] text-xl font-black leading-tight">
                    {activeHero === 0 ? "Maldives Azure" : currentHero.title}
                  </h2>
                </div>
                <Star className="size-5 text-white" />
              </div>
              <p className="mt-3 flex items-center gap-2 text-xs font-semibold text-white/75">
                <MapPin className="size-4" />
                {activeHero === 0 ? "North Male Atoll, Maldives" : currentHero.location}
              </p>
              <p className="mt-3 line-clamp-2 text-xs font-medium leading-5 text-white/70">
                {activeHero === 0 ? "Overwater villas with private infinity pools and 24/7 butler service." : currentHero.description}
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-white/15 pt-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/70">Starting from</p>
                  <p className="mt-1 text-xl font-black">
                    Rs. {Math.max(0, activeHero === 0 ? 1250 : currentHero.price).toLocaleString()}
                    <span className="text-xs font-normal text-white/60">/night</span>
                  </p>
                </div>
                <Link href={currentHeroHref} className="flex size-9 items-center justify-center rounded-xl bg-white text-slate-950"><ArrowRight className="size-4" /></Link>
              </div>
            </div>
          </div>

          <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {heroSlides.map((hotel, index) => (
              <button
                key={hotel.slug || index}
                type="button"
                onClick={() => setActiveHero(index)}
                aria-label={`Show slide ${index + 1}`}
                className={`h-1.5 rounded-full transition-all ${index === activeHero % heroSlides.length ? "w-9 bg-white" : "w-2 bg-white/45"}`}
              />
            ))}
          </div>
        </section>

        <section className="relative z-20 -mt-8 px-4">
          <SearchCard onSearch={setHotelSearch} />
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-0">
            {trustStats.map((item, index) => (
              <div key={item.label} className={`flex flex-col items-center text-center ${index < 3 ? "md:border-r md:border-slate-200" : ""}`}>
                <item.icon className="mb-3 size-5 text-teal-700" />
                <p className="text-base font-black text-slate-950">{item.value} {item.label}</p>
                <p className="mt-1 text-xs text-slate-500">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#f7f9fb] py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex items-end justify-between gap-6">
              <div>
                <h2 className="text-2xl font-black tracking-tight md:text-[32px]">Explore Popular Cities</h2>
                <p className="mt-2 text-sm text-slate-500">Start your journey in India&apos;s most vibrant hubs.</p>
              </div>
              <Link href="/hotels" className="hidden items-center gap-1 text-sm font-black text-teal-700 md:inline-flex">See all destinations <ArrowRight className="size-4" /></Link>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {destinations.map((place) => (
                <Link key={place.city} href={`/hotels?city=${encodeURIComponent(place.city)}`} className="group relative h-[300px] overflow-hidden rounded-3xl bg-slate-950 shadow-xl">
                  <img src={place.image} alt={place.city} onError={(event) => swapBrokenImage(event, fallbackHotel)} className="h-full w-full object-cover transition duration-1000 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-7 text-white">
                    <span className="rounded-full bg-teal-700 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em]">{place.stays} stays</span>
                    <h3 className="mt-4 text-3xl font-black">{place.city}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/70">Experience the city&apos;s most loved luxury stays and local stories.</p>
                    <p className="mt-5 inline-flex items-center gap-2 text-sm font-black">View Collection <ArrowRight className="size-4" /></p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-black tracking-tight md:text-[32px]">Highly Rated Stays</h2>
          <p className="mt-2 text-sm text-slate-500">Top-tier luxury as rated by our global community.</p>
          <div className="mt-8 hidden grid-cols-4 gap-8 md:grid">
            {hotels.slice(0, 4).map((hotel) => <HotelCard key={hotel.slug} hotel={hotel} />)}
          </div>
          <div className="mt-5 md:hidden">
            <Swiper modules={[FreeMode]} freeMode slidesPerView={1.08} spaceBetween={14}>
              {hotels.slice(0, 6).map((hotel) => (
                <SwiperSlide key={hotel.slug}><HotelCard hotel={hotel} /></SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>

        {tours.length > 0 ? (
          <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-black tracking-tight md:text-[32px]">Curated Tours</h2>
            <p className="mt-2 text-sm text-slate-500">Guided routes and group experiences ready to join.</p>
            <div className="mt-8 grid gap-8 md:grid-cols-3">
              {tours.slice(0, 3).map((tour) => <TourCard key={tour.slug} tour={tour} />)}
            </div>
          </section>
        ) : null}

        <section className="bg-[#f7f9fb] py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 flex items-end justify-between">
              <div>
                <h2 className="text-[32px] font-black">City Pulse</h2>
                <p className="mt-3 text-sm text-slate-500">Useful facts near {city} with interactive insights and local lore.</p>
              </div>
              <div className="hidden gap-2 md:flex">
                <button className="flex size-11 items-center justify-center rounded-full border border-slate-200 bg-white"><ArrowLeft className="size-4" /></button>
                <button className="flex size-11 items-center justify-center rounded-full border border-slate-200 bg-white"><ArrowRight className="size-4" /></button>
              </div>
            </div>
            <div className="grid gap-8 lg:grid-cols-[1.36fr_1fr]">
              <div className="relative h-[420px] overflow-hidden rounded-[32px] bg-slate-950 shadow-2xl">
                <img src="https://images.unsplash.com/photo-1477587458883-47145ed6979e?auto=format&fit=crop&w=1200&q=85" alt="Jaipur Heritage" onError={(event) => swapBrokenImage(event, fallbackHotel)} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-teal-200">Did you know?</p>
                  <p className="mt-3 text-2xl font-semibold leading-snug">Jaipur&apos;s Hawa Mahal was built with 953 windows to allow royal ladies to observe daily life without being seen.</p>
                </div>
              </div>
              <div className="grid gap-6">
                {facts.map((fact) => (
                  <div key={fact.title} className="flex items-start gap-6 rounded-[32px] border border-slate-200 bg-white p-8">
                    <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-700"><fact.icon className="size-6" /></div>
                    <div>
                      <h3 className="text-lg font-black">{fact.title}</h3>
                      <p className="mt-1.5 text-sm leading-6 text-slate-500">{fact.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-14 text-slate-950 sm:py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 md:grid-cols-3">
              {promises.map((item) => (
                <div key={item.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700"><item.icon className="size-6" /></div>
                  <h3 className="mt-6 text-xl font-black text-slate-950">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 flex flex-col items-start justify-between gap-5 rounded-[28px] bg-teal-700 p-5 text-left text-white shadow-xl shadow-teal-900/10 sm:mt-12 sm:gap-6 sm:p-7 md:mt-14 md:flex-row md:items-center md:rounded-[40px] md:p-10">
              <div className="max-w-xl">
                <h3 className="text-2xl font-black leading-tight sm:text-3xl">Ready for your next stay?</h3>
                <p className="mt-2 text-sm text-white/80 sm:text-base">Join 50,000+ travelers exploring the extraordinary.</p>
              </div>
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
                <Link href="/signup" className="w-full rounded-xl bg-white px-6 py-3 text-center text-sm font-black text-teal-700 sm:w-auto sm:px-7 sm:py-4">Sign Up Now</Link>
                <Link href="/hotels" className="w-full rounded-xl bg-slate-950 px-6 py-3 text-center text-sm font-black text-white sm:w-auto sm:px-7 sm:py-4">View All Offers</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <HomeFooter />
      <MobileBottomNav />
      <AIChatWidget />
    </>
  )
}
