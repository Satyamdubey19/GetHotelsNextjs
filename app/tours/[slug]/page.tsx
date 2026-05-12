"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  AlertCircle,
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  Camera,
  Check,
  ChevronDown,
  ChevronUp,
  CircleHelp,
  Clock,
  Compass,
  Copy,
  Heart,
  ImageIcon,
  IndianRupee,
  Languages,
  Lock,
  MapPin,
  MessageCircle,
  Minus,
  Navigation,
  Phone,
  Plus,
  Route,
  Send,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  UserCheck,
  Users,
  X,
} from "lucide-react"
import Header from "@/components/layout/Header/Header"
import Footer from "@/components/layout/Footer/Footer"
import { GroupBooking } from "@/components/tour/GroupBooking"
import { TourCard } from "@/components/tour/TourCard"
import { tours, type Tour } from "@/lib/tours"

type AccordionKey = "cancellation" | "refund" | "rules" | "safety" | "docs" | "eligibility"

const navItems = [
  ["overview", "Overview"],
  ["gallery", "Gallery"],
  ["itinerary", "Itinerary"],
  ["safety", "Safety"],
  ["host", "Host"],
  ["reviews", "Reviews"],
  ["location", "Location"],
  ["faq", "FAQ"],
]

function formatMoney(value: number) {
  return `INR ${value.toLocaleString("en-IN")}`
}

function makeDate(offsetDays: number) {
  const date = new Date()
  date.setDate(date.getDate() + offsetDays)
  return date
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(date)
}

function parseGroupSize(value: string) {
  const numbers = value.match(/\d+/g)?.map(Number) || [8]
  const total = numbers[numbers.length - 1] || 12
  return { total, left: Math.max(2, Math.round(total * 0.35)) }
}

function difficultyFor(tour: Tour) {
  if (tour.tags.some((tag) => ["trekking", "mountain", "safari"].includes(tag))) return "Moderate"
  if (tour.category === "adventure") return "Hard"
  return "Easy"
}

function SectionTitle({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <div className="mb-6">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-700">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">{title}</h2>
      {description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{description}</p> : null}
    </div>
  )
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700">{icon}</div>
      <p className="mt-4 text-xs font-black uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-black text-slate-950">{value}</p>
    </div>
  )
}

