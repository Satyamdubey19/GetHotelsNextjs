"use client"

import Link from "next/link"
import { MapPin, Star } from "lucide-react"
import { motion } from "framer-motion"
import { Autoplay, EffectFade, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/effect-fade"
import "swiper/css/pagination"
import { Badge } from "@/components/ui/badge"
import type { HomeHotel } from "./home-types"

export default function HeroSlider({ hotels, loading }: { hotels: HomeHotel[]; loading: boolean }) {
  if (loading) {
    return <section className="h-[250px] animate-pulse bg-slate-200" />
  }

  if (!hotels.length) {
    return (
      <section className="flex h-[250px] items-center bg-slate-950 px-5 text-white">
        <div>
          <Badge className="bg-teal-100 text-teal-900">Featured Luxury</Badge>
          <h1 className="mt-3 text-2xl font-black leading-tight">Escape to your next premium stay</h1>
          <p className="mt-2 text-sm text-white/70">Search premium hotels and travel experiences.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="relative h-[250px] overflow-hidden bg-slate-950">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        loop={hotels.length > 1}
        autoplay={{ delay: 4200, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        className="h-full"
      >
        {hotels.slice(0, 5).map((hotel) => (
          <SwiperSlide key={hotel.slug}>
            <Link href={`/hotels/${hotel.slug}`} className="group relative block h-full">
              {hotel.image ? (
                <img src={hotel.image} alt={hotel.title} className="absolute inset-0 h-full w-full object-cover" loading="eager" />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-b from-slate-950/35 via-slate-950/20 to-slate-950/86" />
              <div className="absolute inset-x-0 bottom-11 px-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                  className="max-w-[300px]"
                >
                  <Badge className="bg-white/90 text-[#0F766E] shadow-sm backdrop-blur">Featured Luxury</Badge>
                  <h1 className="mt-2 text-[32px] font-black leading-[0.96] tracking-tight text-white">{hotel.title}</h1>
                  <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-white/75">
                    <MapPin className="size-3.5" />
                    {hotel.location}
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <span className="inline-flex h-8 items-center rounded-lg bg-[#0F766E] px-3.5 text-[11px] font-black text-white shadow-lg shadow-teal-950/20">
                      View Hotel
                    </span>
                    {hotel.rating > 0 ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
                        <Star className="size-3 fill-amber-300 text-amber-300" />
                        {hotel.rating.toFixed(1)}
                      </span>
                    ) : null}
                  </div>
                </motion.div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}
