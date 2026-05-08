"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  BookOpen,
  Building2,
  CalendarCheck,
  ChevronRight,
  Gift,
  Heart,
  HelpCircle,
  ImageIcon,
  LogOut,
  Menu,
  Settings,
  Sparkles,
  User,
  X,
} from "lucide-react"
import LocationDetector from "@/components/search/LocationDetector"
import { useWishlist } from "@/contexts/WishlistContext"
import { useAuth } from "@/contexts/AuthContext"

const navItems = [
  { label: "Tours", href: "/tours" },
  { label: "Contest", href: "/posts" },
  { label: "Car Rental", href: "/car-rental" },
  { label: "Activities", href: "/activities" },
]

const Header = () => {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuth()
  const [profileOpen, setProfileOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { wishlist } = useWishlist()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const initials = (user?.name || user?.email || "Guest")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  // Click-outside to close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    if (profileOpen) document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [profileOpen])

  const isActive = (href: string) => {
    if (href === "#") return false
    return pathname.startsWith(href)
  }

  const isHost = user?.role === "HOST" || user?.role === "ADMIN"

  const closeProfile = () => setProfileOpen(false)

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 shadow-sm backdrop-blur-xl">
      <div className="container flex items-center justify-between p-4">
        <Link href="/" className="flex items-center gap-4 transition hover:opacity-80">
          <div className="flex size-12 items-center justify-center rounded-full bg-[#081428] text-base font-bold text-white shadow-lg">
            GH
          </div>
          <div className="hidden items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-slate-600 transition hover:bg-slate-200 lg:flex">
            <LocationDetector />
          </div>
        </Link>

        <nav className="hidden gap-8 text-sm font-medium text-slate-600 md:flex">
          {navItems.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`relative rounded px-2 py-1 transition focus:outline-none focus:ring-2 focus:ring-[#081428] focus:ring-offset-2 ${
                  active ? "text-[#081428] font-semibold" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>{item.label}</span>
                <span
                  className={`absolute bottom-[-0.5rem] left-0 right-0 h-0.5 rounded-full transition-all duration-300 ${
                    active ? "bg-[#081428]" : "bg-transparent"
                  }`}
                />
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-xl p-2 transition hover:bg-slate-100 md:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="size-6 text-slate-700" /> : <Menu className="size-6 text-slate-700" />}
          </button>

          <div
            className="relative"
            ref={dropdownRef}
            onMouseEnter={() => setProfileOpen(true)}
            onMouseLeave={() => setProfileOpen(false)}
          >
            {/* Profile trigger button */}
            <button
              type="button"
              aria-expanded={profileOpen}
              aria-haspopup="true"
              aria-label={isAuthenticated ? "Open account menu" : "Open sign in menu"}
              onClick={() => setProfileOpen((v) => !v)}
              className={`group flex size-11 items-center justify-center rounded-full border bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#081428] focus:ring-offset-2 ${
                profileOpen ? "border-[#081428] ring-4 ring-[#081428]/10" : "border-slate-200"
              }`}
            >
              {isAuthenticated ? (
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#081428] text-[11px] font-black text-white shadow-inner ring-2 ring-[#081428]/20">
                  {initials}
                </span>
              ) : (
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 ring-2 ring-slate-50">
                  <User size={17} />
                </span>
              )}
            </button>

            {/* ── DROPDOWN PANEL ── */}
            <div className="absolute right-0 top-full h-3 w-full" />
            <div
              className={`absolute right-0 top-[calc(100%+12px)] z-[200] flex w-[260px] origin-top-right flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/70 transition-[opacity,transform] duration-200 ease-out ${
                profileOpen
                  ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
                  : "pointer-events-none -translate-y-1 scale-[0.97] opacity-0"
              }`}
            >
              {isAuthenticated ? (
                <>
                  {/* ── User card ── */}
                  <div className="flex-shrink-0 border-b border-slate-100 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-[11px] font-black text-white">
                        {initials}
                        <span className="absolute -bottom-0.5 -right-0.5 flex size-3 items-center justify-center rounded-full bg-emerald-400 ring-2 ring-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-bold text-slate-900">{user?.name || "Traveler"}</p>
                        <p className="truncate text-[11px] text-slate-400">{user?.email}</p>
                      </div>
                      <span className="shrink-0 rounded-md border border-slate-200 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">
                        {isHost ? "Host" : "Free"}
                      </span>
                    </div>
                  </div>

                  {/* ── Scrollable menu ── */}
                  <div className="max-h-[280px] overflow-y-auto overscroll-contain px-2 py-1.5 [scrollbar-width:thin]">
                    {/* Account group */}
                    <p className="px-2 pb-0.5 pt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">Account</p>
                    {[
                      { label: "My Profile", href: "/profile", icon: User },
                      { label: "My Bookings", href: "/profile", icon: CalendarCheck },
                      { label: "Wishlist", href: "/wishlist", icon: Heart, badge: wishlist.length },
                      { label: "Travel Posts", href: "/posts", icon: ImageIcon },
                    ].map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={closeProfile}
                        className="group flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition hover:bg-slate-50"
                      >
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition group-hover:bg-slate-200">
                          <item.icon size={14} strokeWidth={2} />
                        </span>
                        <span className="flex-1 text-[13px] font-medium text-slate-700 group-hover:text-slate-900">{item.label}</span>
                        {item.badge && item.badge > 0 ? (
                          <span className="rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold text-white">{item.badge}</span>
                        ) : (
                          <ChevronRight size={13} className="text-slate-300 opacity-0 group-hover:opacity-100" />
                        )}
                      </Link>
                    ))}

                    {/* Property group */}
                    <p className="px-2 pb-0.5 pt-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Property</p>
                    <Link href="/host" onClick={closeProfile} className="group flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition hover:bg-slate-50">
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition group-hover:bg-slate-200">
                        <Building2 size={14} strokeWidth={2} />
                      </span>
                      <span className="flex-1 text-[13px] font-medium text-slate-700 group-hover:text-slate-900">
                        {isHost ? "Host Dashboard" : "Become a Host"}
                      </span>
                      {!isHost && <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">Earn</span>}
                      <ChevronRight size={13} className="text-slate-300 opacity-0 group-hover:opacity-100" />
                    </Link>
                    <Link href="/profile" onClick={closeProfile} className="group flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition hover:bg-slate-50">
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition group-hover:bg-slate-200">
                        <Gift size={14} strokeWidth={2} />
                      </span>
                      <span className="flex-1 text-[13px] font-medium text-slate-700 group-hover:text-slate-900">Rewards & Referrals</span>
                      <ChevronRight size={13} className="text-slate-300 opacity-0 group-hover:opacity-100" />
                    </Link>

                    {/* More group */}
                    <p className="px-2 pb-0.5 pt-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">More</p>
                    {[
                      { label: "Settings", href: "/profile", icon: Settings },
                      { label: "Help & Support", href: "/terms", icon: HelpCircle },
                    ].map((item) => (
                      <Link key={item.label} href={item.href} onClick={closeProfile} className="group flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition hover:bg-slate-50">
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition group-hover:bg-slate-200">
                          <item.icon size={14} strokeWidth={2} />
                        </span>
                        <span className="flex-1 text-[13px] font-medium text-slate-700 group-hover:text-slate-900">{item.label}</span>
                        <ChevronRight size={13} className="text-slate-300 opacity-0 group-hover:opacity-100" />
                      </Link>
                    ))}
                  </div>

                  {/* ── Sign out ── */}
                  <div className="flex-shrink-0 border-t border-slate-100 px-2 py-1.5">
                    <button
                      type="button"
                      onClick={() => { logout(); closeProfile(); router.push("/login") }}
                      className="group flex w-full items-center gap-2.5 rounded-xl px-2 py-1.5 transition hover:bg-red-50"
                    >
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition group-hover:bg-red-100 group-hover:text-red-500">
                        <LogOut size={14} strokeWidth={2} />
                      </span>
                      <span className="text-[13px] font-medium text-slate-700 group-hover:text-red-600">Sign out</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* ── Guest ── */}
                  <div className="border-b border-slate-100 px-4 py-3">
                    <p className="text-[13px] font-bold text-slate-900">Welcome to GetHotels</p>
                    <p className="mt-0.5 text-[11px] text-slate-400">Sign in or create an account.</p>
                  </div>

                  <div className="px-2 py-1.5">
                    {/* Traveler */}
                    <p className="px-2 pb-0.5 pt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">Traveler</p>
                    <Link
                      href="/login"
                      onClick={closeProfile}
                      className="group flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition hover:bg-slate-50"
                    >
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition group-hover:bg-slate-200">
                        <User size={14} strokeWidth={2} />
                      </span>
                      <span className="text-[13px] font-medium text-slate-700 group-hover:text-slate-900">Sign In</span>
                    </Link>
                    <Link
                      href="/signup"
                      onClick={closeProfile}
                      className="group flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition hover:bg-slate-50"
                    >
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition group-hover:bg-slate-200">
                        <Sparkles size={14} strokeWidth={2} />
                      </span>
                      <span className="text-[13px] font-medium text-slate-700 group-hover:text-slate-900">Create Account</span>
                    </Link>

                    {/* Host */}
                    <p className="px-2 pb-0.5 pt-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Host</p>
                    <Link
                      href="/login?role=HOST"
                      onClick={closeProfile}
                      className="group flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition hover:bg-slate-50"
                    >
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition group-hover:bg-slate-200">
                        <Building2 size={14} strokeWidth={2} />
                      </span>
                      <span className="text-[13px] font-medium text-slate-700 group-hover:text-slate-900">Host Sign In</span>
                    </Link>
                    <Link
                      href="/host/signup"
                      onClick={closeProfile}
                      className="group flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition hover:bg-slate-50"
                    >
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition group-hover:bg-slate-200">
                        <BookOpen size={14} strokeWidth={2} />
                      </span>
                      <span className="text-[13px] font-medium text-slate-700 group-hover:text-slate-900">List Your Property</span>
                    </Link>

                    {wishlist.length > 0 && (
                      <>
                        <div className="mx-2 my-2 border-t border-slate-100" />
                        <Link
                          href="/wishlist"
                          onClick={closeProfile}
                          className="group flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition hover:bg-slate-50"
                        >
                          <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition group-hover:bg-slate-200">
                            <Heart size={14} strokeWidth={2} />
                          </span>
                          <span className="flex-1 text-[13px] font-medium text-slate-700 group-hover:text-slate-900">My Wishlist</span>
                          <span className="rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold text-white">{wishlist.length}</span>
                        </Link>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-slate-100 bg-white md:hidden">
          <nav className="container flex flex-col py-2">
            {navItems.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`border-l-2 px-4 py-3 text-sm font-medium transition ${
                    active
                      ? "border-[#081428] bg-[#081428]/5 text-[#081428] font-semibold"
                      : "border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header
