"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { ArrowRight, BadgeCheck, BedDouble, Headphones, Plane, ShieldCheck, Star, WalletCards } from "lucide-react"
import Header from "@/components/layout/Header/Header"
import AIChatWidget from "@/components/AIChatWidget"
import SearchBar from "@/components/search/SearchBar"
import HomeFeaturedHotels from "@/components/sections/HomeFeaturedHotels"
import HomeFeaturedTours from "@/components/sections/HomeFeaturedTours"
import HomeFooter from "@/components/home/HomeFooter"
import DesktopCityPulse from "./DesktopCityPulse"
import DesktopHeroSlider from "./DesktopHeroSlider"

const popularPlaces = [
  {
    name: "Mumbai",
    state: "342 stays",
    tagline: "Experience the city of dreams where luxury meets heritage.",
    image: "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Goa",
    state: "191 stays",
    tagline: "Sun-kissed beaches and vibrant colonial architecture.",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Jaipur",
    state: "289 stays",
    tagline: "Regal palaces and timeless heritage of the Pink City.",
    image: "https://images.unsplash.com/photo-1477587458883-47145ed6979e?auto=format&fit=crop&w=900&q=80",
  },
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
    icon: Headphones,
    title: "Trip Support",
    text: "Our concierge team is available 24/7 via the app for real-time assistance during your journey.",
  },
]

export default function DesktopHome() {
  const [hotelSearch, setHotelSearch] = useState("")

  return (
    <>
      <Header />
      <main className="overflow-x-hidden bg-[#f4f7f8] text-slate-950">
        <DesktopHeroSlider />

        <section className="relative z-20 -mt-12 px-4 pb-8 sm:px-6 lg:px-8">
          <SearchBar onSearch={setHotelSearch} />
        </section>

        <section className="border-y border-slate-100 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-4 divide-x divide-slate-100">
              {[
                { value: "10k+", label: "Stays", sub: "Verified luxury properties", icon: BedDouble },
                { value: "500+", label: "Routes", sub: "Curated tour itineraries", icon: Plane },
                { value: "4.9/5", label: "Stars", sub: "Average user satisfaction", icon: Star },
                { value: "24/7", label: "Support", sub: "Real-time trip assistance", icon: Headphones },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-center gap-3.5 px-6 py-7">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-teal-700">
                    <item.icon className="size-4" />
                  </div>
                  <div>
                    <p className="text-xl font-black leading-none text-slate-950">{item.value}</p>
                    <p className="mt-0.5 text-xs font-bold text-slate-700">{item.label}</p>
                    <p className="mt-0.5 text-[10px] text-slate-400">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-end justify-between gap-6">
              <div>
                <h2 className="text-3xl font-black tracking-tight text-slate-950">Explore Popular Cities</h2>
                <p className="mt-2 text-sm text-slate-500">Start your journey in India&apos;s most vibrant hubs.</p>
              </div>
              <Link href="/hotels" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 transition hover:text-teal-700">
                See all destinations <ArrowRight className="size-4" />
              </Link>
            </div>

            <div className="grid gap-7 md:grid-cols-3">
              {popularPlaces.map((place) => (
                <Link
                  key={place.name}
                  href={`/hotels?city=${place.name}`}
                  className="group relative overflow-hidden rounded-[18px] bg-slate-900 shadow-xl shadow-slate-950/15 transition duration-300 hover:-translate-y-1"
                  style={{ aspectRatio: "4 / 5" }}
                >
                  <Image src={place.image} alt={place.name} fill sizes="33vw" className="object-cover opacity-90 transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/88 via-slate-950/20 to-transparent" />
                  <div className="absolute left-5 top-5 rounded-full bg-teal-600 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">
                    {place.state}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <p className="text-3xl font-black">{place.name}</p>
                    <p className="mt-2 text-sm leading-6 text-white/72">{place.tagline}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-white">
                      View Collection <ArrowRight className="size-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#f4f7f8] py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-3xl font-black tracking-tight text-slate-950">Highly Rated Stays</h2>
              <p className="mt-2 text-sm text-slate-500">Top-tier luxury as rated by our global community.</p>
            </div>
            <HomeFeaturedHotels searchQuery={hotelSearch} />
          </div>
        </section>

        <section className="bg-[#f4f7f8] pb-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-end justify-between gap-6">
              <div>
                <h2 className="text-3xl font-black tracking-tight text-slate-950">Top Tour Picks</h2>
                <p className="mt-2 text-sm text-slate-500">Join curated group adventures and guided routes across India.</p>
              </div>
              <Link href="/tours" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 transition hover:text-teal-700">
                See all tours <ArrowRight className="size-4" />
              </Link>
            </div>
            <HomeFeaturedTours />
          </div>
        </section>

        <DesktopCityPulse />

        <section className="bg-white py-16 text-slate-950">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-7 md:grid-cols-3">
              {promises.map((item) => (
                <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-7 shadow-sm">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                    <item.icon className="size-5" />
                  </div>
                  <h3 className="mt-6 text-base font-black text-slate-950">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 flex items-center justify-between rounded-[28px] bg-teal-700 px-10 py-8 text-white shadow-xl shadow-teal-900/10">
              <div>
                <p className="text-2xl font-black">Ready for your next stay?</p>
                <p className="mt-1.5 text-sm text-white/70">Join 50,000+ travelers exploring the extraordinary.</p>
              </div>
              <div className="flex gap-3">
                <Link href="/signup" className="rounded-xl bg-white px-6 py-3 text-sm font-black text-slate-950">
                  Sign Up Now
                </Link>
                <Link href="/hotels" className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-3 text-sm font-black text-white">
                  View All Offers <BadgeCheck className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <HomeFooter />
      <AIChatWidget />
    </>
  )
}
