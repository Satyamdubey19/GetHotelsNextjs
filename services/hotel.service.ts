import { prisma } from "@/lib/prisma"
import type { RoomType, PropertyType, ListingStatus } from "@prisma/client"


export type HotelInput = {
  slug: string
  title: string
  description: string
  location: string
  address?: string
  city: string
  state?: string
  country?: string
  postalCode?: string
  latitude?: string
  longitude?: string
  propertyType?: string
  starRating?: string
  checkInTime?: string
  checkOutTime?: string
  phone?: string
  email?: string
  cancellationPolicy?: string
  petPolicy?: string
  childPolicy?: string
  status?: string
}

export type RoomInput = {
  name: string
  type?: string
  description?: string
  pricePerNight: string
  originalPrice?: string
  capacity?: string
  maxAdults?: string
  maxChildren?: string
  totalRooms?: string
  availableRooms?: string
  bedConfiguration?: string
  sizeSqFt?: string
  viewType?: string
  smokingAllowed?: boolean
  amenities?: string[]
  images?: string[]
  cancellationPolicy?: string
}


export async function getHostByUserId(userId: string) {
  return prisma.host.findUnique({ where: { userId } })
}


export async function listHotels(hostId: string) {
  return prisma.hotel.findMany({
    where: { hostId },
    include: {
      HotelImage: { orderBy: { sortOrder: "asc" } },
      Room: { where: { isActive: true } },
      HotelAmenity: { include: { Amenity: true } },
      _count: { select: { Booking: true, Review: true } },
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function getHotelById(id: string, hostId: string) {
  return prisma.hotel.findFirst({
    where: { id, hostId },
    include: {
      HotelImage: { orderBy: { sortOrder: "asc" } },
      HotelRule: true,
      Room: { where: { isActive: true } },
      HotelAmenity: { include: { Amenity: true } },
    },
  })
}

export type HotelWithRelations = NonNullable<Awaited<ReturnType<typeof getHotelById>>>

export function normalizeHotelForForm(hotel: HotelWithRelations) {
  return {
    ...hotel,
    latitude: hotel.latitude != null ? String(hotel.latitude) : "",
    longitude: hotel.longitude != null ? String(hotel.longitude) : "",
    starRating: hotel.starRating != null ? String(hotel.starRating) : "3",
    amenities: hotel.HotelAmenity.map((ha) => ha.Amenity.name),
    rules: hotel.HotelRule.map((hr) => hr.rule),
    images: hotel.HotelImage.map((hi) => hi.url),
    rooms: hotel.Room.map((room) => ({
      id: room.id,
      name: room.name,
      type: room.type,
      description: room.description ?? "",
      pricePerNight: String(room.pricePerNight),
      originalPrice: room.originalPrice != null ? String(room.originalPrice) : "",
      capacity: String(room.capacity),
      maxAdults: String(room.maxAdults),
      maxChildren: String(room.maxChildren),
      totalRooms: String(room.totalRooms),
      bedConfiguration: room.bedConfiguration ?? "",
      sizeSqFt: room.sizeSqFt != null ? String(room.sizeSqFt) : "",
      viewType: room.viewType ?? "",
      smokingAllowed: room.smokingAllowed,
      amenities: room.amenities,
      images: room.images,
      cancellationPolicy: room.cancellationPolicy ?? "",
    })),
  }
}

const HOTEL_TRANSACTION_OPTIONS = {
  maxWait: 10000,
  timeout: 20000,
}

function cleanStringList(values: string[], dedupe = false) {
  const cleaned = values.map((value) => value.trim()).filter(Boolean)
  return dedupe ? Array.from(new Set(cleaned)) : cleaned
}

function buildRoomRows(hotelId: string, rooms: RoomInput[]) {
  return rooms
    .filter((room) => room.name?.trim())
    .map((room) => {
      const totalRooms = parseInt(room.totalRooms ?? "1") || 1
      const availableRooms = Math.min(parseInt(room.availableRooms ?? String(totalRooms)) || totalRooms, totalRooms)

      return {
      hotelId,
      name: room.name.trim(),
      type: (room.type || "STANDARD") as RoomType,
      description: room.description || null,
      pricePerNight: parseFloat(room.pricePerNight) || 0,
      originalPrice: room.originalPrice ? parseFloat(room.originalPrice) : null,
      capacity: parseInt(room.capacity ?? "2") || 2,
      maxAdults: parseInt(room.maxAdults ?? "2") || 2,
      maxChildren: parseInt(room.maxChildren ?? "1") || 1,
      totalRooms,
      availableRooms,
      bedConfiguration: room.bedConfiguration || null,
      sizeSqFt: room.sizeSqFt ? parseInt(room.sizeSqFt) : null,
      viewType: room.viewType || null,
      smokingAllowed: Boolean(room.smokingAllowed),
      amenities: room.amenities || [],
      images: room.images || [],
      cancellationPolicy: room.cancellationPolicy || null,
      }
    })
}

async function syncHotelDetails(
  tx: Omit<typeof prisma, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">,
  hotelId: string,
  amenities: string[],
  rules: string[],
  images: string[],
  rooms: RoomInput[],
) {
  const cleanedAmenities = cleanStringList(amenities, true)
  const cleanedRules = cleanStringList(rules)
  const cleanedImages = cleanStringList(images)
  const roomRows = buildRoomRows(hotelId, rooms)

  if (cleanedAmenities.length > 0) {
    await tx.amenity.createMany({
      data: cleanedAmenities.map((name) => ({ name })),
      skipDuplicates: true,
    })

    const amenityRows = await tx.amenity.findMany({
      where: { name: { in: cleanedAmenities } },
      select: { id: true },
    })

    if (amenityRows.length > 0) {
      await tx.hotelAmenity.createMany({
        data: amenityRows.map((amenity) => ({ hotelId, amenityId: amenity.id })),
        skipDuplicates: true,
      })
    }
  }

  if (cleanedRules.length > 0) {
    await tx.hotelRule.createMany({
      data: cleanedRules.map((rule) => ({ hotelId, rule })),
    })
  }

  if (cleanedImages.length > 0) {
    await tx.hotelImage.createMany({
      data: cleanedImages.map((url, sortOrder) => ({
        hotelId,
        url,
        sortOrder,
        isCover: sortOrder === 0,
      })),
    })
  }

  if (roomRows.length > 0) {
    await tx.room.createMany({ data: roomRows })
  }
}



export async function createHotel(
  hostId: string,
  hotelData: HotelInput,
  amenities: string[],
  rules: string[],
  images: string[],
  rooms: RoomInput[],
) {
  return prisma.$transaction(async (tx) => {
    const submittedAt = new Date()
    const created = await tx.hotel.create({
      data: {
        hostId,
        slug: hotelData.slug,
        title: hotelData.title,
        description: hotelData.description,
        location: hotelData.location,
        address: hotelData.address || null,
        city: hotelData.city,
        state: hotelData.state || null,
        country: hotelData.country || "India",
        postalCode: hotelData.postalCode || null,
        latitude: hotelData.latitude ? parseFloat(hotelData.latitude) : null,
        longitude: hotelData.longitude ? parseFloat(hotelData.longitude) : null,
        propertyType: (hotelData.propertyType || "HOTEL") as PropertyType,
        starRating: hotelData.starRating ? parseInt(hotelData.starRating) : null,
        checkInTime: hotelData.checkInTime || "14:00",
        checkOutTime: hotelData.checkOutTime || "11:00",
        phone: hotelData.phone || null,
        email: hotelData.email || null,
        cancellationPolicy: hotelData.cancellationPolicy || null,
        petPolicy: hotelData.petPolicy || null,
        childPolicy: hotelData.childPolicy || null,
        status: "PENDING_REVIEW" as ListingStatus,
        isApproved: false,
        isActive: true,
        submittedForReviewAt: submittedAt,
        approvedAt: null,
        rejectedAt: null,
        reviewedAt: null,
        reviewedById: null,
        rejectionReason: null,
        moderationNotes: null,
      },
    })

    await syncHotelDetails(tx, created.id, amenities, rules, images, rooms)

    return created
  }, HOTEL_TRANSACTION_OPTIONS)
}

export async function updateHotel(
  id: string,
  hotelData: HotelInput,
  amenities: string[],
  rules: string[],
  images: string[],
  rooms: RoomInput[],
) {
  return prisma.$transaction(async (tx) => {
    const submittedAt = new Date()
    await tx.hotel.update({
      where: { id },
      data: {
        slug: hotelData.slug,
        title: hotelData.title,
        description: hotelData.description,
        location: hotelData.location,
        address: hotelData.address || null,
        city: hotelData.city,
        state: hotelData.state || null,
        country: hotelData.country || "India",
        postalCode: hotelData.postalCode || null,
        latitude: hotelData.latitude ? parseFloat(hotelData.latitude) : null,
        longitude: hotelData.longitude ? parseFloat(hotelData.longitude) : null,
        propertyType: (hotelData.propertyType || "HOTEL") as unknown as PropertyType,
        starRating: hotelData.starRating ? parseInt(hotelData.starRating) : null,
        checkInTime: hotelData.checkInTime || "14:00",
        checkOutTime: hotelData.checkOutTime || "11:00",
        phone: hotelData.phone || null,
        email: hotelData.email || null,
        cancellationPolicy: hotelData.cancellationPolicy || null,
        petPolicy: hotelData.petPolicy || null,
        childPolicy: hotelData.childPolicy || null,
        status: "PENDING_REVIEW" as ListingStatus,
        isApproved: false,
        isActive: true,
        submittedForReviewAt: submittedAt,
        approvedAt: null,
        rejectedAt: null,
        reviewedAt: null,
        reviewedById: null,
        rejectionReason: null,
        moderationNotes: null,
      },
    })

    await tx.hotelAmenity.deleteMany({ where: { hotelId: id } })
    await tx.hotelRule.deleteMany({ where: { hotelId: id } })
    await tx.hotelImage.deleteMany({ where: { hotelId: id } })
    await tx.room.deleteMany({ where: { hotelId: id } })

    await syncHotelDetails(tx, id, amenities, rules, images, rooms)
  }, HOTEL_TRANSACTION_OPTIONS)
}

export async function deleteHotel(id: string) {
  return prisma.hotel.delete({ where: { id } })
}


const PUBLIC_HOTEL_INCLUDE = {
  HotelImage: { orderBy: { sortOrder: "asc" } as const },
  HotelAmenity: { include: { Amenity: true } },
  HotelRule: true,
  Room: { where: { isActive: true } },
  Review: {
    select: {
      id: true,
      rating: true,
      comment: true,
      createdAt: true,
      User: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" as const },
    take: 10,
  },
  _count: { select: { Booking: true, Review: true } },
}

type HotelTransaction = Omit<typeof prisma, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">

export type HotelDateRange = {
  checkIn?: string | null
  checkOut?: string | null
}

function parseStayDate(value: string) {
  // Parse date-only form values at UTC midnight to avoid local timezone drift.
  const date = new Date(`${value}T00:00:00.000Z`)
  if (Number.isNaN(date.getTime())) throw new Error("Invalid stay date")
  return date
}

function enumerateStayDates(checkIn: Date, checkOut: Date) {
  // Build one date per booked night, excluding the checkout date.
  const dates: Date[] = []
  const cursor = new Date(checkIn)
  while (cursor < checkOut) {
    dates.push(new Date(cursor))
    cursor.setUTCDate(cursor.getUTCDate() + 1)
  }
  return dates
}

function normalizeAvailabilityRange(range?: HotelDateRange) {
  if (!range?.checkIn || !range?.checkOut) return null
  const checkIn = parseStayDate(range.checkIn)
  const checkOut = parseStayDate(range.checkOut)
  if (checkOut <= checkIn) return null
  return { checkIn, checkOut, stayDates: enumerateStayDates(checkIn, checkOut) }
}

export async function getRoomAvailabilityByDate(
  db: HotelTransaction,
  roomIds: string[],
  range?: HotelDateRange,
) {
  console.log("Calculating room availability for rooms", roomIds, "and date range", range);
  // Compare room totals, date overrides, and overlapping bookings to find the minimum available count.
  const normalized = normalizeAvailabilityRange(range)
  if (!normalized || roomIds.length === 0) return new Map<string, number>()

  const rooms = await db.room.findMany({
    where: { id: { in: roomIds }, isActive: true },
    select: { id: true, totalRooms: true },
  })
  const totals = new Map(rooms.map((room) => [room.id, room.totalRooms]))

  const [bookedRooms, overrides] = await Promise.all([
    db.bookingRoom.findMany({
      where: {
        roomId: { in: roomIds },
        checkIn: { lt: normalized.checkOut },
        checkOut: { gt: normalized.checkIn },
        Booking: { status: { in: ["PENDING", "CONFIRMED"] } },
      },
      select: { roomId: true, quantity: true, checkIn: true, checkOut: true },
    }),
    db.roomAvailability.findMany({
      where: {
        roomId: { in: roomIds },
        date: { gte: normalized.checkIn, lt: normalized.checkOut },
      },
      select: { roomId: true, date: true, availableCount: true },
    }),
  ])

  const overrideByRoomDate = new Map<string, number>()
  for (const override of overrides) {
    overrideByRoomDate.set(`${override.roomId}:${override.date.toISOString().slice(0, 10)}`, override.availableCount)
  }

  const availability = new Map<string, number>()
  for (const roomId of roomIds) {
    let minAvailable = totals.get(roomId) ?? 0

    for (const date of normalized.stayDates) {
      const dateKey = date.toISOString().slice(0, 10)
      const base = overrideByRoomDate.get(`${roomId}:${dateKey}`) ?? totals.get(roomId) ?? 0
      const booked = bookedRooms
        .filter((booking) => booking.roomId === roomId && booking.checkIn <= date && booking.checkOut > date)
        .reduce((sum, booking) => sum + booking.quantity, 0)
      minAvailable = Math.min(minAvailable, Math.max(0, base - booked))
    }

    availability.set(roomId, minAvailable)
  }

  return availability
}

async function withRoomAvailability<T extends { Room?: { id: string }[] }>(hotel: T | null, range?: HotelDateRange) {
  // Attach date-specific availability only when the caller supplied a valid stay range.
  if (!hotel?.Room?.length) return hotel
  const availability = await getRoomAvailabilityByDate(prisma, hotel.Room.map((room) => room.id), range)
  if (availability.size === 0) return hotel

  return {
    ...hotel,
    Room: hotel.Room.map((room) => ({
      ...room,
      dateAvailableRooms: availability.get(room.id) ?? 0,
      isAvailableForDates: (availability.get(room.id) ?? 0) > 0,
    })),
  }
}

const PUBLIC_WHERE = {
  isActive: true,
  isApproved: true,
  status: "ACTIVE" as ListingStatus,
  deletedAt: null,
}

export async function getAllHotels() {
  try{
  return prisma.hotel.findMany({
    where: PUBLIC_WHERE,
    include: PUBLIC_HOTEL_INCLUDE,
    orderBy: { averageRating: "desc" },
  })
} catch (error) {
    console.error("Error fetching hotels:", error)
    throw error;
}
}

export async function getPublicHotelById(id: string, range?: HotelDateRange) {
  const hotel = await prisma.hotel.findFirst({
    where: { id, ...PUBLIC_WHERE },
    include: PUBLIC_HOTEL_INCLUDE,
  })
  return withRoomAvailability(hotel, range)
}

export async function getPublicHotelBySlug(slug: string, range?: HotelDateRange) {
  const hotel = await prisma.hotel.findFirst({
    where: { slug, ...PUBLIC_WHERE },
    include: PUBLIC_HOTEL_INCLUDE,
  })
  return withRoomAvailability(hotel, range)
}

export async function getHotelsByLocation(city: string) {
  return prisma.hotel.findMany({
    where: {
      ...PUBLIC_WHERE,
      city: { contains: city, mode: "insensitive" },
    },
    include: PUBLIC_HOTEL_INCLUDE,
    orderBy: { averageRating: "desc" },
  })
}

export async function searchHotels(query: string) {
  const term = query.trim()
  if (!term) return getAllHotels()

  return prisma.hotel.findMany({
    where: {
      ...PUBLIC_WHERE,
      OR: [
        { title: { contains: term, mode: "insensitive" } },
        { location: { contains: term, mode: "insensitive" } },
        { city: { contains: term, mode: "insensitive" } },
        { state: { contains: term, mode: "insensitive" } },
        { country: { contains: term, mode: "insensitive" } },
        { description: { contains: term, mode: "insensitive" } },
      ],
    },
    include: PUBLIC_HOTEL_INCLUDE,
    orderBy: { averageRating: "desc" },
  })
}

export async function getRandomHotels(count = 6, city?: string | null) {
  const where = city
    ? {
        ...PUBLIC_WHERE,
        city: { contains: city, mode: "insensitive" as const },
      }
    : PUBLIC_WHERE

  const total = await prisma.hotel.count({ where })
  const skip = total > count ? Math.floor(Math.random() * (total - count)) : 0
  return prisma.hotel.findMany({
    where,
    include: PUBLIC_HOTEL_INCLUDE,
    skip,
    take: count,
  })
}

