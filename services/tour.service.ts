import { prisma } from "@/lib/prisma"
import type { ListingStatus, TourDifficulty } from "@prisma/client"
import type { Tour } from "@/lib/tours"


export type TourInput = {
  slug: string
  title: string
  description: string
  destination: string
  city?: string
  state?: string
  country?: string
  latitude?: string
  longitude?: string
  duration: string
  maxGroupSize: string
  totalSlots?: string
  availableSlots?: string
  pricePerPerson: string
  originalPrice?: string
  difficulty?: string
  category?: string
  images?: string[]
  highlights?: string[]
  included?: string[]
  excluded?: string[]
  languages?: string | string[]
  cancellationPolicy?: string
  status?: string
}

export type ItineraryDayInput = {
  day: number
  title?: string
  description?: string
  activities?: string[]
  meals?: string[]
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

export function parseLanguages(value: string | string[] | undefined): string[] {
  if (Array.isArray(value)) return value.filter(Boolean)
  return String(value || "English")
    .split(",")
    .map((l) => l.trim())
    .filter(Boolean)
}

// ─── Queries ───────────────────────────────────────────────────────────────────

export async function listTours(hostId: string) {
  return prisma.tour.findMany({
    where: { hostId },
    include: {
      TourItineraryDay: { orderBy: { day: "asc" } },
      _count: { select: { Booking: true, Review: true } },
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function getTourById(id: string, hostId: string) {
  return prisma.tour.findFirst({
    where: { id, hostId },
    include: { TourItineraryDay: { orderBy: { day: "asc" } } },
  })
}

export async function listPublicTours() {
  const tours = await prisma.tour.findMany({
    where: { status: "ACTIVE", isActive: true, isApproved: true },
    include: {
      TourItineraryDay: { orderBy: { day: "asc" } },
      _count: { select: { Booking: true, Review: true } },
    },
    orderBy: [{ totalBookings: "desc" }, { averageRating: "desc" }],
  })

  return tours.map(normalizeTourForPublic)
}

export async function getPublicTourBySlug(slug: string) {
  const tour = await prisma.tour.findFirst({
    where: {
      OR: [{ slug }, { id: slug }],
      status: "ACTIVE",
      isActive: true,
      isApproved: true,
    },
    include: {
      TourItineraryDay: { orderBy: { day: "asc" } },
      _count: { select: { Booking: true, Review: true } },
    },
  })

  return tour ? normalizeTourForPublic(tour) : null
}

export type TourWithRelations = NonNullable<Awaited<ReturnType<typeof getTourById>>>

export function normalizeTourForForm(tour: TourWithRelations) {
  return {
    ...tour,
    latitude: tour.latitude != null ? String(tour.latitude) : "",
    longitude: tour.longitude != null ? String(tour.longitude) : "",
    duration: String(tour.duration),
    maxGroupSize: String(tour.maxGroupSize),
    totalSlots: String(tour.totalSlots),
    availableSlots: String(tour.availableSlots),
    pricePerPerson: String(tour.pricePerPerson),
    originalPrice: tour.originalPrice != null ? String(tour.originalPrice) : "",
    languages: tour.languages.join(", "),
    itinerary: tour.TourItineraryDay,
  }
}

type PublicTourRecord = Awaited<ReturnType<typeof prisma.tour.findMany>>[number] & {
  TourItineraryDay: {
    day: number
    title: string
    description: string
    activities: string[]
    meals: string[]
  }[]
  _count?: { Booking: number; Review: number }
}

export function normalizeTourForPublic(tour: PublicTourRecord): Tour {
  const images = tour.images.length > 0 ? tour.images : ["/tour1.jpg"]
  const city = tour.city ?? tour.destination.split(",")[0]?.trim() ?? "India"
  const country = tour.country ?? "India"
  const category = (tour.category ?? "adventure").toLowerCase()

  return {
    id: tour.id,
    slug: tour.slug,
    title: tour.title,
    destination: tour.destination,
    location: {
      lat: tour.latitude ?? 0,
      lng: tour.longitude ?? 0,
      city,
      country,
    },
    duration: tour.duration,
    price: Number(tour.pricePerPerson),
    groupSize: `${Math.max(0, tour.availableSlots)} of ${tour.totalSlots} slots available`,
    rating: tour.averageRating,
    reviews: tour.totalReviews || tour._count?.Review || 0,
    image: images[0],
    gallery: images,
    description: tour.description,
    highlights: tour.highlights,
    itinerary: tour.TourItineraryDay.map((day) => ({
      day: day.day,
      title: day.title,
      description: day.description,
      activities: day.activities,
      meals: day.meals,
    })),
    includedHotels: [],
    bestTimeToVisit: "October to March",
    category,
    tags: [category, city.toLowerCase(), tour.difficulty.toLowerCase()],
    budget: {
      perPersonBase: Number(tour.pricePerPerson),
      inclusions: tour.included,
      exclusions: tour.excluded,
    },
  }
}

// ─── Mutations ─────────────────────────────────────────────────────────────────

export async function createTour(
  hostId: string,
  tourData: TourInput,
  itinerary: ItineraryDayInput[],
) {
  const languages = parseLanguages(tourData.languages)
  const totalSlots = parseInt(tourData.totalSlots ?? tourData.maxGroupSize ?? "20") || 20
  const availableSlots = Math.min(parseInt(tourData.availableSlots ?? String(totalSlots)) || totalSlots, totalSlots)

  return prisma.$transaction(async (tx) => {
    const created = await tx.tour.create({
      data: {
        hostId,
        slug: tourData.slug,
        title: tourData.title,
        description: tourData.description,
        destination: tourData.destination,
        city: tourData.city || null,
        state: tourData.state || null,
        country: tourData.country || null,
        latitude: tourData.latitude ? parseFloat(tourData.latitude) : null,
        longitude: tourData.longitude ? parseFloat(tourData.longitude) : null,
        duration: parseInt(tourData.duration) || 1,
        maxGroupSize: parseInt(tourData.maxGroupSize) || 15,
        totalSlots,
        availableSlots,
        pricePerPerson: parseFloat(tourData.pricePerPerson) || 0,
        originalPrice: tourData.originalPrice ? parseFloat(tourData.originalPrice) : null,
        difficulty: (tourData.difficulty || "MODERATE") as TourDifficulty,
        category: tourData.category || null,
        images: (tourData.images ?? []),
        highlights: (tourData.highlights ?? []).filter(Boolean),
        included: (tourData.included ?? []).filter(Boolean),
        excluded: (tourData.excluded ?? []).filter(Boolean),
        languages,
        cancellationPolicy: tourData.cancellationPolicy || null,
        status: (tourData.status || "PENDING_REVIEW") as ListingStatus,
      },
    })

    for (const day of itinerary) {
      await tx.tourItineraryDay.create({
        data: {
          tourId: created.id,
          day: day.day,
          title: day.title || `Day ${day.day}`,
          description: day.description || "",
          activities: (day.activities || []).filter(Boolean),
          meals: (day.meals || []).filter(Boolean),
        },
      })
    }

    return created
  })
}

export async function updateTour(
  id: string,
  tourData: TourInput,
  itinerary: ItineraryDayInput[],
) {
  const languages = parseLanguages(tourData.languages)
  const totalSlots = parseInt(tourData.totalSlots ?? tourData.maxGroupSize ?? "20") || 20
  const availableSlots = Math.min(parseInt(tourData.availableSlots ?? String(totalSlots)) || totalSlots, totalSlots)

  return prisma.$transaction(async (tx) => {
    await tx.tour.update({
      where: { id },
      data: {
        slug: tourData.slug,
        title: tourData.title,
        description: tourData.description,
        destination: tourData.destination,
        city: tourData.city || null,
        state: tourData.state || null,
        country: tourData.country || null,
        latitude: tourData.latitude ? parseFloat(tourData.latitude) : null,
        longitude: tourData.longitude ? parseFloat(tourData.longitude) : null,
        duration: parseInt(tourData.duration) || 1,
        maxGroupSize: parseInt(tourData.maxGroupSize) || 15,
        totalSlots,
        availableSlots,
        pricePerPerson: parseFloat(tourData.pricePerPerson) || 0,
        originalPrice: tourData.originalPrice ? parseFloat(tourData.originalPrice) : null,
        difficulty: (tourData.difficulty || "MODERATE") as TourDifficulty,
        category: tourData.category || null,
        images: (tourData.images ?? []),
        highlights: (tourData.highlights ?? []).filter(Boolean),
        included: (tourData.included ?? []).filter(Boolean),
        excluded: (tourData.excluded ?? []).filter(Boolean),
        languages,
        cancellationPolicy: tourData.cancellationPolicy || null,
        status: (tourData.status || "PENDING_REVIEW") as ListingStatus,
      },
    })

    // Rebuild itinerary
    await tx.tourItineraryDay.deleteMany({ where: { tourId: id } })
    for (const day of itinerary) {
      await tx.tourItineraryDay.create({
        data: {
          tourId: id,
          day: day.day,
          title: day.title || `Day ${day.day}`,
          description: day.description || "",
          activities: (day.activities || []).filter(Boolean),
          meals: (day.meals || []).filter(Boolean),
        },
      })
    }
  })
}

export async function deleteTour(id: string) {
  return prisma.tour.delete({ where: { id } })
}
