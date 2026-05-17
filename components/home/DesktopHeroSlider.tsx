"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { ArrowRight, BadgePercent, MapPin, Play, Star } from "lucide-react"
import { Autoplay, EffectFade, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/effect-fade"
import "swiper/css/pagination"
import api from "@/lib/axios"
import type { HomeHotel } from "./home-types"

const fallbackImage = "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=1800&q=85"
const fallbackGradients = ["linear-gradient(115deg, #04152d 0%, #0b3a56 55%, #0e7490 100%)", "linear-gradient(115deg, #1f1235 0%, #0f172a 55%, #0f766e 100%)", "linear-gradient(115deg, #0b1023 0%, #1f2937 55%, #075985 100%)"]

function mapApiHotel(h: Record<string, unknown>): HomeHotel {
  const images = (h.HotelImage as { url: string; isCover?: boolean }[]) ?? []
  const rooms = (h.Room as { pricePerNight: number; originalPrice?: number | null }[]) ?? []
  const price = rooms.length ? Math.min(...rooms.map((room) => room.pricePerNight)) : Number(h.pricePerNight ?? 0)
  const originalPrice = rooms.length ? Math.min(...rooms.map((room) => room.originalPrice ?? room.pricePerNight)) : price
  const city = String(h.city ?? "")
  const country = String(h.country ?? "India")

  return {
    slug: String(h.slug ?? h.id ?? ""),
    title: String(h.title ?? "Luxury Stay"),
    location: [city, country].filter(Boolean).join(", "),
    city,
    country,
    price,
    originalPrice,
    rating: Number(h.averageRating ?? 0),
    image: images.find((image) => image.isCover)?.url ?? images[0]?.url ?? fallbackImage,
    description: String(h.description ?? "Curated boutique hotels and luxury experiences for the discerning global traveler."),
  }
}

export default function DesktopHeroSlider() {
  const [slides, setSlides] = useState<HomeHotel[]>([])

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const { data: payload } = await api.get("/hotel?random=5")
        const next = ((payload?.data ?? []) as Record<string, unknown>[]).map(mapApiHotel).filter((hotel) => hotel.slug)
        if (!cancelled) setSlides(next)
      } catch (error) {
        console.error(error)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const heroSlides =
    slides.length > 0
      ? slides
      : [
          {
            slug: "",
            title: "Find Your Next Extraordinary Stay",
            location: "Curated luxury destinations",
            city: "",
            country: "",
            price: 1250,
            originalPrice: 0,
            rating: 4.9,
            image: fallbackImage,
            description: "Curated boutique hotels and luxury experiences for the discerning global traveler.",
          },
        ]

  return (
    <section className="relative h-[560px] overflow-hidden bg-slate-950">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        loop={heroSlides.length > 1}
        autoplay={{ delay: 4500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        className="h-full"
      >
        {heroSlides.map((hotel, index) => {
          const href = hotel.slug ? `/hotels/${hotel.slug}` : "/hotels"
          const gradient = fallbackGradients[index % fallbackGradients.length]

          return (
            <SwiperSlide key={hotel.slug || `fallback-${index}`}>
              <div className="relative h-full">
                <div className="absolute inset-0" style={{ background: gradient }} />
                <img
                  src={hotel.image || fallbackImage}
                  alt={hotel.title}
                  className="absolute inset-0 h-full w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = "none"
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/88 via-slate-950/48 to-slate-950/10" />
                <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-slate-950/60 to-transparent" />

                <div className="absolute inset-y-0 left-0 z-20 flex max-w-3xl flex-col justify-center gap-4 px-8 text-white sm:px-12 lg:px-16">
                  <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.18em] backdrop-blur-sm">
                    <BadgePercent className="size-3 text-teal-300" />
                    Featured experience
                  </span>
                  <h1 className="max-w-[610px] text-5xl font-black leading-[0.95] tracking-tight drop-shadow md:text-6xl">
                    Find Your Next Extraordinary Stay
                  </h1>
                  <p className="max-w-md text-sm leading-6 text-white/78">{hotel.description}</p>
                  <div className="flex flex-wrap items-center gap-3">
                    <Link href={href} className="inline-flex w-fit items-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-[12px] font-extrabold text-white shadow-lg transition duration-200 hover:bg-teal-500">
                      Explore Experiences <ArrowRight className="size-3.5" />
                    </Link>
                    <Link href={href} className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-[12px] font-extrabold text-white backdrop-blur transition hover:bg-white/20">
                      <Play className="size-3.5 fill-white" />
                      Watch Preview
                    </Link>
                  </div>
                </div>

                <div className="absolute bottom-20 right-8 z-20 hidden w-[330px] rounded-2xl border border-white/25 bg-white/20 p-5 text-white shadow-2xl backdrop-blur-xl lg:block">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/60">Now showing</p>
                      <h2 className="mt-2 line-clamp-1 text-lg font-extrabold">{hotel.title}</h2>
                    </div>
                    {hotel.rating > 0 ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[12px] font-extrabold">
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
                      <p className="mt-1 text-xl font-extrabold">
                        Rs.&nbsp;{Math.max(0, hotel.price).toLocaleString()}
                        <span className="ml-1 text-[11px] font-normal text-white/50">/night</span>
                      </p>
                    </div>
                    <Link href={href} className="flex size-10 items-center justify-center rounded-xl bg-white text-slate-950 transition hover:bg-teal-50" aria-label={`View ${hotel.title}`}>
                      <ArrowRight className="size-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </section>
  )
}
