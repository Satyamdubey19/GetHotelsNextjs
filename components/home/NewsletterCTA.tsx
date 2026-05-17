"use client"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"

export default function NewsletterCTA() {
  return (
    <footer className="rounded-t-[40px] bg-[#0F172A] px-4 pb-24 pt-9 text-white">
      <div>
        <h2 className="text-lg font-black">GetHotels</h2>
        <p className="mt-2 max-w-xs text-xs leading-5 text-slate-400">
          Discover the world&apos;s most luxurious stays with our curated marketplace.
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.06] p-4">
        <p className="text-sm font-black">Stay Updated</p>
        <p className="mt-1 text-[11px] text-slate-400">Join 50,000+ travelers for exclusive deals.</p>
        <div className="mt-3 space-y-3">
          <Input
            type="email"
            placeholder="Email Address"
            className="h-11 rounded-xl border-white/10 bg-white/10 text-sm text-white placeholder:text-slate-400"
          />
          <Button className="h-11 w-full rounded-xl bg-[#0F766E] text-xs font-black text-white hover:bg-[#0b655f]">
            Subscribe
          </Button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-8 text-xs">
        <div>
          <p className="font-black text-white">Company</p>
          <div className="mt-3 space-y-2 text-slate-400">
            <p>About Us</p>
            <p>Careers</p>
            <p>Blog</p>
          </div>
        </div>
        <div>
          <p className="font-black text-white">Support</p>
          <div className="mt-3 space-y-2 text-slate-400">
            <p>Help Center</p>
            <p>Privacy Policy</p>
            <p>Terms</p>
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-white/10 pt-5">
        <div className="flex justify-center gap-4 text-slate-400">
          <span className="size-4 rounded-full border border-slate-500" />
          <span className="size-4 rounded-full border border-slate-500" />
          <span className="size-4 rounded-full border border-slate-500" />
        </div>
        <p className="mt-4 text-center text-[10px] text-slate-500">© 2024 GetHotels. All rights reserved.</p>
      </div>

    </footer>
  )
}
