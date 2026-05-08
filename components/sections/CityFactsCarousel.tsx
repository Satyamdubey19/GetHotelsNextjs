"use client"

import { useEffect, useMemo, useState } from "react"
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Camera,
  CloudSun,
  Compass,
  Landmark,
  Leaf,
  MapPinned,
  Mountain,
  Navigation,
  Sparkles,
  Utensils,
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import type { CityFact } from "@/types/sections"

const cityFacts: Record<string, CityFact[]> = {
  dehradun: [
    {
      title: "Best Stay Zone",
      value: "Rajpur Road",
      detail: "Central cafes, shopping streets, and quick access toward Mussoorie.",
      icon: MapPinned,
      color: "from-blue-500 to-cyan-400",
    },
    {
      title: "Weather Mood",
      value: "Valley breeze",
      detail: "Mornings are great for walks; evenings cool down fast around the hills.",
      icon: CloudSun,
      color: "from-amber-500 to-orange-400",
    },
    {
      title: "Local Bite",
      value: "Bakery trail",
      detail: "Try old-school bakeries and mountain-style cafes near the city center.",
      icon: Utensils,
      color: "from-rose-500 to-pink-400",
    },
    {
      title: "Quick Escape",
      value: "30-40 min",
      detail: "Sahastradhara and forest drives are easy half-day plans from most stays.",
      icon: Navigation,
      color: "from-emerald-500 to-teal-400",
    },
  ],
  mussoorie: [
    {
      title: "View Point",
      value: "Camel Back",
      detail: "Pick hillside stays for sunrise views and quieter evening walks.",
      icon: Mountain,
      color: "from-indigo-500 to-violet-400",
    },
    {
      title: "Best Window",
      value: "Mar-Jun",
      detail: "Peak pleasant weather, with early bookings recommended for weekends.",
      icon: CalendarDays,
      color: "from-emerald-500 to-lime-400",
    },
    {
      title: "Photo Stop",
      value: "Landour",
      detail: "Colonial lanes, cafes, and pine views make it a slow-travel favorite.",
      icon: Camera,
      color: "from-sky-500 to-blue-400",
    },
    {
      title: "Travel Tip",
      value: "Walk more",
      detail: "Mall Road parking is limited; choose stays with pickup or close access.",
      icon: Compass,
      color: "from-fuchsia-500 to-rose-400",
    },
  ],
  rishikesh: [
    {
      title: "Trip Style",
      value: "Riverfront",
      detail: "Book near Tapovan for cafes, yoga, rafting counters, and bridge access.",
      icon: Leaf,
      color: "from-emerald-500 to-teal-400",
    },
    {
      title: "Adventure Pulse",
      value: "Rafting",
      detail: "Morning slots are usually calmer and leave the day open for exploring.",
      icon: Navigation,
      color: "from-blue-500 to-cyan-400",
    },
    {
      title: "Evening Plan",
      value: "Ganga aarti",
      detail: "Reach early for better seating and a quieter riverside experience.",
      icon: Landmark,
      color: "from-amber-500 to-orange-400",
    },
    {
      title: "Stay Note",
      value: "Quiet lanes",
      detail: "Hill-facing boutique stays are better for remote work and longer visits.",
      icon: Sparkles,
      color: "from-violet-500 to-purple-400",
    },
  ],
  india: [
    {
      title: "Smart Booking",
      value: "Compare areas",
      detail: "Check location, cancellation, and host rating before locking a stay.",
      icon: MapPinned,
      color: "from-blue-500 to-indigo-400",
    },
    {
      title: "Best Value",
      value: "Weekdays",
      detail: "Mid-week stays often have calmer inventory and better deal pricing.",
      icon: CalendarDays,
      color: "from-emerald-500 to-teal-400",
    },
    {
      title: "Local First",
      value: "Ask hosts",
      detail: "Hosts can help with transfers, food recommendations, and nearby tours.",
      icon: Compass,
      color: "from-rose-500 to-orange-400",
    },
    {
      title: "Trip Comfort",
      value: "Plan buffers",
      detail: "Keep extra time for traffic, check-in windows, and weather changes.",
      icon: CloudSun,
      color: "from-violet-500 to-fuchsia-400",
    },
  ],
}

