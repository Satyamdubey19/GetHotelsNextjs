"use client"

import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"

const supportLinks = [
  { label: "Help Center", href: "/profile" },
  { label: "Travel Safety", href: "/terms" },
  { label: "Cancellation Policy", href: "/terms" },
  { label: "Contact Concierge", href: "/profile" },
]

export default function HomeFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-950">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <p className="text-xl font-black">GetHotels</p>
          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-500">
            Redefining luxury travel through curated experiences and verified boutique stays across the globe.
          </p>
          <div className="mt-6 flex gap-3 text-slate-500">
            <Link href="/posts" className="flex size-9 items-center justify-center rounded-xl border border-slate-300 text-xs transition hover:bg-teal-700 hover:text-white">S</Link>
            <Link href="/posts" className="flex size-9 items-center justify-center rounded-xl border border-slate-300 text-xs transition hover:bg-teal-700 hover:text-white">I</Link>
            <Link href="/posts" className="flex size-9 items-center justify-center rounded-xl border border-slate-300 text-xs transition hover:bg-teal-700 hover:text-white">A</Link>
          </div>
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Discovery</p>
          <ul className="mt-5 space-y-4 text-sm">
            <li><Link href="/hotels" className="text-slate-500 transition hover:text-teal-700">Luxury Stays</Link></li>
            <li><Link href="/tours" className="text-slate-500 transition hover:text-teal-700">Boutique Tours</Link></li>
            <li><Link href="/posts" className="text-slate-500 transition hover:text-teal-700">Flight Bundles</Link></li>
            <li><Link href="/my-bookings" className="text-slate-500 transition hover:text-teal-700">Member Deals</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Assistance</p>
          <ul className="mt-5 space-y-4 text-sm">
            {supportLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="text-slate-500 transition hover:text-teal-700">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Insights</p>
          <p className="mt-5 text-sm leading-6 text-slate-500">
            Join our newsletter for exclusive travel guides and early-access deals.
          </p>
          <div className="mt-5 flex gap-2">
            <Input type="email" placeholder="Email address" className="h-11 rounded-xl border-slate-200 bg-white text-sm" />
            <Button className="h-11 rounded-xl bg-slate-950 px-5 text-xs font-black text-white hover:bg-teal-700">
              Join
            </Button>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 text-xs text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>(c) 2024 GetHotels International Ltd. All rights reserved.</p>
          <div className="flex gap-5">
            <span>English (US)</span>
            <span>USD</span>
            <Link href="/terms" className="transition hover:text-teal-700">Terms</Link>
            <Link href="/terms" className="transition hover:text-teal-700">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
