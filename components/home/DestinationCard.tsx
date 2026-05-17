"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { HomeDestination } from "./home-types"

export default function DestinationCard({ destination }: { destination: HomeDestination }) {
  return (
    <Link
      href={`/hotels?city=${encodeURIComponent(destination.city)}`}
      className="group relative block h-[74px] overflow-hidden rounded-2xl bg-slate-900 shadow-lg"
    >
      {destination.image ? <img src={destination.image} alt={destination.city} className="size-full object-cover" loading="lazy" /> : null}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/82 via-slate-950/35 to-transparent" />
      <div className="absolute inset-y-0 left-0 flex flex-col justify-center px-4 text-white">
        <p className="text-sm font-black">
          {destination.city}, {destination.country}
        </p>
        <p className="mt-0.5 text-[11px] text-white/70">{destination.stays} premium stays</p>
      </div>
      <div className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition group-hover:bg-white group-hover:text-slate-950">
        <ArrowRight className="size-4" />
      </div>
    </Link>
  )
}
