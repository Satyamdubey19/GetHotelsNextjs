"use client"

import Link from "next/link"
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react"
import type { HomeDestination } from "./home-types"

export default function CityStoryCard({ destination }: { destination?: HomeDestination }) {
  if (!destination) return null

  return (
    <section className="px-4">
      <div className="relative h-[330px] overflow-hidden rounded-[28px] bg-slate-950 shadow-2xl shadow-slate-950/15">
        {destination.image ? <img src={destination.image} alt={destination.city} className="size-full object-cover" loading="lazy" /> : null}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/10 via-slate-950/20 to-slate-950/90" />
        <div className="absolute left-4 top-4 rounded-full bg-slate-950/70 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur">
          {destination.city} guide
        </div>
        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <p className="mb-2 flex items-center gap-1 text-[11px] font-semibold text-teal-200">
            <MapPin className="size-3" />
            {destination.city}, {destination.country}
          </p>
          <h3 className="max-w-[260px] text-xl font-black leading-tight">Discover {destination.city} in luxury</h3>
          <p className="mt-2 line-clamp-3 max-w-[285px] text-xs leading-5 text-white/72">
            Discover the most desired luxury stays, city stories, and curated routes selected from live GetHotels inventory.
          </p>
          <div className="mt-5 flex items-center justify-between">
            <Link href={`/hotels?city=${encodeURIComponent(destination.city)}`} className="h-1.5 w-24 overflow-hidden rounded-full bg-white/20">
              <span className="block h-full w-2/3 rounded-full bg-[#5EEAD4]" />
            </Link>
            <div className="flex items-center gap-2">
              <button className="flex size-8 items-center justify-center rounded-full border border-white/15 bg-white/10 backdrop-blur" aria-label="Previous story">
                <ChevronLeft className="size-4" />
              </button>
              <button className="flex size-8 items-center justify-center rounded-full border border-white/15 bg-white/10 backdrop-blur" aria-label="Next story">
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
