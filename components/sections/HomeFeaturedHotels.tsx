'use client'

import { useEffect, useState } from 'react'
import { BedDouble, MapPin, Sparkles } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import TravelListingCard from '@/components/home/TravelListingCard'
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
          const res = await axios.get(`/api/location/gps?lat=${coords.latitude}&lng=${coords.longitude}`)
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
            <Skeleton className="h-56 w-full rounded-none" />
            <div className="space-y-2 p-4">
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
          const imageSrc = hotel.image || HOTEL_IMAGE_FALLBACK

          return (
            <TravelListingCard
              key={hotel.slug}
              href={`/hotels/${hotel.slug}`}
              title={hotel.title}
              image={imageSrc}
              imageFallback={HOTEL_IMAGE_FALLBACK}
              location={hotel.location}
              eyebrow={hotel.city || 'Premium stay'}
              rating={hotel.rating}
              description={hotel.description}
              price={hotel.price}
              originalPrice={Math.round(hotel.price * 1.22)}
              priceLabel="Per night"
              ctaLabel="View"
              meta={[
                { icon: BedDouble, label: 'Verified stay' },
                { icon: Sparkles, label: 'Guest loved' },
              ]}
              wishlist={{
                saved: inWishlist,
                label: 'Save to wishlist',
                activeLabel: 'Remove from wishlist',
                animating: animating === hotel.slug,
                toast: showPopup ? (popup?.action === 'added' ? 'Saved to wishlist' : 'Removed') : undefined,
                toastTone: popup?.action === 'added' ? 'saved' : 'removed',
                onToggle: (event) => handleWishlist(event, hotel),
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
