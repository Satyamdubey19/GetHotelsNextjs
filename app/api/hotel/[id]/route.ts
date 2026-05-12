import { NextRequest } from "next/server"
import { getHotelByIdController } from "@/controllers/hotel.controller"
import type { IdRouteParams as Params } from "@/types/routes"

export async function GET(req: NextRequest, { params }: Params) {
  const { id } = await params
  return getHotelByIdController(req, id)
}
