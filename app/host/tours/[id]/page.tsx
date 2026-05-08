"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft, Map, Tag, Globe, ChevronDown, Plus, Trash2, ImageIcon,
  CheckCircle, XCircle, Mountain, CalendarDays
} from "lucide-react"
import PhotoUploader from "@/components/ui/PhotoUploader"
import type { DynamicListProps, HostFormSectionCardProps, ItineraryDay, TourForm } from "@/types/host-forms"

const inputCls = "w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-cyan-100 focus:border-cyan-400 focus:bg-white transition"
const labelCls = "block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5"

function SectionCard({ icon, title, color = "blue", children }: HostFormSectionCardProps) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600", emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600", violet: "bg-violet-50 text-violet-600",
    rose: "bg-rose-50 text-rose-600", slate: "bg-slate-100 text-slate-600",
    green: "bg-green-50 text-green-600",
  }
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4">
        <span className={`flex size-8 shrink-0 items-center justify-center rounded-md ${colors[color]}`}>{icon}</span>
        <h3 className="text-[15px] font-bold text-slate-900">{title}</h3>
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

function DynamicList({ items, onChange, onAdd, onRemove, placeholder }: DynamicListProps) {
  return (
    <div className="space-y-2.5">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <input className={inputCls} value={item} placeholder={placeholder} onChange={e => onChange(idx, e.target.value)} />
          {items.length > 1 && (
            <button type="button" onClick={() => onRemove(idx)}
              className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500 transition hover:bg-red-100">
              <Trash2 size={14} />
            </button>
          )}
        </div>
      ))}
      <button type="button" onClick={onAdd}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-slate-200 py-2.5 text-sm font-semibold text-slate-500 transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700">
        <Plus size={14} /> Add item
      </button>
    </div>
  )
}

