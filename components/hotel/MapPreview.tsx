"use client"

import { useState } from "react"
import type { MapPreviewProps } from "@/types/map"

export default function MapPreview({ title, location, city, price, rating, image, onOpen }: MapPreviewProps) {
  const [popupOpen, setPopupOpen] = useState(false)

  return (
    <div className="relative h-[28rem] w-full overflow-hidden rounded-[1.75rem] border border-slate-200 bg-[#eef5f7] shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
      {/* Map background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.72)_0%,rgba(226,232,240,0.72)_46%,rgba(224,242,254,0.62)_100%)]" />
        <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(#dbe3ea_1px,transparent_1px),linear-gradient(90deg,#dbe3ea_1px,transparent_1px)] [background-size:34px_34px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.10),transparent_38%)]" />

        <svg className="absolute inset-0 h-full w-full opacity-80" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Major road */}
          <path d="M0 48 C22 44, 38 40, 50 50 S78 60, 100 55" stroke="#cbd5e1" strokeWidth="3.2" fill="none" strokeLinecap="round" />
          <path d="M0 48 C22 44, 38 40, 50 50 S78 60, 100 55" stroke="#ffffff" strokeWidth="1.3" fill="none" strokeLinecap="round" />
          {/* Secondary roads */}
          <path d="M0 25 C28 30, 44 26, 50 30 S72 36, 100 30" stroke="#dde6ef" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M30 0 C34 24, 44 38, 50 50" stroke="#d1d5db" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M50 50 C56 66, 60 78, 63 100" stroke="#d1d5db" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M50 50 C66 47, 82 42, 100 46" stroke="#dde6ef" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M8 78 C28 68, 46 72, 60 64 S80 50, 100 56" stroke="#bfdbfe" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        </svg>
      </div>

      {/* City label – top left */}
      <div className="absolute left-4 top-4 z-10 rounded-xl border border-white/80 bg-white/90 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 shadow-sm backdrop-blur">
        {city}
      </div>

      {/* Hotel pin – centered */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 20 }}>
        <div className="relative flex flex-col items-center">

          {/* Popup card – shown above pin on click */}
          {popupOpen && (
            <div className="absolute bottom-full mb-3 w-64">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                {image && (
                  <div className="h-28 w-full overflow-hidden">
                    <img src={image} alt={title} className="h-full w-full object-cover" />
                  </div>
                )}
                <div className="p-4">
                  <p className="font-bold leading-snug text-slate-900">{title}</p>
                  <p className="mt-1 truncate text-xs text-slate-500">{location}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-400">From</p>
                      <p className="text-base font-bold text-slate-900">
                        ₹{price.toLocaleString()}
                        <span className="text-xs font-normal text-slate-500">/night</span>
                      </p>
                    </div>
                    {rating !== undefined && rating > 0 && (
                      <div className="flex items-center gap-1 rounded-full border border-amber-100 bg-amber-50 px-2.5 py-1">
                        <svg className="h-3 w-3 fill-amber-500" viewBox="0 0 24 24">
                          <path d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" />
                        </svg>
                        <span className="text-xs font-semibold text-amber-700">{rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* Caret pointing down toward pin */}
              <div className="flex justify-center">
                <div className="h-0 w-0 border-x-[7px] border-t-[8px] border-x-transparent border-t-white drop-shadow-sm" />
              </div>
            </div>
          )}

          {/* Pin button */}
          <button
            onClick={() => setPopupOpen((v) => !v)}
            className="group/pin relative z-10"
            aria-label="View hotel details"
          >
            {/* Pulse ring */}
            <span className="absolute inset-0 -m-2 animate-ping rounded-full bg-slate-900/15" />
            <div className="relative flex items-center gap-2 rounded-full border-2 border-white bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-transform group-hover/pin:scale-105 group-hover/pin:shadow-xl">
              <svg className="h-3.5 w-3.5 shrink-0 fill-white" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
              </svg>
              <span className="max-w-[160px] truncate">{title}</span>
            </div>
          </button>

          {/* Pin stem */}
          <div className="h-3 w-px bg-slate-950/40" />
          <div className="h-1 w-2 rounded-full bg-slate-950/20" />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="absolute inset-x-4 bottom-4 z-10 flex items-center justify-between">
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 text-[10px] font-semibold text-slate-500 shadow-sm backdrop-blur">
          <span className="h-px w-8 bg-slate-400" />
          1 km
        </div>
        <button
          onClick={onOpen}
          className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur transition hover:bg-white hover:shadow-md"
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
          Expand map
        </button>
      </div>
    </div>
  )
}
