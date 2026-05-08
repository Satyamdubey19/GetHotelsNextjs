"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft, Building2, MapPin, Phone, Star,
  Wifi, Waves, Dumbbell, Utensils, Wine, BriefcaseBusiness, ParkingCircle,
  ConciergeBell, SprayCan, Shirt, PawPrint, Plus, Trash2, ImageIcon,
  ChevronDown, ShieldCheck, Home
} from "lucide-react"
import PhotoUploader from "@/components/ui/PhotoUploader"
import axios from "axios"
import type { HostFormSectionCardProps, HotelFormData as FormData, RoomEntry } from "@/types/host-forms"

const amenityOptions = [
  { label: "Free WiFi", icon: Wifi },
  { label: "Swimming Pool", icon: Waves },
  { label: "Gym", icon: Dumbbell },
  { label: "Restaurant", icon: Utensils },
  { label: "Bar", icon: Wine },
  { label: "Conference Room", icon: BriefcaseBusiness },
  { label: "Parking", icon: ParkingCircle },
  { label: "Room Service", icon: ConciergeBell },
  { label: "Spa", icon: SprayCan },
  { label: "Laundry", icon: Shirt },
  { label: "Pet Friendly", icon: PawPrint },
  { label: "Air Conditioning", icon: Star },
]

const roomAmenityOptions = [
  "Air Conditioning", "Flat-screen TV", "Mini Bar", "Balcony", "Sea View",
  "Mountain View", "Safe", "Bathtub", "Rain Shower", "Hairdryer",
  "Tea & Coffee", "Iron & Board", "Work Desk", "Sofa",
]

const blankRoom = (): RoomEntry => ({
  name: "", type: "STANDARD", description: "", pricePerNight: "", originalPrice: "",
  capacity: "2", maxAdults: "2", maxChildren: "1", totalRooms: "1", availableRooms: "1",
  bedConfiguration: "", sizeSqFt: "", viewType: "",
  smokingAllowed: false, amenities: [], images: [], cancellationPolicy: "",
})

const inputCls = "w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-cyan-100 focus:border-cyan-400 focus:bg-white transition"
const labelCls = "block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5"

function SectionCard({ icon, title, color = "blue", children }: HostFormSectionCardProps) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    violet: "bg-violet-50 text-violet-600",
    rose: "bg-rose-50 text-rose-600",
    slate: "bg-slate-100 text-slate-600",
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

