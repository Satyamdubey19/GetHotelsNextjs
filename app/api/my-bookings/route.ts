import { NextRequest } from "next/server"
import { listMyBookingsController } from "@/controllers/my-bookings.controller"

export async function GET(req: NextRequest) {
  return listMyBookingsController(req)
}
