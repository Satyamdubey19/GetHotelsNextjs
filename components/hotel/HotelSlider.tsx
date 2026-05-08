"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, BadgePercent, ChevronLeft, ChevronRight, MapPin, Star } from "lucide-react"
import type { SliderHotel } from "@/types/hotel-components"

const fallbackImages = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1400&q=80",
]
const LOCAL_SLIDER_FALLBACK = fallbackImages[0]

function mapApiHotel(h: Record<string, unknown>): SliderHotel {
  const images = (h.HotelImage as { url: string; isCover: boolean }[]) ?? []
  const fallbackIndex =
    Math.abs(String(h.slug ?? h.id ?? "").length) % fallbackImages.length
  const fallbackImage =
    fallbackImages[fallbackIndex] ?? fallbackImages[0] ?? LOCAL_SLIDER_FALLBACK
  const cover =
    images.find((img) => img.isCover)?.url ?? images[0]?.url ?? fallbackImage
  const rooms =
    (h.Room as { pricePerNight: number; originalPrice: number | null }[]) ?? []
  const price = rooms.length ? Math.min(...rooms.map((r) => r.pricePerNight)) : 0
  const originalPrice = rooms.length
    ? Math.min(...rooms.map((r) => r.originalPrice ?? r.pricePerNight * 1.2))
    : 0
  return {
    slug: h.slug as string,
    title: h.title as string,
    location: `${h.city as string}, ${h.country as string}`,
    city: h.city as string,
    price,
    originalPrice,
    rating: (h.averageRating as number) ?? 0,
    image: cover,
    description: h.description as string,
  }
}

