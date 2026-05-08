import { verifyEmail } from "@/controllers/auth.controller";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return verifyEmail(request);
}
