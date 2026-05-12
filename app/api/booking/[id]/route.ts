import { NextRequest } from "next/server"
import {
  cancelBookingController,
  getBookingByIdController,
} from "@/controllers/booking.controller"
import type { IdRouteParams as Params } from "@/types/routes"

export async function GET(req: NextRequest, { params }: Params) {
  return getBookingByIdController(req, (await params).id)
}

export async function PATCH(req: NextRequest, { params }: Params) {
  return cancelBookingController(req, (await params).id)
}

export async function DELETE(req: NextRequest, { params }: Params) {
  return cancelBookingController(req, (await params).id)
}
