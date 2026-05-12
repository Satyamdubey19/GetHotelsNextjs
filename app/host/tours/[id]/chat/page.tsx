"use client"

import Link from "next/link"
import { ArrowLeft, Bell, ImageIcon, Megaphone, MicOff, MoreHorizontal, Paperclip, Pin, Send, Shield, Trash2, Users } from "lucide-react"

const messages = [
  { id: 1, name: "Host", type: "SYSTEM", text: "Welcome call scheduled for Friday at 7 PM.", time: "09:20" },
  { id: 2, name: "Aarohi", type: "TEXT", text: "Can we confirm the pickup point near Mall Road?", time: "09:34" },
  { id: 3, name: "Kabir", type: "TEXT", text: "Sharing my arrival time by evening.", time: "10:05" },
]

export default function TourChatPage() {
  return (
    <div className="min-h-screen bg-slate-50/70 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[300px_1fr_320px]">
        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <Link href="/host/tours" className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-cyan-700"><ArrowLeft className="h-4 w-4" />Back to tours</Link>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-700">Group chat</p>
          <h1 className="mt-2 text-2xl font-black text-slate-950">Tour community</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">Announcements, pinned messages, image sharing, and host moderation.</p>
          <div className="mt-6 space-y-3">
            {["Announcements", "Pinned messages", "Images", "System log"].map((item, index) => (
              <button key={item} className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-black ${index === 0 ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-700 hover:bg-slate-100"}`}>
                {item}
                {index === 0 ? <Bell className="h-4 w-4" /> : <MoreHorizontal className="h-4 w-4" />}
              </button>
            ))}
          </div>
        </aside>

        <main className="flex min-h-[78vh] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700"><Users className="h-5 w-5" /></div>
              <div>
                <p className="font-black text-slate-950">Manali community group</p>
                <p className="text-xs font-semibold text-slate-500">18 participants · 3 pending approvals</p>
              </div>
            </div>
            <button className="rounded-2xl bg-cyan-700 px-4 py-2 text-sm font-black text-white hover:bg-cyan-800"><Megaphone className="mr-2 inline h-4 w-4" />Announce</button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-5">
            <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-sm font-semibold text-cyan-900">
              <Pin className="mr-2 inline h-4 w-4" />Pinned: Carry original ID, warm layers, and arrive 20 minutes before pickup.
            </div>
            {messages.map((message) => (
              <div key={message.id} className={`max-w-[78%] rounded-2xl p-4 shadow-sm ${message.name === "Host" ? "bg-slate-950 text-white" : "bg-white text-slate-800"}`}>
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs font-black uppercase tracking-[0.16em] opacity-70">{message.name}</p>
                  <p className="text-xs opacity-60">{message.time}</p>
                </div>
                <p className="mt-2 text-sm font-medium leading-6">{message.text}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-200 p-4">
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2">
              <button className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100"><Paperclip className="h-4 w-4" /></button>
              <input placeholder="Write a message or announcement" className="flex-1 bg-transparent px-2 text-sm font-semibold outline-none" />
              <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white hover:bg-cyan-700"><Send className="h-4 w-4" /></button>
            </div>
          </div>
        </main>

        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Moderation controls</p>
          <div className="mt-4 space-y-3">
            {[
              { label: "Mute participant", icon: MicOff },
              { label: "Remove participant", icon: Trash2 },
              { label: "Pin message", icon: Pin },
              { label: "Share image", icon: ImageIcon },
              { label: "Safety notice", icon: Shield },
            ].map((action) => {
              const Icon = action.icon
              return (
              <button key={action.label} className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-700 hover:bg-slate-50">
                <Icon className="h-4 w-4 text-cyan-700" />
                {action.label}
              </button>
              )
            })}
          </div>
          <div className="mt-6 rounded-2xl bg-amber-50 p-4 text-sm font-semibold leading-6 text-amber-800">
            2 messages mention pickup changes. Review before publishing the next announcement.
          </div>
        </aside>
      </div>
    </div>
  )
}
