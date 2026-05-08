'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, MapPin, Heart, ArrowRight } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useWishlist } from '@/contexts/WishlistContext'
import { Hotel } from '@/lib/hotels'
import axios from 'axios'
import type { FeaturedApiHotel } from '@/types/hotel-components'
import type { WishlistPopup } from '@/types/sections'

const HOTEL_IMAGE_FALLBACK = '/images/hotel-slider-fallback.png'

function mapApiHotel(h: FeaturedApiHotel): Hotel {
  const coverImage = h.HotelImage?.find((i) => i.isCover)?.url ?? h.HotelImage?.[0]?.url ?? ''

  return {
    slug: h.slug,
    title: h.title,
    location: h.location,
    city: h.city ?? h.location?.split(',')?.[0]?.trim() ?? '',
    price: h.Room?.[0]?.pricePerNight ?? 0,
    rating: h.averageRating ?? 0,
    image: coverImage || HOTEL_IMAGE_FALLBACK,
    description: h.description,
    gallery: (h.HotelImage ?? []).map((i) => i.url),
    amenities: (h.HotelAmenity ?? [])
      .map((ha) => ha.Amenity?.name)
      .filter((name): name is string => Boolean(name)),
    rules: (h.HotelRule ?? [])
      .map((r) => r.rule ?? r.description ?? '')
      .filter(Boolean),
    reviews: [],
  }
}

type HomeFeaturedHotelsProps = {
  searchQuery?: string
}

