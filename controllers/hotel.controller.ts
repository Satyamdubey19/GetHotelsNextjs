import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { cookies } from "next/headers"
import { authOptions } from "@/lib/auth"
import { getUserFromSessionToken } from "@/services/auth.service"
import {
  getHostByUserId,
  listHotels,
  getHotelById,
  normalizeHotelForForm,
  createHotel,
  updateHotel,
  deleteHotel,
  getAllHotels,
  getPublicHotelById,
  getPublicHotelBySlug,
  getHotelsByLocation,
  getRandomHotels,
  searchHotels,
} from "@/services/hotel.service"

async function resolveHost(userId: string) {
  const host = await getHostByUserId(userId)
  return host
}

async function getAuthenticatedUserId() {
  const session = await getServerSession(authOptions)
  if (session?.user?.id) return String(session.user.id)

  const token = (await cookies()).get("token")?.value
  if (!token) return null

  const user = await getUserFromSessionToken(token)
  return user?.id ? String(user.id) : null
}

function normalizeImageUrls(images: unknown) {
  if (!Array.isArray(images)) return []

  return images
    .map((image) => {
      if (typeof image === "string") return image.trim()
      if (
        image &&
        typeof image === "object" &&
        "url" in image &&
        typeof image.url === "string"
      ) {
        return image.url.trim()
      }
      return ""
    })
    .filter(Boolean)
}

export const getHostHotels = async () => {
  try {
    const userId = await getAuthenticatedUserId()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const host = await resolveHost(userId)
    if (!host) return NextResponse.json({ error: "Not a host" }, { status: 403 })

    const hotels = await listHotels(host.id)
    return NextResponse.json({ data: hotels })
  } catch (error) {
    console.error("GET /api/host/hotels:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export const getHostHotel = async (_req: NextRequest, id: string) => {
  try {
    const userId = await getAuthenticatedUserId()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const host = await resolveHost(userId)
    if (!host) return NextResponse.json({ error: "Not a host" }, { status: 403 })

    const hotel = await getHotelById(id, host.id)
    if (!hotel) return NextResponse.json({ error: "Hotel not found" }, { status: 404 })

    return NextResponse.json({ data: normalizeHotelForForm(hotel) })
  } catch (error) {
    console.error("GET /api/host/hotels/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export const createHostHotel = async (req: NextRequest) => {
  try {
    const userId = await getAuthenticatedUserId()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const host = await resolveHost(userId)
    if (!host) return NextResponse.json({ error: "Not a host" }, { status: 403 })

    const body = await req.json()
    const { amenities = [], rules = [], images = [], rooms = [], ...hotelData } = body
    const uploadedImages = normalizeImageUrls(images)

    const hotel = await createHotel(host.id, hotelData, amenities, rules, uploadedImages, rooms)
    return NextResponse.json({ data: hotel }, { status: 201 })
  } catch (error: unknown) {
    console.error("POST /api/host/hotels:", error)
    if ((error as { code?: string }).code === "P2002")
      return NextResponse.json({ error: "A hotel with this slug already exists." }, { status: 409 })
    const message = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export const updateHostHotel = async (req: NextRequest, id: string) => {
  try {
    const userId = await getAuthenticatedUserId()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const host = await resolveHost(userId)
    if (!host) return NextResponse.json({ error: "Not a host" }, { status: 403 })

    const existing = await getHotelById(id, host.id)
    if (!existing) return NextResponse.json({ error: "Hotel not found" }, { status: 404 })

    const body = await req.json()
    const { amenities = [], rules = [], images = [], rooms = [], ...hotelData } = body
    const uploadedImages = normalizeImageUrls(images)

    await updateHotel(id, hotelData, amenities, rules, uploadedImages, rooms)
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error("PUT /api/host/hotels/[id]:", error)
    if ((error as { code?: string }).code === "P2002")
      return NextResponse.json({ error: "A hotel with this slug already exists." }, { status: 409 })
    const message = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export const deleteHostHotel = async (_req: NextRequest, id: string) => {
  try {
    const userId = await getAuthenticatedUserId()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const host = await resolveHost(userId)
    if (!host) return NextResponse.json({ error: "Not a host" }, { status: 403 })

    const existing = await getHotelById(id, host.id)
    if (!existing) return NextResponse.json({ error: "Hotel not found" }, { status: 404 })

    await deleteHotel(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/host/hotels/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


export const getAllHotelsController = async () => {
  try {
    const hotels = await getAllHotels()
    return NextResponse.json({ data: hotels })
  } catch (error) {
    console.error("GET /api/hotel:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export const getHotelByIdController = async (_req: NextRequest, id: string) => {
  try {
    if (!id) return NextResponse.json({ error: "Hotel ID is required" }, { status: 400 })

    const hotel = await getPublicHotelById(id, {
      checkIn: _req.nextUrl.searchParams.get("checkIn"),
      checkOut: _req.nextUrl.searchParams.get("checkOut"),
    })
    if (!hotel) return NextResponse.json({ error: "Hotel not found" }, { status: 404 })

    return NextResponse.json({ data: hotel })
  } catch (error) {
    console.error("GET /api/hotel/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export const getHotelBySlugController = async (_req: NextRequest, slug: string) => {
  try {
    if (!slug) return NextResponse.json({ error: "Hotel slug is required" }, { status: 400 })

    const hotel = await getPublicHotelBySlug(slug, {
      checkIn: _req.nextUrl.searchParams.get("checkIn"),
      checkOut: _req.nextUrl.searchParams.get("checkOut"),
    })
    if (!hotel) return NextResponse.json({ error: "Hotel not found" }, { status: 404 })

    return NextResponse.json({ data: hotel })
  } catch (error) {
    console.error("GET /api/hotel/[slug]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export const getHotelsByLocationController = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url)
    const city = searchParams.get("city")
    if (!city) return NextResponse.json({ error: "city query parameter is required" }, { status: 400 })

    const hotels = await getHotelsByLocation(city)
    return NextResponse.json({ data: hotels })
  } catch (error) {
    console.error("GET /api/hotel?city:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export const searchHotelsController = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get("q") ?? ""
    if (!query.trim()) return getAllHotelsController()

    const hotels = await searchHotels(query)
    return NextResponse.json({ data: hotels })
  } catch (error) {
    console.error("GET /api/hotel?q:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export const getRandomHotelsController = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url)
    const count = Math.min(parseInt(searchParams.get("random") ?? "6", 10) || 6, 20)
    const city = searchParams.get("city")
    const hotels = await getRandomHotels(count, city)
    return NextResponse.json({ data: hotels })
  } catch (error) {
    console.error("GET /api/hotel?random:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
