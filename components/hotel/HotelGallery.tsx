"use client"

import { useState } from "react"
import type { HotelGalleryProps } from "@/types/hotel-components"

const HotelGallery = ({ gallery, title }: HotelGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  const openImage = (index: number) => {
    setActiveIndex(index)
    setIsOpen(true)
  }

  const closeViewer = () => setIsOpen(false)
  const previous = () => setActiveIndex((current) => (current - 1 + gallery.length) % gallery.length)
  const next = () => setActiveIndex((current) => (current + 1) % gallery.length)

  return (
    <>
      {/* Contemporary Gallery */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-light text-slate-900">Photo Gallery</h2>
          <button 
            onClick={() => openImage(0)}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition uppercase tracking-wide"
          >
            View all →
          </button>
        </div>

        {/* Grid Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-lg overflow-hidden">
          {/* Main Feature Image - Larger */}
          <button
            type="button"
            onClick={() => openImage(0)}
            className="group relative md:col-span-2 md:row-span-2 overflow-hidden rounded-lg bg-slate-100 aspect-square md:aspect-auto h-64 md:h-auto cursor-pointer"
          >
            <img 
              src={gallery[0]} 
              alt={`${title} main`} 
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition duration-300" />
          </button>

          {/* Side Images Grid */}
          <div className="col-span-1 md:col-span-2 grid grid-cols-2 md:grid-cols-2 gap-3">
            {gallery.slice(1, 5).map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => openImage(idx + 1)}
                className="group relative overflow-hidden rounded-lg bg-slate-100 aspect-square cursor-pointer"
              >
                <img 
                  src={img} 
                  alt={`${title} gallery ${idx + 2}`} 
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition duration-300" />
              </button>
            ))}
          </div>

          {/* View More Overlay */}
          {gallery.length > 5 && (
            <button
              onClick={() => openImage(5)}
              className="col-span-1 md:col-span-1 relative overflow-hidden rounded-lg bg-slate-100 aspect-square cursor-pointer group"
            >
              <img 
                src={gallery[5]} 
                alt={`${title} gallery more`} 
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105 brightness-60 group-hover:brightness-75" 
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-white font-semibold text-2xl">+{Math.max(0, gallery.length - 5)}</p>
                  <p className="text-white text-xs mt-1">More</p>
                </div>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Modern Lightbox Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/98 px-4 backdrop-blur-sm">
          {/* Close Button */}
          <button
            type="button"
            onClick={closeViewer}
            className="absolute right-6 top-6 z-10 h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition"
            aria-label="Close gallery"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Counter */}
          <div className="absolute top-6 left-6 rounded-lg bg-white/10 backdrop-blur px-4 py-2 text-white text-sm font-medium">
            {activeIndex + 1} / {gallery.length}
          </div>

          {/* Main Image Container with smooth transition */}
          <div className="relative w-full max-w-6xl flex items-center justify-center min-h-[70vh]">
            <img 
              src={gallery[activeIndex]} 
              alt={`${title} gallery ${activeIndex + 1}`} 
              className="max-h-[85vh] w-full object-contain rounded-lg opacity-0 animate-fade-in" 
              key={activeIndex}
            />
          </div>

          {/* Navigation Arrows */}
          <button
            type="button"
            onClick={previous}
            className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition"
            aria-label="Previous"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            type="button"
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition"
            aria-label="Next"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Thumbnail Navigation */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 max-w-2xl overflow-x-auto scrollbar-hide">
            {gallery.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`h-16 w-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition ${
                  idx === activeIndex 
                    ? 'border-white' 
                    : 'border-white/30 hover:border-white/60'
                }`}
              >
                <img 
                  src={img} 
                  alt={`Thumbnail ${idx + 1}`} 
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* Keyboard hint */}
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-white/50 text-xs">
            ← → or click to navigate
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  )
}

export default HotelGallery
