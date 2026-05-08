'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, CalendarDays, Heart } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useWishlist } from '@/contexts/WishlistContext'
import { tours, Tour } from '@/lib/tours'
import type { WishlistPopup } from '@/types/sections'

const featuredTours = tours.slice(0, 3)

export default function HomeFeaturedTours() {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const [popup, setPopup] = useState<WishlistPopup>(null)
  const [animating, setAnimating] = useState<string | null>(null)

  const handleWishlist = (e: React.MouseEvent, tour: Tour) => {
    e.preventDefault()
    e.stopPropagation()

    const wasInWishlist = isInWishlist(tour.slug, 'tour')

    if (wasInWishlist) {
      removeFromWishlist(tour.slug, 'tour')
      setPopup({ slug: tour.slug, action: 'removed' })
    } else {
      addToWishlist({
        id: tour.slug,
        slug: tour.slug,
        title: tour.title,
        image: tour.image,
        price: tour.price,
        type: 'tour',
      })
      setPopup({ slug: tour.slug, action: 'added' })
    }

    setAnimating(tour.slug)
    setTimeout(() => setAnimating(null), 420)
    setTimeout(() => setPopup(null), 1600)
  }

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {featuredTours.map((tour) => {
        const inWishlist = isInWishlist(tour.slug, 'tour')
        const showPopup = popup?.slug === tour.slug
        const isAnimating = animating === tour.slug

        return (
          <Card
            key={tour.id}
            className="rounded-2xl border-0 bg-white p-0 shadow-sm ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl"
          >
            {/* Image — not wrapped in Link so button stays outside the link */}
            <div className="relative overflow-hidden rounded-t-2xl" style={{ height: '200px' }}>
              <Link href={`/tours/${tour.slug}`} className="group block absolute inset-0">
                <Image
                  src={tour.image}
                  alt={tour.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </Link>
              <div className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-slate-900 backdrop-blur">
                {tour.duration} days
              </div>

              {/* Wishlist button + popup */}
              <div className="absolute right-3 top-3 z-10">
                <button
                  onClick={(e) => handleWishlist(e, tour)}
                  className={`flex size-9 items-center justify-center rounded-full shadow-sm backdrop-blur transition-all duration-300 hover:scale-110 ${
                    inWishlist
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-white/90 text-slate-700 hover:text-red-500'
                  }`}
                  aria-label={inWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
                >
                  <Heart
                    className={`size-4 transition-colors ${inWishlist ? 'fill-white' : ''} ${isAnimating ? 'animate-heart-beat' : ''}`}
                  />
                </button>

                {showPopup && (
                  <div
                    key={`${tour.slug}-${popup?.action}`}
                    className="animate-wishlist-toast pointer-events-none absolute right-0 top-11 z-20 whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-semibold text-white shadow-xl"
                    style={{
                      background: popup?.action === 'added' ? '#ef4444' : '#475569',
                    }}
                  >
                    {popup?.action === 'added' ? '❤ Added to wishlist' : '✕ Removed from wishlist'}
                    <span
                      className="absolute -top-1.5 right-3 block h-0 w-0"
                      style={{
                        borderLeft: '5px solid transparent',
                        borderRight: '5px solid transparent',
                        borderBottom: `6px solid ${popup?.action === 'added' ? '#ef4444' : '#475569'}`,
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <CardHeader>
              <CardTitle>{tour.title}</CardTitle>
              <CardDescription className="flex items-center gap-1.5">
                <MapPin className="size-4" />
                {tour.destination}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="line-clamp-2 text-sm leading-6 text-slate-600">{tour.description}</p>
              <div className="flex flex-wrap gap-2">
                {tour.highlights.slice(0, 3).map((highlight) => (
                  <span
                    key={highlight}
                    className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            </CardContent>

            <CardFooter className="justify-between bg-slate-50">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <CalendarDays className="size-4 text-slate-500" />
                Rs. {tour.price.toLocaleString()}
              </div>
              <Button asChild size="sm" className="rounded-xl">
                <Link href={`/tours/${tour.slug}`}>View tour</Link>
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
