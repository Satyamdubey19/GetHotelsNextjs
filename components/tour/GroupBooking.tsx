'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Tour } from '@/lib/tours'
import { AlertCircle, ArrowRight, CheckCircle2, CreditCard, Loader2, Lock, Mail, Phone, ShieldCheck, Users, X } from 'lucide-react'

type GroupBookingProps = {
  tour: Tour
  approvalRequired: boolean
  onClose: () => void
}

type SuccessState = {
  kind: 'request' | 'booking'
  title: string
  body: string
  reference: string
  details: string
}

type RazorpayCheckoutResponse = {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

type RazorpayCheckoutOptions = {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  prefill?: {
    name?: string
    email?: string
    contact?: string
  }
  notes?: Record<string, string>
  theme?: { color?: string }
  modal?: { ondismiss?: () => void }
  handler: (response: RazorpayCheckoutResponse) => void | Promise<void>
}

type RazorpayInstance = {
  open: () => void
}

type RazorpayConstructor = new (options: RazorpayCheckoutOptions) => RazorpayInstance

const TAX_RATE = 0.12
let razorpayScriptPromise: Promise<boolean> | null = null

function parseGroupSize(value: string) {
  const numbers = value.match(/\d+/g)?.map(Number) ?? []
  const total = numbers[numbers.length - 1] ?? 1
  const available = numbers.length > 1 ? numbers[0] : total
  return { total: Math.max(1, total), available: Math.max(1, available) }
}

function formatMoney(value: number) {
  return `INR ${value.toLocaleString('en-IN')}`
}

function loadRazorpayScript() {
  if (typeof window === 'undefined') return Promise.resolve(false)

  const existingWindow = window as Window & { Razorpay?: RazorpayConstructor }
  if (existingWindow.Razorpay) return Promise.resolve(true)

  if (!razorpayScriptPromise) {
    razorpayScriptPromise = new Promise((resolve) => {
      const existingScript = document.querySelector<HTMLScriptElement>('script[src="https://checkout.razorpay.com/v1/checkout.js"]')
      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(true), { once: true })
        existingScript.addEventListener('error', () => resolve(false), { once: true })
        return
      }

      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.async = true
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.head.appendChild(script)
    })
  }

  return razorpayScriptPromise
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  })

  const payload = await response.json().catch(() => ({})) as { error?: string }
  if (!response.ok) {
    throw new Error(payload.error ?? 'Request failed')
  }

  return payload as T
}

