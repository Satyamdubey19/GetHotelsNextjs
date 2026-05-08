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
    "w-full border-0 bg-transparent p-0 text-sm font-bold text-slate-900 outline-none placeholder:font-normal placeholder:text-slate-400 focus:ring-0"

  return (
    <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
      <form
        onSubmit={handleSubmit}
        className="flex items-stretch overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_4px_40px_-4px_rgba(15,23,42,0.18),0_0_0_1px_rgba(15,23,42,0.04)]"
      >
        {/* Destination */}
        <div className="flex min-w-0 flex-1 items-center gap-3 border-r border-slate-100 px-5 py-4">
          <MapPin className="size-4 shrink-0 text-cyan-500" />
          <div className="min-w-0 flex-1">
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">Destination</p>
            <LocationInput
              value={destination}
              onChange={(v) => { setDestination(v); onSearch?.(v) }}
              placeholder="City, hotel, or destination..."
              className={inputClass}
            />
          </div>
        </div>

        {/* Check-in */}
        <div className="flex items-center gap-2.5 border-r border-slate-100 px-4 py-4">
          <CalendarDays className="size-4 shrink-0 text-slate-300" />
          <div className="w-[110px]">
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">Check-in</p>
            <DatePicker value={checkIn} onChange={setCheckIn} className={inputClass} />
          </div>
        </div>

        {/* Check-out */}
        <div className="flex items-center gap-2.5 border-r border-slate-100 px-4 py-4">
          <CalendarDays className="size-4 shrink-0 text-slate-300" />
          <div className="w-[110px]">
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">Check-out</p>
            <DatePicker value={checkOut} onChange={setCheckOut} className={inputClass} />
          </div>
        </div>

        {/* Guests */}
        <div className="flex items-center gap-2.5 border-r border-slate-100 px-4 py-4">
          <Users className="size-4 shrink-0 text-slate-300" />
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">Guests</p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setGuests((g) => Math.max(1, g - 1))}
                className="flex size-5 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500 transition hover:bg-cyan-100 hover:text-cyan-700 disabled:opacity-40"
                disabled={guests <= 1}
                aria-label="Remove guest"
              >−</button>
              <span className="min-w-[1.25rem] text-center text-sm font-bold text-slate-900 tabular-nums">{guests}</span>
              <button
                type="button"
                onClick={() => setGuests((g) => g + 1)}
                className="flex size-5 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500 transition hover:bg-cyan-100 hover:text-cyan-700"
                aria-label="Add guest"
              >+</button>
            </div>
          </div>
        </div>

        {/* Search button */}
        <div className="flex items-center p-2.5">
          <button
            type="submit"
            className="flex h-full items-center gap-2 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 px-6 text-sm font-bold text-white shadow-md shadow-cyan-500/20 transition hover:from-cyan-400 hover:to-blue-500 active:scale-95"
          >
            <Search className="size-4" />
            <span>Search</span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default SearchBar
