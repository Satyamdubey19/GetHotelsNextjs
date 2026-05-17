"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { CalendarDays, MapPin, Search, Users } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/Button"
import LocationInput from "@/components/search/LocationInput"
import DatePicker from "@/components/search/DatePicker"
import type { SearchBarProps } from "@/types/search"

export default function SearchCard({ onSearch }: SearchBarProps) {
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
    "h-auto border-0 bg-transparent p-0 text-[12px] font-semibold text-slate-950 outline-none placeholder:text-slate-500 focus:ring-0"

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut", delay: 0.12 }}
      className="relative z-20 mx-3 -mt-10 rounded-2xl border border-white/80 bg-white p-3.5 shadow-2xl shadow-slate-950/15"
    >
      <div className="space-y-2.5">
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
          <MapPin className="size-4 shrink-0 text-slate-500" />
          <div className="min-w-0 flex-1">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">Destination</p>
            <LocationInput
              value={destination}
              onChange={(value) => {
                setDestination(value)
                onSearch?.(value)
              }}
              placeholder="Where are you going?"
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="flex min-w-0 items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
            <CalendarDays className="size-4 shrink-0 text-slate-500" />
            <div className="min-w-0 flex-1">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">Check-in</p>
              <DatePicker value={checkIn} onChange={setCheckIn} className={inputClass} />
            </div>
          </div>
          <div className="flex min-w-0 items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
            <CalendarDays className="size-4 shrink-0 text-slate-500" />
            <div className="min-w-0 flex-1">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">Check-out</p>
              <DatePicker value={checkOut} onChange={setCheckOut} className={inputClass} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
          <Users className="size-4 shrink-0 text-slate-500" />
          <div className="min-w-0 flex-1">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">Guests</p>
            <p className="text-[12px] font-semibold text-slate-950">{guests} adults, 1 room</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setGuests((value) => Math.max(1, value - 1))}
              disabled={guests <= 1}
              className="flex size-7 items-center justify-center rounded-full bg-white text-sm font-bold text-slate-700 shadow-sm disabled:opacity-40"
              aria-label="Remove guest"
            >
              -
            </button>
            <button
              type="button"
              onClick={() => setGuests((value) => value + 1)}
              className="flex size-7 items-center justify-center rounded-full bg-white text-sm font-bold text-slate-700 shadow-sm"
              aria-label="Add guest"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="mt-3 h-11 w-full rounded-xl bg-gradient-to-r from-[#0F766E] to-[#0b9b8d] text-sm font-black text-white shadow-lg shadow-teal-700/25 hover:from-[#0b655f] hover:to-[#0F766E]"
      >
        <Search className="size-4" />
        Search Hotels
      </Button>
    </motion.form>
  )
}
