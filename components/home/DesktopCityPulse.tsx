"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { ArrowLeft, ArrowRight, Landmark, Sparkles, Utensils } from "lucide-react"
import api from "@/lib/axios"

const insightCatalog: Record<string, { title: string; text: string }[]> = {
  dehradun: [
    { title: "Himalayan Gateway", text: "Mussoorie, Rishikesh, and premium hill routes are within quick reach." },
    { title: "Forest & Waterfall Trails", text: "Nearby drives unlock serene nature circuits perfect for short luxury breaks." },
    { title: "Regional Flavor Scene", text: "Garhwali specialties and modern cafes create a diverse food trail." },
  ],
  mumbai: [
    { title: "Arabian Coastline", text: "A rare blend of sea-facing skyline, heritage districts, and luxury waterfront stays." },
    { title: "Year-Round Cultural Calendar", text: "The city hosts high-energy events, galleries, and live experiences every month." },
    { title: "Iconic Food Belt", text: "From fine-dining to historic street-food districts, Mumbai delivers nonstop variety." },
  ],
  jaipur: [
    { title: "Royal Architecture", text: "Fortified palaces and heritage facades define one of India's richest visual landscapes." },
    { title: "Artisan Capital", text: "Textiles, jewelry, and handcraft neighborhoods shape Jaipur's premium shopping routes." },
    { title: "Festival-rich Evenings", text: "Colorful processions and courtyard performances animate the city throughout the year." },
  ],
  goa: [
    { title: "Coastal Luxury Strip", text: "Curated beach enclaves combine privacy, nightlife, and boutique hospitality." },
    { title: "Portuguese Heritage", text: "Old neighborhoods and churches offer one of India's most distinct built identities." },
    { title: "Seafood Signature", text: "Local spice profiles and global fusion kitchens create a unique culinary route." },
  ],
}

const defaultFacts = [
  { title: "40 UNESCO Heritage Sites", text: "India hosts some of the world's most significant cultural landmarks across every region." },
  { title: "1,000+ Annual Festivals", text: "Experience the vibrant pulse of local traditions through a calendar of non-stop celebrations." },
  { title: "The Spice Route", text: "Discover infinite regional spice blends that define the diverse culinary map of the nation." },
]

const factIcons = [Landmark, Sparkles, Utensils]

export default function DesktopCityPulse() {
  const [locationLabel, setLocationLabel] = useState("your city")
  const [cityKey, setCityKey] = useState("")

  useEffect(() => {
    let cancelled = false

    async function detectFromCoords(latitude: number, longitude: number) {
      try {
        const { data } = await api.get(`/location/gps?lat=${latitude}&lng=${longitude}`)
        const city = String(data?.city ?? "").trim()
        const country = String(data?.country ?? "India").trim()

        if (cancelled) return

        if (city) {
          setLocationLabel(`${city}, ${country}`)
          setCityKey(city.toLowerCase())
          return
        }

        setLocationLabel(country || "India")
      } catch {
        if (!cancelled) setLocationLabel("India")
      }
    }

    if (!navigator.geolocation) {
      setLocationLabel("India")
      return () => {
        cancelled = true
      }
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        detectFromCoords(coords.latitude, coords.longitude)
      },
      () => {
        if (!cancelled) setLocationLabel("India")
      },
      { timeout: 5000 },
    )

    return () => {
      cancelled = true
    }
  }, [])

  const facts = useMemo(() => {
    const matchedKey = Object.keys(insightCatalog).find((key) => cityKey.includes(key))
    return matchedKey ? insightCatalog[matchedKey] : defaultFacts
  }, [cityKey])

  return (
    <section className="overflow-hidden bg-[#f4f7f8] py-20 text-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex items-end justify-between gap-6">
          <div>
            <h2 className="text-4xl font-black tracking-tight text-slate-950">City Pulse</h2>
            <p className="mt-3 text-base text-slate-500">Useful facts near {locationLabel} with live location context.</p>
          </div>
          <div className="flex gap-2">
            <button className="flex size-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50" aria-label="Previous">
              <ArrowLeft className="size-4" />
            </button>
            <button className="flex size-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50" aria-label="Next">
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.36fr_1fr] lg:items-stretch">
          <div className="group relative h-[500px] overflow-hidden rounded-[32px] bg-slate-950 shadow-2xl shadow-slate-950/15">
            <Image
              src="https://images.unsplash.com/photo-1477587458883-47145ed6979e?auto=format&fit=crop&w=1200&q=85"
              alt="Jaipur Heritage"
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover transition duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/82 via-slate-950/10 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <div className="mb-3 flex items-center gap-2">
                <Sparkles className="size-5 text-teal-300" />
                <span className="text-sm font-black uppercase tracking-[0.18em]">Did you know?</span>
              </div>
              <p className="max-w-3xl text-2xl font-semibold leading-snug">
                Based on your location, we surface facts, local routes, and seasonal experiences to help you plan better stays.
              </p>
            </div>
          </div>

          <div className="grid gap-6">
            {facts.map((fact, index) => {
              const Icon = factIcons[index % factIcons.length]
              return (
              <div key={fact.title} className="group flex items-start gap-6 rounded-[32px] border border-slate-200 bg-white p-8 transition hover:border-teal-600">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 transition group-hover:bg-teal-700 group-hover:text-white">
                  <Icon className="size-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-950">{fact.title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-slate-500">{fact.text}</p>
                </div>
              </div>
            )})}
          </div>
        </div>
      </div>
    </section>
  )
}
