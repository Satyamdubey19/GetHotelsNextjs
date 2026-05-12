import { NextRequest } from "next/server"
import {
  getAllHotelsController,
  getHotelsByLocationController,
  getRandomHotelsController,
  searchHotelsController,
} from "@/controllers/hotel.controller"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  if (searchParams.has("random")) return getRandomHotelsController(req)
  if (searchParams.has("city")) return getHotelsByLocationController(req)
  if (searchParams.has("q")) return searchHotelsController(req)

  return getAllHotelsController()
}
