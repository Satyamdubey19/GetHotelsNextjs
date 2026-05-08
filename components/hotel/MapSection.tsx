"use client"

import { useState } from "react"
import MapPreview from "@/components/hotel/MapPreview"
import MapModal from "@/components/hotel/MapModal"
import type { MapSectionProps } from "@/types/map"

export default function MapSection({ hotelId, title, price, location, city, rating, image }: MapSectionProps) {
  const [isMapOpen, setIsMapOpen] = useState(false)

  const highlights = [
    { id: "h1", label: `${city} city center`, type: "Landmark", eta: "10 min" },
    { id: "h2", label: "Top cafes and dining", type: "Lifestyle", eta: "6 min" },
    { id: "h3", label: "Airport transfer point", type: "Transit", eta: "18 min" },
    { id: "h4", label: "Local experiences desk", type: "Concierge", eta: "4 min" },
  ]

  return (
    <>
      <MapPreview
        title={title}
        location={location}
        city={city}
        price={price}
        rating={rating}
        image={image}
        onOpen={() => setIsMapOpen(true)}
      />
      <MapModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        hotel={{ id: hotelId, title, price, location, city }}
        highlights={highlights}
      />
    </>
  )
}
