"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Heart, MapPin, Star, type LucideIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardFooter } from "@/components/ui/Card"
import { cn } from "@/lib/utils"

type TravelListingCardProps = {
  href: string
  title: string
  image: string
  imageFallback?: string
  location: string
  eyebrow?: string
  rating?: number
  description?: string
  price: number
  priceLabel: string
  originalPrice?: number
  ctaLabel: string
  tags?: string[]
  meta?: Array<{
    icon: LucideIcon
    label: string
  }>
  wishlist?: {
    saved: boolean
    label: string
    activeLabel: string
    animating?: boolean
    toast?: string
    toastTone?: "saved" | "removed"
    onToggle: (event: React.MouseEvent<HTMLButtonElement>) => void
  }
  className?: string
  imageClassName?: string
}

export default function TravelListingCard({
  href,
  title,
  image,
  imageFallback,
  location,
  eyebrow,
  rating,
  description,
  price,
  priceLabel,
  originalPrice,
  ctaLabel,
  tags = [],
  meta = [],
  wishlist,
  className,
  imageClassName,
}: TravelListingCardProps) {
  const safePrice = Math.max(0, Math.round(price || 0))
  const safeOriginalPrice = originalPrice ? Math.max(safePrice, Math.round(originalPrice)) : null

  return (
    <Card
      className={cn(
        "group h-full gap-0 overflow-hidden rounded-[26px] border border-white/90 bg-white p-0 shadow-[0_22px_55px_-28px_rgba(15,23,42,0.72)] ring-1 ring-slate-950/[0.04] transition duration-300 hover:-translate-y-1.5 hover:border-teal-200 hover:shadow-[0_34px_85px_-34px_rgba(15,118,110,0.62)]",
        className
      )}
    >
      <div className={cn("relative h-56 overflow-hidden bg-slate-100", imageClassName)}>
        <Link href={href} className="absolute inset-0">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-700 group-hover:scale-110"
            onError={(event) => {
              if (!imageFallback) return
              const target = event.currentTarget
              if (target.src !== imageFallback) target.src = imageFallback
            }}
          />
        </Link>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/15 to-transparent opacity-90 transition group-hover:opacity-100" />

        <div className="absolute left-3 top-3 flex max-w-[calc(100%-4.5rem)] flex-wrap gap-2">
          {typeof rating === "number" && rating > 0 ? (
            <Badge className="gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-black text-slate-950 shadow-lg ring-1 ring-white/70 backdrop-blur">
              <Star className="size-3.5 fill-amber-400 text-amber-400" />
              {rating.toFixed(1)}
            </Badge>
          ) : null}
          {eyebrow ? (
            <Badge className="max-w-full truncate rounded-full bg-slate-950/80 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white shadow-lg ring-1 ring-white/15 backdrop-blur">
              {eyebrow}
            </Badge>
          ) : null}
        </div>

        {wishlist ? (
          <div className="absolute right-3 top-3 z-10">
            <button
              type="button"
              onClick={wishlist.onToggle}
              className={cn(
                "flex size-10 items-center justify-center rounded-full shadow-xl ring-1 ring-white/70 backdrop-blur transition duration-300 hover:scale-110",
                wishlist.saved ? "bg-rose-500 text-white hover:bg-rose-600" : "bg-white/90 text-slate-700 hover:text-rose-500"
              )}
              aria-label={wishlist.saved ? wishlist.activeLabel : wishlist.label}
            >
              <Heart
                className={cn(
                  "size-4 transition-transform duration-200",
                  wishlist.saved && "fill-current",
                  wishlist.animating && "scale-125"
                )}
              />
            </button>
            {wishlist.toast ? (
              <div
                className={cn(
                  "pointer-events-none absolute right-0 top-12 z-20 whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-semibold text-white shadow-xl animate-in fade-in slide-in-from-top-2 duration-200",
                  wishlist.toastTone === "saved" ? "bg-rose-500" : "bg-slate-600"
                )}
              >
                {wishlist.toast}
              </div>
            ) : null}
          </div>
        ) : null}

        {meta.length > 0 ? (
          <div className="absolute inset-x-3 bottom-3 flex flex-wrap gap-2">
            {meta.slice(0, 2).map((item) => (
              <span key={item.label} className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-slate-800 shadow-sm ring-1 ring-white/70 backdrop-blur">
                <item.icon className="size-3.5 text-teal-700" />
                {item.label}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <Link href={href} className="flex flex-1 flex-col">
        <CardContent className="flex flex-1 flex-col px-4 pb-4 pt-4">
          <div>
            <h3 className="line-clamp-1 text-lg font-black tracking-tight text-slate-950 transition group-hover:text-teal-800">
              {title}
            </h3>
            <p className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <MapPin className="size-3.5 shrink-0 text-teal-700" />
              <span className="line-clamp-1">{location}</span>
            </p>
          </div>

          {description ? <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">{description}</p> : null}

          {tags.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.slice(0, 3).map((tag) => (
                <span key={tag} className="rounded-full bg-teal-50 px-2.5 py-1 text-[11px] font-bold text-teal-800 ring-1 ring-teal-100">
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </CardContent>

        <CardFooter className="mt-auto justify-between gap-3 border-t border-slate-100 bg-gradient-to-r from-slate-50 via-white to-teal-50/60 p-4">
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">{priceLabel}</p>
            <div className="mt-0.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <p className="text-lg font-black text-slate-950">Rs. {safePrice.toLocaleString()}</p>
              {safeOriginalPrice ? (
                <p className="text-xs font-semibold text-slate-400 line-through">Rs. {safeOriginalPrice.toLocaleString()}</p>
              ) : null}
            </div>
          </div>
          <Button asChild size="sm" className="rounded-xl bg-slate-950 px-3 text-white shadow-sm hover:bg-teal-700">
            <span>
              {ctaLabel}
              <ArrowRight className="size-3.5" />
            </span>
          </Button>
        </CardFooter>
      </Link>
    </Card>
  )
}
