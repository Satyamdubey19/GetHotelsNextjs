"use client"

import type { MapModalProps } from "@/types/map"

export default function MapModal({ isOpen, onClose, hotel, highlights }: MapModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 px-4 py-6 backdrop-blur-sm">
      <button
        onClick={onClose}
        className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
        aria-label="Close map"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-white shadow-[0_36px_100px_rgba(15,23,42,0.28)]">
        <div className="grid h-[80vh] grid-cols-1 lg:grid-cols-[1.4fr_0.9fr]">

          {/* Map panel */}
          <div className="relative overflow-hidden bg-[linear-gradient(180deg,#f8fbff_0%,#edf4ff_100%)]">
            <div className="absolute inset-0">
              <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(#dbe3ea_1px,transparent_1px),linear-gradient(90deg,#dbe3ea_1px,transparent_1px)] [background-size:34px_34px]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.10),transparent_35%)]" />

              <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full opacity-80" preserveAspectRatio="none">
                <path d="M0 48 C22 44, 38 40, 50 50 S78 60, 100 55" stroke="#cbd5e1" strokeWidth="3.2" fill="none" strokeLinecap="round" />
                <path d="M0 48 C22 44, 38 40, 50 50 S78 60, 100 55" stroke="#ffffff" strokeWidth="1.3" fill="none" strokeLinecap="round" />
                <path d="M0 25 C28 30, 44 26, 50 30 S72 36, 100 30" stroke="#dde6ef" strokeWidth="2" fill="none" strokeLinecap="round" />
                <path d="M30 0 C34 24, 44 38, 50 50" stroke="#d1d5db" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                <path d="M50 50 C56 66, 60 78, 63 100" stroke="#d1d5db" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                <path d="M8 78 C28 68, 46 72, 60 64 S80 50, 100 56" stroke="#bfdbfe" strokeWidth="1.6" fill="none" strokeLinecap="round" />
              </svg>

              {/* Hotel pin at center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-2 rounded-full border-2 border-white bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-xl">
                    <svg className="h-3.5 w-3.5 shrink-0 fill-white" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
                    </svg>
                    {hotel.title}
                  </div>
                  <div className="h-4 w-px bg-slate-900/40" />
                  <div className="h-1.5 w-3 rounded-full bg-slate-900/20" />
                </div>
              </div>

              {/* Property label top-left */}
              <div className="absolute left-6 top-6 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">This property</p>
                <p className="mt-2 text-lg font-bold text-slate-900">{hotel.title}</p>
                <p className="text-sm text-slate-600">{hotel.city}, India</p>
              </div>

              {/* Scale */}
              <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 text-[10px] font-semibold text-slate-500 shadow-sm">
                <span className="h-px w-8 bg-slate-400" />
                1 km
              </div>
            </div>
          </div>

          {/* Info panel */}
          <div className="flex flex-col overflow-hidden border-l border-slate-200 bg-slate-50/80">
            <div className="border-b border-slate-200 bg-white p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">Location</p>
              <h3 className="mt-2 text-xl font-bold text-slate-900">{hotel.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{hotel.location}</p>
              <div className="mt-4 rounded-2xl bg-slate-950 px-4 py-3 text-white">
                <p className="text-[10px] uppercase tracking-[0.24em] text-white/55">From</p>
                <p className="mt-1 text-2xl font-bold">₹{hotel.price.toLocaleString()}</p>
                <p className="text-xs text-white/60">per night</p>
              </div>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto p-5">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">Nearby places</p>
              {highlights.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                    <p className="text-xs text-slate-500">{item.type}</p>
                  </div>
                  <span className="rounded-full border border-slate-100 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                    {item.eta}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