function getCachedCity() {
  if (typeof window === "undefined") return "India"

  try {
    const saved = JSON.parse(localStorage.getItem("userLocation") || "null")
    return saved?.city || "India"
  } catch {
    return "India"
  }
}

function resolveFacts(city: string) {
  const normalizedCity = city.toLowerCase()
  const matchedKey = Object.keys(cityFacts).find((key) => normalizedCity.includes(key))
  return cityFacts[matchedKey ?? "india"]
}

export default function CityFactsCarousel() {
  const [city, setCity] = useState("India")
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const facts = useMemo(() => resolveFacts(city), [city])

  useEffect(() => {
    const syncLocation = () => {
      const nextCity = getCachedCity()
      setCity((currentCity) => (currentCity === nextCity ? currentCity : nextCity))
      setActiveIndex(0)
    }

    const timeout = window.setTimeout(syncLocation, 0)
    window.addEventListener("storage", syncLocation)
    const interval = window.setInterval(syncLocation, 5000)

    return () => {
      window.clearTimeout(timeout)
      window.removeEventListener("storage", syncLocation)
      window.clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    if (isPaused) return

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % facts.length)
    }, 3200)

    return () => window.clearInterval(interval)
  }, [facts.length, isPaused])

  const previous = () => setActiveIndex((current) => (current - 1 + facts.length) % facts.length)
  const next = () => setActiveIndex((current) => (current + 1) % facts.length)

  return (
    <section
      className="overflow-hidden bg-white py-14 lg:py-20"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">City pulse</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Useful facts around {city}.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Location-aware travel notes for better stays, smoother routes, and smarter plans.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="rounded-xl bg-white" onClick={previous} aria-label="Previous city fact">
              <ArrowLeft className="size-4" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-xl bg-white" onClick={next} aria-label="Next city fact">
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-y-6 left-0 hidden w-24 bg-gradient-to-r from-white to-transparent lg:block" />
          <div className="absolute inset-y-6 right-0 hidden w-24 bg-gradient-to-l from-white to-transparent lg:block" />

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 p-4 shadow-2xl shadow-slate-200/70 sm:p-5">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {facts.map((fact, index) => (
                <div key={fact.title} className="min-w-full px-1">
                  <Card className="relative min-h-[280px] overflow-hidden rounded-2xl border-white/10 bg-white/[0.06] py-0 text-white shadow-none ring-0">
                    <div className={`absolute -right-16 -top-20 size-56 rounded-full bg-gradient-to-br ${fact.color} opacity-30 blur-2xl`} />
                    <div className={`absolute bottom-0 left-0 h-1.5 bg-gradient-to-r ${fact.color} transition-all duration-700`} style={{ width: `${((index + 1) / facts.length) * 100}%` }} />
                    <CardContent className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                      <div>
                        <div className={`mb-6 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br ${fact.color} text-white shadow-xl shadow-slate-950/25`}>
                          <fact.icon className="size-7" />
                        </div>
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/50">{fact.title}</p>
                        <h3 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">{fact.value}</h3>
                        <p className="mt-4 max-w-xl text-base leading-7 text-white/68">{fact.detail}</p>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        {facts.map((item, itemIndex) => (
                          <button
                            key={item.title}
                            type="button"
                            onClick={() => setActiveIndex(itemIndex)}
                            className={`group rounded-2xl border p-4 text-left transition ${
                              itemIndex === activeIndex
                                ? "border-white/30 bg-white/15"
                                : "border-white/10 bg-white/[0.04] hover:border-white/25 hover:bg-white/[0.08]"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`flex size-10 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} text-white`}>
                                <item.icon className="size-5" />
                              </div>
                              <div className="min-w-0">
                                <p className="truncate text-sm font-bold text-white">{item.title}</p>
                                <p className="truncate text-xs text-white/48">{item.value}</p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 flex items-center justify-center gap-2">
            {facts.map((fact, index) => (
              <button
                key={fact.title}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  activeIndex === index ? "w-8 bg-slate-950" : "w-2 bg-slate-300 hover:bg-slate-500"
                }`}
                aria-label={`Show ${fact.title}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
