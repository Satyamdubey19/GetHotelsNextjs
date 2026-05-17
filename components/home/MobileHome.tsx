"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import {
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Headphones,
  Leaf,
  LockKeyhole,
  ShieldCheck,
  Star,
  TentTree,
  WalletCards,
} from "lucide-react"
import Link from "next/link"
import api from "@/lib/axios"
import { tours } from "@/lib/tours"
import Header from "@/components/layout/Header/Header"
import AIChatWidget from "@/components/AIChatWidget"
import HeroSlider from "./HeroSlider"
import SearchCard from "./SearchCard"
import LuxuryStayCard from "./LuxuryStayCard"
import DestinationCard from "./DestinationCard"
import FeatureCard from "./FeatureCard"
import NewsletterCTA from "./NewsletterCTA"
import MobileBottomNav from "./MobileBottomNav"
import type { HomeDestination, HomeHotel } from "./home-types"

const quickFeatures = [
  { icon: ShieldCheck, title: "Verified Hotels" },
  { icon: WalletCards, title: "Best Price" },
  { icon: Headphones, title: "24/7 Support" },
  { icon: Star, title: "Premium Stay" },
]

const benefitCards = [
  {
    icon: BadgeCheck,
    title: "Quality First",
    text: "We only partner with top-rated hotels that pass our 50-point inspection.",
  },
  {
    icon: LockKeyhole,
    title: "Secure Booking",
    text: "Your transactions are protected by industry-leading encryption standards.",
  },
  {
    icon: Leaf,
    title: "Eco-Conscious",
    text: "Support sustainable travel with our hand-picked selection of green hotels.",
  },
]

const mobileFacts: Record<string, string> = {
  dehradun: "The valley city acts as a launch point for Himalayan wellness and nature routes all year.",
  mumbai: "Mumbai's waterfront districts combine heritage boulevards with a nonstop modern cultural scene.",
  jaipur: "Jaipur's old city combines royal architecture with vibrant artisan markets and seasonal festivals.",
  goa: "Goa blends Portuguese heritage quarters with premium coastal leisure and culinary experiences.",
}

function mapApiHotel(h: Record<string, unknown>): HomeHotel {
  const images = (h.HotelImage as { url: string; isCover?: boolean }[]) ?? []
  const rooms = (h.Room as { pricePerNight: number; originalPrice?: number | null }[]) ?? []
  const price = rooms.length ? Math.min(...rooms.map((room) => room.pricePerNight)) : Number(h.pricePerNight ?? 0)
  const originalPrice = rooms.length
    ? Math.min(...rooms.map((room) => room.originalPrice ?? room.pricePerNight))
    : Number(h.originalPrice ?? price)
  const city = String(h.city ?? "")
  const country = String(h.country ?? "India")

  return {
    slug: String(h.slug ?? h.id ?? ""),
    title: String(h.title ?? "Premium Stay"),
    location: [city, country].filter(Boolean).join(", "),
    city,
    country,
    price,
    originalPrice,
    rating: Number(h.averageRating ?? 0),
    image: images.find((image) => image.isCover)?.url ?? images[0]?.url ?? "",
    description: String(h.description ?? ""),
  }
}

function buildDestinations(hotels: HomeHotel[]): HomeDestination[] {
  const grouped = new Map<string, HomeDestination>()

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

  return Array.from(grouped.values()).slice(0, 5)
}