export default function HostTourForm() {
  const router = useRouter()
  const params = useParams()
  const tourId = params?.id as string
  const isEdit = !!tourId && tourId !== "new"
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const makeItinerary = (days: number): ItineraryDay[] =>
    Array.from({ length: days }, (_, i) => ({ day: i + 1, title: "", description: "", activities: [""], meals: ["Breakfast"] }))

  const [form, setForm] = useState<TourForm>({
    title: "", slug: "", description: "", destination: "",
    city: "", state: "", country: "India", latitude: "", longitude: "",
    duration: "3", maxGroupSize: "15", pricePerPerson: "", originalPrice: "",
    totalSlots: "15", availableSlots: "15",
    difficulty: "MODERATE", category: "Adventure", languages: "English",
    cancellationPolicy: "", status: "PENDING_REVIEW",
    highlights: [""], included: ["Accommodation", "Meals", "Guide", "Local Transport"],
    excluded: ["International Flights", "Travel Insurance"],
    images: [""], itinerary: makeItinerary(3),
  })

  useEffect(() => { if (isEdit) fetchTour() }, [isEdit])

  const fetchTour = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/tour/${tourId}?scope=mine`)
      if (res.ok) { const { data } = await res.json(); setForm(prev => ({ ...prev, ...data })) }
    } catch { /* use defaults */ } finally { setLoading(false) }
  }

  const set = (field: keyof TourForm, value: unknown) => setForm(prev => ({ ...prev, [field]: value }))

  const updateArr = (field: "highlights" | "included" | "excluded" | "images", idx: number, val: string) => {
    const next = [...form[field] as string[]]; next[idx] = val; set(field, next)
  }
  const addArr = (field: "highlights" | "included" | "excluded" | "images") => set(field, [...form[field] as string[], ""])
  const removeArr = (field: "highlights" | "included" | "excluded" | "images", idx: number) =>
    set(field, (form[field] as string[]).filter((_, i) => i !== idx))

  const updateItiActivity = (dayIdx: number, aIdx: number, val: string) => {
    const next = [...form.itinerary]; const acts = [...next[dayIdx].activities]; acts[aIdx] = val
    next[dayIdx] = { ...next[dayIdx], activities: acts }; set("itinerary", next)
  }

  const handleDurationChange = (val: string) => {
    const n = Math.max(1, Math.min(30, parseInt(val) || 1))
    set("duration", String(n))
    const current = form.itinerary
    if (n > current.length) {
      set("itinerary", [...current, ...makeItinerary(n - current.length).map((d, i) => ({ ...d, day: current.length + i + 1 }))])
    } else { set("itinerary", current.slice(0, n)) }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true)
    try {
      const res = await fetch(isEdit ? `/api/tour/${tourId}` : "/api/tour", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      router.push("/host")
    } catch { alert("Could not save tour. Please try again.") }
    finally { setSubmitting(false) }
  }

  if (loading) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
    </div>
  )

  return (
    <div className="mx-auto max-w-4xl pb-24">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/host" className="flex size-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Tour listing</p>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            {isEdit ? "Edit Tour Package" : "Add New Tour Package"}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* ── BASICS ── */}
        <SectionCard icon={<Map size={16} />} title="Tour Basics">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelCls}>Tour Title *</label>
              <input className={inputCls} required placeholder="e.g. Manali–Leh Adventure 7D/6N" value={form.title}
                onChange={e => { set("title", e.target.value); if (!isEdit) set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")) }} />
            </div>
            <div>
              <label className={labelCls}>URL Slug *</label>
              <input className={inputCls} required placeholder="manali-leh-7d" value={form.slug}
                onChange={e => set("slug", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Category</label>
              <div className="relative">
                <select className={inputCls + " appearance-none pr-10"} value={form.category}
                  onChange={e => set("category", e.target.value)}>
                  {["Adventure","Wellness","Heritage","Water","Food","Culture","Nature","Sports"].map(c =>
                    <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Description *</label>
              <textarea className={inputCls} rows={4} required
                placeholder="What makes this tour unique? Describe the experience, highlights, and who it's best for."
                value={form.description} onChange={e => set("description", e.target.value)} />
            </div>
          </div>
        </SectionCard>

        {/* ── PRICING & DETAILS ── */}
        <SectionCard icon={<Tag size={16} />} title="Pricing &amp; Details" color="emerald">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            <div>
              <label className={labelCls}>Duration (Days) *</label>
              <input className={inputCls} required type="number" min="1" max="30" value={form.duration}
                onChange={e => handleDurationChange(e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Max Group Size</label>
              <input className={inputCls} type="number" min="1" value={form.maxGroupSize}
                onChange={e => set("maxGroupSize", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Total Tour Slots</label>
              <input className={inputCls} type="number" min="1" value={form.totalSlots}
                onChange={e => set("totalSlots", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Available Slots</label>
              <input className={inputCls} type="number" min="0" max={Number(form.totalSlots) || undefined} value={form.availableSlots}
                onChange={e => set("availableSlots", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Difficulty</label>
              <div className="relative">
                <select className={inputCls + " appearance-none pr-10"} value={form.difficulty}
                  onChange={e => set("difficulty", e.target.value)}>
                  {["EASY","MODERATE","HARD","EXPERT"].map(d =>
                    <option key={d} value={d}>{d[0] + d.slice(1).toLowerCase()}</option>)}
                </select>
                <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
            <div>
              <label className={labelCls}>Price / Person (₹) *</label>
              <input className={inputCls} required type="number" min="0" placeholder="12000" value={form.pricePerPerson}
                onChange={e => set("pricePerPerson", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Original Price (₹)</label>
              <input className={inputCls} type="number" min="0" placeholder="15000" value={form.originalPrice}
                onChange={e => set("originalPrice", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Languages</label>
              <input className={inputCls} placeholder="English, Hindi" value={form.languages}
                onChange={e => set("languages", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Listing Status</label>
              <div className="relative">
                <select className={inputCls + " appearance-none pr-10"} value={form.status}
                  onChange={e => set("status", e.target.value)}>
                  {["DRAFT","PENDING_REVIEW","PAUSED"].map(s =>
                    <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                </select>
                <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Cancellation Policy</label>
              <input className={inputCls} placeholder="e.g. Free cancellation 7 days before departure" value={form.cancellationPolicy}
                onChange={e => set("cancellationPolicy", e.target.value)} />
            </div>
          </div>
        </SectionCard>

        {/* ── DESTINATION ── */}
        <SectionCard icon={<Globe size={16} />} title="Destination" color="amber">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelCls}>Destination *</label>
              <input className={inputCls} required placeholder="e.g. Manali to Leh via Rohtang Pass" value={form.destination}
                onChange={e => set("destination", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>City</label>
              <input className={inputCls} placeholder="Start city" value={form.city} onChange={e => set("city", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>State</label>
              <input className={inputCls} placeholder="State / Province" value={form.state} onChange={e => set("state", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Country</label>
              <input className={inputCls} placeholder="Country" value={form.country} onChange={e => set("country", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Latitude <span className="normal-case font-normal text-slate-400">(optional GPS)</span></label>
              <input className={inputCls} type="number" step="any" placeholder="e.g. 32.2432" value={form.latitude}
                onChange={e => set("latitude", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Longitude <span className="normal-case font-normal text-slate-400">(optional GPS)</span></label>
              <input className={inputCls} type="number" step="any" placeholder="e.g. 77.1892" value={form.longitude}
                onChange={e => set("longitude", e.target.value)} />
            </div>
          </div>
        </SectionCard>

        {/* ── HIGHLIGHTS ── */}
        <SectionCard icon={<Mountain size={16} />} title="Tour Highlights" color="violet">
          <DynamicList items={form.highlights}
            onChange={(i, v) => updateArr("highlights", i, v)} onAdd={() => addArr("highlights")}
            onRemove={(i) => removeArr("highlights", i)} placeholder="e.g. Sunrise at Pangong Tso Lake" />
        </SectionCard>

        {/* ── INCLUDED / EXCLUDED ── */}
        <div className="grid gap-5 sm:grid-cols-2">
          <SectionCard icon={<CheckCircle size={16} />} title="What's Included" color="green">
            <DynamicList items={form.included}
              onChange={(i, v) => updateArr("included", i, v)} onAdd={() => addArr("included")}
              onRemove={(i) => removeArr("included", i)} placeholder="e.g. All meals" />
          </SectionCard>
          <SectionCard icon={<XCircle size={16} />} title="Not Included" color="rose">
            <DynamicList items={form.excluded}
              onChange={(i, v) => updateArr("excluded", i, v)} onAdd={() => addArr("excluded")}
              onRemove={(i) => removeArr("excluded", i)} placeholder="e.g. Travel insurance" />
          </SectionCard>
        </div>

        {/* ── ITINERARY ── */}
        <SectionCard icon={<CalendarDays size={16} />} title="Day-wise Itinerary">
          <div className="space-y-4">
            {form.itinerary.map((day, dayIdx) => (
              <div key={dayIdx} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-[12px] font-black text-blue-700">{day.day}</span>
                  <input className={inputCls} placeholder={`Day ${day.day} title — e.g. Arrival & Acclimatization`}
                    value={day.title} onChange={e => { const n = [...form.itinerary]; n[dayIdx].title = e.target.value; set("itinerary", n) }} />
                </div>
                <textarea className={inputCls + " mb-3"} rows={2} placeholder="Describe what happens on this day…"
                  value={day.description} onChange={e => { const n = [...form.itinerary]; n[dayIdx].description = e.target.value; set("itinerary", n) }} />
                <div>
                  <p className={labelCls}>Activities</p>
                  <div className="space-y-2">
                    {day.activities.map((act, aIdx) => (
                      <div key={aIdx} className="flex items-center gap-2">
                        <input className={inputCls} placeholder="e.g. Rohtang Pass sightseeing" value={act}
                          onChange={e => updateItiActivity(dayIdx, aIdx, e.target.value)} />
                        {day.activities.length > 1 && (
                          <button type="button"
                            onClick={() => { const n = [...form.itinerary]; n[dayIdx].activities = n[dayIdx].activities.filter((_, i) => i !== aIdx); set("itinerary", n) }}
                            className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-400 hover:bg-red-100">
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button type="button"
                      onClick={() => { const n = [...form.itinerary]; n[dayIdx].activities.push(""); set("itinerary", n) }}
                      className="text-[12px] font-semibold text-blue-600 hover:underline">
                      + Add activity
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* ── IMAGES ── */}
        <SectionCard icon={<ImageIcon size={16} />} title="Photos" color="slate">
          <PhotoUploader images={form.images} onChange={urls => set("images", urls)} />
        </SectionCard>

        {/* ── STICKY FOOTER ── */}
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:px-6">
          <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
            <p className="text-[12px] text-slate-500">Your tour will be submitted for review before going live.</p>
            <div className="flex gap-3">
              <Link href="/host" className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                Cancel
              </Link>
              <button type="submit" disabled={submitting}
                className="flex items-center gap-2 rounded-lg bg-slate-950 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-cyan-700 disabled:opacity-60">
                {submitting ? (
                  <><span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Saving…</>
                ) : (isEdit ? "Save Changes" : "Create Tour")}
              </button>
            </div>
          </div>
        </div>

      </form>
    </div>
  )
}
