import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getHostByUserId } from "@/services/hotel.service"
import {
  listTours,
  listPublicTours,
  getPublicTourBySlug,
  getTourById,
  normalizeTourForForm,
  createTour,
  updateTour,
  deleteTour,
} from "@/services/tour.service"

async function getCurrentHost() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) }

  const host = await getHostByUserId(session.user.id)
  if (!host) return { error: NextResponse.json({ error: "Not a host" }, { status: 403 }) }

  return { host }
}

export const getTours = async (req?: Request) => {
  try {
    const url = req ? new URL(req.url) : null
    const scope = url?.searchParams.get("scope")

    if (scope === "mine") {
      const { host, error } = await getCurrentHost()
      if (error) return error

      const tours = await listTours(host.id)
      return NextResponse.json({ data: tours })
    }

    const tours = await listPublicTours()
    return NextResponse.json({ data: tours })
  } catch (error) {
    console.error("GET /api/tour:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export const getTour = async (req: NextRequest, id: string) => {
  try {
    const url = new URL(req.url)
    const scope = url.searchParams.get("scope")

    if (scope === "mine") {
      const { host, error } = await getCurrentHost()
      if (error) return error

      const tour = await getTourById(id, host.id)
      if (!tour) return NextResponse.json({ error: "Tour not found" }, { status: 404 })

      return NextResponse.json({ data: normalizeTourForForm(tour) })
    }

    const tour = await getPublicTourBySlug(id)
    if (!tour) return NextResponse.json({ error: "Tour not found" }, { status: 404 })

    return NextResponse.json({ data: tour })
  } catch (error) {
    console.error("GET /api/tour/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export const createTourController = async (req: NextRequest) => {
  try {
    const { host, error } = await getCurrentHost()
    if (error) return error

    const body = await req.json()
    const { itinerary = [], ...tourData } = body

    const tour = await createTour(host.id, tourData, itinerary)
    return NextResponse.json({ data: tour }, { status: 201 })
  } catch (error: unknown) {
    console.error("POST /api/tour:", error)
    if ((error as { code?: string }).code === "P2002")
      return NextResponse.json({ error: "A tour with this slug already exists." }, { status: 409 })
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export const updateTourController = async (req: NextRequest, id: string) => {
  try {
    const { host, error } = await getCurrentHost()
    if (error) return error

    const existing = await getTourById(id, host.id)
    if (!existing) return NextResponse.json({ error: "Tour not found" }, { status: 404 })

    const body = await req.json()
    const { itinerary = [], ...tourData } = body

    await updateTour(id, tourData, itinerary)
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error("PUT /api/tour/[id]:", error)
    if ((error as { code?: string }).code === "P2002")
      return NextResponse.json({ error: "A tour with this slug already exists." }, { status: 409 })
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export const deleteTourController = async (_req: NextRequest, id: string) => {
  try {
    const { host, error } = await getCurrentHost()
    if (error) return error

    const existing = await getTourById(id, host.id)
    if (!existing) return NextResponse.json({ error: "Tour not found" }, { status: 404 })

    await deleteTour(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/tour/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export const getToursController = getTours