export const GroupBooking = ({ tour, approvalRequired, onClose }: GroupBookingProps) => {
  const { user, isAuthenticated } = useAuth()
  const tourRef = tour.slug || tour.id
  const slotInfo = useMemo(() => parseGroupSize(tour.groupSize), [tour.groupSize])
  const maxGuests = tour.availableSlots ?? slotInfo.available
  const hasCapacity = (tour.availableSlots ?? slotInfo.available) > 0

  const [guestCount, setGuestCount] = useState(1)
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [specialRequests, setSpecialRequests] = useState('')
  const [introMessage, setIntroMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState<SuccessState | null>(null)

  useEffect(() => {
    if (user?.name) setContactName((current) => current || user.name)
    if (user?.email) setContactEmail((current) => current || user.email)
    if (user?.phone) setContactPhone((current) => current || user.phone)
  }, [user])

  useEffect(() => {
    setGuestCount((current) => Math.min(Math.max(current, 1), Math.max(maxGuests, 1)))
  }, [maxGuests])

  const pricing = useMemo(() => {
    const subtotal = tour.price * guestCount
    const taxes = Math.round(subtotal * TAX_RATE)
    const total = subtotal + taxes
    return { subtotal, taxes, total }
  }, [guestCount, tour.price])

  const joinLabel = approvalRequired ? 'Request to join' : 'Continue to payment'
  const noteLabel = approvalRequired ? 'Why do you want to join?' : 'Special requests'

  const submitForm = async () => {
    setError('')

    if (!isAuthenticated) {
      setError('Please sign in to join this tour.')
      return
    }

    if (!contactName.trim() || !contactEmail.trim() || !contactPhone.trim()) {
      setError('Please complete your contact details.')
      return
    }

    if (!hasCapacity) {
      setError('This departure is sold out.')
      return
    }

    setIsSubmitting(true)

    try {
      if (approvalRequired) {
        const response = await postJson<{ success: boolean; data: { id: string; status: string } }>(`/api/tour/${tourRef}/join-request`, {
          introduction: introMessage.trim() || `Interested in joining ${tour.title}.`,
        })

        setSuccess({
          kind: 'request',
          title: 'Join request sent',
          body: 'The host will review your request. Once approved, you can complete booking from your bookings area.',
          reference: response.data.id,
          details: `Request status: ${response.data.status}`,
        })
        return
      }

      const bookingResponse = await postJson<{ success: boolean; data: { id: string; bookingCode: string } }>(`/api/tour/${tourRef}/booking`, {
        guestCount,
        contactName: contactName.trim(),
        contactEmail: contactEmail.trim(),
        contactPhone: contactPhone.trim(),
        specialRequests: specialRequests.trim() || undefined,
      })

      const orderResponse = await postJson<{
        success: boolean
        data: {
          bookingId: string
          bookingCode: string
          orderId: string
          amount: number
          currency: string
          keyId: string
        }
      }>(`/api/tour/${tourRef}/payment/order`, {
        bookingId: bookingResponse.data.id,
      })

      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        throw new Error('Unable to load the payment gateway.')
      }

      const RazorpayCheckout = (window as Window & { Razorpay?: RazorpayConstructor }).Razorpay
      if (!RazorpayCheckout) {
        throw new Error('Payment gateway is unavailable.')
      }

      const checkout = new RazorpayCheckout({
        key: orderResponse.data.keyId,
        amount: orderResponse.data.amount,
        currency: orderResponse.data.currency,
        name: 'GetHotels',
        description: tour.title,
        order_id: orderResponse.data.orderId,
        prefill: {
          name: contactName.trim(),
          email: contactEmail.trim(),
          contact: contactPhone.trim(),
        },
        notes: {
          bookingId: orderResponse.data.bookingId,
          bookingCode: orderResponse.data.bookingCode,
          tourId: tour.id,
        },
        theme: { color: '#0f172a' },
        modal: {
          ondismiss: () => {
            setIsSubmitting(false)
          },
        },
        handler: async (payment) => {
          try {
            await postJson(`/api/tour/${tourRef}/payment/verify`, payment)
            setSuccess({
              kind: 'booking',
              title: 'Booking confirmed',
              body: 'Your seat is confirmed and the payment has been verified.',
              reference: orderResponse.data.bookingCode,
              details: `Booking ID: ${orderResponse.data.bookingId}`,
            })
          } catch (verificationError) {
            const message = verificationError instanceof Error ? verificationError.message : 'Payment verification failed.'
            setError(message)
          } finally {
            setIsSubmitting(false)
          }
        },
      })

      checkout.open()
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : 'Failed to submit booking.'
      setError(message)
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm" onClick={onClose}>
        <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                <CheckCircle2 className="h-4 w-4" />
                {success.kind === 'request' ? 'Request received' : 'Payment verified'}
              </div>
              <h2 className="mt-4 text-2xl font-black text-slate-950">{success.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{success.body}</p>
            </div>
            <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Reference</p>
            <p className="mt-2 break-all font-mono text-sm font-semibold text-slate-950">{success.reference}</p>
            <p className="mt-3 text-sm text-slate-600">{success.details}</p>
          </div>

          <button onClick={onClose} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-black text-white hover:bg-cyan-700">
            Done
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between border-b border-slate-100 p-6">
          <div>
            <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-black ${approvalRequired ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>
              {approvalRequired ? <Lock className="h-4 w-4" /> : <CreditCard className="h-4 w-4" />}
              {approvalRequired ? 'Approval required' : 'Instant booking'}
            </div>
            <h2 className="mt-4 text-2xl font-black text-slate-950">{approvalRequired ? 'Request to join tour' : 'Complete your booking'}</h2>
            <p className="mt-1 text-sm text-slate-500">{tour.title}</p>
          </div>
          <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[80vh] overflow-y-auto p-6">
          {!isAuthenticated ? (
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <AlertCircle className="h-6 w-6 text-amber-600" />
              <h3 className="mt-4 text-lg font-black text-slate-950">Sign in to continue</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">Your booking and join requests are tied to your account, so you need to log in first.</p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Link href={`/login?next=/tours/${tour.slug}`} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white hover:bg-cyan-700">
                  Go to login
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <button onClick={onClose} className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-black text-slate-700 hover:bg-slate-50">
                  Close
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Tour summary</p>
                    <h3 className="mt-2 text-xl font-black text-slate-950">{tour.title}</h3>
                    <p className="mt-1 text-sm text-slate-600">{tour.location.city}, {tour.location.country} · {tour.duration} days</p>
                  </div>
                  <img src={tour.gallery[0] ?? tour.image} alt={tour.title} className="h-16 w-20 rounded-2xl object-cover" />
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl bg-white p-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Guests</p>
                    <p className="mt-1 text-sm font-black text-slate-950">{guestCount}</p>
                  </div>
                  <div className="rounded-2xl bg-white p-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Availability</p>
                    <p className="mt-1 text-sm font-black text-slate-950">{Math.max(0, tour.availableSlots ?? slotInfo.available)} left</p>
                  </div>
                  <div className="rounded-2xl bg-white p-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Estimated total</p>
                    <p className="mt-1 text-sm font-black text-slate-950">{formatMoney(pricing.total)}</p>
                  </div>
                </div>
              </div>

              {!approvalRequired ? (
                <div className="flex items-center gap-3 rounded-2xl border border-cyan-100 bg-cyan-50 p-4 text-sm text-cyan-900">
                  <ShieldCheck className="h-5 w-5 shrink-0" />
                  Payment is verified online and your tour slot is confirmed immediately after checkout.
                </div>
              ) : (
                <div className="flex items-center gap-3 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-900">
                  <Lock className="h-5 w-5 shrink-0" />
                  This tour uses host approval. Your request will be sent first, and booking payment happens after approval.
                </div>
              )}

              {!approvalRequired ? (
                <div className="rounded-3xl border border-slate-200 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-[0.18em] text-slate-400">Travelers</h4>
                      <p className="mt-2 text-base font-black text-slate-950">How many people are joining?</p>
                    </div>
                    <div className="flex items-center gap-2 rounded-2xl bg-slate-50 p-1">
                      <button onClick={() => setGuestCount((current) => Math.max(1, current - 1))} disabled={guestCount <= 1 || isSubmitting} className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-700 shadow-sm disabled:cursor-not-allowed disabled:opacity-40">-</button>
                      <span className="min-w-10 px-2 text-center text-base font-black text-slate-950">{guestCount}</span>
                      <button onClick={() => setGuestCount((current) => Math.min(Math.max(maxGuests, 1), current + 1))} disabled={guestCount >= maxGuests || isSubmitting || !hasCapacity} className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-700 shadow-sm disabled:cursor-not-allowed disabled:opacity-40">+</button>
                    </div>
                  </div>
                  {!hasCapacity ? <p className="mt-3 text-sm font-semibold text-rose-600">This departure is sold out.</p> : null}
                </div>
              ) : null}

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-black text-slate-900">Full name</span>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input value={contactName} onChange={(event) => setContactName(event.target.value)} placeholder="Your full name" className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-900/10" />
                  </div>
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-black text-slate-900">Email</span>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input type="email" value={contactEmail} onChange={(event) => setContactEmail(event.target.value)} placeholder="you@example.com" className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-900/10" />
                  </div>
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-black text-slate-900">Phone number</span>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input value={contactPhone} onChange={(event) => setContactPhone(event.target.value)} placeholder="+91 98765 43210" className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-900/10" />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-black text-slate-900">{noteLabel}</span>
                <textarea value={approvalRequired ? introMessage : specialRequests} onChange={(event) => approvalRequired ? setIntroMessage(event.target.value) : setSpecialRequests(event.target.value)} rows={4} placeholder={approvalRequired ? 'Tell the host a little about your travel style and why you want to join.' : 'Airport pickup, dietary needs, accessibility notes, and other requests.'} className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-900/10" />
              </label>

              {!approvalRequired ? (
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>{formatMoney(tour.price)} x {guestCount}</span>
                    <span className="font-semibold text-slate-950">{formatMoney(pricing.subtotal)}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
                    <span>Taxes</span>
                    <span className="font-semibold text-slate-950">{formatMoney(pricing.taxes)}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3 text-base font-black text-slate-950">
                    <span>Total payable</span>
                    <span>{formatMoney(pricing.total)}</span>
                  </div>
                </div>
              ) : null}

              {error ? (
                <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              ) : null}

              <div className="flex flex-col gap-3 sm:flex-row">
                <button onClick={onClose} type="button" className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-black text-slate-700 hover:bg-slate-50">Cancel</button>
                <button onClick={submitForm} disabled={isSubmitting || !hasCapacity} className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60">
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {joinLabel}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
