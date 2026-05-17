import { NextRequest } from "next/server"
import { joinWaitlistController } from "@/controllers/tour-operations.controller"
import type { IdRouteParams as Params } from "@/types/routes"

export async function POST(req: NextRequest, { params }: Params) {
  return joinWaitlistController(req, (await params).id)
}
