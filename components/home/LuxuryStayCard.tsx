"use client"

import Link from "next/link"
import { Heart, MapPin, Star } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/badge"
import { useWishlist } from "@/contexts/WishlistContext"
import type { HomeHotel } from "./home-types"

export default function LuxuryStayCard({ hotel }: { hotel: HomeHotel }) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const saved = isInWishlist(hotel.slug, "hotel")

  const toggleWishlist = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    if (saved) {
      removeFromWishlist(hotel.slug, "hotel")
      return
    }

    addToWishlist({
      id: hotel.slug,
      slug: hotel.slug,
      title: hotel.title,
      image: hotel.image,
      price: hotel.price,
      type: "hotel",
    })
  }

  return (
    <motion.div whileTap={{ scale: 0.985 }} className="h-full">
      <Card className="h-full overflow-hidden rounded-3xl border-0 bg-white p-0 shadow-xl shadow-slate-950/10 ring-0">
        <Link href={`/hotels/${hotel.slug}`} className="block">
          <div className="relative h-[170px] overflow-hidden">
            {hotel.image ? <img src={hotel.image} alt={hotel.title} className="size-full object-cover" loading="lazy" /> : null}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/25 to-transparent" />
            {hotel.rating > 0 ? (
              <Badge className="absolute bottom-3 left-3 bg-white/95 text-slate-950 shadow-sm">
                <Star className="mr-1 size-3 fill-amber-400 text-amber-400" />
                {hotel.rating.toFixed(1)}
              </Badge>
            ) : null}
            <button
              type="button"
              onClick={toggleWishlist}
              className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-lg backdrop-blur"
              aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
            >
              <Heart className={`size-4 ${saved ? "fill-red-500 text-red-500" : ""}`} />
            </button>
          </div>
          <div className="p-4">
            <h3 className="line-clamp-1 text-[15px] font-black text-slate-950">{hotel.title}</h3>
            <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-500">
              <MapPin className="size-3" />
              {hotel.location}
            </p>
            <div className="mt-3 flex items-end justify-between gap-3">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">Starting from</p>
                <p className="text-base font-black text-red-500">
                  ${Math.max(1, Math.round(hotel.price || 0))}
                  <span className="text-[10px] font-medium text-slate-500">/night</span>
                </p>
              </div>
              <Button className="h-8 rounded-xl bg-[#0F766E] px-4 text-[11px] font-black text-white hover:bg-[#0b655f]">
                Book
              </Button>
            </div>
          </div>
        </Link>
      </Card>
    </motion.div>
  )
}
