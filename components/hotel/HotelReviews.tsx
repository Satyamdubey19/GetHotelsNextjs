"use client"

import { useMemo, useState } from "react"
import type { FormEvent } from "react"
import type { HotelReview } from "@/lib/hotels"
import type { HotelReviewsProps } from "@/types/hotel-components"

const ratingLabels = ["Terrible", "Poor", "Okay", "Great", "Excellent"]

const HotelReviews = ({ initialReviews }: HotelReviewsProps) => {
  const [reviews, setReviews] = useState<HotelReview[]>(initialReviews)
  const [name, setName] = useState("")
  const [rating, setRating] = useState(5)
  const [text, setText] = useState("")

  const averageRating = useMemo(
    () => (reviews.reduce((sum, review) => sum + review.rating, 0) / Math.max(reviews.length, 1)).toFixed(1),
    [reviews]
  )

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!name.trim() || !text.trim()) return

    const newReview: HotelReview = {
      id: `${Date.now()}`,
      name: name.trim(),
      rating,
      text: text.trim(),
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    }

    setReviews([newReview, ...reviews])
    setName("")
    setRating(5)
    setText("")
  }

  return (
    <section className="space-y-6 rounded-[2rem] border border-blue-100 bg-white p-8 shadow-2xl shadow-slate-200">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-sky-600">Guest reviews</p>
          <h2 className="text-2xl font-semibold text-slate-950">What travelers are saying</h2>
        </div>
        <div className="rounded-3xl bg-blue-950 px-5 py-4 text-center text-white shadow-xl shadow-blue-950/20">
          <p className="text-xs uppercase tracking-[0.35em] text-blue-200">Average rating</p>
          <p className="mt-3 text-4xl font-semibold">{averageRating}</p>
          <p className="text-sm text-blue-200">based on {reviews.length} reviews</p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="rounded-[1.75rem] border border-blue-100 bg-slate-50 p-6 shadow-lg shadow-slate-200">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-slate-950">{review.name}</p>
                  <p className="text-sm text-slate-600">{review.date}</p>
                </div>
                <span className="rounded-3xl bg-blue-950 px-4 py-2 text-sm text-white">{review.rating} ★</span>
              </div>
              <p className="mt-4 text-slate-700">{review.text}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-[1.75rem] border border-blue-100 bg-slate-50 p-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-950" htmlFor="name">
              Your name
            </label>
            <input
              id="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              placeholder="Enter your first name"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-950" htmlFor="rating">
              Your rating
            </label>
            <select
              id="rating"
              value={rating}
              onChange={(event) => setRating(Number(event.target.value))}
              className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
            >
              {[5, 4, 3, 2, 1].map((value) => (
                <option key={value} value={value}>
                  {value} ★ — {ratingLabels[value - 1]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-950" htmlFor="review">
              Your review
            </label>
            <textarea
              id="review"
              value={text}
              onChange={(event) => setText(event.target.value)}
              rows={5}
              className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              placeholder="Write about your stay..."
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-3xl bg-sky-600 px-5 py-4 text-sm font-semibold text-white transition hover:bg-sky-500"
          >
            Submit review
          </button>
        </form>
      </div>
    </section>
  )
}

export default HotelReviews
