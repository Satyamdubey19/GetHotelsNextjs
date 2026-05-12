import { cookies } from "next/headers"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import { getUserFromSessionToken } from "@/services/auth.service"
import {
  cancelHotelBooking,
  createHotelBooking,
  getBookingById,
  listBookingsForUser,
} from "@/services/booking.service"
import { parseCreateHotelBooking } from "@/validators/booking.validators"

async function getAuthenticatedUserId() {
  const token = (await cookies()).get("token")?.value
  if (token) {
    const user = await getUserFromSessionToken(token)
    if (user?.id) return String(user.id)
  }

  const session = await getServerSession(authOptions)
  return session?.user?.id ? String(session.user.id) : null
}

function errorStatus(message: string) {
  if (message.includes("not available") || message.includes("closed") || message.includes("exceeds") || message.includes("Missing")) {
    return 409
  }
  if (message.includes("not found")) return 404
  return 400
}

export async function listUserBookingsController(_request: NextRequest) {
  void _request
  try {
    const userId = await getAuthenticatedUserId()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const bookings = await listBookingsForUser(userId)
    return NextResponse.json({ success: true, data: bookings })
  } catch (error) {
    console.error("GET /api/booking:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function createHotelBookingController(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const input = await parseCreateHotelBooking(request)
    const booking = await createHotelBooking(userId, input)
    return NextResponse.json({ success: true, data: booking }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not create booking"
    console.error("POST /api/booking:", error)
    return NextResponse.json({ error: message }, { status: errorStatus(message) })
  }
}

export async function getBookingByIdController(_request: NextRequest, id: string) {
  void _request
  try {
    const userId = await getAuthenticatedUserId()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const booking = await getBookingById(id)
    if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    if (booking.userId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    return NextResponse.json({ success: true, data: booking })
  } catch (error) {
    console.error(`GET /api/booking/${id}:`, error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function cancelBookingController(request: NextRequest, id: string) {
  try {
    const userId = await getAuthenticatedUserId()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json().catch(() => ({})) as { cancellationReason?: string; reason?: string }
    const booking = await cancelHotelBooking(userId, id, body.cancellationReason ?? body.reason)
    return NextResponse.json({ success: true, data: booking })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not cancel booking"
    console.error(`PATCH/DELETE /api/booking/${id}:`, error)
    return NextResponse.json({ error: message }, { status: errorStatus(message) })
  }
}
