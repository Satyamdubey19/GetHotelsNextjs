"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { CalendarDays, MapPin, Search, Users } from "lucide-react"
import LocationInput from "./LocationInput"
import DatePicker from "./DatePicker"
import type { SearchBarProps } from "@/types/search"

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const pathname = usePathname()
  const router = useRouter()
  const [destination, setDestination] = useState("")
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState(2)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const query = destination.trim()
    onSearch?.(query)

    const params = new URLSearchParams()
    if (query) params.set("q", query)
    if (checkIn) params.set("checkIn", checkIn)
    if (checkOut) params.set("checkOut", checkOut)
    if (query || checkIn || checkOut) params.set("guests", String(guests))

    const target = params.toString() ? `/hotels?${params.toString()}` : "/hotels"
    if (pathname !== target) router.push(target)
  }

  const inputClass =
    "w-full border-0 bg-transparent p-0 text-sm font-semibold text-slate-950 outline-none placeholder:font-normal placeholder:text-slate-400 focus:ring-0"

  return (
    <div className="mx-auto w-full max-w-5xl px-4">
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-2 shadow-[0_20px_50px_rgba(15,23,42,0.14)] lg:h-[82px] lg:flex-row lg:items-center"
      >
        <div className="flex min-w-0 items-center gap-3 rounded-2xl border-b border-slate-100 px-4 py-3 transition hover:bg-slate-50 lg:w-[32%] lg:border-b-0">
          <MapPin className="size-4 shrink-0 text-teal-600" />
          <div className="min-w-0 flex-1">
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">Destination</p>
            <LocationInput
              value={destination}
              onChange={(v) => {
                setDestination(v)
                onSearch?.(v)
              }}
              placeholder="City, hotel, or destination..."
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex min-w-0 items-center gap-2.5 rounded-2xl border-b border-slate-100 px-4 py-3 transition hover:bg-slate-50 lg:w-[19%] lg:border-b-0">
          <CalendarDays className="size-4 shrink-0 text-slate-300" />
          <div className="min-w-0 flex-1">
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">Check-in</p>
            <DatePicker value={checkIn} onChange={setCheckIn} className={inputClass} />
          </div>
        </div>

        <div className="flex min-w-0 items-center gap-2.5 rounded-2xl border-b border-slate-100 px-4 py-3 transition hover:bg-slate-50 lg:w-[19%] lg:border-b-0">
          <CalendarDays className="size-4 shrink-0 text-slate-300" />
          <div className="min-w-0 flex-1">
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">Check-out</p>
            <DatePicker value={checkOut} onChange={setCheckOut} className={inputClass} />
          </div>
        </div>

        <div className="flex items-center gap-2.5 rounded-2xl border-b border-slate-100 px-4 py-3 transition hover:bg-slate-50 lg:w-[21%] lg:border-b-0">
          <Users className="size-4 shrink-0 text-slate-300" />
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">Guests</p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setGuests((g) => Math.max(1, g - 1))}
                className="flex size-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500 transition hover:bg-teal-100 hover:text-teal-700 disabled:opacity-40"
                disabled={guests <= 1}
                aria-label="Remove guest"
              >
                -
              </button>
              <span className="min-w-[1.25rem] text-center text-sm font-bold tabular-nums text-slate-950">{guests}</span>
              <button
                type="button"
                onClick={() => setGuests((g) => g + 1)}
                className="flex size-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500 transition hover:bg-teal-100 hover:text-teal-700"
                aria-label="Add guest"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center p-1 lg:w-[9%]">
          <button
            type="submit"
            className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 text-sm font-bold text-white shadow-md transition hover:bg-teal-700 active:scale-95 lg:size-14 lg:px-0"
          >
            <Search className="size-4" />
            <span className="lg:hidden">Search</span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default SearchBar