export default function HostHotelForm() {
  const router = useRouter()
  const params = useParams()
  const hotelId = params?.id as string
  const isEdit = !!hotelId && hotelId !== "new"
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState<FormData>({
    title: "", slug: "", description: "", propertyType: "HOTEL", starRating: "3",
    status: "DRAFT", phone: "", email: "", checkInTime: "14:00", checkOutTime: "11:00",
    cancellationPolicy: "", petPolicy: "", childPolicy: "",
    location: "", address: "", city: "", state: "", country: "India", postalCode: "",
    latitude: "", longitude: "",
    amenities: [], rules: [""], images: [""], rooms: [blankRoom()],
  })

  useEffect(() => { if (isEdit) fetchHotel() }, [isEdit])

  const fetchHotel = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`/api/host/hotels/${hotelId}`)
      if (res.status === 200) {
        const payload = res.data as { data?: Partial<FormData> }
        if (payload.data) setForm(prev => ({ ...prev, ...payload.data }))
      }
    } catch (error) {
      const message = axios.isAxiosError<{ error?: string }>(error)
        ? error.response?.data?.error ?? "Could not load hotel data. Please try again."
        : "Could not load hotel data. Please try again."
      alert(message)
    } finally { setLoading(false) }
  }


  const set = (field: keyof FormData, value: unknown) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const toggleAmenity = (a: string) =>
    set("amenities", form.amenities.includes(a) ? form.amenities.filter(x => x !== a) : [...form.amenities, a])

  const updateList = (field: "rules" | "images", idx: number, value: string) => {
    const next = [...form[field]]; next[idx] = value; set(field, next)
  }
  const addToList = (field: "rules" | "images") => set(field, [...form[field], ""])
  const removeFromList = (field: "rules" | "images", idx: number) =>
    set(field, form[field].filter((_, i) => i !== idx))

  const updateRoom = (idx: number, field: keyof RoomEntry, value: string | boolean) => {
    const next = [...form.rooms]; next[idx] = { ...next[idx], [field]: value }; set("rooms", next)
  }
  const updateRoomImages = (idx: number, urls: string[]) => {
    const next = [...form.rooms]; next[idx] = { ...next[idx], images: urls }; set("rooms", next)
  }
  const toggleRoomAmenity = (roomIdx: number, amenity: string) => {
    const current = form.rooms[roomIdx].amenities
    const updated = current.includes(amenity) ? current.filter(a => a !== amenity) : [...current, amenity]
    const next = [...form.rooms]; next[roomIdx] = { ...next[roomIdx], amenities: updated }; set("rooms", next)
  }
  const addRoom = () => set("rooms", [...form.rooms, blankRoom()])
  const removeRoom = (idx: number) => set("rooms", form.rooms.filter((_, i) => i !== idx))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true)
    try {
      if (isEdit) {
        await axios.put(`/api/host/hotels/${hotelId}`, form)
      } else {
        await axios.post("/api/host/hotels", form)
      }
      router.push("/host")
    } catch (error) {
      console.error("Hotel save error:", error)
      const message = axios.isAxiosError<{ error?: string }>(error)
        ? error.response?.data?.error ?? `Server error ${error.response?.status ?? ""}: Could not save hotel.`
        : (error instanceof Error ? error.message : "Could not save hotel. Please try again.")
      alert(message)
    }
    finally { setSubmitting(false) }
  }

  if (loading) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
    </div>
  )

  return (
    <div className="mx-auto max-w-4xl pb-24">
      {/* Page header */}
      <div className="mb-6 flex items-center gap-4">
        <Link href="/host" className="flex size-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Hotel listing</p>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            {isEdit ? "Edit Hotel" : "Add New Hotel"}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* ── BASICS ── */}
        <SectionCard icon={<Building2 size={16} />} title="Basic Information">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelCls}>Hotel Name *</label>
              <input className={inputCls} required placeholder="e.g. The Grand Himalaya Resort" value={form.title}
                onChange={e => { set("title", e.target.value); if (!isEdit) set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")) }} />
            </div>
            <div>
              <label className={labelCls}>URL Slug *</label>
              <input className={inputCls} required placeholder="grand-himalaya-resort" value={form.slug}
                onChange={e => set("slug", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Property Type</label>
              <div className="relative">
                <select className={inputCls + " appearance-none pr-10"} value={form.propertyType}
                  onChange={e => set("propertyType", e.target.value)}>
                  {["HOTEL","APARTMENT","VILLA","RESORT","HOMESTAY","GUESTHOUSE"].map(t =>
                    <option key={t} value={t}>{t[0] + t.slice(1).toLowerCase()}</option>)}
                </select>
                <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
            <div>
              <label className={labelCls}>Star Rating</label>
              <div className="relative">
                <select className={inputCls + " appearance-none pr-10"} value={form.starRating}
                  onChange={e => set("starRating", e.target.value)}>
                  {["1","2","3","4","5"].map(s => <option key={s} value={s}>{s} Star{s !== "1" ? "s" : ""}</option>)}
                </select>
                <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
            {isEdit && (
              <div>
                <label className={labelCls}>Listing Status</label>
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-700">
                  {form.status?.replace(/_/g, " ") || "PENDING REVIEW"}
                </div>
                <p className="mt-1 text-[11px] text-slate-400">Any host edit sends this hotel back to admin review before it appears publicly.</p>
              </div>
            )}
            <div className="sm:col-span-2">
              <label className={labelCls}>Description *</label>
              <textarea className={inputCls} rows={4} required placeholder="Describe your property — surroundings, style, and what makes it special."
                value={form.description} onChange={e => set("description", e.target.value)} />
            </div>
          </div>
        </SectionCard>

        {/* ── CONTACT & POLICIES ── */}
        <SectionCard icon={<Phone size={16} />} title="Contact &amp; Policies" color="emerald">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Phone</label>
              <input className={inputCls} type="tel" placeholder="+91-XXXXXXXXXX" value={form.phone}
                onChange={e => set("phone", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Email</label>
              <input className={inputCls} type="email" placeholder="hotel@example.com" value={form.email}
                onChange={e => set("email", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Check-in Time</label>
              <input className={inputCls} type="time" value={form.checkInTime}
                onChange={e => set("checkInTime", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Check-out Time</label>
              <input className={inputCls} type="time" value={form.checkOutTime}
                onChange={e => set("checkOutTime", e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Cancellation Policy</label>
              <textarea className={inputCls} rows={2} placeholder="e.g. Free cancellation up to 48 hours before check-in."
                value={form.cancellationPolicy} onChange={e => set("cancellationPolicy", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Pet Policy</label>
              <input className={inputCls} placeholder="e.g. Pets allowed with prior notice" value={form.petPolicy}
                onChange={e => set("petPolicy", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Child Policy</label>
              <input className={inputCls} placeholder="e.g. Children under 5 stay free" value={form.childPolicy}
                onChange={e => set("childPolicy", e.target.value)} />
            </div>
          </div>
        </SectionCard>

        {/* ── LOCATION ── */}
        <SectionCard icon={<MapPin size={16} />} title="Location" color="amber">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelCls}>Display Location *</label>
              <input className={inputCls} required placeholder="e.g. Manali, Himachal Pradesh, India" value={form.location}
                onChange={e => set("location", e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Street Address</label>
              <input className={inputCls} placeholder="Full street address" value={form.address}
                onChange={e => set("address", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>City *</label>
              <input className={inputCls} required placeholder="City" value={form.city}
                onChange={e => set("city", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>State</label>
              <input className={inputCls} placeholder="State / Province" value={form.state}
                onChange={e => set("state", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Country</label>
              <input className={inputCls} placeholder="Country" value={form.country}
                onChange={e => set("country", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Postal Code</label>
              <input className={inputCls} placeholder="PIN / ZIP" value={form.postalCode}
                onChange={e => set("postalCode", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Latitude <span className="normal-case font-normal text-slate-400">(optional GPS)</span></label>
              <input className={inputCls} type="number" step="any" placeholder="e.g. 28.6139" value={form.latitude}
                onChange={e => set("latitude", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Longitude <span className="normal-case font-normal text-slate-400">(optional GPS)</span></label>
              <input className={inputCls} type="number" step="any" placeholder="e.g. 77.2090" value={form.longitude}
                onChange={e => set("longitude", e.target.value)} />
            </div>
          </div>
        </SectionCard>

        {/* ── ROOMS ── */}
        <SectionCard icon={<Home size={16} />} title="Room Types" color="violet">
          <div className="space-y-5">
            {form.rooms.map((room, idx) => (
              <div key={idx} className="relative rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Room {idx + 1}</span>
                  {form.rooms.length > 1 && (
                    <button type="button" onClick={() => removeRoom(idx)}
                      className="flex size-7 items-center justify-center rounded-lg bg-red-50 text-red-500 transition hover:bg-red-100">
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <label className={labelCls}>Room Name *</label>
                    <input className={inputCls} required placeholder="e.g. Deluxe King" value={room.name}
                      onChange={e => updateRoom(idx, "name", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Type</label>
                    <div className="relative">
                      <select className={inputCls + " appearance-none pr-8"} value={room.type}
                        onChange={e => updateRoom(idx, "type", e.target.value)}>
                        {["STANDARD","DELUXE","PREMIUM","SUITE","FAMILY","EXECUTIVE"].map(t =>
                          <option key={t} value={t}>{t[0] + t.slice(1).toLowerCase()}</option>)}
                      </select>
                      <ChevronDown size={13} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Price / Night (₹) *</label>
                    <input className={inputCls} required type="number" min="0" placeholder="4500" value={room.pricePerNight}
                      onChange={e => updateRoom(idx, "pricePerNight", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Original Price (₹)</label>
                    <input className={inputCls} type="number" min="0" placeholder="6000" value={room.originalPrice}
                      onChange={e => updateRoom(idx, "originalPrice", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Total Rooms</label>
                    <input className={inputCls} type="number" min="1" value={room.totalRooms}
                      onChange={e => updateRoom(idx, "totalRooms", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Available Rooms</label>
                    <input className={inputCls} type="number" min="0" max={Number(room.totalRooms) || undefined} value={room.availableRooms}
                      onChange={e => updateRoom(idx, "availableRooms", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Capacity</label>
                    <input className={inputCls} type="number" min="1" value={room.capacity}
                      onChange={e => updateRoom(idx, "capacity", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Max Adults</label>
                    <input className={inputCls} type="number" min="1" value={room.maxAdults}
                      onChange={e => updateRoom(idx, "maxAdults", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Max Children</label>
                    <input className={inputCls} type="number" min="0" value={room.maxChildren}
                      onChange={e => updateRoom(idx, "maxChildren", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Size (sq ft)</label>
                    <input className={inputCls} type="number" min="0" placeholder="320" value={room.sizeSqFt}
                      onChange={e => updateRoom(idx, "sizeSqFt", e.target.value)} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Bed Configuration</label>
                    <input className={inputCls} placeholder="e.g. 1 King bed or 2 Twin beds" value={room.bedConfiguration}
                      onChange={e => updateRoom(idx, "bedConfiguration", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>View Type</label>
                    <input className={inputCls} placeholder="e.g. Sea view, Mountain view" value={room.viewType}
                      onChange={e => updateRoom(idx, "viewType", e.target.value)} />
                  </div>
                  <div className="sm:col-span-3">
                    <label className={labelCls}>Room Description</label>
                    <textarea className={inputCls} rows={2} placeholder="Briefly describe this room type..."
                      value={room.description} onChange={e => updateRoom(idx, "description", e.target.value)} />
                  </div>
                  <div className="sm:col-span-3">
                    <label className={labelCls}>Cancellation Policy</label>
                    <input className={inputCls} placeholder="e.g. Free cancellation 24h before check-in" value={room.cancellationPolicy}
                      onChange={e => updateRoom(idx, "cancellationPolicy", e.target.value)} />
                  </div>
                  <div className="sm:col-span-3 flex items-center gap-3">
                    <button type="button"
                      onClick={() => updateRoom(idx, "smokingAllowed", !room.smokingAllowed)}
                      className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                        room.smokingAllowed
                          ? "border-amber-400 bg-amber-50 text-amber-700"
                          : "border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300"
                      }`}>
                      <span>{room.smokingAllowed ? "Smoking allowed" : "No smoking"}</span>
                    </button>
                  </div>
                  <div className="sm:col-span-3">
                    <label className={labelCls}>Room Amenities</label>
                    <div className="flex flex-wrap gap-2">
                      {roomAmenityOptions.map(a => {
                        const active = room.amenities.includes(a)
                        return (
                          <button key={a} type="button" onClick={() => toggleRoomAmenity(idx, a)}
                            className={`rounded-lg border px-3 py-1.5 text-[12px] font-semibold transition ${
                              active ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 bg-slate-50 text-slate-500 hover:border-blue-300"
                            }`}>
                            {a}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  <div className="sm:col-span-3">
                    <label className={labelCls}>Room Photos</label>
                    <PhotoUploader images={room.images} onChange={urls => updateRoomImages(idx, urls)} />
                  </div>
                </div>
              </div>
            ))}
            <button type="button" onClick={addRoom}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-cyan-200 py-3 text-sm font-semibold text-cyan-700 transition hover:border-cyan-400 hover:bg-cyan-50">
              <Plus size={15} /> Add Another Room Type
            </button>
          </div>
        </SectionCard>

        {/* ── AMENITIES ── */}
        <SectionCard icon={<Star size={16} />} title="Amenities" color="amber">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {amenityOptions.map(({ label, icon: Icon }) => {
              const active = form.amenities.includes(label)
              return (
                <button key={label} type="button" onClick={() => toggleAmenity(label)}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-[13px] font-semibold transition ${
                    active ? "border-cyan-500 bg-cyan-50 text-cyan-700" : "border-slate-200 bg-slate-50 text-slate-600 hover:border-cyan-300 hover:bg-cyan-50"
                  }`}>
                  <Icon size={14} className={active ? "text-cyan-600" : "text-slate-400"} />
                  {label}
                </button>
              )
            })}
          </div>
        </SectionCard>

        {/* ── HOUSE RULES ── */}
        <SectionCard icon={<ShieldCheck size={16} />} title="House Rules" color="rose">
          <div className="space-y-2.5">
            {form.rules.map((rule, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input className={inputCls} placeholder={`Rule ${idx + 1}: e.g. No smoking inside the premises`}
                  value={rule} onChange={e => updateList("rules", idx, e.target.value)} />
                {form.rules.length > 1 && (
                  <button type="button" onClick={() => removeFromList("rules", idx)}
                    className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500 transition hover:bg-red-100">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => addToList("rules")}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-slate-200 py-2.5 text-sm font-semibold text-slate-500 transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700">
              <Plus size={14} /> Add Rule
            </button>
          </div>
        </SectionCard>

        {/* ── IMAGES ── */}
        <SectionCard icon={<ImageIcon size={16} />} title="Photos" color="slate">
          <PhotoUploader images={form.images} onChange={urls => set("images", urls)} />
        </SectionCard>

        {/* ── STICKY SUBMIT ── */}
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:px-6">
          <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
            <p className="text-[12px] text-slate-500">Hotels are submitted to admin review and become public only after approval.</p>
            <div className="flex gap-3">
              <Link href="/host" className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                Cancel
              </Link>
              <button type="submit" disabled={submitting}
                className="flex items-center gap-2 rounded-lg bg-slate-950 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-cyan-700 disabled:opacity-60">
                {submitting ? (
                  <><span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Saving...</>
                ) : (isEdit ? "Save Changes" : "Create Hotel")}
              </button>
            </div>
          </div>
        </div>

      </form>
    </div>
  )
}
