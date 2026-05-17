"use client"

import { useEffect, useState } from "react"
import DesktopHome from "./DesktopHome"
import MobileHome from "./MobileHome"

export default function HomeShell() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null)

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)")
    const update = () => setIsMobile(query.matches)

    update()
    query.addEventListener("change", update)

    return () => query.removeEventListener("change", update)
  }, [])

  if (isMobile === null) {
    return <div className="min-h-screen bg-[#f4f7f8]" />
  }

  return isMobile ? <MobileHome /> : <DesktopHome />
}