export default function HomeFeaturedHotels({ searchQuery = '' }: HomeFeaturedHotelsProps) {
  const [currentLocation, setCurrentLocation] = useState<string | null>(null)
  const [locationResolved, setLocationResolved] = useState(false)
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const [popup, setPopup] = useState<WishlistPopup>(null)
  const [animating, setAnimating] = useState<string | null>(null)
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationResolved(true)
      return
    }
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await axios.get(
            `/api/location/gps?lat=${coords.latitude}&lng=${coords.longitude}`
          )
          const city = res.data.city
          setCurrentLocation(city && city !== 'Current Location' ? city : null)
        } catch {
          setCurrentLocation(null)
        } finally {
          setLocationResolved(true)
        }
      },
      () => {
        setCurrentLocation(null)
        setLocationResolved(true)
      },
      { timeout: 8000 }
    )
  }, [])

  useEffect(() => {
    if (!locationResolved) return
    const query = searchQuery.trim()

    const fetchHotels = async () => {
      setLoading(true)
      try {
        const url = query
          ? `/api/hotel?q=${encodeURIComponent(query)}`
          : currentLocation
          ? `/api/hotel?city=${encodeURIComponent(currentLocation)}`
          : '/api/hotel'
        const response = await axios.get(url)
        const results = (response.data.data ?? []).map(mapApiHotel)
        if (results.length === 0 && currentLocation && !query) {
          const fallback = await axios.get('/api/hotel')
          setHotels((fallback.data.data ?? []).map(mapApiHotel))
      
        } else {
          setHotels(results)
        }
      } catch (error) {
        console.error('Error fetching hotels:', error)
        setHotels([])
      } finally {
        setLoading(false)
      }
    }
    fetchHotels()
  }, [locationResolved, currentLocation, searchQuery])
  const handleWishlist = (e: React.MouseEvent, hotel: Hotel) => {
    e.preventDefault()
    e.stopPropagation()
    const wasInWishlist = isInWishlist(hotel.slug, 'hotel')
    if (wasInWishlist) {
      removeFromWishlist(hotel.slug, 'hotel')
      setPopup({ slug: hotel.slug, action: 'removed' })
    } else {
      addToWishlist({
        id: hotel.slug,
        slug: hotel.slug,
        title: hotel.title,
        image: hotel.image,
        price: hotel.price,
        type: 'hotel',
      })
      setPopup({ slug: hotel.slug, action: 'added' })
    }
    setAnimating(hotel.slug)
    setTimeout(() => setAnimating(null), 420)
    setTimeout(() => setPopup(null), 1600)
  }

  if (loading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <Skeleton className="h-52 w-full rounded-none" />
            <div className="p-4 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (hotels.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white/80 p-8 text-center shadow-sm">
        <p className="text-base font-semibold text-slate-950">No hotels found</p>
        <p className="mt-2 text-sm text-slate-500">Try another destination or clear the search to see all stays.</p>
      </div>
    )
  }

  return (
    <div>
      {(searchQuery.trim() || currentLocation) && (
        <p className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-sm text-slate-500 shadow-sm backdrop-blur">
          <MapPin className="size-3.5" />
          {searchQuery.trim() ? 'Showing hotels for ' : 'Showing hotels near '}
          <span className="font-semibold text-slate-700">{searchQuery.trim() || currentLocation}</span>
        </p>
      )}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {hotels.map((hotel) => {
          const inWishlist = isInWishlist(hotel.slug, 'hotel')
          const showPopup = popup?.slug === hotel.slug
          const isAnimatingHeart = animating === hotel.slug
          const imageSrc = hotel.image || HOTEL_IMAGE_FALLBACK

          return (
            <article
              key={hotel.slug}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(15,23,42,0.45)]"
            >
              {/* Image block — explicit height avoids flex/aspect-ratio collapse */}
              <div className="relative h-52 overflow-hidden bg-slate-100">
                <Image
                  src={imageSrc}
                  alt={hotel.title}
                  fill
                  sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                  onError={(e) => {
                    const t = e.currentTarget
                    if (t.src !== HOTEL_IMAGE_FALLBACK) t.src = HOTEL_IMAGE_FALLBACK
                  }}
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-950/40 to-transparent" />

                {/* Rating badge */}
                <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-slate-900 shadow-sm backdrop-blur">
                  <Star className="size-3.5 fill-amber-400 text-amber-400" />
                  {hotel.rating.toFixed(1)}
                </div>

                {/* City badge */}
                {hotel.city && (
                  <div className="absolute bottom-3 left-3 max-w-[calc(100%-4.5rem)] truncate rounded-full bg-slate-950/65 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                    {hotel.city}
                  </div>
                )}

                {/* Wishlist button */}
                <div className="absolute right-3 top-3 z-10">
                  <button
                    onClick={(e) => handleWishlist(e, hotel)}
                    className={`flex size-9 items-center justify-center rounded-full shadow-md backdrop-blur transition-all duration-200 hover:scale-110 ${
                      inWishlist
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-white/90 text-slate-600 hover:text-red-500'
                    }`}
                    aria-label={inWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
                  >
                    <Heart
                      className={`size-4 ${inWishlist ? 'fill-white' : ''} ${isAnimatingHeart ? 'scale-125' : ''} transition-transform duration-200`}
                    />
                  </button>
                  {showPopup && (
                    <div
                      className="pointer-events-none absolute right-0 top-10 z-20 whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-semibold text-white shadow-xl animate-in fade-in slide-in-from-top-2 duration-200"
                      style={{ background: popup?.action === 'added' ? '#ef4444' : '#475569' }}
                    >
                      {popup?.action === 'added' ? 'Saved to wishlist' : 'Removed'}
                    </div>
                  )}
                </div>
              </div>

              {/* Card body */}
              <Link href={`/hotels/${hotel.slug}`} className="block">
                <div className="px-4 pt-3 pb-1">
                  <h3 className="line-clamp-1 text-base font-semibold text-slate-950">{hotel.title}</h3>
                  <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                    <MapPin className="size-3.5 shrink-0" />
                    <span className="line-clamp-1">{hotel.location}</span>
                  </p>
                  {hotel.description && (
                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">{hotel.description}</p>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-slate-100 bg-slate-50/80 px-4 py-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Per night</p>
                    <div className="flex items-baseline gap-1.5">
                      <p className="text-base font-bold text-slate-950">Rs. {hotel.price.toLocaleString()}</p>
                      <p className="text-xs text-slate-400 line-through">
                        Rs. {Math.round(hotel.price * 1.22).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-950 px-3.5 py-2 text-xs font-semibold text-white transition group-hover:bg-blue-700">
                    View
                    <ArrowRight className="size-3.5" />
                  </span>
                </div>
              </Link>
            </article>
          )
        })}
      </div>
    </div>
  )
}
