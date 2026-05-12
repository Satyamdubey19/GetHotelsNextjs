import { NextRequest } from "next/server"
import { createHostHotel, getHostHotels } from "@/controllers/hotel.controller"

export async function GET() {
  return getHostHotels()
}

export async function POST(req: NextRequest) {
  return createHostHotel(req)
}
