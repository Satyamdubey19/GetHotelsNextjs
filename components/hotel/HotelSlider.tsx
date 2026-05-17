"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, BadgePercent, ChevronLeft, ChevronRight, MapPin, Play, Star } from "lucide-react"
import type { SliderHotel } from "@/types/hotel-components"
import api from "@/lib/axios"

const fallbackImages = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1600&q=80",
]
const LOCAL_SLIDER_FALLBACK = fallbackImages[0]

function mapApiHotel(h: Record<string, unknown>): SliderHotel {
  const images = (h.HotelImage as { url: string; isCover: boolean }[]) ?? []
  const fallbackIndex = Math.abs(String(h.slug ?? h.id ?? "").length) % fallbackImages.length
  const fallbackImage = fallbackImages[fallbackIndex] ?? fallbackImages[0] ?? LOCAL_SLIDER_FALLBACK
  const cover = images.find((img) => img.isCover)?.url ?? images[0]?.url ?? fallbackImage
  const rooms = (h.Room as { pricePerNight: number; originalPrice: number | null }[]) ?? []
  const price = rooms.length ? Math.min(...rooms.map((r) => r.pricePerNight)) : 0
  const originalPrice = rooms.length ? Math.min(...rooms.map((r) => r.originalPrice ?? r.pricePerNight * 1.2)) : 0

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
          const { data: payload } = await api.get(`/hotel?city=${encodeURIComponent(city)}&random=4`)
          const { data } = payload
          if (Array.isArray(data) && data.length > 0) {
            setHotels(data.map(mapApiHotel))
            return
          }
        }

        const { data: payload } = await api.get("/hotel?random=4")
        const { data } = payload
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
          const { data: json } = await api.get(`/location/gps?lat=${coords.latitude}&lng=${coords.longitude}`)
          const city: string = json.city && json.city !== "Current Location" ? json.city : ""
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
    return <div className="h-[500px] w-full animate-pulse bg-slate-200 lg:h-[560px]" />
  }

  if (hotels.length === 0) {
    return (
      <section className="relative h-[560px] overflow-hidden bg-slate-950">
        <img
          src={LOCAL_SLIDER_FALLBACK}
          alt="Luxury resort"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/88 via-slate-950/48 to-slate-950/10" />
        <div className="absolute inset-y-0 left-0 z-20 flex max-w-2xl flex-col justify-center gap-4 px-16 text-white">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.18em] backdrop-blur-sm">
            <BadgePercent className="size-3 text-teal-300" />
            Featured experience
          </span>
          <h2 className="max-w-[560px] text-6xl font-black leading-[0.95] tracking-tight drop-shadow">
            Find Your Next Extraordinary Stay
          </h2>
          <p className="max-w-md text-sm leading-6 text-white/75">
            Curated boutique hotels and luxury experiences for the discerning global traveler.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/hotels"
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-[12px] font-extrabold text-white shadow-lg transition duration-200 hover:bg-teal-500"
            >
              Explore Experiences <ArrowRight className="size-3.5" />
            </Link>
            <Link
              href="/hotels"
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-[12px] font-extrabold text-white backdrop-blur transition hover:bg-white/20"
            >
              <Play className="size-3.5 fill-white" />
              Watch Preview
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative w-full bg-slate-950">
      <div ref={scrollRef} className="no-scrollbar flex h-[500px] snap-x snap-mandatory overflow-x-auto scroll-smooth lg:h-[560px]">
        {hotels.map((hotel, idx) => {
          const savePct =
            hotel.originalPrice > 0 ? Math.round(((hotel.originalPrice - hotel.price) / hotel.originalPrice) * 100) : 0
          const imageSrc = failedImages.has(hotel.slug) ? LOCAL_SLIDER_FALLBACK : hotel.image || LOCAL_SLIDER_FALLBACK

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
              <img
                src={imageSrc}
                alt={hotel.title}
                onError={() =>
                  setFailedImages((current) => {
                    if (current.has(hotel.slug)) return current
                    const next = new Set(current)
                    next.add(hotel.slug)
                    return next
                  })
                }
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/55 to-slate-950/10" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950/70 to-transparent" />
              <div className="pointer-events-none absolute inset-0 z-[1] ring-inset transition group-focus-visible:ring-4 group-focus-visible:ring-teal-300/70" />

              <div className="pointer-events-none absolute inset-y-0 left-0 z-20 flex max-w-2xl flex-col justify-center gap-4 px-6 pt-8 text-white sm:px-12 lg:px-16">
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.18em] backdrop-blur-sm">
                  <BadgePercent className="size-3 text-teal-300" />
                  {locationCity ? `Hotels near ${locationCity}` : "Featured experience"}
                </span>
                <h2 className="max-w-[560px] text-4xl font-black leading-[0.95] tracking-tight drop-shadow sm:text-5xl lg:text-6xl">
                  Find Your Next Extraordinary Stay
                </h2>
                <p className="max-w-md text-sm leading-6 text-white/75">
                  Curated boutique hotels and luxury experiences for the discerning global traveler.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href={`/hotels/${hotel.slug}`}
                    onClick={(event) => event.stopPropagation()}
                    className="pointer-events-auto inline-flex w-fit items-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-[12px] font-extrabold text-white shadow-lg transition duration-200 hover:bg-teal-500"
                  >
                    Explore Experiences <ArrowRight className="size-3.5" />
                  </Link>
                  <Link
                    href={`/hotels/${hotel.slug}`}
                    onClick={(event) => event.stopPropagation()}
                    className="pointer-events-auto hidden w-fit items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-[12px] font-extrabold text-white backdrop-blur transition hover:bg-white/20 sm:inline-flex"
                  >
                    <Play className="size-3.5 fill-white" />
                    Watch Preview
                  </Link>
                </div>
              </div>

              <div className="pointer-events-none absolute bottom-20 right-6 z-30 hidden w-[min(340px,calc(100%-40px))] md:block lg:right-16">
                <div className="rounded-2xl border border-white/25 bg-white/20 p-5 text-white shadow-[0_24px_60px_rgba(15,23,42,0.28)] backdrop-blur-xl">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/60">Now showing</p>
                      <h3 className="mt-2 line-clamp-1 text-lg font-extrabold leading-snug text-white">{hotel.title}</h3>
                    </div>
                    {hotel.rating > 0 ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[12px] font-extrabold text-white">
                        <Star className="size-3 fill-amber-400 text-amber-400" />
                        {hotel.rating.toFixed(1)}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-white/65">
                    <MapPin className="size-3.5 shrink-0" />
                    {hotel.location}
                  </p>
                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-white/65">{hotel.description}</p>
                  <div className="mt-5 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">Starting from</p>
                      <p className="mt-1 text-xl font-extrabold text-white">
                        Rs.&nbsp;{hotel.price.toLocaleString()}
                        <span className="ml-1 text-[11px] font-normal text-white/50">/night</span>
                      </p>
                      {savePct > 0 ? <p className="text-[11px] font-semibold text-teal-200">Save {savePct}% today</p> : null}
                    </div>
                    <Link
                      href={`/hotels/${hotel.slug}`}
                      onClick={(event) => event.stopPropagation()}
                      className="pointer-events-auto flex size-10 items-center justify-center rounded-xl bg-white text-slate-950 transition hover:bg-teal-50"
                      aria-label={`View ${hotel.title}`}
                    >
                      <ArrowRight className="size-4" />
                    </Link>
                  </div>
                </div>
              </div>

              <span className="absolute bottom-4 right-4 z-10 text-[10px] font-semibold text-white/45">
                {idx + 1} / {hotels.length}
              </span>
            </div>
          )
        })}
      </div>

      <button
        type="button"
        onClick={() => scrollToIndex((currentIndex - 1 + hotels.length) % hotels.length)}
        className="absolute left-3 top-1/2 z-20 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-slate-950/30 text-white backdrop-blur-sm transition hover:bg-white hover:text-slate-950 sm:flex"
        aria-label="Previous slide"
      >
        <ChevronLeft className="size-4" />
      </button>
      <button
        type="button"
        onClick={() => scrollToIndex((currentIndex + 1) % hotels.length)}
        className="absolute right-3 top-1/2 z-20 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-slate-950/30 text-white backdrop-blur-sm transition hover:bg-white hover:text-slate-950 sm:flex"
        aria-label="Next slide"
      >
        <ChevronRight className="size-4" />
      </button>

      <div className="absolute bottom-0 left-0 right-0 z-10 h-[2px] bg-white/15">
        <div className="h-full bg-white/60 transition-all duration-500" style={{ width: `${((currentIndex + 1) / hotels.length) * 100}%` }} />
      </div>
    </section>
  )
}