export default function HotelSlider() {
  const router = useRouter()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [hotels, setHotels] = useState<SliderHotel[]>([])
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [locationCity, setLocationCity] = useState<string | null>(null)

  useEffect(() => {
    async function fetchHotels(city?: string) {
      try {
        if (city) {
          const res = await fetch(`/api/hotel?city=${encodeURIComponent(city)}&random=4`)
          const { data } = await res.json()
          if (Array.isArray(data) && data.length > 0) {
            setHotels(data.map(mapApiHotel))
            return
          }
        }
        const res = await fetch("/api/hotel?random=4")
        const { data } = await res.json()
        if (Array.isArray(data)) setHotels(data.map(mapApiHotel))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (!navigator.geolocation) {
      fetchHotels()
      return
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `/api/location/gps?lat=${coords.latitude}&lng=${coords.longitude}`,
          )
          const json = await res.json()
          const city: string =
            json.city && json.city !== "Current Location" ? json.city : ""
          if (city) setLocationCity(city)
          fetchHotels(city || undefined)
        } catch {
          fetchHotels()
        }
      },
      () => fetchHotels(),
      { timeout: 5000 },
    )
  }, [])

  const scrollToIndex = (index: number) => {
    const container = scrollRef.current
    if (!container) return
    const child = container.children[index] as HTMLElement | undefined
    if (!child) return
    container.scrollTo({ left: child.offsetLeft, behavior: "smooth" })
    setCurrentIndex(index)
  }

  const openHotel = (slug: string) => {
    router.push(`/hotels/${slug}`)
  }

  useEffect(() => {
    if (isPaused || hotels.length === 0) return
    const interval = window.setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % hotels.length
        scrollToIndex(next)
        return next
      })
    }, 4500)
    return () => window.clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaused, hotels.length])

  if (loading) {
    return (
      <div style={{ height: "420px" }} className="w-full animate-pulse bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200" />
    )
  }

  if (hotels.length === 0) return null

  return (
    <section className="relative w-full">
      {/* Slides */}
      <div
        ref={scrollRef}
        style={{ height: "420px" }}
        className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto scroll-smooth"
      >
        {hotels.map((hotel, idx) => {
          const savePct =
            hotel.originalPrice > 0
              ? Math.round(((hotel.originalPrice - hotel.price) / hotel.originalPrice) * 100)
              : 0
          const imageSrc = failedImages.has(hotel.slug)
            ? LOCAL_SLIDER_FALLBACK
            : hotel.image || LOCAL_SLIDER_FALLBACK

          return (
            <div
              key={hotel.slug}
              role="link"
              tabIndex={0}
              aria-label={`View ${hotel.title}`}
              className="group relative min-w-full shrink-0 snap-start overflow-hidden outline-none"
              onClick={() => openHotel(hotel.slug)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault()
                  openHotel(hotel.slug)
                }
              }}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onFocus={() => setIsPaused(true)}
              onBlur={() => setIsPaused(false)}
            >
              <div className="absolute inset-0 z-10 cursor-pointer" aria-hidden="true" />

              {/* Background image */}
              <img
                src={imageSrc}
                alt={hotel.title}
                onError={() =>
                  setFailedImages((s) => {
                    if (s.has(hotel.slug)) return s
                    const n = new Set(s)
                    n.add(hotel.slug)
                    return n
                  })
                }
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />

              {/* Left-to-right dark gradient for text */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent" />
              {/* Bottom fade */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950/70 to-transparent" />
              <div className="pointer-events-none absolute inset-0 z-[1] ring-inset transition group-focus-visible:ring-4 group-focus-visible:ring-cyan-300/70" />

              {/* ── Left content overlay ── */}
              <div className="pointer-events-none absolute inset-y-0 left-0 z-20 flex max-w-[58%] flex-col justify-center gap-3 px-8 text-white sm:px-14">
                {/* Location badge */}
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.18em] backdrop-blur-sm">
                  <BadgePercent className="size-3 text-cyan-300" />
                  {locationCity ? `Hotels near ${locationCity}` : "Featured stay"}
                </span>

                {/* Hotel name */}
                <h2 className="line-clamp-2 text-3xl font-extrabold leading-tight tracking-tight drop-shadow sm:text-4xl">
                  {hotel.title}
                </h2>

                {/* Location */}
                <p className="flex items-center gap-1.5 text-[12px] text-white/65">
                  <MapPin className="size-3.5 shrink-0" />
                  {hotel.location}
                </p>

                {/* Short description */}
                <p className="line-clamp-2 max-w-sm text-[13px] leading-relaxed text-white/55">
                  {hotel.description}
                </p>

                {/* Price row */}
                <div className="flex flex-wrap items-center gap-3">
                  {hotel.rating > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-0.5 text-[11px] font-extrabold text-slate-950">
                      <Star className="size-2.5 fill-slate-950" />
                      {hotel.rating.toFixed(1)}
                    </span>
                  )}
                  {hotel.originalPrice > hotel.price && (
                    <span className="text-[12px] text-white/40 line-through">
                      Rs.&nbsp;{hotel.originalPrice.toLocaleString()}
                    </span>
                  )}
                  <span className="text-2xl font-extrabold">
                    Rs.&nbsp;{hotel.price.toLocaleString()}
                    <span className="ml-1 text-[11px] font-normal text-white/50">/night</span>
                  </span>
                  {savePct > 0 && (
                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/25 px-2.5 py-0.5 text-[11px] font-bold text-emerald-300">
                      Save {savePct}%
                    </span>
                  )}
                </div>

                {/* CTA */}
                <Link
                  href={`/hotels/${hotel.slug}`}
                  onClick={(event) => event.stopPropagation()}
                  className="pointer-events-auto mt-1 inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2 text-[12px] font-extrabold text-slate-950 shadow-lg transition duration-200 hover:bg-cyan-50 hover:text-cyan-700"
                >
                  View hotel <ArrowRight className="size-3.5" />
                </Link>
              </div>

              {/* ── Right detail card — slides in from right on hover ── */}
              <div className="pointer-events-none absolute bottom-10 right-5 z-30 w-[min(340px,calc(100%-40px))] translate-y-3 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
                <div className="rounded-2xl border border-white/70 bg-white/95 p-4 shadow-[0_24px_60px_rgba(15,23,42,0.28)] backdrop-blur-md">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-blue-700">
                    {hotel.location}
                  </p>
                  <h3 className="mt-2 line-clamp-1 text-lg font-extrabold leading-snug text-slate-900">
                    {hotel.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
                    {hotel.description}
                  </p>

                  {/* Rating + price */}
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Starts from</p>
                      <p className="mt-1 text-xl font-extrabold text-slate-900">
                        Rs.&nbsp;{hotel.price.toLocaleString()}
                        <span className="ml-1 text-[11px] font-normal text-slate-400">/night</span>
                      </p>
                      {hotel.originalPrice > hotel.price && (
                        <p className="text-[11px] text-slate-400 line-through">
                          Rs.&nbsp;{hotel.originalPrice.toLocaleString()}
                        </p>
                      )}
                    </div>
                    {hotel.rating > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[12px] font-extrabold text-amber-700">
                        <Star className="size-3 fill-amber-500 text-amber-500" />
                        {hotel.rating.toFixed(1)}
                      </span>
                    )}
                  </div>

                  {/* Book now */}
                  <Link
                    href={`/hotels/${hotel.slug}`}
                    onClick={(event) => event.stopPropagation()}
                    className="pointer-events-auto mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 py-2.5 text-[13px] font-bold text-white transition hover:bg-cyan-700"
                  >
                    View details <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </div>

              {/* Slide counter */}
              <span className="absolute bottom-4 right-4 z-10 text-[10px] font-semibold text-white/40">
                {idx + 1} / {hotels.length}
              </span>
            </div>
          )
        })}
      </div>

      {/* Prev / Next arrows */}
      <button
        type="button"
        onClick={() => scrollToIndex((currentIndex - 1 + hotels.length) % hotels.length)}
        className="absolute left-3 top-1/2 z-20 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-slate-950/30 text-white backdrop-blur-sm transition hover:bg-white hover:text-slate-950"
        aria-label="Previous slide"
      >
        <ChevronLeft className="size-4" />
      </button>
      <button
        type="button"
        onClick={() => scrollToIndex((currentIndex + 1) % hotels.length)}
        className="absolute right-3 top-1/2 z-20 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-slate-950/30 text-white backdrop-blur-sm transition hover:bg-white hover:text-slate-950"
        aria-label="Next slide"
      >
        <ChevronRight className="size-4" />
      </button>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 z-10 h-[2px] bg-white/15">
        <div
          className="h-full bg-white/60 transition-all duration-500"
          style={{ width: `${((currentIndex + 1) / hotels.length) * 100}%` }}
        />
      </div>
    </section>
  )
}
