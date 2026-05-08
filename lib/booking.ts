export type BookingStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'COMPLETED'
  | 'CHECKED_IN'
  | 'CHECKED_OUT'
  | 'NO_SHOW'

export interface BookingRoom {
  quantity: number
  Room: {
    name: string
    pricePerNight: number | null
  } | null
}

export interface BookingRecord {
  id: string
  bookingCode: string
  status: BookingStatus
  checkIn: string
  checkOut: string
  totalAmount: number
  createdAt: string
  Hotel: {
    id: string
    title: string
    city: string | null
  } | null
  BookingRoom: BookingRoom[]
  Payment: { status: string }[]
}

export async function fetchUserBookings(): Promise<BookingRecord[]> {
  // Profile pages use this helper to load the signed-in user's bookings.
  const res = await fetch('/api/booking', { credentials: 'include' })
  if (!res.ok) throw new Error('Failed to fetch bookings')
  const data = await res.json()
  return Array.isArray(data.data) ? data.data : []
}

export async function fetchBookingById(id: string): Promise<BookingRecord> {
  // Keep booking detail fetch logic in one place for client components.
  const res = await fetch(`/api/booking/${id}`, { credentials: 'include' })
  if (!res.ok) throw new Error('Failed to fetch booking')
  const data = await res.json()
  return data.data
}

export async function cancelUserBooking(id: string, reason?: string): Promise<void> {
  // Cancelling is sent as a status update because the API owns the booking rules.
  const res = await fetch(`/api/booking/${id}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'CANCELLED', cancellationReason: reason }),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error((data as { error?: string }).error ?? 'Failed to cancel booking')
  }
}
