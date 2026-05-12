import { NextRequest } from "next/server"
import {
  createHotelBookingController,
  listUserBookingsController,
} from "@/controllers/booking.controller"

export async function GET(req: NextRequest) {
  return listUserBookingsController(req)
}

export async function POST(req: NextRequest) {
  return createHotelBookingController(req)
}
