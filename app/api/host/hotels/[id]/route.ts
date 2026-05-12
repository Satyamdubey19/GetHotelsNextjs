import { NextRequest } from "next/server"
import {
  deleteHostHotel,
  getHostHotel,
  updateHostHotel,
} from "@/controllers/hotel.controller"
import type { IdRouteParams as Params } from "@/types/routes"

export async function GET(req: NextRequest, { params }: Params) {
  return getHostHotel(req, (await params).id)
}

export async function PUT(req: NextRequest, { params }: Params) {
  return updateHostHotel(req, (await params).id)
}

export async function DELETE(req: NextRequest, { params }: Params) {
  return deleteHostHotel(req, (await params).id)
}
