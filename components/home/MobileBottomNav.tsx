"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BedDouble, Compass, House, Inbox, Trophy } from "lucide-react"

const tabs = [
  { label: "Explore", href: "/", icon: Compass },
  { label: "Contests", href: "/posts", icon: Trophy },
  { label: "Trips", href: "/my-bookings", icon: BedDouble },
  { label: "Inbox", href: "/tours", icon: Inbox },
  { label: "Host", href: "/host", icon: House },
]

export default function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl border-t border-slate-200 bg-white/95 px-2 pb-[max(env(safe-area-inset-bottom),8px)] pt-2 shadow-2xl backdrop-blur md:hidden">
      <div className="flex flex-nowrap items-stretch gap-1">
        {tabs.map((tab) => {
          const active = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href)
          return (
            <Link
              key={tab.label}
              href={tab.href}
              className="flex min-w-0 flex-1 flex-col items-center gap-1 rounded-2xl py-1.5 text-[10px] font-semibold"
            >
              <span className={`flex size-8 items-center justify-center rounded-full ${active ? "bg-[#5EEAD4] text-[#0F766E]" : "text-slate-500"}`}>
                <tab.icon className="size-4" />
              </span>
              <span className={active ? "text-[#0F766E]" : "text-slate-500"}>{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