function Badge({ children, tone = "slate" }: { children: React.ReactNode; tone?: "slate" | "cyan" | "emerald" | "amber" | "rose" }) {
  const tones = {
    slate: "bg-white/15 text-white ring-white/25",
    cyan: "bg-cyan-50 text-cyan-800 ring-cyan-200",
    emerald: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    amber: "bg-amber-50 text-amber-800 ring-amber-200",
    rose: "bg-rose-50 text-rose-800 ring-rose-200",
  }
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-black ring-1 ${tones[tone]}`}>{children}</span>
}

export default function TourDetailPage() {
  const params = useParams()
  const slug = typeof params.slug === "string" ? params.slug : ""
  const [tour, setTour] = useState<Tour | null>(() => tours.find((item) => item.slug === slug) ?? null)
  const [isLoadingTour, setIsLoadingTour] = useState(true)
  const [liked, setLiked] = useState(false)
  const [copied, setCopied] = useState(false)
  const [bookingModal, setBookingModal] = useState(false)
  const [lightbox, setLightbox] = useState<string | null>(null)
  const [expandedDays, setExpandedDays] = useState<number[]>([1])
  const [expandedPolicy, setExpandedPolicy] = useState<AccordionKey>("cancellation")
  const [guestCount, setGuestCount] = useState(1)
  const [readMore, setReadMore] = useState(false)

  useEffect(() => {
    if (!slug) {
      setIsLoadingTour(false)
      return
    }

    let ignore = false

    const loadTour = async () => {
      try {
        const response = await fetch(`/api/tour/${slug}`, { cache: "no-store" })
        if (response.ok) {
          const payload = await response.json()
          if (!ignore && payload?.data) {
            setTour(payload.data)
            return
          }
        }

        if (!ignore) {
          setTour(tours.find((item) => item.slug === slug) ?? null)
        }
      } catch {
        if (!ignore) {
          setTour(tours.find((item) => item.slug === slug) ?? null)
        }
      } finally {
        if (!ignore) setIsLoadingTour(false)
      }
    }

    loadTour()

    return () => {
      ignore = true
    }
  }, [slug])

  const computed = useMemo(() => {
    if (!tour) return null
    const group = parseGroupSize(tour.groupSize)
    const startDate = makeDate(24)
    const endDate = makeDate(24 + tour.duration - 1)
    const registrationDeadline = makeDate(17)
    const originalPrice = Math.round(tour.price * 1.18)
    const discount = Math.round(((originalPrice - tour.price) / originalPrice) * 100)
    const difficulty = difficultyFor(tour)
    const womenOnly = tour.womenOnly ?? (tour.tags.includes("beach") ? false : tour.category === "adventure")
    const soloWomenSafe = tour.safeForSoloWomen ?? tour.category !== "wildlife"
    const verifiedOnly = tour.verifiedTravelersOnly ?? difficulty !== "Easy"
    const approvalRequired = tour.joinApprovalRequired ?? false
    return { group, startDate, endDate, registrationDeadline, originalPrice, discount, difficulty, womenOnly, soloWomenSafe, verifiedOnly, approvalRequired }
  }, [tour])

  if (isLoadingTour) {
    return (
      <>
        <Header />
        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
          <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h1 className="text-2xl font-black text-slate-950">Loading tour...</h1>
            <p className="mt-2 text-sm text-slate-600">Fetching latest tour details.</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (!tour || !computed) {
    return (
      <>
        <Header />
        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
          <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <MapPin className="mx-auto h-10 w-10 text-slate-400" />
            <h1 className="mt-4 text-2xl font-black text-slate-950">Tour not found</h1>
            <p className="mt-2 text-sm text-slate-600">This tour may be unavailable or removed.</p>
            <Link href="/tours" className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white">
              <ArrowLeft className="h-4 w-4" />
              Browse tours
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const similarTours = tours.filter((item) => item.slug !== tour.slug && (item.category === tour.category || item.location.city === tour.location.city)).slice(0, 3)
  const gallery = tour.gallery.length ? tour.gallery : [tour.image]
  const totalAmount = tour.price * guestCount

  const share = async () => {
    if (navigator.share) {
      await navigator.share({ title: tour.title, url: window.location.href })
      return
    }
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  const safetyCards = [
    { label: "Women-only tour", enabled: computed.womenOnly, text: "Participation can be limited for women-focused departures." },
    { label: "Safe for solo women", enabled: computed.soloWomenSafe, text: "Route, stays, transfers, and host support are reviewed for solo travelers." },
    { label: "Verified travelers only", enabled: computed.verifiedOnly, text: "Identity and trust signals can be required before joining." },
    { label: "Host approval required", enabled: computed.approvalRequired, text: "The host reviews join requests to keep the group compatible." },
  ]

  const participants = [
    { name: "Aarohi", style: "Solo traveler", trust: 92, language: "Hindi, English" },
    { name: "Kabir", style: "Backpacker", trust: 86, language: "English" },
    { name: "Naina", style: "Culture seeker", trust: 89, language: "Punjabi, English" },
  ]

  const reviews = [
    { name: "Meera S.", rating: 5, text: "The host made the entire group feel safe and included. The itinerary had enough adventure without feeling rushed.", tag: "Verified traveler" },
    { name: "Rohan P.", rating: 5, text: "Great mix of local experiences, clean stays, and clear communication. The group chat before the trip was very helpful.", tag: "Group trip" },
    { name: "Isha K.", rating: 4, text: "Loved the route and the people. Pickup instructions and meal details were shared well in advance.", tag: "Solo traveler" },
  ]

  const policies: Record<AccordionKey, { title: string; body: string }> = {
    cancellation: { title: "Cancellation policy", body: "Free cancellation up to 7 days before departure. Partial refund may apply after that depending on committed stays and permits." },
    refund: { title: "Refund policy", body: "Eligible refunds are processed to the original payment method after host and operations review." },
    rules: { title: "Group rules", body: "Respect group timings, local culture, shared spaces, and host safety instructions throughout the trip." },
    safety: { title: "Safety rules", body: "Carry ID, emergency contacts, personal medication, and follow route or weather advisories from the host." },
    docs: { title: "Required documents", body: "Government ID is required. Some routes may need permits, which the host will coordinate before departure." },
    eligibility: { title: "Eligibility", body: "Travelers should be physically comfortable with the stated difficulty and disclose medical concerns before joining." },
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50 pb-24">
        <section className="relative min-h-[86vh] overflow-hidden bg-slate-950 text-white">
          <div className="absolute inset-0">
            <img src={gallery[0]} alt={tour.title} className="h-full w-full object-cover opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-slate-950/10" />
            <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-slate-50 to-transparent" />
          </div>

          <div className="relative mx-auto flex min-h-[86vh] max-w-7xl flex-col justify-end px-4 pb-10 pt-28 sm:px-6 lg:px-8">
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <Link href="/tours" className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-black text-white ring-1 ring-white/25 backdrop-blur transition hover:bg-white/25">
                <ArrowLeft className="h-3.5 w-3.5" />
                All tours
              </Link>
              <Badge><Sparkles className="h-3.5 w-3.5" />{tour.category}</Badge>
              <Badge><ShieldCheck className="h-3.5 w-3.5" />{computed.difficulty}</Badge>
              <Badge><Users className="h-3.5 w-3.5" />{computed.group.left} slots left</Badge>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
              <div>
                <p className="flex items-center gap-2 text-sm font-bold text-white/80"><MapPin className="h-4 w-4" />{tour.destination}</p>
                <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl lg:text-7xl">{tour.title}</h1>
                <div className="mt-5 flex flex-wrap items-center gap-4 text-sm">
                  <span className="inline-flex items-center gap-1.5 font-black"><Star className="h-4 w-4 fill-amber-400 text-amber-400" />{tour.rating} rating</span>
                  <span className="text-white/70">{tour.reviews} verified reviews</span>
                  <span className="text-white/70">{tour.duration} days</span>
                  <span className="text-white/70">{formatMoney(tour.price)} per person</span>
                </div>
                <p className="mt-5 max-w-2xl text-base leading-8 text-white/80">{tour.description}</p>
              </div>

              <div className="rounded-2xl border border-white/20 bg-white/15 p-4 shadow-2xl backdrop-blur-xl">
                <div className="grid grid-cols-2 gap-3">
                  {gallery.slice(1, 5).map((image, index) => (
                    <button key={image} onClick={() => setLightbox(image)} className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-white/10">
                      <img src={image} alt={`${tour.title} gallery ${index + 1}`} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                    </button>
                  ))}
                </div>
                <button onClick={() => setLightbox(gallery[0])} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-50">
                  <Camera className="h-4 w-4" />
                  View all photos
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
            {navItems.map(([id, label]) => (
              <a key={id} href={`#${id}`} className="shrink-0 rounded-full px-4 py-2 text-sm font-black text-slate-600 transition hover:bg-slate-100 hover:text-slate-950">
                {label}
              </a>
            ))}
          </div>
        </div>

        <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8">
          <div className="space-y-12">
            <section id="overview" className="scroll-mt-24">
              <SectionTitle eyebrow="Experience" title="A trip designed for stories, safety, and community" description="Everything travelers need to understand the route, group, host, inclusions, safety posture, and social experience." />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <InfoCard icon={<Clock className="h-5 w-5" />} label="Duration" value={`${tour.duration} days`} />
                <InfoCard icon={<Users className="h-5 w-5" />} label="Group size" value={tour.groupSize} />
                <InfoCard icon={<ShieldCheck className="h-5 w-5" />} label="Difficulty" value={computed.difficulty} />
                <InfoCard icon={<Languages className="h-5 w-5" />} label="Languages" value="English, Hindi" />
                <InfoCard icon={<Compass className="h-5 w-5" />} label="Category" value={tour.category} />
                <InfoCard icon={<CalendarDays className="h-5 w-5" />} label="Start date" value={formatDate(computed.startDate)} />
                <InfoCard icon={<CalendarDays className="h-5 w-5" />} label="End date" value={formatDate(computed.endDate)} />
                <InfoCard icon={<Lock className="h-5 w-5" />} label="Deadline" value={formatDate(computed.registrationDeadline)} />
              </div>

              <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-black text-slate-950">Tour overview</h3>
                <p className={`mt-3 text-base leading-8 text-slate-700 ${readMore ? "" : "line-clamp-4"}`}>
                  {tour.description} This experience is built for travelers who want more than a checklist trip. Expect shared meals, local culture, thoughtful pacing, host-led coordination, and a group setting where introductions, expectations, and safety notes are handled before departure.
                </p>
                <button onClick={() => setReadMore(!readMore)} className="mt-4 text-sm font-black text-cyan-700 hover:text-cyan-900">
                  {readMore ? "Show less" : "Read more"}
                </button>
              </div>
            </section>

            <section id="gallery" className="scroll-mt-24">
              <SectionTitle eyebrow="Gallery" title="See the journey before you join" />
              <div className="grid gap-3 sm:grid-cols-4">
                {gallery.slice(0, 5).map((image, index) => (
                  <button key={image} onClick={() => setLightbox(image)} className={`group relative overflow-hidden rounded-2xl bg-slate-200 ${index === 0 ? "sm:col-span-2 sm:row-span-2" : ""}`}>
                    <img src={image} alt={`${tour.title} photo ${index + 1}`} className="aspect-[4/3] h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-slate-950/0 transition group-hover:bg-slate-950/20" />
                  </button>
                ))}
              </div>
            </section>

            <section className="scroll-mt-24">
              <SectionTitle eyebrow="Highlights" title="What makes this trip special" />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {tour.highlights.map((highlight, index) => (
                  <div key={highlight} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700"><Sparkles className="h-5 w-5" /></div>
                    <h3 className="mt-4 font-black text-slate-950">{highlight}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">Curated moment {index + 1} from the route, designed for photos, shared memories, and local context.</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="itinerary" className="scroll-mt-24">
              <SectionTitle eyebrow="Itinerary" title="Day-wise travel timeline" description="Expand each day to understand the route, activities, meals, and travel rhythm." />
              <div className="mb-4 flex flex-wrap gap-2">
                {tour.itinerary.map((day) => (
                  <button key={day.day} onClick={() => setExpandedDays((current) => current.includes(day.day) ? current.filter((item) => item !== day.day) : [...current, day.day])} className={`rounded-full px-4 py-2 text-xs font-black transition ${expandedDays.includes(day.day) ? "bg-slate-950 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200"}`}>
                    Day {day.day}
                  </button>
                ))}
              </div>
              <div className="space-y-4">
                {tour.itinerary.map((day) => {
                  const open = expandedDays.includes(day.day)
                  return (
                    <article key={day.day} className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                      <button onClick={() => setExpandedDays((current) => open ? current.filter((item) => item !== day.day) : [...current, day.day])} className="flex w-full items-center justify-between gap-4 p-5 text-left">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-700 text-sm font-black text-white">D{day.day}</div>
                          <div>
                            <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700">Today's experience</p>
                            <h3 className="mt-1 text-lg font-black text-slate-950">{day.title}</h3>
                          </div>
                        </div>
                        {open ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                      </button>
                      {open ? (
                        <div className="border-t border-slate-100 p-5">
                          <p className="text-sm leading-7 text-slate-600">{day.description}</p>
                          <div className="mt-5 grid gap-4 lg:grid-cols-2">
                            <div className="rounded-2xl bg-slate-50 p-4">
                              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Activities</p>
                              <div className="mt-3 flex flex-wrap gap-2">
                                {day.activities.map((activity) => <span key={activity} className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-700 ring-1 ring-slate-200">{activity}</span>)}
                              </div>
                            </div>
                            <div className="rounded-2xl bg-emerald-50 p-4">
                              <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Meals</p>
                              <div className="mt-3 flex flex-wrap gap-2">
                                {day.meals.map((meal) => <span key={meal} className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">{meal}</span>)}
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 grid gap-4 md:grid-cols-2">
                            <div className="rounded-2xl border border-slate-200 p-4 text-sm text-slate-600"><Route className="mb-2 h-4 w-4 text-cyan-700" />Travel notes and transfers are coordinated by the host.</div>
                            <div className="rounded-2xl border border-slate-200 p-4 text-sm text-slate-600"><MapPin className="mb-2 h-4 w-4 text-cyan-700" />Stay or accommodation notes are shared before departure.</div>
                          </div>
                        </div>
                      ) : null}
                    </article>
                  )
                })}
              </div>
            </section>

            <section className="scroll-mt-24">
              <SectionTitle eyebrow="Inclusions" title="What's included and what's not" />
              <div className="grid gap-5 lg:grid-cols-2">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
                  <h3 className="flex items-center gap-2 text-lg font-black text-emerald-900"><Check className="h-5 w-5" />Included</h3>
                  <ul className="mt-4 space-y-3">
                    {tour.budget.inclusions.map((item) => <li key={item} className="flex gap-3 text-sm font-semibold text-emerald-900"><Check className="mt-0.5 h-4 w-4 shrink-0" />{item}</li>)}
                  </ul>
                </div>
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6">
                  <h3 className="flex items-center gap-2 text-lg font-black text-rose-900"><X className="h-5 w-5" />Excluded</h3>
                  <ul className="mt-4 space-y-3">
                    {tour.budget.exclusions.map((item) => <li key={item} className="flex gap-3 text-sm font-semibold text-rose-900"><X className="mt-0.5 h-4 w-4 shrink-0" />{item}</li>)}
                  </ul>
                </div>
              </div>
            </section>

            <section id="safety" className="scroll-mt-24">
              <SectionTitle eyebrow="Trust" title="Safety and access controls" description="Community travel works best when travelers understand who can join, how the host manages the group, and what support exists during the trip." />
              <div className="grid gap-4 sm:grid-cols-2">
                {safetyCards.map((card) => (
                  <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${card.enabled ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                        {card.enabled ? <ShieldCheck className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-black ${card.enabled ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{card.enabled ? "Enabled" : "Not required"}</span>
                    </div>
                    <h3 className="mt-4 font-black text-slate-950">{card.label}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{card.text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {["24/7 emergency escalation", "Verified host operations", "Community guidelines enforced"].map((item) => (
                  <div key={item} className="rounded-2xl bg-slate-950 p-5 text-white">
                    <ShieldCheck className="h-5 w-5 text-cyan-300" />
                    <p className="mt-3 text-sm font-black">{item}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="host" className="scroll-mt-24">
              <SectionTitle eyebrow="Host" title="Meet your trip host" />
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-cyan-50 text-2xl font-black text-cyan-800">GH</div>
                    <div>
                      <h3 className="flex items-center gap-2 text-xl font-black text-slate-950">GetHotels Experiences <BadgeCheck className="h-5 w-5 text-cyan-700" /></h3>
                      <p className="mt-1 text-sm text-slate-600">Verified tour operator · {tour.location.city}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {["4.8 host rating", "42 hosted tours", "3 years hosting", "92% response rate"].map((item) => <span key={item} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">{item}</span>)}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-700 hover:bg-slate-50">View profile</button>
                    <button className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white hover:bg-cyan-700">Message host</button>
                  </div>
                </div>
              </div>
            </section>

            <section className="scroll-mt-24">
              <SectionTitle eyebrow="Community" title="Meet your travel group" description="Preview the kind of travelers joining this departure." />
              <div className="grid gap-4 md:grid-cols-3">
                {participants.map((person) => (
                  <div key={person.name} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 font-black text-cyan-800">{person.name[0]}</div>
                      <Badge tone="emerald"><UserCheck className="h-3.5 w-3.5" />Verified</Badge>
                    </div>
                    <h3 className="mt-4 font-black text-slate-950">{person.name}</h3>
                    <p className="mt-1 text-sm text-slate-600">{person.style}</p>
                    <p className="mt-3 text-xs font-bold text-slate-500">Trust score {person.trust} · {person.language}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="scroll-mt-24">
              <SectionTitle eyebrow="Chat" title="Tour chat preview" />
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="space-y-3">
                  {["Host: Welcome call scheduled 7 days before departure.", "Traveler: Can we confirm pickup near the main market?", "System: Join the tour to unlock the full group chat."].map((message, index) => (
                    <div key={message} className={`max-w-2xl rounded-2xl p-4 text-sm font-semibold ${index === 0 ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-700"}`}>{message}</div>
                  ))}
                </div>
                <button onClick={() => setBookingModal(true)} className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-cyan-700 px-5 py-3 text-sm font-black text-white hover:bg-cyan-800">
                  <MessageCircle className="h-4 w-4" />
                  Join tour to unlock chat
                </button>
              </div>
            </section>

            <section id="reviews" className="scroll-mt-24">
              <SectionTitle eyebrow="Reviews" title="Trusted by verified travelers" />
              <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-5xl font-black text-slate-950">{tour.rating}</p>
                  <div className="mt-2 flex gap-1">{Array.from({ length: 5 }).map((_, index) => <Star key={index} className="h-4 w-4 fill-amber-400 text-amber-400" />)}</div>
                  <p className="mt-2 text-sm text-slate-600">{tour.reviews} verified reviews</p>
                  {[5, 4, 3, 2, 1].map((star) => <div key={star} className="mt-3 flex items-center gap-2 text-xs"><span>{star}</span><div className="h-2 flex-1 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-amber-400" style={{ width: `${star === 5 ? 72 : star === 4 ? 18 : 5}%` }} /></div></div>)}
                </div>
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.name} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div><p className="font-black text-slate-950">{review.name}</p><p className="text-xs font-bold text-cyan-700">{review.tag}</p></div>
                        <div className="flex items-center gap-1 text-sm font-black"><Star className="h-4 w-4 fill-amber-400 text-amber-400" />{review.rating}</div>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-600">{review.text}</p>
                      <button className="mt-3 text-xs font-black text-slate-500 hover:text-cyan-700">Helpful</button>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section id="location" className="scroll-mt-24">
              <SectionTitle eyebrow="Location" title="Destination and route feel" />
              <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
                <div className="relative min-h-80 overflow-hidden rounded-2xl border border-slate-200 bg-[linear-gradient(135deg,#ecfeff_0%,#f8fafc_45%,#dbeafe_100%)] p-6 shadow-inner">
                  <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(#94a3b8_1px,transparent_1px),linear-gradient(90deg,#94a3b8_1px,transparent_1px)] [background-size:34px_34px]" />
                  <div className="relative flex h-full min-h-72 flex-col justify-between">
                    <div className="rounded-2xl bg-white/85 p-4 shadow-sm backdrop-blur">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Route overview</p>
                      <h3 className="mt-1 font-black text-slate-950">{tour.destination}</h3>
                    </div>
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cyan-700 text-white shadow-xl"><Navigation className="h-8 w-8" /></div>
                    <p className="relative rounded-2xl bg-slate-950/85 px-4 py-3 text-sm font-bold text-white">Coordinates: {tour.location.lat}, {tour.location.lng}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {["Pickup point shared after booking", "Nearby stays curated by host", "Route and weather updates before travel"].map((item) => (
                    <div key={item} className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-bold text-slate-700 shadow-sm"><MapPin className="mb-2 h-4 w-4 text-cyan-700" />{item}</div>
                  ))}
                </div>
              </div>
            </section>

            <section className="scroll-mt-24">
              <SectionTitle eyebrow="Policies" title="Rules, refunds, and eligibility" />
              <div className="space-y-3">
                {(Object.keys(policies) as AccordionKey[]).map((key) => {
                  const open = expandedPolicy === key
                  return (
                    <div key={key} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                      <button onClick={() => setExpandedPolicy(key)} className="flex w-full items-center justify-between p-5 text-left">
                        <span className="font-black text-slate-950">{policies[key].title}</span>
                        {open ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                      </button>
                      {open ? <p className="border-t border-slate-100 p-5 text-sm leading-7 text-slate-600">{policies[key].body}</p> : null}
                    </div>
                  )
                })}
              </div>
            </section>

            <section id="faq" className="scroll-mt-24">
              <SectionTitle eyebrow="FAQ" title="Common questions" />
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  ["Can I join solo?", "Yes. This tour is designed for community travel and solo travelers are welcome."],
                  ["When does chat unlock?", "Group chat unlocks after booking or approved join request."],
                  ["Are meals included?", "Included meals are listed day-wise and in the inclusions section."],
                  ["Can the host reject a request?", "Yes, when host approval is enabled for safety or group compatibility."],
                ].map(([question, answer]) => (
                  <div key={question} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <CircleHelp className="h-5 w-5 text-cyan-700" />
                    <h3 className="mt-3 font-black text-slate-950">{question}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{answer}</p>
                  </div>
                ))}
              </div>
            </section>

            {similarTours.length > 0 ? (
              <section className="scroll-mt-24">
                <SectionTitle eyebrow="Similar" title="More trips you may like" />
                <div className="grid gap-5 md:grid-cols-3">
                  {similarTours.map((item) => <TourCard key={item.slug} tour={item} />)}
                </div>
              </section>
            ) : null}
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.10)]">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">From</p>
                    <p className="mt-1 text-3xl font-black text-slate-950">{formatMoney(tour.price)}</p>
                    <p className="text-sm text-slate-500 line-through">{formatMoney(computed.originalPrice)}</p>
                  </div>
                  <Badge tone="amber">{computed.discount}% off</Badge>
                </div>
                <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm font-black text-slate-950">{computed.group.left} of {computed.group.total} slots remaining</p>
                  <p className="mt-1 text-xs text-slate-500">{formatDate(computed.startDate)} to {formatDate(computed.endDate)}</p>
                </div>
                <div className="mt-5 flex items-center justify-between rounded-2xl border border-slate-200 p-3">
                  <span className="text-sm font-black text-slate-700">Travelers</span>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setGuestCount(Math.max(1, guestCount - 1))} className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100"><Minus className="h-4 w-4" /></button>
                    <span className="font-black">{guestCount}</span>
                    <button onClick={() => setGuestCount(Math.min(computed.group.left, guestCount + 1))} className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100"><Plus className="h-4 w-4" /></button>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  {computed.approvalRequired ? <Badge tone="cyan"><Lock className="h-3.5 w-3.5" />Approval required</Badge> : null}
                  {computed.womenOnly ? <Badge tone="rose"><ShieldCheck className="h-3.5 w-3.5" />Women only</Badge> : null}
                  {computed.verifiedOnly ? <Badge tone="emerald"><UserCheck className="h-3.5 w-3.5" />Verified travelers</Badge> : null}
                </div>
                <div className="mt-5 border-t border-slate-100 pt-4">
                  <div className="flex justify-between text-sm"><span className="text-slate-500">{formatMoney(tour.price)} x {guestCount}</span><span className="font-black">{formatMoney(totalAmount)}</span></div>
                </div>
                <button onClick={() => setBookingModal(true)} className="mt-5 w-full rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-slate-950/10 transition hover:bg-cyan-700">
                  {computed.approvalRequired ? "Request to join" : "Join tour"}
                </button>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button onClick={() => setLiked(!liked)} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-700 hover:bg-slate-50"><Heart className={`mr-2 inline h-4 w-4 ${liked ? "fill-rose-500 text-rose-500" : ""}`} />Save</button>
                  <button className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-700 hover:bg-slate-50"><Phone className="mr-2 inline h-4 w-4" />Host</button>
                </div>
              </div>
            </div>
          </aside>
        </section>

        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white p-3 shadow-[0_-18px_45px_rgba(15,23,42,0.1)] lg:hidden">
          <div className="mx-auto flex max-w-7xl items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-500">From</p>
              <p className="truncate text-lg font-black text-slate-950">{formatMoney(tour.price)} <span className="text-xs font-semibold text-slate-500">/ person</span></p>
            </div>
            <button onClick={() => setLiked(!liked)} className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200"><Heart className={`h-5 w-5 ${liked ? "fill-rose-500 text-rose-500" : "text-slate-600"}`} /></button>
            <button onClick={() => setBookingModal(true)} className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white">{computed.approvalRequired ? "Request" : "Join"}</button>
          </div>
        </div>

        <div className="fixed right-4 top-24 z-40 flex flex-col gap-2">
          <button onClick={share} className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-700 shadow-lg ring-1 ring-slate-200 transition hover:bg-cyan-50"><Share2 className="h-5 w-5" /></button>
          <button onClick={() => setLiked(!liked)} className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-700 shadow-lg ring-1 ring-slate-200 transition hover:bg-rose-50"><Heart className={`h-5 w-5 ${liked ? "fill-rose-500 text-rose-500" : ""}`} /></button>
          {copied ? <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-bold text-white">Copied</span> : null}
        </div>

        {lightbox ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4" onClick={() => setLightbox(null)}>
            <button className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-950"><X className="h-5 w-5" /></button>
            <img src={lightbox} alt="Tour preview" className="max-h-[86vh] max-w-full rounded-2xl object-contain shadow-2xl" />
          </div>
        ) : null}

        {bookingModal ? <GroupBooking tour={tour} approvalRequired={computed.approvalRequired} onClose={() => setBookingModal(false)} /> : null}
      </main>
      <Footer />
    </>
  )
}
