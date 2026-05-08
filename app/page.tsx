"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import {
  ArrowRight,
  BadgeCheck,
  BedDouble,
  Headphones,
  Plane,
  ShieldCheck,
  Star,
  WalletCards,
} from "lucide-react"
import Header from "@/components/layout/Header/Header"
import Footer from "@/components/layout/Footer/Footer"
import AIChatWidget from "@/components/AIChatWidget"
import SearchBar from "@/components/search/SearchBar"
import HotelSlider from "@/components/hotel/HotelSlider"
import CityFactsCarousel from "@/components/sections/CityFactsCarousel"
import HomeFeaturedHotels from "@/components/sections/HomeFeaturedHotels"
import HomeFeaturedTours from "@/components/sections/HomeFeaturedTours"



const popularPlaces = [
  {
    name: "Mumbai",
    stays: "38 verified stays",
    image: "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Goa",
    stays: "45 verified stays",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Jaipur",
    stays: "27 verified stays",
    image: "https://images.unsplash.com/photo-1477587458883-47145ed6979e?auto=format&fit=crop&w=800&q=80",
  },
]

const promises = [
  {
    icon: ShieldCheck,
    title: "Verified stays",
    text: "Host profiles, amenities, rooms, and pricing are reviewed before they go live.",
  },
  {
    icon: WalletCards,
    title: "Clear pricing",
    text: "See nightly rates, taxes, and stay details before you commit.",
  },
  {
    icon: Headphones,
    title: "Trip support",
    text: "Get booking help, host coordination, and itinerary assistance when you need it.",
  },
]

export default function Home() {
  const [hotelSearch, setHotelSearch] = useState("")

  return (
    <>
      <Header />

      <main className="bg-white text-slate-950">
        {/* Featured slider */}
        <HotelSlider />

        {/* Search bar — floats below slider with shadow overlap */}
        <section className="relative z-20 -mt-9 pb-6">
          <SearchBar onSearch={setHotelSearch} />
        </section>

        {/* Trust bar */}
        <section className="border-y border-slate-100 bg-white px-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-slate-100 md:grid-cols-4">
            {[
              { value: "120+", label: "Verified stays", icon: BedDouble },
              { value: "32", label: "Tour routes", icon: Plane },
              { value: "4.8★", label: "Average rating", icon: Star },
              { value: "24/7", label: "Booking support", icon: Headphones },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 px-4 py-4 sm:px-6 sm:py-5">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#081428]/10 text-[#081428]">
                  <item.icon className="size-4" />
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-950">{item.value}</p>
                  <p className="text-[11px] font-medium text-slate-500">{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured hotels */}
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#081428]">Featured properties</p>
              <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Beautiful stays, ready when you are</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                Fresh picks from verified hosts across India.
              </p>
            </div>
            <Link
              href="/hotels"
              className="inline-flex w-fit items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-[#081428] hover:bg-[#081428] hover:text-white"
            >
              View all hotels
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <HomeFeaturedHotels searchQuery={hotelSearch} />
        </section>

        {/* Popular destinations */}
        <section className="bg-slate-50 py-10 lg:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#081428]">Popular destinations</p>
              <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Explore by city</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {popularPlaces.map((place) => (
                <Link
                  key={place.name}
                  href={`/hotels?city=${place.name}`}
                  className="group relative h-48 overflow-hidden rounded-2xl bg-slate-900 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:h-52"
                >
                  {place.image && (
                    <Image
                      src={place.image}
                      alt={place.name}
                      fill
                      sizes="(min-width: 640px) 33vw, 100vw"
                      className="object-cover opacity-80 transition duration-500 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                    <p className="text-lg font-bold">{place.name}</p>
                    <p className="mt-0.5 text-sm text-white/70">{place.stays}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured tours */}
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#081428]">Curated tours</p>
              <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Trips with the itinerary already shaped.</h2>
            </div>
            <Link
              href="/tours"
              className="inline-flex w-fit items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-[#081428] hover:bg-[#081428] hover:text-white"
            >
              View all tours
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <HomeFeaturedTours />
        </section>

        {/* Promise bar */}
        <section className="bg-[#081428] py-12 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-4 md:grid-cols-3">
              {promises.map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.05] p-5">
                  <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-white text-slate-950">
                    <item.icon className="size-5" />
                  </div>
                  <h3 className="text-base font-bold">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-white/60">{item.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xl font-bold">Ready for your next stay?</p>
                <p className="mt-1 text-sm text-white/55">Search hotels, compare rooms, and reserve in one smooth flow.</p>
              </div>
              <Link
                href="/hotels"
                className="inline-flex h-11 w-fit items-center gap-2 rounded-xl bg-white px-5 text-sm font-bold text-[#081428] transition hover:bg-white/90"
              >
                Find a stay
                <BadgeCheck className="size-4" />
              </Link>
            </div>
          </div>
        </section>

        <CityFactsCarousel />
      </main>

      <Footer />
      <AIChatWidget />
    </>
  )
}
