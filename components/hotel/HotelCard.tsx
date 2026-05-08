'use client'

import { useState } from 'react'
import { ArrowRight, Heart, MapPin, Star } from 'lucide-react'
import { useWishlist } from '@/contexts/WishlistContext'

interface Props {
  title: string
  location: string
  price: number
  rating: number
  image: string
  slug?: string
  city?: string
}

const HOTEL_IMAGE_FALLBACK = '/images/hotel-slider-fallback.png'

const HotelCard = ({ title, location, price, rating, image, slug = '', city }: Props) => {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const [isAnimating, setIsAnimating] = useState(false)
  const imageSrc = image || HOTEL_IMAGE_FALLBACK
  const inWishlist = isInWishlist(slug, 'hotel')

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsAnimating(true)
    if (inWishlist) {
      removeFromWishlist(slug, 'hotel')
    } else {
      addToWishlist({ id: slug, slug, title, image: imageSrc, price, type: 'hotel' })
    }
    setTimeout(() => setIsAnimating(false), 400)
  }

  return (
    <div className="group w-full overflow-hidden rounded-3xl bg-white text-left shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-200/80 border border-slate-100">
      {/* Image area */}
      <div className="relative h-56 overflow-hidden bg-slate-100">
        <img
          src={imageSrc}
          alt={title}
          className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110"
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/10 to-transparent" />
        {/* Shine sweep on hover */}
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

        {/* City badge — bottom left */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
          <MapPin className="size-3" />
          {city || location.split(',')[0]}
        </div>

        {/* Wishlist button — top right */}
        <button
          onClick={handleWishlist}
          className={`absolute right-3 top-3 z-10 flex size-9 items-center justify-center rounded-full shadow-lg transition-all duration-300 ${
            inWishlist
              ? 'bg-rose-500 hover:bg-rose-600 scale-110'
              : 'bg-white/90 backdrop-blur-sm hover:bg-white hover:scale-110'
          }`}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={`size-4 transition-all duration-300 ${
              inWishlist ? 'fill-white text-white' : 'text-slate-400 group-hover:text-rose-400'
            } ${isAnimating ? 'scale-150' : 'scale-100'}`}
            fill={inWishlist ? 'currentColor' : 'none'}
            strokeWidth={inWishlist ? 0 : 2}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h2 className="line-clamp-1 text-[15px] font-bold text-slate-900 transition-colors duration-200 group-hover:text-[#081428] flex-1">
              {title}
            </h2>
            {/* Rating — content area */}
            <div className="flex-shrink-0 inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5">
              <Star className="size-3 fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-amber-700">{rating.toFixed(1)}</span>
            </div>
          </div>
          <p className="flex items-center gap-1 text-xs text-slate-500 line-clamp-1">
              <MapPin className="size-3.5 shrink-0 text-[#081428]/50" />
            {location}
          </p>
        </div>

        <div className="flex items-end justify-between border-t border-slate-100 pt-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Per night</p>
            <p className="text-lg font-black text-slate-900">
              Rs. <span className="text-[#081428]">{price.toLocaleString()}</span>
            </p>
          </div>
          <span className="group/btn relative overflow-hidden flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#081428] to-[#0c2244] px-5 py-2.5 text-[13px] font-bold text-white shadow-lg shadow-[#081428]/30 transition-all duration-300 group-hover:shadow-[#081428]/50 group-hover:shadow-xl group-hover:scale-105">
            {/* shimmer */}
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover/btn:translate-x-full" />
            View
            <ArrowRight className="size-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
          </span>
        </div>
      </div>
    </div>
  )
}

export default HotelCard
