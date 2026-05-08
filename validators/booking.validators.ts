import { parseStayDate } from "@/services/availability.service"

function readJsonObject(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Request body must be a JSON object")
  }
  return value as Record<string, unknown>
}

function readString(body: Record<string, unknown>, key: string) {
  const value = body[key]
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`'${key}' is required`)
  }
  return value.trim()
}

function readOptionalString(body: Record<string, unknown>, key: string) {
  const value = body[key]
  return typeof value === "string" && value.trim() ? value.trim() : undefined
}

function readPositiveInt(body: Record<string, unknown>, key: string, fallback?: number) {
  const value = body[key]
  if (value === undefined && fallback !== undefined) return fallback
  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new Error(`'${key}' must be a positive integer`)
  }
  return parsed
}

function readNonNegativeInt(body: Record<string, unknown>, key: string, fallback = 0) {
  const value = body[key]
  if (value === undefined) return fallback
  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed < 0) {
    throw new Error(`'${key}' must be zero or a positive integer`)
  }
  return parsed
}

export type CreateHotelBookingInput = {
  hotelId: string
  roomId: string
  checkIn: Date
  checkOut: Date
  quantity: number
  adults: number
  children: number
  infants: number
  contactName: string
  contactEmail: string
  contactPhone: string
  specialRequests?: string
}

export async function parseCreateHotelBooking(request: Request): Promise<CreateHotelBookingInput> {
  const body = readJsonObject(await request.json())
  const checkIn = parseStayDate(readString(body, "checkIn"))
  const checkOut = parseStayDate(readString(body, "checkOut"))

  if (checkOut <= checkIn) {
    throw new Error("'checkOut' must be after 'checkIn'")
  }

  const contactEmail = readString(body, "contactEmail")
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
    throw new Error("'contactEmail' is not a valid email address")
  }

  return {
    hotelId: readString(body, "hotelId"),
    roomId: readString(body, "roomId"),
    checkIn,
    checkOut,
    quantity: readPositiveInt(body, "quantity", 1),
    adults: body.adults === undefined ? readPositiveInt(body, "guests", 1) : readPositiveInt(body, "adults"),
    children: readNonNegativeInt(body, "children"),
    infants: readNonNegativeInt(body, "infants"),
    contactName: readString(body, "contactName"),
    contactEmail,
    contactPhone: readString(body, "contactPhone"),
    specialRequests: readOptionalString(body, "specialRequests"),
  }
}