export default function MobileHome() {
  const [hotelSearch, setHotelSearch] = useState("")
  const [hotels, setHotels] = useState<HomeHotel[]>([])
  const [loading, setLoading] = useState(true)
  const [cityLabel, setCityLabel] = useState("Your City")

  useEffect(() => {
    let cancelled = false

    async function loadHotels(city?: string) {
      const query = hotelSearch.trim()
      const url = query
        ? `/hotel?q=${encodeURIComponent(query)}`
        : city
          ? `/hotel?city=${encodeURIComponent(city)}`
          : "/hotel?random=10"

      try {
        const { data: payload } = await api.get(url)
        let results = ((payload?.data ?? []) as Record<string, unknown>[]).map(mapApiHotel).filter((hotel) => hotel.slug)

        if (!results.length && city && !query) {
          const { data: fallbackPayload } = await api.get("/hotel?random=10")
          results = ((fallbackPayload?.data ?? []) as Record<string, unknown>[]).map(mapApiHotel).filter((hotel) => hotel.slug)
        }

        if (!cancelled) setHotels(results)
      } catch (error) {
        console.error(error)
        if (!cancelled) setHotels([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    if (!navigator.geolocation || hotelSearch.trim()) {
      loadHotels()
      return () => {
        cancelled = true
      }
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const { data } = await api.get(`/location/gps?lat=${coords.latitude}&lng=${coords.longitude}`)
          const city = data?.city && data.city !== "Current Location" ? String(data.city) : undefined
          if (!cancelled && city) setCityLabel(city)
          loadHotels(city)
        } catch {
          loadHotels()
        }
      },
      () => loadHotels(),
      { timeout: 5000 },
    )

    return () => {
      cancelled = true
    }
  }, [hotelSearch])

  const destinations = useMemo(() => buildDestinations(hotels), [hotels])
  const topHotels = hotels.slice(0, 3)
  const cityKey = cityLabel.toLowerCase()
  const mobileFact = Object.keys(mobileFacts).find((key) => cityKey.includes(key))
    ? mobileFacts[Object.keys(mobileFacts).find((key) => cityKey.includes(key)) as string]
    : "This city usually sees strong premium travel demand with year-round experiences and trusted stays."

  return (
    <>
      <Header />
      <main className="min-h-screen overflow-x-hidden bg-[#F8FAFC] pb-0 text-[#111827]">
        <HeroSlider hotels={hotels} loading={loading} />
        <SearchCard onSearch={setHotelSearch} />

        <section className="px-4 pt-8">
          <div className="grid grid-cols-2 gap-3">
            {quickFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: index * 0.04 }}
                className="rounded-2xl bg-white p-4 text-center shadow-md shadow-slate-950/5"
              >
                <div className="mx-auto flex size-9 items-center justify-center rounded-full bg-[#5EEAD4]/40 text-[#0F766E]">
                  <feature.icon className="size-4" />
                </div>
                <p className="mt-3 text-[11px] font-semibold text-slate-600">{feature.title}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="pt-8">
          <div className="px-4">
            <h2 className="text-xl font-black tracking-tight text-slate-950">Stay in Luxury</h2>
            <p className="mt-1 text-xs text-slate-500">Hand-picked premium selections</p>
          </div>
          <div className="mt-4 space-y-3 px-4">
            {loading ? (
              <div className="h-[260px] animate-pulse rounded-3xl bg-slate-200" />
            ) : (
              topHotels.map((hotel) => <LuxuryStayCard key={hotel.slug} hotel={hotel} />)
            )}
          </div>
        </section>

        <section className="px-4 pt-9">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-xl font-black tracking-tight text-slate-950">Popular Tours</h2>
              <p className="mt-1 text-xs text-slate-500">Small-group, adventure, and culture experiences</p>
            </div>
            <Link href="/tours" className="text-xs font-semibold text-[#0F766E]">
              View all
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {tours.slice(0, 3).map((tour) => (
              <Link
                key={tour.id}
                href={`/tours/${tour.slug}`}
                className="block overflow-hidden rounded-3xl bg-white shadow-md shadow-slate-950/5"
              >
                <div className="relative h-40 w-full">
                  <img src={tour.image} alt={tour.title} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-slate-900">
                    <TentTree className="size-3" />
                    {tour.duration} days
                  </span>
                </div>
                <div className="p-4">
                  <p className="line-clamp-1 text-sm font-black text-slate-950">{tour.title}</p>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{tour.description}</p>
                  <p className="mt-3 text-sm font-bold text-[#0F766E]">Rs. {tour.price.toLocaleString()}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="px-4 pt-9">
          <h2 className="text-xl font-black tracking-tight text-slate-950">Popular Destinations</h2>
          <div className="mt-4 space-y-3">
            {destinations.slice(0, 3).map((destination) => (
              <DestinationCard key={destination.city} destination={destination} />
            ))}
            {!loading && !destinations.length ? (
              <div className="rounded-3xl bg-white p-5 text-sm text-slate-500 shadow-sm">No destinations available yet.</div>
            ) : null}
          </div>
        </section>

        <section className="px-4 pt-8">
          <div className="overflow-hidden rounded-3xl bg-[#0E1B34] p-4 text-white shadow-xl shadow-slate-950/20">
            <div className="mb-2 inline-flex items-center rounded-full bg-[#5EEAD4]/20 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#5EEAD4]">
              {cityLabel} Fact
            </div>
            <p className="text-lg font-black leading-6">{cityLabel} Travel Pulse</p>
            <p className="mt-2 text-xs leading-5 text-white/70">{mobileFact}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="block h-1.5 w-20 overflow-hidden rounded-full bg-white/20">
                <span className="block h-full w-2/3 rounded-full bg-[#5EEAD4]" />
              </span>
              <div className="flex items-center gap-2">
                <button className="flex size-8 items-center justify-center rounded-full border border-white/20 bg-white/10" aria-label="Previous fact">
                  <ChevronLeft className="size-4" />
                </button>
                <button className="flex size-8 items-center justify-center rounded-full border border-white/20 bg-white/10" aria-label="Next fact">
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-3 px-4 pt-9">
          {benefitCards.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: index * 0.05 }}
            >
              <FeatureCard icon={benefit.icon} title={benefit.title} text={benefit.text} />
            </motion.div>
          ))}
        </section>

        <NewsletterCTA />
      </main>
      <MobileBottomNav />
      <AIChatWidget />
    </>
  )
}
